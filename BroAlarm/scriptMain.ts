namespace Klausur {

    export interface Msg {
        username: string;
        message: string;
        can: string;
    }

    let statusArr: Msg[] = [];
    let newStatus: Msg[] = [];

    //button für das senden von ready not ready
    let buttonHTML: HTMLButtonElement = <HTMLButtonElement> document.getElementById("sendRdy");

    //logout button
    let buttonLogout: HTMLButtonElement = <HTMLButtonElement> document.getElementById("logout");
    buttonLogout.addEventListener("click", logout);

    //menu hamburger icon oben links in der html
    let hamburger: HTMLDivElement = <HTMLDivElement> document.getElementById("container");
    hamburger.addEventListener("click", dropdown);

    //wo die nachrichten angezeigt werden
    let jsnDiv: HTMLDivElement = <HTMLDivElement> document.getElementById("jsn");
    let dimDiv: HTMLDivElement = <HTMLDivElement> document.getElementById("dim");
    let drnzDiv: HTMLDivElement = <HTMLDivElement> document.getElementById("drnz");
    let hnrkDiv: HTMLDivElement = <HTMLDivElement> document.getElementById("hnrk");
    let jsnP: HTMLParagraphElement = <HTMLParagraphElement> document.getElementById("jsnp");
    let dimP: HTMLParagraphElement = <HTMLParagraphElement> document.getElementById("dimp");
    let drnzP: HTMLParagraphElement = <HTMLParagraphElement> document.getElementById("drnzp");
    let hnrkP: HTMLParagraphElement = <HTMLParagraphElement> document.getElementById("hnrkp");

    let main: HTMLDivElement = <HTMLDivElement> document.getElementById("main");

    let gameStart: HTMLParagraphElement = document.createElement("p");
    gameStart.setAttribute("id", "gamerTime");

    let text: HTMLTextAreaElement = <HTMLTextAreaElement> document.getElementById("sendMsg");

    //audio for start
    let jibunWo: HTMLAudioElement = <HTMLAudioElement> document.getElementById("song");

    //
    //let notImg: string = "jsn.png";
    //let notText: string = "yoho this is a test";
    //let notification: Notification = new Notification("todo", {body: notText, icon: notImg});

    //w3 part
    /**function mailBot(): void {
        var nodemailer = require("nodemailer");
        var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "bajergis@gmail.com",
                pass: "Spurdo801jizz++"
            }
        });
        var mailOptions = {
            from: "bajergis@gmail.com",
            to: "jay.blackschleger@gmail.com",
            subject: "gamer time",
            text: "it's gamer time boys!"
        };

        transporter.sendMail(mailOptions, "error");
    }**/

    //boolean if all are online
    let jsn: boolean;
    jsn = false;
    let drnz: boolean;
    drnz = false;
    let dim: boolean;
    dim = false;
    let hnrk: boolean;
    hnrk = false;

    let firstRefresh: boolean;
    firstRefresh = true;
    if (firstRefresh) {
        pullStatus();
        console.log("checked  fist time");
        firstRefresh = false;
    }

    //beim click auf den hamburger klappt das menu aus und ein
    function dropdown(_event: Event): void {
        let ddContent: HTMLDivElement = <HTMLDivElement> document.getElementById("dropdown-content");
        let ddStyle: string = <string> ddContent.getAttribute("style");
        if (ddStyle == "display:none") {
            ddContent.setAttribute("style", "display: inline-block");
        }
        else ddContent.setAttribute("style", "display:none");
    }

    // make username appear on screen
    let nameDisplay: HTMLHeadingElement = <HTMLHeadingElement> document.getElementById("username");
    let user: string = "" + localStorage.getItem("username");
    nameDisplay.innerHTML = user;
    document.getElementById("usernameDiv")?.appendChild(nameDisplay);

    //wenn username vorhanden ist man eingeloggt also kann man nachrichten senden
    if (localStorage.getItem("username")) {
        if (user == "jsn") {
            if (!jsn) {
                buttonHTML.addEventListener("click", sendReady);
            }
            else buttonHTML.addEventListener("click", sendNotReady);
        }
        else if (user == "dim") {
            if (!dim) {
                buttonHTML.addEventListener("click", sendReady);
            }
            else buttonHTML.addEventListener("click", sendNotReady);
        }
        else if (user == "drnz") {
            if (!drnz) {
                buttonHTML.addEventListener("click", sendReady);
            }
            else buttonHTML.addEventListener("click", sendNotReady);
        }
        else if (user == "hnrk") {
            if (!hnrk) {
                buttonHTML.addEventListener("click", sendReady);
            }
            else buttonHTML.addEventListener("click", sendNotReady);
        }
    }
    else buttonLogout.setAttribute("value", "log in");

    //wenn der send button geklickt wird
    async function sendReady(_event: Event): Promise<void> {
        if (user == "jsn") {
            jsn = true;
            jsnDiv.style.backgroundColor = "#77dd77";
            jsnP.innerHTML = "I'm ready";
        }
        if (user == "dim") {
            dim = true;
            dimDiv.style.backgroundColor = "#77dd77";
            dimP.innerHTML = "I'm ready";
        }
        if (user == "drnz") {
            drnz = true;
            drnzDiv.style.backgroundColor = "#77dd77";
            drnzP.innerHTML = "I'm ready";
        }
        if (user == "hnrk") {
            hnrk = true;
            hnrkDiv.style.backgroundColor = "#77dd77";
            hnrkP.innerHTML = "I'm ready";
        }
        buttonHTML.addEventListener("click", sendNotReady);
        buttonHTML.removeEventListener("click", sendReady);
        let message: string = "ready";
        let can: string = text.value;
        let url:  string = "https://bajergis-gis-2020.herokuapp.com";
        url += "/send" + user + "Ready" + "?" + "username=" + user + "&message=" + message + "&can=" + can;
        console.log("successfully sent!");
        await fetch(url);
        pullStatus();
        //hopefully right one
        text.value = "";
    }

    async function sendNotReady(_event: Event): Promise<void> {
        jibunWo.pause();
        jibunWo.currentTime = 0;
        if (user == "jsn") {
            jsn = false;
            jsnDiv.style.backgroundColor = "#ffc0cb";
            jsnP.innerHTML = "I'm not ready";
        }
        if (user == "dim") {
            dim = false;
            dimDiv.style.backgroundColor = "#ffc0cb";
            dimP.innerHTML = "I'm not ready";
        }
        if (user == "drnz") {
            drnz = false;
            drnzDiv.style.backgroundColor = "#ffc0cb";
            drnzP.innerHTML = "I'm not ready";
        }
        if (user == "hnrk") {
            hnrk = false;
            hnrkDiv.style.backgroundColor = "#ffc0cb";
            hnrkP.innerHTML = "I'm  not ready";
        }
        buttonHTML.removeEventListener("click", sendNotReady);
        buttonHTML.addEventListener("click", sendReady);
        let message: string = "notready";
        let can: string = text.value;
        let url:  string = "https://bajergis-gis-2020.herokuapp.com";
        url += "/send" + user + "NotReady" + "?" + "username=" + user + "&message=" + message + "&can=" + can;
        console.log("successfully sent!");
        await fetch(url);
        pullStatus();
        text.value = "";
    }

    //localstorgage leeren und redirect zu login page
    function logout(_event: Event): void {
        localStorage.clear();
        window.location.href = "login.html";
    }

    //lädt die nachrichten im messages div
    function showStatus(_msg: Msg[]): void {
        for (let i: number = 0; i < _msg.length; i++) {
            let currentUser: string = _msg[i].username;
            let msg: string = _msg[i].message;
            let can: string = _msg[i].can;
            if (currentUser == "jsn") {
                if (msg == "ready") {
                    jsn = true;
                    jsnDiv.style.backgroundColor = "#77dd77";
                    if (can != "") {
                        jsnP.innerHTML = can;
                    }
                    else jsnP.innerHTML = "I'm ready";
                } 
                else if (msg != "ready" && can != "") {
                    jsnP.innerHTML = can;
                }
                else { jsnP.innerHTML = "I'm not ready";
                       jsnDiv.style.backgroundColor = "#ffc0cb";
                     }
            }
            else if (currentUser == "hnrk") {
                if (msg == "ready") {
                    hnrk = true;
                    hnrkDiv.style.backgroundColor = "#77dd77";
                    if (can != "") {
                        hnrkP.innerHTML = can;
                    }
                    else hnrkP.innerHTML = "I'm ready";
                }
                else if (msg != "ready" && can != "") {
                    hnrkP.innerHTML = can;
                }
                else { hnrkP.innerHTML = "I'm not ready";
                       hnrkDiv.style.backgroundColor = "#ffc0cb";
                     }
            }
            else if (currentUser == "dim") {
                if (msg == "ready") {
                    dim = true;
                    dimDiv.style.backgroundColor = "#77dd77";
                    if (can != "") {
                        dimP.innerHTML = can;
                    }
                    else dimP.innerHTML = "I'm ready";
                }
                else if (msg != "ready" && can != "") {
                    dimP.innerHTML = can;
                }
                else { dimP.innerHTML = "I'm not ready";
                       dimDiv.style.backgroundColor = "#ffc0cb";
                     }
            }
            else if (currentUser == "drnz") {
                if (msg == "ready") {
                    drnz = true;
                    drnzDiv.style.backgroundColor = "#77dd77";
                    if (can != "") {
                        drnzP.innerHTML = can;
                    }
                    else drnzP.innerHTML = "I'm ready";
                }
                else if (msg != "ready" && can != "") {
                    drnzP.innerHTML = can;
                }
                else { drnzP.innerHTML = "I'm not ready";
                       drnzDiv.style.backgroundColor = "#ffc0cb";
                     }
            }
        }
    }

    //ruft chat1 auf
    async function pullStatus(): Promise<void> {
        console.log("checked");
        let url:  string = "https://bajergis-gis-2020.herokuapp.com/" + "pullready";
        let response: Response = await fetch(url);
        statusArr = await response.json();
        showStatus(statusArr);
        setInterval(checkNewMessages, 5000, url);
        GeassTime();
    }

    async function checkNewMessages(_url: string): Promise <void> {
        console.log("messageTimer has been executed");
        let response: Response = await fetch(_url);
        newStatus = await response.json();
        showStatus(newStatus);
    } 

    function GeassTime(): void {
        if (jsn && hnrk && drnz && dim) {
            console.log("gamerTime");
            gameStart.innerHTML = "Gamer Time";
            main.appendChild(gameStart);
            //this is jibun wo part
            jibunWo.src = "Code - Geass.mp3";
            //mailBot();
        } else {
            jibunWo.pause();
            jibunWo.currentTime = 0;
            console.log("no Geass so far");
        }
    }
}