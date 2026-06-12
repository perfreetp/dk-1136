import React, { useState, useMemo } from 'react';
import { View, Text, Input, ScrollView, Image } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { GameCategory, gameCategoryMap, Event, UnifiedTeam } from '@/types';
import { getUnifiedEvents } from '@/utils/unifiedData';
import styles from './index.module.scss';

const HomePage: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [activeCategory, setActiveCategory] = useState<GameCategory>('all');
  const [refreshKey, setRefreshKey] = useState(0);

  useDidShow(() => {
    setRefreshKey(prev => prev + 1);
  });

  const categories: GameCategory[] = ['all', 'lol', 'dota2', 'csgo', 'valorant', 'pubg', 'other'];

  const eventsData = getUnifiedEvents();
  const events = Object.values(eventsData).map(e => e.info);
  const registeredCounts: Record<string, number> = {};
  Object.entries(eventsData).forEach(([eventId, event]) => {
    registeredCounts[eventId] = event.registeredTeams.length;
  });

  const filteredEvents = useMemo(() => {
    let result = events.map(e => ({
      ...e,
      currentTeams: registeredCounts[e.id] || 0
    }));

    if (activeCategory !== 'all') {
      result = result.filter(e => e.game === activeCategory);
    }

    if (searchText.trim()) {
      result = result.filter(e =>
        e.title.toLowerCase().includes(searchText.toLowerCase()) ||
        e.location.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    return result;
  }, [activeCategory, searchText, events, registeredCounts, refreshKey]);

  const hotEvents = filteredEvents.filter(e => e.status === 'ongoing' || e.currentTeams >= 5).slice(0, 3);

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleCategoryChange = (category: GameCategory) => {
    setActiveCategory(category);
  };

  const handleEventClick = (id: string) => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${id}`
    });
  };

  const handleHotEventClick = (event: Event) => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${event.id}`
    });
  };

  return (
    <View className={styles.homePage}>
      <View className={styles.searchBar}>
        <Text className={styles.searchIcon}>🔍</Text>
        <Input
          className={styles.searchInput}
          placeholder="搜索赛事名称或地点"
          placeholderClass={styles.searchPlaceholder}
          value={searchText}
          onInput={(e) => handleSearch(e.detail.value)}
        />
      </View>

      <View className={styles.categorySection}>
        <ScrollView scrollX className={styles.categoryScroll}>
          <View className={styles.categoryList}>
            {categories.map((cat) => (
              <View
                key={cat}
                className={`${styles.categoryItem} ${activeCategory === cat ? styles.categoryItemActive : ''}`}
                onClick={() => handleCategoryChange(cat)}
              >
                <Text className={`${styles.categoryText} ${activeCategory === cat ? styles.categoryTextActive : ''}`}>
                  {gameCategoryMap[cat]}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {hotEvents.length > 0 && (
        <View className={styles.hotSection}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>🔥 热门赛事</Text>
            <Text className={styles.sectionMore}>查看更多</Text>
          </View>
          
          <View 
            className={styles.hotBanner}
            onClick={() => handleHotEventClick(hotEvents[0])}
          >
            <Image 
              src={hotEvents[0].gameIcon}
              className={styles.bannerImage}
              mode="aspectFill"
            />
            <View className={styles.bannerOverlay}>
              <Text className={styles.bannerTitle}>{hotEvents[0].title}</Text>
              <View className={styles.bannerInfo}>
                <Text className={styles.bannerText}>{hotEvents[0].location}</Text>
                <Text className={styles.bannerDot}>·</Text>
                <Text className={styles.bannerText}>{hotEvents[0].startTime}</Text>
              </View>
            </View>
          </View>

          <ScrollView scrollX className={styles.hotScroll}>
            <View className={styles.hotList}>
              {hotEvents.slice(1).map((event) => (
                <View 
                  key={event.id}
                  className={styles.hotCard}
                  onClick={() => handleHotEventClick(event)}
                >
                  <Text className={styles.hotCardTitle}>{event.title}</Text>
                  <Text className={styles.hotCardGame}>{gameCategoryMap[event.game as GameCategory]}</Text>
                  <Text className={styles.hotCardPrize}>🏆 {event.prize.split('|')[0]}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      <View className={styles.eventSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>全部赛事</Text>
          <Text className={styles.sectionMore}>{filteredEvents.length}场</Text>
        </View>
        
        <View className={styles.eventList}>
          {filteredEvents.map((event) => (
            <View key={event.id} className={styles.eventCard}>
              <View className={styles.eventCardLeft} onClick={() => handleEventClick(event.id)}>
                <Image src={event.gameIcon} className={styles.eventCardIcon} mode="aspectFill" />
              </View>
              <View className={styles.eventCardRight} onClick={() => handleEventClick(event.id)}>
                <View className={styles.eventCardHeader}>
                  <Text className={styles.eventCardTitle}>{event.title}</Text>
                  <View className={`${styles.eventCardStatus} ${event.status === 'pending' ? styles.statusPending : event.status === 'ongoing' ? styles.statusOngoing : styles.statusFinished}`}>
                    <Text className={styles.eventCardStatusText}>
                      {event.status === 'pending' ? '报名中' : event.status === 'ongoing' ? '进行中' : '已结束'}
                    </Text>
                  </View>
                </View>
                <View className={styles.eventCardInfo}>
                  <Text className={styles.eventCardInfoText}>{event.location}</Text>
                  <Text className={styles.eventCardInfoDot}>·</Text>
                  <Text className={styles.eventCardInfoText}>{event.startTime}</Text>
                </View>
                <View className={styles.eventCardFooter}>
                  <View className={styles.eventCardTags}>
                    {event.tags.slice(0, 2).map((tag, index) => (
                      <View key={index} className={styles.eventCardTag}>
                        <Text className={styles.eventCardTagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                  <View className={styles.eventCardTeam}>
                    <Text className={styles.eventCardTeamCount}>{event.currentTeams}/{event.maxTeams}</Text>
                    <Text className={styles.eventCardTeamLabel}>队</Text>
                  </View>
                </View>
                {event.entryFee > 0 ? (
                  <View className={styles.eventCardPrice}>
                    <Text className={styles.eventCardPriceLabel}>报名费</Text>
                    <Text className={styles.eventCardPriceValue}>¥{event.entryFee}</Text>
                  </View>
                ) : (
                  <View className={styles.eventCardPrice}>
                    <Text className={styles.eventCardFreeTag}>免费</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default HomePage;