import { createJsonResponse } from '../utils/response'
import { Buyer } from '../models/buyers';
import { Bid } from '../models/bids';
import { CLIENT_RENEG_LIMIT } from 'tls';
const axios = require('axios');

export class Notifier {

    _otherContainers: String[];

    constructor() {
        //TODO: Como se quien soy? Evitar autollamarme
        //TODO: Llevar a un archivo de config?
        this._otherContainers = process.env.CONTAINERS_PATH.split(","); 
    }

    notifyToContainers(params: any){}

    notifyToClients(params: any){}

    notifyTo = (destinations: String[], path: String, params: any) => {
        //TODO: Revisar alta disponibilidad de containers.
        let response = Promise.all(destinations.map(destination => {
            return this.sentNotification(`http://${destination}/${path}`, params);
        }))
        .then(respone => { 
            return createJsonResponse('Notification success!', 200)})
        .catch(error => { 
            return createJsonResponse('Fallo al notificar:' + error.message, 400)});
        return response;
    }

    private sentNotification = (dest:string, params: any) => {
        return axios.post(dest, params)
                .then((resp:any) => {
                    return {'success': true}
                })
                .catch((err:any)=>{
                    return {'success': false, 'message': err}
                });
    }


    set otherContainers(otherContainers:String[]){
        this._otherContainers = otherContainers;
    }
    get otherContainers(){
        return this._otherContainers;
    }
}

export class BidNotifier extends Notifier {
    constructor(){
        super();
    }

    notifyToContainers = (params: Bid) => {
        return this.notifyTo(this._otherContainers, 'bids', params);
    }

    notifyBidToBuyers = async (bid: Bid, currentBuyers: Buyer[], message: String) => {
        let buyersToNotify = currentBuyers.filter( buyer => bid._tags.some( tag => buyer.tags.includes(tag) ))
        let buyersIp = buyersToNotify.map(buyer => buyer._ip);
        console.log(message)  
        // return this.notifyTo(buyersIp, '', message);                 //TODO: Descomentar cuando se implemente el destino de notificacion de los buyers
        return 
    }
    
}

export class BuyerNotifier extends Notifier {
    constructor(){
        super();
    }

    notifyToContainers = (params: Buyer) => {
        console.log("CONTAINERS", this._otherContainers)
        return this.notifyTo(this._otherContainers, 'buyers/update', params);
    }

    notifyToClients(){}

}

