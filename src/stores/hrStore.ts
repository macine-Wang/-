/**
 * HR模块全局状态管理
 * 用于在薪酬审计和优化方案之间传递数据
 */

import { create } from 'zustand';

export interface EmployeeData {
  name: string;
  position: string;
  department: string;
  salary: number;
  experience: string;
  education: string;
  location: string;
}

export interface MarketBenchmark {
  position: string;
  marketMin: number;
  marketMedian: number;
  marketMax: number;
  competitiveness: 'low' | 'medium' | 'high';
  recommendation: string;
}

export interface AuditReport {
  totalEmployees: number;
  averageSalary: number;
  marketComparison: {
    aboveMarket: number;
    atMarket: number;
    belowMarket: number;
  };
  departmentAnalysis: Record<string, {
    count: number;
    avgSalary: number;
    marketGap: number;
  }>;
  recommendations: string[];
  companyProfile?: {
    industry: string;
    size: string;
    location: string;
  };
}

export interface DetailedAuditData {
  employees: EmployeeData[];
  benchmarks: MarketBenchmark[];
  report: AuditReport;
  auditDate: Date;
}

interface HRStore {
  // 审计数据
  auditData: DetailedAuditData | null;
  
  // 设置审计数据
  setAuditData: (data: DetailedAuditData) => void;
  
  // 清除审计数据
  clearAuditData: () => void;
  
  // 检查是否有审计数据
  hasAuditData: () => boolean;
  
  // 获取公司概况（用于优化方案）
  getCompanyProfile: () => {
    industry: string;
    size: string;
    totalEmployees: number;
    averageSalary: number;
    departments: string[];
    locations: string[];
  } | null;
}

export const useHRStore = create<HRStore>((set, get) => ({
  auditData: null,
  
  setAuditData: (data: DetailedAuditData) => {
    set({ auditData: data });
  },
  
  clearAuditData: () => {
    set({ auditData: null });
  },
  
  hasAuditData: () => {
    return get().auditData !== null;
  },
  
  getCompanyProfile: () => {
    const { auditData } = get();
    if (!auditData) return null;
    
    // 从审计数据中提取公司概况
    const departments = [...new Set(auditData.employees.map(emp => emp.department))];
    const locations = [...new Set(auditData.employees.map(emp => emp.location))];
    
    // 根据员工数量推断公司规模
    const totalEmployees = auditData.employees.length;
    let size = 'small';
    if (totalEmployees >= 1000) size = 'large';
    else if (totalEmployees >= 200) size = 'medium';
    else if (totalEmployees >= 50) size = 'small';
    else size = 'startup';
    
    // 根据职位类型推断行业
    const positions = auditData.employees.map(emp => emp.position.toLowerCase());
    let industry = '其他';
    if (positions.some(p => p.includes('开发') || p.includes('程序') || p.includes('技术'))) {
      industry = '互联网';
    } else if (positions.some(p => p.includes('金融') || p.includes('投资'))) {
      industry = '金融';
    } else if (positions.some(p => p.includes('销售') || p.includes('市场'))) {
      industry = '零售';
    }
    
    return {
      industry,
      size,
      totalEmployees,
      averageSalary: auditData.report.averageSalary,
      departments,
      locations
    };
  }
}));