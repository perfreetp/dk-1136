import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

const SchedulePage: React.FC = () => {
  return (
    <View className={styles.schedulePage}>
      <Text className={styles.placeholderIcon}>📊</Text>
      <Text className={styles.placeholderTitle}>赛程对阵</Text>
      <Text className={styles.placeholderDesc}>功能正在开发中...</Text>
    </View>
  );
};

export default SchedulePage;