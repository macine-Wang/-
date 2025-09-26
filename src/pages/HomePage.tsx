/**
 * MARC 首页 - 重新设计突出用户身份区分
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  UserIcon,
  BriefcaseIcon,
  ChartBarIcon,
  SparklesIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

export const HomePage: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container max-w-6xl">
          <div className="text-center space-y-8 mb-16">
            <h1 className="text-4xl md:text-6xl font-semibold text-dsp-dark tracking-tight leading-none">
              My AI Renumeration
              <br />
              <span className="text-dsp-red">Consultant</span>
            </h1>
            
            <p className="text-lg md:text-xl text-dsp-gray max-w-3xl mx-auto leading-relaxed">
              基于海量招聘数据的AI薪酬分析平台，为求职者和HR提供精准的薪酬洞察
            </p>
          </div>

          {/* 用户身份选择 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* 求职者入口 */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-blue-400 rounded-3xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
              <div className="relative bg-white border-2 border-gray-100 group-hover:border-blue-200 rounded-3xl p-8 transition-all duration-300 hover:shadow-xl">
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6 mx-auto group-hover:bg-blue-200 transition-colors">
                  <UserIcon className="w-8 h-8 text-blue-600" />
                </div>
                
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-semibold text-dsp-dark">我是求职者</h2>
                  <p className="text-dsp-gray leading-relaxed">
                    查询目标职位的薪酬水平，了解市场行情，制定求职策略
                  </p>
                  
                  {/* 功能特点 */}
                  <div className="space-y-3 pt-4">
                    <div className="flex items-center space-x-3 text-sm text-dsp-gray">
                      <MagnifyingGlassIcon className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span>薪酬范围查询</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-dsp-gray">
                      <ChartBarIcon className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span>市场趋势分析</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-dsp-gray">
                      <ArrowTrendingUpIcon className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span>职业发展建议</span>
                    </div>
                  </div>
                  
                  <div className="pt-6 space-y-3">
                    <Link
                      to="/query"
                      className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors group"
                    >
                      开始薪酬查询
                      <ArrowRightIcon className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    
                    <Link
                      to="/results"
                      state={{
                        position: '高级前端工程师',
                        location: '北京',
                        experience: '3-5年',
                        education: '本科',
                        industry: '互联网'
                      }}
                      className="w-full inline-flex items-center justify-center px-6 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors text-sm"
                    >
                      查看示例报告
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* HR入口 */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-dsp-red to-red-400 rounded-3xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
              <div className="relative bg-white border-2 border-gray-100 group-hover:border-red-200 rounded-3xl p-8 transition-all duration-300 hover:shadow-xl">
                <div className="flex items-center justify-center w-16 h-16 bg-red-50 rounded-2xl mb-6 mx-auto group-hover:bg-red-100 transition-colors">
                  <BriefcaseIcon className="w-8 h-8 text-dsp-red" />
                </div>
                
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-semibold text-dsp-dark">我是HR</h2>
                  <p className="text-dsp-gray leading-relaxed">
                    智能招聘助手和薪酬体系评估，优化企业人才管理策略
                  </p>
                  
                  {/* 功能特点 */}
                  <div className="space-y-3 pt-4">
                    <div className="flex items-center space-x-3 text-sm text-dsp-gray">
                      <SparklesIcon className="w-4 h-4 text-dsp-red flex-shrink-0" />
                      <span>智能招聘助手</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-dsp-gray">
                      <DocumentTextIcon className="w-4 h-4 text-dsp-red flex-shrink-0" />
                      <span>薪酬体系评估</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-dsp-gray">
                      <ChartBarIcon className="w-4 h-4 text-dsp-red flex-shrink-0" />
                      <span>优化方案生成</span>
                    </div>
                  </div>
                  
                  <div className="pt-6 space-y-3">
                    <Link
                      to="/hr"
                      className="w-full inline-flex items-center justify-center px-6 py-3 bg-dsp-red hover:bg-dsp-red/90 text-white font-medium rounded-xl transition-colors group"
                    >
                      进入HR中心
                      <ArrowRightIcon className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    
                    <Link
                      to="/hr/recruitment"
                      className="w-full inline-flex items-center justify-center px-6 py-2 text-dsp-red hover:text-dsp-red/80 font-medium transition-colors text-sm"
                    >
                      体验招聘助手
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 数据统计 */}
      <section className="py-16 bg-gray-50">
        <div className="container max-w-6xl">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-semibold text-dsp-dark mb-4">
              为什么选择MARC？
            </h3>
            <p className="text-dsp-gray">
              基于真实招聘数据，提供专业的薪酬分析服务
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-dsp-red mb-2">7亿+</div>
              <div className="text-sm md:text-base text-dsp-gray">真实招聘职位数据</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-dsp-red mb-2">7000+</div>
              <div className="text-sm md:text-base text-dsp-gray">覆盖职业类别</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-dsp-red mb-2">300+</div>
              <div className="text-sm md:text-base text-dsp-gray">主要城市覆盖</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-dsp-red mb-2">99%</div>
              <div className="text-sm md:text-base text-dsp-gray">数据准确率</div>
            </div>
          </div>
        </div>
      </section>

      {/* 特色功能 */}
      <section className="py-16">
        <div className="container max-w-6xl">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-semibold text-dsp-dark mb-4">
              核心功能特色
            </h3>
            <p className="text-dsp-gray">
              AI驱动的智能薪酬分析，满足不同用户群体的需求
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4 mx-auto">
                <MagnifyingGlassIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-dsp-dark mb-2">精准查询</h4>
              <p className="text-sm text-dsp-gray">
                基于职位、经验、地区等多维度条件，提供精准的薪酬范围查询
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-4 mx-auto">
                <ChartBarIcon className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-dsp-dark mb-2">趋势分析</h4>
              <p className="text-sm text-dsp-gray">
                实时市场趋势分析，帮助用户了解薪酬变化和发展前景
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl mb-4 mx-auto">
                <SparklesIcon className="w-6 h-6 text-dsp-red" />
              </div>
              <h4 className="font-semibold text-dsp-dark mb-2">AI智能</h4>
              <p className="text-sm text-dsp-gray">
                AI算法驱动的智能分析，提供个性化的薪酬建议和优化方案
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};


