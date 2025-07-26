import React from 'react';
import { ScannedCard } from '../types';

interface ScannedCardsListProps {
  scannedCards: ScannedCard[];
  onRemoveCard: (cardId: string) => void;
}

const ScannedCardsList: React.FC<ScannedCardsListProps> = ({ 
  scannedCards, 
  onRemoveCard 
}) => {
  if (scannedCards.length === 0) {
    return (
      <div className="scanned-cards-empty">
        <p>No hay cartas escaneadas</p>
        <p className="hint">Escanea algunas cartas para comenzar a crear hechizos</p>
      </div>
    );
  }

  return (
    <div className="scanned-cards-container">
      <h3>Cartas Escaneadas ({scannedCards.length})</h3>
      <div className="scanned-cards-grid">
        {scannedCards.map((card, index) => (
          <div key={`${card.id}-${index}`} className="scanned-card">
            <div className="card-id">ID: {card.id}</div>
            <div className="card-time">
              {card.scannedAt.toLocaleTimeString()}
            </div>
            <button 
              className="remove-card-btn"
              onClick={() => onRemoveCard(card.id)}
              title="Eliminar carta"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScannedCardsList; 