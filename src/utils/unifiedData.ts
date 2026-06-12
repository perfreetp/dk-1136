import Taro from '@tarojs/taro';
import { Event, Team, Match, TeamMember } from '@/types';

const STORAGE_KEY = 'esports_unified_data';

interface UnifiedData {
  events: Record<string, UnifiedEvent>;
  matches: Record<string, Match[]>;
}

interface UnifiedEvent {
  info: Event;
  registeredTeams: UnifiedTeam[];
  currentUserRegisteredTeamId?: string;
}

interface UnifiedTeam extends Team {
  signedIn: boolean;
}

let unifiedData: UnifiedData = {
  events: {},
  matches: {}
};

const defaultEvents: Event[] = [
  {
    id: '1', title: '周末英雄联盟争霸赛', game: 'lol',
    gameIcon: 'https://picsum.photos/id/1/100/100',
    startTime: '2024-01-20 14:00', endTime: '2024-01-20 20:00',
    location: '极速网吧（中山路店）', entryFee: 50,
    prize: '冠军500元+网费200 | 亚军300元+网费100',
    maxTeams: 16, currentTeams: 0, status: 'pending',
    tags: ['新手友好', '5v5'],
    description: '欢迎各路召唤师前来挑战！比赛采用淘汰制，每局BO1，决赛BO3。',
    organizerId: 'org1', organizerName: '极速网吧', machineCount: 20,
    signInStart: '2024-01-20 12:00', signInEnd: '2024-01-20 13:30',
    rules: '1. 比赛采用单淘汰制\n2. 每场比赛BO1，决赛BO3\n3. 迟到10分钟视为弃权\n4. 服从裁判判决'
  },
  {
    id: '2', title: '无畏契约新人赛', game: 'valorant',
    gameIcon: 'https://picsum.photos/id/2/100/100',
    startTime: '2024-01-21 15:00', endTime: '2024-01-21 21:00',
    location: '星辰电竞馆', entryFee: 30,
    prize: '冠军300元网费 | 亚军150元网费',
    maxTeams: 8, currentTeams: 0, status: 'ongoing',
    tags: ['新人专属', '5v5'],
    description: '专为新手设计的比赛，欢迎0-10级玩家参加！',
    organizerId: 'org2', organizerName: '星辰电竞馆', machineCount: 16,
    signInStart: '2024-01-21 14:00', signInEnd: '2024-01-21 14:30',
    rules: '1. 仅限0-10级玩家参加\n2. 比赛采用积分制\n3. 共进行3轮小组赛'
  },
  {
    id: '3', title: 'DOTA2水友赛', game: 'dota2',
    gameIcon: 'https://picsum.photos/id/3/100/100',
    startTime: '2024-01-22 18:00', endTime: '2024-01-22 23:00',
    location: '雷霆网吧', entryFee: 0,
    prize: '参与即送50元网费',
    maxTeams: 12, currentTeams: 0, status: 'pending',
    tags: ['免费', '娱乐赛'],
    description: '纯娱乐性质比赛，重在参与，欢乐为主！',
    organizerId: 'org3', organizerName: '雷霆网吧', machineCount: 24,
    signInStart: '2024-01-22 17:00', signInEnd: '2024-01-22 17:30',
    rules: '1. 娱乐为主，友谊第一\n2. 比赛采用循环赛制\n3. 不限制英雄选择'
  },
  {
    id: '4', title: 'CS:GO枪王争霸', game: 'csgo',
    gameIcon: 'https://picsum.photos/id/6/100/100',
    startTime: '2024-01-23 13:00', endTime: '2024-01-23 19:00',
    location: '极速网吧（中山路店）', entryFee: 80,
    prize: '冠军800元+外设礼包 | 亚军400元',
    maxTeams: 16, currentTeams: 0, status: 'ongoing',
    tags: ['高奖金', '竞技'],
    description: '高水平竞技比赛，邀请各路高手参与！',
    organizerId: 'org1', organizerName: '极速网吧', machineCount: 20,
    signInStart: '2024-01-23 12:00', signInEnd: '2024-01-23 12:30',
    rules: '1. 专业竞技规则\n2. 采用BO3淘汰赛\n3. 禁止使用任何作弊程序'
  },
  {
    id: '5', title: '绝地求生四排赛', game: 'pubg',
    gameIcon: 'https://picsum.photos/id/8/100/100',
    startTime: '2024-01-24 19:00', endTime: '2024-01-24 22:00',
    location: '星辰电竞馆', entryFee: 40,
    prize: '冠军400元 | 亚军200元',
    maxTeams: 20, currentTeams: 0, status: 'pending',
    tags: ['四排', '吃鸡'],
    description: '四排模式，积分制，共进行5场比赛！',
    organizerId: 'org2', organizerName: '星辰电竞馆', machineCount: 16,
    signInStart: '2024-01-24 18:00', signInEnd: '2024-01-24 18:30',
    rules: '1. 四排模式\n2. 积分制，共5场比赛\n3. 击杀积分+排名积分'
  },
  {
    id: '6', title: '英雄联盟情侣双排赛', game: 'lol',
    gameIcon: 'https://picsum.photos/id/9/100/100',
    startTime: '2024-01-25 14:00', endTime: '2024-01-25 18:00',
    location: '雷霆网吧', entryFee: 60,
    prize: '冠军情侣套餐+300元 | 亚军情侣套餐',
    maxTeams: 16, currentTeams: 0, status: 'pending',
    tags: ['情侣', '双排'],
    description: '情人节特别赛事，情侣组队参加！',
    organizerId: 'org3', organizerName: '雷霆网吧', machineCount: 24,
    signInStart: '2024-01-25 13:00', signInEnd: '2024-01-25 13:30',
    rules: '1. 必须是情侣组队\n2. 双排模式\n3. 比赛中需同队'
  },
  {
    id: '7', title: '无畏契约周末赛', game: 'valorant',
    gameIcon: 'https://picsum.photos/id/119/100/100',
    startTime: '2024-01-26 15:00', endTime: '2024-01-26 21:00',
    location: '极速网吧（中山路店）', entryFee: 50,
    prize: '冠军500元 | 亚军250元',
    maxTeams: 12, currentTeams: 0, status: 'pending',
    tags: ['周末', '竞技'],
    description: '周末狂欢，无畏契约等你来战！',
    organizerId: 'org1', organizerName: '极速网吧', machineCount: 20,
    signInStart: '2024-01-26 14:00', signInEnd: '2024-01-26 14:30',
    rules: '1. 标准竞技规则\n2. BO1小组赛+BO3决赛\n3. 禁止使用Bug'
  },
  {
    id: '8', title: 'DOTA2老玩家回归赛', game: 'dota2',
    gameIcon: 'https://picsum.photos/id/160/100/100',
    startTime: '2024-01-27 18:00', endTime: '2024-01-27 23:00',
    location: '星辰电竞馆', entryFee: 20,
    prize: '冠军200元+专属皮肤 | 亚军100元',
    maxTeams: 8, currentTeams: 0, status: 'pending',
    tags: ['老玩家', '回归'],
    description: '欢迎老玩家回归，重温DOTA2经典！',
    organizerId: 'org2', organizerName: '星辰电竞馆', machineCount: 16,
    signInStart: '2024-01-27 17:00', signInEnd: '2024-01-27 17:30',
    rules: '1. 欢迎所有老玩家\n2. 比赛采用BO1循环赛\n3. 重在交流'
  },
  {
    id: '9', title: 'CS:GO新手训练营', game: 'csgo',
    gameIcon: 'https://picsum.photos/id/201/100/100',
    startTime: '2024-01-28 14:00', endTime: '2024-01-28 17:00',
    location: '雷霆网吧', entryFee: 0,
    prize: '参与即送30元网费',
    maxTeams: 10, currentTeams: 0, status: 'pending',
    tags: ['免费', '新手'],
    description: '新手专属，专业教练指导！',
    organizerId: 'org3', organizerName: '雷霆网吧', machineCount: 24,
    signInStart: '2024-01-28 13:30', signInEnd: '2024-01-28 13:45',
    rules: '1. 新手入门教学\n2. 专业教练现场指导\n3. 实践比赛'
  },
  {
    id: '10', title: '全游戏综合赛', game: 'other',
    gameIcon: 'https://picsum.photos/id/3/100/100',
    startTime: '2024-01-29 12:00', endTime: '2024-01-29 20:00',
    location: '极速网吧（中山路店）', entryFee: 30,
    prize: '冠军300元 | 亚军150元',
    maxTeams: 20, currentTeams: 0, status: 'pending',
    tags: ['综合', '娱乐'],
    description: '多种游戏轮番上阵，综合积分制！',
    organizerId: 'org1', organizerName: '极速网吧', machineCount: 20,
    signInStart: '2024-01-29 11:00', signInEnd: '2024-01-29 11:30',
    rules: '1. 多种游戏项目\n2. 综合积分制\n3. 趣味性为主'
  }
];

