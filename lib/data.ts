export const profileTags = [
  "Employee",
  "Student",
  "Tenant",
  "Homeowner",
  "Parent",
  "Business owner",
  "Gig worker",
  "Immigrant",
  "H-1B",
  "F-1",
  "Green Card holder",
  "Veteran",
  "Healthcare patient",
  "Small business owner",
];

export const feedItems = [
  {
    id: "static-worker-classification-guidance",
    title: "Federal agency updates worker classification guidance",
    summary:
      "New guidance clarifies when contract and gig work may be treated as employment for wage protections.",
    jurisdiction: "Federal",
    sourceType: "Government guidance",
    effectiveDate: "2026-07-01",
    affected: ["Employee", "Gig worker", "Business owner"],
    rights: ["Wage protections", "Benefit eligibility", "Recordkeeping"],
    whyItMatters:
      "Classification affects minimum wage, overtime, payroll taxes, and employer responsibilities.",
    personalImpact:
      "You selected Gig worker. This may affect whether a platform or client must treat some work as employment under federal labor standards.",
    citations: ["Federal Register", "U.S. Department of Labor"],
    publicationDate: "Reference record",
    priority: "Priority 2",
    confidence: "Medium",
    impactScore: 78,
  },
  {
    id: "static-rent-notice-bill",
    title: "State rent notice bill advances from committee",
    summary:
      "A proposed state bill would require longer notice before certain rent increases and lease nonrenewals.",
    jurisdiction: "California",
    sourceType: "Bill",
    effectiveDate: "Pending",
    affected: ["Tenant", "Parent", "Student"],
    rights: ["Housing stability", "Notice requirements"],
    whyItMatters:
      "Notice windows determine how much time renters have to budget, negotiate, or look for housing.",
    personalImpact:
      "You selected Tenant. If enacted in your state, your landlord may need to give more notice before a covered rent increase.",
    citations: ["State legislature bill text", "Housing committee analysis"],
    publicationDate: "Reference record",
    priority: "Priority 3",
    confidence: "Low",
    impactScore: 64,
  },
  {
    id: "static-phone-search-exception",
    title: "Appeals court narrows phone search exception",
    summary:
      "A recent appellate decision limits when officers can search digital content without a warrant after an arrest.",
    jurisdiction: "9th Circuit",
    sourceType: "Court ruling",
    effectiveDate: "2026-05-18",
    affected: ["Student", "Immigrant", "Employee"],
    rights: ["Fourth Amendment", "Digital privacy"],
    whyItMatters:
      "Phone searches can expose messages, location data, photos, and account information.",
    personalImpact:
      "You selected Student. This ruling may affect what officers can access from your phone during covered encounters in this circuit.",
    citations: ["CourtListener opinion", "U.S. Constitution, Fourth Amendment"],
    publicationDate: "Reference record",
    priority: "Priority 2",
    confidence: "Medium",
    impactScore: 72,
  },
];

