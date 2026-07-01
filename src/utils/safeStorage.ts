class SafeMemoryStorage {
  private cache: Record<string, string> = {};

  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return this.cache[key] || null;
    }
  }

  setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch {
      this.cache[key] = value;
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      delete this.cache[key];
    }
  }

  clear(): void {
    try {
      localStorage.clear();
    } catch {
      this.cache = {};
    }
  }
}

export const safeStorage = new SafeMemoryStorage();
