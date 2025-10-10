/**
 * 薪酬分析结果页面
 * 基于动态数据分析提供个性化薪酬报告
 */

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BriefcaseIcon,
  StarIcon,
  LightBulbIcon,
  ArrowLeftIcon,
  ClockIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { SalaryAnalysisEngine, SalaryAnalysisResult } from '@/data/salaryAnalysisEngine';
import { deepseekApi } from '@/services/deepseekApi';
import { BarChart, LineChart, PieChart, RadarChart, TrendChart } from '@/components/charts/SalaryChart';
import { PDFExporter } from '@/utils/pdfExport';
import { HTMLExporter } from '@/utils/htmlExport';
import { useNotification } from '@/components/Notification';

export const SalaryAnalysisResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const notification = useNotification();
  const [analysisResult, setAnalysisResult] = useState<SalaryAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'factors' | 'trends' | 'recommendations'>('overview');
  const [isExporting, setIsExporting] = useState(false);

  const queryData = location.state;

  useEffect(() => {
    if (!queryData) {
      navigate('/query');
      return;
    }

    analyzeWithRealAI();
  }, [queryData, navigate]);

  const analyzeWithRealAI = async () => {
    setLoading(true);
    try {
      // 调用真实的DeepSeek API进行薪酬分析
      const aiResponse = await deepseekApi.salaryCalculation({
        position: queryData.position || '通用职位',
        location: queryData.location || '北京',
        experience: `${queryData.experience || 3}年`,
        education: queryData.education || '本科',
        industry: queryData.industry || '互联网',
        skills: queryData.skills?.length > 0 ? queryData.skills : ['通用技能'],
        companySize: queryData.company_size || '100-499人',
        jobLevel: queryData.job_level || '中级'
      });

      // 使用AI分析结果结合本地引擎生成完整报告
      const localResult = SalaryAnalysisEngine.analyzeSalary(queryData);
      
      // 整合AI分析结果
      const enhancedResult: SalaryAnalysisResult = {
        ...localResult,
        // 使用AI的薪资范围更新估算薪资
        estimatedSalary: aiResponse.salaryRange ? {
          min: aiResponse.salaryRange.min,
          max: aiResponse.salaryRange.max,
          median: aiResponse.salaryRange.median,
          confidence: localResult.estimatedSalary.confidence
        } : localResult.estimatedSalary,
        // 整合AI的影响因素
        factors: {
          positive: aiResponse.factors?.filter(f => f.impact.includes('正面') || f.impact.includes('积极')).map(factor => ({
            factor: factor.factor,
            impact: factor.weight,
            explanation: `AI分析: ${factor.impact}`
          })) || localResult.factors.positive,
          negative: aiResponse.factors?.filter(f => f.impact.includes('负面') || f.impact.includes('消极')).map(factor => ({
            factor: factor.factor,
            impact: factor.weight,
            explanation: `AI分析: ${factor.impact}`
          })) || localResult.factors.negative
        },
        // 使用AI的建议
        recommendations: aiResponse.recommendations || localResult.recommendations
      };

      setAnalysisResult(enhancedResult);
    } catch (error) {
      console.error('AI分析失败，使用本地分析:', error);
      // 如果AI分析失败，回退到本地分析
      const result = SalaryAnalysisEngine.analyzeSalary(queryData);
      setAnalysisResult(result);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-dsp-dark mb-2">AI正在分析中...</h2>
          <p className="text-dsp-gray">正在结合最新市场数据为您生成个性化薪酬报告</p>
        </div>
      </div>
    );
  }

  if (!analysisResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-dsp-dark mb-2">分析失败</h2>
          <p className="text-dsp-gray mb-4">抱歉，无法生成薪酬分析报告</p>
          <button
            onClick={() => navigate('/query')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            重新查询
          </button>
        </div>
      </div>
    );
  }

  const formatSalary = (amount: number) => {
    return `¥${(amount / 1000).toFixed(1)}K`;
  };

  // PDF导出处理函数
  const handleExportPDF = async () => {
    if (!analysisResult || !queryData) {
      notification.error('导出失败', '分析数据不完整，请重新查询后再试');
      return;
    }

    setIsExporting(true);
    
    // 显示导出指导信息
    notification.info(
      'PDF导出指南', 
      '即将打开打印界面，请在打印选项中选择"保存为PDF"来下载报告'
    );
    
    try {
      const filename = `薪酬分析报告_${queryData.position}_${queryData.location}_${new Date().toISOString().split('T')[0]}`;
      
      await PDFExporter.exportSalaryReport(analysisResult, queryData, {
        filename,
        includeCharts: true,
        includeDataTable: true,
        format: 'A4',
        orientation: 'portrait'
      });
      
      // 显示后续操作提示
      notification.success(
        '打印界面已打开', 
        '请在打印对话框中选择"保存为PDF"，然后选择保存位置完成下载'
      );
      
    } catch (error) {
      console.error('PDF导出失败:', error);
      notification.error(
        '导出失败', 
        error instanceof Error ? error.message : '无法打开打印界面，请检查浏览器的弹窗拦截设置'
      );
    } finally {
      setIsExporting(false);
    }
  };

  // HTML导出处理函数
  const handleExportHTML = async () => {
    if (!analysisResult || !queryData) {
      notification.error('导出失败', '分析数据不完整，请重新查询后再试');
      return;
    }

    setIsExporting(true);
    
    try {
      const filename = `薪酬分析报告_${queryData.position}_${queryData.location}_${new Date().toISOString().split('T')[0]}`;
      
      await HTMLExporter.exportSalaryReport(analysisResult, queryData, {
        filename,
        includeStyles: true,
        standalone: true
      });
      
      notification.success(
        '导出成功', 
        'HTML报告已下载到您的设备！您可以用浏览器打开查看，或者在打开后打印为PDF'
      );
      
    } catch (error) {
      console.error('HTML导出失败:', error);
      notification.error(
        '导出失败', 
        error instanceof Error ? error.message : 'HTML导出失败，请重试'
      );
    } finally {
      setIsExporting(false);
    }
  };

  const getMarketPositionColor = (position: string) => {
    switch (position) {
      case 'above_market':
        return 'text-green-600 bg-green-100';
      case 'market_average':
        return 'text-blue-600 bg-blue-100';
      case 'below_market':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getMarketPositionText = (position: string) => {
    switch (position) {
      case 'above_market':
        return '高于市场平均';
      case 'market_average':
        return '接近市场平均';
      case 'below_market':
        return '低于市场平均';
      default:
        return '市场平均';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => navigate('/query')}
            className="flex items-center space-x-2 text-dsp-gray hover:text-dsp-dark transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>返回查询</span>
          </button>
          <div className="h-6 w-0.5 bg-gray-300"></div>
          <h1 className="text-2xl font-bold text-dsp-dark">薪酬分析报告</h1>
        </div>

        {/* 基本信息卡片 */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 职位信息 */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <BriefcaseIcon className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-dsp-dark">查询职位</h3>
              </div>
              <div className="space-y-2 text-sm text-dsp-gray">
                <p><span className="font-medium">行业:</span> {queryData.industry}</p>
                <p><span className="font-medium">职位:</span> {queryData.position}</p>
                <p><span className="font-medium">地点:</span> {queryData.location}</p>
                <p><span className="font-medium">经验:</span> {queryData.experience}</p>
                <p><span className="font-medium">学历:</span> {queryData.education}</p>
              </div>
            </div>

            {/* 薪酬估算 */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-dsp-dark">薪酬估算</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getMarketPositionColor(analysisResult.marketPosition)}`}>
                  {getMarketPositionText(analysisResult.marketPosition)}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-lg font-bold text-dsp-dark">
                    {formatSalary(analysisResult.estimatedSalary.min)}
                  </div>
                  <div className="text-sm text-dsp-gray">最低估算</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatSalary(analysisResult.estimatedSalary.median)}
                  </div>
                  <div className="text-sm text-blue-600 font-medium">期望薪酬</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-lg font-bold text-dsp-dark">
                    {formatSalary(analysisResult.estimatedSalary.max)}
                  </div>
                  <div className="text-sm text-dsp-gray">最高估算</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-500" />
                  <span className="text-dsp-gray">
                    置信度: <span className="font-medium text-dsp-dark">{analysisResult.estimatedSalary.confidence}%</span>
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <ClockIcon className="w-4 h-4 text-blue-500" />
                  <span className="text-dsp-gray">
                    数据更新: <span className="font-medium text-dsp-dark">{analysisResult.dataQuality.lastUpdated}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 标签页导航 */}
        <div className="flex space-x-1 bg-gray-100 rounded-xl p-1 mb-8">
          {[
            { key: 'overview', label: '概览', icon: ChartBarIcon },
            { key: 'factors', label: '影响因素', icon: StarIcon },
            { key: 'trends', label: '趋势分析', icon: ArrowTrendingUpIcon },
            { key: 'recommendations', label: '建议', icon: LightBulbIcon }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all flex-1 justify-center ${
                activeTab === tab.key
                  ? 'bg-white text-blue-600 shadow-sm font-medium'
                  : 'text-dsp-gray hover:text-dsp-dark'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* 标签页内容 */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 数据质量 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <InformationCircleIcon className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-dsp-dark">数据质量</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-xl font-bold text-blue-600">
                    {analysisResult.dataQuality.sampleSize.toLocaleString()}
                  </div>
                  <div className="text-sm text-dsp-gray">样本数量</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-xl font-bold text-green-600">
                    {analysisResult.dataQuality.accuracy.toFixed(1)}%
                  </div>
                  <div className="text-sm text-dsp-gray">准确率</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-xl">
                  <div className="text-xl font-bold text-orange-600">
                    {analysisResult.estimatedSalary.confidence}%
                  </div>
                  <div className="text-sm text-dsp-gray">置信度</div>
                </div>
              </div>
            </div>

            {/* 薪酬分布图表 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <PieChart
                  data={analysisResult.chartData.salaryDistribution}
                  valueKey="percentage"
                  labelKey="range"
                  title="薪酬分布情况"
                  width={400}
                  height={350}
                  colors={['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']}
                />
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <BarChart
                  data={analysisResult.chartData.marketComparison}
                  xKey="city"
                  yKey="avgSalary"
                  title="主要城市薪酬对比"
                  width={400}
                  height={350}
                  color="#10B981"
                />
              </div>
            </div>

            {/* 历史趋势图 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <TrendChart
                data={analysisResult.chartData.historicalTrends.map(item => ({
                  year: item.year,
                  value: item.avgSalary,
                  trend: item.trend
                }))}
                title="近5年薪酬和就业趋势"
                width={800}
                height={400}
                color="#3B82F6"
              />
            </div>

            {/* 对比分析 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <ChartBarIcon className="w-6 h-6 text-purple-600" />
                <h3 className="text-lg font-semibold text-dsp-dark">对比分析</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                    <span className="text-dsp-gray">同城市其他行业</span>
                    <span className="font-bold text-dsp-dark">
                      {formatSalary(analysisResult.comparisons.sameCityDifferentIndustry)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                    <span className="text-dsp-gray">同行业其他城市</span>
                    <span className="font-bold text-dsp-dark">
                      {formatSalary(analysisResult.comparisons.sameIndustryDifferentCity)}
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-dsp-dark mb-3">职业发展路径</h4>
                  <div className="space-y-2">
                    {analysisResult.comparisons.careerProgression.map((progression, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                        <div>
                          <div className="font-medium text-dsp-dark">{progression.nextLevel}</div>
                          <div className="text-sm text-dsp-gray">{progression.timeToReach}</div>
                        </div>
                        <div className="text-green-600 font-bold">
                          +{formatSalary(progression.salaryIncrease)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 技能需求分析 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-dsp-dark mb-4">技能市场需求分析</h3>
                <BarChart
                  data={analysisResult.chartData.skillDemand}
                  xKey="skill"
                  yKey="demand"
                  title=""
                  width={800}
                  height={300}
                  color="#8B5CF6"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'factors' && (
          <div className="space-y-6">
            {/* 正面因素 */}
            {analysisResult.factors.positive.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <ArrowTrendingUpIcon className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-dsp-dark">正面影响因素</h3>
                </div>
                <div className="space-y-4">
                  {analysisResult.factors.positive.map((factor, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-green-50 rounded-xl">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 font-bold text-sm">+{factor.impact}%</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-dsp-dark mb-1">{factor.factor}</h4>
                        <p className="text-sm text-dsp-gray">{factor.explanation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 负面因素 */}
            {analysisResult.factors.negative.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <ArrowTrendingDownIcon className="w-6 h-6 text-orange-600" />
                  <h3 className="text-lg font-semibold text-dsp-dark">限制因素</h3>
                </div>
                <div className="space-y-4">
                  {analysisResult.factors.negative.map((factor, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-orange-50 rounded-xl">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-orange-600 font-bold text-sm">-{factor.impact}%</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-dsp-dark mb-1">{factor.factor}</h4>
                        <p className="text-sm text-dsp-gray">{factor.explanation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-6">
            {/* 市场趋势分析 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <ArrowTrendingUpIcon className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-dsp-dark">市场趋势分析</h3>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-dsp-dark mb-3 flex items-center">
                    <ClockIcon className="w-5 h-5 mr-2 text-blue-500" />
                    短期趋势（6-12个月）
                  </h4>
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <p className="text-dsp-gray">{analysisResult.trends.shortTerm}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-dsp-dark mb-3 flex items-center">
                    <ArrowTrendingUpIcon className="w-5 h-5 mr-2 text-green-500" />
                    长期前景（2-5年）
                  </h4>
                  <div className="p-4 bg-green-50 rounded-xl">
                    <p className="text-dsp-gray">{analysisResult.trends.longTerm}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium text-dsp-dark mb-3">成长潜力</h4>
                <div className="relative">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-4 rounded-full transition-all duration-1000"
                      style={{ width: `${analysisResult.trends.growthPotential}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-dsp-gray mt-2">
                    <span>较低</span>
                    <span className="font-medium text-dsp-dark">{analysisResult.trends.growthPotential}%</span>
                    <span>很高</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 行业就业趋势图 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-dsp-dark mb-4">行业就业增长趋势</h3>
                <LineChart
                  data={analysisResult.chartData.industryGrowth}
                  xKey="year"
                  yKey="value"
                  title=""
                  width={800}
                  height={300}
                  color="#10B981"
                />
              </div>
            </div>

            {/* 竞争力雷达图 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-dsp-dark mb-4">个人竞争力分析</h3>
                <div className="flex justify-center">
                  <RadarChart
                    data={analysisResult.chartData.competitiveness.factors}
                    title=""
                    width={400}
                    height={400}
                    color="#8B5CF6"
                  />
                </div>
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-50 rounded-lg">
                    <span className="text-purple-600 font-medium">综合竞争力排名:</span>
                    <span className="text-xl font-bold text-purple-700">
                      {analysisResult.chartData.competitiveness.position}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 就业数据表格 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-dsp-dark mb-4">历年就业数据详情</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-dsp-dark">年份</th>
                      <th className="text-right py-3 px-4 font-medium text-dsp-dark">职位数量</th>
                      <th className="text-right py-3 px-4 font-medium text-dsp-dark">平均薪酬</th>
                      <th className="text-right py-3 px-4 font-medium text-dsp-dark">同比增长</th>
                      <th className="text-right py-3 px-4 font-medium text-dsp-dark">失业率</th>
                      <th className="text-left py-3 px-4 font-medium text-dsp-dark">热门技能</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysisResult.chartData.employmentData.map((data, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-4 font-medium text-dsp-dark">{data.year}</td>
                        <td className="py-3 px-4 text-right text-dsp-gray">
                          {data.totalJobs.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right text-dsp-gray">
                          ¥{data.avgSalary.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className={`font-medium ${
                            data.yoyGrowth > 0 ? 'text-green-600' : 
                            data.yoyGrowth < 0 ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {data.yoyGrowth > 0 ? '+' : ''}{(data.yoyGrowth * 100).toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right text-dsp-gray">
                          {(data.unemploymentRate * 100).toFixed(1)}%
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {data.topSkills.slice(0, 3).map((skill, skillIndex) => (
                              <span 
                                key={skillIndex} 
                                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <LightBulbIcon className="w-6 h-6 text-yellow-600" />
              <h3 className="text-lg font-semibold text-dsp-dark">个性化建议</h3>
            </div>
            
            <div className="space-y-4">
              {analysisResult.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-yellow-50 rounded-xl">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-yellow-600 font-bold text-sm">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-dsp-gray">{recommendation}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
              <div className="flex items-start space-x-3">
                <InformationCircleIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-dsp-dark mb-2">重要提醒</h4>
                  <p className="text-sm text-dsp-gray">
                    以上分析基于当前市场数据和行业趋势，实际薪酬可能因公司规模、具体岗位要求、
                    个人能力展现等因素有所差异。建议将此报告作为参考，结合具体面试情况进行谈判。
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex justify-center space-x-4 mt-8">
          <button
            onClick={() => navigate('/query')}
            className="px-6 py-3 border-2 border-gray-300 text-dsp-gray rounded-xl hover:border-gray-400 hover:text-dsp-dark transition-all"
          >
            重新查询
          </button>
          <div className="flex space-x-3">
            {/* HTML导出按钮 - 推荐选项 */}
            <button
              onClick={handleExportHTML}
              disabled={isExporting || !analysisResult}
              className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>导出中...</span>
                </>
              ) : (
                <>
                  <span>下载报告</span>
                  <span className="ml-1 px-2 py-1 bg-green-500 text-xs rounded-full">推荐</span>
                </>
              )}
            </button>

            {/* PDF导出按钮 */}
            <div className="relative group">
              <button
                onClick={handleExportPDF}
                disabled={isExporting || !analysisResult}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <span>打印PDF</span>
              </button>
              
              {/* 使用说明提示 */}
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="bg-gray-800 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
                  打开打印界面，选择"保存为PDF"
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
