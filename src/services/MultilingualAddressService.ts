interface MultilingualData {
  tr: string;
  en?: string;
  ar?: string;
  ku?: string;
  hy?: string;
  el?: string;
  bg?: string;
  sr?: string;
  available_languages: string[];
  osm_extracted?: boolean;
  osm_source_verified?: boolean;
  extraction_date?: string;
  manual_verified?: boolean;
  historical_names?: Record<string, string>;
}

interface DistrictMultilingual {
  id: number;
  name: string;
  multilingual?: MultilingualData;
  [key: string]: any;
}

interface LanguageConfig {
  enabled: boolean;
  default_language: string;
  supported_languages: string[];
  future_languages: string[];
  language_priority: string[];
}

interface SearchResult {
  district: DistrictMultilingual;
  matched_language: string;
  matched_value: string;
  relevance_score: number;
}

export class MultilingualAddressService {
  private currentLanguage: string = 'tr';
  private fallbackLanguage: string = 'en';
  private supportedLanguages: string[] = ['tr', 'en', 'ar', 'ku'];

  constructor() {
    // Kullanıcının dil tercihini localStorage'dan al
    const savedLang = localStorage.getItem('preferred_language');
    if (savedLang && this.supportedLanguages.includes(savedLang)) {
      this.currentLanguage = savedLang;
    }
  }

  /**
   * Kullanıcının tercih ettiği dili ayarla
   */
  setLanguage(language: string): void {
    if (this.supportedLanguages.includes(language)) {
      this.currentLanguage = language;
      localStorage.setItem('preferred_language', language);
    }
  }

  /**
   * Mevcut dili getir
   */
  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  /**
   * Desteklenen dilleri getir
   */
  getSupportedLanguages(): string[] {
    return this.supportedLanguages;
  }

  /**
   * İlçe isimlerini kullanıcının diline göre görüntüle
   */
  getLocalizedName(district: DistrictMultilingual, preferredLanguages?: string[]): string {
    const languages = preferredLanguages || [this.currentLanguage, this.fallbackLanguage, 'tr'];
    
    if (!district.multilingual) {
      return district.name;
    }

    // Tercih edilen dillerde sırayla ara
    for (const lang of languages) {
      if (district.multilingual[lang as keyof MultilingualData]) {
        return district.multilingual[lang as keyof MultilingualData] as string;
      }
    }

    // Hiçbiri bulunamadıysa varsayılan ismi döndür
    return district.name;
  }

  /**
   * Çok dilli arama yap
   */
  searchMultilingual(districts: DistrictMultilingual[], query: string): SearchResult[] {
    const results: SearchResult[] = [];
    const normalizedQuery = query.toLowerCase().trim();

    if (!normalizedQuery) return [];

    districts.forEach(district => {
      if (district.multilingual) {
        // Tüm dillerde arama yap
        Object.entries(district.multilingual).forEach(([lang, value]) => {
          if (typeof value === 'string' && lang !== 'available_languages') {
            const normalizedValue = value.toLowerCase();
            
            if (normalizedValue.includes(normalizedQuery)) {
              results.push({
                district,
                matched_language: lang,
                matched_value: value,
                relevance_score: this.calculateRelevance(normalizedValue, normalizedQuery, lang)
              });
            }
          }
        });
      } else {
        // Standart arama
        const normalizedName = district.name.toLowerCase();
        if (normalizedName.includes(normalizedQuery)) {
          results.push({
            district,
            matched_language: 'tr',
            matched_value: district.name,
            relevance_score: this.calculateRelevance(normalizedName, normalizedQuery, 'tr')
          });
        }
      }
    });

    // Relevansa göre sırala ve duplicateları temizle
    const uniqueResults = results.filter((result, index, self) => 
      index === self.findIndex(r => r.district.id === result.district.id)
    );

    return uniqueResults.sort((a, b) => b.relevance_score - a.relevance_score);
  }

  /**
   * Arama sonucu relevans skoru hesapla
   */
  private calculateRelevance(value: string, query: string, language: string): number {
    let score = 0;
    
    // Tam eşleşme
    if (value === query) score += 100;
    
    // Başlangıç eşleşmesi
    else if (value.startsWith(query)) score += 80;
    
    // İçerik eşleşmesi
    else if (value.includes(query)) score += 60;

    // Dil önceliği bonusu
    const langPriority = ['tr', 'en', 'ar', 'ku', 'hy', 'el'];
    const langIndex = langPriority.indexOf(language);
    if (langIndex !== -1) {
      score += (langPriority.length - langIndex) * 2;
    }

    // Kullanıcının mevcut dili ise bonus
    if (language === this.currentLanguage) {
      score += 10;
    }

    return score;
  }

  /**
   * Dil istatistiklerini getir
   */
  getLanguageStats(districts: DistrictMultilingual[]): Record<string, number> {
    const stats: Record<string, number> = {};

    districts.forEach(district => {
      if (district.multilingual?.available_languages) {
        district.multilingual.available_languages.forEach(lang => {
          stats[lang] = (stats[lang] || 0) + 1;
        });
      }
    });

    return stats;
  }

  /**
   * Alternativ isimleri getir (tarihi isimler vs.)
   */
  getAlternativeNames(district: DistrictMultilingual): string[] {
    const alternatives: string[] = [];

    if (district.multilingual) {
      // Tüm dillerdeki isimleri topla
      Object.entries(district.multilingual).forEach(([lang, value]) => {
        if (typeof value === 'string' && lang !== 'available_languages' && value !== district.name) {
          alternatives.push(value);
        }
      });

      // Tarihi isimleri ekle
      if (district.multilingual.historical_names) {
        Object.values(district.multilingual.historical_names).forEach(name => {
          if (!alternatives.includes(name)) {
            alternatives.push(name);
          }
        });
      }
    }

    return alternatives;
  }

  /**
   * Dil formatını kullanıcı dostu hale getir
   */
  getLanguageDisplayName(langCode: string): string {
    const languageNames: Record<string, string> = {
      'tr': 'Türkçe',
      'en': 'English',
      'ar': 'العربية',
      'ku': 'Kurdî',
      'hy': 'Հայերեն',
      'el': 'Ελληνικά',
      'bg': 'Български',
      'sr': 'Српски',
      'fa': 'فارسی',
      'de': 'Deutsch',
      'fr': 'Français',
      'ru': 'Русский'
    };

    return languageNames[langCode] || langCode.toUpperCase();
  }

  /**
   * Çok dilli veri kalitesini kontrol et
   */
  validateMultilingualData(district: DistrictMultilingual): {
    isValid: boolean;
    issues: string[];
    quality_score: number;
  } {
    const issues: string[] = [];
    let quality_score = 0;

    if (!district.multilingual) {
      issues.push('Çok dilli veri yok');
      return { isValid: false, issues, quality_score };
    }

    // Minimum Türkçe + İngilizce kontrolü
    if (district.multilingual.tr) quality_score += 40;
    else issues.push('Türkçe isim eksik');

    if (district.multilingual.en) quality_score += 30;
    else issues.push('İngilizce isim eksik');

    // OSM verisi var mı?
    if (district.multilingual.osm_extracted) quality_score += 20;
    if (district.multilingual.osm_source_verified) quality_score += 10;

    // Ek diller bonusu
    const extraLanguages = district.multilingual.available_languages?.filter(
      lang => !['tr', 'en'].includes(lang)
    ) || [];
    quality_score += Math.min(extraLanguages.length * 5, 20);

    const isValid = issues.length === 0 || quality_score >= 50;

    return { isValid, issues, quality_score };
  }
}

export default MultilingualAddressService; 