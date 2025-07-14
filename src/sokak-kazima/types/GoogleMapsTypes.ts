// Google Maps Gelişmiş Adres Bilgileri - Tip Tanımları

export interface GoogleMapsAdvancedAddress {
  // Temel adres bilgileri
  sokakIsmi: string;
  sokakNo?: string;
  mahalle: string;
  ilce: string;
  il: string;
  postaKodu?: string;
  
  // Konum bilgileri
  koordinat: {
    lat: number;
    lng: number;
  };
  plusCode?: string;
  placeId?: string;
  formattedAddress: string;
  boundingBox?: {
    northeast: { lat: number; lng: number };
    southwest: { lat: number; lng: number };
  };
  
  // Street View bilgisi
  streetView: {
    available: boolean;
    date?: string;
    location?: { lat: number; lng: number };
    imageUrl?: string;
  };
  
  // Yakın yerler
  yakinYerler: YakinYer[];
  
  // Metadata
  kaynak: 'google_advanced';
  onemDerecesi: 'low' | 'medium' | 'high' | 'very-high';
  olusturmaTarihi: Date;
  
  // Google özgü bilgiler
  googleData: {
    placeId?: string;
    geocodingAccuracy?: string; // ROOFTOP, RANGE_INTERPOLATED, etc.
    addressTypes: string[];
  };
}

export interface YakinYer {
  isim: string;
  tip: string; // restaurant, hospital, school, etc.
  puan?: number;
  mesafe: number; // metre cinsinden
  placeId: string;
}

export interface StreetViewInfo {
  available: boolean;
  date?: string;
  location?: {
    lat: number;
    lng: number;
  };
  imageUrl?: string;
}

export interface GoogleGeocodingResult {
  address_components: AddressComponent[];
  formatted_address: string;
  geometry: {
    location: { lat: number; lng: number };
    location_type: string;
    viewport?: BoundingBox;
    bounds?: BoundingBox;
  };
  place_id: string;
  plus_code?: {
    compound_code: string;
    global_code: string;
  };
  types: string[];
}

export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface BoundingBox {
  northeast: { lat: number; lng: number };
  southwest: { lat: number; lng: number };
}

export interface GooglePlacesResult {
  name: string;
  place_id: string;
  types: string[];
  rating?: number;
  geometry: {
    location: { lat: number; lng: number };
  };
  vicinity?: string;
}

// Google Maps API Konfigürasyonu
export interface GoogleMapsConfig {
  apiKey: string;
  language: string;
  region: string;
  timeout: number;
  maxRetries: number;
  rateLimit: number; // ms cinsinden istekler arası bekleme
}

// Google'dan çıkarılabilecek tüm bilgi türleri
export interface GoogleAdresDetaylari {
  // 📍 TEMEL KONUM
  pinKonumu: { lat: number; lng: number };
  gpsKoordinatlari: string; // "41.0082° K, 28.9784° D"
  tamAdres: string;
  postaKodu?: string;
  plusCode?: string;
  sokakNumarasi?: string;
  
  // 🛣️ YOL BİLGİLERİ
  sokakIsmi: string;
  mahalleIsmi: string;
  ilceIsmi: string;
  sehirIsmi: string;
  bolgeIsmi?: string;
  
  // 👁️ GÖRSEL BİLGİLER
  streetViewMevcut: boolean;
  streetViewUrl?: string;
  streetViewTarihi?: string;
  uyduGoruntusu?: string;
  
  // 🚌 ULAŞIM
  yakinDuraklar: YakinDurak[];
  trafikDurumu?: string;
  parkYerleri?: YakinYer[];
  
  // 🏢 YAKIN ÇEVRE
  yakinIsletmeler: YakinYer[];
  yakinHastaneler: YakinYer[];
  yakinOkullar: YakinYer[];
  yakinRestoranlar: YakinYer[];
  
  // ⭐ DEĞERLENDİRME
  populeritePuani?: number;
  kullaniciYorumlari?: number;
  ziyaretciSayisi?: number;
  yogunSaatler?: string[];
}

export interface YakinDurak {
  isim: string;
  tip: 'metro' | 'otobüs' | 'minibüs' | 'tramvay';
  mesafe: number;
  hatlar: string[];
}

// API Response tipleri
export interface GoogleApiResponse<T> {
  status: 'OK' | 'ZERO_RESULTS' | 'OVER_QUERY_LIMIT' | 'REQUEST_DENIED' | 'INVALID_REQUEST';
  results?: T[];
  error_message?: string;
}

export interface GoogleMapsAdvancedResponse {
  success: boolean;
  data?: GoogleMapsAdvancedAddress;
  error?: string;
  stats: {
    requestCount: number;
    processingTime: number;
    dataQuality: 'low' | 'medium' | 'high' | 'very-high';
  };
} 