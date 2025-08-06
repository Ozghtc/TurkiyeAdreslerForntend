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
        // Bu örnek veri - gerçekte API'den gelecek
        const dummyData: EksikKayit[] = [
          // Eksik İlçeler
          { id: 1, il_adi: 'ADANA', il_id: 1, ilce_adi: 'CEYHAN', ilce_id: 1002, kayit_tipi: 'ilce' },
          { id: 2, il_adi: 'ADANA', il_id: 1, ilce_adi: 'ÇUKUROVA', ilce_id: 1003, kayit_tipi: 'ilce' },
          { id: 3, il_adi: 'İSTANBUL', il_id: 34, ilce_adi: 'ARNAVUTKÖY', ilce_id: 3402, kayit_tipi: 'ilce' },
          { id: 4, il_adi: 'İSTANBUL', il_id: 34, ilce_adi: 'ATAŞEHİR', ilce_id: 3403, kayit_tipi: 'ilce' },
          
          // Eksik Mahalleler
          { id: 11, il_adi: 'ADANA', il_id: 1, ilce_adi: 'SEYHAN', ilce_id: 1001, mahalle_adi: 'YENİ MAHALLE', mahalle_id: 10011, kayit_tipi: 'mahalle' },
          { id: 12, il_adi: 'ADANA', il_id: 1, ilce_adi: 'SEYHAN', ilce_id: 1001, mahalle_adi: 'MERKEZ MAHALLE', mahalle_id: 10012, kayit_tipi: 'mahalle' },
          { id: 13, il_adi: 'İSTANBUL', il_id: 34, ilce_adi: 'KADIKÖY', ilce_id: 3401, mahalle_adi: 'MODA', mahalle_id: 34011, kayit_tipi: 'mahalle' },
          { id: 14, il_adi: 'İSTANBUL', il_id: 34, ilce_adi: 'ŞİŞLİ', ilce_id: 3404, mahalle_adi: 'MECİDİYE', mahalle_id: 34041, kayit_tipi: 'mahalle' },
          { id: 15, il_adi: 'ANKARA', il_id: 6, ilce_adi: 'ÇANKAYA', ilce_id: 601, mahalle_adi: 'BAHÇELİ', mahalle_id: 6011, kayit_tipi: 'mahalle' },
          
          // Eksik Sokaklar  
          { id: 21, il_adi: 'ADANA', il_id: 1, ilce_adi: 'SEYHAN', ilce_id: 1001, mahalle_adi: 'YENİ MAHALLE', mahalle_id: 10011, sokak_adi: 'ATATÜRK CADDESİ', sokak_id: 100111, kayit_tipi: 'sokak' },
          { id: 22, il_adi: 'ADANA', il_id: 1, ilce_adi: 'SEYHAN', ilce_id: 1001, mahalle_adi: 'YENİ MAHALLE', mahalle_id: 10011, sokak_adi: 'İNÖNÜ SOKAK', sokak_id: 100112, kayit_tipi: 'sokak' },
          { id: 23, il_adi: 'İSTANBUL', il_id: 34, ilce_adi: 'KADIKÖY', ilce_id: 3401, mahalle_adi: 'MODA', mahalle_id: 34011, sokak_adi: 'BAHARİYE CADDESİ', sokak_id: 340111, kayit_tipi: 'sokak' },
          { id: 24, il_adi: 'ANKARA', il_id: 6, ilce_adi: 'ÇANKAYA', ilce_id: 601, mahalle_adi: 'BAHÇELİ', mahalle_id: 6011, sokak_adi: 'TUNALI CADDESİ', sokak_id: 60111, kayit_tipi: 'sokak' },
          
          // Eksik Köyler
          { id: 31, il_adi: 'ADANA', il_id: 1, ilce_adi: 'KOZAN', ilce_id: 1005, koy_adi: 'ÇİFTLİK KÖYÜ', koy_id: 10051, kayit_tipi: 'koy' },
          { id: 32, il_adi: 'ANKARA', il_id: 6, ilce_adi: 'KALECIK', ilce_id: 605, koy_adi: 'KIZILCA KÖYÜ', koy_id: 6051, kayit_tipi: 'koy' },
        ];
        
        // İlk 300 ile sınırla
        setEksikKayitlar(dummyData.slice(0, MAX_RESULTS));
      } catch (error) {
        console.error('❌ Filtreleme verisi yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFilterData();
  }, []);

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
                      onClick={() => console.log('Import:', kayit.kayit_tipi, kayit.id)}
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
          onClick={() => console.log('Bulk Import All:', veriTipiFilter)}
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