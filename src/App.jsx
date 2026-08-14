import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Home from './pages/Home';
import CandidateSetup from './pages/CandidateSetup';
import InterviewRoom from './pages/InterviewRoom';
import CreateInterview from './pages/CreateInterview';
import ScheduledInterviews from './pages/ScheduledInterviews';
import Report from './pages/Report';
import InterviewDetailReport from './pages/InterviewDetailReport';
import { PATHS } from './utils/paths';
import './App.css';

function App() {
  return (
    <Router>
      <DashboardLayout>
        <Routes>
          <Route path={PATHS.HOME} element={<Home />} />
          <Route path={PATHS.CREATE} element={<CreateInterview />} />
          <Route path={PATHS.SCHEDULED} element={<ScheduledInterviews />} />
          <Route path={PATHS.SETUP} element={<CandidateSetup />} />
          <Route path={PATHS.INTERVIEW} element={<InterviewRoom />} />
          <Route path={PATHS.REPORT} element={<Report />} />
          <Route path={PATHS.DETAIL_REPORT} element={<InterviewDetailReport />} />
        </Routes>
      </DashboardLayout>
    </Router>
  );
}

export default App;
