import React, { useState } from 'react';
import { View, Text, Image, Input, Button, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { Team, TeamMember } from '@/types';
import { getTeams, addTeam, updateTeam, deleteTeam } from '@/data/teams';
import { mockEvents, addRegisteredTeam, isTeamRegistered } from '@/data/events';
import styles from './index.module.scss';

const TeamPage: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [newTeamName, setNewTeamName] = useState('');
  const [inviteName, setInviteName] = useState('');

  useDidShow(() => {
    setTeams([...getTeams()]);
  });

  const handleCreateTeam = () => {
    if (!newTeamName.trim()) {
      Taro.showToast({ title: '请输入战队名称', icon: 'none' });
      return;
    }

    const newTeam: Team = {
      id: `t${Date.now()}`,
      name: newTeamName.trim(),
      avatar: `https://picsum.photos/id/${Math.floor(Math.random() * 200)}/200/200`,
      memberCount: 1,
      maxMembers: 5,
      captainId: 'currentUser',
      captainName: '我',
      members: [{
        id: 'currentUser',
        name: '我',
        avatar: 'https://picsum.photos/id/64/100/100',
        role: 'captain'
      }],
      createdAt: new Date().toISOString().split('T')[0]
    };

    addTeam(newTeam);
    setTeams([...getTeams()]);
    setShowCreateModal(false);
    setNewTeamName('');
    Taro.showToast({ title: '战队创建成功', icon: 'success' });
  };

  const handleTeamClick = (team: Team) => {
    setSelectedTeam(team);
    setShowDetailModal(true);
  };

  const handleInviteMember = () => {
    if (!inviteName.trim()) {
      Taro.showToast({ title: '请输入队友名称', icon: 'none' });
      return;
    }
    if (!selectedTeam) return;

    if (selectedTeam.memberCount >= selectedTeam.maxMembers) {
      Taro.showToast({ title: '队伍已满员', icon: 'none' });
      return;
    }

    const newMember: TeamMember = {
      id: `u${Date.now()}`,
      name: inviteName.trim(),
      avatar: 'https://picsum.photos/id/91/100/100',
      role: 'member'
    };

    const updatedMembers = [...selectedTeam.members, newMember];
    updateTeam(selectedTeam.id, {
      members: updatedMembers,
      memberCount: updatedMembers.length
    });

    setSelectedTeam({
      ...selectedTeam,
      members: updatedMembers,
      memberCount: updatedMembers.length
    });
    setTeams([...getTeams()]);
    setInviteName('');
    setShowInviteModal(false);
    Taro.showToast({ title: '队友添加成功', icon: 'success' });
  };

  const handleRemoveMember = (memberId: string) => {
    if (!selectedTeam) return;
    if (memberId === selectedTeam.captainId) {
      Taro.showToast({ title: '不能移除队长', icon: 'none' });
      return;
    }

    const updatedMembers = selectedTeam.members.filter(m => m.id !== memberId);
    updateTeam(selectedTeam.id, {
      members: updatedMembers,
      memberCount: updatedMembers.length
    });

    setSelectedTeam({
      ...selectedTeam,
      members: updatedMembers,
      memberCount: updatedMembers.length
    });
    setTeams([...getTeams()]);
    Taro.showToast({ title: '已移除队友', icon: 'success' });
  };

  const handleDeleteTeam = () => {
    if (!selectedTeam) return;

    Taro.showModal({
      title: '确认删除',
      content: `确定要删除战队"${selectedTeam.name}"吗？`,
      success: (res) => {
        if (res.confirm) {
          deleteTeam(selectedTeam.id);
          setTeams([...getTeams()]);
          setShowDetailModal(false);
          setSelectedTeam(null);
          Taro.showToast({ title: '战队已删除', icon: 'success' });
        }
      }
    });
  };

  const handleRegisterEvent = () => {
    if (!selectedTeam) return;
    if (selectedTeam.memberCount < selectedTeam.maxMembers) {
      Taro.showToast({ title: '队伍人数不足，请先添加队友', icon: 'none' });
      return;
    }

    const pendingEvents = mockEvents.filter(e => e.status === 'pending');
    if (pendingEvents.length === 0) {
      Taro.showToast({ title: '暂无可报名赛事', icon: 'none' });
      return;
    }

    Taro.showActionSheet({
      itemList: pendingEvents.map(e => `${e.title} (${e.game})`),
      success: (res) => {
        const event = pendingEvents[res.tapIndex];
        if (isTeamRegistered(event.id, selectedTeam.id)) {
          Taro.showToast({ title: '该队伍已报名此赛事', icon: 'none' });
          return;
        }
        addRegisteredTeam(event.id, selectedTeam);
        console.log('[Team] 选择报名赛事:', { teamId: selectedTeam.id, eventId: event.id });
        Taro.showToast({ title: `已报名"${event.title}"`, icon: 'success' });
        setTimeout(() => {
          Taro.navigateTo({ url: `/pages/detail/index?id=${event.id}` });
        }, 1500);
      }
    });
  };

  const handleCopyInvite = () => {
    Taro.setClipboardData({
      data: `邀请你加入${selectedTeam?.name || '战队'}！请使用网吧赛事约战App加入队伍~`,
      success: () => {
        Taro.showToast({ title: '邀请信息已复制', icon: 'success' });
      }
    });
  };

  return (
    <View className={styles.teamPage}>
      <View className={styles.header}>
        <Text className={styles.title}>我的战队</Text>
        <Text className={styles.subtitle}>管理你的战队，招募队友参加比赛</Text>
      </View>

      <View className={styles.createTeamCard} onClick={() => setShowCreateModal(true)}>
        <Text className={styles.createIcon}>➕</Text>
        <Text className={styles.createText}>创建新战队</Text>
      </View>

      <View className={styles.teamList}>
        {teams.map((team) => (
          <View key={team.id} className={styles.teamCard} onClick={() => handleTeamClick(team)}>
            <View className={styles.teamHeader}>
              <Image src={team.avatar} className={styles.teamAvatar} mode="aspectFill" />
              <View className={styles.teamInfo}>
                <Text className={styles.teamName}>{team.name}</Text>
                <Text className={styles.teamCapacity}>{team.memberCount}/{team.maxMembers}人</Text>
              </View>
              <View className={styles.teamAction}>
                <Text className={styles.teamActionText}>管理</Text>
              </View>
            </View>
            <View className={styles.membersSection}>
              <Text className={styles.membersTitle}>成员</Text>
              <View className={styles.membersList}>
                {team.members.slice(0, 4).map((member) => (
                  <View key={member.id} className={styles.memberItem}>
                    <Image src={member.avatar} className={styles.memberAvatar} mode="aspectFill" />
                    <Text className={styles.memberName}>{member.name}</Text>
                    {member.role === 'captain' && <Text className={styles.captainBadge}>👑</Text>}
                  </View>
                ))}
                {team.memberCount > 4 && (
                  <View className={styles.memberItem}>
                    <Text className={styles.memberName}>+{team.memberCount - 4}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        ))}
      </View>

      {showCreateModal && (
        <View className={styles.modal} onClick={() => setShowCreateModal(false)}>
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>创建战队</Text>
              <Text className={styles.modalClose} onClick={() => setShowCreateModal(false)}>×</Text>
            </View>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>战队名称</Text>
              <Input
                className={styles.formInput}
                placeholder="请输入战队名称"
                value={newTeamName}
                onInput={(e) => setNewTeamName(e.detail.value)}
                maxlength={15}
              />
            </View>
            <Button className={styles.submitBtn} onClick={handleCreateTeam}>
              <Text className={styles.submitBtnText}>创建战队</Text>
            </Button>
          </View>
        </View>
      )}

      {showDetailModal && selectedTeam && (
        <View className={styles.modal} onClick={() => setShowDetailModal(false)}>
          <View className={styles.teamDetailModal} onClick={(e) => e.stopPropagation()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>战队详情</Text>
              <Text className={styles.modalClose} onClick={() => setShowDetailModal(false)}>×</Text>
            </View>

            <View className={styles.detailHeader}>
              <Image src={selectedTeam.avatar} className={styles.detailAvatar} mode="aspectFill" />
              <View>
                <Text className={styles.detailName}>{selectedTeam.name}</Text>
                <Text className={styles.detailMeta}>
                  创建于 {selectedTeam.createdAt} | {selectedTeam.memberCount}/{selectedTeam.maxMembers}人
                </Text>
              </View>
            </View>

            <View className={styles.memberManagement}>
              <View className={styles.memberManagementTitle}>
                <Text>成员管理</Text>
                <View className={styles.addMemberBtn} onClick={() => setShowInviteModal(true)}>
                  <Text className={styles.addMemberText}>邀请队友</Text>
                </View>
              </View>

              <ScrollView scrollY style={{ maxHeight: '300rpx' }}>
                {selectedTeam.members.map((member) => (
                  <View key={member.id} className={styles.memberListItem}>
                    <Image src={member.avatar} className={styles.memberListAvatar} mode="aspectFill" />
                    <View className={styles.memberListInfo}>
                      <Text className={styles.memberListName}>{member.name}</Text>
                      <Text className={styles.memberListRole}>
                        {member.role === 'captain' ? '队长' : '成员'}
                      </Text>
                    </View>
                    {member.role !== 'captain' && (
                      <View 
                        className={styles.memberListAction}
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        <Text className={styles.memberListActionText}>移除</Text>
                      </View>
                    )}
                  </View>
                ))}
              </ScrollView>

              {selectedTeam.memberCount < selectedTeam.maxMembers && (
                <Text className={styles.emptyHint}>
                  还可添加 {selectedTeam.maxMembers - selectedTeam.memberCount} 名成员
                </Text>
              )}
            </View>

            <View className={styles.actionBtns}>
              <Button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={handleDeleteTeam}>
                删除战队
              </Button>
              <Button className={`${styles.actionBtn} ${styles.registerBtn}`} onClick={handleRegisterEvent}>
                报名参赛
              </Button>
            </View>
          </View>
        </View>
      )}

      {showInviteModal && selectedTeam && (
        <View className={styles.modal} onClick={() => setShowInviteModal(false)}>
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>邀请队友</Text>
              <Text className={styles.modalClose} onClick={() => setShowInviteModal(false)}>×</Text>
            </View>

            <View className={styles.inviteItem}>
              <Input
                className={styles.inviteInput}
                placeholder="输入队友游戏ID或昵称"
                value={inviteName}
                onInput={(e) => setInviteName(e.detail.value)}
              />
              <View className={styles.inviteSubmitBtn} onClick={handleInviteMember}>
                <Text className={styles.inviteSubmitText}>添加</Text>
              </View>
            </View>

            <View 
              className={styles.inviteItem} 
              style={{ backgroundColor: '#E8F4FF', marginTop: '16rpx' }}
              onClick={handleCopyInvite}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: '24rpx', color: '#1E293B' }}>复制邀请链接</Text>
                <Text style={{ fontSize: '22rpx', color: '#94A3B8', marginTop: '4rpx' }}>
                  发送给好友邀请加入战队
                </Text>
              </View>
              <Text style={{ fontSize: '28rpx', color: '#165DFF' }}>📋</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default TeamPage;