/**
 * PDF导出工具
 * 提供薪酬分析报告的PDF导出功能
 */

import { SalaryAnalysisResult } from '@/data/salaryAnalysisEngine';

export interface PDFExportOptions {
  filename?: string;
  includeCharts?: boolean;
  includeDataTable?: boolean;
  format?: 'A4' | 'Letter';
  orientation?: 'portrait' | 'landscape';
}

export class PDFExporter {
  private static readonly DEFAULT_OPTIONS: PDFExportOptions = {
    filename: '薪酬分析报告',
    includeCharts: true,
    includeDataTable: true,
    format: 'A4',
    orientation: 'portrait'
  };

  /**
   * 导出薪酬分析报告为PDF
   */
  static async exportSalaryReport(
    analysisResult: SalaryAnalysisResult,
    queryData: any,
    options: Partial<PDFExportOptions> = {}
  ): Promise<void> {
    const config = { ...this.DEFAULT_OPTIONS, ...options };
    
    try {
      // 创建打印友好的HTML内容
      const printContent = this.generatePrintableHTML(analysisResult, queryData, config);
      
      // 使用新的方法直接下载PDF
      await this.downloadAsPDF(printContent, config);
      
    } catch (error) {
      console.error('PDF导出失败:', error);
      throw new Error('PDF导出失败，请重试');
    }
  }

  /**
   * 生成可打印的HTML内容
   */
  private static generatePrintableHTML(
    analysisResult: SalaryAnalysisResult,
    queryData: any,
    config: PDFExportOptions
  ): string {
    const timestamp = new Date().toLocaleString('zh-CN');
    const formatSalary = (amount: number) => `¥${(amount / 1000).toFixed(1)}K`;

    return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.filename}</title>
    <style>
        ${this.getPrintStyles(config)}
    </style>
</head>
<body>
    <div class="report-container">
        <!-- 报告头部 -->
        <header class="report-header">
            <div class="header-content">
                <h1>智能薪酬分析报告</h1>
                <div class="report-meta">
                    <p>生成时间: ${timestamp}</p>
                    <p>置信度: ${analysisResult.estimatedSalary.confidence}%</p>
                </div>
            </div>
            <div class="logo">
                <div class="logo-circle">ISMT</div>
            </div>
        </header>

        <!-- 基本信息 -->
        <section class="basic-info">
            <h2>基本信息</h2>
            <div class="info-grid">
                <div class="info-item">
                    <label>行业领域:</label>
                    <span>${queryData.industry}</span>
                </div>
                <div class="info-item">
                    <label>职位:</label>
                    <span>${queryData.position}</span>
                </div>
                <div class="info-item">
                    <label>工作地点:</label>
                    <span>${queryData.location}</span>
                </div>
                <div class="info-item">
                    <label>工作经验:</label>
                    <span>${queryData.experience}</span>
                </div>
                <div class="info-item">
                    <label>学历:</label>
                    <span>${queryData.education}</span>
                </div>
                <div class="info-item">
                    <label>分析日期:</label>
                    <span>${timestamp.split(' ')[0]}</span>
                </div>
            </div>
        </section>

        <!-- 薪酬估算结果 -->
        <section class="salary-estimation">
            <h2>薪酬估算结果</h2>
            <div class="salary-grid">
                <div class="salary-item highlight">
                    <h3>期望薪酬</h3>
                    <div class="salary-value">${formatSalary(analysisResult.estimatedSalary.median)}</div>
                    <p>月薪(税前)</p>
                </div>
                <div class="salary-item">
                    <h3>薪酬区间</h3>
                    <div class="salary-range">
                        ${formatSalary(analysisResult.estimatedSalary.min)} - ${formatSalary(analysisResult.estimatedSalary.max)}
                    </div>
                    <p>市场范围</p>
                </div>
                <div class="salary-item">
                    <h3>市场定位</h3>
                    <div class="market-position ${analysisResult.marketPosition}">
                        ${this.getMarketPositionText(analysisResult.marketPosition)}
                    </div>
                    <p>相对水平</p>
                </div>
            </div>
        </section>

        <!-- 影响因素分析 -->
        <section class="factors-analysis">
            <h2>影响因素分析</h2>
            
            ${analysisResult.factors.positive.length > 0 ? `
            <div class="factors-section">
                <h3 class="positive">正面影响因素</h3>
                <ul class="factors-list">
                    ${analysisResult.factors.positive.map(factor => `
                        <li class="factor-item positive">
                            <span class="factor-name">${factor.factor}</span>
                            <span class="factor-impact">+${factor.impact}%</span>
                            <p class="factor-explanation">${factor.explanation}</p>
                        </li>
                    `).join('')}
                </ul>
            </div>
            ` : ''}
            
