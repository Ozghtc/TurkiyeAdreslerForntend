import React, { useState, useEffect } from 'react';
import '../styles/ExikVerilerFiltresi.css';

// Types
interface EksikIlce {
  ilce_id: number;
  ilce_adi: string;
  il_id: number;
  il_adi: string;
  status: 'eksik' | 'mevcut';
}

const ExikVerilerFiltresi: React.FC = () => {
  const [eksikIlceler, setEksikIlceler] = useState<EksikIlce[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedIl, setSelectedIl] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'eksik' | 'mevcut'>('all');
  
  // Dummy data - gerçek implementasyon API'den gelecek
  useEffect(() => {
    const loadFilterData = async () => {
      setLoading(true);
      
      try {
        // Bu örnek veri - gerçekte API'den gelecek
        const dummyData: EksikIlce[] = [
          { ilce_id: 1001, ilce_adi: 'ALADAĞ', il_id: 1, il_adi: 'ADANA', status: 'mevcut' },
          { ilce_id: 1002, ilce_adi: 'CEYHAN', il_id: 1, il_adi: 'ADANA', status: 'eksik' },
          { ilce_id: 1003, ilce_adi: 'ÇUKUROVA', il_id: 1, il_adi: 'ADANA', status: 'eksik' },
          { ilce_id: 3401, ilce_adi: 'ADALAR', il_id: 34, il_adi: 'İSTANBUL', status: 'mevcut' },
          { ilce_id: 3402, ilce_adi: 'ARNAVUTKÖY', il_id: 34, il_adi: 'İSTANBUL', status: 'eksik' },
          { ilce_id: 3403, ilce_adi: 'ATAŞEHİR', il_id: 34, il_adi: 'İSTANBUL', status: 'eksik' },
        ];
        
        setEksikIlceler(dummyData);
      } catch (error) {
        console.error('❌ Filtreleme verisi yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFilterData();
  }, []);

  // Filtreleme
  const filteredData = eksikIlceler.filter(ilce => {
    const ilFilter = selectedIl === 'all' || ilce.il_id.toString() === selectedIl;
    const statusFilterMatch = statusFilter === 'all' || ilce.status === statusFilter;
    return ilFilter && statusFilterMatch;
  });

  // İl listesi için unique değerler
  const uniqueIller = Array.from(new Set(eksikIlceler.map(ilce => ({ id: ilce.il_id, adi: ilce.il_adi }))))
    .sort((a, b) => a.adi.localeCompare(b.adi));

  // İstatistikler
  const stats = {
    toplam: eksikIlceler.length,
    eksik: eksikIlceler.filter(ilce => ilce.status === 'eksik').length,
    mevcut: eksikIlceler.filter(ilce => ilce.status === 'mevcut').length,
  };

  return (
    <div className="eksik-veriler-container">
      <div className="filter-header">
        <h1>🔍 EKSİK VERİLER FİLTRELEME</h1>
        <p>Backend vs RawData Karşılaştırması</p>
        
        {/* İstatistikler */}
        <div className="filter-stats">
          <div className="stat-card">
            <span className="stat-label">Toplam İlçe</span>
            <span className="stat-value">{stats.toplam}</span>
          </div>
          <div className="stat-card eksik">
            <span className="stat-label">Eksik</span>
            <span className="stat-value">{stats.eksik}</span>
          </div>
          <div className="stat-card mevcut">
            <span className="stat-label">Mevcut</span>
            <span className="stat-value">{stats.mevcut}</span>
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
            <option value="all">Hepsi</option>
            <option value="eksik">Sadece Eksik</option>
            <option value="mevcut">Sadece Mevcut</option>
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
                <th>İlçe Adı</th>
                <th>İlçe ID</th>
                <th>Durum</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((ilce) => (
                <tr key={ilce.ilce_id} className={`row-${ilce.status}`}>
                  <td>{ilce.il_adi}</td>
                  <td>{ilce.ilce_adi}</td>
                  <td>{ilce.ilce_id}</td>
                  <td>
                    <span className={`status-badge ${ilce.status}`}>
                      {ilce.status === 'eksik' ? '❌ Eksik' : '✅ Mevcut'}
                    </span>
                  </td>
                  <td>
                    {ilce.status === 'eksik' && (
                      <button 
                        className="import-btn"
                        onClick={() => console.log('Import:', ilce.ilce_id)}
                      >
                        📥 Import Et
                      </button>
                    )}
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
          disabled={filteredData.filter(ilce => ilce.status === 'eksik').length === 0}
        >
          📥 Tüm Eksikleri Import Et ({filteredData.filter(ilce => ilce.status === 'eksik').length})
        </button>
      </div>
    </div>
  );
};

export default ExikVerilerFiltresi;