/*******************************************************/
// gtn_game.mjs
// Guess the number page
// Main entry for GTN_game.html
// A simple 2-player game where you play guess the number with another buddy
// written by Aditi Modi term 1 & 2 2026
/*******************************************************/


/*******************************************************/
// IMPORTS
/*******************************************************/
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getDatabase,
    ref,
    set,
    onValue,
    get
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

/*******************************************************/
// FIREBASE CONFIG
/*******************************************************/
const FB_GAMECONFIG = {
    apiKey: "AIzaSyDWhGSciprdeHTyBrXQYt_F-6tMMjCg-YM",
    authDomain: "comp-2026-aditi-modi.firebaseapp.com",
    databaseURL: "https://comp-2026-aditi-modi-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "comp-2026-aditi-modi",
    storageBucket: "comp-2026-aditi-modi.firebasestorage.app",
    messagingSenderId: "153559444524",
    appId: "1:153559444524:web:7144aeb2795255e4e1b589",
    measurementId: "G-0KELMX0418"
};

/*******************************************************/
// INITIALIZE FIREBASE
/*******************************************************/
const app = initializeApp(FB_GAMECONFIG);

const database = getDatabase(app);

/*******************************************************/
// VARIABLES
/*******************************************************/
const params = new URLSearchParams(window.location.search);

const roomName = params.get("room");

let secretNumber;
let currentTurn;
let hostName;
let guestName;

const myName = sessionStorage.getItem("displayName");

/*******************************************************/
// SECRET NUMBER FIREBASE REFERENCE AND RANDOM GENERATOR
/*******************************************************/
const secretNumberRef = ref(
    database,
    `GTN/Lobbies/${roomName}/gameData/secretNumber`
);

const guessesRef = ref(
    database,
    `GTN/Lobbies/${roomName}/gameData/guesses`
);

const currentTurnRef = ref(
    database,
    `GTN/Lobbies/${roomName}/gameData/currentTurn`
);


/*******************************************************/
// CREATE SECRET NUMBER IF IT DOESN'T EXIST
/*******************************************************/
get(secretNumberRef).then((snapshot) => {

    // IF NO SECRET NUMBER EXISTS YET
    if (!snapshot.exists()) {

        // Generating random number between 1-100
        let randomNumber = Math.floor(Math.random() * 100) + 1;

        console.log("Generated secret number: " + randomNumber);

        // SAVE TO THE FIREBASE
        set(secretNumberRef, randomNumber);

    } else {

        console.log("Secret number already exists!");

    }

});


/*******************************************************/
// CREATING FIRST TURN
/*******************************************************/
get(currentTurnRef).then((snapshot) => {

    //if no turns exist yet 
    if (!snapshot.exists()) {

        //HOST STARTS FIRST
       set(
        currentTurnRef,
        sessionStorage.getItem("displayName")
       );
    }
});



/*******************************************************/
// READ SHARED SECRET NUMBER FROM THE FIREBASE
/*******************************************************/
onValue(secretNumberRef, (snapshot) => {

    secretNumber = snapshot.val();

    console.log("Shared secret number is: " + secretNumber);

});

/*******************************************************/
// READ CURRENT TURN FROM FIREBASE
/*******************************************************/
onValue(currentTurnRef, (snapshot) => {
    currentTurn = snapshot.val();

    console.log("Current turn is: " + currentTurn);

    document.getElementById("turn-box").innerHTML = currentTurn + "'s turn!";

});

/*******************************************************/
// PLAYER NAMES
/*******************************************************/
    const lobbyRef = 
    ref(database, `GTN/Lobbies/${roomName}`);

    onValue(lobbyRef, (snapshot) => {

        const lobby = snapshot.val();

        if(!lobby) return;

        hostName = lobby.userName;
        guestName = lobby.guestName; 

        document.getElementById("host-name").innerHTML = 
        lobby.userName;

        if(lobby.guestName) {

            document.getElementById("guest-name").innerHTML = 
            lobby.guestName;

        } else {

            document.getElementById("guest-name").innerHTML = 
            "Waiting for guest to join...";
        }
    });

/*******************************************************/
// CHECK THE GUESS FUNCTION
/*******************************************************/
function checkGuess() {

    /*******************************************************/
    // GET HTML ELEMENTS
    /*******************************************************/
    const guessInput = document.getElementById("guess-input");

    const resultBox = document.getElementById("result-box");

     /*******************************************************/
    // CHECK TURN
    /*******************************************************/
    if(currentTurn !== myName) {

        resultBox.innerHTML = "It's not your turn! Please wait for your buddy to take their turn.";

            return;
    }

    /*******************************************************/
    // CHECK IF GAME LOADING
    /*******************************************************/
    if(secretNumber == null) {

        resultBox.innerHTML = "Game still loading...";

        return;
    }

    /*******************************************************/
    // GET PLAYER GUESS
    /*******************************************************/
    let guess = Number(guessInput.value);

    const guessID = Date.now();

    /*******************************************************/
    // SAVE GUESS TO FIREBASE
    /*******************************************************/

    set(ref(database,  `GTN/Lobbies/${roomName}/gameData/guesses/${guessID}`
    ),
    {
        player: currentTurn,
        number: guess
    }
);

    console.log("Player guessed: " + guess);

    /*******************************************************/
    // CHECK GUESS
    /*******************************************************/

    if (guess === secretNumber) {
        resultBox.innerHTML = "Correct! You guessed the number! Congratulations!";
    
    } else if (guess < secretNumber) {
        resultBox.innerHTML = "Too low! Please try again";

    } else {
        resultBox.innerHTML = "Too high! Please try again";
    }

    /*******************************************************/
    // SWITCH TURNS
    /*******************************************************/
    let nextTurn;

    if(currentTurn === hostName) { 
        nextTurn = guestName; 

    } else {

        nextTurn = hostName; 
    
    }
    set(currentTurnRef, nextTurn);

    }

   
/*******************************************************/
// MAKE FUNCTION ACCESSIBLE FROM HTML
/*******************************************************/
window.checkGuess = checkGuess;