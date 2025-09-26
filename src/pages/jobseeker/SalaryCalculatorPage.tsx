/**
 * 薪酬计算器
 * 根据你的技能、经验和地区，智能计算合理薪酬范围
 */

import React, { useState, useEffect } from 'react';
import { deepseekApi } from '@/services/deepseekApi';
import { 
  LightBulbIcon,
  SparklesIcon,
  MapPinIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  ClockIcon,
  StarIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  InformationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface CalculatorInput {
  position: string;
  experience: string;
  education: string;
  location: string;
  company_size: string;
  industry: string;
  skills: string[];
  certifications: string[];
  languages: string[];
  remote_preference: string;
  overtime_acceptance: string;
  travel_willingness: string;
}

interface SalaryResult {
  base_salary: {
    min: number;
    median: number;
    max: number;
    percentile_25: number;
    percentile_75: number;
    percentile_90: number;
  };
  total_compensation: {
    min: number;
    median: number;
    max: number;
  };
  breakdown: {
    base: number;
    bonus: number;
    equity: number;
    benefits: number;
  };
  market_position: 'below' | 'at' | 'above';
  confidence_score: number;
  factors: SalaryFactor[];
  recommendations: string[];
  comparison: MarketComparison;
}

interface SalaryFactor {
  factor: string;
  impact: 'positive' | 'negative' | 'neutral';
  weight: number;
  description: string;
  adjustment: number;
}

interface MarketComparison {
  similar_positions: Array<{
    title: string;
    salary_range: { min: number; max: number };
    match_score: number;
  }>;
  location_comparison: Array<{
    city: string;
    salary_adjustment: number;
    cost_of_living: number;
  }>;
  industry_benchmark: {
    industry_avg: number;
    your_position: number;
    difference: number;
  };
}

export const SalaryCalculatorPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'input' | 'calculating' | 'results'>('input');
  const [calculatorInput, setCalculatorInput] = useState<CalculatorInput>({
    position: '',
    experience: '',
    education: '',
    location: '',
    company_size: '',
    industry: '',
    skills: [],
    certifications: [],
    languages: [],
    remote_preference: '',
    overtime_acceptance: '',
    travel_willingness: ''
  });
  const [salaryResult, setSalaryResult] = useState<SalaryResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // 模拟薪酬计算
  const calculateSalary = async () => {
    setIsCalculating(true);
    setCurrentStep('calculating');
    
    try {
      // 调用真实的AI API进行薪酬计算
      const response = await deepseekApi.salaryCalculation({
        position: calculatorInput.position,
        location: calculatorInput.location,
        experience: calculatorInput.experience,
        education: calculatorInput.education,
        industry: calculatorInput.industry,
        skills: calculatorInput.skills,
        companySize: calculatorInput.company_size,
        jobLevel: '中级' // 默认职级，可以后续优化
      });
      
      // TODO: 使用AI响应来生成更准确的薪酬计算结果
      console.log('AI薪酬计算结果:', response);
    } catch (error) {
      console.error('AI薪酬计算失败:', error);
      // 如果API调用失败，继续使用原有的计算逻辑
    }
    
    // 基础薪酬计算逻辑（使用原有逻辑或结合AI结果）
    let baseSalary = 20000; // 基础薪酬
    
    // 经验调整
    const experienceMultiplier = {
      '应届生': 1.0,
      '1-3年': 1.3,
      '3-5年': 1.6,
      '5-10年': 2.0,
      '10年以上': 2.5
    }[calculatorInput.experience] || 1.0;
    
    baseSalary *= experienceMultiplier;
    
    // 学历调整
    const educationBonus = {
      '高中': 0,
      '大专': 2000,
      '本科': 5000,
      '硕士': 8000,
      '博士': 12000
    }[calculatorInput.education] || 0;
    
    baseSalary += educationBonus;
    
    // 地区调整
    const locationMultiplier = {
      '北京': 1.4,
      '上海': 1.35,
      '深圳': 1.3,
      '杭州': 1.2,
      '广州': 1.15,
      '成都': 1.0,
      '武汉': 0.9,
      '西安': 0.85
    }[calculatorInput.location] || 1.0;
    
    baseSalary *= locationMultiplier;
    
    // 公司规模调整
    const companySizeMultiplier = {
      '创业公司(1-50人)': 0.9,
      '中小企业(51-500人)': 1.0,
      '大型企业(501-5000人)': 1.15,
      '超大企业(5000人以上)': 1.3
    }[calculatorInput.company_size] || 1.0;
    
    baseSalary *= companySizeMultiplier;
    
    // 技能加成
    const skillBonus = calculatorInput.skills.length * 2000;
    baseSalary += skillBonus;
    
    // 认证加成
    const certificationBonus = calculatorInput.certifications.length * 3000;
    baseSalary += certificationBonus;
    
    // 语言能力加成
    const languageBonus = calculatorInput.languages.length * 1500;
    baseSalary += languageBonus;
    
    // 远程工作调整
    if (calculatorInput.remote_preference === 'prefer_remote') {
      baseSalary *= 0.95; // 远程工作通常薪酬略低
    }
    
    // 加班接受度调整
    if (calculatorInput.overtime_acceptance === 'willing') {
      baseSalary *= 1.1;
    }
    
    // 出差意愿调整
    if (calculatorInput.travel_willingness === 'willing') {
      baseSalary *= 1.05;
    }
    
    const median = Math.round(baseSalary);
    const min = Math.round(median * 0.7);
    const max = Math.round(median * 1.5);
    const percentile_25 = Math.round(median * 0.8);
    const percentile_75 = Math.round(median * 1.2);
    const percentile_90 = Math.round(median * 1.4);
    
    // 生成薪酬影响因素
    const factors: SalaryFactor[] = [
      {
        factor: '工作经验',
        impact: experienceMultiplier > 1.2 ? 'positive' : experienceMultiplier < 1.0 ? 'negative' : 'neutral',
        weight: 25,
        description: `${calculatorInput.experience}的工作经验`,
        adjustment: Math.round((experienceMultiplier - 1) * 100)
      },
      {
        factor: '地理位置',
        impact: locationMultiplier > 1.1 ? 'positive' : locationMultiplier < 1.0 ? 'negative' : 'neutral',
        weight: 20,
        description: `${calculatorInput.location}地区薪酬水平`,
        adjustment: Math.round((locationMultiplier - 1) * 100)
      },
      {
        factor: '技能专长',
        impact: calculatorInput.skills.length > 3 ? 'positive' : 'neutral',
        weight: 15,
        description: `掌握${calculatorInput.skills.length}项核心技能`,
        adjustment: calculatorInput.skills.length * 8
      },
      {
        factor: '学历背景',
        impact: educationBonus > 5000 ? 'positive' : educationBonus > 0 ? 'neutral' : 'negative',
        weight: 10,
        description: `${calculatorInput.education}学历`,
        adjustment: Math.round((educationBonus / median) * 100)
      }
    ];
    
    const result: SalaryResult = {
      base_salary: {
        min,
        median,
        max,
        percentile_25,
        percentile_75,
        percentile_90
      },
      total_compensation: {
        min: Math.round(min * 1.2),
        median: Math.round(median * 1.3),
        max: Math.round(max * 1.4)
      },
      breakdown: {
        base: median,
        bonus: Math.round(median * 0.15),
        equity: Math.round(median * 0.1),
        benefits: Math.round(median * 0.05)
      },
      market_position: median > 30000 ? 'above' : median < 20000 ? 'below' : 'at',
      confidence_score: 85,
      factors,
      recommendations: [
        '考虑学习热门技能如React、Python等提升竞争力',
        '获得相关行业认证可以显著提升薪酬',
        '积累项目经验和作品集有助于薪酬谈判',
        '关注目标公司的薪酬结构和福利政策'
      ],
      comparison: {
        similar_positions: [
          { title: '前端开发工程师', salary_range: { min: min - 3000, max: max - 5000 }, match_score: 92 },
          { title: '全栈开发工程师', salary_range: { min: min + 2000, max: max + 3000 }, match_score: 88 },
          { title: 'React开发工程师', salary_range: { min: min - 1000, max: max + 1000 }, match_score: 95 }
        ],
        location_comparison: [
          { city: '北京', salary_adjustment: 15, cost_of_living: 120 },
          { city: '上海', salary_adjustment: 12, cost_of_living: 115 },
          { city: '深圳', salary_adjustment: 10, cost_of_living: 110 }
        ],
        industry_benchmark: {
          industry_avg: Math.round(median * 1.05),
          your_position: median,
          difference: Math.round(median * 0.05)
        }
      }
    };
    
    setSalaryResult(result);
    setIsCalculating(false);
    setCurrentStep('results');
  };

  const handleSkillAdd = (skill: string) => {
    if (skill.trim() && !calculatorInput.skills.includes(skill.trim())) {
      setCalculatorInput(prev => ({
        ...prev,
        skills: [...prev.skills, skill.trim()]
      }));
    }
  };

  const handleSkillRemove = (skillToRemove: string) => {
    setCalculatorInput(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleCertificationAdd = (cert: string) => {
    if (cert.trim() && !calculatorInput.certifications.includes(cert.trim())) {
      setCalculatorInput(prev => ({
        ...prev,
        certifications: [...prev.certifications, cert.trim()]
      }));
    }
  };

  const handleCertificationRemove = (certToRemove: string) => {
    setCalculatorInput(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert !== certToRemove)
    }));
  };

  const handleLanguageAdd = (lang: string) => {
    if (lang.trim() && !calculatorInput.languages.includes(lang.trim())) {
      setCalculatorInput(prev => ({
        ...prev,
        languages: [...prev.languages, lang.trim()]
      }));
    }
  };

  const handleLanguageRemove = (langToRemove: string) => {
    setCalculatorInput(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang !== langToRemove)
    }));
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="container max-w-6xl py-12">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-3 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-2xl">
            <LightBulbIcon className="w-8 h-8 text-orange-600" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-dsp-dark">薪酬计算器</h1>
            <p className="text-dsp-gray mt-1">基于多维度分析，计算你的合理薪酬范围</p>
          </div>
        </div>

        {/* 内容区域 */}
        {currentStep === 'input' && (
          <CalculatorForm 
            input={calculatorInput}
            setInput={setCalculatorInput}
            onSkillAdd={handleSkillAdd}
            onSkillRemove={handleSkillRemove}
            onCertificationAdd={handleCertificationAdd}
            onCertificationRemove={handleCertificationRemove}
            onLanguageAdd={handleLanguageAdd}
            onLanguageRemove={handleLanguageRemove}
            onCalculate={calculateSalary}
          />
        )}

        {currentStep === 'calculating' && (
          <CalculatingProgress />
        )}

        {currentStep === 'results' && salaryResult && (
          <SalaryResults 
            result={salaryResult}
            onRecalculate={() => setCurrentStep('input')}
          />
        )}
      </div>
    </div>
  );
};

