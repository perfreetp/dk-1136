export interface Event {
  id: string;
  title: string;
  game: string;
  gameIcon: string;
  startTime: string;
  endTime: string;
  location: string;
  entryFee: number;
  prize: string;
  maxTeams: number;
  currentTeams: number;
  status: 'pending' | 'ongoing' | 'finished' | 'cancelled';
  tags: string[];
  description: string;
  organizerId: string;
  organizerName: string;
  machineCount: number;
  signInStart: string;
  signInEnd: string;
  rules: string;
}

export interface Team {
  id: string;
  name: string;
  avatar: string;
  memberCount: number;
  maxMembers: number;
  captainId: string;
  captainName: string;
  members: TeamMember[];
  createdAt: string;
  eventId?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: 'captain' | 'member';
}

export interface Notification {
  id: string;
  type: 'event' | 'system' | 'match';
  title: string;
  content: string;
  time: string;
  isRead: boolean;
  eventId?: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  isOrganizer: boolean;
  myTeams: string[];
  participatedEvents: string[];
}

export interface Match {
  id: string;
  eventId: string;
  round: number;
  matchNumber: number;
  team1Id: string;
  team1Name: string;
  team1Avatar: string;
  team2Id: string;
  team2Name: string;
  team2Avatar: string;
  score1?: number;
  score2?: number;
  status: 'pending' | 'ongoing' | 'finished';
  startTime: string;
  winnerId?: string;
}

export interface HistoryRecord {
  id: string;
  eventId: string;
  eventTitle: string;
  game: string;
  gameIcon: string;
  result: 'win' | 'lose' | 'other';
  prize?: string;
  date: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  role: string;
  teamId?: string;
}

export interface Rating {
  id: string;
  eventId: string;
  eventTitle: string;
  rating: number;
  content: string;
  date: string;
  organizerReply?: string;
}

export interface UnifiedTeam extends Team {
  signedIn: boolean;
}

export type GameCategory = 'all' | 'lol' | 'dota2' | 'csgo' | 'valorant' | 'pubg' | 'other';

export const gameCategoryMap: Record<GameCategory, string> = {
  all: '全部',
  lol: '英雄联盟',
  dota2: 'DOTA2',
  csgo: 'CS:GO',
  valorant: '无畏契约',
  pubg: '绝地求生',
  other: '其他'
};