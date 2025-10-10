/**
 * 豆包模型API服务
 * 集成字节跳动豆包大模型API
 */

export interface DoubaoMessage {
  role: 'user' | 'assistant' | 'system';
  content: string | Array<{
    type: 'text' | 'image_url';
    text?: string;
    image_url?: {
      url: string;
    };
  }>;
}

export interface DoubaoResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface SalaryAdvisorResponse {
  content: string;
  suggestions?: string[];
}

class DoubaoApiService {
  private readonly baseURL = 'https://ark.cn-beijing.volces.com/api/v3';
  private readonly apiKey = '78208bcd-7f84-4474-b46c-114d6f45ec95';
  private readonly model = 'doubao-seed-1-6-vision-250815';

  private async callAPI(messages: DoubaoMessage[]): Promise<DoubaoResponse> {
    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          temperature: 0.3,  // 降低温度，提高结构化输出的稳定性
          max_tokens: 8000,  // 增加最大token数，支持详细文档和复杂表格输出
          top_p: 0.8,
          frequency_penalty: 0.1,
          presence_penalty: 0.1,
          // 启用流式输出以支持长表格
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`豆包API调用失败: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('豆包API调用错误:', error);
      throw error;
    }
  }

  /**
   * 薪酬顾问聊天
   */
  async salaryAdvisorChat(
    userMessage: string,
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
  ): Promise<SalaryAdvisorResponse> {
    try {
      // 构建系统提示
      const systemPrompt = `你是一位专业的薪酬管理顾问，具有丰富的人力资源和薪酬设计经验。你的任务是为用户提供专业、实用的薪酬管理建议。

你的专业领域包括：
1. 薪酬体系设计与优化
2. 市场薪酬调研与分析
3. 绩效与薪酬关联设计
4. 薪酬预算管理
5. 人才激励与留存策略
6. 薪酬合规管理
7. 薪酬数据分析

回复要求：
- 提供专业、准确的建议
- 语言简洁明了，逻辑清晰
- 结合实际案例和最佳实践
- 考虑不同企业规模和行业特点
- **充分利用文本表格、列表、图表等格式来清晰展示薪酬数据和对比分析**
- 当涉及薪酬数据对比、等级划分、预算分配等内容时，**优先使用表格形式**展示
- 支持Markdown格式，包括表格、列表、加粗、斜体等格式
- 在回复末尾提供2-3个相关的后续建议问题

表格示例格式：
| 职级 | 基本薪资范围 | 绩效奖金 | 年度调薪幅度 |
|------|-------------|----------|-------------|
| P6   | 15-20万     | 10-30%   | 5-10%       |
| P7   | 20-30万     | 15-40%   | 8-15%       |

请以专业顾问的身份回答用户的薪酬管理问题，充分发挥你的表格生成和数据展示能力。`;

      // 构建消息历史
      const messages: DoubaoMessage[] = [
        {
          role: 'system',
          content: systemPrompt
        }
      ];

      // 添加对话历史（最近5条）
      conversationHistory.slice(-5).forEach(msg => {
        messages.push({
          role: msg.role,
          content: msg.content
        });
      });

      // 添加当前用户消息
      messages.push({
        role: 'user',
        content: userMessage
      });

      const response = await this.callAPI(messages);

      if (!response.choices || response.choices.length === 0) {
        throw new Error('豆包API返回了空响应');
      }

      const aiContent = response.choices[0].message.content;

      // 提取建议问题（如果AI在回复中包含了建议）
      const suggestions = this.extractSuggestions(aiContent);

      return {
        content: aiContent,
        suggestions
      };
    } catch (error) {
      console.error('薪酬顾问聊天失败:', error);
      throw new Error('AI服务暂时不可用，请稍后重试');
    }
  }

  /**
   * 从AI回复中提取建议问题
   */
  private extractSuggestions(content: string): string[] {
    const suggestions: string[] = [];
    
    // 尝试从内容中提取问题格式的建议
    const questionRegex = /(?:您可能还想了解|相关问题|延伸问题|建议咨询)[:：]\s*\n?(.*?)(?:\n\n|$)/s;
    const match = content.match(questionRegex);
    
    if (match) {
      const suggestionsText = match[1];
      const lines = suggestionsText.split('\n').filter(line => line.trim());
      
      lines.forEach(line => {
        const cleanLine = line.replace(/^[•\-\*\d\.]\s*/, '').trim();
        if (cleanLine && cleanLine.includes('?') || cleanLine.includes('？')) {
          suggestions.push(cleanLine);
        }
      });
    }

    // 如果没有提取到建议，提供默认建议
    if (suggestions.length === 0) {
      suggestions.push(
        '请给我一个薪酬等级表格示例',
        '如何建立更公平的薪酬体系？',
        '薪酬调研应该关注哪些维度？'
      );
    }

    return suggestions.slice(0, 3); // 最多返回3个建议
  }

  /**
   * 获取API使用统计
   */
  async getUsageStats(): Promise<{ total_tokens: number; cost_estimate: string }> {
    // 这里可以实现使用统计功能
    return {
      total_tokens: 0,
      cost_estimate: '¥0.00'
    };
  }
}

export const doubaoApi = new DoubaoApiService();
