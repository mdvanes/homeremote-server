// This file is copied from homeremote-server/src/api-types
// Copying this file would not be needed when an Nx monorepo is used to combine front-end and back-end

export type SimpleDownloadState = "paused" | "downloading" | "invalid";

export interface DownloadItem {
    id: number;
    name: string;
    percentage: number;
    state: string;
    simpleState: SimpleDownloadState;
    size: string;
    downloadSpeed: string;
    uploadSpeed: string;
    eta: string;
}
