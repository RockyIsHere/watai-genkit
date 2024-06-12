import { defineFlow, geminiPro, generate, z } from "../exports";
import { outputSchema } from "../types";

export const bengaliPoemFlow = defineFlow(
  {
    name: "bengaliPoemFlow",
    inputSchema: z.string(),
    outputSchema: outputSchema,
  },
  async (subject): Promise<any> => {
    const llmResponse = await generate({
      prompt: `As a literature expert in Bengali, your task is to create a six-line poem. Please ensure the poem is rich in imagery, emotion, and literary devices. The poem should reflect depth and creativity, capturing the essence of the theme provided.poem should be in bangla language.
      Here is the theme for the poem:
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
