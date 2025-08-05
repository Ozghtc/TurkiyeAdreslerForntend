// AddressService.ts - Bu dosya artık eski dataService'e bağımlı değil

interface Street {
  id: string;
  name: string;
  type: string;
  quarterId: string;
  districtId: string;
  cityId: string;
  searchText: string;
}

interface SearchResult {
  id: string;
  name: string;
  type: 'Mahalle' | 'Cadde' | 'Sokak' | 'Bulvar' | 'Meydan' | 'Küme Evler';
  fullAddress: string;
  score: number;
  quarterId?: string;
  districtId?: string;
  cityId?: string;
}

class AddressService {
  private streetsIndex: Map<string, Street[]> = new Map();
  private isIndexLoaded = false;
  private streetCache: Map<string, SearchResult[]> = new Map();

  // Türkçe karakter normalizasyonu
  private normalizeText(text: string): string {
    const turkishMap: { [key: string]: string } = {
      'ş': 's', 'Ş': 's', 'ğ': 'g', 'Ğ': 'g',
      'ı': 'i', 'I': 'i', 'İ': 'i', 'ü': 'u', 'Ü': 'u',
      'ö': 'o', 'Ö': 'o', 'ç': 'c', 'Ç': 'c'
    };
    
    return text
      .toLowerCase()
      .replace(/[şŞğĞıIİüÜöÖçÇ]/g, (match) => turkishMap[match] || match);
  }

  // Türkiye adres verilerini yükle ve indexle
  async loadAddressData(): Promise<void> {
    if (this.isIndexLoaded) return;

    try {
      console.log('🇹🇷 Türkiye adres verileri yükleniyor...');
      
      // Türkiye'nin EN YAYGIN cadde/sokak isimleri
      const turkishStreets = [
        // Ankara mahalle isimleri cadde olarak da kullanılıyor
        { name: 'KIZILAY', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'ÇANKAYA', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'KEÇİÖREN', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'MAMAK', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'SİNCAN', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'YENİMAHALLE', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'ETİMESGUT', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'GÖLBAŞI', type: 'Cadde', city: 'TÜRKİYE' },
        
        // İstanbul mahalle isimleri cadde olarak da kullanılıyor
        { name: 'KADIKÖY', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'BEŞİKTAŞ', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'ŞIŞLI', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'BEYOĞLU', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'FATİH', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'ÜSKÜDAR', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'KARTAL', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'MALTEPE', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'PENDİK', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'ATAŞEHIR', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'BAHÇELIEVLER', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'BAĞCILAR', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'KÜÇÜKÇEKMECE', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'SULTANBEYLİ', type: 'Cadde', city: 'TÜRKİYE' },
        
        // İzmir
        { name: 'KONAK', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'KARŞIYAKA', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'BORNOVA', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'BUCA', type: 'Cadde', city: 'TÜRKİYE' },
        
        // Geleneksel popüler caddeler
        { name: 'İSTİKLAL', type: 'Cadde', city: 'İSTANBUL' },
        { name: 'BAĞDAT', type: 'Cadde', city: 'İSTANBUL' },
        { name: 'NİŞANTAŞI', type: 'Cadde', city: 'İSTANBUL' },
        { name: 'BARBAROS', type: 'Bulvar', city: 'İSTANBUL' },
        { name: 'ATATÜRK', type: 'Bulvar', city: 'ANKARA' },
        { name: 'CUMHURİYET', type: 'Cadde', city: 'ANKARA' },
        { name: 'KIZILIRMAK', type: 'Cadde', city: 'ANKARA' },
        { name: 'TUNALI HİLMİ', type: 'Cadde', city: 'ANKARA' },
        { name: 'KORDON', type: 'Cadde', city: 'İZMİR' },
        { name: 'KEMERLI', type: 'Cadde', city: 'İZMİR' },
        { name: 'GAZİ', type: 'Bulvar', city: 'İZMİR' },
        
        // Türkiye geneli yaygın cadde adları
        { name: 'HÜRRİYET', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'MUSTAFA KEMAL', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'İNÖNÜ', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'MEHMET AKİF', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'OSMAN GAZİ', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'ERTUĞRUL GAZİ', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'MEVLANA', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'YENİ', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'ESKİ', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'MERKEZ', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'ÇARŞI', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'PAZAR', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'HASTANE', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'OKUL', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'CAMİİ', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'PARK', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'SPOR', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'SANAT', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'BİLİM', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'KÜLTÜR', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'DOSTLUK', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'HÜRMET', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'SELAM', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'BARIŞ', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'GÜVEN', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'SEVGI', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'UMUT', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'MİLLET', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'VATAN', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'YURT', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'DEVLET', type: 'Cadde', city: 'TÜRKİYE' },
        
        // Ekstra yaygın isimler
        { name: 'ADALET', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'ÖZGÜRLÜK', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'EGEMENLİK', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'CUMHURİYET', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'DEMOKRASİ', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'ZAFERTEPEYEİMAZI', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'ULUS', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'SAĞLIK', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'EĞİTİM', type: 'Cadde', city: 'TÜRKİYE' },
        { name: 'KALKINDIRMA', type: 'Cadde', city: 'TÜRKİYE' },
      ];

      // Search index oluştur
      turkishStreets.forEach((street, index) => {
        const searchTerms = this.generateSearchTerms(street.name);
        
        searchTerms.forEach(term => {
          if (!this.streetsIndex.has(term)) {
            this.streetsIndex.set(term, []);
          }
          
          this.streetsIndex.get(term)!.push({
            id: `street-${index}`,
            name: street.name,
            type: street.type,
            quarterId: '',
            districtId: '',
            cityId: '',
            searchText: `${street.name} ${street.type}`.toLowerCase()
          });
        });
      });

      this.isIndexLoaded = true;
      console.log(`✅ ${turkishStreets.length} cadde/sokak indexlendi`);
      
    } catch (error) {
      console.error('❌ Adres verileri yüklenirken hata:', error);
    }
  }

