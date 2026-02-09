import { useEffect } from 'react';

interface NotificationProps {
  onNavigate: (page: 'home' | 'loading' | 'analysis' | 'safeanalysis' | 'mypage' | 
    'search' | 'notification') => void;
  unreadCount: number;
  setUnreadCount: (count: number) => void;
}

export function Notification({ onNavigate, unreadCount, setUnreadCount }: NotificationProps) {
  // 페이지 진입 시 알림을 읽음 처리
  useEffect(() => {
    setUnreadCount(0);
  }, [setUnreadCount]);

  const notifications = [
    {
      id: 1,
      title: '⚠️ 스미싱 위험 메세지 탐지',
      message: '택배 배송 확인 링크를 요구하는 메세지에서 피싱 위험이 감지되었습니다.',
      time: '5분 전',
      isRead: false,
    },
    {
      id: 2,
      title: '⚠️ 스미싱 위험 메세지 탐지',
      message: '세금 환급 관련 메세지가 의심스럽습니다.',
      time: '1시간 전',
      isRead: false,
    },
    {
      id: 3,
      title: '⚠️ 스미싱 위험 메세지 탐지',
      message: '비밀번호 변경을 요구하는 메세지에 피싱 링크가 포함되어 있습니다.',
      time: '3시간 전',
      isRead: false,
    },
    {
      id: 4,
      title: '⚠️ 스미싱 위험 메세지 탐지',
      message: '긴급 송금을 요청하는 문자가 탐지되었습니다.',
      time: '1일 전',
      isRead: true,
    },
    {
      id: 5,
      title: '⚠️ 스미싱 위험 메세지 탐지',
      message: '의심스러운 링크가 포함된 메세지가 발견되었습니다.',
      time: '2일 전',
      isRead: true,
    },
  ];

  return (
    <div className="h-full flex flex-col pt-8">
      {/* 헤더 */}
      <div className="px-4 py-4 border-b flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
          <span className="text-white text-xs">🛡️</span>
        </div>
        <h1 className="text-xl font-bold flex-1">알림</h1>
      </div>

      {/* 알림 제목 */}
      <div className="px-4 mb-6">
        <h2 className="text-2xl font-bold mb-1">알림</h2>
        <p className="text-sm text-gray-500">스미싱 탐지 알림 내역</p>
      </div>

      {/* 알림 목록 */}
      <div className="px-4">
        {notifications.map((notification) => (
          <button
            key={notification.id}
            onClick={() => onNavigate('analysis')}
            className={`w-full p-4 mb-3 rounded-2xl text-left hover:bg-gray-50 border ${
              notification.isRead ? 'bg-white border-gray-200' : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="text-base font-bold">{notification.title}</div>
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                  )}
                </div>
                <div className="text-sm text-gray-600 mb-2">{notification.message}</div>
                <div className="text-xs text-gray-400">{notification.time}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}