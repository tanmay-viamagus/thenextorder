/** The registration choices — tap, don't type. Shared by the form, the API and the responses page. */

export const SEATS = ["CEO / MD", "Site leader", "Technology leader", "HR & talent leader", "Other"] as const;

/** What the visitor wants to explore — the practice keys match content/story.ts. */
export const INTERESTS = ["Velocity AI", "Synthia AI", "ViaMagus Select", "AI leadership programme", "The wider conversation"] as const;

export const INTEREST_BY_KEY: Record<string, (typeof INTERESTS)[number]> = {
  velocity: "Velocity AI",
  synthia: "Synthia AI",
  select: "ViaMagus Select",
  programme: "AI leadership programme",
};

/** What the visitor's centre is taking on next. */
export const FOCUS = ["Product ownership", "Platforms", "Process automation", "Specialist talent", "Scaling teams", "Still deciding"] as const;
