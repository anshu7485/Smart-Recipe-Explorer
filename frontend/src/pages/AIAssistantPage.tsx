import { useState, useRef, useEffect } from 'react';
import { Sparkles, ChefHat, Loader2, Send, Plus, Menu, X } from 'lucide-react';
import { aiAPI } from '../services/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIAssistantPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const ingredientList = input
        .split(/[,，\n]/)
        .map((i) => i.trim())
        .filter((i) => i.length > 0);

      const response = await aiAPI.suggestRecipe(ingredientList);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.success && response.data 
          ? response.data 
          : response.error || 'Sorry, I could not generate a recipe suggestion. Please try again.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting AI suggestion:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please make sure the backend is running and try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setSidebarOpen(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50
        w-64 bg-gray-900 text-white flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Close button for mobile */}
        <div className="lg:hidden p-3 flex justify-end">
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <button
            onClick={clearChat}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span className="font-medium">New chat</span>
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto px-3">
          <div className="text-xs font-semibold text-gray-400 px-3 py-2">Recent</div>
          {/* You can add chat history here */}
        </div>

        {/* User Section */}
        <div className="p-3 border-t border-gray-700">
          <div className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-800 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
              <ChefHat className="h-4 w-4" />
            </div>
            <div className="flex-1 text-sm">
              <div className="font-medium">AI Recipe Chef</div>
            </div>
            <Menu className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col w-full">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="h-6 w-6 text-gray-700" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
              <ChefHat className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-gray-800">AI Recipe Chef</span>
          </div>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            // Welcome Screen
            <div className="h-full flex flex-col items-center justify-center px-4 py-8 max-w-3xl mx-auto">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center mb-4 sm:mb-6">
                <ChefHat className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 text-center">AI Recipe Assistant</h1>
              <p className="text-sm sm:text-base text-gray-500 text-center mb-8 sm:mb-12 max-w-md px-4">
                Tell me what ingredients you have, and I'll suggest delicious recipes you can make!
              </p>

              {/* Example Prompts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-2xl">
                <button
                  onClick={() => setInput('I have chicken, tomatoes, and garlic')}
                  className="p-3 sm:p-4 border border-gray-200 rounded-xl hover:bg-gray-50 text-left transition-colors"
                >
                  <div className="text-sm sm:text-base font-medium text-gray-800 mb-1">Quick dinner recipe</div>
                  <div className="text-xs sm:text-sm text-gray-500">With chicken, tomatoes, and garlic</div>
                </button>
                <button
                  onClick={() => setInput('I have pasta, cheese, and spinach')}
                  className="p-3 sm:p-4 border border-gray-200 rounded-xl hover:bg-gray-50 text-left transition-colors"
                >
                  <div className="text-sm sm:text-base font-medium text-gray-800 mb-1">Vegetarian pasta dish</div>
                  <div className="text-xs sm:text-sm text-gray-500">With pasta, cheese, and spinach</div>
                </button>
                <button
                  onClick={() => setInput('I have eggs, milk, and flour')}
                  className="p-3 sm:p-4 border border-gray-200 rounded-xl hover:bg-gray-50 text-left transition-colors"
                >
                  <div className="text-sm sm:text-base font-medium text-gray-800 mb-1">Breakfast ideas</div>
                  <div className="text-xs sm:text-sm text-gray-500">With eggs, milk, and flour</div>
                </button>
                <button
                  onClick={() => setInput('I have rice, beans, and vegetables')}
                  className="p-3 sm:p-4 border border-gray-200 rounded-xl hover:bg-gray-50 text-left transition-colors"
                >
                  <div className="text-sm sm:text-base font-medium text-gray-800 mb-1">Healthy bowl recipe</div>
                  <div className="text-xs sm:text-sm text-gray-500">With rice, beans, and veggies</div>
                </button>
              </div>
            </div>
          ) : (
            // Messages
            <div className="max-w-3xl mx-auto w-full px-3 sm:px-4 py-4 sm:py-8">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-6 sm:mb-8 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="flex space-x-2 sm:space-x-4 max-w-full">
                    {message.role === 'assistant' && (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                        <ChefHat className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                      </div>
                    )}
                    <div className="flex-1 space-y-1 sm:space-y-2 min-w-0">
                      {message.role === 'user' && (
                        <div className="flex items-center space-x-2 justify-end">
                          <span className="text-xs sm:text-sm font-medium text-gray-700">You</span>
                        </div>
                      )}
                      <div
                        className={`prose prose-sm sm:prose max-w-none ${
                          message.role === 'user'
                            ? 'bg-gray-100 px-3 py-2 sm:px-4 sm:py-3 rounded-2xl inline-block'
                            : 'text-gray-800'
                        }`}
                      >
                        <p className="whitespace-pre-line text-sm sm:text-[15px] leading-6 sm:leading-7 m-0 break-words">
                          {message.content}
                        </p>
                      </div>
                    </div>
                    {message.role === 'user' && (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs sm:text-sm font-medium">U</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="mb-6 sm:mb-8 flex justify-start">
                  <div className="flex space-x-2 sm:space-x-4">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                      <ChefHat className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                    </div>
                    <div className="flex items-center space-x-2 text-gray-500">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-xs sm:text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white">
          <div className="max-w-3xl mx-auto px-3 sm:px-4 py-3 sm:py-6">
            <div className="relative flex items-end bg-white border border-gray-300 rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-md transition-shadow focus-within:border-gray-400">
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Tell me what ingredients you have..."
                rows={1}
                className="flex-1 resize-none bg-transparent px-4 sm:px-6 py-3 sm:py-4 focus:outline-none text-sm sm:text-[15px] max-h-[200px] overflow-y-auto"
                style={{ minHeight: '48px' }}
              />
              <button
                onClick={handleSendMessage}
                disabled={loading || !input.trim()}
                className="mr-2 mb-2 p-2 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-black"
                aria-label="Send message"
              >
                <Send className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
            <p className="text-[10px] sm:text-xs text-gray-400 text-center mt-2 sm:mt-3 px-2">
              AI Recipe Chef can make mistakes. Consider checking important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage;
