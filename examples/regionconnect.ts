import { Header, EncodeMessage, DecodeMessage } from "../lib.ts";

const listener = Deno.listenDatagram({ port: 33333, transport: "udp" });
const routingMap = new Map<string,Deno.Addr>;

const entrynode: Deno.NetAddr = { transport: "udp", port: 8000, hostname: "127.0.0.1" };

const ownnode: Deno.Addr = { transport: "udp", port: 33333, hostname: "127.0.0.1" };
const countryCode = "IL";

// incredibly ugly hack to do everything asynchronously
const script = `const node = ${JSON.stringify(ownnode)};
                fetch("https://ipinfo.io/json").then((res) => res.json()).then((json) => json.country).then((country) => {
                if (country == "${countryCode}") {
                    server.send(EncodeMessage(Header.Hello, uuid), node);
                }});`;

listener.send(EncodeMessage(Header.Eval,script), entrynode);

for await (const conn of listener){
    const message = DecodeMessage(conn[0]);
    switch(message[0]){
        case Header.Hello:
            routingMap.set(message[1], conn[1]);
            console.log(`Hello Received from ${message[1]}. Nodes Known: ${routingMap.size}`);
            break;
        default:
            console.log("Unknown message", conn, message[1]);
    }
}