// 计算器表单组件
const CalculatorForm: React.FC<{
  input: CalculatorInput;
  setInput: React.Dispatch<React.SetStateAction<CalculatorInput>>;
  onSkillAdd: (skill: string) => void;
  onSkillRemove: (skill: string) => void;
  onCertificationAdd: (cert: string) => void;
  onCertificationRemove: (cert: string) => void;
  onLanguageAdd: (lang: string) => void;
  onLanguageRemove: (lang: string) => void;
  onCalculate: () => void;
}> = ({ input, setInput, onSkillAdd, onSkillRemove, onCertificationAdd, onCertificationRemove, onLanguageAdd, onLanguageRemove, onCalculate }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white border border-gray-200 rounded-2xl p-8">
        <h2 className="text-xl font-semibold text-dsp-dark mb-6">填写你的职业信息</h2>
        
        <div className="space-y-8">
          {/* 基础信息 */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-dsp-dark border-b border-gray-200 pb-2">基础信息</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-dsp-dark mb-2">
                  目标职位 *
                </label>
                <input
                  type="text"
                  value={input.position}
                  onChange={(e) => setInput(prev => ({ ...prev, position: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  placeholder="如：高级前端工程师"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dsp-dark mb-2">
                  工作经验 *
                </label>
                <select
                  value={input.experience}
                  onChange={(e) => setInput(prev => ({ ...prev, experience: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                >
                  <option value="">请选择工作经验</option>
                  <option value="应届生">应届生</option>
                  <option value="1-3年">1-3年</option>
                  <option value="3-5年">3-5年</option>
                  <option value="5-10年">5-10年</option>
                  <option value="10年以上">10年以上</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-dsp-dark mb-2">
                  学历背景 *
                </label>
                <select
                  value={input.education}
                  onChange={(e) => setInput(prev => ({ ...prev, education: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                >
                  <option value="">请选择学历</option>
                  <option value="高中">高中</option>
                  <option value="大专">大专</option>
                  <option value="本科">本科</option>
                  <option value="硕士">硕士</option>
                  <option value="博士">博士</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dsp-dark mb-2">
                  工作地点 *
                </label>
                <select
                  value={input.location}
                  onChange={(e) => setInput(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                >
                  <option value="">请选择城市</option>
                  <option value="北京">北京</option>
                  <option value="上海">上海</option>
                  <option value="深圳">深圳</option>
                  <option value="杭州">杭州</option>
                  <option value="广州">广州</option>
                  <option value="成都">成都</option>
                  <option value="武汉">武汉</option>
                  <option value="西安">西安</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-dsp-dark mb-2">
                  公司规模
                </label>
                <select
                  value={input.company_size}
                  onChange={(e) => setInput(prev => ({ ...prev, company_size: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                >
                  <option value="">请选择公司规模</option>
                  <option value="创业公司(1-50人)">创业公司(1-50人)</option>
                  <option value="中小企业(51-500人)">中小企业(51-500人)</option>
                  <option value="大型企业(501-5000人)">大型企业(501-5000人)</option>
                  <option value="超大企业(5000人以上)">超大企业(5000人以上)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dsp-dark mb-2">
                  行业领域
                </label>
                <select
                  value={input.industry}
                  onChange={(e) => setInput(prev => ({ ...prev, industry: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                >
                  <option value="">请选择行业</option>
                  <option value="互联网">互联网</option>
                  <option value="金融">金融</option>
                  <option value="教育">教育</option>
                  <option value="医疗">医疗</option>
                  <option value="制造业">制造业</option>
                  <option value="咨询">咨询</option>
                  <option value="人工智能">人工智能</option>
                  <option value="区块链">区块链</option>
                </select>
              </div>
            </div>
          </div>

          {/* 技能和认证 */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-dsp-dark border-b border-gray-200 pb-2">技能和认证</h3>
            
            {/* 技能专长 */}
            <div>
              <label className="block text-sm font-medium text-dsp-dark mb-2">
                技能专长
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {input.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full"
                  >
                    {skill}
                    <button
                      onClick={() => onSkillRemove(skill)}
                      className="ml-2 text-orange-500 hover:text-orange-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="输入技能后按回车添加"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    onSkillAdd((e.target as HTMLInputElement).value);
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
                {input.certifications.map((cert) => (
                  <span
                    key={cert}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                  >
                    {cert}
                    <button
                      onClick={() => onCertificationRemove(cert)}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="输入认证后按回车添加，如：AWS认证、PMP等"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    onCertificationAdd((e.target as HTMLInputElement).value);
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
                {input.languages.map((lang) => (
                  <span
                    key={lang}
                    className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full"
                  >
                    {lang}
                    <button
                      onClick={() => onLanguageRemove(lang)}
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
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    onLanguageAdd((e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
              />
            </div>
          </div>

          {/* 工作偏好 */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-dsp-dark border-b border-gray-200 pb-2">工作偏好</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-dsp-dark mb-2">
                  远程工作偏好
                </label>
                <select
                  value={input.remote_preference}
                  onChange={(e) => setInput(prev => ({ ...prev, remote_preference: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                >
                  <option value="">请选择</option>
                  <option value="prefer_office">偏好办公室</option>
                  <option value="hybrid">混合办公</option>
                  <option value="prefer_remote">偏好远程</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dsp-dark mb-2">
                  加班接受度
                </label>
                <select
                  value={input.overtime_acceptance}
                  onChange={(e) => setInput(prev => ({ ...prev, overtime_acceptance: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                >
                  <option value="">请选择</option>
                  <option value="unwilling">不愿意</option>
                  <option value="occasionally">偶尔可以</option>
                  <option value="willing">愿意</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dsp-dark mb-2">
                  出差意愿
                </label>
                <select
                  value={input.travel_willingness}
                  onChange={(e) => setInput(prev => ({ ...prev, travel_willingness: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                >
                  <option value="">请选择</option>
                  <option value="unwilling">不愿意</option>
                  <option value="occasionally">偶尔可以</option>
                  <option value="willing">愿意</option>
                </select>
              </div>
            </div>
          </div>

          {/* 计算按钮 */}
          <div className="pt-6">
            <button
              onClick={onCalculate}
              disabled={!input.position || !input.experience || !input.education || !input.location}
              className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              <SparklesIcon className="w-5 h-5" />
              <span>
                {!input.position || !input.experience || !input.education || !input.location
                  ? '请完善必填信息'
                  : '开始智能计算薪酬'
                }
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 计算进度组件
const CalculatingProgress: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
        <div className="space-y-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-600 border-t-transparent"></div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-dsp-dark mb-2">AI正在计算你的薪酬范围</h3>
            <p className="text-dsp-gray">
              正在分析市场数据、技能价值和地区差异...
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-2 text-sm text-orange-600">
              <CheckCircleIcon className="w-4 h-4" />
              <span>基础信息分析完成</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-orange-600">
              <CheckCircleIcon className="w-4 h-4" />
              <span>技能价值评估完成</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-dsp-gray">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-orange-600 border-t-transparent"></div>
              <span>市场对标分析中...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 薪酬计算结果组件
const SalaryResults: React.FC<{
  result: SalaryResult;
  onRecalculate: () => void;
}> = ({ result, onRecalculate }) => {
  return (
    <div className="space-y-8">
      {/* 操作栏 */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-dsp-dark">你的薪酬计算结果</h2>
        <div className="flex space-x-3">
          <button
            onClick={onRecalculate}
            className="px-4 py-2 text-dsp-gray hover:text-dsp-dark transition-colors rounded-lg hover:bg-gray-50"
          >
            重新计算
          </button>
          <button className="px-4 py-2 bg-orange-600 text-white hover:bg-orange-700 transition-colors rounded-lg font-medium">
            保存结果
          </button>
        </div>
      </div>

      {/* 薪酬范围概览 */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-dsp-dark mb-2">推荐薪酬范围</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-dsp-gray">置信度</span>
              <span className="text-sm font-medium text-orange-600">{result.confidence_score}%</span>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            result.market_position === 'above' ? 'bg-green-100 text-green-700' :
            result.market_position === 'below' ? 'bg-red-100 text-red-700' :
            'bg-blue-100 text-blue-700'
          }`}>
            {result.market_position === 'above' ? '高于市场' :
             result.market_position === 'below' ? '低于市场' : '符合市场'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-2xl font-bold text-dsp-dark mb-1">
              ¥{result.base_salary.min.toLocaleString()}
            </div>
            <div className="text-sm text-dsp-gray">最低薪酬</div>
          </div>
          <div className="text-center p-4 bg-orange-100 rounded-lg border-2 border-orange-300">
            <div className="text-3xl font-bold text-orange-600 mb-1">
              ¥{result.base_salary.median.toLocaleString()}
            </div>
            <div className="text-sm text-orange-700 font-medium">推荐薪酬</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-2xl font-bold text-dsp-dark mb-1">
              ¥{result.base_salary.max.toLocaleString()}
            </div>
            <div className="text-sm text-dsp-gray">最高薪酬</div>
          </div>
        </div>

        {/* 百分位数展示 */}
        <div className="mt-6 pt-6 border-t border-orange-200">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-dsp-dark">¥{result.base_salary.percentile_25.toLocaleString()}</div>
              <div className="text-dsp-gray">25分位数</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-dsp-dark">¥{result.base_salary.percentile_75.toLocaleString()}</div>
              <div className="text-dsp-gray">75分位数</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-dsp-dark">¥{result.base_salary.percentile_90.toLocaleString()}</div>
              <div className="text-dsp-gray">90分位数</div>
            </div>
          </div>
        </div>
      </div>

      {/* 薪酬构成分析 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 薪酬构成 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h4 className="font-semibold text-dsp-dark mb-4 flex items-center">
            <ChartBarIcon className="w-5 h-5 text-orange-600 mr-2" />
            薪酬构成分析
          </h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-dsp-gray">基础薪酬</span>
              <span className="font-semibold text-dsp-dark">¥{result.breakdown.base.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-dsp-gray">绩效奖金</span>
              <span className="font-semibold text-dsp-dark">¥{result.breakdown.bonus.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-dsp-gray">股权激励</span>
              <span className="font-semibold text-dsp-dark">¥{result.breakdown.equity.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-dsp-gray">福利补贴</span>
              <span className="font-semibold text-dsp-dark">¥{result.breakdown.benefits.toLocaleString()}</span>
            </div>
            <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
              <span className="font-medium text-dsp-dark">总薪酬包</span>
              <span className="font-bold text-orange-600 text-lg">
                ¥{result.total_compensation.median.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* 影响因素分析 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h4 className="font-semibold text-dsp-dark mb-4 flex items-center">
            <StarIcon className="w-5 h-5 text-orange-600 mr-2" />
            影响因素分析
          </h4>
          
          <div className="space-y-4">
            {result.factors.map((factor) => (
              <div key={factor.factor} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-dsp-dark font-medium">{factor.factor}</span>
                  <div className="flex items-center space-x-2">
                    {factor.impact === 'positive' ? (
                      <ArrowTrendingUpIcon className="w-4 h-4 text-green-600" />
                    ) : factor.impact === 'negative' ? (
                      <ArrowTrendingDownIcon className="w-4 h-4 text-red-600" />
                    ) : (
                      <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                    )}
                    <span className={`font-semibold ${
                      factor.impact === 'positive' ? 'text-green-600' :
                      factor.impact === 'negative' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {factor.adjustment > 0 ? '+' : ''}{factor.adjustment}%
                    </span>
                  </div>
                </div>
                <div className="text-sm text-dsp-gray">{factor.description}</div>
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div 
                    className="bg-orange-500 h-1 rounded-full" 
                    style={{ width: `${factor.weight}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 市场对比分析 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8">
        <h3 className="text-xl font-semibold text-dsp-dark mb-6 flex items-center">
          <CurrencyDollarIcon className="w-6 h-6 text-orange-600 mr-2" />
          市场对比分析
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 相似职位对比 */}
          <div className="space-y-4">
            <h4 className="font-medium text-dsp-dark">相似职位对比</h4>
            {result.comparison.similar_positions.map((pos) => (
              <div key={pos.title} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-dsp-dark">{pos.title}</span>
                  <span className="text-xs text-green-600">匹配度 {pos.match_score}%</span>
                </div>
                <div className="text-xs text-dsp-gray">
                  ¥{pos.salary_range.min.toLocaleString()} - ¥{pos.salary_range.max.toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* 地区对比 */}
          <div className="space-y-4">
            <h4 className="font-medium text-dsp-dark">主要城市对比</h4>
            {result.comparison.location_comparison.map((loc) => (
              <div key={loc.city} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-dsp-dark">{loc.city}</span>
                  <span className={`text-xs ${loc.salary_adjustment > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {loc.salary_adjustment > 0 ? '+' : ''}{loc.salary_adjustment}%
                  </span>
                </div>
                <div className="text-xs text-dsp-gray">
                  生活成本指数: {loc.cost_of_living}
                </div>
              </div>
            ))}
          </div>

          {/* 行业基准 */}
          <div className="space-y-4">
            <h4 className="font-medium text-dsp-dark">行业基准对比</h4>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-dsp-gray">行业平均</span>
                  <span className="font-semibold text-dsp-dark">
                    ¥{result.comparison.industry_benchmark.industry_avg.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-dsp-gray">你的位置</span>
                  <span className="font-semibold text-orange-600">
                    ¥{result.comparison.industry_benchmark.your_position.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-dsp-gray">差异</span>
                  <span className={`font-semibold ${
                    result.comparison.industry_benchmark.difference > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {result.comparison.industry_benchmark.difference > 0 ? '+' : ''}
                    ¥{result.comparison.industry_benchmark.difference.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 提升建议 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8">
        <h3 className="text-xl font-semibold text-dsp-dark mb-6 flex items-center">
          <InformationCircleIcon className="w-6 h-6 text-blue-600 mr-2" />
          薪酬提升建议
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {result.recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
              <CheckCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <span className="text-dsp-dark">{recommendation}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
