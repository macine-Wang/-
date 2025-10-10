/**
 * 文件解析工具类
 * 支持PDF和Word文件内容提取
 */

import * as pdfjsLib from 'pdfjs-dist';
import * as mammoth from 'mammoth';

// 设置 PDF.js worker - 使用本地文件
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('/pdf.worker.min.mjs', window.location.origin).toString();

export interface ParsedContent {
  text: string;
  wordCount: number;
  pages?: number;
  success: boolean;
  error?: string;
}

/**
 * 解析PDF文件
 */
export const parsePDF = async (file: File): Promise<ParsedContent> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    const numPages = pdf.numPages;
    
    // 逐页提取文本
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // 将文本内容合并
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      
      fullText += pageText + '\n';
    }
    
    return {
      text: fullText.trim(),
      wordCount: fullText.split(/\s+/).length,
      pages: numPages,
      success: true
    };
  } catch (error) {
    console.error('PDF解析错误:', error);
    return {
      text: '',
      wordCount: 0,
      success: false,
      error: `PDF解析失败: ${error instanceof Error ? error.message : '未知错误'}`
    };
  }
};

/**
 * 解析Word文件
 */
export const parseWord = async (file: File): Promise<ParsedContent> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    return {
      text: result.value,
      wordCount: result.value.split(/\s+/).length,
      success: true
    };
  } catch (error) {
    console.error('Word解析错误:', error);
    return {
      text: '',
      wordCount: 0,
      success: false,
      error: `Word解析失败: ${error instanceof Error ? error.message : '未知错误'}`
    };
  }
};

/**
 * 根据文件类型解析文件内容
 */
export const parseFile = async (file: File): Promise<ParsedContent> => {
  const fileType = file.type;
  
  if (fileType === 'application/pdf') {
    return await parsePDF(file);
  } else if (fileType.includes('document') || fileType.includes('word')) {
    return await parseWord(file);
  } else {
    return {
      text: '',
      wordCount: 0,
      success: false,
      error: '不支持的文件格式'
    };
  }
};

/**
 * 清理和格式化提取的文本
 */
export const cleanText = (text: string): string => {
  return text
    .replace(/\s+/g, ' ') // 合并多个空格
    .replace(/\n\s*\n/g, '\n') // 合并多个换行
    .trim();
};

/**
 * 提取简历关键信息
 */
export const extractResumeInfo = (text: string) => {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // 提取姓名（通常在开头几行）
  const nameMatch = text.match(/^[\u4e00-\u9fa5]{2,4}/m);
  const name = nameMatch ? nameMatch[0] : '';
  
  // 提取邮箱
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : '';
  
  // 提取电话
  const phoneMatch = text.match(/(1[3-9]\d{9}|\d{3,4}-\d{7,8})/);
  const phone = phoneMatch ? phoneMatch[0] : '';
  
  // 提取技能关键词
  const skillKeywords = [
    'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 'Node.js', 'Python', 'Java', 'C++', 'C#',
    'HTML', 'CSS', 'SQL', 'MongoDB', 'MySQL', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'Azure',
    'Git', 'Linux', '微服务', '分布式', '高并发', '机器学习', '人工智能', '数据分析'
  ];
  
  const foundSkills = skillKeywords.filter(skill => 
    text.toLowerCase().includes(skill.toLowerCase())
  );
  
  return {
    name,
    email,
    phone,
    skills: foundSkills,
    totalLines: lines.length,
    totalWords: text.split(/\s+/).length
  };
};
