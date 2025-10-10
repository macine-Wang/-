/**
 * AI聊天助手组件
 * 提供智能对话、系统导航和个性化建议功能
 */

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  XMarkIcon,
  PaperAirplaneIcon,
  SparklesIcon,
  UserIcon,
  ComputerDesktopIcon,
  LightBulbIcon,
  ArrowPathIcon,
  MicrophoneIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline';
import { AIAssistantService, Message } from '@/services/aiAssistant';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  const navigate = useNavigate();
  const location = useLocation();
  const [aiService] = useState(() => new AIAssistantService());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 设置导航函数
  useEffect(() => {
    aiService.setNavigate(navigate);
  }, [aiService, navigate]);

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 初始化AI助手
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        type: 'assistant',
        content: `👋 您好！我是ISMT系统智能助手，很高兴为您服务！

我可以帮您：
🧭 **快速导航** - "打开HR中心"、"进入求职者中心"
💡 **功能介绍** - "HR中心有什么功能？"
📊 **专业建议** - "帮我分析薪酬水平"
🎯 **填写指导** - "如何填写职位信息？"

请告诉我您需要什么帮助？`,
        timestamp: new Date()
      };
      
      setMessages([welcomeMessage]);
      setSuggestions(aiService.getSuggestions(location.pathname));
    }
  }, [isOpen, aiService, location.pathname]);

  // 聚焦输入框
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // 发送消息
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userInput = inputValue.trim();
    setInputValue('');
    setIsTyping(true);

    try {
      // 处理消息并获取AI回复
      const aiResponse = await aiService.processMessage(userInput);
      
      // 更新消息列表
      setMessages(aiService.getConversationHistory());
      
      // 更新建议
      setSuggestions(aiService.getSuggestions(location.pathname));
      
      // 如果有导航操作，可以在这里处理
      if (aiResponse.metadata?.action === 'navigate' && aiResponse.metadata?.target) {
        // 导航操作已经在aiService中处理
      }
      
    } catch (error) {
      console.error('发送消息失败:', error);
    } finally {
      setIsTyping(false);
    }
  };

  // 处理键盘事件
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 使用建议
  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    inputRef.current?.focus();
  };

  // 清除对话
  const handleClearChat = () => {
    aiService.clearHistory();
    setMessages([]);
    
    // 重新显示欢迎消息
    const welcomeMessage: Message = {
      id: 'welcome_new',
      type: 'assistant',
      content: '对话已清除。我是您的ISMT智能薪酬助手，请告诉我您需要什么帮助？',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  // 复制消息
  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    // TODO: 显示复制成功提示
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 背景遮罩 */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* 聊天窗口 */}
      <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden">
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">系统智能助手</h3>
              <p className="text-sm text-gray-500">在线为您服务</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleClearChat}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="清除对话"
            >
              <ArrowPathIcon className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 消息区域 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${message.type === 'user' ? 'order-1' : 'order-2'}`}>
                {/* 消息气泡 */}
                <div
                  className={`p-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : 'bg-gray-100 text-gray-900 rounded-bl-md'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>
                </div>
                
                {/* 消息元信息 */}
                <div className={`flex items-center mt-1 space-x-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <span className="text-xs text-gray-500">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {message.type === 'assistant' && (
                    <button
                      onClick={() => handleCopyMessage(message.content)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      title="复制消息"
                    >
                      <ClipboardDocumentIcon className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
              
              {/* 头像 */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.type === 'user' 
                  ? 'bg-blue-600 text-white order-2 ml-2' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white order-1 mr-2'
              }`}>
                {message.type === 'user' ? (
                  <UserIcon className="w-4 h-4" />
                ) : (
                  <ComputerDesktopIcon className="w-4 h-4" />
                )}
              </div>
            </div>
          ))}
          
          {/* 输入指示器 */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center mr-2">
                <ComputerDesktopIcon className="w-4 h-4" />
              </div>
              <div className="bg-gray-100 rounded-2xl rounded-bl-md p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* 建议区域 */}
        {suggestions.length > 0 && (
          <div className="px-4 py-2 border-t border-gray-200">
            <div className="flex items-center space-x-1 mb-2">
              <LightBulbIcon className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-gray-500">建议问题</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestions.slice(0, 3).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 输入区域 */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入您的问题..."
                className="w-full px-4 py-3 bg-gray-100 text-gray-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                disabled={isTyping}
              />
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="语音输入（开发中）"
                disabled
              >
                <MicrophoneIcon className="w-4 h-4" />
              </button>
            </div>
            
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-2xl transition-colors disabled:cursor-not-allowed"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </div>
          
          <div className="mt-2 text-xs text-gray-500 text-center">
            按 Enter 发送，Shift + Enter 换行
          </div>
        </div>
      </div>
    </>
  );
};
