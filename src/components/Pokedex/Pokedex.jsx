import PokemonList from "../PokemonList/PokemonList";
import Search from "../Search/Search";
import { useNavigate } from "react-router-dom";
//CSS
import "./Pokedex.css";
function Pokedex(){
    const navigate = useNavigate();

    const handleSelectPokemon = (id) => {
        navigate(`/pokemon/${id}`);
    };
    return (
        <div className="pokedex-wrapper">
            <Search onSelect={handleSelectPokemon} />
            <PokemonList />
        </div>
    )

}

export default Pokedex;