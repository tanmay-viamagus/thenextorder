/**
 * Display text: a word joiner (U+2060) after every hyphen inside a word, so
 * "T-Hub" and "AI-first" never break across lines. For text on the page
 * only; data, metadata and the email's plain text keep plain hyphens.
 */
export const keep = (s: string) => s.replace(/(\S)-(?=\S)/g, "$1-\u2060");
