import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import HomeScreen from './components/HomeScreen';
import CreateRoom from './components/CreateRoom';
import JoinRoom from './components/JoinRoom';
import GameRoom from './components/GameRoom';
import { Room, Player } from './types';
import { createRoom, joinRoom, leaveRoom } from './services/roomService';

// Componente de fondo con estrellas animadas
const StarBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configuración del canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Función para generar múltiples sombras de estrellas
    const generateStarShadows = (count: number, maxSize: number) => {
      const shadows: Array<{x: number, y: number, size: number}> = [];
      for (let i = 0; i < count; i++) {
        shadows.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * maxSize + 1
        });
      }
      return shadows;
    };

    // Generar estrellas de diferentes tamaños
    const smallStars = generateStarShadows(700, 1);
    const mediumStars = generateStarShadows(200, 2);
    const bigStars = generateStarShadows(100, 3);

    // Variables de animación
    let smallStarOffset = 0;
    let mediumStarOffset = 0;
    let bigStarOffset = 0;

    // Función de animación
    const animate = () => {
      // Limpiar canvas
      ctx.fillStyle = 'rgba(27, 39, 53, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Dibujar estrellas pequeñas
      ctx.fillStyle = '#FFF';
      smallStars.forEach(star => {
        const y = (star.y + smallStarOffset) % (canvas.height + 2000);
        ctx.fillRect(star.x, y, star.size, star.size);
      });

      // Dibujar estrellas medianas
      mediumStars.forEach(star => {
        const y = (star.y + mediumStarOffset) % (canvas.height + 2000);
        ctx.fillRect(star.x, y, star.size, star.size);
      });

      // Dibujar estrellas grandes
      bigStars.forEach(star => {
        const y = (star.y + bigStarOffset) % (canvas.height + 2000);
        ctx.fillRect(star.x, y, star.size, star.size);
      });

      // Actualizar offsets para crear el efecto de movimiento
      smallStarOffset += 0.5;  // Más rápido
      mediumStarOffset += 0.3; // Medio
      bigStarOffset += 0.2;    // Más lento

      requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 0,
      pointerEvents: 'none',
      background: 'radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%)'
    }}>
      <canvas 
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  );
};

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'create' | 'join' | 'game'>('home');
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateRoom = () => {
    setCurrentView('create');
    setError(null);
  };

  const handleJoinRoom = () => {
    setCurrentView('join');
    setError(null);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setCurrentRoom(null);
    setCurrentPlayer(null);
    setError(null);
  };

  const handleRoomCreated = async (roomName: string, playerName: string, icon: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await createRoom({ roomName, playerName, icon });
      
      if (response.success && response.room) {
        setCurrentRoom(response.room);
        setCurrentPlayer(response.room.players.find(p => p.name === playerName) || null);
        setCurrentView('game');
      } else {
        setError(response.message || 'Error al crear la sala');
      }
    } catch (err) {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoomJoined = async (roomName: string, playerName: string, icon: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await joinRoom({ roomName, playerName, icon });
      
      if (response.success && response.room) {
        setCurrentRoom(response.room);
        setCurrentPlayer(response.room.players.find(p => p.name === playerName) || null);
        setCurrentView('game');
      } else {
        setError(response.message || 'Error al unirse a la sala');
      }
    } catch (err) {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveRoom = async () => {
    if (currentRoom && currentPlayer) {
      try {
        await leaveRoom(currentRoom.id, currentPlayer.id);
      } catch (err) {
        console.error('Error al salir de la sala:', err);
      }
    }
    handleBackToHome();
  };

  // Loading overlay
  if (isLoading) {
    return (
      <div className="App">
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Conectando a la sala...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <StarBackground />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <header className="app-header">
          <h1>✨ SpellCraft ✨</h1>
        </header>

        <main className="app-main">
          {error && (
            <div className="error-banner">
              {error}
            </div>
          )}

          {currentView === 'home' && (
            <HomeScreen 
              onCreateRoom={handleCreateRoom}
              onJoinRoom={handleJoinRoom}
            />
          )}

          {currentView === 'create' && (
            <CreateRoom 
              onRoomCreated={handleRoomCreated}
              onBack={handleBackToHome}
            />
          )}

          {currentView === 'join' && (
            <JoinRoom 
              onRoomJoined={handleRoomJoined}
              onBack={handleBackToHome}
            />
          )}

          {currentView === 'game' && currentRoom && currentPlayer && (
            <GameRoom 
              room={currentRoom}
              currentPlayer={currentPlayer}
              onLeaveRoom={handleLeaveRoom}
            />
          )}
        </main>


      </div>
    </ThemeProvider>
  );
}

export default App;
