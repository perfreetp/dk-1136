import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

const DetailPage: React.FC = () => {
  return (
    <View className={styles.detailPage}>
      <Text className={styles.placeholderIcon}>🎮</Text>
      <Text className={styles.placeholderTitle}>赛事详情</Text>
      <Text className={styles.placeholderDesc}>功能正在开发中...</Text>
    </View>
  );
};

export default DetailPage;