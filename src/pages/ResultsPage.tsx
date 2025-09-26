/**
 * MARC 查询结果页面
 * 展示薪酬分析结果，包括时序趋势分析
 */

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  ChartBarIcon,
  MapPinIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { SalaryTrendChart } from '@/components/charts/SalaryTrendChart';
import { TrendInsightsPanel } from '@/components/insights/TrendInsightsPanel';
import { generateSalaryTimeSeries } from '@/data/mockTimeSeriesGenerator';
import type { SalaryTrendData } from '@/data/mockTimeSeriesGenerator';

interface QueryParams {
  position: string;
  location: string;
  experience: string;
  education: string;
  industry: string;
}

export const ResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [trendData, setTrendData] = useState<SalaryTrendData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // 从路由状态获取查询参数
  const queryParams = location.state as QueryParams || {
    position: '高级前端工程师',
    location: '北京',
    experience: '3-5年',
    education: '本科',
    industry: '互联网'
  };

  // 生成趋势数据
  useEffect(() => {
    const generateData = async () => {
      setIsLoading(true);
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const data = generateSalaryTimeSeries(
        queryParams.position,
        queryParams.location,
        queryParams.experience,
        24 // 24个月数据
      );
      
      setTrendData(data);
      setIsLoading(false);
    };

    generateData();
  }, [queryParams]);

  // 计算当前薪酬概览数据
  const getSalaryOverview = () => {
    if (!trendData || trendData.timeSeries.length === 0) return null;
    
    const latestData = trendData.timeSeries[trendData.timeSeries.length - 1];
    return latestData.salaryStats;
  };

  const salaryOverview = getSalaryOverview();

  const handleGoBack = () => {
    navigate('/query', { state: queryParams });
  };

  const handleExportReport = () => {
    // 实现报告导出功能
    console.log('Exporting report...');
  };

  const handleShareResults = () => {
    // 实现结果分享功能
    if (navigator.share) {
      navigator.share({
        title: `MARC薪酬报告 - ${queryParams.position}`,
        text: `查看${queryParams.position}在${queryParams.location}的薪酬趋势分析`,
        url: window.location.href
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container py-8">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (!trendData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-dsp-dark mb-4">
            数据加载失败
          </h2>
          <button
            onClick={handleGoBack}
            className="px-6 py-3 bg-dsp-red hover:bg-primary-700 text-white text-sm font-medium rounded-md transition-colors"
          >
            返回查询
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-white">
      <div className="container max-w-7xl">
        {/* 页面头部 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={handleGoBack}
              className="flex items-center space-x-2 text-dsp-gray hover:text-dsp-dark transition-colors px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span>重新查询</span>
            </button>
            
            <div className="flex gap-3">
              <button
                onClick={handleShareResults}
                className="px-4 py-2 text-dsp-gray hover:text-dsp-dark transition-colors rounded-lg hover:bg-gray-50"
              >
                分享报告
              </button>
              <button
                onClick={handleExportReport}
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors rounded-lg font-medium"
              >
                导出报告
              </button>
            </div>
          </div>

          {/* 查询条件摘要 */}
          <div className="bg-white border-2 border-gray-100 rounded-3xl p-8 shadow-lg mb-8">
            <div className="flex items-center space-x-4 mb-8">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl">
                <ChartBarIcon className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-semibold text-dsp-dark">
                  薪酬分析报告
                </h1>
                <p className="text-dsp-gray mt-2">基于海量数据的智能薪酬分析</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl">
                <BriefcaseIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <div className="text-blue-600 text-sm font-medium">职位</div>
                  <div className="font-semibold text-dsp-dark">{queryParams.position}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl">
                <MapPinIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <div className="text-green-600 text-sm font-medium">地点</div>
                  <div className="font-semibold text-dsp-dark">{queryParams.location}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-xl">
                <ClockIcon className="w-5 h-5 text-orange-600 flex-shrink-0" />
                <div>
                  <div className="text-orange-600 text-sm font-medium">经验</div>
                  <div className="font-semibold text-dsp-dark">{queryParams.experience}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-xl">
                <AcademicCapIcon className="w-5 h-5 text-purple-600 flex-shrink-0" />
                <div>
                  <div className="text-purple-600 text-sm font-medium">学历</div>
                  <div className="font-semibold text-dsp-dark">{queryParams.education}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 薪酬概览卡片 */}
        {salaryOverview && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <SalaryCard
              title="薪酬中位数"
              value={`¥${salaryOverview.median.toLocaleString()}`}
              subtitle="50%的人薪酬在此水平"
              color="primary"
            />
            <SalaryCard
              title="75分位数"
              value={`¥${salaryOverview.p75.toLocaleString()}`}
              subtitle="25%的人薪酬高于此"
              color="accent"
            />
            <SalaryCard
              title="90分位数"
              value={`¥${salaryOverview.p90.toLocaleString()}`}
              subtitle="10%的人薪酬高于此"
              color="green"
            />
            <SalaryCard
              title="样本数量"
              value={salaryOverview.sampleSize.toLocaleString()}
              subtitle="本月统计样本"
              color="neutral"
            />
          </div>
        )}

        {/* 时序趋势图表 */}
        <div className="mb-8">
          <SalaryTrendChart data={trendData} />
        </div>

        {/* 趋势洞察面板 */}
        <TrendInsightsPanel data={trendData} />
      </div>
    </div>
  );
};

// DSP 风格薪酬概览卡片组件
const SalaryCard: React.FC<{
  title: string;
  value: string;
  subtitle: string;
  color: 'primary' | 'accent' | 'green' | 'neutral';
}> = ({ title, value, subtitle }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
      <div className="text-sm text-dsp-gray mb-3">
        {title}
      </div>
      <div className="text-2xl font-semibold text-dsp-red mb-2">
        {value}
      </div>
      <div className="text-xs text-dsp-gray">
        {subtitle}
      </div>
    </div>
  );
};

// DSP 风格加载骨架屏组件
const LoadingSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse space-y-8">
      {/* 头部骨架 */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>

      {/* 概览卡片骨架 */}
      <div className="grid grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-6">
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-full mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>

      {/* 图表骨架 */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="h-80 bg-gray-200 rounded"></div>
      </div>

      {/* 洞察面板骨架 */}
      <div className="grid grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-6">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};