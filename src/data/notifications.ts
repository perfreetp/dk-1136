import { Notification } from '@/types';

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'event',
    title: '赛事即将开始',
    content: '您报名的「周末英雄联盟争霸赛」将于今天14:00开始，请准时签到！',
    time: '10分钟前',
    isRead: false,
    eventId: '1'
  },
  {
    id: 'n2',
    type: 'match',
    title: '比赛结果通知',
    content: '恭喜您的战队在「无畏契约新人赛」中获胜，成功晋级下一轮！',
    time: '1小时前',
    isRead: false,
    eventId: '2'
  },
  {
    id: 'n3',
    type: 'system',
    title: '系统通知',
    content: '您的账号已完成实名认证，现在可以报名参加所有赛事了！',
    time: '2小时前',
    isRead: true
  },
  {
    id: 'n4',
    type: 'event',
    title: '报名成功',
    content: '您已成功报名「DOTA2水友赛」，请按时参加比赛。',
    time: '昨天',
    isRead: true,
    eventId: '3'
  },
  {
    id: 'n5',
    type: 'match',
    title: '比赛提醒',
    content: '「CS:GO枪王争霸」第二轮比赛即将开始，请做好准备！',
    time: '昨天',
    isRead: true,
    eventId: '4'
  },
  {
    id: 'n6',
    type: 'system',
    title: '活动通知',
    content: '新用户专享：首次报名赛事立减10元，快来参与吧！',
    time: '2天前',
    isRead: true
  },
  {
    id: 'n7',
    type: 'match',
    title: '裁决结果',
    content: '您申请的裁决已处理，比分已更正为13:11。',
    time: '1周前',
    isRead: true,
    eventId: '1'
  },
  {
    id: 'n8',
    type: 'event',
    title: '新赛事上线',
    content: '「英雄联盟情侣双排赛」开始报名啦，快来参加！',
    time: '3天前',
    isRead: true,
    eventId: '6'
  }
];

export const getUnreadCount = (): number => {
  return mockNotifications.filter(n => !n.isRead).length;
};

export const getNotifications = (): Notification[] => {
  return mockNotifications;
};

export const markAsRead = (id: string): void => {
  const notification = mockNotifications.find(n => n.id === id);
  if (notification) {
    notification.isRead = true;
  }
};