export const rightsTopics = [
  {
    name: "Employment rights",
    summary: "Pay, termination, discrimination, leave, classification, and workplace safety.",
    laws: ["Fair Labor Standards Act", "Title VII", "OSHA"],
    cases: ["Bostock v. Clayton County", "Epic Systems Corp. v. Lewis"],
    questions: ["Can I be fired without notice?", "Do I qualify for overtime?"],
    stateNotes: "State wage, leave, and final-pay rules often add protections.",
  },
  {
    name: "Housing rights",
    summary: "Rent increases, habitability, eviction process, deposits, and discrimination.",
    laws: ["Fair Housing Act", "State landlord-tenant codes"],
    cases: ["Department of Housing v. Inclusive Communities Project"],
    questions: ["Can my landlord raise rent?", "What notice is required before eviction?"],
    stateNotes: "Rent control and eviction notice rules are highly local.",
  },
  {
    name: "Police encounters",
    summary: "Searches, stops, questioning, arrests, warrants, and digital privacy.",
    laws: ["Fourth Amendment", "Fifth Amendment"],
    cases: ["Riley v. California", "Terry v. Ohio"],
    questions: ["Can police search my phone?", "Do I have to answer questions?"],
    stateNotes: "State constitutions may provide broader privacy protections.",
  },
  {
    name: "Immigration rights",
    summary: "Status, work authorization, visa deadlines, notices, and removal proceedings.",
    laws: ["Immigration and Nationality Act", "8 CFR"],
    cases: ["Pereira v. Sessions"],
    questions: ["What happens if my visa expires?", "Can I change employers on H-1B?"],
    stateNotes: "Federal law controls status, while state rules can affect benefits and licensing.",
  },
  {
    name: "Student rights",
    summary: "School discipline, disability accommodations, records, discrimination, and campus safety.",
    laws: ["Title IX", "FERPA", "Individuals with Disabilities Education Act"],
    cases: ["Goss v. Lopez", "Davis v. Monroe County Board of Education"],
    questions: ["Can my school suspend me without a hearing?", "Who can see my student records?"],
    stateNotes: "Public school procedures and higher-education policies vary by state and institution.",
  },
  {
    name: "Consumer rights",
    summary: "Debt collection, credit reporting, billing disputes, warranties, and unfair business practices.",
    laws: ["Fair Debt Collection Practices Act", "Fair Credit Reporting Act", "Truth in Lending Act"],
    cases: ["TransUnion LLC v. Ramirez"],
    questions: ["Can a debt collector call me at work?", "How do I dispute a credit report error?"],
    stateNotes: "State consumer-protection laws can add remedies and shorter complaint deadlines.",
  },
  {
    name: "Healthcare rights",
    summary: "Health-information privacy, insurance coverage, disability access, medical bills, and patient rights.",
    laws: ["Health Insurance Portability and Accountability Act", "Affordable Care Act", "Americans with Disabilities Act"],
    cases: ["Dobbs v. Jackson Women's Health Organization"],
    questions: ["Who can see my health records?", "How can I appeal an insurance denial?"],
    stateNotes: "Coverage rules, patient protections, and medical-debt requirements can vary by state.",
  },
  {
    name: "Privacy rights",
    summary: "Personal data, digital searches, consumer privacy, workplace monitoring, and government surveillance.",
    laws: ["Fourth Amendment", "California Consumer Privacy Act", "Electronic Communications Privacy Act"],
    cases: ["Carpenter v. United States", "Riley v. California"],
    questions: ["Can police search my phone?", "Can my employer monitor me?"],
    stateNotes: "State privacy laws can give residents additional rights to know, delete, or limit data use.",
  },
  {
    name: "Family rights",
    summary: "Family leave, caregiving, child support, custody, domestic violence protections, and benefits.",
    laws: ["Family and Medical Leave Act", "Violence Against Women Act", "State family codes"],
    cases: ["Troxel v. Granville"],
    questions: ["Can I take leave to care for family?", "Where can I find custody information?"],
    stateNotes: "Custody, support, and family-protection rules are highly state and local.",
  },
  {
    name: "Constitutional rights",
    summary: "Speech, privacy, due process, equal protection, and limits on government action.",
    laws: ["U.S. Constitution", "State constitutions", "Civil Rights Act"],
    cases: ["Riley v. California", "Tinker v. Des Moines"],
    questions: ["Can the government search my phone?", "What is due process?"],
    stateNotes: "State constitutions can provide protections beyond the federal baseline.",
  },
];

