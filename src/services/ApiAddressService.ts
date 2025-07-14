// API-based Address Service for Railway Backend

interface ApiSearchResult {
  id: string;
  name: string;
  type: 'Mahalle' | 'Cadde' | 'Sokak' | 'Bulvar' | 'Meydan' | 'Küme Evler';
  fullAddress: string;
  score?: number;
  quarterId?: string;
  districtId?: string;
  cityId?: string;
}

interface ApiResponse {
  results: ApiSearchResult[];
}

class ApiAddressService {
  private apiBaseUrl: string;
  private cache: Map<string, ApiSearchResult[]> = new Map();

  constructor(apiBaseUrl: string = 'http://localhost:3001') {
    this.apiBaseUrl = apiBaseUrl;
  }

  // API URL'i güncelle (Railway deploy sonrası)
  setApiUrl(url: string): void {
    this.apiBaseUrl = url;
    this.cache.clear(); // URL değiştiğinde cache temizle
  }

  // Ana arama fonksiyonu
  async search(query: string, limit: number = 10): Promise<ApiSearchResult[]> {
    if (query.length < 2) return [];

    const cacheKey = `${query.toLowerCase()}-${limit}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      console.log(`🔍 API Arama: "${query}"`);
      
      const response = await fetch(
        `${this.apiBaseUrl}/api/search?q=${encodeURIComponent(query)}&limit=${limit}`
      );
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      
      console.log(`✅ API Sonuçları: ${data.results.length} adet`);
      
      // Cache'e kaydet
      this.cache.set(cacheKey, data.results);
      
      return data.results;
      
    } catch (error) {
      console.error('❌ API Arama Hatası:', error);
      
      // API hatası durumunda boş array döndür
      console.log('⚠️ API kullanılamıyor, boş sonuç döndürülüyor...');
      return [];
    }
  }

  // Şehirler listesi
  async getCities(): Promise<any[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/cities`);
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      
      const data = await response.json();
      return data.cities;
    } catch (error) {
      console.error('❌ Şehirler API Hatası:', error);
      return [];
    }
  }

  // İlçeler listesi
  async getDistricts(cityId: string): Promise<any[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/districts/${cityId}`);
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      
      const data = await response.json();
      return data.districts;
    } catch (error) {
      console.error('❌ İlçeler API Hatası:', error);
      return [];
    }
  }

  // Mahalleler listesi
  async getNeighborhoods(districtId: string): Promise<any[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/neighborhoods/${districtId}`);
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      
      const data = await response.json();
      return data.neighborhoods;
    } catch (error) {
      console.error('❌ Mahalleler API Hatası:', error);
      return [];
    }
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/health`);
      return response.ok;
    } catch (error) {
      console.error('❌ Health Check Hatası:', error);
      return false;
    }
  }

  // Cache temizle
  clearCache(): void {
    this.cache.clear();
  }
}

// Singleton instance
export const apiAddressService = new ApiAddressService();
export default ApiAddressService; 