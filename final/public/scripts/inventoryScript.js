// used for pulling and pushing data to and from mongoDB
var teamList = [];

// hard limit for team sizes
var arrayMaxlength = 6;

// when the page laods get teams from the database
$(document).ready(function () {
    getTeams()

    $("#createTeam").click(function () {
        addNewTeam()
    });

    $('#saveTeams').click(function () {
        postTeams()
    })
})

// fetches pokemon data from the api
function getPokemon(ID, array, pokemonContainer, pokemonSection, teamContainer) {

    const inputElement = $('#pokemonInput');
    // converts the value inputted into all lowercase as the api call uses lowercase
    if (ID == null) {
        pokemonToFetch = inputElement.val().toLowerCase();
    }
    else {
        pokemonToFetch = ID;
    }

    // calls the api and uses the variable to get the specific searched pokemon from the api
    $.ajax({
        url: `https://pokeapi.co/api/v2/pokemon/${pokemonToFetch}`,
        method: 'GET',
        success: function (data) {
            addPokemon(data, array, pokemonContainer, pokemonSection, teamContainer);
        },
        error: function (error) {
            console.error('Error fetching Pokémon data:', error);
            alert('Error fetching Pokémon data. there may have been a network problem. try again later');
        }
    });
};

// posts teams from the teams array to the database
function postTeams() {

    $.ajax({
        type: 'POST',
        url: '/postTeams',
        data: JSON.stringify(teamList),
        contentType: 'application/json',
        success: function (response) {
            alert('successfully saved');
        },
        error: function (xhr, status, error) {
            console.error('Error:', error);
        }
    })

};

// retrieves the teams from the database
function getTeams() {
    $.ajax({
        type: 'GET',
        url: '/getData',
        success: function (response) {
            console.log('teams retrieved');
            populateTeams(response.teams)
        },
        error: function (xhr, status, error) {
            console.error('Error:', error);
        }
    });
};


// populates the teams array with the database contents
function populateTeams(response) {
    console.table(response)
    for (i = 0; i < response.length; i++) {
        teamList.push(response[i])
    }
    displayTeams()
}

// adds pokemon to the array
// will be updated later to populate a table
function addPokemon(pokemon, array, pokemonContainer, pokemonSection, teamContainer) {
    let pokemonAdded = { 'name': pokemon.name, 'image': pokemon.sprites.front_default }

    // if the array length is 5 or less it will add a new index
    if (array.length <= 5) {
        array.push(pokemonAdded)
        showPokemonCards(array, pokemonContainer, pokemonSection, teamContainer)
    }

    // if the array length is 6 then it will instead try and find an empty index to store the poke data
    else {
        alert("Team Full, delete a pokemon and try again")
    }

};

// creates a pokemon card for each onject in the array
function showPokemonCards(array, pokemonContainer, pokemonSection, teamContainer) {
    pokemonContainer.empty()
    for (var i = 0; i < array.length; i++) {
        const pokeWrapper = $("<div class='pokemonWrapper'></div>")
        const delButtonWrapper = $("<div class='delButtonWrapper'></div>")
        const pokeName = $('<h3>').text(array[i].name);
        const pokeImage = $('<img>').attr('src', array[i].image).attr('alt', array[i].name);
        const delButton = $($("<button>X</button>"))
        delButton.data = i
         
        // deletes the corrosponding pokemon from the array, and removes its card
        delButton.click({ i: i }, function (event) {
            array.splice(event.data.i, 1)
            pokeWrapper.remove()
            showPokemonCards(array, pokemonContainer, pokemonSection, teamContainer)
        })

        delButtonWrapper.append(delButton)
        pokeWrapper.append(pokeName, pokeImage, delButtonWrapper,);
        pokemonContainer.append(pokeWrapper);

    }
    pokemonSection.append(pokemonContainer);
    teamContainer.append(pokemonSection);
}

//makes a team box for the array given
function makeComponents(array) {
    let teamContainer = $("<div class='teamContainer'></div>");
    let pokeInput = $("<input type='text' placeholder='search pokemon...'>");
    let addBtn = $("<button>add pokemon</button>");
    let displayBtn = $("<button>Show pokemon</button>")
    let buttonContainer = $("<div class='buttonContainer'></div>");
    let pokemonContainer = $("<div></div>");
    let pokemonSection = $("<div id='pokemonsection'></div>");
    let teamCard = $("<div class='teamCard'></div>")
    let showing = false

    // adds a new pokemon to the team 
    addBtn.click(function () {
        if(showing == false){
            showing = true
            displayBtn.html("hide pokemon")
        }
        pokemonToAdd = pokeInput.val();
        getPokemon(pokemonToAdd, array, pokemonContainer, pokemonSection, teamContainer);
    })

    // toggles visbility of teams
    displayBtn.click(function () {
        if (showing == false) {
            showing = true
            displayBtn.html("Hide Pokemon")
            pokemonContainer.empty()
            showPokemonCards(array, pokemonContainer, pokemonSection, teamContainer)
        }

        else {
            showing = false
            displayBtn.html("show pokemon")
            pokemonContainer.empty()
        }
    })

    buttonContainer.append(pokeInput);
    buttonContainer.append(addBtn);
    buttonContainer.append(displayBtn);
    teamCard.append(buttonContainer);
    teamCard.append(teamContainer);


    $("#teamSection").append(teamCard);
}

// makes a new array and pushes it to the teamlist array
function addNewTeam() {
    var newTeam = [];
    makeComponents(newTeam)
    teamList.push(newTeam)

}


//itterates through the teams array and makes components for each team
function displayTeams() {
    console.log("displaying teams")
    console.table(teamList)
    for (var i = 0; i < teamList.length; i++) {
        makeComponents(teamList[i])
    }
}

