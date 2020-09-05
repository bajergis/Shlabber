namespace Klausur {

    let buttonLogin: HTMLButtonElement = <HTMLButtonElement> document.getElementById("loginBtn");
    buttonLogin.addEventListener("click", login);

    //für verstecktes hamburger menu
    let checkboxLogin: HTMLInputElement = <HTMLInputElement> document.getElementById("hidden");
    checkboxLogin.addEventListener("click", toggleHidden);

    let pwLogin: HTMLInputElement = <HTMLInputElement> document.getElementById("password");

    async function login(_event: Event): Promise<void> {
        
        let formData: FormData = new FormData(document.forms[0]);
        let url:  string = "https://bajergis-gis-2020.herokuapp.com";
        let query: URLSearchParams = new URLSearchParams(<any>formData);
        url += "/login" + "?" + query.toString();
        console.log("successfully sent!");
        console.log(url);
        let userExists: Response = await fetch(url);
        let userExistsStr: string = await userExists.text();
        console.log(userExistsStr);
        //wenn username existiert wird localstorage gesetzt und redirect zu chat
        if (userExistsStr == "true") {
            let username: string = (<HTMLInputElement>document.getElementById("username")).value;
            localStorage.clear();
            localStorage.setItem("username", username);
            window.location.href = "chat.html";
        }
        else alert("wrong username or pw");
        
    }

    //zeigt das passwort bei der eingabe
    function toggleHidden(_event: Event): void {
        if (pwLogin.type == "password") {
            pwLogin.type = "text";
        }
        else pwLogin.type = "password";
    }
}