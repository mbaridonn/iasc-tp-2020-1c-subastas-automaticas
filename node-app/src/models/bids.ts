
export class Bid {
    basePrice: number;
    hours: number;
    tags: String[];
    
    constructor(basePrice: number, hours: number, tags:String[]){
        this.basePrice = basePrice;
        this.hours = hours;
        this.tags = tags;
    }
}


module.exports = { Bid }
