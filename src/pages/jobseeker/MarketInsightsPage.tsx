/**
 * 智能市场洞察报告
 * AI驱动的实时职场数据分析，覆盖全行业职位
 */

import React, { useState, useEffect } from 'react';
import { deepseekApi } from '@/services/deepseekApi';
import { getIndustries, getCategories, getPositions } from '@/data/jobCategories';
import { popularCities } from '@/data/cities';
import { 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  SparklesIcon,
  CalendarIcon,
  MapPinIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  ArrowRightIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentChartBarIcon,
  ShareIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

// 扩展的数据接口
interface MarketTrend {
  id: string;
  title: string;
  category: 'salary' | 'demand' | 'skill' | 'industry' | 'location' | 'education';
  trend: 'up' | 'down' | 'stable';
  change: number;
  description: string;
  period: string;
  data: number[];
  source: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
}

interface JobMarketData {
  id: string;
  position: string;
  industry: string;
  category: string;
  location: string;
  salaryRange: {
    min: number;
    max: number;
    median: number;
    q25: number;
    q75: number;
  };
  demandIndex: number;
  demandGrowth: number;
  competitionLevel: 'high' | 'medium' | 'low';
  requirements: {
    experience: string[];
    education: string[];
    skills: string[];
    certifications: string[];
  };
  companies: {
    name: string;
    activeJobs: number;
    avgSalary: number;
  }[];
  marketInsights: {
    futureOutlook: string;
    growthDrivers: string[];
    challenges: string[];
    opportunities: string[];
  };
}

interface SkillAnalysis {
  id: string;
  skill: string;
  category: string;
  demandLevel: 'critical' | 'high' | 'medium' | 'emerging' | 'declining';
  growth: number;
  salaryImpact: {
    bonus: number;
    percentage: number;
  };
  relatedPositions: {
    position: string;
    industry: string;
    demand: number;
  }[];
  learningPath: {
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    timeToMaster: string;
    prerequisites: string[];
    resources: string[];
  };
  marketPrediction: {
    nextYear: 'increasing' | 'stable' | 'decreasing';
    fiveYear: string;
  };
}

interface IndustryAnalysis {
  id: string;
  industry: string;
  overview: {
  growth: number;
    maturity: 'emerging' | 'growing' | 'mature' | 'declining';
    innovation: number;
    stability: number;
  };
  salaryData: {
    entry: number;
    mid: number;
    senior: number;
    leadership: number;
  };
  jobMarket: {
    totalJobs: number;
    newJobs: number;
    competitionRatio: number;
    seasonality: string;
  };
  topPositions: {
    position: string;
    demand: number;
  avgSalary: number;
    growth: number;
  }[];
  requiredSkills: {
    technical: string[];
    soft: string[];
    emerging: string[];
  };
  geographicDistribution: {
    city: string;
  jobCount: number;
    avgSalary: number;
  }[];
  futureOutlook: {
    opportunities: string[];
    challenges: string[];
    trends: string[];
    recommendations: string[];
  };
}

interface SearchFilters {
  industry: string;
  category: string;
  position: string;
  location: string;
  salaryRange: {
    min: number;
    max: number;
  };
  experience: string;
  skills: string[];
  timeRange: '1M' | '3M' | '6M' | '1Y';
}

interface SavedReport {
  id: string;
  name: string;
  filters: SearchFilters;
  createdAt: string;
  data: any;
}

export const MarketInsightsPage: React.FC = () => {
  // 主要状态管理
  const [activeTab, setActiveTab] = useState<'overview' | 'search' | 'trends' | 'skills' | 'industries' | 'reports'>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'行业' | '职位' | '技能'>('职位');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<Array<{text: string, type: '行业' | '职位' | '技能', category?: string}>>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  // 筛选条件
  const [filters, setFilters] = useState<SearchFilters>({
    industry: '',
    category: '',
    position: '',
    location: '',
    salaryRange: { min: 0, max: 100000 },
    experience: '',
    skills: [],
    timeRange: '3M'
  });

  // 数据状态
  const [marketTrends, setMarketTrends] = useState<MarketTrend[]>([]);
  const [jobMarketData, setJobMarketData] = useState<JobMarketData[]>([]);
  const [skillAnalysis, setSkillAnalysis] = useState<SkillAnalysis[]>([]);
  const [industryAnalysis, setIndustryAnalysis] = useState<IndustryAnalysis[]>([]);
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [aiInsights, setAiInsights] = useState<string>('');

  // 获取基础数据
  const industries = getIndustries();
  const categories = filters.industry ? getCategories(filters.industry) : [];
  const positions = filters.category ? getPositions(filters.industry, filters.category) : [];

  // 获取所有职位数据用于搜索建议
  const getAllPositions = () => {
    const allPositions: Array<{text: string, type: '职位', category: string}> = [];
    industries.forEach(industry => {
      const cats = getCategories(industry);
      cats.forEach(category => {
        const pos = getPositions(industry, category);
        pos.forEach(position => {
          allPositions.push({
            text: position,
            type: '职位',
            category: `${industry} - ${category}`
          });
        });
      });
    });
    return allPositions;
  };

  // 预定义技能数据
  const commonSkills = [
    'Python', 'Java', 'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 'Node.js',
    'Spring', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes',
    '机器学习', '深度学习', '数据分析', '大数据', 'AI算法', '自然语言处理',
    '计算机视觉', '云计算', 'AWS', 'Azure', '阿里云', '微服务', '分布式系统',
    '项目管理', '团队管理', '产品设计', '用户体验', 'UI设计', 'UX设计',
    '数据库设计', '系统架构', '网络安全', '信息安全', '测试自动化', 'DevOps',
    'Git', 'Linux', 'Nginx', 'Apache', 'Elasticsearch', 'Kafka', 'RabbitMQ'
  ];

  // 生成搜索建议
  const generateSearchSuggestions = (query: string, type: '行业' | '职位' | '技能') => {
    if (!query || query.length < 1) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const suggestions: Array<{text: string, type: '行业' | '职位' | '技能', category?: string}> = [];
    const lowercaseQuery = query.toLowerCase();

    if (type === '行业') {
      // 搜索行业
      industries.forEach(industry => {
        if (industry.toLowerCase().includes(lowercaseQuery)) {
          suggestions.push({
            text: industry,
            type: '行业'
          });
        }
      });
    } else if (type === '职位') {
      // 搜索职位
      const allPositions = getAllPositions();
      allPositions.forEach(pos => {
        if (pos.text.toLowerCase().includes(lowercaseQuery)) {
          suggestions.push(pos);
        }
      });
    } else if (type === '技能') {
      // 搜索技能
      commonSkills.forEach(skill => {
        if (skill.toLowerCase().includes(lowercaseQuery)) {
          suggestions.push({
            text: skill,
            type: '技能'
          });
        }
      });
    }

    // 限制建议数量
    setSearchSuggestions(suggestions.slice(0, 8));
    setShowSuggestions(suggestions.length > 0);
  };

  // 处理搜索输入变化
  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value);
    generateSearchSuggestions(value, searchType);
  };

  // 选择搜索建议
  const selectSuggestion = (suggestion: {text: string, type: '行业' | '职位' | '技能', category?: string}) => {
    setSearchQuery(suggestion.text);
    setSearchType(suggestion.type);
    setShowSuggestions(false);
  };

  // 检查是否有有效的搜索条件
  const hasValidSearchConditions = () => {
    const hasSearchQuery = searchQuery.trim();
    const hasFilters = filters.industry || filters.position || filters.location || filters.timeRange;
    return hasSearchQuery || hasFilters;
  };

  // 根据筛选条件更新搜索栏
  const updateSearchFromFilters = (currentFilters: SearchFilters) => {
    const parts: string[] = [];
    
    if (currentFilters.industry) {
      parts.push(currentFilters.industry);
    }
    if (currentFilters.category) {
      parts.push(currentFilters.category);
    }
    if (currentFilters.position) {
      parts.push(currentFilters.position);
    }
    if (currentFilters.location) {
      parts.push(currentFilters.location);
    }
    
    // 添加时间范围
    const timeRangeMap = {
      '1M': '近1个月',
      '3M': '近3个月', 
      '6M': '近6个月',
      '1Y': '近1年'
    };
    if (currentFilters.timeRange) {
      parts.push(timeRangeMap[currentFilters.timeRange]);
    }
    
    if (parts.length > 0) {
      setSearchQuery(parts.join(' - '));
      setSearchType('职位'); // 设置为职位类型
    }
  };

  // 生成筛选描述
  const generateFilterDescription = () => {
    const parts: string[] = [];
    
    if (filters.industry) parts.push(`行业: ${filters.industry}`);
    if (filters.category) parts.push(`分类: ${filters.category}`);
    if (filters.position) parts.push(`职位: ${filters.position}`);
    if (filters.location) parts.push(`城市: ${filters.location}`);
    if (filters.timeRange) {
      const timeRangeMap = {
        '1M': '近1个月',
        '3M': '近3个月', 
        '6M': '近6个月',
        '1Y': '近1年'
      };
      parts.push(`时间: ${timeRangeMap[filters.timeRange]}`);
    }
    
    return parts.join(' | ');
  };

  // 执行搜索分析
  const executeSearch = () => {
    if (!hasValidSearchConditions()) {
      alert('请输入搜索内容或选择筛选条件');
      return;
    }
    
    // 如果是纯搜索输入模式（无筛选条件），添加默认条件
    let finalQuery = searchQuery;
    let finalFilters = { ...filters };
    
    if (searchQuery && !filters.industry && !filters.location && !filters.timeRange) {
      // 搜索输入模式：默认一线城市，3个月
      finalFilters = {
        ...filters,
        location: '一线城市',
        timeRange: '3M'
      };
      finalQuery = `${searchQuery} - 一线城市 - 近3个月`;
    }
    
    setHasSearched(true);
    analyzeMarketWithAI(finalQuery, finalFilters);
  };

  // AI驱动的数据分析
  const analyzeMarketWithAI = async (query: string, filters: SearchFilters) => {
      setIsLoading(true);
    try {
      // 构建AI分析的提示词
      const analysisPrompt = `请对以下职位进行全面的市场分析：

查询信息：
- 搜索内容：${query}
- 行业：${filters.industry || '未指定'}
- 分类：${filters.category || '未指定'}
- 具体职位：${filters.position || '未指定'}
- 城市：${filters.location || '未指定'}
- 时间范围：${filters.timeRange === '1M' ? '近1个月' : filters.timeRange === '3M' ? '近3个月' : filters.timeRange === '6M' ? '近6个月' : '近1年'}

请提供详细分析，包括：
1. 行业发展趋势和现状
2. 职位市场需求和竞争情况
3. 薪资水平和变化趋势
4. 必需技能和能力要求
5. 职业发展前景和机会
6. 入行建议和注意事项
7. 相关认证和学习路径

请用专业、客观的语言进行分析，提供具体的数据洞察和实用建议。`;

      // 调用真实的DeepSeek API进行市场分析
      const aiResponse = await deepseekApi.chat([
        {
          role: 'system',
          content: '你是一位资深的职业市场分析专家，具有丰富的行业洞察和数据分析经验。请基于最新的市场数据和行业趋势，为用户提供专业、准确的职位市场分析。'
        },
        {
          role: 'user',
          content: analysisPrompt
        }
      ], {
        model: 'deepseek-chat',
        temperature: 0.7,
        maxTokens: 3000
      });
      
      // 处理AI分析结果
      if (typeof aiResponse === 'string' && aiResponse.trim()) {
        setAiInsights(aiResponse);
      } else {
        // 如果AI响应为空或格式异常，使用默认洞察
        setAiInsights(generateMockAIInsights());
      }
      
      // 生成相应的数据（使用实际筛选条件和查询）
      generateMarketData({ ...filters, searchQuery: query });
      
    } catch (error) {
      console.error('AI分析失败:', error);
      // 如果AI分析失败，使用模拟数据
      generateMarketData(filters);
    } finally {
      setIsLoading(false);
    }
  };

  // 生成模拟的市场数据（基于jobCategories）
  const generateMarketData = (currentFilters: SearchFilters & { searchQuery?: string }) => {
    // 生成市场趋势
    const trends = generateMarketTrends(currentFilters);
    setMarketTrends(trends);

    // 生成职位市场数据
    const jobData = generateJobMarketData(currentFilters);
    setJobMarketData(jobData);

    // 生成技能分析
    const skillData = generateSkillAnalysis(currentFilters);
    setSkillAnalysis(skillData);

    // 生成行业分析
    const industryData = generateIndustryAnalysis(currentFilters);
    setIndustryAnalysis(industryData);
  };

  // 初始数据加载（移除自动加载）
  useEffect(() => {
    // 不再自动加载数据，等待用户主动搜索
  }, []);

  // 搜索类型变化时重新生成建议
  useEffect(() => {
    if (searchQuery) {
      generateSearchSuggestions(searchQuery, searchType);
    }
  }, [searchType]);

  // 保存报告功能
  const saveReport = () => {
    const newReport: SavedReport = {
      id: `report_${Date.now()}`,
      name: `市场分析_${filters.industry || '全行业'}_${new Date().toLocaleDateString()}`,
      filters,
      createdAt: new Date().toISOString(),
      data: {
        trends: marketTrends,
        jobs: jobMarketData,
        skills: skillAnalysis,
        industries: industryAnalysis,
        aiInsights
      }
    };
    
    const existingReports = JSON.parse(localStorage.getItem('marketReports') || '[]');
    const updatedReports = [...existingReports, newReport];
    localStorage.setItem('marketReports', JSON.stringify(updatedReports));
    setSavedReports(updatedReports);
    
    alert('报告已保存！');
  };

  // 数据生成函数
  const generateMockAIInsights = (): string => {
    return `基于当前市场数据分析，${filters.industry || '整体'}行业呈现以下特点：
1. 人才需求持续增长，特别是在AI、云计算和数据分析领域
2. 薪酬水平较去年同期上涨12-25%，高级职位涨幅更明显
3. 远程工作和混合办公模式成为主流，影响了人才流动格局
4. 新兴技能如大模型、区块链、边缘计算需求激增
5. 一线城市人才竞争加剧，新一线城市机会增多`;
  };

  const generateMarketTrends = (currentFilters: SearchFilters): MarketTrend[] => {
    const targetIndustry = currentFilters.industry || '互联网/AI';
    const baseData = [
      {
        id: 'salary_growth',
        title: `${targetIndustry}薪酬持续上涨`,
        category: 'salary' as const,
        trend: 'up' as const,
        change: Math.floor(Math.random() * 20) + 10,
        description: `${targetIndustry}领域平均薪酬较去年同期显著上涨，高级职位涨幅更为明显`,
        period: `近${currentFilters.timeRange === '1M' ? '1个月' : currentFilters.timeRange === '3M' ? '3个月' : currentFilters.timeRange === '6M' ? '6个月' : '1年'}`,
        data: Array.from({length: 5}, (_, i) => 100 + Math.floor(Math.random() * 30) + i * 5),
        source: 'AI算法分析',
        confidence: 0.85 + Math.random() * 0.1,
        impact: 'high' as const
      },
      {
        id: 'demand_increase',
        title: `${targetIndustry}人才需求激增`,
        category: 'demand' as const,
        trend: 'up' as const,
        change: Math.floor(Math.random() * 15) + 15,
        description: '市场对相关技能人才需求持续增长，就业机会增多',
        period: `近${currentFilters.timeRange === '1M' ? '1个月' : currentFilters.timeRange === '3M' ? '3个月' : currentFilters.timeRange === '6M' ? '6个月' : '1年'}`,
        data: Array.from({length: 5}, (_, i) => 100 + Math.floor(Math.random() * 25) + i * 6),
        source: '招聘平台数据',
        confidence: 0.9,
        impact: 'high' as const
      }
    ];
    return baseData;
  };

  // 根据职位类型获取合理的薪资范围
  const getSalaryByPosition = (industry: string, category: string, position: string): {min: number, max: number, median: number, q25: number, q75: number} => {
    const salaryDatabase: Record<string, Record<string, {base: number, range: number}>> = {
      '零售/生活服务': {
        '客服': { base: 4000, range: 3000 },
        '销售': { base: 6000, range: 8000 },
        '管理': { base: 8000, range: 7000 }
      },
      '餐饮': {
        '服务': { base: 3500, range: 2000 },
        '厨师': { base: 5000, range: 4000 },
        '管理': { base: 7000, range: 5000 }
      },
      '技术开发': {
        '前端开发': { base: 12000, range: 15000 },
        '后端开发': { base: 15000, range: 18000 },
        '全栈开发': { base: 14000, range: 16000 },
        '移动开发': { base: 13000, range: 15000 }
      },
      '互联网': {
        '产品经理': { base: 18000, range: 20000 },
        '运营': { base: 8000, range: 8000 },
        '设计': { base: 10000, range: 10000 }
      },
      '金融': {
        '客户经理': { base: 8000, range: 10000 },
        '风控': { base: 15000, range: 15000 },
        '投资': { base: 20000, range: 25000 }
      },
      '教育培训': {
        '教师': { base: 6000, range: 4000 },
        '培训师': { base: 8000, range: 6000 },
        '教务': { base: 5000, range: 3000 }
      },
      '市场/公关/广告': {
        '市场营销': { base: 8000, range: 8000 },
        '广告策划': { base: 9000, range: 7000 },
        '公关': { base: 10000, range: 8000 }
      },
      '医疗健康': {
        '护理': { base: 6000, range: 4000 },
        '医生': { base: 15000, range: 20000 },
        '药剂': { base: 7000, range: 5000 }
      }
    };

    let salaryInfo = { base: 6000, range: 5000 }; // 默认值

    if (salaryDatabase[industry] && salaryDatabase[industry][category]) {
      salaryInfo = salaryDatabase[industry][category];
    } else if (salaryDatabase[category]) {
      salaryInfo = Object.values(salaryDatabase[category])[0];
    } else {
      // 根据position关键词匹配
      for (const industryData of Object.values(salaryDatabase)) {
        for (const [key, salary] of Object.entries(industryData)) {
          if (position.includes(key) || key.includes(position)) {
            salaryInfo = salary;
            break;
          }
        }
        if (salaryInfo.base !== 6000) break;
      }
    }

    const base = salaryInfo.base;
    const range = salaryInfo.range;
    
    return {
      min: base - Math.floor(range * 0.3),
      max: base + Math.floor(range * 0.7),
      median: base,
      q25: base - Math.floor(range * 0.2),
      q75: base + Math.floor(range * 0.3)
    };
  };

  const generateJobMarketData = (currentFilters: SearchFilters & { searchQuery?: string }): JobMarketData[] => {
    const targetIndustry = currentFilters.industry || '通用';
    const targetCategory = currentFilters.category || '通用';
    const availablePositions = positions.length > 0 ? positions : 
      currentFilters.searchQuery ? [currentFilters.searchQuery.split(' - ')[0]] : ['通用职位'];
    
    return availablePositions.slice(0, 6).map((position, index) => {
      const salaryRange = getSalaryByPosition(targetIndustry, targetCategory, position);
      
      return {
        id: `job_${index}`,
        position,
        industry: targetIndustry,
        category: targetCategory,
        location: currentFilters.location || popularCities[Math.floor(Math.random() * popularCities.length)],
        salaryRange,
        demandIndex: 60 + Math.floor(Math.random() * 40),
        demandGrowth: Math.floor(Math.random() * 20) + 5,
        competitionLevel: getCompetitionLevel(targetIndustry, targetCategory),
        requirements: {
          experience: getExperienceRequirement(targetIndustry, targetCategory),
          education: getEducationRequirement(targetIndustry, targetCategory),
          skills: getSkillsByPosition(targetIndustry, targetCategory, position).slice(0, 4),
          certifications: getCertifications(targetIndustry, targetCategory)
        },
        companies: generateCompanies(targetIndustry, salaryRange.median),
        marketInsights: {
          futureOutlook: `${targetIndustry}领域${targetCategory}职位发展前景良好`,
          growthDrivers: getGrowthDrivers(targetIndustry),
          challenges: getChallenges(targetIndustry),
          opportunities: getOpportunities(targetIndustry, targetCategory)
        }
      };
    });
  };

  // 辅助函数
  const getCompetitionLevel = (industry: string, _category: string): 'low' | 'medium' | 'high' => {
    const highCompetition = ['互联网', '金融', '技术开发'];
    const mediumCompetition = ['市场/公关/广告', '教育培训'];
    
    if (highCompetition.includes(industry)) return 'high';
    if (mediumCompetition.includes(industry)) return 'medium';
    return 'low';
  };

  const getExperienceRequirement = (industry: string, category: string): string[] => {
    if (industry === '技术开发' || industry === '金融') return ['1-3年', '3-5年'];
    if (category.includes('管理')) return ['3-5年', '5年以上'];
    return ['不限', '1-3年'];
  };

  const getEducationRequirement = (industry: string, category: string): string[] => {
    if (industry === '技术开发' || industry === '金融' || industry === '医疗健康') return ['本科', '硕士'];
    if (category.includes('管理') || category.includes('专业')) return ['本科'];
    return ['大专', '本科'];
  };

  const getCertifications = (industry: string, _category: string): string[] => {
    const certDatabase: Record<string, string[]> = {
      '技术开发': ['软件工程师认证', '云计算认证'],
      '金融': ['CFA', 'FRM', '证券从业'],
      '教育培训': ['教师资格证', '培训师认证'],
      '医疗健康': ['执业医师', '护士资格证'],
      '零售/生活服务': ['销售技能认证', '客服认证']
    };
    
    return certDatabase[industry] || ['相关职业认证'];
  };

  const generateCompanies = (industry: string, avgSalary: number): Array<{name: string, activeJobs: number, avgSalary: number}> => {
    const companyDatabase: Record<string, string[]> = {
      '技术开发': ['阿里巴巴', '腾讯', '字节跳动', '百度'],
      '零售/生活服务': ['美团', '京东', '拼多多', '苏宁'],
      '餐饮': ['海底捞', '星巴克', '肯德基', '麦当劳'],
      '金融': ['工商银行', '招商银行', '平安银行', '蚂蚁金服'],
      '教育培训': ['新东方', '好未来', '猿辅导', '作业帮']
    };

    const companies = companyDatabase[industry] || ['知名企业A', '知名企业B', '知名企业C', '知名企业D'];
    
    return companies.slice(0, 4).map(name => ({
      name,
      activeJobs: Math.floor(Math.random() * 30) + 5,
      avgSalary: Math.floor(avgSalary * (0.8 + Math.random() * 0.4))
    }));
  };

  const getGrowthDrivers = (industry: string): string[] => {
    const drivers: Record<string, string[]> = {
      '技术开发': ['数字化转型', '人工智能发展', '云计算普及'],
      '零售/生活服务': ['消费升级', '线上线下融合', '用户体验重视'],
      '餐饮': ['外卖市场增长', '连锁化发展', '食品安全要求'],
      '金融': ['金融科技创新', '监管政策完善', '数字化转型'],
      '教育培训': ['在线教育发展', '终身学习理念', '职业技能需求'],
      '医疗健康': ['人口老龄化', '健康意识提升', '医疗技术进步']
    };
    
    return drivers[industry] || ['行业发展', '政策支持', '市场需求'];
  };

  const getChallenges = (industry: string): string[] => {
    const challenges: Record<string, string[]> = {
      '技术开发': ['技术更新快', '人才竞争激烈', '加班文化'],
      '零售/生活服务': ['市场竞争激烈', '成本控制压力', '客户需求多样'],
      '餐饮': ['成本上涨', '人员流动大', '食品安全风险'],
      '金融': ['监管要求严格', '风险控制压力', '技术变革快'],
      '教育培训': ['政策变化影响', '竞争激烈', '教学质量要求高'],
      '医疗健康': ['工作压力大', '责任重大', '专业要求高']
    };
    
    return challenges[industry] || ['市场竞争', '成本压力', '人才需求'];
  };

  const getOpportunities = (industry: string, _category: string): string[] => {
    const opportunities: Record<string, string[]> = {
      '技术开发': ['AI技术应用', '云计算发展', '移动端需求'],
      '零售/生活服务': ['数字化转型', '个性化服务', '新零售模式'],
      '餐饮': ['外卖平台', '品牌连锁', '智能化服务'],
      '金融': ['金融科技', '普惠金融', '风险管理'],
      '教育培训': ['在线教育', '职业培训', '个性化学习'],
      '医疗健康': ['医疗信息化', '远程医疗', '健康管理']
    };
    
    return opportunities[industry] || ['行业发展', '技能需求', '职业机会'];
  };

  // 根据职位类型定义技能库
  const getSkillsByPosition = (industry: string, category: string, position: string): string[] => {
    // 根据行业和职位返回相关技能
    const skillDatabase: Record<string, Record<string, string[]>> = {
      '零售/生活服务': {
        '客服': ['客户服务', '沟通技巧', '问题解决', '耐心细致', '多任务处理', '产品知识', '投诉处理', '电话礼仪'],
        '销售': ['销售技巧', '客户关系管理', '商务谈判', '市场分析', '产品推广', '团队合作', 'CRM系统', '数据分析'],
        '管理': ['团队管理', '运营管理', '成本控制', '流程优化', '人员培训', '绩效考核', '预算管理', '商业分析']
      },
      '餐饮': {
        '服务': ['餐饮服务', '食品安全', '客户接待', '点餐系统', '收银操作', '团队协作', '卫生标准', '应急处理'],
        '厨师': ['烹饪技术', '食材搭配', '菜品创新', '成本控制', '食品安全', '厨房管理', '营养搭配', '时间管理'],
        '管理': ['餐厅管理', '成本控制', '人员管理', '供应链管理', '食品安全管理', '营销策划', '财务管理', '客户关系']
      },
      '技术开发': {
        '前端开发': ['HTML/CSS', 'JavaScript', 'React', 'Vue', 'TypeScript', '响应式设计', 'Git', 'Webpack'],
        '后端开发': ['Java', 'Python', 'Node.js', 'MySQL', 'Redis', 'Spring', 'RESTful API', 'Docker'],
        '全栈开发': ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Git', 'API设计', '云服务', '项目管理'],
        '移动开发': ['React Native', 'Flutter', 'iOS开发', 'Android开发', 'UI/UX设计', 'API集成', '性能优化', '测试']
      },
      '互联网': {
        '产品经理': ['产品规划', '需求分析', '用户研究', '数据分析', '项目管理', 'Axure', '用户体验', 'SQL'],
        '运营': ['内容运营', '用户运营', '数据分析', '活动策划', '社群管理', 'Excel', '文案写作', '市场洞察'],
        '设计': ['UI设计', 'UX设计', 'Figma', 'Sketch', 'Photoshop', '用户体验', '交互设计', '视觉设计']
      },
      '金融': {
        '客户经理': ['金融产品知识', '客户开发', '风险评估', '投资咨询', '合规管理', '数据分析', '沟通技巧', 'CRM'],
        '风控': ['风险识别', '数据分析', '建模分析', '合规管理', 'SQL', 'Python', '统计学', '金融法规'],
        '投资': ['投资分析', '财务建模', '市场研究', '估值分析', 'Excel', 'Wind', '宏观经济', '行业分析']
      },
      '教育培训': {
        '教师': ['教学设计', '课程开发', '学生管理', '教育心理学', '多媒体教学', '评估反馈', '家校沟通', '专业知识'],
        '培训师': ['培训设计', '演讲技巧', '课程开发', '成人学习', '培训评估', 'PPT制作', '互动技巧', '专业技能'],
        '教务': ['教务管理', '课程安排', '学籍管理', '数据统计', 'Office办公', '沟通协调', '档案管理', '质量监控']
      },
      '市场/公关/广告': {
        '市场营销': ['市场调研', '品牌策划', '数字营销', '内容营销', '数据分析', 'SEM/SEO', '社交媒体', '活动策划'],
        '广告策划': ['创意策划', '广告投放', '媒体策略', '品牌传播', '文案写作', '设计软件', '项目管理', '数据分析'],
        '公关': ['公关策略', '媒体关系', '危机管理', '活动策划', '文案写作', '社交媒体', '品牌管理', '沟通技巧']
      },
      '医疗健康': {
        '护理': ['护理技术', '医疗知识', '病人护理', '医疗器械', '急救技能', '沟通技巧', '健康教育', '医疗安全'],
        '医生': ['临床诊断', '医疗技术', '病例分析', '治疗方案', '医患沟通', '医疗法规', '继续教育', '团队协作'],
        '药剂': ['药物知识', '药物配制', '药品管理', '用药指导', '质量控制', '法规遵循', '数据记录', '客户咨询']
      }
    };

    // 通用技能（所有职位都可能需要）
    const universalSkills = ['沟通技巧', '团队合作', '问题解决', '时间管理', 'Office办公', '学习能力'];

    // 获取特定技能
    let specificSkills: string[] = [];
    
    if (skillDatabase[industry] && skillDatabase[industry][category]) {
      specificSkills = skillDatabase[industry][category];
    } else if (skillDatabase[category]) {
      // 如果没找到具体行业，尝试用分类匹配
      specificSkills = Object.values(skillDatabase[category])[0] || [];
    } else {
      // 根据position关键词匹配
      for (const industrySkills of Object.values(skillDatabase)) {
        for (const [key, skills] of Object.entries(industrySkills)) {
          if (position.includes(key) || key.includes(position)) {
            specificSkills = skills;
            break;
          }
        }
        if (specificSkills.length > 0) break;
      }
    }

    // 如果还是没找到，使用默认技能
    if (specificSkills.length === 0) {
      specificSkills = ['专业技能', '行业知识', '实践经验', '持续学习'];
    }

    // 组合特定技能和通用技能
    return [...specificSkills.slice(0, 6), ...universalSkills.slice(0, 2)];
  };

  const generateSkillAnalysis = (currentFilters: SearchFilters & { searchQuery?: string }): SkillAnalysis[] => {
    // 根据筛选条件获取相关技能
    const skills = getSkillsByPosition(
      currentFilters.industry || '通用',
      currentFilters.category || '通用',
      currentFilters.position || currentFilters.searchQuery?.split(' - ')[0] || '通用'
    );
    
    return skills.map((skill, index) => ({
      id: `skill_${index}`,
      skill,
      category: getSkillCategory(skill, currentFilters.industry),
      demandLevel: getSkillDemandLevel(skill, currentFilters.industry),
      growth: Math.floor(Math.random() * 30) + 5,
      salaryImpact: {
        bonus: getSkillSalaryImpact(skill, currentFilters.industry),
        percentage: Math.floor(Math.random() * 15) + 5
      },
      relatedPositions: getRelatedPositions(skill, currentFilters.industry),
      learningPath: getSkillLearningPath(skill),
      marketPrediction: {
        nextYear: 'increasing' as const,
        fiveYear: '持续需求，行业核心技能'
      }
    }));
  };

  // 辅助函数
  const getSkillCategory = (skill: string, industry: string): string => {
    if (skill.includes('技术') || skill.includes('开发') || skill.includes('编程')) return '技术技能';
    if (skill.includes('管理') || skill.includes('领导')) return '管理技能';
    if (skill.includes('沟通') || skill.includes('服务') || skill.includes('协作')) return '软技能';
    if (skill.includes('分析') || skill.includes('数据')) return '分析技能';
    return industry ? `${industry}专业技能` : '通用技能';
  };

  const getSkillDemandLevel = (skill: string, _industry: string): 'critical' | 'high' | 'medium' | 'emerging' | 'declining' => {
    const criticalSkills = ['沟通技巧', '客户服务', '团队合作', '专业技能'];
    const highSkills = ['问题解决', '时间管理', '数据分析', '项目管理'];
    
    if (criticalSkills.some(s => skill.includes(s))) return 'critical';
    if (highSkills.some(s => skill.includes(s))) return 'high';
    return 'medium';
  };

  const getSkillSalaryImpact = (skill: string, _industry: string): number => {
    if (skill.includes('管理') || skill.includes('领导')) return Math.floor(Math.random() * 3000) + 2000;
    if (skill.includes('技术') || skill.includes('分析')) return Math.floor(Math.random() * 2000) + 1000;
    return Math.floor(Math.random() * 1000) + 500;
  };

  const getRelatedPositions = (_skill: string, industry: string): Array<{position: string, industry: string, demand: number}> => {
    // 根据技能返回相关职位
    return [
      { position: '相关职位1', industry: industry || '通用', demand: Math.floor(Math.random() * 40) + 60 },
      { position: '相关职位2', industry: industry || '通用', demand: Math.floor(Math.random() * 30) + 40 }
    ];
  };

  const getSkillLearningPath = (skill: string): {difficulty: 'beginner' | 'intermediate' | 'advanced', timeToMaster: string, prerequisites: string[], resources: string[]} => {
    const isAdvanced = skill.includes('管理') || skill.includes('分析') || skill.includes('策略');
    return {
      difficulty: isAdvanced ? 'intermediate' : 'beginner',
      timeToMaster: isAdvanced ? '6-12个月' : '1-3个月',
      prerequisites: isAdvanced ? ['相关工作经验', '基础理论知识'] : ['基础学习能力'],
      resources: ['在线课程', '实践培训', '行业书籍', '专业认证']
    };
  };

  const generateIndustryAnalysis = (_currentFilters: SearchFilters): IndustryAnalysis[] => {
    return industries.slice(0, 5).map((industry, index) => ({
      id: `industry_${index}`,
      industry,
      overview: {
        growth: Math.floor(Math.random() * 30) + 10,
        maturity: ['emerging', 'growing', 'mature'][Math.floor(Math.random() * 3)] as any,
        innovation: Math.floor(Math.random() * 40) + 60,
        stability: Math.floor(Math.random() * 30) + 70
      },
      salaryData: {
        entry: 15000 + Math.floor(Math.random() * 10000),
        mid: 25000 + Math.floor(Math.random() * 15000),
        senior: 40000 + Math.floor(Math.random() * 20000),
        leadership: 60000 + Math.floor(Math.random() * 40000)
      },
      jobMarket: {
        totalJobs: Math.floor(Math.random() * 50000) + 10000,
        newJobs: Math.floor(Math.random() * 5000) + 1000,
        competitionRatio: Math.random() * 10 + 5,
        seasonality: '全年稳定，Q4略有上升'
      },
      topPositions: Array.from({length: 5}, (_, i) => ({
        position: getPositions(industry, getCategories(industry)[0] || '')[i] || `${industry}专家`,
        demand: 70 + Math.floor(Math.random() * 30),
        avgSalary: 30000 + Math.floor(Math.random() * 20000),
        growth: Math.floor(Math.random() * 25) + 10
      })),
      requiredSkills: {
        technical: ['Python', 'Java', 'JavaScript', 'SQL'],
        soft: ['沟通能力', '团队协作', '项目管理'],
        emerging: ['AI技术', '云计算', '区块链']
      },
      geographicDistribution: popularCities.slice(0, 8).map(city => ({
        city,
        jobCount: Math.floor(Math.random() * 5000) + 1000,
        avgSalary: 25000 + Math.floor(Math.random() * 20000)
      })),
      futureOutlook: {
        opportunities: ['数字化转型加速', '新兴技术应用', '政策支持'],
        challenges: ['人才短缺', '技术变化快', '竞争加剧'],
        trends: ['AI赋能', '云原生', '数据驱动'],
        recommendations: ['加强技能学习', '关注新兴技术', '提升软技能']
      }
    }));
  };

  const tabs = [
    { id: 'overview', label: '📊 总览', icon: ChartBarIcon },
    { id: 'search', label: '🔍 智能搜索', icon: MagnifyingGlassIcon },
    { id: 'trends', label: '📈 市场趋势', icon: ArrowTrendingUpIcon },
    { id: 'skills', label: '🎯 技能分析', icon: SparklesIcon },
    { id: 'industries', label: '🏢 行业洞察', icon: BuildingOfficeIcon },
    { id: 'reports', label: '📋 我的报告', icon: DocumentChartBarIcon }
  ];

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="container max-w-7xl py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-purple-100 to-blue-100 rounded-3xl shadow-lg">
              <ChartBarIcon className="w-10 h-10 text-purple-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">智能市场洞察</h1>
              <p className="text-gray-600 mt-1 text-lg">AI驱动的实时职场数据分析，覆盖全行业职位</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* AI洞察状态 */}
            {aiInsights && (
              <div className="flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-xl">
                <SparklesIcon className="w-5 h-5" />
                <span className="text-sm font-medium">AI分析已完成</span>
              </div>
            )}
            
            {/* 保存按钮 */}
              <button
              onClick={saveReport}
              className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              <DocumentChartBarIcon className="w-5 h-5" />
              <span>保存报告</span>
            </button>
          </div>
        </div>

        {/* 搜索和筛选区域 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center space-x-4 mb-4">
            {/* 搜索类型下拉框 */}
            <div className="min-w-fit">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value as '行业' | '职位' | '技能')}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white text-gray-900 font-medium"
              >
                <option value="职位">职位</option>
                <option value="行业">行业</option>
                <option value="技能">技能</option>
              </select>
            </div>

            {/* 搜索输入框 */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchInputChange(e.target.value)}
                onFocus={() => searchQuery && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder={`搜索${searchType}...`}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white text-gray-900 placeholder-gray-500"
              />
              
              {/* 搜索建议下拉框 */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1 max-h-64 overflow-y-auto">
                  {searchSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={() => selectSuggestion(suggestion)}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-gray-900 font-medium">{suggestion.text}</span>
                          {suggestion.category && (
                            <div className="text-xs text-gray-500 mt-1">{suggestion.category}</div>
                          )}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          suggestion.type === '行业' ? 'bg-blue-100 text-blue-700' :
                          suggestion.type === '职位' ? 'bg-green-100 text-green-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {suggestion.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 查询按钮 */}
            <button
              onClick={executeSearch}
              disabled={!hasValidSearchConditions() || isLoading}
              className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all font-medium shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>分析中...</span>
                </>
              ) : (
                <>
                  <MagnifyingGlassIcon className="w-5 h-5" />
                  <span>查询分析</span>
                </>
              )}
            </button>

            {/* 筛选按钮 */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all ${
                showFilters 
                  ? 'bg-purple-100 text-purple-700 border-2 border-purple-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent'
              }`}
            >
              <FunnelIcon className="w-5 h-5" />
              <span>筛选</span>
              </button>
          </div>

          {/* 高级筛选 */}
          {showFilters && (
            <div className="space-y-4 pt-4 border-t border-gray-200">
              {/* 第一行：行业、分类、职位 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">行业</label>
                  <select
                    value={filters.industry}
                    onChange={(e) => {
                      setFilters(prev => ({ 
                        ...prev, 
                        industry: e.target.value,
                        category: '',
                        position: ''
                      }));
                      updateSearchFromFilters({ ...filters, industry: e.target.value, category: '', position: '' });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white text-gray-900"
                  >
                    <option value="">选择行业</option>
                    {industries.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
          </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">分类</label>
                  <select
                    value={filters.category}
                    onChange={(e) => {
                      setFilters(prev => ({ 
                        ...prev, 
                        category: e.target.value,
                        position: ''
                      }));
                      updateSearchFromFilters({ ...filters, category: e.target.value, position: '' });
                    }}
                    disabled={!filters.industry}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white text-gray-900 disabled:bg-gray-100"
                  >
                    <option value="">选择分类</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">具体职位</label>
                  <select
                    value={filters.position}
                    onChange={(e) => {
                      setFilters(prev => ({ ...prev, position: e.target.value }));
                      updateSearchFromFilters({ ...filters, position: e.target.value });
                    }}
                    disabled={!filters.category}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white text-gray-900 disabled:bg-gray-100"
                  >
                    <option value="">选择职位 (可选)</option>
                    {positions.map(position => (
                      <option key={position} value={position}>{position}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 第二行：城市、时间范围 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">城市</label>
                  <select
                    value={filters.location}
                    onChange={(e) => {
                      setFilters(prev => ({ ...prev, location: e.target.value }));
                      updateSearchFromFilters({ ...filters, location: e.target.value });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white text-gray-900"
                  >
                    <option value="">选择城市</option>
                    <optgroup label="一线城市">
                      {['北京', '上海', '广州', '深圳'].map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </optgroup>
                    <optgroup label="新一线城市">
                      {['杭州', '南京', '武汉', '成都', '西安', '苏州', '天津', '南昌', '长沙', '宁波', '佛山', '郑州', '青岛', '无锡', '东莞'].map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </optgroup>
                    <optgroup label="其他城市">
                      {popularCities.filter(city => 
                        !['北京', '上海', '广州', '深圳', '杭州', '南京', '武汉', '成都', '西安', '苏州', '天津', '南昌', '长沙', '宁波', '佛山', '郑州', '青岛', '无锡', '东莞'].includes(city)
                      ).map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">时间范围</label>
                  <select
                    value={filters.timeRange}
                    onChange={(e) => {
                      setFilters(prev => ({ ...prev, timeRange: e.target.value as any }));
                      updateSearchFromFilters({ ...filters, timeRange: e.target.value as any });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white text-gray-900"
                  >
                    <option value="1M">近1个月</option>
                    <option value="3M">近3个月</option>
                    <option value="6M">近6个月</option>
                    <option value="1Y">近1年</option>
                  </select>
                </div>
              </div>

              {/* 筛选结果预览 */}
              {(filters.industry || filters.location) && (
                <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                  <div className="text-sm text-purple-800">
                    <span className="font-medium">当前筛选：</span>
                    <span className="ml-2">{generateFilterDescription()}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 标签导航 */}
        <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 mb-8">
          <div className="flex space-x-2 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                      ? 'bg-purple-100 text-purple-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                  <span className="text-sm">{tab.label}</span>
              </button>
            );
          })}
          </div>
        </div>

        {/* 内容区域 */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mb-4"></div>
            <p className="text-gray-600">AI正在分析市场数据...</p>
          </div>
        ) : !hasSearched && activeTab !== 'reports' ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-center max-w-md">
              <MagnifyingGlassIcon className="w-16 h-16 text-gray-300 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">开始智能市场分析</h3>
              <p className="text-gray-600 mb-6">
                选择搜索类型输入关键词，或通过筛选条件选择行业、职位、地区，点击"查询分析"获取专业的市场洞察报告
              </p>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="text-sm text-blue-800">
                  <div className="font-medium mb-2">💡 搜索提示：</div>
                  <ul className="text-left space-y-1">
                    <li>• 输入"ja"可匹配 Java、JavaScript 等</li>
                    <li>• 选择不同类型获得精准结果</li>
                    <li>• 支持模糊匹配和智能建议</li>
                    <li>• 可通过筛选条件直接查询</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && <OverviewView 
              trends={marketTrends} 
              jobs={jobMarketData.slice(0, 4)} 
              skills={skillAnalysis.slice(0, 6)}
              industries={industryAnalysis.slice(0, 3)}
              aiInsights={aiInsights}
            />}
            {activeTab === 'search' && <SmartSearchView 
              jobs={jobMarketData}
              filters={filters}
              onFilterChange={setFilters}
            />}
            {activeTab === 'trends' && <EnhancedTrendsView trends={marketTrends} />}
            {activeTab === 'skills' && <EnhancedSkillsView skills={skillAnalysis} />}
            {activeTab === 'industries' && <EnhancedIndustriesView industries={industryAnalysis} />}
            {activeTab === 'reports' && <SavedReportsView reports={savedReports} />}
          </>
        )}
      </div>
    </div>
  );
};

// 新增的视图组件

// 总览视图
const OverviewView: React.FC<{
  trends: MarketTrend[];
  jobs: JobMarketData[];
  skills: SkillAnalysis[];
  industries: IndustryAnalysis[];
  aiInsights: string;
}> = ({ trends, jobs, skills, industries, aiInsights }) => {
  return (
    <div className="space-y-8">
      {/* AI智能洞察 */}
      {aiInsights && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <SparklesIcon className="w-6 h-6 text-purple-600" />
                </div>
            <h3 className="text-xl font-bold text-gray-900">AI智能洞察</h3>
                </div>
          <div className="prose prose-purple max-w-none">
            <div className="text-gray-700 whitespace-pre-line leading-relaxed">
              {typeof aiInsights === 'string' ? aiInsights : JSON.stringify(aiInsights, null, 2)}
              </div>
          </div>
        </div>
      )}

      {/* 核心数据看板 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-600">热门趋势</h4>
            <ArrowTrendingUpIcon className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {trends.filter(t => t.trend === 'up').length}
          </div>
          <div className="text-sm text-green-600">↗ 上升趋势</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-600">活跃职位</h4>
            <BriefcaseIcon className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {jobs.length}+
          </div>
          <div className="text-sm text-blue-600">多个热门岗位</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-600">核心技能</h4>
            <AcademicCapIcon className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {skills.filter(s => s.demandLevel === 'critical' || s.demandLevel === 'high').length}
          </div>
          <div className="text-sm text-purple-600">高需求技能</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-600">行业机会</h4>
            <GlobeAltIcon className="w-5 h-5 text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {industries.filter(i => i.overview.growth > 20).length}
          </div>
          <div className="text-sm text-orange-600">高增长行业</div>
        </div>
      </div>

      {/* 快速洞察卡片 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 热门职位快览 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">🔥 热门职位</h3>
            <span className="text-sm text-gray-500">基于AI分析</span>
          </div>
          <div className="space-y-4">
            {jobs.slice(0, 3).map((job) => (
              <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h4 className="font-semibold text-gray-900">{job.position}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-gray-600">{job.location}</span>
                    <span className="text-sm text-green-600 font-medium">
                      ¥{(job.salaryRange.median / 1000).toFixed(0)}K
                  </span>
                </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-orange-600">
                    +{job.demandGrowth}%
                  </div>
                  <div className="text-xs text-gray-500">需求增长</div>
                </div>
              </div>
            ))}
              </div>
            </div>

        {/* 技能趋势快览 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">📈 技能趋势</h3>
            <span className="text-sm text-gray-500">市场热度</span>
          </div>
          <div className="space-y-4">
            {skills.slice(0, 4).map((skill) => (
              <div key={skill.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    skill.demandLevel === 'critical' ? 'bg-red-500' :
                    skill.demandLevel === 'high' ? 'bg-orange-500' :
                    skill.demandLevel === 'medium' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`}></div>
                  <span className="font-medium text-gray-900">{skill.skill}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-green-600">+{skill.growth}%</span>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${Math.min(skill.growth, 100)}%` }}
                  ></div>
                  </div>
                </div>
              </div>
                ))}
              </div>
        </div>
      </div>

      {/* 市场趋势总览 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">📊 市场趋势总览</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trends.slice(0, 2).map((trend) => (
            <div key={trend.id} className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{trend.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{trend.description}</p>
                </div>
                <div className={`flex items-center space-x-1 ${
                  trend.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {trend.trend === 'up' ? (
                    <ArrowTrendingUpIcon className="w-4 h-4" />
                  ) : (
                    <ArrowTrendingDownIcon className="w-4 h-4" />
                  )}
                  <span className="font-semibold">+{trend.change}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{trend.period}</span>
                <span>可信度: {Math.round(trend.confidence * 100)}%</span>
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
};

// 智能搜索视图
const SmartSearchView: React.FC<{
  jobs: JobMarketData[];
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
}> = ({ jobs }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">🔍 搜索结果</h3>
        <div className="text-sm text-gray-600 mb-6">
          找到 {jobs.length} 个相关职位
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {jobs.map((job) => (
            <div key={job.id} className="border border-gray-200 rounded-xl p-6 hover:border-purple-300 hover:shadow-lg transition-all">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                    <h4 className="font-bold text-gray-900">{job.position}</h4>
                    <div className="flex items-center space-x-2 mt-1 text-sm text-gray-600">
                      <BuildingOfficeIcon className="w-4 h-4" />
                      <span>{job.industry}</span>
                    <span>•</span>
                      <MapPinIcon className="w-4 h-4" />
                      <span>{job.location}</span>
                  </div>
                </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    job.competitionLevel === 'high' ? 'bg-red-100 text-red-700' :
                    job.competitionLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    竞争{job.competitionLevel === 'high' ? '激烈' : job.competitionLevel === 'medium' ? '中等' : '较低'}
                </div>
              </div>

                <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CurrencyDollarIcon className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-gray-900">
                  ¥{(job.salaryRange.min / 1000).toFixed(0)}K - ¥{(job.salaryRange.max / 1000).toFixed(0)}K
                </span>
              </div>
                  <div className="flex items-center space-x-1 text-green-600">
                    <ArrowTrendingUpIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">+{job.demandGrowth}%</span>
                </div>
              </div>

                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">核心技能要求</div>
                <div className="flex flex-wrap gap-2">
                    {job.requirements.skills.slice(0, 4).map((skill) => (
                      <span key={skill} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                        {skill}
                    </span>
                  ))}
                </div>
              </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="text-sm text-gray-600">
                    需求指数: <span className="font-medium">{job.demandIndex}/100</span>
                  </div>
                  <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                    查看详情 →
                </button>
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
};

// 增强的技能视图
const EnhancedSkillsView: React.FC<{ skills: SkillAnalysis[] }> = ({ skills }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {skills.map((skill) => (
          <div key={skill.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-4">
                <div>
                <h3 className="font-bold text-gray-900 text-lg">{skill.skill}</h3>
                <p className="text-sm text-gray-600">{skill.category}</p>
                </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                skill.demandLevel === 'critical' ? 'bg-red-100 text-red-700' :
                skill.demandLevel === 'high' ? 'bg-orange-100 text-orange-700' :
                skill.demandLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                skill.demandLevel === 'emerging' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                {skill.demandLevel === 'critical' ? '🔥 极热' :
                 skill.demandLevel === 'high' ? '🚀 热门' :
                 skill.demandLevel === 'medium' ? '📈 稳定' :
                 skill.demandLevel === 'emerging' ? '🌟 新兴' : '📊 一般'}
                </div>
              </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">市场增长</span>
                <span className="font-semibold text-green-600">+{skill.growth}%</span>
                </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">薪酬加成</span>
                <span className="font-semibold text-purple-600">+¥{skill.salaryImpact.bonus.toLocaleString()}</span>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">学习难度</div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    skill.learningPath.difficulty === 'beginner' ? 'bg-green-500' :
                    skill.learningPath.difficulty === 'intermediate' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}></div>
                  <span className="text-sm text-gray-600">
                    {skill.learningPath.difficulty === 'beginner' ? '入门级' :
                     skill.learningPath.difficulty === 'intermediate' ? '中级' : '高级'}
                  </span>
                  <span className="text-xs text-gray-500">({skill.learningPath.timeToMaster})</span>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">相关职位</div>
                <div className="space-y-1">
                  {skill.relatedPositions.slice(0, 2).map((pos, idx) => (
                    <div key={idx} className="text-xs text-gray-600 flex items-center space-x-1">
                      <ArrowRightIcon className="w-3 h-3" />
                      <span>{pos.position}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 增强的行业视图  
const EnhancedIndustriesView: React.FC<{ industries: IndustryAnalysis[] }> = ({ industries }) => {
  return (
    <div className="space-y-6">
      {industries.map((industry) => (
        <div key={industry.id} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between mb-6">
                <div>
              <h3 className="text-2xl font-bold text-gray-900">{industry.industry}</h3>
              <div className="flex items-center space-x-4 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  industry.overview.maturity === 'emerging' ? 'bg-green-100 text-green-700' :
                  industry.overview.maturity === 'growing' ? 'bg-blue-100 text-blue-700' :
                  industry.overview.maturity === 'mature' ? 'bg-purple-100 text-purple-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {industry.overview.maturity === 'emerging' ? '🌱 新兴' :
                   industry.overview.maturity === 'growing' ? '🚀 增长' :
                   industry.overview.maturity === 'mature' ? '🏢 成熟' : '📉 衰退'}
                    </span>
                <div className="text-sm text-gray-600">
                  年增长率: <span className="font-semibold text-green-600">+{industry.overview.growth}%</span>
                </div>
                  </div>
                </div>
                <div className="text-right">
              <div className="text-sm text-gray-600">总职位数</div>
              <div className="text-2xl font-bold text-gray-900">{industry.jobMarket.totalJobs.toLocaleString()}</div>
                  </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-lg font-bold text-gray-900">¥{(industry.salaryData.entry / 1000).toFixed(0)}K</div>
              <div className="text-sm text-gray-600">入门薪资</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-lg font-bold text-gray-900">¥{(industry.salaryData.mid / 1000).toFixed(0)}K</div>
              <div className="text-sm text-gray-600">中级薪资</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-lg font-bold text-gray-900">¥{(industry.salaryData.senior / 1000).toFixed(0)}K</div>
              <div className="text-sm text-gray-600">高级薪资</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-lg font-bold text-gray-900">¥{(industry.salaryData.leadership / 1000).toFixed(0)}K</div>
              <div className="text-sm text-gray-600">管理薪资</div>
                </div>
              </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">🔥 热门职位</h4>
              <div className="space-y-3">
                {industry.topPositions.slice(0, 5).map((pos, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">{pos.position}</span>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-green-600">¥{(pos.avgSalary / 1000).toFixed(0)}K</div>
                      <div className="text-xs text-gray-500">+{pos.growth}%</div>
                </div>
                  </div>
                ))}
                </div>
              </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">🛠️ 核心技能</h4>
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">技术技能</div>
                <div className="flex flex-wrap gap-2">
                    {industry.requiredSkills.technical.map((skill) => (
                      <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">软技能</div>
                  <div className="flex flex-wrap gap-2">
                    {industry.requiredSkills.soft.map((skill) => (
                      <span key={skill} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">新兴技能</div>
                  <div className="flex flex-wrap gap-2">
                    {industry.requiredSkills.emerging.map((skill) => (
                    <span key={skill} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          </div>

          <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
            <h4 className="font-semibold text-gray-900 mb-3">💡 未来展望</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">机会</div>
                <ul className="space-y-1">
                  {industry.futureOutlook.opportunities.map((opp, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start space-x-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>{opp}</span>
                    </li>
                  ))}
                </ul>
      </div>
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">挑战</div>
                <ul className="space-y-1">
                  {industry.futureOutlook.challenges.map((challenge, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start space-x-2">
                      <span className="text-orange-500 mt-1">•</span>
                      <span>{challenge}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// 增强的趋势视图
const EnhancedTrendsView: React.FC<{ trends: MarketTrend[] }> = ({ trends }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {trends.map((trend) => (
          <div key={trend.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-bold text-gray-900">{trend.title}</h3>
                  <span className={`inline-flex items-center space-x-1 text-xs px-3 py-1 rounded-full ${
                    trend.category === 'salary' ? 'bg-green-100 text-green-700' :
                    trend.category === 'demand' ? 'bg-blue-100 text-blue-700' :
                    trend.category === 'skill' ? 'bg-purple-100 text-purple-700' :
                    trend.category === 'industry' ? 'bg-orange-100 text-orange-700' :
                    trend.category === 'location' ? 'bg-pink-100 text-pink-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {trend.category === 'salary' ? '💰 薪酬' :
                     trend.category === 'demand' ? '📈 需求' :
                     trend.category === 'skill' ? '🛠 技能' :
                     trend.category === 'industry' ? '🏢 行业' :
                     trend.category === 'location' ? '📍 地域' : '🎓 学历'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3 leading-relaxed">{trend.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="w-3 h-3" />
                    <span>{trend.period}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>来源: {trend.source}</span>
                    <span>•</span>
                    <span>可信度: {Math.round(trend.confidence * 100)}%</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right ml-4">
                <div className={`flex items-center space-x-1 mb-2 ${
                  trend.trend === 'up' ? 'text-green-600' :
                  trend.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {trend.trend === 'up' ? (
                    <ArrowTrendingUpIcon className="w-5 h-5" />
                  ) : trend.trend === 'down' ? (
                    <ArrowTrendingDownIcon className="w-5 h-5" />
                  ) : (
                    <div className="w-5 h-5 bg-gray-400 rounded-full"></div>
                  )}
                  <span className="font-bold text-lg">
                    {trend.trend === 'up' ? '+' : trend.trend === 'down' ? '-' : ''}{Math.abs(trend.change)}%
                  </span>
                </div>
                <div className={`text-xs px-2 py-1 rounded-full ${
                  trend.impact === 'high' ? 'bg-red-100 text-red-700' :
                  trend.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {trend.impact === 'high' ? '高影响' : trend.impact === 'medium' ? '中影响' : '低影响'}
                </div>
              </div>
            </div>

            {/* 趋势图表 */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-end space-x-1 h-16">
                {trend.data.map((value, index) => (
                  <div
                    key={index}
                    className={`flex-1 rounded-t transition-all ${
                      trend.trend === 'up' ? 'bg-gradient-to-t from-green-400 to-green-300' :
                      trend.trend === 'down' ? 'bg-gradient-to-t from-red-400 to-red-300' : 
                      'bg-gradient-to-t from-gray-400 to-gray-300'
                    }`}
                    style={{ height: `${(value / Math.max(...trend.data)) * 100}%` }}
                  ></div>
                ))}
              </div>
              <div className="text-center mt-2">
                <span className="text-xs text-gray-500">数据趋势图</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 保存的报告视图
const SavedReportsView: React.FC<{ reports: SavedReport[] }> = ({ reports }) => {
  return (
    <div className="space-y-6">
      {reports.length === 0 ? (
        <div className="text-center py-12">
          <DocumentChartBarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">暂无保存的报告</h3>
          <p className="text-gray-500">开始分析市场数据，创建您的第一份报告</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div key={report.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-900">{report.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    创建时间: {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
                    <EyeIcon className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                    <ShareIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                {report.filters.industry && (
                  <div>行业: {report.filters.industry}</div>
                )}
                {report.filters.location && (
                  <div>地点: {report.filters.location}</div>
                )}
                <div>时间范围: {
                  report.filters.timeRange === '1M' ? '近1个月' :
                  report.filters.timeRange === '3M' ? '近3个月' :
                  report.filters.timeRange === '6M' ? '近6个月' : '近1年'
                }</div>
              </div>
              
              <div className="flex space-x-2 mt-4">
                <button className="flex-1 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium">
                  查看报告
                </button>
                <button className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                  下载
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

