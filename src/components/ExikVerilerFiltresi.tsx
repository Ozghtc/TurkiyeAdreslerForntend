import React, { useState, useEffect } from 'react';
import '../styles/ExikVerilerFiltresi.css';

// Types
interface IlVeriDurumu {
  il_id: number;
  il_adi: string;
  il_durumu: 'mevcut' | 'eksik';
  ilce_mevcut: number;
  ilce_hedef: number;
  ilce_durumu: 'tamamlandi' | 'eksik' | 'kismli';
  mahalle_mevcut: number;
  mahalle_hedef: number;
  mahalle_durumu: 'tamamlandi' | 'eksik' | 'kismli';
  koy_mevcut: number;
  koy_hedef: number;
  koy_durumu: 'tamamlandi' | 'eksik' | 'kismli';
  sokak_mevcut: number;
  sokak_hedef: number;
  sokak_durumu: 'tamamlandi' | 'eksik' | 'kismli';
}

const ExikVerilerFiltresi: React.FC = () => {
  const [ilVeriDurumlari, setIlVeriDurumlari] = useState<IlVeriDurumu[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedIl, setSelectedIl] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'eksik' | 'tamamlandi' | 'kismli'>('all');
  
  // Dummy data - gerçek implementasyon API'den gelecek
  useEffect(() => {
    const loadFilterData = async () => {
      setLoading(true);
      
      try {
        // Bu örnek veri - gerçekte API'den gelecek
        const dummyData: IlVeriDurumu[] = [
          { 
            il_id: 1, 
            il_adi: 'ADANA', 
            il_durumu: 'mevcut',
            ilce_mevcut: 13, 
            ilce_hedef: 15, 
            ilce_durumu: 'kismli',
            mahalle_mevcut: 0, 
            mahalle_hedef: 572, 
            mahalle_durumu: 'eksik',
            koy_mevcut: 0, 
            koy_hedef: 198, 
            koy_durumu: 'eksik',
            sokak_mevcut: 0, 
            sokak_hedef: 15420, 
            sokak_durumu: 'eksik'
          },
          { 
            il_id: 34, 
            il_adi: 'İSTANBUL', 
            il_durumu: 'mevcut',
            ilce_mevcut: 37, 
            ilce_hedef: 39, 
            ilce_durumu: 'kismli',
            mahalle_mevcut: 0, 
            mahalle_hedef: 963, 
            mahalle_durumu: 'eksik',
            koy_mevcut: 0, 
            koy_hedef: 2, 
            koy_durumu: 'eksik',
            sokak_mevcut: 0, 
            sokak_hedef: 128547, 
            sokak_durumu: 'eksik'
          },
          { 
            il_id: 6, 
            il_adi: 'ANKARA', 
            il_durumu: 'mevcut',
            ilce_mevcut: 25, 
            ilce_hedef: 25, 
            ilce_durumu: 'tamamlandi',
            mahalle_mevcut: 0, 
            mahalle_hedef: 689, 
            mahalle_durumu: 'eksik',
            koy_mevcut: 0, 
            koy_hedef: 856, 
            koy_durumu: 'eksik',
            sokak_mevcut: 0, 
            sokak_hedef: 42358, 
            sokak_durumu: 'eksik'
          }
        ];
        
        setIlVeriDurumlari(dummyData);
      } catch (error) {
        console.error('❌ Filtreleme verisi yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFilterData();
  }, []);

  // Filtreleme
  const filteredData = ilVeriDurumlari.filter(il => {
    const ilFilter = selectedIl === 'all' || il.il_id.toString() === selectedIl;
    
    // Durum filtresi - herhangi bir veri türü filtre kriteriyle eşleşiyorsa göster
    if (statusFilter === 'all') return ilFilter;
    
    const hasStatus = 
      il.ilce_durumu === statusFilter ||
      il.mahalle_durumu === statusFilter ||
      il.koy_durumu === statusFilter ||
      il.sokak_durumu === statusFilter;
    
    return ilFilter && hasStatus;
  });

  // İl listesi için unique değerler
  const uniqueIller = ilVeriDurumlari
    .map(il => ({ id: il.il_id, adi: il.il_adi }))
    .sort((a, b) => a.adi.localeCompare(b.adi));

  // İstatistikler - genel durum özeti
  const stats = {
    toplam_il: ilVeriDurumlari.length,
    eksik_mahalle: ilVeriDurumlari.filter(il => il.mahalle_durumu === 'eksik').length,
    eksik_sokak: ilVeriDurumlari.filter(il => il.sokak_durumu === 'eksik').length,
    kismli_ilce: ilVeriDurumlari.filter(il => il.ilce_durumu === 'kismli').length,
  };

  return (
    <div className="eksik-veriler-container">
      <div className="filter-header">
        <h1>🔍 EKSİK VERİLER FİLTRELEME</h1>
        <p>Backend vs RawData Karşılaştırması</p>
        
        {/* İstatistikler */}
        <div className="filter-stats">
          <div className="stat-card">
            <span className="stat-label">Toplam İl</span>
            <span className="stat-value">{stats.toplam_il}</span>
          </div>
          <div className="stat-card eksik">
            <span className="stat-label">Eksik Mahalle</span>
            <span className="stat-value">{stats.eksik_mahalle}</span>
          </div>
          <div className="stat-card mevcut">
            <span className="stat-label">Eksik Sokak</span>
            <span className="stat-value">{stats.eksik_sokak}</span>
          </div>
          <div className="stat-card kismli">
            <span className="stat-label">Kısmi İlçe</span>
            <span className="stat-value">{stats.kismli_ilce}</span>
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
          <label>Durum Filtresi:</label>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="all">Tüm Durumlar</option>
            <option value="eksik">Eksik Veriler</option>
            <option value="kismli">Kısmi Tamamlanmış</option>
            <option value="tamamlandi">Tamamlanmış</option>
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
                <th>Mahalle</th>
                <th>Köy</th>
                <th>Sokak</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((il) => (
                <tr key={il.il_id} className="row-il">
                  <td>
                    <div className="veri-cell">
                      <strong>{il.il_adi}</strong>
                      <span className={`status-badge ${il.il_durumu}`}>
                        {il.il_durumu === 'mevcut' ? '✅' : '❌'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="veri-cell">
                      <span className="veri-sayi">{il.ilce_mevcut}/{il.ilce_hedef}</span>
                      <span className={`status-badge ${il.ilce_durumu}`}>
                        {il.ilce_durumu === 'tamamlandi' ? '✅' : il.ilce_durumu === 'kismli' ? '🟡' : '❌'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="veri-cell">
                      <span className="veri-sayi">{il.mahalle_mevcut}/{il.mahalle_hedef}</span>
                      <span className={`status-badge ${il.mahalle_durumu}`}>
                        {il.mahalle_durumu === 'tamamlandi' ? '✅' : il.mahalle_durumu === 'kismli' ? '🟡' : '❌'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="veri-cell">
                      <span className="veri-sayi">{il.koy_mevcut}/{il.koy_hedef}</span>
                      <span className={`status-badge ${il.koy_durumu}`}>
                        {il.koy_durumu === 'tamamlandi' ? '✅' : il.koy_durumu === 'kismli' ? '🟡' : '❌'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="veri-cell">
                      <span className="veri-sayi">{il.sokak_mevcut}/{il.sokak_hedef}</span>
                      <span className={`status-badge ${il.sokak_durumu}`}>
                        {il.sokak_durumu === 'tamamlandi' ? '✅' : il.sokak_durumu === 'kismli' ? '🟡' : '❌'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {(il.ilce_durumu === 'eksik' || il.ilce_durumu === 'kismli') && (
                        <button 
                          className="import-btn"
                          onClick={() => console.log('İlçe Import:', il.il_id)}
                          title="Eksik ilçeleri import et"
                        >
                          📥 İlçe
                        </button>
                      )}
                      {il.mahalle_durumu === 'eksik' && (
                        <button 
                          className="import-btn"
                          onClick={() => console.log('Mahalle Import:', il.il_id)}
                          title="Mahalleleri import et"
                        >
                          📥 Mahalle
                        </button>
                      )}
                      {il.sokak_durumu === 'eksik' && (
                        <button 
                          className="import-btn"
                          onClick={() => console.log('Sokak Import:', il.il_id)}
                          title="Sokakları import et"
                        >
                          📥 Sokak
                        </button>
                      )}
                    </div>
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
          onClick={() => console.log('Bulk İlçe Import')}
          disabled={filteredData.filter(il => il.ilce_durumu === 'eksik' || il.ilce_durumu === 'kismli').length === 0}
        >
          📥 Tüm Eksik İlçeleri Import Et ({filteredData.filter(il => il.ilce_durumu === 'eksik' || il.ilce_durumu === 'kismli').length})
        </button>
        <button 
          className="bulk-import-btn"
          onClick={() => console.log('Bulk Mahalle Import')}
          disabled={filteredData.filter(il => il.mahalle_durumu === 'eksik').length === 0}
        >
          📥 Tüm Mahalleleri Import Et ({filteredData.filter(il => il.mahalle_durumu === 'eksik').length})
        </button>
        <button 
          className="bulk-import-btn"
          onClick={() => console.log('Bulk Sokak Import')}
          disabled={filteredData.filter(il => il.sokak_durumu === 'eksik').length === 0}
        >
          📥 Tüm Sokakları Import Et ({filteredData.filter(il => il.sokak_durumu === 'eksik').length})
        </button>
      </div>
    </div>
  );
};

export default ExikVerilerFiltresi;