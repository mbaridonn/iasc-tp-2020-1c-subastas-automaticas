import { getFromMainNodes } from "../utils/nodes";

export const getAllBuyersFromNodes = async (mainNodes: String[]) => {
    return await getFromMainNodes(mainNodes, "buyers");
}