            ${analysisResult.factors.negative.length > 0 ? `
            <div class="factors-section">
                <h3 class="negative">限制因素</h3>
                <ul class="factors-list">
                    ${analysisResult.factors.negative.map(factor => `
                        <li class="factor-item negative">
                            <span class="factor-name">${factor.factor}</span>
                            <span class="factor-impact">-${factor.impact}%</span>
                            <p class="factor-explanation">${factor.explanation}</p>
                        </li>
                    `).join('')}
                </ul>
            </div>
            ` : ''}
        </section>

        <!-- 市场对比 -->
        <section class="market-comparison">
            <h2>市场对比分析</h2>
            <div class="comparison-grid">
                <div class="comparison-item">
                    <h3>同城市其他行业</h3>
                    <div class="comparison-value">${formatSalary(analysisResult.comparisons.sameCityDifferentIndustry)}</div>
                </div>
                <div class="comparison-item">
                    <h3>同行业其他城市</h3>
                    <div class="comparison-value">${formatSalary(analysisResult.comparisons.sameIndustryDifferentCity)}</div>
                </div>
            </div>
            
            <div class="career-progression">
                <h3>职业发展路径</h3>
                <table class="progression-table">
                    <thead>
                        <tr>
                            <th>下一级别</th>
                            <th>薪酬增长</th>
                            <th>预计时间</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${analysisResult.comparisons.careerProgression.map(progression => `
                            <tr>
                                <td>${progression.nextLevel}</td>
                                <td class="salary-increase">+${formatSalary(progression.salaryIncrease)}</td>
                                <td>${progression.timeToReach}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </section>

        <!-- 趋势分析 -->
        <section class="trends-analysis">
            <h2>市场趋势分析</h2>
            <div class="trends-grid">
                <div class="trend-item">
                    <h3>短期趋势 (6-12个月)</h3>
                    <p>${analysisResult.trends.shortTerm}</p>
                </div>
                <div class="trend-item">
                    <h3>长期前景 (2-5年)</h3>
                    <p>${analysisResult.trends.longTerm}</p>
                </div>
            </div>
            <div class="growth-potential">
                <h3>成长潜力</h3>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${analysisResult.trends.growthPotential}%"></div>
                    <span class="progress-text">${analysisResult.trends.growthPotential}%</span>
                </div>
            </div>
        </section>

        ${config.includeDataTable ? this.generateDataTableHTML(analysisResult) : ''}

        <!-- 个性化建议 -->
        <section class="recommendations">
            <h2>个性化建议</h2>
            <ol class="recommendations-list">
                ${analysisResult.recommendations.map(recommendation => `
                    <li class="recommendation-item">${recommendation}</li>
                `).join('')}
            </ol>
        </section>

        <!-- 数据质量说明 */
        <section class="data-quality">
            <h2>数据质量说明</h2>
            <div class="quality-grid">
                <div class="quality-item">
                    <label>样本数量:</label>
                    <span>${analysisResult.dataQuality.sampleSize.toLocaleString()}</span>
                </div>
                <div class="quality-item">
                    <label>数据准确率:</label>
                    <span>${analysisResult.dataQuality.accuracy.toFixed(1)}%</span>
                </div>
                <div class="quality-item">
                    <label>最后更新:</label>
                    <span>${analysisResult.dataQuality.lastUpdated}</span>
                </div>
            </div>
        </section>

        <!-- 报告尾部 */
        <footer class="report-footer">
            <p>本报告由ISMT智能薪酬管理工具生成</p>
            <p>报告仅供参考，实际薪酬可能因公司规模、具体岗位要求等因素有所差异</p>
            <p>生成时间: ${timestamp}</p>
        </footer>
    </div>
</body>
</html>
    `;
  }

  /**
   * 生成数据表格HTML
   */
  private static generateDataTableHTML(analysisResult: SalaryAnalysisResult): string {
    return `
        <section class="employment-data-table">
            <h2>历年就业数据</h2>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>年份</th>
                        <th>职位数量</th>
                        <th>平均薪酬</th>
                        <th>同比增长</th>
                        <th>失业率</th>
                        <th>热门技能</th>
                    </tr>
                </thead>
                <tbody>
                    ${analysisResult.chartData.employmentData.map(data => `
                        <tr>
                            <td>${data.year}</td>
                            <td>${data.totalJobs.toLocaleString()}</td>
                            <td>¥${data.avgSalary.toLocaleString()}</td>
                            <td class="${data.yoyGrowth > 0 ? 'positive' : data.yoyGrowth < 0 ? 'negative' : 'neutral'}">
                                ${data.yoyGrowth > 0 ? '+' : ''}${(data.yoyGrowth * 100).toFixed(1)}%
                            </td>
                            <td>${(data.unemploymentRate * 100).toFixed(1)}%</td>
                            <td>${data.topSkills.slice(0, 3).join(', ')}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </section>
    `;
  }

  /**
   * 获取打印样式
   */
  private static getPrintStyles(config: PDFExportOptions): string {
    return `
        @page {
            size: ${config.format} ${config.orientation};
            margin: 1.5cm;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Microsoft YaHei', 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            font-size: 12px;
        }
        
        .report-container {
            max-width: 100%;
            margin: 0 auto;
        }
        
        /* 头部样式 */
        .report-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 3px solid #3B82F6;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        
        .header-content h1 {
            font-size: 28px;
            color: #1E40AF;
            margin-bottom: 10px;
        }
        
        .report-meta p {
            margin: 5px 0;
            color: #6B7280;
        }
        
        .logo-circle {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #3B82F6, #1D4ED8);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 14px;
        }
        
        /* 章节样式 */
        section {
            margin-bottom: 30px;
            break-inside: avoid;
        }
        
        h2 {
            font-size: 20px;
            color: #1E40AF;
            border-left: 4px solid #3B82F6;
            padding-left: 15px;
            margin-bottom: 20px;
        }
        
        h3 {
            font-size: 16px;
            margin-bottom: 15px;
            color: #374151;
        }
        
        /* 基本信息网格 */
        .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
        }
        
        .info-item {
            display: flex;
            padding: 10px;
            background: #F9FAFB;
            border-radius: 8px;
        }
        
        .info-item label {
            font-weight: bold;
            width: 80px;
            color: #4B5563;
        }
        
        .info-item span {
            flex: 1;
            color: #111827;
        }
        
        /* 薪酬估算样式 */
        .salary-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
        }
        
