//Generative AI was used to assist in the making of this code, i.e to descibe functions, and how they would work, what API functions to use. 
//No AI code was copied in the making of this script.
//https://chat.openai.com was used to describe functions from the API
//https://pokeapi.co/docs/v2 was used for support in coding the script


//list of arrays one for all and then another 10 one for each region in the games
//will be used for filtering and such so less api calls are made
let allPokemonList = [];
let kantoPokemonList = [];
let johtoPokemonList = [];
let hoenPokemonList = [];
let sinnohPokemonList = [];
let unovaPokemonList = [];
let kalosPokemonList = [];
let alolaPokemonList = [];
let galarPokemonList = [];
let hisuiPokemonList = [];
let paldeaPokemonList = [];

var loadingParagraph;


$(document).ready(function () {
    // display all pokemon when the page loads
    filterPokemon(0, allPokemonList)

    //filter buttons used to filter generations of pokemon
    $("#kantoBtn").click(function () {
        filterPokemon(1, kantoPokemonList)
    });

    $("#johtoBtn").click(function () {
        filterPokemon(2, johtoPokemonList)
    });

    $("#hoenBtn").click(function () {
        filterPokemon(3, hoenPokemonList)
    });

    $("#sinnohBtn").click(function () {
        filterPokemon(4, sinnohPokemonList)
    });

    $("#unovaBtn").click(function () {
        filterPokemon(5, unovaPokemonList)
    })

    $("#kalosBtn").click(function () {
        filterPokemon(6, kalosPokemonList)
    });

    $("#alolaBtn").click(function () {
        filterPokemon(7, alolaPokemonList)
    })

    $("#galarBtn").click(function () {
        filterPokemon(8, galarPokemonList)
    })

    $("#hisuiBtn").click(function () {
        filterPokemon(9, hisuiPokemonList)
    })

    $("#paldeaBtn").click(function () {
        filterPokemon(10, paldeaPokemonList)
    });

    $("#allBtn").click(function () {
        filterPokemon(0, allPokemonList)
    })

    //search bar
    $("#pokemonInput").keyup(function () {
        searchPokemon()
    })

    $('#darkmodetest').click(function () {

    })

});

function changemode(){
    
}


//Loading text function
function showLoading() {
    if ($('#loadingZone').find('#loading').length === 0) {
        loadingParagraph = $('<h1>').attr('id', 'loading').text('Catching Pokémon...');
        $('#loadingZone').append(loadingParagraph);
    }

    //very crucial important function to the program, DO NOT REMOVE!!
    loadingParagraph.hover(function () {
        $(this).text("You have been sans'd boy");
    }, function () {
        $(this).text('Catching Pokémon...');
    });

}

function hideLoading() {

    loadingParagraph.remove()

}

// uses a switch statement to decide which url to pass into the fetchpokemon function
function filterPokemon(gen, array) {
    let range
    let offset

    // checks too see if the array passed in is already populated if it is run a switch statement 
    if (array.length == 0) {
        $('#pokemon-list').empty()
        console.log("calling api....")

        //decides which value offset and range will have
        switch (gen) {
            case 0:
                offset = 1
                range = 1017
                break;

            case 1:
                offset = 1
                range = 151
                break;

            case 2:
                offset = 151 + 1
                range = 251
                break;

            case 3:
                offset = 251 + 1
                range = 386
                break;

            case 4:
                offset = 386 + 1
                range =  493
                break;

            case 5:
                offset = 493 + 1
                range = 649
                break;

            case 6:
                offset = 649 + 1
                range = 721
                break;

            case 7:
                offset = 721 + 1
                range = 809
                break;

            case 8:
                offset = 809 + 1
                range = 898
                break;

            case 9:
                offset = 898 + 1
                range = 905
                break;

            case 10:
                offset = 905 + 1
                range = 1017
                break;

            default:
                console.error("how the heck did you do this?")
                break;

        }

        fetchPokemon(offset, range, array)

    }

    // else just display the array
    else {
        displayPokemon(array)
    }
}

// fetches pokemon using a forloop and populates them into an array,  uses an offset and range value to decide which pokemon to render
function fetchPokemon(offset, range, array) {
    showLoading()
    var requests = [];
    if(array)
    for (let i = offset; i <= range; i++) {
        requests.push($.ajax({
            url: `https://pokeapi.co/api/v2/pokemon/${i}`,
            method: 'get'
        }));
    }

    // waits for all ajax requests to finish before displaying pokemon
    $.when.apply($, requests).then(function() {
        for (let i = 0; i < arguments.length; i++) {
            array[i] = arguments[i][0];
        }
        displayPokemon(array);

    }, function(error) {
        console.error('Error fetching Pokémon list:', error);
        alert('Error fetching Pokémon list. Please try again.');
        hideLoading();
    });
}

//makes a card for each pokemon in the array
function displayPokemon(array) {
    $('#pokemon-list').empty()
    hideLoading()
    console.table(array)
    console.log( "im being called")
    for (let i = 0; i < array.length; i++) {
        const pokemonListContainer = $('#pokemon-list');
        const pokemonCardFrame = $('<div>').addClass('cardFrame');
        pokemonListContainer.append(pokemonCardFrame);
        //PokemonCard allows the user to click the card and it will take them to the appropriate Pokesearch page by storing the pokemons ID in the url
        const pokemonCard = $('<a>').addClass('pokemon-card').attr('href', `/pokesearch?id=${array[i].id}`);
        const pokemonName = $('<h2>').text(`#${array[i].id} ${array[i].name}`);
        const pokemonImage = $('<img>').addClass('pokemon-image').attr('src', array[i].sprites.front_default).attr('alt', array[i].name);
        const types = $('<p>').text(`Types: ${array[i].types.map(type => type.type.name).join(', ')}`);
        const pokeStatsTable = $('<table>');
        const headerRow = $('<tr>');
        //this will create the hp, atk, def, etc table
        headerRow.append($('<th>').text('hp'));
        headerRow.append($('<th>').text('atk'));
        headerRow.append($('<th>').text('def'));
        headerRow.append($('<th>').text('sp.atk'));
        headerRow.append($('<th>').text('sp.def'));
        headerRow.append($('<th>').text('spe'));
        pokeStatsTable.append(headerRow);
        const statRow = $('<tr>');
        //adds each stat for the pokemon in the table
        array[i].stats.forEach(stat => {
            statRow.append($('<td>').text(stat.base_stat));
        });
        pokeStatsTable.append(statRow);
        pokemonCardFrame.append(pokemonCard);
        pokemonCard.append(pokemonName, pokemonImage, types, pokeStatsTable);
    }
}

//This will allow the user to search for a pokemon by taking the input from the searchbar and using it as a filter
function searchPokemon() {
    const inputElement = $('#pokemonInput');
    const searchTerm = inputElement.val().toLowerCase();

    const filteredPokemon = allPokemonList.filter(pokemon => {
        const pokemonName = pokemon.name.toLowerCase();
        return pokemonName.startsWith(searchTerm);
    });
    console.log(filteredPokemon)
    $('pokemon-list').empty()
    displayPokemon(filteredPokemon);

};