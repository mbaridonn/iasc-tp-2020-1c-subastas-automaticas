export interface Response {
    statusCode: number
    headers: any
    body: string
}


export const createJsonResponse = (value: any, status?: number, headers?: {}): Response => {
    return {
        statusCode: status || 200,
        headers: {
            ...headers, 
            "content-type": "application/json"
        },
        body: JSON.stringify(value)
    }
}