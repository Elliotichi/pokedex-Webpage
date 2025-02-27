//some generative AI assistance was used for figuring out coding
//but none was copied directly from the AI
//reference: https://chat.openai.com
//reference: https://pokeapi.co


//is used to tell the website what the currently displayed pokemon is, needed for switching between the tabs of data.
var currPokemon = null;

//this function will retrieve the id from the pokemon clicked on the pokebrowser 
//and will display it on the poke search
function getPokemonLastPage() {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);


    const ID = urlParams.get('id');


    if (ID !== null) {
        getPokemon(ID);
    }
}

//this function is used to retrieve a single pokemon from the API
function getPokemon(ID) {

    const inputElement = $('#pokemonInput');
    //converts the value inputted into all lowercase as the api call uses lowercase
    if (ID == null) {
        pokemonToFetch = inputElement.val().toLowerCase();
    }
    else {
        pokemonToFetch = ID
    }

    //calls the api and uses the variable to get the specific searched pokemon from the api
    $.ajax({
        url: `https://pokeapi.co/api/v2/pokemon/${pokemonToFetch}`,
        method: 'GET',
        success: function (data) {
            displayPokemon(data);
            showMoves(data)
            currPokemon = data


        },
        error: function (error) {
            console.error('Error fetching Pokémon data:', error);
            alert('Error fetching Pokémon data. Please check the name or ID and try again.');
        }
    });
}

//this will create a heading used to indicate when the API is fetching data
function showLoading() {
    loadingHeading = $('<h1>').addClass('loading').text('Retrieving Data...be patient!');
    $('#pokemon-data').append(loadingHeading);
}

//gets rid of loading indicator 
function hideLoading() {
    if (loadingHeading) {
        loadingHeading.remove();
    }
}

//fetches data of the locations
function getPokemonLocation(locationId) {
    const locationUrl = `https://pokeapi.co/api/v2/location/${locationId}/`;
    return fetch(locationUrl).then(response => response.json());
}


$(document).ready(function () {
    const ID = null;
    $('#getPokemonButton').click(function () {
        getPokemon(ID);
    });
    //gets a random pokemon to display there are currently 1017 pokemon so it can display pokemons 1-1017
    $('#getRandomPokemon').click(function () {
        const randID = Math.floor(Math.random() * 1017) + 1;
        getPokemon(randID);
    });
    //used for switching between tabs of data
    $('#locationsButton').click(function () {
        showLocations(currPokemon);
    });
    $('#movesButton').click(function () {
        showMoves(currPokemon);
    });
    getPokemonLastPage();
});

//will display the fetched pokemon and its respective data from the api into the div element
function displayPokemon(pokemon) {

    const pokemonInfoContainer = $('#pokemon-info');
    pokemonInfoContainer.empty();

    const pokeName = $('<h1>').text(pokemon.name);

    const pokeImage = $('<img>').attr('src', pokemon.sprites.front_default).attr('alt', pokemon.name);

    //iterrates through each type the in the selected pokemons data and adds them in a paragraph
    const pokeTypes = $('<p>').text(`Types: ${pokemon.types.map(type => type.type.name).join(', ')} Abilities: ${pokemon.abilities.map(ability => ability.ability.name).join(', ')}`);

    //the same as pokeTypes but for the pokemons abilities
    // const pokeAbilities = $('<p>').text(`Abilities: ${pokemon.abilities.map(ability => ability.ability.name).join(', ')}`);

    const pokeStatsTable = $('<table>');

    //statnames were hard coded, you can fetch them from the api but shortening them worked better for responiveness purposes
    const headerRow = $('<tr>');
    headerRow.append($('<th>').text('hp'));
    headerRow.append($('<th>').text('atk'));
    headerRow.append($('<th>').text('def'));
    headerRow.append($('<th>').text('sp.def'));
    headerRow.append($('<th>').text('sp.atk'));
    headerRow.append($('<th>').text('spe'));
    pokeStatsTable.append(headerRow);

    //will itterate through the API's pokemon stat Array and add it to a <td> element to populate each pokemons stat table
    const statRow = $('<tr>');
    pokemon.stats.forEach(stat => {
        statRow.append($('<td>').text(stat.base_stat));
    });
    pokeStatsTable.append(statRow);


    pokemonInfoContainer.append(pokeName, pokeImage, pokeTypes, pokeStatsTable);

}

//will show the moves associated with the selected pokemon
function showMoves(pokemon) {


    const pokemonDataContainer = $('#pokemon-data');
    pokemonDataContainer.empty();
    //calls the loading header so that the user will know it is retrieving the data 
    showLoading();

    //will fetch pokemon move data from the api json
    const movePromises = pokemon.moves.map(move => fetch(move.move.url).then(response => response.json()));

    //will wait until all move data has been retrieved to make sure everything displays in the correct order
    Promise.all(movePromises)
        .then(moves => {
            const movesTable = $('<table>');

            //names for each corrosponding data type
            const headerRow = $('<tr>').append(
                $('<th>').text('Move Name'),
                $('<th>').text('Move Type'),
                $('<th>').text('Power'),
                $('<th>').text('Accuracy')
            );
            movesTable.append(headerRow);

            //will add a row into the table for each move entry.
            moves.forEach(move => {
                const moveRow = $('<tr>').append(
                    $('<td>').text(move.name),
                    $('<td>').text(move.type.name),
                    $('<td>').text(move.power || 'N/A'),
                    $('<td>').text(move.accuracy || 'N/A')
                );
                movesTable.append(moveRow);
            });

            pokemonDataContainer.append(movesTable);
            //hides loading when the moves have all been retrieved
            hideLoading();
        })
        .catch(error => console.error('Error fetching move details:', error));


}

//displays the location data from the api of the current pokemon into the data table
function showLocations(pokemon) {
    const pokemonDataContainer = $('#pokemon-data');
    pokemonDataContainer.empty();
    showLoading();

    //gets the location data from the api of the currently displayed
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}/encounters`)
        .then(response => response.json())
        .then(locations => {


            const locationsTable = $('<table>');

            //names for each data item
            const headerRow = $('<tr>').append(
                $('<th>').text('Location Name'),
                $('<th>').text('Encounter Rate'),
                $('<th>').text('Max Level'),
                $('<th>').text('Method'),
                $('<th>').text('game'),

            );
            locationsTable.append(headerRow);

            //location data from the api is packaged in an array if a pokemon has no location data it returns an empty array 
            if (locations.length !== 0) {

                //if there is data inside the array it will itterate through that array and display it
                locations.forEach(location => {

                    const locationRow = $('<tr>').append(
                        $('<td>').text(location.location_area.name),
                        $('<td>').text(location.version_details[0].encounter_details[0].chance + '%'),
                        $('<td>').text('lv' + location.version_details[0].encounter_details[0].max_level),
                        $('<td>').text(location.version_details[0].encounter_details[0].method.name),
                        $('<td>').text(location.version_details[0].version.name)

                    );

                    locationsTable.append(locationRow);
                });
            }

            //if the array is empty it means the pokemon cannot be found in the games anywhere 
            //so it must be obtained via different methods
            //to indicate this it will default to display this if the array is empty:
            else {

                const locationRow = $('<tr>').append(
                    $('<td>').text('this pokemon cannot be caught in the wild'),
                    $('<td>').text('n/a'),
                    $('<td>').text('n/a'),
                    $('<td>').text('n/a'),
                    $('<td>').text('n/a')
                );

                locationsTable.append(locationRow);

            }

            pokemonDataContainer.append(locationsTable);
            hideLoading();
        })
        .catch(error => console.error('Error fetching Pokemon locations:', error));
}