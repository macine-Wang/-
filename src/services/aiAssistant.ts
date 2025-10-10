/**
 * AI聊天助手服务
 * 集成DeepSeek API，提供智能对话和系统导航功能
 */

import { NavigateFunction } from 'react-router-dom';

// 消息类型定义
export interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    action?: 'navigate' | 'search' | 'analyze' | 'suggest';
    target?: string;
    data?: any;
  };
}

// 对话上下文
export interface ConversationContext {
  userId?: string;
  sessionId: string;
  currentPage: string;
  userProfile?: {
    role: 'jobseeker' | 'hr' | 'admin';
    industry?: string;
    experience?: string;
    position?: string;
  };
  conversationHistory: Message[];
}

// AI助手角色定义
export type AssistantRole = 'navigator' | 'salary_advisor' | 'career_planner' | 'hr_expert' | 'data_analyst';

// 系统功能映射
export const SYSTEM_FUNCTIONS = {
  navigation: {
    home: { path: '/', name: '首页', description: 'ISMT智能薪酬助手主页' },
    jobseeker: { path: '/jobseeker', name: '求职者中心', description: '个人职业发展AI助手' },
    hr: { path: '/hr', name: 'HR中心', description: '企业薪酬管理专家' },
    query: { path: '/query', name: '薪酬查询', description: '查询职位薪酬范围和市场行情' },
    'career-planning': { path: '/career-planning', name: '职业规划助手', description: 'AI分析个人背景，制定职业发展路径' },
    'market-insights': { path: '/market-insights', name: '市场洞察报告', description: '行业薪酬趋势、热门职位分析' },
    'salary-calculator': { path: '/salary-calculator', name: '智能薪酬计算器', description: '基于个人条件计算市场薪酬水平' },
    'interview-prep': { path: '/interview-prep', name: '面试薪酬谈判', description: 'AI模拟面试，提供谈判策略' },
    'salary-alerts': { path: '/salary-alerts', name: '薪酬监控提醒', description: '设置薪酬变化提醒' },
    'resume-optimizer': { path: '/resume-optimizer', name: '简历智能优化助手', description: 'AI分析简历并提供优化建议' },
    'hr/diagnosis': { path: '/hr/diagnosis', name: '智能薪酬诊断中心', description: '一键诊断薪酬健康度' },
    'hr/dynamic-adjustment': { path: '/hr/dynamic-adjustment', name: '动态调薪决策引擎', description: 'AI智能分配调薪预算' },
    'hr/competitiveness-radar': { path: '/hr/competitiveness-radar', name: '薪酬竞争力雷达', description: '实时对标市场竞争力' },
    'hr/ai-advisor': { path: '/hr/ai-advisor', name: 'AI薪酬顾问助手', description: '专业薪酬问题咨询' },
    'hr/fairness-detector': { path: '/hr/fairness-detector', name: '薪酬公平性检测器', description: 'AI扫描薪酬不公平问题' },
    'hr/smart-jd-writer': { path: '/hr/smart-jd-writer', name: '智能JD写作助手', description: 'AI生成职位描述' },
    'hr/batch-jd-generator': { path: '/hr/batch-jd-generator', name: '批量JD生成器', description: '批量生成职位描述' },
    'hr/retention-risk': { path: '/hr/retention-risk', name: '员工离职风险预警', description: '预测员工离职风险并提供保留策略' },
    'tech-architecture': { path: '/tech-architecture', name: '技术架构', description: '了解ISMT的技术栈和架构设计' }
  },
  jobseekerFeatures: [
    '简历智能优化助手', '薪酬查询分析', '职业规划助手', '市场洞察报告', '智能薪酬计算器', '面试薪酬谈判', '薪酬监控提醒'
  ],
  hrFeatures: [
    '智能薪酬诊断中心', '员工离职风险预警', '动态调薪决策引擎', '薪酬竞争力雷达', 'AI薪酬顾问助手', 
    '薪酬公平性检测器', '智能JD写作助手', '批量JD生成器', '智能招聘助手'
  ]
};

// 意图识别
export interface Intent {
  type: 'navigation' | 'question' | 'analysis' | 'suggestion' | 'help';
  confidence: number;
  entities: {
    feature?: string;
    role?: string;
    action?: string;
    location?: string;
  };
}

