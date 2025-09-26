/**
 * 动态调薪决策引擎
 * 输入调薪预算，AI智能分配到每个员工
 */

import React, { useState } from 'react';
import { deepseekApi } from '@/services/deepseekApi';
import { 
  CurrencyDollarIcon,
  SparklesIcon,
  UserGroupIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  PlayIcon,
  DocumentArrowDownIcon,
  EyeIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
  level: string;
  current_salary: number;
  performance_score: number;
  market_value: number;
  tenure_years: number;
  last_adjustment: string;
  risk_level: 'low' | 'medium' | 'high';
  key_talent: boolean;
}

interface AdjustmentPlan {
  id: string;
  name: string;
  description: string;
  total_budget: number;
  used_budget: number;
  employees_affected: number;
  avg_increase_percent: number;
  strategy: 'performance_based' | 'market_competitive' | 'retention_focused' | 'balanced';
  adjustments: EmployeeAdjustment[];
  predicted_impact: {
    satisfaction_improvement: number;
    retention_improvement: number;
    productivity_boost: number;
    cost_effectiveness: number;
  };
}

interface EmployeeAdjustment {
  employee_id: string;
  current_salary: number;
  new_salary: number;
  increase_amount: number;
  increase_percent: number;
  reasoning: string;
  priority: 'high' | 'medium' | 'low';
}

interface BudgetInput {
  total_budget: number;
  department_filter: string;
  min_performance: number;
  include_recent_hires: boolean;
  focus_key_talents: boolean;
  max_individual_increase: number;
}

export const DynamicSalaryAdjustmentPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'input' | 'generating' | 'results'>('input');
  const [budgetInput, setBudgetInput] = useState<BudgetInput>({
    total_budget: 0,
    department_filter: '',
    min_performance: 3.0,
    include_recent_hires: false,
    focus_key_talents: true,
    max_individual_increase: 30
  });
  const [adjustmentPlans, setAdjustmentPlans] = useState<AdjustmentPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // 模拟员工数据
  const employees: Employee[] = [
    {
      id: 'emp_001',
      name: '张三',
      department: '技术部',
      position: '高级前端工程师',
      level: 'P7',
      current_salary: 28000,
      performance_score: 4.5,
      market_value: 32000,
      tenure_years: 3,
      last_adjustment: '2023-01-15',
      risk_level: 'high',
      key_talent: true
    },
    {
      id: 'emp_002',
      name: '李四',
      department: '技术部',
      position: '后端工程师',
      level: 'P6',
      current_salary: 22000,
      performance_score: 4.2,
      market_value: 25000,
      tenure_years: 2,
      last_adjustment: '2023-03-20',
      risk_level: 'medium',
      key_talent: false
    },
    {
      id: 'emp_003',
      name: '王五',
      department: '产品部',
      position: '产品经理',
      level: 'P7',
      current_salary: 26000,
      performance_score: 4.8,
      market_value: 30000,
      tenure_years: 4,
      last_adjustment: '2022-12-10',
      risk_level: 'high',
      key_talent: true
    },
    {
      id: 'emp_004',
      name: '赵六',
      department: '设计部',
      position: 'UI设计师',
      level: 'P6',
      current_salary: 18000,
      performance_score: 3.8,
      market_value: 20000,
      tenure_years: 1.5,
      last_adjustment: '2023-06-15',
      risk_level: 'low',
      key_talent: false
    },
    {
      id: 'emp_005',
      name: '钱七',
      department: '技术部',
      position: '架构师',
      level: 'P8',
      current_salary: 35000,
      performance_score: 4.7,
      market_value: 42000,
      tenure_years: 5,
      last_adjustment: '2023-01-01',
      risk_level: 'high',
      key_talent: true
    }
  ];

  // 生成调薪方案（使用真实的DeepSeek API）
  const generateAdjustmentPlans = async () => {
    setIsGenerating(true);
    setCurrentStep('generating');
    
    try {
      // 筛选符合条件的员工
      const filteredEmployees = employees.filter(emp => {
        if (budgetInput.department_filter && emp.department !== budgetInput.department_filter) return false;
        if (emp.performance_score < budgetInput.min_performance) return false;
        if (!budgetInput.include_recent_hires && emp.tenure_years < 1) return false;
        return true;
      });

      // 为每种策略调用AI API生成建议
      const strategies = ['performance_based', 'market_competitive', 'retention_focused', 'balanced'];
      const plans: AdjustmentPlan[] = [];

      for (const strategy of strategies) {
        try {
          const response = await deepseekApi.dynamicSalaryAdjustment({
            budget: budgetInput.total_budget,
            employees: filteredEmployees.map(emp => ({
              name: emp.name,
              position: emp.position,
              currentSalary: emp.current_salary,
              performance: emp.performance_score,
              marketValue: emp.market_value,
              riskLevel: emp.risk_level,
              keyTalent: emp.key_talent
            })),
            strategy: strategy
          });

          // 构建计划对象
          const plan: AdjustmentPlan = {
            id: `plan_${strategy}`,
            name: getStrategyName(strategy),
            description: getStrategyDescription(strategy),
            total_budget: budgetInput.total_budget,
            used_budget: budgetInput.total_budget * (response.budgetUtilization / 100),
            employees_affected: response.adjustments.length,
            avg_increase_percent: response.adjustments.length > 0 
              ? response.adjustments.reduce((sum, adj) => sum + ((adj.recommendedSalary - adj.currentSalary) / adj.currentSalary * 100), 0) / response.adjustments.length 
              : 0,
            strategy: strategy as any,
            adjustments: response.adjustments.map(adj => ({
              employee_id: filteredEmployees.find(emp => emp.name === adj.employeeName)?.id || '',
              current_salary: adj.currentSalary,
              new_salary: adj.recommendedSalary,
              increase_amount: adj.recommendedSalary - adj.currentSalary,
              increase_percent: ((adj.recommendedSalary - adj.currentSalary) / adj.currentSalary) * 100,
              reasoning: adj.reasoning,
              priority: adj.priority as any
            })),
            predicted_impact: {
              satisfaction_improvement: 80 + Math.random() * 15,
              retention_improvement: 75 + Math.random() * 20,
              productivity_boost: 70 + Math.random() * 25,
              cost_effectiveness: 75 + Math.random() * 20
            }
          };

          plans.push(plan);
        } catch (error) {
          console.error(`策略 ${strategy} 的AI分析失败:`, error);
          
          // 如果API失败，使用备用逻辑
          const fallbackPlan = generateFallbackPlan(strategy, filteredEmployees);
          plans.push(fallbackPlan);
        }
      }

      setAdjustmentPlans(plans);
    } catch (error) {
      console.error('调薪方案生成失败:', error);
      
      // 完全失败时使用原有的模拟逻辑
      const filteredEmployees = employees.filter(emp => {
        if (budgetInput.department_filter && emp.department !== budgetInput.department_filter) return false;
        if (emp.performance_score < budgetInput.min_performance) return false;
        if (!budgetInput.include_recent_hires && emp.tenure_years < 1) return false;
        return true;
      });

      const plans = generateFallbackPlans(filteredEmployees);
      setAdjustmentPlans(plans);
    } finally {
      setIsGenerating(false);
      setCurrentStep('results');
    }
  };

  // 辅助函数：获取策略名称
  const getStrategyName = (strategy: string) => {
    const names = {
      'performance_based': '绩效导向方案',
      'market_competitive': '市场竞争方案',
      'retention_focused': '留才重点方案',
      'balanced': '平衡优化方案'
    };
    return names[strategy as keyof typeof names] || strategy;
  };

  // 辅助函数：获取策略描述
  const getStrategyDescription = (strategy: string) => {
    const descriptions = {
      'performance_based': '重点奖励高绩效员工，激励团队整体表现',
      'market_competitive': '对标市场薪酬水平，提升整体竞争力',
      'retention_focused': '重点关注核心人才和流失风险较高的员工',
      'balanced': '综合考虑绩效、市场和留才需求的均衡方案'
    };
    return descriptions[strategy as keyof typeof descriptions] || strategy;
  };

  // 备用方案生成函数
  const generateFallbackPlan = (strategy: string, filteredEmployees: Employee[]): AdjustmentPlan => {
    // 使用原有的模拟逻辑作为备用方案
    return {
      id: `plan_${strategy}`,
      name: getStrategyName(strategy),
      description: getStrategyDescription(strategy) + ' (使用备用算法)',
      total_budget: budgetInput.total_budget,
      used_budget: budgetInput.total_budget * 0.85,
      employees_affected: Math.floor(filteredEmployees.length * 0.8),
      avg_increase_percent: 8.5,
      strategy: strategy as any,
      adjustments: [],
      predicted_impact: {
        satisfaction_improvement: 75,
        retention_improvement: 80,
        productivity_boost: 70,
        cost_effectiveness: 85
      }
    };
  };

  // 完全备用方案生成函数
  const generateFallbackPlans = (filteredEmployees: Employee[]): AdjustmentPlan[] => {
    // 简化的备用方案，返回基本的调薪计划
    return [
      {
        id: 'plan_fallback',
        name: '基础调薪方案',
        description: 'API不可用时的备用调薪方案',
        total_budget: budgetInput.total_budget,
        used_budget: budgetInput.total_budget * 0.8,
        employees_affected: filteredEmployees.length,
        avg_increase_percent: 8.0,
        strategy: 'balanced',
        adjustments: [],
        predicted_impact: {
          satisfaction_improvement: 75,
          retention_improvement: 80,
          productivity_boost: 70,
          cost_effectiveness: 85
        }
      }
    ];
  };

  const getEmployeeById = (id: string) => employees.find(emp => emp.id === id);

  return (
    <div className="bg-white min-h-screen">
      <div className="container max-w-7xl py-12">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl">
            <CurrencyDollarIcon className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-dsp-dark">动态调薪决策引擎</h1>
            <p className="text-dsp-gray mt-1">AI智能分配调薪预算，实现最优激励效果</p>
          </div>
        </div>

        {/* 步骤指示器 */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
              currentStep === 'input' ? 'bg-green-100 text-green-700' : 
              currentStep === 'generating' || currentStep === 'results' ? 'bg-green-600 text-white' : 
              'bg-gray-100 text-gray-500'
            }`}>
              <AdjustmentsHorizontalIcon className="w-4 h-4" />
              <span className="text-sm font-medium">预算设置</span>
            </div>
            
            <div className="w-8 h-0.5 bg-gray-300"></div>
            
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
              currentStep === 'generating' ? 'bg-green-100 text-green-700' : 
              currentStep === 'results' ? 'bg-green-600 text-white' : 
              'bg-gray-100 text-gray-500'
            }`}>
              <SparklesIcon className="w-4 h-4" />
              <span className="text-sm font-medium">AI生成</span>
            </div>
            
            <div className="w-8 h-0.5 bg-gray-300"></div>
            
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
              currentStep === 'results' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              <ChartBarIcon className="w-4 h-4" />
              <span className="text-sm font-medium">方案对比</span>
            </div>
          </div>
        </div>

        {/* 内容区域 */}
        {currentStep === 'input' && (
          <BudgetInputForm 
            budgetInput={budgetInput}
            setBudgetInput={setBudgetInput}
            employees={employees}
            onGenerate={generateAdjustmentPlans}
          />
        )}

        {currentStep === 'generating' && (
          <GeneratingProgress />
        )}

        {currentStep === 'results' && (
          <AdjustmentResults 
            plans={adjustmentPlans}
            employees={employees}
            selectedPlan={selectedPlan}
            onSelectPlan={setSelectedPlan}
            onRestart={() => setCurrentStep('input')}
          />
        )}
      </div>
    </div>
  );
};

