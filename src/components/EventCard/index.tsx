import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Event } from '@/types';
import styles from './index.module.scss';

interface EventCardProps {
  event: Event;
  onClick?: (id: string) => void;
}

const statusMap = {
  pending: { text: '报名中', className: 'statusPending' },
  ongoing: { text: '进行中', className: 'statusOngoing' },
  finished: { text: '已结束', className: 'statusFinished' },
  cancelled: { text: '已取消', className: 'statusCancelled' }
};

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  const statusInfo = statusMap[event.status];

  const handleClick = () => {
    if (onClick) {
      onClick(event.id);
    } else {
      Taro.navigateTo({
        url: `/pages/detail/index?id=${event.id}`
      });
    }
  };

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.left}>
        <Image 
          src={event.gameIcon} 
          className={styles.gameIcon}
          mode="aspectFill"
        />
      </View>
      <View className={styles.right}>
        <View className={styles.header}>
          <Text className={styles.title}>{event.title}</Text>
          <View className={`${styles.status} ${styles[statusInfo.className]}`}>
            <Text className={styles.statusText}>{statusInfo.text}</Text>
          </View>
        </View>
        <View className={styles.info}>
          <Text className={styles.infoText}>{event.location}</Text>
          <Text className={styles.infoDot}>·</Text>
          <Text className={styles.infoText}>{event.startTime}</Text>
        </View>
        <View className={styles.footer}>
          <View className={styles.tags}>
            {event.tags.slice(0, 2).map((tag, index) => (
              <View key={index} className={styles.tag}>
                <Text className={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
          <View className={styles.teamInfo}>
            <Text className={styles.teamCount}>{event.currentTeams}/{event.maxTeams}</Text>
            <Text className={styles.teamLabel}>队</Text>
          </View>
        </View>
        {event.entryFee > 0 ? (
          <View className={styles.priceRow}>
            <Text className={styles.priceLabel}>报名费</Text>
            <Text className={styles.priceValue}>¥{event.entryFee}</Text>
          </View>
        ) : (
          <View className={styles.priceRow}>
            <Text className={styles.freeTag}>免费</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default EventCard;