  // Google gibi smart search terms oluştur
  private generateSearchTerms(streetName: string): string[] {
    const terms: Set<string> = new Set();
    const normalized = streetName.toLowerCase();
    const normalizedTurkish = this.normalizeText(streetName);
    
    // Tam isim - hem Türkçe hem İngilizce karakter
    terms.add(normalized);
    terms.add(normalizedTurkish);
    
    // Kelimelerin ilk harfleri
    const words = normalized.split(' ');
    const wordsNormalized = normalizedTurkish.split(' ');
    
    words.forEach(word => {
      if (word.length > 1) {
        terms.add(word);
        // İlk 2-3 harf
        if (word.length >= 3) terms.add(word.substring(0, 3));
        if (word.length >= 4) terms.add(word.substring(0, 4));
      }
    });
    
    wordsNormalized.forEach(word => {
      if (word.length > 1) {
        terms.add(word);
        // İlk 2-3 harf
        if (word.length >= 3) terms.add(word.substring(0, 3));
        if (word.length >= 4) terms.add(word.substring(0, 4));
      }
    });
    
    // Prefix search için - hem Türkçe hem İngilizce
    for (let i = 1; i <= normalized.length; i++) {
      terms.add(normalized.substring(0, i));
    }
    for (let i = 1; i <= normalizedTurkish.length; i++) {
      terms.add(normalizedTurkish.substring(0, i));
    }
    
    return Array.from(terms);
  }

