/**
 * 本地存储服务
 */
export const localStorageService = {
  setItem(key: string, value: any) {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error("Error setting item to localStorage", error);
    }
  },

  getItem(key: string) {
    try {
      const serializedValue = localStorage.getItem(key);
      return serializedValue ? JSON.parse(serializedValue) : null;
    } catch (error) {
      console.error("Error getting item from localStorage", error);
      return null;
    }
  },

  removeItem(key: string) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing item from localStorage", error);
    }
  },

  clear() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Error clearing localStorage", error);
    }
  },

  sync(key: string, value: any) {
    try {
      this.removeItem(key);
      this.setItem(key, value);
    } catch (error) {
      console.error("Reset localStorage", error);
    }
  }
};
