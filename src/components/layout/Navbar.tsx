/**
 * ISMT 导航栏组件
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* DSP Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="flex items-center">
              <span className="font-mono text-xl font-bold tracking-widest text-dsp-dark relative overflow-hidden">
                {'AI智能薪酬管理工具'.split('').map((letter, index) => (
                  <span 
                    key={index}
                    className="inline-block transition-all duration-300 hover:scale-110 hover:text-dsp-red"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      animation: 'pulse-letter 2s ease-in-out infinite'
                    }}
                  >
                    {letter}
                  </span>
                ))}
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-dsp-red transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </span>
              <div className="ml-2 w-2 h-2 rounded-full bg-dsp-red animate-pulse"></div>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-dsp-dark' 
                  : 'text-dsp-gray hover:text-dsp-dark'
              }`}
            >
              首页
            </Link>
            
            {/* 求职者模块 */}
            <div className="flex items-center space-x-1">
              <span className="text-xs text-blue-600">👤</span>
              <Link
                to="/jobseeker"
                className={`text-sm font-medium transition-colors ${
                  location.pathname.startsWith('/jobseeker') || location.pathname === '/query' || location.pathname === '/results'
                    ? 'text-blue-600 font-semibold' 
                    : 'text-dsp-gray hover:text-blue-600'
                }`}
              >
                求职者中心
              </Link>
            </div>

            {/* HR模块 */}
            <div className="flex items-center space-x-1">
              <span className="text-xs text-dsp-red">🏢</span>
              <Link
                to="/hr"
                className={`text-sm font-medium transition-colors ${
                  location.pathname.startsWith('/hr')
                    ? 'text-dsp-red font-semibold' 
                    : 'text-dsp-gray hover:text-dsp-red'
                }`}
              >
                HR中心
              </Link>
            </div>

                    {/* 技术架构 */}
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-purple-600">🏗️</span>
                      <Link
                        to="/tech-architecture"
                        className={`text-sm font-medium transition-colors ${
                          location.pathname === '/tech-architecture'
                            ? 'text-purple-600 font-semibold' 
                            : 'text-dsp-gray hover:text-purple-600'
                        }`}
                      >
                        技术架构
                      </Link>
                    </div>
          </div>
        </div>
      </div>
    </nav>
  );
};