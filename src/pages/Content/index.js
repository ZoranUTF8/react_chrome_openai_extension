import { Configuration, OpenAIApi } from "openai";

let openaiClient;

// Function to initialize the openaiClient with the API key
const initializeOpenAiClient = (apiKey) => {
  const config = new Configuration({ apiKey });
  openaiClient = new OpenAIApi(config);
};

// Load openai api key from chrome local storage
chrome.storage.local.get(["openai_api_key"]).then(({ openai_api_key }) => {
  if (openai_api_key) {
    initializeOpenAiClient(openai_api_key);
  } else {
    console.error("OpenAI API key is not provided or invalid.");
  }
});

// Add for api key changes in the chrome local storage
chrome.storage.onChanged.addListener((changes) => {
  for (let [key, { newValue }] of Object.entries(changes)) {
    if (key === "openai_api_key") {
      if (newValue) {
        initializeOpenAiClient(newValue);
      } else {
        console.error("New OpenAI API key is not provided or invalid.");
      }
      break;
    }
  }
});

// Get the email compose form
setInterval(() => {
  const gmailForms = document.querySelectorAll("div[g_editable]");

  for (const emailForm of gmailForms) {
    if (
      emailForm.parentNode &&
      emailForm.parentNode.querySelector("#email-assistant-button") === null
    ) {
      attachButton(emailForm);
    }
  }
}, 1000);

/**
 * Attaches the button to the compose form
 * @param {*} node
 */
function attachButton(node) {
  node.insertAdjacentHTML(
    "beforebegin",
    `<div id="email-assistant-button" class="assistant-btn">
      <svg class="assistant-btn-inner" fill="#232323" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <title>creation</title>
        <path d="M19,1L17.74,3.75L15,5L17.74,6.26L19,9L20.25,6.26L23,5L20.25,3.75M9,4L6.5,9.5L1,12L6.5,14.5L9,20L11.5,14.5L17,12L11.5,9.5M19,15L17.74,17.74L15,19L17.74,20.25L19,23L20.25,20.25L23,19L20.25,17.74" />
      </svg>
    </div>`
  );

  // Handle click event on email assistant button
  node.parentNode
    .querySelector("#email-assistant-button")
    .addEventListener("click", async () => {
      if (!openaiClient) return;
      const completion = await openaiClient.createCompletion({
        model: "text-davinci-003",
        prompt:
          '"Continue writing the email below:\n"' + node.textContent + '"',
        temperature: 0.6,
      });
      console.log(completion.data);
      node.textContent += " " + completion.data.choices[0].text;
    });
}
