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
      console.log('🔄 Mock data kullanılıyor - Backend hazırlanıyor...');
      
      // Mock data - Backend hazır olana kadar
      return {
        success: true,
        stats: {
          il: 1,      // İstanbul verisi mevcut
          ilce: 39,   // İstanbul ilçeleri
          mahalle: 963, // İstanbul mahalleleri
          koy: 0,
          sokak: 18859  // İstanbul caddeleri
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
      
      // Mock data - Backend hazır olana kadar
      console.log('🔄 İl bazında mock data kullanılıyor...');
      return {
        success: true,
        cities: [
          {
            id: 34,
            name: 'İstanbul',
            code: '34',
            stats: { il: 1, ilce: 39, mahalle: 963, koy: 0, cadde: 18859, sokak: 87000 }
          },
          {
            id: 6,
            name: 'Ankara',
            code: '06',
            stats: { il: 1, ilce: 25, mahalle: 1417, koy: 892, cadde: 23000, sokak: 43000 }
          },
          {
            id: 35,
            name: 'İzmir',
            code: '35',
            stats: { il: 1, ilce: 30, mahalle: 1129, koy: 734, cadde: 18000, sokak: 35000 }
          },
          {
            id: 16,
            name: 'Bursa',
            code: '16',
            stats: { il: 1, ilce: 17, mahalle: 855, koy: 423, cadde: 12000, sokak: 25000 }
          },
          {
            id: 7,
            name: 'Antalya',
            code: '07',
            stats: { il: 1, ilce: 19, mahalle: 669, koy: 543, cadde: 8000, sokak: 18000 }
          }
        ],
        count: 5
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