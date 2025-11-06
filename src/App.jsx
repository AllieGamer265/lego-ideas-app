import React, { useState } from 'react';
import './App.css';

const MODEL_NAME = 'gemini-1.5-flash';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent`;
const REQUEST_HEADERS = {
  'Content-Type': 'application/json',
};

const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    setNumber: { type: 'string' },
    setName: { type: 'string' },
    pieces: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          partNumber: { type: 'string' },
          name: { type: 'string' },
          color: { type: 'string' },
          quantity: { type: 'number' },
        },
        required: ['name'],
        additionalProperties: false,
      },
    },
    ideas: {
      type: 'array',
      minItems: 3,
      maxItems: 3,
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          instructions: {
            type: 'array',
            items: { type: 'string' },
          },
        },
        required: ['title', 'instructions'],
        additionalProperties: false,
      },
    },
  },
  required: ['setNumber', 'pieces', 'ideas'],
  additionalProperties: false,
};

const buildPrompt = (setNumber) => `Actúa como un agente creativo de LEGO. Usa tus conocimientos y recursos para identificar el set de LEGO con número "${setNumber}" y obtener el listado más actualizado posible de sus piezas (incluye identificador, nombre, color predominante y cantidad).

Analiza las piezas disponibles y genera exactamente tres ideas diferentes al modelo oficial. Cada idea debe incluir:
- Un título inspirador.
- Una breve descripción de la construcción propuesta.
- Una lista de instrucciones paso a paso que utilice exclusivamente las piezas del set.

Si alguna información no está disponible, explica la limitación dentro de la descripción de la idea correspondiente. Asegúrate de que el número de set devuelto coincida con "${setNumber}".`;

const parseGeminiResponse = (rawText) => {
  try {
    return JSON.parse(rawText);
  } catch (error) {
    console.error('No se pudo interpretar la respuesta del modelo:', error);
    throw new Error('Respuesta del modelo inválida.');
  }
};

function App() {
  const [setNumber, setSetNumber] = useState('');
  const [setName, setSetName] = useState('');
  const [pieces, setPieces] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const extractTextFromCandidates = (payload) => {
    const candidates = payload?.candidates || [];
    const textParts = candidates
      .flatMap((candidate) => candidate?.content?.parts || [])
      .map((part) => part?.text?.trim())
      .filter(Boolean);

    return textParts.join('').trim();
  };

  const handleSearch = async () => {
    if (!setNumber.trim()) {
      setError('Por favor, introduce el número del set de LEGO.');
      return;
    }

    if (!apiKey) {
      setError('No se encontró la clave de la API de Gemini. Añádela al archivo .env.');
      return;
    }

    setIsLoading(true);
    setError('');
    setIdeas([]);
    setPieces([]);
    setSetName('');

    try {
      const prompt = buildPrompt(setNumber.trim());
      const response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
        method: 'POST',
        headers: REQUEST_HEADERS,
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            responseMimeType: 'application/json',
            responseSchema: RESPONSE_SCHEMA,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Error del servicio: ${response.status}`);
      }

      const payload = await response.json();
      const textResponse = extractTextFromCandidates(payload);

      if (!textResponse) {
        throw new Error('No se recibió contenido del modelo.');
      }

      const parsed = parseGeminiResponse(textResponse);

      setSetName(parsed.setName || '');
      setPieces(Array.isArray(parsed.pieces) ? parsed.pieces : []);
      setIdeas(Array.isArray(parsed.ideas) ? parsed.ideas : []);

      if (!parsed.setName) {
        setError('El modelo no proporcionó el nombre del set.');
      }

      if (parsed.setNumber && parsed.setNumber !== setNumber.trim()) {
        setError('El modelo devolvió información para un número de set distinto. Revisa el resultado.');
      }
    } catch (err) {
      console.error(err);
      setError('No se pudieron obtener ideas creativas en este momento. Inténtalo nuevamente más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="logo">🧱</div>
        <h1>LEGO Builder Ideas</h1>
        <p>¿No sabes qué construir? Introduce el número de tu set de LEGO y te daremos 3 ideas frescas.</p>
      </header>
      <main>
        <div className="search-container">
          <input
            type="text"
            value={setNumber}
            onChange={(e) => setSetNumber(e.target.value)}
            placeholder="Introduce el número del set (ej: 21181)"
          />
          <button onClick={handleSearch} disabled={isLoading}>
            {isLoading ? 'Buscando...' : 'Buscar Ideas'}
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}

        {isLoading && <p className="loading-message">Consultando al agente creativo...</p>}

        {(setName || pieces.length > 0 || ideas.length > 0) && (
          <div className="results-container">
            {setName && <h2>Ideas para el set: "{setName}"</h2>}

            {pieces.length > 0 && (
              <section className="pieces-section">
                <h3>Inventario de piezas</h3>
                <ul className="pieces-list">
                  {pieces.map((piece, index) => (
                    <li key={`${piece.partNumber || index}-${piece.name || 'pieza'}`}>
                      <strong>{piece.partNumber || 'Sin ID'}</strong> — {piece.name || 'Pieza sin nombre'}
                      {piece.color ? `, color: ${piece.color}` : ''}
                      {piece.quantity ? ` (x${piece.quantity})` : ''}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {ideas.length > 0 && (
              <section className="ideas-section">
                <h3>Propuestas creativas</h3>
                <ul className="ideas-list">
                  {ideas.map((idea, index) => {
                    if (typeof idea === 'string') {
                      return <li key={`idea-${index}`}>{idea}</li>;
                    }

                    const instructions = Array.isArray(idea.instructions) ? idea.instructions : [];

                    return (
                      <li key={idea.title || `idea-${index}`} className="idea-card">
                        <h4>{idea.title || `Idea ${index + 1}`}</h4>
                        {idea.description && <p>{idea.description}</p>}
                        {instructions.length > 0 && (
                          <ol>
                            {instructions.map((step, stepIndex) => (
                              <li key={`step-${stepIndex}`}>{step}</li>
                            ))}
                          </ol>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
