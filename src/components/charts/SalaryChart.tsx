/**
 * 薪酬图表组件
 * 提供各种薪酬相关的可视化图表
 */

import React from 'react';

// 简化的图表组件，避免引入外部依赖
interface ChartProps {
  width?: number;
  height?: number;
  data: any[];
  className?: string;
}

// 柱状图组件
export const BarChart: React.FC<ChartProps & { 
  xKey: string; 
  yKey: string; 
  color?: string;
  title?: string;
}> = ({ 
  data, 
  xKey, 
  yKey, 
  width = 400, 
  height = 300, 
  color = '#3B82F6',
  title,
  className = '' 
}) => {
  const maxValue = Math.max(...data.map(item => item[yKey]));
  const barWidth = (width - 60) / data.length;
  const chartHeight = height - 80;

  return (
    <div className={`bg-white rounded-xl p-4 ${className}`}>
      {title && <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>}
      <svg width={width} height={height} className="overflow-visible">
        {/* Y轴刻度 */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
          const y = chartHeight - (chartHeight * ratio) + 40;
          const value = Math.round(maxValue * ratio);
          return (
            <g key={index}>
              <line
                x1={40}
                y1={y}
                x2={width - 20}
                y2={y}
                stroke="#E5E7EB"
                strokeWidth={1}
              />
              <text
                x={35}
                y={y + 4}
                textAnchor="end"
                fontSize="12"
                fill="#6B7280"
              >
                {value}
              </text>
            </g>
          );
        })}

        {/* 柱状图 */}
        {data.map((item, index) => {
          const barHeight = (item[yKey] / maxValue) * chartHeight;
          const x = 40 + index * barWidth + barWidth * 0.1;
          const y = chartHeight - barHeight + 40;
          
          return (
            <g key={index}>
              <rect
                x={x}
                y={y}
                width={barWidth * 0.8}
                height={barHeight}
                fill={color}
                rx={4}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
              <text
                x={x + (barWidth * 0.4)}
                y={height - 20}
                textAnchor="middle"
                fontSize="12"
                fill="#6B7280"
              >
                {item[xKey]}
              </text>
              <text
                x={x + (barWidth * 0.4)}
                y={y - 5}
                textAnchor="middle"
                fontSize="12"
                fill="#374151"
                fontWeight="500"
              >
                {item[yKey]}
              </text>
            </g>
          );
        })}

        {/* X轴 */}
        <line
          x1={40}
          y1={chartHeight + 40}
          x2={width - 20}
          y2={chartHeight + 40}
          stroke="#9CA3AF"
          strokeWidth={2}
        />

        {/* Y轴 */}
        <line
          x1={40}
          y1={40}
          x2={40}
          y2={chartHeight + 40}
          stroke="#9CA3AF"
          strokeWidth={2}
        />
      </svg>
    </div>
  );
};

// 折线图组件
export const LineChart: React.FC<ChartProps & { 
  xKey: string; 
  yKey: string; 
  color?: string;
  title?: string;
}> = ({ 
  data, 
  xKey, 
  yKey, 
  width = 400, 
  height = 300, 
  color = '#10B981',
  title,
  className = '' 
}) => {
  const maxValue = Math.max(...data.map(item => item[yKey]));
  const minValue = Math.min(...data.map(item => item[yKey]));
  const range = maxValue - minValue;
  const chartHeight = height - 80;
  const chartWidth = width - 60;

  const points = data.map((item, index) => {
    const x = 40 + (index / (data.length - 1)) * chartWidth;
    const y = chartHeight - ((item[yKey] - minValue) / range) * chartHeight + 40;
    return { x, y, value: item[yKey], label: item[xKey] };
  });

  const pathData = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  return (
    <div className={`bg-white rounded-xl p-4 ${className}`}>
      {title && <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>}
      <svg width={width} height={height} className="overflow-visible">
        {/* Y轴刻度 */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
          const y = chartHeight - (chartHeight * ratio) + 40;
          const value = Math.round(minValue + range * ratio);
          return (
            <g key={index}>
              <line
                x1={40}
                y1={y}
                x2={width - 20}
                y2={y}
                stroke="#E5E7EB"
                strokeWidth={1}
              />
              <text
                x={35}
                y={y + 4}
                textAnchor="end"
                fontSize="12"
                fill="#6B7280"
              >
                {value}
              </text>
            </g>
          );
        })}

        {/* 折线 */}
        <path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth={3}
          className="drop-shadow-sm"
        />

        {/* 数据点 */}
        {points.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r={6}
              fill={color}
              stroke="white"
              strokeWidth={2}
              className="hover:r-8 transition-all cursor-pointer drop-shadow-md"
            />
            <text
              x={point.x}
              y={height - 20}
              textAnchor="middle"
              fontSize="12"
              fill="#6B7280"
            >
              {point.label}
            </text>
          </g>
        ))}

        {/* X轴 */}
        <line
          x1={40}
          y1={chartHeight + 40}
          x2={width - 20}
          y2={chartHeight + 40}
          stroke="#9CA3AF"
          strokeWidth={2}
        />

        {/* Y轴 */}
        <line
          x1={40}
          y1={40}
          x2={40}
          y2={chartHeight + 40}
          stroke="#9CA3AF"
          strokeWidth={2}
        />
      </svg>
    </div>
  );
};

