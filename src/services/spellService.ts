import { Spell, SpellGenerationRequest, SpellGenerationResponse } from '../types';

// Base de datos simulada de ingredientes
const ingredientDatabase: { [key: string]: string } = {
  '001': 'Polvo de Cristal Lunar',
  '002': 'Esencia de Dragón',
  '003': 'Raíz de Árbol Ancestral',
  '004': 'Lágrima de Fénix',
  '005': 'Pétalos de Rosa Negra',
  '006': 'Sangre de Unicornio',
  '007': 'Pluma de Cuervo Sabio',
  '008': 'Gema de Hielo Eterno',
  '009': 'Ceniza de Volcán',
  '010': 'Agua de Manantial Sagrado',
  '011': 'Hojas de Roble Dorado',
  '012': 'Veneno de Araña Gigante',
  '013': 'Polvo de Estrella Fugaz',
  '014': 'Escama de Serpiente Marina',
  '015': 'Miel de Abeja Mágica',
  '016': 'Piedra de Trueno',
  '017': 'Musgo de Cueva Profunda',
  '018': 'Ala de Mariposa de Cristal',
  '019': 'Diente de Lobo Plateado',
  '020': 'Semilla de Árbol del Tiempo'
};

// Nombres de hechizos por categoría
const spellNames = {
  combat: [
    'Bola de Fuego Explosiva',
    'Rayo de Hielo Mortal',
    'Tormenta Eléctrica',
    'Onda de Choque Arcana',
    'Láser de Energía Pura',
    'Explosión de Veneno',
    'Meteorito Destructor',
    'Viento Cortante'
  ],
  healing: [
    'Curación Mayor',
    'Regeneración Celestial',
    'Bálsamo de Vida',
    'Restauración Completa',
    'Escudo de Protección',
    'Purificación Divina',
    'Renacimiento Mágico',
    'Sanación Temporal'
  ],
  utility: [
    'Teletransporte',
    'Invisibilidad',
    'Levitar Objetos',
    'Crear Portal',
    'Detectar Magia',
    'Comunicación Mental',
    'Ilusión Perfecta',
    'Control del Tiempo'
  ],
  summoning: [
    'Invocar Elemental',
    'Llamar a las Sombras',
    'Crear Golem',
    'Convocar Dragón',
    'Manifestar Espíritu',
    'Evocar Demonio Menor',
    'Sumar Guardián',
    'Aparición Fantasmal'
  ]
};

// Descripciones de hechizos
const spellDescriptions = {
  combat: [
    'Un poderoso hechizo que lanza una bola de fuego mágica que explota al impactar.',
    'Conjura un rayo de hielo que congela instantáneamente a los enemigos.',
    'Invoca una tormenta eléctrica que descarga múltiples rayos sobre el objetivo.',
    'Crea una onda de choque mágica que empuja y daña a todos los enemigos cercanos.',
    'Dispara un láser de energía pura que atraviesa cualquier defensa.',
    'Libera una nube de veneno que corroe la carne y debilita a los enemigos.',
    'Llama un meteorito del espacio que impacta con fuerza devastadora.',
    'Genera vientos cortantes que desgarran todo a su paso.'
  ],
  healing: [
    'Restaura completamente la salud y elimina todas las heridas.',
    'Activa la regeneración natural del cuerpo a velocidad sobrenatural.',
    'Aplica un bálsamo mágico que cura heridas y alivia el dolor.',
    'Restaura el cuerpo a su estado perfecto, eliminando cualquier mal.',
    'Crea un escudo mágico que absorbe daño y protege al objetivo.',
    'Purifica el cuerpo de cualquier maldición o veneno.',
    'Permite al objetivo renacer con nueva energía y vitalidad.',
    'Proporciona curación temporal que se regenera con el tiempo.'
  ],
  utility: [
    'Teletransporta al objetivo a cualquier lugar conocido.',
    'Hace invisible al objetivo, permitiendo moverse sin ser detectado.',
    'Permite levitar y controlar objetos con la mente.',
    'Abre un portal mágico entre dos ubicaciones.',
    'Revela la presencia de magia en el área circundante.',
    'Establece comunicación mental entre dos o más personas.',
    'Crea una ilusión perfecta que engaña todos los sentidos.',
    'Ralentiza o acelera el tiempo en un área específica.'
  ],
  summoning: [
    'Invoca un elemental poderoso que obedece tus comandos.',
    'Llama a las sombras para que te ayuden en la batalla.',
    'Crea un golem de piedra que protege y lucha por ti.',
    'Conjura un dragón menor que combate a tus enemigos.',
    'Manifiesta un espíritu ancestral que te guía y protege.',
    'Evoca un demonio menor que puede ser controlado.',
    'Suma un guardián celestial que defiende tu posición.',
    'Crea una aparición fantasmal que puede espiar y atacar.'
  ]
};

export const generateSpell = async (request: SpellGenerationRequest): Promise<SpellGenerationResponse> => {
  try {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    const { cardIds } = request;
    
    if (cardIds.length < 2) {
      throw new Error('Se necesitan al menos 2 cartas para generar un hechizo');
    }

    if (cardIds.length > 5) {
      throw new Error('Máximo 5 cartas por hechizo');
    }

    // Obtener ingredientes
    const ingredients = cardIds.map(id => ingredientDatabase[id] || `Ingrediente Desconocido (${id})`);

    // Determinar categoría basada en los IDs
    const categoryKeys = ['combat', 'healing', 'utility', 'summoning'] as const;
    const categoryIndex = cardIds.reduce((sum, id) => sum + parseInt(id), 0) % 4;
    const category = categoryKeys[categoryIndex];

    // Determinar poder basado en cantidad y rareza de ingredientes
    const power = Math.min(5, Math.max(1, Math.floor(cardIds.length * 1.5)));

    // Seleccionar nombre y descripción
    const nameIndex = cardIds.reduce((sum, id) => sum + parseInt(id), 0) % spellNames[category].length;
    const descIndex = cardIds.reduce((sum, id) => sum + parseInt(id), 0) % spellDescriptions[category].length;

    const spell: Spell = {
      id: `spell_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: spellNames[category][nameIndex],
      description: spellDescriptions[category][descIndex],
      ingredients,
      power,
      category,
      createdAt: new Date()
    };

    return {
      spell,
      success: true
    };

  } catch (error) {
    return {
      spell: {
        id: '',
        name: '',
        description: '',
        ingredients: [],
        power: 0,
        category: 'utility',
        createdAt: new Date()
      },
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

// Función para guardar hechizos en localStorage
export const saveSpellToHistory = (spell: Spell): void => {
  try {
    const history = getSpellHistory();
    history.push(spell);
    
    // Mantener solo los últimos 20 hechizos
    if (history.length > 20) {
      history.splice(0, history.length - 20);
    }
    
    localStorage.setItem('spellHistory', JSON.stringify(history));
  } catch (error) {
    console.error('Error al guardar hechizo en historial:', error);
  }
};

// Función para obtener historial de localStorage
export const getSpellHistory = (): Spell[] => {
  try {
    const history = localStorage.getItem('spellHistory');
    if (history) {
      const parsed = JSON.parse(history);
      return parsed.map((spell: any) => ({
        ...spell,
        createdAt: new Date(spell.createdAt)
      }));
    }
  } catch (error) {
    console.error('Error al cargar historial:', error);
  }
  return [];
}; 