/**
 * MARC 薪酬时序数据生成器
 * 生成包含趋势、季节性、事件影响的模拟薪酬数据
 */

import { addMonths, format, startOfMonth } from 'date-fns';

export interface TimeSeriesDataPoint {
  period: string;
  timestamp: Date;
  salaryStats: {
    median: number;
    p25: number;
    p75: number;
    p90: number;
    average: number;
    sampleSize: number;
  };
  marketMetrics: {
    jobPostings: number;
    competitionIndex: number;
    demandGrowth: number;
  };
}

export interface SalaryTrendData {
  position: string;
  location: string;
  experience: string;
  timeSeries: TimeSeriesDataPoint[];
  insights: {
    trend: 'rising' | 'stable' | 'declining';
    yearlyGrowthRate: number;
    volatility: number;
    seasonality: string;
    keyEvents: Array<{
      date: string;
      event: string;
      impact: number;
    }>;
  };
}

interface TrendConfig {
  baseMedian: number;
  yearlyGrowthRate: number; // 年增长率
  volatility: number; // 波动性 0-1
  seasonalityAmplitude: number; // 季节性振幅
  seasonalityPhase: number; // 季节性相位
}

/**
 * 生成带趋势的薪酬时序数据
 */
export const generateSalaryTimeSeries = (
  position: string,
  location: string,
  experience: string,
  monthsBack: number = 24
): SalaryTrendData => {
  
  // 根据职位和地区设定基础参数
  const config = getTrendConfig(position, location, experience);
  
  const timeSeries: TimeSeriesDataPoint[] = [];
  const currentDate = new Date();
  
  // 模拟关键事件
  const keyEvents = generateKeyEvents(position, monthsBack);
  
  for (let i = monthsBack; i >= 0; i--) {
    const date = startOfMonth(addMonths(currentDate, -i));
    const monthsFromStart = monthsBack - i;
    
    // 基础趋势计算
    const trendComponent = config.baseMedian * 
      Math.pow(1 + config.yearlyGrowthRate / 12, monthsFromStart);
    
    // 季节性组件
    const seasonalComponent = config.seasonalityAmplitude * 
      Math.sin(2 * Math.PI * monthsFromStart / 12 + config.seasonalityPhase);
    
    // 随机波动
    const randomComponent = (Math.random() - 0.5) * config.volatility * config.baseMedian;
    
    // 事件影响
    const eventImpact = calculateEventImpact(date, keyEvents, config.baseMedian);
    
    // 最终薪酬中位数
    const median = Math.round(
      trendComponent + seasonalComponent + randomComponent + eventImpact
    );
    
    // 生成其他分位数
    const p25 = Math.round(median * 0.85);
    const p75 = Math.round(median * 1.18);
    const p90 = Math.round(median * 1.35);
    const average = Math.round(median * 1.08);
    
    // 样本量模拟（基于市场活跃度）
    const baseSampleSize = getBaseSampleSize(position, location);
    const seasonalMultiplier = 1 + 0.3 * Math.sin(2 * Math.PI * monthsFromStart / 12 + Math.PI/4);
    const sampleSize = Math.round(baseSampleSize * seasonalMultiplier * (0.8 + 0.4 * Math.random()));
    
    // 市场指标
    const jobPostings = Math.round(sampleSize * (1.2 + 0.8 * Math.random()));
    const competitionIndex = Math.round(50 + 30 * Math.sin(2 * Math.PI * monthsFromStart / 12) + 20 * Math.random());
    const demandGrowth = (Math.random() - 0.5) * 0.4; // -20% to +20%
    
    timeSeries.push({
      period: format(date, 'yyyy-MM'),
      timestamp: date,
      salaryStats: {
        median,
        p25,
        p75, 
        p90,
        average,
        sampleSize
      },
      marketMetrics: {
        jobPostings,
        competitionIndex,
        demandGrowth
      }
    });
  }
  
  // 生成洞察分析
  const insights = generateInsights(timeSeries, keyEvents, config);
  
  return {
    position,
    location,
    experience,
    timeSeries,
    insights
  };
};

