/**
 * HTML导出工具
 * 提供薪酬分析报告的HTML文件导出功能
 */

import { SalaryAnalysisResult } from '@/data/salaryAnalysisEngine';

export interface HTMLExportOptions {
  filename?: string;
  includeStyles?: boolean;
  standalone?: boolean;
}

export class HTMLExporter {
  private static readonly DEFAULT_OPTIONS: HTMLExportOptions = {
    filename: '薪酬分析报告',
    includeStyles: true,
    standalone: true
  };

  /**
   * 导出薪酬分析报告为HTML文件
   */
  static async exportSalaryReport(
    analysisResult: SalaryAnalysisResult,
    queryData: any,
    options: Partial<HTMLExportOptions> = {}
  ): Promise<void> {
    const config = { ...this.DEFAULT_OPTIONS, ...options };
    
    try {
      // 生成完整的HTML内容
      const htmlContent = this.generateStandaloneHTML(analysisResult, queryData, config);
      
      // 下载HTML文件
      this.downloadHTMLFile(htmlContent, config.filename || '薪酬分析报告');
      
    } catch (error) {
      console.error('HTML导出失败:', error);
      throw new Error('HTML导出失败，请重试');
    }
  }

  /**
   * 生成独立的HTML文件内容
   */
  private static generateStandaloneHTML(
    analysisResult: SalaryAnalysisResult,
    queryData: any,
    config: HTMLExportOptions
  ): string {
    const timestamp = new Date().toLocaleString('zh-CN');
    const formatSalary = (amount: number) => `¥${(amount / 1000).toFixed(1)}K`;

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.filename}</title>
    <style>
        ${this.getEmbeddedStyles()}
    </style>
</head>
<body>
    <div class="report-container">
        <!-- 操作按钮 -->
        <div class="action-buttons no-print">
            <button onclick="window.print()" class="btn btn-primary">
                📄 打印/保存为PDF
            </button>
            <button onclick="downloadReport()" class="btn btn-secondary">
                💾 下载HTML副本
            </button>
            <button onclick="window.close()" class="btn btn-tertiary">
                ❌ 关闭
            </button>
        </div>

        <!-- 报告头部 -->
        <header class="report-header">
            <div class="header-content">
                <h1>智能薪酬分析报告</h1>
                <div class="report-meta">
                    <p><strong>生成时间:</strong> ${timestamp}</p>
                    <p><strong>置信度:</strong> ${analysisResult.estimatedSalary.confidence}%</p>
                </div>
            </div>
            <div class="logo">
                <div class="logo-circle">ISMT</div>
            </div>
        </header>

        <!-- 基本信息 -->
        <section class="basic-info">
            <h2>📋 基本信息</h2>
            <div class="info-grid">
                <div class="info-item">
                    <span class="label">行业领域:</span>
                    <span class="value">${queryData.industry}</span>
                </div>
                <div class="info-item">
                    <span class="label">职位:</span>
                    <span class="value">${queryData.position}</span>
                </div>
                <div class="info-item">
                    <span class="label">工作地点:</span>
                    <span class="value">${queryData.location}</span>
                </div>
                <div class="info-item">
                    <span class="label">工作经验:</span>
                    <span class="value">${queryData.experience}</span>
                </div>
                <div class="info-item">
                    <span class="label">学历:</span>
                    <span class="value">${queryData.education}</span>
                </div>
                <div class="info-item">
                    <span class="label">分析日期:</span>
                    <span class="value">${timestamp.split(' ')[0]}</span>
                </div>
            </div>
        </section>

        <!-- 薪酬估算结果 -->
        <section class="salary-estimation">
            <h2>💰 薪酬估算结果</h2>
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
            <h2>📊 影响因素分析</h2>
            
