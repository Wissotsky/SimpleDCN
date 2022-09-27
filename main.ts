// deno-lint-ignore-file no-case-declarations
import { Header, EncodeMessage, DecodeMessage, MessageBroadcast } from "./lib.ts";

const server = Deno.listenDatagram({ port: 8000, transport: "udp" });

const uuid = crypto.randomUUID();

const processedMessages = Array<string>();
const routingMap = new Map<string,Deno.Addr>;

console.log(`Node started ${uuid}`);

for await (const conn of server){
    const message = DecodeMessage(conn[0]);
    // Message router
    switch(message[0]){
        case Header.Ping:
            console.log("Ping Received, Responding...");
            server.send(EncodeMessage(Header.Pong, `Message Length: ${message[1].length}`), conn[1]);
            break;
        case Header.Hello:
            console.log(`Hello Received from ${message[1]}. Nodes Known: ${routingMap.size}`);
            routingMap.set(message[1], conn[1]);
            break;
        case Header.Eval:
            const hash = crypto.subtle.digest("SHA-256", conn[0]).toString();
            if (hash in processedMessages) {
                console.log("Eval Message already processed");
            } else {
                processedMessages.push(hash);
                console.log(`Eval Recieved, Total Processed: ${processedMessages.length}`);
                MessageBroadcast(conn[0], routingMap, server);
                eval(message[1]);
            }
            break;
        default:
            console.log("Unknown message", conn, message[1]);
    }
}

