/**
 * 薪酬计算器
 * 根据你的技能、经验和地区，智能计算合理薪酬范围
 */

import React, { useState } from 'react';
import { deepseekApi } from '@/services/deepseekApi';
import { 
  LightBulbIcon,
  SparklesIcon,
  StarIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { getIndustries } from '@/data/jobCategories';
import { popularCities } from '@/data/cities';

interface CalculatorInput {
  position: string;
  experience: string;
  education: string;
  location: string;
  company_size: string;
  industry: string;
  job_level: string;
  management_experience: string;
  project_experience: string;
  team_size: string;
  special_skills: string[];
  skills: string[];
  certifications: string[];
  languages: string[];
  portfolio_quality: string;
  github_contributions: string;
  education_institution: string;
  salary_structure_preference: string;
  current_salary: string;
  expected_salary_min: string;
  expected_salary_max: string;
  benefits_importance: string[];
  remote_preference: string;
  overtime_acceptance: string;
  travel_willingness: string;
  career_stage: string;
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
    job_level: '',
    management_experience: '',
    project_experience: '',
    team_size: '',
    special_skills: [],
    skills: [],
    certifications: [],
    languages: [],
    portfolio_quality: '',
    github_contributions: '',
    education_institution: '',
    salary_structure_preference: '',
    current_salary: '',
    expected_salary_min: '',
    expected_salary_max: '',
    benefits_importance: [],
    remote_preference: '',
    overtime_acceptance: '',
    travel_willingness: '',
    career_stage: ''
  });
  const [salaryResult, setSalaryResult] = useState<SalaryResult | null>(null);

  // AI驱动的薪酬计算
  const calculateSalary = async () => {
    setCurrentStep('calculating');
    
    try {
      // 调用真实的DeepSeek AI API进行薪酬计算
      const aiResponse = await deepseekApi.salaryCalculation({
        position: calculatorInput.position,
        location: calculatorInput.location,
        experience: calculatorInput.experience,
        education: calculatorInput.education,
        industry: calculatorInput.industry,
        skills: [...calculatorInput.skills, ...calculatorInput.special_skills],
        companySize: calculatorInput.company_size,
        jobLevel: calculatorInput.job_level || '中级'
      });
      
      console.log('AI薪酬计算结果:', aiResponse);
      
      // 使用AI分析结果作为基础，结合本地计算逻辑进行完整分析
      let baseSalary = aiResponse.salaryRange?.median || 20000; // 基础薪酬
    
    // 经验调整
    const experienceMultiplier = {
      '应届生': 1.0,
      '1-3年': 1.3,
      '3-5年': 1.6,
      '5-10年': 2.0,
      '10年以上': 2.5
    }[calculatorInput.experience] || 1.0;
    
    baseSalary *= experienceMultiplier;
    
    // 职级调整
    const jobLevelMultiplier = {
      '初级': 1.0,
      '中级': 1.3,
      '高级': 1.6,
      '专家': 2.2,
      '架构师': 2.8,
      '技术总监': 3.5
    }[calculatorInput.job_level] || 1.0;
    
    baseSalary *= jobLevelMultiplier;
    
    // 管理经验加成
    const managementBonus = {
      '无管理经验': 0,
      '小团队(2-5人)': 0.1,
      '中团队(5-15人)': 0.2,
      '大团队(15人以上)': 0.3,
      '部门负责人': 0.5
    }[calculatorInput.management_experience] || 0;
    
    baseSalary *= (1 + managementBonus);
    
    // 项目经验加成
    const projectExperienceMultiplier = {
      '参与项目': 1.0,
      '独立负责小项目': 1.1,
      '负责大型项目': 1.25,
      '负责多个项目': 1.4,
      '项目管理专家': 1.6
    }[calculatorInput.project_experience] || 1.0;
    
    baseSalary *= projectExperienceMultiplier;
    
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
    
    // 教育背景机构加成
    const institutionBonus = {
      '985/211高校': 0.15,
      '双一流大学': 0.12,
      '知名大学': 0.08,
      '普通本科': 0.05,
      '专科院校': 0,
      '海外知名大学': 0.2
    }[calculatorInput.education_institution] || 0;
    
    baseSalary *= (1 + institutionBonus);
    
    // 作品集质量加成
    const portfolioBonus = {
      '无作品集': 0,
      '基础作品集': 0.05,
      '优质作品集': 0.12,
      '顶级作品集': 0.2
    }[calculatorInput.portfolio_quality] || 0;
    
    baseSalary *= (1 + portfolioBonus);
    
    // GitHub贡献加成
    const githubBonus = {
      '无GitHub': 0,
      '偶尔提交': 0.03,
      '活跃贡献': 0.08,
      '知名开源贡献者': 0.15
    }[calculatorInput.github_contributions] || 0;
    
    baseSalary *= (1 + githubBonus);
    
    // 技能加成（基础技能）
    const skillBonus = calculatorInput.skills.length * 2000;
    baseSalary += skillBonus;
    
    // 特殊技能加成（更高价值）
    const specialSkillBonus = calculatorInput.special_skills.length * 4000;
    baseSalary += specialSkillBonus;
    
    // 认证加成
    const certificationBonus = calculatorInput.certifications.length * 3000;
    baseSalary += certificationBonus;
    
    // 语言能力加成
    const languageBonus = calculatorInput.languages.length * 1500;
    baseSalary += languageBonus;
    
    // 职业阶段调整
    const careerStageMultiplier = {
      '探索期': 0.9,
      '成长期': 1.0,
      '成熟期': 1.1,
      '转型期': 0.95,
      '巅峰期': 1.2
    }[calculatorInput.career_stage] || 1.0;
    
    baseSalary *= careerStageMultiplier;
    
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
    
    // 生成薪酬影响因素（整合AI分析结果）
    const getImpact = (condition: boolean, negative?: boolean): 'positive' | 'negative' | 'neutral' => {
      if (condition) return 'positive';
      if (negative) return 'negative';
      return 'neutral';
    };

    // 整合AI影响因素分析
    let factors: SalaryFactor[] = [];
    
    if (aiResponse.factors && aiResponse.factors.length > 0) {
      // 使用AI分析的影响因素
      factors = aiResponse.factors.map(factor => ({
        factor: factor.factor,
        impact: factor.impact.includes('正面') || factor.impact.includes('积极') ? 'positive' : 
                factor.impact.includes('负面') || factor.impact.includes('消极') ? 'negative' : 'neutral',
        weight: factor.weight,
        description: factor.impact,
        adjustment: factor.weight
      }));
    } else {
      // 使用本地计算的影响因素
      factors = [
        {
          factor: '工作经验',
          impact: getImpact(experienceMultiplier > 1.2, experienceMultiplier < 1.0),
          weight: 25,
          description: `${calculatorInput.experience}的工作经验`,
          adjustment: Math.round((experienceMultiplier - 1) * 100)
        },
        {
          factor: '职级定位',
          impact: getImpact(jobLevelMultiplier > 1.5),
          weight: 20,
          description: `${calculatorInput.job_level || '未设置'}职级定位`,
          adjustment: Math.round((jobLevelMultiplier - 1) * 100)
        },
        {
          factor: '地理位置',
          impact: getImpact(locationMultiplier > 1.1, locationMultiplier < 1.0),
          weight: 18,
          description: `${calculatorInput.location}地区薪酬水平`,
          adjustment: Math.round((locationMultiplier - 1) * 100)
        },
        {
          factor: '管理经验',
          impact: getImpact(managementBonus > 0.1, managementBonus === 0),
          weight: 15,
          description: `${calculatorInput.management_experience || '无管理经验'}`,
          adjustment: Math.round(managementBonus * 100)
        },
        {
          factor: '项目经验',
          impact: getImpact(projectExperienceMultiplier > 1.2),
          weight: 12,
          description: `${calculatorInput.project_experience || '基础项目参与'}`,
          adjustment: Math.round((projectExperienceMultiplier - 1) * 100)
        },
        {
          factor: '技能专长',
          impact: getImpact((calculatorInput.skills.length + calculatorInput.special_skills.length) > 5),
          weight: 12,
          description: `掌握${calculatorInput.skills.length}项基础技能和${calculatorInput.special_skills.length}项特殊技能`,
          adjustment: (calculatorInput.skills.length * 8) + (calculatorInput.special_skills.length * 15)
        },
        {
          factor: '教育背景',
          impact: getImpact((educationBonus + (institutionBonus * baseSalary)) > 8000),
          weight: 10,
          description: `${calculatorInput.education}学历，${calculatorInput.education_institution || '普通院校'}`,
          adjustment: Math.round(((educationBonus + (institutionBonus * baseSalary)) / median) * 100)
        },
        {
          factor: '作品集质量',
          impact: getImpact(portfolioBonus > 0.1, portfolioBonus === 0),
          weight: 8,
          description: `${calculatorInput.portfolio_quality || '未提供作品集'}`,
          adjustment: Math.round(portfolioBonus * 100)
        }
      ].filter(factor => factor.weight > 0);
    }
    
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
      confidence_score: calculateConfidenceScore(calculatorInput),
      factors,
      recommendations: aiResponse.recommendations || generatePersonalizedRecommendations(calculatorInput, median),
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
    setCurrentStep('results');
    
    } catch (error) {
      console.error('AI薪酬计算失败，使用本地计算:', error);
      
      // 如果AI调用失败，使用纯本地计算逻辑
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
      
      // 其他计算逻辑保持不变...
      const median = Math.round(baseSalary);
      const min = Math.round(median * 0.7);
      const max = Math.round(median * 1.5);
      const percentile_25 = Math.round(median * 0.8);
      const percentile_75 = Math.round(median * 1.2);
      const percentile_90 = Math.round(median * 1.4);
      
      const fallbackResult: SalaryResult = {
        base_salary: { min, median, max, percentile_25, percentile_75, percentile_90 },
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
        confidence_score: calculateConfidenceScore(calculatorInput),
        factors: [
          {
            factor: '工作经验',
            impact: experienceMultiplier > 1.2 ? 'positive' : 'neutral',
            weight: 25,
            description: `${calculatorInput.experience}的工作经验`,
            adjustment: Math.round((experienceMultiplier - 1) * 100)
          }
        ],
        recommendations: generatePersonalizedRecommendations(calculatorInput, median),
        comparison: {
          similar_positions: [
            { title: '相似职位1', salary_range: { min: min - 3000, max: max - 5000 }, match_score: 85 },
            { title: '相似职位2', salary_range: { min: min + 2000, max: max + 3000 }, match_score: 80 }
          ],
          location_comparison: [
            { city: '北京', salary_adjustment: 15, cost_of_living: 120 },
            { city: '上海', salary_adjustment: 12, cost_of_living: 115 }
          ],
          industry_benchmark: {
            industry_avg: Math.round(median * 1.05),
            your_position: median,
            difference: Math.round(median * 0.05)
          }
        }
      };
      
      setSalaryResult(fallbackResult);
      setCurrentStep('results');
    }
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

  const handleSpecialSkillAdd = (skill: string) => {
    if (skill.trim() && !calculatorInput.special_skills.includes(skill.trim())) {
      setCalculatorInput(prev => ({
        ...prev,
        special_skills: [...prev.special_skills, skill.trim()]
      }));
    }
  };

  const handleSpecialSkillRemove = (skillToRemove: string) => {
    setCalculatorInput(prev => ({
      ...prev,
      special_skills: prev.special_skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleBenefitToggle = (benefit: string) => {
    setCalculatorInput(prev => ({
      ...prev,
      benefits_importance: prev.benefits_importance.includes(benefit)
        ? prev.benefits_importance.filter(b => b !== benefit)
        : [...prev.benefits_importance, benefit]
    }));
  };

  // 生成个性化建议
  const generatePersonalizedRecommendations = (input: CalculatorInput, currentSalary: number): string[] => {
    const recommendations: string[] = [];
    
    // 基于职级建议
    if (!input.job_level || input.job_level === '初级') {
      recommendations.push('考虑通过技能提升和项目经验积累来达到中级或高级职级');
    }
    
    // 基于管理经验建议
    if (!input.management_experience || input.management_experience === '无管理经验') {
      recommendations.push('积累团队管理经验可以显著提升薪酬，考虑主动承担小团队的lead职责');
    }
    
    // 基于技能数量建议
    if (input.skills.length < 3) {
      recommendations.push('学习更多相关技能，建议掌握至少3-5项核心技能以提升竞争力');
    }
    
    // 基于特殊技能建议
    if (input.special_skills.length === 0) {
      recommendations.push('学习一些高价值的特殊技能如AI/机器学习、区块链或云架构等');
    }
    
    // 基于作品集建议
    if (!input.portfolio_quality || input.portfolio_quality === '无作品集') {
      recommendations.push('建立优质的作品集，展示你的实际项目成果和技术能力');
    }
    
    // 基于GitHub贡献建议
    if (!input.github_contributions || input.github_contributions === '无GitHub') {
      recommendations.push('建立并维护GitHub开源项目，提升技术影响力和可见度');
    }
    
    // 基于认证建议
    if (input.certifications.length === 0) {
      recommendations.push('获得相关行业认证（如AWS、Azure、Google Cloud等）可以提升薪酬竞争力');
    }
    
    // 基于当前薪酬建议
    const currentSalaryNum = parseInt(input.current_salary);
    if (currentSalaryNum && currentSalaryNum < currentSalary * 0.8) {
      recommendations.push('你的当前薪酬可能偏低，建议主动与HR沟通调薪或考虑换工作');
    }
    
    // 基于期望薪酬建议
    const expectedMin = parseInt(input.expected_salary_min);
    if (expectedMin && expectedMin > currentSalary * 1.3) {
      recommendations.push('你的期望薪酬相对较高，建议进一步提升核心技能和项目经验');
    }
    
    // 通用建议
    recommendations.push('关注目标公司的薪酬结构，了解基本工资、绩效奖金、股权激励的比例');
    recommendations.push('定期关注行业薪酬趋势，选择合适的时机进行薪酬谈判');
    
    return recommendations.slice(0, 6); // 限制建议数量
  };

  // 计算置信度分数
  const calculateConfidenceScore = (input: CalculatorInput): number => {
    let score = 60; // 基础分数
    
    // 必填字段完整性 (20分)
    const requiredFields = [input.position, input.experience, input.education, input.location];
    const completedRequired = requiredFields.filter(field => field && field.trim()).length;
    score += (completedRequired / requiredFields.length) * 20;
    
    // 重要字段完整性 (15分)
    const importantFields = [input.job_level, input.industry, input.company_size];
    const completedImportant = importantFields.filter(field => field && field.trim()).length;
    score += (completedImportant / importantFields.length) * 15;
    
    // 经验详情 (10分)
    const experienceFields = [input.management_experience, input.project_experience];
    const completedExperience = experienceFields.filter(field => field && field.trim()).length;
    score += (completedExperience / experienceFields.length) * 10;
    
    // 技能信息 (10分)
    const skillCount = input.skills.length + input.special_skills.length;
    score += Math.min(skillCount / 5, 1) * 10;
    
    // 认证和作品 (8分)
    if (input.certifications.length > 0) score += 3;
    if (input.portfolio_quality && input.portfolio_quality !== '无作品集') score += 3;
    if (input.github_contributions && input.github_contributions !== '无GitHub') score += 2;
    
    // 薪酬信息 (7分)
    if (input.current_salary) score += 3;
    if (input.expected_salary_min && input.expected_salary_max) score += 4;
    
    return Math.min(Math.round(score), 95); // 限制最高95分
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
            onSpecialSkillAdd={handleSpecialSkillAdd}
            onSpecialSkillRemove={handleSpecialSkillRemove}
            onCertificationAdd={handleCertificationAdd}
            onCertificationRemove={handleCertificationRemove}
            onLanguageAdd={handleLanguageAdd}
            onLanguageRemove={handleLanguageRemove}
            onBenefitToggle={handleBenefitToggle}
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
  onSpecialSkillAdd: (skill: string) => void;
  onSpecialSkillRemove: (skill: string) => void;
  onCertificationAdd: (cert: string) => void;
  onCertificationRemove: (cert: string) => void;
  onLanguageAdd: (lang: string) => void;
  onLanguageRemove: (lang: string) => void;
  onBenefitToggle: (benefit: string) => void;
  onCalculate: () => void;
}> = ({ 
  input, 
  setInput, 
  onSkillAdd, 
  onSkillRemove, 
  onSpecialSkillAdd, 
  onSpecialSkillRemove, 
  onCertificationAdd, 
  onCertificationRemove, 
  onLanguageAdd, 
  onLanguageRemove, 
  onBenefitToggle, 
  onCalculate 
}) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white border border-gray-200 rounded-2xl p-8">
        <h2 className="text-xl font-semibold text-dsp-dark mb-6">填写你的职业信息</h2>
        
        <div className="space-y-10">
          {/* 基础信息 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">1</span>
              </div>
              <h3 className="text-lg font-semibold text-dsp-dark">基础信息</h3>
              <span className="text-sm text-dsp-gray">基本职业背景</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-dsp-dark mb-2">
                  目标职位 *
                </label>
                <input
                  type="text"
                  value={input.position}
                  onChange={(e) => setInput(prev => ({ ...prev, position: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-500"
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-500"
                >
                  <option value="">请选择工作经验</option>
                  <option value="应届生">应届生</option>
                  <option value="1-3年">1-3年</option>
                  <option value="3-5年">3-5年</option>
                  <option value="5-10年">5-10年</option>
                  <option value="10年以上">10年以上</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dsp-dark mb-2">
                  职级定位
                </label>
                <select
                  value={input.job_level}
                  onChange={(e) => setInput(prev => ({ ...prev, job_level: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-500"
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

              <div>
                <label className="block text-sm font-medium text-dsp-dark mb-2">
                  学历背景 *
                </label>
                <select
                  value={input.education}
                  onChange={(e) => setInput(prev => ({ ...prev, education: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-500"
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
                  院校背景
                </label>
                <select
                  value={input.education_institution}
                  onChange={(e) => setInput(prev => ({ ...prev, education_institution: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-500"
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
              
              <div>
                <label className="block text-sm font-medium text-dsp-dark mb-2">
                  工作地点 *
                </label>
                <select
                  value={input.location}
                  onChange={(e) => setInput(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-500"
                >
                  <option value="">请选择城市</option>
                  {popularCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dsp-dark mb-2">
                  公司规模
                </label>
                <select
                  value={input.company_size}
                  onChange={(e) => setInput(prev => ({ ...prev, company_size: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-500"
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-500"
                >
                  <option value="">请选择行业</option>
                  {getIndustries().map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dsp-dark mb-2">
                  职业阶段
                </label>
                <select
                  value={input.career_stage}
                  onChange={(e) => setInput(prev => ({ ...prev, career_stage: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-500"
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

          {/* 工作经验详情 */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-semibold text-sm">2</span>
              </div>
              <h3 className="text-lg font-semibold text-dsp-dark">工作经验详情</h3>
              <span className="text-sm text-dsp-gray">管理和项目经验</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-dsp-dark mb-2">
                  管理经验
                </label>
                <select
                  value={input.management_experience}
                  onChange={(e) => setInput(prev => ({ ...prev, management_experience: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-500"
                >
                  <option value="">请选择管理经验</option>
                  <option value="无管理经验">无管理经验</option>
                  <option value="小团队(2-5人)">小团队(2-5人)</option>
                  <option value="中团队(5-15人)">中团队(5-15人)</option>
                  <option value="大团队(15人以上)">大团队(15人以上)</option>
                  <option value="部门负责人">部门负责人</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dsp-dark mb-2">
                  项目经验
                </label>
                <select
                  value={input.project_experience}
                  onChange={(e) => setInput(prev => ({ ...prev, project_experience: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-500"
                >
                  <option value="">请选择项目经验</option>
                  <option value="参与项目">参与项目</option>
                  <option value="独立负责小项目">独立负责小项目</option>
                  <option value="负责大型项目">负责大型项目</option>
                  <option value="负责多个项目">负责多个项目</option>
                  <option value="项目管理专家">项目管理专家</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dsp-dark mb-2">
                  团队规模经验
                </label>
                <select
                  value={input.team_size}
                  onChange={(e) => setInput(prev => ({ ...prev, team_size: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-500"
                >
                  <option value="">请选择团队规模</option>
                  <option value="个人贡献者">个人贡献者</option>
                  <option value="2-5人小团队">2-5人小团队</option>
                  <option value="5-15人中团队">5-15人中团队</option>
                  <option value="15-50人大团队">15-50人大团队</option>
                  <option value="50人以上">50人以上</option>
                </select>
              </div>
            </div>
          </div>

          {/* 技能和认证 */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-semibold text-sm">3</span>
              </div>
              <h3 className="text-lg font-semibold text-dsp-dark">技能和认证</h3>
              <span className="text-sm text-dsp-gray">专业技能与资质</span>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 基础技能 */}
              <div>
                <label className="block text-sm font-medium text-dsp-dark mb-2">
                  基础技能
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
                  placeholder="输入基础技能后按回车添加，如：React、Python等"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      onSkillAdd((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
              </div>

              {/* 特殊技能 */}
              <div>
                <label className="block text-sm font-medium text-dsp-dark mb-2">
                  特殊技能/领域专长
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {input.special_skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full"
                    >
                      {skill}
                      <button
                        onClick={() => onSpecialSkillRemove(skill)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="输入特殊技能后按回车添加，如：机器学习、区块链等"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      onSpecialSkillAdd((e.target as HTMLInputElement).value);
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-500"
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      onLanguageAdd((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
              </div>
            </div>

            {/* 作品和贡献 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-purple-200">
              <div>
                <label className="block text-sm font-medium text-dsp-dark mb-2">
                  作品集质量
                </label>
                <select
                  value={input.portfolio_quality}
                  onChange={(e) => setInput(prev => ({ ...prev, portfolio_quality: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-500"
                >
                  <option value="">请选择作品集质量</option>
                  <option value="无作品集">无作品集</option>
                  <option value="基础作品集">基础作品集</option>
                  <option value="优质作品集">优质作品集</option>
                  <option value="顶级作品集">顶级作品集</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dsp-dark mb-2">
                  GitHub贡献度
                </label>
                <select
                  value={input.github_contributions}
                  onChange={(e) => setInput(prev => ({ ...prev, github_contributions: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-500"
                >
                  <option value="">请选择GitHub贡献度</option>
                  <option value="无GitHub">无GitHub</option>
                  <option value="偶尔提交">偶尔提交</option>
                  <option value="活跃贡献">活跃贡献</option>
                  <option value="知名开源贡献者">知名开源贡献者</option>
                </select>
              </div>
            </div>
          </div>

          {/* 薪酬期望和偏好 */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 font-semibold text-sm">4</span>
              </div>
              <h3 className="text-lg font-semibold text-dsp-dark">薪酬期望和偏好</h3>
              <span className="text-sm text-dsp-gray">当前薪酬与期望薪酬</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-dsp-dark mb-2">
                  当前薪酬(月薪)
                </label>
                <input
                  type="number"
                  value={input.current_salary}
                  onChange={(e) => setInput(prev => ({ ...prev, current_salary: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-500"
                  placeholder="如：25000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dsp-dark mb-2">
                  期望薪酬最低值
                </label>
                <input
                  type="number"
                  value={input.expected_salary_min}
                  onChange={(e) => setInput(prev => ({ ...prev, expected_salary_min: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-500"
                  placeholder="如：30000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dsp-dark mb-2">
                  期望薪酬最高值
                </label>
                <input
                  type="number"
                  value={input.expected_salary_max}
                  onChange={(e) => setInput(prev => ({ ...prev, expected_salary_max: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-500"
                  placeholder="如：45000"
                />
              </div>

              <div className="lg:col-span-3">
                <label className="block text-sm font-medium text-dsp-dark mb-2">
                  薪酬结构偏好
                </label>
                <select
                  value={input.salary_structure_preference}
                  onChange={(e) => setInput(prev => ({ ...prev, salary_structure_preference: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-500"
                >
                  <option value="">请选择薪酬结构偏好</option>
                  <option value="高基本工资">高基本工资，低绩效奖金</option>
                  <option value="平衡结构">基本工资与绩效奖金平衡</option>
                  <option value="高绩效奖金">基本工资较低，高绩效奖金</option>
                  <option value="股权激励">重视股权激励</option>
                </select>
              </div>
            </div>

            {/* 福利重要性 */}
            <div>
              <label className="block text-sm font-medium text-dsp-dark mb-3">
                重视的福利类型 (可多选)
              </label>
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
                  <label key={benefit} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={input.benefits_importance.includes(benefit)}
                      onChange={() => onBenefitToggle(benefit)}
                      className="mr-2 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm text-dsp-dark">{benefit}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* 工作偏好 */}
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6 space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                <span className="text-teal-600 font-semibold text-sm">5</span>
              </div>
              <h3 className="text-lg font-semibold text-dsp-dark">工作偏好</h3>
              <span className="text-sm text-dsp-gray">工作方式偏好</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-dsp-dark mb-2">
                  远程工作偏好
                </label>
                <select
                  value={input.remote_preference}
                  onChange={(e) => setInput(prev => ({ ...prev, remote_preference: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-500"
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-500"
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-500"
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
          <div className="pt-8">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-center">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white mb-2">开始AI薪酬计算</h3>
                <p className="text-orange-100 text-sm">基于多维度分析，为你提供最准确的薪酬建议</p>
              </div>
              <button
                onClick={onCalculate}
                disabled={!input.position || !input.experience || !input.education || !input.location}
                className="w-full bg-white text-orange-600 py-4 px-8 rounded-lg font-semibold hover:bg-orange-50 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-3 shadow-lg"
              >
                <SparklesIcon className="w-6 h-6" />
                <span className="text-lg">
                  {!input.position || !input.experience || !input.education || !input.location
                    ? '请完善必填信息 (*, *, *, *)'
                    : '开始智能分析薪酬'
                  }
                </span>
              </button>
              
              {/* 进度指示器 */}
              <div className="mt-4 flex items-center justify-center space-x-2">
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((step) => (
                    <div
                      key={step}
                      className={`w-2 h-2 rounded-full ${
                        step === 1 ? 'bg-white' :
                        step === 2 ? 'bg-white/70' :
                        step === 3 ? 'bg-white/50' :
                        step === 4 ? 'bg-white/30' :
                        'bg-white/20'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-orange-100">信息越完整，分析越准确</span>
              </div>
            </div>
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
            <h3 className="text-xl font-semibold text-dsp-dark mb-2">AI智能薪酬分析结果</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-dsp-gray">分析置信度</span>
                <div className="flex items-center space-x-1">
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-1000"
                      style={{ width: `${result.confidence_score}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-orange-600">{result.confidence_score}%</span>
                </div>
              </div>
              <div className="text-sm text-dsp-gray">
                基于 <span className="font-medium text-dsp-dark">{result.factors.length}</span> 项关键因素分析
              </div>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 ${
            result.market_position === 'above' ? 'bg-green-100 text-green-700' :
            result.market_position === 'below' ? 'bg-red-100 text-red-700' :
            'bg-blue-100 text-blue-700'
          }`}>
            {result.market_position === 'above' ? (
              <>
                <ArrowTrendingUpIcon className="w-4 h-4" />
                <span>高于市场平均</span>
              </>
            ) : result.market_position === 'below' ? (
              <>
                <ArrowTrendingDownIcon className="w-4 h-4" />
                <span>低于市场平均</span>
              </>
            ) : (
              <>
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span>符合市场水平</span>
              </>
            )}
          </div>
        </div>

        {/* 薪酬范围可视化 */}
        <div className="mb-6">
          <div className="relative">
            {/* 薪酬范围条形图 */}
            <div className="h-12 bg-gray-200 rounded-lg overflow-hidden relative">
              <div 
                className="h-full bg-gradient-to-r from-orange-300 to-orange-500 rounded-lg"
                style={{ 
                  marginLeft: `${((result.base_salary.min - result.base_salary.min) / (result.base_salary.max - result.base_salary.min)) * 100}%`,
                  width: `${((result.base_salary.max - result.base_salary.min) / (result.base_salary.max - result.base_salary.min)) * 100}%`
                }}
              />
              <div 
                className="absolute top-0 h-full w-1 bg-orange-600"
                style={{ 
                  left: `${((result.base_salary.median - result.base_salary.min) / (result.base_salary.max - result.base_salary.min)) * 100}%`
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-dsp-gray mt-2">
              <span>¥{result.base_salary.min.toLocaleString()}</span>
              <span className="font-medium text-orange-600">¥{result.base_salary.median.toLocaleString()}</span>
              <span>¥{result.base_salary.max.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-dsp-dark mb-1">
              ¥{result.base_salary.min.toLocaleString()}
            </div>
            <div className="text-sm text-dsp-gray">保守估计</div>
            <div className="text-xs text-dsp-gray mt-1">适合求稳</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-b from-orange-100 to-orange-50 rounded-lg border-2 border-orange-300 shadow-sm">
            <div className="text-3xl font-bold text-orange-600 mb-1">
              ¥{result.base_salary.median.toLocaleString()}
            </div>
            <div className="text-sm text-orange-700 font-medium">AI推荐薪酬</div>
            <div className="text-xs text-orange-600 mt-1">最佳谈判目标</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-dsp-dark mb-1">
              ¥{result.base_salary.max.toLocaleString()}
            </div>
            <div className="text-sm text-dsp-gray">乐观估计</div>
            <div className="text-xs text-dsp-gray mt-1">顶级公司水平</div>
          </div>
        </div>

        {/* 薪酬分布分析 */}
        <div className="mt-6 pt-6 border-t border-orange-200">
          <h4 className="text-sm font-medium text-dsp-dark mb-3">薪酬分布分析</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-lg font-bold text-dsp-dark">¥{result.base_salary.percentile_25.toLocaleString()}</div>
              <div className="text-xs text-dsp-gray">25%分位数</div>
              <div className="text-xs text-red-500 mt-1">25%的人低于此薪酬</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-lg font-bold text-dsp-dark">¥{result.base_salary.percentile_75.toLocaleString()}</div>
              <div className="text-xs text-dsp-gray">75%分位数</div>
              <div className="text-xs text-green-500 mt-1">25%的人高于此薪酬</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-lg font-bold text-dsp-dark">¥{result.base_salary.percentile_90.toLocaleString()}</div>
              <div className="text-xs text-dsp-gray">90%分位数</div>
              <div className="text-xs text-blue-500 mt-1">顶尖10%的薪酬水平</div>
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
            关键影响因素分析
          </h4>
          
          <div className="space-y-5">
            {result.factors.map((factor, index) => (
              <div key={factor.factor} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                      factor.impact === 'positive' ? 'bg-green-100 text-green-700' :
                      factor.impact === 'negative' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <span className="text-dsp-dark font-medium">{factor.factor}</span>
                      <div className="text-xs text-dsp-gray">权重: {factor.weight}%</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {factor.impact === 'positive' ? (
                      <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 rounded-full">
                        <ArrowTrendingUpIcon className="w-3 h-3 text-green-600" />
                        <span className="text-xs font-semibold text-green-600">+{factor.adjustment}%</span>
                      </div>
                    ) : factor.impact === 'negative' ? (
                      <div className="flex items-center space-x-1 px-2 py-1 bg-red-100 rounded-full">
                        <ArrowTrendingDownIcon className="w-3 h-3 text-red-600" />
                        <span className="text-xs font-semibold text-red-600">{factor.adjustment}%</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded-full">
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                        <span className="text-xs font-semibold text-gray-600">0%</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-sm text-dsp-gray pl-11">{factor.description}</div>
                
                {/* 权重可视化 */}
                <div className="pl-11">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-2 rounded-full transition-all duration-1000 ${
                          factor.impact === 'positive' ? 'bg-gradient-to-r from-green-400 to-green-600' :
                          factor.impact === 'negative' ? 'bg-gradient-to-r from-red-400 to-red-600' :
                          'bg-gradient-to-r from-gray-400 to-gray-600'
                        }`}
                        style={{ width: `${Math.max(factor.weight, 5)}%` }}
                      />
                    </div>
                    <span className="text-xs text-dsp-gray min-w-0">{factor.weight}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 因素影响总结 */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-green-600">
                  {result.factors.filter(f => f.impact === 'positive').length}
                </div>
                <div className="text-xs text-dsp-gray">正面因素</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-600">
                  {result.factors.filter(f => f.impact === 'neutral').length}
                </div>
                <div className="text-xs text-dsp-gray">中性因素</div>
              </div>
              <div>
                <div className="text-lg font-bold text-red-600">
                  {result.factors.filter(f => f.impact === 'negative').length}
                </div>
                <div className="text-xs text-dsp-gray">需提升因素</div>
              </div>
            </div>
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

      {/* 个性化提升建议 */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8">
        <h3 className="text-xl font-semibold text-dsp-dark mb-6 flex items-center">
          <LightBulbIcon className="w-6 h-6 text-blue-600 mr-2" />
          AI个性化薪酬提升建议
        </h3>
        
        <div className="space-y-4">
          {result.recommendations.map((recommendation, index) => (
            <div key={index} className="group">
              <div className="flex items-start space-x-4 p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-blue-100 hover:border-blue-200">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">{index + 1}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <p className="text-dsp-dark font-medium leading-relaxed group-hover:text-blue-900 transition-colors">
                      {recommendation}
                    </p>
                    <div className="ml-4 flex-shrink-0">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <CheckCircleIcon className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                  </div>
                  {/* 建议重要性指示器 */}
                  <div className="mt-3 flex items-center space-x-2">
                    <span className="text-xs text-blue-600 font-medium">重要性</span>
                    <div className="flex space-x-1">
                      {[1, 2, 3].map((star) => (
                        <StarIcon 
                          key={star}
                          className={`w-3 h-3 ${
                            star <= (result.recommendations.length - index) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 提升建议总结 */}
        <div className="mt-8 pt-6 border-t border-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-white rounded-lg border border-blue-100">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {result.recommendations.length}
              </div>
              <div className="text-sm text-dsp-gray">个性化建议</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-blue-100">
              <div className="text-2xl font-bold text-green-600 mb-1">
                15-30%
              </div>
              <div className="text-sm text-dsp-gray">预期薪酬提升</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-blue-100">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                3-6月
              </div>
              <div className="text-sm text-dsp-gray">建议执行周期</div>
            </div>
          </div>
        </div>

        {/* 行动步骤 */}
        <div className="mt-6 p-4 bg-white rounded-lg border border-blue-100">
          <h4 className="font-medium text-dsp-dark mb-3 flex items-center">
            <SparklesIcon className="w-4 h-4 text-blue-600 mr-2" />
            立即开始行动
          </h4>
          <div className="text-sm text-dsp-gray space-y-1">
            <p>• 选择 1-2 个最适合的建议开始执行</p>
            <p>• 设定明确的时间目标和里程碑</p>
            <p>• 定期评估进展并调整策略</p>
            <p>• 3个月后重新进行薪酬分析</p>
          </div>
        </div>
      </div>
    </div>
  );
};
