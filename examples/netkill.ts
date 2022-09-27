import { Header, EncodeMessage } from "../lib.ts";

const listener = Deno.listenDatagram({ port: 0, transport: "udp" });

const entrynode: Deno.NetAddr = { transport: "udp", port: 8000, hostname: "localhost" };

listener.send(EncodeMessage(Header.Eval,"Deno.exit(0);"), entrynode);

