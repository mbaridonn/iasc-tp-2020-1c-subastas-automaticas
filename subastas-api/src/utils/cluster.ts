export const nextCluster = function (map: string[][]) {
    const itemsCount = map.map(cluster => cluster.length)
    return itemsCount.indexOf(Math.min.apply(Math, itemsCount))
}

const findClusterR = async function (mainNodes: String[],
                                            map: string[][],
                                            id: string,
                                            update: boolean,
                                            updateFunc?: (mainNodes: String[]) => Promise<void>): Promise<number> {
    let i = 0;
    for (; i < map.length; ++i) {
        if (map[i].includes(id)) break;
    }

    if (i >= map.length) {
        if (update) {
            await updateFunc(mainNodes)
            return findClusterR(mainNodes, map, id, false)
        }
        return Promise.reject("No existe la subasta")
    }

    return i;
}

export const findCluster = async function (mainNodes: String[], map: string[][], id: string, updateFunc: (mainNodes: string[]) => Promise<void>) {
    return await findClusterR(mainNodes, map, id, true, updateFunc)
}