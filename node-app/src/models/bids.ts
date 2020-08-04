import { Buyer } from "./buyers";
import controllers from '../controllers';
import axios from 'axios'
import {findBid} from "../controllers/bidsContoller";

const API_URL = 'subastas-api:3000'

export class Bid {
    _basePrice: number;
    _hours: number;
    _tags: String[];
    _id: string;
    _started: Date;
    _finish: Date;
    _currentWinner: String;

    constructor(id: string, basePrice: number, hours: number, tags:String[], started?: Date, currentWinner?: String){
        this._id = id;
        this._basePrice = basePrice;
        this._hours = hours;
        this._tags = tags;
        if(started){
            this._started = started;
        }
        if(currentWinner){
            this._currentWinner = currentWinner;
        }
    }


    processOffer = (buyerIp: String, newOffer: number) => {
        if(this._basePrice < newOffer){
            this._currentWinner = buyerIp
            this._basePrice = newOffer
            return {success: true, 
                    message: `El nuevo precio de la subasta ${this._id} es de: ${this._basePrice} rupias`};
        }
        return {success: false,
                message: `Asegurese que el valor de la oferta sea mayor que: ${this._basePrice} rupias`};;
    };

    restart = (): Promise<Bid> => {
        console.log("Reiniciando subasta: ",this._id, "previamente iniciada a las", this._started.toLocaleString());
        this._finish = new Date(this._started);
        this._finish.setSeconds( this._finish.getSeconds() + 5 + this._hours);
        return this.initTimeOutBid()
    }

    start = (): Promise<Bid> => {
       this._started = new Date();
       this._finish = new Date();
       this._finish.setSeconds( this._finish.getSeconds() + this._hours);
       
       console.log("Iniciando subasta: ",this._id, "a las", this._started.toLocaleString());
       return this.initTimeOutBid()
    };

    private initTimeOutBid = (): Promise<Bid> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (findBid(this._id)) {
                    console.log("Finalizando subasta: ", this._id, "a las", this._finish.toLocaleString());
                    axios.post(`http://${API_URL}/bids/close`, {
                        id: this._id,
                        tags: this._tags,
                        finish: this._finish,
                        currentWinner: this._currentWinner
                    }).catch(console.log);
                    resolve(this as Bid);
                }
            }, this._finish.getTime() - new Date().getTime());
        });
    }

    
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
