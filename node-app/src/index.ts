import express from "express";
import * as router from "./router";
import * as bodyParser from "body-parser";
import { initializeBidsFromOtherNode } from "./controllers/bidsContoller";
import { initializeBuyersFromOtherNode } from "./controllers/buyersController"; // importar ./controllers no me dejaba, asi que mehh
import axios from 'axios'

// Create a new express app instance
const app: express.Application = express();
const port: number = 3000;
export let mainNode: String;

app.use(bodyParser.json());

router.register(app);

const initScheduler = function () {
  const seconds = 1
  const interval = seconds * 1000
  setInterval(initializeBidsFromOtherNode, interval)
  setInterval(initializeBuyersFromOtherNode, interval)
}

const initNetworkInfo =  async function() {
  try {
    const nodeResponse = await axios.get('http://subastas-api/main_nodes')
    mainNode = nodeResponse.data
  }
  catch {
    console.error('Error al inicializar')
  }
}

initNetworkInfo()
initScheduler()

app.listen(port, function () {
    console.log(`Server started at http://localhost:${port}`);
});
