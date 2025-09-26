/**
 * 薪酬体系评估页面
 */

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChartBarIcon,
  DocumentArrowUpIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon,
  // EyeIcon,
  DocumentTextIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { useHRStore, type EmployeeData, type MarketBenchmark, type AuditReport } from '@/stores/hrStore';

// 接口定义已经从 hrStore 导入

export const SalaryAuditPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuditData } = useHRStore();
  
  const [uploadedData, setUploadedData] = useState<EmployeeData[]>([]);
  const [auditReport, setAuditReport] = useState<AuditReport | null>(null);
  const [benchmarks, setBenchmarks] = useState<MarketBenchmark[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReport, setShowReport] = useState(false);

  // 模拟市场薪酬数据库
  const getMarketBenchmark = (position: string, location: string): MarketBenchmark => {
    const baseData: Record<string, { min: number; median: number; max: number }> = {
      '前端开发': { min: 12000, median: 18000, max: 28000 },
      '后端开发': { min: 14000, median: 20000, max: 32000 },
      '产品经理': { min: 15000, median: 22000, max: 35000 },
      '设计师': { min: 10000, median: 15000, max: 24000 },
      'HR专员': { min: 8000, median: 12000, max: 18000 },
      '市场专员': { min: 9000, median: 14000, max: 20000 }
    };

    // 地区调整系数
    const locationMultiplier = location.includes('北京') || location.includes('上海') || location.includes('深圳') ? 1.3 : 1.0;
    
    const base = baseData[position] || { min: 8000, median: 12000, max: 20000 };
    
    return {
      position,
      marketMin: Math.round(base.min * locationMultiplier),
      marketMedian: Math.round(base.median * locationMultiplier),
      marketMax: Math.round(base.max * locationMultiplier),
      competitiveness: 'medium',
      recommendation: '薪酬水平接近市场中位数'
    };
  };

  // 处理文件上传
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        
        // 简单的CSV解析（实际项目中应使用专业的CSV解析库）
        const lines = text.split('\n').filter(line => line.trim());
        // const headers = lines[0].split(',').map(h => h.trim());
        
        const data: EmployeeData[] = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim());
          return {
            name: values[0] || '未知',
            position: values[1] || '未知职位',
            department: values[2] || '未知部门',
            salary: parseInt(values[3]) || 0,
            experience: values[4] || '未知',
            education: values[5] || '未知',
            location: values[6] || '北京'
          };
        }).filter(emp => emp.salary > 0);

        setUploadedData(data);
      } catch (error) {
        console.error('文件解析失败:', error);
        alert('文件格式错误，请确保是正确的CSV格式');
      }
    };

    reader.readAsText(file, 'UTF-8');
  }, []);

  // 生成审计报告
  const generateAuditReport = async () => {
    if (uploadedData.length === 0) return;

    setIsProcessing(true);
    
    // 模拟处理延迟
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 生成市场对标数据
    const benchmarkData = uploadedData.map(emp => 
      getMarketBenchmark(emp.position, emp.location)
    );
    setBenchmarks(benchmarkData);

    // 计算审计报告
    const totalEmployees = uploadedData.length;
    const averageSalary = Math.round(uploadedData.reduce((sum, emp) => sum + emp.salary, 0) / totalEmployees);

    let aboveMarket = 0, atMarket = 0, belowMarket = 0;
    
    uploadedData.forEach((emp, index) => {
      const benchmark = benchmarkData[index];
      if (emp.salary > benchmark.marketMax) aboveMarket++;
      else if (emp.salary < benchmark.marketMin) belowMarket++;
      else atMarket++;
    });

    // 部门分析
    const departmentAnalysis: Record<string, { count: number; avgSalary: number; marketGap: number }> = {};
    
    uploadedData.forEach((emp, index) => {
      if (!departmentAnalysis[emp.department]) {
        departmentAnalysis[emp.department] = { count: 0, avgSalary: 0, marketGap: 0 };
      }
      
      const dept = departmentAnalysis[emp.department];
      dept.count++;
      dept.avgSalary = Math.round((dept.avgSalary * (dept.count - 1) + emp.salary) / dept.count);
      
      const benchmark = benchmarkData[index];
      const gap = ((emp.salary - benchmark.marketMedian) / benchmark.marketMedian) * 100;
      dept.marketGap = Math.round((dept.marketGap * (dept.count - 1) + gap) / dept.count);
    });

    // 生成建议
    const recommendations = [];
    if (belowMarket > totalEmployees * 0.3) {
      recommendations.push('建议整体调薪：超过30%员工薪酬低于市场水平');
    }
    if (aboveMarket > totalEmployees * 0.2) {
      recommendations.push('部分岗位薪酬偏高：可考虑优化薪酬结构');
    }
    recommendations.push('建议建立分级薪酬体系，确保内部公平性');
    recommendations.push('定期进行市场薪酬调研，保持竞争力');

    const report: AuditReport = {
      totalEmployees,
      averageSalary,
      marketComparison: { aboveMarket, atMarket, belowMarket },
      departmentAnalysis,
      recommendations
    };

    setAuditReport(report);
    setIsProcessing(false);
    setShowReport(true);
    
    // 保存审计数据到全局状态，供优化方案使用
    setAuditData({
      employees: uploadedData,
      benchmarks: benchmarkData,
      report,
      auditDate: new Date()
    });
  };

  const getCompetitivenessColor = (salary: number, benchmark: MarketBenchmark) => {
    if (salary > benchmark.marketMax) return 'text-red-600 bg-red-50';
    if (salary < benchmark.marketMin) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  const getCompetitivenessIcon = (salary: number, benchmark: MarketBenchmark) => {
    if (salary > benchmark.marketMax) return <ArrowUpIcon className="w-4 h-4" />;
    if (salary < benchmark.marketMin) return <ArrowDownIcon className="w-4 h-4" />;
    return <MinusIcon className="w-4 h-4" />;
  };

  const getCompetitivenessText = (salary: number, benchmark: MarketBenchmark) => {
    if (salary > benchmark.marketMax) return '高于市场';
    if (salary < benchmark.marketMin) return '低于市场';
    return '符合市场';
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="container max-w-6xl py-12">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <ChartBarIcon className="w-8 h-8 text-dsp-red" />
          <h1 className="text-3xl font-semibold text-dsp-dark">薪酬体系评估</h1>
        </div>

        {!showReport ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* 左侧：数据上传 */}
            <div className="space-y-8">
              {/* 上传区域 */}
              <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-dsp-red/50 transition-colors">
                <DocumentArrowUpIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-dsp-dark mb-2">上传工资单数据</h3>
                <p className="text-dsp-gray mb-6">
                  支持CSV格式，包含：姓名、职位、部门、薪酬、经验、学历、地点
                </p>
                
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="payroll-upload"
                />
                <label
                  htmlFor="payroll-upload"
                  className="inline-flex items-center px-6 py-3 bg-dsp-red text-white rounded-lg font-medium hover:bg-dsp-red/90 cursor-pointer transition-colors"
                >
                  <DocumentArrowUpIcon className="w-5 h-5 mr-2" />
                  选择文件
                </label>
                
                <div className="mt-4 text-sm text-dsp-gray">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    <span>100% 本地处理，数据不会上传到服务器</span>
                  </div>
                </div>
              </div>

              {/* CSV格式说明 */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h4 className="font-semibold text-dsp-dark mb-4">CSV格式要求</h4>
                <div className="space-y-2 text-sm text-dsp-gray">
                  <div className="font-mono bg-white p-3 rounded border text-xs">
                    姓名,职位,部门,薪酬,经验,学历,地点<br />
                    张三,前端开发,技术部,18000,3-5年,本科,北京<br />
                    李四,产品经理,产品部,22000,5+年,硕士,上海
                  </div>
                  <ul className="space-y-1 mt-4">
                    <li>• 第一行为表头</li>
                    <li>• 薪酬请填写数字（月薪）</li>
                    <li>• 经验格式：应届生/1-3年/3-5年/5+年</li>
                    <li>• 学历格式：大专/本科/硕士/博士</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 右侧：数据预览 */}
            <div className="space-y-8">
              {uploadedData.length > 0 ? (
                <>
                  {/* 数据统计 */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-8">
                    <h3 className="text-xl font-semibold text-dsp-dark mb-6">数据概览</h3>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-dsp-red">{uploadedData.length}</div>
                        <div className="text-sm text-dsp-gray">员工总数</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-dsp-red">
                          {Math.round(uploadedData.reduce((sum, emp) => sum + emp.salary, 0) / uploadedData.length).toLocaleString()}
                        </div>
                        <div className="text-sm text-dsp-gray">平均薪酬</div>
                      </div>
                    </div>

                    {/* 部门分布 */}
                    <div className="mt-6">
                      <h4 className="font-medium text-dsp-dark mb-3">部门分布</h4>
                      <div className="space-y-2">
                        {Object.entries(
                          uploadedData.reduce((acc, emp) => {
                            acc[emp.department] = (acc[emp.department] || 0) + 1;
                            return acc;
                          }, {} as Record<string, number>)
                        ).map(([dept, count]) => (
                          <div key={dept} className="flex justify-between items-center py-2">
                            <span className="text-dsp-gray">{dept}</span>
                            <span className="font-semibold text-dsp-dark">{count}人</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 开始分析按钮 */}
                  <button
                    onClick={generateAuditReport}
                    disabled={isProcessing}
                    className="w-full bg-dsp-red text-white py-4 px-6 rounded-lg font-medium hover:bg-dsp-red/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>分析中...</span>
                      </>
                    ) : (
                      <>
                        <ChartBarIcon className="w-5 h-5" />
                        <span>开始薪酬审计分析</span>
                      </>
                    )}
                  </button>
                </>
              ) : (
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center">
                  <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-500 mb-2">等待数据上传</h3>
                  <p className="text-gray-400">请先上传工资单CSV文件</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* 审计报告 */
          <div className="space-y-8">
            {/* 报告头部 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-dsp-dark">薪酬审计报告</h2>
                <button
                  onClick={() => setShowReport(false)}
                  className="text-dsp-gray hover:text-dsp-dark"
                >
                  重新分析
                </button>
              </div>

              {auditReport && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-dsp-dark">{auditReport.totalEmployees}</div>
                    <div className="text-sm text-dsp-gray">分析员工数</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-dsp-dark">{auditReport.averageSalary.toLocaleString()}</div>
                    <div className="text-sm text-dsp-gray">平均薪酬</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{auditReport.marketComparison.atMarket}</div>
                    <div className="text-sm text-green-600">符合市场</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{auditReport.marketComparison.belowMarket}</div>
                    <div className="text-sm text-orange-600">低于市场</div>
                  </div>
                </div>
              )}
            </div>

            {/* 员工薪酬对标 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-dsp-dark mb-6">员工薪酬市场对标</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-dsp-gray">姓名</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-dsp-gray">职位</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-dsp-gray">部门</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-dsp-gray">当前薪酬</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-dsp-gray">市场中位数</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-dsp-gray">竞争力</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {uploadedData.slice(0, 10).map((emp, index) => {
                      const benchmark = benchmarks[index];
                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-dsp-dark">{emp.name}</td>
                          <td className="px-4 py-3 text-sm text-dsp-gray">{emp.position}</td>
                          <td className="px-4 py-3 text-sm text-dsp-gray">{emp.department}</td>
                          <td className="px-4 py-3 text-sm font-medium text-dsp-dark">
                            ¥{emp.salary.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-sm text-dsp-gray">
                            ¥{benchmark.marketMedian.toLocaleString()}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCompetitivenessColor(emp.salary, benchmark)}`}>
                              {getCompetitivenessIcon(emp.salary, benchmark)}
                              <span className="ml-1">{getCompetitivenessText(emp.salary, benchmark)}</span>
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                
                {uploadedData.length > 10 && (
                  <div className="mt-4 text-center text-sm text-dsp-gray">
                    显示前10条记录，共{uploadedData.length}条
                  </div>
                )}
              </div>
            </div>

            {/* 部门分析 */}
            {auditReport && (
              <div className="bg-white border border-gray-200 rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-dsp-dark mb-6">部门薪酬分析</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(auditReport.departmentAnalysis).map(([dept, analysis]) => (
                    <div key={dept} className="p-6 border border-gray-200 rounded-lg">
                      <h4 className="font-semibold text-dsp-dark mb-4">{dept}</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-dsp-gray">员工数量</span>
                          <span className="font-medium">{analysis.count}人</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-dsp-gray">平均薪酬</span>
                          <span className="font-medium">¥{analysis.avgSalary.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-dsp-gray">市场差距</span>
                          <span className={`font-medium ${analysis.marketGap > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {analysis.marketGap > 0 ? '+' : ''}{analysis.marketGap}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 优化建议 */}
            {auditReport && (
              <div className="bg-white border border-gray-200 rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-dsp-dark mb-6">优化建议</h3>
                
                <div className="space-y-4 mb-8">
                  {auditReport.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                      <ExclamationTriangleIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-800">{rec}</span>
                    </div>
                  ))}
                </div>
                
                {/* 生成优化方案按钮 */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="bg-gradient-to-r from-dsp-red/5 to-transparent rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-dsp-dark mb-2">基于审计结果生成个性化优化方案</h4>
                        <p className="text-sm text-dsp-gray">
                          根据您的实际薪酬数据和市场对标结果，AI将为您生成针对性的薪酬优化方案
                        </p>
                      </div>
                      <button
                        onClick={() => navigate('/hr/optimization')}
                        className="flex items-center space-x-2 bg-dsp-red text-white px-6 py-3 rounded-lg font-medium hover:bg-dsp-red/90 transition-colors ml-6"
                      >
                        <SparklesIcon className="w-5 h-5" />
                        <span>生成优化方案</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};