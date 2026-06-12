import Taro from '@tarojs/taro';

const PREFIX = 'esports_';

export const storage = {
  get<T>(key: string, defaultValue?: T): T | undefined {
    try {
      const value = Taro.getStorageSync(`${PREFIX}${key}`);
      if (value) {
        return JSON.parse(value) as T;
      }
      return defaultValue;
    } catch (e) {
      console.error('[Storage] Get error:', e);
      return defaultValue;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      Taro.setStorageSync(`${PREFIX}${key}`, JSON.stringify(value));
    } catch (e) {
      console.error('[Storage] Set error:', e);
    }
  },

  remove(key: string): void {
    try {
      Taro.removeStorageSync(`${PREFIX}${key}`);
    } catch (e) {
      console.error('[Storage] Remove error:', e);
    }
  },

  clear(): void {
    try {
      const info = Taro.getStorageInfoSync();
      if (info.keys) {
        info.keys.forEach(key => {
          if (key.startsWith(PREFIX)) {
            Taro.removeStorageSync(key);
          }
        });
      }
    } catch (e) {
      console.error('[Storage] Clear error:', e);
    }
  }
};

export const STORAGE_KEYS = {
  MY_TEAMS: 'my_teams',
  REGISTERED_TEAMS: 'registered_teams',
  CONTACTS: 'contacts',
  RATINGS: 'ratings',
  NOTIFICATIONS: 'notifications',
  MATCHES: 'matches',
  DISPUTES: 'disputes'
};