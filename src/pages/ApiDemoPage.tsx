/**
 * API集成演示页面
 * 展示DeepSeek API的集成效果和使用方法
 */

import React, { useState } from 'react';
import { deepseekApi } from '@/services/deepseekApi';
import { 
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  CurrencyDollarIcon,
  ScaleIcon,
  ChartBarIcon,
  PlayIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface ApiTestResult {
  success: boolean;
  response: any;
  error?: string;
  duration: number;
}

export const ApiDemoPage: React.FC = () => {
  const [testResults, setTestResults] = useState<Map<string, ApiTestResult>>(new Map());
  const [isTestingAll, setIsTestingAll] = useState(false);

  // API测试用例
  const testCases = [
    {
      id: 'salary_advisor',
      name: 'AI薪酬顾问',
      description: '测试智能薪酬咨询对话功能',
      icon: ChatBubbleLeftRightIcon,
      test: async () => {
        const startTime = Date.now();
        const response = await deepseekApi.salaryAdvisorChat('如何设计公平的薪酬体系？');
        return {
          success: true,
          response: response.content.substring(0, 200) + '...',
          duration: Date.now() - startTime
        };
      }
    },
    {
      id: 'salary_calculation',
      name: '薪酬计算器',
      description: '测试基于背景的薪酬计算功能',
      icon: CurrencyDollarIcon,
      test: async () => {
        const startTime = Date.now();
        const response = await deepseekApi.salaryCalculation({
          position: '前端工程师',
          location: '北京',
          experience: '3年',
          education: '本科',
          industry: '互联网',
          skills: ['React', 'TypeScript', 'Node.js'],
          companySize: '中型企业',
          jobLevel: '中级'
        });
        return {
          success: true,
          response: {
            analysis: response.analysis.substring(0, 150) + '...',
            salaryRange: response.salaryRange
          },
          duration: Date.now() - startTime
        };
      }
    },
    {
      id: 'fairness_analysis',
      name: '公平性检测',
      description: '测试薪酬公平性分析功能',
      icon: ScaleIcon,
      test: async () => {
        const startTime = Date.now();
        const response = await deepseekApi.fairnessAnalysis({
          employees: [
            { position: '工程师', department: '技术部', gender: '男', experience: 3, salary: 25000, performance: 4.5 },
            { position: '工程师', department: '技术部', gender: '女', experience: 3, salary: 22000, performance: 4.3 }
          ],
          analysisType: ['性别薪酬差距分析', '同工同酬检测']
        });
        return {
          success: true,
          response: {
            analysis: response.analysis.substring(0, 150) + '...',
            overallScore: response.overallScore
          },
          duration: Date.now() - startTime
        };
      }
    },
    {
      id: 'competitiveness_analysis',
      name: '竞争力分析',
      description: '测试薪酬竞争力评估功能',
      icon: ChartBarIcon,
      test: async () => {
        const startTime = Date.now();
        const response = await deepseekApi.competitivenessAnalysis({
          position: '产品经理',
          currentSalary: 28000,
          marketData: { p25: 25000, p50: 30000, p75: 35000, p90: 42000 },
          industry: '互联网',
          location: '上海'
        });
        return {
          success: true,
          response: {
            analysis: response.analysis.substring(0, 150) + '...',
            competitivenessScore: response.competitivenessScore
          },
          duration: Date.now() - startTime
        };
      }
    }
  ];

  // 执行单个测试
  const runSingleTest = async (testCase: typeof testCases[0]) => {
    try {
      const result = await testCase.test();
      const newResults = new Map(testResults);
      newResults.set(testCase.id, result);
      setTestResults(newResults);
    } catch (error) {
      const newResults = new Map(testResults);
      newResults.set(testCase.id, {
        success: false,
        response: null,
        error: error instanceof Error ? error.message : '未知错误',
        duration: 0
      });
      setTestResults(newResults);
    }
  };

  // 执行所有测试
  const runAllTests = async () => {
    setIsTestingAll(true);
    setTestResults(new Map());

    for (const testCase of testCases) {
      await runSingleTest(testCase);
      // 添加延迟避免API限流
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setIsTestingAll(false);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="container max-w-6xl py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl">
              <SparklesIcon className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-semibold text-dsp-dark">DeepSeek API 集成演示</h1>
          </div>
          <p className="text-dsp-gray max-w-2xl mx-auto">
            展示系统中各个AI功能的真实API调用效果，验证DeepSeek API的集成状态
          </p>
        </div>

        {/* API信息卡片 */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6 mb-8">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-blue-600 rounded-lg">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-dsp-dark mb-2">API集成状态</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-dsp-gray">API密钥:</span>
                  <span className="ml-2 font-mono text-blue-600">sk-aca2...133d</span>
                </div>
                <div>
                  <span className="text-dsp-gray">服务地址:</span>
                  <span className="ml-2 font-mono text-blue-600">api.deepseek.com</span>
                </div>
                <div>
                  <span className="text-dsp-gray">模型版本:</span>
                  <span className="ml-2 font-mono text-blue-600">deepseek-chat</span>
                </div>
                <div>
                  <span className="text-dsp-gray">集成功能:</span>
                  <span className="ml-2 text-green-600 font-medium">4个核心模块</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 测试控制面板 */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold text-dsp-dark">API功能测试</h2>
          <button
            onClick={runAllTests}
            disabled={isTestingAll}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            <PlayIcon className="w-4 h-4" />
            <span>{isTestingAll ? '测试中...' : '运行所有测试'}</span>
          </button>
        </div>

        {/* 测试用例列表 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {testCases.map((testCase) => {
            const Icon = testCase.icon;
            const result = testResults.get(testCase.id);
            
            return (
              <div key={testCase.id} className="bg-white border border-gray-200 rounded-2xl p-6">
                <div className="space-y-4">
                  {/* 测试用例头部 */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Icon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-dsp-dark">{testCase.name}</h3>
                        <p className="text-sm text-dsp-gray">{testCase.description}</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => runSingleTest(testCase)}
                      disabled={isTestingAll}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
                    >
                      测试
                    </button>
                  </div>

                  {/* 测试结果 */}
                  {result && (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        {result.success ? (
                          <CheckCircleIcon className="w-5 h-5 text-green-600" />
                        ) : (
                          <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                        )}
                        <span className={`font-medium ${
                          result.success ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {result.success ? '测试成功' : '测试失败'}
                        </span>
                        <span className="text-xs text-dsp-gray">
                          ({result.duration}ms)
                        </span>
                      </div>

                      {result.success ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="text-sm text-green-800">
                            <strong>响应结果:</strong>
                          </div>
                          <pre className="text-xs text-green-700 mt-2 whitespace-pre-wrap">
                            {JSON.stringify(result.response, null, 2)}
                          </pre>
                        </div>
                      ) : (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <div className="text-sm text-red-800">
                            <strong>错误信息:</strong>
                          </div>
                          <div className="text-xs text-red-700 mt-1">
                            {result.error}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 使用说明 */}
        <div className="mt-12 bg-gray-50 rounded-2xl p-8">
          <h3 className="text-lg font-semibold text-dsp-dark mb-4">API集成说明</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-dsp-dark mb-2">已集成功能</h4>
              <ul className="space-y-2 text-sm text-dsp-gray">
                <li>• AI薪酬顾问助手 - 自然语言对话咨询</li>
                <li>• 职业规划助手 - 个性化发展建议</li>
                <li>• 薪酬计算器 - 智能薪酬范围计算</li>
                <li>• 公平性检测器 - 薪酬公平性分析</li>
                <li>• 动态调薪引擎 - 智能调薪方案生成</li>
                <li>• 竞争力雷达 - 市场竞争力评估</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-dsp-dark mb-2">技术特点</h4>
              <ul className="space-y-2 text-sm text-dsp-gray">
                <li>• 统一的API服务层封装</li>
                <li>• 错误处理和降级策略</li>
                <li>• 结构化数据提取</li>
                <li>• 上下文感知对话</li>
                <li>• 专业领域优化提示词</li>
                <li>• 响应式用户界面集成</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