        .salary-item {
            text-align: center;
            padding: 20px;
            border: 2px solid #E5E7EB;
            border-radius: 12px;
        }
        
        .salary-item.highlight {
            border-color: #3B82F6;
            background: #EFF6FF;
        }
        
        .salary-value {
            font-size: 32px;
            font-weight: bold;
            color: #1D4ED8;
            margin: 10px 0;
        }
        
        .salary-range {
            font-size: 18px;
            font-weight: bold;
            color: #059669;
            margin: 10px 0;
        }
        
        .market-position {
            font-size: 16px;
            font-weight: bold;
            padding: 8px 16px;
            border-radius: 20px;
            display: inline-block;
            margin: 10px 0;
        }
        
        .market-position.above_market {
            background: #D1FAE5;
            color: #065F46;
        }
        
        .market-position.market_average {
            background: #DBEAFE;
            color: #1E40AF;
        }
        
        .market-position.below_market {
            background: #FED7AA;
            color: #9A3412;
        }
        
        /* 因素分析样式 */
        .factors-section {
            margin-bottom: 25px;
        }
        
        .factors-section h3.positive {
            color: #059669;
        }
        
        .factors-section h3.negative {
            color: #DC2626;
        }
        
        .factors-list {
            list-style: none;
        }
        
        .factor-item {
            display: flex;
            align-items: center;
            padding: 12px;
            margin-bottom: 10px;
            border-radius: 8px;
            border-left: 4px solid;
        }
        
        .factor-item.positive {
            background: #F0FDF4;
            border-left-color: #10B981;
        }
        
        .factor-item.negative {
            background: #FEF2F2;
            border-left-color: #EF4444;
        }
        
        .factor-name {
            font-weight: bold;
            margin-right: 10px;
        }
        
        .factor-impact {
            font-weight: bold;
            margin-right: 15px;
            padding: 4px 8px;
            border-radius: 4px;
            background: rgba(255, 255, 255, 0.7);
        }
        
        .factor-explanation {
            flex: 1;
            font-size: 11px;
            color: #6B7280;
        }
        
