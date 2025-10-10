/**
 * 文本显示修复组件
 * 用于解决中英文显示乱码问题
 */

import React from 'react';

interface TextFixProps {
  children: React.ReactNode;
  lang?: 'zh' | 'en' | 'auto';
  className?: string;
}

export const TextFix: React.FC<TextFixProps> = ({ 
  children, 
  lang = 'auto', 
  className = '' 
}) => {
  const getLangClass = () => {
    if (lang === 'zh') return 'chinese-text';
    if (lang === 'en') return 'english-text';
    return 'fix-encoding';
  };

  return (
    <span className={`${getLangClass()} ${className}`} lang={lang === 'auto' ? undefined : lang}>
      {children}
    </span>
  );
};

export default TextFix;
