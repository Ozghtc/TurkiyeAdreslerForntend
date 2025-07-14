// Sokak Kazıma Sistemı - Tip Tanımları

export interface Il {
  id: number;
  isim: string;
  plakaKodu: string;
}

export interface Ilce {
  id: number;
  isim: string;
  ilId: number;
  ilIsmi: string;
}

export interface Mahalle {
  id: number;
  isim: string;
  ilceId: number;
  ilceIsmi: string;
  ilIsmi: string;
}

export interface SokakCadde {
  id: string;
  isim: string;
  tip: 'cadde' | 'sokak' | 'bulvar' | 'meydan' | 'çıkmaz' | 'diğer';
  ilce: string;
  mahalle?: string;
  koordinat?: {
    lat: number;
    lng: number;
  };
  uzunluk?: {
    deger: number;
    birim: 'km' | 'm';
  };
  kaynak: 'wikipedia' | 'google' | 'yandex' | 'ibb' | 'tahmin';
  onemDerecesi: 'low' | 'medium' | 'high' | 'very-high';
  olusturmaTarihi: Date;
}

export interface KazimaKonfigurasyonu {
  kaynaklar: string[];
  ciktiFormati: 'hiyerarsik' | 'flat' | 'csv' | 'sql';
  kaliteFiltresi: 'low' | 'medium' | 'high';
  mahalleDahilMi: boolean;
  maxApiLimit: number;
  beklemeSuresi: number;
}

export interface KazimaIlerlemesi {
  toplamIlce: number;
  tamamlananIlce: number;
  toplamSokak: number;
  bulunanSokak: number;
  hataSayisi: number;
  baslangicZamani: Date;
  tahminiKalanSure?: number;
}

export interface KazimaRaporu {
  basarili: boolean;
  toplamBulunanSokak: number;
  ilceBazindaDagılım: {
    [ilce: string]: {
      cadde: number;
      sokak: number;
      toplam: number;
    };
  };
  kaynakBazindaDagılım: {
    [kaynak: string]: number;
  };
  hataMesajları: string[];
  islemeZamani: number;
  dosyaYolu?: string;
}

export interface ApiIstek {
  url: string;
  method: 'GET' | 'POST';
  headers?: Record<string, string>;
  body?: any;
}

export interface ApiCevap<T = any> {
  basarili: boolean;
  veri?: T;
  hata?: string;
  statusKodu?: number;
} 