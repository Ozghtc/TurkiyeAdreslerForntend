// StatsService.ts - İstatistik API servisi
export interface GeneralStats {
  il: number;
  ilce: number;
  mahalle: number;
  koy: number;
  sokak: number;
}

export interface CityStats {
  id: number;
  name: string;
  code: string;
  stats: {
    il: number;
    ilce: number;
    mahalle: number;
    koy: number;
    cadde: number;
    sokak: number;
  };
}

export interface GeneralStatsResponse {
  success: boolean;
  stats: GeneralStats;
  hedefler: GeneralStats;
}

export interface CityStatsResponse {
  success: boolean;
  cities: CityStats[];
  count: number;
}

class StatsService {
  private readonly API_BASE: string;

  constructor() {
    // Environment variable kontrolü - CURSORROOLS.MD KURAL 17 uyumu
    const envApiUrl = process.env.REACT_APP_API_URL;
    if (!envApiUrl) {
      throw new Error('REACT_APP_API_URL environment variable is required');
    }
    this.API_BASE = envApiUrl;
  }

  /**
   * Genel istatistikleri getir (toplam sayılar)
   */
  async getGeneralStats(): Promise<GeneralStatsResponse> {
    try {
      console.log('📊 Genel istatistikler getiriliyor...');
      
      const response = await fetch(`${this.API_BASE}/api/stats/general`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Genel istatistikler alındı:', data);
      
      return data;
    } catch (error) {
      console.error('❌ Backend API hatası - Production ortamında mock data kullanılmaz:', error);
      // KURAL 16 & 18: Mock data yasak, backend düzeltmesi gerekli
      throw new Error('API service unavailable - Backend düzeltmesi gerekli');
    }
  }

  /**
   * İl bazında detaylı istatistikleri getir
   */
  async getCityStats(): Promise<CityStatsResponse> {
    try {
      console.log('🏛️ İl bazında istatistikler getiriliyor...');
      
      const response = await fetch(`${this.API_BASE}/api/stats/cities`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ İl istatistikleri alındı:', data);
      
      return data;
    } catch (error) {
      console.error('❌ Backend API hatası - Production ortamında mock data kullanılmaz:', error);
      // KURAL 16 & 18: Mock data yasak, backend düzeltmesi gerekli
      throw new Error('API service unavailable - Backend düzeltmesi gerekli');
    }
  }

  /**
   * API durumunu kontrol et
   */
  async checkApiHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

// ESLint rule fix: assign to variable before exporting
const statsService = new StatsService();
export default statsService;