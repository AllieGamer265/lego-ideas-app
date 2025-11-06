import React, { useState } from 'react';
import './App.css';

// Base de datos de ejemplo de sets de LEGO y sus ideas alternativas
const legoIdeasDB = {
  "21181": {
    name: "La Granja de Conejos (Minecraft)",
    ideas: [
      "Una torre de vigilancia para protegerse del zombi.",
      "Un corral de zanahorias más grande y cercado.",
      "Un pequeño escondite subterráneo para el jugador.",
      "Un puente para cruzar la cueva.",
      "Una estatua gigante de un conejo.",
      "Un puesto de mercado para intercambiar zanahorias.",
      "Una catapulta para lanzar zanahorias al zombi."
    ]
  },
  "31058": {
    name: "Dinosaurio Poderoso",
    ideas: [
      "Un Pterodáctilo.",
      "Un Triceratops.",
      "Un Brontosaurio.",
      "Un coche de carreras futurista.",
      "Una nave espacial de exploración.",
      "Una estación de investigación de dinosaurios.",
      "Un robot dinosaurio gigante."
    ]
  },
  "10696": {
    name: "Caja de Ladrillos Creativos Mediana",
    ideas: [
      "Un pequeño castillo con un puente levadizo.",
      "Una flota de 3 naves espaciales diferentes.",
      "Un robot transformable en vehículo.",
      "Una casa de dos pisos con jardín.",
      "Un dinosaurio (T-Rex).",
      "Un avión de hélice y una torre de control.",
      "Un pulpo y un submarino de exploración."
    ]
  },
  "31131": {
    name: "Tienda de Fideos del Centro",
    ideas: [
      "Un hotel boutique con recepción y terraza.",
      "Una casa adosada de estilo europeo.",
      "Una sala de juegos arcade con máquinas diferentes.",
      "Una tienda de bicicletas con un taller.",
      "Un pequeño museo de arte moderno.",
      "Una estación de bomberos con un vehículo pequeño.",
      "Un invernadero urbano con un café."
    ]
  },
  "10294": {
    name: "Titanic",
    ideas: [
      "Una versión motorizada del Titanic con hélices que giran.",
      "Un diorama del naufragio en el fondo del océano.",
      "Un corte transversal detallado que muestre una nueva sección interior.",
      "Un muelle de la época eduardiana con una grúa y carga.",
      "Un puente de hierro largo y ornamentado para trenes.",
      "La fachada de un gran hotel de lujo de principios del siglo XX.",
      "Un dirigible zepelín gigante con su torre de amarre."
    ]
  },
  "10307": {
    name: "Torre Eiffel",
    ideas: [
      "Una torre de comunicaciones o una antena de radio gigante.",
      "Un puente de celosía para un ferrocarril.",
      "Una escultura abstracta moderna que represente el caos y el orden.",
      "La estructura de una cúpula geodésica.",
      "Una grúa de construcción de gran altura.",
      "La base de lanzamiento de un cohete espacial.",
      "Un segmento de una montaña rusa con una caída pronunciada."
    ]
  },
  "31147": {
    name: "Cámara Retro",
    ideas: [
      "Una cámara de cine antigua con carretes.",
      "Un televisor retro con antena.",
      "Un proyector de diapositivas.",
      "Un robot fotógrafo con un ojo de lente.",
      "Un dron de reconocimiento con una cámara montada.",
      "Una caja registradora antigua.",
      "Un tocadiscos con un disco de vinilo."
    ]
  }
};

function App() {
  const [setNumber, setSetNumber] = useState('');
  const [ideas, setIdeas] = useState([]);
  const [setName, setSetName] = useState('');
  const [error, setError] = useState('');

  const handleSearch = () => {
    const foundSet = legoIdeasDB[setNumber];
    if (foundSet) {
      setIdeas(foundSet.ideas);
      setSetName(foundSet.name);
      setError('');
    } else {
      setIdeas([]);
      setSetName('');
      setError(`No se encontraron ideas para el set #${setNumber}. Asegúrate de que esté en nuestra base de datos.`);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="logo">🧱</div>
        <h1>LEGO Builder Ideas</h1>
        <p>¿No sabes qué construir? Introduce el número de tu set de LEGO y te daremos 7 ideas.</p>
      </header>
      <main>
        <div className="search-container">
          <input
            type="text"
            value={setNumber}
            onChange={(e) => setSetNumber(e.target.value)}
            placeholder="Introduce el número del set (ej: 21181)"
          />
          <button onClick={handleSearch}>Buscar Ideas</button>
        </div>

        {error && <p className="error-message">{error}</p>}

        {ideas.length > 0 && (
          <div className="results-container">
            <h2>Ideas para el set: "{setName}"</h2>
            <ul>
              {ideas.map((idea, index) => (
                <li key={index}>{idea}</li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
