import { createJsonResponse } from '../utils/response'
import { Buyer } from '../models/buyers';
import { Bid } from '../models/bids';
const axios = require('axios');

export class Notifier {

    _otherContainers: String[];

    constructor() {
        //TODO: Como se quien soy? Evitar autollamarme
        //TODO: Llevar a un archivo de config?
        this._otherContainers = ['subastas-node-app-1-1:3000', 'subastas-node-app-1-2:3000', 'subastas-node-app-1-3:3000']; 
    }

    notifyToContainers(params: any){}

    notifyToClients(params: any){}

    notifyTo = (destinations: String[], path: String, params: any) => {
        //TODO: Revisar alta disponibilidad de containers.
        let response = Promise.all(destinations.map(destination => {
            return this.sentNotification(`http://${destination}/${path}`, params);
        }))
        .then(respone => { return createJsonResponse('Notification success!', 200)})
        .catch(error => { return createJsonResponse('Fallo al notificar:' + error.message, 400)});

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
        return this.notifyTo(this._otherContainers, 'bids/update', params);
    }

    notifyBidToBuyers = (bid: Bid, currentBuyers: Buyer[], message: String) => {
        let buyersToNotify = currentBuyers.filter( buyer => bid._tags.some( tag => buyer.tags.includes(tag) ))
        let buyersIp = buyersToNotify.map(buyer => buyer._ip);
        return this.notifyTo(buyersIp, '', message)
    }
    
}

export class BuyerNotifier extends Notifier {
    constructor(){
        super();
    }

    notifyToContainers = (params: Buyer) => {
        return this.notifyTo(this._otherContainers, 'buyers/update', params);
    }

    notifyToClients(){}

}

