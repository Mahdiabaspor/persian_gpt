import React from 'react';

interface ApiKeyModalProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  onSubmit: () => void;
  isVisible: boolean;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  apiKey,
  setApiKey,
  onSubmit,
  isVisible,
}) => {
  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="chat-container p-6 w-full max-w-md">        <h2 className="text-2xl font-bold mb-4 text-center text-white">به پرشین GPT خوش آمدید</h2>
        <p className="mb-6 text-blue-100 text-center">
          برای استفاده از سرویس، می‌توانید کلید API هاگینگ‌فیس خود را وارد کنید یا بدون کلید ادامه دهید
        </p>
        
        <div className="mb-6">
          <label htmlFor="apiKey" className="block text-sm font-medium text-blue-100 mb-2">
            HuggingFace API Key (اختیاری)
          </label>
          <input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full p-3 bg-opacity-10 bg-white backdrop-blur-md border border-blue-300 border-opacity-20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
            placeholder="hf_..."
          />
          <p className="text-xs mt-1 text-blue-300">استفاده از کلید API محدودیت‌های نسخه رایگان را برطرف می‌کند</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => { setApiKey(''); onSubmit(); }}
            className="py-3 px-4 rounded-md text-white font-medium transition-all duration-300 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800"
          >
            استفاده بدون کلید
          </button>
          
          <button
            onClick={onSubmit}

            className={`py-3 px-4 rounded-md text-white font-medium transition-all duration-300
              ${
       
                   'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-blue-500/50'
      
              }`}
          >
            ادامه با کلید API
          </button>
        </div>
          <div className="mt-6 text-sm text-blue-200 text-center">
          <p>کلید API شما به صورت امن در مرورگر شما ذخیره می‌شود</p>
          <a
            href="https://huggingface.co/settings/tokens"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-300 hover:text-blue-100 hover:underline mt-2 block"
          >
            دریافت کلید API از HuggingFace (رایگان)
          </a>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
