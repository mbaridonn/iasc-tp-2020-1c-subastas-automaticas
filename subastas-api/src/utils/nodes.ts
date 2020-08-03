import axios from 'axios'

export const getFromMainNodesByNodes = async (mainNodes: String[], endpoint: String) => {
    let elementsPromises = await Promise.all(mainNodes.map(async node => await getPromiseFromNode(node, endpoint)));

    let elements: any = elementsPromises.map(elementPromise => elementPromise.data);

    return elements;
}

export const getFromMainNodes = async (mainNodes: String[], endpoint: String) => {
    let elements = await getFromMainNodesByNodes(mainNodes, endpoint)
    return elements.flat()
}

const getPromiseFromNode = (node: String, endpoint: String) => {
    return axios.get(`http://${node}/${endpoint}`);
}