const defaultTeams: UnifiedTeam[] = [
  {
    id: 't1', name: '无敌战队', avatar: 'https://picsum.photos/id/1/200/200',
    memberCount: 5, maxMembers: 5, captainId: 'currentUser', captainName: '我',
    members: [
      { id: 'currentUser', name: '我', avatar: 'https://picsum.photos/id/64/100/100', role: 'captain' },
      { id: 'u2', name: '阿杰', avatar: 'https://picsum.photos/id/91/100/100', role: 'member' },
      { id: 'u3', name: '大壮', avatar: 'https://picsum.photos/id/177/100/100', role: 'member' },
      { id: 'u4', name: '小王', avatar: 'https://picsum.photos/id/338/100/100', role: 'member' },
      { id: 'u5', name: '阿强', avatar: 'https://picsum.photos/id/1027/100/100', role: 'member' },
    ],
    createdAt: '2024-01-10', signedIn: false
  }
];

export const initUnifiedData = () => {
  try {
    const saved = Taro.getStorageSync(STORAGE_KEY);
    if (saved) {
      unifiedData = JSON.parse(saved);
      if (!unifiedData.events || Object.keys(unifiedData.events).length === 0) {
        initDefaultData();
      }
    } else {
      initDefaultData();
    }
  } catch (e) {
    initDefaultData();
  }
};

