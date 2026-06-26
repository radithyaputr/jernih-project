export interface ActionMap {
  now: string[];
  within_24h: string[];
  within_7d: string[];
  contacts: string[];
  documents: string[];
}

export interface AIResponse {
  intent: string;
  summary: string;
  confidence_score: number;
  reasoning: string;
  risk_warning: string | null;
  sources: string[];
  action_map: ActionMap;
}
