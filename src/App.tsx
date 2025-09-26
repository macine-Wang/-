/**
 * ISMT - Intelligent Salary Management Tool
 * 主应用程序组件
 */


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { QueryPage } from '@/pages/QueryPage';
import { ResultsPage } from '@/pages/ResultsPage';
import { HRDashboard } from '@/pages/hr/HRDashboard';
import { RecruitmentPage } from '@/pages/hr/RecruitmentPage';
import { SalaryAuditPage } from '@/pages/hr/SalaryAuditPage';
import { OptimizationPage } from '@/pages/hr/OptimizationPage';
import { SalaryDiagnosisPage } from '@/pages/hr/SalaryDiagnosisPage';
import { DynamicSalaryAdjustmentPage } from '@/pages/hr/DynamicSalaryAdjustmentPage';
import { SalaryCompetitivenessRadarPage } from '@/pages/hr/SalaryCompetitivenessRadarPage';
import { AISalaryAdvisorPage } from '@/pages/hr/AISalaryAdvisorPage';
import { SalaryFairnessDetectorPage } from '@/pages/hr/SalaryFairnessDetectorPage';
import { SmartJDWriterPage } from '@/pages/hr/SmartJDWriterPage';
import { BatchJDGeneratorPage } from '@/pages/hr/BatchJDGeneratorPage';
import { ApiDemoPage } from '@/pages/ApiDemoPage';
import { JobseekerCenter } from '@/pages/JobseekerCenter';
import { CareerPlanningPage } from '@/pages/jobseeker/CareerPlanningPage';
import { MarketInsightsPage } from '@/pages/jobseeker/MarketInsightsPage';
import { SalaryCalculatorPage } from '@/pages/jobseeker/SalaryCalculatorPage';
import { InterviewNegotiationPage } from '@/pages/jobseeker/InterviewNegotiationPage';
import { SalaryMonitoringPage } from '@/pages/jobseeker/SalaryMonitoringPage';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import './styles/globals.css';

function App() {
  return (
    <Router basename={process.env.NODE_ENV === 'production' ? '/ismt.github.io' : '/'}>
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/query" element={<QueryPage />} />
            <Route path="/results" element={<ResultsPage />} />
            
            {/* 求职者模块路由 */}
            <Route path="/jobseeker" element={<JobseekerCenter />} />
            <Route path="/career-planning" element={<CareerPlanningPage />} />
            <Route path="/market-insights" element={<MarketInsightsPage />} />
            <Route path="/salary-calculator" element={<SalaryCalculatorPage />} />
            <Route path="/interview-prep" element={<InterviewNegotiationPage />} />
            <Route path="/salary-alerts" element={<SalaryMonitoringPage />} />
            
            {/* HR模块路由 */}
            <Route path="/hr" element={<HRDashboard />} />
            <Route path="/hr/recruitment" element={<RecruitmentPage />} />
            <Route path="/hr/audit" element={<SalaryAuditPage />} />
            <Route path="/hr/optimization" element={<OptimizationPage />} />
                <Route path="/hr/diagnosis" element={<SalaryDiagnosisPage />} />
                <Route path="/hr/dynamic-adjustment" element={<DynamicSalaryAdjustmentPage />} />
                <Route path="/hr/competitiveness-radar" element={<SalaryCompetitivenessRadarPage />} />
                <Route path="/hr/ai-advisor" element={<AISalaryAdvisorPage />} />
                <Route path="/hr/fairness-detector" element={<SalaryFairnessDetectorPage />} />
                <Route path="/hr/smart-jd-writer" element={<SmartJDWriterPage />} />
                <Route path="/hr/batch-jd-generator" element={<BatchJDGeneratorPage />} />
                
                {/* API演示页面 */}
                <Route path="/api-demo" element={<ApiDemoPage />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;