export const searchResults = [
  {
    title: "Riley v. California",
    type: "Court opinion",
    jurisdiction: "U.S. Supreme Court",
    date: "2014-06-25",
    category: "Constitutional rights",
    summary:
      "Police generally need a warrant before searching digital information on a cell phone seized during an arrest.",
  },
  {
    title: "Fair Housing Act",
    type: "Federal statute",
    jurisdiction: "Federal",
    date: "Current",
    category: "Housing rights",
    summary:
      "Prohibits housing discrimination based on protected characteristics in many housing transactions.",
  },
  {
    title: "H-1B specialty occupation regulation",
    type: "Regulation",
    jurisdiction: "Federal",
    date: "Current",
    category: "Immigration rights",
    summary:
      "Defines specialty occupation criteria, petition requirements, and employer filing responsibilities.",
  },
  {
    title: "California Tenant Protection Act",
    type: "State statute",
    jurisdiction: "California",
    date: "Current",
    category: "Housing rights",
    summary: "Sets statewide baseline protections for certain rent increases and just-cause eviction requirements.",
  },
  {
    title: "Fair Labor Standards Act",
    type: "Federal statute",
    jurisdiction: "Federal",
    date: "Current",
    category: "Employment rights",
    summary: "Establishes federal minimum wage, overtime, recordkeeping, and child labor standards.",
  },
];

export const courtCases = [
  {
    name: "Riley v. California",
    court: "U.S. Supreme Court",
    date: "June 25, 2014",
    citation: "573 U.S. 373",
    issue: "Whether officers may search digital phone contents without a warrant after arrest.",
    holding: "A warrant is generally required before searching digital information on a seized phone.",
    reasoning: "Modern phones hold extensive personal data and are not comparable to ordinary physical items carried at arrest.",
    rights: "Fourth Amendment privacy and digital search protections.",
    impacted: "People whose phones are seized during covered arrests or investigations.",
    explanation: "Your phone can contain far more private information than a wallet or bag. Officers usually need a warrant before reviewing its digital contents.",
    source: "https://supreme.justia.com/cases/federal/us/573/373/",
  },
  {
    name: "Bostock v. Clayton County",
    court: "U.S. Supreme Court",
    date: "June 15, 2020",
    citation: "590 U.S. 644",
    issue: "Whether Title VII prohibits employment discrimination because of sexual orientation or transgender status.",
    holding: "Firing someone for being gay or transgender violates Title VII's prohibition on sex discrimination.",
    reasoning: "An employer who treats a person differently for these reasons necessarily relies on sex.",
    rights: "Workplace equal-treatment protections under federal law.",
    impacted: "Employees and employers covered by Title VII.",
    explanation: "Federal employment law generally protects covered workers from being fired for being gay or transgender.",
    source: "https://supreme.justia.com/cases/federal/us/590/17-1618/",
  },
];

export type LegalAnswer = {
  quick_answer: string;
  rights: string[];
  responsibilities: string[];
  relevant_laws: string[];
  court_rulings: string[];
  exceptions: string[];
  deadlines: string[];
  next_steps: string[];
  sources: string[];
  disclaimer: string;
  source_type?: string;
  what_changed?: string;
  why_it_matters?: string;
  affects_you?: string[];
  not_affected?: string[];
  positive_impacts?: string[];
  negative_impacts?: string[];
  risks?: string[];
  opportunities?: string[];
  priority?: "Priority 1" | "Priority 2" | "Priority 3" | "Priority 4";
  confidence?: "High" | "Medium" | "Low";
  facts?: string[];
  interpretations?: string[];
  predictions?: string[];
  matched_source?: {
    title: string;
    jurisdiction: string;
    excerpt: string;
    confidence: number;
  } | null;
};

export type LifeImpactContext = {
  state: string;
  city: string;
  county: string;
  tags: string[];
};

export const legalDisclaimer =
  "This information is for educational purposes only and is not legal advice. Laws vary by jurisdiction. Consult a licensed attorney for legal guidance.";