            ${analysisResult.factors.positive.length > 0 ? `
            <div class="factors-section">
                <h3 class="positive">✅ 正面影响因素</h3>
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
                <h3 class="negative">⚠️ 限制因素</h3>
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
            <h2>🏢 市场对比分析</h2>
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
                <h3>🚀 职业发展路径</h3>
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
            <h2>📈 市场趋势分析</h2>
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
                <h3>成长潜力评估</h3>
                <div class="progress-container">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${analysisResult.trends.growthPotential}%"></div>
                    </div>
                    <span class="progress-text">${analysisResult.trends.growthPotential}%</span>
                </div>
            </div>
        </section>

        <!-- 历年就业数据 -->
        <section class="employment-data-table">
            <h2>📅 历年就业数据</h2>
            <div class="table-container">
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
                                <td><strong>${data.year}</strong></td>
                                <td>${data.totalJobs.toLocaleString()}</td>
                                <td>¥${data.avgSalary.toLocaleString()}</td>
                                <td class="${data.yoyGrowth > 0 ? 'positive' : data.yoyGrowth < 0 ? 'negative' : 'neutral'}">
                                    ${data.yoyGrowth > 0 ? '+' : ''}${(data.yoyGrowth * 100).toFixed(1)}%
                                </td>
                                <td>${(data.unemploymentRate * 100).toFixed(1)}%</td>
                                <td>
                                    ${data.topSkills.slice(0, 3).map(skill => 
                                        `<span class="skill-tag">${skill}</span>`
                                    ).join('')}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </section>

        <!-- 个性化建议 -->
        <section class="recommendations">
            <h2>💡 个性化建议</h2>
            <ol class="recommendations-list">
                ${analysisResult.recommendations.map((recommendation, index) => `
                    <li class="recommendation-item">
                        <span class="recommendation-number">${index + 1}</span>
                        <span class="recommendation-text">${recommendation}</span>
                    </li>
                `).join('')}
            </ol>
        </section>

        <!-- 数据质量说明 */
        <section class="data-quality">
            <h2>ℹ️ 数据质量说明</h2>
            <div class="quality-grid">
                <div class="quality-item">
                    <span class="label">样本数量:</span>
                    <span class="value">${analysisResult.dataQuality.sampleSize.toLocaleString()}</span>
                </div>
                <div class="quality-item">
                    <span class="label">数据准确率:</span>
                    <span class="value">${analysisResult.dataQuality.accuracy.toFixed(1)}%</span>
                </div>
                <div class="quality-item">
                    <span class="label">最后更新:</span>
                    <span class="value">${analysisResult.dataQuality.lastUpdated}</span>
                </div>
            </div>
        </section>

        <!-- 报告尾部 -->
        <footer class="report-footer">
            <div class="footer-content">
                <p><strong>本报告由ISMT智能薪酬管理工具生成</strong></p>
                <p>报告仅供参考，实际薪酬可能因公司规模、具体岗位要求等因素有所差异</p>
                <p>生成时间: ${timestamp} | 文件格式: HTML</p>
            </div>
        </footer>
    </div>

    <script>
        function downloadReport() {
            const element = document.documentElement;
            const htmlContent = element.outerHTML;
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = '${config.filename}_副本.html';
            link.style.display = 'none';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            URL.revokeObjectURL(url);
            
            alert('HTML副本已下载到您的设备！');
        }

        // 键盘快捷键
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'p':
                        e.preventDefault();
                        window.print();
                        break;
                    case 's':
                        e.preventDefault();
                        downloadReport();
                        break;
                }
            }
        });

        // 显示快捷键提示
        console.log('快捷键提示：');
        console.log('Ctrl+P / Cmd+P: 打印报告');
        console.log('Ctrl+S / Cmd+S: 下载HTML副本');
    </script>
</body>
</html>`;
  }

