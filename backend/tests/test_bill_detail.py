from unittest.mock import AsyncMock, patch

import httpx
import pytest

from app.services.bill_detail import (
    fetch_federal_bill_stages,
    fetch_state_bill_stages,
    get_bill_detail,
)

# Real response shapes captured from api.congress.gov and api.legiscan.com
# during development (see the design doc for the live calls that produced these).
CONGRESS_ACTIONS_FIXTURE = {
    "actions": [
        {"actionDate": "2026-05-21", "type": "IntroReferral", "text": "Introduced in Senate"},
        {
            "actionDate": "2026-05-21",
            "type": "IntroReferral",
            "text": "Read twice and referred to the Committee on Banking, Housing, and Urban Affairs.",
        },
    ]
}

LEGISCAN_BILL_FIXTURE = {
    "status": "OK",
    "bill": {
        "bill_id": 1894268,
        "status": 6,
        "status_date": "2025-02-03",
        "state_link": "https://legiscan.com/CA/bill/ABX11/2025",
        "history": [
            {"date": "2024-12-02", "action": "Read first time. To print."},
            {"date": "2024-12-03", "action": "From printer."},
            {"date": "2025-01-09", "action": "Referred to Com. on BUDGET."},
        ],
    },
}


def _mock_response(json_body: dict) -> AsyncMock:
    response = AsyncMock()
    response.json = lambda: json_body
    response.raise_for_status = lambda: None
    return response


@pytest.mark.anyio
async def test_federal_stages_normalized_and_sorted():
    with patch("httpx.AsyncClient.get", return_value=_mock_response(CONGRESS_ACTIONS_FIXTURE)):
        result = await fetch_federal_bill_stages("119", "s", "4629")

    assert result is not None
    assert result["source"] == "Congress.gov"
    assert len(result["stages"]) == 2
    # Both fixture actions share a date; sort must be stable, not crash.
    assert all("date" in stage and "label" in stage for stage in result["stages"])


@pytest.mark.anyio
async def test_state_stages_normalized_and_sorted():
    with patch("httpx.AsyncClient.get", return_value=_mock_response(LEGISCAN_BILL_FIXTURE)):
        result = await fetch_state_bill_stages("1894268")

    assert result is not None
    assert result["source"] == "LegiScan"
    assert len(result["stages"]) == 3
    # Chronological order, not API insertion order.
    assert result["stages"][0]["date"] == "2024-12-02"
    assert result["stages"][-1]["date"] == "2025-01-09"


@pytest.mark.anyio
async def test_state_stages_returns_none_on_non_ok_status():
    with patch("httpx.AsyncClient.get", return_value=_mock_response({"status": "ERROR"})):
        result = await fetch_state_bill_stages("bad-id")

    assert result is None


@pytest.mark.anyio
async def test_get_bill_detail_dispatches_federal_id():
    with patch(
        "app.services.bill_detail.fetch_federal_bill_stages",
        new=AsyncMock(return_value={"stages": [], "source": "Congress.gov", "url": "https://example.com"}),
    ) as mocked:
        detail = await get_bill_detail("congress-119-s-4629", "Test Bill", "Federal")

    mocked.assert_awaited_once_with("119", "s", "4629")
    assert detail is not None
    assert detail["title"] == "Test Bill"
    assert detail["source"] == "Congress.gov"


@pytest.mark.anyio
async def test_get_bill_detail_dispatches_state_id():
    with patch(
        "app.services.bill_detail.fetch_state_bill_stages",
        new=AsyncMock(return_value={"stages": [], "source": "LegiScan", "url": "https://example.com"}),
    ) as mocked:
        detail = await get_bill_detail("legiscan-CA-1894268", "Test Bill", "California")

    mocked.assert_awaited_once_with("1894268")
    assert detail is not None


@pytest.mark.anyio
async def test_get_bill_detail_returns_none_for_unknown_id_shape():
    detail = await get_bill_detail("static-rent-notice-bill", "Test Bill", "California")
    assert detail is None


@pytest.fixture
def anyio_backend():
    return "asyncio"