export const qaSample: LegalAnswer = {
  quick_answer:
    "In California, whether a landlord can raise rent depends on the property type, local rent rules, lease terms, and required notice period.",
  rights: [
    "Right to receive legally required written notice before covered increases.",
    "Right to challenge increases that violate state or local rent limits.",
  ],
  responsibilities: [
    "Review your lease and local notices.",
    "Continue paying undisputed rent unless a qualified legal professional advises otherwise.",
  ],
  relevant_laws: ["California Tenant Protection Act", "Local rent stabilization ordinances"],
  court_rulings: ["No specific ruling cited from the current sample record."],
  exceptions: ["Single-family homes, newer buildings, and subsidized housing can follow different rules."],
  deadlines: ["Notice periods can depend on the size of the increase and local law."],
  next_steps: [
    "Confirm your city and property type.",
    "Compare the notice with state and local rent increase rules.",
    "Contact a tenant clinic or licensed attorney for guidance on your facts.",
  ],
  sources: ["California Civil Code", "Local housing department guidance"],
  disclaimer: legalDisclaimer,
};

export const qaExamples = [
  "I got fired.",
  "Can my landlord raise rent?",
  "Can police search my phone?",
  "How does bail work?",
  "What happens if my visa expires?",
];

export const qaAnswers: Array<{
  topic: string;
  patterns: RegExp[];
  keywords: string[];
  answer: LegalAnswer;
}> = [
  {
    topic: "Employment termination",
    patterns: [
      /\b(i\s+got|i\s+was|been|get|got)\s+(fired|terminated|laid\s+off)\b/,
      /\bwrongful\s+(termination|firing|dismissal)\b/,
      /\bcan\s+(my\s+)?(boss|employer|company)\s+fire\s+me\b/,
      /\bfired\s+(without\s+notice|for\s+no\s+reason|after\s+complaining)\b/,
    ],
    keywords: ["fired", "terminated", "termination", "laid off", "wrongful"],
    answer: {
      quick_answer:
        "In California, many jobs are at-will, but an employer still cannot fire someone for an illegal reason such as discrimination, retaliation, protected leave, or wage complaints.",
      rights: [
        "Right to final wages on the timeline required by state law.",
        "Right to be free from discrimination and retaliation.",
        "Right to request unemployment benefits if eligible.",
      ],
      responsibilities: [
        "Keep termination notices, pay stubs, messages, and performance records.",
        "File agency complaints or benefit claims before applicable deadlines.",
      ],
      relevant_laws: [
        "California Labor Code",
        "California Fair Employment and Housing Act",
        "Title VII of the Civil Rights Act",
        "Fair Labor Standards Act",
      ],
      court_rulings: ["No case-specific ruling is selected without more facts."],
      exceptions: [
        "Union contracts, employment contracts, public employment, protected leave, and whistleblower facts can change the analysis.",
      ],
      deadlines: [
        "Agency filing deadlines vary by claim type. Some wage, discrimination, and unemployment deadlines can be short.",
      ],
      next_steps: [
        "Write down the date, reason given, and people involved.",
        "Collect final pay, benefits, leave, and termination documents.",
        "Contact the appropriate labor agency or a licensed employment attorney.",
      ],
      sources: [
        "California Labor Code",
        "California Civil Rights Department",
        "U.S. Equal Employment Opportunity Commission",
        "U.S. Department of Labor",
      ],
      disclaimer: legalDisclaimer,
    },
  },
  {
    topic: "Eviction and tenant process",
    patterns: [
      /\b(landlord|property\s+manager|owner)\b.*\b(evict|eviction|kick\s+out|lock\s+out|remove)\b/,
      /\b(evict|eviction|lockout|lock\s+out|notice\s+to\s+quit|unlawful\s+detainer)\b/,
      /\bcan\s+my\s+landlord\s+(evict|kick\s+me\s+out|lock\s+me\s+out)\b/,
      /\bgot\s+an?\s+(eviction|notice\s+to\s+quit|pay\s+or\s+quit)\b/,
    ],
    keywords: ["evict", "eviction", "lockout", "lock out", "notice to quit"],
    answer: {
      quick_answer:
        "In California, a landlord usually cannot remove you without following the legal eviction process. That typically means proper written notice, a court case, and a lawful court order before removal.",
      rights: [
        "Right to receive the required written notice before an eviction case can proceed.",
        "Right to respond in court if an eviction case is filed.",
        "Right not to be locked out, have utilities shut off, or be removed without the legal process.",
      ],
      responsibilities: [
        "Read any notice carefully and track the deadline on it.",
        "Keep paying rent that is not disputed unless a qualified legal professional advises otherwise.",
        "Respond quickly if court papers are served.",
      ],
      relevant_laws: [
        "California landlord-tenant law",
        "Local eviction protection ordinances",
        "Fair Housing Act",
      ],
      court_rulings: ["No case-specific ruling is selected without more facts."],
      exceptions: [
        "Rules can differ for subsidized housing, room rentals, owner move-in claims, foreclosure, domestic violence protections, and local just-cause ordinances.",
      ],
      deadlines: [
        "Notice and court-response deadlines can be short. The exact deadline depends on the notice type and court papers.",
      ],
      next_steps: [
        "Identify the notice type and date served.",
        "Check whether your city or county has local eviction protections.",
        "Contact a tenant clinic, legal aid office, or licensed attorney quickly if court papers arrive.",
      ],
      sources: [
        "California Courts self-help eviction resources",
        "California Civil Code",
        "Local housing department guidance",
        "Fair Housing Act",
      ],
      disclaimer: legalDisclaimer,
    },
  },
  {
    topic: "Rent and tenant rights",
    patterns: [
      /\b(landlord|property\s+manager|owner)\b.*\b(raise|increase|hike|change)\b.*\b(rent|lease)\b/,
      /\b(rent|lease)\b.*\b(raise|increase|hike|notice|eviction|evict)\b/,
      /\bcan\s+my\s+landlord\b/,
      /\btenant\b.*\b(rent|notice|eviction|lease)\b/,
    ],
    keywords: ["landlord", "rent", "lease", "tenant", "eviction"],
    answer: qaSample,
  },
  {
    topic: "Police phone searches",
    patterns: [
      /\b(police|officer|cop|law\s+enforcement)\b.*\b(search|look\s+through|unlock|take|seize)\b.*\b(phone|cell|device)\b/,
      /\b(phone|cell|device)\b.*\b(search|warrant|unlock|passcode|seize)\b/,
      /\bdo\s+i\s+have\s+to\s+(unlock|give).*\b(phone|passcode)\b/,
      /\bwarrant\b.*\b(phone|cell|device|search)\b/,
    ],
    keywords: ["police", "search", "phone", "cell", "warrant"],
    answer: {
      quick_answer:
        "In the United States, police generally need a warrant to search the digital contents of a cell phone seized during an arrest, but emergency and consent situations can change the answer.",
      rights: [
        "Fourth Amendment protection against unreasonable searches and seizures.",
        "Right to refuse consent to a search in many situations.",
        "Right to remain silent when questioning could incriminate you.",
      ],
      responsibilities: [
        "Do not physically resist a search.",
        "Clearly state if you do not consent, and ask whether you are free to leave.",
      ],
      relevant_laws: ["U.S. Constitution, Fourth Amendment", "U.S. Constitution, Fifth Amendment"],
      court_rulings: ["Riley v. California, 573 U.S. 373 (2014)", "Terry v. Ohio, 392 U.S. 1 (1968)"],
      exceptions: [
        "Consent, emergencies, border searches, probation or parole conditions, and valid warrants can change the result.",
      ],
      deadlines: [
        "If evidence was seized, deadlines to challenge it depend on the court schedule and criminal procedure rules.",
      ],
      next_steps: [
        "Ask for a warrant if officers request phone access.",
        "Do not share passcodes until you receive legal guidance.",
        "Write down what happened and speak with a licensed criminal defense attorney.",
      ],
      sources: [
        "U.S. Constitution, Fourth Amendment",
        "Riley v. California, 573 U.S. 373 (2014)",
        "Terry v. Ohio, 392 U.S. 1 (1968)",
      ],
      disclaimer: legalDisclaimer,
    },
  },
  {
    topic: "Bail and release",
    patterns: [
      /\bhow\s+does\s+(bail|bond)\s+work\b/,
      /\b(bail|bond|arraignment)\b/,
      /\b(get|getting|got)\s+out\s+of\s+jail\b/,
      /\b(release|detained|custody)\b.*\b(court|jail|charge|criminal)\b/,
    ],
    keywords: ["bail", "bond", "arraignment", "jail", "detained"],
    answer: {
      quick_answer:
        "Bail rules depend heavily on the state, charge, risk assessment, and judge. In general, bail is a court process for deciding release conditions while a criminal case is pending.",
      rights: [
        "Right to be informed of charges.",
        "Right to counsel in criminal proceedings.",
        "Right to challenge unlawful detention or excessive bail where applicable.",
      ],
      responsibilities: [
        "Appear at all court dates.",
        "Follow release conditions such as no-contact, travel, or check-in orders.",
      ],
      relevant_laws: [
        "U.S. Constitution, Eighth Amendment",
        "State criminal procedure and bail statutes",
        "Local court rules",
      ],
      court_rulings: ["United States v. Salerno, 481 U.S. 739 (1987)"],
      exceptions: [
        "Some charges, probation holds, immigration holds, or public-safety findings can limit release options.",
      ],
      deadlines: [
        "Arraignment and bail-review timing depends on state procedure and arrest timing.",
      ],
      next_steps: [
        "Find the exact court, charge, and next hearing time.",
        "Ask about public defender eligibility if you do not have counsel.",
        "Keep proof of court dates and release conditions.",
      ],
      sources: [
        "U.S. Constitution, Eighth Amendment",
        "United States v. Salerno, 481 U.S. 739 (1987)",
        "State court criminal procedure resources",
      ],
      disclaimer: legalDisclaimer,
    },
  },
  {
    topic: "Immigration status and visa deadlines",
    patterns: [
      /\b(visa|status|i-94|h-1b|f-1|green\s+card)\b.*\b(expire|expires|expired|overstay|deadline|grace)\b/,
      /\bwhat\s+happens\b.*\b(visa|status|i-94)\b/,
      /\b(overstay|unlawful\s+presence|out\s+of\s+status)\b/,
      /\b(can\s+i|how\s+do\s+i)\b.*\b(extend|change)\b.*\b(visa|status)\b/,
    ],
    keywords: ["visa", "expires", "expired", "overstay", "h-1b", "f-1", "green card", "immigration"],
    answer: {
      quick_answer:
        "If a visa or immigration status may expire, the impact depends on your status type, I-94 date, pending applications, grace periods, and whether you are authorized to work or study.",
      rights: [
        "Right to receive notices in immigration proceedings.",
        "Right to consult an immigration attorney at your own expense.",
        "Some people may be eligible to request extensions, changes of status, or other relief.",
      ],
      responsibilities: [
        "Track the I-94 admitted-until date, not only the visa stamp date.",
        "Avoid unauthorized work and keep copies of filings and notices.",
      ],
      relevant_laws: ["Immigration and Nationality Act", "8 CFR immigration regulations"],
      court_rulings: ["No case-specific ruling is selected without more facts."],
      exceptions: [
        "H-1B, F-1, green card, asylum, TPS, and pending adjustment situations follow different rules.",
      ],
      deadlines: [
        "Expiration, grace-period, extension, and unlawful-presence deadlines can be strict and fact-specific.",
      ],
      next_steps: [
        "Check your latest I-94 and approval notices.",
        "Identify whether any application is pending.",
        "Speak with a licensed immigration attorney or accredited representative quickly.",
      ],
      sources: ["USCIS policy resources", "U.S. Customs and Border Protection I-94 guidance", "8 CFR"],
      disclaimer: legalDisclaimer,
    },
  },
];

