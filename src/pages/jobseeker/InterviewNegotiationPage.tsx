/**
 * 面试薪酬谈判助手
 * 提供薪酬谈判技巧和策略，帮你在面试中争取更好待遇
 */

import React, { useState, useEffect } from 'react';
import { 
  DocumentTextIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  LightBulbIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PlayIcon,
  BookOpenIcon,
  UserIcon,
  CurrencyDollarIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  TrophyIcon,
  PresentationChartLineIcon,
  HeartIcon,
  StarIcon,
  FireIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
  ChatBubbleOvalLeftEllipsisIcon
} from '@heroicons/react/24/outline';
import { getIndustries } from '@/data/jobCategories';
// 简化组件 - 待实现完整功能

interface NegotiationScenario {
  id: string;
  title: string;
  description: string;
  situation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tips: string[];
  example_responses: string[];
  common_mistakes: string[];
}

interface NegotiationStrategy {
  id: string;
  title: string;
  description: string;
  when_to_use: string;
  steps: string[];
  example: string;
  success_rate: number;
}

interface MockInterview {
  id: string;
  question: string;
  context: string;
  good_answers: string[];
  bad_answers: string[];
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface InterviewAnalysis {
  profile: InterviewProfile;
  negotiationStyle: 'aggressive' | 'collaborative' | 'accommodating';
  strengths: string[];
  improvements: string[];
  recommendedStrategies: string[];
  practiceAreas: string[];
}

interface NegotiationPlan {
  id: string;
  title: string;
  targetSalary: number;
  minAcceptable: number;
  strategies: string[];
  timeline: string;
  createdAt: Date;
}

interface MarketData {
  industry: string;
  avgSalary: number;
  growthRate: number;
  demandLevel: 'low' | 'medium' | 'high';
  keySkills: string[];
}

interface NegotiationTemplate {
  id: string;
  title: string;
  category: 'salary' | 'benefits' | 'equity' | 'schedule' | 'career';
  situation: string;
  template: string;
  tips: string[];
}

interface InterviewProfile {
  name: string;
  targetPosition: string;
  industry: string;
  experienceLevel: string;
  currentSalary: string;
  targetSalary: string;
  negotiationExperience: 'none' | 'limited' | 'moderate' | 'extensive';
  communicationStyle: 'direct' | 'diplomatic' | 'analytical' | 'emotional';
  personalityType: 'assertive' | 'collaborative' | 'analytical' | 'creative';
  keyStrengths: string[];
  weaknesses: string[];
  pastNegotiations: string[];
  specificConcerns: string[];
}

// 谈判规划视图
const PlannerView: React.FC<{
  plans: NegotiationPlan[];
  onCreatePlan: (title: string, targetSalary: number, minAcceptable: number, strategies: string[]) => void;
  analysis: InterviewAnalysis | null;
}> = ({ plans, onCreatePlan, analysis }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newPlan, setNewPlan] = useState({
    title: '',
    targetSalary: '',
    minAcceptable: '',
    strategies: [] as string[],
    timeline: '2-4周',
    notes: ''
  });

