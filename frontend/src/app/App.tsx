import { useState } from 'react';
import { Home } from './components/Home';
import { Loading } from './components/Loading';
import { AnalysisResult } from './components/AnalysisResult';
import { SafeAnalysisResult } from './components/SafeAnalysisResult';
import { MyPage } from './components/MyPage';
import { Search } from './components/Search';
import { Notification } from './components/Notification';
import type { AnalyzeResponse } from './api/client';

export default function App() {
  const [currentPage, setCurrentPage] = useState<
    'home' | 'loading' | 'analysis' | 'safeanalysis' | 'mypage' | 
    'search' | 'notification'
  >('home');

  const [unreadNotifications, setUnreadNotifications] = useState(3);

  // 사용자가 붙여넣은 원문
  const [analysisText, setAnalysisText] = useState('');

  // LLM 분석 결과(실제 API 응답)
  const [analysisResponse, setAnalysisResponse] = useState<AnalyzeResponse | null>(null);

  const [apiError, setApiError] = useState<string | null>(null);

  const handleAnalyze = (text: string) => {
    setAnalysisText(text);
    setAnalysisResponse(null);
    setApiError(null);
  };

  return (
    <div className="size-full flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md h-full bg-white relative">
        <div className="h-full">
          {currentPage === 'home' && (
            <Home
              onNavigate={setCurrentPage}
              onAnalyze={handleAnalyze}
              apiError={apiError}
            />
          )}

          {currentPage === 'loading' && (
            <Loading
              onNavigate={setCurrentPage}
              analysisText={analysisText}
              setAnalysisResponse={setAnalysisResponse}
              setApiError={setApiError}
            />
          )}

          {currentPage === 'analysis' && (
            <AnalysisResult
              onNavigate={setCurrentPage}
              messageText={analysisText}
              analysisResponse={analysisResponse}
              apiError={apiError}
            />
          )}

          {currentPage === 'safeanalysis' && (
            <SafeAnalysisResult
              onNavigate={setCurrentPage}
              messageText={analysisText}
              analysisResponse={analysisResponse}
              apiError={apiError}
            />
          )}

          {currentPage === 'mypage' && <MyPage onNavigate={setCurrentPage} />}
          {currentPage === 'search' && <Search onNavigate={setCurrentPage} />}
          {currentPage === 'notification' && (
            <Notification
              onNavigate={setCurrentPage}
              unreadCount={unreadNotifications}
              setUnreadCount={setUnreadNotifications}
            />
          )}
        </div>

        {/* 하단 네비게이션 바 */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-white border-t border-gray-200">
          <div className="flex justify-around items-center h-14">
            <button className="flex flex-col items-center gap-1" onClick={() => setCurrentPage('search')}>
              <div className={`w-6 h-6 ${currentPage === 'search' ? 'text-blue-500' : 'text-gray-400'}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </div>
            </button>

            <button className="flex flex-col items-center gap-1" onClick={() => setCurrentPage('home')}>
              <div className={`w-8 h-8 ${currentPage === 'home' ? 'text-blue-500' : 'text-gray-400'}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                </svg>
              </div>
            </button>

            <button className="flex flex-col items-center gap-1 relative" onClick={() => setCurrentPage('notification')}>
              <div className={`w-6 h-6 ${currentPage === 'notification' ? 'text-blue-500' : 'text-gray-400'}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </div>
              {unreadNotifications > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{unreadNotifications}</span>
                </div>
              )}
            </button>
          </div>
          <div className="h-6 bg-white" />
        </div>
      </div>
    </div>
  );
}
