import React, { useState, useMemo } from 'react';
import { View, Text, Input, ScrollView, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { GameCategory, gameCategoryMap, Event } from '@/types';
import { mockEvents, hotEvents } from '@/data/events';
import EventCard from '@/components/EventCard';
import EmptyState from '@/components/EmptyState';
import styles from './index.module.scss';

const HomePage: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [activeCategory, setActiveCategory] = useState<GameCategory>('all');

  const categories: GameCategory[] = ['all', 'lol', 'dota2', 'csgo', 'valorant', 'pubg', 'other'];

  const filteredEvents = useMemo(() => {
    let events = mockEvents;
    
    if (activeCategory !== 'all') {
      events = events.filter(e => e.game === activeCategory);
    }
    
    if (searchText.trim()) {
      events = events.filter(e => 
        e.title.toLowerCase().includes(searchText.toLowerCase()) ||
        e.location.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    return events;
  }, [activeCategory, searchText]);

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
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <EventCard 
                key={event.id} 
                event={event}
                onClick={handleEventClick}
              />
            ))
          ) : (
            <EmptyState 
              title="暂无赛事"
              description="换个筛选条件试试吧~"
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default HomePage;