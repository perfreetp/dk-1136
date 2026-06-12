import React, { useState } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { getTeams, mockHistory } from '@/data/teams';
import { getUnreadCount } from '@/data/notifications';
import styles from './index.module.scss';

const MinePage: React.FC = () => {
  const [teams, setTeams] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useDidShow(() => {
    setTeams([...getTeams()]);
    setHistory([...mockHistory]);
    setUnreadCount(getUnreadCount());
  });

  const handleMenuClick = (type: string) => {
    switch (type) {
      case 'notification':
        Taro.navigateTo({ url: '/pages/notification/index' });
        break;
      case 'team':
        Taro.navigateTo({ url: '/pages/team/index' });
        break;
      case 'history':
        Taro.navigateTo({ url: '/pages/history/index' });
        break;
      case 'contact':
        Taro.navigateTo({ url: '/pages/contacts/index' });
        break;
      case 'rating':
        Taro.navigateTo({ url: '/pages/ratings/index' });
        break;
      case 'settings':
        Taro.showToast({ title: '设置功能开发中', icon: 'none' });
        break;
      default:
        break;
    }
  };

  const winCount = history.filter(h => h.result === 'win').length;

  return (
    <View className={styles.minePage}>
      <View className={styles.headerSection}>
        <View className={styles.userInfo}>
          <Image 
            src="https://picsum.photos/id/64/200/200"
            className={styles.avatar}
            mode="aspectFill"
          />
          <View className={styles.userDetail}>
            <Text className={styles.userName}>电竞达人</Text>
            <View className={styles.userRole}>
              <View className={styles.roleTag}>
                <Text className={styles.roleText}>店长</Text>
              </View>
              <View className={styles.roleTag} style={{ marginLeft: '8rpx' }}>
                <Text className={styles.roleText}>玩家</Text>
              </View>
            </View>
          </View>
        </View>

        <View className={styles.statsSection}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{history.length}</Text>
            <Text className={styles.statLabel}>参与赛事</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{teams.length}</Text>
            <Text className={styles.statLabel}>我的战队</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{winCount}</Text>
            <Text className={styles.statLabel}>获胜场次</Text>
          </View>
        </View>
      </View>

      <View className={styles.contentSection}>
        <View className={styles.sectionCard}>
          <View className={styles.cardHeader}>
            <Text className={styles.cardTitle}>我的战队</Text>
            <Text className={styles.cardAction} onClick={() => handleMenuClick('team')}>
              管理
            </Text>
          </View>
          <ScrollView scrollX>
            <View className={styles.teamList}>
              {teams.slice(0, 3).map((team) => (
                <View key={team.id} className={styles.teamItem} onClick={() => handleMenuClick('team')}>
                  <Image 
                    src={team.avatar}
                    className={styles.teamAvatar}
                    mode="aspectFill"
                  />
                  <Text className={styles.teamName}>{team.name}</Text>
                </View>
              ))}
              <View className={styles.teamItem} onClick={() => handleMenuClick('team')}>
                <View className={styles.teamAvatar} style={{ backgroundColor: '#6366F1' }}>
                  <Text style={{ color: '#fff', fontSize: '40rpx' }}>+</Text>
                </View>
                <Text className={styles.teamName}>创建战队</Text>
              </View>
            </View>
          </ScrollView>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.cardHeader}>
            <Text className={styles.cardTitle}>历史战绩</Text>
            <Text className={styles.cardAction} onClick={() => handleMenuClick('history')}>
              查看全部
            </Text>
          </View>
          {history.slice(0, 3).map((record) => (
            <View key={record.id} className={styles.historyItem} onClick={() => handleMenuClick('history')}>
              <Image 
                src={record.gameIcon}
                className={styles.historyIcon}
                mode="aspectFill"
              />
              <View className={styles.historyContent}>
                <Text className={styles.historyTitle}>{record.eventTitle}</Text>
                <Text className={styles.historyTime}>{record.date}</Text>
              </View>
              <View className={`${styles.historyResult} ${record.result === 'win' ? styles.resultWin : styles.resultLose}`}>
                <Text className={styles.resultText}>
                  {record.result === 'win' ? '获胜' : '失败'}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View className={styles.menuSection}>
          <View className={styles.menuItem} onClick={() => handleMenuClick('notification')}>
            <View className={styles.menuLeft}>
              <Text className={styles.menuIcon}>🔔</Text>
              <Text className={styles.menuText}>通知中心</Text>
              {unreadCount > 0 && (
                <View className={styles.notificationBadge}>
                  <Text className={styles.badgeText}>{unreadCount}</Text>
                </View>
              )}
            </View>
            <Text className={styles.menuArrow}>›</Text>
          </View>
          <View className={styles.menuItem} onClick={() => handleMenuClick('contact')}>
            <View className={styles.menuLeft}>
              <Text className={styles.menuIcon}>📱</Text>
              <Text className={styles.menuText}>联系方式</Text>
            </View>
            <Text className={styles.menuArrow}>›</Text>
          </View>
          <View className={styles.menuItem} onClick={() => handleMenuClick('rating')}>
            <View className={styles.menuLeft}>
              <Text className={styles.menuIcon}>⭐</Text>
              <Text className={styles.menuText}>我的评价</Text>
            </View>
            <Text className={styles.menuArrow}>›</Text>
          </View>
          <View className={styles.menuItem} onClick={() => handleMenuClick('settings')}>
            <View className={styles.menuLeft}>
              <Text className={styles.menuIcon}>⚙️</Text>
              <Text className={styles.menuText}>设置</Text>
            </View>
            <Text className={styles.menuArrow}>›</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default MinePage;