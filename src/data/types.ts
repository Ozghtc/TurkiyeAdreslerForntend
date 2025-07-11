export interface Sehir {
  sehir_id: string;
  sehir_adi: string;
}

export interface Ilce {
  ilce_id: string;
  ilce_adi: string;
  sehir_id: string;
  sehir_adi: string;
}

export interface Mahalle {
  mahalle_id: string;
  mahalle_adi: string;
  ilce_id: string;
  ilce_adi: string;
}

export interface AdresForm {
  il: string;
  ilce: string;
  mahalle: string;
  cadde: string;
  sokak: string;
  apartman: string;
  daire: string;
  aciklama: string;
} 