import { createJsonResponse } from '../utils/response'
const axios = require('axios');

class Notifier {

    _destinations: String[];

    constructor() {
        //TODO: Como se quien soy? Evitar autollamarme
        //TODO: Llevar a un archivo de config?
        this._destinations = ['subastas-node-app:3000', 'subastas-node-app-2:3000', 'subastas-node-app-3:3000']; 
    }

    async notify(path: String, params: any){
        //TODO: Revisar alta disponibilidad de containers.
        let response = await Promise.all(this.destinations.map(destination => {
            return this.sentNotification(`http://${destination}/${path}`, params);
        }))
        .then(respone => { return createJsonResponse('Notification success!', 200)})
        .catch(error => { return createJsonResponse('Fallo al notificar:' + error.message, 400)})
        
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


    set destinations(destinations:String[]){
        this._destinations = destinations;
    }
    get destinations(){
        return this._destinations;
    }
}


interface INotifier {
    notify(): Boolean;
}


module.exports = new Notifier();