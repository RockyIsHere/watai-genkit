import { defineFlow, geminiPro, generate, z } from "../exports";
import { outputSchema } from "../types";

export const quotesFlow = defineFlow(
  {
    name: "quotesFlow",
    inputSchema: z.string(),
    outputSchema: outputSchema,
  },
  async (subject): Promise<any> => {
    const llmResponse = await generate({
      prompt: `As a quotes expert, your task is to generate inspiring and thought-provoking quotes on a specific topic. Please create original quotes that reflect wisdom, motivation, or insight related to the given topic. Aim for clarity and depth in your expression.
      Here is the topic:
      ${subject}`,
      model: geminiPro,
      output: { schema: outputSchema },
      config: {
        temperature: 1,
      },
    });

    return llmResponse.output();
  }
);
