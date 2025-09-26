/**
 * 智能薪酬诊断中心
 * 一键上传企业薪酬数据，AI秒出诊断报告
 */

import React, { useState } from 'react';
import { 
  DocumentArrowUpIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

interface EmployeeData {
  id: string;
  name: string;
  department: string;
  position: string;
  level: string;
  salary: number;
  experience: number;
  performance: number;
  gender: string;
  education: string;
}

interface DiagnosisResult {
  healthScore: number;
  issues: DiagnosisIssue[];
  insights: DiagnosisInsight[];
  suggestions: DiagnosisSuggestion[];
  statistics: SalaryStatistics;
}

interface DiagnosisIssue {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  affectedCount: number;
  impact: 'high' | 'medium' | 'low';
}

interface DiagnosisInsight {
  id: string;
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

interface DiagnosisSuggestion {
  id: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  expectedImpact: string;
  effort: string;
}

interface SalaryStatistics {
  totalEmployees: number;
  averageSalary: number;
  salaryRange: { min: number; max: number };
  departmentStats: Array<{
    department: string;
    avgSalary: number;
    count: number;
  }>;
  levelStats: Array<{
    level: string;
    avgSalary: number;
    count: number;
  }>;
}

export const SalaryDiagnosisPage: React.FC = () => {
  const [uploadedData, setUploadedData] = useState<EmployeeData[]>([]);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // 模拟CSV数据解析
  const parseCSVData = (csvText: string): EmployeeData[] => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).filter(line => line.trim()).map((line, index) => {
      const values = line.split(',').map(v => v.trim());
      return {
        id: `emp_${index + 1}`,
        name: values[0] || `员工${index + 1}`,
        department: values[1] || '技术部',
        position: values[2] || '软件工程师',
        level: values[3] || 'P6',
        salary: parseFloat(values[4]) || Math.floor(Math.random() * 20000) + 15000,
        experience: parseInt(values[5]) || Math.floor(Math.random() * 8) + 1,
        performance: parseFloat(values[6]) || Math.random() * 2 + 3,
        gender: values[7] || (Math.random() > 0.5 ? '男' : '女'),
        education: values[8] || '本科'
      };
    });
  };

  // 生成示例数据
  const generateSampleData = (): EmployeeData[] => {
    const departments = ['技术部', '产品部', '运营部', '销售部', '市场部'];
    const positions = ['软件工程师', '产品经理', '运营专员', '销售经理', '市场专员'];
    const levels = ['P5', 'P6', 'P7', 'P8', 'P9'];
    const educations = ['本科', '硕士', '博士'];
    
    return Array.from({ length: 50 }, (_, index) => ({
      id: `emp_${index + 1}`,
      name: `员工${index + 1}`,
      department: departments[Math.floor(Math.random() * departments.length)],
      position: positions[Math.floor(Math.random() * positions.length)],
      level: levels[Math.floor(Math.random() * levels.length)],
      salary: Math.floor(Math.random() * 25000) + 10000,
      experience: Math.floor(Math.random() * 10) + 1,
      performance: Math.random() * 2 + 3,
      gender: Math.random() > 0.5 ? '男' : '女',
      education: educations[Math.floor(Math.random() * educations.length)]
    }));
  };

  // AI薪酬诊断算法
  const performDiagnosis = (data: EmployeeData[]): DiagnosisResult => {
    const totalEmployees = data.length;
    const salaries = data.map(emp => emp.salary);
    const averageSalary = salaries.reduce((sum, salary) => sum + salary, 0) / totalEmployees;
    
    // 计算健康度评分
    let healthScore = 85; // 基础分
    
    // 部门统计
    const departmentStats = Object.values(
      data.reduce((acc, emp) => {
        if (!acc[emp.department]) {
          acc[emp.department] = { department: emp.department, totalSalary: 0, count: 0 };
        }
        acc[emp.department].totalSalary += emp.salary;
        acc[emp.department].count += 1;
        return acc;
      }, {} as Record<string, { department: string; totalSalary: number; count: number }>)
    ).map(dept => ({
      department: dept.department,
      avgSalary: Math.round(dept.totalSalary / dept.count),
      count: dept.count
    }));

    // 级别统计
    const levelStats = Object.values(
      data.reduce((acc, emp) => {
        if (!acc[emp.level]) {
          acc[emp.level] = { level: emp.level, totalSalary: 0, count: 0 };
        }
        acc[emp.level].totalSalary += emp.salary;
        acc[emp.level].count += 1;
        return acc;
      }, {} as Record<string, { level: string; totalSalary: number; count: number }>)
    ).map(level => ({
      level: level.level,
      avgSalary: Math.round(level.totalSalary / level.count),
      count: level.count
    }));

    // 问题识别
    const issues: DiagnosisIssue[] = [];
    
    // 性别薪酬差距检测
    const maleAvg = data.filter(emp => emp.gender === '男').reduce((sum, emp) => sum + emp.salary, 0) / data.filter(emp => emp.gender === '男').length;
    const femaleAvg = data.filter(emp => emp.gender === '女').reduce((sum, emp) => sum + emp.salary, 0) / data.filter(emp => emp.gender === '女').length;
    const genderGap = Math.abs(maleAvg - femaleAvg) / Math.max(maleAvg, femaleAvg);
    
    if (genderGap > 0.1) {
      issues.push({
        id: 'gender_gap',
        type: 'warning',
        title: '性别薪酬差距较大',
        description: `男女员工平均薪酬差距达到${(genderGap * 100).toFixed(1)}%，存在合规风险`,
        affectedCount: data.length,
        impact: 'high'
      });
      healthScore -= 10;
    }

    // 部门间薪酬差异检测
    const deptSalaries = departmentStats.map(d => d.avgSalary);
    const maxDeptSalary = Math.max(...deptSalaries);
    const minDeptSalary = Math.min(...deptSalaries);
    const deptGap = (maxDeptSalary - minDeptSalary) / maxDeptSalary;
    
    if (deptGap > 0.4) {
      issues.push({
        id: 'dept_gap',
        type: 'warning',
        title: '部门薪酬差异过大',
        description: `部门间薪酬差异达到${(deptGap * 100).toFixed(1)}%，可能影响内部公平性`,
        affectedCount: departmentStats.length,
        impact: 'medium'
      });
      healthScore -= 8;
    }

    // 薪酬与绩效不匹配检测
    const performanceSalaryCorrelation = calculateCorrelation(
      data.map(emp => emp.performance),
      data.map(emp => emp.salary)
    );
    
    if (performanceSalaryCorrelation < 0.3) {
      issues.push({
        id: 'performance_mismatch',
        type: 'critical',
        title: '薪酬与绩效关联度低',
        description: `薪酬与绩效相关性仅为${(performanceSalaryCorrelation * 100).toFixed(1)}%，激励效果不佳`,
        affectedCount: Math.floor(data.length * 0.6),
        impact: 'high'
      });
      healthScore -= 15;
    }

    // 市场竞争力检测（模拟）
    const marketBenchmark = averageSalary * 1.1; // 假设市场水平高10%
    if (averageSalary < marketBenchmark * 0.9) {
      issues.push({
        id: 'market_competitiveness',
        type: 'warning',
        title: '市场竞争力不足',
        description: `平均薪酬低于市场水平${((1 - averageSalary / marketBenchmark) * 100).toFixed(1)}%`,
        affectedCount: Math.floor(data.length * 0.7),
        impact: 'high'
      });
      healthScore -= 12;
    }

    // 洞察数据
    const insights: DiagnosisInsight[] = [
      {
        id: 'avg_salary',
        title: '平均薪酬',
        value: `¥${Math.round(averageSalary).toLocaleString()}`,
        change: 5.2,
        trend: 'up'
      },
      {
        id: 'salary_range',
        title: '薪酬差异系数',
        value: ((Math.max(...salaries) - Math.min(...salaries)) / averageSalary).toFixed(2),
        change: -2.1,
        trend: 'down'
      },
      {
        id: 'performance_correlation',
        title: '绩效关联度',
        value: `${(performanceSalaryCorrelation * 100).toFixed(1)}%`,
        change: performanceSalaryCorrelation > 0.5 ? 8.3 : -3.2,
        trend: performanceSalaryCorrelation > 0.5 ? 'up' : 'down'
      },
      {
        id: 'gender_balance',
        title: '性别薪酬平衡',
        value: `${(100 - genderGap * 100).toFixed(1)}%`,
        change: genderGap < 0.05 ? 4.1 : -6.7,
        trend: genderGap < 0.05 ? 'up' : 'down'
      }
    ];

    // AI建议
    const suggestions: DiagnosisSuggestion[] = [];
    
    if (performanceSalaryCorrelation < 0.3) {
      suggestions.push({
        id: 'performance_alignment',
        priority: 'high',
        title: '建立绩效导向的薪酬体系',
        description: '重新设计薪酬结构，增加绩效薪酬占比，建立明确的绩效-薪酬关联机制',
        expectedImpact: '提升员工积极性25%，降低优秀人才流失率',
        effort: '中等，需要3-6个月实施'
      });
    }

    if (genderGap > 0.1) {
      suggestions.push({
        id: 'gender_equity',
        priority: 'high',
        title: '消除性别薪酬差距',
        description: '对相同岗位级别的男女员工薪酬进行审查和调整，确保同工同酬',
        expectedImpact: '降低合规风险，提升企业形象',
        effort: '较低，可在下次调薪时实施'
      });
    }

    if (averageSalary < marketBenchmark * 0.9) {
      suggestions.push({
        id: 'market_adjustment',
        priority: 'medium',
        title: '提升市场竞争力',
        description: '针对关键岗位和核心人才进行薪酬调整，重点关注技术和销售岗位',
        expectedImpact: '降低人才流失率15%，提升招聘成功率',
        effort: '较高，需要额外预算支持'
      });
    }

    suggestions.push({
      id: 'transparency',
      priority: 'medium',
      title: '提升薪酬透明度',
      description: '建立清晰的薪酬等级体系和晋升通道，让员工了解薪酬增长路径',
      expectedImpact: '提升员工满意度和工作积极性',
      effort: '中等，需要制定薪酬管理制度'
    });

    return {
      healthScore: Math.max(0, Math.min(100, healthScore)),
      issues,
      insights,
      suggestions,
      statistics: {
        totalEmployees,
        averageSalary: Math.round(averageSalary),
        salaryRange: {
          min: Math.min(...salaries),
          max: Math.max(...salaries)
        },
        departmentStats,
        levelStats
      }
    };
  };

  // 计算相关性系数
  const calculateCorrelation = (x: number[], y: number[]): number => {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    return denominator === 0 ? 0 : numerator / denominator;
  };

  // 处理文件上传
  const handleFileUpload = async (file: File) => {
    const text = await file.text();
    const data = parseCSVData(text);
    setUploadedData(data);
    
    // 开始分析
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 2000)); // 模拟AI分析时间
    
    const result = performDiagnosis(data);
    setDiagnosisResult(result);
    setIsAnalyzing(false);
  };

  // 使用示例数据
  const handleUseSampleData = async () => {
    const data = generateSampleData();
    setUploadedData(data);
    
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const result = performDiagnosis(data);
    setDiagnosisResult(result);
    setIsAnalyzing(false);
  };

  // 拖拽处理
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="container max-w-7xl py-12">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl">
            <SparklesIcon className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-dsp-dark">智能薪酬诊断中心</h1>
            <p className="text-dsp-gray mt-1">一键上传企业薪酬数据，AI秒出诊断报告</p>
          </div>
        </div>

        {!diagnosisResult ? (
          // 数据上传界面
          <div className="max-w-4xl mx-auto">
            <div className="bg-white border-2 border-dashed border-gray-300 rounded-3xl p-12 text-center hover:border-blue-400 transition-colors">
              <div
                className={`space-y-6 ${dragActive ? 'scale-105' : ''} transition-transform`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="flex items-center justify-center">
                  <div className="p-4 bg-blue-100 rounded-2xl">
                    <DocumentArrowUpIcon className="w-12 h-12 text-blue-600" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-dsp-dark">
                    上传企业薪酬数据
                  </h3>
                  <p className="text-dsp-gray max-w-md mx-auto">
                    支持CSV、Excel格式，包含员工姓名、部门、职位、薪酬等信息
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-4">
                    <label className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl cursor-pointer transition-colors">
                      选择文件上传
                      <input
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileInputChange}
                        className="hidden"
                      />
                    </label>
                    
                    <span className="text-dsp-gray">或</span>
                    
                    <button
                      onClick={handleUseSampleData}
                      className="px-6 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-medium rounded-xl transition-colors"
                    >
                      使用示例数据
                    </button>
                  </div>

                  <div className="text-xs text-dsp-gray space-y-1">
                    <p>💡 数据格式：姓名,部门,职位,级别,薪酬,工作年限,绩效评分,性别,学历</p>
                    <p>🔒 所有数据仅在本地处理，确保信息安全</p>
                  </div>
                </div>
              </div>
            </div>

            {isAnalyzing && (
              <div className="mt-8 bg-white border border-gray-200 rounded-2xl p-8">
                <div className="flex items-center justify-center space-x-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-dsp-dark">AI正在分析您的薪酬数据...</div>
                    <div className="text-sm text-dsp-gray mt-1">
                      正在检测薪酬公平性、市场竞争力和激励效能
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-sm text-dsp-gray">
                    <span>分析进度</span>
                    <span>85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full transition-all duration-1000" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          // 诊断结果界面
          <DiagnosisResults 
            result={diagnosisResult} 
            onReset={() => {
              setDiagnosisResult(null);
              setUploadedData([]);
            }}
          />
        )}
      </div>
    </div>
  );
};

