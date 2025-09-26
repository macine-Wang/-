/**
 * 智能招聘助手页面
 */

import React, { useState } from 'react';
import { 
  BriefcaseIcon,
  CurrencyDollarIcon,
  RocketLaunchIcon,
  CheckCircleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface JobRequirements {
  title: string;
  location: string;
  department: string;
  education: string;
  experience: string;
  skills: string[];
  description: string;
}

interface SalaryRecommendation {
  minSalary: number;
  maxSalary: number;
  medianSalary: number;
  competitiveness: 'low' | 'medium' | 'high';
  marketAnalysis: {
    demandLevel: string;
    competitionLevel: string;
    recruitmentDifficulty: string;
    estimatedDays: number;
  };
}

export const RecruitmentPage: React.FC = () => {
  const [jobData, setJobData] = useState<JobRequirements>({
    title: '',
    location: '',
    department: '',
    education: '',
    experience: '',
    skills: [],
    description: ''
  });

  const [recommendation, setRecommendation] = useState<SalaryRecommendation | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);

  // 模拟薪酬推荐算法（基于规则）
  const generateRecommendation = (job: JobRequirements): SalaryRecommendation => {
    // 基础薪酬（根据经验）
    let baseSalary = 8000;
    if (job.experience.includes('1-3')) baseSalary = 12000;
    else if (job.experience.includes('3-5')) baseSalary = 18000;
    else if (job.experience.includes('5+')) baseSalary = 25000;

    // 地区调整
    const locationMultiplier = job.location.includes('北京') || job.location.includes('上海') || job.location.includes('深圳') ? 1.3 : 1.0;
    baseSalary *= locationMultiplier;

    // 学历调整
    const educationMultiplier = job.education.includes('硕士') ? 1.2 : job.education.includes('博士') ? 1.4 : 1.0;
    baseSalary *= educationMultiplier;

    // 技能调整
    const skillBonus = job.skills.length * 0.05;
    baseSalary *= (1 + skillBonus);

    const minSalary = Math.round(baseSalary * 0.8);
    const maxSalary = Math.round(baseSalary * 1.4);
    const medianSalary = Math.round(baseSalary);

    return {
      minSalary,
      maxSalary,
      medianSalary,
      competitiveness: baseSalary > 20000 ? 'high' : baseSalary > 12000 ? 'medium' : 'low',
      marketAnalysis: {
        demandLevel: job.skills.length > 3 ? '高需求' : '中等需求',
        competitionLevel: baseSalary > 20000 ? '激烈' : '中等',
        recruitmentDifficulty: baseSalary > 25000 ? '较难' : '中等',
        estimatedDays: Math.round(15 + (baseSalary / 1000))
      }
    };
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 2000));
    const result = generateRecommendation(jobData);
    setRecommendation(result);
    setIsAnalyzing(false);
  };

  const handleSkillAdd = (skill: string) => {
    if (skill.trim() && !jobData.skills.includes(skill.trim())) {
      setJobData(prev => ({
        ...prev,
        skills: [...prev.skills, skill.trim()]
      }));
    }
  };

  const handleSkillRemove = (skillToRemove: string) => {
    setJobData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const platforms = [
    { name: '智联招聘', logo: '🔗', status: 'ready' },
    { name: '前程无忧', logo: '📋', status: 'ready' },
    { name: 'BOSS直聘', logo: '💼', status: 'ready' },
    { name: '拉勾网', logo: '🚀', status: 'ready' }
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="container max-w-6xl py-12">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <BriefcaseIcon className="w-8 h-8 text-dsp-red" />
          <h1 className="text-3xl font-semibold text-dsp-dark">智能招聘助手</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 左侧：岗位需求表单 */}
          <div className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <h2 className="text-xl font-semibold text-dsp-dark mb-6">岗位需求信息</h2>
              
              <div className="space-y-6">
                {/* 基础信息 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dsp-dark mb-2">
                      职位名称 *
                    </label>
                    <input
                      type="text"
                      value={jobData.title}
                      onChange={(e) => setJobData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-dsp-red/20 focus:border-dsp-red"
                      placeholder="如：前端开发工程师"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-dsp-dark mb-2">
                      工作地点 *
                    </label>
                    <select
                      value={jobData.location}
                      onChange={(e) => setJobData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-dsp-red/20 focus:border-dsp-red"
                    >
                      <option value="">请选择城市</option>
                      <option value="北京">北京</option>
                      <option value="上海">上海</option>
                      <option value="深圳">深圳</option>
                      <option value="杭州">杭州</option>
                      <option value="广州">广州</option>
                      <option value="成都">成都</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dsp-dark mb-2">
                      学历要求
                    </label>
                    <select
                      value={jobData.education}
                      onChange={(e) => setJobData(prev => ({ ...prev, education: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-dsp-red/20 focus:border-dsp-red"
                    >
                      <option value="">请选择学历</option>
                      <option value="大专">大专</option>
                      <option value="本科">本科</option>
                      <option value="硕士">硕士</option>
                      <option value="博士">博士</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-dsp-dark mb-2">
                      工作经验
                    </label>
                    <select
                      value={jobData.experience}
                      onChange={(e) => setJobData(prev => ({ ...prev, experience: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-dsp-red/20 focus:border-dsp-red"
                    >
                      <option value="">请选择经验</option>
                      <option value="应届生">应届生</option>
                      <option value="1-3年">1-3年</option>
                      <option value="3-5年">3-5年</option>
                      <option value="5+年">5年以上</option>
                    </select>
                  </div>
                </div>

                {/* 技能要求 */}
                <div>
                  <label className="block text-sm font-medium text-dsp-dark mb-2">
                    技能要求
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {jobData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center px-3 py-1 bg-dsp-red/10 text-dsp-red text-sm rounded-full"
                      >
                        {skill}
                        <button
                          onClick={() => handleSkillRemove(skill)}
                          className="ml-2 text-dsp-red/60 hover:text-dsp-red"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="输入技能后按回车添加"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-dsp-red/20 focus:border-dsp-red"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSkillAdd((e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                  />
                </div>

                {/* 职位描述 */}
                <div>
                  <label className="block text-sm font-medium text-dsp-dark mb-2">
                    职位描述
                  </label>
                  <textarea
                    value={jobData.description}
                    onChange={(e) => setJobData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-dsp-red/20 focus:border-dsp-red"
                    placeholder="详细描述工作职责和要求..."
                  />
                </div>

                {/* 分析按钮 */}
                <button
                  onClick={handleAnalyze}
                  disabled={!jobData.title || !jobData.location || isAnalyzing}
                  className="w-full bg-dsp-red text-white py-3 px-6 rounded-lg font-medium hover:bg-dsp-red/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>AI分析中...</span>
                    </>
                  ) : (
                    <>
                      <RocketLaunchIcon className="w-5 h-5" />
                      <span>开始智能分析</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* 右侧：分析结果 */}
          <div className="space-y-8">
            {recommendation && (
              <>
                {/* 薪酬推荐 */}
                <div className="bg-white border border-gray-200 rounded-2xl p-8">
                  <h3 className="text-xl font-semibold text-dsp-dark mb-6 flex items-center">
                    <CurrencyDollarIcon className="w-6 h-6 text-dsp-red mr-2" />
                    薪酬推荐方案
                  </h3>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-dsp-dark">
                        {recommendation.minSalary.toLocaleString()}
                      </div>
                      <div className="text-sm text-dsp-gray">最低薪酬</div>
                    </div>
                    <div className="text-center p-4 bg-dsp-red/5 rounded-lg border-2 border-dsp-red/20">
                      <div className="text-2xl font-bold text-dsp-red">
                        {recommendation.medianSalary.toLocaleString()}
                      </div>
                      <div className="text-sm text-dsp-red">推荐薪酬</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-dsp-dark">
                        {recommendation.maxSalary.toLocaleString()}
                      </div>
                      <div className="text-sm text-dsp-gray">最高薪酬</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="text-dsp-gray">市场竞争力</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        recommendation.competitiveness === 'high' 
                          ? 'bg-green-100 text-green-600'
                          : recommendation.competitiveness === 'medium'
                          ? 'bg-yellow-100 text-yellow-600'
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {recommendation.competitiveness === 'high' ? '高竞争力' : 
                         recommendation.competitiveness === 'medium' ? '中等竞争力' : '低竞争力'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 市场分析 */}
                <div className="bg-white border border-gray-200 rounded-2xl p-8">
                  <h3 className="text-xl font-semibold text-dsp-dark mb-6 flex items-center">
                    <ChartBarIcon className="w-6 h-6 text-dsp-red mr-2" />
                    市场分析报告
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-dsp-gray mb-1">市场需求</div>
                      <div className="font-semibold text-dsp-dark">{recommendation.marketAnalysis.demandLevel}</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-dsp-gray mb-1">竞争程度</div>
                      <div className="font-semibold text-dsp-dark">{recommendation.marketAnalysis.competitionLevel}</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-dsp-gray mb-1">招聘难度</div>
                      <div className="font-semibold text-dsp-dark">{recommendation.marketAnalysis.recruitmentDifficulty}</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-dsp-gray mb-1">预计周期</div>
                      <div className="font-semibold text-dsp-dark">{recommendation.marketAnalysis.estimatedDays} 天</div>
                    </div>
                  </div>
                </div>

                {/* 一键发布 */}
                <div className="bg-white border border-gray-200 rounded-2xl p-8">
                  <h3 className="text-xl font-semibold text-dsp-dark mb-6 flex items-center">
                    <RocketLaunchIcon className="w-6 h-6 text-dsp-red mr-2" />
                    一键发布到招聘平台
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {platforms.map((platform) => (
                      <div key={platform.name} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{platform.logo}</span>
                          <span className="font-medium text-dsp-dark">{platform.name}</span>
                        </div>
                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowPublishModal(true)}
                    className="w-full bg-dsp-red text-white py-3 px-6 rounded-lg font-medium hover:bg-dsp-red/90 transition-colors"
                  >
                    一键发布职位 (模拟)
                  </button>
                </div>
              </>
            )}

            {!recommendation && !isAnalyzing && (
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center">
                <BriefcaseIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500 mb-2">等待分析</h3>
                <p className="text-gray-400">请先填写岗位需求信息，然后点击"开始智能分析"</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 发布成功模态框 */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-dsp-dark mb-2">发布成功！</h3>
              <p className="text-dsp-gray mb-6">
                职位已成功发布到 {platforms.length} 个招聘平台
              </p>
              <button
                onClick={() => setShowPublishModal(false)}
                className="bg-dsp-red text-white py-2 px-6 rounded-lg font-medium hover:bg-dsp-red/90 transition-colors"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};