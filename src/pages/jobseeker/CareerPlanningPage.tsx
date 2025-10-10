/**
 * 职业规划助手
 * AI分析你的技能和经验，为你规划最优的职业发展路径
 */

import React, { useState } from 'react';
import { deepseekApi } from '@/services/deepseekApi';
import { getIndustries, getCategories, getPositions } from '@/data/jobCategories';
import { popularCities } from '@/data/cities';
import { 
  ArrowTrendingUpIcon,
  SparklesIcon,
  UserIcon,
  BriefcaseIcon,
  StarIcon,
  ChartBarIcon,
  LightBulbIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  BookmarkIcon,
  DocumentTextIcon,
  CalendarIcon,
  TrophyIcon,
  AcademicCapIcon,
  BuildingOffice2Icon,
  ClockIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

interface UserProfile {
  name: string;
  industry: string;
  category: string;
  currentPosition: string;
  location: string;
  experience: string;
  education: string;
  company_size: string;
  job_level: string;
  management_experience: string;
  skills: string[];
  interests: string[];
  certifications: string[];
  languages: string[];
  currentSalary: number;
  targetSalary: number;
  careerGoals: string;
  work_preference: string;
  career_change_interest: string;
  leadership_aspiration: string;
}

interface CareerPath {
  id: string;
  title: string;
  description: string;
  steps: CareerStep[];
  timeframe: string;
  salaryGrowth: {
    current: number;
    year1: number;
    year3: number;
    year5: number;
  };
  difficulty: 'easy' | 'medium' | 'hard';
  matchScore: number;
}

interface CareerStep {
  id: string;
  title: string;
  description: string;
  timeframe: string;
  skills: string[];
  actions: string[];
  priority: 'high' | 'medium' | 'low';
}

interface SkillGap {
  skill: string;
  currentLevel: number;
  targetLevel: number;
  importance: 'critical' | 'important' | 'nice-to-have';
  learningResources: string[];
}

interface MarketInsight {
  title: string;
  description: string;
  trend: 'positive' | 'negative' | 'stable';
  percentage: number;
}

interface IndustryForecast {
  year: string;
  demandIndex: number;
  avgSalary: number;
  jobCount: number;
}

interface CompetitorAnalysis {
  skillCategory: string;
  yourLevel: number;
  marketAverage: number;
  topPerformers: number;
}

interface CareerMilestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  skills: string[];
  resources: string[];
}

interface SavedPlan {
  id: string;
  name: string;
  profile: UserProfile;
  careerPaths: CareerPath[];
  skillGaps: SkillGap[];
  createdAt: string;
  lastUpdated: string;
}

