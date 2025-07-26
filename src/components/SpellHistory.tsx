import React from 'react';
import { Spell } from '../types';
import { motion } from 'framer-motion';

interface SpellHistoryProps {
  spells: Spell[];
  onSpellSelect: (spell: Spell) => void;
}

const cardVariants: any = {
  offscreen: {
    y: 300,
    opacity: 0,
  },
  onscreen: {
    y: 0,
    opacity: 1,
    rotate: -4,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8,
    },
  },
};

const container: React.CSSProperties = {
  margin: "40px auto",
  maxWidth: 700,
  paddingBottom: 100,
  width: "100%",
  display: 'flex',
  flexWrap: 'wrap',
  gap: '2rem',
  justifyContent: 'center',
};

const cardContainer: React.CSSProperties = {
  overflow: "hidden",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  paddingTop: 20,
  marginBottom: -60,
};

const card: React.CSSProperties = {
  width: 180,
  height: 260,
  display: "flex",
  flexDirection: 'column',
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 20,
  background: "#240046",
  boxShadow:
    "0 0 1px hsl(0deg 0% 0% / 0.075), 0 0 2px hsl(0deg 0% 0% / 0.075), 0 0 4px hsl(0deg 0% 0% / 0.075), 0 0 8px hsl(0deg 0% 0% / 0.075), 0 0 16px hsl(0deg 0% 0% / 0.075)",
  transformOrigin: "10% 60%",
  border: '3px solid #9D4EDD',
  color: '#E0AAFF',
  cursor: 'pointer',
  transition: 'border 0.2s',
};

const imgStyle: React.CSSProperties = {
  width: '90%',
  height: 120,
  objectFit: 'contain',
  borderRadius: 12,
  margin: '1rem 0 0.5rem 0',
  background: '#10002B',
  boxShadow: '0 2px 12px #C77DFF55',
};

const rarityColors: Record<string, string> = {
  common: '#7B2CBF',
  rare: '#9D4EDD',
  epic: '#C77DFF',
  legendary: '#FFD700',
  chaotic: '#F72585',
};

function getRarityColor(rarity: string) {
  return rarityColors[rarity] || '#C77DFF';
}

const SpellHistory: React.FC<SpellHistoryProps> = ({ spells, onSpellSelect }) => {
  if (spells.length === 0) {
    return (
      <div className="spell-history empty">
        <h3>Historial de Hechizos</h3>
        <p>No hay hechizos en el historial</p>
      </div>
    );
  }

  return (
    <div className="spell-history">
      <h3 style={{ color: '#E0AAFF', marginBottom: 32 }}>Historial de Hechizos</h3>
      <div style={container}>
        {spells.slice().reverse().map((spell, i) => (
          <motion.div
            key={spell.id}
            className={`card-container-${i}`}
            style={cardContainer}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ amount: 0.7 }}
          >
            <motion.div
              style={{ ...card, border: `3px solid ${getRarityColor(spell.category)}` }}
              variants={cardVariants}
              className="card"
              onClick={() => onSpellSelect(spell)}
            >
              {/* Imagen de la carta: busca la primera coincidencia de ingrediente en /Cards */}
              <img
                src={`/Cards/${spell.ingredients[0].replace(/ /g, '_').toLowerCase()}.png`}
                alt={spell.ingredients[0]}
                style={imgStyle}
                onError={e => (e.currentTarget.style.display = 'none')}
              />
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{spell.name}</div>
              <div style={{ fontSize: 13, color: '#FFD700', marginBottom: 4 }}>{spell.category.toUpperCase()}</div>
              <div style={{ fontSize: 12, color: '#ECECEC' }}>{spell.description.slice(0, 40)}...</div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SpellHistory; 