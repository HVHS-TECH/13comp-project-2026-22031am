
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
let secretNumber = Math.floor(Math.random() * 100) + 1;

console.log("Secret number is: " + secretNumber);

set(ref(database, "GTN/room1, secretNumber");
    
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

        console.log("Correct! Player guessed the secret number!");

    } else if (guess < secretNumber) {

        resultBox.innerHTML = "Too low! Please try again";

        console.log("Too low! Please try again");

    } else {

        resultBox.innerHTML = "Too high! Please try again";
        console.log("Too high! Please try again");

        resultBox.innerHTML = "Player 1 turn";

    }
}





/*******************************************************/
window.checkGuess = checkGuess; // Making the function accessible globally so it can be called from the HTML button
/*******************************************************/

