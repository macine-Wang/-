/**
 * ISMT 首页 - AI智能薪酬管理平台
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  UserIcon,
  BriefcaseIcon,
  ChartBarIcon,
  SparklesIcon,
  ArrowRightIcon,
  PencilSquareIcon,
  ScaleIcon,
  ChatBubbleLeftRightIcon,
  CurrencyDollarIcon,
  LightBulbIcon,
  AcademicCapIcon,
  EyeIcon,
  ClockIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

export const HomePage: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container max-w-7xl">
          <div className="text-center space-y-8 mb-20">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-sm font-medium text-blue-700 mb-6">
              <SparklesIcon className="w-4 h-4" />
              <span>AI驱动的智能薪酬管理平台</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-dsp-dark tracking-tight leading-none">
              ISMT
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block md:inline md:ml-4">
                智能薪酬助手
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-dsp-gray max-w-4xl mx-auto leading-relaxed">
              深度整合企业内部岗位、绩效及海量外部行业数据，通过AI算法模型进行多维度分析，
              为求职者和HR提供精准的薪酬洞察与决策支持
            </p>

            <div className="flex flex-col items-center space-y-6 pt-4">
              <div className="flex items-center justify-center space-x-8">
                <div className="flex items-center space-x-2 text-sm text-dsp-gray">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>已接入DeepSeek AI</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-dsp-gray">
                  <ChartBarIcon className="w-4 h-4 text-blue-600" />
                  <span>海量真实数据</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-dsp-gray">
                  <SparklesIcon className="w-4 h-4 text-purple-600" />
                  <span>15+AI功能</span>
                </div>
              </div>
              
              {/* 技术架构按钮 */}
              <Link
                to="/tech-architecture"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <SparklesIcon className="w-5 h-5" />
                <span>查看技术架构</span>
                <ArrowRightIcon className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>

          {/* 双功能中心展示 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {/* 求职者中心 */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-3xl blur-lg opacity-0 group-hover:opacity-30 transition duration-500"></div>
              <div className="relative bg-gradient-to-br from-white to-blue-50/30 border-2 border-blue-200 group-hover:border-blue-300 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20">
                {/* 背景装饰 */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-400/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-cyan-400/15 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* 头部 */}
                <div className="relative bg-gradient-to-r from-blue-50/80 via-white to-cyan-50/80 p-8 border-b border-blue-200">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur-xl opacity-30"></div>
                      <div className="relative p-3 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                        <UserIcon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">求职者中心</h2>
                      <p className="text-blue-600 font-semibold">个人职业发展AI助手</p>
                    </div>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    AI驱动的个人职业发展平台，提供薪酬查询、市场洞察、职业规划等全方位服务
                  </p>
                </div>

                {/* 功能列表 */}
                <div className="relative p-8">
                  <div className="grid grid-cols-1 gap-3 mb-8">
                    <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50/80 to-white rounded-xl hover:from-blue-100/80 hover:to-blue-50/80 transition-all duration-300 border border-blue-100 hover:border-blue-200">
                      <div className="p-1.5 bg-blue-500 rounded-lg">
                        <AcademicCapIcon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">职业规划助手</div>
                        <div className="text-sm text-slate-600">AI分析个人背景，制定职业发展路径</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50/80 to-white rounded-xl hover:from-green-100/80 hover:to-green-50/80 transition-all duration-300 border border-green-100 hover:border-green-200">
                      <div className="p-1.5 bg-green-500 rounded-lg">
                        <EyeIcon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">市场洞察报告</div>
                        <div className="text-sm text-slate-600">实时行业趋势、热门岗位、技能需求分析</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50/80 to-white rounded-xl hover:from-purple-100/80 hover:to-purple-50/80 transition-all duration-300 border border-purple-100 hover:border-purple-200">
                      <div className="p-1.5 bg-purple-500 rounded-lg">
                        <CurrencyDollarIcon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">智能薪酬计算器</div>
                        <div className="text-sm text-slate-600">基于个人条件计算市场薪酬水平</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-orange-50/80 to-white rounded-xl hover:from-orange-100/80 hover:to-orange-50/80 transition-all duration-300 border border-orange-100 hover:border-orange-200">
                      <div className="p-1.5 bg-orange-500 rounded-lg">
                        <ChatBubbleLeftRightIcon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">面试薪酬谈判</div>
                        <div className="text-sm text-slate-600">AI模拟面试，提供谈判策略和话术</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-red-50/80 to-white rounded-xl hover:from-red-100/80 hover:to-red-50/80 transition-all duration-300 border border-red-100 hover:border-red-200">
                      <div className="p-1.5 bg-red-500 rounded-lg">
                        <ClockIcon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">薪酬监控提醒</div>
                        <div className="text-sm text-slate-600">设置薪酬变化提醒，把握涨薪时机</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Link
                      to="/jobseeker"
                      className="w-full inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-2xl transition-all duration-300 group shadow-xl hover:shadow-2xl transform hover:scale-105"
                    >
                      <span>进入求职者中心</span>
                      <ArrowRightIcon className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </Link>
                    
                    <Link
                      to="/query"
                      className="w-full inline-flex items-center justify-center px-6 py-3 text-blue-600 hover:text-blue-700 font-semibold transition-all duration-300 border-2 border-blue-200 rounded-2xl hover:bg-blue-50 hover:border-blue-300"
                    >
                      快速薪酬查询
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* HR中心 */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-400 rounded-3xl blur-lg opacity-0 group-hover:opacity-30 transition duration-500"></div>
              <div className="relative bg-gradient-to-br from-white to-red-50/30 border-2 border-red-200 group-hover:border-red-300 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/20">
                {/* 背景装饰 */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-red-400/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-400/15 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* 头部 */}
                <div className="relative bg-gradient-to-r from-red-50/80 via-white to-orange-50/80 p-8 border-b border-red-200">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl blur-xl opacity-30"></div>
                      <div className="relative p-3 bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                        <BriefcaseIcon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">HR中心</h2>
                      <p className="text-red-600 font-semibold">企业薪酬管理专家</p>
                    </div>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    AI驱动的企业薪酬管理平台，提供招聘、诊断、优化、决策等全流程HR解决方案
                  </p>
                </div>

                {/* 功能列表 */}
                <div className="relative p-8">
                  <div className="grid grid-cols-1 gap-3 mb-8">
                    <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50/80 to-white rounded-xl hover:from-purple-100/80 hover:to-purple-50/80 transition-all duration-300 border border-purple-100 hover:border-purple-200">
                      <div className="p-1.5 bg-purple-500 rounded-lg">
                        <ChartBarIcon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">智能薪酬诊断中心</div>
                        <div className="text-sm text-slate-600">一键诊断薪酬健康度，AI生成优化建议</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50/80 to-white rounded-xl hover:from-green-100/80 hover:to-green-50/80 transition-all duration-300 border border-green-100 hover:border-green-200">
                      <div className="p-1.5 bg-green-500 rounded-lg">
                        <CurrencyDollarIcon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">动态调薪决策引擎</div>
                        <div className="text-sm text-slate-600">AI智能分配调薪预算，预测影响效果</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-indigo-50/80 to-white rounded-xl hover:from-indigo-100/80 hover:to-indigo-50/80 transition-all duration-300 border border-indigo-100 hover:border-indigo-200">
                      <div className="p-1.5 bg-indigo-500 rounded-lg">
                        <PencilSquareIcon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">智能JD写作助手</div>
                        <div className="text-sm text-slate-600">AI生成职位描述，支持批量处理和多语言</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50/80 to-white rounded-xl hover:from-blue-100/80 hover:to-blue-50/80 transition-all duration-300 border border-blue-100 hover:border-blue-200">
                      <div className="p-1.5 bg-blue-500 rounded-lg">
                        <AdjustmentsHorizontalIcon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">薪酬竞争力雷达</div>
                        <div className="text-sm text-slate-600">实时对标市场，监控关键岗位竞争力</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-yellow-50/80 to-white rounded-xl hover:from-yellow-100/80 hover:to-yellow-50/80 transition-all duration-300 border border-yellow-100 hover:border-yellow-200">
                      <div className="p-1.5 bg-yellow-500 rounded-lg">
                        <ScaleIcon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">薪酬公平性检测器</div>
                        <div className="text-sm text-slate-600">AI扫描薪酬不公平问题，确保合规管理</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Link
                      to="/hr"
                      className="w-full inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold rounded-2xl transition-all duration-300 group shadow-xl hover:shadow-2xl transform hover:scale-105"
                    >
                      <span>进入HR中心</span>
                      <ArrowRightIcon className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </Link>
                    
                    <Link
                      to="/hr/smart-jd-writer"
                      className="w-full inline-flex items-center justify-center px-6 py-3 text-red-600 hover:text-red-700 font-semibold transition-all duration-300 border-2 border-red-200 rounded-2xl hover:bg-red-50 hover:border-red-300"
                    >
                      体验JD写作助手
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 核心优势 */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container max-w-7xl">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-dsp-dark mb-6">
              为什么选择ISMT智能薪酬助手？
            </h3>
            <p className="text-xl text-dsp-gray max-w-3xl mx-auto">
              基于真实数据 + AI算法 + 专业洞察，为个人和企业提供全方位薪酬管理解决方案
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">15+</div>
              <div className="text-dsp-gray font-medium">AI功能模块</div>
              <div className="text-sm text-dsp-gray/70 mt-1">涵盖求职到HR全流程</div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-3">海量</div>
              <div className="text-dsp-gray font-medium">真实数据支撑</div>
              <div className="text-sm text-dsp-gray/70 mt-1">覆盖多行业多地区</div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-red-600 bg-clip-text text-transparent mb-3">实时</div>
              <div className="text-dsp-gray font-medium">AI智能分析</div>
              <div className="text-sm text-dsp-gray/70 mt-1">DeepSeek API驱动</div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-3">双端</div>
              <div className="text-dsp-gray font-medium">服务体系</div>
              <div className="text-sm text-dsp-gray/70 mt-1">求职者+HR双覆盖</div>
            </div>
          </div>

          {/* 核心特色 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all">
              <div className="p-4 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl w-fit mx-auto mb-6">
                <SparklesIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-dsp-dark mb-4">AI智能驱动</h4>
              <p className="text-dsp-gray leading-relaxed">
                接入DeepSeek AI，提供智能职业规划、薪酬分析、JD生成等15+个AI功能模块，让数据分析更智能
              </p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all">
              <div className="p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl w-fit mx-auto mb-6">
                <ChartBarIcon className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold text-dsp-dark mb-4">数据精准可靠</h4>
              <p className="text-dsp-gray leading-relaxed">
                基于海量真实招聘数据，覆盖多种职业类别和主要城市，确保分析结果的准确性和时效性
              </p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all">
              <div className="p-4 bg-gradient-to-r from-red-100 to-orange-100 rounded-2xl w-fit mx-auto mb-6">
                <LightBulbIcon className="w-8 h-8 text-red-600" />
              </div>
              <h4 className="text-xl font-semibold text-dsp-dark mb-4">专业解决方案</h4>
              <p className="text-dsp-gray leading-relaxed">
                为求职者提供职业发展规划，为HR提供薪酬管理优化，双端服务体系满足不同用户群体需求
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI技术展示 */}
      <section className="py-20 bg-gradient-to-r from-purple-50 via-blue-50 to-cyan-50">
        <div className="container max-w-7xl">
          <div className="bg-white border border-purple-200 rounded-3xl overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 p-8 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 rounded-2xl">
                    <SparklesIcon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">🤖 DeepSeek AI驱动</h2>
                    <p className="text-white/90 text-lg mt-2">15+个AI功能模块，实现真正的智能薪酬分析</p>
                  </div>
                </div>
                <Link
                  to="/tech-architecture"
                  className="px-8 py-4 bg-white text-purple-600 rounded-2xl hover:bg-gray-50 transition-colors font-semibold shadow-lg"
                >
                  查看技术架构
                </Link>
              </div>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
                  <div className="text-3xl font-bold text-purple-600 mb-2">求职者</div>
                  <div className="text-sm text-purple-700 font-medium mb-3">AI功能模块</div>
                  <div className="space-y-2 text-xs text-purple-600">
                    <div>职业规划助手</div>
                    <div>市场洞察报告</div>
                    <div>智能薪酬计算器</div>
                    <div>面试谈判指导</div>
                    <div>薪酬监控提醒</div>
                  </div>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl">
                  <div className="text-3xl font-bold text-red-600 mb-2">HR</div>
                  <div className="text-sm text-red-700 font-medium mb-3">AI功能模块</div>
                  <div className="space-y-2 text-xs text-red-600">
                    <div>智能薪酬诊断</div>
                    <div>动态调薪引擎</div>
                    <div>JD写作助手</div>
                    <div>竞争力雷达</div>
                    <div>公平性检测器</div>
                  </div>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
                  <div className="text-3xl font-bold text-blue-600 mb-2">实时</div>
                  <div className="text-sm text-blue-700 font-medium mb-3">数据分析</div>
                  <div className="space-y-2 text-xs text-blue-600">
                    <div>市场趋势分析</div>
                    <div>行业薪酬对比</div>
                    <div>技能需求预测</div>
                    <div>人才流动监控</div>
                    <div>薪酬变化追踪</div>
                  </div>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
                  <div className="text-3xl font-bold text-green-600 mb-2">智能</div>
                  <div className="text-sm text-green-700 font-medium mb-3">决策支持</div>
                  <div className="space-y-2 text-xs text-green-600">
                    <div>个性化建议</div>
                    <div>优化方案生成</div>
                    <div>风险评估预警</div>
                    <div>成本效益分析</div>
                    <div>策略制定指导</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 快速开始 */}
    </div>
  );
};


