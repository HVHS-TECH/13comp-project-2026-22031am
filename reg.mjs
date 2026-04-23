/**************************************************************/
// reg.mjs
// Main entry for reg.html
// Written by Aditi Modi , Term 1 2026?
/**************************************************************/

/**************************************************************/
// Import all the constants & functions required from the fb_io module
/**************************************************************/
import { fb_initialise, fb_writerecord } from './fb/fb_io.mjs';
fb_initialise();
console.log('%c reg.mjs loaded', 'color: green; font-weight: bold;');

/**************************************************************/
function getUserInput() {
  console.log('getUserInput()');

  // Check if form is valid
  if (document.getElementById('f_userDetails').checkValidity()) {
      //getting values from the form
      const displayName = document.getElementById("i_displayName").value;
      const age = document.getElementById("i_age").value;
      const sex = document.getElementById("i_sex").value;
      const email = document.getElementById("i_email").value;
      const phone = document.getElementById("i_phone").value;

      console.log("displayName:", displayName);
      console.log("Age:", age);
      console.log("Sex:", sex);
      console.log("Email:", email);
      console.log("Phone:", phone);
      console.log("uid:", sessionStorage.getItem('uid'));
      console.log("photoURL:", sessionStorage.getItem('photoURL'));

      const userDetails = { 
          displayName, age, sex, email, phone, 
          uid: sessionStorage.getItem('uid'),
          photoURL: sessionStorage.getItem('photoURL')
      };

      // Calling the write record
      fb_writerecord(userDetails);
  } else {
     console.log('%c Form is not valid!', 'color: red; font-weight: bold; font-size: 16px;');
  }
}
    
window.onload = () => {
  document.getElementById('registerBtn').onclick = getUserInput;
};


/*******************************************************/
// END OF APP
/*******************************************************/