export function getLegalAnswer(question: string): LegalAnswer {
  const normalized = normalizeQuestion(question);
  if (!normalized) {
    return {
      quick_answer:
        "Type a legal question to get a structured educational answer with rights, responsibilities, next steps, sources, and the required disclaimer.",
      rights: ["Right to understand which jurisdiction and legal topic apply."],
      responsibilities: ["Provide the state, city, dates, documents, and key facts when possible."],
      relevant_laws: ["The relevant law depends on the legal topic and jurisdiction."],
      court_rulings: ["Case law depends on the jurisdiction and issue."],
      exceptions: ["Facts, deadlines, contracts, immigration status, court orders, and local rules can change the answer."],
      deadlines: ["Deadlines cannot be identified without the issue, jurisdiction, and dates."],
      next_steps: ["Type a question such as 'Can my landlord evict me?' or 'Can police search my phone?'"],
      sources: ["Official statutes, court rules, agency guidance, and court opinions should be checked for the final answer."],
      disclaimer: legalDisclaimer,
    };
  }

  const match = qaAnswers.find(({ keywords, patterns }) =>
    patterns.some((pattern) => pattern.test(normalized)) ||
    keywords.some((keyword) => normalized.includes(keyword)),
  );

  if (match) {
    return match.answer;
  }

  return buildGeneralAnswer(question);
}

