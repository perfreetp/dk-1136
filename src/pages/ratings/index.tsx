import React, { useState } from 'react';
import { View, Text, Input, Button } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { Rating } from '@/types';
import { getRatings, addRating, getContacts } from '@/data/teams';
import { mockHistory } from '@/data/teams';
import styles from './index.module.scss';

const RatingsPage: React.FC = () => {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');

  useDidShow(() => {
    setRatings([...getRatings()]);
  });

  const participatedEvents = mockHistory.map(h => ({ id: h.eventId, title: h.eventTitle }));

  const handleAddRating = () => {
    if (!selectedEvent) {
      Taro.showToast({ title: '请选择赛事', icon: 'none' });
      return;
    }
    if (!content.trim()) {
      Taro.showToast({ title: '请输入评价内容', icon: 'none' });
      return;
    }

    const event = participatedEvents.find(e => e.id === selectedEvent);
    const newRating: Rating = {
      id: `r${Date.now()}`,
      eventId: selectedEvent,
      eventTitle: event?.title || '',
      rating,
      content: content.trim(),
      date: new Date().toISOString().split('T')[0]
    };

    addRating(newRating);
    setRatings([...getRatings()]);
    setShowModal(false);
    setSelectedEvent('');
    setRating(5);
    setContent('');
    Taro.showToast({ title: '评价成功', icon: 'success' });
  };

  const renderStars = (count: number, max: number = 5) => {
    const stars = [];
    for (let i = 1; i <= max; i++) {
      stars.push(
        <Text key={i} className={`${styles.star} ${i <= count ? styles.starFilled : styles.starEmpty}`}>
          ★
        </Text>
      );
    }
    return stars;
  };

  return (
    <View className={styles.ratingsPage}>
      <View className={styles.header}>
        <Text className={styles.title}>赛事评价</Text>
        <Text className={styles.subtitle}>对参赛的网吧赛事进行评价</Text>
        <View className={styles.addBtn} onClick={() => setShowModal(true)}>
          <Text className={styles.addBtnText}>➕ 写评价</Text>
        </View>
      </View>

      <View className={styles.ratingList}>
        {ratings.map((r) => (
          <View key={r.id} className={styles.ratingCard}>
            <View className={styles.cardHeader}>
              <Text className={styles.eventTitle}>{r.eventTitle}</Text>
              <View className={styles.ratingStars}>
                {renderStars(r.rating)}
              </View>
            </View>
            <Text className={styles.ratingContent}>{r.content}</Text>
            <Text className={styles.ratingDate}>{r.date}</Text>
            {r.organizerReply && (
              <View className={styles.replySection}>
                <Text className={styles.replyLabel}>主办方回复：</Text>
                <Text className={styles.replyContent}>{r.organizerReply}</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      {showModal && (
        <View className={styles.modal} onClick={() => setShowModal(false)}>
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>评价赛事</Text>
              <Text className={styles.modalClose} onClick={() => setShowModal(false)}>×</Text>
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>选择赛事</Text>
              <View className={styles.eventSelector}>
                {participatedEvents.map((event) => (
                  <View
                    key={event.id}
                    className={`${styles.eventOption} ${selectedEvent === event.id ? styles.eventOptionActive : ''}`}
                    onClick={() => setSelectedEvent(event.id)}
                  >
                    <Text className={`${styles.eventText} ${selectedEvent === event.id ? styles.eventTextActive : ''}`}>
                      {event.title}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>评分</Text>
              <View className={styles.starSelector}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Text
                    key={star}
                    className={`${styles.starOption} ${star <= rating ? styles.starOptionActive : ''}`}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </Text>
                ))}
              </View>
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>评价内容</Text>
              <Input
                className={styles.formTextarea}
                type="text"
                placeholder="分享您的赛事体验..."
                value={content}
                onInput={(e) => setContent(e.detail.value)}
                maxlength={200}
              />
            </View>

            <Button className={styles.submitBtn} onClick={handleAddRating}>
              <Text className={styles.submitBtnText}>提交评价</Text>
            </Button>
          </View>
        </View>
      )}
    </View>
  );
};

export default RatingsPage;