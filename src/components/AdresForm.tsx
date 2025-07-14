import React, { useState, useEffect } from 'react';
import CustomInput from './CustomInput';
import CustomSelect from './CustomSelect';
import AddressSearch from './AddressSearch';
import { apiAddressService } from '../services/ApiAddressService';

// AdresForm tipini burada tanımlayalım
interface AdresForm {
  il: string;
  ilce: string;
  mahalle: string;
  cadde: string;
  sokak: string;
  apartman: string;
  daire: string;
  aciklama: string;
}

const AdresFormComponent: React.FC = () => {
  const [formData, setFormData] = useState<AdresForm>({
    il: '',
    ilce: '',
    mahalle: '',
    cadde: '',
    sokak: '',
    apartman: '',
    daire: '',
    aciklama: ''
  });

  const [sehirler, setSehirler] = useState<any[]>([]);
  const [ilceler, setIlceler] = useState<any[]>([]);
  const [mahalleler, setMahalleler] = useState<any[]>([]);
  const [isSearchMode, setIsSearchMode] = useState(true);

  // Şehirler listesini yükle
  useEffect(() => {
    const loadSehirler = async () => {
      try {
        const sehirlerData = await apiAddressService.getCities();
        setSehirler(sehirlerData);
      } catch (error) {
        console.error('Şehirler yüklenirken hata:', error);
      }
    };
    loadSehirler();
  }, []);

  // İl değiştiğinde ilçeleri yükle
  useEffect(() => {
    if (formData.il) {
      const loadIlceler = async () => {
        try {
          const ilcelerData = await apiAddressService.getDistricts(formData.il);
          setIlceler(ilcelerData);
          // İl değiştiğinde ilçe ve mahalle seçimini sıfırla
          setFormData(prev => ({ ...prev, ilce: '', mahalle: '' }));
          setMahalleler([]);
        } catch (error) {
          console.error('İlçeler yüklenirken hata:', error);
        }
      };
      loadIlceler();
    } else {
      setIlceler([]);
      setMahalleler([]);
    }
  }, [formData.il]);

  // İlçe değiştiğinde mahalleleri yükle
  useEffect(() => {
    if (formData.ilce) {
      const loadMahalleler = async () => {
        try {
          const mahallelerData = await apiAddressService.getNeighborhoods(formData.ilce);
          setMahalleler(mahallelerData);
          // İlçe değiştiğinde mahalle seçimini sıfırla
          setFormData(prev => ({ ...prev, mahalle: '' }));
        } catch (error) {
          console.error('Mahalleler yüklenirken hata:', error);
        }
      };
      loadMahalleler();
    } else {
      setMahalleler([]);
    }
  }, [formData.ilce]);

  const handleInputChange = (field: keyof AdresForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressSelect = async (address: {
    il: string;
    ilce: string;
    mahalle: string;
    cadde: string;
    sokak: string;
    ilAdi: string;
    ilceAdi: string;
    mahalleAdi: string;
  }) => {
    // Form verilerini güncelle
    setFormData(prev => ({
      ...prev,
      il: address.il,
      ilce: address.ilce,
      mahalle: address.mahalle,
      cadde: address.cadde,
      sokak: address.sokak
    }));
    
    // Dropdown'ları güncelle
    try {
      const ilcelerData = await apiAddressService.getDistricts(address.il);
      setIlceler(ilcelerData);
      
      const mahallelerData = await apiAddressService.getNeighborhoods(address.ilce);
      setMahalleler(mahallelerData);
    } catch (error) {
      console.error('Dropdown veriler yüklenirken hata:', error);
    }
  };

  const handleTemizle = () => {
    setFormData({
      il: '',
      ilce: '',
      mahalle: '',
      cadde: '',
      sokak: '',
      apartman: '',
      daire: '',
      aciklama: ''
    });
    setIlceler([]);
    setMahalleler([]);
  };

  const toggleSearchMode = () => {
    setIsSearchMode(!isSearchMode);
    if (!isSearchMode) {
      // Manual moda geçerken formu temizle
      handleTemizle();
    }
  };

  // Dropdown için options formatını hazırla
  const sehirOptions = sehirler.map(sehir => ({
    value: sehir.sehir_id,
    label: sehir.sehir_adi
  }));

  const ilceOptions = ilceler.map(ilce => ({
    value: ilce.ilce_id,
    label: ilce.ilce_adi
  }));

  const mahalleOptions = mahalleler.map(mahalle => ({
    value: mahalle.mahalle_id,
    label: mahalle.mahalle_adi
  }));

  return (
    <div className="adres-form-container">
      <div className="adres-form-header">
        <h1>📍 Adres Detayı</h1>
        <p>Türkiye geneli adres bilgilerini giriniz</p>
      </div>

      <div className="adres-form">
        {/* Mod Değiştirici */}
        <div className="form-row">
          <div className="form-field form-field-full">
            <div className="mode-switcher">
              <button 
                type="button"
                className={`mode-btn ${isSearchMode ? 'active' : ''}`}
                onClick={() => setIsSearchMode(true)}
              >
                🔍 Akıllı Arama
              </button>
              <button 
                type="button"
                className={`mode-btn ${!isSearchMode ? 'active' : ''}`}
                onClick={toggleSearchMode}
              >
                📝 Manuel Seçim
              </button>
            </div>
          </div>
        </div>

        {/* Akıllı Arama Modu */}
        {isSearchMode && (
          <div className="form-row">
            <div className="form-field form-field-full">
              <label className="input-label">🔍 Akıllı Adres Arama</label>
              <AddressSearch 
                onAddressSelect={handleAddressSelect}
                placeholder="Adres arayın (örn: Atatürk Cad, Kızılay Mah, Çankaya...)"
              />
              <div className="search-help">
                <small>💡 Mahalle, cadde, sokak adı yazarak arama yapabilirsiniz</small>
              </div>
            </div>
          </div>
        )}

        {/* Manuel Seçim Modu */}
        {!isSearchMode && (
          <>
            <div className="form-row">
              <CustomSelect
                label="İl *"
                value={formData.il}
                onChange={(value) => handleInputChange('il', value)}
                options={sehirOptions}
                placeholder="İl seçiniz..."
                className="form-field"
              />
              
              <CustomSelect
                label="İlçe *"
                value={formData.ilce}
                onChange={(value) => handleInputChange('ilce', value)}
                options={ilceOptions}
                placeholder="İlçe seçiniz..."
                className="form-field"
                disabled={!formData.il}
              />
            </div>

            <div className="form-row">
              <CustomSelect
                label="Mahalle *"
                value={formData.mahalle}
                onChange={(value) => handleInputChange('mahalle', value)}
                options={mahalleOptions}
                placeholder="Mahalle seçiniz..."
                className="form-field form-field-full"
                disabled={!formData.ilce}
              />
            </div>
          </>
        )}

        {/* Ortak Alanlar */}
        <div className="form-row">
          <CustomInput
            label="Cadde"
            value={formData.cadde}
            onChange={(value) => handleInputChange('cadde', value)}
            placeholder="Cadde adını giriniz..."
            className="form-field"
          />
          
          <CustomInput
            label="Sokak"
            value={formData.sokak}
            onChange={(value) => handleInputChange('sokak', value)}
            placeholder="Sokak adını giriniz..."
            className="form-field"
          />
        </div>

        <div className="form-row">
          <CustomInput
            label="Apartman/Site"
            value={formData.apartman}
            onChange={(value) => handleInputChange('apartman', value)}
            placeholder="Apartman/Site adını giriniz..."
            className="form-field"
          />
          
          <CustomInput
            label="Daire No"
            value={formData.daire}
            onChange={(value) => handleInputChange('daire', value)}
            placeholder="Daire numarasını giriniz..."
            className="form-field"
          />
        </div>

        <div className="form-row">
          <div className="input-container form-field form-field-full">
            <label className="input-label">Açıklama</label>
            <textarea
              value={formData.aciklama}
              onChange={(e) => handleInputChange('aciklama', e.target.value.toUpperCase())}
              placeholder="Ek adres bilgilerini giriniz..."
              className="custom-textarea"
              rows={3}
            />
          </div>
        </div>

        {/* Seçilen Bilgiler Özeti */}
        {(formData.il || formData.ilce || formData.mahalle) && (
          <div className="form-row">
            <div className="form-field form-field-full">
              <div className="address-summary">
                <h3>📋 Seçilen Adres Bilgileri</h3>
                <div className="summary-content">
                  {formData.il && (
                    <span className="summary-item">
                      <strong>İl:</strong> {sehirler.find(s => s.sehir_id === formData.il)?.sehir_adi || formData.il}
                    </span>
                  )}
                  {formData.ilce && (
                    <span className="summary-item">
                      <strong>İlçe:</strong> {ilceler.find(i => i.ilce_id === formData.ilce)?.ilce_adi || formData.ilce}
                    </span>
                  )}
                  {formData.mahalle && (
                    <span className="summary-item">
                      <strong>Mahalle:</strong> {mahalleler.find(m => m.mahalle_id === formData.mahalle)?.mahalle_adi || formData.mahalle}
                    </span>
                  )}
                  {formData.cadde && (
                    <span className="summary-item">
                      <strong>Cadde:</strong> {formData.cadde}
                    </span>
                  )}
                  {formData.sokak && (
                    <span className="summary-item">
                      <strong>Sokak:</strong> {formData.sokak}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="form-actions">
          <button 
            type="button" 
            onClick={handleTemizle}
            className="btn btn-secondary"
          >
            🗑️ Temizle
          </button>
          
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={() => {
              console.log('Adres Bilgileri:', formData);
              alert('Adres bilgileri konsola yazdırıldı!');
            }}
          >
            📋 Adres Bilgilerini Göster
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdresFormComponent; 