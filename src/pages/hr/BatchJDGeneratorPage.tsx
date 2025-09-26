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

  // 处理文件上传
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        parseCSVContent(content);
      } catch (error) {
        console.error('文件解析失败:', error);
      }
    };
    reader.readAsText(file);
  };

  // 解析CSV内容
  const parseCSVContent = (content: string) => {
    const lines = content.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    
    const jobs: BatchJobInfo[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length >= headers.length) {
        jobs.push({
          id: `job_${i}`,
          position: values[0] || '',
          department: values[1] || '',
          location: values[2] || '',
          industry: values[3] || '',
          skills: (values[4] || '').split(';').filter(s => s.trim()),
          education: values[5] || '',
          experience: values[6] || '',
          status: 'pending'
        });
      }
    }
    
    setBatchJobs(jobs);
    setCurrentStep('configure');
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
          <Link to="/hr/smart-jd-writer" className="text-dsp-gray hover:text-dsp-red transition-colors">
            <ArrowLeftIcon className="w-6 h-6" />
          </Link>
          <div className="p-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl">
            <CloudArrowUpIcon className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-dsp-dark">批量JD生成器</h1>
            <p className="text-dsp-gray mt-1">一次性生成多个职位描述，提升HR工作效率</p>
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
                        : 'text-dsp-gray'
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
}> = ({ onFileUpload, onAddManual, batchJobs, updateJob, removeJob, onNext, fileInputRef }) => {
  return (
    <div className="space-y-8">
      {/* 上传选项 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CSV上传 */}
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors">
          <CloudArrowUpIcon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-dsp-dark mb-2">上传CSV文件</h3>
          <p className="text-dsp-gray mb-4">批量导入岗位信息，快速开始生成</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            选择文件
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={onFileUpload}
            className="hidden"
          />
          <div className="mt-4 text-sm text-dsp-gray">
            <p>CSV格式：岗位名称,部门,地点,行业,技能,学历,经验</p>
          </div>
        </div>

        {/* 手动添加 */}
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-green-400 transition-colors">
          <PlusIcon className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-dsp-dark mb-2">手动添加</h3>
          <p className="text-dsp-gray mb-4">逐个添加岗位信息，精确控制</p>
          <button
            onClick={onAddManual}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            添加岗位
          </button>
        </div>
      </div>

      {/* 岗位列表 */}
      {batchJobs.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-dsp-dark">岗位列表 ({batchJobs.length})</h3>
            <button
              onClick={onNext}
              disabled={batchJobs.length === 0}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              下一步
            </button>
          </div>

          <div className="space-y-4">
            {batchJobs.map((job) => (
              <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input
                    type="text"
                    placeholder="岗位名称"
                    value={job.position}
                    onChange={(e) => updateJob(job.id, { position: e.target.value })}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <input
                    type="text"
                    placeholder="部门"
                    value={job.department}
                    onChange={(e) => updateJob(job.id, { department: e.target.value })}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <input
                    type="text"
                    placeholder="地点"
                    value={job.location}
                    onChange={(e) => updateJob(job.id, { location: e.target.value })}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <div className="flex items-center space-x-2">
                    <select
                      value={job.industry}
                      onChange={(e) => updateJob(job.id, { industry: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="">选择行业</option>
                      <option value="IT互联网">IT互联网</option>
                      <option value="金融">金融</option>
                      <option value="教育">教育</option>
                      <option value="医疗健康">医疗健康</option>
                      <option value="制造业">制造业</option>
                      <option value="房地产">房地产</option>
                      <option value="零售电商">零售电商</option>
                      <option value="文化娱乐">文化娱乐</option>
                    </select>
                    <button
                      onClick={() => removeJob(job.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
        <h2 className="text-xl font-semibold text-dsp-dark">批量生成配置</h2>
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
            <h3 className="font-medium text-dsp-dark mb-4">文风选择</h3>
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
                  <span className="text-dsp-dark">{styleOption.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 版本选择 */}
          <div>
            <h3 className="font-medium text-dsp-dark mb-4">版本长度</h3>
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
                  <span className="text-dsp-dark">{versionOption.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 语言选择 */}
          <div>
            <h3 className="font-medium text-dsp-dark mb-4">语言版本</h3>
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
                  <span className="text-dsp-dark">{langOption.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex space-x-4 pt-6">
          <button
            onClick={onBack}
            className="flex-1 px-6 py-3 border border-gray-300 text-dsp-gray rounded-lg hover:bg-gray-50 transition-colors"
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
          <h3 className="text-xl font-semibold text-dsp-dark mb-2">AI正在批量生成职位描述</h3>
          <p className="text-dsp-gray">
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
                <span className="font-medium text-dsp-dark">{job.position}</span>
                <span className="text-dsp-gray ml-2">- {job.department}</span>
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
          <h2 className="text-xl font-semibold text-dsp-dark">批量生成完成</h2>
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
            className="px-6 py-3 border border-gray-300 text-dsp-gray rounded-lg hover:bg-gray-50 transition-colors"
          >
            重新配置
          </button>
        </div>
      </div>

      {/* 结果预览 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-dsp-dark mb-4">生成结果预览</h3>
        <div className="max-h-96 overflow-y-auto space-y-4">
          {result.results.map((job) => (
            <div key={job.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-dsp-dark">{job.position}</h4>
                  <p className="text-sm text-dsp-gray">{job.department} · {job.location}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {job.status === 'completed' && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">成功</span>
                  )}
                  {job.status === 'error' && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">失败</span>
                  )}
                  <button className="p-1 text-dsp-gray hover:text-dsp-dark transition-colors">
                    <EyeIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {job.generatedJD && (
                <div className="text-sm text-dsp-gray bg-gray-50 p-3 rounded-lg">
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
