export type BotPersonality =
  | "friendly"
  | "professional"
  | "sarcastic"
  | "creative"
  | "analytical"
  | "mentor"
  | "companion";

export interface BotPreferences {
  preferredSentiment: "neutral" | "positive" | "negative"; // Assuming these are the values
  topics: string[];
  communicationStyle: "casual" | "formal"; // Assuming
  responseLength: "short" | "medium" | "long"; // Assuming
}

export interface BotAnalytics {
  totalInteractions: number;
  averageResponseTime: number;
  satisfactionRating: number;
}
