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
  private readonly API_BASE = process.env.REACT_APP_API_URL || 'https://rare-courage-production.up.railway.app';

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
      console.error('❌ Genel istatistik servisi hatası:', error);
      
      // Fallback data - API çalışmazsa
      return {
        success: false,
        stats: {
          il: 0,
          ilce: 0,
          mahalle: 0,
          koy: 0,
          sokak: 0
        },
        hedefler: {
          il: 81,
          ilce: 973,
          mahalle: 32408,
          koy: 18633,
          sokak: 1251158
        }
      };
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
      console.error('❌ İl istatistik servisi hatası:', error);
      
      // Fallback data - API çalışmazsa
      return {
        success: false,
        cities: [
          {
            id: 34,
            name: 'İstanbul',
            code: '34',
            stats: { il: 1, ilce: 0, mahalle: 0, koy: 0, cadde: 0, sokak: 0 }
          },
          {
            id: 6,
            name: 'Ankara',
            code: '06',
            stats: { il: 1, ilce: 0, mahalle: 0, koy: 0, cadde: 0, sokak: 0 }
          },
          {
            id: 35,
            name: 'İzmir',
            code: '35',
            stats: { il: 1, ilce: 0, mahalle: 0, koy: 0, cadde: 0, sokak: 0 }
          }
        ],
        count: 3
      };
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