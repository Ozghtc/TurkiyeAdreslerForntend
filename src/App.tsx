import React, { useState } from 'react';
import AdresFormComponent from './components/AdresForm';
import HedefKontrol from './components/HedefKontrol';
import ExikVerilerFiltresi from './components/ExikVerilerFiltresi';
import './styles/App.css';

function App() {
  const [currentPage, setCurrentPage] = useState<'adres' | 'hedef' | 'filter'>('adres');

  const goToPage = (page: 'adres' | 'hedef' | 'filter') => {
    setCurrentPage(page);
  };

  return (
    <div className="App">
      {/* Navigation Buttons */}
      <div className="nav-buttons">
        {/* Ana Sayfa butonu - sadece ana sayfa dışındayken görünür */}
        {currentPage !== 'adres' && (
          <button 
            className="nav-btn home-btn"
            onClick={() => goToPage('adres')}
            title="Ana Sayfa"
          >
            🏠 Ana Sayfa
          </button>
        )}
        
        {/* Hedef Kontrol butonu */}
        <button 
          className={`nav-btn hedef-btn ${currentPage === 'hedef' ? 'active' : ''}`}
          onClick={() => goToPage(currentPage === 'hedef' ? 'adres' : 'hedef')}
          title={currentPage === 'hedef' ? 'Ana Sayfaya Dön' : 'Hedef Kontrol Paneli'}
        >
          {currentPage === 'hedef' ? '🏠 Ana Sayfa' : '🎯 Hedef Kontrol'}
        </button>
        
        {/* Eksik Veriler Filtreleme butonu */}
        <button 
          className={`nav-btn filter-btn ${currentPage === 'filter' ? 'active' : ''}`}
          onClick={() => goToPage(currentPage === 'filter' ? 'adres' : 'filter')}
          title={currentPage === 'filter' ? 'Ana Sayfaya Dön' : 'Eksik Veriler Filtreleme'}
        >
          {currentPage === 'filter' ? '🏠 Ana Sayfa' : '🔍 Eksik Veriler'}
        </button>
      </div>

      {/* Sayfa içeriği */}
      {currentPage === 'adres' && <AdresFormComponent />}
      {currentPage === 'hedef' && <HedefKontrol />}
      {currentPage === 'filter' && <ExikVerilerFiltresi />}
    </div>
  );
}

export default App; 