import React, { useState } from 'react';
import { RoomJoinRequest } from '../types';
import PlayerSetup from './PlayerSetup';

interface JoinRoomProps {
  onRoomJoined: (roomName: string, playerName: string, icon: string) => void;
  onBack: () => void;
}

const JoinRoom: React.FC<JoinRoomProps> = ({ onRoomJoined, onBack }) => {
  const [roomName, setRoomName] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('');
  const [step, setStep] = useState<'room' | 'player'>('room');
  const [error, setError] = useState('');

  const handleRoomSubmit = () => {
    if (!roomName.trim()) {
      setError('Por favor ingresa el nombre de la sala');
      return;
    }

    if (roomName.trim().length < 3) {
      setError('El nombre de la sala debe tener al menos 3 caracteres');
      return;
    }

    setError('');
    setStep('player');
  };

  const handlePlayerSetupComplete = (name: string, icon: string) => {
    setPlayerName(name);
    setSelectedIcon(icon);
    onRoomJoined(roomName.trim(), name, icon);
  };

  if (step === 'player') {
    return (
      <PlayerSetup
        onSetupComplete={handlePlayerSetupComplete}
        onBack={() => setStep('room')}
      />
    );
  }

  return (
    <div className="join-room">
      <div className="join-header">
        <button className="back-button" onClick={onBack}>
          ← Volver
        </button>
        <h2>Unirse a Sala</h2>
        <p>Ingresa el código de la sala para unirte</p>
      </div>

      <div className="join-content">
        <div className="setup-section">
          <label htmlFor="roomName">Código de la Sala:</label>
          <input
            id="roomName"
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Ej: pepe123, magos2024, hechizos..."
            maxLength={20}
            className="room-name-input"
          />
          <small>Pide el código al host de la sala</small>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="join-info">
          <h3>🚪 Información de Unión</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Tipo:</span>
              <span className="info-value">Jugador</span>
            </div>
            <div className="info-item">
              <span className="info-label">Permisos:</span>
              <span className="info-value">Limitados</span>
            </div>
            
          </div>
        </div>

        <div className="join-tips">
          <h4>💡 Consejos:</h4>
          <ul>
            <li>Asegúrate de tener el código correcto</li>
            <li>La sala debe estar activa</li>
            <li>No debe estar llena (máx. 6 jugadores)</li>
            <li>Elige un nombre único en la sala</li>
          </ul>
        </div>

        <button
          className="continue-button"
          onClick={handleRoomSubmit}
          disabled={!roomName.trim()}
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default JoinRoom; 