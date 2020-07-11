// import { createJsonResponse } from '../utils/response'
// const axios = require('axios');

// class Notifier {

//     _destinations: String[];

//     constructor() {
//         //TODO: Como se quien soy?
//         //TODO: Llevar a un archivo de config?
//         this._destinations = ['subastas-app-1', 'subastas-app-2', 'subastas-app-3']; 
//     }

//     async notify(params: any){
//         await Promise.all(this.destinations.map(destination => {
//             return this.sentNotification(`http://${destination}/`, params);
//         }))
//         .then(respone => {createJsonResponse('Notification success!', 200)})
//         .catch(error => {createJsonResponse('Fallo al notificar:' + error.message, 400)})
//     }

//     private sentNotification = (dest:string, params: any) => {
//         return axios.post(dest, JSON.stringify(params))
//                 .then((resp:any) => {
//                     return {'success': true}
//                 })
//                 .catch((err:any)=>{
//                     return {'success': false, 'message': err}
//                 });
//     }


//     set destinations(destinations:String[]){
//         this._destinations = destinations;
//     }
//     get destinations(){
//         return this._destinations;
//     }
// }


// interface INotifier {
//     notify(): Boolean;
// }


// module.exports = new Notifier();