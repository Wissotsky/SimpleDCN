export enum Header {
    Ping,  // Sends a ping request to the server
    Pong,  // Responce to a ping request
    Hello, // Requests to be added/updated to the server's routing table with supplied info
    Eval   // Evaluates a string of code on the server and routes the message onward
}   

export function EncodeMessage(header: Header, string: string): Uint8Array {
    let headerBytes = new Uint8Array(1);
    headerBytes[0] = header;
    let stringBytes = new TextEncoder().encode(string);
    let bytes = new Uint8Array(headerBytes.length + stringBytes.length);
    bytes.set(headerBytes);
    bytes.set(stringBytes, headerBytes.length);
    return bytes;
}

export function DecodeMessage(bytes: Uint8Array): [Header, string] {
    let header = bytes[0];
    let string = new TextDecoder().decode(bytes.slice(1));
    return [header, string];
}

export function MessageBroadcast(message: Uint8Array, routingMap: Map<string, Deno.Addr>, server: Deno.DatagramConn): void {
    for (let [key, value] of routingMap) {
            server.send(message, value);
    }
}