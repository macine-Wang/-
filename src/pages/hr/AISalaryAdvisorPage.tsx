/**
 * AI薪酬顾问助手
 * 自然语言对话，像咨询专家一样解答薪酬问题
 */

import React, { useState, useRef, useEffect } from 'react';
import { doubaoApi } from '@/services/doubaoApi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  PaperAirplaneIcon,
  LightBulbIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ClipboardDocumentIcon,
  PencilIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  attachments?: ChatAttachment[];
}

interface ChatAttachment {
  type: 'chart' | 'table' | 'document';
  title: string;
  data: any;
}

interface QuickQuestion {
  id: string;
  category: string;
  question: string;
  icon: React.ComponentType<any>;
}

export const AISalaryAdvisorPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      type: 'assistant',
      content: '您好！我是基于豆包大模型的AI薪酬顾问助手。我具备丰富的薪酬管理知识和实践经验，可以为您提供专业的薪酬咨询服务。\n\n我可以帮助您：\n• 薪酬体系设计与优化\n• 市场薪酬调研分析\n• 绩效薪酬方案制定\n• 薪酬预算管理\n• 人才激励策略\n• 薪酬合规指导\n\n请告诉我您遇到的薪酬管理挑战，我将为您提供专业建议！',
      timestamp: new Date(),
      suggestions: [
        '如何制定公平的薪酬体系？',
        '我们公司的薪酬竞争力如何？',
        '如何进行有效的调薪决策？',
        '薪酬预算应该如何分配？'
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 快速问题模板
  const quickQuestions: QuickQuestion[] = [
    {
      id: 'salary_table_demo',
      category: '表格演示',
      question: '请为我的公司设计一个完整的薪酬等级表格，包含P6-P9等级',
      icon: ChartBarIcon
    },
    {
      id: 'salary_structure',
      category: '薪酬设计',
      question: '如何设计科学的薪酬结构？',
      icon: DocumentTextIcon
    },
    {
      id: 'market_analysis',
      category: '市场分析',
      question: '如何进行薪酬市场调研？',
      icon: SparklesIcon
    },
    {
      id: 'performance_pay',
      category: '绩效薪酬',
      question: '如何建立绩效与薪酬的关联？',
      icon: LightBulbIcon
    },
    {
      id: 'budget_allocation',
      category: '预算管理',
      question: '薪酬预算应该如何合理分配？',
      icon: ExclamationCircleIcon
    },
    {
      id: 'compliance_check',
      category: '合规管理',
      question: '薪酬管理需要注意哪些法律风险？',
      icon: InformationCircleIcon
    }
  ];

  // 保持页面在顶部位置
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 聊天容器滚动到底部（仅在聊天容器内滚动）
  const scrollChatToBottom = () => {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  };

  // 页面初始化时确保滚动到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // AI回复生成（使用真实的DeepSeek API）
  const generateAIResponse = async (userMessage: string): Promise<ChatMessage> => {
    try {
      // 获取对话历史（最近5条消息作为上下文）
      const conversationHistory = messages
        .slice(-5)
        .map(msg => ({
          role: msg.type as 'user' | 'assistant',
          content: msg.content
        }));

      const response = await doubaoApi.salaryAdvisorChat(userMessage, conversationHistory);

      return {
        id: Date.now().toString(),
        type: 'assistant',
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions
      };
    } catch (error) {
      console.error('AI回复生成失败:', error);
      
      // 如果API调用失败，返回友好的错误消息
      return {
        id: Date.now().toString(),
        type: 'assistant',
        content: `抱歉，AI服务暂时不可用。请稍后重试，或者您可以：

1. 检查网络连接是否正常
2. 稍后再次尝试提问
3. 如果问题持续存在，请联系技术支持

在等待期间，您可以浏览我们的常见问题或使用其他功能模块。`,
        timestamp: new Date(),
        suggestions: [
          '如何制定薪酬策略？',
          '薪酬调研的方法有哪些？',
          '如何设计绩效薪酬？'
        ]
      };
    }
  };

  // 发送消息
  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    // 添加用户消息
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // 确保页面保持在顶部，同时让聊天容器显示新消息
    setTimeout(() => {
      scrollToTop();
      scrollChatToBottom();
    }, 100);

    // 生成AI回复
    try {
      const aiResponse = await generateAIResponse(message);
      setMessages(prev => [...prev, aiResponse]);
      // AI回复后也保持这种行为
      setTimeout(() => {
        scrollToTop();
        scrollChatToBottom();
      }, 100);
    } catch (error) {
      console.error('AI response error:', error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'assistant',
        content: '抱歉，我现在无法处理您的请求。请稍后再试或联系技术支持。',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setTimeout(() => {
        scrollToTop();
        scrollChatToBottom();
      }, 100);
    } finally {
      setIsTyping(false);
    }
  };

  // 处理快速问题点击
  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question);
  };

  // 处理建议点击
  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  // 复制消息内容
  const handleCopyMessage = async (messageId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      // 2秒后清除复制状态
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  // 编辑消息
  const handleEditMessage = (messageId: string, content: string) => {
    // 将内容填入输入框
    setInputMessage(content);
    // 移除该消息及其后的所有消息
    setMessages(prev => {
      const msgIndex = prev.findIndex(m => m.id === messageId);
      return prev.slice(0, msgIndex);
    });
  };

  // 重新生成回复
  const handleRegenerateResponse = async (messageId: string) => {
    // 找到要重新生成的消息
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) return;

    // 找到对应的用户消息
    const userMessageIndex = messageIndex - 1;
    if (userMessageIndex < 0 || messages[userMessageIndex].type !== 'user') return;

    const userMessage = messages[userMessageIndex].content;

    // 移除原来的AI回复
    setMessages(prev => prev.slice(0, messageIndex));
    setIsTyping(true);

    // 重新生成回复
    try {
      const aiResponse = await generateAIResponse(userMessage);
      setMessages(prev => [...prev, aiResponse]);
      setTimeout(() => {
        scrollToTop();
        scrollChatToBottom();
      }, 100);
    } catch (error) {
      console.error('重新生成失败:', error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'assistant',
        content: '抱歉，重新生成失败。请稍后再试。',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 via-white to-pink-50 min-h-screen">
      <div className="container max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl shadow-lg">
                <ChatBubbleLeftRightIcon className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            AI薪酬顾问助手
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            专业薪酬咨询，智能问答解决方案 • 24/7在线服务 • 专业建议与最佳实践
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 左侧：快速问题 */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm border border-purple-200 rounded-2xl p-6 sticky top-6 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg mr-3">
                  <LightBulbIcon className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">常见问题</h3>
              </div>
              
              <div className="space-y-3">
                {quickQuestions.map((q) => {
                  const Icon = q.icon;
                  return (
                    <button
                      key={q.id}
                      onClick={() => handleQuickQuestion(q.question)}
                      className="w-full text-left p-4 bg-gradient-to-r from-white to-purple-50/50 border border-purple-200/50 rounded-xl hover:border-purple-300 hover:shadow-md hover:scale-[1.02] transition-all duration-300 group"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex-shrink-0">
                          <Icon className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs text-purple-600 font-semibold mb-2 uppercase tracking-wider">
                            {q.category}
                          </div>
                          <div className="text-sm text-gray-900 group-hover:text-purple-700 font-medium leading-relaxed">
                            {q.question}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* 使用提示 */}
              <div className="mt-8 p-5 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200/50 rounded-xl">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-2">💡</span>
                  <h4 className="font-bold text-purple-900">使用提示</h4>
                </div>
                <ul className="text-sm text-purple-800 space-y-2">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>描述具体的薪酬管理场景</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>提供相关的背景信息</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>可以询问最佳实践和建议</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>支持多轮对话深入讨论</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 右侧：对话区域 */}
          <div className="lg:col-span-3">
            <div className="bg-white/90 backdrop-blur-sm border border-purple-200 rounded-2xl flex flex-col h-[700px] shadow-xl">
              {/* 聊天标题栏 */}
              <div className="p-6 border-b border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <h3 className="font-bold text-gray-900 text-lg">AI助手在线</h3>
                    <div className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full">
                      <span className="text-xs font-semibold text-blue-800">豆包模型</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">实时响应 • 专业薪酬咨询</div>
                </div>
              </div>
              
              {/* 聊天消息区域 */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6" id="chat-container">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] ${
                      message.type === 'user' 
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-2xl rounded-br-md shadow-lg' 
                        : 'bg-gradient-to-r from-white to-gray-50 text-gray-900 rounded-2xl rounded-bl-md shadow-md border border-gray-200'
                    } p-5`}>
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            table: ({ children }) => (
                              <table className={`min-w-full border-collapse my-4 ${
                                message.type === 'user' 
                                  ? 'border border-purple-300' 
                                  : 'border border-gray-300'
                              }`}>
                                {children}
                              </table>
                            ),
                            thead: ({ children }) => (
                              <thead className={message.type === 'user' ? 'bg-purple-100' : 'bg-gray-50'}>
                                {children}
                              </thead>
                            ),
                            th: ({ children }) => (
                              <th className={`px-3 py-2 text-left font-semibold ${
                                message.type === 'user' 
                                  ? 'border border-purple-300 text-purple-100' 
                                  : 'border border-gray-300 text-gray-900'
                              }`}>
                                {children}
                              </th>
                            ),
                            td: ({ children }) => (
                              <td className={`px-3 py-2 ${
                                message.type === 'user' 
                                  ? 'border border-purple-300 text-purple-50' 
                                  : 'border border-gray-300 text-gray-700'
                              }`}>
                                {children}
                              </td>
                            ),
                            // 其他元素样式
                            p: ({ children }) => <p className="mb-2">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc list-inside mb-2">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal list-inside mb-2">{children}</ol>,
                            li: ({ children }) => <li className="mb-1">{children}</li>,
                            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                            em: ({ children }) => <em className="italic">{children}</em>,
                            h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-base font-semibold mb-2">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-sm font-semibold mb-2">{children}</h3>,
                            code: ({ children }) => (
                              <code className={`px-1 py-0.5 rounded text-xs ${
                                message.type === 'user' 
                                  ? 'bg-purple-800 text-purple-100' 
                                  : 'bg-gray-200 text-gray-800'
                              }`}>
                                {children}
                              </code>
                            ),
                            pre: ({ children }) => (
                              <pre className={`p-3 rounded my-2 text-xs overflow-x-auto ${
                                message.type === 'user' 
                                  ? 'bg-purple-800 text-purple-100' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {children}
                              </pre>
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                      
                      {/* 时间戳 */}
                      <div className={`text-xs mt-2 ${
                        message.type === 'user' ? 'text-purple-200' : 'text-gray-600'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </div>

                      {/* AI消息的建议 */}
                      {message.type === 'assistant' && message.suggestions && (
                        <div className="mt-4 space-y-2">
                          <div className="text-sm font-medium text-gray-600">您可能还想了解：</div>
                          {message.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="block w-full text-left text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 p-2 rounded border border-purple-200 transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* AI消息的操作按钮 */}
                      {message.type === 'assistant' && (
                        <div className="mt-4 pt-3 border-t border-gray-200 flex items-center space-x-2">
                          <button
                            onClick={() => handleCopyMessage(message.id, message.content)}
                            className={`flex items-center space-x-1 px-3 py-1.5 text-xs rounded-md transition-colors ${
                              copiedMessageId === message.id
                                ? 'text-green-600 bg-green-50'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                            title="复制回答"
                          >
                            <ClipboardDocumentIcon className="w-4 h-4" />
                            <span>{copiedMessageId === message.id ? '已复制' : '复制'}</span>
                          </button>
                          
                          <button
                            onClick={() => handleEditMessage(message.id, message.content)}
                            className="flex items-center space-x-1 px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                            title="编辑回答"
                          >
                            <PencilIcon className="w-4 h-4" />
                            <span>编辑</span>
                          </button>
                          
                          <button
                            onClick={() => handleRegenerateResponse(message.id)}
                            className={`flex items-center space-x-1 px-3 py-1.5 text-xs rounded-md transition-colors ${
                              isTyping
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                            title="重新生成"
                            disabled={isTyping}
                          >
                            <ArrowPathIcon className={`w-4 h-4 ${isTyping ? 'animate-spin' : ''}`} />
                            <span>{isTyping ? '生成中...' : '重新生成'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* AI思考中 */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 text-gray-900 rounded-2xl rounded-bl-md p-5 max-w-[85%] shadow-md">
                      <div className="flex items-center space-x-3">
                        <div className="flex space-x-1">
                          <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce"></div>
                          <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                        <span className="text-sm text-gray-700 font-medium">AI正在思考中...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* 输入区域 */}
              <div className="border-t border-purple-100 p-6 bg-gradient-to-r from-white to-purple-50/30 rounded-b-2xl">
                <div className="flex space-x-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(inputMessage);
                        }
                      }}
                      placeholder="请输入您的薪酬管理问题..."
                      className="w-full px-5 py-4 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-gray-900 bg-white shadow-sm transition-all duration-300 placeholder:text-gray-400"
                      disabled={isTyping}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSendMessage(inputMessage)}
                    disabled={!inputMessage.trim() || isTyping}
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                  >
                    <PaperAirplaneIcon className="w-5 h-5" />
                    <span className="font-semibold">发送</span>
                  </button>
                </div>
                
                <div className="mt-4 text-sm text-gray-600 text-center bg-purple-50/50 rounded-lg p-3">
                  <span className="inline-flex items-center">
                    💡 <span className="ml-2">您可以询问薪酬设计、市场分析、绩效管理等相关问题</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部功能介绍 */}
        <div className="mt-12 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-8">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">AI顾问能力</h3>
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full">
              <span className="text-sm font-semibold text-blue-800">Powered by 豆包大模型</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <SparklesIcon className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <h4 className="font-medium text-gray-900">智能问答</h4>
              <p className="text-sm text-gray-600">基于专业知识库，提供精准的薪酬管理建议</p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h4 className="font-medium text-gray-900">方案推荐</h4>
              <p className="text-sm text-gray-600">结合企业情况，推荐最适合的薪酬策略</p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center">
                <div className="p-3 bg-green-100 rounded-xl">
                  <InformationCircleIcon className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <h4 className="font-medium text-gray-900">政策解读</h4>
              <p className="text-sm text-gray-600">解读最新法规政策，确保合规管理</p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <CheckCircleIcon className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <h4 className="font-medium text-gray-900">最佳实践</h4>
              <p className="text-sm text-gray-600">分享行业最佳实践和成功案例</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
