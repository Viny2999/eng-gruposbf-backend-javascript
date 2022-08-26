import { LoggerService } from './logger.service';
import Cache from 'node-cache';

const cache = new Cache();
const logger = LoggerService.getLogger();
export class CacheService {

  public set = (key: string, obj: any): void => {
    try {
      cache.set(key, obj, process.env.CACHE_TIME);
      logger.debug(`CacheService :: setCache :: cacheSeted with key ${key}`);
    } catch (error) {
      logger.error('CacheService :: setCache :: Error ', error);
    }
  }

  public get = (key: string): any => {
    try {
      const value = cache.get(key);
      logger.debug(`CacheService :: getCache :: cacheGeted with key ${key}`);
      return value;
    } catch (error) {
      logger.error('CacheService :: getCache :: Error ', error);
    }
  }

  public checkKey = (key: string) => {
    return cache.has(key);
  }

  public deleteKey = (key: string) => {
    return cache.del(key);
  }
}
