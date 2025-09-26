/**
 * 薪酬优化方案页面 - 简化版
 * 只通过薪酬审计数据访问，显示个人级别的调薪建议
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  SparklesIcon,
  ExclamationCircleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import { useHRStore } from '@/stores/hrStore';

interface EmployeeAdjustment {
  name: string;
  position: string;
  department: string;
  currentSalary: number;
  recommendedSalary: number;
  adjustment: number;
  adjustmentPercent: number;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

interface OptimizationScenario {
  id: string;
  title: string;
  description: string;
  impact: {
    costIncrease: number;
    retentionImprovement: number;
    competitivenessScore: number;
    totalCost: number;
    affectedEmployees: number;
  };
  employeeAdjustments: EmployeeAdjustment[];
  timeline: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export const OptimizationPage: React.FC = () => {
  const navigate = useNavigate();
  const { auditData, hasAuditData } = useHRStore();
  
  const [scenarios, setScenarios] = useState<OptimizationScenario[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  
  // 检查是否有审计数据，如果有则自动生成基于数据的优化方案
  useEffect(() => {
    if (hasAuditData() && auditData) {
      generateDataDrivenScenarios();
    }
  }, [auditData, hasAuditData]);

  // 基于审计数据生成个性化优化方案
  const generateDataDrivenScenarios = async () => {
    if (!auditData) return;
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const { report, employees, benchmarks } = auditData;
    
    // 为每个员工生成调薪建议
    const generateEmployeeAdjustments = (scenario: 'conservative' | 'balanced' | 'aggressive'): EmployeeAdjustment[] => {
      return employees.map((emp, index) => {
        const benchmark = benchmarks[index];
        let recommendedSalary = emp.salary;
        let reason = '薪酬合理，无需调整';
        let priority: 'high' | 'medium' | 'low' = 'low';
        
        // 根据不同方案计算推荐薪酬
        if (scenario === 'conservative') {
          // 保守方案：只调整明显低于市场的员工到市场最低线
          if (emp.salary < benchmark.marketMin) {
            recommendedSalary = benchmark.marketMin;
            reason = '薪酬低于市场最低水平，调整至市场最低线';
            priority = 'high';
          }
        } else if (scenario === 'balanced') {
          // 平衡方案：调整到市场中位数
          if (emp.salary < benchmark.marketMedian) {
            recommendedSalary = benchmark.marketMedian;
            reason = emp.salary < benchmark.marketMin 
              ? '薪酬严重低于市场，调整至市场中位数' 
              : '薪酬低于市场中位数，建议调整';
            priority = emp.salary < benchmark.marketMin ? 'high' : 'medium';
          }
        } else if (scenario === 'aggressive') {
          // 激进方案：调整到市场75分位
          const market75 = benchmark.marketMin + (benchmark.marketMax - benchmark.marketMin) * 0.75;
          if (emp.salary < market75) {
            recommendedSalary = Math.min(market75, benchmark.marketMax);
            reason = '提升至市场75分位，增强竞争优势';
            priority = emp.salary < benchmark.marketMedian ? 'high' : 'medium';
          }
        }
        
        const adjustment = recommendedSalary - emp.salary;
        const adjustmentPercent = adjustment > 0 ? (adjustment / emp.salary) * 100 : 0;
        
        return {
          name: emp.name,
          position: emp.position,
          department: emp.department,
          currentSalary: emp.salary,
          recommendedSalary,
          adjustment,
          adjustmentPercent,
          reason,
          priority
        };
      }).filter(adj => adj.adjustment > 0); // 只显示需要调薪的员工
    };
    
    // 计算整体统计
    const conservativeAdjustments = generateEmployeeAdjustments('conservative');
    const balancedAdjustments = generateEmployeeAdjustments('balanced');
    const aggressiveAdjustments = generateEmployeeAdjustments('aggressive');
    
    const calculateImpact = (adjustments: EmployeeAdjustment[]) => {
      const totalCost = adjustments.reduce((sum, adj) => sum + adj.adjustment, 0) * 12; // 年度成本
      const costIncreasePercent = (totalCost / (report.averageSalary * report.totalEmployees * 12)) * 100;
      const affectedEmployees = adjustments.length;
      const retentionImprovement = Math.min(15 + (affectedEmployees / report.totalEmployees) * 30, 50);
      const competitivenessScore = Math.max(60, 90 - (report.marketComparison.aboveMarket / report.totalEmployees) * 20);
      
      return {
        costIncrease: Math.round(costIncreasePercent),
        retentionImprovement: Math.round(retentionImprovement),
        competitivenessScore: Math.round(competitivenessScore),
        totalCost: Math.round(totalCost),
        affectedEmployees
      };
    };
    
    const generatedScenarios: OptimizationScenario[] = [
      {
        id: 'conservative',
        title: '保守调薪方案',
        description: `仅调整严重低于市场的员工至市场最低线，影响${conservativeAdjustments.length}名员工`,
        impact: calculateImpact(conservativeAdjustments),
        employeeAdjustments: conservativeAdjustments,
        timeline: '3-6个月',
        riskLevel: 'low'
      },
      {
        id: 'balanced',
        title: '平衡调薪方案',
        description: `将低于市场中位数的员工调整至中位数水平，影响${balancedAdjustments.length}名员工`,
        impact: calculateImpact(balancedAdjustments),
        employeeAdjustments: balancedAdjustments,
        timeline: '6-9个月',
        riskLevel: 'medium'
      },
      {
        id: 'aggressive',
        title: '竞争优势方案',
        description: `将员工薪酬提升至市场75分位，建立竞争优势，影响${aggressiveAdjustments.length}名员工`,
        impact: calculateImpact(aggressiveAdjustments),
        employeeAdjustments: aggressiveAdjustments,
        timeline: '9-12个月',
        riskLevel: 'high'
      }
    ];

    setScenarios(generatedScenarios);
    setSelectedScenario(generatedScenarios[0].id); // 默认选择第一个方案
  };

  const getRiskColor = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'high': return 'bg-red-100 text-red-700';
    }
  };

  const getRiskText = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low': return '低风险';
      case 'medium': return '中风险';
      case 'high': return '高风险';
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="container max-w-6xl py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <SparklesIcon className="w-8 h-8 text-dsp-red" />
            <h1 className="text-3xl font-semibold text-dsp-dark">薪酬优化方案</h1>
            {hasAuditData() && (
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                基于审计数据
              </span>
            )}
          </div>
          
          {hasAuditData() && (
            <button
              onClick={() => navigate('/hr/audit')}
              className="flex items-center space-x-2 text-dsp-gray hover:text-dsp-dark transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span>返回审计报告</span>
            </button>
          )}
        </div>

        {/* 审计数据概览 */}
        {hasAuditData() && auditData && (
          <div className="bg-gradient-to-r from-green-50 to-transparent border border-green-200 rounded-2xl p-6 mb-8">
            <h3 className="font-semibold text-green-800 mb-4">基于您的薪酬审计数据生成个性化方案</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-green-600 font-medium">审计员工数</span>
                <div className="text-green-800 font-semibold">{auditData.report.totalEmployees}人</div>
              </div>
              <div>
                <span className="text-green-600 font-medium">平均薪酬</span>
                <div className="text-green-800 font-semibold">¥{auditData.report.averageSalary.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-green-600 font-medium">低于市场</span>
                <div className="text-green-800 font-semibold">{auditData.report.marketComparison.belowMarket}人</div>
              </div>
              <div>
                <span className="text-green-600 font-medium">审计时间</span>
                <div className="text-green-800 font-semibold">{auditData.auditDate.toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        )}

        {/* 无审计数据时直接跳转 */}
        {!hasAuditData() && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              <ExclamationCircleIcon className="w-12 h-12 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-800 mb-2">无法访问优化方案</h3>
                <p className="text-red-700 mb-4">
                  薪酬优化方案需要基于工资单审计数据生成，请先进行薪酬体系评估
                </p>
                <button
                  onClick={() => navigate('/hr/audit')}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  前往薪酬体系评估
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 有审计数据时的加载状态或方案展示 */}
        {hasAuditData() && scenarios.length === 0 ? (
          // 有审计数据但还没生成方案时，显示加载状态
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-dsp-red/10 rounded-full mb-6">
              <SparklesIcon className="w-8 h-8 text-dsp-red animate-pulse" />
            </div>
            <h3 className="text-xl font-semibold text-dsp-dark mb-2">正在生成个性化优化方案</h3>
            <p className="text-dsp-gray mb-6">基于您的薪酬审计数据，AI正在分析每位员工的具体调薪建议...</p>
            <div className="w-32 h-1 bg-gray-200 rounded-full mx-auto">
              <div className="h-1 bg-dsp-red rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </div>
        ) : hasAuditData() && scenarios.length > 0 ? (
          <div className="space-y-12">
            {/* 方案选择 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-dsp-dark mb-6">为您推荐的优化方案</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {scenarios.map((scenario) => (
                  <div
                    key={scenario.id}
                    className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedScenario === scenario.id
                        ? 'border-dsp-red bg-dsp-red/5'
                        : 'border-gray-200 hover:border-dsp-red/50'
                    }`}
                    onClick={() => setSelectedScenario(scenario.id)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-dsp-dark">{scenario.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(scenario.riskLevel)}`}>
                        {getRiskText(scenario.riskLevel)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-dsp-gray mb-4">{scenario.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-dsp-gray">成本增长</span>
                        <span className="font-medium text-dsp-dark">+{scenario.impact.costIncrease}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-dsp-gray">影响员工</span>
                        <span className="font-medium text-dsp-dark">{scenario.impact.affectedEmployees}人</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-dsp-gray">年度成本</span>
                        <span className="font-medium text-dsp-dark">¥{(scenario.impact.totalCost / 10000).toFixed(1)}万</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 方案详情 */}
            {selectedScenario && (() => {
              const scenario = scenarios.find(s => s.id === selectedScenario)!;
              return (
                <>
                  <div className="bg-white border border-gray-200 rounded-2xl p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-dsp-dark">{scenario.title}</h3>
                      <div className="text-right">
                        <div className="text-sm text-dsp-gray">预计实施周期</div>
                        <div className="text-sm font-semibold text-dsp-dark">{scenario.timeline}</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-dsp-dark">员工调薪明细</h4>
                        <span className="text-sm text-dsp-gray">
                          {scenario.employeeAdjustments.length}人需要调薪
                        </span>
                      </div>
                      
                      <div className="max-h-96 overflow-y-auto space-y-3">
                        {scenario.employeeAdjustments.map((emp, empIndex) => (
                          <div key={empIndex} className="bg-gray-50 rounded-lg p-4 text-sm">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-dsp-dark">{emp.name}</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs ${
                                  emp.priority === 'high' ? 'bg-red-100 text-red-700' :
                                  emp.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-green-100 text-green-700'
                                }`}>
                                  {emp.priority === 'high' ? '高优先级' : 
                                   emp.priority === 'medium' ? '中优先级' : '低优先级'}
                                </span>
                              </div>
                              <div className="text-right">
                                <div className="text-dsp-dark font-medium">
                                  +¥{emp.adjustment.toLocaleString()}
                                </div>
                                <div className="text-dsp-gray text-xs">
                                  (+{emp.adjustmentPercent.toFixed(1)}%)
                                </div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mb-2">
                              <div>
                                <span className="text-dsp-gray">职位：</span>
                                <span className="text-dsp-dark">{emp.position}</span>
                              </div>
                              <div>
                                <span className="text-dsp-gray">部门：</span>
                                <span className="text-dsp-dark">{emp.department}</span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mb-2">
                              <div>
                                <span className="text-dsp-gray">当前薪酬：</span>
                                <span className="text-dsp-dark">¥{emp.currentSalary.toLocaleString()}</span>
                              </div>
                              <div>
                                <span className="text-dsp-gray">建议薪酬：</span>
                                <span className="text-dsp-dark font-medium">¥{emp.recommendedSalary.toLocaleString()}</span>
                              </div>
                            </div>
                            
                            <div className="text-dsp-gray text-xs mt-2">
                              <span className="font-medium">调薪理由：</span>{emp.reason}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 影响分析 */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-8">
                    <h3 className="text-xl font-semibold text-dsp-dark mb-6 flex items-center">
                      <ArrowTrendingUpIcon className="w-6 h-6 text-dsp-red mr-2" />
                      影响分析
                    </h3>
                    
                    <div className="space-y-6">
                      <div className="p-4 bg-red-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-red-800">成本增长</span>
                          <span className="text-lg font-bold text-red-600">+{scenario.impact.costIncrease}%</span>
                        </div>
                        <div className="w-full bg-red-200 rounded-full h-2">
                          <div 
                            className="bg-red-600 h-2 rounded-full" 
                            style={{ width: `${Math.min(scenario.impact.costIncrease * 2, 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-green-800">员工留存改善</span>
                          <span className="text-lg font-bold text-green-600">+{scenario.impact.retentionImprovement}%</span>
                        </div>
                        <div className="w-full bg-green-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${Math.min(scenario.impact.retentionImprovement * 2, 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-blue-800">市场竞争力评分</span>
                          <span className="text-lg font-bold text-blue-600">{scenario.impact.competitivenessScore}/100</span>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${scenario.impact.competitivenessScore}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-purple-50 rounded-lg text-center">
                          <div className="text-sm font-medium text-purple-800 mb-1">年度总成本</div>
                          <div className="text-lg font-bold text-purple-600">
                            ¥{(scenario.impact.totalCost / 10000).toFixed(1)}万
                          </div>
                        </div>
                        <div className="p-4 bg-orange-50 rounded-lg text-center">
                          <div className="text-sm font-medium text-orange-800 mb-1">影响员工</div>
                          <div className="text-lg font-bold text-orange-600">
                            {scenario.impact.affectedEmployees}人
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-dsp-dark mb-2">投资回报分析</h4>
                      <p className="text-sm text-dsp-gray">
                        基于{scenario.impact.retentionImprovement}%的留存率提升，预计可节省招聘成本约
                        <span className="font-semibold text-dsp-red">
                          {Math.round(scenario.impact.retentionImprovement * 0.8)}万元/年
                        </span>
                        ，有效抵消部分薪酬增长成本。
                      </p>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        ) : null}
      </div>
    </div>
  );
};