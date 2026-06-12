import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { Event, GameCategory, gameCategoryMap, UnifiedTeam } from '@/types';
import { getEvent, getRegisteredTeams, signInTeam, isCurrentUserRegistered } from '@/utils/unifiedData';
import { getTeams, addTeam } from '@/data/teams';
import styles from './index.module.scss';

const DetailPage: React.FC = () => {
  const [eventData, setEventData] = useState<any>(null);
  const [teams, setTeams] = useState<UnifiedTeam[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<UnifiedTeam | null>(null);
  const [eventId, setEventId] = useState<string>('');
  const [isRegistered, setIsRegistered] = useState(false);

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
    const data = getEvent(id);
    if (data) {
      setEventData(data);
      setTeams([...data.registeredTeams]);
      setIsRegistered(isCurrentUserRegistered(id));
    }
  };

  const handleRegister = () => {
    if (!eventData) return;
    if (eventData.info.status !== 'pending') {
      Taro.showToast({ title: '该赛事已截止报名', icon: 'none' });
      return;
    }
    if (teams.length >= eventData.info.maxTeams) {
      Taro.showToast({ title: '报名已满', icon: 'none' });
      return;
    }
    setShowModal(true);
  };

  const handleSelectTeam = (team: UnifiedTeam) => {
    if (team.memberCount < team.maxMembers) {
      Taro.showToast({ title: '队伍人数不足', icon: 'none' });
      return;
    }
    setSelectedTeam(team);
  };

  const confirmRegistration = () => {
    if (!selectedTeam || !eventData) return;

    const { registerTeam } = require('@/utils/unifiedData');
    const success = registerTeam(eventId, selectedTeam);
    if (success) {
      loadEventData(eventId);
      setShowModal(false);
      setSelectedTeam(null);
      Taro.showToast({ title: '报名成功', icon: 'success' });
    } else {
      Taro.showToast({ title: '该队伍已报名', icon: 'none' });
    }
  };

  const handleSignIn = (teamId: string) => {
    const success = signInTeam(eventId, teamId);
    if (success) {
      loadEventData(eventId);
      Taro.showToast({ title: '签到成功', icon: 'success' });
    }
  };

  const showTeamMembers = (team: UnifiedTeam) => {
    setSelectedTeam(team);
    setShowTeamModal(true);
  };

  const goToSchedule = () => {
    Taro.navigateTo({
      url: `/pages/schedule/index?id=${eventId}`
    });
  };

  if (!eventData) {
    return (
      <View className={styles.detailPage}>
        <Text>加载中...</Text>
      </View>
    );
  }

  const { info } = eventData;
  const signedInCount = teams.filter(t => t.signedIn).length;
  const notSignedInCount = teams.length - signedInCount;
  const myTeams = getTeams().filter(t => t.memberCount >= t.maxMembers);
  const canGenerateSchedule = signedInCount >= 2;

  return (
    <View className={styles.detailPage}>
      <View className={styles.headerSection}>
        <View className={styles.eventInfo}>
          <Text className={styles.eventTitle}>{info.title}</Text>
          <View className={styles.eventTags}>
            {info.tags.map((tag: string, index: number) => (
              <View key={index} className={styles.tag}>
                <Text className={styles.tagText}>{tag}</Text>
              </View>
            ))}
            <View className={styles.tag}>
              <Text className={styles.tagText}>{gameCategoryMap[info.game as GameCategory]}</Text>
            </View>
          </View>
        </View>

        <View className={styles.eventStats}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{teams.length}/{info.maxTeams}</Text>
            <Text className={styles.statLabel}>已报名</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{signedInCount}</Text>
            <Text className={styles.statLabel}>已签到</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{info.entryFee}</Text>
            <Text className={styles.statLabel}>报名费(元)</Text>
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
              <Text className={styles.infoValue}>{info.organizerName}</Text>
            </View>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoIcon}>📍</Text>
            <View className={styles.infoContent}>
              <Text className={styles.infoLabel}>比赛地点</Text>
              <Text className={styles.infoValue}>{info.location}</Text>
            </View>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoIcon}>🕐</Text>
            <View className={styles.infoContent}>
              <Text className={styles.infoLabel}>比赛时间</Text>
              <Text className={styles.infoValue}>{info.startTime} - {info.endTime}</Text>
            </View>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoIcon}>💰</Text>
            <View className={styles.infoContent}>
              <Text className={styles.infoLabel}>奖励设置</Text>
              <Text className={`${styles.infoValue} ${styles.prizeText}`}>{info.prize}</Text>
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
              <Text className={styles.infoValue}>{info.signInStart} - {info.signInEnd}</Text>
            </View>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoIcon}>📜</Text>
            <View className={styles.infoContent}>
              <Text className={styles.infoLabel}>比赛规则</Text>
              <Text className={styles.rulesText}>{info.rules}</Text>
            </View>
          </View>
        </View>

        <View className={styles.infoCard}>
          <View className={styles.cardTitle}>
            <Text className={styles.cardIcon}>👥</Text>
            参赛队伍
            <Text className={styles.teamCount}>（{teams.length}队，共{teams.reduce((sum: number, t: UnifiedTeam) => sum + t.memberCount, 0)}人）</Text>
          </View>

          <View className={styles.signInSummary}>
            <View className={styles.signInItem}>
              <Text className={styles.signInCount}>{signedInCount}</Text>
              <Text className={styles.signInLabel}>已签到</Text>
            </View>
            <View className={styles.signInDivider}></View>
            <View className={styles.signInItem}>
              <Text className={`${styles.signInCount} ${notSignedInCount > 0 ? styles.notSignedIn : ''}`}>{notSignedInCount}</Text>
              <Text className={styles.signInLabel}>未签到</Text>
            </View>
          </View>

          <View className={styles.teamList}>
            {teams.length > 0 ? (
              <>
                {teams.filter((t: UnifiedTeam) => t.signedIn).length > 0 && (
                  <View className={styles.teamListSection}>
                    <Text className={styles.teamListTitle}>✓ 已签到（{signedInCount}队）</Text>
                    {teams.filter((t: UnifiedTeam) => t.signedIn).map((team: UnifiedTeam) => (
                      <View key={team.id} className={styles.teamItem}>
                        <View onClick={() => showTeamMembers(team)}>
                          <Image src={team.avatar} className={styles.teamAvatar} mode="aspectFill" />
                        </View>
                        <View className={styles.teamInfo} onClick={() => showTeamMembers(team)}>
                          <Text className={styles.teamName}>{team.name}</Text>
                          <Text className={styles.teamCaptain}>队长：{team.captainName} · {team.memberCount}人</Text>
                        </View>
                        <View className={styles.teamRight}>
                          <View className={styles.signedInBadge}>
                            <Text className={styles.signedInText}>已签到</Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                )}

                {teams.filter((t: UnifiedTeam) => !t.signedIn).length > 0 && (
                  <View className={styles.teamListSection}>
                    <Text className={`${styles.teamListTitle} ${styles.notSignedInTitle}`}>
                      ⏳ 未签到（{notSignedInCount}队）
                    </Text>
                    {teams.filter((t: UnifiedTeam) => !t.signedIn).map((team: UnifiedTeam) => (
                      <View key={team.id} className={`${styles.teamItem} ${styles.teamItemNotSignedIn}`}>
                        <View onClick={() => showTeamMembers(team)}>
                          <Image src={team.avatar} className={styles.teamAvatar} mode="aspectFill" />
                        </View>
                        <View className={styles.teamInfo} onClick={() => showTeamMembers(team)}>
                          <Text className={styles.teamName}>{team.name}</Text>
                          <Text className={styles.teamCaptain}>队长：{team.captainName} · {team.memberCount}人</Text>
                        </View>
                        <View className={styles.teamRight}>
                          <Button
                            className={styles.signInBtn}
                            onClick={() => handleSignIn(team.id)}
                            disabled={info.status !== 'pending' && info.status !== 'ongoing'}
                          >
                            <Text className={styles.signInBtnText}>签到</Text>
                          </Button>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </>
            ) : (
              <Text style={{ color: '#94A3B8', textAlign: 'center', padding: '32rpx' }}>
                暂无队伍报名，快来报名吧！
              </Text>
            )}
          </View>
        </View>

        {canGenerateSchedule && (
          <View className={styles.scheduleCard} onClick={goToSchedule}>
            <View className={styles.scheduleIcon}>
              <Text>📊</Text>
            </View>
            <View className={styles.scheduleInfo}>
              <Text className={styles.scheduleTitle}>查看赛程对阵</Text>
              <Text className={styles.scheduleDesc}>已签到{signedInCount}支队伍，可生成对阵表</Text>
            </View>
            <Text className={styles.scheduleArrow}>›</Text>
          </View>
        )}

        <View className={styles.infoCard}>
          <View className={styles.cardTitle}>
            <Text className={styles.cardIcon}>📝</Text>
            赛事描述
          </View>
          <Text className={styles.rulesText}>{info.description}</Text>
        </View>
      </View>

      <View className={styles.actionBar}>
        {isRegistered ? (
          <View className={styles.registeredText}>
            ✅ 您已报名此赛事
          </View>
        ) : info.status === 'pending' ? (
          <Button className={styles.registerBtn} onClick={handleRegister}>
            立即报名
          </Button>
        ) : (
          <View className={styles.registeredText}>
            {info.status === 'ongoing' ? '进行中' : '已结束'}
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
                myTeams.map((team: any) => {
                  const isSelected = selectedTeam?.id === team.id;
                  const isAlreadyRegistered = teams.some(t => t.id === team.id);
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
                <View style={{ padding: '48rpx', textAlign: 'center' }}>
                  <Text style={{ color: '#94A3B8' }}>暂无可用队伍</Text>
                  <Text style={{ color: '#94A3B8', fontSize: '24rpx', marginTop: '16rpx' }}>
                    请先在「我的」页面创建战队并添加队友
                  </Text>
                </View>
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
              {selectedTeam.members.map((member: any, index: number) => (
                <View key={member.id} className={styles.memberItem}>
                  <Image src={member.avatar} className={styles.memberAvatar} mode="aspectFill" />
                  <View className={styles.memberInfo}>
                    <Text className={styles.memberName}>{member.name}</Text>
                    <Text className={styles.memberRole}>
                      {member.role === 'captain' ? '👑 队长' : `队员 ${index}`}
                    </Text>
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