import { useState } from 'react'

type Pokemon = {
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
  };
  types: {
    type: { name: string };
  }[];
};

function App() {
  const [search, setSearch] = useState('');
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!search.trim()) return;

    setLoading(true);
    setError('');
    setPokemon(null);

    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${search.toLowerCase()}`
      );

      if (!response.ok) {
        throw new Error('Pokémon not found');
      }

      const data = await response.json();
      setPokemon(data);
    } catch (err) {
      setError('Pokémon not found. Please check the name and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Pokémon Viewer</h1>

      <div className="flex w-full max-w-md gap-2 mb-8">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter Pokémon name (e.g. pikachu)"
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        <button
          onClick={handleSearch}
          className="bg-yellow-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-yellow-600 transition-colors duration-300"
        >
          Search
        </button>
      </div>

      {loading && <p className="text-gray-500">Loading...</p>}

      {error && <p className="text-red-500">{error}</p>}

      {pokemon && !loading && (
        <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md text-center">
          <img
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            className="w-32 h-32 mx-auto mb-4"
          />
          <h2 className="text-xl font-semibold text-gray-900 capitalize mb-2">
            {pokemon.name}
          </h2>

          <div className="flex justify-center gap-2 mb-4">
            {pokemon.types.map((t, i) => (
              <span
                key={i}
                className="bg-yellow-100 text-yellow-800 text-xs font-medium px-3 py-1 rounded-full capitalize"
              >
                {t.type.name}
              </span>
            ))}
          </div>

          <div className="flex justify-center gap-8 text-sm text-gray-700">
            <div>
              <span className="font-bold text-gray-900">{pokemon.height / 10}m</span> Height
            </div>
            <div>
              <span className="font-bold text-gray-900">{pokemon.weight / 10}kg</span> Weight
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;