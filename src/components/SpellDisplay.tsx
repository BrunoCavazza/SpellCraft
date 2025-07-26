import React from 'react';
import { Spell } from '../types';

interface SpellDisplayProps {
  spell: Spell | null;
  isLoading: boolean;
  error: string | null;
  onGenerateSpell?: () => void;
}

// Snippet de AI Button de Animata (puedes reemplazarlo por el real)
const AiButton = ({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    style={{
      background: 'linear-gradient(90deg, #5A189A 0%, #C77DFF 100%)',
      color: '#FFD700',
      border: 'none',
      borderRadius: 16,
      fontSize: 22,
      fontWeight: 700,
      padding: '1rem 2.5rem',
      boxShadow: '0 0 24px #C77DFF99',
      cursor: 'pointer',
      margin: '2rem auto',
      display: 'block',
      letterSpacing: 2,
      transition: 'transform 0.2s',
    }}
    className="ai-button-animata"
  >
    {/* Aquí puedes pegar el SVG/animación real de Animata si lo tienes */}
    {children}
  </button>
);

const SpellDisplay: React.FC<SpellDisplayProps> = ({ spell, isLoading, error, onGenerateSpell }) => {
  if (isLoading) {
    return (
      <div className="spell-display loading">
        <div className="loading-spinner"></div>
        <p>Generando hechizo mágico...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="spell-display error">
        <h3>Error al generar hechizo</h3>
        <p>{error}</p>
        {onGenerateSpell && (
          <AiButton onClick={onGenerateSpell}>Crear Hechizo</AiButton>
        )}
      </div>
    );
  }

  if (!spell) {
    return (
      <div className="spell-display empty">
        <h3>Hechizo Generado</h3>
        <p>Escanea cartas y presiona "Crear Hechizo" para crear un hechizo único</p>
        {onGenerateSpell && (
          <AiButton onClick={onGenerateSpell}>Crear Hechizo</AiButton>
        )}
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'combat': return '#F72585';
      case 'healing': return '#00C9A7';
      case 'utility': return '#00B4D8';
      case 'summoning': return '#FFD700';
      default: return '#9D4EDD';
    }
  };

  const getPowerStars = (power: number) => {
    return '★'.repeat(power) + '☆'.repeat(5 - power);
  };

  return (
    <div className="spell-display">
      <div className="spell-header">
        <h2 className="spell-name">{spell.name}</h2>
        <div 
          className="spell-category"
          style={{ backgroundColor: getCategoryColor(spell.category) }}
        >
          {spell.category.toUpperCase()}
        </div>
      </div>
      
      <div className="spell-details">
        <div className="spell-power">
          <span>Poder: </span>
          <span className="power-stars">{getPowerStars(spell.power)}</span>
        </div>
        
        <div className="spell-ingredients">
          <h4>Ingredientes:</h4>
          <div className="ingredients-list">
            {spell.ingredients.map((ingredient, index) => (
              <span key={index} className="ingredient-tag">
                {ingredient}
              </span>
            ))}
          </div>
        </div>
        
        <div className="spell-description">
          <h4>Descripción:</h4>
          <p>{spell.description}</p>
        </div>
        
        <div className="spell-created">
          <small>Creado: {spell.createdAt.toLocaleString()}</small>
        </div>
      </div>
    </div>
  );
};

export default SpellDisplay; 