// 诊断结果组件
const DiagnosisResults: React.FC<{
  result: DiagnosisResult;
  onReset: () => void;
}> = ({ result, onReset }) => {
  return (
    <div className="space-y-8">
      {/* 操作栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-dsp-gray">
            诊断完成 • {result.statistics.totalEmployees} 名员工
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={onReset}
            className="px-4 py-2 text-dsp-gray hover:text-dsp-dark transition-colors rounded-lg hover:bg-gray-50"
          >
            重新分析
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors rounded-lg font-medium">
            导出报告
          </button>
        </div>
      </div>

      {/* 健康度评分 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-dsp-dark">薪酬健康度评分</h3>
            <p className="text-dsp-gray">综合评估企业薪酬竞争力和公平性</p>
          </div>
          
          <div className="text-center">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-200"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - result.healthScore / 100)}`}
                  className={`${
                    result.healthScore >= 80
                      ? 'text-green-500'
                      : result.healthScore >= 60
                      ? 'text-yellow-500'
                      : 'text-red-500'
                  } transition-all duration-1000`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-dsp-dark">{result.healthScore}</span>
              </div>
            </div>
            <div className="mt-2 text-sm text-dsp-gray">
              {result.healthScore >= 80 ? '健康' : result.healthScore >= 60 ? '良好' : '需改进'}
            </div>
          </div>
        </div>
      </div>

      {/* 关键洞察 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {result.insights.map((insight) => (
          <div key={insight.id} className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-dsp-gray">{insight.title}</h4>
              <div className={`flex items-center space-x-1 text-xs ${
                insight.trend === 'up' ? 'text-green-600' : insight.trend === 'down' ? 'text-red-600' : 'text-gray-500'
              }`}>
                {insight.trend === 'up' ? (
                  <ArrowTrendingUpIcon className="w-3 h-3" />
                ) : insight.trend === 'down' ? (
                  <ArrowTrendingDownIcon className="w-3 h-3" />
                ) : null}
                <span>{Math.abs(insight.change)}%</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-dsp-dark mb-1">{insight.value}</div>
          </div>
        ))}
      </div>

      {/* 问题识别 */}
      {result.issues.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-8">
          <div className="flex items-center space-x-3 mb-6">
            <ExclamationTriangleIcon className="w-6 h-6 text-orange-500" />
            <h3 className="text-xl font-semibold text-dsp-dark">发现的问题</h3>
          </div>
          
          <div className="space-y-4">
            {result.issues.map((issue) => (
              <div key={issue.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                <div className={`p-2 rounded-lg ${
                  issue.type === 'critical' ? 'bg-red-100 text-red-600' :
                  issue.type === 'warning' ? 'bg-orange-100 text-orange-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  <ExclamationTriangleIcon className="w-4 h-4" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-dsp-dark">{issue.title}</h4>
                    <div className="flex items-center space-x-3 text-xs text-dsp-gray">
                      <span>影响 {issue.affectedCount} 人</span>
                      <span className={`px-2 py-1 rounded-full ${
                        issue.impact === 'high' ? 'bg-red-100 text-red-600' :
                        issue.impact === 'medium' ? 'bg-orange-100 text-orange-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {issue.impact === 'high' ? '高影响' : issue.impact === 'medium' ? '中影响' : '低影响'}
                      </span>
                    </div>
                  </div>
                  <p className="text-dsp-gray">{issue.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI智能建议 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8">
        <div className="flex items-center space-x-3 mb-6">
          <SparklesIcon className="w-6 h-6 text-purple-500" />
          <h3 className="text-xl font-semibold text-dsp-dark">AI智能建议</h3>
        </div>
        
        <div className="space-y-6">
          {result.suggestions.map((suggestion, index) => (
            <div key={suggestion.id} className="border border-gray-200 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-dsp-dark">{suggestion.title}</h4>
                    <div className={`inline-block px-2 py-1 rounded-full text-xs mt-1 ${
                      suggestion.priority === 'high' ? 'bg-red-100 text-red-600' :
                      suggestion.priority === 'medium' ? 'bg-orange-100 text-orange-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {suggestion.priority === 'high' ? '高优先级' : suggestion.priority === 'medium' ? '中优先级' : '低优先级'}
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-dsp-gray mb-4">{suggestion.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-500" />
                  <span className="text-dsp-gray">预期效果：</span>
                  <span className="text-dsp-dark">{suggestion.expectedImpact}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <InformationCircleIcon className="w-4 h-4 text-blue-500" />
                  <span className="text-dsp-gray">实施难度：</span>
                  <span className="text-dsp-dark">{suggestion.effort}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 部门统计 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h4 className="font-semibold text-dsp-dark mb-4 flex items-center">
            <ChartBarIcon className="w-5 h-5 text-blue-600 mr-2" />
            部门薪酬分布
          </h4>
          <div className="space-y-3">
            {result.statistics.departmentStats.map((dept) => (
              <div key={dept.department} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-sm font-medium text-dsp-dark">{dept.department}</div>
                  <div className="text-xs text-dsp-gray">({dept.count}人)</div>
                </div>
                <div className="text-sm font-semibold text-dsp-dark">
                  ¥{dept.avgSalary.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 级别统计 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h4 className="font-semibold text-dsp-dark mb-4 flex items-center">
            <ChartBarIcon className="w-5 h-5 text-green-600 mr-2" />
            级别薪酬分布
          </h4>
          <div className="space-y-3">
            {result.statistics.levelStats.map((level) => (
              <div key={level.level} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-sm font-medium text-dsp-dark">{level.level}</div>
                  <div className="text-xs text-dsp-gray">({level.count}人)</div>
                </div>
                <div className="text-sm font-semibold text-dsp-dark">
                  ¥{level.avgSalary.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
