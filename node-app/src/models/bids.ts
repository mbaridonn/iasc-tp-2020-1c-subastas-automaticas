
export class Bid {
    _basePrice: number;
    _hours: number;
    _tags: String[];
    _id: number; //Todo ver como hacerlo unico!
    
    constructor(basePrice: number, hours: number, tags:String[]){
        this._basePrice = basePrice;
        this._hours = hours;
        this._tags = tags;
        this._id = 1; //Todo ver como hacerlo unico!
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
