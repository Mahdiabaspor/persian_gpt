import axios from 'axios';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const generateResponse = async (messages: ChatMessage[], apiKey: string) => {
  try {
    const userMessage = messages[messages.length - 1].content;
    console.log(`[User message]: "${userMessage}"`);
    if (!apiKey) {
      throw new Error('No API key provided.');
    }
    console.log('[AIMLapi] Sending request to AIMLapi.com...');
    const response = await axios.post(
      'https://api.aimlapi.com/v1/chat/completions',
      {
        model: "meta-llama/Llama-Vision-Free",
        messages: [
          { role: 'user', content: userMessage }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    if (response.data && response.data.choices && response.data.choices[0] && response.data.choices[0].message && response.data.choices[0].message.content) {
      const aiResponse = response.data.choices[0].message.content;
      console.log('[AIMLapi] Response received.');
      return aiResponse;
    } else {
      console.error('[AIMLapi] No valid response from model.');
      return 'No valid response from AI model.';
    }
  } catch (error: any) {
    console.error(`[API call error]: ${error.message || 'Unknown error'}`);
    return 'Error: Unable to get response from AI model.';
  }
};
