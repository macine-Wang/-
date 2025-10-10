/**
 * 报告导出服务
 * 支持PDF和Excel格式的薪酬诊断报告导出
 */

import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

// 导入中文字体支持
import 'jspdf/dist/jspdf.es.min.js';

export interface DiagnosisData {
  healthScore: number;
  statistics: {
    totalEmployees: number;
    averageSalary: number;
    salaryRange: {
      min: number;
      max: number;
    };
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

export class ReportExportService {
  /**
   * 导出PDF报告
   */
  static async exportToPDF(data: DiagnosisData, companyName: string = '企业'): Promise<void> {
    try {
      // 创建PDF文档
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // 设置中文字体（使用系统默认字体）
      pdf.setFont('helvetica');
      
      let yPosition = 20;
      const pageHeight = pdf.internal.pageSize.height;
      const margin = 20;
      
      // 添加标题
      pdf.setFontSize(20);
      pdf.text(`${companyName}薪酬诊断报告`, margin, yPosition);
      yPosition += 15;
      
      // 添加生成时间
      pdf.setFontSize(10);
      pdf.text(`生成时间: ${new Date().toLocaleString('zh-CN')}`, margin, yPosition);
      yPosition += 15;
      
      // 添加健康度评分
      pdf.setFontSize(16);
      pdf.text('薪酬健康度评分', margin, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(14);
      pdf.text(`总体评分: ${data.healthScore}分`, margin, yPosition);
      yPosition += 15;
      
      // 添加基础统计信息
      pdf.setFontSize(16);
      pdf.text('基础统计', margin, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(12);
      pdf.text(`员工总数: ${data.statistics.totalEmployees}人`, margin, yPosition);
      yPosition += 8;
      pdf.text(`平均薪酬: ¥${data.statistics.averageSalary.toLocaleString()}`, margin, yPosition);
      yPosition += 8;
      pdf.text(`薪酬区间: ¥${data.statistics.salaryRange.min.toLocaleString()} - ¥${data.statistics.salaryRange.max.toLocaleString()}`, margin, yPosition);
      yPosition += 15;
      
      // 检查是否需要新页面
      if (yPosition > pageHeight - 50) {
        pdf.addPage();
        yPosition = 20;
      }
      
      // 添加各模块分析结果
      const modules = [
        { title: '合规性分析', data: data.complianceAnalysis, key: 'compliance' },
        { title: '内部公平性分析', data: data.internalFairnessAnalysis, key: 'fairness' },
        { title: '市场竞争力分析', data: data.competitivenessAnalysis, key: 'competitiveness' },
        { title: '薪酬结构分析', data: data.structureAnalysis, key: 'structure' },
        { title: '成本效率分析', data: data.costEfficiencyAnalysis, key: 'efficiency' },
        { title: '关键人才分析', data: data.keyTalentAnalysis, key: 'talent' },
        { title: '异常检测', data: data.anomaliesDetection, key: 'anomalies' },
        { title: '行动方案', data: data.actionPlan, key: 'action' }
      ];
      
      for (const module of modules) {
        // 检查是否需要新页面
        if (yPosition > pageHeight - 80) {
          pdf.addPage();
          yPosition = 20;
        }
        
        pdf.setFontSize(16);
        pdf.text(module.title, margin, yPosition);
        yPosition += 10;
        
        pdf.setFontSize(12);
        if (module.data && module.data.overallScore !== undefined) {
          pdf.text(`评分: ${module.data.overallScore}分`, margin, yPosition);
          yPosition += 8;
        }
        
        // 添加风险提示
        if (module.data && module.data.risks && module.data.risks.length > 0) {
          pdf.text('主要风险:', margin, yPosition);
          yPosition += 6;
          module.data.risks.slice(0, 3).forEach((risk: any, index: number) => {
            pdf.text(`${index + 1}. ${risk.description || risk}`, margin + 5, yPosition);
            yPosition += 6;
          });
        }
        
        // 添加建议
        if (module.data && module.data.recommendations && module.data.recommendations.length > 0) {
          pdf.text('改进建议:', margin, yPosition);
          yPosition += 6;
          module.data.recommendations.slice(0, 3).forEach((rec: any, index: number) => {
            pdf.text(`${index + 1}. ${rec.description || rec}`, margin + 5, yPosition);
            yPosition += 6;
          });
        }
        
        yPosition += 10;
      }
      
      // 保存PDF
      const fileName = `${companyName}薪酬诊断报告_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('PDF导出失败:', error);
      throw new Error('PDF导出失败，请重试');
    }
  }

  /**
   * 导出Excel报告
   */
  static async exportToExcel(data: DiagnosisData, companyName: string = '企业'): Promise<void> {
    try {
      // 创建工作簿
      const workbook = XLSX.utils.book_new();
      
      // 1. 概览页
      const summaryData = [
        ['薪酬诊断报告概览', ''],
        ['公司名称', companyName],
        ['生成时间', new Date().toLocaleString('zh-CN')],
        ['', ''],
        ['健康度评分', data.healthScore + '分'],
        ['员工总数', data.statistics.totalEmployees + '人'],
        ['平均薪酬', '¥' + data.statistics.averageSalary.toLocaleString()],
        ['薪酬区间', `¥${data.statistics.salaryRange.min.toLocaleString()} - ¥${data.statistics.salaryRange.max.toLocaleString()}`]
      ];
      
      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
      
      // 设置列宽
      summarySheet['!cols'] = [
        { width: 20 },
        { width: 30 }
      ];
      
      XLSX.utils.book_append_sheet(workbook, summarySheet, '概览');
      
      // 2. 内部公平性分析页
      if (data.internalFairnessAnalysis && data.internalFairnessAnalysis.positionFairness) {
        const fairnessData = [
          ['岗位公平性分析', '', '', '', '', ''],
          ['岗位', '变异系数', '低薪组平均', '低薪组人数', '高薪组平均', '高薪组人数'],
          ...data.internalFairnessAnalysis.positionFairness.map((pos: any) => [
            pos.position,
            pos.variationCoefficient,
            '¥' + pos.lowGroup.avgSalary.toLocaleString(),
            pos.lowGroup.count + '人',
            '¥' + pos.highGroup.avgSalary.toLocaleString(),
            pos.highGroup.count + '人'
          ])
        ];
        
        const fairnessSheet = XLSX.utils.aoa_to_sheet(fairnessData);
        fairnessSheet['!cols'] = [
          { width: 15 },
          { width: 12 },
          { width: 15 },
          { width: 12 },
          { width: 15 },
          { width: 12 }
        ];
        
        XLSX.utils.book_append_sheet(workbook, fairnessSheet, '内部公平性');
      }
      
      // 3. 关键人才分析页
      if (data.keyTalentAnalysis && data.keyTalentAnalysis.keyTalentList) {
        const talentData = [
          ['关键人才分析', '', '', '', '', '', ''],
          ['姓名', '岗位', '级别', '当前薪酬', '市场价值', '薪酬差距', '风险等级'],
          ...data.keyTalentAnalysis.keyTalentList.map((talent: any) => [
            talent.name,
            talent.position,
            talent.level,
            '¥' + talent.currentSalary.toLocaleString(),
            '¥' + talent.marketValue.toLocaleString(),
            '¥' + talent.gap.toLocaleString(),
            talent.riskLevel === 'high' ? '高风险' : talent.riskLevel === 'medium' ? '中风险' : '低风险'
          ])
        ];
        
        const talentSheet = XLSX.utils.aoa_to_sheet(talentData);
        talentSheet['!cols'] = [
          { width: 12 },
          { width: 15 },
          { width: 10 },
          { width: 15 },
          { width: 15 },
          { width: 15 },
          { width: 12 }
        ];
        
        XLSX.utils.book_append_sheet(workbook, talentSheet, '关键人才');
      }
      
      // 4. 异常检测页
      if (data.anomaliesDetection && data.anomaliesDetection.anomalies) {
        const anomalyData = [
          ['异常检测结果', '', ''],
          ['类型', '描述', '严重程度']
        ];
        
        data.anomaliesDetection.anomalies.forEach((anomaly: any) => {
          anomalyData.push([
            anomaly.type,
            anomaly.description,
            anomaly.severity === 'high' ? '高' : anomaly.severity === 'medium' ? '中' : '低'
          ]);
          
          // 添加受影响员工
          if (anomaly.affectedEmployees && anomaly.affectedEmployees.length > 0) {
            anomalyData.push(['受影响员工', '', '']);
            anomaly.affectedEmployees.forEach((emp: any) => {
              anomalyData.push(['', emp.name, emp.issue]);
            });
            anomalyData.push(['', '', '']);
          }
        });
        
        const anomalySheet = XLSX.utils.aoa_to_sheet(anomalyData);
        anomalySheet['!cols'] = [
          { width: 15 },
          { width: 30 },
          { width: 12 }
        ];
        
        XLSX.utils.book_append_sheet(workbook, anomalySheet, '异常检测');
      }
      
      // 5. 行动方案页
      if (data.actionPlan) {
        const actionData = [
          ['行动方案', '', ''],
          ['优先级', '措施', '预期效果']
        ];
        
        ['immediate', 'shortTerm', 'longTerm'].forEach(term => {
          const termName = term === 'immediate' ? '立即执行' : term === 'shortTerm' ? '短期计划' : '长期规划';
          if (data.actionPlan[term]) {
            actionData.push([termName, '', '']);
            data.actionPlan[term].forEach((action: any) => {
              actionData.push(['', action.description || action, action.expectedOutcome || '']);
            });
            actionData.push(['', '', '']);
          }
        });
        
        const actionSheet = XLSX.utils.aoa_to_sheet(actionData);
        actionSheet['!cols'] = [
          { width: 15 },
          { width: 40 },
          { width: 25 }
        ];
        
        XLSX.utils.book_append_sheet(workbook, actionSheet, '行动方案');
      }
      
      // 保存Excel文件
      const fileName = `${companyName}薪酬诊断报告_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      
    } catch (error) {
      console.error('Excel导出失败:', error);
      throw new Error('Excel导出失败，请重试');
    }
  }

  /**
   * 导出行动方案报告
   */
  static async exportActionPlan(actionPlan: any, companyName: string = '企业'): Promise<void> {
    try {
      const workbook = XLSX.utils.book_new();
      
      const actionData = [
        [`${companyName}薪酬优化行动方案`, '', '', ''],
        ['生成时间', new Date().toLocaleString('zh-CN'), '', ''],
        ['', '', '', ''],
        ['执行阶段', '行动项目', '负责部门', '预期完成时间'],
        ['', '', '', '']
      ];
      
      // 立即执行项目
      if (actionPlan.immediate && actionPlan.immediate.length > 0) {
        actionData.push(['立即执行', '', '', '']);
        actionPlan.immediate.forEach((action: any, index: number) => {
          actionData.push([
            index === 0 ? '立即执行' : '',
            action.description || action,
            action.department || 'HR部门',
            action.timeline || '1周内'
          ]);
        });
        actionData.push(['', '', '', '']);
      }
      
      // 短期计划
      if (actionPlan.shortTerm && actionPlan.shortTerm.length > 0) {
        actionData.push(['短期计划', '', '', '']);
        actionPlan.shortTerm.forEach((action: any, index: number) => {
          actionData.push([
            index === 0 ? '短期计划' : '',
            action.description || action,
            action.department || 'HR部门',
            action.timeline || '1-3个月'
          ]);
        });
        actionData.push(['', '', '', '']);
      }
      
      // 长期规划
      if (actionPlan.longTerm && actionPlan.longTerm.length > 0) {
        actionData.push(['长期规划', '', '', '']);
        actionPlan.longTerm.forEach((action: any, index: number) => {
          actionData.push([
            index === 0 ? '长期规划' : '',
            action.description || action,
            action.department || 'HR部门',
            action.timeline || '3-12个月'
          ]);
        });
      }
      
      const actionSheet = XLSX.utils.aoa_to_sheet(actionData);
      actionSheet['!cols'] = [
        { width: 15 },
        { width: 40 },
        { width: 15 },
        { width: 15 }
      ];
      
      XLSX.utils.book_append_sheet(workbook, actionSheet, '行动方案');
      
      const fileName = `${companyName}薪酬优化行动方案_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      
    } catch (error) {
      console.error('行动方案导出失败:', error);
      throw new Error('行动方案导出失败，请重试');
    }
  }
}

export default ReportExportService;
