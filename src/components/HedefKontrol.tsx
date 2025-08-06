import React, { useState, useEffect } from 'react';
import '../styles/HedefKontrol.css';
import StatsService, { GeneralStats, CityStats } from '../services/StatsService';

const HedefKontrol: React.FC = () => {
  // State tanımlamaları
  const [genelHedefler, setGenelHedefler] = useState<GeneralStats>({
    il: 81,
    ilce: 973,
    mahalle: 32408,
    koy: 18633,
    sokak: 1251158
  });

  const [genelEklenen, setGenelEklenen] = useState<GeneralStats>({
    il: 0,
    ilce: 0,
    mahalle: 0,
    koy: 0,
    sokak: 0
  });

  const [cityStats, setCityStats] = useState<CityStats[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [apiStatus, setApiStatus] = useState<boolean>(false);

  // API verilerini yükle
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      try {
        // API durumunu kontrol et
        const healthCheck = await StatsService.checkApiHealth();
        setApiStatus(healthCheck);

        // Genel istatistikleri yükle
        const generalStatsResponse = await StatsService.getGeneralStats();
        console.log('📊 General Stats Response:', generalStatsResponse);
        
        if (generalStatsResponse.success) {
          console.log('✅ Stats başarıyla yüklendi:', generalStatsResponse.stats);
          setGenelEklenen(generalStatsResponse.stats);
          setGenelHedefler(generalStatsResponse.hedefler);
        } else {
          console.log('❌ Stats yüklenemedi');
        }

        // İl bazında istatistikleri yükle
        const cityStatsResponse = await StatsService.getCityStats();
        if (cityStatsResponse.success) {
          setCityStats(cityStatsResponse.cities);
        }

      } catch (error) {
        console.error('❌ Veri yükleme hatası:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Tamamlanma oranları hesaplama
  const hesaplaOran = (eklenen: number, hedef: number): string => {
    return hedef > 0 ? ((eklenen / hedef) * 100).toFixed(1) : '0';
  };

  return (
    <div className="hedef-kontrol-container">
      <div className="hedef-header">
        <h1>🎯 HEDEF KONTROL PANELİ</h1>
        <p>Türkiye Adres Verisi Durumu</p>
        <div className="api-status">
          <span className={`status-indicator ${apiStatus ? 'online' : 'offline'}`}>
            {apiStatus ? '🟢 API Aktif' : '🔴 API Çevrimdışı'}
          </span>
          {loading && <span className="loading-text">📊 Veriler yükleniyor...</span>}
        </div>
      </div>

      {/* GENEL SAYILAR BÖLÜMü */}
      <div className="genel-sayilar-container">
        <h2 className="genel-sayilar-baslik">📊 GENEL SAYILAR</h2>
        
        <div className="genel-sayilar-grid">
          <div className="sayilar-kartı">
            <div className="kart-header">
              <h3>🏛️ İLLER</h3>
            </div>
            <div className="kart-content">
              <div className="sayi-row">
                <span className="label">Hedef:</span>
                <span className="hedef-sayi">{genelHedefler.il.toLocaleString()}</span>
              </div>
              <div className="sayi-row">
                <span className="label">Eklenen:</span>
                <span className="eklenen-sayi">{genelEklenen.il.toLocaleString()}</span>
              </div>
              <div className="oran-bar">
                <div className="oran-progress" style={{width: `${hesaplaOran(genelEklenen.il, genelHedefler.il)}%`}}></div>
              </div>
              <div className="oran-text">{hesaplaOran(genelEklenen.il, genelHedefler.il)}%</div>
            </div>
          </div>

          <div className="sayilar-kartı">
            <div className="kart-header">
              <h3>🏢 İLÇELER</h3>
            </div>
            <div className="kart-content">
              <div className="sayi-row">
                <span className="label">Hedef:</span>
                <span className="hedef-sayi">{genelHedefler.ilce.toLocaleString()}</span>
              </div>
              <div className="sayi-row">
                <span className="label">Eklenen:</span>
                <span className="eklenen-sayi">{genelEklenen.ilce.toLocaleString()}</span>
              </div>
              <div className="oran-bar">
                <div className="oran-progress" style={{width: `${hesaplaOran(genelEklenen.ilce, genelHedefler.ilce)}%`}}></div>
              </div>
              <div className="oran-text">{hesaplaOran(genelEklenen.ilce, genelHedefler.ilce)}%</div>
            </div>
          </div>

          <div className="sayilar-kartı">
            <div className="kart-header">
              <h3>🏘️ MAHALLELER</h3>
            </div>
            <div className="kart-content">
              <div className="sayi-row">
                <span className="label">Hedef:</span>
                <span className="hedef-sayi">{genelHedefler.mahalle.toLocaleString()}</span>
              </div>
              <div className="sayi-row">
                <span className="label">Eklenen:</span>
                <span className="eklenen-sayi">{genelEklenen.mahalle.toLocaleString()}</span>
              </div>
              <div className="oran-bar">
                <div className="oran-progress" style={{width: `${hesaplaOran(genelEklenen.mahalle, genelHedefler.mahalle)}%`}}></div>
              </div>
              <div className="oran-text">{hesaplaOran(genelEklenen.mahalle, genelHedefler.mahalle)}%</div>
            </div>
          </div>

          <div className="sayilar-kartı">
            <div className="kart-header">
              <h3>🏡 KÖYLER</h3>
            </div>
            <div className="kart-content">
              <div className="sayi-row">
                <span className="label">Hedef:</span>
                <span className="hedef-sayi">{genelHedefler.koy.toLocaleString()}</span>
              </div>
              <div className="sayi-row">
                <span className="label">Eklenen:</span>
                <span className="eklenen-sayi">{genelEklenen.koy.toLocaleString()}</span>
              </div>
              <div className="oran-bar">
                <div className="oran-progress" style={{width: `${hesaplaOran(genelEklenen.koy, genelHedefler.koy)}%`}}></div>
              </div>
              <div className="oran-text">{hesaplaOran(genelEklenen.koy, genelHedefler.koy)}%</div>
            </div>
          </div>

          <div className="sayilar-kartı">
            <div className="kart-header">
              <h3>🛣️ SOKAKLAR</h3>
            </div>
            <div className="kart-content">
              <div className="sayi-row">
                <span className="label">Hedef:</span>
                <span className="hedef-sayi">{genelHedefler.sokak.toLocaleString()}</span>
              </div>
              <div className="sayi-row">
                <span className="label">Eklenen:</span>
                <span className="eklenen-sayi">{genelEklenen.sokak.toLocaleString()}</span>
              </div>
              <div className="oran-bar">
                <div className="oran-progress" style={{width: `${hesaplaOran(genelEklenen.sokak, genelHedefler.sokak)}%`}}></div>
              </div>
              <div className="oran-text">{hesaplaOran(genelEklenen.sokak, genelHedefler.sokak)}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* İLLER DETAY TABLOSU */}
      <div className="iller-tablo-container">
        <h2 className="tablo-baslik">İLLER DETAY</h2>
        
        <table className="iller-tablosu">
          <thead>
            <tr>
              <th rowSpan={2}>İl Adı</th>
              <th colSpan={2}>İl</th>
              <th colSpan={2}>İlçe</th>
              <th colSpan={2}>Mahalle</th>
              <th colSpan={2}>Köy</th>
              <th colSpan={2}>Cadde</th>
              <th colSpan={2}>Sokak</th>
            </tr>
            <tr>
              <th>Hedef</th>
              <th>Eklenen</th>
              <th>Hedef</th>
              <th>Eklenen</th>
              <th>Hedef</th>
              <th>Eklenen</th>
              <th>Hedef</th>
              <th>Eklenen</th>
              <th>Hedef</th>
              <th>Eklenen</th>
              <th>Hedef</th>
              <th>Eklenen</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={13} className="veri-yukleniyor">
                  📊 Veriler yükleniyor...
                </td>
              </tr>
            ) : cityStats.length > 0 ? (
              cityStats.slice(0, 10).map((city) => (
                <tr key={city.id}>
                  <td className="il-adi">{city.name}</td>
                  <td>{city.stats.il}</td>
                  <td className="eklenen">{city.stats.il}</td>
                  <td>--</td> {/* Genel hedef ilçe sayısı */}
                  <td className="eklenen">{city.stats.ilce}</td>
                  <td>--</td> {/* Genel hedef mahalle sayısı */}
                  <td className="eklenen">{city.stats.mahalle}</td>
                  <td>--</td> {/* Genel hedef köy sayısı */}
                  <td className="eklenen">{city.stats.koy}</td>
                  <td>--</td> {/* Genel hedef cadde sayısı */}
                  <td className="eklenen">{city.stats.cadde}</td>
                  <td>--</td> {/* Genel hedef sokak sayısı */}
                  <td className="eklenen">{city.stats.sokak}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={13} className="veri-yukleniyor">
                  {apiStatus ? '📊 Veri bulunamadı' : '🔴 API bağlantısı kurulamadı'}
                </td>
              </tr>
            )}
            {cityStats.length > 10 && (
              <tr>
                <td colSpan={13} className="veri-yukleniyor">
                  📊 +{cityStats.length - 10} il daha var (İlk 10 gösteriliyor)
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HedefKontrol;