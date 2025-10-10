/**
 * 求职者薪酬查询页面 - 优化版
 * 提供更全面的信息收集，生成更精准的薪酬分析
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MagnifyingGlassIcon,
  SparklesIcon,
  MapPinIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  ClockIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  StarIcon,
  CurrencyDollarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { getIndustries, getCategories, getPositions } from '@/data/jobCategories';
import { 
  popularCities, 
  citySelectionConfig, 
  getCityInfo 
} from '@/data/cities';

interface QueryForm {
  // 基础职位信息
  industry: string;
  category: string;
  position: string;
  location: string;
  experience: string;
  education: string;
  
  // 详细职业信息
  job_level: string;
  management_experience: string;
  company_size: string;
  work_type: string;
  
  // 技能和背景
  skills: string[];
  education_institution: string;
  certifications: string[];
  languages: string[];
  
  // 薪酬期望
  current_salary: string;
  expected_salary_min: string;
  expected_salary_max: string;
  salary_structure_preference: string;
  
  // 工作偏好
  remote_preference: string;
  overtime_acceptance: string;
  benefits_importance: string[];
  
  // 其他信息
  career_stage: string;
  job_switch_reason: string;
}

export const SalaryQueryPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCityLevel, setSelectedCityLevel] = useState('');
  const [form, setForm] = useState<QueryForm>({
    industry: '',
    category: '',
    position: '',
    location: '',
    experience: '',
    education: '',
    job_level: '',
    management_experience: '',
    company_size: '',
    work_type: '',
    skills: [],
    education_institution: '',
    certifications: [],
    languages: [],
    current_salary: '',
    expected_salary_min: '',
    expected_salary_max: '',
    salary_structure_preference: '',
    remote_preference: '',
    overtime_acceptance: '',
    benefits_importance: [],
    career_stage: '',
    job_switch_reason: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 导航到结果页面
    navigate('/results', { state: form });
  };

  const handleInputChange = (field: keyof QueryForm, value: string) => {
    setForm(prev => {
      const newForm = { ...prev, [field]: value };
      
      // 当行业变化时，重置分类和职位
      if (field === 'industry') {
        newForm.category = '';
        newForm.position = '';
      }
      
      // 当分类变化时，重置职位
      if (field === 'category') {
        newForm.position = '';
      }
      
      return newForm;
    });
  };

  const handleSkillAdd = (skill: string) => {
    if (skill.trim() && !form.skills.includes(skill.trim())) {
      setForm(prev => ({
        ...prev,
        skills: [...prev.skills, skill.trim()]
      }));
    }
  };

  const handleSkillRemove = (skillToRemove: string) => {
    setForm(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleCertificationAdd = (cert: string) => {
    if (cert.trim() && !form.certifications.includes(cert.trim())) {
      setForm(prev => ({
        ...prev,
        certifications: [...prev.certifications, cert.trim()]
      }));
    }
  };

  const handleCertificationRemove = (certToRemove: string) => {
    setForm(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert !== certToRemove)
    }));
  };

  const handleLanguageAdd = (lang: string) => {
    if (lang.trim() && !form.languages.includes(lang.trim())) {
      setForm(prev => ({
        ...prev,
        languages: [...prev.languages, lang.trim()]
      }));
    }
  };

  const handleLanguageRemove = (langToRemove: string) => {
    setForm(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang !== langToRemove)
    }));
  };

  const handleBenefitToggle = (benefit: string) => {
    setForm(prev => ({
      ...prev,
      benefits_importance: prev.benefits_importance.includes(benefit)
        ? prev.benefits_importance.filter(b => b !== benefit)
        : [...prev.benefits_importance, benefit]
    }));
  };

  // 获取指定级别的城市选项
  const getCitiesBySelectedLevel = (): string[] => {
    if (!selectedCityLevel) return getAllCityNames();
    const levelKey = selectedCityLevel as keyof typeof citySelectionConfig.groupedByLevel;
    return citySelectionConfig.groupedByLevel[levelKey] || [];
  };

  // 获取所有城市名称
  const getAllCityNames = (): string[] => {
    return Object.values(citySelectionConfig.groupedByLevel).flat();
  };

  const quickOptions = {
    locations: popularCities,
    experience: [
      '应届生', '1-3年', '3-5年', '5-10年', '10年以上'
    ],
    education: [
      '高中', '大专', '本科', '硕士', '博士'
    ]
  };

  // 获取当前选中行业的职业分类
  const getCurrentCategories = () => {
    return getCategories(form.industry);
  };

  // 获取当前选中分类的具体职位
  const getCurrentPositions = () => {
    return getPositions(form.industry, form.category);
  };

  // 计算表单完整度
  const getFormCompleteness = () => {
    const requiredFields = [form.industry, form.category, form.position, form.location, form.experience, form.education];
    const completedRequired = requiredFields.filter(field => field.trim()).length;
    const optionalFields = [
      form.job_level, form.management_experience, form.company_size,
      form.skills.length > 0, form.current_salary, form.expected_salary_min
    ];
    const completedOptional = optionalFields.filter(Boolean).length;
    
    return {
      required: Math.round((completedRequired / requiredFields.length) * 100),
      total: Math.round(((completedRequired + completedOptional) / (requiredFields.length + optionalFields.length)) * 100)
    };
  };

  const completeness = getFormCompleteness();
  const canSubmit = completeness.required === 100;

  const steps = [
    { id: 1, title: '基础信息', desc: '职位和背景' },
    { id: 2, title: '详细信息', desc: '经验和技能' },
    { id: 3, title: '薪酬期望', desc: '期望和偏好' },
  ];

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl shadow-lg">
              <MagnifyingGlassIcon className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-dsp-dark mb-4">
            智能薪酬查询
          </h1>
          <p className="text-xl text-dsp-gray max-w-3xl mx-auto">
            填写详细信息，获取基于AI分析的精准薪酬报告和个性化建议
          </p>
        </div>

        {/* 进度指示器 */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                  currentStep >= step.id 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  <span className="text-sm font-semibold">{step.id}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-20 h-0.5 mx-2 transition-all ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <h3 className="text-lg font-semibold text-dsp-dark">{steps[currentStep - 1].title}</h3>
            <p className="text-sm text-dsp-gray">{steps[currentStep - 1].desc}</p>
          </div>
        </div>

        {/* 完整度指示器 */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-dsp-dark">信息完整度</span>
              <span className="text-sm text-dsp-gray">{completeness.total}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${completeness.total}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-dsp-gray mt-2">
              <span>必填: {completeness.required}%</span>
              <span>信息越完整，分析越准确</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              
              {/* Step 1: 基础信息 */}
              {currentStep === 1 && (
                <div className="p-8 space-y-8">
                  {/* 职位选择 */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 space-y-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <BriefcaseIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-dsp-dark">职位信息</h3>
                        <p className="text-sm text-dsp-gray">选择您要查询的职位</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* 行业选择 */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-dsp-dark">行业领域 *</label>
                        <select
                          value={form.industry}
                          onChange={(e) => handleInputChange('industry', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-xl transition-all text-dsp-dark appearance-none bg-white"
                          required
                        >
                          <option value="">请选择行业</option>
                          {getIndustries().map(industry => (
                            <option key={industry} value={industry}>{industry}</option>
                          ))}
                        </select>
                      </div>

                      {/* 职业分类选择 */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-dsp-dark">职业分类 *</label>
                        <select
                          value={form.category}
                          onChange={(e) => handleInputChange('category', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-xl transition-all text-dsp-dark appearance-none bg-white"
                          disabled={!form.industry}
                          required
                        >
                          <option value="">请选择分类</option>
                          {getCurrentCategories().map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>

                      {/* 具体职位选择 */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-dsp-dark">具体职位 *</label>
                        <select
                          value={form.position}
                          onChange={(e) => handleInputChange('position', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-xl transition-all text-dsp-dark appearance-none bg-white"
                          disabled={!form.category}
                          required
                        >
                          <option value="">请选择职位</option>
                          {getCurrentPositions().map(position => (
                            <option key={position} value={position}>{position}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* 选择路径显示 */}
                    {form.industry && form.category && form.position && (
                      <div className="mt-4 p-4 bg-white border border-blue-200 rounded-xl">
                        <div className="flex items-center space-x-2 text-sm">
                          <SparklesIcon className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-blue-800">已选择:</span>
                          <span className="text-dsp-dark">{form.industry} → {form.category} → {form.position}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 工作地点 */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 space-y-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                        <MapPinIcon className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-dsp-dark">工作地点</h3>
                        <p className="text-sm text-dsp-gray">选择您的工作城市</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {/* 城市级别筛选 */}
                      <div>
                        <label className="block text-sm font-medium text-dsp-dark mb-2">
                          城市级别筛选 (可选)
                        </label>
                        <select
                          value={selectedCityLevel}
                          onChange={(e) => {
                            setSelectedCityLevel(e.target.value);
                            // 如果当前选择的城市不在新级别中，清空选择
                            if (e.target.value && form.location) {
                              const levelKey = e.target.value as keyof typeof citySelectionConfig.groupedByLevel;
                              const citiesInLevel = citySelectionConfig.groupedByLevel[levelKey] || [];
                              if (!citiesInLevel.includes(form.location)) {
                                handleInputChange('location', '');
                              }
                            }
                          }}
                          className="w-full px-4 py-3 border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 rounded-xl transition-all text-dsp-dark appearance-none bg-white"
                        >
                          <option value="">所有城市</option>
                          <option value="一线城市">一线城市</option>
                          <option value="新一线城市">新一线城市</option>
                          <option value="二线城市">二线城市</option>
                          <option value="三线城市">三线城市</option>
                        </select>
                      </div>

                      {/* 城市选择 */}
                      <div>
                        <label className="block text-sm font-medium text-dsp-dark mb-2">
                          工作城市 *
                          {selectedCityLevel && (
                            <span className="ml-2 text-xs text-green-600">
                              (已筛选: {selectedCityLevel})
                            </span>
                          )}
                        </label>
                        <select
                          value={form.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 rounded-xl transition-all text-dsp-dark appearance-none bg-white"
                          required
                        >
                          <option value="">请选择城市</option>
                          
                          {/* 如果选择了级别，显示对应级别的城市 */}
                          {selectedCityLevel ? (
                            getCitiesBySelectedLevel().map((city: string) => (
                              <option key={city} value={city}>{city}</option>
                            ))
                          ) : (
                            /* 如果没有选择级别，按级别分组显示 */
                            Object.entries(citySelectionConfig.groupedByLevel).map(([levelName, cities]) => (
                              <optgroup key={levelName} label={levelName}>
                                {cities.map((city: string) => (
                                  <option key={city} value={city}>{city}</option>
                                ))}
                              </optgroup>
                            ))
                          )}
                        </select>
                      </div>

                      {/* 热门城市快速选择 */}
                      <div>
                        <div className="flex items-center space-x-2 mb-3">
                          <span className="text-sm font-medium text-dsp-dark">热门城市快选:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {popularCities.map(location => (
                            <button
                              key={location}
                              type="button"
                              onClick={() => handleInputChange('location', location)}
                              className={`px-3 py-2 text-sm border-2 rounded-lg transition-all font-medium ${
                                form.location === location
                                  ? 'bg-green-500 border-green-500 text-white shadow-md'
                                  : 'bg-white border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 hover:shadow-sm'
                              }`}
                            >
                              {location}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 选中城市信息显示 */}
                      {form.location && (
                        <div className="mt-4 p-4 bg-white border-2 border-green-200 rounded-xl">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <MapPinIcon className="w-5 h-5 text-green-600" />
                              <div>
                                <div className="font-semibold text-dsp-dark flex items-center space-x-2">
                                  <span>已选择: {form.location}</span>
                                  {(() => {
                                    const cityInfo = getCityInfo(form.location);
                                    if (!cityInfo) return null;
                                    
                                    const levelColors = {
                                      'first-tier': 'bg-red-100 text-red-800',
                                      'new-first-tier': 'bg-orange-100 text-orange-800',
                                      'second-tier': 'bg-blue-100 text-blue-800',
                                      'third-tier': 'bg-green-100 text-green-800',
                                      'other': 'bg-gray-100 text-gray-800'
                                    };
                                    
                                    const levelTexts = {
                                      'first-tier': '一线',
                                      'new-first-tier': '新一线',
                                      'second-tier': '二线',
                                      'third-tier': '三线',
                                      'other': '其他'
                                    };
                                    
                                    return (
                                      <span className={`px-2 py-1 text-xs font-medium rounded ${levelColors[cityInfo.level]}`}>
                                        {levelTexts[cityInfo.level]}城市
                                      </span>
                                    );
                                  })()}
                                </div>
                                {(() => {
                                  const cityInfo = getCityInfo(form.location);
                                  if (cityInfo) {
                                    const regionNames = {
                                      'north': '华北',
                                      'south': '华南',
                                      'east': '华东',
                                      'southwest': '西南',
                                      'northwest': '西北',
                                      'northeast': '东北',
                                      'central': '华中'
                                    };
                                    
                                    return (
                                      <div className="text-sm text-dsp-gray mt-1">
                                        {cityInfo.province} · {regionNames[cityInfo.region]}地区
                                        {cityInfo.population && ` · 人口${cityInfo.population}万`}
                                        {cityInfo.gdp && ` · GDP${cityInfo.gdp}亿元`}
                                      </div>
                                    );
                                  }
                                  return null;
                                })()}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                handleInputChange('location', '');
                                setSelectedCityLevel('');
                              }}
                              className="text-green-600 hover:text-green-800 text-sm font-medium transition-colors"
                            >
                              重新选择
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 工作经验和学历 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                          <ClockIcon className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-dsp-dark">工作经验</h3>
                          <p className="text-sm text-dsp-gray">您的工作年限</p>
                        </div>
                      </div>
                      
                      <select
                        value={form.experience}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 rounded-xl transition-all text-dsp-dark appearance-none bg-white"
                        required
                      >
                        <option value="">请选择经验年限</option>
                        {quickOptions.experience.map(exp => (
                          <option key={exp} value={exp}>{exp}</option>
                        ))}
                      </select>
                    </div>

                    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                          <AcademicCapIcon className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-dsp-dark">教育背景</h3>
                          <p className="text-sm text-dsp-gray">您的学历水平</p>
                        </div>
                      </div>
                      
                      <select
                        value={form.education}
                        onChange={(e) => handleInputChange('education', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 rounded-xl transition-all text-dsp-dark appearance-none bg-white"
                        required
                      >
                        <option value="">请选择学历</option>
                        {quickOptions.education.map(edu => (
                          <option key={edu} value={edu}>{edu}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: 详细信息 */}
              {currentStep === 2 && (
                <div className="p-8 space-y-8">
                  {/* 职业详情 */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 space-y-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <UserGroupIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-dsp-dark">职业详情</h3>
                        <p className="text-sm text-dsp-gray">更详细的职业信息</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-dsp-dark">职级定位</label>
                        <select
                          value={form.job_level}
                          onChange={(e) => handleInputChange('job_level', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-xl transition-all text-dsp-dark appearance-none bg-white"
                        >
                          <option value="">请选择职级</option>
                          <option value="初级">初级</option>
                          <option value="中级">中级</option>
                          <option value="高级">高级</option>
                          <option value="专家">专家</option>
                          <option value="架构师">架构师</option>
                          <option value="技术总监">技术总监</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-dsp-dark">管理经验</label>
                        <select
                          value={form.management_experience}
                          onChange={(e) => handleInputChange('management_experience', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-xl transition-all text-dsp-dark appearance-none bg-white"
                        >
                          <option value="">请选择管理经验</option>
                          <option value="无管理经验">无管理经验</option>
                          <option value="小团队(2-5人)">小团队(2-5人)</option>
                          <option value="中团队(5-15人)">中团队(5-15人)</option>
                          <option value="大团队(15人以上)">大团队(15人以上)</option>
                          <option value="部门负责人">部门负责人</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-dsp-dark">公司规模</label>
                        <select
                          value={form.company_size}
                          onChange={(e) => handleInputChange('company_size', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-xl transition-all text-dsp-dark appearance-none bg-white"
                        >
                          <option value="">请选择公司规模</option>
                          <option value="创业公司(1-50人)">创业公司(1-50人)</option>
                          <option value="中小企业(51-500人)">中小企业(51-500人)</option>
                          <option value="大型企业(501-5000人)">大型企业(501-5000人)</option>
                          <option value="超大企业(5000人以上)">超大企业(5000人以上)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* 技能和认证 */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 space-y-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                        <StarIcon className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-dsp-dark">技能和认证</h3>
                        <p className="text-sm text-dsp-gray">专业技能与资质</p>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      {/* 技能专长 */}
                      <div>
                        <label className="block text-sm font-medium text-dsp-dark mb-2">
                          技能专长
                        </label>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {form.skills.map((skill) => (
                            <span
                              key={skill}
                              className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full"
                            >
                              {skill}
                              <button
                                type="button"
                                onClick={() => handleSkillRemove(skill)}
                                className="ml-2 text-purple-500 hover:text-purple-700"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                        <input
                          type="text"
                          placeholder="输入技能后按回车添加，如：React、Python、机器学习等"
                          className="w-full px-4 py-3 border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 rounded-xl transition-all text-dsp-dark placeholder:text-dsp-gray bg-white"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleSkillAdd((e.target as HTMLInputElement).value);
                              (e.target as HTMLInputElement).value = '';
                            }
                          }}
                        />
                      </div>

                      {/* 专业认证 */}
                      <div>
                        <label className="block text-sm font-medium text-dsp-dark mb-2">
                          专业认证
                        </label>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {form.certifications.map((cert) => (
                            <span
                              key={cert}
                              className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                            >
                              {cert}
                              <button
                                type="button"
                                onClick={() => handleCertificationRemove(cert)}
                                className="ml-2 text-blue-500 hover:text-blue-700"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                        <input
                          type="text"
                          placeholder="输入认证后按回车添加，如：AWS认证、PMP、CPA等"
                          className="w-full px-4 py-3 border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 rounded-xl transition-all text-dsp-dark placeholder:text-dsp-gray bg-white"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleCertificationAdd((e.target as HTMLInputElement).value);
                              (e.target as HTMLInputElement).value = '';
                            }
                          }}
                        />
                      </div>

                      {/* 语言能力 */}
                      <div>
                        <label className="block text-sm font-medium text-dsp-dark mb-2">
                          语言能力
                        </label>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {form.languages.map((lang) => (
                            <span
                              key={lang}
                              className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full"
                            >
                              {lang}
                              <button
                                type="button"
                                onClick={() => handleLanguageRemove(lang)}
                                className="ml-2 text-green-500 hover:text-green-700"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                        <input
                          type="text"
                          placeholder="输入语言后按回车添加，如：英语(流利)、日语(基础)等"
                          className="w-full px-4 py-3 border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 rounded-xl transition-all text-dsp-dark placeholder:text-dsp-gray bg-white"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleLanguageAdd((e.target as HTMLInputElement).value);
                              (e.target as HTMLInputElement).value = '';
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 教育背景详情 */}
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 space-y-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                        <AcademicCapIcon className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-dsp-dark">教育背景详情</h3>
                        <p className="text-sm text-dsp-gray">院校类型和职业阶段</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-dsp-dark">院校背景</label>
                        <select
                          value={form.education_institution}
                          onChange={(e) => handleInputChange('education_institution', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 rounded-xl transition-all text-dsp-dark appearance-none bg-white"
                        >
                          <option value="">请选择院校类型</option>
                          <option value="985/211高校">985/211高校</option>
                          <option value="双一流大学">双一流大学</option>
                          <option value="知名大学">知名大学</option>
                          <option value="普通本科">普通本科</option>
                          <option value="专科院校">专科院校</option>
                          <option value="海外知名大学">海外知名大学</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-dsp-dark">职业阶段</label>
                        <select
                          value={form.career_stage}
                          onChange={(e) => handleInputChange('career_stage', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 rounded-xl transition-all text-dsp-dark appearance-none bg-white"
                        >
                          <option value="">请选择职业阶段</option>
                          <option value="探索期">探索期</option>
                          <option value="成长期">成长期</option>
                          <option value="成熟期">成熟期</option>
                          <option value="转型期">转型期</option>
                          <option value="巅峰期">巅峰期</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: 薪酬期望 */}
              {currentStep === 3 && (
                <div className="p-8 space-y-8">
                  {/* 薪酬信息 */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 space-y-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                        <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-dsp-dark">薪酬信息</h3>
                        <p className="text-sm text-dsp-gray">当前薪酬和期望薪酬</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-dsp-dark">当前薪酬(月薪)</label>
                        <input
                          type="number"
                          value={form.current_salary}
                          onChange={(e) => handleInputChange('current_salary', e.target.value)}
                          placeholder="如：25000"
                          className="w-full px-4 py-3 border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 rounded-xl transition-all text-dsp-dark placeholder:text-dsp-gray bg-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-dsp-dark">期望薪酬最低值</label>
                        <input
                          type="number"
                          value={form.expected_salary_min}
                          onChange={(e) => handleInputChange('expected_salary_min', e.target.value)}
                          placeholder="如：30000"
                          className="w-full px-4 py-3 border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 rounded-xl transition-all text-dsp-dark placeholder:text-dsp-gray bg-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-dsp-dark">期望薪酬最高值</label>
                        <input
                          type="number"
                          value={form.expected_salary_max}
                          onChange={(e) => handleInputChange('expected_salary_max', e.target.value)}
                          placeholder="如：45000"
                          className="w-full px-4 py-3 border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 rounded-xl transition-all text-dsp-dark placeholder:text-dsp-gray bg-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-dsp-dark">薪酬结构偏好</label>
                      <select
                        value={form.salary_structure_preference}
                        onChange={(e) => handleInputChange('salary_structure_preference', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 rounded-xl transition-all text-dsp-dark appearance-none bg-white"
                      >
                        <option value="">请选择薪酬结构偏好</option>
                        <option value="高基本工资">高基本工资，低绩效奖金</option>
                        <option value="平衡结构">基本工资与绩效奖金平衡</option>
                        <option value="高绩效奖金">基本工资较低，高绩效奖金</option>
                        <option value="股权激励">重视股权激励</option>
                      </select>
                    </div>
                  </div>

                  {/* 工作偏好 */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 space-y-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                        <BuildingOfficeIcon className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-dsp-dark">工作偏好</h3>
                        <p className="text-sm text-dsp-gray">工作方式和环境偏好</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-dsp-dark">远程工作偏好</label>
                        <select
                          value={form.remote_preference}
                          onChange={(e) => handleInputChange('remote_preference', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 rounded-xl transition-all text-dsp-dark appearance-none bg-white"
                        >
                          <option value="">请选择</option>
                          <option value="prefer_office">偏好办公室</option>
                          <option value="hybrid">混合办公</option>
                          <option value="prefer_remote">偏好远程</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-dsp-dark">加班接受度</label>
                        <select
                          value={form.overtime_acceptance}
                          onChange={(e) => handleInputChange('overtime_acceptance', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 rounded-xl transition-all text-dsp-dark appearance-none bg-white"
                        >
                          <option value="">请选择</option>
                          <option value="unwilling">不愿意</option>
                          <option value="occasionally">偶尔可以</option>
                          <option value="willing">愿意</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* 福利重要性 */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 space-y-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <ChartBarIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-dsp-dark">福利重要性</h3>
                        <p className="text-sm text-dsp-gray">选择您重视的福利类型</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {[
                        '五险一金',
                        '补充商业保险',
                        '年终奖',
                        '股票期权',
                        '带薪年假',
                        '弹性工作时间',
                        '远程办公',
                        '培训机会',
                        '健身房',
                        '免费三餐',
                        '交通补贴',
                        '住房补贴'
                      ].map((benefit) => (
                        <label key={benefit} className="flex items-center cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={form.benefits_importance.includes(benefit)}
                            onChange={() => handleBenefitToggle(benefit)}
                            className="sr-only"
                          />
                          <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border-2 transition-all ${
                            form.benefits_importance.includes(benefit)
                              ? 'bg-blue-500 border-blue-500 text-white'
                              : 'bg-white border-gray-200 text-dsp-dark hover:border-blue-300 group-hover:bg-blue-50'
                          }`}>
                            <span className="text-sm font-medium">{benefit}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 导航按钮 */}
              <div className="flex items-center justify-between p-8 bg-gray-50 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                  disabled={currentStep === 1}
                  className="px-6 py-3 text-dsp-gray hover:text-dsp-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  上一步
                </button>

                <div className="flex space-x-3">
                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(prev => Math.min(3, prev + 1))}
                      className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
                    >
                      下一步
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!canSubmit}
                      className="group px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center space-x-2"
                    >
                      <MagnifyingGlassIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span>
                        {!canSubmit ? '请完善必填信息' : '生成AI薪酬报告'}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