        /* 对比分析样式 */
        .comparison-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 25px;
        }
        
        .comparison-item {
            text-align: center;
            padding: 15px;
            background: #F9FAFB;
            border-radius: 8px;
        }
        
        .comparison-value {
            font-size: 24px;
            font-weight: bold;
            color: #1D4ED8;
            margin-top: 10px;
        }
        
        /* 表格样式 */
        .progression-table, .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        
        .progression-table th, .progression-table td,
        .data-table th, .data-table td {
            border: 1px solid #E5E7EB;
            padding: 10px;
            text-align: left;
        }
        
        .progression-table th, .data-table th {
            background: #F9FAFB;
            font-weight: bold;
        }
        
        .salary-increase {
            color: #059669;
            font-weight: bold;
        }
        
        .positive { color: #059669; }
        .negative { color: #DC2626; }
        .neutral { color: #6B7280; }
        
        /* 趋势分析样式 */
        .trends-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .trend-item {
            padding: 15px;
            background: #F9FAFB;
            border-radius: 8px;
        }
        
        .growth-potential {
            margin-top: 20px;
        }
        
        .progress-bar {
            position: relative;
            width: 100%;
            height: 20px;
            background: #E5E7EB;
            border-radius: 10px;
            margin-top: 10px;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #3B82F6, #10B981);
            border-radius: 10px;
            transition: width 0.3s ease;
        }
        
        .progress-text {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-weight: bold;
            color: white;
            text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }
        
        /* 建议列表样式 */
        .recommendations-list {
            padding-left: 20px;
        }
        
        .recommendation-item {
            margin-bottom: 10px;
            line-height: 1.6;
        }
        
        /* 数据质量样式 */
        .quality-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
        }
        
        .quality-item {
            display: flex;
            padding: 10px;
            background: #F9FAFB;
            border-radius: 8px;
        }
        
        .quality-item label {
            font-weight: bold;
            margin-right: 10px;
            color: #4B5563;
        }
        
        /* 尾部样式 */
        .report-footer {
            border-top: 2px solid #E5E7EB;
            padding-top: 20px;
            text-align: center;
            color: #6B7280;
            font-size: 11px;
            margin-top: 40px;
        }
        
        .report-footer p {
            margin: 5px 0;
        }
        
        /* 分页控制 */
        .page-break {
            page-break-before: always;
        }
        
        @media print {
            body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            
            .no-print {
                display: none !important;
            }
        }
    `;
  }

  /**
   * 下载为PDF文件
   */
  private static async downloadAsPDF(htmlContent: string, config: PDFExportOptions): Promise<void> {
    // 创建一个新的窗口来处理PDF打印
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      throw new Error('无法打开打印窗口，请检查浏览器的弹窗拦截设置');
    }

    // 修改HTML内容，添加自动打印脚本
    const modifiedHtml = this.addPrintScript(htmlContent, config.filename || '薪酬分析报告');
    
    // 写入内容到新窗口
    printWindow.document.write(modifiedHtml);
    printWindow.document.close();
    
    // 监听打印完成事件
    printWindow.addEventListener('afterprint', () => {
      setTimeout(() => {
        printWindow.close();
      }, 1000);
    });
  }

  /**
   * 添加自动打印脚本到HTML中
   */
  private static addPrintScript(htmlContent: string, filename: string): string {
    const printScript = `
      <script>
        window.addEventListener('load', function() {
          // 等待样式加载完成
          setTimeout(function() {
            // 设置文档标题为文件名
            document.title = '${filename}';
            
            // 自动触发打印
            window.print();
            
            // 显示使用说明
            setTimeout(function() {
              if (confirm('请在打印对话框中选择"保存为PDF"来下载报告文件。\\n\\n是否需要查看详细操作指南？')) {
                alert('PDF下载步骤：\\n\\n1. 在打印对话框的"目标"或"打印机"选项中\\n2. 选择"保存为PDF"或"Microsoft Print to PDF"\\n3. 点击"保存"按钮\\n4. 选择保存位置并确认文件名\\n\\n提示：建议文件名为"${filename}.pdf"');
              }
            }, 500);
          }, 1000);
        });
        
        // 监听键盘事件，ESC键关闭窗口
        window.addEventListener('keydown', function(e) {
          if (e.key === 'Escape') {
            window.close();
          }
        });
      </script>
    `;
    
    // 在</body>标签前插入脚本
    return htmlContent.replace('</body>', printScript + '</body>');
  }

  /**
   * 获取市场定位文本
   */
  private static getMarketPositionText(position: string): string {
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
  }

  /**
   * 快速导出（使用默认选项）
   */
  static async quickExport(
    analysisResult: SalaryAnalysisResult,
    queryData: any
  ): Promise<void> {
    return this.exportSalaryReport(analysisResult, queryData);
  }
}
