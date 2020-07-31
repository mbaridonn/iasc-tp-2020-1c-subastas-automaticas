import express from "express";
import * as router from "./router";
import * as bodyParser from "body-parser";
import { initializeBidsFromOtherNode } from "./controllers/bidsContoller";
import { initializeBuyersFromOtherNode } from "./controllers/buyersController"; // importar ./controllers no me dejaba, asi que mehh

// Create a new express app instance
const app: express.Application = express();
const port: number = 3000;
const otherNodes: String[] = process.env.CONTAINERS_PATH.split(",");

app.use(bodyParser.json());

router.register(app);

// no se si estos deberian estar aca, y si deberian estar declarados en el controller, pero la idea es que se corra al principio cuando se levanta
// y cuando se levanta la primera vez no deberia joder, va a recibir una lista vacia del main o de los otros
setTimeout(() => initializeBidsFromOtherNode(otherNodes[0]), 1000) // creo que lo mejor seria tener una estrategia para pedirle al siguiente si el primero no contesta
setTimeout(() => initializeBuyersFromOtherNode(otherNodes[0]), 1000)

app.listen(port, function () {
    console.log(`Server started at http://localhost:${port}`);
});