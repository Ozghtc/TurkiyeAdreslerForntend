import { Sehir, Ilce, Mahalle } from './types';

// JSON dosyalarını import et
import sehirlerData from './sehirler.json';
import ilcelerData from './ilceler.json';
import mahalleler1Data from './mahalleler-1.json';
import mahalleler2Data from './mahalleler-2.json';
import mahalleler3Data from './mahalleler-3.json';
import mahalleler4Data from './mahalleler-4.json';

// Türkçe karakter normalizasyonu
const normalizeText = (text: string): string => {
  const turkishMap: { [key: string]: string } = {
    'ş': 's', 'Ş': 's', 'ğ': 'g', 'Ğ': 'g',
    'ı': 'i', 'I': 'i', 'İ': 'i', 'ü': 'u', 'Ü': 'u',
    'ö': 'o', 'Ö': 'o', 'ç': 'c', 'Ç': 'c'
  };
  
  return text
    .toLowerCase()
    .replace(/[şŞğĞıIİüÜöÖçÇ]/g, (match) => turkishMap[match] || match);
};

// Şehirler veri serisi
export const getSehirler = (): Sehir[] => {
  return sehirlerData as Sehir[];
};

// İlçeler veri serisi
export const getIlceler = (): Ilce[] => {
  return ilcelerData as Ilce[];
};

// Belirli bir şehre göre ilçeleri getir
export const getIlcelerBySehirId = (sehirId: string): Ilce[] => {
  return ilcelerData.filter((ilce: any) => ilce.sehir_id === sehirId) as Ilce[];
};

// Tüm mahalleleri birleştir
export const getMahalleler = (): Mahalle[] => {
  return [
    ...mahalleler1Data,
    ...mahalleler2Data,
    ...mahalleler3Data,
    ...mahalleler4Data
  ] as Mahalle[];
};

// Belirli bir ilçeye göre mahalleleri getir
export const getMahallelerByIlceId = (ilceId: string): Mahalle[] => {
  const tumMahalleler = getMahalleler();
  return tumMahalleler.filter((mahalle: Mahalle) => mahalle.ilce_id === ilceId);
};

// Şehir ID'sinden şehir adını getir
export const getSehirAdiById = (sehirId: string): string => {
  const sehir = sehirlerData.find((s: any) => s.sehir_id === sehirId);
  return sehir ? sehir.sehir_adi : '';
};

// İlçe ID'sinden ilçe adını getir
export const getIlceAdiById = (ilceId: string): string => {
  const ilce = ilcelerData.find((i: any) => i.ilce_id === ilceId);
  return ilce ? ilce.ilce_adi : '';
};

// Mahalle ID'sinden mahalle adını getir
export const getMahalleAdiById = (mahalleId: string): string => {
  const tumMahalleler = getMahalleler();
  const mahalle = tumMahalleler.find((m: Mahalle) => m.mahalle_id === mahalleId);
  return mahalle ? mahalle.mahalle_adi : '';
};

// İlçe ID'sinden şehir ID'sini çıkar (İlçe ID'si genellikle şehir ID'si + ilçe numarası formatındadır)
export const getSehirIdFromIlceId = (ilceId: string): string => {
  const ilce = ilcelerData.find((i: any) => i.ilce_id === ilceId);
  return ilce ? ilce.sehir_id : '';
};

// Mahalle ID'sinden tam adres bilgilerini getir
export const getFullAddressFromMahalleId = (mahalleId: string): {
  sehir: string;
  ilce: string;
  mahalle: string;
  sehirId: string;
  ilceId: string;
} => {
  const tumMahalleler = getMahalleler();
  const mahalle = tumMahalleler.find((m: Mahalle) => m.mahalle_id === mahalleId);
  
  if (!mahalle) {
    return {
      sehir: '',
      ilce: '',
      mahalle: '',
      sehirId: '',
      ilceId: ''
    };
  }
  
  const ilceAdi = getIlceAdiById(mahalle.ilce_id);
  const sehirId = getSehirIdFromIlceId(mahalle.ilce_id);
  const sehirAdi = getSehirAdiById(sehirId);
  
  return {
    sehir: sehirAdi,
    ilce: ilceAdi,
    mahalle: mahalle.mahalle_adi,
    sehirId: sehirId,
    ilceId: mahalle.ilce_id
  };
};

// Arama fonksiyonu - mahalle adına göre ara
export const searchMahalleler = (searchTerm: string, limit: number = 10): Array<{
  mahalle: Mahalle;
  fullAddress: string;
  sehirId: string;
  ilceId: string;
}> => {
  const tumMahalleler = getMahalleler();
  const searchTermLower = searchTerm.toLowerCase();
  const searchTermNormalized = normalizeText(searchTerm);
  
  const results = tumMahalleler
    .filter((mahalle: Mahalle) => {
      const mahalleAdiLower = mahalle.mahalle_adi.toLowerCase();
      const mahalleAdiNormalized = normalizeText(mahalle.mahalle_adi);
      
      // Hem Türkçe hem İngilizce karakterlerle ara
      return mahalleAdiLower.includes(searchTermLower) || 
             mahalleAdiNormalized.includes(searchTermNormalized);
    })
    .slice(0, limit)
    .map((mahalle: Mahalle) => {
      const fullAddress = getFullAddressFromMahalleId(mahalle.mahalle_id);
      return {
        mahalle,
        fullAddress: `${mahalle.mahalle_adi} Mahallesi, ${fullAddress.ilce}, ${fullAddress.sehir}`,
        sehirId: fullAddress.sehirId,
        ilceId: fullAddress.ilceId
      };
    });
  
  return results;
}; 