import { useState, useEffect } from "react";
import axios from "axios";
import "./Search.css";

export default function Search({ onSelect }) {
      const [query, setQuery] = useState("");
      const [pokemonList, setPokemonList] = useState([]);
      const [filteredList, setFilteredList] = useState([]);
      const [error, setError] = useState("");

      // Fetch all Pokémon names once (first 1000 for performance)
      useEffect(() => {
            const fetchPokemonList = async () => {
                  try {
                        const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=1000");
                        setPokemonList(response.data.results.map((p) => p.name));
                  } catch (err) {
                        console.error("Failed to load Pokémon list", err);
                        setError("Failed to fetch Pokémon list.");
                  }
            };
            fetchPokemonList();
      }, []);

      // Filter list as user types
      useEffect(() => {
            if (query.trim() === "") {
                  setFilteredList([]);
                  return;
            }

            const filtered = pokemonList.filter((name) =>
                  name.toLowerCase().startsWith(query.toLowerCase())
            );
            setFilteredList(filtered.slice(0, 10)); // show top 10 matches
      }, [query, pokemonList]);

      const handleSelect = async(name) => {
            setQuery(name);
            setFilteredList([]);
            const pokeData = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
            onSelect(pokeData.data.id);
      };

      return (
            <div className="search-wrapper">
                  <input
                        id="pokemon-name-search"
                        type="text"
                        placeholder="Search Pokémon..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="search-input"
                        autoComplete="off"
                  />
                  {error && <p className="error-text">{error}</p>}

                  {filteredList.length > 0 && (
                        <ul className="suggestions-list">
                              {filteredList.map((name) => (
                                    <li
                                          key={name}
                                          className="suggestion-item"
                                          onClick={() => handleSelect(name)}
                                    >
                                          {name}
                                    </li>
                              ))}
                        </ul>
                  )}
            </div>
      );
}
