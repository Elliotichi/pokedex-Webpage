var darkToggle;

$(document).ready(function () {
    getDarkmode()
    $('#darkmodeToggle').click(function(){
        console.log('button clicked')
        postDarkmode()
    })
})

// updates the darkmode preference property by storing it in the database
function postDarkmode(){
    switch(darkToggle){
        case true:
            darkToggle = false
            break;

        default :
            darkToggle = true
            break;
    } 
    console.log("darkmode :",darkToggle)
    darkmode(darkToggle)

    $.ajax({
        type: 'POST',
        url: '/postDark',
        data: JSON.stringify({'darkToggle':darkToggle}),
        contentType: 'application/json',
        success: function (response) {
            console('dark successfully toggled');
        },
        error: function (xhr, status, error) {
            console.error('Error:', error);
        }
    })
}

// retrieves user data and uses the darkmode property to toggle the darkmode
function getDarkmode(){
    try{
    $.ajax({
        type: 'GET',
        url: '/getData',
        success: function (response) {
            console.log('dark retrieved');
            darkToggle = response.darkmode
            darkmode(response.darkmode)
        },
        error: function (xhr, status, error) {
            console.error('Error:', error);
        }
    });
    }
    catch{
        console.warn("need login for dark mode")
    }
}

// toggles darkmode
function darkmode(dark) {
    switch (dark) {
        case true:
            $('#indexstyle').attr('href', 'css/indexDarkMode.css')
            $('#inventorystyle').attr('href', 'css/InventoryStyleDark.css')
            $('#pokesearchstyle').attr('href', 'css/PokeSearchStyleDark.css')
            $('#userStyle').attr('href', 'css/userDark.css')
            break;

        default:
            $('#indexstyle').attr('href', 'css/IndexStyle.css')
            $('#inventorystyle').attr('href', 'css/InventoryStyle.css')
            $('#pokesearchstyle').attr('href', 'css/PokeSearchStyle.css')
            $('#userStyle').attr('href', 'css/users.css')
            break;

    }
}
