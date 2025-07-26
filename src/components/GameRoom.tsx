import React, { useState, useEffect } from 'react';
import { Room, Player } from '../types';
import { getAvailableIcons } from '../services/roomService';
import QRScanner from './QRScanner';
import ScannedCardsList from './ScannedCardsList';
import SpellDisplay from './SpellDisplay';
import SpellHistory from './SpellHistory';
import { ScannedCard, Spell } from '../types';
import { generateSpell, saveSpellToHistory, getSpellHistory } from '../services/spellService';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { motion } from 'framer-motion';

interface GameRoomProps {
  room: Room;
  currentPlayer: Player;
  onLeaveRoom: () => void;
}

const GameRoom: React.FC<GameRoomProps> = ({ room, currentPlayer, onLeaveRoom }) => {
  const [scannedCards, setScannedCards] = useState<ScannedCard[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [currentSpell, setCurrentSpell] = useState<Spell | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [spellHistory, setSpellHistory] = useState<Spell[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Cargar historial al iniciar
  useEffect(() => {
    const history = getSpellHistory();
    setSpellHistory(history);
  }, []);

  const handleCardScanned = (cardId: string) => {
    // Verificar si la carta ya fue escaneada
    if (scannedCards.some(card => card.id === cardId)) {
      setError('Esta carta ya fue escaneada');
      setTimeout(() => setError(null), 3000);
      return;
    }

    const newCard: ScannedCard = {
      id: cardId,
      scannedAt: new Date()
    };

    setScannedCards(prev => [...prev, newCard]);
    setError(null);
  };

  const handleRemoveCard = (cardId: string) => {
    setScannedCards(prev => prev.filter(card => card.id !== cardId));
  };

  const handleGenerateSpell = async () => {
    if (scannedCards.length < 2) {
      setError('Se necesitan al menos 2 cartas para generar un hechizo');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const cardIds = scannedCards.map(card => card.id);
      const response = await generateSpell({ cardIds });

      if (response.success && response.spell) {
        setCurrentSpell(response.spell);
        saveSpellToHistory(response.spell);
        
        // Actualizar historial
        const updatedHistory = getSpellHistory();
        setSpellHistory(updatedHistory);
        
        // Limpiar cartas escaneadas
        setScannedCards([]);
      } else {
        setError(response.message || 'Error al generar hechizo');
      }
    } catch (err) {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSpellSelect = (spell: Spell) => {
    setCurrentSpell(spell);
    setShowHistory(false);
  };

  const handleClearAll = () => {
    setScannedCards([]);
    setCurrentSpell(null);
    setError(null);
  };

  const getPlayerIcon = (iconId: string) => {
    const allIcons = getAvailableIcons();
    return allIcons.find(icon => icon.id === iconId)?.path || '';
  };

  return (
    <div className="game-room">
      {/* Header de la sala */}
      <div className="room-header">
        <div className="room-info">
          <h2>🏰 {room.name}</h2>
          <p>Jugadores: {room.players.length}/{room.maxPlayers}</p>
        </div>
        
        <div className="room-actions">
          <button className="leave-room-button" onClick={onLeaveRoom}>
            🚪 Salir de Sala
          </button>
        </div>
      </div>

      {/* Lista de jugadores */}
      <div className="players-section">
        <h3>👥 Jugadores en la Sala</h3>
        <div className="players-grid">
          {room.players.map(player => (
            <div key={player.id} className={`player-card ${player.isHost ? 'host' : ''} ${player.id === currentPlayer.id ? 'current' : ''}`}>
              <div className="player-avatar">
                <img src={getPlayerIcon(player.icon)} alt={player.name} />
                {player.isHost && <span className="host-badge">👑</span>}
              </div>
              <div className="player-info">
                <span className="player-name">{player.name}</span>
                <span className="player-role">{player.isHost ? 'Host' : 'Jugador'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controles principales */}
      <div className="controls-section">
        <div className="control-buttons">
          <button 
            className={`scan-button ${isScanning ? 'active' : ''}`}
            onClick={() => setIsScanning(!isScanning)}
          >
            {isScanning ? '🛑 Detener Escaneo' : '📷 Escanear Cartas'}
          </button>
          
          <button 
            className="generate-button"
            onClick={handleGenerateSpell}
            disabled={scannedCards.length < 2 || isGenerating}
          >
            {isGenerating ? '🔄 Generando...' : '⚡ Generar Hechizo'}
          </button>
          
          <button 
            className="history-button"
            onClick={() => setShowHistory(!showHistory)}
          >
            📚 Historial
          </button>
          
          <button 
            className="clear-button"
            onClick={handleClearAll}
            disabled={scannedCards.length === 0 && !currentSpell}
          >
            🗑️ Limpiar Todo
          </button>
        </div>

        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}
      </div>

      {/* Escáner de QR */}
      <div className="scanner-section">
        <QRScanner 
          onCardScanned={handleCardScanned}
          isScanning={isScanning}
        />
      </div>

      {/* Contenido principal */}
      <div className="content-section">
        {showHistory ? (
          <SpellHistory 
            spells={spellHistory}
            onSpellSelect={handleSpellSelect}
          />
        ) : (
          <>
            {/* Lista de cartas escaneadas */}
            <div className="cards-section">
              <ScannedCardsList 
                scannedCards={scannedCards}
                onRemoveCard={handleRemoveCard}
              />
            </div>

            {/* Visualización del hechizo */}
            <div className="spell-section">
              <SpellDisplay 
                spell={currentSpell}
                isLoading={isGenerating}
                error={error}
                onGenerateSpell={handleGenerateSpell}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GameRoom; 