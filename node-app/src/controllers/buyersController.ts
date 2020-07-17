import { Buyer } from '../models/buyers';
import { createJsonResponse } from '../utils/response';
import { BuyerNotifier } from '../utils/notifier';

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
        buyer._name = (name != null || name != undefined) ? name : buyer._name;
        buyer._ip = (ip != null || ip != undefined) ? ip : buyer._ip;
        buyer._tags = (tags != null || tags != undefined) ? tags : buyer._tags;

        let index = buyersList.indexOf(buyer);
        buyersList[index] = buyer;
        
        return createJsonResponse(buyer, 200)
    }

}

export const getCurrentBuyers = () => { return buyersList};