export function getLifeImpactAnswer(question: string, profile: LifeImpactContext): LegalAnswer {
  const base = getLegalAnswer(question);
  const normalized = normalizeQuestion(question);
  const match = qaAnswers.find(({ keywords, patterns }) =>
    patterns.some((pattern) => pattern.test(normalized)) ||
    keywords.some((keyword) => normalized.includes(keyword)),
  );
  const topic = match?.topic ?? "General legal question";
  const urgent = /evict|eviction|court|arrest|jail|detained|expire|expired|deadline|notice/.test(normalized);
  const profileSummary = profile.tags.length
    ? `Your profile includes ${profile.tags.join(", ")}.`
    : "Your profile does not include any additional status tags.";

  return {
    ...base,
    source_type: match ? "Educational legal guidance" : "General legal information",
    what_changed: match
      ? `This response addresses ${topic.toLowerCase()} in ${profile.city || profile.state || "your location"}.`
      : "No specific law, ruling, notice, or policy update was supplied with this question.",
    why_it_matters: "The practical result can depend on your location, timing, documents, and legal status. Missing a notice or filing deadline can reduce available options.",
    affects_you: [profileSummary, `The question appears related to ${topic.toLowerCase()}.`],
    not_affected: ["People outside the relevant jurisdiction or with materially different facts may be governed by different rules."],
    positive_impacts: ["Early review of documents and deadlines can preserve options and strengthen your next steps."],
    negative_impacts: ["Acting on incomplete information can create financial, housing, employment, immigration, or court risks."],
    risks: urgent
      ? ["A deadline or urgent notice may require prompt local legal help.", "Do not ignore court papers, immigration notices, or formal agency deadlines."]
      : ["The exact rule may change with local law, contracts, dates, or facts."],
    opportunities: ["Gather documents, confirm the controlling source, and use local legal aid or an agency self-help resource where appropriate."],
    priority: urgent ? "Priority 1" : match ? "Priority 2" : "Priority 3",
    confidence: match ? "Medium" : "Low",
    facts: ["The response is based on the question and saved profile only."],
    interpretations: ["The practical impact is an educational interpretation, not a legal conclusion about your specific case."],
    predictions: ["Future outcomes depend on facts, enforcement, court decisions, and changes in the law."],
  };
}

