/**
 * HR中心主页
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BriefcaseIcon, 
  ChartBarIcon, 
  DocumentArrowUpIcon,
  ArrowRightIcon,
  CurrencyDollarIcon,
  ScaleIcon,
  ChatBubbleLeftRightIcon,
  AdjustmentsHorizontalIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline';

export const HRDashboard: React.FC = () => {
  const features = [
    {
      id: 'diagnosis',
      title: '智能薪酬诊断中心',
      description: '一键上传企业薪酬数据，AI秒出诊断报告，提供薪酬健康度评分和优化建议',
      icon: ChartBarIcon,
      link: '/hr/diagnosis',
      color: 'bg-purple-50 text-purple-600',
      highlights: ['健康度评分', '问题识别', 'AI建议', '可视化分析'],
      featured: true
    },
    {
      id: 'dynamic_adjustment',
      title: '动态调薪决策引擎',
      description: '输入调薪预算，AI智能分配到每个员工，生成多种调薪方案并预测影响',
      icon: CurrencyDollarIcon,
      link: '/hr/dynamic-adjustment',
      color: 'bg-green-50 text-green-600',
      highlights: ['智能分配', '方案对比', '影响预测', '预算优化'],
      featured: true
    },
    {
      id: 'competitiveness_radar',
      title: '薪酬竞争力雷达',
      description: '实时对标市场，一目了然竞争地位，监控关键岗位薪酬竞争力',
      icon: AdjustmentsHorizontalIcon,
      link: '/hr/competitiveness-radar',
      color: 'bg-blue-50 text-blue-600',
      highlights: ['市场定位', '关键岗位监控', '人才流失预警', '竞对分析']
    },
    {
      id: 'ai_advisor',
      title: 'AI薪酬顾问助手',
      description: '自然语言对话，像咨询专家一样解答薪酬问题，提供个性化建议',
      icon: ChatBubbleLeftRightIcon,
      link: '/hr/ai-advisor',
      color: 'bg-purple-50 text-purple-600',
      highlights: ['智能问答', '方案推荐', '政策解读', '最佳实践']
    },
    {
      id: 'fairness_detector',
      title: '薪酬公平性检测器',
      description: '一键扫描，发现隐藏的薪酬不公平问题，确保合规管理',
      icon: ScaleIcon,
      link: '/hr/fairness-detector',
      color: 'bg-indigo-50 text-indigo-600',
      highlights: ['同工同酬检测', '性别差距分析', '部门平衡评估', '修正建议']
    },
    {
      id: 'smart_jd_writer',
      title: '智能JD写作助手',
      description: 'AI驱动的职位描述生成平台，8大核心模块助力高效招聘',
      icon: PencilSquareIcon,
      link: '/hr/smart-jd-writer',
      color: 'bg-indigo-50 text-indigo-600',
      highlights: ['智能生成', '多语言支持', '合规检查', '一键发布'],
      featured: true
    },
    {
      id: 'recruitment',
      title: '智能招聘助手',
      description: '基于市场数据的岗位需求分析和薪酬推荐，支持一键发布到多个招聘平台',
      icon: BriefcaseIcon,
      link: '/hr/recruitment',
      color: 'bg-orange-50 text-orange-600',
      highlights: ['薪酬推荐', '市场分析', '多平台发布']
    },
    {
      id: 'audit',
      title: '薪酬体系评估',
      description: '导入工资单数据，与市场薪酬对标，生成诊断报告和个性化优化方案',
      icon: DocumentArrowUpIcon,
      link: '/hr/audit',
      color: 'bg-teal-50 text-teal-600',
      highlights: ['数据对标', '诊断报告', '优化方案', '本地处理']
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="py-16 bg-gradient-to-r from-dsp-red/5 to-transparent">
        <div className="container max-w-6xl">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="p-3 bg-dsp-red/10 rounded-2xl">
                <BriefcaseIcon className="w-8 h-8 text-dsp-red" />
              </div>
              <h1 className="text-4xl font-semibold text-dsp-dark">
                HR中心
              </h1>
            </div>
            
            <p className="text-lg text-dsp-gray max-w-3xl mx-auto leading-relaxed">
              智能化HR工具套件，助力企业薪酬管理和人才招聘
            </p>
            
            <div className="flex items-center justify-center space-x-2 text-sm text-dsp-gray">
              <DocumentArrowUpIcon className="w-4 h-4" />
              <span>所有数据本地处理，确保企业信息安全</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container max-w-6xl">
          {/* 特色功能 */}
          <div className="mb-12 space-y-6">
            {features.filter(f => f.featured).map((feature) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.id}
                  to={feature.link}
                  className={`group block p-8 border-2 rounded-3xl hover:shadow-xl transition-all duration-300 max-w-4xl mx-auto ${
                    feature.id === 'diagnosis' 
                      ? 'bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 hover:border-purple-300'
                      : feature.id === 'dynamic_adjustment'
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:border-green-300'
                      : 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 hover:border-indigo-300'
                  }`}
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
                            <span className={`px-3 py-1 text-white text-xs rounded-full font-medium ${
                              feature.id === 'diagnosis' ? 'bg-purple-600' : 
                              feature.id === 'dynamic_adjustment' ? 'bg-green-600' : 'bg-indigo-600'
                            }`}>
                              ⭐ 核心功能
                            </span>
                          </div>
                          <p className="text-dsp-gray leading-relaxed text-lg">
                            {feature.description}
                          </p>
                        </div>
                        <ArrowRightIcon className={`w-6 h-6 text-dsp-gray group-hover:translate-x-2 transition-all flex-shrink-0 ${
                          feature.id === 'diagnosis' ? 'group-hover:text-purple-600' : 
                          feature.id === 'dynamic_adjustment' ? 'group-hover:text-green-600' : 'group-hover:text-indigo-600'
                        }`} />
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {feature.highlights.map((highlight) => (
                          <span
                            key={highlight}
                            className={`px-3 py-1 bg-white/80 text-sm rounded-full font-medium ${
                              feature.id === 'diagnosis' ? 'text-purple-700' : 
                              feature.id === 'dynamic_adjustment' ? 'text-green-700' : 'text-indigo-700'
                            }`}
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
            {features.filter(f => !f.featured).map((feature) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.id}
                  to={feature.link}
                  className="group block p-8 bg-white border border-gray-200 rounded-2xl hover:border-dsp-red/20 hover:shadow-lg transition-all duration-300"
                >
                  <div className="space-y-6">
                    {/* Icon */}
                    <div className={`inline-flex p-3 rounded-xl ${feature.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    
                    {/* Content */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-dsp-dark">
                          {feature.title}
                        </h3>
                        <ArrowRightIcon className="w-5 h-5 text-dsp-gray group-hover:text-dsp-red group-hover:translate-x-1 transition-all" />
                      </div>
                      
                      <p className="text-dsp-gray leading-relaxed">
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

      {/* Quick Stats */}
      <section className="py-16 bg-gray-50">
        <div className="container max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-dsp-dark mb-4">
              为什么选择ISMT HR中心？
            </h2>
            <p className="text-dsp-gray">
              基于海量真实招聘数据，提供专业的HR决策支持
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="text-3xl font-bold text-dsp-red">7亿+</div>
              <div className="text-dsp-gray">真实招聘职位数据</div>
            </div>
            <div className="text-center space-y-3">
              <div className="text-3xl font-bold text-dsp-red">7000+</div>
              <div className="text-dsp-gray">覆盖职业类别</div>
            </div>
            <div className="text-center space-y-3">
              <div className="text-3xl font-bold text-dsp-red">100%</div>
              <div className="text-dsp-gray">本地数据处理</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};