import React, { useState, useEffect } from 'react';
import MultilingualAddressService from '../services/MultilingualAddressService';

interface Props {
  className?: string;
  onDistrictSelect?: (district: any) => void;
  placeholder?: string;
  showLanguageSelector?: boolean;
}

const MultilingualAddressSearch: React.FC<Props> = ({
  className = '',
  onDistrictSelect,
  placeholder = 'İlçe arayın... (Search district...)',
  showLanguageSelector = true
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('tr');
  const [districts, setDistricts] = useState<any[]>([]);
  const [service] = useState(new MultilingualAddressService());

  useEffect(() => {
    // Mevcut dili al
    setCurrentLanguage(service.getCurrentLanguage());
    
    // İlçe verilerini yükle (örnek)
    loadDistrictData();
  }, []);

  const loadDistrictData = async () => {
    try {
      // Bu örnek implementation - gerçek projede API'den gelecek
      const response = await fetch('/api/districts'); // Varsayılan endpoint
      if (response.ok) {
        const data = await response.json();
        setDistricts(data.ilce_listesi || []);
      }
    } catch (error) {
      console.error('İlçe verisi yüklenemedi:', error);
      // Fallback veri kullan
      setDistricts([]);
    }
  };

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    
    if (searchQuery.trim().length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    
    // Debounce için setTimeout
    setTimeout(() => {
      const searchResults = service.searchMultilingual(districts, searchQuery);
      setResults(searchResults.slice(0, 10)); // İlk 10 sonuç
      setIsLoading(false);
    }, 300);
  };

  const handleLanguageChange = (language: string) => {
    service.setLanguage(language);
    setCurrentLanguage(language);
    
    // Mevcut sonuçları yeni dile göre güncelle
    if (results.length > 0) {
      const updatedResults = results.map(result => ({
        ...result,
        localizedName: service.getLocalizedName(result.district)
      }));
      setResults(updatedResults);
    }
  };

  const handleSelectDistrict = (result: any) => {
    const localizedName = service.getLocalizedName(result.district);
    setQuery(localizedName);
    setResults([]);
    
    if (onDistrictSelect) {
      onDistrictSelect(result.district);
    }
  };

  const getLanguageFlag = (langCode: string): string => {
    const flags: Record<string, string> = {
      'tr': '🇹🇷',
      'en': '🇺🇸', 
      'ar': '🇸🇦',
      'ku': '🏴',
      'hy': '🇦🇲',
      'el': '🇬🇷',
      'bg': '🇧🇬',
      'sr': '🇷🇸'
    };
    return flags[langCode] || '🌐';
  };

  return (
    <div className={`multilingual-address-search ${className}`}>
      {/* Dil Seçici */}
      {showLanguageSelector && (
        <div className="language-selector mb-3">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            🌍 Dil / Language:
          </label>
          <div className="flex flex-wrap gap-2">
            {service.getSupportedLanguages().map(lang => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  currentLanguage === lang
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {getLanguageFlag(lang)} {service.getLanguageDisplayName(lang)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Arama Kutusu */}
      <div className="search-container relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          )}
          
          {!isLoading && query && (
            <button
              onClick={() => {
                setQuery('');
                setResults([]);
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Sonuçlar */}
        {results.length > 0 && (
          <div className="search-results absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
            {results.map((result, index) => {
              const localizedName = service.getLocalizedName(result.district);
              const alternatives = service.getAlternativeNames(result.district);
              
              return (
                <div
                  key={`${result.district.id}-${index}`}
                  onClick={() => handleSelectDistrict(result)}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      {/* Ana isim */}
                      <div className="font-medium text-gray-900">
                        {localizedName}
                        {result.matched_language !== currentLanguage && (
                          <span className="ml-2 text-xs text-gray-500">
                            ({getLanguageFlag(result.matched_language)} {result.matched_value})
                          </span>
                        )}
                      </div>
                      
                      {/* Alternatif isimler */}
                      {alternatives.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          Diğer: {alternatives.slice(0, 3).join(', ')}
                          {alternatives.length > 3 && '...'}
                        </div>
                      )}
                      
                      {/* Konum bilgisi */}
                      <div className="text-xs text-blue-600 mt-1">
                        📍 İstanbul, {result.district.bolgesi} Yakası
                      </div>
                    </div>
                    
                    {/* Relevans skoru (sadece dev modda) */}
                    {process.env.NODE_ENV === 'development' && (
                      <div className="text-xs text-gray-400 ml-2">
                        {result.relevance_score}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Sonuç bulunamadı */}
        {query.length >= 2 && !isLoading && results.length === 0 && (
          <div className="search-results absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 text-center text-gray-500">
            <div className="mb-2">🔍</div>
            <div>
              "<strong>{query}</strong>" için sonuç bulunamadı
            </div>
            <div className="text-xs mt-2">
              Türkçe, İngilizce, Arapça veya Kürtçe isimle arayabilirsiniz
            </div>
          </div>
        )}
      </div>

      {/* Dil kapsamı bilgisi */}
      {districts.length > 0 && (
        <div className="language-stats mt-4 text-xs text-gray-500">
          {(() => {
            const stats = service.getLanguageStats(districts);
            const total = districts.length;
            return (
              <div className="flex flex-wrap gap-2">
                <span>Dil kapsamı:</span>
                {Object.entries(stats).map(([lang, count]) => (
                  <span key={lang} className="inline-flex items-center">
                    {getLanguageFlag(lang)} {count}/{total} (%{((count/total)*100).toFixed(0)})
                  </span>
                ))}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default MultilingualAddressSearch; 