const initDefaultData = () => {
  unifiedData.events = {};
  unifiedData.matches = {};
  defaultEvents.forEach(event => {
    unifiedData.events[event.id] = {
      info: event,
      registeredTeams: event.id === '1' ? [...defaultTeams] : []
    };
  });
  saveUnifiedData();
};

const saveUnifiedData = () => {
  try {
    Taro.setStorageSync(STORAGE_KEY, JSON.stringify(unifiedData));
  } catch (e) {
    console.error('[UnifiedData] Save error:', e);
  }
};

export const getUnifiedEvents = (): Record<string, UnifiedEvent> => {
  return unifiedData.events;
};

export const getEvent = (eventId: string): UnifiedEvent | undefined => {
  return unifiedData.events[eventId];
};

export const getRegisteredTeams = (eventId: string): UnifiedTeam[] => {
  return unifiedData.events[eventId]?.registeredTeams || [];
};

export const getSignedInTeams = (eventId: string): UnifiedTeam[] => {
  return getRegisteredTeams(eventId).filter(t => t.signedIn);
};

export const registerTeam = (eventId: string, team: Team): boolean => {
  const event = unifiedData.events[eventId];
  if (!event) return false;
  
  const exists = event.registeredTeams.some(t => t.id === team.id);
  if (exists) return false;
  
  const unifiedTeam: UnifiedTeam = { ...team, signedIn: false };
  event.registeredTeams.push(unifiedTeam);
  event.info.currentTeams = event.registeredTeams.length;
  saveUnifiedData();
  return true;
};

export const signInTeam = (eventId: string, teamId: string): boolean => {
  const event = unifiedData.events[eventId];
  if (!event) return false;
  
  const team = event.registeredTeams.find(t => t.id === teamId);
  if (!team) return false;
  
  team.signedIn = true;
  saveUnifiedData();
  return true;
};

export const getMatches = (eventId: string): Match[] => {
  return unifiedData.matches[eventId] || [];
};

export const setMatches = (eventId: string, matches: Match[]): void => {
  unifiedData.matches[eventId] = matches;
  saveUnifiedData();
};

export const generateMatches = (eventId: string): Match[] => {
  const signedInTeams = getSignedInTeams(eventId);
  const event = unifiedData.events[eventId];
  if (!event || signedInTeams.length < 2) return [];
  
  const matches: Match[] = [];
  const teamCount = signedInTeams.length;
  const matchCount = Math.floor(teamCount / 2);
  
  for (let i = 0; i < matchCount; i++) {
    const team1 = signedInTeams[i * 2];
    const team2 = signedInTeams[i * 2 + 1];
    matches.push({
      id: `m_${eventId}_${i + 1}`,
      eventId,
      round: 1,
      matchNumber: i + 1,
      team1Id: team1.id,
      team1Name: team1.name,
      team1Avatar: team1.avatar,
      team2Id: team2.id,
      team2Name: team2.name,
      team2Avatar: team2.avatar,
      status: 'pending',
      startTime: event.info.startTime
    });
  }
  
  if (teamCount % 2 === 1) {
    const byeTeam = signedInTeams[teamCount - 1];
    matches.push({
      id: `m_${eventId}_bye`,
      eventId,
      round: 1,
      matchNumber: matchCount + 1,
      team1Id: byeTeam.id,
      team1Name: byeTeam.name,
      team1Avatar: byeTeam.avatar,
      team2Id: '',
      team2Name: '轮空',
      team2Avatar: '',
      status: 'finished',
      score1: 1,
      score2: 0,
      winnerId: byeTeam.id,
      startTime: event.info.startTime
    });
  }
  
  unifiedData.matches[eventId] = matches;
  saveUnifiedData();
  return matches;
};

