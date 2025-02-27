//some generative AI assistance was used for figuring out coding

// Define the Konami Code sequence
var konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

// Current position within the Konami Code sequence
var konamiCodePosition = 0;

// New image source URL
var logoNewImageSrc = 'images/PhantomThief.png';
var titleNewImageSrc = 'images/MegamiDex.png';

// Register keydown event listener
$(document).keydown(function(event) {
    // Check if the pressed key matches the next key in the Konami Code sequence
    if (event.key === konamiCode[konamiCodePosition]) {
        konamiCodePosition++;
        
        // If the full Konami Code sequence is entered
        if (konamiCodePosition === konamiCode.length) {
            // Reset Konami Code position for subsequent entries
            konamiCodePosition = 0;
            
            // Change the src attribute of the image
            $('#siteLogo').attr('src', logoNewImageSrc);
            $('#siteTitle').attr('src',titleNewImageSrc);
        }
    } else {
        // If the pressed key does not match the next key in the Konami Code sequence, reset the sequence
        konamiCodePosition = 0;
    }
});