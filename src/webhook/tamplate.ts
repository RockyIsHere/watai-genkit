import axios from "axios";
require("dotenv").config();
const { GRAPH_API_TOKEN, TEMPLATE } = process.env;

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${GRAPH_API_TOKEN}`,
};

export default async function sendTemplate(
  phone_number_id: string | undefined,
  to: string
) {
  const url = `https://graph.facebook.com/v19.0/${phone_number_id}/messages`;
  const template = TEMPLATE || "select_utility";
  var data = {};
  if (template === "select_utility") {
    data = getUtilTemplate(to, template);
  }
  if (template === "select_action") {
    data = getActionTemplate(to, template);
  }


  await axios
    .post(url, data, { headers })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    });
}

function getActionTemplate(to: string, template: string) {
  const data = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: to,
    type: "template",
    template: {
      name: template,
      language: {
        code: "en",
      },
      components: [
        {
          type: "button",
          sub_type: "quick_reply",
          index: "0",
          parameters: [
            {
              type: "payload",
              payload: "grammar_checker",
            },
          ],
        },
        {
          type: "button",
          sub_type: "quick_reply",
          index: "1",
          parameters: [
            {
              type: "payload",
              payload: "paraphraser",
            },
          ],
        },
        {
          type: "button",
          sub_type: "quick_reply",
          index: "2",
          parameters: [
            {
              type: "payload",
              payload: "synonyms",
            },
          ],
        },
        {
          type: "button",
          sub_type: "quick_reply",
          index: "3",
          parameters: [
            {
              type: "payload",
              payload: "antonyms",
            },
          ],
        },
      ],
    },
  };
  return data;
}

function getUtilTemplate(to: string, template: string) {
  const data = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: to,
    type: "template",
    template: {
      name: template,
      language: {
        code: "en",
      },
      components: [
        {
          type: "button",
          sub_type: "quick_reply",
          index: "0",
          parameters: [
            {
              type: "payload",
              payload: "grammar_checker",
            },
          ],
        },
        {
          type: "button",
          sub_type: "quick_reply",
          index: "1",
          parameters: [
            {
              type: "payload",
              payload: "paraphraser",
            },
          ],
        },
      ],
    },
  };
  return data;
}
