import { createJsonResponse } from '../utils/response'
const axios = require('axios');

export class Notifier {

    _otherContainers: String[];

    constructor() {
        //TODO: Como se quien soy? Evitar autollamarme
        //TODO: Llevar a un archivo de config?
        this._otherContainers = ['subastas-node-app:3000', 'subastas-node-app-2:3000', 'subastas-node-app-3:3000']; 
    }

    notifyToContainers(path: String, params: any){
        return this.notifyTo(this._otherContainers, path, params);
    }

    notifyToClients(){

    }

    async notifyTo(destinations: String[], path: String, params: any){
        //TODO: Revisar alta disponibilidad de containers.
        let response = await Promise.all(destinations.map(destination => {
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

    notifyToContainers = (params: any) => {
        return super.notifyTo(this._otherContainers, 'bids/update', params);
    }
    
}

export class BuyerNotifier extends Notifier {
    constructor(){
        super();
    }

    notifyToContainers(params: any){
        return super.notifyTo(this._otherContainers, 'buyers/update', params);
    }

}