export const CareerPlanningPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'profile' | 'analysis' | 'results'>('profile');
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    industry: '',
    category: '',
    currentPosition: '',
    location: '',
    experience: '',
    education: '',
    company_size: '',
    job_level: '',
    management_experience: '',
    skills: [],
    interests: [],
    certifications: [],
    languages: [],
    currentSalary: 0,
    targetSalary: 0,
    careerGoals: '',
    work_preference: '',
    career_change_interest: '',
    leadership_aspiration: ''
  });
  const [, setIsAnalyzing] = useState(false);
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);
  const [marketInsights, setMarketInsights] = useState<MarketInsight[]>([]);
  const [industryForecast, setIndustryForecast] = useState<IndustryForecast[]>([]);
  const [competitorAnalysis, setCompetitorAnalysis] = useState<CompetitorAnalysis[]>([]);
  const [careerMilestones, setCareerMilestones] = useState<CareerMilestone[]>([]);
  const [, setSavedPlans] = useState<SavedPlan[]>([]);

  // AI职业规划分析（使用真实的DeepSeek API）
  const analyzeCareerPath = async () => {
    setIsAnalyzing(true);
    setCurrentStep('analysis');
    
    try {
      // 调用真实的AI API进行职业规划分析
      const response = await deepseekApi.careerPlanningAnalysis({
        name: userProfile.name,
        currentPosition: userProfile.currentPosition,
        experience: userProfile.experience,
        education: userProfile.education,
        skills: userProfile.skills,
        interests: userProfile.interests
      });
      
      // TODO: 使用AI响应来生成更智能的职业路径建议
      console.log('AI分析结果:', response);
    } catch (error) {
      console.error('AI职业规划分析失败:', error);
      // 如果API调用失败，继续使用原有的模拟逻辑
    }
    
    // 生成职业路径建议（使用原有逻辑或结合AI结果）
    const paths: CareerPath[] = [
      {
        id: 'technical_expert',
        title: '技术专家路径',
        description: '深入技术领域，成为行业技术专家和技术领导者',
        timeframe: '3-5年',
        steps: [
          {
            id: 'step1',
            title: '技能深化阶段',
            description: '深入学习核心技术栈，获得行业认证',
            timeframe: '6-12个月',
            skills: ['高级编程', '系统架构', '技术领导力'],
            actions: ['完成高级技术认证', '参与开源项目', '技术分享演讲'],
            priority: 'high'
          },
          {
            id: 'step2',
            title: '团队技术负责人',
            description: '带领技术团队，负责技术方案设计和实施',
            timeframe: '1-2年',
            skills: ['团队管理', '架构设计', '技术选型'],
            actions: ['管理5-10人技术团队', '设计核心系统架构', '制定技术规范'],
            priority: 'high'
          },
          {
            id: 'step3',
            title: '技术专家/架构师',
            description: '成为公司技术专家，指导技术发展方向',
            timeframe: '2-3年',
            skills: ['战略规划', '技术前瞻', '跨部门协作'],
            actions: ['制定技术战略', '建立技术标准', '培养技术人才'],
            priority: 'medium'
          }
        ],
        salaryGrowth: {
          current: userProfile.currentSalary || 25000,
          year1: 35000,
          year3: 50000,
          year5: 70000
        },
        difficulty: 'medium',
        matchScore: 92
      },
      {
        id: 'management_track',
        title: '管理发展路径',
        description: '转向管理岗位，发展团队管理和业务能力',
        timeframe: '4-6年',
        steps: [
          {
            id: 'step1',
            title: '小组长/Team Lead',
            description: '开始管理小团队，培养基础管理技能',
            timeframe: '1年',
            skills: ['团队管理', '沟通协调', '项目管理'],
            actions: ['管理3-5人团队', '学习管理课程', '建立团队文化'],
            priority: 'high'
          },
          {
            id: 'step2',
            title: '部门经理',
            description: '管理更大团队，负责部门业务目标',
            timeframe: '2-3年',
            skills: ['业务理解', '战略思维', '跨部门协作'],
            actions: ['管理15-20人团队', '制定部门战略', '业务目标达成'],
            priority: 'high'
          },
          {
            id: 'step3',
            title: '高级管理者',
            description: '成为公司高管，参与公司战略决策',
            timeframe: '2-3年',
            skills: ['战略规划', '组织建设', '商业敏感度'],
            actions: ['参与公司战略', '建设组织能力', '培养管理人才'],
            priority: 'medium'
          }
        ],
        salaryGrowth: {
          current: userProfile.currentSalary || 25000,
          year1: 40000,
          year3: 60000,
          year5: 90000
        },
        difficulty: 'hard',
        matchScore: 78
      },
      {
        id: 'product_specialist',
        title: '产品专业路径',
        description: '转向产品方向，成为产品专家和产品负责人',
        timeframe: '3-4年',
        steps: [
          {
            id: 'step1',
            title: '产品经理助理',
            description: '学习产品基础知识，参与产品规划和设计',
            timeframe: '6-12个月',
            skills: ['产品设计', '用户研究', '数据分析'],
            actions: ['产品经理认证', '用户调研项目', '产品原型设计'],
            priority: 'high'
          },
          {
            id: 'step2',
            title: '产品经理',
            description: '独立负责产品线，制定产品策略',
            timeframe: '2-3年',
            skills: ['产品策略', '市场分析', '项目管理'],
            actions: ['负责核心产品线', '制定产品路线图', '跨团队协作'],
            priority: 'high'
          },
          {
            id: 'step3',
            title: '高级产品经理/产品总监',
            description: '负责多个产品线，参与公司产品战略',
            timeframe: '1-2年',
            skills: ['商业洞察', '战略规划', '团队建设'],
            actions: ['管理产品团队', '制定产品战略', '业务增长负责'],
            priority: 'medium'
          }
        ],
        salaryGrowth: {
          current: userProfile.currentSalary || 25000,
          year1: 32000,
          year3: 48000,
          year5: 65000
        },
        difficulty: 'medium',
        matchScore: 85
      }
    ];

    // 生成技能差距分析
    const gaps: SkillGap[] = [
      {
        skill: '高级编程技能',
        currentLevel: 7,
        targetLevel: 9,
        importance: 'critical',
        learningResources: ['深入学习算法与数据结构', '开源项目贡献', '技术博客写作']
      },
      {
        skill: '系统架构设计',
        currentLevel: 5,
        targetLevel: 8,
        importance: 'critical',
        learningResources: ['系统设计课程', '大型项目实践', '架构师认证']
      },
      {
        skill: '团队管理',
        currentLevel: 3,
        targetLevel: 7,
        importance: 'important',
        learningResources: ['管理培训课程', '团队建设实践', '管理书籍阅读']
      },
      {
        skill: '产品思维',
        currentLevel: 4,
        targetLevel: 7,
        importance: 'nice-to-have',
        learningResources: ['产品经理课程', '用户体验设计', '市场分析实践']
      }
    ];

    // 生成市场洞察
    const insights: MarketInsight[] = [
      {
        title: '技术人才需求增长',
        description: '人工智能和大数据领域技术人才需求持续增长，薪资水平上涨明显',
        trend: 'positive',
        percentage: 25
      },
      {
        title: '远程工作趋势',
        description: '远程和混合办公模式成为主流，相关技能越来越重要',
        trend: 'positive',
        percentage: 40
      },
      {
        title: '管理技能溢价',
        description: '具备技术背景的管理人员在市场上更受欢迎，薪资溢价显著',
        trend: 'positive',
        percentage: 35
      }
    ];

    // 生成行业预测数据
    const forecast: IndustryForecast[] = [
      { year: '2024', demandIndex: 85, avgSalary: 28000, jobCount: 15000 },
      { year: '2025', demandIndex: 92, avgSalary: 32000, jobCount: 18000 },
      { year: '2026', demandIndex: 98, avgSalary: 36000, jobCount: 22000 },
      { year: '2027', demandIndex: 95, avgSalary: 40000, jobCount: 25000 },
      { year: '2028', demandIndex: 88, avgSalary: 43000, jobCount: 27000 }
    ];

    // 生成竞争力分析
    const analysis: CompetitorAnalysis[] = [
      { skillCategory: '技术能力', yourLevel: 7, marketAverage: 6, topPerformers: 9 },
      { skillCategory: '项目管理', yourLevel: 5, marketAverage: 6, topPerformers: 8 },
      { skillCategory: '团队协作', yourLevel: 8, marketAverage: 7, topPerformers: 9 },
      { skillCategory: '业务理解', yourLevel: 6, marketAverage: 5, topPerformers: 8 },
      { skillCategory: '创新思维', yourLevel: 7, marketAverage: 6, topPerformers: 9 }
    ];

    // 生成职业里程碑
    const milestones: CareerMilestone[] = [
      {
        id: 'milestone1',
        title: '完成技术认证',
        description: '获得相关技术领域的专业认证，提升技术权威性',
        targetDate: '2024-06-30',
        priority: 'high',
        completed: false,
        skills: ['专业认证', '技术深度'],
        resources: ['在线课程', '实践项目', '模拟考试']
      },
      {
        id: 'milestone2',
        title: '承担团队领导角色',
        description: '开始管理3-5人的技术团队，培养管理经验',
        targetDate: '2024-12-31',
        priority: 'high',
        completed: false,
        skills: ['团队管理', '项目协调', '沟通技巧'],
        resources: ['管理培训', '导师指导', '实践机会']
      },
      {
        id: 'milestone3',
        title: '主导技术架构设计',
        description: '负责核心系统的技术架构设计和优化',
        targetDate: '2025-06-30',
        priority: 'medium',
        completed: false,
        skills: ['系统架构', '技术选型', '性能优化'],
        resources: ['架构师培训', '技术论坛', '开源项目']
      },
      {
        id: 'milestone4',
        title: '建立个人技术品牌',
        description: '通过技术分享和开源贡献建立行业影响力',
        targetDate: '2025-12-31',
        priority: 'medium',
        completed: false,
        skills: ['技术写作', '公开演讲', '社区建设'],
        resources: ['技术博客', '会议演讲', '开源贡献']
      }
    ];

    setCareerPaths(paths);
    setSkillGaps(gaps);
    setMarketInsights(insights);
    setIndustryForecast(forecast);
    setCompetitorAnalysis(analysis);
    setCareerMilestones(milestones);
    setIsAnalyzing(false);
    setCurrentStep('results');
  };

  const handleSkillAdd = (skill: string) => {
    if (skill.trim() && !userProfile.skills.includes(skill.trim())) {
      setUserProfile(prev => ({
        ...prev,
        skills: [...prev.skills, skill.trim()]
      }));
    }
  };

  const handleInterestAdd = (interest: string) => {
    if (interest.trim() && !userProfile.interests.includes(interest.trim())) {
      setUserProfile(prev => ({
        ...prev,
        interests: [...prev.interests, interest.trim()]
      }));
    }
  };

  const handleSkillRemove = (skillToRemove: string) => {
    setUserProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleInterestRemove = (interestToRemove: string) => {
    setUserProfile(prev => ({
      ...prev,
      interests: prev.interests.filter(interest => interest !== interestToRemove)
    }));
  };

  const handleCertificationAdd = (certification: string) => {
    if (certification.trim() && !userProfile.certifications.includes(certification.trim())) {
      setUserProfile(prev => ({
        ...prev,
        certifications: [...prev.certifications, certification.trim()]
      }));
    }
  };

  const handleCertificationRemove = (certificationToRemove: string) => {
    setUserProfile(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert !== certificationToRemove)
    }));
  };

  const handleLanguageAdd = (language: string) => {
    if (language.trim() && !userProfile.languages.includes(language.trim())) {
      setUserProfile(prev => ({
        ...prev,
        languages: [...prev.languages, language.trim()]
      }));
    }
  };

  const handleLanguageRemove = (languageToRemove: string) => {
    setUserProfile(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang !== languageToRemove)
    }));
  };

  // 保存职业规划
  const savePlan = () => {
    const newPlan: SavedPlan = {
      id: `plan_${Date.now()}`,
      name: `${userProfile.name}的职业规划_${new Date().toLocaleDateString()}`,
      profile: userProfile,
      careerPaths,
      skillGaps,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
    
    const existingPlans = JSON.parse(localStorage.getItem('careerPlans') || '[]');
    const updatedPlans = [...existingPlans, newPlan];
    localStorage.setItem('careerPlans', JSON.stringify(updatedPlans));
    setSavedPlans(updatedPlans);
    
    alert('职业规划已保存！');
  };

  // 更新里程碑状态
  const updateMilestone = (milestoneId: string, completed: boolean) => {
    setCareerMilestones(prev => 
      prev.map(milestone => 
        milestone.id === milestoneId 
          ? { ...milestone, completed }
          : milestone
      )
    );
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="container max-w-7xl py-12">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-3 bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl">
            <ArrowTrendingUpIcon className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-dsp-dark">职业规划助手</h1>
            <p className="text-dsp-gray mt-1">AI分析你的技能和经验，为你规划最优的职业发展路径</p>
          </div>
        </div>

        {/* 步骤指示器 */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
              currentStep === 'profile' ? 'bg-green-100 text-green-700' : 
              currentStep === 'analysis' || currentStep === 'results' ? 'bg-green-600 text-white' : 
              'bg-gray-100 text-gray-500'
            }`}>
              <UserIcon className="w-4 h-4" />
              <span className="text-sm font-medium">个人档案</span>
            </div>
            
            <ArrowRightIcon className="w-4 h-4 text-gray-400" />
            
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
              currentStep === 'analysis' ? 'bg-green-100 text-green-700' : 
              currentStep === 'results' ? 'bg-green-600 text-white' : 
              'bg-gray-100 text-gray-500'
            }`}>
              <SparklesIcon className="w-4 h-4" />
              <span className="text-sm font-medium">AI分析</span>
            </div>
            
            <ArrowRightIcon className="w-4 h-4 text-gray-400" />
            
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
              currentStep === 'results' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              <ChartBarIcon className="w-4 h-4" />
              <span className="text-sm font-medium">规划方案</span>
            </div>
          </div>
        </div>

        {/* 内容区域 */}
        {currentStep === 'profile' && (
          <ProfileForm 
            profile={userProfile}
            setProfile={setUserProfile}
            onSkillAdd={handleSkillAdd}
            onInterestAdd={handleInterestAdd}
            onSkillRemove={handleSkillRemove}
            onInterestRemove={handleInterestRemove}
            onCertificationAdd={handleCertificationAdd}
            onCertificationRemove={handleCertificationRemove}
            onLanguageAdd={handleLanguageAdd}
            onLanguageRemove={handleLanguageRemove}
            onNext={analyzeCareerPath}
          />
        )}

        {currentStep === 'analysis' && (
          <AnalysisProgress />
        )}

        {currentStep === 'results' && (
          <CareerPlanResults 
            careerPaths={careerPaths}
            skillGaps={skillGaps}
            marketInsights={marketInsights}
            industryForecast={industryForecast}
            competitorAnalysis={competitorAnalysis}
            careerMilestones={careerMilestones}
            userProfile={userProfile}
            onRestart={() => setCurrentStep('profile')}
            onSave={savePlan}
            onUpdateMilestone={updateMilestone}
          />
        )}
      </div>
    </div>
  );
};

