import { Event, Team, Match, Notification, Contact, Rating, HistoryRecord } from '@/types';
import { storage, STORAGE_KEYS } from '@/utils/storage';

export const mockEvents: Event[] = [
  {
    id: '1',
    title: '周末英雄联盟争霸赛',
    game: 'lol',
    gameIcon: 'https://picsum.photos/id/1/100/100',
    startTime: '2024-01-20 14:00',
    endTime: '2024-01-20 20:00',
    location: '极速网吧（中山路店）',
    entryFee: 50,
    prize: '冠军500元+网费200 | 亚军300元+网费100',
    maxTeams: 16,
    currentTeams: 0,
    status: 'pending',
    tags: ['新手友好', '5v5'],
    description: '欢迎各路召唤师前来挑战！比赛采用淘汰制，每局BO1，决赛BO3。',
    organizerId: 'org1',
    organizerName: '极速网吧',
    machineCount: 20,
    signInStart: '2024-01-20 12:00',
    signInEnd: '2024-01-20 13:30',
    rules: '1. 比赛采用单淘汰制\n2. 每场比赛BO1，决赛BO3\n3. 迟到10分钟视为弃权\n4. 服从裁判判决'
  },
  {
    id: '2',
    title: '无畏契约新人赛',
    game: 'valorant',
    gameIcon: 'https://picsum.photos/id/2/100/100',
    startTime: '2024-01-21 15:00',
    endTime: '2024-01-21 21:00',
    location: '星辰电竞馆',
    entryFee: 30,
    prize: '冠军300元网费 | 亚军150元网费',
    maxTeams: 8,
    currentTeams: 0,
    status: 'ongoing',
    tags: ['新人专属', '5v5'],
    description: '专为新手设计的比赛，欢迎0-10级玩家参加！',
    organizerId: 'org2',
    organizerName: '星辰电竞馆',
    machineCount: 16,
    signInStart: '2024-01-21 14:00',
    signInEnd: '2024-01-21 14:30',
    rules: '1. 仅限0-10级玩家参加\n2. 比赛采用积分制\n3. 共进行3轮小组赛'
  },
  {
    id: '3',
    title: 'DOTA2水友赛',
    game: 'dota2',
    gameIcon: 'https://picsum.photos/id/3/100/100',
    startTime: '2024-01-22 18:00',
    endTime: '2024-01-22 23:00',
    location: '雷霆网吧',
    entryFee: 0,
    prize: '参与即送50元网费',
    maxTeams: 12,
    currentTeams: 0,
    status: 'pending',
    tags: ['免费', '娱乐赛'],
    description: '纯娱乐性质比赛，重在参与，欢乐为主！',
    organizerId: 'org3',
    organizerName: '雷霆网吧',
    machineCount: 24,
    signInStart: '2024-01-22 17:00',
    signInEnd: '2024-01-22 17:30',
    rules: '1. 娱乐为主，友谊第一\n2. 比赛采用循环赛制\n3. 不限制英雄选择'
  },
  {
    id: '4',
    title: 'CS:GO枪王争霸',
    game: 'csgo',
    gameIcon: 'https://picsum.photos/id/6/100/100',
    startTime: '2024-01-23 13:00',
    endTime: '2024-01-23 19:00',
    location: '极速网吧（中山路店）',
    entryFee: 80,
    prize: '冠军800元+外设礼包 | 亚军400元',
    maxTeams: 16,
    currentTeams: 0,
    status: 'ongoing',
    tags: ['高奖金', '竞技'],
    description: '高水平竞技比赛，邀请各路高手参与！',
    organizerId: 'org1',
    organizerName: '极速网吧',
    machineCount: 20,
    signInStart: '2024-01-23 12:00',
    signInEnd: '2024-01-23 12:30',
    rules: '1. 专业竞技规则\n2. 采用BO3淘汰赛\n3. 禁止使用任何作弊程序'
  },
  {
    id: '5',
    title: '绝地求生四排赛',
    game: 'pubg',
    gameIcon: 'https://picsum.photos/id/8/100/100',
    startTime: '2024-01-24 19:00',
    endTime: '2024-01-24 22:00',
    location: '星辰电竞馆',
    entryFee: 40,
    prize: '冠军400元 | 亚军200元',
    maxTeams: 20,
    currentTeams: 0,
    status: 'pending',
    tags: ['四排', '吃鸡'],
    description: '四排模式，积分制，共进行5场比赛！',
    organizerId: 'org2',
    organizerName: '星辰电竞馆',
    machineCount: 16,
    signInStart: '2024-01-24 18:00',
    signInEnd: '2024-01-24 18:30',
    rules: '1. 四排模式\n2. 积分制，共5场比赛\n3. 击杀积分+排名积分'
  },
  {
    id: '6',
    title: '英雄联盟情侣双排赛',
    game: 'lol',
    gameIcon: 'https://picsum.photos/id/9/100/100',
    startTime: '2024-01-25 14:00',
    endTime: '2024-01-25 18:00',
    location: '雷霆网吧',
    entryFee: 60,
    prize: '冠军情侣套餐+300元 | 亚军情侣套餐',
    maxTeams: 16,
    currentTeams: 0,
    status: 'pending',
    tags: ['情侣', '双排'],
    description: '情人节特别赛事，情侣组队参加！',
    organizerId: 'org3',
    organizerName: '雷霆网吧',
    machineCount: 24,
    signInStart: '2024-01-25 13:00',
    signInEnd: '2024-01-25 13:30',
    rules: '1. 必须是情侣组队\n2. 双排模式\n3. 比赛中需同队'
  },
  {
    id: '7',
    title: '无畏契约周末赛',
    game: 'valorant',
    gameIcon: 'https://picsum.photos/id/119/100/100',
    startTime: '2024-01-26 15:00',
    endTime: '2024-01-26 21:00',
    location: '极速网吧（中山路店）',
    entryFee: 50,
    prize: '冠军500元 | 亚军250元',
    maxTeams: 12,
    currentTeams: 0,
    status: 'pending',
    tags: ['周末', '竞技'],
    description: '周末狂欢，无畏契约等你来战！',
    organizerId: 'org1',
    organizerName: '极速网吧',
    machineCount: 20,
    signInStart: '2024-01-26 14:00',
    signInEnd: '2024-01-26 14:30',
    rules: '1. 标准竞技规则\n2. BO1小组赛+BO3决赛\n3. 禁止使用Bug'
  },
  {
    id: '8',
    title: 'DOTA2老玩家回归赛',
    game: 'dota2',
    gameIcon: 'https://picsum.photos/id/160/100/100',
    startTime: '2024-01-27 18:00',
    endTime: '2024-01-27 23:00',
    location: '星辰电竞馆',
    entryFee: 20,
    prize: '冠军200元+专属皮肤 | 亚军100元',
    maxTeams: 8,
    currentTeams: 0,
    status: 'pending',
    tags: ['老玩家', '回归'],
    description: '欢迎老玩家回归，重温DOTA2经典！',
    organizerId: 'org2',
    organizerName: '星辰电竞馆',
    machineCount: 16,
    signInStart: '2024-01-27 17:00',
    signInEnd: '2024-01-27 17:30',
    rules: '1. 欢迎所有老玩家\n2. 比赛采用BO1循环赛\n3. 重在交流'
  },
  {
    id: '9',
    title: 'CS:GO新手训练营',
    game: 'csgo',
    gameIcon: 'https://picsum.photos/id/201/100/100',
    startTime: '2024-01-28 14:00',
    endTime: '2024-01-28 17:00',
    location: '雷霆网吧',
    entryFee: 0,
    prize: '参与即送30元网费',
    maxTeams: 10,
    currentTeams: 0,
    status: 'pending',
    tags: ['免费', '新手'],
    description: '新手专属，专业教练指导！',
    organizerId: 'org3',
    organizerName: '雷霆网吧',
    machineCount: 24,
    signInStart: '2024-01-28 13:30',
    signInEnd: '2024-01-28 13:45',
    rules: '1. 新手入门教学\n2. 专业教练现场指导\n3. 实践比赛'
  },
  {
    id: '10',
    title: '全游戏综合赛',
    game: 'other',
    gameIcon: 'https://picsum.photos/id/3/100/100',
    startTime: '2024-01-29 12:00',
    endTime: '2024-01-29 20:00',
    location: '极速网吧（中山路店）',
    entryFee: 30,
    prize: '冠军300元 | 亚军150元',
    maxTeams: 20,
    currentTeams: 0,
    status: 'pending',
    tags: ['综合', '娱乐'],
    description: '多种游戏轮番上阵，综合积分制！',
    organizerId: 'org1',
    organizerName: '极速网吧',
    machineCount: 20,
    signInStart: '2024-01-29 11:00',
    signInEnd: '2024-01-29 11:30',
    rules: '1. 多种游戏项目\n2. 综合积分制\n3. 趣味性为主'
  }
];

