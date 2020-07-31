import { getFromMainNodes } from "../utils/nodes";
import axios from 'axios'

export const getAllBuyersFromNodes = async (mainNodes: String[]) => {
    return await getFromMainNodes(mainNodes, "buyers");
}

export const addNewBuyer = async (mainNodes: String[], buyer: any) => {
    //ToDo: distribuir buyers
    let nodeToAddBuyer = mainNodes[0];
    await axios.post(`http://${nodeToAddBuyer}/buyers/new`, buyer);
}