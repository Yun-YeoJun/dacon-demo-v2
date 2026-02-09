interface EmailListProps {
  onNavigate: (page: 'home' | 'messages' | 'analysis' | 'forgery' | 'mypage' | 
    'dmselect' | 'facebook' | 'instagram' | 'emailselect' | 'emaillist') => void;
}

export function EmailList({ onNavigate }: EmailListProps) {
  const emails = [
    { 
      id: 1, 
      sender: '애플리', 
      subject: '비즈니스 계정을 확인하세요',
      preview: '귀하의 계정 비밀번호가 변경되었습니다.',
      date: '2025.07.15',
      emoji: '😊',
      color: 'bg-purple-100'
    },
    { 
      id: 2, 
      sender: '애플리', 
      preview: '비밀번호 변경 안내 알림',
      subject: '비밀번호 변경 안내 알림',
      date: '2025.07.15',
      emoji: '😊',
      color: 'bg-purple-100'
    },
    { 
      id: 3, 
      sender: '애플리', 
      preview: '파격정책에 변경사항이 있습니다',
      subject: '파격정책에 변경사항이 있습니다',
      date: '2025.07.27',
      emoji: '😊',
      color: 'bg-purple-100'
    },
  ];

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
          <span>smashing.com/email</span>
          <span className="ml-auto">⋯</span>
        </div>
      </div>

      {/* 상단 로고 및 제목 */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs">🛡️</span>
          </div>
          <h1 className="text-xl font-bold">Smashing</h1>
        </div>
        <h2 className="text-2xl font-bold mb-1">메일함</h2>
        <p className="text-sm text-gray-500">수신한 메일을 확인하세요</p>
      </div>

      {/* 메일 목록 */}
      <div className="px-4">
        {emails.map((email) => (
          <button
            key={email.id}
            onClick={() => onNavigate('analysis')}
            className="w-full flex items-start gap-4 py-4 border-b border-gray-100 hover:bg-gray-50"
          >
            <div className={`w-14 h-14 ${email.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
              <span className="text-2xl font-bold">애</span>
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="text-base font-bold mb-1">{email.sender}</div>
              <div className="text-sm font-medium text-gray-700 mb-1 truncate">{email.subject}</div>
              <div className="text-xs text-gray-400 truncate">{email.preview}</div>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <div className="text-xs text-gray-400">{email.date}</div>
              <div className="text-lg">{email.emoji}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
