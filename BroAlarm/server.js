"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Klausur = void 0;
const Http = require("http");
const url = require("url");
const mongo = require("mongodb");
var Klausur;
(function (Klausur) {
    let dbLink = "mongodb+srv://TestUser:testuser@bajergis.sgykd.mongodb.net/Test?retryWrites=true&w=majority";
    let ordersUser;
    let ordersReady;
    let mongoArr = [];
    //holt aus der jeweiligen mongocollection die info als array von strings
    async function pull(_orders) {
        let storage = _orders.find();
        mongoArr = await storage.toArray();
        return mongoArr;
    }
    let port = Number(process.env.PORT);
    if (!port)
        port = 8100;
    function startServer(_port) {
        let server = Http.createServer();
        server.addListener("request", handleRequest);
        server.addListener("listening", handleListen);
        server.listen(_port);
    }
    function handleListen() {
        console.log("Listening");
    }
    startServer(port);
    connect(dbLink);
    async function connect(_url) {
        let options = { useNewUrlParser: true, useUnifiedTopology: true };
        let mongoClient = new mongo.MongoClient(_url, options);
        await mongoClient.connect();
        ordersUser = mongoClient.db("brotime").collection("users");
        ordersReady = mongoClient.db("brotime").collection("ready");
        console.log("Database connection", ordersUser != undefined);
    }
    let now = new Date();
    let midnight = new Date(2020, 9, 27, 11, 15, 0, 0);
    let hour = now.getHours == midnight.getHours;
    let minute = now.getMinutes == midnight.getMinutes;
    let second = now.getSeconds == midnight.getSeconds;
    function dailyReset() {
        if (hour && minute && second) {
            console.log("reset ready values");
            ordersReady.findOneAndReplace({ message: "ready" }, { message: "notready" });
        }
    }
    dailyReset();
    async function handleRequest(_request, _response) {
        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*");
        if (_request.url) {
            let data = url.parse(_request.url, true);
            //login schaut ob es einen nutzer mit diesem passwort gibt
            if (data.pathname == "/login") {
                if (await ordersUser.findOne({ username: data.query.username, password: data.query.password })) {
                    _response.write("true");
                }
                else
                    _response.write("false");
            }
            //send improve
            if (data.pathname == "/send" + data.query.username + "Ready") {
                ordersReady.findOneAndReplace({ username: data.query.username, message: "notready" }, data.query);
                console.log(data.query);
                console.log(data.query.username);
            }
            else if (data.pathname == "/send" + data.query.username + "NotReady") {
                ordersReady.findOneAndReplace({ username: data.query.username, message: "ready" }, data.query);
                console.log(data.query);
                console.log(data.query.username);
            }
            //pull current statuses
            else if (data.pathname == "/pullready") {
                _response.write(JSON.stringify(await pull(ordersReady)));
                console.log("pull log file works");
            }
        }
        _response.end();
    }
})(Klausur = exports.Klausur || (exports.Klausur = {}));
//# sourceMappingURL=server.js.map