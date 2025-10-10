/**
 * 全局搜索组件
 * 支持模糊匹配和智能建议
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  MagnifyingGlassIcon, 
  XMarkIcon,
  CommandLineIcon,
  DocumentTextIcon,
  UserIcon,
  BriefcaseIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: 'page' | 'feature' | 'action' | 'help';
  icon: React.ComponentType<{ className?: string }>;
  path?: string;
  action?: () => void;
  keywords: string[];
}

// 搜索数据库
const searchDatabase: SearchResult[] = [
  // 页面
  {
    id: 'jobseeker-center',
    title: '求职者中心',
    description: '个人职业发展AI助手',
    category: 'page',
    icon: UserIcon,
    path: '/jobseeker',
    keywords: ['求职', '个人', '职业', '发展', '薪酬查询', 'jobseeker', 'career']
  },
  {
    id: 'hr-center',
    title: 'HR中心',
    description: '企业薪酬管理专家',
    category: 'page',
    icon: BriefcaseIcon,
    path: '/hr',
    keywords: ['HR', '企业', '薪酬管理', '招聘', 'human resource']
  },
  {
    id: 'salary-query',
    title: '薪酬查询',
    description: '查询职位薪酬范围和市场行情',
    category: 'feature',
    icon: MagnifyingGlassIcon,
    path: '/query',
    keywords: ['薪酬', '查询', '工资', '市场行情', 'salary', 'query']
  },
  {
    id: 'career-planning',
    title: '职业规划助手',
    description: 'AI分析个人背景，制定职业发展路径',
    category: 'feature',
    icon: ChartBarIcon,
    path: '/career-planning',
    keywords: ['职业规划', '发展路径', '技能分析', 'career', 'planning']
  },
  {
    id: 'salary-diagnosis',
    title: '智能薪酬诊断',
    description: '一键诊断薪酬健康度，AI生成优化建议',
    category: 'feature',
    icon: ChartBarIcon,
    path: '/hr/diagnosis',
    keywords: ['诊断', '薪酬健康', '优化建议', 'diagnosis', 'health']
  },
  {
    id: 'jd-writer',
    title: '智能JD写作助手',
    description: 'AI生成职位描述，支持批量处理',
    category: 'feature',
    icon: DocumentTextIcon,
    path: '/hr/smart-jd-writer',
    keywords: ['JD', '职位描述', 'AI写作', 'job description', 'writer']
  }
];

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // 搜索逻辑
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSelectedIndex(0);
      return;
    }

    const searchQuery = query.toLowerCase();
    const filteredResults = searchDatabase.filter(item => {
      return (
        item.title.toLowerCase().includes(searchQuery) ||
        item.description.toLowerCase().includes(searchQuery) ||
        item.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery))
      );
    });

    // 按相关性排序
    const sortedResults = filteredResults.sort((a, b) => {
      const aScore = getRelevanceScore(a, searchQuery);
      const bScore = getRelevanceScore(b, searchQuery);
      return bScore - aScore;
    });

    setResults(sortedResults.slice(0, 8)); // 限制显示8个结果
    setSelectedIndex(0);
  }, [query]);

  // 计算相关性分数
  const getRelevanceScore = (item: SearchResult, query: string): number => {
    let score = 0;
    
    // 标题完全匹配得分最高
    if (item.title.toLowerCase() === query) score += 100;
    else if (item.title.toLowerCase().includes(query)) score += 50;
    
    // 描述匹配
    if (item.description.toLowerCase().includes(query)) score += 20;
    
    // 关键词匹配
    item.keywords.forEach(keyword => {
      if (keyword.toLowerCase() === query) score += 30;
      else if (keyword.toLowerCase().includes(query)) score += 10;
    });
    
    return score;
  };

  // 处理键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            handleResultClick(results[selectedIndex]);
          }
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  // 聚焦输入框
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // 处理结果点击
  const handleResultClick = (result: SearchResult) => {
    if (result.action) {
      result.action();
    } else if (result.path) {
      navigate(result.path);
    }
    onClose();
    setQuery('');
  };

  // 获取分类图标颜色
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'page': return 'text-blue-500';
      case 'feature': return 'text-green-500';
      case 'action': return 'text-purple-500';
      case 'help': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 背景遮罩 */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-200"
        onClick={onClose}
      />
      
      {/* 搜索面板 */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-20">
        <div className="w-full max-w-2xl mx-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden animate-in slide-in-from-top-4 duration-200">
            {/* 搜索输入框 */}
            <div className="flex items-center px-6 py-4 border-b border-neutral-200">
              <MagnifyingGlassIcon className="w-5 h-5 text-neutral-400 mr-3" />
              <input
                ref={inputRef}
                type="text"
                placeholder="搜索功能、页面或帮助..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-neutral-900 placeholder-neutral-500 outline-none text-lg"
              />
              <button
                onClick={onClose}
                className="ml-3 p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            
            {/* 搜索结果 */}
            {results.length > 0 && (
              <div className="max-h-96 overflow-y-auto">
                {results.map((result, index) => {
                  const Icon = result.icon;
                  return (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className={`
                        w-full flex items-center px-6 py-4 text-left transition-colors
                        ${index === selectedIndex 
                          ? 'bg-blue-50' 
                          : 'hover:bg-neutral-50'
                        }
                      `}
                    >
                      <div className={`p-2 rounded-lg mr-4 ${getCategoryColor(result.category)} bg-current/10`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-neutral-900">
                          {result.title}
                        </div>
                        <div className="text-sm text-neutral-600">
                          {result.description}
                        </div>
                      </div>
                      <div className="text-xs text-neutral-400 ml-4">
                        {result.category === 'page' && '页面'}
                        {result.category === 'feature' && '功能'}
                        {result.category === 'action' && '操作'}
                        {result.category === 'help' && '帮助'}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
            
            {/* 空状态 */}
            {query && results.length === 0 && (
              <div className="px-6 py-8 text-center text-neutral-500">
                <MagnifyingGlassIcon className="w-8 h-8 mx-auto mb-3 opacity-50" />
                <div className="font-medium mb-1">未找到相关结果</div>
                <div className="text-sm">尝试使用不同的关键词搜索</div>
              </div>
            )}
            
            {/* 快捷键提示 */}
            {!query && (
              <div className="px-6 py-4 border-t border-neutral-200">
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <kbd className="px-2 py-1 bg-neutral-100 rounded text-xs mr-1">↑↓</kbd>
                      导航
                    </span>
                    <span className="flex items-center">
                      <kbd className="px-2 py-1 bg-neutral-100 rounded text-xs mr-1">Enter</kbd>
                      选择
                    </span>
                    <span className="flex items-center">
                      <kbd className="px-2 py-1 bg-neutral-100 rounded text-xs mr-1">Esc</kbd>
                      关闭
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CommandLineIcon className="w-4 h-4 mr-1" />
                    <span>全局搜索</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