/**
 * 根据职位特征获取趋势配置
 */
const getTrendConfig = (position: string, location: string, experience: string): TrendConfig => {
  // AI/技术职位通常增长较快，波动较大
  if (position.includes('AI') || position.includes('算法') || position.includes('机器学习')) {
    return {
      baseMedian: getBaseMedian(position, location, experience),
      yearlyGrowthRate: 0.15 + Math.random() * 0.1, // 15-25%
      volatility: 0.12,
      seasonalityAmplitude: 1200,
      seasonalityPhase: Math.PI / 4 // Q4峰值
    };
  }
  
  // 传统技术职位
  if (position.includes('工程师') || position.includes('开发')) {
    return {
      baseMedian: getBaseMedian(position, location, experience),
      yearlyGrowthRate: 0.08 + Math.random() * 0.06, // 8-14%
      volatility: 0.08,
      seasonalityAmplitude: 800,
      seasonalityPhase: Math.PI / 6
    };
  }
  
  // 管理职位
  if (position.includes('经理') || position.includes('总监')) {
    return {
      baseMedian: getBaseMedian(position, location, experience),
      yearlyGrowthRate: 0.06 + Math.random() * 0.04, // 6-10%
      volatility: 0.06,
      seasonalityAmplitude: 1500,
      seasonalityPhase: -Math.PI / 4 // Q1峰值
    };
  }
  
  // 默认配置
  return {
    baseMedian: getBaseMedian(position, location, experience),
    yearlyGrowthRate: 0.05 + Math.random() * 0.03, // 5-8%
    volatility: 0.05,
    seasonalityAmplitude: 600,
    seasonalityPhase: 0
  };
};

/**
 * 获取基础薪酬中位数
 */
const getBaseMedian = (position: string, location: string, experience: string): number => {
  let base = 15000; // 基础薪酬
  
  // 职位影响
  if (position.includes('高级') || position.includes('资深')) base *= 1.4;
  if (position.includes('专家') || position.includes('架构师')) base *= 1.6;
  if (position.includes('总监') || position.includes('经理')) base *= 1.8;
  if (position.includes('AI') || position.includes('算法')) base *= 1.3;
  
  // 城市影响
  const cityMultipliers: Record<string, number> = {
    '北京': 1.2,
    '上海': 1.18,
    '深圳': 1.15,
    '杭州': 1.1,
    '广州': 1.05,
    '成都': 0.9,
    '武汉': 0.85,
    '西安': 0.8
  };
  base *= cityMultipliers[location] || 1.0;
  
  // 经验影响
  if (experience.includes('1-3年')) base *= 1.0;
  if (experience.includes('3-5年')) base *= 1.3;
  if (experience.includes('5-10年')) base *= 1.6;
  if (experience.includes('10年以上')) base *= 2.0;
  
  return Math.round(base);
};

/**
 * 获取基础样本量
 */
const getBaseSampleSize = (position: string, location: string): number => {
  let base = 100;
  
  // 热门职位样本更多
  if (position.includes('前端') || position.includes('Java') || position.includes('Python')) base *= 2;
  if (position.includes('AI') || position.includes('算法')) base *= 1.5;
  
  // 一线城市样本更多
  if (['北京', '上海', '深圳'].includes(location)) base *= 1.8;
  if (['杭州', '广州'].includes(location)) base *= 1.4;
  
  return Math.round(base);
};

/**
 * 生成关键市场事件
 */
const generateKeyEvents = (position: string, _monthsBack: number) => {
  const events = [];
  const currentDate = new Date();
  
  // 技术类职位的事件
  if (position.includes('AI') || position.includes('算法')) {
    events.push({
      date: format(addMonths(currentDate, -6), 'yyyy-MM'),
      event: 'ChatGPT热潮推动AI人才需求激增',
      impact: 0.2 // 20%薪酬提升
    });
  }
  
  if (position.includes('前端') || position.includes('全栈')) {
    events.push({
      date: format(addMonths(currentDate, -12), 'yyyy-MM'),
      event: '元宇宙概念带动前端技术需求',
      impact: 0.1
    });
  }
  
  // 通用事件
  events.push({
    date: format(addMonths(currentDate, -18), 'yyyy-MM'),
    event: '疫情后经济复苏，科技行业薪酬反弹',
    impact: 0.15
  });
  
  return events;
};