export function getQuestionSuggestions(question: string): string[] {
  const normalized = normalizeQuestion(question);
  const hasSpecificMatch = qaAnswers.some(({ keywords, patterns }) =>
    patterns.some((pattern) => pattern.test(normalized)) ||
    keywords.some((keyword) => normalized.includes(keyword)),
  );
  if (hasSpecificMatch) return [];

  if (/landlord|tenant|rent|lease|housing|evict/.test(normalized)) {
    return [
      "Can my landlord evict me in California?",
      "How much notice does my landlord need to raise rent?",
      "What should I do if I received an eviction notice?",
    ];
  }
  if (/job|work|boss|employer|pay|wage|overtime|fired/.test(normalized)) {
    return [
      "Can my employer fire me for complaining about pay?",
      "When should I receive my final paycheck?",
      "Do I qualify for overtime in California?",
    ];
  }
  if (/police|arrest|search|phone|warrant|ticket/.test(normalized)) {
    return [
      "Can police search my phone without a warrant?",
      "Do I have to answer police questions?",
      "What should I do if police took my phone?",
    ];
  }
  if (/visa|immigration|i-94|h-1b|f-1|green card/.test(normalized)) {
    return [
      "What happens if my visa expires?",
      "How do I check my I-94 expiration date?",
      "Can I change employers on an H-1B visa?",
    ];
  }

  return [
    "What state, city, and county does this involve?",
    "What notice, contract, court paper, or agency letter did you receive?",
    "What happened, when did it happen, and what outcome do you want?",
  ];
}

