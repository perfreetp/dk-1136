import { Notification } from '@/types';
import { storage, STORAGE_KEYS } from '@/utils/storage';

interface Dispute {
  id: string;
  matchId: string;
  eventId: string;
  reason: string;
  status: 'pending' | 'resolved';
  result?: string;
  time: string;
}

let notifications: Notification[] = storage.get(STORAGE_KEYS.NOTIFICATIONS) || [
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

let disputes: Dispute[] = storage.get(STORAGE_KEYS.DISPUTES) || [];

export const getNotifications = (): Notification[] => notifications;

export const addNotification = (notification: Notification): void => {
  notifications.unshift(notification);
  storage.set(STORAGE_KEYS.NOTIFICATIONS, notifications);
};

export const markAsRead = (id: string): void => {
  const notification = notifications.find(n => n.id === id);
  if (notification) {
    notification.isRead = true;
    storage.set(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }
};

export const markAllAsRead = (): void => {
  notifications = notifications.map(n => ({ ...n, isRead: true }));
  storage.set(STORAGE_KEYS.NOTIFICATIONS, notifications);
};

export const getUnreadCount = (): number => {
  return notifications.filter(n => !n.isRead).length;
};

export const submitDispute = (matchId: string, eventId: string, reason: string): void => {
  const dispute: Dispute = {
    id: `d_${Date.now()}`,
    matchId,
    eventId,
    reason,
    status: 'pending',
    time: new Date().toISOString().replace('T', ' ').substring(0, 16)
  };
  disputes.push(dispute);
  storage.set(STORAGE_KEYS.DISPUTES, disputes);

  const notification: Notification = {
    id: `n_${Date.now()}`,
    type: 'match',
    title: '裁决申请已提交',
    content: `您的裁决申请已提交，请等待处理结果。`,
    time: '刚刚',
    isRead: false,
    eventId
  };
  addNotification(notification);
};

export const resolveDispute = (disputeId: string, result: string): void => {
  const dispute = disputes.find(d => d.id === disputeId);
  if (dispute) {
    dispute.status = 'resolved';
    dispute.result = result;
    storage.set(STORAGE_KEYS.DISPUTES, disputes);

    const notification: Notification = {
      id: `n_${Date.now()}`,
      type: 'match',
      title: '裁决结果通知',
      content: `您的裁决申请已处理，结果：${result}`,
      time: '刚刚',
      isRead: false,
      eventId: dispute.eventId
    };
    addNotification(notification);
  }
};