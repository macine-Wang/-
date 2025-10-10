/**
 * 薪酬竞争力雷达
 * 实时对标市场，一目了然竞争地位
 */

import React, { useState, useEffect } from 'react';
import { deepseekApi } from '@/services/deepseekApi';
import { 
  ChartBarIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  MapPinIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

interface CompetitivenessData {
  position: string;
  department: string;
  current_salary: number;
  market_p25: number;
  market_p50: number;
  market_p75: number;
  market_p90: number;
  competitiveness_score: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  employee_count: number;
  trend: 'up' | 'down' | 'stable';
  trend_percentage: number;
}

interface CompetitorAnalysis {
  company_name: string;
  industry: string;
  size: string;
  avg_salary: number;
  benefits_score: number;
  culture_score: number;
  overall_competitiveness: number;
  key_advantages: string[];
  salary_trend: 'up' | 'down' | 'stable';
}

interface MarketAlert {
  id: string;
  type: 'salary_gap' | 'talent_risk' | 'market_trend' | 'competitor_move';
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  affected_positions: string[];
  recommended_action: string;
  created_at: string;
}

export const SalaryCompetitivenessRadarPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'positions' | 'competitors' | 'alerts'>('overview');
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1M' | '3M' | '6M' | '1Y'>('3M');
  const [isLoading, setIsLoading] = useState(false);
  const [aiAnalysisResults, setAiAnalysisResults] = useState<Map<string, any>>(new Map());

  // 模拟薪酬竞争力数据
  const competitivenessData: CompetitivenessData[] = [
    {
      position: '高级前端工程师',
      department: '技术部',
      current_salary: 28000,
      market_p25: 25000,
      market_p50: 30000,
      market_p75: 35000,
      market_p90: 42000,
      competitiveness_score: 75,
      risk_level: 'medium',
      employee_count: 8,
      trend: 'down',
      trend_percentage: -5.2
    },
    {
      position: 'AI算法工程师',
      department: '技术部',
      current_salary: 45000,
      market_p25: 40000,
      market_p50: 48000,
      market_p75: 55000,
      market_p90: 65000,
      competitiveness_score: 85,
      risk_level: 'low',
      employee_count: 3,
      trend: 'up',
      trend_percentage: 12.3
    },
    {
      position: '产品经理',
      department: '产品部',
      current_salary: 26000,
      market_p25: 28000,
      market_p50: 32000,
      market_p75: 38000,
      market_p90: 45000,
      competitiveness_score: 65,
      risk_level: 'high',
      employee_count: 5,
      trend: 'down',
      trend_percentage: -8.1
    },
    {
      position: 'UI设计师',
      department: '设计部',
      current_salary: 18000,
      market_p25: 16000,
      market_p50: 20000,
      market_p75: 24000,
      market_p90: 28000,
      competitiveness_score: 78,
      risk_level: 'low',
      employee_count: 4,
      trend: 'stable',
      trend_percentage: 1.2
    },
    {
      position: '销售经理',
      department: '销售部',
      current_salary: 22000,
      market_p25: 20000,
      market_p50: 25000,
      market_p75: 30000,
      market_p90: 38000,
      competitiveness_score: 70,
      risk_level: 'medium',
      employee_count: 6,
      trend: 'up',
      trend_percentage: 6.8
    }
  ];

  // 竞对分析数据
  const competitorAnalysis: CompetitorAnalysis[] = [
    {
      company_name: '字节跳动',
      industry: '互联网',
      size: '超大型企业',
      avg_salary: 38000,
      benefits_score: 95,
      culture_score: 88,
      overall_competitiveness: 92,
      key_advantages: ['高薪酬', '股权激励', '技术氛围', '成长机会'],
      salary_trend: 'up'
    },
    {
      company_name: '阿里巴巴',
      industry: '互联网',
      size: '超大型企业',
      avg_salary: 35000,
      benefits_score: 90,
      culture_score: 85,
      overall_competitiveness: 89,
      key_advantages: ['完善福利', '培训体系', '晋升通道', '品牌影响力'],
      salary_trend: 'stable'
    },
    {
      company_name: '腾讯',
      industry: '互联网',
      size: '超大型企业',
      avg_salary: 36000,
      benefits_score: 88,
      culture_score: 82,
      overall_competitiveness: 87,
      key_advantages: ['稳定发展', '产品影响力', '技术实力', '工作生活平衡'],
      salary_trend: 'up'
    },
    {
      company_name: '美团',
      industry: '互联网',
      size: '大型企业',
      avg_salary: 32000,
      benefits_score: 82,
      culture_score: 78,
      overall_competitiveness: 80,
      key_advantages: ['业务多元化', '市场地位', '学习机会'],
      salary_trend: 'stable'
    }
  ];

  // 市场预警数据
  const marketAlerts: MarketAlert[] = [
    {
      id: 'alert_001',
      type: 'talent_risk',
      severity: 'high',
      title: '产品经理岗位人才流失风险',
      description: '当前薪酬低于市场中位数18%，存在高风险人才流失',
      affected_positions: ['产品经理', '高级产品经理'],
      recommended_action: '建议立即调薪至市场中位数水平',
      created_at: '2024-01-20T10:30:00'
    },
    {
      id: 'alert_002',
      type: 'competitor_move',
      severity: 'medium',
      title: '竞对公司大幅调薪',
      description: '字节跳动技术岗位平均调薪15%，可能影响我司人才吸引力',
      affected_positions: ['前端工程师', '后端工程师', '算法工程师'],
      recommended_action: '关注竞对动态，考虑相应调整',
      created_at: '2024-01-18T15:45:00'
    },
    {
      id: 'alert_003',
      type: 'market_trend',
      severity: 'medium',
      title: 'AI岗位薪酬快速上涨',
      description: 'AI相关岗位市场薪酬较上季度上涨12%',
      affected_positions: ['AI算法工程师', '机器学习工程师'],
      recommended_action: '评估AI人才薪酬竞争力',
      created_at: '2024-01-15T09:20:00'
    }
  ];

  const tabs = [
    { id: 'overview', label: '竞争力概览', icon: ChartBarIcon },
    { id: 'positions', label: '岗位分析', icon: BriefcaseIcon },
    { id: 'competitors', label: '竞对分析', icon: BuildingOfficeIcon },
    { id: 'alerts', label: '市场预警', icon: ExclamationTriangleIcon }
  ];

  const getCompetitivenessLevel = (score: number) => {
    if (score >= 90) return { level: '优秀', color: 'text-green-600 bg-green-100' };
    if (score >= 80) return { level: '良好', color: 'text-blue-600 bg-blue-100' };
    if (score >= 70) return { level: '一般', color: 'text-yellow-600 bg-yellow-100' };
    return { level: '较差', color: 'text-red-600 bg-red-100' };
  };

  const getRiskLevelColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // AI竞争力分析
  const analyzeCompetitiveness = async (positionData: CompetitivenessData) => {
    if (aiAnalysisResults.has(positionData.position)) {
      return aiAnalysisResults.get(positionData.position);
    }

    setIsLoading(true);
    try {
      const analysis = await deepseekApi.competitivenessAnalysis({
        position: positionData.position,
        currentSalary: positionData.current_salary,
        marketData: {
          p25: positionData.market_p25,
          p50: positionData.market_p50,
          p75: positionData.market_p75,
          p90: positionData.market_p90
        },
        industry: '互联网',
        location: '北京'
      });

      const newResults = new Map(aiAnalysisResults);
      newResults.set(positionData.position, analysis);
      setAiAnalysisResults(newResults);
      
      return analysis;
    } catch (error) {
      console.error('竞争力分析失败:', error);
      return {
        analysis: 'AI分析服务暂时不可用',
        competitivenessScore: positionData.competitiveness_score,
        recommendations: ['请稍后重试'],
        riskAssessment: '无法评估'
      };
    } finally {
      setIsLoading(false);
    }
  };

  // 页面加载时自动分析关键岗位
  useEffect(() => {
    const analyzeKeyPositions = async () => {
      const highRiskPositions = competitivenessData.filter(
        pos => pos.risk_level === 'high' || pos.risk_level === 'critical'
      );
      
      for (const position of highRiskPositions.slice(0, 2)) {
        await analyzeCompetitiveness(position);
      }
    };

    analyzeKeyPositions();
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <div className="container max-w-7xl py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl">
              <ChartBarIcon className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">薪酬竞争力雷达</h1>
              <p className="text-gray-600 mt-1">实时监控市场动态，精准把握竞争地位</p>
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
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
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
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.id === 'alerts' && marketAlerts.filter(alert => alert.severity === 'high').length > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {marketAlerts.filter(alert => alert.severity === 'high').length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 内容区域 */}
        {activeTab === 'overview' && (
          <OverviewSection data={competitivenessData} />
        )}

        {activeTab === 'positions' && (
          <PositionsSection data={competitivenessData} />
        )}

        {activeTab === 'competitors' && (
          <CompetitorsSection data={competitorAnalysis} />
        )}

        {activeTab === 'alerts' && (
          <AlertsSection alerts={marketAlerts} />
        )}
      </div>
    </div>
  );
};

// 竞争力概览组件
const OverviewSection: React.FC<{ data: CompetitivenessData[] }> = ({ data }) => {
  const avgCompetitiveness = data.reduce((sum, item) => sum + item.competitiveness_score, 0) / data.length;
  const highRiskPositions = data.filter(item => item.risk_level === 'high' || item.risk_level === 'critical').length;
  const totalEmployees = data.reduce((sum, item) => sum + item.employee_count, 0);

  return (
    <div className="space-y-8">
      {/* 关键指标 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {avgCompetitiveness.toFixed(0)}
          </div>
          <div className="text-sm text-gray-600">平均竞争力评分</div>
          <div className="mt-2">
            <span className={`px-2 py-1 text-xs rounded-full ${
              avgCompetitiveness >= 80 ? 'bg-green-100 text-green-700' : 
              avgCompetitiveness >= 70 ? 'bg-yellow-100 text-yellow-700' : 
              'bg-red-100 text-red-700'
            }`}>
              {avgCompetitiveness >= 80 ? '良好' : avgCompetitiveness >= 70 ? '一般' : '需改进'}
            </span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center">
          <div className="text-3xl font-bold text-red-600 mb-2">
            {highRiskPositions}
          </div>
          <div className="text-sm text-gray-600">高风险岗位数</div>
          <div className="mt-2">
            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
              需重点关注
            </span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center">
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {totalEmployees}
          </div>
          <div className="text-sm text-gray-600">覆盖员工总数</div>
          <div className="mt-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
              全员覆盖
            </span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {data.filter(item => item.trend === 'up').length}
          </div>
          <div className="text-sm text-gray-600">上升趋势岗位</div>
          <div className="mt-2">
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
              积极信号
            </span>
          </div>
        </div>
      </div>

      {/* 竞争力雷达图 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">薪酬竞争力分布</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：竞争力评分分布 */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">各岗位竞争力评分</h4>
            {data.map((item) => (
              <div key={item.position} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{item.position}</span>
                  <span className="text-sm font-semibold text-blue-600">{item.competitiveness_score}分</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      item.competitiveness_score >= 80 ? 'bg-green-500' :
                      item.competitiveness_score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${item.competitiveness_score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* 右侧：风险等级分布 */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">人才流失风险分布</h4>
            <div className="grid grid-cols-2 gap-4">
              {['critical', 'high', 'medium', 'low'].map((risk) => {
                const count = data.filter(item => item.risk_level === risk).length;
                const riskLabels = { critical: '极高', high: '高', medium: '中', low: '低' };
                return (
                  <div key={risk} className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className={`text-2xl font-bold mb-1 ${
                      risk === 'critical' ? 'text-red-600' :
                      risk === 'high' ? 'text-orange-600' :
                      risk === 'medium' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {count}
                    </div>
                    <div className="text-sm text-gray-600">{riskLabels[risk as keyof typeof riskLabels]}风险</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 趋势分析 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">市场趋势分析</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-green-50 rounded-xl">
            <ArrowTrendingUpIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600 mb-1">
              {data.filter(item => item.trend === 'up').length}
            </div>
            <div className="text-sm text-green-700">上升趋势岗位</div>
          </div>
          
          <div className="text-center p-6 bg-gray-50 rounded-xl">
            <div className="w-8 h-8 bg-gray-400 rounded-full mx-auto mb-2"></div>
            <div className="text-2xl font-bold text-gray-600 mb-1">
              {data.filter(item => item.trend === 'stable').length}
            </div>
            <div className="text-sm text-gray-700">稳定趋势岗位</div>
          </div>
          
          <div className="text-center p-6 bg-red-50 rounded-xl">
            <ArrowTrendingDownIcon className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-600 mb-1">
              {data.filter(item => item.trend === 'down').length}
            </div>
            <div className="text-sm text-red-700">下降趋势岗位</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 岗位分析组件
const PositionsSection: React.FC<{ data: CompetitivenessData[] }> = ({ data }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">岗位薪酬竞争力分析</h2>
        <p className="text-gray-600">详细分析各岗位在市场中的薪酬定位</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {data.map((position) => (
          <div key={position.position} className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="space-y-4">
              {/* 岗位头部信息 */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{position.position}</h3>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                      {position.department}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                      {position.employee_count}人
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <CurrencyDollarIcon className="w-4 h-4" />
                      <span>当前薪酬: ¥{position.current_salary.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {position.trend === 'up' ? (
                        <ArrowTrendingUpIcon className="w-4 h-4 text-green-600" />
                      ) : position.trend === 'down' ? (
                        <ArrowTrendingDownIcon className="w-4 h-4 text-red-600" />
                      ) : (
                        <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                      )}
                      <span className={position.trend === 'up' ? 'text-green-600' : position.trend === 'down' ? 'text-red-600' : 'text-gray-600'}>
                        {position.trend_percentage > 0 ? '+' : ''}{position.trend_percentage}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {position.competitiveness_score}
                  </div>
                  <div className="text-sm text-gray-600">竞争力评分</div>
                  <div className="mt-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getRiskLevelColor(position.risk_level)}`}>
                      {position.risk_level === 'critical' ? '极高风险' :
                       position.risk_level === 'high' ? '高风险' :
                       position.risk_level === 'medium' ? '中风险' : '低风险'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 市场对标 */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">市场薪酬对标</h4>
                <div className="grid grid-cols-5 gap-4 text-center">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-semibold text-gray-900">
                      ¥{(position.market_p25 / 1000).toFixed(0)}K
                    </div>
                    <div className="text-xs text-gray-600">25分位</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg font-semibold text-blue-600">
                      ¥{(position.market_p50 / 1000).toFixed(0)}K
                    </div>
                    <div className="text-xs text-blue-700">中位数</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-semibold text-green-600">
                      ¥{(position.market_p75 / 1000).toFixed(0)}K
                    </div>
                    <div className="text-xs text-green-700">75分位</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="text-lg font-semibold text-purple-600">
                      ¥{(position.market_p90 / 1000).toFixed(0)}K
                    </div>
                    <div className="text-xs text-purple-700">90分位</div>
                  </div>
                  <div className={`p-3 rounded-lg ${
                    position.current_salary >= position.market_p75 ? 'bg-green-100' :
                    position.current_salary >= position.market_p50 ? 'bg-yellow-100' : 'bg-red-100'
                  }`}>
                    <div className={`text-lg font-semibold ${
                      position.current_salary >= position.market_p75 ? 'text-green-600' :
                      position.current_salary >= position.market_p50 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      ¥{(position.current_salary / 1000).toFixed(0)}K
                    </div>
                    <div className={`text-xs ${
                      position.current_salary >= position.market_p75 ? 'text-green-700' :
                      position.current_salary >= position.market_p50 ? 'text-yellow-700' : 'text-red-700'
                    }`}>
                      当前薪酬
                    </div>
                  </div>
                </div>
              </div>

              {/* 竞争力分析 */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  市场定位: 
                  {position.current_salary >= position.market_p75 ? '高于市场' :
                   position.current_salary >= position.market_p50 ? '接近市场' : '低于市场'}
                </div>
                
                {position.risk_level === 'high' || position.risk_level === 'critical' ? (
                  <div className="text-sm text-red-600 font-medium">
                    建议调薪至¥{position.market_p50.toLocaleString()}以上
                  </div>
                ) : (
                  <div className="text-sm text-green-600 font-medium">
                    薪酬竞争力良好
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 竞对分析组件
const CompetitorsSection: React.FC<{ data: CompetitorAnalysis[] }> = ({ data }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">竞争对手分析</h2>
        <p className="text-gray-600">对比同行业企业的薪酬策略和竞争优势</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {data.map((competitor) => (
          <div key={competitor.company_name} className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="space-y-4">
              {/* 公司头部信息 */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{competitor.company_name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>{competitor.industry}</span>
                    <span>•</span>
                    <span>{competitor.size}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-xl font-bold text-dsp-red">
                    {competitor.overall_competitiveness}
                  </div>
                  <div className="text-xs text-gray-600">综合竞争力</div>
                </div>
              </div>

              {/* 关键指标 */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold text-gray-900">
                    ¥{(competitor.avg_salary / 1000).toFixed(0)}K
                  </div>
                  <div className="text-xs text-gray-600">平均薪酬</div>
                </div>
                
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-semibold text-blue-600">
                    {competitor.benefits_score}
                  </div>
                  <div className="text-xs text-blue-700">福利评分</div>
                </div>
                
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-semibold text-green-600">
                    {competitor.culture_score}
                  </div>
                  <div className="text-xs text-green-700">文化评分</div>
                </div>
              </div>

              {/* 竞争优势 */}
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">核心优势</h4>
                <div className="flex flex-wrap gap-2">
                  {competitor.key_advantages.map((advantage) => (
                    <span key={advantage} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      {advantage}
                    </span>
                  ))}
                </div>
              </div>

              {/* 薪酬趋势 */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <span className="text-sm text-gray-600">薪酬趋势</span>
                <div className="flex items-center space-x-1">
                  {competitor.salary_trend === 'up' ? (
                    <ArrowTrendingUpIcon className="w-4 h-4 text-green-600" />
                  ) : competitor.salary_trend === 'down' ? (
                    <ArrowTrendingDownIcon className="w-4 h-4 text-red-600" />
                  ) : (
                    <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                  )}
                  <span className={`text-sm font-medium ${
                    competitor.salary_trend === 'up' ? 'text-green-600' :
                    competitor.salary_trend === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {competitor.salary_trend === 'up' ? '上升' :
                     competitor.salary_trend === 'down' ? '下降' : '稳定'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 市场预警组件
const AlertsSection: React.FC<{ alerts: MarketAlert[] }> = ({ alerts }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-orange-200 bg-orange-50';
      case 'low': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />;
      case 'medium': return <InformationCircleIcon className="w-5 h-5 text-orange-600" />;
      case 'low': return <InformationCircleIcon className="w-5 h-5 text-blue-600" />;
      default: return <InformationCircleIcon className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">市场预警中心</h2>
        <p className="text-gray-600">实时监控市场动态，预警人才流失风险</p>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div key={alert.id} className={`border rounded-2xl p-6 ${getSeverityColor(alert.severity)}`}>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-1">
                {getSeverityIcon(alert.severity)}
              </div>
              
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                    <p className="text-gray-600 mt-1">{alert.description}</p>
                  </div>
                  
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      alert.severity === 'high' ? 'bg-red-100 text-red-700' :
                      alert.severity === 'medium' ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {alert.severity === 'high' ? '高优先级' :
                       alert.severity === 'medium' ? '中优先级' : '低优先级'}
                    </span>
                  </div>
                </div>

                {/* 受影响岗位 */}
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-900">受影响岗位</div>
                  <div className="flex flex-wrap gap-2">
                    {alert.affected_positions.map((position) => (
                      <span key={position} className="px-2 py-1 bg-white text-gray-900 text-xs rounded border">
                        {position}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 建议行动 */}
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <div className="text-sm font-medium text-gray-900 mb-1">建议行动</div>
                  <div className="text-sm text-gray-600">{alert.recommended_action}</div>
                </div>

                <div className="text-xs text-gray-600">
                  {new Date(alert.created_at).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {alerts.length === 0 && (
        <div className="text-center py-20">
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="p-4 bg-gray-100 rounded-2xl">
                <ExclamationTriangleIcon className="w-12 h-12 text-gray-400" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无预警</h3>
              <p className="text-gray-600">当前市场状况良好，暂无需要关注的预警信息</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function getRiskLevelColor(risk_level: string): string {
  switch (risk_level) {
    case 'critical': return 'text-red-600 bg-red-100';
    case 'high': return 'text-orange-600 bg-orange-100';
    case 'medium': return 'text-yellow-600 bg-yellow-100';
    case 'low': return 'text-green-600 bg-green-100';
    default: return 'text-gray-600 bg-gray-100';
  }
}
