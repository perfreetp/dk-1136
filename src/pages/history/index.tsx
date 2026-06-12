import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import { HistoryRecord } from '@/types';
import { mockHistory } from '@/data/teams';
import styles from './index.module.scss';

const HistoryPage: React.FC = () => {
  const records = mockHistory;
  
  const winCount = records.filter(r => r.result === 'win').length;
  const loseCount = records.filter(r => r.result === 'lose').length;

  const getResultText = (result: string) => {
    switch (result) {
      case 'win': return '获胜';
      case 'lose': return '失败';
      default: return '其他';
    }
  };

  return (
    <View className={styles.historyPage}>
      <View className={styles.header}>
        <Text className={styles.title}>历史战绩</Text>
        <Text className={styles.subtitle}>查看过往比赛记录和成绩</Text>
      </View>

      <View className={styles.statsRow}>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{records.length}</Text>
          <Text className={styles.statLabel}>参赛总数</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={`${styles.statValue} ${styles.winValue}`}>{winCount}</Text>
          <Text className={styles.statLabel}>获胜场次</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{loseCount}</Text>
          <Text className={styles.statLabel}>失败场次</Text>
        </View>
      </View>

      <View className={styles.historyList}>
        {records.map((record) => (
          <View key={record.id} className={styles.historyCard}>
            <View className={styles.cardHeader}>
              <Image src={record.gameIcon} className={styles.gameIcon} mode="aspectFill" />
              <View className={styles.eventInfo}>
                <Text className={styles.eventTitle}>{record.eventTitle}</Text>
                <Text className={styles.eventDate}>{record.date}</Text>
              </View>
              <View className={`${styles.resultBadge} ${record.result === 'win' ? styles.resultWin : record.result === 'lose' ? styles.resultLose : styles.resultOther}`}>
                <Text className={styles.resultText}>{getResultText(record.result)}</Text>
              </View>
            </View>
            {record.prize && (
              <View className={styles.prizeInfo}>
                <Text className={styles.prizeLabel}>获得奖励</Text>
                <Text className={styles.prizeText}>{record.prize}</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

export default HistoryPage;