function normalizeQuestion(question: string) {
  return question
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildGeneralAnswer(question: string): LegalAnswer {
  const trimmedQuestion = question.trim();

  return {
    quick_answer:
      `For "${trimmedQuestion}", the exact answer depends on your jurisdiction, dates, documents, and facts. As a general educational starting point, identify the legal area, preserve evidence, check deadlines, and confirm the rule from official state, federal, or court sources before taking action.`,
    rights: [
      "Right to ask which law, court rule, agency rule, contract, or government action controls the issue.",
      "Right to review official notices, orders, contracts, policies, or records connected to the problem.",
      "Right to seek help from a licensed attorney, legal aid office, court self-help center, or qualified agency.",
    ],
    responsibilities: [
      "Identify the state, city, county, court, agency, or immigration status involved.",
      "Keep copies of notices, emails, texts, photos, receipts, contracts, court papers, and dates.",
      "Avoid missing response, appeal, filing, payment, hearing, or renewal deadlines.",
    ],
    relevant_laws: [
      "State statutes and local ordinances for your location.",
      "Federal statutes and regulations if the issue involves employment, housing discrimination, immigration, constitutional rights, benefits, consumer credit, or interstate activity.",
      "Contracts, leases, school policies, workplace policies, court rules, or agency rules if they apply.",
    ],
    court_rulings: [
      "No specific court ruling is selected from the MVP dataset for this typed question.",
      "A production RAG system should search controlling federal, state, and local cases before citing a case.",
    ],
    exceptions: [
      "Emergency facts, signed agreements, prior court orders, protected status, government benefits, immigration status, and local rules can change the answer.",
      "Different rules may apply to minors, students, workers, tenants, immigrants, business owners, and people in criminal proceedings.",
    ],
    deadlines: [
      "Deadlines may apply to notices, agency complaints, court responses, appeals, benefit claims, immigration filings, and statutes of limitation.",
      "If you received a notice or court paper, treat the date served and the response deadline as urgent.",
    ],
    next_steps: [
      "Add the jurisdiction and key facts to the question.",
      "Find the official source: court website, agency guidance, statute, regulation, or signed document.",
      "Write a timeline with dates, people involved, documents received, and what outcome you want.",
      "Contact a licensed attorney, legal aid office, court self-help center, or relevant agency for guidance on your facts.",
    ],
    sources: [
      "State court self-help resources",
      "Local government and agency guidance",
      "Federal agency guidance where applicable",
      "Official statutes, regulations, and court rules",
    ],
    disclaimer: legalDisclaimer,
  };
}