export const hotEvents = mockEvents.filter(e => e.status === 'ongoing' || e.currentTeams >= 5).slice(0, 3);

let registeredTeamsMap: Record<string, Team[]> = storage.get(STORAGE_KEYS.REGISTERED_TEAMS) || {};
let matchesMap: Record<string, Match[]> = storage.get(STORAGE_KEYS.MATCHES) || {};

export const getRegisteredTeams = (eventId: string): Team[] => {
  return registeredTeamsMap[eventId] || [];
};

export const addRegisteredTeam = (eventId: string, team: Team): void => {
  if (!registeredTeamsMap[eventId]) {
    registeredTeamsMap[eventId] = [];
  }
  const exists = registeredTeamsMap[eventId].some(t => t.id === team.id);
  if (!exists) {
    registeredTeamsMap[eventId].push(team);
    const event = mockEvents.find(e => e.id === eventId);
    if (event) {
      event.currentTeams = registeredTeamsMap[eventId].length;
    }
    storage.set(STORAGE_KEYS.REGISTERED_TEAMS, registeredTeamsMap);
  }
};

export const isTeamRegistered = (eventId: string, teamId: string): boolean => {
  const teams = registeredTeamsMap[eventId] || [];
  return teams.some(t => t.id === teamId);
};

export const getMatches = (eventId: string): Match[] => {
  return matchesMap[eventId] || [];
};

