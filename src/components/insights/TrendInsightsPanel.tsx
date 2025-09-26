/**
 * MARC 趋势洞察面板组件
 * 显示薪酬趋势的关键洞察和预测分析
 */

import React from 'react';
import { 
  TrendingUpIcon, 
  TrendingDownIcon, 
  MinusIcon,
  CalendarIcon,
  ActivityIcon,
  AlertTriangleIcon,
  InfoIcon,
  SparklesIcon
} from 'lucide-react';
import { SalaryTrendData } from '@/data/mockTimeSeriesGenerator';

interface TrendInsightsPanelProps {
  data: SalaryTrendData;
  className?: string;
}

export const TrendInsightsPanel: React.FC<TrendInsightsPanelProps> = ({ 
  data, 
  className = '' 
}) => {
  const { insights, timeSeries } = data;
  
  // 计算最新薪酬数据
  const latestData = timeSeries[timeSeries.length - 1];
  const previousData = timeSeries[timeSeries.length - 2];
  const monthlyChange = latestData && previousData 
    ? ((latestData.salaryStats.median - previousData.salaryStats.median) / previousData.salaryStats.median * 100)
    : 0;

  // 获取趋势图标和颜色 - DSP品牌配色
  const getTrendDisplay = (trend: string) => {
    switch (trend) {
      case 'rising':
        return {
          icon: TrendingUpIcon,
          color: 'text-dsp-red',
          bgColor: 'bg-white',
          borderColor: 'border-dsp-red',
          label: '上升趋势',
          description: '薪酬呈现持续上涨态势'
        };
      case 'declining':
        return {
          icon: TrendingDownIcon,
          color: 'text-dsp-dark',
          bgColor: 'bg-white',
          borderColor: 'border-dsp-dark',
          label: '下降趋势',
          description: '薪酬出现下滑压力'
        };
      default:
        return {
          icon: MinusIcon,
          color: 'text-dsp-gray',
          bgColor: 'bg-white',
          borderColor: 'border-gray-200',
          label: '稳定趋势',
          description: '薪酬保持相对稳定'
        };
    }
  };

  const trendDisplay = getTrendDisplay(insights.trend);

  // 格式化百分比
  const formatPercentage = (value: number) => {
    const formatted = (value * 100).toFixed(1);
    return value >= 0 ? `+${formatted}%` : `${formatted}%`;
  };

  // 获取波动性描述 - DSP品牌配色
  const getVolatilityLevel = (volatility: number) => {
    if (volatility < 0.05) return { level: '低', color: 'text-dsp-gray', description: '薪酬变化平稳' };
    if (volatility < 0.1) return { level: '中', color: 'text-dsp-red', description: '薪酬有一定波动' };
    return { level: '高', color: 'text-dsp-dark', description: '薪酬波动较大' };
  };

  const volatilityInfo = getVolatilityLevel(insights.volatility);

  // 预测下个季度薪酬范围
  const generateForecast = () => {
    const currentMedian = latestData?.salaryStats.median || 0;
    const growthRate = insights.yearlyGrowthRate / 4; // 季度增长率
    const volatilityFactor = insights.volatility;
    
    const expectedMedian = currentMedian * (1 + growthRate);
    const lowerBound = expectedMedian * (1 - volatilityFactor);
    const upperBound = expectedMedian * (1 + volatilityFactor);
    
    return {
      expected: Math.round(expectedMedian),
      range: {
        lower: Math.round(lowerBound),
        upper: Math.round(upperBound)
      }
    };
  };

  const forecast = generateForecast();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 核心趋势指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 趋势状态 */}
        <div className={`p-4 rounded-lg border ${trendDisplay.bgColor} ${trendDisplay.borderColor}`}>
          <div className="flex items-center">
            <trendDisplay.icon className={`w-5 h-5 ${trendDisplay.color} mr-2`} />
            <span className="text-sm font-medium text-dsp-dark">趋势状态</span>
          </div>
          <div className={`text-lg font-semibold ${trendDisplay.color} mt-1`}>
            {trendDisplay.label}
          </div>
          <div className="text-xs text-dsp-gray mt-1">
            {trendDisplay.description}
          </div>
        </div>

        {/* 月度变化 */}
        <div className="p-4 rounded-lg border bg-white border-gray-200">
          <div className="flex items-center">
            <CalendarIcon className="w-5 h-5 text-dsp-red mr-2" />
            <span className="text-sm font-medium text-dsp-dark">月度变化</span>
          </div>
          <div className={`text-lg font-semibold mt-1 ${
            monthlyChange >= 0 ? 'text-dsp-red' : 'text-dsp-dark'
          }`}>
            {formatPercentage(monthlyChange / 100)}
          </div>
          <div className="text-xs text-dsp-gray mt-1">
            环比上月变化
          </div>
        </div>

        {/* 年化增长率 */}
        <div className="p-4 rounded-lg border bg-white border-gray-200">
          <div className="flex items-center">
            <ActivityIcon className="w-5 h-5 text-dsp-red mr-2" />
            <span className="text-sm font-medium text-dsp-dark">年化增长</span>
          </div>
          <div className="text-lg font-semibold text-dsp-red mt-1">
            {formatPercentage(insights.yearlyGrowthRate)}
          </div>
          <div className="text-xs text-dsp-gray mt-1">
            过去12个月增长率
          </div>
        </div>

        {/* 波动性 */}
        <div className="p-4 rounded-lg border bg-white border-gray-200">
          <div className="flex items-center">
            <AlertTriangleIcon className="w-5 h-5 text-dsp-red mr-2" />
            <span className="text-sm font-medium text-dsp-dark">波动性</span>
          </div>
          <div className={`text-lg font-semibold mt-1 ${volatilityInfo.color}`}>
            {volatilityInfo.level}
          </div>
          <div className="text-xs text-dsp-gray mt-1">
            {volatilityInfo.description}
          </div>
        </div>
      </div>

      {/* 季节性分析和预测 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 季节性模式 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <InfoIcon className="w-5 h-5 text-dsp-red mr-2" />
            <h4 className="text-lg font-semibold text-dsp-dark">季节性模式</h4>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-dsp-dark mb-2">
                {insights.seasonality}
              </div>
              <div className="text-xs text-dsp-gray">
                基于过去24个月的数据分析，该职位薪酬呈现明显的季节性变化特征
              </div>
            </div>
            
            <div className="text-sm text-dsp-gray">
              <strong className="text-dsp-dark">建议：</strong>
              {insights.seasonality.includes('Q4') && '年底是薪酬谈判的最佳时机'}
              {insights.seasonality.includes('Q1') && '年初适合寻求加薪或跳槽机会'}
              {insights.seasonality.includes('Q2') && '春季招聘旺季，薪酬竞争激烈'}
              {insights.seasonality.includes('Q3') && '夏季相对平稳，适合技能提升'}
            </div>
          </div>
        </div>

        {/* 薪酬预测 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <SparklesIcon className="w-5 h-5 text-dsp-red mr-2" />
            <h4 className="text-lg font-semibold text-dsp-dark">下季度预测</h4>
          </div>
          
          <div className="space-y-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-dsp-red mb-1">
                ¥{forecast.expected.toLocaleString()}
              </div>
              <div className="text-sm text-dsp-gray">
                预期薪酬中位数
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-lg font-semibold text-dsp-dark">
                  ¥{forecast.range.lower.toLocaleString()}
                </div>
                <div className="text-xs text-dsp-gray">保守估计</div>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-lg font-semibold text-dsp-dark">
                  ¥{forecast.range.upper.toLocaleString()}
                </div>
                <div className="text-xs text-dsp-gray">乐观估计</div>
              </div>
            </div>
            
            <div className="text-xs text-dsp-gray text-center">
              * 基于历史趋势和市场波动性的AI预测
            </div>
          </div>
        </div>
      </div>

      {/* 关键事件影响 */}
      {insights.keyEvents && insights.keyEvents.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <AlertTriangleIcon className="w-5 h-5 text-dsp-red mr-2" />
            <h4 className="text-lg font-semibold text-dsp-dark">市场事件影响</h4>
          </div>
          
          <div className="space-y-3">
            {insights.keyEvents.map((event, index) => (
              <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="w-2 h-2 bg-dsp-red rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="font-medium text-dsp-dark text-sm mb-1">
                    {event.date}
                  </div>
                  <div className="text-sm text-dsp-gray">
                    {event.event}
                  </div>
                  <div className="text-xs text-dsp-gray mt-1">
                    预估影响: {formatPercentage(event.impact)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};