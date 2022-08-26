import { CacheService } from '../../services';

const cacheService = new CacheService();

describe('CacheService Test', () => {
  const key = 'test';
  const value = 123;

  describe('set and get method', () => {
    it('should insert and retrieve with sucess', () => {
      cacheService.set(key, value);
      const valueCached = cacheService.get(key);
      cacheService.deleteKey(key);

      expect(valueCached).toEqual(value);
    });
  });

  describe('checkKey method', () => {
    it('should receive false if no exists', () => {
      const hasKey = cacheService.checkKey(key);

      expect(hasKey).toEqual(false);
    });

    it('should receive true if no exists', () => {
      cacheService.set(key, value);
      const hasKey = cacheService.checkKey(key);
      cacheService.deleteKey(key);

      expect(hasKey).toEqual(true);
    });
  });

  describe('deleteKey method', () => {
    it('should delete key with sucess', () => {
      cacheService.set(key, value);
      cacheService.deleteKey(key);
      const hasKey = cacheService.checkKey(key);

      expect(hasKey).toEqual(false);
    });
  });
});
