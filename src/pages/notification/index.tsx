import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

const NotificationPage: React.FC = () => {
  return (
    <View className={styles.notificationPage}>
      <Text className={styles.placeholderIcon}>🔔</Text>
      <Text className={styles.placeholderTitle}>通知中心</Text>
      <Text className={styles.placeholderDesc}>功能正在开发中...</Text>
    </View>
  );
};

export default NotificationPage;