/**************************************************************/
// fb_io.mjs
// Generalised firebase routines
// Written by Aditi Modi, Term 1 2026?
//
// All variables & function begin with fb_  all const with FB_
// Diagnostic code lines have a comment appended to them //DIAG
/**************************************************************/

const COL_C = 'white';	    // These two const are part of the coloured 	
const COL_B = '#CD7F32';	//  console.log for functions scheme
console.log('%c fb_io.mjs',
    'color: blue; background-color: white;');

var FB_GAMEDB;
var FB_GAMEAUTH;

let userDetails = {
    displayName: 'n/a',
    email: 'n/a',
    photoURL: 'n/a',
    uid: 'n/a'
}; 
//stores details of the currently authenticated user

/**************************************************************/
// Import all external constants & functions required
/**************************************************************/

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
    getDatabase,
    ref,
    set,
    get,
    onValue
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

/**************************************************************/
// EXPORT FUNCTIONS
/**************************************************************/
export {
    fb_initialise,
    fb_authenticate,
    fb_writerecord,
    fb_writeScore,
    fb_writeLobby,
    fb_readLobbies,
    userDetails,
    FB_GAMEDB
};

/******************************************************/
// fb_initialise()
/******************************************************/
function fb_initialise() {
    console.log('%c fb_initialise(): ',
                 'color: ' + COL_C + '; background-color: ' + COL_B + ';');
                 
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

    const FB_GAMEAPP = initializeApp(FB_GAMECONFIG);
    // creates connections to firebase database and authentication services
    FB_GAMEDB = getDatabase(FB_GAMEAPP);
    FB_GAMEAUTH = getAuth(FB_GAMEAPP);
    
    console.info(FB_GAMEDB);      	//DIAG
}

/******************************************************/
// fb_authenticate()
/******************************************************/
function fb_authenticate() {
    console.log('%c fb_authenticate(): ', 
       'color: ' + COL_C + '; background-color: ' + COL_B + ';');
      
    const AUTH = getAuth();
    const PROVIDER = new GoogleAuthProvider();

    PROVIDER.setCustomParameters({
        prompt: 'select_account'
    });

    signInWithPopup(AUTH, PROVIDER)
    .then((result) => {

        console.log('%c fb_authenticate():successful! ', 
            'color: ' + COL_C + '; background-color: ' + COL_B + ';');

        userDetails.displayName = result.user.displayName;
        userDetails.email = result.user.email;
        userDetails.photoURL = result.user.photoURL;
        userDetails.uid = result.user.uid;

        // Store user details in sessionStorage so they can be accessed on other pages
        sessionStorage.setItem('uid', userDetails.uid); 
        sessionStorage.setItem('displayName', userDetails.displayName);
        sessionStorage.setItem('photoURL', userDetails.photoURL);

        // Create a reference to this user's profile record in Firebase
        const dbReference = ref(FB_GAMEDB, 'userDetails/' + userDetails.uid);
        get(dbReference).then((snapshot) => {
            if (snapshot.val() != null) { //If a profile already exists, skip registration
                window.location.href = "html/select_game.html"; //existing user -> go straight to game selection 
            } else {
                window.location.href = "html/reg.html"; // New user -> complete registration first
            }
        });

    })
    .catch((error) => console.error(error));
}

/******************************************************/
// fb_writerecord()
/******************************************************/
function fb_writerecord(userDetails) {
    console.log('%c fb_writerecord(): ', 'color: ' + COL_C + '; background-color: ' + COL_B + ';');

    const dbReference = ref(FB_GAMEDB, 'userDetails/' + userDetails.uid);
    set(dbReference, userDetails)
    .then(() => {
        console.log('%c fb_writerecord(): successful! ', 'color: ' + COL_C + '; background-color: ' + COL_B + ';');
        window.location.href = "select_game.html";
  })
    .catch((error) => {
        console.error(error);
    });
}

/******************************************************/
// fb_writeScore()
// SAVE GAME SCORE TO FIREBASE
/******************************************************/
function fb_writeScore(scoreRecord) {
    console.log('%c fb_writeScore(): ',
        'color: white; background-color: #CD7F32;');

    const dbReference = ref(FB_GAMEDB, 'scores/fc/' + scoreRecord.uid); 
    // Use and save the player's UID as a unique firebase key so each user has only one record

    set(dbReference, scoreRecord)
        .then(() => {
            console.log("Score saved successfully!");
        })
        .catch((error) => {
            console.error("Error saving score:", error);
        });
}



/******************************************************/
// fb_writeLobby()
// SAVE LOBBY TO FIREBASE
/******************************************************/

function fb_writeLobby(lobbyRecord) {

    console.log('%c fb_writeLobby(): ',
        'color: white; background-color: #CD7F32;');

    // USING THE LOBBY NAME AS THE UNQIUE KEY FOR THIS LOBBY RECORD
    const lobbyUID =
        lobbyRecord.lobbyName; 

    // firebase path
    const dbReference =
        ref(
            FB_GAMEDB,
            'GTN/Lobbies/' + lobbyUID   //create a reference to this specific lobby record in Firebase
        );

    console.log(
        'GTN/Lobbies/' + lobbyUID
    );

    // WRITING DATA
    set(dbReference, lobbyRecord)
        .then(() => {

            console.log("Lobby saved successfully!");

        })
        .catch((error) => {

            console.error("Error saving lobby:", error);

        });
}

/******************************************************/
// fb_readLobbies()
// READ LOBBIES FROM FIREBASE
/******************************************************/

function fb_readLobbies(callback) {

    console.log('%c fb_readLobbies(): ',
        'color: white; background-color: #CD7F32;');

    //firebase path
    const dbReference =
        ref(FB_GAMEDB, 'GTN/Lobbies');

    // Listen for changes to the lobby data and automatically update the web page
    onValue(dbReference, (snapshot) => {

        const data =
            snapshot.val();

        console.log(data);

        //send firebase data back - pass the latest lobby data back to the calling program
        callback(data || {});
    });

}


