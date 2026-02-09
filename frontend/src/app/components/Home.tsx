import { useState } from 'react';

interface HomeProps {
  onNavigate: (page: 'home' | 'loading' | 'analysis' | 'safeanalysis' | 'mypage' | 
    'search' | 'notification') => void;
  onAnalyze: (text: string) => void;
  apiError?: string | null;
}

export function Home({ onNavigate, onAnalyze, apiError }: HomeProps) {
  const [inputText, setInputText] = useState('');

  const handleAnalyze = () => {
    if (inputText.trim()) {
      onAnalyze(inputText);
      onNavigate('loading');
    }
  };

  return (
    <div className="h-full overflow-y-auto pb-24 pt-8">
      {/* 메인 배너 */}
      <div className="mx-4 mt-6 mb-6 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">지금 받은 그 메세지,<br />안전할까요?</h1>
            <p className="text-sm opacity-90">문자/DM 내용을 복사해서 아래에 붙여넣고 분석하세요.</p>
          </div>
          <div className="text-7xl ml-4">🛡️</div>
        </div>
      </div>

      {/* 에러 표시 */}
      {apiError && (
        <div className="mx-4 mb-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-sm">
          {apiError}
        </div>
      )}

      {/* 입력 영역 */}
      <div className="px-4 mb-6">
        <h2 className="text-xl font-bold mb-3">메시지 내용을 붙여넣으세요</h2>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="의심스러운 문자/DM 내용을 여기에 붙여넣으세요..."
          className="w-full h-56 p-4 bg-gray-50 rounded-2xl text-base border-2 border-gray-200 focus:border-blue-500 outline-none resize-none"
        />

        <button
          onClick={handleAnalyze}
          disabled={!inputText.trim()}
          className={`w-full mt-4 py-5 rounded-2xl text-xl font-bold transition-all ${
            inputText.trim()
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          🔍 분석하기
        </button>

        <div className="mt-3 text-xs text-gray-500 leading-relaxed">
          * 본 데모는 개인정보 보호를 위해 메시지 원문을 서버 저장하지 않는 것을 전제로 합니다(분석 요청 시에만 전송).
        </div>
      </div>
    </div>
  );
}
