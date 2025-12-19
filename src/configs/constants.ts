export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 5,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 1,
};

export const AVAILABLE_GEMINI_MODELS = ["gemini-2.5-flash"] as const;
export const AVAILABLE_OPENAI_MODELS = ["gpt-4o", "gpt-4o-mini"] as const;
export const AVAILABLE_ANTHROPIC_MODELS = [
  "claude-3-5-sonnet-20241022",
  "claude-3-5-haiku-20241022",
] as const;
