import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { Notification } from '@/types';
import { getNotifications, markAsRead, markAllAsRead, getUnreadCount } from '@/data/notifications';
import styles from './index.module.scss';

type FilterType = 'all' | 'event' | 'match' | 'system';

const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  useDidShow(() => {
    setNotifications([...getNotifications()]);
    setUnreadCount(getUnreadCount());
  });

  const filteredNotifications = activeFilter === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === activeFilter);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'event': return '🏆';
      case 'match': return '🎮';
      case 'system': return '📢';
      default: return '📋';
    }
  };

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
    setNotifications([...getNotifications()]);
    setUnreadCount(getUnreadCount());
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    setNotifications([...getNotifications()]);
    setUnreadCount(0);
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
    
    if (notification.eventId) {
      Taro.navigateTo({
        url: `/pages/detail/index?id=${notification.eventId}`
      });
    }
  };

  const getFilterLabel = (filter: FilterType) => {
    switch (filter) {
      case 'all': return '全部';
      case 'event': return '赛事';
      case 'match': return '比赛';
      case 'system': return '系统';
      default: return '';
    }
  };

  return (
    <View className={styles.notificationPage}>
      <View className={styles.header}>
        <View className={styles.headerTitle}>通知中心</View>
        <View className={styles.headerStats}>
          <View className={styles.unreadBadge}>
            <Text className={styles.unreadCount}>{unreadCount}条未读</Text>
          </View>
          {unreadCount > 0 && (
            <View className={styles.markAllBtn} onClick={handleMarkAllAsRead}>
              <Text className={styles.markAllText}>全部已读</Text>
            </View>
          )}
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.tabList}>
          {(['all', 'event', 'match', 'system'] as FilterType[]).map(filter => (
            <View
              key={filter}
              className={`${styles.tabItem} ${activeFilter === filter ? styles.tabItemActive : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              <Text className={`${styles.tabText} ${activeFilter === filter ? styles.tabTextActive : ''}`}>
                {getFilterLabel(filter)}
              </Text>
            </View>
          ))}
        </View>

        {filteredNotifications.length > 0 ? (
          <View className={styles.notificationList}>
            {filteredNotifications.map(notification => (
              <View 
                key={notification.id}
                className={`${styles.notificationCard} ${!notification.isRead ? styles.notificationCardUnread : ''}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <View className={styles.notificationHeader}>
                  <View className={styles.notificationIconWrapper}>
                    <Text className={styles.notificationIcon}>{getNotificationIcon(notification.type)}</Text>
                  </View>
                  <View className={styles.notificationInfo}>
                    <Text className={styles.notificationTitle}>{notification.title}</Text>
                    <Text className={styles.notificationTime}>{notification.time}</Text>
                  </View>
                  {!notification.isRead && <View className={styles.unreadDot} />}
                </View>
                <Text className={styles.notificationContent}>{notification.content}</Text>
                {notification.eventId && (
                  <View className={styles.notificationActions}>
                    <View className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}>
                      <Text className={styles.actionBtnText}>查看详情</Text>
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📭</Text>
            <Text className={styles.emptyText}>暂无通知</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default NotificationPage;