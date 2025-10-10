/**
 * AI助手触发按钮
 * 悬浮在页面右下角，提供快速访问AI助手的入口
 */

import React, { useState, useEffect } from 'react';
import {
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { AIAssistant } from './AIAssistant';

interface AIAssistantTriggerProps {
  className?: string;
}

export const AIAssistantTrigger: React.FC<AIAssistantTriggerProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // 监听滚动，决定是否显示按钮
  useEffect(() => {
    let scrollTimer: NodeJS.Timeout;
    
    const handleScroll = () => {
      setIsVisible(false);
      
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        setIsVisible(true);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimer);
    };
  }, []);

  // 键盘快捷键支持 (Alt + A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 模拟新消息提醒（可以连接到实际的通知系统）
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setHasNewMessage(true);
      }, 30000); // 30秒后显示提醒

      return () => clearTimeout(timer);
    } else {
      setHasNewMessage(false);
    }
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(prev => !prev);
    setHasNewMessage(false);
  };

  return (
    <>
      {/* 触发按钮 */}
      <div
        className={`fixed bottom-6 right-6 z-40 transition-all duration-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-80'
        } ${className}`}
      >
        <button
          onClick={handleToggle}
          className={`group relative w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/30 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
          title={isOpen ? '关闭系统智能助手 (Alt+A)' : '打开系统智能助手 (Alt+A)'}
          aria-label={isOpen ? '关闭系统智能助手' : '打开系统智能助手'}
        >
          {/* 背景动画效果 */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
          
          {/* 图标 */}
          <div className="relative z-10 flex items-center justify-center w-full h-full">
            {isOpen ? (
              <XMarkIcon className="w-8 h-8 transition-transform duration-300" />
            ) : (
              <div className="relative">
                <ChatBubbleLeftRightIcon className="w-8 h-8 transition-transform duration-300 group-hover:scale-110" />
                
                {/* AI指示器 */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                  <SparklesIcon className="w-2.5 h-2.5 text-yellow-800" />
                </div>
              </div>
            )}
          </div>

          {/* 新消息提醒 */}
          {hasNewMessage && !isOpen && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
              !
            </div>
          )}

          {/* 波纹效果 */}
          {!isOpen && (
            <div className="absolute inset-0 rounded-full border-2 border-blue-400 opacity-0 group-hover:opacity-100 animate-ping"></div>
          )}
        </button>

        {/* 提示文字 */}
        {!isOpen && (
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-gray-900 dark:bg-gray-700 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
              AI智能助手
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900 dark:border-t-gray-700"></div>
            </div>
          </div>
        )}
      </div>


      {/* AI助手组件 */}
      <AIAssistant isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

// 添加CSS动画类
const styles = `
  @keyframes fade-in-up {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in-up {
    animation: fade-in-up 0.3s ease-out forwards;
  }
`;

// 注入样式
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
