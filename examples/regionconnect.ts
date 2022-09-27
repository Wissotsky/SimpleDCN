import { Header, EncodeMessage, DecodeMessage } from "../lib.ts";

const listener = Deno.listenDatagram({ port: 33333, transport: "udp" });
const routingMap = new Map<string,Deno.Addr>;

const entrynode: Deno.NetAddr = { transport: "udp", port: 8000, hostname: "localhost" };

const ownnode: Deno.Addr = { transport: "udp", port: 33333, hostname: "localhost" };
const countryCode = "US";

const script = `const node: Deno.Addr = ${ownnode};
                const json = await fetch("ipinfo.io/json").then((res) => res.json());
                if json["country"] == "${countryCode}" {
                    server.send(EncodeMessage(Header.Hello, uuid), node);
                }`;

listener.send(EncodeMessage(Header.Eval,script), entrynode);

for await (const conn of listener){
    const message = DecodeMessage(conn[0]);
    switch(message[0]){
        case Header.Hello:
            console.log(`Hello Received from ${message[1]}. Nodes Known: ${routingMap.size}`);
            routingMap.set(message[1], conn[1]);
            break;
        default:
            console.log("Unknown message", conn, message[1]);
    }
}