import React from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { mockTeams } from '@/data/teams';
import styles from './index.module.scss';

interface HistoryRecord {
  id: string;
  title: string;
  time: string;
  result: 'win' | 'lose' | 'other';
}

const mockHistory: HistoryRecord[] = [
  { id: 'h1', title: '周末英雄联盟争霸赛', time: '2024-01-20', result: 'win' },
  { id: 'h2', title: '无畏契约新人赛', time: '2024-01-21', result: 'lose' },
  { id: 'h3', title: 'DOTA2水友赛', time: '2024-01-22', result: 'win' },
];

const MinePage: React.FC = () => {
  const unreadCount = 2;

  const handleMenuClick = (type: string) => {
    switch (type) {
      case 'notification':
        Taro.navigateTo({ url: '/pages/notification/index' });
        break;
      case 'team':
        Taro.navigateTo({ url: '/pages/team/index' });
        break;
      case 'history':
        Taro.showToast({ title: '查看全部战绩', icon: 'none' });
        break;
      case 'contact':
        Taro.showToast({ title: '联系方式管理', icon: 'none' });
        break;
      case 'settings':
        Taro.showToast({ title: '设置', icon: 'none' });
        break;
      default:
        break;
    }
  };

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
            <Text className={styles.statValue}>12</Text>
            <Text className={styles.statLabel}>参与赛事</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>3</Text>
            <Text className={styles.statLabel}>我的战队</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>8</Text>
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
              {mockTeams.slice(0, 3).map((team) => (
                <View key={team.id} className={styles.teamItem}>
                  <Image 
                    src={team.avatar}
                    className={styles.teamAvatar}
                    mode="aspectFill"
                  />
                  <Text className={styles.teamName}>{team.name}</Text>
                </View>
              ))}
              <View className={styles.teamItem} onClick={() => handleMenuClick('team')}>
                <View className={styles.teamAvatar} style={{ backgroundColor: '$color-primary' }}>
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
          {mockHistory.map((record) => (
            <View key={record.id} className={styles.historyItem}>
              <Image 
                src="https://picsum.photos/id/1/100/100"
                className={styles.historyIcon}
                mode="aspectFill"
              />
              <View className={styles.historyContent}>
                <Text className={styles.historyTitle}>{record.title}</Text>
                <Text className={styles.historyTime}>{record.time}</Text>
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