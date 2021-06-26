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
@WebSocketGateway(8080, { path: "/wsv1" })
export class EventsGateway {
    @WebSocketServer()
    // @ts-ignore
    server: Server;

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
