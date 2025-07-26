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

// Elimina AnimatedBeam y agrega los backgrounds dinámicos:

const PixelBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // Ajusta el tamaño del canvas
    canvas.width = 2;
    canvas.height = 2;
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '0';
    canvas.style.display = 'block';
    canvas.style.transform = 'scale(2)';
    canvas.style.pointerEvents = 'none';
    // Pixel effect
    class Pixel {
      x: number;
      y: number;
      hue: number;
      velocity: number;
      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.hue = Math.floor(Math.random() * 360);
        const direction = Math.random() > 0.5 ? -1 : 1;
        this.velocity = (Math.random() * 30 + 20) * 0.01 * direction;
      }
      update() {
        this.hue += this.velocity;
      }
      render(ctx: CanvasRenderingContext2D) {
        const hue = Math.round(this.hue);
        ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
        ctx.fillRect(this.x, this.y, 1, 1);
      }
    }
    const pixels = [
      new Pixel(0, 0),
      new Pixel(1, 0),
      new Pixel(0, 1),
      new Pixel(1, 1),
    ];
    let running = true;
    function animate() {
      if (!running) return;
      pixels.forEach(function(pixel: any) {
        pixel.update();
        pixel.render(ctx);
      });
      requestAnimationFrame(animate);
    }
    animate();
    return () => { running = false; };
  }, []);
  return (
    <canvas ref={canvasRef}></canvas>
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
      <PixelBackground />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <header className="app-header">
          <h1>✨ SpellCraft ✨</h1>
          <p>Juego de Mesa Mágico con IA - Multijugador</p>
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
