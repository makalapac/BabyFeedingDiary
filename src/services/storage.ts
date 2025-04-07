import { TrackingData, DayData, FeedingSession, DiaperEvent, WeightMeasurement } from '../types';

const DB_NAME = 'breastfeeding_tracker';
const DB_VERSION = 1;
const STORE_NAME = 'tracking_data';

class IndexedDBStorage {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('Error opening IndexedDB');
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
    });
  }

  private async getStore(mode: IDBTransactionMode = 'readonly'): Promise<IDBObjectStore> {
    if (!this.db) {
      await this.init();
    }
    const transaction = this.db!.transaction(STORE_NAME, mode);
    return transaction.objectStore(STORE_NAME);
  }

  async getData(): Promise<TrackingData> {
    try {
      const store = await this.getStore();
      return new Promise((resolve, reject) => {
        const request = store.get('data');
        
        request.onerror = () => {
          console.error('Error reading data from IndexedDB');
          reject(request.error);
        };

        request.onsuccess = () => {
          resolve(request.result || {});
        };
      });
    } catch (error) {
      console.error('Error accessing IndexedDB:', error);
      return {};
    }
  }

  async saveData(data: TrackingData): Promise<void> {
    try {
      const store = await this.getStore('readwrite');
      return new Promise((resolve, reject) => {
        const request = store.put(data, 'data');
        
        request.onerror = () => {
          console.error('Error saving data to IndexedDB');
          reject(request.error);
        };

        request.onsuccess = () => {
          resolve();
          // Dispatch a custom event to notify components of data changes
          window.dispatchEvent(new Event('storage'));
        };
      });
    } catch (error) {
      console.error('Error accessing IndexedDB:', error);
    }
  }

  async addFeedingSession(date: string, session: FeedingSession): Promise<void> {
    const data = await this.getData();
    if (!data[date]) {
      data[date] = { dojenje: [], vaga: [] };
    }
    data[date].dojenje.push(session);
    await this.saveData(data);
  }

  async addWeightMeasurement(date: string, measurement: WeightMeasurement): Promise<void> {
    const data = await this.getData();
    if (!data[date]) {
      data[date] = { dojenje: [], vaga: [] };
    }
    data[date].vaga.push(measurement);
    await this.saveData(data);
  }

  async getDayData(date: string): Promise<DayData | null> {
    const data = await this.getData();
    return data[date] || null;
  }

  // Migration method to transfer data from localStorage to IndexedDB
  async migrateFromLocalStorage(): Promise<void> {
    const STORAGE_KEY = 'breastfeeding_data';
    const localData = localStorage.getItem(STORAGE_KEY);
    
    if (localData) {
      try {
        const parsedData = JSON.parse(localData);
        await this.saveData(parsedData);
        // Optionally, clear localStorage after successful migration
        localStorage.removeItem(STORAGE_KEY);
        console.log('Data successfully migrated from localStorage to IndexedDB');
      } catch (error) {
        console.error('Error migrating data from localStorage:', error);
      }
    }
  }

  async restoreData(data: TrackingData): Promise<void> {
    // Validate data structure
    if (typeof data !== 'object') {
      throw new Error('Invalid data format');
    }

    // Validate each day's data structure
    for (const [date, dayData] of Object.entries(data)) {
      if (!dayData || typeof dayData !== 'object') {
        throw new Error(`Invalid data format for date ${date}`);
      }
      if (!Array.isArray(dayData.dojenje)) {
        throw new Error(`Invalid feeding data format for date ${date}`);
      }
      if (!Array.isArray(dayData.vaga)) {
        throw new Error(`Invalid weight data format for date ${date}`);
      }
    }

    try {
      const store = await this.getStore('readwrite');
      return new Promise((resolve, reject) => {
        const request = store.put(data, 'data');
        
        request.onerror = () => {
          console.error('Error restoring data to IndexedDB');
          reject(request.error);
        };

        request.onsuccess = () => {
          resolve();
          // Dispatch a custom event to notify components of data changes
          window.dispatchEvent(new Event('storage'));
        };
      });
    } catch (error) {
      console.error('Error accessing IndexedDB:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
export const storageService = new IndexedDBStorage();

// Initialize the database and migrate data when the module is imported
storageService.init().then(() => {
  storageService.migrateFromLocalStorage();
}); 