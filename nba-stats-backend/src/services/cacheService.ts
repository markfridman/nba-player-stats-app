import * as NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes default TTL

export const getCachedData = <T>(key: string): T | undefined => {
  return cache.get<T>(key);
};

export const setCachedData = <T>(key: string, data: T, ttl?: number): void => {
  cache.set(key, data, ttl);
};
