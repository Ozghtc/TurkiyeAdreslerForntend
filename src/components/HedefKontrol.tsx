import React from 'react';
import '../styles/HedefKontrol.css';

const HedefKontrol: React.FC = () => {
  // Türkiye Adres Verisi Hedef Sayıları (TURKIYE_ADRES_VERISI_EKOSISTEMI.md'den)
  const genelHedefler = {
    il: 81,
    ilce: 973,
    mahalle: 32408,
    koy: 18633,
    sokak: 1251158
  };

  // Şu anki eklenen sayılar (backend'den gelecek - şu an 0)
  const genelEklenen = {
    il: 0,
    ilce: 0,
    mahalle: 0,
    koy: 0,
    sokak: 0
  };

  // Tamamlanma oranları hesaplama
  const hesaplaOran = (eklenen: number, hedef: number): string => {
    return hedef > 0 ? ((eklenen / hedef) * 100).toFixed(1) : '0';
  };

  return (
    <div className="hedef-kontrol-container">
      <div className="hedef-header">
        <h1>🎯 HEDEF KONTROL PANELİ</h1>
        <p>Türkiye Adres Verisi Durumu</p>
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
            {/* Sample data - backend'den gelecek */}
            <tr>
              <td className="il-adi">İstanbul</td>
              <td>1</td><td className="eklenen">0</td>
              <td>39</td><td className="eklenen">0</td>
              <td>963</td><td className="eklenen">0</td>
              <td>0</td><td className="eklenen">0</td>
              <td>45,000</td><td className="eklenen">0</td>
              <td>87,000</td><td className="eklenen">0</td>
            </tr>
            <tr>
              <td className="il-adi">Ankara</td>
              <td>1</td><td className="eklenen">0</td>
              <td>25</td><td className="eklenen">0</td>
              <td>1,417</td><td className="eklenen">0</td>
              <td>892</td><td className="eklenen">0</td>
              <td>23,000</td><td className="eklenen">0</td>
              <td>43,000</td><td className="eklenen">0</td>
            </tr>
            <tr>
              <td className="il-adi">İzmir</td>
              <td>1</td><td className="eklenen">0</td>
              <td>30</td><td className="eklenen">0</td>
              <td>1,129</td><td className="eklenen">0</td>
              <td>734</td><td className="eklenen">0</td>
              <td>18,000</td><td className="eklenen">0</td>
              <td>35,000</td><td className="eklenen">0</td>
            </tr>
            <tr>
              <td colSpan={13} className="veri-yukleniyor">
                📊 Tüm 81 ilin verileri backend'den yüklenecek...
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HedefKontrol;