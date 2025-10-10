/**
 * 批量JD生成器页面
 * 实现批量处理模块功能
 */

import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { deepseekApi } from '@/services/deepseekApi';
import { 
  CloudArrowUpIcon,
  DocumentArrowDownIcon,
  SparklesIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  TrashIcon,
  EyeIcon,
  ArrowLeftIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { getIndustries } from '@/data/jobCategories';

interface BatchJobInfo {
  id: string;
  position: string;
  department: string;
  location: string;
  industry: string;
  skills: string[];
  education: string;
  experience: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  generatedJD?: string;
  error?: string;
}

interface BatchGenerationResult {
  total: number;
  completed: number;
  failed: number;
  results: BatchJobInfo[];
}

export const BatchJDGeneratorPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'upload' | 'configure' | 'generate' | 'export'>('upload');
  const [batchJobs, setBatchJobs] = useState<BatchJobInfo[]>([]);
  const [generationResult, setGenerationResult] = useState<BatchGenerationResult | null>(null);
  const [style, setStyle] = useState<'formal' | 'casual' | 'innovative' | 'international'>('formal');
  const [version, setVersion] = useState<'long' | 'short' | 'brief'>('long');
  const [language, setLanguage] = useState<'chinese' | 'english' | 'bilingual'>('chinese');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 下载CSV模板
  const downloadTemplate = () => {
    const templateData = [
      ['岗位名称', '部门', '地点', '行业', '技能要求', '学历要求', '工作经验'],
      ['前端开发工程师', '技术部', '北京', '互联网', 'React;Vue;JavaScript;TypeScript', '本科', '3-5年'],
      ['产品经理', '产品部', '上海', '互联网', '产品设计;用户研究;数据分析', '本科', '2-4年'],
      ['UI设计师', '设计部', '深圳', '互联网', 'Figma;Sketch;Photoshop;用户体验设计', '本科', '1-3年'],
      ['Java开发工程师', '技术部', '杭州', '互联网', 'Java;Spring;MySQL;Redis', '本科', '3-5年'],
      ['运营专员', '运营部', '广州', '电商', '内容运营;用户运营;数据分析', '本科', '1-2年']
    ];

    const csvContent = templateData.map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'JD批量生成模板.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  // 处理文件上传
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 检查文件类型
    if (!file.name.toLowerCase().endsWith('.csv')) {
      alert('请选择CSV格式的文件');
      return;
    }

    // 检查文件大小 (限制为5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('文件大小不能超过5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        parseCSVContent(content);
      } catch (error) {
        console.error('文件解析失败:', error);
        alert('文件解析失败，请检查文件格式是否正确');
      }
    };
    reader.onerror = () => {
      alert('文件读取失败，请重试');
    };
    reader.readAsText(file, 'UTF-8');
  };

  // 解析CSV内容
  const parseCSVContent = (content: string) => {
    const lines = content.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      alert('CSV文件至少需要包含表头和一行数据');
      return;
    }

    // 解析CSV行，处理引号包围的字段
    const parseCSVLine = (line: string): string[] => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          if (inQuotes && line[i + 1] === '"') {
            current += '"';
            i++; // 跳过下一个引号
          } else {
            inQuotes = !inQuotes;
          }
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      
      result.push(current.trim());
      return result;
    };

    const headers = parseCSVLine(lines[0]);
    
    // 验证表头格式
    const expectedHeaders = ['岗位名称', '部门', '地点', '行业', '技能要求', '学历要求', '工作经验'];
    if (headers.length < 7) {
      alert(`CSV文件格式不正确。期望的表头格式：${expectedHeaders.join(', ')}`);
      return;
    }
    
    const jobs: BatchJobInfo[] = [];
    const errors: string[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      
      if (values.length < 7) {
        errors.push(`第${i + 1}行数据不完整，缺少必要字段`);
        continue;
      }
      
      const position = values[0]?.replace(/^"|"$/g, '') || '';
      const department = values[1]?.replace(/^"|"$/g, '') || '';
      const location = values[2]?.replace(/^"|"$/g, '') || '';
      const industry = values[3]?.replace(/^"|"$/g, '') || '';
      const skillsStr = values[4]?.replace(/^"|"$/g, '') || '';
      const education = values[5]?.replace(/^"|"$/g, '') || '';
      const experience = values[6]?.replace(/^"|"$/g, '') || '';
      
      if (!position.trim()) {
        errors.push(`第${i + 1}行缺少岗位名称`);
        continue;
      }
      
      jobs.push({
        id: `job_${i}`,
        position: position.trim(),
        department: department.trim(),
        location: location.trim(),
        industry: industry.trim(),
        skills: skillsStr.split(';').map(s => s.trim()).filter(s => s),
        education: education.trim(),
        experience: experience.trim(),
        status: 'pending'
      });
    }
    
    if (errors.length > 0) {
      const errorMsg = `解析过程中发现以下问题：\n${errors.slice(0, 5).join('\n')}${errors.length > 5 ? `\n...还有${errors.length - 5}个问题` : ''}`;
      if (!confirm(`${errorMsg}\n\n是否继续导入有效的${jobs.length}条数据？`)) {
        return;
      }
    }
    
    if (jobs.length === 0) {
      alert('没有找到有效的岗位数据，请检查文件格式');
      return;
    }
    
    setBatchJobs(jobs);
    setCurrentStep('configure');
    
    // 显示成功消息
    alert(`成功导入${jobs.length}个岗位信息${errors.length > 0 ? `，跳过${errors.length}个无效数据` : ''}`);
  };

  // 手动添加岗位
  const addManualJob = () => {
    const newJob: BatchJobInfo = {
      id: `manual_${Date.now()}`,
      position: '',
      department: '',
      location: '',
      industry: '',
      skills: [],
      education: '',
      experience: '',
      status: 'pending'
    };
    setBatchJobs(prev => [...prev, newJob]);
  };

  // 更新岗位信息
  const updateJob = (id: string, updates: Partial<BatchJobInfo>) => {
    setBatchJobs(prev => prev.map(job => 
      job.id === id ? { ...job, ...updates } : job
    ));
  };

  // 删除岗位
  const removeJob = (id: string) => {
    setBatchJobs(prev => prev.filter(job => job.id !== id));
  };

  // 批量生成JD
  const generateBatchJDs = async () => {
    setCurrentStep('generate');
    
    const results: BatchJobInfo[] = [];
    let completed = 0;
    let failed = 0;

    for (const job of batchJobs) {
      try {
        // 更新状态为处理中
        updateJob(job.id, { status: 'processing' });

        const result = await deepseekApi.generateJobDescription({
          position: job.position,
          department: job.department,
          location: job.location,
          reportTo: '部门负责人',
          skills: job.skills,
          education: job.education,
          experience: job.experience,
          industry: job.industry,
          companySize: '中型企业',
          recruitCount: 1,
          companyKeywords: ['专业', '创新', '成长'],
          style,
          version,
          language
        });

        const updatedJob = {
          ...job,
          status: 'completed' as const,
          generatedJD: result.jobDescription
        };
        
        results.push(updatedJob);
        updateJob(job.id, updatedJob);
        completed++;

      } catch (error) {
        const updatedJob = {
          ...job,
          status: 'error' as const,
          error: '生成失败，请检查输入信息'
        };
        
        results.push(updatedJob);
        updateJob(job.id, updatedJob);
        failed++;
      }

      // 添加延迟避免API限制
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setGenerationResult({
      total: batchJobs.length,
      completed,
      failed,
      results
    });

    setCurrentStep('export');
  };

  // 导出结果
  const exportResults = () => {
    if (!generationResult) return;

    const csvContent = [
      ['岗位名称', '部门', '地点', '行业', '状态', 'JD内容'].join(','),
      ...generationResult.results.map(job => [
        job.position,
        job.department,
        job.location,
        job.industry,
        job.status === 'completed' ? '成功' : '失败',
        job.generatedJD ? `"${job.generatedJD.replace(/"/g, '""')}"` : job.error || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `批量JD生成结果_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="container max-w-7xl py-12">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <Link to="/hr/smart-jd-writer" className="text-gray-600 hover:text-dsp-red transition-colors">
            <ArrowLeftIcon className="w-6 h-6" />
          </Link>
          <div className="p-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl">
            <CloudArrowUpIcon className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">批量JD生成器</h1>
            <p className="text-gray-600 mt-1">一次性生成多个职位描述，提升HR工作效率</p>
          </div>
        </div>

        {/* 步骤指示器 */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            {[
              { id: 'upload', label: '数据上传', icon: CloudArrowUpIcon },
              { id: 'configure', label: '参数配置', icon: SparklesIcon },
              { id: 'generate', label: '批量生成', icon: ArrowPathIcon },
              { id: 'export', label: '结果导出', icon: DocumentArrowDownIcon }
            ].map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = ['upload', 'configure', 'generate'].indexOf(currentStep) > 
                                 ['upload', 'configure', 'generate'].indexOf(step.id);
              
              return (
                <React.Fragment key={step.id}>
                  <div
                    className={`flex items-center space-x-2 px-4 py-3 rounded-md font-medium transition-colors ${
                      isActive
                        ? 'bg-white text-blue-600 shadow-sm'
                        : isCompleted
                        ? 'text-green-600'
                        : 'text-gray-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{step.label}</span>
                    {isCompleted && <CheckCircleIcon className="w-4 h-4 text-green-600" />}
                  </div>
                  {index < 3 && <div className="w-8 h-0.5 bg-gray-300"></div>}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* 内容区域 */}
        <div className="max-w-6xl mx-auto">
          {currentStep === 'upload' && (
            <UploadStep
              onFileUpload={handleFileUpload}
              onAddManual={addManualJob}
              batchJobs={batchJobs}
              updateJob={updateJob}
              removeJob={removeJob}
              onNext={() => setCurrentStep('configure')}
              fileInputRef={fileInputRef}
              downloadTemplate={downloadTemplate}
            />
          )}

          {currentStep === 'configure' && (
            <ConfigureStep
              style={style}
              setStyle={setStyle}
              version={version}
              setVersion={setVersion}
              language={language}
              setLanguage={setLanguage}
              jobCount={batchJobs.length}
              onNext={() => generateBatchJDs()}
              onBack={() => setCurrentStep('upload')}
            />
          )}

          {currentStep === 'generate' && (
            <GenerateStep
              batchJobs={batchJobs}
              progress={batchJobs.filter(job => job.status === 'completed' || job.status === 'error').length}
              total={batchJobs.length}
            />
          )}

          {currentStep === 'export' && generationResult && (
            <ExportStep
              result={generationResult}
              onExport={exportResults}
              onBack={() => setCurrentStep('configure')}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// 数据上传步骤组件
const UploadStep: React.FC<{
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAddManual: () => void;
  batchJobs: BatchJobInfo[];
  updateJob: (id: string, updates: Partial<BatchJobInfo>) => void;
  removeJob: (id: string) => void;
  onNext: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  downloadTemplate: () => void;
}> = ({ onFileUpload, onAddManual, batchJobs, updateJob, removeJob, onNext, fileInputRef, downloadTemplate }) => {
  return (
    <div className="space-y-8">
      {/* 上传选项 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CSV上传 */}
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors">
          <CloudArrowUpIcon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">上传CSV文件</h3>
          <p className="text-gray-600 mb-6">批量导入岗位信息，快速开始生成</p>
          
          <div className="space-y-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              选择CSV文件
            </button>
            
            <button
              onClick={downloadTemplate}
              className="w-full px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <DocumentArrowDownIcon className="w-4 h-4" />
              <span>下载模板文件</span>
            </button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={onFileUpload}
            className="hidden"
          />
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg text-left">
            <h4 className="font-medium text-blue-900 mb-2">CSV文件格式说明：</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• 第一行为表头：岗位名称,部门,地点,行业,技能要求,学历要求,工作经验</p>
              <p>• 技能要求用分号(;)分隔，如：React;Vue;JavaScript</p>
              <p>• 文件编码请使用UTF-8格式</p>
              <p>• 建议先下载模板文件作为参考</p>
            </div>
          </div>
        </div>

        {/* 手动添加 */}
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-green-400 transition-colors">
          <PlusIcon className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">手动添加岗位</h3>
          <p className="text-gray-600 mb-6">逐个添加岗位信息，精确控制每个字段</p>
          
          <button
            onClick={onAddManual}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center space-x-2"
          >
            <PlusIcon className="w-4 h-4" />
            <span>添加新岗位</span>
          </button>
          
          <div className="mt-6 p-4 bg-green-50 rounded-lg text-left">
            <h4 className="font-medium text-green-900 mb-2">手动添加优势：</h4>
            <div className="text-sm text-green-800 space-y-1">
              <p>• 可以精确控制每个岗位的详细信息</p>
              <p>• 支持实时预览和编辑</p>
              <p>• 适合少量岗位的精细化处理</p>
              <p>• 可与CSV导入混合使用</p>
            </div>
          </div>
        </div>
      </div>

      {/* 空状态提示 */}
      {batchJobs.length === 0 && (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center">
          <CloudArrowUpIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">开始批量生成JD</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            选择上传CSV文件进行批量导入，或手动添加岗位信息。
            我们的AI将为您生成专业的职位描述。
          </p>
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              上传CSV文件
            </button>
            <span className="text-gray-400">或</span>
            <button
              onClick={onAddManual}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              手动添加岗位
            </button>
          </div>
        </div>
      )}

      {/* 岗位列表 */}
      {batchJobs.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">岗位列表</h3>
              <p className="text-sm text-gray-600 mt-1">共 {batchJobs.length} 个岗位待生成</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={onAddManual}
                className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors text-sm font-medium flex items-center space-x-1"
              >
                <PlusIcon className="w-4 h-4" />
                <span>继续添加</span>
              </button>
              <button
                onClick={onNext}
                disabled={batchJobs.length === 0}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                下一步配置
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {batchJobs.map((job, index) => (
              <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">岗位 #{index + 1}</span>
                  <button
                    onClick={() => removeJob(job.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="删除此岗位"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">岗位名称 *</label>
                    <input
                      type="text"
                      placeholder="如：前端开发工程师"
                      value={job.position}
                      onChange={(e) => updateJob(job.id, { position: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">部门</label>
                    <input
                      type="text"
                      placeholder="如：技术部"
                      value={job.department}
                      onChange={(e) => updateJob(job.id, { department: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">工作地点</label>
                    <input
                      type="text"
                      placeholder="如：北京"
                      value={job.location}
                      onChange={(e) => updateJob(job.id, { location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">所属行业</label>
                    <select
                      value={job.industry}
                      onChange={(e) => updateJob(job.id, { industry: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                      <option value="">选择行业</option>
                      {getIndustries().map(industry => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">技能要求</label>
                    <input
                      type="text"
                      placeholder="用分号分隔，如：React;Vue;JavaScript"
                      value={job.skills.join(';')}
                      onChange={(e) => updateJob(job.id, { skills: e.target.value.split(';').map(s => s.trim()).filter(s => s) })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">学历要求</label>
                    <select
                      value={job.education}
                      onChange={(e) => updateJob(job.id, { education: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                      <option value="">选择学历</option>
                      <option value="不限">不限</option>
                      <option value="大专">大专</option>
                      <option value="本科">本科</option>
                      <option value="硕士">硕士</option>
                      <option value="博士">博士</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">工作经验</label>
                    <select
                      value={job.experience}
                      onChange={(e) => updateJob(job.id, { experience: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                      <option value="">选择经验</option>
                      <option value="不限">不限</option>
                      <option value="应届生">应届生</option>
                      <option value="1年以下">1年以下</option>
                      <option value="1-3年">1-3年</option>
                      <option value="3-5年">3-5年</option>
                      <option value="5-10年">5-10年</option>
                      <option value="10年以上">10年以上</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {batchJobs.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 text-blue-800">
                <SparklesIcon className="w-5 h-5" />
                <span className="font-medium">准备就绪</span>
              </div>
              <p className="text-sm text-blue-700 mt-1">
                已准备 {batchJobs.length} 个岗位，点击"下一步配置"继续设置生成参数
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// 参数配置步骤组件
const ConfigureStep: React.FC<{
  style: string;
  setStyle: (style: any) => void;
  version: string;
  setVersion: (version: any) => void;
  language: string;
  setLanguage: (language: any) => void;
  jobCount: number;
  onNext: () => void;
  onBack: () => void;
}> = ({ style, setStyle, version, setVersion, language, setLanguage, jobCount, onNext, onBack }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8">
      <div className="flex items-center space-x-3 mb-6">
        <SparklesIcon className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">批量生成配置</h2>
      </div>

      <div className="space-y-8">
        {/* 统计信息 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{jobCount}</div>
              <div className="text-sm text-blue-700">待生成岗位</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">~{Math.ceil(jobCount * 2)}</div>
              <div className="text-sm text-blue-700">预计耗时(分钟)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">AI</div>
              <div className="text-sm text-blue-700">智能生成</div>
            </div>
          </div>
        </div>

        {/* 配置选项 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 文风选择 */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">文风选择</h3>
            <div className="space-y-3">
              {[
                { id: 'formal', name: '正式专业' },
                { id: 'casual', name: '轻松友好' },
                { id: 'innovative', name: '创新前卫' },
                { id: 'international', name: '国际化' }
              ].map(styleOption => (
                <label key={styleOption.id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="style"
                    value={styleOption.id}
                    checked={style === styleOption.id}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-900">{styleOption.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 版本选择 */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">版本长度</h3>
            <div className="space-y-3">
              {[
                { id: 'long', name: '详细版本' },
                { id: 'short', name: '简洁版本' },
                { id: 'brief', name: '精简版本' }
              ].map(versionOption => (
                <label key={versionOption.id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="version"
                    value={versionOption.id}
                    checked={version === versionOption.id}
                    onChange={(e) => setVersion(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-900">{versionOption.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 语言选择 */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">语言版本</h3>
            <div className="space-y-3">
              {[
                { id: 'chinese', name: '中文版本' },
                { id: 'english', name: '英文版本' },
                { id: 'bilingual', name: '中英双语' }
              ].map(langOption => (
                <label key={langOption.id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="language"
                    value={langOption.id}
                    checked={language === langOption.id}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-900">{langOption.name}</span>
                </label>
              ))}
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
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            开始生成 ({jobCount} 个岗位)
          </button>
        </div>
      </div>
    </div>
  );
};

// 生成进度步骤组件
const GenerateStep: React.FC<{
  batchJobs: BatchJobInfo[];
  progress: number;
  total: number;
}> = ({ batchJobs, progress, total }) => {
  const progressPercentage = total > 0 ? (progress / total) * 100 : 0;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
      <div className="space-y-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">AI正在批量生成职位描述</h3>
          <p className="text-gray-600">
            已完成 {progress} / {total} 个岗位
          </p>
        </div>

        {/* 进度条 */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        {/* 岗位状态列表 */}
        <div className="max-h-96 overflow-y-auto space-y-2">
          {batchJobs.map((job) => (
            <div key={job.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1 text-left">
                <span className="font-medium text-gray-900">{job.position}</span>
                <span className="text-gray-600 ml-2">- {job.department}</span>
              </div>
              <div className="flex items-center space-x-2">
                {job.status === 'pending' && (
                  <span className="text-gray-500 text-sm">等待中</span>
                )}
                {job.status === 'processing' && (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                    <span className="text-blue-600 text-sm">生成中</span>
                  </div>
                )}
                {job.status === 'completed' && (
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-600" />
                    <span className="text-green-600 text-sm">已完成</span>
                  </div>
                )}
                {job.status === 'error' && (
                  <div className="flex items-center space-x-2">
                    <ExclamationTriangleIcon className="w-4 h-4 text-red-600" />
                    <span className="text-red-600 text-sm">失败</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 结果导出步骤组件
const ExportStep: React.FC<{
  result: BatchGenerationResult;
  onExport: () => void;
  onBack: () => void;
}> = ({ result, onExport, onBack }) => {
  return (
    <div className="space-y-8">
      {/* 结果统计 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8">
        <div className="flex items-center space-x-3 mb-6">
          <CheckCircleIcon className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-semibold text-gray-900">批量生成完成</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center p-6 bg-blue-50 rounded-xl">
            <div className="text-3xl font-bold text-blue-600 mb-2">{result.total}</div>
            <div className="text-blue-700">总计岗位</div>
          </div>
          <div className="text-center p-6 bg-green-50 rounded-xl">
            <div className="text-3xl font-bold text-green-600 mb-2">{result.completed}</div>
            <div className="text-green-700">成功生成</div>
          </div>
          <div className="text-center p-6 bg-red-50 rounded-xl">
            <div className="text-3xl font-bold text-red-600 mb-2">{result.failed}</div>
            <div className="text-red-700">生成失败</div>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={onExport}
            className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
          >
            <DocumentArrowDownIcon className="w-5 h-5" />
            <span>导出结果</span>
          </button>
          <button
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            重新配置
          </button>
        </div>
      </div>

      {/* 结果预览 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">生成结果预览</h3>
        <div className="max-h-96 overflow-y-auto space-y-4">
          {result.results.map((job) => (
            <div key={job.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">{job.position}</h4>
                  <p className="text-sm text-gray-600">{job.department} · {job.location}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {job.status === 'completed' && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">成功</span>
                  )}
                  {job.status === 'error' && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">失败</span>
                  )}
                  <button className="p-1 text-gray-600 hover:text-gray-900 transition-colors">
                    <EyeIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {job.generatedJD && (
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {job.generatedJD.substring(0, 200)}...
                </div>
              )}
              
              {job.error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                  错误：{job.error}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
