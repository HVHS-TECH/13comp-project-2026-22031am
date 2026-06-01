
/*******************************************************/
// gtn_game.mjs
// Guess the number page
// Main entry for GTN_game.html
// A simple 2-player game where you play guess the number with another buddy
// written by Aditi Modi term 1 & 2 2026
/*******************************************************/


/*******************************************************/
// variables()
/*******************************************************/
let secretNumber = 50;


/*******************************************************/
// CHECK THE GUESS FUNCTION
/*******************************************************/
function checkGuess() {
    

    /*******************************************************/
    // GET THE HTML ELEMENTS

    /*******************************************************/

    const guessInput = document.getElementById("guess-input");

    const resultBox = document.getElementById("result-box");

    /*******************************************************/
    // GET THE PLAYER GUESS 
    /*******************************************************/
    let guess = Number(guessInput.value);
    console.log("Player guessed: " + guess);

    /*******************************************************/
    // CHECK THE PLAYER'S GUESS
    /*******************************************************/

    if (guess === secretNumber) {

        resultBox.innerHTML = "Correct! You guessed the number! Congratulations!";

    } else if (guess < secretNumber) {

        resultBox.innerHTML = "Too low! Please try again";

    } else {

        resultBox.innerHTML = "Too high! Please try again, you can have another try";

    }
}









/*******************************************************/
window.checkGuess = checkGuess; // Making the function accessible globally so it can be called from the HTML button
/*******************************************************/

