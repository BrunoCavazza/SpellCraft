import { Room, Player, RoomJoinRequest, RoomCreateRequest, RoomResponse, IconOption } from '../types';

// Base de datos simulada de salas (en producción esto sería en el backend)
let rooms: Room[] = [];

// Configuración de iconos disponibles
export const getAvailableIcons = (): IconOption[] => {
  return [
    // Magos
    { id: 'mage-blue', path: '/Icons/Users/mage-blue.png', type: 'mage', variant: 'blue', isAvailable: true },
    { id: 'mage-red', path: '/Icons/Users/mage-red.png', type: 'mage', variant: 'red', isAvailable: true },
    { id: 'mage-green', path: '/Icons/Users/mage-green.png', type: 'mage', variant: 'green', isAvailable: true },
    { id: 'mage-purple', path: '/Icons/Users/mage-purple.png', type: 'mage', variant: 'purple', isAvailable: true },
    { id: 'mage-orange', path: '/Icons/Users/mage-orange.png', type: 'mage', variant: 'orange', isAvailable: true },
    { id: 'mage-yellow', path: '/Icons/Users/mage-yellow.png', type: 'mage', variant: 'yellow', isAvailable: true },
    
    // Brujas
    { id: 'witch-blue', path: '/Icons/Users/witch-blue.png', type: 'witch', variant: 'blue', isAvailable: true },
    { id: 'witch-red', path: '/Icons/Users/witch-red.png', type: 'witch', variant: 'red', isAvailable: true },
    { id: 'witch-green', path: '/Icons/Users/witch-green.png', type: 'witch', variant: 'green', isAvailable: true },
    { id: 'witch-purple', path: '/Icons/Users/witch-purple.png', type: 'witch', variant: 'purple', isAvailable: true },
    { id: 'witch-pink', path: '/Icons/Users/witch-pink.png', type: 'witch', variant: 'pink', isAvailable: true },
    { id: 'witch-yellow', path: '/Icons/Users/witch-yellow.png', type: 'witch', variant: 'yellow', isAvailable: true },
    
    // Gatos
    { id: 'cat-1', path: '/Icons/Users/cat-1.png', type: 'cat', variant: '1', isAvailable: true },
    { id: 'cat-2', path: '/Icons/Users/cat-2.png', type: 'cat', variant: '2', isAvailable: true },
    { id: 'cat-3', path: '/Icons/Users/cat-3.png', type: 'cat', variant: '3', isAvailable: true },
    { id: 'cat-4', path: '/Icons/Users/cat-4.png', type: 'cat', variant: '4', isAvailable: true },
  ];
};

// Función para actualizar disponibilidad de iconos
export const updateIconAvailability = (roomId: string): void => {
  const room = rooms.find(r => r.id === roomId);
  if (!room) return;

  const allIcons = getAvailableIcons();
  const usedIcons = room.players.map(p => p.icon);
  
  allIcons.forEach(icon => {
    icon.isAvailable = !usedIcons.includes(icon.id);
  });
};

// Crear una nueva sala
export const createRoom = async (request: RoomCreateRequest): Promise<RoomResponse> => {
  try {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));

    const { roomName, playerName, icon } = request;

    // Validaciones
    if (!roomName || roomName.length < 3) {
      return {
        room: {} as Room,
        success: false,
        message: 'El nombre de la sala debe tener al menos 3 caracteres'
      };
    }

    if (!playerName || playerName.length < 2) {
      return {
        room: {} as Room,
        success: false,
        message: 'El nombre del jugador debe tener al menos 2 caracteres'
      };
    }

    // Verificar si la sala ya existe
    if (rooms.find(r => r.name.toLowerCase() === roomName.toLowerCase())) {
      return {
        room: {} as Room,
        success: false,
        message: 'Ya existe una sala con ese nombre'
      };
    }

    // Verificar si el icono está disponible
    const allIcons = getAvailableIcons();
    const iconExists = allIcons.find(i => i.id === icon);
    if (!iconExists) {
      return {
        room: {} as Room,
        success: false,
        message: 'Icono no válido'
      };
    }

    // Crear el jugador host
    const hostPlayer: Player = {
      id: `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: playerName,
      icon: icon,
      isHost: true,
      joinedAt: new Date()
    };

    // Crear la sala
    const newRoom: Room = {
      id: `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: roomName,
      players: [hostPlayer],
      maxPlayers: 6,
      createdAt: new Date(),
      isActive: true
    };

    rooms.push(newRoom);
    updateIconAvailability(newRoom.id);

    return {
      room: newRoom,
      success: true
    };

  } catch (error) {
    return {
      room: {} as Room,
      success: false,
      message: 'Error al crear la sala'
    };
  }
};

