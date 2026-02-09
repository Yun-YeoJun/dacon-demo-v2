import { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';

interface SearchProps {
  onNavigate: (page: 'home' | 'loading' | 'analysis' | 'safeanalysis' | 'mypage' | 
    'search' | 'notification') => void;
}

export function Search({ onNavigate }: SearchProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // 검색 이력 데이터
  const allSearchHistory = [
    { id: 1, sender: '국세청', content: '세금 환급이 있습니다', date: '2025.07.15', type: '문자', isPhishing: true },
    { id: 2, sender: '삼성페이', content: '결제 승인되었습니다', date: '2025.07.15', type: '문자', isPhishing: false },
    { id: 3, sender: '택배', content: '배송이 완료되었습니다', date: '2025.07.27', type: '문자', isPhishing: false },
    { id: 4, sender: '남현', content: '내일 식사 갈래?', date: '2025.07.20', type: 'DM', isPhishing: false },
    { id: 5, sender: '알 수 없음', content: '긴급 송금 요청', date: '2025.07.10', type: '문자', isPhishing: true },
    { id: 6, sender: '애플리', content: '비밀번호 변경 안내', date: '2025.07.15', type: '메일', isPhishing: true },
  ];

  // 검색 필터링
  const filteredHistory = searchQuery
    ? allSearchHistory.filter(
        (item) =>
          item.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allSearchHistory;

  return (
    <div className="h-full flex flex-col pt-8">
      {/* 헤더 */}
      <div className="px-4 py-4 border-b flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
          <span className="text-white text-xs">🛡️</span>
        </div>
        <h1 className="text-xl font-bold flex-1">검색</h1>
      </div>

      {/* 검색 바 */}
      <div className="px-4 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="분석한 내용 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-4 pr-12 bg-gray-100 rounded-2xl text-base border-none outline-none"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
            <SearchIcon className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* 검색 결과 */}
      <div className="px-4">
        <h3 className="text-lg font-bold mb-3">
          {searchQuery ? `검색 결과 (${filteredHistory.length})` : '전체 분석 내역'}
        </h3>

        {filteredHistory.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-3">🔍</div>
            <div className="text-base">검색 결과가 없습니다</div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredHistory.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.isPhishing ? 'analysis' : 'safeanalysis')}
                className={`w-full ${
                  item.isPhishing ? 'bg-red-50' : 'bg-green-50'
                } rounded-xl p-4 text-left hover:scale-[1.02] transition-transform`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-12 h-12 ${
                      item.isPhishing ? 'bg-red-500' : 'bg-green-500'
                    } rounded-xl flex items-center justify-center flex-shrink-0`}
                  >
                    <span className="text-white text-xl">
                      {item.isPhishing ? '⚠️' : '✅'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="text-base font-bold">{item.sender}</div>
                      <div className="text-xs text-gray-500 px-2 py-0.5 bg-white rounded">
                        {item.type}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 truncate mb-1">{item.content}</div>
                    <div className="text-xs text-gray-400">{item.date}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}