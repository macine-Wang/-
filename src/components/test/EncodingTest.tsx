/**
 * 字符编码测试组件
 * 用于验证中英文字符是否正确显示
 */

import React from 'react';

const EncodingTest: React.FC = () => {
  const testData = {
    chineseNames: [
      '张伟', '王芳', '李娜', '刘强', '陈敏', '杨洋', '黄磊', '周杰', '吴静', '徐丽'
    ],
    departments: ['技术部', '产品部', '运营部', '销售部', '市场部'],
    positions: ['软件工程师', '产品经理', '运营专员', '销售经理', '市场专员'],
    mixed: [
      'Hello 世界', 'AI智能薪酬管理', 'React前端开发', '数据分析师Data Analyst',
      '北京Beijing', '上海Shanghai', '深圳Shenzhen'
    ]
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">
        字符编码测试 Character Encoding Test
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 纯中文测试 */}
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">纯中文测试</h2>
          <div className="space-y-2">
            {testData.chineseNames.map((name, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                <span className="chinese-text">{name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 部门职位测试 */}
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">部门职位测试</h2>
          <div className="space-y-2">
            {testData.departments.map((dept, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="chinese-text font-medium">{dept}</span>
                <span className="chinese-text text-gray-600">{testData.positions[index]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 中英文混合测试 */}
        <div className="border rounded-lg p-4 md:col-span-2">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">中英文混合测试</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testData.mixed.map((text, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded">
                <span className="fix-encoding">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 特殊字符测试 */}
        <div className="border rounded-lg p-4 md:col-span-2">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">特殊字符测试</h2>
          <div className="space-y-2">
            <div className="p-2 bg-yellow-50 rounded">
              <strong>货币符号:</strong> ¥12,345.67 | $1,234.56 | €987.65
            </div>
            <div className="p-2 bg-green-50 rounded">
              <strong>标点符号:</strong> 【重要】"引号测试"『书名号』（括号测试）
            </div>
            <div className="p-2 bg-blue-50 rounded">
              <strong>数字混合:</strong> 2024年1月1日 | Version 1.0.0 | 第123页
            </div>
            <div className="p-2 bg-purple-50 rounded">
              <strong>特殊符号:</strong> ★☆●○■□▲△▼▽→←↑↓
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">测试说明</h3>
        <ul className="text-sm space-y-1 text-gray-700">
          <li>• 如果所有文字都能正常显示，说明字符编码修复成功</li>
          <li>• 如果出现乱码或方块字符，说明还需要进一步调整</li>
          <li>• 中文字体应使用 Noto Sans SC 或系统默认中文字体</li>
          <li>• 英文字体应使用 Inter 字体</li>
        </ul>
      </div>
    </div>
  );
};

export default EncodingTest;
