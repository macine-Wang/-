/**
 * 市场洞察报告
 * 定期获取行业薪酬趋势、热门职位和技能需求分析
 */

import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  FireIcon,
  SparklesIcon,
  CalendarIcon,
  MapPinIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  ArrowRightIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface MarketTrend {
  id: string;
  title: string;
  category: 'salary' | 'demand' | 'skill' | 'industry';
  trend: 'up' | 'down' | 'stable';
  change: number;
  description: string;
  period: string;
  data: number[];
}

interface HotJob {
  id: string;
  title: string;
  industry: string;
  location: string;
  salaryRange: {
    min: number;
    max: number;
  };
  demandGrowth: number;
  requirements: string[];
  companies: string[];
}

interface SkillDemand {
  id: string;
  skill: string;
  category: string;
  demandLevel: 'high' | 'medium' | 'low';
  growth: number;
  avgSalaryBonus: number;
  relatedJobs: string[];
}

interface IndustryReport {
  id: string;
  industry: string;
  growth: number;
  avgSalary: number;
  jobCount: number;
  topSkills: string[];
  outlook: 'positive' | 'stable' | 'declining';
}

export const MarketInsightsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'trends' | 'jobs' | 'skills' | 'industries'>('trends');
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1M' | '3M' | '6M' | '1Y'>('3M');
  const [isLoading, setIsLoading] = useState(true);

  // 模拟数据加载
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
    };
    loadData();
  }, [selectedTimeRange]);

  // 模拟市场趋势数据
  const marketTrends: MarketTrend[] = [
    {
      id: 'ai_salary_surge',
      title: 'AI相关职位薪酬大幅上涨',
      category: 'salary',
      trend: 'up',
      change: 28.5,
      description: 'AI算法工程师、机器学习工程师等职位平均薪酬较去年同期上涨28.5%',
      period: '近3个月',
      data: [100, 108, 115, 123, 128]
    },
    {
      id: 'remote_work_demand',
      title: '远程工作需求持续增长',
      category: 'demand',
      trend: 'up',
      change: 15.2,
      description: '支持远程工作的职位发布量增长15.2%，求职者对灵活工作的需求不断提升',
      period: '近6个月',
      data: [100, 105, 110, 112, 115]
    },
    {
      id: 'frontend_market_stable',
      title: '前端开发市场趋于稳定',
      category: 'demand',
      trend: 'stable',
      change: 2.1,
      description: '前端开发职位需求保持稳定，React、Vue等框架技能仍然热门',
      period: '近3个月',
      data: [100, 102, 101, 103, 102]
    },
    {
      id: 'cloud_skills_hot',
      title: '云计算技能需求激增',
      category: 'skill',
      trend: 'up',
      change: 35.7,
      description: 'AWS、Azure、阿里云等云平台技能需求增长35.7%',
      period: '近6个月',
      data: [100, 115, 125, 132, 136]
    }
  ];

  // 模拟热门职位数据
  const hotJobs: HotJob[] = [
    {
      id: 'ai_engineer',
      title: 'AI算法工程师',
      industry: '人工智能',
      location: '北京',
      salaryRange: { min: 30000, max: 80000 },
      demandGrowth: 45.2,
      requirements: ['Python', '机器学习', 'TensorFlow', 'PyTorch'],
      companies: ['字节跳动', '阿里巴巴', '腾讯', '百度']
    },
    {
      id: 'fullstack_developer',
      title: '全栈开发工程师',
      industry: '互联网',
      location: '上海',
      salaryRange: { min: 25000, max: 50000 },
      demandGrowth: 23.8,
      requirements: ['React', 'Node.js', 'TypeScript', '数据库'],
      companies: ['美团', '滴滴', '小红书', '拼多多']
    },
    {
      id: 'devops_engineer',
      title: 'DevOps工程师',
      industry: '云计算',
      location: '深圳',
      salaryRange: { min: 28000, max: 55000 },
      demandGrowth: 31.5,
      requirements: ['Docker', 'Kubernetes', 'CI/CD', 'AWS'],
      companies: ['华为', '腾讯云', '阿里云', '京东']
    },
    {
      id: 'product_manager',
      title: '高级产品经理',
      industry: '互联网',
      location: '杭州',
      salaryRange: { min: 22000, max: 45000 },
      demandGrowth: 18.3,
      requirements: ['产品设计', '用户研究', '数据分析', '项目管理'],
      companies: ['阿里巴巴', '网易', '钉钉', '蚂蚁集团']
    }
  ];

  // 模拟技能需求数据
  const skillDemands: SkillDemand[] = [
    {
      id: 'python',
      skill: 'Python',
      category: '编程语言',
      demandLevel: 'high',
      growth: 22.4,
      avgSalaryBonus: 8500,
      relatedJobs: ['AI算法工程师', '数据科学家', '后端开发工程师']
    },
    {
      id: 'react',
      skill: 'React',
      category: '前端框架',
      demandLevel: 'high',
      growth: 15.8,
      avgSalaryBonus: 5200,
      relatedJobs: ['前端工程师', '全栈工程师', 'React开发工程师']
    },
    {
      id: 'kubernetes',
      skill: 'Kubernetes',
      category: '云原生',
      demandLevel: 'high',
      growth: 38.9,
      avgSalaryBonus: 12000,
      relatedJobs: ['DevOps工程师', '云架构师', '系统工程师']
    },
    {
      id: 'machine_learning',
      skill: '机器学习',
      category: 'AI技术',
      demandLevel: 'high',
      growth: 41.2,
      avgSalaryBonus: 15000,
      relatedJobs: ['AI工程师', '数据科学家', '算法工程师']
    },
    {
      id: 'typescript',
      skill: 'TypeScript',
      category: '编程语言',
      demandLevel: 'medium',
      growth: 28.6,
      avgSalaryBonus: 4800,
      relatedJobs: ['前端工程师', '全栈工程师', 'Node.js工程师']
    },
    {
      id: 'aws',
      skill: 'AWS',
      category: '云平台',
      demandLevel: 'high',
      growth: 33.7,
      avgSalaryBonus: 9800,
      relatedJobs: ['云工程师', 'DevOps工程师', '解决方案架构师']
    }
  ];

  // 模拟行业报告数据
  const industryReports: IndustryReport[] = [
    {
      id: 'ai',
      industry: '人工智能',
      growth: 42.8,
      avgSalary: 45000,
      jobCount: 15680,
      topSkills: ['Python', '机器学习', 'TensorFlow', '数据分析'],
      outlook: 'positive'
    },
    {
      id: 'cloud_computing',
      industry: '云计算',
      growth: 35.2,
      avgSalary: 38000,
      jobCount: 12450,
      topSkills: ['Docker', 'Kubernetes', 'AWS', 'DevOps'],
      outlook: 'positive'
    },
    {
      id: 'fintech',
      industry: '金融科技',
      growth: 28.7,
      avgSalary: 42000,
      jobCount: 8920,
      topSkills: ['Java', '微服务', '区块链', '风控'],
      outlook: 'positive'
    },
    {
      id: 'ecommerce',
      industry: '电子商务',
      growth: 18.4,
      avgSalary: 32000,
      jobCount: 22100,
      topSkills: ['React', 'Node.js', '数据分析', '用户体验'],
      outlook: 'stable'
    },
    {
      id: 'traditional_it',
      industry: '传统IT',
      growth: 8.2,
      avgSalary: 28000,
      jobCount: 45600,
      topSkills: ['Java', '.NET', 'Oracle', '项目管理'],
      outlook: 'stable'
    }
  ];

  const tabs = [
    { id: 'trends', label: '市场趋势', icon: ArrowTrendingUpIcon },
    { id: 'jobs', label: '热门职位', icon: FireIcon },
    { id: 'skills', label: '技能需求', icon: SparklesIcon },
    { id: 'industries', label: '行业分析', icon: ChartBarIcon }
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="container max-w-7xl py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl">
              <ChartBarIcon className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-dsp-dark">市场洞察报告</h1>
              <p className="text-dsp-gray mt-1">实时追踪行业趋势，把握职场机会</p>
            </div>
          </div>

          {/* 时间范围选择 */}
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            {(['1M', '3M', '6M', '1Y'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setSelectedTimeRange(range)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  selectedTimeRange === range
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-dsp-gray hover:text-dsp-dark'
                }`}
              >
                {range === '1M' ? '1个月' : range === '3M' ? '3个月' : range === '6M' ? '6个月' : '1年'}
              </button>
            ))}
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
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-dsp-gray hover:text-dsp-dark'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 内容区域 */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
          </div>
        ) : (
          <>
            {activeTab === 'trends' && <MarketTrendsView trends={marketTrends} />}
            {activeTab === 'jobs' && <HotJobsView jobs={hotJobs} />}
            {activeTab === 'skills' && <SkillDemandsView skills={skillDemands} />}
            {activeTab === 'industries' && <IndustryReportsView reports={industryReports} />}
          </>
        )}
      </div>
    </div>
  );
};

// 市场趋势视图
const MarketTrendsView: React.FC<{ trends: MarketTrend[] }> = ({ trends }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {trends.map((trend) => (
          <div key={trend.id} className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold text-dsp-dark">{trend.title}</h3>
                  <span className={`inline-flex items-center space-x-1 text-xs px-2 py-1 rounded-full ${
                    trend.category === 'salary' ? 'bg-green-100 text-green-700' :
                    trend.category === 'demand' ? 'bg-blue-100 text-blue-700' :
                    trend.category === 'skill' ? 'bg-purple-100 text-purple-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {trend.category === 'salary' ? '💰 薪酬' :
                     trend.category === 'demand' ? '📈 需求' :
                     trend.category === 'skill' ? '🛠 技能' : '🏢 行业'}
                  </span>
                </div>
                <p className="text-dsp-gray text-sm mb-3">{trend.description}</p>
                <div className="flex items-center space-x-2 text-xs text-dsp-gray">
                  <CalendarIcon className="w-3 h-3" />
                  <span>{trend.period}</span>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`flex items-center space-x-1 ${
                  trend.trend === 'up' ? 'text-green-600' :
                  trend.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {trend.trend === 'up' ? (
                    <ArrowTrendingUpIcon className="w-4 h-4" />
                  ) : trend.trend === 'down' ? (
                    <ArrowTrendingDownIcon className="w-4 h-4" />
                  ) : (
                    <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                  )}
                  <span className="font-semibold">
                    {trend.trend === 'up' ? '+' : trend.trend === 'down' ? '-' : ''}{Math.abs(trend.change)}%
                  </span>
                </div>
              </div>
            </div>

            {/* 简单的趋势图 */}
            <div className="mt-4">
              <div className="flex items-end space-x-1 h-12">
                {trend.data.map((value, index) => (
                  <div
                    key={index}
                    className={`flex-1 rounded-t ${
                      trend.trend === 'up' ? 'bg-green-200' :
                      trend.trend === 'down' ? 'bg-red-200' : 'bg-gray-200'
                    }`}
                    style={{ height: `${(value / Math.max(...trend.data)) * 100}%` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 热门职位视图
const HotJobsView: React.FC<{ jobs: HotJob[] }> = ({ jobs }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-purple-200 hover:shadow-lg transition-all">
            <div className="space-y-4">
              {/* 职位头部 */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-dsp-dark mb-1">{job.title}</h3>
                  <div className="flex items-center space-x-2 text-sm text-dsp-gray">
                    <span className="flex items-center space-x-1">
                      <BriefcaseIcon className="w-3 h-3" />
                      <span>{job.industry}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <MapPinIcon className="w-3 h-3" />
                      <span>{job.location}</span>
                    </span>
                  </div>
                </div>
                <div className="text-right">
                <div className="flex items-center space-x-1 text-green-600">
                  <ArrowTrendingUpIcon className="w-4 h-4" />
                  <span className="font-semibold">+{job.demandGrowth}%</span>
                </div>
                  <div className="text-xs text-dsp-gray">需求增长</div>
                </div>
              </div>

              {/* 薪酬范围 */}
              <div className="flex items-center space-x-2">
                <CurrencyDollarIcon className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-dsp-dark">
                  ¥{(job.salaryRange.min / 1000).toFixed(0)}K - ¥{(job.salaryRange.max / 1000).toFixed(0)}K
                </span>
                <span className="text-dsp-gray text-sm">/ 月</span>
              </div>

              {/* 技能要求 */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-dsp-dark">核心技能</div>
                <div className="flex flex-wrap gap-2">
                  {job.requirements.map((req) => (
                    <span key={req} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                      {req}
                    </span>
                  ))}
                </div>
              </div>

              {/* 热招公司 */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-dsp-dark">热招公司</div>
                <div className="flex flex-wrap gap-2">
                  {job.companies.slice(0, 3).map((company) => (
                    <span key={company} className="px-2 py-1 bg-gray-100 text-dsp-gray text-xs rounded">
                      {company}
                    </span>
                  ))}
                  {job.companies.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-dsp-gray text-xs rounded">
                      +{job.companies.length - 3}家
                    </span>
                  )}
                </div>
              </div>

              {/* 查看详情按钮 */}
              <div className="pt-2">
                <button className="w-full flex items-center justify-center space-x-2 py-2 text-purple-600 hover:text-purple-700 font-medium transition-colors">
                  <EyeIcon className="w-4 h-4" />
                  <span>查看详细分析</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 技能需求视图
const SkillDemandsView: React.FC<{ skills: SkillDemand[] }> = ({ skills }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill) => (
          <div key={skill.id} className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="space-y-4">
              {/* 技能头部 */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-dsp-dark mb-1">{skill.skill}</h3>
                  <div className="text-sm text-dsp-gray">{skill.category}</div>
                </div>
                <div className={`px-2 py-1 text-xs rounded-full ${
                  skill.demandLevel === 'high' ? 'bg-red-100 text-red-700' :
                  skill.demandLevel === 'medium' ? 'bg-orange-100 text-orange-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {skill.demandLevel === 'high' ? '🔥 高需求' :
                   skill.demandLevel === 'medium' ? '📈 中需求' : '📊 低需求'}
                </div>
              </div>

              {/* 增长率 */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-dsp-gray">需求增长</span>
                <div className="flex items-center space-x-1 text-green-600">
                  <ArrowTrendingUpIcon className="w-4 h-4" />
                  <span className="font-semibold">+{skill.growth}%</span>
                </div>
              </div>

              {/* 薪酬加成 */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-dsp-gray">平均薪酬加成</span>
                <span className="font-semibold text-dsp-dark">+¥{skill.avgSalaryBonus.toLocaleString()}</span>
              </div>

              {/* 相关职位 */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-dsp-dark">相关职位</div>
                <div className="space-y-1">
                  {skill.relatedJobs.map((job) => (
                    <div key={job} className="text-xs text-dsp-gray flex items-center space-x-1">
                      <ArrowRightIcon className="w-3 h-3" />
                      <span>{job}</span>
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

// 行业分析视图
const IndustryReportsView: React.FC<{ reports: IndustryReport[] }> = ({ reports }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reports.map((report) => (
          <div key={report.id} className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="space-y-4">
              {/* 行业头部 */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-dsp-dark mb-1">{report.industry}</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      report.outlook === 'positive' ? 'bg-green-100 text-green-700' :
                      report.outlook === 'stable' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {report.outlook === 'positive' ? '🚀 前景看好' :
                       report.outlook === 'stable' ? '📈 稳定发展' : '📉 增长放缓'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-green-600">
                    <ArrowTrendingUpIcon className="w-4 h-4" />
                    <span className="font-semibold">+{report.growth}%</span>
                  </div>
                  <div className="text-xs text-dsp-gray">增长率</div>
                </div>
              </div>

              {/* 关键指标 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-dsp-dark">¥{(report.avgSalary / 1000).toFixed(0)}K</div>
                  <div className="text-xs text-dsp-gray">平均薪酬</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-dsp-dark">{report.jobCount.toLocaleString()}</div>
                  <div className="text-xs text-dsp-gray">在招职位</div>
                </div>
              </div>

              {/* 热门技能 */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-dsp-dark">热门技能</div>
                <div className="flex flex-wrap gap-2">
                  {report.topSkills.map((skill) => (
                    <span key={skill} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                      {skill}
                    </span>
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
