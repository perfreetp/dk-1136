import { Team, TeamMember } from '@/types';

const mockMembers: TeamMember[] = [
  { id: 'u1', name: '小明', avatar: 'https://picsum.photos/id/64/100/100', role: 'captain' },
  { id: 'u2', name: '阿杰', avatar: 'https://picsum.photos/id/91/100/100', role: 'member' },
  { id: 'u3', name: '大壮', avatar: 'https://picsum.photos/id/177/100/100', role: 'member' },
  { id: 'u4', name: '小王', avatar: 'https://picsum.photos/id/338/100/100', role: 'member' },
  { id: 'u5', name: '阿强', avatar: 'https://picsum.photos/id/1027/100/100', role: 'member' },
];

export const mockTeams: Team[] = [
  {
    id: 't1',
    name: '无敌战队',
    avatar: 'https://picsum.photos/id/1/200/200',
    memberCount: 5,
    maxMembers: 5,
    captainId: 'u1',
    captainName: '小明',
    members: mockMembers,
    createdAt: '2024-01-10'
  },
  {
    id: 't2',
    name: '王者归来',
    avatar: 'https://picsum.photos/id/2/200/200',
    memberCount: 5,
    maxMembers: 5,
    captainId: 'u2',
    captainName: '阿杰',
    members: mockMembers.map(m => ({ ...m, id: m.id + '2' })),
    createdAt: '2024-01-12'
  },
  {
    id: 't3',
    name: '绝地求生',
    avatar: 'https://picsum.photos/id/3/200/200',
    memberCount: 4,
    maxMembers: 5,
    captainId: 'u3',
    captainName: '大壮',
    members: mockMembers.slice(0, 4).map(m => ({ ...m, id: m.id + '3' })),
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
    members: mockMembers.map(m => ({ ...m, id: m.id + '4' })),
    createdAt: '2024-01-18'
  },
  {
    id: 't5',
    name: '电竞新秀',
    avatar: 'https://picsum.photos/id/8/200/200',
    memberCount: 3,
    maxMembers: 5,
    captainId: 'u5',
    captainName: '阿强',
    members: mockMembers.slice(0, 3).map(m => ({ ...m, id: m.id + '5' })),
    createdAt: '2024-01-20'
  }
];