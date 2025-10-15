import React, { useState } from 'react';

const FAQ_DATA = [
  {
    category: 'General',
    questions: [
      { q: '¿Qué es el trading?', a: 'El trading es la compra y venta de activos financieros con el objetivo de obtener beneficios.' },
      { q: '¿Qué mercados puedo operar en Trading Sinérgico?', a: 'Puedes operar acciones de EE.UU., Colombia, criptomonedas y divisas (Forex).' },
      { q: '¿Qué es un portafolio?', a: 'Es el conjunto de activos financieros que posee un inversor.' },
      { q: '¿Cómo puedo ver mi balance?', a: 'Tu balance se muestra en la parte superior derecha de la aplicación.' },
    ]
  },
  {
    category: 'Operaciones',
    questions: [
      { q: '¿Cómo compro un activo?', a: 'Haz clic en el botón "Comprar" y sigue los pasos del modal.' },
      { q: '¿Cómo vendo un activo?', a: 'Haz clic en el botón "Vender" y sigue los pasos del modal.' },
      { q: '¿Qué es una orden de mercado?', a: 'Es una orden para comprar o vender un activo al mejor precio disponible.' },
      { q: '¿Puedo operar fuera de horario?', a: 'No, solo puedes operar en los horarios habilitados por el mercado.' },
    ]
  },
  {
    category: 'Riesgo y Seguridad',
    questions: [
      { q: '¿Cómo gestiono el riesgo?', a: 'Utiliza stop loss y diversifica tu portafolio para gestionar el riesgo.' },
      { q: '¿Qué es un stop loss?', a: 'Es una orden para vender un activo automáticamente si su precio baja a un nivel determinado.' },
      { q: '¿Mis datos están seguros?', a: 'Sí, utilizamos protocolos de seguridad para proteger tu información.' },
      { q: '¿Qué hago si olvido mi contraseña?', a: 'Utiliza la opción de recuperación de contraseña en la pantalla de inicio de sesión.' },
    ]
  },
  {
    category: 'Indicadores y Herramientas',
    questions: [
      { q: '¿Qué indicadores puedo usar?', a: 'Puedes usar medias móviles, RSI, MACD, entre otros.' },
      { q: '¿Cómo agrego un indicador al gráfico?', a: 'Selecciona el indicador desde el panel de indicadores.' },
      { q: '¿Qué es el RSI?', a: 'El RSI es un indicador de fuerza relativa que mide la velocidad y cambio de los movimientos de precio.' },
      { q: '¿Puedo personalizar los gráficos?', a: 'Sí, puedes cambiar el timeframe y los indicadores.' },
    ]
  },
  {
    category: 'Psicología y Aprendizaje',
    questions: [
      { q: '¿Por qué es importante la psicología en el trading?', a: 'La psicología influye en la toma de decisiones y el control emocional.' },
      { q: '¿Dónde puedo aprender más sobre trading?', a: 'Consulta la sección de recursos o pregunta al chat con IA.' },
      { q: '¿Qué hago si tengo dudas?', a: 'Puedes buscar en el FAQ o usar el chat con IA.' },
      { q: '¿El chat IA responde cualquier tema?', a: 'No, solo responde sobre trading y temas relacionados.' },
    ]
  }
];

function FAQ() {
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState(FAQ_DATA);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    if (!value) {
      setFiltered(FAQ_DATA);
      return;
    }
    setFiltered(
      FAQ_DATA.map(cat => ({
        ...cat,
        questions: cat.questions.filter(q => q.q.toLowerCase().includes(value) || q.a.toLowerCase().includes(value))
      })).filter(cat => cat.questions.length > 0)
    );
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-4 text-white">Preguntas Frecuentes (FAQ)</h2>
      <input
        type="text"
        placeholder="Buscar pregunta..."
        value={search}
        onChange={handleSearch}
        className="w-full mb-6 px-3 py-2 rounded bg-dark-700 text-white border border-dark-600 focus:outline-none"
      />
      {filtered.length === 0 && (
        <div className="text-gray-400 mb-4">No se encontró respuesta. <a href="/chat" className="text-accent-blue underline">¿Quieres preguntar al chat?</a></div>
      )}
      {filtered.map(cat => (
        <div key={cat.category} className="mb-6">
          <h3 className="text-lg font-semibold text-accent-blue mb-2">{cat.category}</h3>
          <ul className="space-y-2">
            {cat.questions.map((q, i) => (
              <li key={i} className="bg-dark-800 p-4 rounded-lg border border-dark-600">
                <strong className="text-white">{q.q}</strong>
                <p className="text-gray-300 mt-1">{q.a}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default FAQ;
