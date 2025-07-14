import React, { useState, useEffect } from 'react';
import { 
  SokakCadde, 
  KazimaKonfigurasyonu, 
  KazimaIlerlemesi, 
  KazimaRaporu, 
  Ilce 
} from '../types';
import { SokakKazimaService } from '../services/SokakKazimaService';

interface Props {
  apiBaseUrl: string;
}

const SokakKazimaPanel: React.FC<Props> = ({ apiBaseUrl }) => {
  // State değişkenleri
  const [ilceler, setIlceler] = useState<Ilce[]>([]);
  const [seciliIlceler, setSeciliIlceler] = useState<string[]>([]);
  const [config, setConfig] = useState<KazimaKonfigurasyonu>({
    kaynaklar: ['wikipedia', 'google', 'yandex'],
    ciktiFormati: 'hiyerarsik',
    kaliteFiltresi: 'medium',
    mahalleDahilMi: true,
    maxApiLimit: 1000,
    beklemeSuresi: 1000
  });
  const [islemDevamEdiyor, setIslemDevamEdiyor] = useState(false);
  const [ilerleme, setIlerleme] = useState<KazimaIlerlemesi | null>(null);
  const [sonuclar, setSonuclar] = useState<SokakCadde[]>([]);
  const [rapor, setRapor] = useState<KazimaRaporu | null>(null);
  const [hataMessage, setHataMessage] = useState<string>('');

  // Servis instance'ı
  const [service] = useState(() => new SokakKazimaService(apiBaseUrl, config));

  // Component mount edildiğinde ilçeleri yükle
  useEffect(() => {
    loadIlceler();
  }, []);

  // İlçeleri yükle
  const loadIlceler = async () => {
    try {
      const data = await service.ilceleriGetir();
      setIlceler(data);
    } catch (error) {
      setHataMessage(`İlçeler yüklenirken hata: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Sokak kazımayı başlat
  const handleSokakKazimaBaslat = async () => {
    if (seciliIlceler.length === 0) {
      setHataMessage('Lütfen en az bir ilçe seçin');
      return;
    }

    setIslemDevamEdiyor(true);
    setHataMessage('');
    setSonuclar([]);
    setRapor(null);

    try {
      // İlerleme callback'ini ayarla
      service.onIlerleme(setIlerleme);
      
      // Konfigürasyonu güncelle
      service.updateConfig(config);
      
      // Kazımayı başlat
      const result = await service.sokakKazimayiBaslat(seciliIlceler);
      
      setRapor(result);
      
      // Sonuçları yükle
      await loadSonuclar();
      
    } catch (error) {
      setHataMessage(`Kazıma hatası: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIslemDevamEdiyor(false);
      setIlerleme(null);
    }
  };

  // Sonuçları yükle
  const loadSonuclar = async () => {
    try {
      const allResults: SokakCadde[] = [];
      
      for (const ilce of seciliIlceler) {
        const ilceResults = await service.ilceSokaklariniGetir(ilce);
        allResults.push(...ilceResults);
      }
      
      setSonuclar(allResults);
    } catch (error) {
      setHataMessage(`Sonuçlar yüklenirken hata: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // İlçe seçimini toggle et
  const toggleIlceSecimi = (ilceIsmi: string) => {
    setSeciliIlceler(prev => 
      prev.includes(ilceIsmi)
        ? prev.filter(i => i !== ilceIsmi)
        : [...prev, ilceIsmi]
    );
  };

  // Tümünü seç/kaldır
  const handleTumunuSec = () => {
    if (seciliIlceler.length === ilceler.length) {
      setSeciliIlceler([]);
    } else {
      setSeciliIlceler(ilceler.map(i => i.isim));
    }
  };

  // Rapor indir
  const handleRaporIndir = async (format: 'json' | 'csv' | 'excel') => {
    try {
      const blob = await service.raporuIndir(format);
      
      // Dosyayı indir
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `istanbul-sokaklar.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (error) {
      setHataMessage(`Rapor indirme hatası: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <div className="sokak-kazima-panel">
      <div className="panel-header">
        <h2>🏗️ İstanbul Sokak Kazıma Sistemi</h2>
        <p>İnternetten sokak ve cadde isimlerini toplar</p>
      </div>

      {/* Hata Mesajı */}
      {hataMessage && (
        <div className="error-message">
          ❌ {hataMessage}
        </div>
      )}

      {/* Konfigürasyon */}
      <div className="config-section">
        <h3>⚙️ Ayarlar</h3>
        
        <div className="config-row">
          <label>Kaynaklar:</label>
          <div className="checkbox-group">
            {['wikipedia', 'google', 'yandex', 'ibb'].map(kaynak => (
              <label key={kaynak} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={config.kaynaklar.includes(kaynak)}
                  onChange={(e) => {
                    const newKaynaklar = e.target.checked
                      ? [...config.kaynaklar, kaynak]
                      : config.kaynaklar.filter(k => k !== kaynak);
                    setConfig(prev => ({ ...prev, kaynaklar: newKaynaklar }));
                  }}
                />
                {kaynak}
              </label>
            ))}
          </div>
        </div>

        <div className="config-row">
          <label>Çıktı Formatı:</label>
          <select
            value={config.ciktiFormati}
            onChange={(e) => setConfig(prev => ({ 
              ...prev, 
              ciktiFormati: e.target.value as any 
            }))}
          >
            <option value="hiyerarsik">Hiyerarşik JSON</option>
            <option value="flat">Düz Liste</option>
            <option value="csv">CSV</option>
            <option value="sql">SQL</option>
          </select>
        </div>

        <div className="config-row">
          <label>Kalite Filtresi:</label>
          <select
            value={config.kaliteFiltresi}
            onChange={(e) => setConfig(prev => ({ 
              ...prev, 
              kaliteFiltresi: e.target.value as any 
            }))}
          >
            <option value="low">Düşük (Tüm veriler)</option>
            <option value="medium">Orta (Doğrulanmış)</option>
            <option value="high">Yüksek (Koordinatlı)</option>
          </select>
        </div>
      </div>

      {/* İlçe Seçimi */}
      <div className="ilce-selection">
        <h3>📍 İlçe Seçimi</h3>
        
        <div className="selection-controls">
          <button onClick={handleTumunuSec} className="btn-secondary">
            {seciliIlceler.length === ilceler.length ? 'Tümünü Kaldır' : 'Tümünü Seç'}
          </button>
          <span className="selection-count">
            {seciliIlceler.length} / {ilceler.length} ilçe seçili
          </span>
        </div>

        <div className="ilce-grid">
          {ilceler.map(ilce => (
            <label key={ilce.id} className="ilce-item">
              <input
                type="checkbox"
                checked={seciliIlceler.includes(ilce.isim)}
                onChange={() => toggleIlceSecimi(ilce.isim)}
              />
              <span className="ilce-name">{ilce.isim}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Kazıma Kontrolleri */}
      <div className="kazima-controls">
        <button 
          onClick={handleSokakKazimaBaslat}
          disabled={islemDevamEdiyor || seciliIlceler.length === 0}
          className="btn-primary btn-large"
        >
          {islemDevamEdiyor ? '🔄 Kazıma Devam Ediyor...' : '🚀 Sokak Kazımayı Başlat'}
        </button>
      </div>

      {/* İlerleme Göstergesi */}
      {ilerleme && (
        <div className="progress-section">
          <h3>📊 İlerleme</h3>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(ilerleme.tamamlananIlce / ilerleme.toplamIlce) * 100}%` }}
            />
          </div>
          <div className="progress-stats">
            <span>İlçe: {ilerleme.tamamlananIlce} / {ilerleme.toplamIlce}</span>
            <span>Bulunan Sokak: {ilerleme.bulunanSokak}</span>
            <span>Hata: {ilerleme.hataSayisi}</span>
          </div>
          {ilerleme.tahminiKalanSure && (
            <div className="eta">
              Tahmini kalan süre: {Math.round(ilerleme.tahminiKalanSure / 60)} dakika
            </div>
          )}
        </div>
      )}

      {/* Rapor */}
      {rapor && (
        <div className="rapor-section">
          <h3>📈 Kazıma Raporu</h3>
          <div className="rapor-stats">
            <div className="stat-card">
              <div className="stat-number">{rapor.toplamBulunanSokak}</div>
              <div className="stat-label">Toplam Sokak</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{Object.keys(rapor.ilceBazindaDagılım).length}</div>
              <div className="stat-label">İşlenen İlçe</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{rapor.islemeZamani}s</div>
              <div className="stat-label">İşleme Süresi</div>
            </div>
          </div>

          <div className="rapor-actions">
            <button onClick={() => handleRaporIndir('json')} className="btn-secondary">
              📄 JSON İndir
            </button>
            <button onClick={() => handleRaporIndir('csv')} className="btn-secondary">
              📊 CSV İndir
            </button>
            <button onClick={() => handleRaporIndir('excel')} className="btn-secondary">
              📈 Excel İndir
            </button>
          </div>
        </div>
      )}

      {/* Sonuç Önizlemesi */}
      {sonuclar.length > 0 && (
        <div className="sonuc-section">
          <h3>🔍 Bulunan Sokaklar (İlk 10)</h3>
          <div className="sonuc-table">
            <table>
              <thead>
                <tr>
                  <th>İsim</th>
                  <th>İlçe</th>
                  <th>Tip</th>
                  <th>Kaynak</th>
                  <th>Önem</th>
                </tr>
              </thead>
              <tbody>
                {sonuclar.slice(0, 10).map((sokak, index) => (
                  <tr key={index}>
                    <td>{sokak.isim}</td>
                    <td>{sokak.ilce}</td>
                    <td>
                      <span className={`tip-badge tip-${sokak.tip}`}>
                        {sokak.tip}
                      </span>
                    </td>
                    <td>
                      <span className={`kaynak-badge kaynak-${sokak.kaynak}`}>
                        {sokak.kaynak}
                      </span>
                    </td>
                    <td>
                      <span className={`onem-badge onem-${sokak.onemDerecesi}`}>
                        {sokak.onemDerecesi}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SokakKazimaPanel; 