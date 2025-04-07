import { TrackingData, DayData } from '../types';

const STORAGE_KEY = 'breastfeeding_data';

export const storageService = {
  getData: (): TrackingData => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  },

  saveData: (data: TrackingData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  addFeedingSession: (date: string, session: any) => {
    const data = storageService.getData();
    if (!data[date]) {
      data[date] = { dojenje: [], vaga: [] };
    }
    data[date].dojenje.push(session);
    storageService.saveData(data);
  },

  addWeightMeasurement: (date: string, measurement: any) => {
    const data = storageService.getData();
    if (!data[date]) {
      data[date] = { dojenje: [], vaga: [] };
    }
    data[date].vaga.push(measurement);
    storageService.saveData(data);
  },

  getDayData: (date: string): DayData | null => {
    const data = storageService.getData();
    return data[date] || null;
  },
}; 