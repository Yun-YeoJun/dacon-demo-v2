import { useEffect } from 'react';
import { api, type AnalyzeResponse } from '../api/client';

interface LoadingProps {
  onNavigate: (page: 'home' | 'loading' | 'analysis' | 'safeanalysis' | 'mypage' | 
    'search' | 'notification') => void;
  analysisText: string;
  setAnalysisResponse: (r: AnalyzeResponse | null) => void;
  setApiError: (msg: string | null) => void;
}

export function Loading({ onNavigate, analysisText, setAnalysisResponse, setApiError }: LoadingProps) {
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setApiError(null);
        const requestId = `req_${Date.now()}`;
        const res = await api.analyze(analysisText, requestId, "sms");

        if (cancelled) return;

        setAnalysisResponse(res);

        if (res.result.label === "스미싱") onNavigate('analysis');
        else onNavigate('safeanalysis');
      } catch (e: any) {
        if (cancelled) return;
        setAnalysisResponse(null);
        setApiError(e?.message || '분석 API 호출에 실패했습니다.');
        onNavigate('home');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [onNavigate, analysisText, setAnalysisResponse, setApiError]);

  return (
    <div className="h-full flex flex-col items-center justify-center pt-8 px-4">
      <div className="mb-8">
        <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
          <div className="text-6xl">🔍</div>
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-2">분석 중입니다</h1>
      <p className="text-base text-gray-500 mb-8">LLM 모델로 메시지를 분석하고 있습니다...</p>

      <div className="w-full max-w-xs h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 rounded-full animate-[loading_2s_ease-in-out]" 
             style={{ animation: 'loading 2s ease-out forwards' }} />
      </div>

      <style>{`
        @keyframes loading {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}