/**
 * 计算事件对薪酬的影响
 */
const calculateEventImpact = (date: Date, events: any[], baseMedian: number): number => {
  let totalImpact = 0;
  
  events.forEach(event => {
    const eventDate = new Date(event.date);
    const monthsDiff = (date.getTime() - eventDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
    
    if (monthsDiff >= 0 && monthsDiff <= 6) {
      // 事件影响在6个月内逐渐衰减
      const decay = Math.exp(-monthsDiff / 3);
      totalImpact += baseMedian * event.impact * decay;
    }
  });
  
  return totalImpact;
};

/**
 * 生成趋势洞察
 */
const generateInsights = (timeSeries: TimeSeriesDataPoint[], keyEvents: any[], config: TrendConfig) => {
  const medians = timeSeries.map(d => d.salaryStats.median);
  const recent6Months = medians.slice(-6);
  const previous6Months = medians.slice(-12, -6);
  
  // 计算趋势
  const recentAvg = recent6Months.reduce((a, b) => a + b, 0) / recent6Months.length;
  const previousAvg = previous6Months.reduce((a, b) => a + b, 0) / previous6Months.length;
  const growthRate = (recentAvg - previousAvg) / previousAvg;
  
  let trend: 'rising' | 'stable' | 'declining' = 'stable';
  if (growthRate > 0.03) trend = 'rising';
  if (growthRate < -0.03) trend = 'declining';
  
  // 计算波动性
  const volatility = calculateVolatility(medians);
  
  // 季节性分析
  const seasonality = analyzeSeasonality(timeSeries);
  
  return {
    trend,
    yearlyGrowthRate: config.yearlyGrowthRate,
    volatility,
    seasonality,
    keyEvents
  };
};

/**
 * 计算波动性
 */
const calculateVolatility = (values: number[]): number => {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  return Math.sqrt(variance) / mean;
};

/**
 * 分析季节性模式
 */
const analyzeSeasonality = (timeSeries: TimeSeriesDataPoint[]): string => {
  const monthlyAvg: Record<number, number[]> = {};
  
  timeSeries.forEach(point => {
    const month = point.timestamp.getMonth();
    if (!monthlyAvg[month]) monthlyAvg[month] = [];
    monthlyAvg[month].push(point.salaryStats.median);
  });
  
  const monthlyMeans = Object.keys(monthlyAvg).map(month => ({
    month: parseInt(month),
    avg: monthlyAvg[parseInt(month)].reduce((a, b) => a + b, 0) / monthlyAvg[parseInt(month)].length
  }));
  
  const maxMonth = monthlyMeans.reduce((prev, curr) => prev.avg > curr.avg ? prev : curr);
  const minMonth = monthlyMeans.reduce((prev, curr) => prev.avg < curr.avg ? prev : curr);
  
  const seasons = ['Q1', 'Q1', 'Q1', 'Q2', 'Q2', 'Q2', 'Q3', 'Q3', 'Q3', 'Q4', 'Q4', 'Q4'];
  
  return `${seasons[maxMonth.month]}高峰，${seasons[minMonth.month]}低谷`;
};

/**
 * 预设数据生成
 */
export const generatePresetTimeSeriesData = () => {
  return [
    generateSalaryTimeSeries('高级前端工程师', '北京', '3-5年', 24),
    generateSalaryTimeSeries('AI算法工程师', '上海', '5-10年', 24),
    generateSalaryTimeSeries('全栈开发工程师', '深圳', '1-3年', 24),
    generateSalaryTimeSeries('产品经理', '杭州', '3-5年', 24),
    generateSalaryTimeSeries('数据科学家', '北京', '5-10年', 24)
  ];
};