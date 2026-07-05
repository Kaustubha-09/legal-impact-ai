SOURCE_CONNECTORS = {
    "congress": "Congress.gov API for bills and legislative metadata",
    "govinfo": "GovInfo API for statutes, regulations, and official publications",
    "courtlistener": "CourtListener API for opinions and case metadata",
    "federal_register": "Federal Register API for agency rules and notices",
}


def planned_source_connectors() -> dict[str, str]:
    return SOURCE_CONNECTORS
