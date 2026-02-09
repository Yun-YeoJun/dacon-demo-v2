import type { AnalyzeResponse } from '../api/client';

interface SafeAnalysisResultProps {
  onNavigate: (page: 'home' | 'loading' | 'analysis' | 'safeanalysis' | 'mypage' | 
    'search' | 'notification') => void;
  messageText: string;
  analysisResponse: AnalyzeResponse | null;
  apiError?: string | null;
}

export function SafeAnalysisResult({ onNavigate, messageText, analysisResponse, apiError }: SafeAnalysisResultProps) {
  const reasons = analysisResponse?.result?.reasons || [];

  return (
    <div className="h-full flex flex-col pt-8">
      <div className="px-4 py-4 border-b flex items-center gap-3">
        <button 
          onClick={() => onNavigate('home')}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 className="text-xl font-bold flex-1">분석 결과</h1>
      </div>

      {apiError && (
        <div className="mx-4 mt-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-sm">
          {apiError}
        </div>
      )}

      <div className="mx-4 my-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl p-8 text-white text-center shadow-lg">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-bold">안전한 메시지입니다</h2>
        {analysisResponse?.result?.score != null && (
          <div className="mt-2 text-sm opacity-90">점수: {analysisResponse.result.score}</div>
        )}
      </div>

      <div className="mx-4 mb-6">
        <h3 className="text-lg font-bold mb-3">메시지 내용</h3>
        <div className="bg-gray-50 rounded-2xl p-5">
          <p className="text-base leading-relaxed text-gray-700 whitespace-pre-wrap">
            {messageText || '분석할 메시지가 없습니다.'}
          </p>
        </div>
      </div>

      <div className="mx-4 mb-6">
        <h3 className="text-lg font-bold mb-3">AI 판단 근거</h3>

        {reasons.length === 0 ? (
          <div className="text-sm text-gray-500">근거가 제공되지 않았습니다.</div>
        ) : (
          <div className="space-y-3">
            {reasons.map((r, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-green-50 rounded-xl p-4">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div className="text-sm text-gray-700 leading-relaxed">{r}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mx-4 flex gap-3">
        <button 
          onClick={() => onNavigate('home')}
          className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-2xl text-base font-bold hover:bg-gray-300"
        >
          🏠 홈으로
        </button>
        <button
          onClick={() => {
            const text = `[Smashing 분석]\n결과: 안전\n\n메시지:\n${messageText}`;
            navigator.clipboard?.writeText(text).catch(() => {});
          }}
          className="flex-1 bg-blue-500 text-white py-4 rounded-2xl text-base font-bold shadow-md hover:bg-blue-600"
        >
          📤 결과 복사
        </button>
      </div>
    </div>
  );
}