export const submitScore = (eventId: string, matchId: string, score1: number, score2: number): Match | null => {
  const matches = unifiedData.matches[eventId];
  if (!matches) return null;
  
  const matchIndex = matches.findIndex(m => m.id === matchId);
  if (matchIndex === -1) return null;
  
  const match = matches[matchIndex];
  match.score1 = score1;
  match.score2 = score2;
  match.status = 'finished';
  match.winnerId = score1 > score2 ? match.team1Id : match.team2Id;
  
  generateNextRound(eventId);
  saveUnifiedData();
  return match;
};

const generateNextRound = (eventId: string) => {
  const matches = unifiedData.matches[eventId];
  if (!matches) return;
  
  const currentRound = Math.max(...matches.map(m => m.round));
  const finishedMatches = matches.filter(m => m.round === currentRound && m.status === 'finished');
  
  if (finishedMatches.length === 0) return;
  
  const nextRoundWinners = finishedMatches.map(m => ({
    id: m.winnerId!,
    name: m.winnerId === m.team1Id ? m.team1Name : m.team2Name,
    avatar: m.winnerId === m.team1Id ? m.team1Avatar : m.team2Avatar
  }));
  
  if (nextRoundWinners.length < 2) return;
  
  const nextRound = currentRound + 1;
  
  for (let i = 0; i < Math.floor(nextRoundWinners.length / 2); i++) {
    const team1 = nextRoundWinners[i * 2];
    const team2 = nextRoundWinners[i * 2 + 1];
    
    const existingMatch = matches.find(m => m.round === nextRound && m.matchNumber === i + 1);
    if (!existingMatch) {
      matches.push({
        id: `m_${eventId}_r${nextRound}_${i + 1}`,
        eventId,
        round: nextRound,
        matchNumber: i + 1,
        team1Id: team1.id,
        team1Name: team1.name,
        team1Avatar: team1.avatar,
        team2Id: team2.id,
        team2Name: team2.name,
        team2Avatar: team2.avatar,
        status: 'pending',
        startTime: ''
      });
    }
  }
  
  if (nextRoundWinners.length % 2 === 1) {
    const byeWinner = nextRoundWinners[nextRoundWinners.length - 1];
    matches.push({
      id: `m_${eventId}_r${nextRound}_bye`,
      eventId,
      round: nextRound,
      matchNumber: Math.floor(nextRoundWinners.length / 2) + 1,
      team1Id: byeWinner.id,
      team1Name: byeWinner.name,
      team1Avatar: byeWinner.avatar,
      team2Id: '',
      team2Name: '轮空',
      team2Avatar: '',
      status: 'finished',
      score1: 1,
      score2: 0,
      winnerId: byeWinner.id,
      startTime: ''
    });
  }
};

export const getMaxRound = (eventId: string): number => {
  const matches = unifiedData.matches[eventId];
  if (!matches || matches.length === 0) return 0;
  return Math.max(...matches.map(m => m.round));
};

export const getRoundName = (round: number, totalRounds: number): string => {
  if (totalRounds === 1) return '第1轮';
  if (round === totalRounds) return '决赛';
  if (round === totalRounds - 1) return '半决赛';
  if (round === totalRounds - 2) return '1/4决赛';
  return `第${round}轮`;
};

export const getTotalRounds = (teamCount: number): number => {
  if (teamCount < 2) return 0;
  if (teamCount <= 2) return 1;
  return Math.ceil(Math.log2(teamCount));
};

export const isCurrentUserRegistered = (eventId: string): boolean => {
  const event = unifiedData.events[eventId];
  return event?.registeredTeams.some(t => t.captainId === 'currentUser') || false;
};

export const isEventStarted = (eventId: string): boolean => {
  const event = unifiedData.events[eventId];
  if (!event) return false;
  return event.info.status === 'ongoing' || event.info.status === 'finished';
};

export const canRegenerateMatches = (eventId: string): boolean => {
  return !isEventStarted(eventId);
};

export const clearMatches = (eventId: string): void => {
  if (unifiedData.matches[eventId]) {
    delete unifiedData.matches[eventId];
    saveUnifiedData();
  }
};

export const getMatchProgress = (eventId: string): { finished: number; total: number; currentRound: number; maxRound: number } => {
  const matches = unifiedData.matches[eventId] || [];
  if (matches.length === 0) {
    return { finished: 0, total: 0, currentRound: 0, maxRound: 0 };
  }

  const finishedMatches = matches.filter(m => m.status === 'finished' && m.team2Name !== '轮空');
  const maxRound = Math.max(...matches.map(m => m.round));
  const currentRound = matches.filter(m => m.status !== 'finished' && m.team2Name !== '轮空').length > 0
    ? matches.filter(m => m.status === 'finished' && m.team2Name !== '轮空').length + 1
    : maxRound;

  return {
    finished: finishedMatches.length,
    total: matches.filter(m => m.team2Name !== '轮空').length,
    currentRound: Math.min(currentRound, maxRound),
    maxRound
  };
};

initUnifiedData();