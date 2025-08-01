import React from 'react';
import { FiSend } from 'react-icons/fi';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

interface ChatBoxProps {
  messages: Message[];
  inputValue: string;
  isLoading: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSendMessage: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({
  messages,
  inputValue,
  isLoading,
  handleInputChange,
  handleSendMessage,
  handleKeyDown,
}) => {  return (
    <div className="flex flex-col h-full chat-container">
      <div className="chat-header">
        <h2 className="text-xl font-bold text-white">Persian GPT</h2>
      </div>
      
      <div className="flex-1 chat-body overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.isUser ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block message-bubble ${
                message.isUser ? 'user-message' : 'bot-message'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="text-left mb-4">
            <div className="inline-block message-bubble bot-message">
              <div className="flex items-center">
                <div className="dot-typing"></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="input-container">
        <div className="flex items-end">
          <textarea
            className="flex-1 message-input resize-none focus:outline-none"
            rows={1}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="سوال خود را بپرسید..."
            style={{ direction: 'rtl' }}
          ></textarea>          <button
            className="ml-2 send-button focus:outline-none"
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
          >
            <FiSend className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
