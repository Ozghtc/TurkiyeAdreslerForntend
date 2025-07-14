import React, { useState, useEffect, useRef, useCallback } from 'react';
import { apiAddressService } from '../services/ApiAddressService';

interface SearchResult {
  id: string;
  name: string;
  type: string;
  quarterId: string;
  districtId: string;
  cityId: string;
  fullAddress: string;
  searchText: string;
}

interface AddressSearchProps {
  onAddressSelect: (address: {
    il: string;
    ilce: string;
    mahalle: string;
    cadde: string;
    sokak: string;
    ilAdi: string;
    ilceAdi: string;
    mahalleAdi: string;
  }) => void;
  placeholder?: string;
}

const AddressSearch: React.FC<AddressSearchProps> = ({ 
  onAddressSelect, 
  placeholder = "🔍 Adres arayın (örn: SİRİNEVLER, KIZILAY, BAHÇELIEVLER...)" 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Component yüklendiğinde API durumunu kontrol et
  useEffect(() => {
    const checkApiStatus = async () => {
      console.log('🔍 API durum kontrolü yapılıyor...');
      const isOnline = await apiAddressService.healthCheck();
      setApiStatus(isOnline ? 'online' : 'offline');
      
      if (isOnline) {
        console.log('✅ API online - Railway backend kullanılacak');
        apiAddressService.clearCache();
      } else {
        console.log('⚠️ API offline - Local JSON dosyaları kullanılacak');
      }
    };

    checkApiStatus();
  }, []);

  // Google tarzı arama fonksiyonu
  const performSearch = useCallback(async (term: string) => {
    if (term.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);

    try {
      console.log(`🔍 Arama yapılıyor: "${term}" (API: ${apiStatus})`);
      
      // API-based search kullan
      const searchResults = await apiAddressService.search(term, 10);
      
      // Sonuçları uygun formata çevir
      const formattedResults: SearchResult[] = searchResults.map(result => ({
        id: result.id,
        name: result.name,
        type: result.type,
        quarterId: result.quarterId || '',
        districtId: result.districtId || '',
        cityId: result.cityId || '',
        fullAddress: result.fullAddress,
        searchText: result.fullAddress.toLowerCase()
      }));

      console.log(`✅ ${formattedResults.length} sonuç bulundu:`, formattedResults.map(r => `${r.name} (${r.type})`));
      setResults(formattedResults);
      setShowResults(true);
      setSelectedIndex(-1);
      
    } catch (error) {
      console.error('❌ Arama hatası:', error);
      setResults([]);
      setShowResults(false);
    } finally {
      setIsLoading(false);
    }
  }, [apiStatus]);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      performSearch(searchTerm);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchTerm, performSearch]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowResults(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Seçim işlemi
  const handleSelect = (result: SearchResult) => {
    setSearchTerm(result.name);
    setResults([]);
    setShowResults(false);
    
    if (onAddressSelect) {
      if (result.type === 'Mahalle') {
        // fullAddress'den bilgileri parse et (örn: "MAHALLE, ILCE, IL")
        const addressParts = result.fullAddress.split(', ');
        const mahalleAdi = addressParts[0] || result.name;
        const ilceAdi = addressParts[1] || '';
        const ilAdi = addressParts[2] || '';
        
        onAddressSelect({
          il: result.cityId,
          ilce: result.districtId,
          mahalle: result.quarterId,
          cadde: '',
          sokak: '',
          ilAdi: ilAdi,
          ilceAdi: ilceAdi,
          mahalleAdi: mahalleAdi
        });
      } else {
        // Cadde/Sokak için
        const addressParts = result.fullAddress.split(', ');
        const sokakAdi = addressParts[0] || result.name;
        const mahalleAdi = addressParts[1] || '';
        const ilceAdi = addressParts[2] || '';
        const ilAdi = addressParts[3] || '';
        
        onAddressSelect({
          il: result.cityId,
          ilce: result.districtId,
          mahalle: result.quarterId,
          cadde: result.type === 'Cadde' || result.type === 'Bulvar' ? sokakAdi : '',
          sokak: result.type === 'Sokak' ? sokakAdi : '',
          ilAdi: ilAdi,
          ilceAdi: ilceAdi,
          mahalleAdi: mahalleAdi
        });
      }
    }
  };

  // Input değişikliği - Cursorrools.md: Otomatik büyük harf
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase(); // Otomatik büyük harf çevirme
    setSearchTerm(value);
  };

  // Dış tıklama
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Google-style result icons
  const getResultIcon = (type: string) => {
    switch (type) {
      case 'Mahalle': return '🏘️';
      case 'Cadde': return '🛣️';
      case 'Bulvar': return '🛣️';
      case 'Sokak': return '🏠';
      case 'Meydan': return '🌍';
      case 'Küme Evler': return '🏘️';
      default: return '📍';
    }
  };

  // API durum göstergesi
  const getApiStatusIcon = () => {
    switch (apiStatus) {
      case 'online': return '🟢';
      case 'offline': return '🔴';
      case 'checking': return '🟡';
      default: return '🔴';
    }
  };

  return (
    <div className="address-search-container" ref={searchRef}>
      <div className="search-input-container">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="address-search-input"
          style={{ textTransform: 'uppercase' }} // CSS ile de büyük harf gösterimi
        />
        {isLoading && (
          <div className="search-loading">
            <div className="spinner"></div>
          </div>
        )}
        {/* API durum göstergesi */}
        <div className="api-status" title={`API: ${apiStatus}`}>
          {getApiStatusIcon()}
        </div>
      </div>

      {showResults && results.length > 0 && (
        <div className="search-results">
          {results.map((result, index) => (
            <div
              key={result.id}
              className={`search-result-item ${index === selectedIndex ? 'selected' : ''}`}
              onClick={() => handleSelect(result)}
            >
              <div className="result-icon">
                {getResultIcon(result.type)}
              </div>
              <div className="result-content">
                <div className="result-name">{result.name}</div>
                <div className="result-type">{result.type}</div>
                <div className="result-address">{result.fullAddress}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showResults && results.length === 0 && !isLoading && searchTerm.length >= 2 && (
        <div className="search-results">
          <div className="search-result-item no-results">
            <div className="result-icon">🔍</div>
            <div className="result-content">
              <div className="result-name">Sonuç bulunamadı</div>
              <div className="result-address">"{searchTerm}" için adres bulunamadı</div>
              <div className="result-help">
                <small>💡 "SİRİNEVLER", "KIZILAY", "BAHÇELIEVLER" gibi yaygın isimler deneyin</small>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressSearch; 