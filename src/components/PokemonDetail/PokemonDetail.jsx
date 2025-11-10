import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./PokemonDetail.css";

export default function PokemonDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pokemon, setPokemon] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
                setPokemon({
                    name: response.data.name,
                    image: response.data.sprites.other["official-artwork"].front_default,
                    weight: response.data.weight,
                    height: response.data.height,
                    types: response.data.types.map((t) => t.type.name),
                    stats: response.data.stats.map((s) => ({
                        name: s.stat.name,
                        base_stat: s.base_stat,
                    })),
                });
            } catch (error) {
                console.error("Failed to fetch Pokémon data", error);
            }
        };
        fetchData();
    }, [id]);

    if (!pokemon) return <div className="loading">Loading...</div>;

    const mainType = pokemon.types[0];
    const bgGradient = getAnimatedGradient(mainType);

    return (
        <div id="main-card">
            <div id="previous-poke" >
                <button
                    className="nav-btn"
                    onClick={() => navigate(`/pokemon/${Number(id) - 1}`)}
                    disabled={id <= 1}
                    style={{padding:"1rem 1.5rem"}}
                >
                    &lt;
                </button>
            </div>
            <div
                className="pokemon-card"
                style={{
                    background: bgGradient,
                    backgroundSize: "400% 400%",
                    animation: "gradientShift 6s ease infinite",
                }}
            >
                <h1 className="pokemon-name">{pokemon.name}</h1>
                <div className="pokemon-container">
                    <div className="pokemon-container-left">
                        <div className="image-container">
                            <img
                                src={pokemon.image}
                                alt={pokemon.name}
                                id="pokemon-image"
                            />
                        </div>

                        <div className="stats-row">
                            <span>Height: {pokemon.height}</span>
                            <span>Weight: {pokemon.weight}</span>
                        </div>

                        <div className="types">
                            {pokemon.types.map((t) => (
                                <span key={t} className="type-badge">
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="pokemon-container-right">
                        <div className="stats">
                            {pokemon.stats.map((s) => (
                                <div key={s.name} className="stat-item">
                                    <div className="stat-label">
                                        <span className="capitalize">{s.name}</span>
                                        <span>{s.base_stat}</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{
                                                width: `${(s.base_stat / 255) * 100}%`,
                                                backgroundColor: getStatColor(s.name),
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div id="next-poke">
                <button
                    className="nav-btn"
                    onClick={() => navigate(`/pokemon/${Number(id) + 1}`)}
                    style={{padding:"1rem 1.5rem"}}
                >
                    &gt;
                </button>
            </div>
        </div>
    );
}

// Animated gradient per Pokémon type
const getAnimatedGradient = (type) => {
    const gradients = {
        grass: "linear-gradient(-45deg, #a8e6cf, #56ab2f, #a3e635, #65a30d)",
        fire: "linear-gradient(-45deg, #ff7e5f, #f97316, #fb923c, #ef4444)",
        water: "linear-gradient(-45deg, #89f7fe, #3b82f6, #2563eb, #60a5fa)",
        electric: "linear-gradient(-45deg, #f6d365, #facc15, #fde68a, #fbbf24)",
        psychic: "linear-gradient(-45deg, #ec4899, #f472b6, #db2777, #f9a8d4)",
        ice: "linear-gradient(-45deg, #99f6e4, #06b6d4, #67e8f9, #0ea5e9)",
        bug: "linear-gradient(-45deg, #84cc16, #a3e635, #65a30d, #4d7c0f)",
        normal: "linear-gradient(-45deg, #d4d4d4, #a3a3a3, #737373, #e5e5e5)",
        ground: "linear-gradient(-45deg, #92400e, #ca8a04, #f59e0b, #d97706)",
        poison: "linear-gradient(-45deg, #9333ea, #a855f7, #7e22ce, #c084fc)",
        fairy: "linear-gradient(-45deg, #f9a8d4, #f472b6, #ec4899, #db2777)",
        rock: "linear-gradient(-45deg, #78716c, #a8a29e, #57534e, #44403c)",
        ghost: "linear-gradient(-45deg, #6366f1, #7c3aed, #8b5cf6, #4f46e5)",
        dragon: "linear-gradient(-45deg, #0ea5e9, #3b82f6, #1d4ed8, #2563eb)",
        dark: "linear-gradient(-45deg, #1f2937, #111827, #4b5563, #374151)",
        steel: "linear-gradient(-45deg, #9ca3af, #6b7280, #d1d5db, #4b5563)",
        fighting: "linear-gradient(-45deg, #ef4444, #b91c1c, #dc2626, #7f1d1d)",
    };
    return gradients[type] || "linear-gradient(-45deg, #9ca3af, #6b7280, #d1d5db, #4b5563)";
};

// Stat bar colors
const getStatColor = (statName) => {
    switch (statName) {
        case "hp":
            return "#ef4444";
        case "attack":
            return "#f97316";
        case "defense":
            return "#facc15";
        case "special-attack":
            return "#3b82f6";
        case "special-defense":
            return "#10b981";
        case "speed":
            return "#a855f7";
        default:
            return "#9ca3af";
    }
};
