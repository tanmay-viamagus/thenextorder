/** The registration choices — tap, don't type. Shared by the form, the API and the responses page. */

export const SEATS = ["CEO / MD", "Site leader", "Technology leader", "HR & talent leader", "Other"] as const;

/** What the visitor wants to explore — the evening's three conversations (from the brochure). */
export const INTERESTS = ["Talent: how GCCs hire", "Technology: how GCCs build", "Leadership: how GCCs lead", "The wider conversation"] as const;

export const INTEREST_BY_KEY: Record<string, (typeof INTERESTS)[number]> = {
  talent: "Talent: how GCCs hire",
  technology: "Technology: how GCCs build",
  leadership: "Leadership: how GCCs lead",
};

/** What the visitor's centre is taking on next. */
export const FOCUS = ["Product ownership", "Platforms", "Process automation", "Specialist talent", "Scaling teams", "Still deciding"] as const;
