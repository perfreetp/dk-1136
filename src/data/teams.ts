import { Team, Contact, Rating, HistoryRecord } from '@/types';

export const mockTeams: Team[] = [
  {
    id: 't1',
    name: '无敌战队',
    avatar: 'https://picsum.photos/id/1/200/200',
    memberCount: 5,
    maxMembers: 5,
    captainId: 'u1',
    captainName: '小明',
    members: [
      { id: 'u1', name: '小明', avatar: 'https://picsum.photos/id/64/100/100', role: 'captain' },
      { id: 'u2', name: '阿杰', avatar: 'https://picsum.photos/id/91/100/100', role: 'member' },
      { id: 'u3', name: '大壮', avatar: 'https://picsum.photos/id/177/100/100', role: 'member' },
      { id: 'u4', name: '小王', avatar: 'https://picsum.photos/id/338/100/100', role: 'member' },
      { id: 'u5', name: '阿强', avatar: 'https://picsum.photos/id/1027/100/100', role: 'member' },
    ],
    createdAt: '2024-01-10'
  },
  {
    id: 't2',
    name: '王者归来',
    avatar: 'https://picsum.photos/id/2/200/200',
    memberCount: 4,
    maxMembers: 5,
    captainId: 'u2',
    captainName: '阿杰',
    members: [
      { id: 'u2', name: '阿杰', avatar: 'https://picsum.photos/id/91/100/100', role: 'captain' },
      { id: 'u6', name: '小刚', avatar: 'https://picsum.photos/id/177/100/100', role: 'member' },
      { id: 'u7', name: '阿华', avatar: 'https://picsum.photos/id/338/100/100', role: 'member' },
      { id: 'u8', name: '老张', avatar: 'https://picsum.photos/id/1027/100/100', role: 'member' },
    ],
    createdAt: '2024-01-12'
  },
  {
    id: 't3',
    name: '绝地求生',
    avatar: 'https://picsum.photos/id/3/200/200',
    memberCount: 3,
    maxMembers: 5,
    captainId: 'u3',
    captainName: '大壮',
    members: [
      { id: 'u3', name: '大壮', avatar: 'https://picsum.photos/id/177/100/100', role: 'captain' },
      { id: 'u9', name: '阿龙', avatar: 'https://picsum.photos/id/64/100/100', role: 'member' },
      { id: 'u10', name: '小胖', avatar: 'https://picsum.photos/id/91/100/100', role: 'member' },
    ],
    createdAt: '2024-01-15'
  },
  {
    id: 't4',
    name: '星辰大海',
    avatar: 'https://picsum.photos/id/6/200/200',
    memberCount: 5,
    maxMembers: 5,
    captainId: 'u4',
    captainName: '小王',
    members: [
      { id: 'u4', name: '小王', avatar: 'https://picsum.photos/id/338/100/100', role: 'captain' },
      { id: 'u11', name: '阿伟', avatar: 'https://picsum.photos/id/177/100/100', role: 'member' },
      { id: 'u12', name: '老李', avatar: 'https://picsum.photos/id/1027/100/100', role: 'member' },
      { id: 'u13', name: '阿兵', avatar: 'https://picsum.photos/id/64/100/100', role: 'member' },
      { id: 'u14', name: '小陈', avatar: 'https://picsum.photos/id/91/100/100', role: 'member' },
    ],
    createdAt: '2024-01-18'
  },
  {
    id: 't5',
    name: '电竞新秀',
    avatar: 'https://picsum.photos/id/8/200/200',
    memberCount: 2,
    maxMembers: 5,
    captainId: 'u5',
    captainName: '阿强',
    members: [
      { id: 'u5', name: '阿强', avatar: 'https://picsum.photos/id/1027/100/100', role: 'captain' },
      { id: 'u15', name: '新人甲', avatar: 'https://picsum.photos/id/64/100/100', role: 'member' },
    ],
    createdAt: '2024-01-20'
  }
];

export const mockContacts: Contact[] = [
  { id: 'c1', name: '小明', phone: '138****1234', role: '队友', teamId: 't1' },
  { id: 'c2', name: '阿杰', phone: '139****5678', role: '队友', teamId: 't1' },
  { id: 'c3', name: '大壮', phone: '137****9012', role: '队友', teamId: 't1' },
  { id: 'c4', name: '极速网吧', phone: '021-****1234', role: '赛事主办', teamId: undefined },
];

export const mockHistory: HistoryRecord[] = [
  { id: 'h1', eventId: '1', eventTitle: '周末英雄联盟争霸赛', game: 'lol', gameIcon: 'https://picsum.photos/id/1/100/100', result: 'win', prize: '冠军500元', date: '2024-01-20' },
  { id: 'h2', eventId: '2', eventTitle: '无畏契约新人赛', game: 'valorant', gameIcon: 'https://picsum.photos/id/2/100/100', result: 'lose', date: '2024-01-21' },
  { id: 'h3', eventId: '3', eventTitle: 'DOTA2水友赛', game: 'dota2', gameIcon: 'https://picsum.photos/id/3/100/100', result: 'win', prize: '参与奖', date: '2024-01-22' },
  { id: 'h4', eventId: '4', eventTitle: 'CS:GO枪王争霸', game: 'csgo', gameIcon: 'https://picsum.photos/id/6/100/100', result: 'other', date: '2024-01-15' },
  { id: 'h5', eventId: '5', eventTitle: '绝地求生四排赛', game: 'pubg', gameIcon: 'https://picsum.photos/id/8/100/100', result: 'win', prize: '亚军200元', date: '2024-01-10' },
];

export const mockRatings: Rating[] = [
  { id: 'r1', eventId: '1', eventTitle: '周末英雄联盟争霸赛', rating: 5, content: '环境很好，组织有序，下次还来！', date: '2024-01-20', organizerReply: '感谢支持！' },
  { id: 'r2', eventId: '2', eventTitle: '无畏契约新人赛', rating: 4, content: '比赛很激烈，希望多点这类赛事', date: '2024-01-21' },
  { id: 'r3', eventId: '3', eventTitle: 'DOTA2水友赛', rating: 5, content: '气氛很棒，认识了很多朋友', date: '2024-01-22', organizerReply: '欢迎常来！' },
];

export const getTeamById = (id: string): Team | undefined => {
  return mockTeams.find(t => t.id === id);
};