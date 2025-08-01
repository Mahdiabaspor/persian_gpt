import { generateResponse } from './api';
import type { ChatMessage } from './api';

const DUMMY_API_KEY =  'cc763ca3b0a74895acb76afbfaf27879';

async function runTests() {
  console.log('Running AI/ML  API tests...');

  const testCases: ChatMessage[][] = [
    [
      { role: 'user', content: 'Hello, how are you?' }
    ],
    [
      { role: 'user', content: 'Tell me a joke.' }
    ],

  ];

  for (const [i, messages] of testCases.entries()) {
    try {
      const response = await generateResponse(messages, DUMMY_API_KEY);
      console.log(`Test ${i + 1} response:`, response);
    } catch (err) {
      console.error(`Test ${i + 1} failed:`, err);
    }
  }
}

runTests();
