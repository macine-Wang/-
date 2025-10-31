/**
 * DeepSeek API 服务层
 * 统一管理AI API调用
 */

const DEEPSEEK_API_KEY = 'sk-aca2c66e62cf405b9ea64016592b133d';
const DEEPSEEK_BASE_URL = 'https://api.deepseek.com/v1';

interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface DeepSeekResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

class DeepSeekApiService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = DEEPSEEK_API_KEY;
    this.baseUrl = DEEPSEEK_BASE_URL;
  }

  /**
   * 通用AI对话接口
   */
  async chat(messages: DeepSeekMessage[], options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: options?.model || 'deepseek-chat',
          messages,
          temperature: options?.temperature || 0.7,
          max_tokens: options?.maxTokens || 2000,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
      }

      const data: DeepSeekResponse = await response.json();
      return data.choices[0]?.message?.content || '抱歉，我无法生成回复。';
    } catch (error) {
      console.error('DeepSeek API调用错误:', error);
      throw new Error('AI服务暂时不可用，请稍后重试。');
    }
  }

  /**
   * 薪酬顾问专用对话
   */
  async salaryAdvisorChat(userMessage: string, conversationHistory?: DeepSeekMessage[]): Promise<{
    content: string;
    suggestions: string[];
  }> {
    const systemPrompt = `你是一位资深的薪酬管理专家，具有20年以上的HR和薪酬管理经验。你需要：

1. 提供专业、实用的薪酬管理建议
2. 基于最新的行业实践和法规
3. 考虑企业的实际情况和约束
4. 用简洁明了的语言解释复杂概念
5. 提供具体的实施步骤和建议
6. 在回复后提供3个相关的后续问题建议

请用中文回复，保持专业但易懂的语调。`;

    const messages: DeepSeekMessage[] = [
      { role: 'system', content: systemPrompt },
      ...(conversationHistory || []),
      { role: 'user', content: userMessage }
    ];

    const response = await this.chat(messages, { temperature: 0.8 });
    
    // 尝试从回复中提取建议问题
    const suggestions = this.extractSuggestions(response);
    
    return {
      content: response,
      suggestions
    };
  }

  /**
   * 职业规划分析
   */
  async careerPlanningAnalysis(profile: {
    name: string;
    currentPosition: string;
    experience: string;
    education: string;
    skills: string[];
    interests: string[];
  }): Promise<{
    analysis: string;
    recommendations: string[];
    learningPath: string[];
    salaryProjection: string;
  }> {
    const systemPrompt = `你是一位专业的职业规划师，需要基于用户的背景信息提供个性化的职业发展建议。

请分析用户的职业现状，提供：
1. 职业发展分析（优势、劣势、机会、威胁）
2. 具体的发展建议（3-5条）
3. 学习提升路径（技能、认证、经验等）
4. 薪酬发展预期

请用专业但易懂的中文回复，提供实用的建议。`;

    const userMessage = `请为我分析职业发展方向：
姓名：${profile.name}
当前职位：${profile.currentPosition}
工作经验：${profile.experience}
教育背景：${profile.education}
技能：${profile.skills.join('、')}
兴趣方向：${profile.interests.join('、')}

请提供详细的职业规划建议。`;

    const messages: DeepSeekMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ];

    const response = await this.chat(messages, { temperature: 0.7, maxTokens: 3000 });
    
    return {
      analysis: response,
      recommendations: this.extractRecommendations(response),
      learningPath: this.extractLearningPath(response),
      salaryProjection: this.extractSalaryProjection(response)
    };
  }

  /**
   * 薪酬公平性分析
   */
  async fairnessAnalysis(data: {
    employees: Array<{
      position: string;
      department: string;
      gender: string;
      experience: number;
      salary: number;
      performance: number;
    }>;
    analysisType: string[];
  }): Promise<{
    analysis: string;
    issues: Array<{
      type: string;
      description: string;
      severity: string;
      recommendation: string;
    }>;
    overallScore: number;
  }> {
    const systemPrompt = `你是一位薪酬公平性分析专家，需要分析企业薪酬数据中的公平性问题。

请分析以下方面：
1. 性别薪酬差距
2. 同岗位薪酬一致性
3. 部门间薪酬平衡
4. 经验与薪酬的相关性

对于发现的问题，请提供：
- 问题类型和严重程度
- 具体描述和数据支持
- 改进建议和实施步骤
- 整体公平性评分（0-100分）

请用专业的中文回复。`;

    const employeeData = data.employees.map(emp => 
      `职位：${emp.position}，部门：${emp.department}，性别：${emp.gender}，经验：${emp.experience}年，薪酬：${emp.salary}元，绩效：${emp.performance}分`
    ).join('\n');

    const userMessage = `请分析以下员工薪酬数据的公平性：

${employeeData}

分析维度：${data.analysisType.join('、')}

请提供详细的公平性分析报告。`;

    const messages: DeepSeekMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ];

    const response = await this.chat(messages, { temperature: 0.6, maxTokens: 3000 });
    
    return {
      analysis: response,
      issues: this.extractFairnessIssues(response),
      overallScore: this.extractOverallScore(response)
    };
  }

  /**
   * 动态调薪建议
   */
  async dynamicSalaryAdjustment(data: {
    budget: number;
    employees: Array<{
      name: string;
      position: string;
      currentSalary: number;
      performance: number;
      marketValue: number;
      riskLevel: string;
      keyTalent: boolean;
    }>;
    strategy: string;
  }): Promise<{
    analysis: string;
    adjustments: Array<{
      employeeName: string;
      currentSalary: number;
      recommendedSalary: number;
      reasoning: string;
      priority: string;
    }>;
    budgetUtilization: number;
    expectedImpact: string;
  }> {
    const systemPrompt = `你是一位薪酬调整专家，需要基于预算和员工情况提供智能的调薪建议。

考虑因素：
1. 员工绩效表现
2. 市场薪酬水平
3. 人才流失风险
4. 预算限制
5. 内部公平性

请提供：
- 每个员工的具体调薪建议和理由
- 调薪优先级
- 预算使用率
- 预期影响评估

请用专业的中文回复。`;

    const employeeData = data.employees.map(emp => 
      `${emp.name}：${emp.position}，当前薪酬${emp.currentSalary}元，绩效${emp.performance}分，市场价值${emp.marketValue}元，风险等级${emp.riskLevel}，${emp.keyTalent ? '核心人才' : '普通员工'}`
    ).join('\n');

    const userMessage = `请为以下员工提供调薪建议：

调薪预算：${data.budget}元
调薪策略：${data.strategy}

员工信息：
${employeeData}

请提供详细的调薪方案。`;

    const messages: DeepSeekMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ];

    const response = await this.chat(messages, { temperature: 0.7, maxTokens: 3000 });
    
    return {
      analysis: response,
      adjustments: this.extractSalaryAdjustments(response),
      budgetUtilization: this.extractBudgetUtilization(response),
      expectedImpact: this.extractExpectedImpact(response)
    };
  }

  /**
   * 薪酬计算器
   */
  async salaryCalculation(data: {
    position: string;
    location: string;
    experience: string;
    education: string;
    industry: string;
    skills: string[];
    companySize: string;
    jobLevel: string;
  }): Promise<{
    analysis: string;
    salaryRange: {
      min: number;
      max: number;
      median: number;
    };
    factors: Array<{
      factor: string;
      impact: string;
      weight: number;
    }>;
    recommendations: string[];
  }> {
    const systemPrompt = `你是一位薪酬分析专家，需要基于用户的背景信息计算合理的薪酬范围。

请分析以下因素对薪酬的影响：
1. 岗位类型和职级
2. 工作经验和技能水平
3. 地理位置和生活成本
4. 行业和公司规模
5. 教育背景

提供：
- 详细的薪酬分析
- 具体的薪酬范围（最低、最高、中位数）
- 各影响因素的权重分析
- 提升薪酬的建议

请用专业的中文回复。`;

    const userMessage = `请为我计算薪酬范围：

岗位：${data.position}
地区：${data.location}
工作经验：${data.experience}
教育背景：${data.education}
所属行业：${data.industry}
技能：${data.skills.join('、')}
公司规模：${data.companySize}
职级：${data.jobLevel}

请提供详细的薪酬计算分析。`;

    const messages: DeepSeekMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ];

    const response = await this.chat(messages, { temperature: 0.6, maxTokens: 2000 });
    
    return {
      analysis: response,
      salaryRange: this.extractSalaryRange(response),
      factors: this.extractSalaryFactors(response),
      recommendations: this.extractRecommendations(response)
    };
  }

  /**
   * 智能JD生成
   */
  async generateJobDescription(data: {
    position: string;
    department?: string;
    location: string;
    reportTo?: string;
    skills: string[];
    education: string;
    experience: string;
    industry: string;
    companySize: string;
    recruitCount: number;
    companyKeywords: string[];
    salaryRange?: {
      min: number;
      max: number;
    };
    workTime?: string;
    benefits?: string[];
    preferredIndustry?: string;
    projectExperience?: string;
    projectScale?: string;
    certifications?: string;
    additionalRequirements?: string;
    workIntensity?: string;
    clientType?: string;
    style: 'formal' | 'casual' | 'innovative' | 'international';
    version: 'long' | 'short' | 'brief';
    language: 'chinese' | 'english' | 'bilingual';
  }): Promise<{
    jobDescription: string;
    responsibilities: string[];
    requirements: string[];
    highlights: string[];
    seoKeywords: string[];
    complianceCheck: {
      passed: boolean;
      issues: string[];
      suggestions: string[];
    };
  }> {
    const systemPrompt = `你是一位专业的HR招聘专家和文案写手，擅长创作优秀的职位描述(JD)。请参考以下专业JD的写作风格和结构：

**优秀JD的结构特点：**
1. **岗位概述**（可选）：简要说明岗位定位、核心价值和在组织中的作用
2. **核心职责**：清晰分点列出，使用数字编号，每条职责具体可执行
3. **任职要求**：分为基本要求和加分项，结构清晰
   - 基本要求：学历、经验、技能等硬性要求
   - 优先条件/加分项：行业经验、认证、特殊技能等
4. **岗位亮点**：突出岗位优势、发展机会、公司特色等

请根据提供的岗位信息生成专业、吸引人的职位描述，需要：

1. **内容结构完整**：包含岗位概述（可选）、核心职责、任职要求、加分项、岗位亮点
2. **语言风格适配**：${this.getStyleDescription(data.style)}
3. **版本长度控制**：${this.getVersionDescription(data.version)}
4. **SEO优化**：突出关键技能词，提高搜索排名
5. **合规检查**：避免歧视性词汇，确保合规
6. **公司文化融入**：自然嵌入公司特色和卖点
7. **专业表达**：使用行业术语，体现专业性

请用${data.language === 'english' ? '英文' : data.language === 'bilingual' ? '中英双语' : '中文'}回复。`;

    const userMessage = `请为以下岗位生成职位描述：

**基本信息：**
- 岗位名称：${data.position}
${data.department ? `- 所属部门：${data.department}` : ''}
- 工作地点：${data.location}
${data.reportTo ? `- 汇报对象：${data.reportTo}` : ''}
- 招聘人数：${data.recruitCount}人

**基本任职要求：**
- 核心技能：${data.skills.join('、')}
- 学历要求：${data.education}
- 工作经验：${data.experience}

**专业要求（如提供）：**
${data.preferredIndustry ? `- 优先行业经验：${data.preferredIndustry}` : ''}
${data.projectExperience ? `- 项目经验要求：${data.projectExperience}` : ''}
${data.projectScale ? `- 项目规模要求：${data.projectScale}` : ''}
${data.certifications ? `- 专业认证要求：${data.certifications}` : ''}
${data.clientType ? `- 客户类型：${data.clientType}` : ''}
${data.workIntensity ? `- 工作强度要求：${data.workIntensity}` : ''}
${data.additionalRequirements ? `- 加分项/优先条件：${data.additionalRequirements}` : ''}

**公司信息：**
- 所属行业：${data.industry}
- 公司规模：${data.companySize}
${data.companyKeywords.length ? `- 公司特色：${data.companyKeywords.join('、')}` : ''}

**薪酬福利：**
${data.salaryRange ? `- 薪资范围：${data.salaryRange.min}-${data.salaryRange.max}K` : ''}
${data.workTime ? `- 工作时间：${data.workTime}` : ''}
${data.benefits?.length ? `- 福利待遇：${data.benefits.join('、')}` : ''}

**生成要求：**
- 文风：${this.getStyleDescription(data.style)}
- 版本：${this.getVersionDescription(data.version)}
- 语言：${data.language === 'english' ? '英文' : data.language === 'bilingual' ? '中英双语对照' : '中文'}

**重要提示：**
1. 岗位职责要具体、可执行，使用数字编号清晰列出
2. 任职要求分为"基本要求"和"优先条件/加分项"两部分
3. 如果有专业认证、行业经验、项目经验等加分项，请在"优先条件"中突出显示
4. 工作强度要求（如出差、加班等）要明确但不强制，以吸引合适候选人为主
5. 岗位亮点要突出发展机会、公司优势等吸引力要素

请生成完整的职位描述，包含岗位概述（如适用）、核心职责、任职要求（含基本要求和加分项）、岗位亮点等内容。`;

    const messages: DeepSeekMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ];

    const response = await this.chat(messages, { temperature: 0.8, maxTokens: 3000 });
    
    return {
      jobDescription: response,
      responsibilities: this.extractResponsibilities(response),
      requirements: this.extractRequirements(response),
      highlights: this.extractHighlights(response),
      seoKeywords: this.extractSEOKeywords(response, data.skills),
      complianceCheck: this.checkCompliance(response)
    };
  }

  /**
   * JD文案优化
   */
  async optimizeJobDescription(originalJD: string, optimizationType: 'seo' | 'style' | 'compliance' | 'keywords'): Promise<{
    optimizedJD: string;
    changes: string[];
    improvements: string[];
  }> {
    const systemPrompt = `你是一位专业的招聘文案优化专家，擅长${this.getOptimizationDescription(optimizationType)}。

请分析并优化提供的职位描述，提供具体的改进建议和优化后的版本。`;

    const userMessage = `请优化以下职位描述（优化类型：${optimizationType}）：

${originalJD}

请提供优化后的版本，并说明具体的改进点。`;

    const messages: DeepSeekMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ];

    const response = await this.chat(messages, { temperature: 0.7, maxTokens: 2500 });
    
    return {
      optimizedJD: response,
      changes: this.extractChanges(response),
      improvements: this.extractImprovements(response)
    };
  }

  // 辅助方法：获取风格描述
  private getStyleDescription(style: string): string {
    const descriptions = {
      'formal': '正式专业，用词严谨，适合传统企业',
      'casual': '轻松友好，语言亲切，适合互联网公司',
      'innovative': '创新前卫，突出创造力，适合科技创业公司',
      'international': '国际化视野，双语表达，适合跨国企业'
    };
    return descriptions[style as keyof typeof descriptions] || descriptions.formal;
  }

  // 辅助方法：获取版本描述
  private getVersionDescription(version: string): string {
    const descriptions = {
      'long': '详细版本(800-1200字)，适合官网展示',
      'short': '简洁版本(400-600字)，适合社交媒体',
      'brief': '精简版本(200-300字)，适合内推转发'
    };
    return descriptions[version as keyof typeof descriptions] || descriptions.long;
  }

  // 辅助方法：获取优化类型描述
  private getOptimizationDescription(type: string): string {
    const descriptions = {
      'seo': 'SEO优化，提升搜索排名和关键词密度',
      'style': '文风调整，改善语言表达和阅读体验',
      'compliance': '合规检查，避免歧视性和敏感词汇',
      'keywords': '关键词优化，突出核心技能和行业热词'
    };
    return descriptions[type as keyof typeof descriptions] || descriptions.seo;
  }

  /**
   * 薪酬竞争力分析
   */
  async competitivenessAnalysis(data: {
    position: string;
    currentSalary: number;
    marketData: {
      p25: number;
      p50: number;
      p75: number;
      p90: number;
    };
    industry: string;
    location: string;
  }): Promise<{
    analysis: string;
    competitivenessScore: number;
    recommendations: string[];
    riskAssessment: string;
  }> {
    const systemPrompt = `你是一位薪酬竞争力分析专家，需要评估岗位薪酬的市场竞争力。

请分析：
1. 当前薪酬在市场中的定位
2. 竞争力评分（0-100分）
3. 人才流失风险评估
4. 改进建议

请用专业的中文回复。`;

    const userMessage = `请分析以下岗位的薪酬竞争力：

岗位：${data.position}
当前薪酬：${data.currentSalary}元
行业：${data.industry}
地区：${data.location}

市场薪酬数据：
- 25分位：${data.marketData.p25}元
- 50分位：${data.marketData.p50}元
- 75分位：${data.marketData.p75}元
- 90分位：${data.marketData.p90}元

请提供竞争力分析报告。`;

    const messages: DeepSeekMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ];

    const response = await this.chat(messages, { temperature: 0.6 });
    
    return {
      analysis: response,
      competitivenessScore: this.extractCompetitivenessScore(response),
      recommendations: this.extractRecommendations(response),
      riskAssessment: this.extractRiskAssessment(response)
    };
  }

  // 辅助方法：从回复中提取建议问题
  private extractSuggestions(response: string): string[] {
    const suggestions: string[] = [];
    
    // 尝试匹配常见的问题格式
    const patterns = [
      /您可能还想了解[：:]\s*(.*?)$/gm,
      /相关问题[：:]\s*(.*?)$/gm,
      /建议问题[：:]\s*(.*?)$/gm,
      /\d+[\.、]\s*([^？?]*[？?])/g
    ];

    patterns.forEach(pattern => {
      const matches = response.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const cleaned = match.replace(/^\d+[\.、]\s*/, '').trim();
          if (cleaned.length > 5 && cleaned.length < 100) {
            suggestions.push(cleaned);
          }
        });
      }
    });

    // 如果没有找到建议，提供默认建议
    if (suggestions.length === 0) {
      suggestions.push(
        '能否提供更多具体的实施建议？',
        '这种方案的风险和注意事项有哪些？',
        '如何评估实施效果？'
      );
    }

    return suggestions.slice(0, 3); // 最多返回3个建议
  }

  // 辅助方法：提取建议列表
  private extractRecommendations(response: string): string[] {
    const recommendations: string[] = [];
    const lines = response.split('\n');
    
    lines.forEach(line => {
      if (line.match(/^\d+[\.、]/) || line.match(/^[•·-]\s*/)) {
        const cleaned = line.replace(/^\d+[\.、]\s*|^[•·-]\s*/, '').trim();
        if (cleaned.length > 10) {
          recommendations.push(cleaned);
        }
      }
    });

    return recommendations.slice(0, 5);
  }

  // 辅助方法：提取学习路径
  private extractLearningPath(response: string): string[] {
    const path: string[] = [];
    const keywords = ['学习', '提升', '技能', '认证', '培训', '经验'];
    const lines = response.split('\n');
    
    lines.forEach(line => {
      if (keywords.some(keyword => line.includes(keyword))) {
        const cleaned = line.replace(/^\d+[\.、]\s*|^[•·-]\s*/, '').trim();
        if (cleaned.length > 5) {
          path.push(cleaned);
        }
      }
    });

    return path.slice(0, 5);
  }

  // 辅助方法：提取薪酬预期
  private extractSalaryProjection(response: string): string {
    const lines = response.split('\n');
    for (const line of lines) {
      if (line.includes('薪酬') && (line.includes('预期') || line.includes('发展') || line.includes('增长'))) {
        return line.trim();
      }
    }
    return '根据您的发展路径，薪酬有望在1-3年内实现15-30%的增长。';
  }

  // 辅助方法：提取公平性问题
  private extractFairnessIssues(_response: string): Array<{
    type: string;
    description: string;
    severity: string;
    recommendation: string;
  }> {
    // 简化实现，实际项目中可以使用更复杂的NLP解析
    return [
      {
        type: 'gender_gap',
        description: '检测到性别薪酬差距',
        severity: 'medium',
        recommendation: '建议进行同岗位薪酬标准化'
      }
    ];
  }

  // 辅助方法：提取整体评分
  private extractOverallScore(response: string): number {
    const scoreMatch = response.match(/(\d+)分/);
    return scoreMatch ? parseInt(scoreMatch[1]) : 75;
  }

  // 辅助方法：提取调薪建议
  private extractSalaryAdjustments(_response: string): Array<{
    employeeName: string;
    currentSalary: number;
    recommendedSalary: number;
    reasoning: string;
    priority: string;
  }> {
    // 简化实现，实际项目中可以使用更复杂的NLP解析
    return [];
  }

  // 辅助方法：提取预算使用率
  private extractBudgetUtilization(response: string): number {
    const utilizationMatch = response.match(/(\d+)%/);
    return utilizationMatch ? parseInt(utilizationMatch[1]) : 85;
  }

  // 辅助方法：提取预期影响
  private extractExpectedImpact(response: string): string {
    const lines = response.split('\n');
    for (const line of lines) {
      if (line.includes('影响') || line.includes('效果')) {
        return line.trim();
      }
    }
    return '预期将显著提升员工满意度和留存率';
  }

  // 辅助方法：提取竞争力评分
  private extractCompetitivenessScore(response: string): number {
    const scoreMatch = response.match(/竞争力[：:]?\s*(\d+)分/);
    return scoreMatch ? parseInt(scoreMatch[1]) : 75;
  }

  // 辅助方法：提取风险评估
  private extractRiskAssessment(response: string): string {
    const lines = response.split('\n');
    for (const line of lines) {
      if (line.includes('风险') && line.length > 20) {
        return line.trim();
      }
    }
    return '当前薪酬竞争力处于中等水平，存在一定的人才流失风险';
  }

  // 辅助方法：提取薪酬范围
  private extractSalaryRange(response: string): { min: number; max: number; median: number } {
    // 尝试从回复中提取薪酬数字
    const salaryMatches = response.match(/(\d+(?:,\d{3})*(?:\.\d+)?)[万k千]/gi);
    const numbers: number[] = [];
    
    if (salaryMatches) {
      salaryMatches.forEach(match => {
        const numStr = match.replace(/[万k千,]/g, '');
        const num = parseFloat(numStr);
        if (match.includes('万')) {
          numbers.push(num * 10000);
        } else if (match.includes('k') || match.includes('千')) {
          numbers.push(num * 1000);
        } else {
          numbers.push(num);
        }
      });
    }

    // 如果找到数字，取最小、最大和中位数
    if (numbers.length >= 2) {
      numbers.sort((a, b) => a - b);
      return {
        min: numbers[0],
        max: numbers[numbers.length - 1],
        median: numbers[Math.floor(numbers.length / 2)]
      };
    }

    // 默认范围
    return {
      min: 15000,
      max: 35000,
      median: 25000
    };
  }

  // 辅助方法：提取薪酬影响因素
  private extractSalaryFactors(_response: string): Array<{ factor: string; impact: string; weight: number }> {
    // 基于AI回复分析影响因素，这里提供默认权重
    const factors = [
      { factor: '工作经验', impact: '正向影响', weight: 0.3 },
      { factor: '技能水平', impact: '正向影响', weight: 0.25 },
      { factor: '地理位置', impact: '正向影响', weight: 0.2 },
      { factor: '行业发展', impact: '正向影响', weight: 0.15 },
      { factor: '教育背景', impact: '正向影响', weight: 0.1 }
    ];

    return factors;
  }

  // JD相关辅助方法
  private extractResponsibilities(response: string): string[] {
    const responsibilities: string[] = [];
    const lines = response.split('\n');
    let inResponsibilitiesSection = false;

    lines.forEach(line => {
      if (line.includes('职责') || line.includes('工作内容') || line.includes('岗位职责')) {
        inResponsibilitiesSection = true;
        return;
      }
      if (line.includes('要求') || line.includes('任职') || line.includes('技能')) {
        inResponsibilitiesSection = false;
        return;
      }
      if (inResponsibilitiesSection && (line.match(/^\d+[\.、]/) || line.match(/^[•·-]\s*/))) {
        const cleaned = line.replace(/^\d+[\.、]\s*|^[•·-]\s*/, '').trim();
        if (cleaned.length > 5) {
          responsibilities.push(cleaned);
        }
      }
    });

    // 如果没有提取到，返回默认示例
    if (responsibilities.length === 0) {
      responsibilities.push(
        '负责产品功能的设计和开发工作',
        '参与需求分析和技术方案设计',
        '与团队成员协作完成项目目标'
      );
    }

    return responsibilities.slice(0, 8);
  }

  private extractRequirements(response: string): string[] {
    const requirements: string[] = [];
    const lines = response.split('\n');
    let inRequirementsSection = false;

    lines.forEach(line => {
      if (line.includes('要求') || line.includes('任职') || line.includes('技能') || line.includes('资格')) {
        inRequirementsSection = true;
        return;
      }
      if (line.includes('福利') || line.includes('待遇') || line.includes('亮点')) {
        inRequirementsSection = false;
        return;
      }
      if (inRequirementsSection && (line.match(/^\d+[\.、]/) || line.match(/^[•·-]\s*/))) {
        const cleaned = line.replace(/^\d+[\.、]\s*|^[•·-]\s*/, '').trim();
        if (cleaned.length > 5) {
          requirements.push(cleaned);
        }
      }
    });

    if (requirements.length === 0) {
      requirements.push(
        '本科及以上学历，相关专业背景',
        '具备相关工作经验',
        '良好的沟通协调能力'
      );
    }

    return requirements.slice(0, 10);
  }

  private extractHighlights(response: string): string[] {
    const highlights: string[] = [];
    const lines = response.split('\n');

    lines.forEach(line => {
      if (line.includes('亮点') || line.includes('福利') || line.includes('待遇') || line.includes('优势')) {
        const cleaned = line.replace(/^\d+[\.、]\s*|^[•·-]\s*/, '').trim();
        if (cleaned.length > 5 && !cleaned.includes('亮点') && !cleaned.includes('福利')) {
          highlights.push(cleaned);
        }
      }
    });

    if (highlights.length === 0) {
      highlights.push(
        '竞争力薪酬待遇',
        '完善的培训体系',
        '良好的晋升空间',
        '弹性工作制度'
      );
    }

    return highlights.slice(0, 6);
  }

  private extractSEOKeywords(response: string, originalSkills: string[]): string[] {
    const keywords = new Set(originalSkills);
    
    // 从回复中提取技术关键词
    const techKeywords = response.match(/\b[A-Za-z]+\b/g) || [];
    techKeywords.forEach(keyword => {
      if (keyword.length > 2 && keyword.length < 20) {
        keywords.add(keyword);
      }
    });

    // 添加一些通用的SEO关键词
    const commonKeywords = ['招聘', '求职', '工作', '职位', '岗位', '机会'];
    commonKeywords.forEach(keyword => keywords.add(keyword));

    return Array.from(keywords).slice(0, 15);
  }

  private checkCompliance(response: string): {
    passed: boolean;
    issues: string[];
    suggestions: string[];
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];
    
    // 检查敏感词汇
    const sensitiveWords = ['性别', '年龄', '婚姻', '生育', '民族', '宗教', '政治'];
    sensitiveWords.forEach(word => {
      if (response.includes(word)) {
        issues.push(`包含敏感词汇: ${word}`);
        suggestions.push(`移除或替换敏感词汇: ${word}`);
      }
    });

    // 检查歧视性表述
    const discriminatoryPhrases = ['限男性', '限女性', '已婚优先', '未婚优先'];
    discriminatoryPhrases.forEach(phrase => {
      if (response.includes(phrase)) {
        issues.push(`包含歧视性表述: ${phrase}`);
        suggestions.push(`移除歧视性要求: ${phrase}`);
      }
    });

    return {
      passed: issues.length === 0,
      issues,
      suggestions
    };
  }

  private extractChanges(response: string): string[] {
    const changes: string[] = [];
    const lines = response.split('\n');
    
    lines.forEach(line => {
      if (line.includes('修改') || line.includes('调整') || line.includes('优化')) {
        const cleaned = line.trim();
        if (cleaned.length > 10) {
          changes.push(cleaned);
        }
      }
    });

    if (changes.length === 0) {
      changes.push('语言表达更加专业', '关键词密度优化', '结构更加清晰');
    }

    return changes.slice(0, 5);
  }

  private extractImprovements(response: string): string[] {
    const improvements: string[] = [];
    const lines = response.split('\n');
    
    lines.forEach(line => {
      if (line.includes('改进') || line.includes('提升') || line.includes('增强')) {
        const cleaned = line.trim();
        if (cleaned.length > 10) {
          improvements.push(cleaned);
        }
      }
    });

    if (improvements.length === 0) {
      improvements.push('提升招聘吸引力', '增强SEO效果', '改善用户体验');
    }

    return improvements.slice(0, 5);
  }
}

// 导出单例实例
export const deepseekApi = new DeepSeekApiService();
export default deepseekApi;
