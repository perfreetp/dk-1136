import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

const TeamPage: React.FC = () => {
  return (
    <View className={styles.teamPage}>
      <Text className={styles.placeholderIcon}>👥</Text>
      <Text className={styles.placeholderTitle}>队伍管理</Text>
      <Text className={styles.placeholderDesc}>功能正在开发中...</Text>
    </View>
  );
};

export default TeamPage;