  /**
   * 获取嵌入式样式
   */
  private static getEmbeddedStyles(): string {
    return `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Microsoft YaHei', 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
        }
        
        .report-container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        
        /* 操作按钮 */
        .action-buttons {
            position: sticky;
            top: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 15px 30px;
            display: flex;
            gap: 15px;
            z-index: 100;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .btn {
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s ease;
            font-size: 14px;
        }
        
        .btn-primary {
            background: #3B82F6;
            color: white;
        }
        
        .btn-primary:hover {
            background: #2563EB;
            transform: translateY(-2px);
        }
        
        .btn-secondary {
            background: #10B981;
            color: white;
        }
        
        .btn-secondary:hover {
            background: #059669;
            transform: translateY(-2px);
        }
        
        .btn-tertiary {
            background: #EF4444;
            color: white;
        }
        
        .btn-tertiary:hover {
            background: #DC2626;
            transform: translateY(-2px);
        }
        
        /* 报告头部 */
        .report-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        
        .header-content h1 {
            font-size: 2.5rem;
            margin-bottom: 15px;
            font-weight: 700;
        }
        
        .report-meta p {
            margin: 8px 0;
            font-size: 1.1rem;
            opacity: 0.9;
        }
        
        .logo-circle {
            width: 80px;
            height: 80px;
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 1.2rem;
            border: 3px solid rgba(255,255,255,0.3);
        }
        
        /* 章节样式 */
        section {
            padding: 40px;
            border-bottom: 1px solid #e5e7eb;
        }
        
        h2 {
            font-size: 1.8rem;
            margin-bottom: 25px;
            color: #1f2937;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        h3 {
            font-size: 1.3rem;
            margin-bottom: 15px;
            color: #374151;
        }
        
        /* 基本信息网格 */
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
        }
        
        .info-item {
            display: flex;
            justify-content: space-between;
            padding: 15px 20px;
            background: #f8fafc;
            border-radius: 10px;
            border-left: 4px solid #3B82F6;
        }
        
        .info-item .label {
            font-weight: 600;
            color: #4b5563;
        }
        
        .info-item .value {
            font-weight: 500;
            color: #111827;
        }
        
        /* 薪酬估算样式 */
        .salary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 25px;
        }
        
        .salary-item {
            text-align: center;
            padding: 30px;
            border: 2px solid #e5e7eb;
            border-radius: 15px;
            background: #fafafa;
            transition: transform 0.3s ease;
        }
        
        .salary-item:hover {
            transform: translateY(-5px);
        }
        
        .salary-item.highlight {
            border-color: #3B82F6;
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
        }
        
        .salary-value {
            font-size: 2.5rem;
            font-weight: bold;
            color: #1d4ed8;
            margin: 15px 0;
        }
        
        .salary-range {
            font-size: 1.3rem;
            font-weight: bold;
            color: #059669;
            margin: 15px 0;
        }
        
        .market-position {
            font-size: 1rem;
            font-weight: bold;
            padding: 10px 20px;
            border-radius: 25px;
            display: inline-block;
            margin: 15px 0;
        }
        
        .market-position.above_market {
            background: #d1fae5;
            color: #065f46;
        }
        
        .market-position.market_average {
            background: #dbeafe;
            color: #1e40af;
        }
        
        .market-position.below_market {
            background: #fed7aa;
            color: #9a3412;
        }
        
        /* 因素分析样式 */
        .factors-section {
            margin-bottom: 30px;
        }
        
        .factors-section h3.positive {
            color: #059669;
        }
        
        .factors-section h3.negative {
            color: #dc2626;
        }
        
        .factors-list {
            list-style: none;
        }
        
        .factor-item {
            display: flex;
            align-items: flex-start;
            gap: 15px;
            padding: 20px;
            margin-bottom: 15px;
            border-radius: 12px;
            border-left: 5px solid;
        }
        
        .factor-item.positive {
            background: #f0fdf4;
            border-left-color: #10b981;
        }
        
        .factor-item.negative {
            background: #fef2f2;
            border-left-color: #ef4444;
        }
        
        .factor-name {
            font-weight: bold;
            min-width: 120px;
        }
        
        .factor-impact {
            font-weight: bold;
            padding: 5px 12px;
            border-radius: 6px;
            background: rgba(255, 255, 255, 0.8);
            min-width: 60px;
            text-align: center;
        }
        
        .factor-explanation {
            flex: 1;
            color: #6b7280;
        }
        
        /* 对比分析样式 */
        .comparison-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 25px;
            margin-bottom: 30px;
        }
        
        .comparison-item {
            text-align: center;
            padding: 25px;
            background: #f8fafc;
            border-radius: 12px;
            border: 2px solid #e5e7eb;
        }
        
        .comparison-value {
            font-size: 1.8rem;
            font-weight: bold;
            color: #1d4ed8;
            margin-top: 15px;
        }
        
        /* 表格样式 */
        .table-container {
            overflow-x: auto;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .progression-table, .data-table {
            width: 100%;
            border-collapse: collapse;
            background: white;
        }
        
        .progression-table th, .progression-table td,
        .data-table th, .data-table td {
            padding: 15px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .progression-table th, .data-table th {
            background: #f8fafc;
            font-weight: 600;
            color: #374151;
        }
        
        .progression-table tr:hover, .data-table tr:hover {
            background: #f8fafc;
        }
        
        .salary-increase {
            color: #059669;
            font-weight: bold;
        }
        
        .positive { color: #059669; font-weight: 500; }
        .negative { color: #dc2626; font-weight: 500; }
        .neutral { color: #6b7280; font-weight: 500; }
        
        .skill-tag {
            display: inline-block;
            background: #dbeafe;
            color: #1e40af;
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 0.8rem;
            margin: 2px;
        }
        
        /* 趋势分析样式 */
        .trends-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 25px;
            margin-bottom: 25px;
        }
        
        .trend-item {
            padding: 25px;
            background: #f8fafc;
            border-radius: 12px;
            border: 2px solid #e5e7eb;
        }
        
        .growth-potential {
            margin-top: 25px;
        }
        
        .progress-container {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-top: 15px;
        }
        
        .progress-bar {
            flex: 1;
            height: 25px;
            background: #e5e7eb;
            border-radius: 12px;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #3b82f6, #10b981);
            border-radius: 12px;
            transition: width 0.3s ease;
        }
        
        .progress-text {
            font-weight: bold;
            color: #1f2937;
            font-size: 1.1rem;
        }
        
        /* 建议列表样式 */
        .recommendations-list {
            list-style: none;
        }
        
        .recommendation-item {
            display: flex;
            align-items: flex-start;
            gap: 15px;
            margin-bottom: 20px;
            padding: 20px;
            background: #fffbeb;
            border-radius: 12px;
            border-left: 5px solid #f59e0b;
        }
        
        .recommendation-number {
            background: #f59e0b;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            flex-shrink: 0;
        }
        
        .recommendation-text {
            flex: 1;
            line-height: 1.6;
        }
        
        /* 数据质量样式 */
        .quality-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
        }
        
        .quality-item {
            display: flex;
            justify-content: space-between;
            padding: 15px 20px;
            background: #f0f9ff;
            border-radius: 10px;
            border-left: 4px solid #0ea5e9;
        }
        
        .quality-item .label {
            font-weight: 600;
            color: #0c4a6e;
        }
        
        .quality-item .value {
            font-weight: 500;
            color: #0c4a6e;
        }
        
        /* 尾部样式 */
        .report-footer {
            background: #1f2937;
            color: white;
            padding: 30px 40px;
            text-align: center;
        }
        
        .footer-content p {
            margin: 8px 0;
        }
        
        /* 打印样式 */
        @media print {
            .no-print {
                display: none !important;
            }
            
            body {
                background: white;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            
            .report-container {
                box-shadow: none;
                max-width: none;
            }
            
            section {
                break-inside: avoid;
                page-break-inside: avoid;
            }
            
            .report-header {
                break-after: avoid;
            }
        }
        
        /* 响应式设计 */
        @media (max-width: 768px) {
            .action-buttons {
                flex-direction: column;
                gap: 10px;
            }
            
            .report-header {
                flex-direction: column;
                text-align: center;
                gap: 20px;
            }
            
            section {
                padding: 20px;
            }
            
            .salary-grid, .info-grid, .comparison-grid {
                grid-template-columns: 1fr;
            }
            
            .trends-grid {
                grid-template-columns: 1fr;
            }
        }
    `;
  }

  /**
   * 下载HTML文件
   */
  private static downloadHTMLFile(htmlContent: string, filename: string): void {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.html`;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  /**
   * 获取市场定位文本
   */
  private static getMarketPositionText(position: string): string {
    switch (position) {
      case 'above_market':
        return '🔥 高于市场平均';
      case 'market_average':
        return '📊 接近市场平均';
      case 'below_market':
        return '📉 低于市场平均';
      default:
        return '📊 市场平均';
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