  const handleCreatePlan = () => {
    if (newPlan.title && newPlan.targetSalary && newPlan.minAcceptable) {
      onCreatePlan(
        newPlan.title,
        parseInt(newPlan.targetSalary),
        parseInt(newPlan.minAcceptable),
        newPlan.strategies
      );
      setNewPlan({ title: '', targetSalary: '', minAcceptable: '', strategies: [], timeline: '2-4周', notes: '' });
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">我的谈判计划</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          新建计划
        </button>
      </div>

      {isCreating && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">创建新的谈判计划</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="计划标题"
              value={newPlan.title}
              onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="目标薪资"
                value={newPlan.targetSalary}
                onChange={(e) => setNewPlan({ ...newPlan, targetSalary: e.target.value })}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
              <input
                type="number"
                placeholder="最低可接受"
                value={newPlan.minAcceptable}
                onChange={(e) => setNewPlan({ ...newPlan, minAcceptable: e.target.value })}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">选择谈判策略</label>
              <div className="grid grid-cols-2 gap-2">
                {['锐定效应', '价值展示', '整体薪酬包', '时机把握', '替代选择'].map((strategy) => (
                  <label key={strategy} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newPlan.strategies.includes(strategy)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewPlan({ ...newPlan, strategies: [...newPlan.strategies, strategy] });
                        } else {
                          setNewPlan({ ...newPlan, strategies: newPlan.strategies.filter(s => s !== strategy) });
                        }
                      }}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-900">{strategy}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleCreatePlan}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                创建
              </button>
              <button
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 策略推荐 */}
      {analysis && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <LightBulbIcon className="w-5 h-5 text-blue-500 mr-2" />
            基于AI分析的谈判策略推荐
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.recommendedStrategies.map((strategy, index) => (
              <div key={index} className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <p className="text-sm font-medium text-blue-700">{strategy}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{plan.title}</h3>
              <div className="flex space-x-2">
                <button className="text-blue-500 hover:text-blue-700 text-sm">
                  编辑
                </button>
                <button className="text-red-500 hover:text-red-700 text-sm">
                  删除
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-gray-900">目标薪资</span>
                <span className="font-semibold text-green-600">¥{plan.targetSalary.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="text-sm font-medium text-gray-900">最低可接受</span>
                <span className="font-semibold text-orange-600">¥{plan.minAcceptable.toLocaleString()}</span>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-900 mb-2">选定策略</div>
                <div className="flex flex-wrap gap-1">
                  {plan.strategies.map((strategy, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                      {strategy}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>预计时间: {plan.timeline}</span>
                <span>创建时间: {new Date(plan.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm">
                开始执行计划
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 话术模板视图
const TemplatesView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [favoriteTemplates, setFavoriteTemplates] = useState<string[]>([]);

  const templates: NegotiationTemplate[] = [
    {
      id: 'salary_discussion',
      title: '薪资讨论开场',
      category: 'salary',
      situation: '当HR询问薪资期望时',
      template: '根据我对这个职位的了解和市场调研，我期望的薪资范围是{MIN_SALARY}-{MAX_SALARY}。但我更关心这个机会能为我带来的成长和价值创造空间。',
      tips: ['事先做好市场调研', '表现出灵活性', '强调价值而非金钱']
    },
    {
      id: 'counter_offer',
      title: '薪资反驳话术',
      category: 'salary',
      situation: '当对方给出的薪资低于期望时',
      template: '我很感谢这个机会，不过这个薪资略低于我的期望。基于我的经验和能为团队带来的价值，我希望能在{TARGET_SALARY}左右。我们能否在这方面有所调整？',
      tips: ['保持礼貌和专业', '强调自己的价值', '给出合理理由']
    },
    {
      id: 'benefits_negotiation',
      title: '福利待遇谈判',
      category: 'benefits',
      situation: '当基础薪资无法调整时',
      template: '我理解薪资预算的限制。除了基础薪资，我们能否在其他方面有所补偿？比如年终奖金、弹性工作制或者培训机会？',
      tips: ['表现理解和灵活性', '提出多种可选方案', '强调双赢的结果']
    },
    {
      id: 'equity_discussion',
      title: '股权激励讨论',
      category: 'equity',
      situation: '在创业公司或成长期企业谈判股权',
      template: '我对公司的长期发展很有信心，希望能与公司共同成长。除了基础薪资，是否可以考虑一些股权激励或期权？这样我能更好地与公司利益绑定。',
      tips: ['强调长期承诺', '显示对公司的信心', '表达合作精神']
    },
    {
      id: 'schedule_flexibility',
      title: '工作时间灵活性',
      category: 'schedule',
      situation: '谈判弹性工作制或远程工作',
      template: '我非常重视工作与生活的平衡，这能让我保持更好的工作状态。是否可以讨论一些灵活的工作安排，比如每周一天远程工作或者灵活的上班时间？',
      tips: ['强调对工作效率的积极影响', '提出具体的建议', '表现出责任感']
    },
    {
      id: 'promotion_timeline',
      title: '升职时间表讨论',
      category: 'career',
      situation: '了解职业发展路径和升职机会',
      template: '我对这个职位的起点薪资能够理解，但我更关心长期的职业发展。能否了解一下这个职位的成长路径和预期的升职时间表？',
      tips: ['显示长期承诺', '关注职业发展', '表现出上进心']
    },
    {
      id: 'signing_bonus',
      title: '签约奖金谈判',
      category: 'salary',
      situation: '当需要补偿转工损失时',
      template: '转入贵公司对我来说意义重大，但我在现在公司将放弃一些既得利益，比如即将到手的奖金。是否可以考虑一些签约奖金来帮助这个过渡？',
      tips: ['说明具体的损失', '表现出加入的积极态度', '提出合理的解决方案']
    }
  ];

  const categories = [
    { id: 'all', label: '全部' },
    { id: 'salary', label: '薪资谈判' },
    { id: 'benefits', label: '福利待遇' },
    { id: 'equity', label: '股权激励' },
    { id: 'schedule', label: '工作时间' },
    { id: 'career', label: '职业发展' }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.situation.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = (templateId: string) => {
    setFavoriteTemplates(prev => 
      prev.includes(templateId)
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">谈判话术模板</h2>
        <div className="text-sm text-gray-600">
          共 {filteredTemplates.length} 个模板
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">搜索模板</label>
            <input
              type="text"
              placeholder="请输入关键词搜索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">类别筛选</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-gray-900 bg-white"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* 模板列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{template.title}</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleFavorite(template.id)}
                  className={`p-1 rounded ${
                    favoriteTemplates.includes(template.id)
                      ? 'text-red-500 hover:text-red-600'
                      : 'text-gray-400 hover:text-red-500'
                  }`}
                >
                  <HeartIcon className="w-4 h-4" />
                </button>
                <span className={`px-2 py-1 text-xs rounded ${
                  template.category === 'salary' ? 'bg-green-100 text-green-700' :
                  template.category === 'benefits' ? 'bg-blue-100 text-blue-700' :
                  template.category === 'equity' ? 'bg-purple-100 text-purple-700' :
                  template.category === 'schedule' ? 'bg-orange-100 text-orange-700' :
                  'bg-pink-100 text-pink-700'
                }`}>
                  {categories.find(c => c.id === template.category)?.label}
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <EyeIcon className="w-4 h-4 text-blue-500 mr-2" />
                  适用场景
                </h4>
                <p className="text-sm text-gray-600">{template.situation}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <ChatBubbleOvalLeftEllipsisIcon className="w-4 h-4 text-green-500 mr-2" />
                  话术模板
                </h4>
                <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border-l-4 border-blue-500">
                  <p className="text-sm text-gray-900 font-medium italic">"{template.template}"</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <LightBulbIcon className="w-4 h-4 text-yellow-500 mr-2" />
                  使用技巧
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {template.tips.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="pt-4 border-t border-gray-200 flex space-x-2">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  复制模板
                </button>
                <button className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors text-sm">
                  个性化定制
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <ChatBubbleOvalLeftEllipsisIcon className="w-16 h-16 mx-auto" />
          </div>
          <p className="text-gray-600">没有找到匹配的模板，请尝试调整搜索条件</p>
        </div>
      )}
    </div>
  );
};

// 市场数据视图
const MarketView: React.FC<{ marketData: MarketData[] }> = ({ marketData }) => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const filteredData = selectedIndustry === 'all' 
    ? marketData 
    : marketData.filter(data => data.industry === selectedIndustry);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">行业市场数据</h2>
        <div className="flex items-center space-x-4">
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-gray-900 bg-white"
          >
            <option value="all">所有行业</option>
            {marketData.map(data => (
              <option key={data.industry} value={data.industry}>{data.industry}</option>
            ))}
          </select>
          
          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-4 py-2 text-sm ${
                viewMode === 'cards'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              卡片视图
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 text-sm ${
                viewMode === 'table'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              表格视图
            </button>
          </div>
        </div>
      </div>

      {/* 总体统计 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">平均薪资</p>
              <p className="text-2xl font-bold text-blue-900">
                ¥{Math.round(filteredData.reduce((sum, d) => sum + d.avgSalary, 0) / filteredData.length).toLocaleString()}
              </p>
            </div>
            <CurrencyDollarIcon className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">平均增长率</p>
              <p className="text-2xl font-bold text-green-900">
                +{(filteredData.reduce((sum, d) => sum + d.growthRate, 0) / filteredData.length).toFixed(1)}%
              </p>
            </div>
            <ArrowTrendingUpIcon className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700">高需求行业</p>
              <p className="text-2xl font-bold text-orange-900">
                {filteredData.filter(d => d.demandLevel === 'high').length}
              </p>
            </div>
            <FireIcon className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">总行业数</p>
              <p className="text-2xl font-bold text-purple-900">{filteredData.length}</p>
            </div>
            <BuildingOfficeIcon className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((data) => (
            <div key={data.industry} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{data.industry}</h3>
                <span className={`px-2 py-1 text-xs rounded font-medium ${
                  data.demandLevel === 'high' ? 'bg-green-100 text-green-700' :
                  data.demandLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {data.demandLevel === 'high' ? '🔥 高需求' : 
                   data.demandLevel === 'medium' ? '⚡ 中需求' : '📉 低需求'}
                </span>
              </div>
              
              <div className="space-y-4">
                <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    ¥{data.avgSalary.toLocaleString()}
                  </div>
                  <div className="text-sm text-blue-700 font-medium">平均薪资</div>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">增长率</span>
                  <div className="flex items-center space-x-2">
                    <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
                    <span className="font-semibold text-green-600">+{data.growthRate}%</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <StarIcon className="w-4 h-4 text-yellow-500 mr-2" />
                    热门技能
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {data.keySkills.map((skill) => (
                      <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    行业
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    平均薪资
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    增长率
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    需求水平
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    热门技能
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((data) => (
                  <tr key={data.industry} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{data.industry}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-blue-600">¥{data.avgSalary.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm font-semibold text-green-600">+{data.growthRate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded font-medium ${
                        data.demandLevel === 'high' ? 'bg-green-100 text-green-700' :
                        data.demandLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {data.demandLevel === 'high' ? '高' : 
                         data.demandLevel === 'medium' ? '中' : '低'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {data.keySkills.slice(0, 3).map((skill) => (
                          <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {skill}
                          </span>
                        ))}
                        {data.keySkills.length > 3 && (
                          <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded">
                            +{data.keySkills.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export const InterviewNegotiationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'strategies' | 'scenarios' | 'mock' | 'planner' | 'templates' | 'market' | 'resources'>('dashboard');
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);
  const [mockInterviewProgress, setMockInterviewProgress] = useState(0);
  const [currentMockQuestion, setCurrentMockQuestion] = useState<MockInterview | null>(null);
  const [interviewProfile, setInterviewProfile] = useState<InterviewProfile>({
    name: '',
    targetPosition: '',
    industry: '',
    experienceLevel: '',
    currentSalary: '',
    targetSalary: '',
    negotiationExperience: 'none',
    communicationStyle: 'diplomatic',
    personalityType: 'collaborative',
    keyStrengths: [],
    weaknesses: [],
    pastNegotiations: [],
    specificConcerns: []
  });
  const [interviewAnalysis, setInterviewAnalysis] = useState<InterviewAnalysis | null>(null);
  const [negotiationPlans, setNegotiationPlans] = useState<NegotiationPlan[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [marketData, setMarketData] = useState<MarketData[]>([]);

  // 谈判策略数据
  const negotiationStrategies: NegotiationStrategy[] = [
    {
      id: 'anchoring',
      title: '锚定效应策略',
      description: '通过设定一个较高的初始期望值，影响后续谈判的基准点',
      when_to_use: '当你有充分的市场调研数据支持时，在薪酬讨论的开始阶段使用',
      steps: [
        '提前调研该职位的市场薪酬范围',
        '准备充分的数据支持你的期望薪酬',
        '在合适的时机提出略高于期望的数字',
        '解释这个数字的合理性和依据',
        '保持开放态度，愿意进行讨论'
      ],
      example: '"根据我对市场的调研，这个职位在北京的薪酬范围是25-35K，考虑到我的经验和技能，我期望的薪酬是32K左右。"',
      success_rate: 75
    },
    {
      id: 'value_demonstration',
      title: '价值展示策略',
      description: '通过具体的成果和贡献来证明你的价值，为更高薪酬提供依据',
      when_to_use: '当你有丰富的项目经验和可量化的成果时使用',
      steps: [
        '准备3-5个具体的成功案例',
        '量化你的贡献和影响',
        '将成果与业务价值联系起来',
        '展示你能为新公司带来的价值',
        '基于价值提出合理的薪酬期望'
      ],
      example: '"在上一家公司，我负责的项目为公司节省了200万成本，提升了30%的效率。我相信我能为贵公司带来类似的价值。"',
      success_rate: 82
    },
    {
      id: 'package_negotiation',
      title: '整体薪酬包策略',
      description: '不仅关注基础薪资，还要考虑奖金、股权、福利等整体薪酬包',
      when_to_use: '当基础薪资谈判空间有限时，可以从其他方面争取更好的待遇',
      steps: [
        '了解公司的完整薪酬结构',
        '评估各项福利的实际价值',
        '找出最有谈判空间的部分',
        '提出创造性的薪酬组合方案',
        '确保总价值符合你的期望'
      ],
      example: '"如果基础薪资暂时无法调整，我们可以考虑在年终奖金或股权激励方面有所倾斜吗？"',
      success_rate: 68
    },
    {
      id: 'timing_strategy',
      title: '时机把握策略',
      description: '选择合适的时机进行薪酬谈判，提高成功概率',
      when_to_use: '在整个面试流程中，需要准确把握谈判的最佳时机',
      steps: [
        '在初期面试中避免过早谈论薪酬',
        '等到公司表现出强烈兴趣后再谈',
        '收到offer后是最佳谈判时机',
        '给自己留出充分的考虑时间',
        '保持专业和礼貌的态度'
      ],
      example: '"我对这个职位很感兴趣，希望能先了解更多工作内容。关于薪酬，我们可以在后续详细讨论。"',
      success_rate: 71
    },
    {
      id: 'alternative_leverage',
      title: '替代选择策略',
      description: '通过展示你有其他选择来增强谈判筹码',
      when_to_use: '当你确实有其他offer或机会时，谨慎使用以增强谈判地位',
      steps: [
        '确保你确实有其他可行的选择',
        '不要虚张声势或编造信息',
        '以积极的方式提及其他机会',
        '强调你对当前机会的兴趣',
        '给公司合理的决策时间'
      ],
      example: '"我对贵公司的职位很感兴趣，同时也在考虑其他几个机会。希望我们能找到双方都满意的方案。"',
      success_rate: 79
    }
  ];

  // 谈判场景数据
  const negotiationScenarios: NegotiationScenario[] = [
    {
      id: 'first_job',
      title: '应届生首份工作',
      description: '作为应届毕业生，如何在缺乏经验的情况下进行薪酬谈判',
      situation: '你是一名刚毕业的计算机专业学生，收到了一家互联网公司的offer，但薪酬低于预期。',
      difficulty: 'beginner',
      tips: [
        '重点强调你的学习能力和潜力',
        '展示在校期间的项目经验和实习成果',
        '表现出对公司和行业的热情',
        '可以提及同学或朋友的薪酬水平作为参考',
        '保持谦逊但不要过分贬低自己'
      ],
      example_responses: [
        '"虽然我是应届生，但我在实习期间独立完成了用户量10万+的项目，我相信我能快速为团队创造价值。"',
        '"我对贵公司的技术栈很感兴趣，也做了充分的学习准备。根据我了解的市场情况，这个岗位的起薪一般在12-15K。"',
        '"我希望能有一个与我能力和市场水平相匹配的起薪，这样我能更专注地投入工作。"'
      ],
      common_mistakes: [
        '过分强调自己是新手，缺乏自信',
        '没有做市场调研就提出薪酬要求',
        '只关注薪资，忽略了成长机会',
        '态度过于强硬或者过于被动'
      ]
    },
    {
      id: 'job_hopping',
      title: '跳槽涨薪谈判',
      description: '在跳槽过程中，如何基于现有薪酬争取更好的待遇',
      situation: '你有3年工作经验，当前月薪20K，希望通过跳槽实现薪酬的显著提升。',
      difficulty: 'intermediate',
      tips: [
        '明确说明跳槽的动机和期望',
        '展示你在当前公司的成长和成就',
        '合理设定薪酬涨幅期望（通常20-30%）',
        '准备解释为什么值得这个涨幅',
        '考虑整体职业发展，不只是薪酬'
      ],
      example_responses: [
        '"在现在的公司我学到了很多，月薪也从15K涨到了20K。我希望这次跳槽能有25-30%的涨幅。"',
        '"我之所以考虑新机会，主要是希望在更大的平台上发挥价值，同时获得与市场水平相匹配的薪酬。"',
        '"基于我的经验和能力，以及对这个职位的了解，我期望的薪酬范围是25-28K。"'
      ],
      common_mistakes: [
        '期望涨幅过高，超出合理范围',
        '只强调想要涨薪，没有展示价值',
        '对现公司过度抱怨',
        '没有考虑其他福利和发展机会'
      ]
    },
    {
      id: 'senior_position',
      title: '高级职位谈判',
      description: '申请管理或高级技术岗位时的薪酬谈判策略',
      situation: '你有8年经验，申请技术总监职位，需要谈判包括股权在内的整体薪酬包。',
      difficulty: 'advanced',
      tips: [
        '重点展示领导力和战略思维',
        '准备详细的工作规划和目标',
        '讨论整体薪酬包，不只是基础薪资',
        '展示你对公司业务的深度理解',
        '表现出长期合作的意愿'
      ],
      example_responses: [
        '"作为技术总监，我会关注技术架构的长期规划。基于这个职位的责任和市场水平，我期望的年薪在80-100万。"',
        '"我希望薪酬结构能体现长期激励，比如股权或期权，这样我能更好地与公司利益绑定。"',
        '"我带过30人的技术团队，帮助公司实现了3倍的业务增长。我相信我能为贵公司带来类似的价值。"'
      ],
      common_mistakes: [
        '过分关注短期收益，忽略长期价值',
        '没有展示足够的战略思维',
        '对股权等复杂薪酬结构了解不足',
        '缺乏对公司业务的深入理解'
      ]
    }
  ];

  // 模拟面试问题
  const mockInterviews: MockInterview[] = [
    {
      id: 'salary_expectation',
      question: '你的薪资期望是多少？',
      context: '这是面试中最常见的问题，需要既不过高也不过低地回答',
      difficulty: 'medium',
      good_answers: [
        '根据我对这个职位和市场的了解，我期望的薪资范围是X-Y，但我更关心这个机会的发展前景。',
        '我希望薪资能够反映我的能力和经验。基于我的调研，这个职位的市场范围是X-Y。',
        '薪资对我很重要，但我更看重工作内容和团队。我们可以根据具体的工作要求来讨论合适的薪资。'
      ],
      bad_answers: [
        '我没有特别的要求，你们看着给就行。',
        '我现在月薪X，你们至少要给我X+5K。',
        '钱不是最重要的，我主要是为了学习。'
      ],
      explanation: '好的回答显示了你做过市场调研，有合理的期望，同时保持灵活性。避免过于被动或过于强硬。'
    },
    {
      id: 'current_salary',
      question: '你目前的薪资是多少？',
      context: '这个问题可能会影响公司的offer，需要诚实但策略性地回答',
      difficulty: 'hard',
      good_answers: [
        '我目前的基础薪资是X，加上奖金和福利，总包大约是Y。我更关心这个新职位能提供的价值和发展机会。',
        '我目前的薪酬包括基本工资X和其他福利。我希望新的机会能在薪酬和职业发展上都有所提升。',
        '我可以分享我目前的薪酬信息，但我更希望基于这个职位的价值和我能带来的贡献来讨论薪资。'
      ],
      bad_answers: [
        '这是隐私，我不方便透露。',
        '我现在薪资很低，所以希望你们能给高一点。',
        '我现在拿X，但我觉得我值更多钱。'
      ],
      explanation: '诚实透明是最好的策略，同时要引导话题转向价值创造和职位本身的价值。'
    },
    {
      id: 'negotiation_response',
      question: '我们的预算有限，只能提供X薪资，你觉得如何？',
      context: '当公司的offer低于期望时，如何进行后续谈判',
      difficulty: 'hard',
      good_answers: [
        '我理解预算的限制。除了基础薪资，我们可以考虑其他形式的补偿吗？比如奖金、股权或福利？',
        '我很感兴趣这个机会。如果基础薪资暂时无法调整，我们能否在试用期后重新评估？',
        '我希望我们能找到双方都满意的方案。可以详细了解一下整体的薪酬包吗？'
      ],
      bad_answers: [
        '这太低了，我不能接受。',
        '好吧，那就这样吧。',
        '你们这样的大公司应该不差钱吧？'
      ],
      explanation: '保持积极态度，寻找创造性的解决方案，避免直接拒绝或立即妥协。'
    }
  ];

  const tabs = [
    { id: 'dashboard', label: '个人中心', icon: UserIcon },
    { id: 'strategies', label: '谈判策略', icon: LightBulbIcon },
    { id: 'scenarios', label: '场景指导', icon: BookOpenIcon },
    { id: 'mock', label: '模拟练习', icon: ChatBubbleLeftRightIcon },
    { id: 'planner', label: '谈判规划', icon: PresentationChartLineIcon },
    { id: 'templates', label: '话术模板', icon: ChatBubbleOvalLeftEllipsisIcon },
    { id: 'market', label: '市场数据', icon: ArrowTrendingUpIcon },
    { id: 'resources', label: '学习资源', icon: AcademicCapIcon }
  ];

  const startMockInterview = () => {
    setCurrentMockQuestion(mockInterviews[0]);
    setMockInterviewProgress(0);
  };

  const nextMockQuestion = () => {
    const nextIndex = mockInterviewProgress + 1;
    if (nextIndex < mockInterviews.length) {
      setCurrentMockQuestion(mockInterviews[nextIndex]);
      setMockInterviewProgress(nextIndex);
    } else {
      setCurrentMockQuestion(null);
      setMockInterviewProgress(0);
    }
  };

  // AI面试技巧分析
  const analyzeInterviewProfile = async () => {
    if (!interviewProfile.targetPosition || !interviewProfile.industry || !interviewProfile.experienceLevel) {
      alert('请先完善个人信息');
      return;
    }

    setIsAnalyzing(true);
    try {
      // 使用AI分析面试谈判风格和建议
      const analysis: InterviewAnalysis = {
        profile: interviewProfile,
        negotiationStyle: determineNegotiationStyle(interviewProfile),
        strengths: generateStrengths(interviewProfile),
        improvements: generateImprovements(interviewProfile),
        recommendedStrategies: getRecommendedStrategies(interviewProfile),
        practiceAreas: getPracticeAreas(interviewProfile)
      };

      setInterviewAnalysis(analysis);
    } catch (error) {
      console.error('面试分析失败:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 确定谈判风格
  const determineNegotiationStyle = (profile: InterviewProfile): 'aggressive' | 'collaborative' | 'accommodating' => {
    if (profile.personalityType === 'assertive' && profile.communicationStyle === 'direct') {
      return 'aggressive';
    }
    if (profile.personalityType === 'collaborative' || profile.communicationStyle === 'diplomatic') {
      return 'collaborative';
    }
    return 'accommodating';
  };

  // 生成个人优势
  const generateStrengths = (profile: InterviewProfile): string[] => {
    const strengths = [...profile.keyStrengths];
    
    if (profile.negotiationExperience === 'extensive') {
      strengths.push('丰富的谈判经验');
    }
    if (profile.communicationStyle === 'analytical') {
      strengths.push('逻辑思维强，善于用数据说话');
    }
    if (profile.personalityType === 'collaborative') {
      strengths.push('善于建立合作关系');
    }
    
    return strengths.length > 0 ? strengths : ['积极的学习态度', '专业知识储备'];
  };

  // 生成改进建议
  const generateImprovements = (profile: InterviewProfile): string[] => {
    const improvements = [];
    
    if (profile.negotiationExperience === 'none' || profile.negotiationExperience === 'limited') {
      improvements.push('增加谈判实战练习');
    }
    if (profile.weaknesses.length > 0) {
      improvements.push(...profile.weaknesses.map(w => `改善${w}`));
    }
    if (profile.specificConcerns.length > 0) {
      improvements.push('针对性地解决担忧问题');
    }
    
    return improvements.length > 0 ? improvements : ['提升沟通表达能力', '增强自信心'];
  };

  // 获取推荐策略
  const getRecommendedStrategies = (profile: InterviewProfile): string[] => {
    const strategies = [];
    
    if (profile.communicationStyle === 'analytical') {
      strategies.push('数据驱动型谈判');
    }
    if (profile.personalityType === 'collaborative') {
      strategies.push('双赢合作策略');
    }
    if (profile.negotiationExperience === 'extensive') {
      strategies.push('高级谈判技巧');
    }
    
    return strategies.length > 0 ? strategies : ['基础谈判原则', '积极倾听技巧'];
  };

  // 获取练习领域
  const getPracticeAreas = (profile: InterviewProfile): string[] => {
    const areas = [];
    
    if (profile.specificConcerns.includes('薪资谈判')) {
      areas.push('薪资协商技巧');
    }
    if (profile.specificConcerns.includes('福利待遇')) {
      areas.push('福利包装谈判');
    }
    if (profile.communicationStyle === 'emotional') {
      areas.push('情绪管理训练');
    }
    
    return areas.length > 0 ? areas : ['基础面试技巧', '自我介绍优化'];
  };

  // 创建谈判计划
  const createNegotiationPlan = (title: string, targetSalary: number, minAcceptable: number, strategies: string[]) => {
    const newPlan: NegotiationPlan = {
      id: Date.now().toString(),
      title,
      targetSalary,
      minAcceptable,
      strategies,
      timeline: '2-4周',
      createdAt: new Date()
    };
    setNegotiationPlans([...negotiationPlans, newPlan]);
  };

  // 加载市场数据
  useEffect(() => {
    const mockMarketData: MarketData[] = [
      {
        industry: '互联网/科技',
        avgSalary: 28000,
        growthRate: 15.5,
        demandLevel: 'high',
        keySkills: ['JavaScript', 'React', 'Python', 'AI/ML', '云计算', '微服务']
      },
      {
        industry: '金融服务',
        avgSalary: 32000,
        growthRate: 8.2,
        demandLevel: 'medium',
        keySkills: ['风险管理', '数据分析', 'SQL', 'Excel', '金融建模', '合规管理']
      },
      {
        industry: '教育培训',
        avgSalary: 18000,
        growthRate: 12.3,
        demandLevel: 'medium',
        keySkills: ['教学设计', '课程开发', '沟通技巧', '心理学', '在线教育', '数字化教学']
      },
      {
        industry: '电子商务',
        avgSalary: 25000,
        growthRate: 18.7,
        demandLevel: 'high',
        keySkills: ['运营管理', '数据分析', '产品运营', '用户增长', 'SEM/SEO', '社交媒体']
      },
      {
        industry: '医疗健康',
        avgSalary: 22000,
        growthRate: 10.1,
        demandLevel: 'medium',
        keySkills: ['临床经验', '医学知识', '数字化医疗', '数据分析', '项目管理', '法规合规']
      },
      {
        industry: '房地产',
        avgSalary: 19000,
        growthRate: 5.8,
        demandLevel: 'low',
        keySkills: ['市场分析', '销售技巧', '客户关系', '投资分析', '项目管理', '法律知识']
      },
      {
        industry: '制造业',
        avgSalary: 21000,
        growthRate: 7.3,
        demandLevel: 'medium',
        keySkills: ['工艺设计', '质量管理', '精益生产', '供应链管理', '智能制造', '数字化转型']
      },
      {
        industry: '文娱传媒',
        avgSalary: 16000,
        growthRate: 14.2,
        demandLevel: 'medium',
        keySkills: ['内容创作', '媒体运营', '品牌策划', '社交媒体', '视频制作', '创意设计']
      }
    ];
    setMarketData(mockMarketData);
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <div className="container max-w-7xl py-12">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-3 bg-gradient-to-r from-red-100 to-pink-100 rounded-2xl">
            <DocumentTextIcon className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">面试薪酬谈判助手</h1>
            <p className="text-gray-600 mt-1">掌握谈判技巧，在面试中争取更好待遇</p>
          </div>
        </div>

        {/* 标签导航 */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-md font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-red-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 内容区域 */}
        {activeTab === 'dashboard' && (
          <DashboardView 
            profile={interviewProfile}
            setProfile={setInterviewProfile}
            analysis={interviewAnalysis}
            negotiationPlans={negotiationPlans}
            onAnalyze={analyzeInterviewProfile}
            isAnalyzing={isAnalyzing}
          />
        )}
        
        {activeTab === 'strategies' && (
          <StrategiesView 
            strategies={negotiationStrategies}
            selectedStrategy={selectedStrategy}
            onSelectStrategy={setSelectedStrategy}
          />
        )}
        
        {activeTab === 'scenarios' && (
          <ScenariosView scenarios={negotiationScenarios} />
        )}
        
        {activeTab === 'mock' && (
          <MockInterviewView 
            questions={mockInterviews}
            currentQuestion={currentMockQuestion}
            progress={mockInterviewProgress}
            onStart={startMockInterview}
            onNext={nextMockQuestion}
          />
        )}

        {activeTab === 'planner' && (
          <PlannerView 
            plans={negotiationPlans}
            onCreatePlan={createNegotiationPlan}
            analysis={interviewAnalysis}
          />
        )}

        {activeTab === 'templates' && (
          <TemplatesView />
        )}

        {activeTab === 'market' && (
          <MarketView marketData={marketData} />
        )}
        
        {activeTab === 'resources' && (
          <ResourcesView />
        )}
      </div>
    </div>
  );
};

// 谈判策略视图
const StrategiesView: React.FC<{
  strategies: NegotiationStrategy[];
  selectedStrategy: string | null;
  onSelectStrategy: (id: string | null) => void;
}> = ({ strategies, selectedStrategy, onSelectStrategy }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {strategies.map((strategy) => (
          <div
            key={strategy.id}
            className={`border-2 rounded-2xl p-6 cursor-pointer transition-all ${
              selectedStrategy === strategy.id
                ? 'border-red-500 bg-red-50'
                : 'border-gray-200 hover:border-red-300 bg-white'
            }`}
            onClick={() => onSelectStrategy(selectedStrategy === strategy.id ? null : strategy.id)}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-gray-900">{strategy.title}</h3>
                <div className="text-right">
                  <div className="text-sm font-medium text-green-600">{strategy.success_rate}%</div>
                  <div className="text-xs text-gray-600">成功率</div>
                </div>
              </div>

              <p className="text-sm text-gray-600">{strategy.description}</p>

              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-900">适用场景</div>
                <p className="text-xs text-gray-600">{strategy.when_to_use}</p>
              </div>

              {selectedStrategy === strategy.id && (
                <div className="pt-4 border-t border-red-200 space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">实施步骤</h4>
                    <ol className="text-sm space-y-1">
                      {strategy.steps.map((step, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="flex items-center justify-center w-5 h-5 bg-red-100 text-red-600 text-xs rounded-full font-semibold flex-shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          <span className="text-gray-600">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">示例表达</h4>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-900 italic">"{strategy.example}"</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 场景指导视图
const ScenariosView: React.FC<{ scenarios: NegotiationScenario[] }> = ({ scenarios }) => {
  return (
    <div className="space-y-8">
      {scenarios.map((scenario) => (
        <div key={scenario.id} className="bg-white border border-gray-200 rounded-2xl p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{scenario.title}</h3>
              <p className="text-gray-600">{scenario.description}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              scenario.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
              scenario.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {scenario.difficulty === 'beginner' ? '初级' :
               scenario.difficulty === 'intermediate' ? '中级' : '高级'}
            </div>
          </div>

          <div className="space-y-6">
            {/* 场景描述 */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">场景设定</h4>
              <p className="text-gray-900">{scenario.situation}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 谈判技巧 */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <LightBulbIcon className="w-5 h-5 text-yellow-500 mr-2" />
                  谈判技巧
                </h4>
                <ul className="space-y-2">
                  {scenario.tips.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 常见错误 */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-2" />
                  常见错误
                </h4>
                <ul className="space-y-2">
                  {scenario.common_mistakes.map((mistake, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <ExclamationTriangleIcon className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">{mistake}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 示例回答 */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">推荐表达方式</h4>
              <div className="space-y-3">
                {scenario.example_responses.map((response, index) => (
                  <div key={index} className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                    <p className="text-gray-900 italic">"{response}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// 模拟面试视图
const MockInterviewView: React.FC<{
  questions: MockInterview[];
  currentQuestion: MockInterview | null;
  progress: number;
  onStart: () => void;
  onNext: () => void;
}> = ({ questions, currentQuestion, progress, onStart, onNext }) => {
  if (!currentQuestion) {
    return (
      <div className="text-center py-20">
        <div className="space-y-6">
          <div className="flex items-center justify-center">
            <div className="p-4 bg-red-100 rounded-2xl">
              <PlayIcon className="w-12 h-12 text-red-600" />
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">薪酬谈判模拟面试</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              通过模拟真实的面试场景，练习你的薪酬谈判技巧
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-md mx-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">题目数量</span>
                <span className="font-semibold text-gray-900">{questions.length} 道</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">预计用时</span>
                <span className="font-semibold text-gray-900">15-20 分钟</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">难度等级</span>
                <span className="font-semibold text-gray-900">初级 → 高级</span>
              </div>
            </div>
          </div>

          <button
            onClick={onStart}
            className="px-8 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
          >
            开始模拟面试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* 进度条 */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">进度</span>
          <span className="text-gray-900">{progress + 1} / {questions.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-red-600 h-2 rounded-full transition-all duration-500" 
            style={{ width: `${((progress + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* 当前问题 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8">
        <div className="space-y-6">
          {/* 问题头部 */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{currentQuestion.question}</h3>
              <p className="text-gray-600">{currentQuestion.context}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
              currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {currentQuestion.difficulty === 'easy' ? '简单' :
               currentQuestion.difficulty === 'medium' ? '中等' : '困难'}
            </div>
          </div>

          {/* 好的回答示例 */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 flex items-center">
              <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
              推荐回答
            </h4>
            <div className="space-y-3">
              {currentQuestion.good_answers.map((answer, index) => (
                <div key={index} className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <p className="text-gray-900">{answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 不好的回答示例 */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 flex items-center">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-2" />
              避免这样回答
            </h4>
            <div className="space-y-3">
              {currentQuestion.bad_answers.map((answer, index) => (
                <div key={index} className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                  <p className="text-gray-900">{answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 解释说明 */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">解释说明</h4>
            <p className="text-gray-900">{currentQuestion.explanation}</p>
          </div>

          {/* 下一题按钮 */}
          <div className="flex justify-end">
            <button
              onClick={onNext}
              className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              {progress + 1 < questions.length ? '下一题' : '完成练习'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 资源工具视图
const ResourcesView: React.FC = () => {
  const resources = [
    {
      category: '薪酬调研工具',
      items: [
        { name: '拉勾薪酬报告', description: '互联网行业薪酬数据', url: '#' },
        { name: 'BOSS直聘薪酬指数', description: '各行业薪酬趋势', url: '#' },
        { name: '猎聘薪酬白皮书', description: '中高端人才薪酬报告', url: '#' }
      ]
    },
    {
      category: '谈判技巧书籍',
      items: [
        { name: '《谈判力》', description: '哈佛谈判项目经典教材', url: '#' },
        { name: '《关键对话》', description: '如何进行高效沟通', url: '#' },
        { name: '《影响力》', description: '说服他人的心理学原理', url: '#' }
      ]
    },
    {
      category: '面试准备',
      items: [
        { name: '薪酬谈判话术模板', description: '常用谈判表达方式', url: '#' },
        { name: '面试问题清单', description: '薪酬相关面试问题汇总', url: '#' },
        { name: 'Offer评估表', description: '全面评估工作机会', url: '#' }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {resources.map((category) => (
        <div key={category.category} className="bg-white border border-gray-200 rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">{category.category}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {category.items.map((item) => (
              <div key={item.name} className="p-4 border border-gray-200 rounded-lg hover:border-red-200 hover:shadow-md transition-all">
                <h4 className="font-medium text-gray-900 mb-2">{item.name}</h4>
                <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                <button className="text-red-600 hover:text-red-700 font-medium text-sm">
                  查看详情 →
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* 实用小贴士 */}
      <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <LightBulbIcon className="w-6 h-6 text-red-600 mr-2" />
          薪酬谈判实用小贴士
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">谈判前准备</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• 充分调研目标职位的市场薪酬范围</li>
              <li>• 准备3-5个具体的成功案例</li>
              <li>• 了解公司的薪酬结构和福利政策</li>
              <li>• 设定合理的薪酬期望范围</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">谈判中注意</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• 保持积极和专业的态度</li>
              <li>• 重点强调你能创造的价值</li>
              <li>• 考虑整体薪酬包，不只是基础薪资</li>
              <li>• 给自己和公司留出考虑时间</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// 个人中心视图
const DashboardView: React.FC<{
  profile: InterviewProfile;
  setProfile: (profile: InterviewProfile) => void;
  analysis: InterviewAnalysis | null;
  negotiationPlans: NegotiationPlan[];
  onAnalyze: () => void;
  isAnalyzing: boolean;
}> = ({ profile, setProfile, analysis, negotiationPlans, onAnalyze, isAnalyzing }) => {
  
  const handleStrengthAdd = (strength: string) => {
    if (strength.trim() && !profile.keyStrengths.includes(strength.trim())) {
      setProfile({ ...profile, keyStrengths: [...profile.keyStrengths, strength.trim()] });
    }
  };

  const handleStrengthRemove = (strengthToRemove: string) => {
    setProfile({ ...profile, keyStrengths: profile.keyStrengths.filter(s => s !== strengthToRemove) });
  };

  const handleWeaknessAdd = (weakness: string) => {
    if (weakness.trim() && !profile.weaknesses.includes(weakness.trim())) {
      setProfile({ ...profile, weaknesses: [...profile.weaknesses, weakness.trim()] });
    }
  };

  const handleWeaknessRemove = (weaknessToRemove: string) => {
    setProfile({ ...profile, weaknesses: profile.weaknesses.filter(w => w !== weaknessToRemove) });
  };

  const handleConcernAdd = (concern: string) => {
    if (concern.trim() && !profile.specificConcerns.includes(concern.trim())) {
      setProfile({ ...profile, specificConcerns: [...profile.specificConcerns, concern.trim()] });
    }
  };

  const handleConcernRemove = (concernToRemove: string) => {
    setProfile({ ...profile, specificConcerns: profile.specificConcerns.filter(c => c !== concernToRemove) });
  };

  const handleNegotiationAdd = (negotiation: string) => {
    if (negotiation.trim() && !profile.pastNegotiations.includes(negotiation.trim())) {
      setProfile({ ...profile, pastNegotiations: [...profile.pastNegotiations, negotiation.trim()] });
    }
  };

  const handleNegotiationRemove = (negotiationToRemove: string) => {
    setProfile({ ...profile, pastNegotiations: profile.pastNegotiations.filter(n => n !== negotiationToRemove) });
  };

  return (
    <div className="space-y-8">
      {/* 个人信息概览 */}
      <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">面试谈判个人档案</h2>
            <p className="text-gray-600 mt-1">完善你的面试信息，获得AI个性化谈判指导</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{profile.keyStrengths.length}</div>
              <div className="text-xs text-gray-600">个人优势</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{profile.pastNegotiations.length}</div>
              <div className="text-xs text-gray-600">谈判经历</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{negotiationPlans.length}</div>
              <div className="text-xs text-gray-600">谈判计划</div>
            </div>
          </div>
        </div>

        {/* 基础信息表单 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <UserIcon className="w-5 h-5 text-red-600 mr-2" />
              基础信息
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">姓名</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white text-gray-900 placeholder-gray-500"
                  placeholder="请输入姓名"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">目标职位</label>
                <input
                  type="text"
                  value={profile.targetPosition}
                  onChange={(e) => setProfile({ ...profile, targetPosition: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white text-gray-900 placeholder-gray-500"
                  placeholder="如：高级前端工程师"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">所在行业</label>
                <select
                  value={profile.industry}
                  onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white text-gray-900"
                >
                  <option value="">请选择行业</option>
                  {getIndustries().map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">工作经验</label>
                <select
                  value={profile.experienceLevel}
                  onChange={(e) => setProfile({ ...profile, experienceLevel: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white text-gray-900"
                >
                  <option value="">请选择经验</option>
                  <option value="应届生">应届生</option>
                  <option value="1-3年">1-3年</option>
                  <option value="3-5年">3-5年</option>
                  <option value="5-10年">5-10年</option>
                  <option value="10年以上">10年以上</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">当前薪酬(月)</label>
                <input
                  type="number"
                  value={profile.currentSalary}
                  onChange={(e) => setProfile({ ...profile, currentSalary: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white text-gray-900 placeholder-gray-500"
                  placeholder="如：25000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">目标薪酬(月)</label>
                <input
                  type="number"
                  value={profile.targetSalary}
                  onChange={(e) => setProfile({ ...profile, targetSalary: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white text-gray-900 placeholder-gray-500"
                  placeholder="如：30000"
                />
              </div>
            </div>

            {/* 谈判特征 */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">谈判特征</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">谈判经验</label>
                  <select
                    value={profile.negotiationExperience}
                    onChange={(e) => setProfile({ ...profile, negotiationExperience: e.target.value as any })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white text-gray-900"
                  >
                    <option value="none">没有经验</option>
                    <option value="limited">有限经验</option>
                    <option value="moderate">中等经验</option>
                    <option value="extensive">丰富经验</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">沟通风格</label>
                  <select
                    value={profile.communicationStyle}
                    onChange={(e) => setProfile({ ...profile, communicationStyle: e.target.value as any })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white text-gray-900"
                  >
                    <option value="direct">直接型</option>
                    <option value="diplomatic">外交型</option>
                    <option value="analytical">分析型</option>
                    <option value="emotional">情感型</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">个性类型</label>
                  <select
                    value={profile.personalityType}
                    onChange={(e) => setProfile({ ...profile, personalityType: e.target.value as any })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white text-gray-900"
                  >
                    <option value="assertive">积极主动型</option>
                    <option value="collaborative">合作型</option>
                    <option value="analytical">分析型</option>
                    <option value="creative">创意型</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <TrophyIcon className="w-5 h-5 text-red-600 mr-2" />
              个人特质分析
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">个人优势</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {profile.keyStrengths.map((strength) => (
                  <span
                    key={strength}
                    className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full"
                  >
                    {strength}
                    <button
                      onClick={() => handleStrengthRemove(strength)}
                      className="ml-2 text-green-500 hover:text-green-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="输入优势后按回车添加，如：逻辑思维强、表达能力好等"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white text-gray-900 placeholder-gray-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleStrengthAdd((e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">需要改进的方面</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {profile.weaknesses.map((weakness) => (
                  <span
                    key={weakness}
                    className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full"
                  >
                    {weakness}
                    <button
                      onClick={() => handleWeaknessRemove(weakness)}
                      className="ml-2 text-orange-500 hover:text-orange-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="输入弱项后按回车添加，如：容易紧张、过于谦虑等"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white text-gray-900 placeholder-gray-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleWeaknessAdd((e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
              />
          </div>
          
          <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">过往谈判经历</label>
              <div className="space-y-2 mb-3">
                {profile.pastNegotiations.map((negotiation, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm text-gray-900">{negotiation}</span>
          <button
                      onClick={() => handleNegotiationRemove(negotiation)}
                      className="text-blue-500 hover:text-blue-700"
          >
                      ×
          </button>
            </div>
          ))}
        </div>
                <input
                  type="text"
                placeholder="输入谈判经历后按回车添加"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white text-gray-900 placeholder-gray-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleNegotiationAdd((e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
                />
              </div>

              <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">特定担忧问题</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {profile.specificConcerns.map((concern) => (
                  <span
                    key={concern}
                    className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full"
                  >
                    {concern}
                    <button
                      onClick={() => handleConcernRemove(concern)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="输入担忧后按回车添加，如：薪资谈判、福利待遇等"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white text-gray-900 placeholder-gray-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleConcernAdd((e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* AI分析按钮 */}
        <div className="mt-8 pt-6 border-t border-red-200">
          <button
            onClick={onAnalyze}
            disabled={isAnalyzing || !profile.targetPosition || !profile.industry || !profile.experienceLevel}
            className="w-full bg-red-600 text-white py-4 px-8 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-3"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>AI分析中...</span>
              </>
            ) : (
              <>
                <SparklesIcon className="w-5 h-5" />
                <span>获取AI面试技巧分析</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI分析结果 */}
      {analysis && (
        <div className="bg-white border border-gray-200 rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <SparklesIcon className="w-6 h-6 text-red-600 mr-2" />
            AI面试技巧分析结果
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-xl font-bold text-blue-600 mb-1">
                {analysis.negotiationStyle === 'aggressive' ? '攻击型' : 
                 analysis.negotiationStyle === 'collaborative' ? '合作型' : '顺应型'}
              </div>
              <div className="text-sm text-gray-600">谈判风格</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-xl font-bold text-green-600 mb-1">
                {analysis.strengths.length}
              </div>
              <div className="text-sm text-gray-600">个人优势</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-xl font-bold text-orange-600 mb-1">
                {analysis.practiceAreas.length}
              </div>
              <div className="text-sm text-gray-600">练习领域</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 flex items-center">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                个人优势
              </h4>
              <div className="space-y-2">
                {analysis.strengths.map((strength, index) => (
                  <div key={index} className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                    <p className="text-sm text-gray-900">{strength}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 flex items-center">
                <LightBulbIcon className="w-5 h-5 text-orange-500 mr-2" />
                改进建议
              </h4>
              <div className="space-y-2">
                {analysis.improvements.map((improvement, index) => (
                  <div key={index} className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                    <p className="text-sm text-gray-900">{improvement}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <h4 className="font-medium text-gray-900 flex items-center">
              <StarIcon className="w-5 h-5 text-blue-500 mr-2" />
              推荐策略
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysis.recommendedStrategies.map((strategy, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                  {strategy}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
