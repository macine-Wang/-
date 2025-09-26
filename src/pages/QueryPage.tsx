/**
 * MARC 薪酬查询页面 - 优化UI设计
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MagnifyingGlassIcon,
  SparklesIcon,
  MapPinIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface QueryForm {
  position: string;
  location: string;
  experience: string;
  education: string;
  industry: string;
}

export const QueryPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<QueryForm>({
    position: '',
    location: '',
    experience: '',
    education: '',
    industry: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 导航到结果页面
    navigate('/results', { state: form });
  };

  const handleInputChange = (field: keyof QueryForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const quickOptions = {
    positions: [
      '前端工程师', '后端工程师', '全栈工程师', 'AI算法工程师',
      '产品经理', '数据科学家', 'UI设计师', '测试工程师'
    ],
    locations: [
      '北京', '上海', '深圳', '杭州', '广州', '成都', '武汉', '西安'
    ],
    experience: [
      '1-3年', '3-5年', '5-10年', '10年以上'
    ],
    education: [
      '大专', '本科', '硕士', '博士'
    ],
    industries: [
      '互联网', '金融', '教育', '医疗', '制造业', '咨询', '人工智能', '区块链'
    ]
  };

  return (
    <div className="min-h-screen py-12 bg-white">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl">
              <MagnifyingGlassIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold text-dsp-dark mb-4">
            薪酬查询
          </h1>
          <p className="text-lg text-dsp-gray max-w-2xl mx-auto">
            告诉我们您的条件，获取基于海量数据的精准薪酬分析
          </p>
        </div>

        <div className="bg-white border-2 border-gray-100 rounded-3xl p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 职位信息 */}
            <div className="space-y-4">
              <label className="flex items-center space-x-2 text-sm font-medium text-dsp-dark">
                <BriefcaseIcon className="w-4 h-4 text-blue-600" />
                <span>目标职位</span>
              </label>
              <input
                type="text"
                value={form.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                placeholder="请输入职位名称，如：前端工程师"
                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-xl transition-all text-dsp-dark placeholder:text-dsp-gray"
                required
              />
              <div className="flex flex-wrap gap-2 mt-4">
                {quickOptions.positions.map(position => (
                  <button
                    key={position}
                    type="button"
                    onClick={() => handleInputChange('position', position)}
                    className="px-3 py-2 text-xs bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300 rounded-lg transition-all font-medium"
                  >
                    {position}
                  </button>
                ))}
              </div>
            </div>

            {/* 工作地点 */}
            <div className="space-y-4">
              <label className="flex items-center space-x-2 text-sm font-medium text-dsp-dark">
                <MapPinIcon className="w-4 h-4 text-blue-600" />
                <span>工作地点</span>
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="请输入城市，如：北京"
                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-xl transition-all text-dsp-dark placeholder:text-dsp-gray"
                required
              />
              <div className="flex flex-wrap gap-2 mt-4">
                {quickOptions.locations.map(location => (
                  <button
                    key={location}
                    type="button"
                    onClick={() => handleInputChange('location', location)}
                    className="px-3 py-2 text-xs bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300 rounded-lg transition-all font-medium"
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>

            {/* 工作经验和学历 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="flex items-center space-x-2 text-sm font-medium text-dsp-dark">
                  <ClockIcon className="w-4 h-4 text-blue-600" />
                  <span>工作经验</span>
                </label>
                <select
                  value={form.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-xl transition-all text-dsp-dark appearance-none bg-white"
                  required
                >
                  <option value="">请选择经验年限</option>
                  {quickOptions.experience.map(exp => (
                    <option key={exp} value={exp}>{exp}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                <label className="flex items-center space-x-2 text-sm font-medium text-dsp-dark">
                  <AcademicCapIcon className="w-4 h-4 text-blue-600" />
                  <span>教育背景</span>
                </label>
                <select
                  value={form.education}
                  onChange={(e) => handleInputChange('education', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-xl transition-all text-dsp-dark appearance-none bg-white"
                  required
                >
                  <option value="">请选择学历</option>
                  {quickOptions.education.map(edu => (
                    <option key={edu} value={edu}>{edu}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 行业 */}
            <div className="space-y-4">
              <label className="flex items-center space-x-2 text-sm font-medium text-dsp-dark">
                <SparklesIcon className="w-4 h-4 text-blue-600" />
                <span>目标行业</span>
              </label>
              <select
                value={form.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-xl transition-all text-dsp-dark appearance-none bg-white"
                required
              >
                <option value="">请选择行业</option>
                {quickOptions.industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>

            {/* 提交按钮 */}
            <div className="pt-8">
              <button
                type="submit"
                className="w-full group px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                disabled={!form.position || !form.location || !form.experience || !form.education || !form.industry}
              >
                <MagnifyingGlassIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>
                  {!form.position || !form.location || !form.experience || !form.education || !form.industry 
                    ? '请完善信息' 
                    : '生成薪酬报告'
                  }
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};