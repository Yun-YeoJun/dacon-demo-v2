interface EmailSelectProps {
  onNavigate: (page: 'home' | 'messages' | 'analysis' | 'forgery' | 'mypage' | 
    'dmselect' | 'facebook' | 'instagram' | 'emailselect' | 'emaillist') => void;
}

export function EmailSelect({ onNavigate }: EmailSelectProps) {
  return (
    <div className="h-full overflow-y-auto pb-24 bg-white">
      {/* 헤더 */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-gray-600">9:41</div>
          <div className="flex items-center gap-1">
            <div className="text-xs">📶</div>
            <div className="text-xs">📡</div>
            <div className="text-xs">🔋</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600 mb-4">
          <span>↙️</span>
          <span>smashing.com/home</span>
          <span className="ml-auto">⋯</span>
        </div>
      </div>

      {/* 상단 로고 */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs">🛡️</span>
          </div>
          <h1 className="text-xl font-bold">Smashing</h1>
        </div>
      </div>

      {/* 제목 */}
      <div className="px-4 mb-8">
        <h2 className="text-2xl font-bold mb-2">메일 탐지</h2>
      </div>

      {/* 이메일 플랫폼 선택 */}
      <div className="px-4 flex flex-col items-center gap-6 pt-12">
        <button 
          onClick={() => onNavigate('emaillist')}
          className="w-32 h-32 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex flex-col items-center justify-center text-white shadow-lg hover:scale-105 transition-transform"
        >
          <div className="text-5xl mb-2">✉️</div>
          <div className="text-base font-bold">네이버 메일</div>
        </button>

        <button 
          onClick={() => onNavigate('emaillist')}
          className="w-32 h-32 bg-gradient-to-br from-red-500 via-yellow-500 to-blue-500 rounded-3xl flex flex-col items-center justify-center text-white shadow-lg hover:scale-105 transition-transform"
        >
          <div className="text-5xl mb-2">📧</div>
          <div className="text-base font-bold">Gmail</div>
        </button>
      </div>
    </div>
  );
}
