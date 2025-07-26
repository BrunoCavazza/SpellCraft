# ✨ SpellCraft - Juego de Mesa Mágico con IA

Una aplicación web React que permite a los jugadores escanear códigos QR de cartas físicas para crear hechizos únicos mediante inteligencia artificial.

## 🎮 Características

- **Escaneo de QR**: Escanea códigos QR de cartas físicas usando la cámara del dispositivo
- **Generación de Hechizos**: Combina múltiples cartas para crear hechizos únicos
- **Historial**: Guarda y revisa hechizos generados anteriormente
- **Diseño Responsivo**: Optimizado para dispositivos móviles
- **Interfaz Intuitiva**: Diseño moderno y fácil de usar

## 🚀 Instalación y Uso

### Requisitos Previos

- Node.js (versión 14 o superior)
- npm o yarn
- Navegador web moderno con soporte para cámara

### Instalación

1. Clona el repositorio:
```bash
git clone <tu-repositorio>
cd spellcraft-app
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm start
```

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador

### Construcción para Producción

```bash
npm run build
```

## 📱 Cómo Usar la Aplicación

### 1. Escanear Cartas
- Presiona el botón "📷 Escanear Cartas"
- Permite acceso a la cámara cuando se solicite
- Apunta la cámara hacia los códigos QR de las cartas físicas
- Cada carta escaneada se agregará a tu lista de ingredientes

### 2. Generar Hechizos
- Escanea al menos 2 cartas (máximo 5)
- Presiona "⚡ Generar Hechizo"
- La aplicación simulará la generación de un hechizo único
- El hechizo se mostrará con nombre, descripción, poder y categoría

### 3. Historial
- Presiona "📚 Historial" para ver hechizos anteriores
- Haz clic en cualquier hechizo para verlo en detalle
- Los hechizos se guardan automáticamente en el navegador

## 🎯 Estructura del Proyecto

```
spellcraft-app/
├── src/
│   ├── components/
│   │   ├── QRScanner.tsx          # Componente de escaneo de QR
│   │   ├── ScannedCardsList.tsx   # Lista de cartas escaneadas
│   │   ├── SpellDisplay.tsx       # Visualización de hechizos
│   │   └── SpellHistory.tsx       # Historial de hechizos
│   ├── services/
│   │   └── spellService.ts        # Lógica de generación de hechizos
│   ├── types/
│   │   └── index.ts               # Definiciones de tipos TypeScript
│   ├── App.tsx                    # Componente principal
│   ├── App.css                    # Estilos de la aplicación
│   └── index.tsx                  # Punto de entrada
├── public/
└── package.json
```

## 🔧 Configuración de Códigos QR

### Formato de QR
Los códigos QR deben contener solo números (IDs de cartas):
- Ejemplo: `001`, `013`, `020`
- Rango recomendado: 001-999

### Base de Datos de Ingredientes
La aplicación incluye una base de datos simulada con 20 ingredientes:
- `001`: Polvo de Cristal Lunar
- `002`: Esencia de Dragón
- `003`: Raíz de Árbol Ancestral
- ... y más

### Categorías de Hechizos
- **Combate**: Hechizos ofensivos y defensivos
- **Curación**: Hechizos de restauración y protección
- **Utilidad**: Hechizos de teletransporte, invisibilidad, etc.
- **Invocación**: Hechizos para crear criaturas y entidades

## 🛠️ Desarrollo

### Tecnologías Utilizadas

- **React 18**: Framework de interfaz de usuario
- **TypeScript**: Tipado estático para JavaScript
- **html5-qrcode**: Librería para escaneo de códigos QR
- **CSS3**: Estilos modernos con variables CSS y diseño responsive

### Estructura de Datos

```typescript
interface Card {
  id: string;
  name: string;
  type: 'ingredient' | 'catalyst' | 'essence';
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
}

interface Spell {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  power: number;
  category: 'combat' | 'utility' | 'healing' | 'summoning';
  createdAt: Date;
}
```

### Personalización

#### Agregar Nuevos Ingredientes
Edita `src/services/spellService.ts` y agrega nuevos ingredientes al objeto `ingredientDatabase`:

```typescript
const ingredientDatabase: { [key: string]: string } = {
  // ... ingredientes existentes
  '021': 'Nuevo Ingrediente Mágico',
  '022': 'Otro Ingrediente Especial',
};
```

#### Modificar Categorías de Hechizos
Puedes agregar nuevas categorías modificando los arrays `spellNames` y `spellDescriptions` en el mismo archivo.

## 🔮 Futuras Mejoras

### Funcionalidades Planificadas
- [ ] Integración con backend real con IA generativa
- [ ] Generación de imágenes de hechizos
- [ ] Sistema de usuarios y guardado en la nube
- [ ] Modo multijugador
- [ ] Escaneo de múltiples QR en una sola imagen
- [ ] Efectos de sonido y animaciones
- [ ] Modo offline con PWA

### Integración con Backend
Para conectar con un backend real, modifica la función `generateSpell` en `spellService.ts`:

```typescript
export const generateSpell = async (request: SpellGenerationRequest): Promise<SpellGenerationResponse> => {
  try {
    const response = await fetch('/api/generate-spell', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    return await response.json();
  } catch (error) {
    // Manejo de errores
  }
};
```

## 📋 Scripts Disponibles

- `npm start`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm test`: Ejecuta las pruebas
- `npm run eject`: Expone la configuración de webpack (irreversible)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si encuentras algún problema o tienes preguntas:

1. Revisa la sección de [Issues](../../issues) del repositorio
2. Crea un nuevo issue con una descripción detallada del problema
3. Incluye información sobre tu dispositivo y navegador

## 🎉 Agradecimientos

- [html5-qrcode](https://github.com/mebjas/html5-qrcode) por la librería de escaneo QR
- La comunidad de React por el excelente framework
- Todos los contribuidores que ayudan a mejorar este proyecto

---

**¡Disfruta creando hechizos mágicos! ✨**
