import { Buyer } from "./buyers";
import controllers from '../controllers';
import axios from 'axios'

const API_URL = 'subastas-api:3000'

export class Bid {
    _basePrice: number;
    _hours: number;
    _tags: String[];
    _id: number;
    _started: Date;
    _finish: Date;
    _actualWinner: String;
    
    constructor(id: number, basePrice: number, hours: number, tags:String[]){
        this._id = id;
        this._basePrice = basePrice;
        this._hours = hours;
        this._tags = tags;
    }


    processOffer = (buyerIp: String, newOffer: number) => {
        if(this._basePrice < newOffer){
            this._actualWinner = buyerIp;
            return {success: true, 
                    message: `El nuevo precio de la subasta ${this._id} es de: ${newOffer} rupias`};
        }
        return {success: true, 
                message: `Asegurece que el valor de la oferta sea mayor que: ${this._basePrice} rupias`};;
    };


    start = (): Promise<Bid> => {
       this._started = new Date();
       this._finish = new Date();
       this._finish.setSeconds( this._finish.getSeconds() + this._hours);
       
       return new Promise( (resolve, reject) => {
        console.log("Iniciando subasta: ",this._id, "a las", this._started.toLocaleString());
        setTimeout(() => {
            console.log("Finalizando subasta: ",this._id, "a las", this._finish.toLocaleString());
            axios.post(`http://${API_URL}/bids/close`, { id: this._id });
            resolve(this as Bid); 
        },  this._finish.getTime() - this._started.getTime());
       });
    };

    
    get hours(){
        return this._hours;
    }
    
    set hours(hours){
        this._hours = hours;
    }
    
    get basePrice(){
        return this._basePrice;
    }
    
    set basePrice(basePrice){
        this._basePrice = basePrice;
    }

    get tags(){
        return this._tags;
    }
    
    set tags(tags){
        this._tags = tags;
    }

    get id(){
        return this._id;
    }

}




module.exports = { Bid }
