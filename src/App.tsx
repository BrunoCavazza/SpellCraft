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
      const ctxLocal = canvas.getContext('2d');
      if (ctxLocal) {
        ctxLocal.fillStyle = '#000000';
        ctxLocal.fillRect(0, 0, canvas.width, canvas.height);
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Pool fijo de estrellas con reciclado (eficiente y estable)
    type Star = { x: number; y: number; size: number; speed: number };
    const stars: Star[] = [];
    const MAX_STARS = 350; // control de recursos

    const initializeStars = (count: number) => {
      stars.length = 0;
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() < 0.75 ? 1 : 2,
          speed: 30 + Math.random() * 60, // px/seg
        });
      }
    };

    const recycleStarFromTop = (s: Star) => {
      s.x = Math.random() * canvas.width;
      s.y = -5 - Math.random() * 40;
      s.size = Math.random() < 0.75 ? 1 : 2;
      s.speed = 30 + Math.random() * 60;
    };

    initializeStars(MAX_STARS);

    // Animación con delta time
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      const deltaSec = Math.min(0.05, Math.max(0, time - lastTime) / 1000);
      lastTime = time;

      // Fondo negro sólido
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Dibujar y actualizar
      ctx.fillStyle = '#FFFFFF';
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.y += s.speed * deltaSec;
        if (s.y > canvas.height + 5) {
          recycleStarFromTop(s);
        }
        ctx.fillRect(s.x, s.y, s.size, s.size);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
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
      background: '#000000'
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
