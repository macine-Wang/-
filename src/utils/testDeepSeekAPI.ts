/**
 * DeepSeek API 测试工具
 * 用于验证API连接和功能
 */

import { deepseekApi } from '@/services/deepseekApi';

export const testDeepSeekConnection = async (): Promise<{
  success: boolean;
  message: string;
  response?: string;
}> => {
  try {
    console.log('正在测试DeepSeek API连接...');
    
    const response = await deepseekApi.chat([
      {
        role: 'system',
        content: '你是一个测试助手，请简短地回复。'
      },
      {
        role: 'user',
        content: '请说"API连接成功"'
      }
    ], {
      model: 'deepseek-chat',
      temperature: 0.1,
      maxTokens: 50
    });

    console.log('API响应:', response);

    if (response && response.trim()) {
      return {
        success: true,
        message: 'DeepSeek API连接成功！',
        response: response
      };
    } else {
      return {
        success: false,
        message: 'API响应为空'
      };
    }
  } catch (error) {
    console.error('API测试失败:', error);
    return {
      success: false,
      message: `API连接失败: ${error instanceof Error ? error.message : '未知错误'}`
    };
  }
};

export const testSalaryAnalysis = async (): Promise<{
  success: boolean;
  message: string;
  analysis?: any;
}> => {
  try {
    console.log('正在测试薪酬分析API...');
    
    const response = await deepseekApi.salaryCalculation({
      position: 'JavaScript工程师',
      location: '北京',
      experience: '3年',
      education: '本科',
      industry: '互联网',
      skills: ['JavaScript', 'React', 'Node.js'],
      companySize: '100-499人',
      jobLevel: '中级'
    });

    console.log('薪酬分析响应:', response);

    return {
      success: true,
      message: '薪酬分析API测试成功！',
      analysis: response
    };
  } catch (error) {
    console.error('薪酬分析测试失败:', error);
    return {
      success: false,
      message: `薪酬分析API测试失败: ${error instanceof Error ? error.message : '未知错误'}`
    };
  }
};

export const testMarketAnalysis = async (): Promise<{
  success: boolean;
  message: string;
  analysis?: string;
}> => {
  try {
    console.log('正在测试市场分析API...');
    
    const response = await deepseekApi.chat([
      {
        role: 'system',
        content: '你是一位资深的职业市场分析专家，具有丰富的行业洞察和数据分析经验。'
      },
      {
        role: 'user',
        content: `请对以下职位进行市场分析：
职位：前端工程师
行业：互联网
城市：上海
时间范围：近3个月

请简要分析市场趋势、薪资水平和技能要求。`
      }
    ], {
      model: 'deepseek-chat',
      temperature: 0.7,
      maxTokens: 1000
    });

    console.log('市场分析响应:', response);

    return {
      success: true,
      message: '市场分析API测试成功！',
      analysis: response
    };
  } catch (error) {
    console.error('市场分析测试失败:', error);
    return {
      success: false,
      message: `市场分析API测试失败: ${error instanceof Error ? error.message : '未知错误'}`
    };
  }
};
