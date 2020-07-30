import { Buyer } from '../models/buyers';
import { createJsonResponse } from '../utils/response';
import { BuyerNotifier } from '../utils/notifier';
import axios from 'axios'

let buyersList: Buyer[] = [];
let notifier = new BuyerNotifier();

export const addNewBuyer = ( name:String, ip:String, tags:String[], notify:boolean = true ) => {
    let buyer = new Buyer( name, ip, tags )
    buyersList.push(buyer);
    if(notify){
        notifier.notifyToContainers(buyer);
    }
    return createJsonResponse(buyer, 200);
}

export const updateBuyer = (ip:String, name?:String, tags?:String[]) => {
    let buyer: Buyer = buyersList.find( (b:Buyer) => {
        return b._ip == ip
    });

    if(buyer == undefined){
        return addNewBuyer(ip, name, tags, false);        
    }else{
        buyer._name =  name || buyer._name;
        buyer._ip = ip || buyer._ip;
        buyer._tags = tags || buyer._tags;

        let index = buyersList.indexOf(buyer);
        buyersList[index] = buyer;
        
        return createJsonResponse(buyer, 200)
    }

}

export const getCurrentBuyers = () => { return buyersList};

export const initializeBuyersFromOtherNode =  async (node: String) => { // es igual al de bids. alguien dijo... DEUDA TECNICA?
  try {
    const buyers = await axios.get(`http://${node}/buyers`)
    buyers.data.forEach((buyer: Buyer) => { addNewBuyer(buyer._name, buyer._ip, buyer._tags, false) });
  }
  catch{
    console.error('No se pudieron levantar los buyers')
  }
};