import fetch from 'node-fetch';

// Replace with your OpenRouter API key
const API_KEY = process.env.DEEPSEEK_API_KEY;
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Store conversation history
let conversationHistory = [];

async function sendMessage(message) {
  try {
    const headers = {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    };
    conversationHistory.push({ role: "user", content: message });
    const data = {
      model: "deepseek/deepseek-chat:free",
      messages: conversationHistory,
    };

    // Send the request to the DeepSeek API
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    });

    // Check if the request was successful
    if (response.ok) {
      const result = await response.json();
      const aiMessage = result.choices[0].message;
      conversationHistory.push(aiMessage);
      console.log("API Response:", aiMessage);
      return aiMessage;
    } else {
      console.log("Failed to fetch data from API. Status Code:", response.status);
      throw new Error("Failed to fetch DeepSeek API");
    }
  } catch (error) {
    console.error("Error fetching data:", error.message);
    throw error;
  }
}

// Example usage
(async () => {
  await sendMessage("Hi");
  await sendMessage("What is the capital of France?");
  await sendMessage("What did I ask you earlier?");
})();