  // Google tarzı akıllı arama
  async search(query: string, limit: number = 10): Promise<SearchResult[]> {
    await this.loadAddressData();
    
    if (query.length < 2) return [];
    
    const cacheKey = `${query.toLowerCase()}-${limit}`;
    if (this.streetCache.has(cacheKey)) {
      return this.streetCache.get(cacheKey)!;
    }

    const results: SearchResult[] = [];
    const queryLower = query.toLowerCase();
    const queryNormalized = this.normalizeText(query);

    // Debug log - Türkçe karakter normalizasyonu
    console.log(`🔍 Arama: "${query}"`);
    console.log(`📝 Normal: "${queryLower}"`);
    console.log(`🔄 Normalized: "${queryNormalized}"`);

    try {
      // Mahalle arama (50% of results) - İngilizce karakterlerle de ara
      // const mahalleResults = searchMahalleler(query, Math.ceil(limit * 0.5)); // This line was removed
      // const mahalleResultsNormalized = queryNormalized !== queryLower ? 
      //   searchMahalleler(queryNormalized, Math.ceil(limit * 0.5)) : []; // This line was removed
      
      // console.log(`🏘️ Mahalle sonuçları (orijinal): ${mahalleResults.length}`); // This line was removed
      // console.log(`🏘️ Mahalle sonuçları (normalize): ${mahalleResultsNormalized.length}`); // This line was removed
      
      // Birleştir ve dublicate'leri temizle
      // const allMahalleResults = [...mahalleResults, ...mahalleResultsNormalized]; // This line was removed
      // const uniqueMahalleResults = allMahalleResults.filter((result, index, self) => // This line was removed
      //   index === self.findIndex(r => r.mahalle.mahalle_id === result.mahalle.mahalle_id) // This line was removed
      // ); // This line was removed

      // console.log(`🏘️ Benzersiz mahalle sonuçları: ${uniqueMahalleResults.length}`); // This line was removed

      // uniqueMahalleResults.forEach(result => { // This line was removed
      //   const score = Math.max( // This line was removed
      //     this.calculateScore(queryLower, result.mahalle.mahalle_adi.toLowerCase()), // This line was removed
      //     this.calculateScore(queryNormalized, this.normalizeText(result.mahalle.mahalle_adi)) // This line was removed
      //   ); // This line was removed
      //   results.push({ // This line was removed
      //     id: `mahalle-${result.mahalle.mahalle_id}`, // This line was removed
      //     name: result.mahalle.mahalle_adi, // This line was removed
      //     type: 'Mahalle', // This line was removed
      //     fullAddress: result.fullAddress, // This line was removed
      //     score, // This line was removed
      //     quarterId: result.mahalle.mahalle_id, // This line was removed
      //     districtId: result.mahalle.ilce_id, // This line was removed
      //     cityId: result.sehirId // This line was removed
      //   }); // This line was removed
      // }); // This line was removed

      // Cadde/sokak arama (50% of results) - İngilizce karakterlerle de ara
      const streetMatches = this.searchStreets(queryLower, Math.ceil(limit * 0.5));
      const streetMatchesNormalized = queryNormalized !== queryLower ? 
        this.searchStreets(queryNormalized, Math.ceil(limit * 0.5)) : [];
      
      // console.log(`🛣️ Cadde sonuçları (orijinal): ${streetMatches.length}`); // This line was removed
      // console.log(`🛣️ Cadde sonuçları (normalize): ${streetMatchesNormalized.length}`); // This line was removed
      
      // Birleştir ve dublicate'leri temizle
      const allStreetMatches = [...streetMatches, ...streetMatchesNormalized];
      const uniqueStreetMatches = allStreetMatches.filter((result, index, self) =>
        index === self.findIndex(r => r.id === result.id)
      );
      
      results.push(...uniqueStreetMatches);

      // Skorlara göre sırala
      results.sort((a, b) => b.score - a.score);
      
      const finalResults = results.slice(0, limit);
      
      console.log(`✅ Toplam sonuç: ${finalResults.length}`);
      
      // Cache'e kaydet
      this.streetCache.set(cacheKey, finalResults);
      
      return finalResults;
      
    } catch (error) {
      console.error('❌ Arama hatası:', error);
      return [];
    }
  }

  private searchStreets(query: string, limit: number): SearchResult[] {
    const matches: SearchResult[] = [];
    const seen = new Set<string>();

    // Exact match
    if (this.streetsIndex.has(query)) {
      const streets = this.streetsIndex.get(query)!;
      streets.forEach((street: Street) => {
        if (!seen.has(street.id)) {
          seen.add(street.id);
          matches.push({
            id: street.id,
            name: street.name,
            type: street.type as any,
            fullAddress: `${street.name} ${street.type}`,
            score: 100,
            quarterId: street.quarterId,
            districtId: street.districtId,
            cityId: street.cityId
          });
        }
      });
    }

    // Prefix search
    const indexEntries = Array.from(this.streetsIndex.entries());
    for (const [term, streets] of indexEntries) {
      if (term.startsWith(query) && matches.length < limit) {
        streets.forEach((street: Street) => {
          if (!seen.has(street.id)) {
            seen.add(street.id);
            const score = this.calculateScore(query, term);
            matches.push({
              id: street.id,
              name: street.name,
              type: street.type as any,
              fullAddress: `${street.name} ${street.type}`,
              score: score * 0.8, // Prefix match biraz daha düşük skor
              quarterId: street.quarterId,
              districtId: street.districtId,
              cityId: street.cityId
            });
          }
        });
      }
    }

    return matches
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  // Google tarzı scoring algoritması
  private calculateScore(query: string, text: string): number {
    if (query === text) return 100;
    if (text.startsWith(query)) return 90;
    if (text.includes(query)) return 70;
    
    // Levenshtein distance benzeri
    const similarity = this.stringSimilarity(query, text);
    return Math.round(similarity * 50);
  }

  private stringSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  // Cache temizle
  clearCache(): void {
    this.streetCache.clear();
  }
}

// Singleton instance
export const addressService = new AddressService();
export default AddressService; 