
export class Buyer {
    _name: String;
    _ip: String; 
    _tags: String[]
    constructor(name: String, ip:String, tags:String[]){
        this._name = name;
        this._tags = tags;
        this._ip = ip;
    }

    get name(){
        return this._name;
    }

    set name(name){
        this._name = name;
    }

    get ip(){
        return this._ip;
    }

    set ip(ip){
        this._ip = ip;
    }

    get tags(){
        return this._tags;
    }

    set tags(tags){
        this._tags = tags;
    }
    
}