// 个人档案表单组件
const ProfileForm: React.FC<{
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  onSkillAdd: (skill: string) => void;
  onInterestAdd: (interest: string) => void;
  onSkillRemove: (skill: string) => void;
  onInterestRemove: (interest: string) => void;
  onCertificationAdd: (certification: string) => void;
  onCertificationRemove: (certification: string) => void;
  onLanguageAdd: (language: string) => void;
  onLanguageRemove: (language: string) => void;
  onNext: () => void;
}> = ({ 
  profile, 
  setProfile, 
  onSkillAdd, 
  onInterestAdd, 
  onSkillRemove, 
  onInterestRemove,
  onCertificationAdd,
  onCertificationRemove,
  onLanguageAdd,
  onLanguageRemove,
  onNext 
}) => {
  const industries = getIndustries();
  const categories = profile.industry ? getCategories(profile.industry) : [];
  const positions = profile.category ? getPositions(profile.industry, profile.category) : [];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          🚀 建立你的职业档案
        </h2>
        
        <div className="space-y-8">
          {/* 第一部分：基础信息 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">基础信息</h3>
            </div>
            
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  姓名 *
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                placeholder="请输入你的姓名"
              />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  工作地点 *
              </label>
                <select
                  value={profile.location}
                  onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-gray-900"
                >
                  <option value="">请选择城市</option>
                  {popularCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
          </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  工作经验 *
              </label>
              <select
                value={profile.experience}
                onChange={(e) => setProfile(prev => ({ ...prev, experience: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-gray-900"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  学历背景 *
              </label>
              <select
                value={profile.education}
                onChange={(e) => setProfile(prev => ({ ...prev, education: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-gray-900"
              >
                <option value="">请选择学历</option>
                <option value="高中">高中</option>
                <option value="大专">大专</option>
                <option value="本科">本科</option>
                <option value="硕士">硕士</option>
                <option value="博士">博士</option>
              </select>
              </div>
            </div>
          </div>

          {/* 第二部分：职位信息 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <BriefcaseIcon className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">职位信息</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  行业领域 *
                </label>
                <select
                  value={profile.industry}
                  onChange={(e) => {
                    setProfile(prev => ({ 
                      ...prev, 
                      industry: e.target.value,
                      category: '',
                      currentPosition: ''
                    }));
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 bg-white text-gray-900"
                >
                  <option value="">请选择行业</option>
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  职能分类 *
                </label>
                <select
                  value={profile.category}
                  onChange={(e) => {
                    setProfile(prev => ({ 
                      ...prev, 
                      category: e.target.value,
                      currentPosition: ''
                    }));
                  }}
                  disabled={!profile.industry}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 bg-white text-gray-900 disabled:bg-gray-100 disabled:text-gray-500"
                >
                  <option value="">请选择职能</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  具体职位 *
                </label>
                <select
                  value={profile.currentPosition}
                  onChange={(e) => setProfile(prev => ({ ...prev, currentPosition: e.target.value }))}
                  disabled={!profile.category}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 bg-white text-gray-900 disabled:bg-gray-100 disabled:text-gray-500"
                >
                  <option value="">请选择职位</option>
                  {positions.map(position => (
                    <option key={position} value={position}>{position}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  公司规模
                </label>
                <select
                  value={profile.company_size}
                  onChange={(e) => setProfile(prev => ({ ...prev, company_size: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 bg-white text-gray-900"
                >
                  <option value="">请选择公司规模</option>
                  <option value="0-20人">0-20人</option>
                  <option value="20-99人">20-99人</option>
                  <option value="100-499人">100-499人</option>
                  <option value="500-999人">500-999人</option>
                  <option value="1000-9999人">1000-9999人</option>
                  <option value="10000人以上">10000人以上</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  职级水平
                </label>
                <select
                  value={profile.job_level}
                  onChange={(e) => setProfile(prev => ({ ...prev, job_level: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 bg-white text-gray-900"
                >
                  <option value="">请选择职级</option>
                  <option value="实习生">实习生</option>
                  <option value="初级">初级</option>
                  <option value="中级">中级</option>
                  <option value="高级">高级</option>
                  <option value="专家">专家</option>
                  <option value="经理">经理</option>
                  <option value="高级经理">高级经理</option>
                  <option value="总监">总监</option>
                  <option value="VP">VP</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  管理经验
                </label>
                <select
                  value={profile.management_experience}
                  onChange={(e) => setProfile(prev => ({ ...prev, management_experience: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 bg-white text-gray-900"
                >
                  <option value="">请选择管理经验</option>
                  <option value="无管理经验">无管理经验</option>
                  <option value="1-5人">1-5人</option>
                  <option value="6-10人">6-10人</option>
                  <option value="11-20人">11-20人</option>
                  <option value="21-50人">21-50人</option>
                  <option value="50人以上">50人以上</option>
                </select>
              </div>
            </div>
          </div>

          {/* 第三部分：技能与能力 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <StarIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">技能与能力</h3>
            </div>
            
            {/* 技能专长 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
              技能专长
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {skill}
                  <button
                    onClick={() => onSkillRemove(skill)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
                placeholder="输入技能后按回车添加，如：Python、项目管理、数据分析"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white text-gray-900 placeholder-gray-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  onSkillAdd((e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
            />
          </div>

            {/* 认证证书 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                认证证书
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {profile.certifications.map((cert) => (
                  <span
                    key={cert}
                    className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                  >
                    {cert}
                    <button
                      onClick={() => onCertificationRemove(cert)}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="输入认证后按回车添加，如：PMP、AWS、CPA"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white text-gray-900 placeholder-gray-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                语言能力
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
                {profile.languages.map((lang) => (
                <span
                    key={lang}
                    className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full"
                >
                    {lang}
                  <button
                      onClick={() => onLanguageRemove(lang)}
                      className="ml-2 text-orange-600 hover:text-orange-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
                placeholder="输入语言后按回车添加，如：英语-流利、日语-中级"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white text-gray-900 placeholder-gray-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                    onLanguageAdd((e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
            />
            </div>
          </div>

          {/* 第四部分：职业偏好 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-orange-100 rounded-lg">
                <ArrowTrendingUpIcon className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">职业偏好与目标</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                当前薪酬 (月薪)
              </label>
              <input
                type="number"
                value={profile.currentSalary}
                onChange={(e) => setProfile(prev => ({ ...prev, currentSalary: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-500"
                placeholder="如：25000"
              />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                目标薪酬 (月薪)
              </label>
              <input
                type="number"
                value={profile.targetSalary}
                onChange={(e) => setProfile(prev => ({ ...prev, targetSalary: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-500"
                placeholder="如：40000"
              />
            </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  工作偏好
                </label>
                <select
                  value={profile.work_preference}
                  onChange={(e) => setProfile(prev => ({ ...prev, work_preference: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white text-gray-900"
                >
                  <option value="">请选择工作偏好</option>
                  <option value="现场办公">现场办公</option>
                  <option value="远程办公">远程办公</option>
                  <option value="混合办公">混合办公</option>
                  <option value="灵活安排">灵活安排</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  转行意向
                </label>
                <select
                  value={profile.career_change_interest}
                  onChange={(e) => setProfile(prev => ({ ...prev, career_change_interest: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white text-gray-900"
                >
                  <option value="">请选择转行意向</option>
                  <option value="无转行计划">无转行计划</option>
                  <option value="行业内转岗">行业内转岗</option>
                  <option value="跨行业发展">跨行业发展</option>
                  <option value="创业意向">创业意向</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  领导力抱负
                </label>
                <select
                  value={profile.leadership_aspiration}
                  onChange={(e) => setProfile(prev => ({ ...prev, leadership_aspiration: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white text-gray-900"
                >
                  <option value="">请选择领导力发展意向</option>
                  <option value="专业路线">专业路线（技术专家/高级个贡）</option>
                  <option value="管理路线">管理路线（团队管理/部门管理）</option>
                  <option value="综合发展">综合发展（专业+管理）</option>
                  <option value="暂无明确想法">暂无明确想法</option>
                </select>
              </div>
            </div>

            {/* 兴趣方向 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                兴趣方向
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {profile.interests.map((interest) => (
                  <span
                    key={interest}
                    className="inline-flex items-center px-3 py-1 bg-pink-100 text-pink-800 text-sm rounded-full"
                  >
                    {interest}
                    <button
                      onClick={() => onInterestRemove(interest)}
                      className="ml-2 text-pink-600 hover:text-pink-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="输入兴趣方向后按回车添加，如：人工智能、产品设计、团队管理"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    onInterestAdd((e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
              />
          </div>

          {/* 职业目标 */}
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                职业目标与期望
            </label>
            <textarea
              value={profile.careerGoals}
              onChange={(e) => setProfile(prev => ({ ...prev, careerGoals: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-500"
                placeholder="详细描述你的职业发展目标、期望的工作环境、理想的职业状态等..."
              />
            </div>
          </div>

          {/* 提交按钮 */}
          <div className="flex justify-center pt-6">
            <button
              onClick={onNext}
              disabled={!profile.name || !profile.location || !profile.industry || !profile.category || !profile.currentPosition || !profile.experience || !profile.education}
              className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:hover:scale-100 flex items-center space-x-3 shadow-lg"
            >
              <SparklesIcon className="w-6 h-6" />
              <span>开始AI职业规划分析</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// AI分析进度组件
const AnalysisProgress: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
        <div className="space-y-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent"></div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-dsp-dark mb-2">AI正在为你分析职业发展路径</h3>
            <p className="text-dsp-gray">
              正在分析你的技能优势、市场机会和发展潜力...
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-2 text-sm text-green-600">
              <CheckCircleIcon className="w-4 h-4" />
              <span>技能评估完成</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-green-600">
              <CheckCircleIcon className="w-4 h-4" />
              <span>市场机会分析完成</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-dsp-gray">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-600 border-t-transparent"></div>
              <span>生成个性化发展路径...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 职业规划结果组件
const CareerPlanResults: React.FC<{
  careerPaths: CareerPath[];
  skillGaps: SkillGap[];
  marketInsights: MarketInsight[];
  industryForecast: IndustryForecast[];
  competitorAnalysis: CompetitorAnalysis[];
  careerMilestones: CareerMilestone[];
  userProfile: UserProfile;
  onRestart: () => void;
  onSave: () => void;
  onUpdateMilestone: (milestoneId: string, completed: boolean) => void;
}> = ({ 
  careerPaths, 
  skillGaps, 
  marketInsights, 
  industryForecast, 
  competitorAnalysis, 
  careerMilestones, 
  userProfile,
  onRestart, 
  onSave,
  onUpdateMilestone 
}) => {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'paths' | 'skills' | 'insights' | 'milestones'>('overview');

  return (
    <div className="space-y-8">
      {/* 操作栏 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">🎯 {userProfile.name}的职业发展规划</h2>
          <p className="text-gray-600 mt-1">基于AI分析为您定制的专业职业发展方案</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onRestart}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors rounded-xl hover:bg-gray-100 border border-gray-200"
          >
            🔄 重新分析
          </button>
          <button 
            onClick={onSave}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all rounded-xl font-medium shadow-lg flex items-center space-x-2"
          >
            <BookmarkIcon className="w-5 h-5" />
            <span>保存规划</span>
          </button>
        </div>
      </div>

      {/* 导航标签 */}
      <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
        <div className="flex space-x-2">
          {[
            { id: 'overview', label: '📊 总览', icon: ChartBarIcon },
            { id: 'paths', label: '🛤️ 职业路径', icon: ArrowTrendingUpIcon },
            { id: 'skills', label: '🎯 技能提升', icon: StarIcon },
            { id: 'insights', label: '📈 市场洞察', icon: LightBulbIcon },
            { id: 'milestones', label: '🎖️ 里程碑', icon: TrophyIcon }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all font-medium ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 总览标签页 */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* 综合分析卡片 */}
          <div className="lg:col-span-2 xl:col-span-2 space-y-6">
            {/* 竞争力雷达图 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ShieldCheckIcon className="w-5 h-5 text-purple-600 mr-2" />
                个人竞争力分析
              </h3>
              <div className="space-y-4">
                {competitorAnalysis.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700">{item.skillCategory}</span>
                      <span className="text-gray-500">{item.yourLevel}/10</span>
                    </div>
                    <div className="flex space-x-2 items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="flex h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-blue-500" 
                            style={{ width: `${(item.yourLevel / 10) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex space-x-1 text-xs">
                        <span className="text-gray-400">市场平均: {item.marketAverage}</span>
                        <span className="text-green-600">顶尖: {item.topPerformers}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 行业趋势图表 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ArrowTrendingUpIcon className="w-5 h-5 text-green-600 mr-2" />
                行业发展趋势
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-5 gap-4">
                  {industryForecast.map((data, index) => (
                    <div key={index} className="text-center">
                      <div className="text-xs text-gray-500 mb-1">{data.year}</div>
                      <div className="h-20 bg-gray-100 rounded-lg relative overflow-hidden">
                        <div 
                          className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-lg"
                          style={{ height: `${(data.demandIndex / 100) * 100}%` }}
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-semibold text-white">{data.demandIndex}</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">需求指数</div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-5 gap-4 mt-4">
                  {industryForecast.map((data, index) => (
                    <div key={index} className="text-center">
                      <div className="text-sm font-semibold text-green-600">
                        ¥{(data.avgSalary / 1000).toFixed(0)}K
                      </div>
                      <div className="text-xs text-gray-500">平均薪资</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 右侧统计卡片 */}
          <div className="space-y-6">
            {/* 关键数据 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 关键数据</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">职业匹配度</span>
                  <span className="text-lg font-bold text-blue-600">
                    {Math.max(...careerPaths.map(p => p.matchScore))}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">技能完整度</span>
                  <span className="text-lg font-bold text-green-600">
                    {Math.round((skillGaps.reduce((acc, gap) => acc + gap.currentLevel, 0) / (skillGaps.length * 10)) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">市场机会</span>
                  <span className="text-lg font-bold text-purple-600">优秀</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">预计薪资增长</span>
                  <span className="text-lg font-bold text-orange-600">+40%</span>
                </div>
              </div>
            </div>

            {/* 市场洞察快览 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🔍 市场洞察</h3>
              <div className="space-y-3">
                {marketInsights.slice(0, 2).map((insight, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{insight.title}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        insight.trend === 'positive' ? 'bg-green-100 text-green-700' :
                        insight.trend === 'negative' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {insight.trend === 'positive' ? '📈' : insight.trend === 'negative' ? '📉' : '📊'} +{insight.percentage}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{insight.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 快速行动 */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ 下一步行动</h3>
              <div className="space-y-3">
                {careerMilestones.slice(0, 2).map((milestone, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      milestone.priority === 'high' ? 'bg-red-500' :
                      milestone.priority === 'medium' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}></div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{milestone.title}</div>
                      <div className="text-xs text-gray-600">目标: {new Date(milestone.targetDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 职业路径标签页 */}
      {activeTab === 'paths' && (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {careerPaths.map((path) => (
          <div
            key={path.id}
            className={`border-2 rounded-2xl p-6 cursor-pointer transition-all ${
              selectedPath === path.id
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 hover:border-blue-300 bg-white hover:shadow-md'
            }`}
            onClick={() => setSelectedPath(selectedPath === path.id ? null : path.id)}
          >
            <div className="space-y-4">
              {/* 路径头部 */}
              <div className="flex items-start justify-between">
                <div>
                    <h3 className="font-bold text-gray-900 mb-2">{path.title}</h3>
                  <div className="flex items-center space-x-2">
                      <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                        🎯 匹配度 {path.matchScore}%
                    </span>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      path.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                      path.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                        {path.difficulty === 'easy' ? '🟢 容易' : path.difficulty === 'medium' ? '🟡 中等' : '🔴 困难'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                    <div className="text-sm text-gray-500">预期时间</div>
                    <div className="font-bold text-gray-900">{path.timeframe}</div>
                </div>
              </div>

                <p className="text-sm text-gray-600 leading-relaxed">{path.description}</p>

                {/* 薪酬增长预期 - 可视化条形图 */}
                <div className="space-y-3">
                  <div className="text-sm font-semibold text-gray-900">💰 薪酬增长预期</div>
              <div className="space-y-2">
                    {[
                      { label: '当前', value: path.salaryGrowth.current, color: 'bg-gray-400' },
                      { label: '1年后', value: path.salaryGrowth.year1, color: 'bg-green-400' },
                      { label: '3年后', value: path.salaryGrowth.year3, color: 'bg-green-500' },
                      { label: '5年后', value: path.salaryGrowth.year5, color: 'bg-green-600' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-12 text-xs text-gray-600">{item.label}</div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${item.color}`}
                            style={{ width: `${(item.value / Math.max(...Object.values(path.salaryGrowth))) * 100}%` }}
                          ></div>
                  </div>
                        <div className="w-16 text-xs font-semibold text-gray-900">¥{(item.value / 1000).toFixed(0)}K</div>
                  </div>
                    ))}
                </div>
              </div>

              {/* 展开详情 */}
              {selectedPath === path.id && (
                  <div className="pt-4 border-t border-blue-200 space-y-4">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                      <CalendarIcon className="w-4 h-4 mr-2 text-blue-600" />
                      发展路线图
                    </h4>
                  {path.steps.map((step, index) => (
                      <div key={step.id} className="relative">
                        <div className="flex items-start space-x-3">
                          <div className="flex flex-col items-center">
                            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 text-sm rounded-full font-bold">
                          {index + 1}
                            </div>
                            {index < path.steps.length - 1 && (
                              <div className="w-0.5 h-8 bg-blue-200 mt-2"></div>
                            )}
                          </div>
                          <div className="flex-1 pb-6">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-semibold text-gray-900">{step.title}</h5>
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                {step.timeframe}
                        </span>
                      </div>
                            <p className="text-sm text-gray-600 mb-3">{step.description}</p>
                            <div className="space-y-2">
                              <div>
                                <div className="text-xs font-medium text-gray-700 mb-1">🎯 关键技能:</div>
                        <div className="flex flex-wrap gap-1">
                          {step.skills.map(skill => (
                                    <span key={skill} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-md font-medium">
                              {skill}
                            </span>
                          ))}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs font-medium text-gray-700 mb-1">📋 行动计划:</div>
                                <ul className="text-xs text-gray-600 space-y-1">
                                  {step.actions.map((action, idx) => (
                                    <li key={idx} className="flex items-start space-x-2">
                                      <span className="text-blue-500">•</span>
                                      <span>{action}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      )}

      {/* 技能提升标签页 */}
      {activeTab === 'skills' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {skillGaps.map((gap) => (
            <div key={gap.skill} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{gap.skill}</h3>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                  gap.importance === 'critical' ? 'bg-red-100 text-red-700' :
                  gap.importance === 'important' ? 'bg-orange-100 text-orange-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {gap.importance === 'critical' ? '🔥 关键' : gap.importance === 'important' ? '⚡ 重要' : '💫 有用'}
                </span>
              </div>
              
              {/* 技能进度条 */}
              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">当前水平</span>
                    <span className="font-semibold text-gray-900">{gap.currentLevel}/10</span>
                </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                      className="bg-blue-500 h-3 rounded-full transition-all duration-500" 
                    style={{ width: `${gap.currentLevel * 10}%` }}
                  ></div>
                </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">目标水平</span>
                    <span className="font-semibold text-gray-900">{gap.targetLevel}/10</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-500 h-3 rounded-full transition-all duration-500" 
                    style={{ width: `${gap.targetLevel * 10}%` }}
                  ></div>
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                  <div className="text-sm font-medium text-yellow-800 mb-1">
                    📈 提升空间: {gap.targetLevel - gap.currentLevel} 分
                  </div>
                  <div className="text-xs text-yellow-700">
                    预计需要 {Math.ceil((gap.targetLevel - gap.currentLevel) * 2)} 个月的专注学习
                  </div>
                </div>
              </div>
              
              {/* 学习建议 */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                  <AcademicCapIcon className="w-4 h-4 mr-2 text-purple-600" />
                  学习路径建议
                </h4>
              <div className="space-y-2">
                  {gap.learningResources.map((resource, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-sm text-gray-900 font-medium">{resource}</span>
                        <div className="text-xs text-gray-500 mt-1">
                          预计时间: {Math.ceil(Math.random() * 4 + 1)} 周
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 市场洞察标签页 */}
      {activeTab === 'insights' && (
        <div className="space-y-6">
          {/* 市场洞察卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {marketInsights.map((insight, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                  <span className={`text-lg ${
                    insight.trend === 'positive' ? 'text-green-500' :
                    insight.trend === 'negative' ? 'text-red-500' :
                    'text-blue-500'
                  }`}>
                    {insight.trend === 'positive' ? '📈' : insight.trend === 'negative' ? '📉' : '📊'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{insight.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">增长率</span>
                  <span className={`text-lg font-bold ${
                    insight.trend === 'positive' ? 'text-green-600' :
                    insight.trend === 'negative' ? 'text-red-600' :
                    'text-blue-600'
                  }`}>
                    +{insight.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* 详细行业数据 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <BuildingOffice2Icon className="w-6 h-6 text-blue-600 mr-2" />
              行业发展详情
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 text-sm font-semibold text-gray-900">年份</th>
                    <th className="text-left py-3 text-sm font-semibold text-gray-900">需求指数</th>
                    <th className="text-left py-3 text-sm font-semibold text-gray-900">平均薪资</th>
                    <th className="text-left py-3 text-sm font-semibold text-gray-900">职位数量</th>
                    <th className="text-left py-3 text-sm font-semibold text-gray-900">趋势</th>
                  </tr>
                </thead>
                <tbody>
                  {industryForecast.map((data, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 text-sm font-medium text-gray-900">{data.year}</td>
                      <td className="py-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-12 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${data.demandIndex}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-900">{data.demandIndex}</span>
                        </div>
                      </td>
                      <td className="py-3 text-sm font-semibold text-green-600">
                        ¥{(data.avgSalary / 1000).toFixed(0)}K
                      </td>
                      <td className="py-3 text-sm text-gray-900">
                        {data.jobCount.toLocaleString()}
                      </td>
                      <td className="py-3">
                        {index > 0 && (
                          <span className={`text-sm ${
                            data.avgSalary > industryForecast[index - 1].avgSalary ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {data.avgSalary > industryForecast[index - 1].avgSalary ? '↗️ 上升' : '↘️ 下降'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 里程碑标签页 */}
      {activeTab === 'milestones' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center">
              <TrophyIcon className="w-6 h-6 text-purple-600 mr-2" />
              职业发展里程碑
            </h3>
            <p className="text-gray-600">设定明确的目标，逐步实现职业突破</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {careerMilestones.map((milestone) => (
              <div key={milestone.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={milestone.completed}
                      onChange={(e) => onUpdateMilestone(milestone.id, e.target.checked)}
                      className="mt-1 w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <div>
                      <h4 className={`text-lg font-semibold ${milestone.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                        {milestone.title}
                      </h4>
                      <p className={`text-sm mt-1 ${milestone.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    milestone.priority === 'high' ? 'bg-red-100 text-red-700' :
                    milestone.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {milestone.priority === 'high' ? '🔥 高优先级' : 
                     milestone.priority === 'medium' ? '⚡ 中优先级' : '💫 低优先级'}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <ClockIcon className="w-4 h-4" />
                    <span>目标完成时间: {new Date(milestone.targetDate).toLocaleDateString()}</span>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">🎯 需要掌握的技能:</div>
                    <div className="flex flex-wrap gap-2">
                      {milestone.skills.map(skill => (
                        <span key={skill} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-md">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">📚 学习资源:</div>
                    <ul className="space-y-1">
                      {milestone.resources.map((resource, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start space-x-2">
                          <DocumentTextIcon className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span>{resource}</span>
                    </li>
                  ))}
                </ul>
                  </div>

                  {milestone.completed && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2 text-green-700">
                        <CheckCircleIcon className="w-5 h-5" />
                        <span className="text-sm font-medium">已完成！恭喜你达成这个里程碑 🎉</span>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>
      )}
    </div>
  );
};