export class AIAssistantService {
  private context: ConversationContext;
  private navigate?: NavigateFunction;

  constructor(navigate?: NavigateFunction) {
    this.navigate = navigate;
    this.context = {
      sessionId: this.generateSessionId(),
      currentPage: window.location.pathname,
      conversationHistory: []
    };
  }

  // 更新导航函数
  setNavigate(navigate: NavigateFunction) {
    this.navigate = navigate;
  }

  // 生成会话ID
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // 更新上下文
  updateContext(updates: Partial<ConversationContext>) {
    this.context = { ...this.context, ...updates };
  }

  // 添加消息到历史
  private addMessage(message: Omit<Message, 'id' | 'timestamp'>): Message {
    const fullMessage: Message = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };
    
    this.context.conversationHistory.push(fullMessage);
    
    // 保持历史记录在合理范围内
    if (this.context.conversationHistory.length > 50) {
      this.context.conversationHistory = this.context.conversationHistory.slice(-30);
    }
    
    return fullMessage;
  }

  // 意图识别
  private async recognizeIntent(userInput: string): Promise<Intent> {
    const input = userInput.toLowerCase();
    
    // 导航意图识别
    if (input.includes('打开') || input.includes('跳转') || input.includes('进入') || input.includes('去')) {
      for (const [key, func] of Object.entries(SYSTEM_FUNCTIONS.navigation)) {
        if (input.includes(func.name.toLowerCase()) || input.includes(key)) {
          return {
            type: 'navigation',
            confidence: 0.9,
            entities: { feature: key, action: 'navigate' }
          };
        }
      }
    }

    // 功能查询意图
    if (input.includes('功能') || input.includes('有什么') || input.includes('能做什么')) {
      if (input.includes('hr') || input.includes('人事') || input.includes('企业')) {
        return {
          type: 'question',
          confidence: 0.8,
          entities: { role: 'hr', action: 'list_features' }
        };
      }
      if (input.includes('求职') || input.includes('个人') || input.includes('职业')) {
        return {
          type: 'question',
          confidence: 0.8,
          entities: { role: 'jobseeker', action: 'list_features' }
        };
      }
    }

    // 薪酬相关查询
    if (input.includes('薪酬') || input.includes('工资') || input.includes('薪水')) {
      return {
        type: 'analysis',
        confidence: 0.8,
        entities: { action: 'salary_analysis' }
      };
    }

    // 帮助意图
    if (input.includes('帮助') || input.includes('怎么用') || input.includes('如何')) {
      return {
        type: 'help',
        confidence: 0.7,
        entities: { action: 'provide_help' }
      };
    }

    return {
      type: 'question',
      confidence: 0.5,
      entities: {}
    };
  }

  // 执行导航操作
  private executeNavigation(target: string): string {
    const func = SYSTEM_FUNCTIONS.navigation[target as keyof typeof SYSTEM_FUNCTIONS.navigation];
    if (func && this.navigate) {
      this.navigate(func.path);
      return `正在为您跳转到${func.name}...`;
    }
    return '抱歉，无法找到指定的功能页面。';
  }

  // 生成功能列表
  private generateFeatureList(role: 'hr' | 'jobseeker'): string {
    if (role === 'hr') {
      const features = SYSTEM_FUNCTIONS.hrFeatures.map((feature, index) => 
        `${index + 1}. ${feature}`
      ).join('\n');
      
      return `HR中心为企业提供以下核心功能：

${features}

您可以说"打开智能薪酬诊断中心"或"我想使用动态调薪决策引擎"来访问具体功能。需要我为您详细介绍某个功能吗？`;
    } else {
      const features = SYSTEM_FUNCTIONS.jobseekerFeatures.map((feature, index) => 
        `${index + 1}. ${feature}`
      ).join('\n');
      
      return `求职者中心为个人提供以下核心功能：

${features}

您可以说"打开职业规划助手"或"我想查询薪酬"来访问具体功能。需要我为您详细介绍某个功能吗？`;
    }
  }

  // 生成AI回复（增强版）
  private async generateResponse(userInput: string, intent: Intent): Promise<string> {
    const { type, entities } = intent;
    
    // 优先处理系统导航
    if (type === 'navigation' && entities.feature) {
      return this.executeNavigation(entities.feature);
    }
    
    // 处理功能查询
    if (type === 'question' && entities.action === 'list_features') {
      return this.generateFeatureList(entities.role as 'hr' | 'jobseeker');
    }
    
    // 处理帮助请求
    if (type === 'help') {
      return this.generateHelpResponse();
    }
    
    // 处理分析请求
    if (type === 'analysis') {
      return this.generateAnalysisResponse(userInput);
    }
    
    // 增强的智能回复
    return this.generateEnhancedResponse(userInput);
  }

  // 增强的智能回复生成
  private generateEnhancedResponse(userInput: string): string {
    const input = userInput.toLowerCase();
    
    // 薪酬相关查询
    if (input.includes('薪酬') || input.includes('工资') || input.includes('薪水')) {
      if (input.includes('查询') || input.includes('查看')) {
        return `我来为您提供薪酬查询服务！

📊 **推荐功能**：
• 薪酬查询分析 - 查询目标职位的市场薪酬范围
• 智能薪酬计算器 - 基于个人条件计算薪酬水平
• 市场洞察报告 - 了解行业薪酬趋势

需要我帮您打开"薪酬查询"功能开始分析吗？`;
      }
      
      if (input.includes('谈判') || input.includes('面试')) {
        return `薪酬谈判是面试的重要环节！

💡 **谈判建议**：
1. 提前了解市场薪酬水平
2. 准备个人价值说明
3. 考虑整体薪酬包（不只基本工资）

🎯 **推荐使用**：
• 面试薪酬谈判功能 - 获取专业谈判策略
• 薪酬查询 - 了解市场行情作为谈判依据

需要我帮您打开相关功能吗？`;
      }
    }
    
    // 职业发展相关
    if (input.includes('职业') || input.includes('规划') || input.includes('发展') || input.includes('晋升')) {
      return `职业发展规划需要系统性思考！

🚀 **发展要素**：
• 技能评估与提升计划
• 行业趋势和机会分析
• 薪酬发展路径规划
• 个人品牌建设

💡 **推荐工具**：
• 职业规划助手 - AI分析个人发展路径
• 市场洞察报告 - 了解行业发展趋势
• 薪酬监控提醒 - 跟踪薪酬变化

我可以帮您打开"职业规划助手"开始详细分析！`;
    }
    
    // HR管理相关
    if (input.includes('管理') || input.includes('团队') || input.includes('员工')) {
      return `企业人力资源管理的核心挑战！

🎯 **管理要点**：
• 薪酬体系的公平性和竞争力
• 人才激励和保留策略
• 绩效与薪酬的有效联动
• 市场薪酬趋势跟踪

🔧 **推荐工具**：
• 智能薪酬诊断 - 全面分析薪酬健康度
• 薪酬公平性检测 - 发现潜在问题
• 竞争力雷达 - 对标市场薪酬

需要我帮您打开HR中心的相关功能吗？`;
    }
    
    // 数据分析相关
    if (input.includes('数据') || input.includes('分析') || input.includes('报告') || input.includes('趋势')) {
      return `数据驱动的薪酬决策更科学！

📊 **分析维度**：
• 行业薪酬水平对比
• 职位薪酬分布情况
• 地区薪酬差异分析
• 薪酬增长趋势预测

🔍 **推荐功能**：
• 市场洞察报告 - 深度行业分析
• 薪酬竞争力雷达 - 实时市场对比
• 智能薪酬计算器 - 个性化数据分析

我可以帮您打开相关的数据分析工具！`;
    }
    
    // 默认智能回复
    return this.generateContextualResponse(userInput);
  }

  // 根据上下文生成回复
  private generateContextualResponse(_userInput: string): string {
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('/hr')) {
      return `您现在在HR中心，我可以帮您：

🔧 **当前页面功能**：
• 智能薪酬诊断中心
• 动态调薪决策引擎  
• 薪酬竞争力雷达
• AI薪酬顾问助手

💡 **常见问题**：
• "如何使用薪酬诊断功能？"
• "动态调薪引擎怎么操作？"
• "打开竞争力雷达"

请告诉我您想了解哪个功能？`;
    }
    
    if (currentPath.includes('/jobseeker')) {
      return `您现在在求职者中心，我可以为您提供：

🎯 **个人发展服务**：
• 职业规划助手
• 薪酬查询分析
• 市场洞察报告
• 面试薪酬谈判

💡 **使用建议**：
• "帮我制定职业规划"
• "查询XX职位的薪酬"
• "打开市场洞察报告"

需要我为您详细介绍某个功能吗？`;
    }
    
    // 首页或其他页面
    return `欢迎使用ISMT智能薪酬助手！

🌟 **我可以帮您**：
• 快速导航到任何功能页面
• 提供专业的薪酬建议和分析
• 解答系统使用问题
• 个性化推荐适合的工具

🚀 **快速开始**：
• 说"打开求职者中心"开始个人发展
• 说"进入HR中心"管理企业薪酬
• 问"如何查询薪酬"获取使用指导

请告诉我您的需求，我来为您提供专业服务！`;
  }

  // 生成帮助回复
  private generateHelpResponse(): string {
    return `我是ISMT智能薪酬助手，可以帮您：

🧭 **系统导航**
• "打开HR中心" - 跳转到企业管理功能
• "进入求职者中心" - 访问个人职业发展工具
• "去薪酬查询" - 快速查询职位薪酬

💡 **功能咨询**
• "HR中心有什么功能？" - 了解企业管理工具
• "求职者中心能做什么？" - 查看个人发展功能

📊 **智能分析**
• "帮我分析薪酬水平" - 提供薪酬分析建议
• "职业发展建议" - 个性化职业规划指导

🎯 **填写建议**
• "帮我填写职位信息" - 提供表单填写建议
• "薪酬谈判技巧" - 面试谈判策略

您还想了解什么功能呢？`;
  }

  // 生成分析回复
  private generateAnalysisResponse(_userInput: string): string {
    return `我来为您提供薪酬分析建议：

📊 **推荐功能**
• 薪酬查询分析 - 查询目标职位的市场薪酬范围
• 智能薪酬计算器 - 基于个人条件计算薪酬水平
• 市场洞察报告 - 了解行业薪酬趋势

🎯 **个性化建议**
为了提供更精准的分析，建议您：
1. 先使用"薪酬查询"功能输入目标职位
2. 通过"职业规划助手"分析个人背景
3. 查看"市场洞察报告"了解行业趋势

需要我帮您打开相关功能吗？比如说"打开薪酬查询"。`;
  }


  // 主要对话处理方法
  async processMessage(userInput: string): Promise<Message> {
    // 添加用户消息
    this.addMessage({
      type: 'user',
      content: userInput
    });

    try {
      // 识别用户意图
      const intent = await this.recognizeIntent(userInput);
      
      // 生成AI回复
      const response = await this.generateResponse(userInput, intent);
      
      // 添加AI回复
      return this.addMessage({
        type: 'assistant',
        content: response,
        metadata: {
          action: intent.entities.action as 'navigate' | 'search' | 'analyze' | 'suggest' | undefined,
          target: intent.entities.feature
        }
      });
      
    } catch (error) {
      console.error('AI Assistant Error:', error);
      
      return this.addMessage({
        type: 'assistant',
        content: '抱歉，我遇到了一些技术问题。请稍后再试，或者直接使用导航菜单访问您需要的功能。'
      });
    }
  }

  // 获取对话历史
  getConversationHistory(): Message[] {
    return this.context.conversationHistory;
  }

  // 清除对话历史
  clearHistory(): void {
    this.context.conversationHistory = [];
  }

  // 获取建议回复
  getSuggestions(currentPage: string): string[] {
    const suggestions = [
      "HR中心有什么功能？",
      "求职者中心能做什么？",
      "帮我分析薪酬水平",
      "打开薪酬查询",
      "我需要帮助"
    ];

    // 根据当前页面提供个性化建议
    if (currentPage.includes('/hr')) {
      return [
        "智能薪酬诊断中心是什么？",
        "如何使用动态调薪决策引擎？",
        "打开薪酬竞争力雷达",
        "帮我生成职位描述",
        "薪酬公平性如何检测？"
      ];
    } else if (currentPage.includes('/jobseeker')) {
      return [
        "如何制定职业规划？",
        "打开市场洞察报告",
        "帮我计算薪酬水平",
        "面试薪酬谈判技巧",
        "设置薪酬监控提醒"
      ];
    }

    return suggestions;
  }
}
