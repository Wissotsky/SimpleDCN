# SimpleDCN

This is a simple implementation of a Distributed Compute Network with the Deno Typescipt Runtime and no external dependencies.
It utilizes gossip communication and a simple Datagram(UDP) protocol to communicate between nodes.

## Important notes

This implementation has no security measures whatsoever. This is created for teaching purposes only.
As this is a decentralized network its main distinction is that it does not have a central server(aka c2) to communicate with.
This means is that to control the network you have to be a part of it. This is a very important distinction to make.

## Files

* `main.ts` - The example implementation of a network node
* `lib.ts` - Library of shared entities for nodes and controllers(modified nodes that send commands to the network)

## Examples

### netkill.ts

An example of a command that shuts down the whole network.
This utilizes the fact that evaluations get passed onward before execution.
This means that if a node receives a command to shut down it will pass it on to the next node before shutting itself down.

### massconnect.ts

Requests all nodes to connect to the specified node.
This will force all nodes to send a `Hello` message to the specified node.

### regionconnect.ts

This requests all nodes in the specified region to connect to the specified node.
The nodes will first check themselves to see if they are in the specified region before sending a `Hello` message to the specified node.
