import React, { useState, useEffect, useRef } from 'react';

const SYSTEM_PROMPT =
  'Eres un asistente de IA especializado en trading. Solo puedes responder preguntas relacionadas con trading, mercados financieros, análisis técnico, gestión de riesgo, psicología del trading y temas afines. Si la pregunta no es sobre trading, responde: "Lo siento, solo puedo responder preguntas sobre trading y mercados financieros."';

function getInitialHistory() {
  const saved = sessionStorage.getItem('chatHistory');
  return saved ? JSON.parse(saved) : [];
}

const KEYWORD_RESPONSES = [
  {
    keywords: [/trading/i, /mercado/i, /mercados/i],
    response: `El trading es la compra y venta de activos financieros para obtener beneficios. En Trading Sinergico puedes operar acciones de EE.UU., Colombia, criptomonedas y divisas (Forex). Un portafolio es el conjunto de activos que posees. Tu balance lo ves arriba a la derecha. Para más detalles, revisa la sección de <a href='/faq' class='text-accent-blue underline'>Preguntas Frecuentes (FAQ)</a>.`
  },
  {
    keywords: [/operaci[oó]n/i, /comprar/i, /vender/i, /orden de mercado/i, /fuera de horario/i],
    response: `Para comprar o vender activos, utiliza los botones correspondientes y sigue los pasos del modal. Una orden de mercado ejecuta la compra o venta al mejor precio disponible. Solo puedes operar en horarios habilitados. Más información en la sección de <a href='/faq' class='text-accent-blue underline'>Preguntas Frecuentes (FAQ)</a>.`
  },
  {
    keywords: [/riesgo/i, /seguridad/i, /stop loss/i, /contrase[nñ]a/i, /proteger/i],
    response: `Gestiona el riesgo usando stop loss y diversificando tu portafolio. Un stop loss vende automáticamente si el precio baja a cierto nivel. Tus datos están protegidos con protocolos de seguridad. Si olvidas tu contraseña, recupérala desde el inicio de sesión. Consulta la sección de <a href='/faq' class='text-accent-blue underline'>Preguntas Frecuentes (FAQ)</a> para más detalles.`
  },
  {
    keywords: [/indicador/i, /herramienta/i, /RSI/i, /MACD/i, /media m[oó]vil/i, /gr[aá]fico/i, /personalizar/i],
    response: `Puedes usar indicadores como medias móviles, RSI, MACD y más. Agrégalos desde el panel de indicadores. El RSI mide la fuerza y cambio de precio. Los gráficos se pueden personalizar. Para más información, revisa la sección de <a href='/faq' class='text-accent-blue underline'>Preguntas Frecuentes (FAQ)</a>.`
  },
  {
    keywords: [/psicolog[ií]a/i, /aprender/i, /duda/i, /tema/i, /emocion/i, /control emocional/i],
    response: `La psicología es clave en el trading para tomar mejores decisiones y controlar emociones. Puedes aprender más en recursos o preguntando aquí. Si tienes dudas, revisa el FAQ. El chat solo responde sobre trading. Para más información, visita la sección de <a href='/faq' class='text-accent-blue underline'>Preguntas Frecuentes (FAQ)</a>.`
  }
];

function Chat() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState(getInitialHistory());
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    sessionStorage.setItem('chatHistory', JSON.stringify(history));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setHistory((h) => [...h, userMsg]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      let response = null;
      for (const entry of KEYWORD_RESPONSES) {
        if (entry.keywords.some((re) => re.test(input))) {
          response = entry.response;
          break;
        }
      }
      if (!response) {
        response = 'Lo siento, solo puedo responder preguntas sobre trading y mercados financieros.';
      }
      setHistory((h) => [...h, { role: 'assistant', content: response }]);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 flex flex-col h-[80vh]">
      <h2 className="text-2xl font-bold mb-4 text-white">Chat con IA de Trading</h2>
      <div className="flex-1 overflow-y-auto bg-dark-800 rounded-lg p-4 border border-dark-600 mb-4">
        {history.length === 0 && (
          <div className="text-gray-400">¡Haz tu primera pregunta sobre trading!</div>
        )}
        {history.map((msg, i) => (
          <div key={i} className={`mb-3 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
            <div
              className={`inline-block px-3 py-2 rounded-lg ${msg.role === 'user' ? 'bg-accent-blue text-white' : 'bg-dark-700 text-gray-200'}`}
              dangerouslySetInnerHTML={msg.role === 'assistant' ? { __html: msg.content } : undefined}
            >
              {msg.role === 'user' ? msg.content : null}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Escribe tu pregunta sobre trading..."
          className="flex-1 px-3 py-2 rounded bg-dark-700 text-white border border-dark-600 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-accent-green text-white rounded-lg font-semibold hover:bg-accent-green/80 disabled:opacity-50"
        >
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
      <div className="mt-4 text-gray-400 text-sm">
        ¿No encuentras respuesta? <a href="/faq" className="text-accent-blue underline">Consulta el FAQ</a>
      </div>
    </div>
  );
}

export default Chat;