// 饼图组件
export const PieChart: React.FC<ChartProps & { 
  valueKey: string; 
  labelKey: string;
  title?: string;
  colors?: string[];
}> = ({ 
  data, 
  valueKey, 
  labelKey, 
  width = 300, 
  height = 300, 
  title,
  colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'],
  className = '' 
}) => {
  const total = data.reduce((sum, item) => sum + item[valueKey], 0);
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 40;

  let currentAngle = -Math.PI / 2; // 从顶部开始

  return (
    <div className={`bg-white rounded-xl p-4 ${className}`}>
      {title && <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">{title}</h3>}
      <div className="flex items-center justify-center">
        <svg width={width} height={height}>
          {data.map((item, index) => {
            const percentage = item[valueKey] / total;
            const angle = percentage * 2 * Math.PI;
            const endAngle = currentAngle + angle;
            
            const x1 = centerX + radius * Math.cos(currentAngle);
            const y1 = centerY + radius * Math.sin(currentAngle);
            const x2 = centerX + radius * Math.cos(endAngle);
            const y2 = centerY + radius * Math.sin(endAngle);
            
            const largeArcFlag = angle > Math.PI ? 1 : 0;
            
            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');

            const color = colors[index % colors.length];
            currentAngle = endAngle;

            return (
              <path
                key={index}
                d={pathData}
                fill={color}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            );
          })}
        </svg>
      </div>
      
      {/* 图例 */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        {data.map((item, index) => {
          const percentage = ((item[valueKey] / total) * 100).toFixed(1);
          return (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="text-sm text-gray-600">
                {item[labelKey]} ({percentage}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 雷达图组件
export const RadarChart: React.FC<{
  data: Array<{ label: string; value: number; maxValue?: number }>;
  width?: number;
  height?: number;
  title?: string;
  color?: string;
  className?: string;
}> = ({ 
  data, 
  width = 300, 
  height = 300, 
  title, 
  color = '#3B82F6',
  className = '' 
}) => {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 60;
  const levels = 5; // 同心圆数量

  // 计算各个顶点位置
  const angleStep = (2 * Math.PI) / data.length;
  
  const points = data.map((item, index) => {
    const angle = index * angleStep - Math.PI / 2;
    const maxValue = item.maxValue || 100;
    const normalizedValue = Math.min(item.value / maxValue, 1);
    const x = centerX + radius * normalizedValue * Math.cos(angle);
    const y = centerY + radius * normalizedValue * Math.sin(angle);
    return { x, y, angle, normalizedValue, ...item };
  });

  // 生成多边形路径
  const polygonPoints = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className={`bg-white rounded-xl p-4 ${className}`}>
      {title && <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">{title}</h3>}
      <svg width={width} height={height}>
        {/* 同心圆网格 */}
        {Array.from({ length: levels }, (_, i) => {
          const r = (radius * (i + 1)) / levels;
          return (
            <circle
              key={i}
              cx={centerX}
              cy={centerY}
              r={r}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth={1}
            />
          );
        })}

        {/* 坐标轴 */}
        {data.map((_, index) => {
          const angle = index * angleStep - Math.PI / 2;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          return (
            <line
              key={index}
              x1={centerX}
              y1={centerY}
              x2={x}
              y2={y}
              stroke="#E5E7EB"
              strokeWidth={1}
            />
          );
        })}

        {/* 数据多边形 */}
        <polygon
          points={polygonPoints}
          fill={color}
          fillOpacity={0.2}
          stroke={color}
          strokeWidth={2}
        />

        {/* 数据点 */}
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={4}
            fill={color}
            stroke="white"
            strokeWidth={2}
          />
        ))}

        {/* 标签 */}
        {data.map((item, index) => {
          const angle = index * angleStep - Math.PI / 2;
          const labelRadius = radius + 20;
          const x = centerX + labelRadius * Math.cos(angle);
          const y = centerY + labelRadius * Math.sin(angle);
          
          return (
            <text
              key={index}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="12"
              fill="#374151"
              fontWeight="500"
            >
              {item.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

// 趋势图组件
export const TrendChart: React.FC<{
  data: Array<{ year: number; value: number; trend?: 'up' | 'down' | 'stable' }>;
  width?: number;
  height?: number;
  title?: string;
  color?: string;
  className?: string;
}> = ({ 
  data, 
  width = 500, 
  height = 300, 
  title, 
  color = '#10B981',
  className = '' 
}) => {
  const maxValue = Math.max(...data.map(item => item.value));
  const minValue = Math.min(...data.map(item => item.value));
  const range = maxValue - minValue;
  const chartHeight = height - 80;
  const chartWidth = width - 80;

  const points = data.map((item, index) => {
    const x = 40 + (index / (data.length - 1)) * chartWidth;
    const y = chartHeight - ((item.value - minValue) / range) * chartHeight + 40;
    return { x, y, ...item };
  });

  const pathData = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  // 创建渐变填充
  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`bg-white rounded-xl p-4 ${className}`}>
      {title && <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>}
      <svg width={width} height={height}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* Y轴刻度 */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
          const y = chartHeight - (chartHeight * ratio) + 40;
          const value = Math.round(minValue + range * ratio);
          return (
            <g key={index}>
              <line
                x1={40}
                y1={y}
                x2={width - 40}
                y2={y}
                stroke="#E5E7EB"
                strokeWidth={1}
              />
              <text
                x={35}
                y={y + 4}
                textAnchor="end"
                fontSize="12"
                fill="#6B7280"
              >
                {value}
              </text>
            </g>
          );
        })}

        {/* 面积填充 */}
        <path
          d={`${pathData} L ${points[points.length - 1].x} ${chartHeight + 40} L ${points[0].x} ${chartHeight + 40} Z`}
          fill={`url(#${gradientId})`}
        />

        {/* 趋势线 */}
        <path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth={3}
          className="drop-shadow-sm"
        />

        {/* 数据点和趋势指示器 */}
        {points.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r={6}
              fill={color}
              stroke="white"
              strokeWidth={3}
              className="drop-shadow-md"
            />
            
            {/* 趋势箭头 */}
            {point.trend && index > 0 && (
              <g>
                {point.trend === 'up' && (
                  <polygon
                    points={`${point.x - 3},${point.y - 12} ${point.x},${point.y - 18} ${point.x + 3},${point.y - 12}`}
                    fill="#10B981"
                  />
                )}
                {point.trend === 'down' && (
                  <polygon
                    points={`${point.x - 3},${point.y - 18} ${point.x},${point.y - 12} ${point.x + 3},${point.y - 18}`}
                    fill="#EF4444"
                  />
                )}
                {point.trend === 'stable' && (
                  <rect
                    x={point.x - 4}
                    y={point.y - 18}
                    width={8}
                    height={2}
                    fill="#6B7280"
                  />
                )}
              </g>
            )}
            
            <text
              x={point.x}
              y={height - 20}
              textAnchor="middle"
              fontSize="12"
              fill="#6B7280"
            >
              {point.year}
            </text>
            
            <text
              x={point.x}
              y={point.y - 10}
              textAnchor="middle"
              fontSize="11"
              fill="#374151"
              fontWeight="500"
            >
              {point.value}
            </text>
          </g>
        ))}

        {/* 坐标轴 */}
        <line
          x1={40}
          y1={chartHeight + 40}
          x2={width - 40}
          y2={chartHeight + 40}
          stroke="#9CA3AF"
          strokeWidth={2}
        />
        <line
          x1={40}
          y1={40}
          x2={40}
          y2={chartHeight + 40}
          stroke="#9CA3AF"
          strokeWidth={2}
        />
      </svg>
    </div>
  );
};
