import { Routes, Route } from 'react-router-dom';
import TopNavbar from './components/layout/TopNavbar';
import LandingPage from './pages/LandingPage';
import AnalyzerPage from './pages/AnalyzerPage';
import ComparePage from './pages/ComparePage';
import AlgorithmLabPage from './pages/AlgorithmLabPage';
import PerformancePage from './pages/PerformancePage';
import ReportsPage from './pages/ReportsPage';
import ResultsPage from './pages/ResultsPage';
import { AnalysisProvider } from './context/AnalysisContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <AnalysisProvider>
        <div className="app-container">
          <TopNavbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/analyze" element={<AnalyzerPage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/algorithms" element={<AlgorithmLabPage />} />
              <Route path="/performance" element={<PerformancePage />} />
              <Route path="/reports" element={<ReportsPage />} />
            </Routes>
          </main>
        </div>
      </AnalysisProvider>
    </ThemeProvider>
  );
}

export default App;
