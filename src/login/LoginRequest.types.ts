import { Request as ExpressRequest } from "express";
import { User } from "../users/users.service";

export interface LoginRequest extends ExpressRequest {
    user: User;
}

export interface AuthenticatedRequest extends ExpressRequest {
    user: Pick<User, "id" | "name">;
}
