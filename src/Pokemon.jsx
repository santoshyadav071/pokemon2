import { useEffect, useState } from "react";

export const Pokemon = () => {
  const API = "https://pokeapi.co/api/v2/pokemon?limit=50";
  const [pokemonData, setPokemonData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPokemon = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      const pokemonDetailsPromises = data.results.map(async (pokemon) => {
        const pokemonRes = await fetch(pokemon.url);
        return pokemonRes.json();
      });
      const pokemonDetails = await Promise.all(pokemonDetailsPromises);
      setPokemonData(pokemonDetails);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  // Filter Pokémon based on the search term
  const filteredPokemon = pokemonData.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to determine the gradient background based on the type
  const getGradientBackground = (type) => {
    switch (type) {
      case "water":
        return "bg-gradient-to-r from-blue-400 to-blue-600";
      case "fire":
        return "bg-gradient-to-r from-red-400 to-red-600";
      case "grass":
        return "bg-gradient-to-r from-green-400 to-green-600";
      case "electric":
        return "bg-gradient-to-r from-yellow-400 to-yellow-600";
      case "ice":
        return "bg-gradient-to-r from-blue-200 to-blue-400";
      case "rock":
        return "bg-gradient-to-r from-gray-500 to-gray-700";
      case "psychic":
        return "bg-gradient-to-r from-purple-400 to-purple-600";
      default:
        return "bg-gradient-to-r from-gray-300 to-gray-500"; // Default gradient for other types
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4 text-center text-blue-600">
          Pokémon List
        </h1>
        <input
          type="text"
          placeholder="Search Pokémon..."
          className="w-full max-w-md p-2 border rounded-lg shadow-sm mx-auto block"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
        />
      </div>
      {filteredPokemon.length > 0 ? (
        <ul className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
          {filteredPokemon.map((pokemon) => (
            <li
              key={pokemon.id}
              className={`p-4 rounded-lg shadow-md hover:bg-gray-200 transition duration-300 ${getGradientBackground(pokemon.types[0].type.name)}`}
            >
              <img
                className="w-20 h-20 mx-auto mb-4"
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
              />
              <p className="text-center font-semibold capitalize">
                {pokemon.name}
              </p>
              <p className="text-center">Height: {pokemon.height}</p>
              <p className="text-center">Weight: {pokemon.weight}</p>
              <p className="text-center">Speed: {pokemon.stats.find(stat => stat.stat.name === 'speed').base_stat}</p>

              {/* Display Pokémon Types */}
              <div className="text-center mt-4">
                {pokemon.types.map((typeInfo, index) => (
                  <button
                    key={index}
                    className={`px-4 py-2 rounded-full text-white ${
                      typeInfo.type.name === "water"
                        ? "bg-blue-500"
                        : typeInfo.type.name === "fire"
                        ? "bg-red-500"
                        : typeInfo.type.name === "grass"
                        ? "bg-green-500"
                        : typeInfo.type.name === "electric"
                        ? "bg-yellow-500"
                        : typeInfo.type.name === "ice"
                        ? "bg-blue-300"
                        : typeInfo.type.name === "rock"
                        ? "bg-gray-500"
                        : "bg-gray-500"
                    }`}
                  >
                    {typeInfo.type.name}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No Pokémon found...</p>
      )}
    </div>
  );
};
