/**
 * JD模板数据库
 * 包含多行业、多岗位的职位描述模板
 */

export interface JDTemplate {
  id: string;
  name: string;
  industry: string;
  position: string;
  level: 'entry' | 'mid' | 'senior' | 'manager' | 'director';
  description: string;
  template: {
    responsibilities: string[];
    requirements: string[];
    highlights: string[];
    keywords: string[];
  };
}

export const jdTemplates: JDTemplate[] = [
  // IT互联网行业
  {
    id: 'it_frontend_junior',
    name: '初级前端工程师模板',
    industry: 'IT互联网',
    position: '前端工程师',
    level: 'entry',
    description: '适用于1-3年经验的前端开发岗位，注重基础技能和学习能力',
    template: {
      responsibilities: [
        '负责Web前端页面的开发和维护',
        '与UI设计师协作，实现高质量的用户界面',
        '优化前端性能，提升用户体验',
        '参与代码评审，保证代码质量',
        '学习新技术，持续提升技术能力'
      ],
      requirements: [
        '本科及以上学历，计算机相关专业',
        '1-3年前端开发经验',
        '熟练掌握HTML5、CSS3、JavaScript',
        '熟悉Vue.js或React框架',
        '了解响应式设计和移动端适配',
        '具备良好的学习能力和团队协作精神'
      ],
      highlights: [
        '技术氛围浓厚，大牛云集',
        '完善的技术培训体系',
        '弹性工作制，工作生活平衡',
        '丰厚的年终奖和股权激励'
      ],
      keywords: ['HTML5', 'CSS3', 'JavaScript', 'Vue.js', 'React', '前端开发', '用户体验']
    }
  },
  {
    id: 'it_frontend_senior',
    name: '高级前端工程师模板',
    industry: 'IT互联网',
    position: '高级前端工程师',
    level: 'senior',
    description: '适用于5年以上经验的高级前端岗位，强调架构设计和团队领导',
    template: {
      responsibilities: [
        '负责前端架构设计和技术方案制定',
        '指导初级开发人员，提供技术支持',
        '主导前端技术选型和最佳实践制定',
        '优化前端工程化流程，提升开发效率',
        '参与产品需求分析和技术评审'
      ],
      requirements: [
        '本科及以上学历，计算机相关专业',
        '5年以上前端开发经验',
        '精通现代前端框架（React/Vue/Angular）',
        '熟悉前端工程化工具（Webpack、Vite等）',
        '具备前端架构设计经验',
        '优秀的问题解决能力和团队领导力'
      ],
      highlights: [
        '技术领导岗位，发展空间广阔',
        '参与核心产品开发',
        '年薪30-50W，期权激励',
        '一线互联网公司背景优先'
      ],
      keywords: ['前端架构', 'React', 'Vue', 'TypeScript', 'Node.js', '团队领导', '技术方案']
    }
  },
  {
    id: 'it_backend_java',
    name: 'Java后端工程师模板',
    industry: 'IT互联网',
    position: 'Java开发工程师',
    level: 'mid',
    description: '适用于Java后端开发岗位，涵盖微服务和分布式系统',
    template: {
      responsibilities: [
        '负责后端服务的设计、开发和维护',
        '参与微服务架构设计和优化',
        '编写高质量、可维护的代码',
        '参与数据库设计和性能优化',
        '协作解决线上问题和性能瓶颈'
      ],
      requirements: [
        '本科及以上学历，计算机相关专业',
        '3-5年Java开发经验',
        '熟练掌握Spring Boot、Spring Cloud',
        '熟悉MySQL、Redis等数据库',
        '了解分布式系统和微服务架构',
        '具备良好的编程规范和文档习惯'
      ],
      highlights: [
        '核心业务系统开发',
        '完善的技术培训和晋升通道',
        '灵活的工作方式',
        '具有竞争力的薪资待遇'
      ],
      keywords: ['Java', 'Spring Boot', 'Spring Cloud', '微服务', 'MySQL', 'Redis', '分布式']
    }
  },
  
  // 金融行业
  {
    id: 'finance_analyst',
    name: '金融分析师模板',
    industry: '金融',
    position: '金融分析师',
    level: 'mid',
    description: '适用于金融行业分析岗位，强调数据分析和风险评估能力',
    template: {
      responsibilities: [
        '进行金融市场分析和投资研究',
        '编写投资分析报告和风险评估',
        '监控投资组合表现，提出优化建议',
        '参与投资决策讨论和方案制定',
        '跟踪宏观经济指标和行业动态'
      ],
      requirements: [
        '金融、经济学相关专业本科及以上学历',
        '3-5年金融行业工作经验',
        '具备CFA、FRM等金融资格证书优先',
        '熟练使用Excel、Python、R等分析工具',
        '优秀的数据分析和报告撰写能力',
        '良好的英语读写能力'
      ],
      highlights: [
        '一线金融机构平台',
        '完善的职业发展路径',
        '丰厚的绩效奖金',
        '专业的培训和认证支持'
      ],
      keywords: ['金融分析', '投资研究', '风险管理', 'CFA', 'Python', '数据分析', '投资组合']
    }
  },
  {
    id: 'finance_risk_manager',
    name: '风险管理经理模板',
    industry: '金融',
    position: '风险管理经理',
    level: 'manager',
    description: '适用于金融风险管理岗位，注重风险识别和控制能力',
    template: {
      responsibilities: [
        '建立和完善风险管理体系',
        '识别、评估和监控各类风险',
        '制定风险控制措施和应急预案',
        '定期编写风险分析报告',
        '协调各部门风险管理工作'
      ],
      requirements: [
        '金融、风险管理相关专业硕士及以上学历',
        '5年以上风险管理工作经验',
        '具备FRM、PRM等风险管理资格证书',
        '熟悉金融监管政策和合规要求',
        '优秀的风险识别和分析能力',
        '强烈的责任心和抗压能力'
      ],
      highlights: [
        '核心风险管理岗位',
        '年薪40-80W',
        '完善的风险管理培训',
        '广阔的职业发展前景'
      ],
      keywords: ['风险管理', 'FRM', '合规', '金融监管', '风险控制', '应急预案', '风险评估']
    }
  },
  
  // 教育行业
  {
    id: 'edu_product_manager',
    name: '教育产品经理模板',
    industry: '教育',
    position: '产品经理',
    level: 'mid',
    description: '适用于教育科技公司产品岗位，强调教育理解和产品设计',
    template: {
      responsibilities: [
        '负责教育产品的规划和设计',
        '深入了解用户需求，制定产品策略',
        '协调技术、设计、运营等团队',
        '跟踪产品数据，持续优化用户体验',
        '研究教育行业趋势和竞品动态'
      ],
      requirements: [
        '本科及以上学历，教育或相关专业优先',
        '3-5年产品经理工作经验',
        '具备教育行业背景或深度理解',
        '熟练使用Axure、Figma等产品工具',
        '优秀的逻辑思维和沟通协调能力',
        '对教育有热情，关注用户体验'
      ],
      highlights: [
        '参与教育创新产品开发',
        '完善的产品培训体系',
        '弹性工作制度',
        '有意义的教育事业'
      ],
      keywords: ['产品经理', '教育科技', '用户体验', 'Axure', '产品设计', '需求分析', '教育创新']
    }
  },
  {
    id: 'edu_content_specialist',
    name: '教学内容专家模板',
    industry: '教育',
    position: '教学内容专家',
    level: 'senior',
    description: '适用于教育内容开发岗位，注重专业知识和教学设计',
    template: {
      responsibilities: [
        '设计和开发优质教学内容',
        '制定课程大纲和教学计划',
        '评估和优化教学效果',
        '培训和指导其他内容创作者',
        '跟踪教育政策和行业标准'
      ],
      requirements: [
        '硕士及以上学历，相关学科专业背景',
        '5年以上教学或内容开发经验',
        '具备教师资格证或相关认证',
        '熟悉教学设计理论和方法',
        '优秀的内容创作和表达能力',
        '对教育充满热情和使命感'
      ],
      highlights: [
        '影响千万学生的教育内容',
        '专业的教学设计培训',
        '丰厚的内容创作奖励',
        '教育行业专家成长路径'
      ],
      keywords: ['教学设计', '内容开发', '教师资格', '课程开发', '教育专家', '教学效果', '教育创新']
    }
  },
  
  // 医疗健康行业
  {
    id: 'health_data_analyst',
    name: '医疗数据分析师模板',
    industry: '医疗健康',
    position: '数据分析师',
    level: 'mid',
    description: '适用于医疗健康数据分析岗位，结合医学知识和数据技能',
    template: {
      responsibilities: [
        '分析医疗健康相关数据',
        '建立数据分析模型和指标体系',
        '编写数据分析报告和可视化图表',
        '支持临床研究和业务决策',
        '维护和优化数据分析流程'
      ],
      requirements: [
        '医学、生物统计或数据科学相关专业',
        '3-5年医疗数据分析经验',
        '熟练使用Python、R、SQL等工具',
        '了解医学统计学和流行病学',
        '具备良好的医学背景知识',
        '严谨的科学态度和职业操守'
      ],
      highlights: [
        '参与前沿医疗研究项目',
        '专业的医疗数据培训',
        '有意义的健康事业',
        '广阔的医疗科技发展前景'
      ],
      keywords: ['医疗数据', '生物统计', 'Python', 'R语言', '临床研究', '流行病学', '医学统计']
    }
  },
  
  // 制造业
  {
    id: 'manu_quality_engineer',
    name: '质量工程师模板',
    industry: '制造业',
    position: '质量工程师',
    level: 'mid',
    description: '适用于制造业质量管理岗位，强调质量控制和改进',
    template: {
      responsibilities: [
        '制定和执行质量控制标准',
        '进行产品质量检测和分析',
        '识别质量问题并提出改进措施',
        '参与供应商质量评估',
        '推进质量管理体系建设'
      ],
      requirements: [
        '机械、材料等工程类专业本科以上',
        '3-5年质量管理工作经验',
        '熟悉ISO9001等质量管理体系',
        '掌握质量分析工具和方法',
        '具备六西格玛绿带或黑带优先',
        '严谨细致的工作态度'
      ],
      highlights: [
        '知名制造企业平台',
        '完善的质量管理培训',
        '六西格玛认证支持',
        '稳定的职业发展环境'
      ],
      keywords: ['质量管理', 'ISO9001', '六西格玛', '质量控制', '供应商管理', '质量分析', '持续改进']
    }
  },
  
  // 房地产行业
  {
    id: 'real_estate_sales',
    name: '房地产销售经理模板',
    industry: '房地产',
    position: '销售经理',
    level: 'manager',
    description: '适用于房地产销售管理岗位，注重销售业绩和团队管理',
    template: {
      responsibilities: [
        '制定和执行销售策略和计划',
        '管理销售团队，完成销售目标',
        '维护重要客户关系',
        '分析市场动态，制定应对策略',
        '培训和指导销售人员'
      ],
      requirements: [
        '本科及以上学历，市场营销或相关专业',
        '5年以上房地产销售经验',
        '具备团队管理经验',
        '优秀的销售技巧和谈判能力',
        '良好的客户服务意识',
        '能承受较大工作压力'
      ],
      highlights: [
        '高额销售提成和奖金',
        '知名地产品牌平台',
        '完善的销售培训体系',
        '快速的职业发展通道'
      ],
      keywords: ['房地产销售', '销售管理', '客户关系', '销售策略', '团队管理', '市场分析', '销售培训']
    }
  },
  
  // 零售电商行业
  {
    id: 'ecom_operation_manager',
    name: '电商运营经理模板',
    industry: '零售电商',
    position: '运营经理',
    level: 'manager',
    description: '适用于电商平台运营管理岗位，强调数据驱动和用户增长',
    template: {
      responsibilities: [
        '制定电商平台运营策略',
        '负责用户增长和留存优化',
        '管理商品上架和促销活动',
        '分析运营数据，优化转化率',
        '协调供应链和客服团队'
      ],
      requirements: [
        '本科及以上学历，电商或市场营销专业',
        '3-5年电商运营经验',
        '熟悉主流电商平台规则',
        '具备数据分析和用户洞察能力',
        '了解数字营销和增长黑客',
        '优秀的项目管理和协调能力'
      ],
      highlights: [
        '参与电商平台核心业务',
        '数据驱动的工作环境',
        '快速成长的电商行业',
        '丰厚的业绩奖励'
      ],
      keywords: ['电商运营', '用户增长', '数据分析', '转化率优化', '数字营销', '供应链', '增长黑客']
    }
  },
  
  // 文化娱乐行业
  {
    id: 'media_content_creator',
    name: '内容创作专家模板',
    industry: '文化娱乐',
    position: '内容创作专家',
    level: 'senior',
    description: '适用于新媒体内容创作岗位，注重创意和传播效果',
    template: {
      responsibilities: [
        '策划和创作优质内容',
        '管理多平台内容发布',
        '分析内容数据，优化传播效果',
        '跟踪热点话题，把握传播时机',
        '协作设计师和视频团队'
      ],
      requirements: [
        '新闻传播、中文或相关专业本科以上',
        '3年以上内容创作经验',
        '优秀的文案写作和创意能力',
        '熟悉各大社交媒体平台',
        '敏锐的热点嗅觉和网感',
        '良好的团队协作能力'
      ],
      highlights: [
        '创意自由的工作环境',
        '影响力内容平台',
        '丰富的创作资源支持',
        '内容创作者成长计划'
      ],
      keywords: ['内容创作', '新媒体', '文案写作', '社交媒体', '创意策划', '传播效果', '热点营销']
    }
  }
];

// 根据行业筛选模板
export const getTemplatesByIndustry = (industry: string): JDTemplate[] => {
  return jdTemplates.filter(template => template.industry === industry);
};

// 根据岗位级别筛选模板
export const getTemplatesByLevel = (level: string): JDTemplate[] => {
  return jdTemplates.filter(template => template.level === level);
};

// 根据岗位名称搜索模板
export const searchTemplatesByPosition = (position: string): JDTemplate[] => {
  return jdTemplates.filter(template => 
    template.position.toLowerCase().includes(position.toLowerCase()) ||
    template.name.toLowerCase().includes(position.toLowerCase())
  );
};

// 获取所有行业列表
export const getAllIndustries = (): string[] => {
  return Array.from(new Set(jdTemplates.map(template => template.industry)));
};

// 获取所有岗位级别
export const getAllLevels = (): string[] => {
  return ['entry', 'mid', 'senior', 'manager', 'director'];
};
