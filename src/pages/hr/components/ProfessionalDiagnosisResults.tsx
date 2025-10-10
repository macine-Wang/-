/**
 * 专业薪酬诊断结果展示组件
 * 展示8大核心诊断模块
 */

import React, { useState } from 'react';
import { ReportExportService } from '../../../services/reportExportService';
import {
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  ScaleIcon,
  TrophyIcon,
  CogIcon,
  BanknotesIcon,
  StarIcon,
  ExclamationCircleIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';

// 导入类型定义（这些应该从主文件导入）
interface DiagnosisResult {
  healthScore: number;
  statistics: {
    totalEmployees: number;
    averageSalary: number;
  };
  complianceAnalysis: any;
  internalFairnessAnalysis: any;
  competitivenessAnalysis: any;
  structureAnalysis: any;
  costEfficiencyAnalysis: any;
  keyTalentAnalysis: any;
  anomaliesDetection: any;
  actionPlan: any;
}

interface Props {
  result: DiagnosisResult;
  onReset: () => void;
}

export const ProfessionalDiagnosisResults: React.FC<Props> = ({ result, onReset }) => {
  const [activeModule, setActiveModule] = useState<string>('overview');
  const [isExporting, setIsExporting] = useState(false);
  
  // 将result赋值给data以保持向后兼容
  const data = result;

  // 导出行动方案报告
  const handleDownloadActionPlan = async () => {
    try {
      const companyName = '示例企业'; // 可以从props或context中获取
      await ReportExportService.exportActionPlan(data?.actionPlan, companyName);
      alert('行动方案报告下载成功！');
    } catch (error) {
      console.error('行动方案下载失败:', error);
      alert(`行动方案下载失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  // 导出报告功能
  const handleExportReport = async (format: 'pdf' | 'excel') => {
    setIsExporting(true);
    try {
      const companyName = '示例企业'; // 可以从props或context中获取
      
      // 转换数据格式以匹配导出服务的接口
      const exportData = {
        ...data,
        statistics: {
          ...data.statistics,
          salaryRange: (data.statistics as any).salaryRange || { min: 0, max: 0 }
        }
      };

      if (format === 'pdf') {
        await ReportExportService.exportToPDF(exportData, companyName);
        alert('PDF报告导出成功！');
      } else {
        await ReportExportService.exportToExcel(exportData, companyName);
        alert('Excel报告导出成功！');
      }
      
      console.log(`✅ ${format.toUpperCase()}报告导出成功`);
    } catch (error) {
      console.error('导出报告失败:', error);
      alert(`导出${format === 'pdf' ? 'PDF' : 'Excel'}报告失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsExporting(false);
    }
  };


  const modules = [
    { id: 'overview', name: '诊断总览', icon: ChartBarIcon, color: 'blue' },
    { id: 'compliance', name: '合规性诊断', icon: ShieldCheckIcon, color: 'red' },
    { id: 'fairness', name: '内部公平性', icon: ScaleIcon, color: 'green' },
    { id: 'competitiveness', name: '外部竞争力', icon: TrophyIcon, color: 'purple' },
    { id: 'structure', name: '薪酬结构', icon: CogIcon, color: 'indigo' },
    { id: 'efficiency', name: '成本效率', icon: BanknotesIcon, color: 'yellow' },
    { id: 'talent', name: '关键人才', icon: StarIcon, color: 'pink' },
    { id: 'anomalies', name: '异常检测', icon: ExclamationCircleIcon, color: 'orange' },
    { id: 'action', name: '行动方案', icon: DocumentTextIcon, color: 'teal' }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* 操作栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            专业诊断完成 • {result.statistics.totalEmployees} 名员工
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBgColor(result.healthScore)} ${getScoreColor(result.healthScore)}`}>
            健康度: {result.healthScore}分
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={onReset}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-50"
          >
            重新分析
          </button>
          <div className="flex space-x-2">
            <button 
              onClick={() => handleExportReport('pdf')}
              disabled={isExporting}
              className={`px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors rounded-lg font-medium flex items-center space-x-2 ${
                isExporting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              <span>{isExporting ? '导出中...' : '导出PDF报告'}</span>
            </button>
            <button 
              onClick={() => handleExportReport('excel')}
              disabled={isExporting}
              className={`px-4 py-2 bg-green-600 text-white hover:bg-green-700 transition-colors rounded-lg font-medium flex items-center space-x-2 ${
                isExporting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              <span>{isExporting ? '导出中...' : '导出Excel报告'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 模块导航 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">诊断模块</h3>
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
          {modules.map((module) => {
            const Icon = module.icon;
            const isActive = activeModule === module.id;
            return (
              <button
                key={module.id}
                onClick={() => setActiveModule(module.id)}
                className={`p-3 rounded-xl text-center transition-all ${
                  isActive 
                    ? `bg-${module.color}-100 text-${module.color}-700 ring-2 ring-${module.color}-200` 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-6 h-6 mx-auto mb-2" />
                <div className="text-xs font-medium">{module.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 模块内容 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 min-h-[600px]">
        {activeModule === 'overview' && <OverviewModule result={result} />}
        {activeModule === 'compliance' && <ComplianceModule data={result.complianceAnalysis} />}
        {activeModule === 'fairness' && <FairnessModule data={result.internalFairnessAnalysis} />}
        {activeModule === 'competitiveness' && <CompetitivenessModule data={result.competitivenessAnalysis} />}
        {activeModule === 'structure' && <StructureModule data={result.structureAnalysis} />}
        {activeModule === 'efficiency' && <EfficiencyModule data={result.costEfficiencyAnalysis} />}
        {activeModule === 'talent' && <TalentModule data={result.keyTalentAnalysis} />}
        {activeModule === 'anomalies' && <AnomaliesModule data={result.anomaliesDetection} />}
        {activeModule === 'action' && <ActionModule data={result.actionPlan} onDownloadActionPlan={handleDownloadActionPlan} />}
      </div>
    </div>
  );
};

// 诊断总览模块
const OverviewModule: React.FC<{ result: DiagnosisResult }> = ({ result }) => (
  <div className="space-y-6">
    <div className="flex items-center space-x-3">
      <ChartBarIcon className="w-6 h-6 text-blue-600" />
      <h4 className="text-xl font-semibold text-gray-900">诊断总览</h4>
    </div>
    
    {/* 健康度仪表盘 */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="text-center">
        <div className="relative w-32 h-32 mx-auto">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
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
              className={result.healthScore >= 80 ? 'text-green-500' : result.healthScore >= 60 ? 'text-yellow-500' : 'text-red-500'}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{result.healthScore}</div>
              <div className="text-sm text-gray-500">分</div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <h5 className="font-semibold text-gray-900">薪酬健康度</h5>
          <p className="text-sm text-gray-600 mt-1">
            {result.healthScore >= 80 ? '优秀' : result.healthScore >= 60 ? '良好' : '需改进'}
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        <h5 className="font-semibold text-gray-900">核心指标</h5>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">员工总数</span>
            <span className="font-semibold">{result.statistics.totalEmployees}人</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">平均薪酬</span>
            <span className="font-semibold">¥{result.statistics.averageSalary.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">合规评分</span>
            <span className={`font-semibold ${result.complianceAnalysis?.overallScore >= 80 ? 'text-green-600' : 'text-red-600'}`}>
              {result.complianceAnalysis?.overallScore || 0}分
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">公平性评分</span>
            <span className={`font-semibold ${result.internalFairnessAnalysis?.overallScore >= 70 ? 'text-green-600' : 'text-yellow-600'}`}>
              {result.internalFairnessAnalysis?.overallScore || 0}分
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">竞争力评分</span>
            <span className={`font-semibold ${result.competitivenessAnalysis?.overallScore >= 70 ? 'text-green-600' : 'text-yellow-600'}`}>
              {result.competitivenessAnalysis?.overallScore || 0}分
            </span>
          </div>
        </div>
      </div>
    </div>

    {/* 关键发现 */}
    <div>
      <h5 className="font-semibold text-gray-900 mb-3">关键发现</h5>
      <div className="space-y-2">
        {result.actionPlan?.keyFindings?.map((finding: string, index: number) => (
          <div key={index} className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
            <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-gray-700">{finding}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// 合规性诊断模块
const ComplianceModule: React.FC<{ data: any }> = ({ data }) => (
  <div className="space-y-6">
    <div className="flex items-center space-x-3">
      <ShieldCheckIcon className="w-6 h-6 text-red-600" />
      <h4 className="text-xl font-semibold text-gray-900">薪酬合规性诊断</h4>
      <div className={`px-3 py-1 rounded-full text-sm font-medium ${data?.overallScore >= 90 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {data?.overallScore || 0}分
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="p-4 border border-gray-200 rounded-lg">
        <h6 className="font-medium text-gray-900 mb-2">基本工资合规</h6>
        <div className="text-2xl font-bold text-red-600 mb-1">
          {data?.basicSalaryCompliance?.belowMinimumWage?.count || 0}
        </div>
        <div className="text-sm text-gray-600">人低于最低工资</div>
      </div>

      <div className="p-4 border border-gray-200 rounded-lg">
        <h6 className="font-medium text-gray-900 mb-2">社保合规</h6>
        <div className="text-2xl font-bold text-yellow-600 mb-1">
          {data?.socialInsuranceCompliance?.baseMismatch?.percentage || 0}%
        </div>
        <div className="text-sm text-gray-600">基数不匹配</div>
      </div>

      <div className="p-4 border border-gray-200 rounded-lg">
        <h6 className="font-medium text-gray-900 mb-2">个税合规</h6>
        <div className="text-2xl font-bold text-orange-600 mb-1">
          {data?.taxCompliance?.discrepancies?.count || 0}
        </div>
        <div className="text-sm text-gray-600">人存在差异</div>
      </div>

      <div className="p-4 border border-gray-200 rounded-lg">
        <h6 className="font-medium text-gray-900 mb-2">发放时效</h6>
        <div className="text-2xl font-bold text-blue-600 mb-1">
          {data?.paymentTimeliness?.delayedPayments?.months || 0}
        </div>
        <div className="text-sm text-gray-600">月延迟发放</div>
      </div>
    </div>

    {/* 风险提示 */}
    <div>
      <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
        <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-2" />
        风险提示
      </h5>
      <div className="space-y-3">
        {data?.risks?.map((risk: any, index: number) => (
          <div key={index} className={`p-4 rounded-lg border-l-4 ${
            risk.severity === 'high' ? 'bg-red-50 border-red-400' :
            risk.severity === 'medium' ? 'bg-yellow-50 border-yellow-400' :
            'bg-blue-50 border-blue-400'
          }`}>
            <div className="flex justify-between items-start">
              <div>
                <h6 className="font-medium text-gray-900">{risk.type}</h6>
                <p className="text-sm text-gray-600 mt-1">{risk.description}</p>
              </div>
              <div className="text-sm text-gray-500">
                影响 {risk.affectedCount} 人
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* 整改建议 */}
    <div>
      <h5 className="font-semibold text-gray-900 mb-3">整改建议</h5>
      <div className="space-y-3">
        {data?.recommendations?.map((rec: any, index: number) => (
          <div key={index} className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    rec.priority === 'urgent' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {rec.priority === 'urgent' ? '紧急' : '重要'}
                  </span>
                  <span className="font-medium text-gray-900">{rec.action}</span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  时间要求：{rec.timeline} | 预计成本：¥{rec.cost?.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// 其他模块组件（简化版本，实际使用时需要完整实现）
const FairnessModule: React.FC<{ data: any }> = ({ data }) => (
  <div className="space-y-6">
    <div className="flex items-center space-x-3">
      <ScaleIcon className="w-6 h-6 text-green-600" />
      <h4 className="text-xl font-semibold text-gray-900">内部公平性诊断</h4>
      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
        data?.overallScore >= 80 ? 'bg-green-100 text-green-700' : 
        data?.overallScore >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
      }`}>
        {data?.overallScore || 0}分
      </div>
    </div>

    {/* 岗位内公平性分析 */}
    <div>
      <h5 className="font-semibold text-gray-900 mb-4">岗位内公平性分析</h5>
      <div className="space-y-4">
        {data?.positionFairness?.map((position: any, index: number) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h6 className="font-medium text-gray-900">{position.position}</h6>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                position.variationCoefficient <= 0.2 ? 'bg-green-100 text-green-700' :
                position.variationCoefficient <= 0.3 ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                变异系数: {position.variationCoefficient}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-lg font-bold text-red-600">¥{position.lowGroup.avgSalary.toLocaleString()}</div>
                <div className="text-sm text-gray-600">低薪酬组 ({position.lowGroup.count}人)</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">
                  ¥{Math.round((position.lowGroup.avgSalary + position.highGroup.avgSalary) / 2).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">岗位中位数</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">¥{position.highGroup.avgSalary.toLocaleString()}</div>
                <div className="text-sm text-gray-600">高薪酬组 ({position.highGroup.count}人)</div>
              </div>
            </div>

            <div className="mb-3">
              <div className="text-sm text-gray-600 mb-2">主要差异因素:</div>
              <div className="flex flex-wrap gap-2">
                {position.mainDifferences.map((diff: string, i: number) => (
                  <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    {diff}
                  </span>
                ))}
              </div>
            </div>

            {position.adjustmentNeeded.length > 0 && (
              <div className="bg-yellow-50 p-3 rounded-lg">
                <div className="text-sm font-medium text-yellow-800 mb-2">
                  建议调薪员工 ({position.adjustmentNeeded.length}人):
                </div>
                <div className="space-y-2">
                  {position.adjustmentNeeded.slice(0, 3).map((emp: any, i: number) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <span className="text-gray-700 chinese-text">
                        {String(emp.name || '未知员工')}
                      </span>
                      <span className="text-yellow-700">
                        ¥{emp.current.toLocaleString()} → ¥{emp.suggested.toLocaleString()}
                      </span>
                    </div>
                  ))}
                  {position.adjustmentNeeded.length > 3 && (
                    <div className="text-xs text-gray-500">
                      还有 {position.adjustmentNeeded.length - 3} 人...
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>

    {/* 职级薪酬合理性 */}
    <div>
      <h5 className="font-semibold text-gray-900 mb-4">职级薪酬合理性</h5>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data?.levelFairness?.map((level: any, index: number) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <h6 className="font-medium text-gray-900 mb-3">{level.level}</h6>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">最小值</span>
                <span className="font-medium">¥{level.salaryRange.min.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">中位数</span>
                <span className="font-medium">¥{level.salaryRange.median.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">最大值</span>
                <span className="font-medium">¥{level.salaryRange.max.toLocaleString()}</span>
              </div>
            </div>
            {level.inversions.length > 0 && (
              <div className="mt-3 p-2 bg-red-50 rounded text-xs text-red-700">
                发现 {level.inversions.length} 个薪酬倒挂问题
              </div>
            )}
          </div>
        ))}
      </div>
    </div>

    {/* 司龄薪酬公平性 */}
    <div>
      <h5 className="font-semibold text-gray-900 mb-4">司龄薪酬公平性</h5>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {data?.tenureFairness?.segments?.map((segment: any, index: number) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <h6 className="font-medium text-gray-900 mb-3">{segment.range}</h6>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">年均增长率</span>
                <span className={`font-bold ${
                  segment.avgGrowthRate >= 8 ? 'text-green-600' :
                  segment.avgGrowthRate >= 5 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {segment.avgGrowthRate}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">离职率</span>
                <span className={`font-bold ${
                  segment.turnoverRate <= 10 ? 'text-green-600' :
                  segment.turnoverRate <= 15 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {segment.turnoverRate}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="text-sm font-medium text-blue-800 mb-2">优化建议:</div>
        <ul className="text-sm text-blue-700 space-y-1">
          {data?.tenureFairness?.recommendations?.map((rec: string, index: number) => (
            <li key={index} className="flex items-start">
              <span className="mr-2">•</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>

    {/* 性别薪酬差距 */}
    <div>
      <h5 className="font-semibold text-gray-900 mb-4">性别薪酬差距分析</h5>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <h6 className="font-medium text-gray-900 mb-3">整体差距</h6>
          <div className="text-center">
            <div className={`text-3xl font-bold ${
              data?.genderPayGap?.overall <= 5 ? 'text-green-600' :
              data?.genderPayGap?.overall <= 10 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {data?.genderPayGap?.overall || 0}%
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {data?.genderPayGap?.overall <= 5 ? '差距较小' :
               data?.genderPayGap?.overall <= 10 ? '需要关注' : '差距较大'}
            </div>
          </div>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <h6 className="font-medium text-gray-900 mb-3">分岗位分析</h6>
          <div className="space-y-2">
            {data?.genderPayGap?.byPosition?.map((pos: any, index: number) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{pos.position}</span>
                <div className="text-right">
                  <div className={`text-sm font-medium ${
                    pos.gap <= 5 ? 'text-green-600' :
                    pos.gap <= 10 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {pos.gap}%
                  </div>
                  <div className="text-xs text-gray-500">{pos.significance}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const CompetitivenessModule: React.FC<{ data: any }> = ({ data }) => (
  <div className="space-y-6">
    <div className="flex items-center space-x-3">
      <TrophyIcon className="w-6 h-6 text-purple-600" />
      <h4 className="text-xl font-semibold text-gray-900">外部竞争力诊断</h4>
      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
        data?.overallScore >= 80 ? 'bg-green-100 text-green-700' : 
        data?.overallScore >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
      }`}>
        {data?.overallScore || 0}分
      </div>
    </div>

    {/* 市场定位分析 */}
    <div>
      <h5 className="font-semibold text-gray-900 mb-4">市场定位分析</h5>
      <div className="space-y-4">
        {data?.marketPositioning?.map((category: any, index: number) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h6 className="font-medium text-gray-900">{category.category}</h6>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                category.competitiveness === 'leading' ? 'bg-green-100 text-green-700' :
                category.competitiveness === 'following' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {category.competitiveness === 'leading' ? '市场领先' :
                 category.competitiveness === 'following' ? '市场跟随' : '市场落后'}
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">¥{category.companyAvg.toLocaleString()}</div>
                <div className="text-sm text-gray-600">公司平均</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-600">¥{category.market25th.toLocaleString()}</div>
                <div className="text-sm text-gray-600">市场25分位</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-600">¥{category.market50th.toLocaleString()}</div>
                <div className="text-sm text-gray-600">市场50分位</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-600">¥{category.market75th.toLocaleString()}</div>
                <div className="text-sm text-gray-600">市场75分位</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">与市场中位数差距</span>
              <span className={`font-medium ${category.gap >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {category.gap >= 0 ? '+' : ''}¥{category.gap.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* 核心岗位竞争力 */}
    <div>
      <h5 className="font-semibold text-gray-900 mb-4">核心岗位竞争力</h5>
      <div className="space-y-4">
        {data?.keyPositionAnalysis?.map((position: any, index: number) => (
          <div key={index} className={`border rounded-lg p-4 ${
            position.riskLevel === 'high' ? 'border-red-200 bg-red-50' :
            position.riskLevel === 'medium' ? 'border-yellow-200 bg-yellow-50' :
            'border-green-200 bg-green-50'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <h6 className="font-medium text-gray-900">{position.position}</h6>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                position.riskLevel === 'high' ? 'bg-red-100 text-red-700' :
                position.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {position.riskLevel === 'high' ? '高风险' :
                 position.riskLevel === 'medium' ? '中风险' : '低风险'}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-lg font-bold text-gray-900">¥{position.current.toLocaleString()}</div>
                <div className="text-sm text-gray-600">当前薪酬</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-lg font-bold text-purple-600">¥{position.market75th.toLocaleString()}</div>
                <div className="text-sm text-gray-600">市场75分位</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className={`text-lg font-bold ${position.gap > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  ¥{Math.abs(position.gap).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  {position.gap > 0 ? '薪酬差距' : '薪酬优势'}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">年度调整成本</span>
              <span className="font-medium text-gray-900">¥{position.adjustmentCost.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* 行业基准对比 */}
    <div>
      <h5 className="font-semibold text-gray-900 mb-4">行业基准对比</h5>
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-purple-600">{data?.industryBenchmark?.overallRanking || 0}</div>
              <div className="text-sm text-gray-600">行业排名 (百分位)</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-medium text-gray-900">{data?.industryBenchmark?.industry}</div>
              <div className="text-sm text-gray-600">对标行业</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h6 className="font-medium text-gray-900 mb-2">竞争优势</h6>
              <div className="space-y-1">
                {data?.industryBenchmark?.strengths?.map((strength: string, index: number) => (
                  <div key={index} className="flex items-center text-sm text-green-700">
                    <CheckCircleIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{strength}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h6 className="font-medium text-gray-900 mb-2">改进空间</h6>
              <div className="space-y-1">
                {data?.industryBenchmark?.weaknesses?.map((weakness: string, index: number) => (
                  <div key={index} className="flex items-center text-sm text-red-700">
                    <ExclamationTriangleIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{weakness}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const StructureModule: React.FC<{ data: any }> = ({ data }) => (
  <div className="space-y-6">
    <div className="flex items-center space-x-3">
      <CogIcon className="w-6 h-6 text-indigo-600" />
      <h4 className="text-xl font-semibold text-gray-900">薪酬结构分析</h4>
      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
        data?.overallScore >= 80 ? 'bg-green-100 text-green-700' : 
        data?.overallScore >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
      }`}>
        {data?.overallScore || 0}分
      </div>
    </div>

    {/* 固浮比分析 */}
    <div>
      <h5 className="font-semibold text-gray-900 mb-4">固浮比分析</h5>
      <div className="space-y-4">
        {data?.fixedVariableRatio?.map((category: any, index: number) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h6 className="font-medium text-gray-900">{category.category}</h6>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                category.assessment === 'optimal' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {category.assessment === 'optimal' ? '结构合理' : '需要调整'}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h6 className="text-sm font-medium text-gray-900 mb-3">当前结构</h6>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{category.fixedRatio}%</div>
                    <div className="text-sm text-gray-600">固定薪酬</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{category.variableRatio}%</div>
                    <div className="text-sm text-gray-600">浮动薪酬</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h6 className="text-sm font-medium text-gray-900 mb-3">行业基准</h6>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-600">{category.industryBenchmark.fixed}%</div>
                    <div className="text-sm text-gray-600">固定薪酬</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-600">{category.industryBenchmark.variable}%</div>
                    <div className="text-sm text-gray-600">浮动薪酬</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* 激励有效性分析 */}
    <div>
      <h5 className="font-semibold text-gray-900 mb-4">激励有效性分析</h5>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <h6 className="font-medium text-gray-900 mb-3">销售激励</h6>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">与业绩相关性</span>
              <span className={`font-bold ${
                data?.incentiveEffectiveness?.salesIncentive?.correlationWithPerformance >= 0.7 ? 'text-green-600' :
                data?.incentiveEffectiveness?.salesIncentive?.correlationWithPerformance >= 0.5 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {(data?.incentiveEffectiveness?.salesIncentive?.correlationWithPerformance * 100)?.toFixed(0) || 0}%
              </span>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="font-medium text-gray-900">
                {data?.incentiveEffectiveness?.salesIncentive?.effectiveness || '待评估'}
              </div>
              <div className="text-sm text-gray-600">激励效果</div>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <h6 className="font-medium text-gray-900 mb-3">绩效奖金分布</h6>
          <div className="space-y-2">
            {data?.incentiveEffectiveness?.performanceBonus?.distribution?.map((grade: any, index: number) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{grade.grade}</span>
                <span className="font-medium text-gray-900">¥{grade.avgBonus.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 text-center text-sm text-gray-600">
            公平性评价: {data?.incentiveEffectiveness?.performanceBonus?.fairness || '待评估'}
          </div>
        </div>
      </div>
    </div>

    {/* 优化建议 */}
    <div>
      <h5 className="font-semibold text-gray-900 mb-4">结构优化建议</h5>
      <div className="space-y-3">
        {data?.recommendations?.map((rec: any, index: number) => (
          <div key={index} className="bg-indigo-50 p-4 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h6 className="font-medium text-gray-900">{rec.area}</h6>
                <div className="mt-2 text-sm text-gray-600">
                  <div>当前状况: {rec.current}</div>
                  <div>建议调整: {rec.suggested}</div>
                  <div className="text-indigo-700 font-medium">预期效果: {rec.expectedImpact}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const EfficiencyModule: React.FC<{ data: any }> = ({ data }) => (
  <div className="space-y-6">
    <div className="flex items-center space-x-3">
      <BanknotesIcon className="w-6 h-6 text-yellow-600" />
      <h4 className="text-xl font-semibold text-gray-900">成本效率分析</h4>
      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
        data?.overallScore >= 80 ? 'bg-green-100 text-green-700' : 
        data?.overallScore >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
      }`}>
        {data?.overallScore || 0}分
      </div>
    </div>

    {/* 成本结构分析 */}
    <div>
      <h5 className="font-semibold text-gray-900 mb-4">部门成本结构分析</h5>
      <div className="space-y-4">
        {data?.costStructure?.map((dept: any, index: number) => (
          <div key={index} className={`border rounded-lg p-4 ${
            dept.assessment === 'efficient' ? 'border-green-200 bg-green-50' :
            dept.assessment === 'acceptable' ? 'border-yellow-200 bg-yellow-50' :
            'border-red-200 bg-red-50'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h6 className="font-medium text-gray-900">{dept.department}</h6>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                dept.assessment === 'efficient' ? 'bg-green-100 text-green-700' :
                dept.assessment === 'acceptable' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {dept.assessment === 'efficient' ? '高效' :
                 dept.assessment === 'acceptable' ? '可接受' : '需改进'}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-lg font-bold text-blue-600">{dept.costPercentage}%</div>
                <div className="text-sm text-gray-600">成本占比</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-lg font-bold text-green-600">{dept.revenueContribution}%</div>
                <div className="text-sm text-gray-600">收入贡献</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className={`text-lg font-bold ${dept.efficiency >= 1.5 ? 'text-green-600' : 
                  dept.efficiency >= 1.0 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {dept.efficiency.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">效率比</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* 人效分析 */}
    <div>
      <h5 className="font-semibold text-gray-900 mb-4">人效分析</h5>
      <div className="space-y-4">
        {data?.productivityAnalysis?.map((category: any, index: number) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <h6 className="font-medium text-gray-900 mb-4">{category.category}</h6>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">¥{category.avgSalary.toLocaleString()}</div>
                <div className="text-sm text-gray-600">人均薪酬</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">¥{category.avgOutput.toLocaleString()}</div>
                <div className="text-sm text-gray-600">人均产出</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-lg font-bold text-purple-600">1:{category.productivityRatio}</div>
                <div className="text-sm text-gray-600">投入产出比</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-600">1:{category.benchmark}</div>
                <div className="text-sm text-gray-600">行业基准</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* 优化建议 */}
    <div>
      <h5 className="font-semibold text-gray-900 mb-4">效率优化建议</h5>
      <div className="space-y-3">
        {data?.recommendations?.map((rec: any, index: number) => (
          <div key={index} className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h6 className="font-medium text-gray-900">{rec.department}</h6>
                <div className="mt-2 text-sm text-gray-600">
                  <div>问题: {rec.issue}</div>
                  <div>解决方案: {rec.solution}</div>
                  <div className="text-yellow-700 font-medium">预期节省: ¥{rec.expectedSaving.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const TalentModule: React.FC<{ data: any }> = ({ data }) => (
  <div className="space-y-6">
    <div className="flex items-center space-x-3">
      <StarIcon className="w-6 h-6 text-pink-600" />
      <h4 className="text-xl font-semibold text-gray-900">关键人才分析</h4>
      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
        data?.overallScore >= 80 ? 'bg-green-100 text-green-700' : 
        data?.overallScore >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
      }`}>
        {data?.overallScore || 0}分
      </div>
    </div>

    {/* 关键人才概览 */}
    <div>
      <h5 className="font-semibold text-gray-900 mb-4">关键人才概览</h5>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{data?.retentionRisk?.highRisk || 0}</div>
          <div className="text-sm text-gray-600">高流失风险</div>
        </div>
        <div className="text-center p-4 bg-yellow-50 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">{data?.retentionRisk?.mediumRisk || 0}</div>
          <div className="text-sm text-gray-600">中流失风险</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{data?.retentionRisk?.lowRisk || 0}</div>
          <div className="text-sm text-gray-600">低流失风险</div>
        </div>
        <div className="text-center p-4 bg-pink-50 rounded-lg">
          <div className="text-2xl font-bold text-pink-600">{data?.retentionRisk?.totalAtRisk || 0}</div>
          <div className="text-sm text-gray-600">总风险人数</div>
        </div>
      </div>
    </div>

    {/* 关键人才列表 */}
    <div>
      <h5 className="font-semibold text-gray-900 mb-4">关键人才详情</h5>
      <div className="space-y-4">
        {data?.keyTalentList?.map((talent: any, index: number) => (
          <div key={index} className={`border rounded-lg p-4 ${
            talent.riskLevel === 'high' ? 'border-red-200 bg-red-50' :
            talent.riskLevel === 'medium' ? 'border-yellow-200 bg-yellow-50' :
            'border-green-200 bg-green-50'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h6 className="font-medium text-gray-900 chinese-text">
                  {String(talent.name || '未知员工')}
                </h6>
                <div className="text-sm text-gray-600">{talent.position} • {talent.level}</div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                talent.riskLevel === 'high' ? 'bg-red-100 text-red-700' :
                talent.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {talent.riskLevel === 'high' ? '高风险' :
                 talent.riskLevel === 'medium' ? '中风险' : '低风险'}
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-lg font-bold text-gray-900">¥{talent.currentSalary.toLocaleString()}</div>
                <div className="text-sm text-gray-600">当前薪酬</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-lg font-bold text-pink-600">¥{talent.marketValue.toLocaleString()}</div>
                <div className="text-sm text-gray-600">市场价值</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-lg font-bold text-red-600">¥{talent.gap.toLocaleString()}</div>
                <div className="text-sm text-gray-600">薪酬差距</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-lg font-bold text-blue-600">{talent.tenure}年</div>
                <div className="text-sm text-gray-600">司龄</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-lg font-bold text-green-600">{talent.performance}</div>
                <div className="text-sm text-gray-600">绩效等级</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* 保留建议 */}
    <div>
      <h5 className="font-semibold text-gray-900 mb-4">人才保留建议</h5>
      <div className="space-y-4">
        {data?.recommendations?.map((rec: any, index: number) => (
          <div key={index} className="bg-pink-50 p-4 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h6 className="font-medium text-gray-900">{rec.name}</h6>
                <div className="mt-2 text-sm text-gray-600">
                  <div>当前总包: ¥{rec.currentPackage.toLocaleString()}</div>
                  <div>建议总包: ¥{rec.suggestedPackage.toLocaleString()}</div>
                  <div>年度成本: ¥{rec.cost.toLocaleString()}</div>
                </div>
                <div className="mt-3">
                  <div className="text-sm font-medium text-gray-900 mb-1">保留策略:</div>
                  <div className="flex flex-wrap gap-2">
                    {rec.retentionStrategy.map((strategy: string, i: number) => (
                      <span key={i} className="px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded-full">
                        {strategy}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AnomaliesModule: React.FC<{ data: any }> = ({ data }) => (
  <div className="space-y-6">
    <div className="flex items-center space-x-3">
      <ExclamationCircleIcon className="w-6 h-6 text-orange-600" />
      <h4 className="text-xl font-semibold text-gray-900">异常数据检测</h4>
      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
        data?.dataQualityScore >= 90 ? 'bg-green-100 text-green-700' : 
        data?.dataQualityScore >= 70 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
      }`}>
        数据质量: {data?.dataQualityScore || 0}分
      </div>
    </div>

    {/* 异常数据列表 */}
    <div>
      <h5 className="font-semibold text-gray-900 mb-4">检测到的异常</h5>
      <div className="space-y-4">
        {data?.anomalies?.length > 0 ? (
          data.anomalies.map((anomaly: any, index: number) => (
            <div key={index} className={`border rounded-lg p-4 ${
              anomaly.severity === 'high' ? 'border-red-200 bg-red-50' :
              anomaly.severity === 'medium' ? 'border-yellow-200 bg-yellow-50' :
              'border-blue-200 bg-blue-50'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    anomaly.severity === 'high' ? 'bg-red-100 text-red-600' :
                    anomaly.severity === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    <ExclamationTriangleIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h6 className="font-medium text-gray-900">{anomaly.description}</h6>
                    <div className="text-sm text-gray-600">
                      类型: {
                        anomaly.type === 'value_anomaly' ? '数值异常' :
                        anomaly.type === 'logic_error' ? '逻辑错误' : '数据不一致'
                      }
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    anomaly.severity === 'high' ? 'bg-red-100 text-red-700' :
                    anomaly.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {anomaly.severity === 'high' ? '高' :
                     anomaly.severity === 'medium' ? '中' : '低'}严重性
                  </div>
                  {anomaly.autoFixAvailable && (
                    <button className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full hover:bg-green-200 transition-colors">
                      自动修复
                    </button>
                  )}
                </div>
              </div>
              
              <div>
                <h6 className="text-sm font-medium text-gray-900 mb-2">
                  受影响的员工 ({anomaly.affectedEmployees.length}人):
                </h6>
                <div className="space-y-2">
                  {anomaly.affectedEmployees.slice(0, 5).map((emp: any, i: number) => (
                    <div key={i} className="flex justify-between items-center text-sm p-2 bg-white rounded">
                      <span className="font-medium text-gray-900 chinese-text">
                        {String(emp.name || '未知员工')}
                      </span>
                      <span className="text-gray-600">{emp.issue}</span>
                      <span className="font-medium text-gray-900">{emp.current}</span>
                    </div>
                  ))}
                  {anomaly.affectedEmployees.length > 5 && (
                    <div className="text-xs text-gray-500 text-center">
                      还有 {anomaly.affectedEmployees.length - 5} 人...
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-8 bg-green-50 rounded-lg">
            <CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h6 className="font-medium text-gray-900 mb-1">数据质量良好</h6>
            <p className="text-sm text-gray-600">未检测到明显的数据异常</p>
          </div>
        )}
      </div>
    </div>

    {/* 数据完整性问题 */}
    <div>
      <h5 className="font-semibold text-gray-900 mb-4">数据完整性分析</h5>
      <div className="space-y-3">
        {data?.dataIntegrityIssues?.map((issue: any, index: number) => (
          <div key={index} className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h6 className="font-medium text-gray-900">{issue.issue}</h6>
                <div className="mt-2 text-sm text-gray-600">
                  <div>影响数量: {issue.count} 条记录</div>
                  <div>影响程度: {issue.impact}</div>
                  <div className="text-orange-700 font-medium">解决方案: {issue.resolution}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* 数据质量建议 */}
    <div className="bg-blue-50 p-4 rounded-lg">
      <h5 className="font-semibold text-gray-900 mb-3">数据质量提升建议</h5>
      <div className="space-y-2 text-sm text-blue-700">
        <div className="flex items-start">
          <span className="mr-2">•</span>
          <span>建立数据录入规范，确保关键字段的完整性和准确性</span>
        </div>
        <div className="flex items-start">
          <span className="mr-2">•</span>
          <span>设置数据验证规则，在源头防止异常数据的产生</span>
        </div>
        <div className="flex items-start">
          <span className="mr-2">•</span>
          <span>定期进行数据质量检查，及时发现和处理异常情况</span>
        </div>
        <div className="flex items-start">
          <span className="mr-2">•</span>
          <span>完善员工信息维护流程，确保数据的时效性</span>
        </div>
      </div>
    </div>
  </div>
);

const ActionModule: React.FC<{ data: any; onDownloadActionPlan: () => void }> = ({ data, onDownloadActionPlan }) => (
  <div className="space-y-6">
    <div className="flex items-center space-x-3">
      <DocumentTextIcon className="w-6 h-6 text-teal-600" />
      <h4 className="text-xl font-semibold text-gray-900">行动方案</h4>
    </div>
    
    {/* 优先级行动 */}
    <div>
      <h5 className="font-semibold text-gray-900 mb-3">优先级行动清单</h5>
      <div className="space-y-3">
        {data?.prioritizedActions?.map((action: any, index: number) => (
          <div key={index} className={`p-4 rounded-lg border-l-4 ${
            action.priority === 'urgent_important' ? 'bg-red-50 border-red-400' :
            action.priority === 'important_not_urgent' ? 'bg-blue-50 border-blue-400' :
            'bg-gray-50 border-gray-400'
          }`}>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h6 className="font-medium text-gray-900">{action.action}</h6>
                <div className="mt-2 text-sm text-gray-600">
                  <div>负责部门：{action.department}</div>
                  <div>完成时限：{action.timeline}</div>
                  <div>预期成本：¥{action.cost?.toLocaleString()}</div>
                  <div>预期ROI：{action.expectedROI}</div>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                action.priority === 'urgent_important' ? 'bg-red-100 text-red-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {action.priority === 'urgent_important' ? '紧急重要' : '重要不紧急'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* 可下载报告 */}
    <div>
      <h5 className="font-semibold text-gray-900 mb-3">可下载报告</h5>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data?.downloadableReports?.map((report: any, index: number) => (
          <div 
            key={index} 
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={onDownloadActionPlan}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h6 className="font-medium text-gray-900">{report.name}</h6>
                <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                <div className="text-xs text-gray-500 mt-2">
                  {report.type.toUpperCase()} • {report.size}
                </div>
              </div>
              <ArrowDownTrayIcon className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ProfessionalDiagnosisResults;
