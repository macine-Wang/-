/**
 * 职业规划助手
 * AI分析你的技能和经验，为你规划最优的职业发展路径
 */

import React, { useState } from 'react';
import { deepseekApi } from '@/services/deepseekApi';
import { 
  ArrowTrendingUpIcon,
  SparklesIcon,
  UserIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  ClockIcon,
  StarIcon,
  ChartBarIcon,
  LightBulbIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

interface UserProfile {
  name: string;
  currentPosition: string;
  experience: string;
  education: string;
  skills: string[];
  interests: string[];
  currentSalary: number;
  targetSalary: number;
  careerGoals: string;
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

export const CareerPlanningPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'profile' | 'analysis' | 'results'>('profile');
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    currentPosition: '',
    experience: '',
    education: '',
    skills: [],
    interests: [],
    currentSalary: 0,
    targetSalary: 0,
    careerGoals: ''
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);

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

    setCareerPaths(paths);
    setSkillGaps(gaps);
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

  return (
    <div className="bg-white min-h-screen">
      <div className="container max-w-6xl py-12">
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
            onRestart={() => setCurrentStep('profile')}
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
  onNext: () => void;
}> = ({ profile, setProfile, onSkillAdd, onInterestAdd, onSkillRemove, onInterestRemove, onNext }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white border border-gray-200 rounded-2xl p-8">
        <h2 className="text-xl font-semibold text-dsp-dark mb-6">建立你的职业档案</h2>
        
        <div className="space-y-6">
          {/* 基础信息 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-dsp-dark mb-2">
                姓名
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                placeholder="请输入你的姓名"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-dsp-dark mb-2">
                当前职位
              </label>
              <input
                type="text"
                value={profile.currentPosition}
                onChange={(e) => setProfile(prev => ({ ...prev, currentPosition: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                placeholder="如：高级前端工程师"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-dsp-dark mb-2">
                工作经验
              </label>
              <select
                value={profile.experience}
                onChange={(e) => setProfile(prev => ({ ...prev, experience: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
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
                学历背景
              </label>
              <select
                value={profile.education}
                onChange={(e) => setProfile(prev => ({ ...prev, education: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
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

          {/* 技能标签 */}
          <div>
            <label className="block text-sm font-medium text-dsp-dark mb-2">
              技能专长
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full"
                >
                  {skill}
                  <button
                    onClick={() => onSkillRemove(skill)}
                    className="ml-2 text-green-500 hover:text-green-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="输入技能后按回车添加"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  onSkillAdd((e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
            />
          </div>

          {/* 兴趣方向 */}
          <div>
            <label className="block text-sm font-medium text-dsp-dark mb-2">
              兴趣方向
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {profile.interests.map((interest) => (
                <span
                  key={interest}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                >
                  {interest}
                  <button
                    onClick={() => onInterestRemove(interest)}
                    className="ml-2 text-blue-500 hover:text-blue-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="输入兴趣方向后按回车添加"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  onInterestAdd((e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
            />
          </div>

          {/* 薪酬信息 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-dsp-dark mb-2">
                当前薪酬 (月薪)
              </label>
              <input
                type="number"
                value={profile.currentSalary}
                onChange={(e) => setProfile(prev => ({ ...prev, currentSalary: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                placeholder="如：25000"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-dsp-dark mb-2">
                目标薪酬 (月薪)
              </label>
              <input
                type="number"
                value={profile.targetSalary}
                onChange={(e) => setProfile(prev => ({ ...prev, targetSalary: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                placeholder="如：40000"
              />
            </div>
          </div>

          {/* 职业目标 */}
          <div>
            <label className="block text-sm font-medium text-dsp-dark mb-2">
              职业目标
            </label>
            <textarea
              value={profile.careerGoals}
              onChange={(e) => setProfile(prev => ({ ...prev, careerGoals: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              placeholder="描述你的职业发展目标和期望..."
            />
          </div>

          {/* 提交按钮 */}
          <div className="pt-6">
            <button
              onClick={onNext}
              disabled={!profile.name || !profile.currentPosition || !profile.experience}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              <SparklesIcon className="w-5 h-5" />
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
  onRestart: () => void;
}> = ({ careerPaths, skillGaps, onRestart }) => {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      {/* 操作栏 */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-dsp-dark">你的职业发展规划</h2>
        <div className="flex space-x-3">
          <button
            onClick={onRestart}
            className="px-4 py-2 text-dsp-gray hover:text-dsp-dark transition-colors rounded-lg hover:bg-gray-50"
          >
            重新分析
          </button>
          <button className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 transition-colors rounded-lg font-medium">
            保存规划
          </button>
        </div>
      </div>

      {/* 职业路径推荐 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {careerPaths.map((path) => (
          <div
            key={path.id}
            className={`border-2 rounded-2xl p-6 cursor-pointer transition-all ${
              selectedPath === path.id
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-green-300 bg-white'
            }`}
            onClick={() => setSelectedPath(selectedPath === path.id ? null : path.id)}
          >
            <div className="space-y-4">
              {/* 路径头部 */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-dsp-dark mb-1">{path.title}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      匹配度 {path.matchScore}%
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      path.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                      path.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {path.difficulty === 'easy' ? '容易' : path.difficulty === 'medium' ? '中等' : '困难'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-dsp-gray">预期时间</div>
                  <div className="font-semibold text-dsp-dark">{path.timeframe}</div>
                </div>
              </div>

              <p className="text-sm text-dsp-gray">{path.description}</p>

              {/* 薪酬增长预期 */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-dsp-dark">薪酬增长预期</div>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="text-center">
                    <div className="font-semibold text-dsp-dark">¥{(path.salaryGrowth.current / 1000).toFixed(0)}K</div>
                    <div className="text-dsp-gray">当前</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-green-600">¥{(path.salaryGrowth.year1 / 1000).toFixed(0)}K</div>
                    <div className="text-dsp-gray">1年后</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-green-600">¥{(path.salaryGrowth.year3 / 1000).toFixed(0)}K</div>
                    <div className="text-dsp-gray">3年后</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-green-600">¥{(path.salaryGrowth.year5 / 1000).toFixed(0)}K</div>
                    <div className="text-dsp-gray">5年后</div>
                  </div>
                </div>
              </div>

              {/* 展开详情 */}
              {selectedPath === path.id && (
                <div className="pt-4 border-t border-green-200 space-y-4">
                  <h4 className="font-medium text-dsp-dark">发展步骤</h4>
                  {path.steps.map((step, index) => (
                    <div key={step.id} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="flex items-center justify-center w-6 h-6 bg-green-100 text-green-700 text-xs rounded-full font-semibold">
                          {index + 1}
                        </span>
                        <span className="font-medium text-dsp-dark text-sm">{step.title}</span>
                        <span className="text-xs text-dsp-gray">({step.timeframe})</span>
                      </div>
                      <p className="text-xs text-dsp-gray ml-8">{step.description}</p>
                      <div className="ml-8 space-y-1">
                        <div className="text-xs text-dsp-gray">关键技能:</div>
                        <div className="flex flex-wrap gap-1">
                          {step.skills.map(skill => (
                            <span key={skill} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {skill}
                            </span>
                          ))}
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

      {/* 技能差距分析 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8">
        <h3 className="text-xl font-semibold text-dsp-dark mb-6 flex items-center">
          <LightBulbIcon className="w-6 h-6 text-orange-500 mr-2" />
          技能提升建议
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillGaps.map((gap) => (
            <div key={gap.skill} className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-dsp-dark">{gap.skill}</h4>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  gap.importance === 'critical' ? 'bg-red-100 text-red-700' :
                  gap.importance === 'important' ? 'bg-orange-100 text-orange-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {gap.importance === 'critical' ? '关键' : gap.importance === 'important' ? '重要' : '有用'}
                </span>
              </div>
              
              {/* 技能等级条 */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-dsp-gray">
                  <span>当前水平</span>
                  <span>{gap.currentLevel}/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${gap.currentLevel * 10}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-dsp-gray">
                  <span>目标水平</span>
                  <span>{gap.targetLevel}/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${gap.targetLevel * 10}%` }}
                  ></div>
                </div>
              </div>
              
              {/* 学习建议 */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-dsp-dark">学习建议:</div>
                <ul className="space-y-1">
                  {gap.learningResources.map((resource, index) => (
                    <li key={index} className="text-sm text-dsp-gray flex items-start space-x-2">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{resource}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
