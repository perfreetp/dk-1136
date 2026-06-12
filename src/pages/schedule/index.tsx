import React, { useState, useEffect } from 'react';
import { View, Text, Image, Input, Button, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { Match } from '@/types';
import { getEvent, getMatches, submitScore, generateMatches, getMaxRound, getRoundName, getSignedInTeams, canRegenerateMatches, clearMatches, getTotalRounds, getMatchProgress } from '@/utils/unifiedData';
import { submitDispute } from '@/data/notifications';
import styles from './index.module.scss';

const SchedulePage: React.FC = () => {
  const [eventId, setEventId] = useState<string | null>(null);
  const [eventData, setEventData] = useState<any>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [activeRound, setActiveRound] = useState(1);
  const [maxRound, setMaxRound] = useState(0);
  const [progress, setProgress] = useState<any>(null);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [score1, setScore1] = useState('');
  const [score2, setScore2] = useState('');
  const [disputeReason, setDisputeReason] = useState('');

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
      const signedInTeams = getSignedInTeams(id);

      let eventMatches = getMatches(id);
      if (eventMatches.length === 0 && signedInTeams.length >= 2) {
        eventMatches = generateMatches(id);
      } else if (eventMatches.length > 0) {
        eventMatches = generateMatches(id);
      }

      setMatches(eventMatches);
      const totalRounds = getTotalRounds(signedInTeams.length);
      setMaxRound(totalRounds);
      setActiveRound(1);

      const matchProgress = getMatchProgress(id);
      setProgress(matchProgress);
    }
  };

  const rounds = [...new Set(matches.map(m => m.round))].sort((a, b) => a - b);
  const currentRoundMatches = matches.filter(m => m.round === activeRound);

  const handleScoreSubmit = () => {
    if (!selectedMatch || !eventId) return;

    const s1 = parseInt(score1);
    const s2 = parseInt(score2);

    if (isNaN(s1) || isNaN(s2) || s1 < 0 || s2 < 0) {
      Taro.showToast({ title: '请输入有效比分', icon: 'none' });
      return;
    }

    const result = submitScore(eventId, selectedMatch.id, s1, s2);

    if (!result.success) {
      Taro.showToast({ title: result.error || '提交失败', icon: 'none' });
      return;
    }

    loadEventData(eventId);
    setShowScoreModal(false);
    setScore1('');
    setScore2('');

    Taro.showToast({ title: '比分已提交', icon: 'success' });
  };

  const handleDisputeSubmit = () => {
    if (!disputeReason.trim() || !selectedMatch || !eventId) {
      Taro.showToast({ title: '请输入申诉原因', icon: 'none' });
      return;
    }

    submitDispute(selectedMatch.id, eventId, disputeReason);
    setShowDisputeModal(false);
    setDisputeReason('');
    Taro.showToast({ title: '裁决申请已提交', icon: 'success' });
  };

  const handleRegenerateMatches = () => {
    if (!eventId) return;

    Taro.showModal({
      title: '重新生成对阵',
      content: '确定要重新生成对阵表吗？这将重置所有比赛结果。',
      success: (res) => {
        if (res.confirm) {
          clearMatches(eventId);
          const signedInTeams = getSignedInTeams(eventId);
          if (signedInTeams.length >= 2) {
            generateMatches(eventId);
            loadEventData(eventId);
            Taro.showToast({ title: '对阵已重新生成', icon: 'success' });
          } else {
            loadEventData(eventId);
            Taro.showToast({ title: '签到队伍不足2队', icon: 'none' });
          }
        }
      }
    });
  };

  const handleRoundChange = (round: number) => {
    setActiveRound(round);
  };

  const openScoreModal = (match: Match) => {
    setSelectedMatch(match);
    setScore1(match.score1?.toString() || '');
    setScore2(match.score2?.toString() || '');
    setShowScoreModal(true);
  };

  const openDisputeModal = (match: Match) => {
    setSelectedMatch(match);
    setShowDisputeModal(true);
  };

  if (!eventId) {
    return (
      <View className={styles.schedulePage}>
        <View className={styles.placeholderSection}>
          <Text className={styles.placeholderIcon}>📊</Text>
          <Text className={styles.placeholderTitle}>赛程对阵</Text>
          <Text className={styles.placeholderDesc}>请从赛事详情页进入查看对阵表</Text>
        </View>
      </View>
    );
  }

  const signedInTeams = eventData ? getSignedInTeams(eventId) : [];
  
  if (signedInTeams.length < 2) {
    return (
      <View className={styles.schedulePage}>
        <View className={styles.header}>
          <View className={styles.eventInfo}>
            <Text className={styles.eventTitle}>{eventData?.info?.title || '赛事'}</Text>
            <Text className={styles.eventMeta}>{eventData?.info?.location}</Text>
          </View>
        </View>
        <View className={styles.placeholderSection}>
          <Text className={styles.placeholderIcon}>⏳</Text>
          <Text className={styles.placeholderTitle}>等待签到</Text>
          <Text className={styles.placeholderDesc}>
            当前 {signedInTeams.length} 队已签到，至少需要 2 队签到才能生成对阵
          </Text>
          {signedInTeams.length > 0 && (
            <View style={{ marginTop: '32rpx' }}>
              <Text style={{ color: '#94A3B8', fontSize: '24rpx' }}>已签到队伍：</Text>
              {signedInTeams.map((team: any, index: number) => (
                <Text key={index} style={{ color: '#10B981', fontSize: '24rpx', marginTop: '8rpx', display: 'block' }}>
                  ✓ {team.name}
                </Text>
              ))}
            </View>
          )}
        </View>
      </View>
    );
  }

  if (matches.length === 0) {
    return (
      <View className={styles.schedulePage}>
        <View className={styles.header}>
          <View className={styles.eventInfo}>
            <Text className={styles.eventTitle}>{eventData?.info?.title || '赛事'}</Text>
            <Text className={styles.eventMeta}>{eventData?.info?.location}</Text>
          </View>
        </View>
        <View className={styles.placeholderSection}>
          <Text className={styles.placeholderIcon}>🔄</Text>
          <Text className={styles.placeholderTitle}>正在生成对阵表</Text>
          <Text className={styles.placeholderDesc}>请稍候...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.schedulePage}>
      <View className={styles.header}>
        <View className={styles.eventInfo}>
          <Text className={styles.eventTitle}>{eventData?.info?.title || '赛事'}</Text>
          <Text className={styles.eventMeta}>{eventData?.info?.location}</Text>
        </View>

        {progress && progress.total > 0 && (
          <View className={styles.progressSection}>
            <View className={styles.progressItem}>
              <Text className={styles.progressValue}>{progress.currentRoundName}</Text>
              <Text className={styles.progressLabel}>当前轮次</Text>
            </View>
            <View className={styles.progressDivider}></View>
            <View className={styles.progressItem}>
              <Text className={styles.progressValue}>{progress.finished}/{progress.total}</Text>
              <Text className={styles.progressLabel}>已完成</Text>
            </View>
            <View className={styles.progressDivider}></View>
            <View className={styles.progressItem}>
              <Text className={styles.progressValue}>{progress.remaining}</Text>
              <Text className={styles.progressLabel}>剩余场次</Text>
            </View>
          </View>
        )}

        <View className={styles.tabList}>
          {rounds.map(round => (
            <View
              key={round}
              className={`${styles.tabItem} ${activeRound === round ? styles.tabItemActive : ''}`}
              onClick={() => handleRoundChange(round)}
            >
              <Text className={`${styles.tabText} ${activeRound === round ? styles.tabTextActive : ''}`}>
                {getRoundName(round, maxRound)}
              </Text>
            </View>
          ))}
        </View>
        {canRegenerateMatches(eventId) && matches.length > 0 && (
          <View className={styles.regenerateBtn} onClick={handleRegenerateMatches}>
            <Text className={styles.regenerateBtnText}>🔄 刷新对阵</Text>
          </View>
        )}
      </View>

      <View className={styles.content}>
        <View className={styles.roundSection}>
          <View className={styles.roundTitle}>
            <View className={styles.roundBadge}>
              <Text className={styles.roundBadgeText}>{activeRound}</Text>
            </View>
            {getRoundName(activeRound, maxRound)}
            <Text className={styles.roundInfo}>（{currentRoundMatches.length}场比赛）</Text>
          </View>

          <View className={styles.matchList}>
            {currentRoundMatches.map(match => (
              <View key={match.id} className={styles.matchCard}>
                <View className={styles.matchHeader}>
                  <Text className={styles.matchNumber}>
                    第{match.matchNumber}场
                  </Text>
                  <View className={`${styles.matchStatus} ${match.status === 'pending' ? styles.statusPending : match.status === 'ongoing' ? styles.statusOngoing : styles.statusFinished}`}>
                    <Text className={styles.statusText}>
                      {match.status === 'pending' ? '待开始' : match.status === 'ongoing' ? '进行中' : '已结束'}
                    </Text>
                  </View>
                </View>

                <View className={styles.teamsRow}>
                  <View className={styles.teamItem}>
                    <Image 
                      src={match.team1Avatar || 'https://picsum.photos/id/1/100/100'} 
                      className={styles.teamAvatar} 
                      mode="aspectFill" 
                    />
                    <Text className={styles.teamName}>{match.team1Name}</Text>
                    {match.winnerId === match.team1Id && match.status === 'finished' && (
                      <View className={styles.winnerBadge}>
                        <Text className={styles.winnerText}>🏆</Text>
                      </View>
                    )}
                  </View>
                  <Text className={styles.vsText}>VS</Text>
                  <View className={`${styles.teamItem} ${styles.teamItemRight}`}>
                    {match.team2Name !== '轮空' && (
                      <>
                        <Text className={`${styles.teamName} ${styles.teamNameRight}`}>{match.team2Name}</Text>
                        {match.winnerId === match.team2Id && match.status === 'finished' && (
                          <View className={styles.winnerBadge}>
                            <Text className={styles.winnerText}>🏆</Text>
                          </View>
                        )}
                        <Image 
                          src={match.team2Avatar || 'https://picsum.photos/id/2/100/100'} 
                          className={`${styles.teamAvatar} ${styles.teamAvatarRight}`} 
                          mode="aspectFill" 
                        />
                      </>
                    )}
                    {match.team2Name === '轮空' && (
                      <Text className={styles.byeText}>轮空</Text>
                    )}
                  </View>
                </View>

                {match.status !== 'pending' && match.team2Name !== '轮空' && (
                  <View className={styles.scoreSection}>
                    <View className={styles.scoreItem}>
                      <Text className={`${styles.scoreValue} ${match.winnerId === match.team1Id ? styles.winnerScore : ''}`}>
                        {match.score1 ?? '-'}
                      </Text>
                    </View>
                    <Text className={styles.scoreSeparator}>:</Text>
                    <View className={styles.scoreItem}>
                      <Text className={`${styles.scoreValue} ${match.winnerId === match.team2Id ? styles.winnerScore : ''}`}>
                        {match.score2 ?? '-'}
                      </Text>
                    </View>
                  </View>
                )}

                <View className={styles.matchActions}>
                  <View 
                    className={`${styles.actionBtn} ${styles.scoreBtn}`}
                    onClick={() => openScoreModal(match)}
                  >
                    <Text className={styles.actionBtnText}>提交比分</Text>
                  </View>
                  <View 
                    className={`${styles.actionBtn} ${styles.disputeBtn}`}
                    onClick={() => openDisputeModal(match)}
                  >
                    <Text className={styles.disputeBtnText}>申请裁决</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      {showScoreModal && selectedMatch && (
        <View className={styles.modal} onClick={() => setShowScoreModal(false)}>
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>提交比分</Text>
              <Text className={styles.modalClose} onClick={() => setShowScoreModal(false)}>×</Text>
            </View>

            <View className={styles.scoreInputRow}>
              <View className={styles.scoreInputItem}>
                <Text className={styles.scoreInputLabel}>{selectedMatch.team1Name}</Text>
                <Input
                  className={styles.scoreInput}
                  type="number"
                  value={score1}
                  onInput={(e) => setScore1(e.detail.value)}
                  placeholder="0"
                />
              </View>
              <Text style={{ fontSize: '48rpx', color: '#94A3B8' }}>:</Text>
              <View className={styles.scoreInputItem}>
                <Text className={styles.scoreInputLabel}>{selectedMatch.team2Name}</Text>
                <Input
                  className={styles.scoreInput}
                  type="number"
                  value={score2}
                  onInput={(e) => setScore2(e.detail.value)}
                  placeholder="0"
                />
              </View>
            </View>

            <Button className={styles.submitBtn} onClick={handleScoreSubmit}>
              <Text className={styles.submitBtnText}>确认提交</Text>
            </Button>
          </View>
        </View>
      )}

      {showDisputeModal && selectedMatch && (
        <View className={styles.modal} onClick={() => setShowDisputeModal(false)}>
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>申请裁决</Text>
              <Text className={styles.modalClose} onClick={() => setShowDisputeModal(false)}>×</Text>
            </View>

            <View className={styles.disputeContent}>
              <Text className={styles.disputeLabel}>请详细说明裁决原因：</Text>
              <Input
                className={styles.disputeTextarea}
                type="text"
                placeholder="如：比分有误、对方作弊、规则争议等..."
                value={disputeReason}
                onInput={(e) => setDisputeReason(e.detail.value)}
                maxlength={200}
              />
            </View>

            <Button className={styles.submitBtn} onClick={handleDisputeSubmit}>
              <Text className={styles.submitBtnText}>提交裁决申请</Text>
            </Button>
          </View>
        </View>
      )}
    </View>
  );
};

export default SchedulePage;