import React from 'react';
import '../styles/HedefKontrol.css';

const HedefKontrol: React.FC = () => {
  return (
    <div className="hedef-kontrol-container">
      <div className="hedef-header">
        <h1>🎯 HEDEF KONTROL PANELİ</h1>
        <p>Türkiye Adres Verisi Durumu</p>
      </div>

      <div className="iller-tablo-container">
        <h2 className="tablo-baslik">İLLER</h2>
        
        <table className="iller-tablosu">
          <thead>
            <tr>
              <th>İl Adı</th>
              <th>İlçe<br/>Sayısı</th>
              <th>Mahalle<br/>Sayısı</th>
              <th>Köy<br/>Sayısı</th>
              <th>Cadde<br/>Sayısı</th>
              <th>Sokak<br/>Sayısı</th>
            </tr>
          </thead>
          <tbody>
            {/* Veri backend'den gelecek */}
            <tr>
              <td colSpan={6} className="veri-yukleniyor">
                📊 Veriler backend'den yüklenecek...
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HedefKontrol;