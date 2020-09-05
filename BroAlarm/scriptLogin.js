"use strict";
var Klausur;
(function (Klausur) {
    let buttonLogin = document.getElementById("loginBtn");
    buttonLogin.addEventListener("click", login);
    //für verstecktes hamburger menu
    let checkboxLogin = document.getElementById("hidden");
    checkboxLogin.addEventListener("click", toggleHidden);
    let pwLogin = document.getElementById("password");
    async function login(_event) {
        let formData = new FormData(document.forms[0]);
        let url = "https://bajergis-gis-2020.herokuapp.com";
        let query = new URLSearchParams(formData);
        url += "/login" + "?" + query.toString();
        console.log("successfully sent!");
        console.log(url);
        let userExists = await fetch(url);
        let userExistsStr = await userExists.text();
        console.log(userExistsStr);
        //wenn username existiert wird localstorage gesetzt und redirect zu chat
        if (userExistsStr == "true") {
            let username = document.getElementById("username").value;
            localStorage.clear();
            localStorage.setItem("username", username);
            window.location.href = "chat.html";
        }
        else
            alert("wrong username or pw");
    }
    //zeigt das passwort bei der eingabe
    function toggleHidden(_event) {
        if (pwLogin.type == "password") {
            pwLogin.type = "text";
        }
        else
            pwLogin.type = "password";
    }
})(Klausur || (Klausur = {}));
//# sourceMappingURL=scriptLogin.js.map