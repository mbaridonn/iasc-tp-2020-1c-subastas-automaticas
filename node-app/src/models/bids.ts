
export class Bid {
    _basePrice: number;
    _hours: number;
    _tags: String[];
    _id: number;
    
    constructor(id: number, basePrice: number, hours: number, tags:String[]){
        this._id = id;
        this._basePrice = basePrice;
        this._hours = hours;
        this._tags = tags;
    }

    get basePrice(){
        return this._basePrice;
    }
    
    set basePrice(basePrice){
        this._basePrice = basePrice;
    }
    
    get hours(){
        return this._hours;
    }
    
    set hours(hours){
        this._hours = hours;
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
