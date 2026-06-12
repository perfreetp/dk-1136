import React, { useState } from 'react';
import { View, Text, Input, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { GameCategory, gameCategoryMap } from '@/types';
import styles from './index.module.scss';

const gameOptions: GameCategory[] = ['lol', 'dota2', 'csgo', 'valorant', 'pubg', 'other'];
const tagOptions = ['新手友好', '高奖金', '免费', '娱乐赛', '竞技', '周末', '情侣', '四排', '双排', '5v5'];

const CreatePage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [selectedGame, setSelectedGame] = useState<GameCategory>('lol');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [entryFee, setEntryFee] = useState('50');
  const [isFree, setIsFree] = useState(false);
  const [prize, setPrize] = useState('');
  const [machineCount, setMachineCount] = useState('20');
  const [maxTeams, setMaxTeams] = useState('16');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [description, setDescription] = useState('');

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      if (selectedTags.length < 3) {
        setSelectedTags([...selectedTags, tag]);
      }
    }
  };

  const handleFreeToggle = () => {
    setIsFree(!isFree);
    if (!isFree) {
      setEntryFee('0');
    } else {
      setEntryFee('50');
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      Taro.showToast({ title: '请输入赛事名称', icon: 'none' });
      return;
    }
    if (!startTime.trim()) {
      Taro.showToast({ title: '请选择开始时间', icon: 'none' });
      return;
    }
    if (!location.trim()) {
      Taro.showToast({ title: '请输入赛事地点', icon: 'none' });
      return;
    }
    if (!prize.trim()) {
      Taro.showToast({ title: '请输入奖励信息', icon: 'none' });
      return;
    }

    console.log('[CreateEvent] 提交赛事数据:', {
      title,
      game: selectedGame,
      startTime,
      endTime,
      location,
      entryFee: isFree ? 0 : Number(entryFee),
      prize,
      machineCount: Number(machineCount),
      maxTeams: Number(maxTeams),
      tags: selectedTags,
      description
    });

    Taro.showLoading({ title: '发布中...' });
    
    setTimeout(() => {
      Taro.hideLoading();
      Taro.showToast({ title: '发布成功', icon: 'success' });
      setTimeout(() => {
        Taro.switchTab({ url: '/pages/home/index' });
      }, 1500);
    }, 1000);
  };

  return (
    <View className={styles.createPage}>
      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>基本信息</Text>
        
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>
            赛事名称<Text className={styles.requiredMark}>*</Text>
          </Text>
          <Input
            className={styles.formInput}
            placeholder="请输入赛事名称"
            value={title}
            onInput={(e) => setTitle(e.detail.value)}
            maxlength={30}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>
            游戏项目<Text className={styles.requiredMark}>*</Text>
          </Text>
          <View className={styles.gameSelector}>
            {gameOptions.map((game) => (
              <View
                key={game}
                className={`${styles.gameOption} ${selectedGame === game ? styles.gameOptionActive : ''}`}
                onClick={() => setSelectedGame(game)}
              >
                <Text className={`${styles.gameOptionText} ${selectedGame === game ? styles.gameOptionTextActive : ''}`}>
                  {gameCategoryMap[game]}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>
            比赛时间<Text className={styles.requiredMark}>*</Text>
          </Text>
          <View className={styles.timeRow}>
            <View className={styles.timeItem}>
              <Text className={styles.timeLabel}>开始时间</Text>
              <Input
                className={styles.formInput}
                placeholder="如：2024-01-20 14:00"
                value={startTime}
                onInput={(e) => setStartTime(e.detail.value)}
              />
            </View>
            <View className={styles.timeItem}>
              <Text className={styles.timeLabel}>结束时间</Text>
              <Input
                className={styles.formInput}
                placeholder="如：2024-01-20 20:00"
                value={endTime}
                onInput={(e) => setEndTime(e.detail.value)}
              />
            </View>
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>
            赛事地点<Text className={styles.requiredMark}>*</Text>
          </Text>
          <Input
            className={styles.formInput}
            placeholder="请输入网吧名称和地址"
            value={location}
            onInput={(e) => setLocation(e.detail.value)}
          />
        </View>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>报名与奖励</Text>
        
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>报名费</Text>
          <View className={styles.priceRow}>
            <Input
              className={styles.priceInput}
              type="number"
              placeholder="请输入金额"
              value={entryFee}
              onInput={(e) => setEntryFee(e.detail.value)}
              disabled={isFree}
            />
            <Text className={styles.priceUnit}>元/队</Text>
          </View>
          <View className={styles.freeToggle} onClick={handleFreeToggle}>
            <View className={`${styles.freeCheckbox} ${isFree ? styles.freeCheckboxActive : ''}`}>
              {isFree && <Text className={styles.freeCheckIcon}>✓</Text>}
            </View>
            <Text className={styles.freeLabel}>免费赛事</Text>
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>
            奖励设置<Text className={styles.requiredMark}>*</Text>
          </Text>
          <Input
            className={styles.formInput}
            placeholder="如：冠军500元+网费200 | 亚军300元"
            value={prize}
            onInput={(e) => setPrize(e.detail.value)}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>机位数量</Text>
          <View className={styles.priceRow}>
            <Input
              className={styles.priceInput}
              type="number"
              placeholder="可用机位数量"
              value={machineCount}
              onInput={(e) => setMachineCount(e.detail.value)}
            />
            <Text className={styles.priceUnit}>台</Text>
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>最大队伍数</Text>
          <View className={styles.priceRow}>
            <Input
              className={styles.priceInput}
              type="number"
              placeholder="最多报名队伍"
              value={maxTeams}
              onInput={(e) => setMaxTeams(e.detail.value)}
            />
            <Text className={styles.priceUnit}>队</Text>
          </View>
        </View>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>赛事标签</Text>
        <View className={styles.tagSelector}>
          {tagOptions.map((tag) => (
            <View
              key={tag}
              className={`${styles.tagOption} ${selectedTags.includes(tag) ? styles.tagOptionActive : ''}`}
              onClick={() => handleTagToggle(tag)}
            >
              <Text className={`${styles.tagOptionText} ${selectedTags.includes(tag) ? styles.tagOptionTextActive : ''}`}>
                {tag}
              </Text>
            </View>
          ))}
        </View>
        <Text className={styles.timeLabel}>最多选择3个标签</Text>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>赛事描述</Text>
        <Input
          className={styles.formTextarea}
          placeholder="请输入赛事详细描述，如比赛规则、注意事项等..."
          value={description}
          onInput={(e) => setDescription(e.detail.value)}
          maxlength={200}
        />
      </View>

      <Button className={styles.submitBtn} onClick={handleSubmit}>
        <Text className={styles.submitBtnText}>发布赛事</Text>
      </Button>

      <View className={styles.tipSection}>
        <Text className={styles.tipTitle}>💡 发布提示</Text>
        <Text className={styles.tipText}>
          赛事发布后将在首页展示，玩家可立即报名。请确保填写的信息准确无误，赛事开始前可编辑修改。
        </Text>
      </View>
    </View>
  );
};

export default CreatePage;