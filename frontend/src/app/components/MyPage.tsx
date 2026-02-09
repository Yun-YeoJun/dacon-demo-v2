import { ChevronRight, User, FileText, Bell, LogOut, Settings } from 'lucide-react';

interface MyPageProps {
  onNavigate: (page: 'home' | 'messages' | 'analysis' | 'safeanalysis' | 'mypage' | 
    'search' | 'notification') => void;
}

export function MyPage({ onNavigate }: MyPageProps) {
  const menuItems = [
    { id: 1, icon: '👤', label: '내 정보 설정', color: 'bg-blue-100' },
    { id: 2, icon: '📊', label: '분석 내역', color: 'bg-green-100' },
    { id: 3, icon: '⚙️', label: '앱 설정', color: 'bg-purple-100' },
    { id: 4, icon: '💬', label: '고객센터', color: 'bg-orange-100' },
    { id: 5, icon: '📋', label: '이용약관', color: 'bg-pink-100' },
  ];

  return (
    <div className="h-full flex flex-col pt-8">
      {/* 헤더 */}
      <div className="px-4 py-4 border-b flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
          <span className="text-white text-xs">🛡️</span>
        </div>
        <h1 className="text-xl font-bold">Smashing</h1>
      </div>

      {/* 프로필 섹션 */}
      <div className="mx-4 mb-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl p-6 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-white bg-opacity-30 rounded-full flex items-center justify-center backdrop-blur-sm">
            <span className="text-4xl">👤</span>
          </div>
          <div className="text-white flex-1">
            <h3 className="text-2xl font-bold mb-2">이도현</h3>
            <div className="text-sm opacity-90">dohyun@smashing.com</div>
          </div>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="mx-4 mb-6 grid grid-cols-3 gap-3">
        <div className="bg-blue-50 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">24</div>
          <div className="text-xs text-gray-600">분석 횟수</div>
        </div>
        <div className="bg-red-50 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-red-600 mb-1">8</div>
          <div className="text-xs text-gray-600">위험 탐지</div>
        </div>
        <div className="bg-green-50 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">16</div>
          <div className="text-xs text-gray-600">안전 확인</div>
        </div>
      </div>

      {/* 메뉴 리스트 */}
      <div className="px-4">
        <h3 className="text-lg font-bold mb-3">설정</h3>
        {menuItems.map((item) => (
          <button
            key={item.id}
            className="w-full flex items-center gap-4 py-4 border-b border-gray-100 hover:bg-gray-50"
          >
            <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center text-xl flex-shrink-0`}>
              {item.icon}
            </div>
            <div className="flex-1 text-left text-base font-bold">
              {item.label}
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
          </button>
        ))}
        
        {/* 로그아웃 버튼 */}
        <button className="w-full mt-4 py-4 bg-gray-100 rounded-2xl text-base font-bold text-gray-700 hover:bg-gray-200">
          🚪 로그아웃
        </button>
      </div>
    </div>
  );
}