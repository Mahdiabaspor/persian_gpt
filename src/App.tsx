import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './App.css';
import ChatBox from './components/ChatBox';
import ApiKeyModal from './components/ApiKeyModal';
import { generateResponse, type ChatMessage } from './services/api';

// Floating lights component for background animation
const FloatingLights: React.FC = () => {
  const [lights, setLights] = useState<{ id: number; top: string; left: string; size: string; duration: string; delay: string; translateX: string }[]>([]);

  useEffect(() => {
    const createLights = () => {
      const newLights = [];
      const count = 15; // Number of floating lights

      for (let i = 0; i < count; i++) {
        const top = `${Math.random() * 100}%`;
        const left = `${Math.random() * 100}%`;
        const size = `${Math.random() * 6 + 4}px`; // Size between 4px and 10px
        const duration = `${Math.random() * 15 + 10}s`; // Animation duration between 10s and 25s
        const delay = `${Math.random() * 5}s`; // Delay between 0s and 5s
        const translateX = `${(Math.random() * 200) - 100}px`; // Random horizontal movement
        
        newLights.push({
          id: i,
          top,
          left,
          size,
          duration,
          delay,
          translateX
        });
      }

      setLights(newLights);
    };

    createLights();

    // Recreate lights periodically to keep the animation fresh
    const interval = setInterval(createLights, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {lights.map((light) => (
        <div
          key={light.id}
          className="floating-light"
          style={{
            top: light.top,
            left: light.left,
            width: light.size,
            height: light.size,
            animation: `float ${light.duration} linear ${light.delay} infinite`,
            '--translate-x': light.translateX,
          } as React.CSSProperties}
        />
      ))}
    </>
  );
};

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

function App() {
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('persianGptApiKey') || '';
  });
  const [showApiKeyModal, setShowApiKeyModal] = useState<boolean>(true); // Always show modal on first load
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (apiKey && messages.length === 0) {
      // Add a welcome message when API key is set but no messages exist
      setMessages([
        {
          id: uuidv4(),
          text: 'سلام! من پرشین GPT هستم. چطور می‌توانم به شما کمک کنم؟',
          isUser: false,
        },
      ]);
    }
  }, [apiKey, messages.length]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleApiKeySubmit = () => {
    localStorage.setItem('persianGptApiKey', apiKey);
    setShowApiKeyModal(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: uuidv4(),
      text: inputValue.trim(),
      isUser: true,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      // Convert messages to the format expected by the API
      const chatMessages: ChatMessage[] = [
        { role: 'system' as const, content: 'You are Persian GPT, a helpful assistant based on Mistral language model. Please respond in Persian (Farsi) language. Keep your answers concise and helpful.' },
        ...messages.map((msg) => ({
          role: msg.isUser ? ('user' as const) : ('assistant' as const),
          content: msg.text,
        })),
        { role: 'user' as const, content: userMessage.text },
      ];

      const response = await generateResponse(chatMessages, apiKey);

      const assistantMessage: Message = {
        id: uuidv4(),
        text: response,
        isUser: false,
      };

      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    } catch (err: any) {
      setError(err.message || 'خطا در دریافت پاسخ');
      // Show error as a message
      const errorMessage: Message = {
        id: uuidv4(),
        text: err.message || 'خطا در دریافت پاسخ',
        isUser: false,
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeApiKey = () => {
    setShowApiKeyModal(true);
  };

  return (
    <>
      <FloatingLights />
      <div className="app-container">
        <div className="flex flex-col h-[5vh]">
          <header className="py-1">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                پرشین GPT 
                <span className="text-sm font-normal ml-2 text-blue-300">(Mistral)</span>
              </h1>
              <button
                onClick={handleChangeApiKey}
                className="text-sm text-blue-300 hover:text-blue-100 transition-colors duration-300"
              >
                تغییر کلید API
              </button>
            </div>
          </header>

          <div className="flex-1">
            <ChatBox
              messages={messages}
              inputValue={inputValue}
              isLoading={isLoading}
              handleInputChange={handleInputChange}
              handleSendMessage={handleSendMessage}
              handleKeyDown={handleKeyDown}
            />
          </div>

          <ApiKeyModal
            apiKey={apiKey}
            setApiKey={setApiKey}
            onSubmit={handleApiKeySubmit}
            isVisible={showApiKeyModal}
          />
          
          <div ref={messagesEndRef} />
        </div>
      </div>
    </>
  );
}

export default App;