export const setMatches = (eventId: string, matches: Match[]): void => {
  matchesMap[eventId] = matches;
  storage.set(STORAGE_KEYS.MATCHES, matchesMap);
};

export const updateMatch = (eventId: string, matchId: string, updates: Partial<Match>): void => {
  if (matchesMap[eventId]) {
    matchesMap[eventId] = matchesMap[eventId].map(m => 
      m.id === matchId ? { ...m, ...updates } : m
    );
    storage.set(STORAGE_KEYS.MATCHES, matchesMap);
  }
};

export const generateFirstRoundMatches = (eventId: string): Match[] => {
  const teams = registeredTeamsMap[eventId] || [];
  if (teams.length < 2) return [];

  const matches: Match[] = [];
  const teamCount = teams.length;
  const matchCount = Math.floor(teamCount / 2);

  for (let i = 0; i < matchCount; i++) {
    const team1 = teams[i * 2];
    const team2 = teams[i * 2 + 1];
    
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
      startTime: mockEvents.find(e => e.id === eventId)?.startTime || ''
    });
  }

  if (teamCount % 2 === 1) {
    const byeTeam = teams[teamCount - 1];
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
      startTime: mockEvents.find(e => e.id === eventId)?.startTime || ''
    });
  }

  matchesMap[eventId] = matches;
  storage.set(STORAGE_KEYS.MATCHES, matchesMap);
  return matches;
};

export const getEventById = (id: string): Event | undefined => {
  return mockEvents.find(e => e.id === id);
};

export const updateEventTeams = (eventId: string): number => {
  const teams = registeredTeamsMap[eventId] || [];
  const event = mockEvents.find(e => e.id === eventId);
  if (event) {
    event.currentTeams = teams.length;
  }
  return teams.length;
};