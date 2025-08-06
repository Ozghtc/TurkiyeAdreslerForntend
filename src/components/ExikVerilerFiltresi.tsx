import React, { useState, useEffect } from 'react';
import '../styles/ExikVerilerFiltresi.css';

// Types
// Eksik kayıt tipi
interface EksikKayit {
  id: number;
  il_adi: string;
  il_id: number;
  ilce_adi?: string;
  ilce_id?: number;
  mahalle_adi?: string;
  mahalle_id?: number;
  koy_adi?: string;
  koy_id?: number;
  sokak_adi?: string;
  sokak_id?: number;
  cadde_adi?: string;
  cadde_id?: number;
  kayit_tipi: 'il' | 'ilce' | 'mahalle' | 'koy' | 'sokak' | 'cadde';
}

const ExikVerilerFiltresi: React.FC = () => {
  const [eksikKayitlar, setEksikKayitlar] = useState<EksikKayit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedIl, setSelectedIl] = useState<string>('all');
  const [veriTipiFilter, setVeriTipiFilter] = useState<'all' | 'il' | 'ilce' | 'mahalle' | 'koy' | 'sokak' | 'cadde'>('ilce');
  const MAX_RESULTS = 300;
  
  // Dummy data - gerçek implementasyon API'den gelecek
  useEffect(() => {
    const loadFilterData = async () => {
      setLoading(true);
      
      try {
        // Backend API'den gerçek veri çek
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
        const response = await fetch(`${apiUrl}/api/eski-adresler?tip=${veriTipiFilter}&il_kimlik=${selectedIl}&durum=eksik&limit=${MAX_RESULTS}`);
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        
        const apiData = await response.json();
        console.log('📊 API Response:', apiData);
        
        if (apiData.success) {
          // Backend verisini frontend formatına dönüştür
          const formattedData: EksikKayit[] = apiData.data.map((item: any) => ({
            id: item.id,
            il_adi: item.il_adi,
            il_id: item.il_kimlik_no,
            ilce_adi: item.ilce_adi,
            ilce_id: item.ilce_kimlik_no,
            mahalle_adi: item.mahalle_adi,
            mahalle_id: item.mahalle_kimlik_no,
            koy_adi: item.koy_adi,
            koy_id: null, // Backend'de ayrı ID yok
            sokak_adi: item.sokak_adi,
            sokak_id: item.sokak_kimlik_no,
            cadde_adi: item.sokak_tur_kod === 3 ? item.sokak_adi : null, // Cadde ise sokak_adi
            cadde_id: item.sokak_tur_kod === 3 ? item.sokak_kimlik_no : null,
            kayit_tipi: item.kayit_tipi as 'il' | 'ilce' | 'mahalle' | 'koy' | 'sokak' | 'cadde'
          }));
          
          setEksikKayitlar(formattedData);
          console.log(`✅ ${formattedData.length} eksik kayıt yüklendi`);
        } else {
          throw new Error(apiData.message || 'API başarısız');
        }
        
      } catch (error) {
        console.error('❌ Filtreleme verisi yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFilterData();
  }, [veriTipiFilter, selectedIl]); // Filter değiştiğinde yeniden yükle
  
  // Import fonksiyonu
  const handleImport = async (kayitId: number, kayitTipi: string) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/eski-adresler/${kayitId}/import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ ${kayitTipi} import edildi:`, result.data);
        // Listeyi yenile (import edilen kaydı listeden çıkar)
        setEksikKayitlar(prev => prev.filter(kayit => kayit.id !== kayitId));
      } else {
        console.error('❌ Import hatası:', result.error);
        alert(`Import hatası: ${result.error}`);
      }
    } catch (error) {
      console.error('❌ Import API hatası:', error);
      alert('Import sırasında bir hata oluştu!');
    }
  };
  
  // Toplu import fonksiyonu
  const handleBulkImport = async () => {
    const kayitIds = filteredData.slice(0, MAX_RESULTS).map(kayit => kayit.id);
    
    for (const kayitId of kayitIds) {
      try {
        await handleImport(kayitId, 'toplu');
        // Her import arasında küçük gecikme (API yükünü azaltmak için)
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Import hatası (ID: ${kayitId}):`, error);
      }
    }
    
    console.log('✅ Toplu import tamamlandı');
  };

  // Filtreleme
  const filteredData = eksikKayitlar.filter(kayit => {
    const ilFilter = selectedIl === 'all' || kayit.il_id.toString() === selectedIl;
    const veriTipiFilteri = veriTipiFilter === 'all' || kayit.kayit_tipi === veriTipiFilter;
    return ilFilter && veriTipiFilteri;
  });

  // İl listesi için unique değerler (sadece o veri tipine sahip iller)
  const uniqueIller = Array.from(new Set(
    eksikKayitlar
      .filter(kayit => veriTipiFilter === 'all' || kayit.kayit_tipi === veriTipiFilter)
      .map(kayit => ({ id: kayit.il_id, adi: kayit.il_adi }))
  )).sort((a, b) => a.adi.localeCompare(b.adi));

  // İstatistikler - veri tipi bazında
  const stats = {
    toplam_kayit: filteredData.length,
    eksik_il: eksikKayitlar.filter(k => k.kayit_tipi === 'il').length,
    eksik_ilce: eksikKayitlar.filter(k => k.kayit_tipi === 'ilce').length,
    eksik_mahalle: eksikKayitlar.filter(k => k.kayit_tipi === 'mahalle').length,
    eksik_sokak: eksikKayitlar.filter(k => k.kayit_tipi === 'sokak').length,
    eksik_koy: eksikKayitlar.filter(k => k.kayit_tipi === 'koy').length,
  };

  return (
    <div className="eksik-veriler-container">
      <div className="filter-header">
        <h1>🔍 EKSİK VERİLER FİLTRELEME</h1>
        <p>Backend vs RawData Karşılaştırması</p>
        
        {/* İstatistikler */}
        <div className="filter-stats">
          <div className="stat-card">
            <span className="stat-label">Gösterilen</span>
            <span className="stat-value">{stats.toplam_kayit}</span>
          </div>
          <div className="stat-card eksik">
            <span className="stat-label">Eksik İlçe</span>
            <span className="stat-value">{stats.eksik_ilce}</span>
          </div>
          <div className="stat-card mevcut">
            <span className="stat-label">Eksik Mahalle</span>
            <span className="stat-value">{stats.eksik_mahalle}</span>
          </div>
          <div className="stat-card kismli">
            <span className="stat-label">Eksik Sokak</span>
            <span className="stat-value">{stats.eksik_sokak}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Eksik Köy</span>
            <span className="stat-value">{stats.eksik_koy}</span>
          </div>
        </div>
      </div>

      {/* Filtreler */}
      <div className="filter-controls">
        <div className="filter-group">
          <label>İl Filtresi:</label>
          <select 
            value={selectedIl} 
            onChange={(e) => setSelectedIl(e.target.value)}
          >
            <option value="all">Tüm İller</option>
            {uniqueIller.map(il => (
              <option key={il.id} value={il.id.toString()}>
                {il.adi}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label>Eksik Veri Tipi:</label>
          <select 
            value={veriTipiFilter} 
            onChange={(e) => setVeriTipiFilter(e.target.value as any)}
          >
            <option value="all">Tüm Eksik Veriler</option>
            <option value="il">Eksik İller</option>
            <option value="ilce">Eksik İlçeler</option>
            <option value="mahalle">Eksik Mahalleler</option>
            <option value="koy">Eksik Köyler</option>
            <option value="sokak">Eksik Sokaklar</option>
            <option value="cadde">Eksik Caddeler</option>
          </select>
        </div>
      </div>

      {/* Veri Tablosu */}
      <div className="filter-table-container">
        {loading ? (
          <div className="loading">📊 Veriler karşılaştırılıyor...</div>
        ) : (
          <table className="filter-table">
            <thead>
              <tr>
                <th>İl</th>
                <th>İlçe</th>
                {veriTipiFilter === 'mahalle' || veriTipiFilter === 'sokak' || veriTipiFilter === 'all' ? <th>Mahalle</th> : null}
                {veriTipiFilter === 'koy' || veriTipiFilter === 'all' ? <th>Köy</th> : null}
                {veriTipiFilter === 'sokak' || veriTipiFilter === 'all' ? <th>Sokak</th> : null}
                {veriTipiFilter === 'cadde' || veriTipiFilter === 'all' ? <th>Cadde</th> : null}
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.slice(0, MAX_RESULTS).map((kayit) => (
                <tr key={kayit.id} className={`row-${kayit.kayit_tipi}`}>
                  <td>
                    <div className="veri-cell">
                      <strong>{kayit.il_adi}</strong>
                    </div>
                  </td>
                  <td>
                    <div className="veri-cell">
                      {kayit.ilce_adi || '-'}
                    </div>
                  </td>
                  {(veriTipiFilter === 'mahalle' || veriTipiFilter === 'sokak' || veriTipiFilter === 'all') && (
                    <td>
                      <div className="veri-cell">
                        {kayit.mahalle_adi || '-'}
                      </div>
                    </td>
                  )}
                  {(veriTipiFilter === 'koy' || veriTipiFilter === 'all') && (
                    <td>
                      <div className="veri-cell">
                        {kayit.koy_adi || '-'}
                      </div>
                    </td>
                  )}
                  {(veriTipiFilter === 'sokak' || veriTipiFilter === 'all') && (
                    <td>
                      <div className="veri-cell">
                        {kayit.sokak_adi || '-'}
                      </div>
                    </td>
                  )}
                  {(veriTipiFilter === 'cadde' || veriTipiFilter === 'all') && (
                    <td>
                      <div className="veri-cell">
                        {kayit.cadde_adi || '-'}
                      </div>
                    </td>
                  )}
                  <td>
                    <button 
                      className="import-btn"
                      onClick={() => handleImport(kayit.id, kayit.kayit_tipi)}
                      title={`${kayit.kayit_tipi} import et`}
                    >
                      📥 Import
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        {!loading && filteredData.length === 0 && (
          <div className="no-data">
            🔍 Filtreleme kriterlerinize uygun veri bulunamadı.
          </div>
        )}
      </div>

      {/* Toplu İşlemler */}
      <div className="bulk-actions">
        <button 
          className="bulk-import-btn"
          onClick={handleBulkImport}
          disabled={filteredData.length === 0}
        >
          📥 Gösterilen {filteredData.length} Kaydı Toplu Import Et
        </button>
        {filteredData.length >= MAX_RESULTS && (
          <div className="limit-warning">
            ⚠️ İlk {MAX_RESULTS} kayıt gösteriliyor. Daha fazla için filtre kullanın.
          </div>
        )}
      </div>
    </div>
  );
};

export default ExikVerilerFiltresi;