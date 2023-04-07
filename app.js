const pokeAPIBaseUrl = "https://pokeapi.co/api/v2/pokemon/";
const game = document.getElementById('game');
let firstPokemonIndex = 1;
let numberOfPokemons = 152;
let type_of_sprite = 'default';
let intentos = 0;

const loadPokemon = async () => {
    const randomIds = new Set();
    while (randomIds.size < 8){
        const randomNumber = Math.floor(Math.random() * (numberOfPokemons - firstPokemonIndex) + firstPokemonIndex);
        randomIds.add(randomNumber);

    }
    const promises=[...randomIds].map(id => fetch(pokeAPIBaseUrl + id));
    const responses = await Promise.all(promises);
    return await Promise.all(responses.map(res => res.json()));
}

const displayPokemon = (pokemon) => {
    pokemon.sort( _ => Math.random() - 0.5);
    const pokemonHTML = pokemon.map(pokemon => {
        if (type_of_sprite == 'default'){
        return `
            <div class="card" onclick="clickCard(event)" data-pokename="${pokemon.name}">
                <div class="front"></div>
                <div class="back rotated">
                    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}"/>
                    <h2>${pokemon.name}</h2>
                </div>
            </div>`
       }
       else {
        return `
            <div class="card" onclick="clickCard(event)" data-pokename="${pokemon.name}">
                <div class="front"></div>
                <div class="back rotated">
                    <img src="${pokemon.sprites.front_shiny}" alt="${pokemon.name}"/>
                    <h2>${pokemon.name}</h2>
                </div>
            </div>`
       }
    } ).join('');
    game.innerHTML = pokemonHTML;
}

const clickCard = (e) => {
    const pokemonCard = e.currentTarget;
    const [front, back] = getFrontAndBackFromCard(pokemonCard)
    if(front.classList.contains("rotated") || isPaused) {
        return;
    }
    isPaused = true;
    rotateElements([front, back]);
    if(!firstPick){
        firstPick = pokemonCard;
        isPaused = false;
    }
    else {
        const secondPokemonName = pokemonCard.dataset.pokename;
        const firstPokemonName = firstPick.dataset.pokename;
        intentos ++;

        attempts.textContent = "Attempts: "+intentos;
        if(firstPokemonName !== secondPokemonName) {
            const [firstFront, firstBack] = getFrontAndBackFromCard(firstPick);
            setTimeout(() => {
                rotateElements([front, back, firstFront, firstBack]);
                firstPick = null;
                isPaused = false;
            }, 500)
        }
        else {
            matches++;
            firstPick = null;
            isPaused = false;
        }
    }
}

const getFrontAndBackFromCard = (card) => {
    const front = card.querySelector('.front');
    const back = card.querySelector('.back');
    return [front,back]
}
const rotateElements = (elements) => {
    if(typeof elements !== 'object' || !elements.length) return;
    elements.forEach(element => element.classList.toggle('rotated'));
}


const setGen =(min, max) => {
    firstPokemonIndex=min;
    numberOfPokemons=max;
    resetGame();
}

const setShiny =(type) => {
    type_of_sprite=type;
    resetGame();
}
const resetGame = async() => {
    game.innerHTML = '';
    intentos = 0;
    attempts.textContent = "Attempts: "+intentos;
    isPaused = true;
    firstPick = null;
    matches = 0;
    setTimeout(async () => {
        const loadedPokemon = await loadPokemon();
        displayPokemon([...loadedPokemon, ...loadedPokemon]);
        isPaused = false;
    },200)
}
resetGame();
