import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { Event, Team, gameCategoryMap } from '@/types';
import { getEventById, getRegisteredTeams, addRegisteredTeam, isTeamRegistered, updateEventTeams } from '@/data/events';
import { getTeams } from '@/data/teams';
import styles from './index.module.scss';

const DetailPage: React.FC = () => {
  const [event, setEvent] = useState<Event | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [currentTeams, setCurrentTeams] = useState(0);
  const [eventId, setEventId] = useState<string>('');

  useEffect(() => {
    const params = Taro.getCurrentInstance()?.router?.params;
    if (params?.id) {
      setEventId(params.id);
      loadEventData(params.id);
    }
  }, []);

  useDidShow(() => {
    if (eventId) {
      loadEventData(eventId);
    }
  });

  const loadEventData = (id: string) => {
    const eventData = getEventById(id);
    if (eventData) {
      setEvent(eventData);
      const registeredTeamList = getRegisteredTeams(id);
      setTeams(registeredTeamList);
      setCurrentTeams(registeredTeamList.length);
      eventData.currentTeams = registeredTeamList.length;
    }
  };

  const handleRegister = () => {
    if (!event) return;
    if (event.status !== 'pending') {
      Taro.showToast({ title: '该赛事已截止报名', icon: 'none' });
      return;
    }
    if (currentTeams >= event.maxTeams) {
      Taro.showToast({ title: '报名已满', icon: 'none' });
      return;
    }
    setShowModal(true);
  };

  const handleSelectTeam = (team: Team) => {
    if (team.memberCount < team.maxMembers) {
      Taro.showToast({ title: '队伍人数不足', icon: 'none' });
      return;
    }
    setSelectedTeam(team);
  };

  const confirmRegistration = () => {
    if (!selectedTeam || !event) return;

    if (isTeamRegistered(event.id, selectedTeam.id)) {
      Taro.showToast({ title: '该队伍已报名', icon: 'none' });
      return;
    }

    addRegisteredTeam(event.id, selectedTeam);
    const registeredTeamList = getRegisteredTeams(event.id);
    setTeams(registeredTeamList);
    setCurrentTeams(registeredTeamList.length);
    setIsRegistered(true);
    setShowModal(false);
    Taro.showToast({ title: '报名成功', icon: 'success' });
  };

  const showTeamMembers = (team: Team) => {
    setSelectedTeam(team);
    setShowTeamModal(true);
  };

  const getStatusText = () => {
    if (!event) return '';
    switch (event.status) {
      case 'pending': return '报名中';
      case 'ongoing': return '进行中';
      case 'finished': return '已结束';
      case 'cancelled': return '已取消';
      default: return '';
    }
  };

  if (!event) {
    return (
      <View className={styles.detailPage}>
        <Text>加载中...</Text>
      </View>
    );
  }

  const myTeams = getTeams().filter(t => t.memberCount >= t.maxMembers);

  return (
    <View className={styles.detailPage}>
      <View className={styles.headerSection}>
        <View className={styles.eventInfo}>
          <Text className={styles.eventTitle}>{event.title}</Text>
          <View className={styles.eventTags}>
            {event.tags.map((tag, index) => (
              <View key={index} className={styles.tag}>
                <Text className={styles.tagText}>{tag}</Text>
              </View>
            ))}
            <View className={styles.tag}>
              <Text className={styles.tagText}>{gameCategoryMap[event.game as keyof typeof gameCategoryMap]}</Text>
            </View>
          </View>
        </View>

        <View className={styles.eventStats}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{currentTeams}/{event.maxTeams}</Text>
            <Text className={styles.statLabel}>已报名</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{event.entryFee}</Text>
            <Text className={styles.statLabel}>报名费(元)</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{event.machineCount}</Text>
            <Text className={styles.statLabel}>机位数</Text>
          </View>
        </View>
      </View>

      <View className={styles.contentSection}>
        <View className={styles.infoCard}>
          <View className={styles.cardTitle}>
            <Text className={styles.cardIcon}>📍</Text>
            赛事信息
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoIcon}>🏢</Text>
            <View className={styles.infoContent}>
              <Text className={styles.infoLabel}>主办方</Text>
              <Text className={styles.infoValue}>{event.organizerName}</Text>
            </View>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoIcon}>📍</Text>
            <View className={styles.infoContent}>
              <Text className={styles.infoLabel}>比赛地点</Text>
              <Text className={styles.infoValue}>{event.location}</Text>
            </View>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoIcon}>🕐</Text>
            <View className={styles.infoContent}>
              <Text className={styles.infoLabel}>比赛时间</Text>
              <Text className={styles.infoValue}>{event.startTime} - {event.endTime}</Text>
            </View>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoIcon}>💰</Text>
            <View className={styles.infoContent}>
              <Text className={styles.infoLabel}>奖励设置</Text>
              <Text className={`${styles.infoValue} ${styles.prizeText}`}>{event.prize}</Text>
            </View>
          </View>
        </View>

        <View className={styles.infoCard}>
          <View className={styles.cardTitle}>
            <Text className={styles.cardIcon}>📋</Text>
            签到说明
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoIcon}>⏰</Text>
            <View className={styles.infoContent}>
              <Text className={styles.infoLabel}>签到时间</Text>
              <Text className={styles.infoValue}>{event.signInStart} - {event.signInEnd}</Text>
            </View>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoIcon}>📜</Text>
            <View className={styles.infoContent}>
              <Text className={styles.infoLabel}>比赛规则</Text>
              <Text className={styles.rulesText}>{event.rules}</Text>
            </View>
          </View>
        </View>

        <View className={styles.infoCard}>
          <View className={styles.cardTitle}>
            <Text className={styles.cardIcon}>👥</Text>
            参赛队伍
            <Text className={styles.teamCount}>（{teams.length}队，共{teams.reduce((sum, t) => sum + t.memberCount, 0)}人）</Text>
          </View>
          <View className={styles.teamList}>
            {teams.length > 0 ? (
              teams.map((team) => (
                <View key={team.id} className={styles.teamItem} onClick={() => showTeamMembers(team)}>
                  <Image src={team.avatar} className={styles.teamAvatar} mode="aspectFill" />
                  <View className={styles.teamInfo}>
                    <Text className={styles.teamName}>{team.name}</Text>
                    <Text className={styles.teamCaptain}>队长：{team.captainName} · {team.memberCount}人</Text>
                  </View>
                  <Text className={styles.teamMembers}>{team.memberCount}/{team.maxMembers}人</Text>
                  <Text className={styles.viewMore}>查看成员 ›</Text>
                </View>
              ))
            ) : (
              <Text style={{ color: '#94A3B8', textAlign: 'center', padding: '32rpx' }}>
                暂无队伍报名，快来报名吧！
              </Text>
            )}
          </View>
        </View>

        <View className={styles.infoCard}>
          <View className={styles.cardTitle}>
            <Text className={styles.cardIcon}>📝</Text>
            赛事描述
          </View>
          <Text className={styles.rulesText}>{event.description}</Text>
        </View>
      </View>

      <View className={styles.actionBar}>
        {isRegistered || teams.some(t => t.id === getTeams()[0]?.id) ? (
          <View className={styles.registeredText}>
            ✅ 您已报名此赛事
          </View>
        ) : event.status === 'pending' ? (
          <Button className={styles.registerBtn} onClick={handleRegister}>
            立即报名
          </Button>
        ) : (
          <View className={styles.registeredText}>
            {getStatusText()}
          </View>
        )}
      </View>

      {showModal && (
        <View className={styles.modal} onClick={() => setShowModal(false)}>
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>选择参赛队伍</Text>
              <Text className={styles.modalClose} onClick={() => setShowModal(false)}>×</Text>
            </View>
            <ScrollView scrollY style={{ maxHeight: '500rpx' }}>
              {myTeams.length > 0 ? (
                myTeams.map((team) => {
                  const isSelected = selectedTeam?.id === team.id;
                  const isAlreadyRegistered = isTeamRegistered(event?.id || '', team.id);
                  return (
                    <View 
                      key={team.id}
                      className={`${styles.teamSelectItem} ${isAlreadyRegistered ? styles.teamSelectItemDisabled : ''}`}
                      onClick={() => !isAlreadyRegistered && handleSelectTeam(team)}
                    >
                      <Image src={team.avatar} className={styles.teamSelectAvatar} mode="aspectFill" />
                      <View className={styles.teamSelectInfo}>
                        <Text className={styles.teamSelectName}>{team.name}</Text>
                        <Text className={styles.teamSelectCapacity}>
                          {team.memberCount}/{team.maxMembers}人 | 队长：{team.captainName}
                        </Text>
                        {isAlreadyRegistered && <Text className={styles.registeredTag}>已报名</Text>}
                      </View>
                      {isSelected && !isAlreadyRegistered && (
                        <View className={styles.teamSelectAction}>
                          <Text className={styles.teamSelectActionText}>已选择</Text>
                        </View>
                      )}
                    </View>
                  );
                })
              ) : (
                <Text style={{ color: '#94A3B8', textAlign: 'center', padding: '48rpx' }}>
                  暂无可用队伍，请先创建或完善队伍
                </Text>
              )}
            </ScrollView>
            <Button 
              className={`${styles.registerBtn} ${!selectedTeam ? styles.disabledBtn : ''}`}
              onClick={confirmRegistration}
              disabled={!selectedTeam}
            >
              <Text className={!selectedTeam ? styles.disabledText : ''}>
                确认报名 {selectedTeam ? `（${selectedTeam.name}）` : ''}
              </Text>
            </Button>
          </View>
        </View>
      )}

      {showTeamModal && selectedTeam && (
        <View className={styles.modal} onClick={() => setShowTeamModal(false)}>
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>{selectedTeam.name} - 成员列表</Text>
              <Text className={styles.modalClose} onClick={() => setShowTeamModal(false)}>×</Text>
            </View>
            <ScrollView scrollY style={{ maxHeight: '600rpx' }}>
              {selectedTeam.members.map((member, index) => (
                <View key={member.id} className={styles.memberItem}>
                  <Image src={member.avatar} className={styles.memberAvatar} mode="aspectFill" />
                  <View className={styles.memberInfo}>
                    <Text className={styles.memberName}>{member.name}</Text>
                    <Text className={styles.memberRole}>{member.role === 'captain' ? '👑 队长' : `队员 ${index}`}</Text>
                  </View>
                </View>
              ))}
              <Text className={styles.memberSummary}>
                共 {selectedTeam.members.length} 名成员
              </Text>
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
};

export default DetailPage;