/**
 * MARC 页脚组件
 */

import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-200 py-12 mt-16">
      <div className="container">
        <div className="text-center space-y-4">
          
          <div className="text-sm text-dsp-gray">
          AI智能薪酬管理系统 Copyright© 2025 保留所有权利.
          </div>
          
          <div className="text-xs text-dsp-gray">
            Powered by AI-driven salary analysis
          </div>
        </div>
      </div>
    </footer>
  );
};