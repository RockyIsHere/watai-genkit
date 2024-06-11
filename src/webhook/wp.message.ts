import { runFlow } from "@genkit-ai/flow";
require("dotenv").config();
const { GRAPH_API_TOKEN, SELECT_ACTION_TEMPLATE } = process.env;
import axios from "axios";
import FormData = require("form-data");

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
    url: `https://graph.facebook.com/v19.0/${phone_number_id}/messages`,
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
    url: `https://graph.facebook.com/v19.0/${phone_number_id}/messages`,
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

export const uploadMediaToWhatsApp = async (
  imageData: string | Blob,
  phone_number_id: string
): Promise<string> => {
  const url = `https://graph.facebook.com/v19.0/${phone_number_id}/media`;
  const headers = {
    Authorization: `Bearer ${GRAPH_API_TOKEN}`,
  };
  const formData = new FormData();
  formData.append("messaging_product", "whatsapp");
  formData.append("file", imageData);

  try {
    const response = await axios.post(url, formData, { headers });
    if (response.status === 200) {
      console.log("Upload successful");
      return response.data.id;
    } else {
      throw new Error(`Upload failed with status code ${response.status}`);
    }
  } catch (error: any) {
    throw new Error(`Error uploading file: ${error}`);
  }
};

export const sendMediaFile = async (
  to: string,
  mediaId: string,
  phone_number_id: string
) => {
  try {
    const data = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: to,
      type: "image",
      image: {
        id: mediaId,
      },
    };
    await axios({
      method: "POST",
      url: `https://graph.facebook.com/v19.0/${phone_number_id}/messages`,
      headers: {
        Authorization: `Bearer ${GRAPH_API_TOKEN}`,
      },
      data: data,
    });
  } catch (error: any) {
    throw new Error(error);
  }
};
