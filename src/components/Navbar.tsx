/**
 * 导航栏组件 - 集成全局搜索
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { GlobalSearch } from './GlobalSearch';

export const Navbar: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // 全局键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K 打开全局搜索
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 关闭移动菜单当路由改变时
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { path: '/', label: '首页' },
    { path: '/jobseeker', label: '求职者中心' },
    { path: '/hr', label: 'HR中心' },
    { path: '/query', label: '薪酬查询' }
  ];

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-neutral-200">
        <div className="container max-w-7xl">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-3 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">I</span>
                </div>
              </div>
              <div>
                <div className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  ISMT
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400 -mt-1">
                  智能薪酬助手
                </div>
              </div>
            </Link>

            {/* 桌面端导航链接 */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActivePath(link.path)
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-neutral-600 hover:text-primary-600 hover:bg-neutral-100'
                    }
                  `}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* 工具栏 */}
            <div className="flex items-center space-x-2">
              {/* 全局搜索按钮 */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-neutral-100 text-neutral-500 rounded-lg hover:bg-neutral-200 transition-colors text-sm"
                title="全局搜索 (Ctrl+K)"
              >
                <MagnifyingGlassIcon className="w-4 h-4" />
                <span>搜索...</span>
                <kbd className="hidden lg:inline-block px-2 py-1 bg-neutral-200 text-xs rounded">
                  ⌘K
                </kbd>
              </button>

              {/* 移动端搜索按钮 */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="sm:hidden p-2 text-neutral-600 hover:text-primary-600 hover:bg-neutral-100 rounded-lg transition-colors"
                title="搜索"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>


              {/* 移动端菜单按钮 */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-neutral-600 hover:text-primary-600 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="w-5 h-5" />
                ) : (
                  <Bars3Icon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* 移动端菜单 */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-neutral-200 bg-white">
              <div className="py-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`
                      block px-4 py-3 text-base font-medium rounded-lg transition-colors
                      ${isActivePath(link.path)
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-neutral-600 hover:text-primary-600 hover:bg-neutral-100'
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                ))}
                
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* 全局搜索 */}
      <GlobalSearch 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  );
};
