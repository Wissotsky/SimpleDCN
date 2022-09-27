import { Header, EncodeMessage } from "../lib.ts";

const listener = Deno.listenDatagram({ port: 0, transport: "udp" });

const entrynode: Deno.NetAddr = { transport: "udp", port: 8000, hostname: "127.0.0.1" };

listener.send(EncodeMessage(Header.Eval,"Deno.exit(0);"), entrynode);

