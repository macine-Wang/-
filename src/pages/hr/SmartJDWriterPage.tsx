/**
 * 智能JD写作模块
 * 集成8大核心功能的完整JD生成解决方案
 */

import React, { useState } from 'react';
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
  EyeIcon
} from '@heroicons/react/24/outline';
import { getIndustries } from '@/data/jobCategories';
import { popularCities } from '@/data/cities';

// 数据接口定义
interface JobInfo {
  position: string;
  department: string;
  location: string;
  reportTo: string;
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

import { jdTemplates, JDTemplate } from '@/data/jdTemplates';

export const SmartJDWriterPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'info' | 'template' | 'generate' | 'optimize' | 'export'>('info');
  const [jobInfo, setJobInfo] = useState<JobInfo>({
    position: '',
    department: '',
    location: '',
    reportTo: '',
    skills: [],
    education: '',
    experience: '',
    industry: '',
    companySize: '',
    recruitCount: 1,
    companyKeywords: []
  });
  const [generatedJD, setGeneratedJD] = useState<GeneratedJD | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<JDTemplate | null>(null);
  const [style, setStyle] = useState<'formal' | 'casual' | 'innovative' | 'international'>('formal');
  const [version, setVersion] = useState<'long' | 'short' | 'brief'>('long');
  const [language, setLanguage] = useState<'chinese' | 'english' | 'bilingual'>('chinese');
  const [skillInput, setSkillInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');

  // 使用外部模板库
  const templates = jdTemplates;

  // 行业选项
  const industries = getIndustries();

  // 公司规模选项
  const companySizes = [
    '初创公司(1-50人)', '小型企业(51-200人)', '中型企业(201-1000人)', 
    '大型企业(1001-5000人)', '超大型企业(5000人以上)'
  ];

  // 学历要求选项
  const educationLevels = [
    '不限', '高中/中专', '大专', '本科', '硕士', '博士'
  ];

  // 工作经验选项
  const experienceLevels = [
    '不限', '应届生', '1-3年', '3-5年', '5-10年', '10年以上'
  ];

  // 添加技能
  const handleSkillAdd = () => {
    if (skillInput.trim() && !jobInfo.skills.includes(skillInput.trim())) {
      setJobInfo(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  // 移除技能
  const handleSkillRemove = (skill: string) => {
    setJobInfo(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  // 添加公司关键词
  const handleKeywordAdd = () => {
    if (keywordInput.trim() && !jobInfo.companyKeywords.includes(keywordInput.trim())) {
      setJobInfo(prev => ({
        ...prev,
        companyKeywords: [...prev.companyKeywords, keywordInput.trim()]
      }));
      setKeywordInput('');
    }
  };

  // 移除关键词
  const handleKeywordRemove = (keyword: string) => {
    setJobInfo(prev => ({
      ...prev,
      companyKeywords: prev.companyKeywords.filter(k => k !== keyword)
    }));
  };

  // 生成JD
  const generateJD = async () => {
    setIsGenerating(true);
    setCurrentStep('generate');

    try {
      const result = await deepseekApi.generateJobDescription({
        ...jobInfo,
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
              handleSkillAdd={handleSkillAdd}
              handleSkillRemove={handleSkillRemove}
              handleKeywordAdd={handleKeywordAdd}
              handleKeywordRemove={handleKeywordRemove}
              industries={industries}
              companySizes={companySizes}
              educationLevels={educationLevels}
              experienceLevels={experienceLevels}
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
  handleSkillAdd: () => void;
  handleSkillRemove: (skill: string) => void;
  handleKeywordAdd: () => void;
  handleKeywordRemove: (keyword: string) => void;
  industries: string[];
  companySizes: string[];
  educationLevels: string[];
  experienceLevels: string[];
  onNext: () => void;
}> = ({
  jobInfo, setJobInfo, skillInput, setSkillInput, keywordInput, setKeywordInput,
  handleSkillAdd, handleSkillRemove, handleKeywordAdd, handleKeywordRemove,
  industries, companySizes, educationLevels, experienceLevels, onNext
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8">
      <div className="flex items-center space-x-3 mb-6">
        <DocumentTextIcon className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-semibold text-gray-900">岗位信息采集</h2>
      </div>

      <div className="space-y-8">
        {/* 基本信息 */}
        <div>
          <h3 className="font-medium text-gray-900 mb-4">基本信息</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                岗位名称 *
              </label>
              <input
                type="text"
                value={jobInfo.position}
                onChange={(e) => setJobInfo(prev => ({ ...prev, position: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-900 bg-white"
                placeholder="如：高级前端工程师"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                所属部门 *
              </label>
              <input
                type="text"
                value={jobInfo.department}
                onChange={(e) => setJobInfo(prev => ({ ...prev, department: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-900 bg-white"
                placeholder="如：技术部"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                工作地点 *
              </label>
              <input
                type="text"
                value={jobInfo.location}
                onChange={(e) => setJobInfo(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-900 bg-white"
                placeholder={`如：${popularCities.slice(0, 3).join('·')}等`}
                list="city-suggestions"
              />
              <datalist id="city-suggestions">
                {popularCities.map(city => (
                  <option key={city} value={city} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                汇报对象
              </label>
              <input
                type="text"
                value={jobInfo.reportTo}
                onChange={(e) => setJobInfo(prev => ({ ...prev, reportTo: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-900 bg-white"
                placeholder="如：技术总监"
              />
            </div>
          </div>
        </div>

        {/* 任职要求 */}
        <div>
          <h3 className="font-medium text-gray-900 mb-4">任职要求</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                学历要求
              </label>
              <select
                value={jobInfo.education}
                onChange={(e) => setJobInfo(prev => ({ ...prev, education: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-900 bg-white"
              >
                <option value="">请选择</option>
                {educationLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
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
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              技能关键词
            </label>
            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSkillAdd()}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-900 bg-white"
                placeholder="输入技能关键词，按回车添加"
              />
              <button
                onClick={handleSkillAdd}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
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
          </div>
        </div>

        {/* 公司信息 */}
        <div>
          <h3 className="font-medium text-gray-900 mb-4">公司信息</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          {/* 公司关键词 */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              公司文化关键词
            </label>
            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleKeywordAdd()}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-900 bg-white"
                placeholder="如：扁平化管理、技术驱动、创新文化"
              />
              <button
                onClick={handleKeywordAdd}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
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
          </div>
        </div>

        {/* 薪酬福利（可选） */}
        <div>
          <h3 className="font-medium text-gray-900 mb-4">薪酬福利（可选）</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div>

        {/* 下一步按钮 */}
        <div className="pt-6">
          <button
            onClick={onNext}
            disabled={!jobInfo.position || !jobInfo.department || !jobInfo.location}
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
  // 智能推荐模板：优先匹配行业，其次匹配岗位关键词
  const filteredTemplates = templates.filter(template => {
    const industryMatch = template.industry === jobInfo.industry;
    const positionMatch = template.position.toLowerCase().includes(jobInfo.position.toLowerCase().split(' ')[0]) ||
                         jobInfo.position.toLowerCase().includes(template.position.toLowerCase().split(' ')[0]);
    return industryMatch || positionMatch;
  }).slice(0, 6); // 限制推荐数量

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8">
      <div className="flex items-center space-x-3 mb-6">
        <SparklesIcon className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-semibold text-gray-900">智能模板匹配</h2>
      </div>

      <div className="space-y-6">
        {/* 推荐模板 */}
        {filteredTemplates.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-900 mb-4 flex items-center">
              <SparklesIcon className="w-4 h-4 text-green-600 mr-2" />
              为您推荐的模板
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTemplates.map(template => (
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
                  <div className="text-xs text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full inline-block">
                    智能推荐
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 所有模板 */}
        <div>
          <h3 className="font-medium text-gray-900 mb-4">所有模板</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map(template => (
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
