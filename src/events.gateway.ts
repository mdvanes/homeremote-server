/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
} from "@nestjs/websockets";
import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Server } from "ws";

// @WebSocketGateway(8080)
@WebSocketGateway(8080, { path: "/hr-events" })
export class EventsGateway {
    @WebSocketServer()
    server: Server | null = null;
    clients: WebSocket[] = [];

    constructor() {
        // private readonly jwtService: JwtService // TODO this import fails because with "not imported in module", but is is imported in app.module via authmodule // private app: INestApplicationContext // private readonly usersService: UsersService,
        // this.logger = new Logger(AuthService.name);
        // this.jwtService = this.app.get(JwtService);
    }

    // @Subscribe
    // in gateway
    async handleConnection(socket: WebSocket): Promise<void> {
        // const user: User = await this.jwtService.verify(
        //     socket.handshake.query.token
        //     // true
        // );

        // this.connectedUsers = [...this.connectedUsers, String(user._id)];
        this.clients = [...this.clients, socket];

        if (this.server) {
            // Send list of connected users
            // this.server.emit("users", socket, "this.connectedUsers"); does not work?
            console.log("handleConnection"); // , user.name);
            this.clients.forEach((client) => {
                // TODO this "client id" list is not very stable, use uuids and clean up on disconnect
                client.send(
                    JSON.stringify(this.clients.map((c, index) => index))
                ); // works!
            });
        }
    }

    @SubscribeMessage("events")
    onEvent(client: any, data: any): Observable<WsResponse<number>> {
        console.log("incoming ws event", client.id, data);
        return from([1, 2, 3]).pipe(
            map((item) => ({ event: "events", data: item }))
        );
    }
}

// import {
//     MessageBody,
//     SubscribeMessage,
//     WebSocketGateway,
//     WebSocketServer,
//     WsResponse,
// } from "@nestjs/websockets";
// import { Observable, from } from "rxjs";
// import { map } from "rxjs/operators";
// import { Server } from "socket.io";

// // @WebSocketGateway()
// // export class EventsGateway {
// //     @SubscribeMessage("message")
// //     handleMessage(client: any, payload: any): string {
// //         return "Hello world!";
// //     }
// // }

// // TODO test security
// // TODO test web socket not available (e.g. blocked in nginx.conf)

// @WebSocketGateway()
// export class EventsGateway {
//     @WebSocketServer()
//     server: Server = new Server();

//     @SubscribeMessage("events")
//     handleEvent(client: any, data: string): string {
//         console.log("events ws", client);
//         return data;
//     }

//     // @SubscribeMessage("events")
//     // findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
//     //     return from([1, 2, 3]).pipe(
//     //         map((item) => ({ event: "events", data: item }))
//     //     );
//     // }

//     @SubscribeMessage("identity")
//     async identity(@MessageBody() data: number): Promise<number> {
//         console.log("identity ws", data);
//         return data;
//     }
// }
