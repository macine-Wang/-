/**
 * MARC 薪酬趋势图表组件
 * 展示职位薪酬的时序变化趋势，包括多个维度的分析
 */

import React, { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TooltipItem
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { format, parseISO } from 'date-fns';
import { TrendingUpIcon, BarChart3Icon, EyeIcon } from 'lucide-react';
import { SalaryTrendData } from '@/data/mockTimeSeriesGenerator';

// 注册Chart.js组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface SalaryTrendChartProps {
  data: SalaryTrendData;
  className?: string;
}

type ChartView = 'salary' | 'volume' | 'competition';
type TimeRange = '6M' | '12M' | '24M' | 'ALL';

export const SalaryTrendChart: React.FC<SalaryTrendChartProps> = ({ 
  data, 
  className = '' 
}) => {
  const [activeView, setActiveView] = useState<ChartView>('salary');
  const [timeRange, setTimeRange] = useState<TimeRange>('12M');
  const [showPercentiles, setShowPercentiles] = useState(true);

  // 根据时间范围过滤数据
  const filteredData = useMemo(() => {
    if (timeRange === 'ALL') return data.timeSeries;
    
    const months = timeRange === '6M' ? 6 : timeRange === '12M' ? 12 : 24;
    return data.timeSeries.slice(-months);
  }, [data.timeSeries, timeRange]);

  // 格式化日期标签
  const formatDateLabel = (period: string) => {
    try {
      return format(parseISO(period + '-01'), 'MM/yy');
    } catch {
      return period;
    }
  };

  // 薪酬趋势图表数据
  const salaryChartData = useMemo(() => {
    const labels = filteredData.map(d => formatDateLabel(d.period));
    
    const datasets = [
      {
        label: '薪酬中位数',
        data: filteredData.map(d => d.salaryStats.median),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: showPercentiles ? false : 'origin',
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ];

    if (showPercentiles) {
      datasets.push(
        {
          label: '75分位数',
          data: filteredData.map(d => d.salaryStats.p75),
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          pointRadius: 2,
          pointHoverRadius: 4,
          // borderDash: [5, 5], // 注释掉不支持的属性
        },
        {
          label: '25分位数', 
          data: filteredData.map(d => d.salaryStats.p25),
          borderColor: 'rgb(168, 85, 247)',
          backgroundColor: 'rgba(168, 85, 247, 0.1)',
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          pointRadius: 2,
          pointHoverRadius: 4,
          // borderDash: [5, 5], // 注释掉不支持的属性
        }
      );
    }

    return { labels, datasets };
  }, [filteredData, showPercentiles]);

  // 职位数量图表数据
  const volumeChartData = useMemo(() => {
    const labels = filteredData.map(d => formatDateLabel(d.period));
    
    return {
      labels,
      datasets: [
        {
          label: '职位发布数量',
          data: filteredData.map(d => d.marketMetrics.jobPostings),
          backgroundColor: 'rgba(45, 212, 191, 0.6)',
          borderColor: 'rgb(45, 212, 191)',
          borderWidth: 1,
        }
      ]
    };
  }, [filteredData]);

  // 竞争指数图表数据
  const competitionChartData = useMemo(() => {
    const labels = filteredData.map(d => formatDateLabel(d.period));
    
    return {
      labels,
      datasets: [
        {
          label: '竞争激烈度',
          data: filteredData.map(d => d.marketMetrics.competitionIndex),
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointHoverRadius: 5,
        }
      ]
    };
  }, [filteredData]);

  // 图表通用选项
  const getChartOptions = (yAxisLabel: string, isCurrency: boolean = false) => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: 'Inter, system-ui, sans-serif'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: 'rgb(248, 250, 252)',
        bodyColor: 'rgb(203, 213, 225)',
        borderColor: 'rgba(59, 130, 246, 0.3)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: (context: TooltipItem<'line' | 'bar'>) => {
            const value = context.parsed.y;
            const label = context.dataset.label || '';
            
            if (isCurrency) {
              return `${label}: ¥${value.toLocaleString()}`;
            }
            return `${label}: ${value.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: true,
          color: 'rgba(203, 213, 225, 0.2)',
        },
        ticks: {
          color: 'rgb(100, 116, 139)',
          font: {
            size: 11,
            family: 'Inter, system-ui, sans-serif'
          }
        }
      },
      y: {
        grid: {
          display: true,
          color: 'rgba(203, 213, 225, 0.2)',
        },
        ticks: {
          color: 'rgb(100, 116, 139)',
          font: {
            size: 11,
            family: 'Inter, system-ui, sans-serif'
          },
          callback: function(value: any) {
            if (isCurrency) {
              return '¥' + value.toLocaleString();
            }
            return value.toLocaleString();
          }
        },
        title: {
          display: true,
          text: yAxisLabel,
          color: 'rgb(71, 85, 105)',
          font: {
            size: 12,
            family: 'Inter, system-ui, sans-serif'
          }
        }
      }
    }
  });

  // 算法说明数据
  const algorithmDescriptions = {
    salary: {
      title: '薪酬趋势算法',
      description: '基于时间序列分析和机器学习算法，追踪薪酬变化趋势',
      details: [
        '• 使用移动平均线平滑短期波动',
        '• 季节性调整消除周期性影响', 
        '• 回归分析预测未来走势',
        '• 置信区间评估预测准确性'
      ]
    },
    volume: {
      title: '职位数量算法',
      description: '实时统计和分析市场职位供给量，反映行业招聘活跃度',
      details: [
        '• 多平台数据聚合和去重',
        '• 职位匹配度智能筛选',
        '• 时间加权计算新鲜度',
        '• 地域和行业分层统计'
      ]
    },
    competition: {
      title: '竞争指数算法',
      description: '综合分析供需关系，量化求职竞争激烈程度',
      details: [
        '• 求职者/职位比例计算',
        '• 技能匹配度权重分析',
        '• 历史竞争数据对比',
        '• 多维度竞争力评分'
      ]
    }
  };

  // Tooltip 组件
  const Tooltip: React.FC<{
    content: typeof algorithmDescriptions.salary;
    children: React.ReactNode;
  }> = ({ content, children }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
      <div 
        className="relative"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
        {isVisible && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80">
              <div className="text-sm font-semibold text-dsp-dark mb-2">
                {content.title}
              </div>
              <div className="text-xs text-dsp-gray mb-3 leading-relaxed">
                {content.description}
              </div>
              <div className="space-y-1">
                {content.details.map((detail, index) => (
                  <div key={index} className="text-xs text-dsp-gray">
                    {detail}
                  </div>
                ))}
              </div>
              {/* 箭头 */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-white"></div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-px border-4 border-transparent border-t-gray-200"></div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 视图切换按钮
  const ViewToggle = () => (
    <div className="flex bg-neutral-100 rounded-lg p-1">
      {[
        { key: 'salary', label: '薪酬趋势', icon: TrendingUpIcon },
        { key: 'volume', label: '职位数量', icon: BarChart3Icon },
        { key: 'competition', label: '竞争指数', icon: EyeIcon }
      ].map(({ key, label, icon: Icon }) => (
        <Tooltip 
          key={key}
          content={algorithmDescriptions[key as keyof typeof algorithmDescriptions]}
        >
          <button
            onClick={() => setActiveView(key as ChartView)}
            className={`
              flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all
              ${activeView === key
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-800'
              }
            `}
          >
            <Icon className="w-4 h-4 mr-2" />
            {label}
          </button>
        </Tooltip>
      ))}
    </div>
  );

  // 时间范围选择器
  const TimeRangeSelector = () => (
    <div className="flex bg-neutral-100 rounded-lg p-1">
      {[
        { key: '6M', label: '6个月' },
        { key: '12M', label: '12个月' },
        { key: '24M', label: '24个月' },
        { key: 'ALL', label: '全部' }
      ].map(({ key, label }) => (
        <button
          key={key}
          onClick={() => setTimeRange(key as TimeRange)}
          className={`
            px-3 py-1 rounded-md text-sm font-medium transition-all
            ${timeRange === key
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-neutral-600 hover:text-neutral-800'
            }
          `}
        >
          {label}
        </button>
      ))}
    </div>
  );

  return (
    <div className={`bg-white rounded-xl shadow-soft border border-neutral-200 ${className}`}>
      {/* 图表头部 */}
      <div className="p-6 border-b border-neutral-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-neutral-800 mb-1">
              薪酬趋势分析
            </h3>
            <p className="text-sm text-neutral-600">
              {data.position} · {data.location} · {data.experience}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <ViewToggle />
            <TimeRangeSelector />
          </div>
        </div>
      </div>

      {/* 图表内容 */}
      <div className="p-6">
        <div className="h-80 mb-6">
          {activeView === 'salary' && (
            <Line 
              data={salaryChartData} 
              options={getChartOptions('薪酬 (¥)', true)} 
            />
          )}
          {activeView === 'volume' && (
            <Bar 
              data={volumeChartData} 
              options={getChartOptions('职位数量')} 
            />
          )}
          {activeView === 'competition' && (
            <Line 
              data={competitionChartData} 
              options={getChartOptions('竞争指数')} 
            />
          )}
        </div>

        {/* 薪酬视图的额外控制 */}
        {activeView === 'salary' && (
          <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showPercentiles}
                onChange={(e) => setShowPercentiles(e.target.checked)}
                className="mr-2 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-700">显示分位数</span>
            </label>
            
            <div className="text-xs text-neutral-500">
              数据基于 {filteredData.reduce((sum, d) => sum + d.salaryStats.sampleSize, 0).toLocaleString()} 个样本
            </div>
          </div>
        )}
      </div>
    </div>
  );
};