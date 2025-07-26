import React, { useState, useEffect } from 'react';
import { IconOption } from '../types';
import { getAvailableIcons } from '../services/roomService';

interface PlayerSetupProps {
  onSetupComplete: (playerName: string, icon: string) => void;
  onBack: () => void;
  usedIcons?: string[];
  usedNames?: string[];
}

const PlayerSetup: React.FC<PlayerSetupProps> = ({ 
  onSetupComplete, 
  onBack, 
  usedIcons = [], 
  usedNames = [] 
}) => {
  const [playerName, setPlayerName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<string>('');
  const [selectedType, setSelectedType] = useState<'mage' | 'witch' | 'cat' | null>(null);
  const [showVariants, setShowVariants] = useState(false);
  const [error, setError] = useState<string>('');
  const [allIcons, setAllIcons] = useState<IconOption[]>([]);

  useEffect(() => {
    const icons = getAvailableIcons();
    // Marcar iconos como no disponibles si ya están en uso
    icons.forEach(icon => {
      icon.isAvailable = !usedIcons.includes(icon.id);
    });
    setAllIcons(icons);
  }, [usedIcons]);

  const handleTypeSelect = (type: 'mage' | 'witch' | 'cat') => {
    setSelectedType(type);
    setShowVariants(true);
    setSelectedIcon('');
  };

  const handleIconSelect = (iconId: string) => {
    setSelectedIcon(iconId);
    setError('');
  };

  const handleSubmit = () => {
    // Validaciones
    if (!playerName.trim()) {
      setError('Por favor ingresa tu nombre de mago');
      return;
    }

    if (playerName.trim().length < 2) {
      setError('El nombre debe tener al menos 2 caracteres');
      return;
    }

    if (usedNames.includes(playerName.trim().toLowerCase())) {
      setError('Ya hay un jugador con ese nombre');
      return;
    }

    if (!selectedIcon) {
      setError('Por favor selecciona un icono');
      return;
    }

    onSetupComplete(playerName.trim(), selectedIcon);
  };

  const getTypeIcons = (type: 'mage' | 'witch' | 'cat') => {
    return allIcons.filter(icon => icon.type === type);
  };

  const getTypeLabel = (type: 'mage' | 'witch' | 'cat') => {
    switch (type) {
      case 'mage': return 'Mago';
      case 'witch': return 'Bruja';
      case 'cat': return 'Gato';
    }
  };

  const getTypeEmoji = (type: 'mage' | 'witch' | 'cat') => {
    switch (type) {
      case 'mage': return '🧙‍♂️';
      case 'witch': return '🧙‍♀️';
      case 'cat': return '🐱';
    }
  };

  return (
    <div className="player-setup">
      <div className="setup-header">
        <button className="back-button" onClick={onBack}>
          ← Volver
        </button>
        <h2>Configura tu Mago</h2>
        <p>Elige tu nombre y tu avatar mágico</p>
      </div>

      <div className="setup-content">
        {/* Nombre del jugador */}
        <div className="setup-section">
          <label htmlFor="playerName">Nombre del Mago:</label>
          <input
            id="playerName"
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Ej: Gandalf, Merlín, Morgana..."
            maxLength={20}
            className="name-input"
          />
        </div>

        {/* Selección de tipo */}
        {!showVariants && (
          <div className="setup-section">
            <label>Elige tu tipo:</label>
            <div className="type-selection">
              {(['mage', 'witch', 'cat'] as const).map(type => (
                <div
                  key={type}
                  className="type-option"
                  onClick={() => handleTypeSelect(type)}
                >
                  <div className="type-emoji">{getTypeEmoji(type)}</div>
                  <span>{getTypeLabel(type)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Variantes del tipo seleccionado */}
        {showVariants && selectedType && (
          <div className="setup-section">
            <div className="variant-header">
              <button 
                className="back-to-types"
                onClick={() => {
                  setShowVariants(false);
                  setSelectedIcon('');
                }}
              >
                ← Cambiar tipo
              </button>
              <h3>{getTypeEmoji(selectedType)} {getTypeLabel(selectedType)}</h3>
            </div>
            
            <div className="icon-grid">
              {getTypeIcons(selectedType).map(icon => (
                <div
                  key={icon.id}
                  className={`icon-option ${selectedIcon === icon.id ? 'selected' : ''} ${!icon.isAvailable ? 'unavailable' : ''}`}
                  onClick={() => icon.isAvailable && handleIconSelect(icon.id)}
                >
                  <img src={icon.path} alt={icon.variant} />
                  <span className="variant-name">{icon.variant}</span>
                  {!icon.isAvailable && (
                    <div className="unavailable-overlay">
                      <span>En uso</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Botón de continuar */}
        <button
          className="continue-button"
          onClick={handleSubmit}
          disabled={!playerName.trim() || !selectedIcon}
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default PlayerSetup; 