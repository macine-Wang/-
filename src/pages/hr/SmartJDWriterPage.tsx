/**
 * 智能JD写作模块
 * 集成8大核心功能的完整JD生成解决方案
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { deepseekApi } from '@/services/deepseekApi';
import { 
  PencilSquareIcon,
  SparklesIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  CloudArrowUpIcon,
  ShareIcon,
  CogIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  ChevronDownIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { getIndustries, searchPositions } from '@/data/jobCategories';
import { getAllCityNames, searchCities } from '@/data/cities';

// 数据接口定义
interface JobInfo {
  position: string;
  location: string[];  // 支持多选
  skills: string[];
  education: string[];  // 支持多选
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
  // 新增专业字段
  preferredIndustry?: string[];  // 优先行业经验
  projectExperience?: string;    // 项目经验要求
  projectScale?: string;          // 项目规模（如：百万级项目经验）
  certifications?: string[];      // 专业认证（PMP、DAMA等）
  additionalRequirements?: string; // 加分项/优先条件
  workIntensity?: string[];       // 工作强度（出差、加班等）
  clientType?: string[];          // 客户类型（央国企、外企等）
}

interface GeneratedJD {
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
}

import { jdTemplates, JDTemplate, smartMatchTemplates } from '@/data/jdTemplates';

export const SmartJDWriterPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'info' | 'template' | 'generate' | 'optimize' | 'export'>('info');
  const [jobInfo, setJobInfo] = useState<JobInfo>({
    position: '',
    location: [],
    skills: [],
    education: [],
    experience: '',
    industry: '',
    companySize: '',
    recruitCount: 1,
    companyKeywords: [],
    preferredIndustry: [],
    certifications: [],
    workIntensity: [],
    clientType: []
  });
  const [generatedJD, setGeneratedJD] = useState<GeneratedJD | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<JDTemplate | null>(null);
  const [style, setStyle] = useState<'formal' | 'casual' | 'innovative' | 'international'>('formal');
  const [version, setVersion] = useState<'long' | 'short' | 'brief'>('long');
  const [language, setLanguage] = useState<'chinese' | 'english' | 'bilingual'>('chinese');
  const [skillInput, setSkillInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [positionInput, setPositionInput] = useState('');
  const [citySearchInput, setCitySearchInput] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showPositionDropdown, setShowPositionDropdown] = useState(false);
  const [showSkillTags, setShowSkillTags] = useState(false); // 技能标签展开状态
  const [showCultureTags, setShowCultureTags] = useState(false); // 公司文化标签展开状态
  const [showBenefitsTags, setShowBenefitsTags] = useState(false); // 薪酬福利标签展开状态
  const [hoveredSkillCategory, setHoveredSkillCategory] = useState<string | null>(null); // 当前悬浮的技能分类
  const [hoveredCultureCategory, setHoveredCultureCategory] = useState<string | null>(null); // 当前悬浮的文化分类
  const [hoveredBenefitsCategory, setHoveredBenefitsCategory] = useState<string | null>(null); // 当前悬浮的福利分类
  const [benefitsInput, setBenefitsInput] = useState(''); // 福利手动输入

  // 使用外部模板库
  const templates = jdTemplates;

  // 行业选项
  const industries = getIndustries();

  // 筛选职位建议
  const positionSuggestions = positionInput.trim() 
    ? searchPositions(positionInput).map(p => ({
        text: p.position,
        type: '职位',
        category: `${p.industry} > ${p.category}`
      })).slice(0, 10)
    : [];

  // 筛选城市建议
  const citySuggestions = citySearchInput.trim()
    ? searchCities(citySearchInput).map(city => city.name).slice(0, 10)
    : getAllCityNames().slice(0, 20);

  // 公司规模选项
  const companySizes = [
    '初创公司(1-50人)', '小型企业(51-200人)', '中型企业(201-1000人)', 
    '大型企业(1001-5000人)', '超大型企业(5000人以上)'
  ];

  // 常用技能库（按分类，更完善）
  const commonSkills = {
    '编程语言': ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB'],
    '前端技术': ['React', 'Vue.js', 'Angular', 'HTML/CSS', 'Next.js', 'Nuxt.js', 'Webpack', 'Vite', 'Tailwind CSS', 'Sass/Less', 'Bootstrap', 'Ant Design', 'Element UI'],
    '后端技术': ['Node.js', 'Spring Boot', 'Django', 'Flask', 'Express', 'FastAPI', 'Laravel', '.NET', 'GraphQL', 'RESTful API', 'gRPC', '微服务架构'],
    '数据库': ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Oracle', 'SQL Server', 'Elasticsearch', 'ClickHouse', 'HBase', 'Cassandra', 'Neo4j', 'InfluxDB'],
    '云服务/运维': ['AWS', 'Azure', '阿里云', '腾讯云', '华为云', 'Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'GitLab CI', 'Terraform', 'Ansible'],
    'AI/数据': ['机器学习', '深度学习', '数据分析', '数据挖掘', 'TensorFlow', 'PyTorch', 'NLP', '计算机视觉', '推荐系统', '数据可视化', 'Hadoop', 'Spark'],
    '测试': ['自动化测试', '性能测试', 'Selenium', 'Jest', 'Pytest', '单元测试', '接口测试', '压力测试', '安全测试', '测试框架'],
    '设计/产品': ['UI设计', 'UX设计', 'Figma', 'Sketch', 'Adobe XD', '产品设计', '用户体验', '交互设计', '原型设计', 'Axure', 'Principle'],
    '项目管理': ['项目管理', '敏捷开发', 'Scrum', '团队协作', '需求分析', '风险管理', 'JIRA', 'Confluence', 'Trello', 'Asana', '项目管理PMP'],
    '营销推广': ['数字营销', 'SEO', 'SEM', '内容营销', '社交媒体运营', '用户增长', '数据分析', '广告投放', '品牌营销', '社群运营', '直播运营'],
    '商务/销售': ['客户关系管理', '商务谈判', '市场拓展', '渠道管理', '销售技巧', 'CRM系统', '客户维护', '大客户管理', 'BD拓展', '商务合作'],
    '财务/法务': ['财务分析', '成本控制', '预算管理', '税务筹划', '合同管理', '法律合规', '内控审计', '会计', '税务', '财务建模'],
    '人力资源': ['招聘', '培训', '绩效管理', '薪酬设计', '员工关系', '组织发展', '人才发展', 'HRBP', '人才测评', '劳动关系', 'HR数据分析'],
    '通用技能': ['沟通能力', '团队协作', '问题解决', '学习能力', '创新思维', '执行力', '时间管理', '抗压能力', '领导力', '分析能力', '逻辑思维']
  };

  // 公司文化关键词库（更完善）
  const companyCultureKeywords = {
    '工作方式': ['扁平化管理', '弹性工作', '远程办公', '结果导向', '自主驱动', '敏捷高效', 'OKR管理', '自驱文化', '灵活办公'],
    '团队氛围': ['开放包容', '团队协作', '互助成长', '氛围轻松', '年轻活力', '平等尊重', '互帮互助', '积极向上', '和谐融洽'],
    '发展机会': ['快速成长', '晋升通道', '技能提升', '职业发展', '培训学习', '内部转岗', '导师制', '职业规划', '学习型组织', '海外机会'],
    '企业文化': ['技术创新', '创业精神', '持续改进', '用户至上', '数据驱动', '追求卓越', '开放创新', '拥抱变化', '诚信务实', '社会责任'],
    '福利待遇': ['五险一金', '带薪年假', '补充医疗', '股票期权', '年终奖金', '节日福利', '商业保险', '定期体检', '餐补', '交通补贴', '住房补贴', '股权激励'],
    '工作环境': ['办公环境好', '免费下午茶', '健身房', '团建活动', '年会旅游', '交通便利', '免费三餐', '咖啡厅', '图书馆', '游戏室', '母婴室', '停车位']
  };

  // 薪酬福利关键词库
  const benefitsKeywords = {
    '五险一金': ['五险一金', '六险一金', '七险一金', '五险', '社保', '公积金'],
    '补充保障': ['补充医疗保险', '商业保险', '意外险', '重疾险', '定期体检', '体检套餐', '子女医疗'],
    '假期福利': ['带薪年假', '带薪病假', '带薪事假', '产假', '陪产假', '育儿假', '调休', '弹性休假'],
    '薪资福利': ['年终奖金', '绩效奖金', '项目奖金', '股票期权', '股权激励', '13薪', '14薪', '季度奖', '半年奖'],
    '补贴福利': ['餐补', '交通补贴', '住房补贴', '通讯补贴', '高温补贴', '取暖补贴', '差旅补贴', '油补', '加班补贴'],
    '培训发展': ['培训学习', '技能培训', '外部培训', '学历提升', '读书会', '技术分享', '内部分享', '在线课程'],
    '工作环境': ['免费三餐', '免费下午茶', '咖啡厅', '健身房', '图书馆', '游戏室', '母婴室', '停车位', '班车', '员工宿舍'],
    '团建活动': ['团建活动', '年会旅游', '部门聚餐', '节日福利', '生日福利', '员工关怀', '健康活动', '运动俱乐部'],
    '其他福利': ['弹性工作', '远程办公', '不打卡', '周末双休', '工作氛围好', '领导nice', '同事友善', '晋升机会多']
  };

  // 学历要求选项
  const educationLevels = [
    '不限', '高中/中专', '大专', '本科', '硕士', '博士'
  ];

  // 优先行业选项（基于真实JD样本）
  const preferredIndustries = [
    '石油/石化', '电力/热力/燃气/水利', '能源', '制造', '金融', 
    '央国企', '外企', '互联网', '咨询', '房地产', '医疗', '教育'
  ];

  // 专业认证选项
  const professionalCertifications = [
    'PMP', '高级项目经理', 'DAMA', 'PRINCE2', 'ITIL', 'CISSP', 
    'CPA', 'CFA', 'FRM', 'SAP认证', 'Oracle认证', 'AWS认证', 
    'Azure认证', '项目管理专业资质认证', '信息系统项目管理师'
  ];

  // 工作强度选项
  const workIntensityOptions = [
    '可出差', '可加班', '可应酬', '弹性工作', '远程办公', '不打卡'
  ];

  // 客户类型选项
  const clientTypes = [
    '央国企', '外企', '民企', '事业单位', '政府机构', '金融机构'
  ];

  // 项目规模选项
  const projectScales = [
    '不限', '小型项目（10万以下）', '中型项目（10-100万）', 
    '大型项目（100-500万）', '超大型项目（500万以上）', 
    '百万级项目', '千万级项目', '集团级项目'
  ];

  // 学历等级映射（用于智能显示）
  const educationLevelMap: { [key: string]: number } = {
    '不限': 0,
    '高中/中专': 1,
    '大专': 2,
    '本科': 3,
    '硕士': 4,
    '博士': 5
  };

  // 获取学历要求的智能显示文本
  const getEducationDisplayText = (selected: string[]): string => {
    if (selected.length === 0 || selected.includes('不限')) {
      return '不限';
    }
    
    // 如果只选了一个，直接返回
    if (selected.length === 1) {
      return selected[0];
    }

    // 按等级排序
    const sorted = selected
      .filter(e => e !== '不限')
      .map(e => ({ text: e, level: educationLevelMap[e] }))
      .sort((a, b) => a.level - b.level);

    if (sorted.length === 0) return '不限';

    // 检查是否连续
    const levels = sorted.map(s => s.level);
    let isContinuous = true;
    for (let i = 1; i < levels.length; i++) {
      if (levels[i] !== levels[i - 1] + 1) {
        isContinuous = false;
        break;
      }
    }

    // 如果连续，显示"X及以上"
    if (isContinuous) {
      const lowest = sorted[0].text;
      return `${lowest}及以上`;
    }

    // 如果不连续，显示所有选中的学历，用逗号分隔
    return selected.join('、');
  };

  // 处理学历选择
  const handleEducationToggle = (education: string) => {
    setJobInfo(prev => {
      const current = prev.education;
      if (education === '不限') {
        // 选择"不限"时，清空其他选择
        return { ...prev, education: ['不限'] };
      }
      
      // 移除"不限"选项
      const filtered = current.filter(e => e !== '不限');
      
      // 切换选择
      if (filtered.includes(education)) {
        return { ...prev, education: filtered.filter(e => e !== education) };
      } else {
        return { ...prev, education: [...filtered, education] };
      }
    });
  };

  // 处理城市选择
  const handleCityToggle = (cityName: string) => {
    setJobInfo(prev => {
      const current = prev.location;
      if (current.includes(cityName)) {
        return { ...prev, location: current.filter(c => c !== cityName) };
      } else {
        return { ...prev, location: [...current, cityName] };
      }
    });
  };

  // 移除城市
  const handleCityRemove = (cityName: string) => {
    setJobInfo(prev => ({
      ...prev,
      location: prev.location.filter(c => c !== cityName)
    }));
  };

  // 选择职位建议
  const handlePositionSelect = (position: string) => {
    setJobInfo(prev => ({ ...prev, position }));
    setPositionInput('');
    setShowPositionDropdown(false);
  };

  // 工作经验选项
  const experienceLevels = [
    '不限', '应届生', '1-3年', '3-5年', '5-10年', '10年以上'
  ];

  // 添加技能（手动输入）
  const handleSkillAdd = () => {
    const skill = skillInput.trim();
    if (skill && !jobInfo.skills.includes(skill)) {
      setJobInfo(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
      setSkillInput('');
    }
  };

  // 切换技能标签选择
  const handleSkillToggle = (skill: string) => {
    setJobInfo(prev => {
      if (prev.skills.includes(skill)) {
        return { ...prev, skills: prev.skills.filter(s => s !== skill) };
      } else {
        return { ...prev, skills: [...prev.skills, skill] };
      }
    });
  };

  // 移除技能
  const handleSkillRemove = (skill: string) => {
    setJobInfo(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  // 添加公司关键词（手动输入）
  const handleKeywordAdd = () => {
    const keyword = keywordInput.trim();
    if (keyword && !jobInfo.companyKeywords.includes(keyword)) {
      setJobInfo(prev => ({
        ...prev,
        companyKeywords: [...prev.companyKeywords, keyword]
      }));
      setKeywordInput('');
    }
  };

  // 切换公司文化关键词标签选择
  const handleCultureKeywordToggle = (keyword: string) => {
    setJobInfo(prev => {
      if (prev.companyKeywords.includes(keyword)) {
        return { ...prev, companyKeywords: prev.companyKeywords.filter(k => k !== keyword) };
      } else {
        return { ...prev, companyKeywords: [...prev.companyKeywords, keyword] };
      }
    });
  };

  // 移除关键词
  const handleKeywordRemove = (keyword: string) => {
    setJobInfo(prev => ({
      ...prev,
      companyKeywords: prev.companyKeywords.filter(k => k !== keyword)
    }));
  };

  // 添加福利（手动输入）
  const handleBenefitsAdd = () => {
    const benefit = benefitsInput.trim();
    if (benefit && !jobInfo.benefits?.includes(benefit)) {
      setJobInfo(prev => ({
        ...prev,
        benefits: [...(prev.benefits || []), benefit]
      }));
      setBenefitsInput('');
    }
  };

  // 切换福利标签选择
  const handleBenefitsToggle = (benefit: string) => {
    setJobInfo(prev => {
      const current = prev.benefits || [];
      if (current.includes(benefit)) {
        return { ...prev, benefits: current.filter(b => b !== benefit) };
      } else {
        return { ...prev, benefits: [...current, benefit] };
      }
    });
  };

  // 移除福利
  const handleBenefitsRemove = (benefit: string) => {
    setJobInfo(prev => ({
      ...prev,
      benefits: (prev.benefits || []).filter(b => b !== benefit)
    }));
  };

  // 处理优先行业选择
  const handlePreferredIndustryToggle = (industry: string) => {
    setJobInfo(prev => {
      const current = prev.preferredIndustry || [];
      if (current.includes(industry)) {
        return { ...prev, preferredIndustry: current.filter(i => i !== industry) };
      } else {
        return { ...prev, preferredIndustry: [...current, industry] };
      }
    });
  };

  // 处理专业认证选择
  const handleCertificationToggle = (cert: string) => {
    setJobInfo(prev => {
      const current = prev.certifications || [];
      if (current.includes(cert)) {
        return { ...prev, certifications: current.filter(c => c !== cert) };
      } else {
        return { ...prev, certifications: [...current, cert] };
      }
    });
  };

  // 处理工作强度选择
  const handleWorkIntensityToggle = (intensity: string) => {
    setJobInfo(prev => {
      const current = prev.workIntensity || [];
      if (current.includes(intensity)) {
        return { ...prev, workIntensity: current.filter(i => i !== intensity) };
      } else {
        return { ...prev, workIntensity: [...current, intensity] };
      }
    });
  };

  // 处理客户类型选择
  const handleClientTypeToggle = (type: string) => {
    setJobInfo(prev => {
      const current = prev.clientType || [];
      if (current.includes(type)) {
        return { ...prev, clientType: current.filter(t => t !== type) };
      } else {
        return { ...prev, clientType: [...current, type] };
      }
    });
  };

  // 生成JD
  const generateJD = async () => {
    setIsGenerating(true);
    setCurrentStep('generate');

    try {
      // 转换数据格式以适配API
      const apiJobInfo = {
        ...jobInfo,
        location: jobInfo.location.join('、'), // 将城市数组转为字符串
        education: getEducationDisplayText(jobInfo.education), // 使用智能显示文本
        preferredIndustry: jobInfo.preferredIndustry?.join('、') || '', // 优先行业
        certifications: jobInfo.certifications?.join('、') || '', // 专业认证
        workIntensity: jobInfo.workIntensity?.join('、') || '', // 工作强度
        clientType: jobInfo.clientType?.join('、') || '', // 客户类型
        department: '', // 已移除字段，传空字符串以保持兼容
        reportTo: '' // 已移除字段，传空字符串以保持兼容
      };

      const result = await deepseekApi.generateJobDescription({
        ...apiJobInfo,
        style,
        version,
        language
      });

      setGeneratedJD(result);
      setCurrentStep('optimize');
    } catch (error) {
      console.error('JD生成失败:', error);
      // 显示错误信息给用户
    } finally {
      setIsGenerating(false);
    }
  };

  // 优化JD
  const optimizeJD = async (optimizationType: 'seo' | 'style' | 'compliance' | 'keywords') => {
    if (!generatedJD) return;

    try {
      const result = await deepseekApi.optimizeJobDescription(
        generatedJD.jobDescription,
        optimizationType
      );

      setGeneratedJD(prev => ({
        ...prev!,
        jobDescription: result.optimizedJD
      }));
    } catch (error) {
      console.error('JD优化失败:', error);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="container max-w-7xl py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl">
              <PencilSquareIcon className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">智能JD写作助手</h1>
              <p className="text-gray-600 mt-1">AI驱动的职位描述生成平台，8大核心模块助力高效招聘</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Link
              to="/hr/batch-jd-generator"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <CloudArrowUpIcon className="w-5 h-5" />
              <span>批量生成</span>
            </Link>
            <Link
              to="/hr"
              className="px-6 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
            >
              返回HR中心
            </Link>
          </div>
        </div>

        {/* 功能导航 */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            {[
              { id: 'info', label: '信息采集', icon: DocumentTextIcon },
              { id: 'template', label: '模板选择', icon: SparklesIcon },
              { id: 'generate', label: 'AI生成', icon: PencilSquareIcon },
              { id: 'optimize', label: '优化定制', icon: CogIcon },
              { id: 'export', label: '导出发布', icon: ShareIcon }
            ].map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = ['info', 'template', 'generate', 'optimize'].indexOf(currentStep) > 
                                 ['info', 'template', 'generate', 'optimize'].indexOf(step.id);
              
              return (
                <React.Fragment key={step.id}>
                  <button
                    onClick={() => setCurrentStep(step.id as any)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-md font-medium transition-colors ${
                      isActive
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : isCompleted
                        ? 'text-green-600 hover:bg-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{step.label}</span>
                    {isCompleted && <CheckCircleIcon className="w-4 h-4 text-green-600" />}
                  </button>
                  {index < 4 && <div className="w-8 h-0.5 bg-gray-300"></div>}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* 内容区域 */}
        <div className="max-w-6xl mx-auto">
          {currentStep === 'info' && (
            <JobInfoCollection 
              jobInfo={jobInfo}
              setJobInfo={setJobInfo}
              skillInput={skillInput}
              setSkillInput={setSkillInput}
              keywordInput={keywordInput}
              setKeywordInput={setKeywordInput}
              positionInput={positionInput}
              setPositionInput={setPositionInput}
              citySearchInput={citySearchInput}
              setCitySearchInput={setCitySearchInput}
              showCityDropdown={showCityDropdown}
              setShowCityDropdown={setShowCityDropdown}
              showPositionDropdown={showPositionDropdown}
              setShowPositionDropdown={setShowPositionDropdown}
              showSkillTags={showSkillTags}
              setShowSkillTags={setShowSkillTags}
              showCultureTags={showCultureTags}
              setShowCultureTags={setShowCultureTags}
              hoveredSkillCategory={hoveredSkillCategory}
              setHoveredSkillCategory={setHoveredSkillCategory}
              hoveredCultureCategory={hoveredCultureCategory}
              setHoveredCultureCategory={setHoveredCultureCategory}
              showBenefitsTags={showBenefitsTags}
              setShowBenefitsTags={setShowBenefitsTags}
              hoveredBenefitsCategory={hoveredBenefitsCategory}
              setHoveredBenefitsCategory={setHoveredBenefitsCategory}
              benefitsInput={benefitsInput}
              setBenefitsInput={setBenefitsInput}
              handleBenefitsAdd={handleBenefitsAdd}
              handleBenefitsToggle={handleBenefitsToggle}
              handleBenefitsRemove={handleBenefitsRemove}
              benefitsKeywords={benefitsKeywords}
              handleSkillAdd={handleSkillAdd}
              handleSkillRemove={handleSkillRemove}
              handleSkillToggle={handleSkillToggle}
              handleKeywordAdd={handleKeywordAdd}
              handleKeywordRemove={handleKeywordRemove}
              handleCultureKeywordToggle={handleCultureKeywordToggle}
              commonSkills={commonSkills}
              companyCultureKeywords={companyCultureKeywords}
              handleEducationToggle={handleEducationToggle}
              handleCityToggle={handleCityToggle}
              handleCityRemove={handleCityRemove}
              handlePositionSelect={handlePositionSelect}
              getEducationDisplayText={getEducationDisplayText}
              industries={industries}
              companySizes={companySizes}
              educationLevels={educationLevels}
              experienceLevels={experienceLevels}
              positionSuggestions={positionSuggestions}
              citySuggestions={citySuggestions}
              preferredIndustries={preferredIndustries}
              professionalCertifications={professionalCertifications}
              workIntensityOptions={workIntensityOptions}
              clientTypes={clientTypes}
              projectScales={projectScales}
              handlePreferredIndustryToggle={handlePreferredIndustryToggle}
              handleCertificationToggle={handleCertificationToggle}
              handleWorkIntensityToggle={handleWorkIntensityToggle}
              handleClientTypeToggle={handleClientTypeToggle}
              onNext={() => setCurrentStep('template')}
            />
          )}

          {currentStep === 'template' && (
            <TemplateSelection
              templates={templates}
              selectedTemplate={selectedTemplate}
              setSelectedTemplate={setSelectedTemplate}
              jobInfo={jobInfo}
              onNext={() => setCurrentStep('generate')}
              onBack={() => setCurrentStep('info')}
            />
          )}

          {currentStep === 'generate' && (
            <JDGeneration
              isGenerating={isGenerating}
              style={style}
              setStyle={setStyle}
              version={version}
              setVersion={setVersion}
              language={language}
              setLanguage={setLanguage}
              onGenerate={generateJD}
              onBack={() => setCurrentStep('template')}
            />
          )}

          {currentStep === 'optimize' && generatedJD && (
            <JDOptimization
              generatedJD={generatedJD}
              onOptimize={optimizeJD}
              onNext={() => setCurrentStep('export')}
              onBack={() => setCurrentStep('generate')}
            />
          )}

          {currentStep === 'export' && generatedJD && (
            <JDExport
              generatedJD={generatedJD}
              jobInfo={jobInfo}
              onBack={() => setCurrentStep('optimize')}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// 1️⃣ 岗位信息采集组件
const JobInfoCollection: React.FC<{
  jobInfo: JobInfo;
  setJobInfo: React.Dispatch<React.SetStateAction<JobInfo>>;
  skillInput: string;
  setSkillInput: React.Dispatch<React.SetStateAction<string>>;
  keywordInput: string;
  setKeywordInput: React.Dispatch<React.SetStateAction<string>>;
  positionInput: string;
  setPositionInput: React.Dispatch<React.SetStateAction<string>>;
  citySearchInput: string;
  setCitySearchInput: React.Dispatch<React.SetStateAction<string>>;
  showCityDropdown: boolean;
  setShowCityDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  showPositionDropdown: boolean;
  setShowPositionDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  showSkillTags: boolean;
  setShowSkillTags: React.Dispatch<React.SetStateAction<boolean>>;
  showCultureTags: boolean;
  setShowCultureTags: React.Dispatch<React.SetStateAction<boolean>>;
  hoveredSkillCategory: string | null;
  setHoveredSkillCategory: React.Dispatch<React.SetStateAction<string | null>>;
  hoveredCultureCategory: string | null;
  setHoveredCultureCategory: React.Dispatch<React.SetStateAction<string | null>>;
  showBenefitsTags: boolean;
  setShowBenefitsTags: React.Dispatch<React.SetStateAction<boolean>>;
  hoveredBenefitsCategory: string | null;
  setHoveredBenefitsCategory: React.Dispatch<React.SetStateAction<string | null>>;
  benefitsInput: string;
  setBenefitsInput: React.Dispatch<React.SetStateAction<string>>;
  handleBenefitsAdd: () => void;
  handleBenefitsToggle: (benefit: string) => void;
  handleBenefitsRemove: (benefit: string) => void;
  benefitsKeywords: { [category: string]: string[] };
  handleSkillAdd: () => void;
  handleSkillRemove: (skill: string) => void;
  handleSkillToggle: (skill: string) => void;
  handleKeywordAdd: () => void;
  handleKeywordRemove: (keyword: string) => void;
  handleCultureKeywordToggle: (keyword: string) => void;
  commonSkills: { [category: string]: string[] };
  companyCultureKeywords: { [category: string]: string[] };
  handleEducationToggle: (education: string) => void;
  handleCityToggle: (cityName: string) => void;
  handleCityRemove: (cityName: string) => void;
  handlePositionSelect: (position: string) => void;
  getEducationDisplayText: (selected: string[]) => string;
  industries: string[];
  companySizes: string[];
  educationLevels: string[];
  experienceLevels: string[];
  positionSuggestions: Array<{ text: string; type: string; category: string }>;
  citySuggestions: string[];
  preferredIndustries: string[];
  professionalCertifications: string[];
  workIntensityOptions: string[];
  clientTypes: string[];
  projectScales: string[];
  handlePreferredIndustryToggle: (industry: string) => void;
  handleCertificationToggle: (cert: string) => void;
  handleWorkIntensityToggle: (intensity: string) => void;
  handleClientTypeToggle: (type: string) => void;
  onNext: () => void;
}> = ({
  jobInfo, setJobInfo, skillInput, setSkillInput, keywordInput, setKeywordInput,
  positionInput, setPositionInput, citySearchInput, setCitySearchInput,
  showCityDropdown, setShowCityDropdown, showPositionDropdown, setShowPositionDropdown,
  showSkillTags, setShowSkillTags, showCultureTags, setShowCultureTags,
  hoveredSkillCategory, setHoveredSkillCategory,
  hoveredCultureCategory, setHoveredCultureCategory,
  showBenefitsTags, setShowBenefitsTags,
  hoveredBenefitsCategory, setHoveredBenefitsCategory,
  benefitsInput, setBenefitsInput,
  handleBenefitsAdd, handleBenefitsToggle, handleBenefitsRemove,
  benefitsKeywords,
  handleSkillAdd, handleSkillRemove, handleSkillToggle,
  handleKeywordAdd, handleKeywordRemove, handleCultureKeywordToggle,
  commonSkills, companyCultureKeywords,
  handleEducationToggle, handleCityToggle, handleCityRemove, handlePositionSelect,
  getEducationDisplayText,
  industries, companySizes, educationLevels, experienceLevels,
  positionSuggestions, citySuggestions,
  preferredIndustries, professionalCertifications, workIntensityOptions,
  clientTypes, projectScales,
  handlePreferredIndustryToggle, handleCertificationToggle,
  handleWorkIntensityToggle, handleClientTypeToggle,
  onNext
}) => {
  // 点击外部关闭下拉菜单
  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const positionDropdownRef = useRef<HTMLDivElement>(null);
  const skillTagsRef = useRef<HTMLDivElement>(null);
  const cultureTagsRef = useRef<HTMLDivElement>(null);
  const benefitsTagsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target as Node)) {
        setShowCityDropdown(false);
      }
      if (positionDropdownRef.current && !positionDropdownRef.current.contains(event.target as Node)) {
        setShowPositionDropdown(false);
      }
      // 技能标签菜单外部点击关闭
      const skillInput = skillTagsRef.current?.querySelector('input');
      if (skillTagsRef.current && 
          !skillTagsRef.current.contains(event.target as Node) &&
          event.target !== skillInput &&
          !skillInput?.contains(event.target as Node)) {
        setShowSkillTags(false);
        setHoveredSkillCategory(null);
      }
      // 公司文化标签菜单外部点击关闭
      const cultureInput = cultureTagsRef.current?.querySelector('input');
      if (cultureTagsRef.current && 
          !cultureTagsRef.current.contains(event.target as Node) &&
          event.target !== cultureInput &&
          !cultureInput?.contains(event.target as Node)) {
        setShowCultureTags(false);
        setHoveredCultureCategory(null);
      }
      // 薪酬福利标签菜单外部点击关闭
      const benefitsInput = benefitsTagsRef.current?.querySelector('input');
      if (benefitsTagsRef.current && 
          !benefitsTagsRef.current.contains(event.target as Node) &&
          event.target !== benefitsInput &&
          !benefitsInput?.contains(event.target as Node)) {
        setShowBenefitsTags(false);
        setHoveredBenefitsCategory(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setShowCityDropdown, setShowPositionDropdown, setShowSkillTags, setHoveredSkillCategory, setShowCultureTags, setHoveredCultureCategory, setShowBenefitsTags, setHoveredBenefitsCategory]);

  // 折叠状态管理
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true,
    requirements: true,
    company: false,
    salary: false,
    advanced: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <DocumentTextIcon className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-semibold text-gray-900">岗位信息采集</h2>
        </div>
        <div className="text-sm text-gray-500">
          <span className="text-red-500">*</span> 为必填项
        </div>
      </div>

      <div className="space-y-6">
        {/* 一、基础信息（必填） */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
          <button
            onClick={() => toggleSection('basic')}
            className="w-full flex items-center justify-between mb-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm mr-3">1</span>
              基础信息
              <span className="ml-2 text-xs text-red-500">* 必填</span>
            </h3>
            <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform ${expandedSections.basic ? '' : 'rotate-180'}`} />
          </button>
          
          {expandedSections.basic && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* 岗位名称 - 支持下拉选择和自定义输入 */}
            <div className="relative" ref={positionDropdownRef}>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                岗位名称 *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={positionInput || jobInfo.position}
                  onChange={(e) => {
                    setPositionInput(e.target.value);
                    setJobInfo(prev => ({ ...prev, position: e.target.value }));
                    setShowPositionDropdown(true);
                  }}
                  onFocus={() => setShowPositionDropdown(true)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-900 bg-white"
                  placeholder="输入或选择岗位名称"
                />
                {showPositionDropdown && positionSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {positionSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        onClick={() => handlePositionSelect(suggestion.text)}
                        className="px-4 py-2 hover:bg-indigo-50 cursor-pointer text-sm text-gray-900"
                      >
                        <div className="font-medium">{suggestion.text}</div>
                        <div className="text-xs text-gray-500">{suggestion.category}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 工作地点 - 支持多选 */}
            <div className="relative" ref={cityDropdownRef}>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                工作地点 *（可多选）
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={citySearchInput}
                  onChange={(e) => {
                    setCitySearchInput(e.target.value);
                    setShowCityDropdown(true);
                  }}
                  onFocus={() => setShowCityDropdown(true)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-900 bg-white"
                  placeholder="搜索或选择城市"
                />
                {showCityDropdown && citySuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {citySuggestions.map((cityName, index) => {
                      const isSelected = jobInfo.location.includes(cityName);
                      return (
                        <div
                          key={index}
                          onClick={() => {
                            handleCityToggle(cityName);
                            setCitySearchInput('');
                            setShowCityDropdown(false);
                          }}
                          className={`px-4 py-2 hover:bg-indigo-50 cursor-pointer text-sm flex items-center justify-between ${
                            isSelected ? 'bg-indigo-50' : ''
                          }`}
                        >
                          <span className="text-gray-900">{cityName}</span>
                          {isSelected && (
                            <CheckCircleIcon className="w-4 h-4 text-indigo-600" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              {/* 已选城市标签 */}
              {jobInfo.location.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {jobInfo.location.map(city => (
                    <span
                      key={city}
                      className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                    >
                      {city}
                      <button
                        onClick={() => handleCityRemove(city)}
                        className="ml-2 hover:text-indigo-900"
                      >
                        <TrashIcon className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          )}
        </div>

        {/* 二、任职要求 */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <button
            onClick={() => toggleSection('requirements')}
            className="w-full flex items-center justify-between mb-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm mr-3">2</span>
              任职要求
              <span className="ml-2 text-xs text-red-500">* 必填</span>
            </h3>
            <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform ${expandedSections.requirements ? '' : 'rotate-180'}`} />
          </button>
          
          {expandedSections.requirements && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            {/* 学历要求 - 支持多选 */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                学历要求
                {jobInfo.education.length > 0 && (
                  <span className="ml-2 text-indigo-600 text-xs font-normal">
                    ({getEducationDisplayText(jobInfo.education)})
                  </span>
                )}
              </label>
              <div className="flex flex-wrap gap-2">
                {educationLevels.map(level => {
                  const isSelected = jobInfo.education.includes(level);
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => handleEducationToggle(level)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                工作年限
              </label>
              <select
                value={jobInfo.experience}
                onChange={(e) => setJobInfo(prev => ({ ...prev, experience: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-900 bg-white"
              >
                <option value="">请选择</option>
                {experienceLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                招聘人数
              </label>
              <input
                type="number"
                min="1"
                value={jobInfo.recruitCount}
                onChange={(e) => setJobInfo(prev => ({ ...prev, recruitCount: parseInt(e.target.value) || 1 }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-900 bg-white"
              />
            </div>
          </div>

              {/* 技能关键词 */}
              <div className="mt-6 relative" ref={skillTagsRef}>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  技能要求 <span className="text-xs font-normal text-gray-500">（可多选标签或手动输入）</span>
                </label>
            
            {/* 手动输入技能 - 点击后显示分类菜单 */}
            <div className="relative mb-3">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => {
                  setSkillInput(e.target.value);
                  if (!showSkillTags && e.target.value.trim()) {
                    setShowSkillTags(true); // 输入时自动展开标签
                  }
                }}
                onFocus={() => setShowSkillTags(true)} // 聚焦时自动展开
                onKeyPress={(e) => e.key === 'Enter' && handleSkillAdd()}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-900 bg-white"
                placeholder="点击输入框查看技能分类，或直接输入技能关键词"
              />
              <button
                onClick={handleSkillAdd}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <PlusIcon className="w-5 h-5" />
              </button>
            </div>

            {/* 技能分类菜单（悬浮展开）- 类似Boss直聘的设计 */}
            {showSkillTags && (
              <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-[600px] overflow-hidden">
                <div className="flex h-full">
                  {/* 左侧：大类导航 */}
                  <div className="w-48 border-r border-gray-200 bg-gray-50 overflow-y-auto">
                    {Object.keys(commonSkills).map((category, index) => {
                      // 默认显示第一个分类
                      const isActive = hoveredSkillCategory === category || (hoveredSkillCategory === null && index === 0);
                      return (
                        <div
                          key={category}
                          onMouseEnter={() => setHoveredSkillCategory(category)}
                          className={`px-4 py-3 cursor-pointer transition-colors border-l-2 ${
                            isActive
                              ? 'bg-white border-indigo-500 text-indigo-600'
                              : 'border-transparent hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{category}</span>
                            <ChevronDownIcon className={`w-4 h-4 transition-transform ${
                              isActive ? 'rotate-180' : ''
                            }`} />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* 右侧：细分技能展示 */}
                  <div className="flex-1 p-6 overflow-y-auto max-h-[600px]">
                    {(() => {
                      // 默认显示第一个分类，或者显示当前悬浮的分类
                      const currentCategory = hoveredSkillCategory || Object.keys(commonSkills)[0];
                      return currentCategory && commonSkills[currentCategory] ? (
                        <div>
                          <div className="flex items-center mb-4">
                            <span className="w-1 h-6 bg-indigo-500 mr-3 rounded-full"></span>
                            <h3 className="text-lg font-semibold text-gray-900">{currentCategory}</h3>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {commonSkills[currentCategory].map((skill) => {
                              const isSelected = jobInfo.skills.includes(skill);
                              return (
                                <button
                                  key={skill}
                                  type="button"
                                  onClick={() => {
                                    handleSkillToggle(skill);
                                    setSkillInput(''); // 清空输入框
                                  }}
                                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                    isSelected
                                      ? 'bg-indigo-600 text-white shadow-md'
                                      : 'bg-gray-100 text-gray-700 hover:bg-indigo-50 hover:border-indigo-300 border border-transparent'
                                  }`}
                                >
                                  {skill}
                                  {isSelected && (
                                    <CheckCircleIcon className="inline-block w-4 h-4 ml-1" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <div className="text-center">
                            <SparklesIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">将鼠标移至左侧分类查看技能</p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
                
                {/* 关闭按钮 */}
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => {
                      setShowSkillTags(false);
                      setHoveredSkillCategory(null);
                    }}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    title="关闭"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}


            {/* 已选技能标签 */}
            {jobInfo.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {jobInfo.skills.map(skill => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                  >
                    {skill}
                    <button
                      onClick={() => handleSkillRemove(skill)}
                      className="ml-2 hover:text-indigo-900"
                    >
                      <TrashIcon className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            </div>
            </>
          )}
        </div>

        {/* 三、公司信息（可选） */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
          <button
            onClick={() => toggleSection('company')}
            className="w-full flex items-center justify-between mb-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm mr-3">3</span>
              公司信息
              <span className="ml-2 text-xs text-gray-500">（可选）</span>
            </h3>
            <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform ${expandedSections.company ? '' : 'rotate-180'}`} />
          </button>
          
          {expandedSections.company && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                所属行业
              </label>
              <select
                value={jobInfo.industry}
                onChange={(e) => setJobInfo(prev => ({ ...prev, industry: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-900 bg-white"
              >
                <option value="">请选择</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                公司规模
              </label>
              <select
                value={jobInfo.companySize}
                onChange={(e) => setJobInfo(prev => ({ ...prev, companySize: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-900 bg-white"
              >
                <option value="">请选择</option>
                {companySizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
          </div>

              {/* 公司文化关键词 */}
              <div className="mt-6 relative" ref={cultureTagsRef}>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  公司文化关键词 <span className="text-xs font-normal text-gray-500">（可多选标签或手动输入）</span>
                </label>
            
            {/* 手动输入公司文化关键词 - 点击后显示分类菜单 */}
            <div className="relative mb-3">
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => {
                  setKeywordInput(e.target.value);
                  if (!showCultureTags && e.target.value.trim()) {
                    setShowCultureTags(true); // 输入时自动展开标签
                  }
                }}
                onFocus={() => setShowCultureTags(true)} // 聚焦时自动展开
                onKeyPress={(e) => e.key === 'Enter' && handleKeywordAdd()}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-900 bg-white"
                placeholder="点击输入框查看文化关键词分类，或直接输入关键词"
              />
              <button
                onClick={handleKeywordAdd}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <PlusIcon className="w-5 h-5" />
              </button>
            </div>

            {/* 公司文化关键词分类菜单（悬浮展开）- 类似Boss直聘的设计 */}
            {showCultureTags && (
              <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-[600px] overflow-hidden">
                <div className="flex h-full">
                  {/* 左侧：大类导航 */}
                  <div className="w-48 border-r border-gray-200 bg-gray-50 overflow-y-auto">
                    {Object.keys(companyCultureKeywords).map((category) => (
                      <div
                        key={category}
                        onMouseEnter={() => setHoveredCultureCategory(category)}
                        className={`px-4 py-3 cursor-pointer transition-colors border-l-2 ${
                          hoveredCultureCategory === category
                            ? 'bg-white border-green-500 text-green-600'
                            : 'border-transparent hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{category}</span>
                          <ChevronDownIcon className={`w-4 h-4 transition-transform ${
                            hoveredCultureCategory === category ? 'rotate-180' : ''
                          }`} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 右侧：细分关键词展示 */}
                  <div className="flex-1 p-6 overflow-y-auto max-h-[600px]">
                    {(() => {
                      // 默认显示第一个分类，或者显示当前悬浮的分类
                      const currentCategory = hoveredCultureCategory || Object.keys(companyCultureKeywords)[0];
                      return currentCategory && companyCultureKeywords[currentCategory] ? (
                        <div>
                          <div className="flex items-center mb-4">
                            <span className="w-1 h-6 bg-green-500 mr-3 rounded-full"></span>
                            <h3 className="text-lg font-semibold text-gray-900">{currentCategory}</h3>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {companyCultureKeywords[currentCategory].map((keyword) => {
                              const isSelected = jobInfo.companyKeywords.includes(keyword);
                              return (
                                <button
                                  key={keyword}
                                  type="button"
                                  onClick={() => {
                                    handleCultureKeywordToggle(keyword);
                                    setKeywordInput(''); // 清空输入框
                                  }}
                                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                    isSelected
                                      ? 'bg-green-600 text-white shadow-md'
                                      : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:border-green-300 border border-transparent'
                                  }`}
                                >
                                  {keyword}
                                  {isSelected && (
                                    <CheckCircleIcon className="inline-block w-4 h-4 ml-1" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <div className="text-center">
                            <SparklesIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">将鼠标移至左侧分类查看关键词</p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
                
                {/* 关闭按钮 */}
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => {
                      setShowCultureTags(false);
                      setHoveredCultureCategory(null);
                    }}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    title="关闭"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}


            {/* 已选公司文化关键词标签 */}
            {jobInfo.companyKeywords.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {jobInfo.companyKeywords.map(keyword => (
                  <span
                    key={keyword}
                    className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                  >
                    {keyword}
                    <button
                      onClick={() => handleKeywordRemove(keyword)}
                      className="ml-2 hover:text-green-900"
                    >
                      <TrashIcon className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            </div>
            </>
          )}
        </div>

        {/* 四、薪酬福利（可选） */}
        <div className="bg-green-50 rounded-xl p-6 border border-green-100">
          <button
            onClick={() => toggleSection('salary')}
            className="w-full flex items-center justify-between mb-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm mr-3">4</span>
              薪酬福利
              <span className="ml-2 text-xs text-gray-500">（可选）</span>
            </h3>
            <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform ${expandedSections.salary ? '' : 'rotate-180'}`} />
          </button>
          
          {expandedSections.salary && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                薪资范围（K）
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="最低"
                  value={jobInfo.salaryRange?.min || ''}
                  onChange={(e) => setJobInfo(prev => ({
                    ...prev,
                    salaryRange: {
                      ...prev.salaryRange,
                      min: parseInt(e.target.value) || 0,
                      max: prev.salaryRange?.max || 0
                    }
                  }))}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-900 bg-white"
                />
                <span className="px-2 py-3 text-gray-600">-</span>
                <input
                  type="number"
                  placeholder="最高"
                  value={jobInfo.salaryRange?.max || ''}
                  onChange={(e) => setJobInfo(prev => ({
                    ...prev,
                    salaryRange: {
                      min: prev.salaryRange?.min || 0,
                      max: parseInt(e.target.value) || 0
                    }
                  }))}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-900 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                工作时间
              </label>
              <input
                type="text"
                value={jobInfo.workTime || ''}
                onChange={(e) => setJobInfo(prev => ({ ...prev, workTime: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-900 bg-white"
                placeholder="如：9:00-18:00，双休"
              />
            </div>
          </div>

              {/* 福利标签选择 */}
              <div className="mt-6 relative" ref={benefitsTagsRef}>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  福利标签 <span className="text-xs font-normal text-gray-500">（可多选标签或手动输入）</span>
                </label>
            
            {/* 手动输入福利 - 点击后显示分类菜单 */}
            <div className="relative mb-3">
              <input
                type="text"
                value={benefitsInput}
                onChange={(e) => {
                  setBenefitsInput(e.target.value);
                  if (!showBenefitsTags && e.target.value.trim()) {
                    setShowBenefitsTags(true); // 输入时自动展开标签
                  }
                }}
                onFocus={() => setShowBenefitsTags(true)} // 聚焦时自动展开
                onKeyPress={(e) => e.key === 'Enter' && handleBenefitsAdd()}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-900 bg-white"
                placeholder="点击输入框查看福利分类，或直接输入福利关键词"
              />
              <button
                onClick={handleBenefitsAdd}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <PlusIcon className="w-5 h-5" />
              </button>
            </div>

            {/* 福利分类菜单（悬浮展开）- 类似Boss直聘的设计 */}
            {showBenefitsTags && (
              <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-[600px] overflow-hidden">
                <div className="flex h-full">
                  {/* 左侧：大类导航 */}
                  <div className="w-48 border-r border-gray-200 bg-gray-50 overflow-y-auto">
                    {Object.keys(benefitsKeywords).map((category, index) => {
                      // 默认显示第一个分类
                      const isActive = hoveredBenefitsCategory === category || (hoveredBenefitsCategory === null && index === 0);
                      return (
                        <div
                          key={category}
                          onMouseEnter={() => setHoveredBenefitsCategory(category)}
                          className={`px-4 py-3 cursor-pointer transition-colors border-l-2 ${
                            isActive
                              ? 'bg-white border-purple-500 text-purple-600'
                              : 'border-transparent hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{category}</span>
                            <ChevronDownIcon className={`w-4 h-4 transition-transform ${
                              isActive ? 'rotate-180' : ''
                            }`} />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* 右侧：细分福利展示 */}
                  <div className="flex-1 p-6 overflow-y-auto max-h-[600px]">
                    {(() => {
                      // 默认显示第一个分类，或者显示当前悬浮的分类
                      const currentCategory = hoveredBenefitsCategory || Object.keys(benefitsKeywords)[0];
                      return currentCategory && benefitsKeywords[currentCategory] ? (
                        <div>
                          <div className="flex items-center mb-4">
                            <span className="w-1 h-6 bg-purple-500 mr-3 rounded-full"></span>
                            <h3 className="text-lg font-semibold text-gray-900">{currentCategory}</h3>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {benefitsKeywords[currentCategory].map((benefit) => {
                              const isSelected = jobInfo.benefits?.includes(benefit) || false;
                              return (
                                <button
                                  key={benefit}
                                  type="button"
                                  onClick={() => {
                                    handleBenefitsToggle(benefit);
                                    setBenefitsInput(''); // 清空输入框
                                  }}
                                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                    isSelected
                                      ? 'bg-purple-600 text-white shadow-md'
                                      : 'bg-gray-100 text-gray-700 hover:bg-purple-50 hover:border-purple-300 border border-transparent'
                                  }`}
                                >
                                  {benefit}
                                  {isSelected && (
                                    <CheckCircleIcon className="inline-block w-4 h-4 ml-1" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <div className="text-center">
                            <SparklesIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">将鼠标移至左侧分类查看福利</p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
                
                {/* 关闭按钮 */}
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => {
                      setShowBenefitsTags(false);
                      setHoveredBenefitsCategory(null);
                    }}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    title="关闭"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* 已选福利标签 */}
            {jobInfo.benefits && jobInfo.benefits.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {jobInfo.benefits.map(benefit => (
                  <span
                    key={benefit}
                    className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                  >
                    {benefit}
                    <button
                      onClick={() => handleBenefitsRemove(benefit)}
                      className="ml-2 hover:text-purple-900"
                    >
                      <TrashIcon className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            </div>
            </>
          )}
        </div>

        {/* 五、高级要求（可选） */}
        <div className="bg-amber-50 rounded-xl p-6 border border-amber-100">
          <button
            onClick={() => toggleSection('advanced')}
            className="w-full flex items-center justify-between mb-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm mr-3">5</span>
              高级要求
              <span className="ml-2 text-xs text-gray-500">（可选）</span>
            </h3>
            <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform ${expandedSections.advanced ? '' : 'rotate-180'}`} />
          </button>
          
          {expandedSections.advanced && (
            <div className="space-y-6 mt-4">
              {/* 优先行业经验 */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  优先行业经验 <span className="text-xs font-normal text-gray-500">（可多选）</span>
                </label>
                <div className="flex flex-wrap gap-2">
                {preferredIndustries.map(industry => {
                  const isSelected = jobInfo.preferredIndustry?.includes(industry) || false;
                  return (
                    <button
                      key={industry}
                      type="button"
                      onClick={() => handlePreferredIndustryToggle(industry)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {industry}
                    </button>
                  );
                  })}
                </div>
              </div>

              {/* 客户类型 */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  客户类型 <span className="text-xs font-normal text-gray-500">（可多选）</span>
                </label>
                <div className="flex flex-wrap gap-2">
                {clientTypes.map(type => {
                  const isSelected = jobInfo.clientType?.includes(type) || false;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleClientTypeToggle(type)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {type}
                    </button>
                  );
                  })}
                </div>
              </div>

              {/* 项目经验要求 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  项目经验要求
                </label>
                <input
                  type="text"
                  value={jobInfo.projectExperience || ''}
                  onChange={(e) => setJobInfo(prev => ({ ...prev, projectExperience: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-900 bg-white"
                  placeholder="如：2个以上百万级数据项目经验"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  项目规模要求
                </label>
                <select
                  value={jobInfo.projectScale || ''}
                  onChange={(e) => setJobInfo(prev => ({ ...prev, projectScale: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-900 bg-white"
                >
                  <option value="">请选择</option>
                  {projectScales.map(scale => (
                    <option key={scale} value={scale}>{scale}</option>
                  ))}
                  </select>
                </div>
              </div>

              {/* 专业认证 */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  专业认证要求 <span className="text-xs font-normal text-gray-500">（可多选）</span>
                </label>
                <div className="flex flex-wrap gap-2">
                {professionalCertifications.map(cert => {
                  const isSelected = jobInfo.certifications?.includes(cert) || false;
                  return (
                    <button
                      key={cert}
                      type="button"
                      onClick={() => handleCertificationToggle(cert)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {cert}
                    </button>
                  );
                  })}
                </div>
              </div>

              {/* 工作强度 */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  工作强度要求 <span className="text-xs font-normal text-gray-500">（可多选）</span>
                </label>
                <div className="flex flex-wrap gap-2">
                {workIntensityOptions.map(intensity => {
                  const isSelected = jobInfo.workIntensity?.includes(intensity) || false;
                  return (
                    <button
                      key={intensity}
                      type="button"
                      onClick={() => handleWorkIntensityToggle(intensity)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isSelected
                          ? 'bg-orange-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {intensity}
                    </button>
                  );
                  })}
                </div>
              </div>

              {/* 加分项/优先条件 */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  加分项/优先条件
                </label>
                <textarea
                value={jobInfo.additionalRequirements || ''}
                onChange={(e) => setJobInfo(prev => ({ ...prev, additionalRequirements: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-900 bg-white"
                placeholder="如：具备四大或咨询行业经验优先；持有数据治理专业认证优先；有能源行业、制造行业、金融行业经验优先..."
                rows={4}
              />
              <p className="mt-2 text-sm text-gray-500">
                  可填写多个加分项，每行一个或使用分号分隔
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 下一步按钮 */}
        <div className="pt-6">
          <button
            onClick={onNext}
            disabled={!jobInfo.position || jobInfo.location.length === 0}
            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            下一步：选择模板
          </button>
        </div>
      </div>
    </div>
  );
};

// 2️⃣ 模板选择组件
const TemplateSelection: React.FC<{
  templates: JDTemplate[];
  selectedTemplate: JDTemplate | null;
  setSelectedTemplate: React.Dispatch<React.SetStateAction<JDTemplate | null>>;
  jobInfo: JobInfo;
  onNext: () => void;
  onBack: () => void;
}> = ({ templates, selectedTemplate, setSelectedTemplate, jobInfo, onNext, onBack }) => {
  // 使用智能匹配算法推荐模板
  const recommendedTemplates = smartMatchTemplates({
    position: jobInfo.position,
    industry: jobInfo.industry,
    skills: jobInfo.skills,
    clientType: jobInfo.clientType,
    preferredIndustry: jobInfo.preferredIndustry,
    projectScale: jobInfo.projectScale,
    certifications: jobInfo.certifications,
    workIntensity: jobInfo.workIntensity
  }).slice(0, 6); // 限制推荐数量
  
  // 行业筛选状态
  const [selectedIndustry, setSelectedIndustry] = React.useState<string>('全部');
  const allIndustries = ['全部', ...Array.from(new Set(templates.map(t => t.industry)))];
  const filteredTemplates = selectedIndustry === '全部' 
    ? templates 
    : templates.filter(t => t.industry === selectedIndustry);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8">
      <div className="flex items-center space-x-3 mb-6">
        <SparklesIcon className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-semibold text-gray-900">智能模板匹配</h2>
      </div>

      <div className="space-y-6">
        {/* 推荐模板 */}
        {recommendedTemplates.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-900 mb-4 flex items-center">
              <SparklesIcon className="w-4 h-4 text-green-600 mr-2" />
              智能为您推荐的模板
              <span className="ml-2 text-xs text-gray-500">（基于您填写的信息智能匹配）</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendedTemplates.map(template => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedTemplate?.id === template.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{template.name}</h4>
                    <p className="text-sm text-gray-600">{template.industry} · {template.position} · {template.level === 'entry' ? '初级' : template.level === 'mid' ? '中级' : template.level === 'senior' ? '高级' : template.level === 'manager' ? '经理' : '总监'}</p>
                  </div>
                    {selectedTemplate?.id === template.id && (
                      <CheckCircleIcon className="w-5 h-5 text-indigo-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full inline-block">
                      ⭐ 智能匹配
                    </div>
                    {template.matchCriteria && (
                      <div className="flex flex-wrap gap-1">
                        {template.matchCriteria.keywords && template.matchCriteria.keywords.slice(0, 3).map((keyword, idx) => (
                          <span key={idx} className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 所有模板 - 按行业分类 */}
        <div>
          <h3 className="font-medium text-gray-900 mb-4">所有模板</h3>
          
          {/* 行业筛选 */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {allIndustries.map(industry => (
                <button
                  key={industry}
                  onClick={() => setSelectedIndustry(industry)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    selectedIndustry === industry
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {industry}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map(template => (
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template)}
                className={`p-4 border rounded-xl cursor-pointer transition-all ${
                  selectedTemplate?.id === template.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 text-sm">{template.name}</h4>
                  {selectedTemplate?.id === template.id && (
                    <CheckCircleIcon className="w-4 h-4 text-indigo-600" />
                  )}
                </div>
                <p className="text-xs text-gray-600 mb-2">{template.industry}</p>
                <p className="text-xs text-gray-600">{template.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 无模板选项 */}
        <div>
          <div
            onClick={() => setSelectedTemplate(null)}
            className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
              selectedTemplate === null
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <PencilSquareIcon className="w-6 h-6 text-indigo-600" />
              <div>
                <h4 className="font-semibold text-gray-900">从零开始创建</h4>
                <p className="text-sm text-gray-600">不使用模板，完全基于您的信息生成JD</p>
              </div>
              {selectedTemplate === null && (
                <CheckCircleIcon className="w-5 h-5 text-indigo-600" />
              )}
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex space-x-4 pt-6">
          <button
            onClick={onBack}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            上一步
          </button>
          <button
            onClick={onNext}
            className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            下一步：生成JD
          </button>
        </div>
      </div>
    </div>
  );
};

// 3️⃣ JD生成组件
const JDGeneration: React.FC<{
  isGenerating: boolean;
  style: 'formal' | 'casual' | 'innovative' | 'international';
  setStyle: React.Dispatch<React.SetStateAction<'formal' | 'casual' | 'innovative' | 'international'>>;
  version: 'long' | 'short' | 'brief';
  setVersion: React.Dispatch<React.SetStateAction<'long' | 'short' | 'brief'>>;
  language: 'chinese' | 'english' | 'bilingual';
  setLanguage: React.Dispatch<React.SetStateAction<'chinese' | 'english' | 'bilingual'>>;
  onGenerate: () => void;
  onBack: () => void;
}> = ({ isGenerating, style, setStyle, version, setVersion, language, setLanguage, onGenerate, onBack }) => {
  if (isGenerating) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
        <div className="space-y-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent"></div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">AI正在生成职位描述</h3>
            <p className="text-gray-600">
              正在分析岗位信息，生成专业的JD内容...
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-2 text-sm text-indigo-600">
              <CheckCircleIcon className="w-4 h-4" />
              <span>岗位信息分析完成</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-indigo-600">
              <CheckCircleIcon className="w-4 h-4" />
              <span>模板匹配完成</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-600 border-t-transparent"></div>
              <span>生成职位描述中...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8">
      <div className="flex items-center space-x-3 mb-6">
        <PencilSquareIcon className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-semibold text-gray-900">AI生成设置</h2>
      </div>

      <div className="space-y-8">
        {/* 文风设置 */}
        <div>
          <h3 className="font-medium text-gray-900 mb-4">文风选择</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { id: 'formal', name: '正式专业', desc: '用词严谨，适合传统企业' },
              { id: 'casual', name: '轻松友好', desc: '语言亲切，适合互联网公司' },
              { id: 'innovative', name: '创新前卫', desc: '突出创造力，适合科技创业' },
              { id: 'international', name: '国际化', desc: '双语视野，适合跨国企业' }
            ].map(styleOption => (
              <div
                key={styleOption.id}
                onClick={() => setStyle(styleOption.id as any)}
                className={`p-4 border rounded-xl cursor-pointer transition-all ${
                  style === styleOption.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{styleOption.name}</h4>
                  {style === styleOption.id && (
                    <CheckCircleIcon className="w-4 h-4 text-indigo-600" />
                  )}
                </div>
                <p className="text-sm text-gray-600">{styleOption.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 版本选择 */}
        <div>
          <h3 className="font-medium text-gray-900 mb-4">版本长度</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: 'long', name: '详细版本', desc: '800-1200字，适合官网展示' },
              { id: 'short', name: '简洁版本', desc: '400-600字，适合社交媒体' },
              { id: 'brief', name: '精简版本', desc: '200-300字，适合内推转发' }
            ].map(versionOption => (
              <div
                key={versionOption.id}
                onClick={() => setVersion(versionOption.id as any)}
                className={`p-4 border rounded-xl cursor-pointer transition-all ${
                  version === versionOption.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{versionOption.name}</h4>
                  {version === versionOption.id && (
                    <CheckCircleIcon className="w-4 h-4 text-indigo-600" />
                  )}
                </div>
                <p className="text-sm text-gray-600">{versionOption.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 语言选择 */}
        <div>
          <h3 className="font-medium text-gray-900 mb-4">语言版本</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: 'chinese', name: '中文版本', desc: '纯中文职位描述' },
              { id: 'english', name: '英文版本', desc: '纯英文职位描述' },
              { id: 'bilingual', name: '中英双语', desc: '中英文对照版本' }
            ].map(langOption => (
              <div
                key={langOption.id}
                onClick={() => setLanguage(langOption.id as any)}
                className={`p-4 border rounded-xl cursor-pointer transition-all ${
                  language === langOption.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{langOption.name}</h4>
                  {language === langOption.id && (
                    <CheckCircleIcon className="w-4 h-4 text-indigo-600" />
                  )}
                </div>
                <p className="text-sm text-gray-600">{langOption.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex space-x-4 pt-6">
          <button
            onClick={onBack}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            上一步
          </button>
          <button
            onClick={onGenerate}
            className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
          >
            <SparklesIcon className="w-5 h-5" />
            <span>开始生成JD</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// 4️⃣ JD优化组件
const JDOptimization: React.FC<{
  generatedJD: GeneratedJD;
  onOptimize: (type: 'seo' | 'style' | 'compliance' | 'keywords') => void;
  onNext: () => void;
  onBack: () => void;
}> = ({ generatedJD, onOptimize, onNext, onBack }) => {
  return (
    <div className="space-y-8">
      {/* JD预览 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <EyeIcon className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-900">生成的职位描述</h2>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => onOptimize('seo')}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
            >
              SEO优化
            </button>
            <button
              onClick={() => onOptimize('style')}
              className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
            >
              文风调整
            </button>
            <button
              onClick={() => onOptimize('compliance')}
              className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm"
            >
              合规检查
            </button>
            <button
              onClick={() => onOptimize('keywords')}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm"
            >
              关键词优化
            </button>
          </div>
        </div>

        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap text-gray-900 leading-relaxed">
            {generatedJD.jobDescription}
          </div>
        </div>
      </div>

      {/* 分析结果 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 岗位职责 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">岗位职责</h3>
          <ul className="space-y-2">
            {generatedJD.responsibilities.map((responsibility, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-gray-600">{responsibility}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 任职要求 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">任职要求</h3>
          <ul className="space-y-2">
            {generatedJD.requirements.map((requirement, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-gray-600">{requirement}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 岗位亮点 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">岗位亮点</h3>
          <div className="flex flex-wrap gap-2">
            {generatedJD.highlights.map((highlight, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm"
              >
                {highlight}
              </span>
            ))}
          </div>
        </div>

        {/* SEO关键词 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">SEO关键词</h3>
          <div className="flex flex-wrap gap-2">
            {generatedJD.seoKeywords.map((keyword, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 合规检查 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
          {generatedJD.complianceCheck.passed ? (
            <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />
          ) : (
            <ExclamationTriangleIcon className="w-5 h-5 text-orange-600 mr-2" />
          )}
          合规检查
        </h3>
        
        {generatedJD.complianceCheck.passed ? (
          <div className="text-green-700 bg-green-50 p-4 rounded-lg">
            ✅ 职位描述符合合规要求，未发现敏感或歧视性内容
          </div>
        ) : (
          <div className="space-y-4">
            {generatedJD.complianceCheck.issues.length > 0 && (
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-medium text-orange-900 mb-2">发现的问题：</h4>
                <ul className="space-y-1">
                  {generatedJD.complianceCheck.issues.map((issue, index) => (
                    <li key={index} className="text-orange-800 text-sm">• {issue}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {generatedJD.complianceCheck.suggestions.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">改进建议：</h4>
                <ul className="space-y-1">
                  {generatedJD.complianceCheck.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-blue-800 text-sm">• {suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 操作按钮 */}
      <div className="flex space-x-4">
        <button
          onClick={onBack}
          className="flex-1 px-6 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
        >
          重新生成
        </button>
        <button
          onClick={onNext}
          className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          下一步：导出发布
        </button>
      </div>
    </div>
  );
};

// 8️⃣ JD导出组件
const JDExport: React.FC<{
  generatedJD: GeneratedJD;
  jobInfo: JobInfo;
  onBack: () => void;
}> = ({ generatedJD, jobInfo, onBack }) => {
  const exportToWord = () => {
    // 实现Word导出功能
    console.log('导出为Word文档');
  };

  const exportToPDF = () => {
    // 实现PDF导出功能
    console.log('导出为PDF文档');
  };

  const exportToMarkdown = () => {
    // 实现Markdown导出功能
    const markdown = `# ${jobInfo.position}\n\n${generatedJD.jobDescription}`;
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${jobInfo.position}-JD.md`;
    a.click();
  };

  const publishToRecruitmentSites = () => {
    // 实现发布到招聘网站功能
    console.log('发布到招聘网站');
  };

  return (
    <div className="space-y-8">
      {/* 最终预览 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8">
        <div className="flex items-center space-x-3 mb-6">
          <ShareIcon className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-semibold text-gray-900">最终预览</h2>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-900 leading-relaxed">
              {generatedJD.jobDescription}
            </div>
          </div>
        </div>
      </div>

      {/* 导出选项 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8">
        <h3 className="font-semibold text-gray-900 mb-6">导出与发布</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Word导出 */}
          <button
            onClick={exportToWord}
            className="p-6 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all text-center group"
          >
            <DocumentTextIcon className="w-8 h-8 text-blue-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h4 className="font-medium text-gray-900 mb-2">导出Word</h4>
            <p className="text-sm text-gray-600">生成.docx格式文档</p>
          </button>

          {/* PDF导出 */}
          <button
            onClick={exportToPDF}
            className="p-6 border border-gray-200 rounded-xl hover:border-red-300 hover:bg-red-50 transition-all text-center group"
          >
            <ArrowDownTrayIcon className="w-8 h-8 text-red-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h4 className="font-medium text-gray-900 mb-2">导出PDF</h4>
            <p className="text-sm text-gray-600">生成PDF格式文档</p>
          </button>

          {/* Markdown导出 */}
          <button
            onClick={exportToMarkdown}
            className="p-6 border border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all text-center group"
          >
            <DocumentTextIcon className="w-8 h-8 text-green-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h4 className="font-medium text-gray-900 mb-2">导出Markdown</h4>
            <p className="text-sm text-gray-600">生成.md格式文档</p>
          </button>

          {/* 发布到招聘网站 */}
          <button
            onClick={publishToRecruitmentSites}
            className="p-6 border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all text-center group"
          >
            <GlobeAltIcon className="w-8 h-8 text-purple-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h4 className="font-medium text-gray-900 mb-2">发布招聘</h4>
            <p className="text-sm text-gray-600">推送到招聘平台</p>
          </button>
        </div>
      </div>

      {/* 招聘网站发布 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8">
        <h3 className="font-semibold text-gray-900 mb-6">一键发布到招聘网站</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Boss直聘', logo: '💼', status: '已连接' },
            { name: '拉勾网', logo: '🔍', status: '未连接' },
            { name: 'LinkedIn', logo: '💼', status: '已连接' },
            { name: '智联招聘', logo: '📋', status: '未连接' },
            { name: '前程无忧', logo: '🚀', status: '未连接' },
            { name: '猎聘网', logo: '🎯', status: '已连接' }
          ].map((site, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{site.logo}</span>
                  <div>
                    <h4 className="font-medium text-gray-900">{site.name}</h4>
                    <p className={`text-xs ${
                      site.status === '已连接' ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {site.status}
                    </p>
                  </div>
                </div>
                <button
                  className={`px-3 py-1 rounded text-sm ${
                    site.status === '已连接'
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors`}
                >
                  {site.status === '已连接' ? '发布' : '连接'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex space-x-4">
        <button
          onClick={onBack}
          className="flex-1 px-6 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
        >
          返回修改
        </button>
        <button
          className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
        >
          <CheckCircleIcon className="w-5 h-5" />
          <span>完成创建</span>
        </button>
      </div>
    </div>
  );
};
