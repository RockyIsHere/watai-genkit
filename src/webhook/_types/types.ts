import { Request } from "express";

export interface WebhookRequest extends Request {
  body: {
    entry: Array<{
      changes: Array<{
        value: {
          messages?: Array<{
            from: string;
            text: {
              body: string;
            };
            type: string;
            button: {
              payload: string;
              text: string;
            };
          }>;
          metadata?: {
            phone_number_id: string;
          };
        };
      }>;
    }>;
  };
}

export type buttonType = "grammar_checker" | "paraphraser";

export interface VerificationRequest extends Request {
  query: {
    "hub.mode"?: string;
    "hub.verify_token"?: string;
    "hub.challenge"?: string;
  };
}
