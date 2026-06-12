import { Team, Contact, Rating, HistoryRecord } from '@/types';
import { storage, STORAGE_KEYS } from '@/utils/storage';

let myTeams: Team[] = storage.get(STORAGE_KEYS.MY_TEAMS) || [
  {
    id: 't1',
    name: '无敌战队',
    avatar: 'https://picsum.photos/id/1/200/200',
    memberCount: 5,
    maxMembers: 5,
    captainId: 'currentUser',
    captainName: '我',
    members: [
      { id: 'currentUser', name: '我', avatar: 'https://picsum.photos/id/64/100/100', role: 'captain' },
      { id: 'u2', name: '阿杰', avatar: 'https://picsum.photos/id/91/100/100', role: 'member' },
      { id: 'u3', name: '大壮', avatar: 'https://picsum.photos/id/177/100/100', role: 'member' },
      { id: 'u4', name: '小王', avatar: 'https://picsum.photos/id/338/100/100', role: 'member' },
      { id: 'u5', name: '阿强', avatar: 'https://picsum.photos/id/1027/100/100', role: 'member' },
    ],
    createdAt: '2024-01-10'
  }
];

let contacts: Contact[] = storage.get(STORAGE_KEYS.CONTACTS) || [
  { id: 'c1', name: '小明', phone: '138****1234', role: '队友', teamId: 't1' },
  { id: 'c2', name: '阿杰', phone: '139****5678', role: '队友', teamId: 't1' },
  { id: 'c3', name: '大壮', phone: '137****9012', role: '队友', teamId: 't1' },
  { id: 'c4', name: '极速网吧', phone: '021-****1234', role: '赛事主办', teamId: undefined }
];

let ratings: Rating[] = storage.get(STORAGE_KEYS.RATINGS) || [
  { id: 'r1', eventId: '1', eventTitle: '周末英雄联盟争霸赛', rating: 5, content: '环境很好，组织有序，下次还来！', date: '2024-01-20', organizerReply: '感谢支持！' },
  { id: 'r2', eventId: '2', eventTitle: '无畏契约新人赛', rating: 4, content: '比赛很激烈，希望多点这类赛事', date: '2024-01-21' },
  { id: 'r3', eventId: '3', eventTitle: 'DOTA2水友赛', rating: 5, content: '气氛很棒，认识了很多朋友', date: '2024-01-22', organizerReply: '欢迎常来！' }
];

export const mockTeams: Team[] = myTeams;

export const mockHistory: HistoryRecord[] = [
  { id: 'h1', eventId: '1', eventTitle: '周末英雄联盟争霸赛', game: 'lol', gameIcon: 'https://picsum.photos/id/1/100/100', result: 'win', prize: '冠军500元', date: '2024-01-20' },
  { id: 'h2', eventId: '2', eventTitle: '无畏契约新人赛', game: 'valorant', gameIcon: 'https://picsum.photos/id/2/100/100', result: 'lose', date: '2024-01-21' },
  { id: 'h3', eventId: '3', eventTitle: 'DOTA2水友赛', game: 'dota2', gameIcon: 'https://picsum.photos/id/3/100/100', result: 'win', prize: '参与奖', date: '2024-01-22' },
  { id: 'h4', eventId: '4', eventTitle: 'CS:GO枪王争霸', game: 'csgo', gameIcon: 'https://picsum.photos/id/6/100/100', result: 'other', date: '2024-01-15' },
  { id: 'h5', eventId: '5', eventTitle: '绝地求生四排赛', game: 'pubg', gameIcon: 'https://picsum.photos/id/8/100/100', result: 'win', prize: '亚军200元', date: '2024-01-10' }
];

export const getTeams = (): Team[] => myTeams;

export const addTeam = (team: Team): void => {
  const exists = myTeams.some(t => t.id === team.id);
  if (!exists) {
    myTeams.push(team);
    storage.set(STORAGE_KEYS.MY_TEAMS, myTeams);
  }
};

export const updateTeam = (teamId: string, updates: Partial<Team>): void => {
  myTeams = myTeams.map(t => t.id === teamId ? { ...t, ...updates } : t);
  storage.set(STORAGE_KEYS.MY_TEAMS, myTeams);
};

export const deleteTeam = (teamId: string): void => {
  myTeams = myTeams.filter(t => t.id !== teamId);
  storage.set(STORAGE_KEYS.MY_TEAMS, myTeams);
};

export const getTeamById = (id: string): Team | undefined => {
  return myTeams.find(t => t.id === id);
};

export const getContacts = (): Contact[] => contacts;

export const addContact = (contact: Contact): void => {
  contacts.push(contact);
  storage.set(STORAGE_KEYS.CONTACTS, contacts);
};

export const deleteContact = (id: string): void => {
  contacts = contacts.filter(c => c.id !== id);
  storage.set(STORAGE_KEYS.CONTACTS, contacts);
};

export const getRatings = (): Rating[] => ratings;

export const addRating = (rating: Rating): void => {
  ratings.unshift(rating);
  storage.set(STORAGE_KEYS.RATINGS, ratings);
};

export const getTeamMembers = (teamId: string) => {
  const team = myTeams.find(t => t.id === teamId);
  return team?.members || [];
};