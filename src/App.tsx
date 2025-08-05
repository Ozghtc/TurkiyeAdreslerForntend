import React, { useState } from 'react';
import AdresFormComponent from './components/AdresForm';
import HedefKontrol from './components/HedefKontrol';
import './styles/App.css';

function App() {
  const [currentPage, setCurrentPage] = useState<'adres' | 'hedef'>('adres');

  const togglePage = () => {
    setCurrentPage(currentPage === 'adres' ? 'hedef' : 'adres');
  };

  return (
    <div className="App">
      {/* Sol üst Hedef Kontrol butonu */}
      <button 
        className="hedef-kontrol-btn"
        onClick={togglePage}
        title={currentPage === 'adres' ? 'Hedef Kontrol Paneli' : 'Ana Sayfa'}
      >
        {currentPage === 'adres' ? '🎯 Hedef Kontrol' : '🏠 Ana Sayfa'}
      </button>

      {/* Sayfa içeriği */}
      {currentPage === 'adres' ? (
        <AdresFormComponent />
      ) : (
        <HedefKontrol />
      )}
    </div>
  );
}

export default App; 