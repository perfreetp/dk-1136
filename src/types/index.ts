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
  team1: Team;
  team2: Team;
  score1?: number;
  score2?: number;
  status: 'pending' | 'ongoing' | 'finished';
  startTime: string;
  winner?: string;
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