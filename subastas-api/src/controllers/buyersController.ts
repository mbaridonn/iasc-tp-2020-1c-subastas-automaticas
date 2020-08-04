import {getFromMainNodes, getFromMainNodesByNodes} from "../utils/nodes";
import axios from 'axios'
import {nextCluster} from "../utils/cluster";

export const getAllBuyersFromNodes = async (mainNodes: String[]) => {
    return await getFromMainNodes(mainNodes, "buyers");
}

let buyersMap: string[][] = [[],[],[]]

export const addNewBuyer = async (mainNodes: String[], buyer: { ip: string }) => {
    if (buyersMap === undefined) {
        try {
            await updateBuyersMap(mainNodes)
        } catch (e) {
            return Promise.reject(e)
        }
    }
    let cluster = nextCluster(buyersMap)
    let nodeToAddBuyer = mainNodes[cluster];
    buyersMap[cluster].push(buyer.ip.toString())
    try {
        let response = await axios.post(`http://${nodeToAddBuyer}/buyers/new`, buyer);
        return response.data
    } catch (e) {
        return Promise.reject(e)
    }
}

export const updateBuyersMap = async (mainNodes: String[]) => {
    try {
        let buyersByNodes = await getFromMainNodesByNodes(mainNodes, "buyers")
        buyersMap = buyersByNodes.map((l: { _ip: string; }[]) => l.map(bid => bid._ip))
        return Promise.resolve()
    } catch (e) {
        return Promise.reject(e)
    }
}