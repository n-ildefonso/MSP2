import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Pokemon = ({ term }) => {
  const [pokemonData, setPokemonData] = useState(null);

  useEffect(() => {
    // Make an API request to fetch the Pokémon data
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${term}`)
      .then((response) => {
        setPokemonData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching Pokémon data:', error);
      });
  }, [term]);

  if (!pokemonData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{pokemonData.name}</h2>
      <img
        src={pokemonData.sprites.front_default}
        alt={`${pokemonData.name} sprite`}
      />
      <p>Height: {pokemonData.height} decimetres</p>
      <p>Weight: {pokemonData.weight} hectograms</p>
    </div>
  );
};

export default Pokemon;
