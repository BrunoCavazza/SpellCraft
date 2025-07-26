import React, { useState } from 'react';

interface HomeScreenProps {
  onCreateRoom: () => void;
  onJoinRoom: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onCreateRoom, onJoinRoom }) => {
  return (
    <div className="home-screen">
      <div className="home-content">
        

        <div className="home-options">
          <div className="option-card create-room" onClick={onCreateRoom}>
            <div className="option-icon">🏰</div>
            <h3>Crear Sala</h3>
            <p>Crea una nueva sala y invita a otros magos a unirse</p>
            <div className="option-features">
              <span>• Host de la sala</span>
              <span>• Control total</span>
              <span>• Personalización</span>
            </div>
          </div>

          <div className="option-card join-room" onClick={onJoinRoom}>
            <div className="option-icon">🚪</div>
            <h3>Unirse a Sala</h3>
            <p>Únete a una sala existente con el código de la sala</p>
            <div className="option-features">
              <span>• Código de sala</span>
              <span>• Jugar en grupo</span>
              <span>• Experiencia social</span>
            </div>
          </div>
        </div>

        <div className="home-info">
          <h3>🎮 Cómo Jugar</h3>
          <div className="info-steps">
            <div className="step">
              <span className="step-number">1</span>
              <p>Escanea códigos QR de cartas mágicas</p>
            </div>
            <div className="step">
              <span className="step-number">2</span>
              <p>Combina ingredientes para crear hechizos</p>
            </div>
            <div className="step">
              <span className="step-number">3</span>
              <p>Compite con otros magos en la sala</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen; 