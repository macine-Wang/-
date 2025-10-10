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
    },
    {
      id: 'resume_optimizer',
      title: '简历智能优化助手',
      description: 'AI深度分析简历内容，提供专业优化建议，提升面试邀请率',
      icon: DocumentTextIcon,
      link: '/resume-optimizer',
      color: 'bg-purple-50 text-purple-600',
      highlights: ['AI分析', '优化建议', 'ATS兼容']
    }
  ];

  const quickStats = [
    { value: '海量', label: '真实职位数据', icon: BriefcaseIcon },
    { value: '多种', label: '职业类别覆盖', icon: SparklesIcon },
    { value: '全国', label: '城市数据支持', icon: MapPinIcon },
    { value: '高精度', label: '数据准确率', icon: AcademicCapIcon }
  ];

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-white min-h-screen">
      {/* Header */}
      <section className="relative py-20 overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-cyan-500/5 to-transparent"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-400/20 to-transparent rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-cyan-400/15 to-transparent rounded-full blur-3xl transform -translate-x-24 translate-y-24"></div>
        
        <div className="container max-w-6xl relative z-10">
          <div className="text-center space-y-8">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl blur-xl opacity-30"></div>
                <div className="relative p-4 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl">
                  <UserIcon className="w-10 h-10 text-white" />
                </div>
              </div>
              <div className="text-left">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  求职者中心
                </h1>
                <p className="text-blue-600 font-semibold text-lg mt-1">个人职业发展AI助手</p>
              </div>
            </div>
            
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              AI驱动的智能薪酬分析平台，为求职者提供精准的市场洞察和职业规划建议，
              <span className="text-blue-600 font-semibold">助力您的职业发展之路</span>
            </p>
            
            <div className="flex items-center justify-center space-x-3 bg-white/70 backdrop-blur-sm rounded-full px-6 py-3 border border-blue-100 shadow-lg">
              <SparklesIcon className="w-5 h-5 text-blue-600" />
              <span className="text-slate-700 font-medium">基于海量真实数据，AI智能分析，助力职业发展</span>
            </div>
          </div>
        </div>
      </section>

      {/* 核心功能 */}
      <section className="py-20 relative">
        <div className="container max-w-7xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-blue-200">
              <SparklesIcon className="w-4 h-4" />
              <span>核心功能服务</span>
            </div>
            <h2 className="text-4xl font-bold text-slate-800 mb-6">专为求职者量身定制</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              一站式薪酬分析和职业规划工具，助力您在职业发展道路上做出明智决策
            </p>
          </div>

          {/* 特色功能 */}
          <div className="mb-16">
            {coreFeatures.filter(f => f.featured).map((feature) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.id}
                  to={feature.link}
                  className="group block relative overflow-hidden max-w-5xl mx-auto mb-8"
                >
                  {/* 背景装饰 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50/80 via-white to-cyan-50/80 rounded-3xl border-2 border-blue-200 group-hover:border-blue-300 transition-all duration-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-cyan-600/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-400/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative p-10">
                    <div className="flex items-center space-x-8">
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                          <div className="relative p-5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl group-hover:scale-110 transition-transform duration-500">
                            <Icon className="w-12 h-12 text-white" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-1 space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center space-x-3 mb-3">
                              <h3 className="text-3xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors duration-300">
                                {feature.title}
                              </h3>
                              <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full blur-lg opacity-20"></div>
                                <span className="relative px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-bold rounded-full shadow-lg">
                                  🎯 立即体验
                                </span>
                              </div>
                            </div>
                            <p className="text-slate-600 leading-relaxed text-xl">
                              {feature.description}
                            </p>
                          </div>
                          <ArrowRightIcon className="w-8 h-8 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-3 transition-all duration-300 flex-shrink-0" />
                        </div>
                        
                        <div className="flex flex-wrap gap-3">
                          {feature.highlights.map((highlight, index) => (
                            <span
                              key={highlight}
                              className="px-4 py-2 bg-white/80 text-blue-700 text-sm font-semibold rounded-xl border border-blue-200 group-hover:bg-blue-50 group-hover:border-blue-300 transition-all duration-300 shadow-sm"
                              style={{ animationDelay: `${index * 100}ms` }}
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* 其他功能 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...coreFeatures.filter(f => !f.featured), ...additionalFeatures].map((feature) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.id}
                  to={feature.link}
                  className="group relative block overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50 rounded-3xl border-2 border-slate-200 group-hover:border-blue-200 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-blue-500/10"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-50/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative p-8 h-full">
                    <div className="space-y-6">
                      {/* Icon */}
                      <div className="relative">
                        <div className={`absolute inset-0 ${feature.color.replace('bg-', 'bg-').replace('text-', 'bg-').replace('50', '100')} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`}></div>
                        <div className={`relative inline-flex p-4 rounded-2xl ${feature.color} group-hover:scale-110 transition-transform duration-500`}>
                          <Icon className="w-7 h-7" />
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors duration-300">
                          {feature.title}
                        </h3>
                        
                        <p className="text-slate-600 leading-relaxed">
                          {feature.description}
                        </p>
                        
                        {/* Highlights */}
                        <div className="flex flex-wrap gap-2">
                          {feature.highlights.map((highlight, highlightIndex) => (
                            <span
                              key={highlight}
                              className="px-3 py-1 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors duration-300"
                              style={{ animationDelay: `${highlightIndex * 100}ms` }}
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-all duration-300 pt-2">
                          <span>了解更多</span>
                          <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform duration-300" />
                        </div>
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
      <section className="py-20 relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/50 to-white"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full blur-3xl transform -translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-cyan-400/10 to-transparent rounded-full blur-3xl transform translate-x-24 translate-y-24"></div>
        
        <div className="container max-w-7xl relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-white/70 backdrop-blur-sm text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-blue-200 shadow-lg">
              <SparklesIcon className="w-4 h-4" />
              <span>数据亮点</span>
            </div>
            <h3 className="text-4xl font-bold text-slate-800 mb-6">
              为什么选择ISMT求职者中心？
            </h3>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              基于真实招聘数据，为求职者提供最准确的薪酬分析和职业指导
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {quickStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="group text-center space-y-6">
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                      <div className="relative p-4 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                      {stat.value}
                    </div>
                    <div className="text-slate-600 font-semibold">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
