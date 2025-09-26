/**
 * MARC - My AI Renumeration Consultant
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
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import './styles/globals.css';

function App() {
  return (
    <Router basename={process.env.NODE_ENV === 'production' ? '/marc.github.io' : '/'}>
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/query" element={<QueryPage />} />
            <Route path="/results" element={<ResultsPage />} />
            
            {/* HR模块路由 */}
            <Route path="/hr" element={<HRDashboard />} />
            <Route path="/hr/recruitment" element={<RecruitmentPage />} />
            <Route path="/hr/audit" element={<SalaryAuditPage />} />
            <Route path="/hr/optimization" element={<OptimizationPage />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;