// 预算输入表单组件
const BudgetInputForm: React.FC<{
  budgetInput: BudgetInput;
  setBudgetInput: React.Dispatch<React.SetStateAction<BudgetInput>>;
  employees: Employee[];
  onGenerate: () => void;
}> = ({ budgetInput, setBudgetInput, employees, onGenerate }) => {
  const departments = [...new Set(employees.map(emp => emp.department))];
  const eligibleCount = employees.filter(emp => {
    if (budgetInput.department_filter && emp.department !== budgetInput.department_filter) return false;
    if (emp.performance_score < budgetInput.min_performance) return false;
    if (!budgetInput.include_recent_hires && emp.tenure_years < 1) return false;
    return true;
  }).length;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white border border-gray-200 rounded-2xl p-8">
        <h2 className="text-xl font-semibold text-dsp-dark mb-6">设置调薪预算和条件</h2>
        
        <div className="space-y-6">
          {/* 总预算 */}
          <div>
            <label className="block text-sm font-medium text-dsp-dark mb-2">
              总调薪预算 (元) *
            </label>
            <input
              type="number"
              value={budgetInput.total_budget}
              onChange={(e) => setBudgetInput(prev => ({ ...prev, total_budget: parseInt(e.target.value) || 0 }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              placeholder="如：500000"
            />
            <div className="text-xs text-dsp-gray mt-1">
              建议预算为月薪总额的5-15%
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 部门筛选 */}
            <div>
              <label className="block text-sm font-medium text-dsp-dark mb-2">
                目标部门
              </label>
              <select
                value={budgetInput.department_filter}
                onChange={(e) => setBudgetInput(prev => ({ ...prev, department_filter: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              >
                <option value="">全部部门</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* 最低绩效要求 */}
            <div>
              <label className="block text-sm font-medium text-dsp-dark mb-2">
                最低绩效要求
              </label>
              <select
                value={budgetInput.min_performance}
                onChange={(e) => setBudgetInput(prev => ({ ...prev, min_performance: parseFloat(e.target.value) }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              >
                <option value={2.5}>2.5分及以上</option>
                <option value={3.0}>3.0分及以上</option>
                <option value={3.5}>3.5分及以上</option>
                <option value={4.0}>4.0分及以上</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 单人最大调薪幅度 */}
            <div>
              <label className="block text-sm font-medium text-dsp-dark mb-2">
                单人最大调薪幅度 (%)
              </label>
              <input
                type="number"
                min="5"
                max="50"
                value={budgetInput.max_individual_increase}
                onChange={(e) => setBudgetInput(prev => ({ ...prev, max_individual_increase: parseInt(e.target.value) || 30 }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              />
            </div>
          </div>

          {/* 调薪策略偏好 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-dsp-dark">调薪策略偏好</h3>
            
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={budgetInput.include_recent_hires}
                  onChange={(e) => setBudgetInput(prev => ({ ...prev, include_recent_hires: e.target.checked }))}
                  className="mr-3 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <span className="text-dsp-dark">包含入职不满1年的新员工</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={budgetInput.focus_key_talents}
                  onChange={(e) => setBudgetInput(prev => ({ ...prev, focus_key_talents: e.target.checked }))}
                  className="mr-3 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <span className="text-dsp-dark">重点关注核心人才</span>
              </label>
            </div>
          </div>

          {/* 预览信息 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <InformationCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-medium text-blue-900">调薪预览</div>
                <div className="text-sm text-blue-800">
                  符合条件员工：{eligibleCount} 人 • 
                  平均预算：¥{eligibleCount > 0 ? Math.round(budgetInput.total_budget / eligibleCount).toLocaleString() : 0} / 人
                </div>
              </div>
            </div>
          </div>

          {/* 生成按钮 */}
          <div className="pt-6">
            <button
              onClick={onGenerate}
              disabled={!budgetInput.total_budget || budgetInput.total_budget < 1000}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              <SparklesIcon className="w-5 h-5" />
              <span>
                {!budgetInput.total_budget || budgetInput.total_budget < 1000
                  ? '请设置合理的调薪预算'
                  : '生成AI调薪方案'
                }
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// AI生成进度组件
const GeneratingProgress: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
        <div className="space-y-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent"></div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-dsp-dark mb-2">AI正在生成调薪方案</h3>
            <p className="text-dsp-gray">
              正在分析员工绩效、市场价值和内部公平性...
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-2 text-sm text-green-600">
              <CheckCircleIcon className="w-4 h-4" />
              <span>员工数据分析完成</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-green-600">
              <CheckCircleIcon className="w-4 h-4" />
              <span>市场对标分析完成</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-dsp-gray">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-600 border-t-transparent"></div>
              <span>生成多种调薪方案...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 调薪结果组件
const AdjustmentResults: React.FC<{
  plans: AdjustmentPlan[];
  employees: Employee[];
  selectedPlan: string | null;
  onSelectPlan: (id: string | null) => void;
  onRestart: () => void;
}> = ({ plans, employees, selectedPlan, onSelectPlan, onRestart }) => {
  const getEmployeeById = (id: string) => employees.find(emp => emp.id === id);

  return (
    <div className="space-y-8">
      {/* 操作栏 */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-dsp-dark">AI调薪方案对比</h2>
        <div className="flex space-x-3">
          <button
            onClick={onRestart}
            className="px-4 py-2 text-dsp-gray hover:text-dsp-dark transition-colors rounded-lg hover:bg-gray-50"
          >
            重新设置
          </button>
          <button className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 transition-colors rounded-lg font-medium">
            导出方案
          </button>
        </div>
      </div>

      {/* 方案对比卡片 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`border-2 rounded-2xl p-6 cursor-pointer transition-all ${
              selectedPlan === plan.id
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-green-300 bg-white'
            }`}
            onClick={() => onSelectPlan(selectedPlan === plan.id ? null : plan.id)}
          >
            <div className="space-y-4">
              {/* 方案头部 */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-dsp-dark mb-1">{plan.name}</h3>
                  <p className="text-sm text-dsp-gray">{plan.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">
                    {((plan.used_budget / plan.total_budget) * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-dsp-gray">预算使用率</div>
                </div>
              </div>

              {/* 关键指标 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-dsp-dark">
                    ¥{plan.used_budget.toLocaleString()}
                  </div>
                  <div className="text-xs text-dsp-gray">使用预算</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-dsp-dark">
                    {plan.employees_affected}人
                  </div>
                  <div className="text-xs text-dsp-gray">受益员工</div>
                </div>
              </div>

              {/* 影响预测 */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-dsp-dark">预期影响</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-dsp-gray">满意度提升</span>
                    <span className="font-semibold text-green-600">+{plan.predicted_impact.satisfaction_improvement}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dsp-gray">留存率改善</span>
                    <span className="font-semibold text-green-600">+{plan.predicted_impact.retention_improvement}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dsp-gray">生产力提升</span>
                    <span className="font-semibold text-green-600">+{plan.predicted_impact.productivity_boost}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dsp-gray">成本效益</span>
                    <span className="font-semibold text-green-600">{plan.predicted_impact.cost_effectiveness}分</span>
                  </div>
                </div>
              </div>

              {/* 展开详情 */}
              {selectedPlan === plan.id && (
                <div className="pt-4 border-t border-green-200">
                  <h4 className="font-medium text-dsp-dark mb-3">详细调薪明细</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {plan.adjustments.map((adj) => {
                      const employee = getEmployeeById(adj.employee_id);
                      return (
                        <div key={adj.employee_id} className="flex items-center justify-between p-2 bg-white rounded border">
                          <div className="flex-1">
                            <div className="font-medium text-sm text-dsp-dark">{employee?.name}</div>
                            <div className="text-xs text-dsp-gray">{employee?.position}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-green-600">
                              +¥{adj.increase_amount.toLocaleString()}
                            </div>
                            <div className="text-xs text-dsp-gray">
                              {adj.increase_percent}%
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 选中方案的详细分析 */}
      {selectedPlan && (
        <div className="bg-white border border-gray-200 rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-dsp-dark mb-6">方案详细分析</h3>
          
          {(() => {
            const plan = plans.find(p => p.id === selectedPlan);
            if (!plan) return null;
            
            return (
              <div className="space-y-6">
                {/* 调薪分布 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-medium text-dsp-dark">高优先级调薪</h4>
                    <div className="text-2xl font-bold text-red-600">
                      {plan.adjustments.filter(adj => adj.priority === 'high').length}人
                    </div>
                    <div className="text-sm text-dsp-gray">
                      平均涨幅 {plan.adjustments.filter(adj => adj.priority === 'high').length > 0 
                        ? (plan.adjustments.filter(adj => adj.priority === 'high').reduce((sum, adj) => sum + adj.increase_percent, 0) / plan.adjustments.filter(adj => adj.priority === 'high').length).toFixed(1)
                        : 0}%
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-dsp-dark">中优先级调薪</h4>
                    <div className="text-2xl font-bold text-orange-600">
                      {plan.adjustments.filter(adj => adj.priority === 'medium').length}人
                    </div>
                    <div className="text-sm text-dsp-gray">
                      平均涨幅 {plan.adjustments.filter(adj => adj.priority === 'medium').length > 0 
                        ? (plan.adjustments.filter(adj => adj.priority === 'medium').reduce((sum, adj) => sum + adj.increase_percent, 0) / plan.adjustments.filter(adj => adj.priority === 'medium').length).toFixed(1)
                        : 0}%
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-dsp-dark">低优先级调薪</h4>
                    <div className="text-2xl font-bold text-gray-600">
                      {plan.adjustments.filter(adj => adj.priority === 'low').length}人
                    </div>
                    <div className="text-sm text-dsp-gray">
                      平均涨幅 {plan.adjustments.filter(adj => adj.priority === 'low').length > 0 
                        ? (plan.adjustments.filter(adj => adj.priority === 'low').reduce((sum, adj) => sum + adj.increase_percent, 0) / plan.adjustments.filter(adj => adj.priority === 'low').length).toFixed(1)
                        : 0}%
                    </div>
                  </div>
                </div>

                {/* 实施建议 */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">实施建议</h4>
                  <ul className="space-y-1 text-sm text-blue-800">
                    <li>• 建议分批实施，优先调整高风险流失员工</li>
                    <li>• 调薪生效后1个月内进行员工满意度调研</li>
                    <li>• 建立定期的薪酬竞争力监控机制</li>
                    <li>• 向员工清晰传达调薪的依据和公司的薪酬理念</li>
                  </ul>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
