/**
 * HR中心主页
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BriefcaseIcon, 
  ChartBarIcon, 
  DocumentArrowUpIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

export const HRDashboard: React.FC = () => {
  const features = [
    {
      id: 'recruitment',
      title: '智能招聘助手',
      description: '基于市场数据的岗位需求分析和薪酬推荐，支持一键发布到多个招聘平台',
      icon: BriefcaseIcon,
      link: '/hr/recruitment',
      color: 'bg-blue-50 text-blue-600',
      highlights: ['薪酬推荐', '市场分析', '多平台发布']
    },
    {
      id: 'audit',
      title: '薪酬体系评估',
      description: '导入工资单数据，与市场薪酬对标，生成诊断报告和个性化优化方案',
      icon: ChartBarIcon,
      link: '/hr/audit',
      color: 'bg-green-50 text-green-600',
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {features.map((feature) => {
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
              为什么选择MARC HR中心？
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