import React, { useState } from 'react';
import { RoomCreateRequest } from '../types';
import PlayerSetup from './PlayerSetup';

interface CreateRoomProps {
  onRoomCreated: (roomName: string, playerName: string, icon: string) => void;
  onBack: () => void;
}

const CreateRoom: React.FC<CreateRoomProps> = ({ onRoomCreated, onBack }) => {
  const [roomName, setRoomName] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('');
  const [step, setStep] = useState<'room' | 'player'>('room');
  const [error, setError] = useState('');

  const handleRoomSubmit = () => {
    if (!roomName.trim()) {
      setError('Por favor ingresa un nombre para la sala');
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
    onRoomCreated(roomName.trim(), name, icon);
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
    <div className="create-room">
      <div className="create-header">
        <button className="back-button" onClick={onBack}>
          ← Volver
        </button>
        <h2>Crear Nueva Sala</h2>
        <p>Configura tu sala y conviértete en el host</p>
      </div>

      <div className="create-content">
        <div className="setup-section" >
          <label htmlFor="roomName">Nombre de la Sala:</label>
          <input
            id="roomName"
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Ej: pepe123, magos2024, hechizos..."
            maxLength={20}
            className="room-name-input"
          />
          <small>Este será el código que otros usarán para unirse</small>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="room-info">
          <h3>🏰 Información de la Sala</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Máximo jugadores:</span>
              <span className="info-value">6</span>
            </div>
            <div className="info-item">
              <span className="info-label">Tipo:</span>
              <span className="info-value">Multijugador</span>
            </div>
            <div className="info-item">
              <span className="info-label">Duración:</span>
              <span className="info-value">Ilimitada</span>
            </div>
          </div>
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

export default CreateRoom; 