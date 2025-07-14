import { 
  SokakCadde, 
  KazimaKonfigurasyonu, 
  KazimaIlerlemesi, 
  KazimaRaporu,
  Ilce,
  ApiCevap 
} from '../types';

// Frontend Sokak Kazıma Servisi
export class SokakKazimaService {
  private apiBaseUrl: string;
  private config: KazimaKonfigurasyonu;
  private ilerlemeCallback?: (ilerleme: KazimaIlerlemesi) => void;

  constructor(apiBaseUrl: string, config: KazimaKonfigurasyonu) {
    this.apiBaseUrl = apiBaseUrl;
    this.config = config;
  }

  // İlerleme callback'i kaydet
  onIlerleme(callback: (ilerleme: KazimaIlerlemesi) => void) {
    this.ilerlemeCallback = callback;
  }

  // Sokak kazıma işlemini başlat
  async sokakKazimayiBaslat(ilceler: string[]): Promise<KazimaRaporu> {
    try {
      console.log('🚀 Sokak kazıma işlemi başlatılıyor...');
      
      const istek = {
        ilceler,
        config: this.config,
        baslangicZamani: new Date().toISOString()
      };

      const response = await this.apiIstegi<KazimaRaporu>('/api/sokak-kazima/baslat', 'POST', istek);
      
      if (response.basarili && response.veri) {
        console.log('✅ Sokak kazıma başarıyla tamamlandı');
        return response.veri;
      } else {
        throw new Error(response.hata || 'Bilinmeyen hata');
      }
    } catch (error) {
      console.error('❌ Sokak kazıma hatası:', error);
      throw error;
    }
  }

  // İlerleme durumunu sorgula
  async ilerlemeDurumunuSorgula(islemId: string): Promise<KazimaIlerlemesi> {
    try {
      const response = await this.apiIstegi<KazimaIlerlemesi>(`/api/sokak-kazima/ilerleme/${islemId}`);
      
      if (response.basarili && response.veri) {
        // İlerleme callback'ini çağır
        if (this.ilerlemeCallback) {
          this.ilerlemeCallback(response.veri);
        }
        return response.veri;
      } else {
        throw new Error(response.hata || 'İlerleme sorgulanamadı');
      }
    } catch (error) {
      console.error('❌ İlerleme sorgulama hatası:', error);
      throw error;
    }
  }

  // İlçe bazında sokak listesini getir
  async ilceSokaklariniGetir(ilce: string): Promise<SokakCadde[]> {
    try {
      const response = await this.apiIstegi<SokakCadde[]>(`/api/sokaklar/ilce/${encodeURIComponent(ilce)}`);
      
      if (response.basarili && response.veri) {
        return response.veri;
      } else {
        throw new Error(response.hata || 'Sokaklar getirilemedi');
      }
    } catch (error) {
      console.error(`❌ ${ilce} sokakları getirilirken hata:`, error);
      throw error;
    }
  }

  // Tüm İstanbul ilçelerini getir
  async ilceleriGetir(): Promise<Ilce[]> {
    try {
      const response = await this.apiIstegi<Ilce[]>('/api/ilceler/istanbul');
      
      if (response.basarili && response.veri) {
        return response.veri;
      } else {
        throw new Error(response.hata || 'İlçeler getirilemedi');
      }
    } catch (error) {
      console.error('❌ İlçeler getirilirken hata:', error);
      throw error;
    }
  }

  // Sokak arama
  async sokakAra(sorgu: string, ilce?: string): Promise<SokakCadde[]> {
    try {
      const params = new URLSearchParams({ sorgu });
      if (ilce) params.append('ilce', ilce);
      
      const response = await this.apiIstegi<SokakCadde[]>(`/api/sokaklar/ara?${params}`);
      
      if (response.basarili && response.veri) {
        return response.veri;
      } else {
        throw new Error(response.hata || 'Arama yapılamadı');
      }
    } catch (error) {
      console.error('❌ Sokak arama hatası:', error);
      throw error;
    }
  }

  // Rapor indir
  async raporuIndir(format: 'json' | 'csv' | 'excel', filtre?: any): Promise<Blob> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/raporlar/indir`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ format, filtre })
      });

      if (!response.ok) {
        throw new Error(`HTTP hata: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('❌ Rapor indirme hatası:', error);
      throw error;
    }
  }

  // İstatistikleri getir
  async istatistikleriGetir(): Promise<any> {
    try {
      const response = await this.apiIstegi<any>('/api/istatistikler/genel');
      
      if (response.basarili && response.veri) {
        return response.veri;
      } else {
        throw new Error(response.hata || 'İstatistikler getirilemedi');
      }
    } catch (error) {
      console.error('❌ İstatistik getirme hatası:', error);
      throw error;
    }
  }

  // Genel API isteği fonksiyonu
  private async apiIstegi<T>(endpoint: string, method: 'GET' | 'POST' = 'GET', body?: any): Promise<ApiCevap<T>> {
    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (body && method === 'POST') {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(`${this.apiBaseUrl}${endpoint}`, options);
      
      if (!response.ok) {
        return {
          basarili: false,
          hata: `HTTP ${response.status}: ${response.statusText}`,
          statusKodu: response.status
        };
      }

      const data = await response.json();
      
      return {
        basarili: true,
        veri: data,
        statusKodu: response.status
      };
    } catch (error) {
      return {
        basarili: false,
        hata: error instanceof Error ? error.message : 'Bilinmeyen hata'
      };
    }
  }

  // Konfigürasyonu güncelle
  updateConfig(yeniConfig: Partial<KazimaKonfigurasyonu>) {
    this.config = { ...this.config, ...yeniConfig };
  }

  // Mevcut konfigürasyonu getir
  getConfig(): KazimaKonfigurasyonu {
    return { ...this.config };
  }
} 