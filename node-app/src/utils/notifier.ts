import { createJsonResponse } from '../utils/response'
import { Buyer } from '../models/buyers';
import { Bid } from '../models/bids';
import { CLIENT_RENEG_LIMIT } from 'tls';
const axios = require('axios');

export class Notifier {

    _otherContainers: String[];

    constructor() {
        this._otherContainers = process.env.CONTAINERS_PATH.split(","); 
    }

    notifyToContainers(params: any){}

    notifyToClients(params: any){}

    notifyTo = (destinations: String[], path: String, params: any) => {
        //TODO: Revisar alta disponibilidad de containers.
        let timeout = new Promise((resolve, reject) => {
            const ms = 30000
            let id = setTimeout(() => {
                clearTimeout(id);
                reject('Timed out in '+ ms + 'ms.')
            }, ms)
        })

        let response = Promise.all(destinations.map(destination => {
            return this.sentNotification(`http://${destination}/${path}`, params);
        }))
        Promise.race([response,timeout])
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
        return this.notifyTo(this._otherContainers, 'bids/update', params);
    }

    notifyEndOfBidToContainers = (id: string) => {
        return this.notifyTo(this._otherContainers, 'bids/close', {"id": id});
    }

    notifyBidToBuyers = async (tags: String[], currentBuyers: Buyer[], message: String) => {
        let buyersToNotify = currentBuyers.filter( buyer => tags.some( tag => buyer.tags.includes(tag) ))
        let buyersIp = buyersToNotify.map(buyer => buyer._ip);
        console.log(message)
        let messageToSend = {
            message: message
        };
        return this.notifyTo(buyersIp, 'offerNotification', messageToSend);
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
