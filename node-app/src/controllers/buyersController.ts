import { Buyer } from '../models/buyers';

let buyersList: Buyer[] = [
    {
        name: 'Juan',
        ip: '190.19.4.92',
        tags: ['tech', 'movies']
    },
    {
        name: 'Carlos',
        ip: '190.19.4.14',
        tags: ['tech', 'movies']
    }
];

export const addNewBuyer = ( name:String, ip:String, tags:String[]) => {
    let buyer = new Buyer( name, ip, tags )
    buyersList.push(buyer);
}

export const getCurrentBuyers = () => { return buyersList};