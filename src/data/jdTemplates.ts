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
  // 新增匹配字段，用于智能推荐
  matchCriteria?: {
    keywords?: string[];           // 职位关键词（如：实施、顾问、开发等）
    skills?: string[];              // 相关技能关键词
    clientTypes?: string[];         // 客户类型（央国企、外企等）
    preferredIndustries?: string[]; // 优先行业
    projectScale?: string[];        // 项目规模
    certifications?: string[];      // 相关认证
  };
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
  },
  
  // ========== 新增：咨询与实施类模板（基于用户提供的JD样本）==========
  
  // 财务实施顾问类
  {
    id: 'consulting_finance_implementation_junior',
    name: '财务实施初级顾问模板',
    industry: '咨询/IT服务',
    position: '财务实施顾问',
    level: 'entry',
    description: '适用于财务系统实施、运维等初级岗位，面向央国企项目',
    matchCriteria: {
      keywords: ['财务', '实施', '顾问', '运维', 'SAP', 'ERP', 'FICO', '共享'],
      skills: ['SAP', 'ERP', '财务系统', '数据分析', 'Office', 'WPS'],
      clientTypes: ['央国企'],
      preferredIndustries: ['能源', '石油/石化', '电力/热力/燃气/水利']
    },
    template: {
      responsibilities: [
        '依据项目整体安排开展项目交付工作，完成运维支持、完成上线数据收集及上线支持工作',
        '承担财务共享平台项目实施工作，系统功能测试以及上线运维支持等工作',
        '开展客户关系管理，建立良好的客户关系，帮助客户解决平台应用过程中的各类问题',
        '为客户提供驻场运维服务，完成共享推广实施工作',
        '独立完成系统运维服务工作，包括数据导入、审批流绘制等工作'
      ],
      requirements: [
        '财务、计算机相关专业本科及以上学历，应届硕士生优先',
        '具备共享平台项目、财务信息化实施经验或SAP-FICO模块实施经验优先',
        '了解人工智能相关产品',
        '熟练掌握Office、WPS等办公智能化工具',
        '吃苦耐劳，能够适应加班'
      ],
      highlights: [
        '央国企大型项目经验',
        '专业的实施培训体系',
        '职业发展空间广阔',
        '稳定的工作环境'
      ],
      keywords: ['财务实施', 'SAP', 'ERP', 'FICO', '财务共享', '运维', '央国企', '驻场']
    }
  },
  
  // 初级咨询顾问
  {
    id: 'consulting_junior_advisor',
    name: '初级咨询顾问模板',
    industry: '咨询/IT服务',
    position: '咨询顾问',
    level: 'entry',
    description: '适用于咨询公司初级顾问岗位，国际咨询背景，面向央国企客户',
    matchCriteria: {
      keywords: ['咨询', '顾问', '财务', '数字化转型', '企业架构', '数据架构'],
      skills: ['财务', '会计', '软件技术', '数字化转型', '企业架构设计', '数据架构设计'],
      clientTypes: ['央国企', '外企'],
      preferredIndustries: ['能源', '石油/石化', '电力/热力/燃气/水利']
    },
    template: {
      responsibilities: [
        '按照项目组和Coach指导完成相关工作',
        '参与财务数字化转型、企业架构设计、数据架构设计项目',
        '协助高级顾问进行项目调研和分析',
        '撰写项目报告和方案文档',
        '参与客户沟通和需求分析'
      ],
      requirements: [
        '本科及以上学历',
        '财务、会计、软件技术等相关专业',
        '2年以上国际公司工作经验',
        '财务数字化转型、企业架构设计、数据架构设计项目经验优先',
        '具备石油/石化、电力/热力/燃气/水利等行业经验优先'
      ],
      highlights: [
        '国际咨询公司大牛带队',
        '服务央国企，报效国家',
        '汇集国际一流咨询公司管理理念',
        '高成长机会，股权激励'
      ],
      keywords: ['咨询顾问', '财务转型', '企业架构', '数据架构', '国际咨询', '央国企']
    }
  },
  
  // 数据治理顾问
  {
    id: 'consulting_data_governance',
    name: '数据治理顾问模板',
    industry: '咨询/IT服务',
    position: '数据治理顾问',
    level: 'mid',
    description: '适用于数据治理、数据中台相关咨询和实施岗位，面向央国企项目',
    matchCriteria: {
      keywords: ['数据治理', '数据中台', '数据分析', 'DAMA', '数据管理'],
      skills: ['数据治理', '数据中台', '数据分析', '数据仓库', '数据集成', '数据质量', 'DAMA', 'ISO数据管理'],
      clientTypes: ['央国企'],
      preferredIndustries: ['能源', '制造', '金融'],
      projectScale: ['百万级项目'],
      certifications: ['DAMA']
    },
    template: {
      responsibilities: [
        '独立完成交付中小型项目的数据治理、数据类咨询和实施项目工作',
        '与客户密切沟通，积极响应客户需求，建立客户信任',
        '配合项目经理、团队成员按期完成项目交付',
        '设计数据治理框架和实施方案',
        '建立数据管理标准和规范'
      ],
      requirements: [
        '至少3年以上的数据治理、数据中台或相关领域的工作经验',
        '2个以上百万级数据项目经验，有AI相关产品经验',
        '熟悉数据治理框架，如DAMA或ISO数据管理标准',
        '出色的沟通和人际交往能力，能够与所有级别的团队成员合作',
        '熟悉数据隐私和安全法规',
        '熟悉数据中台、数字化转型咨询和实施经验',
        '可出差、可加班，可以快速适应新的业务方向和项目'
      ],
      highlights: [
        '具备四大或咨询行业经验优先',
        '持有数据治理专业认证优先',
        '有能源行业、制造行业、金融行业经验优先',
        '熟悉数据仓库、数据分析、数据集成和数据质量工具'
      ],
      keywords: ['数据治理', '数据中台', 'DAMA', '数据分析', '数据仓库', '央国企', '百万级项目']
    }
  },
  
  // PMO顾问
  {
    id: 'consulting_pmo_advisor',
    name: 'PMO顾问模板',
    industry: '咨询/IT服务',
    position: 'PMO顾问',
    level: 'mid',
    description: '适用于项目管理办公室顾问岗位，支持ERP、SAP等大型系统实施',
    matchCriteria: {
      keywords: ['PMO', '项目管理', 'PMP', 'ERP', 'SAP', '实施', '交付'],
      skills: ['项目管理', 'PMP', 'ERP', 'SAP', '实施交付', '风险管理', '质量管理'],
      clientTypes: ['央国企'],
      preferredIndustries: ['能源', '石油/石化'],
      projectScale: ['集团级项目', '大型项目'],
      certifications: ['PMP', '高级项目经理']
    },
    template: {
      responsibilities: [
        '制定并完善项目管理制度、流程及模板，包括项目计划管理、质量管理、风险管理、变更管理等核心环节',
        '主导PMO日常工作，监控项目进度、成本、质量及风险，确保项目符合既定目标与合规要求',
        '协助项目经理制定项目计划，明确里程碑、资源分配及关键路径，并动态跟踪调整',
        '识别项目风险，制定应对策略，定期输出风险报告，推动问题闭环解决',
        '作为项目与业务部门、外部供应商的桥梁，确保信息透明与高效沟通',
        '组织项目会议（如启动会、评审会、复盘会），推动决策落地与问题解决',
        '建立项目质量评估标准，定期开展质量检查与审计，确保交付物符合要求',
        '结合石油行业特点，提供定制化项目管理解决方案，支持ERP、SAP等大型系统实施'
      ],
      requirements: [
        '本科及以上学历，项目管理、信息技术、工程管理或相关专业优先',
        '3年以上信息化项目实施经验，至少1年PMO管理经验',
        '具备石油行业工作或咨询实施背景，熟悉ERP、咨询、集成类项目者优先',
        '有集团级大型SAP咨询项目PMO经验者优先',
        '精通项目管理全流程，包括计划、质量、风险、变更管理',
        '出色的组织协调与沟通能力，能高效对接多方利益相关者',
        '具备数据分析能力，能通过数据驱动项目决策'
      ],
      highlights: [
        '持有国家认可的高级项目经理认证或PMP认证者优先',
        '具备石油行业项目管理经验，熟悉行业特性与合规要求',
        '参与过ERP、SAP等大型系统实施项目',
        '具备跨文化项目管理经验，支持全球化项目运作'
      ],
      keywords: ['PMO', '项目管理', 'PMP', 'ERP', 'SAP', '石油', '集团级项目', '实施交付']
    }
  },
  
  // 业务顾问（中级）
  {
    id: 'consulting_business_advisor_mid',
    name: '业务顾问（中级）模板',
    industry: '咨询/IT服务',
    position: '业务顾问',
    level: 'mid',
    description: '适用于ERP业务顾问岗位，负责业务需求分析和功能设计',
    matchCriteria: {
      keywords: ['业务顾问', 'ERP', '功能设计', '实施', '业务沟通'],
      skills: ['ERP', '业务分析', '功能设计', '需求分析', '系统测试', '实施'],
      clientTypes: ['央国企'],
      preferredIndustries: ['能源']
    },
    template: {
      responsibilities: [
        '能够根据业务需求及蓝图设计，编制功能详细设计方案',
        '与研发团队进行设计交底及业务沟通对接',
        '支持系统功能测试及实施工作',
        '了解工程项目管理或采购管理、合同管理相关业务',
        '独立与客户开展业务沟通工作'
      ],
      requirements: [
        '能够独立完成系统功能详细设计文档编制',
        '能够独立开展系统功能测试及实施工作',
        '能够独立与内部研发进行设计交底及对接',
        '能够独立与客户开展业务沟通工作',
        '具有5年以上工作经验，思维逻辑清晰，协作能力强，沟通表达能力强'
      ],
      highlights: [
        '参与核心ERP项目实施',
        '专业的业务咨询培训',
        '与央国企客户深度合作',
        '职业发展空间广阔'
      ],
      keywords: ['业务顾问', 'ERP', '功能设计', '业务分析', '实施', '央国企']
    }
  },
  
  // 销售代表（行业销售）
  {
    id: 'sales_industry_representative',
    name: '行业销售代表模板',
    industry: '咨询/IT服务',
    position: '销售代表',
    level: 'mid',
    description: '适用于行业销售岗位，面向特定行业（如水利、水电）',
    matchCriteria: {
      keywords: ['销售', '客户', '项目', '行业'],
      skills: ['销售技巧', '客户沟通', '项目管理', '商务谈判'],
      preferredIndustries: ['水利', '水电', '电力/热力/燃气/水利'],
      workIntensity: ['可出差', '可应酬']
    },
    template: {
      responsibilities: [
        '负责与客户沟通，确保信息的准确传达',
        '跟进项目流程及进度，确保项目按时完成',
        '能够适应出差，根据工作需要适当应酬',
        '熟悉水利、水电行业，根据市场动态调整销售策略，持续提高销售业绩',
        '独立处理和解决销售过程中的问题'
      ],
      requirements: [
        '本科及以上学历，具备良好的沟通能力和团队合作精神',
        '5年以上水利、水电行业销售工作经验',
        '能够接受出差，具备良好的时间管理和项目跟进能力',
        '有适当应酬的能力，能够根据客户需求调整自己的工作方式'
      ],
      highlights: [
        '深耕行业，建立稳固客户关系',
        '丰厚的销售提成和业绩奖金',
        '完善的销售培训体系',
        '快速成长的销售职业路径'
      ],
      keywords: ['销售', '客户沟通', '项目跟进', '水利', '水电', '出差', '应酬']
    }
  },
  
  // 智能体开发工程师
  {
    id: 'tech_ai_agent_developer',
    name: '智能体开发工程师模板',
    industry: 'IT互联网',
    position: 'AI开发工程师',
    level: 'mid',
    description: '适用于大模型智能体开发岗位，面向G端和大型B端企业',
    matchCriteria: {
      keywords: ['智能体', 'AI', '大模型', 'Dify', 'Coze', 'LangChain', 'RAG'],
      skills: ['Python', 'Dify', 'Coze', 'LangChain', 'RAG', '大模型', '智能体', 'Ollama', 'vllm', 'OCR', '向量库', 'Neo4j'],
      clientTypes: ['央国企', '政府机构'],
      preferredIndustries: ['能源', '制造']
    },
    template: {
      responsibilities: [
        '大模型智能体系统研发：负责基于通用大语言模型（如 Qwen、GPT-4、Claude 等）构建具备多轮对话、工具调用、上下文记忆能力的智能体',
        '智能体能力编排与调优：设计和实现高效的 Prompt 模板、思维链（CoT）、多 Agent 协同等机制，提升智能体在垂直任务中的表现',
        '快速 Demo 验证：根据业务或产品需求，快速构建端到端可交互的智能体原型系统（支持基础交互 UI）',
        '工具调用与插件集成：支持模型调用搜索、函数执行、数据库查询、文件处理等外部工具，提升智能体执行力',
        '跨团队协作：与产品、后端、前端同事协作，推动智能体能力实际落地应用'
      ],
      requirements: [
        '有3年以上G端、大型B端企业项目经验，具备良好的客户沟通和需求分析能力',
        '熟练掌握Python 编程。熟悉至少一种大语言模型智能体开发工具或框架，如 Dify、Coze、LangChain、RAG等',
        '理解大模型原理、上下文机制、Token 预算、提示词工程等核心要素',
        '具备智能体 Agent 项目落地经验',
        '有快速 Demo 落地能力，能产出简单交互界面或配合前端完成可用展示页面',
        '满足以下技术栈3-5项：Python，langchain，langgraph，RAG技术，Ollama，vllm，LLM模型原理，微调，OCR，向量库，图数据库neo4j'
      ],
      highlights: [
        '有智能助手、AI中控、AI客服、多智能体协作等相关项目经验优先',
        '有大模型微调、RAG 检索增强、思维链优化等经验优先',
        '前沿AI技术，参与创新项目',
        '与央国企深度合作'
      ],
      keywords: ['智能体', 'AI', '大模型', 'Dify', 'Coze', 'LangChain', 'RAG', 'Python', '央国企']
    }
  },
  
  // 财务咨询高级顾问
  {
    id: 'consulting_finance_senior',
    name: '财务咨询高级顾问模板',
    industry: '咨询/IT服务',
    position: '财务咨询顾问',
    level: 'senior',
    description: '适用于财务咨询高级岗位，CPA优先，面向大中型企业',
    matchCriteria: {
      keywords: ['财务咨询', 'CPA', '投融资', '财务顾问', '尽职调查'],
      skills: ['财务分析', '投融资', '尽职调查', '估值', '商业计划书', '财务报表分析'],
      certifications: ['CPA', 'ACCA', '会计中级'],
      preferredIndustries: ['金融', '能源', '制造']
    },
    template: {
      responsibilities: [
        '带领团队完成财务咨询项目的调研、分析、设计、实施及后期评估工作',
        '提供企业财务诊断、优化方案及财务战略规划建议，帮助企业解决财务管理中的复杂问题',
        '有效维护客户关系，定期与客户沟通项目进展，确保客户满意度',
        '协助销售团队进行项目收款、促单等工作，提升项目成功率',
        '负责境内外项目投资的财务顾问工作，包括尽职调查、估值咨询及交易管理',
        '协助企业进行融资方案设计，编制商业计划书，参与路演及与资金方的沟通工作',
        '指导助理顾问及团队成员开展特定行业及资本市场研究，提升团队专业能力',
        '撰写项目报告、财务分析报告及投资建议书等，确保报告内容的准确性和专业性'
      ],
      requirements: [
        '本科及以上学历，会计、财务、金融、经济等相关专业毕业',
        '拥有CPA、ACCA等财务相关证书者优先考虑',
        '至少5年以上财务咨询、会计师事务所或企业财务管理相关工作经验',
        '有成功带领团队完成大型财务咨询项目的经验者优先考虑',
        '具备扎实的财务理论基础和丰富的实践经验，熟悉企业财务管理流程及政策法规',
        '精通财务报表分析、财务预测及风险管理等技能',
        '具备较强的逻辑思维能力和数据分析能力，能够独立完成复杂的财务分析报告',
        '具备良好的沟通能力和团队协作精神，能够适应高强度的工作压力',
        '愿意接受境内外出差，能够适应不同地区的工作环境'
      ],
      highlights: [
        '根据应聘者的能力和经验，提供具有竞争力的薪资待遇',
        '提供广阔的职业发展空间和晋升机会，支持员工参加各类培训和进修课程',
        '包括五险一金、带薪年假、节日福利、团队建设活动等完善的福利体系',
        '参与大型财务咨询项目，积累丰富经验'
      ],
      keywords: ['财务咨询', 'CPA', '投融资', '尽职调查', '估值', '财务管理', '高级顾问']
    }
  },
  
  // 电力行业资产及设备管理实施经理
  {
    id: 'energy_asset_equipment_manager',
    name: '电力行业资产设备管理实施经理模板',
    industry: '能源/电力',
    position: '实施经理',
    level: 'manager',
    description: '适用于电力行业ERP资产设备管理实施岗位，面向发电企业',
    matchCriteria: {
      keywords: ['资产', '设备管理', '电力', 'ERP', '实施', '竣工决算', 'KKS编码'],
      skills: ['ERP', '资产设备管理', '固定资产', '竣工决算', 'KKS编码', '维修工单', 'SAP', 'ORACLE', '用友', '金蝶', '浪潮'],
      clientTypes: ['央国企'],
      preferredIndustries: ['电力/热力/燃气/水利'],
      projectScale: ['大型项目', '集团级项目']
    },
    template: {
      responsibilities: [
        '负责资产及设备管理产品规划设计，重点包括固定资产竣工决算、资产盘点及实物管理',
        '对电力行业设备全生命周期管理有丰富经验，包括功能位置、设备KKS编码、维修项目、维修工单、两票等',
        '与财务、工程成本、物资进行集成设计',
        '对资产及设备管理模块进行3-5年长期规划及1年以内产品发展详细规划',
        '负责编写资产及设备管理模块产品需求设计文档，进行产品功能设计',
        '与客户、项目经理、技术、测试等角色进行明确有效的需求沟通并做出有效输出',
        '设计测试用例，配合完成产品的测试、功能验证、产品演示及发版等工作',
        '参与模块和流程管理相关的用户培训、手册编写，宣导等工作',
        '支持重大项目的实施交付工作'
      ],
      requirements: [
        '计算机、信息系统或其他相关专业本科以上学历',
        '有大型咨询公司售前或实施项目经验，具有丰富的资产及设备管理全过程规划设计经验',
        '熟悉发电行业固定资产及设备管理要求优先',
        '具有5年以上资产及设备管理实施或研发项目经验，至少做过2个以上大型集团公司项目',
        '具备SAP、ORACLE、用友、金蝶、浪潮相关资产及设备管理模块知识及实施经验为佳',
        '熟悉资产及设备管理模块的核心业务流程及理论知识，掌握软件需求分析技术和管理方法',
        '在ERP软件研发企业工作过的优先',
        '可以独立完成与业务的沟通，并转化为符合业务的功能清单、需求文档',
        '善于发现问题、分析问题并跟进解决问题并能独立完成产品功能设计',
        '熟练使用Axure、思维导图等流程设计工具及Office软件（PPT、Word、Excel）'
      ],
      highlights: [
        '良好的沟通能力和团队合作精神',
        '负责任的工作态度和高度的敬业精神',
        '参与电力行业核心系统建设',
        '职业发展前景广阔'
      ],
      keywords: ['资产设备管理', '电力', 'ERP', '实施', '竣工决算', 'KKS编码', 'SAP', 'ORACLE']
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

/**
 * 智能模板匹配算法
 * 根据用户填写的岗位信息，智能推荐最匹配的模板
 */
export const smartMatchTemplates = (jobInfo: {
  position: string;
  industry: string;
  skills: string[];
  clientType?: string[];
  preferredIndustry?: string[];
  projectScale?: string;
  certifications?: string[];
  workIntensity?: string[];
}): JDTemplate[] => {
  const scoredTemplates = jdTemplates.map(template => {
    let score = 0;
    const reasons: string[] = [];
    
    // 1. 行业匹配（权重：30）
    if (template.industry === jobInfo.industry) {
      score += 30;
      reasons.push('行业匹配');
    }
    
    // 2. 职位关键词匹配（权重：25）
    if (template.matchCriteria?.keywords) {
      const positionLower = jobInfo.position.toLowerCase();
      const matchedKeywords = template.matchCriteria.keywords.filter(keyword => 
        positionLower.includes(keyword.toLowerCase())
      );
      if (matchedKeywords.length > 0) {
        score += 25 * (matchedKeywords.length / template.matchCriteria.keywords.length);
        reasons.push(`职位关键词匹配(${matchedKeywords.length}个)`);
      }
    }
    
    // 3. 技能匹配（权重：20）
    if (template.matchCriteria?.skills && jobInfo.skills.length > 0) {
      const matchedSkills = template.matchCriteria.skills.filter(skill =>
        jobInfo.skills.some(userSkill => 
          userSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(userSkill.toLowerCase())
        )
      );
      if (matchedSkills.length > 0) {
        score += 20 * (matchedSkills.length / template.matchCriteria.skills.length);
        reasons.push(`技能匹配(${matchedSkills.length}个)`);
      }
    }
    
    // 4. 客户类型匹配（权重：15）
    if (template.matchCriteria?.clientTypes && jobInfo.clientType && jobInfo.clientType.length > 0) {
      const matchedClientTypes = template.matchCriteria.clientTypes.filter(clientType =>
        jobInfo.clientType!.some(userType => userType === clientType)
      );
      if (matchedClientTypes.length > 0) {
        score += 15;
        reasons.push(`客户类型匹配`);
      }
    }
    
    // 5. 优先行业匹配（权重：10）
    if (template.matchCriteria?.preferredIndustries && jobInfo.preferredIndustry && jobInfo.preferredIndustry.length > 0) {
      const matchedIndustries = template.matchCriteria.preferredIndustries.filter(industry =>
        jobInfo.preferredIndustry!.some(userIndustry => userIndustry === industry)
      );
      if (matchedIndustries.length > 0) {
        score += 10;
        reasons.push(`优先行业匹配`);
      }
    }
    
    // 6. 项目规模匹配（权重：5）
    if (template.matchCriteria?.projectScale && jobInfo.projectScale) {
      const matchedScale = template.matchCriteria.projectScale.some(scale =>
        jobInfo.projectScale!.includes(scale) || scale.includes(jobInfo.projectScale!)
      );
      if (matchedScale) {
        score += 5;
        reasons.push(`项目规模匹配`);
      }
    }
    
    // 7. 认证匹配（权重：5）
    if (template.matchCriteria?.certifications && jobInfo.certifications && jobInfo.certifications.length > 0) {
      const matchedCerts = template.matchCriteria.certifications.filter(cert =>
        jobInfo.certifications!.some(userCert => userCert === cert)
      );
      if (matchedCerts.length > 0) {
        score += 5;
        reasons.push(`认证匹配`);
      }
    }
    
    return {
      template,
      score,
      reasons
    };
  });
  
  // 按分数排序，返回前10个最匹配的模板
  return scoredTemplates
    .filter(item => item.score > 0) // 只返回有匹配度的模板
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map(item => item.template);
};
