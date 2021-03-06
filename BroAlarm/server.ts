import * as Http from "http";
import * as url from "url";
import * as mongo from "mongodb";

export namespace Klausur {

  let dbLink: string = "mongodb+srv://TestUser:testuser@bajergis.sgykd.mongodb.net/Test?retryWrites=true&w=majority";
  let ordersUser: mongo.Collection; 
  let ordersReady: mongo.Collection;

  let mongoArr: string[] = [];

  //holt aus der jeweiligen mongocollection die info als array von strings
  async function pull(_orders: mongo.Collection): Promise<string[]> {
    let storage: mongo.Cursor<string> = _orders.find();
    mongoArr = await storage.toArray();
    return mongoArr;
  }
  
  let port: number = Number(process.env.PORT); 
  if (!port)
    port = 8100;                              

  function startServer(_port: number | string): void {
    let server: Http.Server = Http.createServer(); 
    server.addListener("request", handleRequest); 
    server.addListener("listening", handleListen);
    server.addListener("checkForReset", dailyReset);
    server.listen(_port);
  }

  function handleListen(): void {                  
    console.log("Listening");
  }
 
  startServer(port);
  connect(dbLink);
  dailyReset();

  async function connect(_url: string): Promise<void> {
      let options: mongo.MongoClientOptions = {useNewUrlParser: true, useUnifiedTopology: true};
      let mongoClient: mongo.MongoClient = new mongo.MongoClient(_url, options);
      await mongoClient.connect();
      ordersUser = mongoClient.db("brotime").collection("users");
      ordersReady = mongoClient.db("brotime").collection("ready");
      console.log("Database connection", ordersUser != undefined);
  }

  let now: Date = new Date();
  let midnight: Date = new Date( 2020, 9, 27, 11, 30, 0, 0);
  let hour: boolean = now.getHours == midnight.getHours;
  let minute: boolean = now.getMinutes == midnight.getMinutes;
  let changed: boolean = false;


  function dailyReset(): void {
    if (!changed) {
      if(hour && minute) {
        console.log("reset ready values");
        ordersReady.findOneAndReplace({message: "ready"}, {message: "notready"});
      }
      changed = true;
    }
  }

  async function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): Promise<void> { 
    _response.setHeader("content-type", "text/html; charset=utf-8");
    _response.setHeader("Access-Control-Allow-Origin", "*");    

    if (_request.url) {
      let data: url.UrlWithParsedQuery = url.parse(_request.url, true);

      //login schaut ob es einen nutzer mit diesem passwort gibt
      if (data.pathname == "/login") {
          if (await ordersUser.findOne({username: data.query.username, password: data.query.password})) {
              _response.write("true");
          }
          else _response.write("false");
      }

      //send improve
      if (data.pathname == "/send" + data.query.username + "Ready") {
        ordersReady.findOneAndReplace({username: data.query.username, message: "notready"}, data.query);
        console.log(data.query);
        console.log(data.query.username);
        changed = false;
      }
      else if (data.pathname == "/send" + data.query.username + "NotReady") {
        ordersReady.findOneAndReplace({username: data.query.username, message: "ready"}, data.query);
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
}