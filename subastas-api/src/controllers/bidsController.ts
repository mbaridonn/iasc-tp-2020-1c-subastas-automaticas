import { getFromMainNodes } from '../utils/nodes';

export const getAllBidsFromNodes = async (mainNodes: String[]) => {
    return await getFromMainNodes(mainNodes, "bids");
}