// Unirse a una sala existente
export const joinRoom = async (request: RoomJoinRequest): Promise<RoomResponse> => {
  try {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));

    const { roomName, playerName, icon } = request;

    // Validaciones
    if (!roomName || !playerName || !icon) {
      return {
        room: {} as Room,
        success: false,
        message: 'Todos los campos son requeridos'
      };
    }

    // Buscar la sala
    const room = rooms.find(r => r.name.toLowerCase() === roomName.toLowerCase());
    if (!room) {
      return {
        room: {} as Room,
        success: false,
        message: 'Sala no encontrada'
      };
    }

    if (!room.isActive) {
      return {
        room: {} as Room,
        success: false,
        message: 'La sala no está activa'
      };
    }

    if (room.players.length >= room.maxPlayers) {
      return {
        room: {} as Room,
        success: false,
        message: 'La sala está llena'
      };
    }

    // Verificar si el nombre ya está en uso en la sala
    if (room.players.find(p => p.name.toLowerCase() === playerName.toLowerCase())) {
      return {
        room: {} as Room,
        success: false,
        message: 'Ya hay un jugador con ese nombre en la sala'
      };
    }

    // Verificar si el icono está disponible
    const usedIcons = room.players.map(p => p.icon);
    if (usedIcons.includes(icon)) {
      return {
        room: {} as Room,
        success: false,
        message: 'Ese icono ya está en uso'
      };
    }

    // Crear el nuevo jugador
    const newPlayer: Player = {
      id: `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: playerName,
      icon: icon,
      isHost: false,
      joinedAt: new Date()
    };

    // Agregar jugador a la sala
    room.players.push(newPlayer);
    updateIconAvailability(room.id);

    return {
      room: room,
      success: true
    };

  } catch (error) {
    return {
      room: {} as Room,
      success: false,
      message: 'Error al unirse a la sala'
    };
  }
};

// Obtener una sala por ID
export const getRoom = async (roomId: string): Promise<Room | null> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 200));
    return rooms.find(r => r.id === roomId) || null;
  } catch (error) {
    return null;
  }
};

// Obtener todas las salas activas
export const getActiveRooms = async (): Promise<Room[]> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    return rooms.filter(r => r.isActive);
  } catch (error) {
    return [];
  }
};

// Salir de una sala
export const leaveRoom = async (roomId: string, playerId: string): Promise<boolean> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const room = rooms.find(r => r.id === roomId);
    if (!room) return false;

    const playerIndex = room.players.findIndex(p => p.id === playerId);
    if (playerIndex === -1) return false;

    // Remover jugador
    room.players.splice(playerIndex, 1);

    // Si no quedan jugadores, eliminar la sala
    if (room.players.length === 0) {
      rooms = rooms.filter(r => r.id !== roomId);
    } else {
      // Si el host salió, asignar host al siguiente jugador
      if (room.players[playerIndex]?.isHost) {
        if (room.players.length > 0) {
          room.players[0].isHost = true;
        }
      }
      updateIconAvailability(roomId);
    }

    return true;
  } catch (error) {
    return false;
  }
};

// Limpiar salas inactivas (para desarrollo)
export const clearInactiveRooms = (): void => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  rooms = rooms.filter(r => r.isActive && r.createdAt > oneHourAgo);
}; 