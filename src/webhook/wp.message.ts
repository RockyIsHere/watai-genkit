import { runFlow } from "@genkit-ai/flow";
const { GRAPH_API_TOKEN, SELECT_ACTION_TEMPLATE } = process.env;
import axios from "axios";

export default async function generateOutput(llm: any, input: string) {
  return await runFlow(llm, input);
}

export async function sendWAMessage(
  phone_number_id: string | undefined,
  to: string,
  message: string
) {
  await axios({
    method: "POST",
    url: `https://graph.facebook.com/v18.0/${phone_number_id}/messages`,
    headers: {
      Authorization: `Bearer ${GRAPH_API_TOKEN}`,
    },
    data: {
      messaging_product: "whatsapp",
      to: to,
      text: { body: message },
    },
  });
}

export async function onSelectAction(
  phone_number_id: string | undefined,
  to: string,
  actionName: string
) {
  await axios({
    method: "POST",
    url: `https://graph.facebook.com/v18.0/${phone_number_id}/messages`,
    headers: {
      Authorization: `Bearer ${GRAPH_API_TOKEN}`,
    },
    data: {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: to,
      type: "template",
      template: {
        name: SELECT_ACTION_TEMPLATE,
        language: {
          code: "en",
        },
        components: [
          {
            type: "header",
            parameters: [
              {
                type: "text",
                text: actionName,
              },
            ],
          },
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: actionName,
              },
            ],
          },
        ],
      },
    },
  });
}
