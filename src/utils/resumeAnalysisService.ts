/**
 * 简历AI分析服务
 * 使用DeepSeek API进行简历分析
 */

import { deepseekApi } from '../services/deepseekApi';

export interface ResumeAnalysisRequest {
  resumeText: string;
  targetPosition: string;
  targetIndustry: string;
  extractedInfo: {
    name: string;
    email: string;
    phone: string;
    skills: string[];
    totalLines: number;
    totalWords: number;
  };
}

export interface ResumeAnalysisResponse {
  overallScore: number;
  keywordMatch: number;
  formatScore: number;
  atsCompatibility: number;
  skillGaps: string[];
  strengths: string[];
  improvements: string[];
  suggestions: {
    id: string;
    category: 'content' | 'format' | 'keywords' | 'structure';
    priority: 'high' | 'medium' | 'low';
    title: string;
    suggestion: string;
    example?: string;
  }[];
}

/**
 * 生成AI分析提示词
 */
const generateAnalysisPrompt = (request: ResumeAnalysisRequest): string => {
  const { resumeText, targetPosition, targetIndustry, extractedInfo } = request;
  
  return `请作为专业的简历优化专家，分析以下简历内容，并提供详细的优化建议。

目标职位：${targetPosition}
目标行业：${targetIndustry}

简历基本信息：
- 姓名：${extractedInfo.name || '未识别'}
- 邮箱：${extractedInfo.email || '未识别'}
- 电话：${extractedInfo.phone || '未识别'}
- 已识别技能：${extractedInfo.skills.join(', ') || '无'}
- 总字数：${extractedInfo.totalWords}

简历内容：
${resumeText}

请按照以下JSON格式返回分析结果：

{
  "overallScore": 85,
  "keywordMatch": 78,
  "formatScore": 82,
  "atsCompatibility": 75,
  "skillGaps": ["React Hooks", "TypeScript", "微服务架构"],
  "strengths": [
    "工作经验描述详细具体",
    "项目成果量化表达清晰",
    "技能列表覆盖面广"
  ],
  "improvements": [
    "缺少关键技术栈关键词",
    "项目描述可以更突出业务价值",
    "软技能展示不够充分"
  ],
  "suggestions": [
    {
      "id": "1",
      "category": "keywords",
      "priority": "high",
      "title": "增加关键技术栈关键词",
      "suggestion": "在技能部分和项目描述中添加React、TypeScript、Node.js等关键词，提高ATS系统匹配度",
      "example": "将'前端开发'改为'React前端开发，熟练使用TypeScript进行类型安全编程'"
    }
  ]
}

请确保：
1. 评分范围在0-100之间
2. 建议具体可操作
3. 示例真实有效
4. 重点关注与目标职位的匹配度
5. 考虑ATS系统的兼容性`;
};

/**
 * 调用AI分析简历
 */
export const analyzeResume = async (request: ResumeAnalysisRequest): Promise<ResumeAnalysisResponse> => {
  try {
    const prompt = generateAnalysisPrompt(request);
    
    const content = await deepseekApi.chat([
      {
        role: 'system',
        content: '你是一个专业的简历优化专家，擅长分析简历内容并提供针对性的优化建议。请严格按照JSON格式返回分析结果。'
      },
      {
        role: 'user',
        content: prompt
      }
    ], {
      model: 'deepseek-chat',
      temperature: 0.3,
      maxTokens: 2000
    });
    if (!content) {
      throw new Error('AI分析返回空结果');
    }

    // 尝试解析JSON响应
    try {
      const analysisResult = JSON.parse(content);
      return analysisResult as ResumeAnalysisResponse;
    } catch (parseError) {
      console.error('AI响应解析失败:', parseError);
      console.error('原始响应:', content);
      
      // 如果解析失败，返回默认分析结果
      return getDefaultAnalysis(request);
    }
  } catch (error) {
    console.error('AI分析失败:', error);
    // 返回默认分析结果
    return getDefaultAnalysis(request);
  }
};

/**
 * 获取默认分析结果（当AI分析失败时使用）
 */
const getDefaultAnalysis = (request: ResumeAnalysisRequest): ResumeAnalysisResponse => {
  const { targetPosition, extractedInfo } = request;
  
  // 基于提取的信息进行简单分析
  const skillMatch = extractedInfo.skills.length;
  const hasContactInfo = !!(extractedInfo.email || extractedInfo.phone);
  const hasName = !!extractedInfo.name;
  
  const overallScore = Math.min(60 + skillMatch * 5 + (hasContactInfo ? 10 : 0) + (hasName ? 5 : 0), 95);
  
  return {
    overallScore,
    keywordMatch: Math.min(50 + skillMatch * 8, 90),
    formatScore: hasContactInfo && hasName ? 80 : 60,
    atsCompatibility: hasContactInfo ? 75 : 50,
    skillGaps: ['React Hooks', 'TypeScript', 'Node.js', '微服务架构'],
    strengths: [
      '工作经验描述详细具体',
      '项目成果量化表达清晰',
      '技能列表覆盖面广',
      '教育背景匹配度高'
    ],
    improvements: [
      '缺少关键技术栈关键词',
      '项目描述可以更突出业务价值',
      '软技能展示不够充分',
      '行业相关经验需要强化'
    ],
    suggestions: [
      {
        id: '1',
        category: 'keywords',
        priority: 'high',
        title: '增加关键技术栈关键词',
        suggestion: `在技能部分和项目描述中添加与${targetPosition}相关的关键词，提高ATS系统匹配度`,
        example: '将"前端开发"改为"React前端开发，熟练使用TypeScript进行类型安全编程"'
      },
      {
        id: '2',
        category: 'content',
        priority: 'high',
        title: '量化项目成果',
        suggestion: '用具体数据描述项目成果，如性能提升百分比、用户增长数量等',
        example: '将"优化了系统性能"改为"通过代码优化和缓存策略，系统响应速度提升40%"'
      },
      {
        id: '3',
        category: 'structure',
        priority: 'medium',
        title: '添加技能匹配度部分',
        suggestion: '在简历开头添加与目标职位高度匹配的核心技能摘要',
        example: `核心技能：${extractedInfo.skills.slice(0, 3).join('、')}、敏捷开发、团队协作`
      }
    ]
  };
};
