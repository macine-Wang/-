/**
 * AI薪酬顾问助手
 * 自然语言对话，像咨询专家一样解答薪酬问题
 */

import React, { useState, useRef, useEffect } from 'react';
import { deepseekApi } from '@/services/deepseekApi';
import { 
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  PaperAirplaneIcon,
  LightBulbIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  CheckCircleIcon
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
      content: '您好！我是您的AI薪酬顾问助手。我可以帮您解答薪酬管理相关的问题，提供专业建议和最佳实践。请问有什么可以为您服务的吗？',
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 快速问题模板
  const quickQuestions: QuickQuestion[] = [
    {
      id: 'salary_structure',
      category: '薪酬设计',
      question: '如何设计科学的薪酬结构？',
      icon: ChartBarIcon
    },
    {
      id: 'market_analysis',
      category: '市场分析',
      question: '如何进行薪酬市场调研？',
      icon: DocumentTextIcon
    },
    {
      id: 'performance_pay',
      category: '绩效薪酬',
      question: '如何建立绩效与薪酬的关联？',
      icon: SparklesIcon
    },
    {
      id: 'budget_allocation',
      category: '预算管理',
      question: '薪酬预算应该如何合理分配？',
      icon: LightBulbIcon
    },
    {
      id: 'retention_strategy',
      category: '人才留存',
      question: '如何通过薪酬策略留住核心人才？',
      icon: ExclamationCircleIcon
    },
    {
      id: 'compliance_check',
      category: '合规管理',
      question: '薪酬管理需要注意哪些法律风险？',
      icon: InformationCircleIcon
    }
  ];

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

      const response = await deepseekApi.salaryAdvisorChat(userMessage, conversationHistory);

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

    // 生成AI回复
    try {
      const aiResponse = await generateAIResponse(message);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('AI response error:', error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'assistant',
        content: '抱歉，我现在无法处理您的请求。请稍后再试或联系技术支持。',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
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

  return (
    <div className="bg-white min-h-screen">
      <div className="container max-w-6xl py-12">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl">
            <ChatBubbleLeftRightIcon className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-dsp-dark">AI薪酬顾问助手</h1>
            <p className="text-dsp-gray mt-1">专业薪酬咨询，智能问答解决方案</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 左侧：快速问题 */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-6">
              <h3 className="font-semibold text-dsp-dark mb-4 flex items-center">
                <LightBulbIcon className="w-5 h-5 text-purple-600 mr-2" />
                常见问题
              </h3>
              
              <div className="space-y-3">
                {quickQuestions.map((q) => {
                  const Icon = q.icon;
                  return (
                    <button
                      key={q.id}
                      onClick={() => handleQuickQuestion(q.question)}
                      className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all group"
                    >
                      <div className="flex items-start space-x-3">
                        <Icon className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs text-purple-600 font-medium mb-1">
                            {q.category}
                          </div>
                          <div className="text-sm text-dsp-dark group-hover:text-purple-700">
                            {q.question}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* 使用提示 */}
              <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">💡 使用提示</h4>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• 描述具体的薪酬管理场景</li>
                  <li>• 提供相关的背景信息</li>
                  <li>• 可以询问最佳实践和建议</li>
                  <li>• 支持多轮对话深入讨论</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 右侧：对话区域 */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-gray-200 rounded-2xl flex flex-col h-[600px]">
              {/* 聊天消息区域 */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${
                      message.type === 'user' 
                        ? 'bg-purple-600 text-white rounded-2xl rounded-br-md' 
                        : 'bg-gray-100 text-dsp-dark rounded-2xl rounded-bl-md'
                    } p-4`}>
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      
                      {/* 时间戳 */}
                      <div className={`text-xs mt-2 ${
                        message.type === 'user' ? 'text-purple-200' : 'text-dsp-gray'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </div>

                      {/* AI消息的建议 */}
                      {message.type === 'assistant' && message.suggestions && (
                        <div className="mt-4 space-y-2">
                          <div className="text-sm font-medium text-dsp-gray">您可能还想了解：</div>
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
                    </div>
                  </div>
                ))}

                {/* AI思考中 */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-dsp-dark rounded-2xl rounded-bl-md p-4 max-w-[80%]">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-sm text-dsp-gray">AI正在思考中...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* 输入区域 */}
              <div className="border-t border-gray-200 p-6">
                <div className="flex space-x-4">
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
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    disabled={isTyping}
                  />
                  <button
                    onClick={() => handleSendMessage(inputMessage)}
                    disabled={!inputMessage.trim() || isTyping}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                  >
                    <PaperAirplaneIcon className="w-4 h-4" />
                    <span>发送</span>
                  </button>
                </div>
                
                <div className="mt-3 text-xs text-dsp-gray text-center">
                  💡 提示：您可以询问薪酬设计、市场分析、绩效管理等相关问题
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部功能介绍 */}
        <div className="mt-12 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-dsp-dark mb-6 text-center">AI顾问能力</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <SparklesIcon className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <h4 className="font-medium text-dsp-dark">智能问答</h4>
              <p className="text-sm text-dsp-gray">基于专业知识库，提供精准的薪酬管理建议</p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h4 className="font-medium text-dsp-dark">方案推荐</h4>
              <p className="text-sm text-dsp-gray">结合企业情况，推荐最适合的薪酬策略</p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center">
                <div className="p-3 bg-green-100 rounded-xl">
                  <InformationCircleIcon className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <h4 className="font-medium text-dsp-dark">政策解读</h4>
              <p className="text-sm text-dsp-gray">解读最新法规政策，确保合规管理</p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <CheckCircleIcon className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <h4 className="font-medium text-dsp-dark">最佳实践</h4>
              <p className="text-sm text-dsp-gray">分享行业最佳实践和成功案例</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
