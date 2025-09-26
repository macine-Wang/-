/**
 * 求职者功能中心
 * 为求职者提供全方位的薪酬分析和职业规划服务
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  UserIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  LightBulbIcon,
  ArrowTrendingUpIcon,
  BellIcon,
  DocumentTextIcon,
  ArrowRightIcon,
  SparklesIcon,
  MapPinIcon,
  BriefcaseIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

export const JobseekerCenter: React.FC = () => {
  const coreFeatures = [
    {
      id: 'salary_query',
      title: '薪酬查询分析',
      description: '基于海量真实数据，查询目标职位的薪酬范围和市场行情',
      icon: MagnifyingGlassIcon,
      link: '/query',
      color: 'bg-blue-50 text-blue-600',
      highlights: ['精准查询', '市场对标', '趋势分析'],
      featured: true
    },
    {
      id: 'career_planning',
      title: '职业规划助手',
      description: 'AI分析你的技能和经验，为你规划最优的职业发展路径',
      icon: ArrowTrendingUpIcon,
      link: '/career-planning',
      color: 'bg-green-50 text-green-600',
      highlights: ['技能评估', '发展路径', '学习建议']
    },
    {
      id: 'market_insights',
      title: '市场洞察报告',
      description: '定期获取行业薪酬趋势、热门职位和技能需求分析',
      icon: ChartBarIcon,
      link: '/market-insights',
      color: 'bg-purple-50 text-purple-600',
      highlights: ['行业报告', '趋势预测', '技能热度']
    }
  ];

  const additionalFeatures = [
    {
      id: 'salary_calculator',
      title: '薪酬计算器',
      description: '根据你的技能、经验和地区，智能计算合理薪酬范围',
      icon: LightBulbIcon,
      link: '/salary-calculator',
      color: 'bg-orange-50 text-orange-600',
      highlights: ['智能计算', '个性化', '参考建议']
    },
    {
      id: 'interview_prep',
      title: '面试薪酬谈判',
      description: '提供薪酬谈判技巧和策略，帮你在面试中争取更好待遇',
      icon: DocumentTextIcon,
      link: '/interview-prep',
      color: 'bg-red-50 text-red-600',
      highlights: ['谈判技巧', '话术模板', '策略指导']
    },
    {
      id: 'salary_alerts',
      title: '薪酬监控提醒',
      description: '监控目标职位薪酬变化，第一时间获取市场动态通知',
      icon: BellIcon,
      link: '/salary-alerts',
      color: 'bg-indigo-50 text-indigo-600',
      highlights: ['实时监控', '智能提醒', '个性化推送']
    }
  ];

  const quickStats = [
    { value: '7亿+', label: '真实职位数据', icon: BriefcaseIcon },
    { value: '7000+', label: '职业类别覆盖', icon: SparklesIcon },
    { value: '300+', label: '城市数据支持', icon: MapPinIcon },
    { value: '99%', label: '数据准确率', icon: AcademicCapIcon }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container max-w-6xl">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-2xl">
                <UserIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-4xl font-semibold text-dsp-dark">
                求职者中心
              </h1>
            </div>
            
            <p className="text-lg text-dsp-gray max-w-3xl mx-auto leading-relaxed">
              AI驱动的智能薪酬分析平台，为求职者提供精准的市场洞察和职业规划建议
            </p>
            
            <div className="flex items-center justify-center space-x-2 text-sm text-dsp-gray">
              <SparklesIcon className="w-4 h-4 text-blue-600" />
              <span>基于海量真实数据，AI智能分析，助力职业发展</span>
            </div>
          </div>
        </div>
      </section>

      {/* 核心功能 */}
      <section className="py-16">
        <div className="container max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-dsp-dark mb-4">
              核心功能服务
            </h2>
            <p className="text-dsp-gray">
              专为求职者打造的一站式薪酬分析和职业规划工具
            </p>
          </div>

          {/* 特色功能 */}
          <div className="mb-12">
            {coreFeatures.filter(f => f.featured).map((feature) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.id}
                  to={feature.link}
                  className="group block p-8 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-3xl hover:border-blue-300 hover:shadow-xl transition-all duration-300 max-w-4xl mx-auto"
                >
                  <div className="flex items-center space-x-6">
                    <div className="flex-shrink-0">
                      <div className={`p-4 rounded-2xl ${feature.color}`}>
                        <Icon className="w-10 h-10" />
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-2xl font-semibold text-dsp-dark">
                              {feature.title}
                            </h3>
                            <span className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full font-medium">
                              🎯 立即体验
                            </span>
                          </div>
                          <p className="text-dsp-gray leading-relaxed text-lg">
                            {feature.description}
                          </p>
                        </div>
                        <ArrowRightIcon className="w-6 h-6 text-dsp-gray group-hover:text-blue-600 group-hover:translate-x-2 transition-all flex-shrink-0" />
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {feature.highlights.map((highlight) => (
                          <span
                            key={highlight}
                            className="px-3 py-1 bg-white/80 text-blue-700 text-sm rounded-full font-medium"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* 其他功能 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...coreFeatures.filter(f => !f.featured), ...additionalFeatures].map((feature) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.id}
                  to={feature.link}
                  className="p-6 bg-white border-2 border-gray-200 rounded-2xl hover:border-blue-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <div className="space-y-4">
                    {/* Icon */}
                    <div className={`inline-flex p-3 rounded-xl ${feature.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    
                    {/* Content */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-dsp-dark">
                        {feature.title}
                      </h3>
                      
                      <p className="text-dsp-gray text-sm leading-relaxed">
                        {feature.description}
                      </p>
                      
                      {/* Highlights */}
                      <div className="flex flex-wrap gap-2">
                        {feature.highlights.map((highlight) => (
                          <span
                            key={highlight}
                            className="px-2 py-1 bg-gray-100 text-dsp-gray text-xs rounded-full"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 数据统计 */}
      <section className="py-16 bg-gray-50">
        <div className="container max-w-6xl">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-semibold text-dsp-dark mb-4">
              为什么选择MARC求职者中心？
            </h3>
            <p className="text-dsp-gray">
              基于真实招聘数据，为求职者提供最准确的薪酬分析
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {quickStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center space-y-3">
                  <div className="flex items-center justify-center">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-blue-600">{stat.value}</div>
                  <div className="text-sm md:text-base text-dsp-gray">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 快速开始 */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-center text-white">
            <div className="space-y-6">
              <div className="flex items-center justify-center">
                <SparklesIcon className="w-12 h-12" />
              </div>
              
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold">
                  开始你的薪酬分析之旅
                </h3>
                <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                  只需3分钟，获取专属的薪酬分析报告，了解你在市场中的真实价值
                </p>
              </div>

              <div className="flex items-center justify-center space-x-4">
                <Link
                  to="/query"
                  className="px-8 py-3 bg-white text-blue-600 hover:bg-blue-50 font-semibold rounded-xl transition-colors"
                >
                  立即开始查询
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
                  className="px-8 py-3 border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold rounded-xl transition-colors"
                >
                  查看示例报告
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
