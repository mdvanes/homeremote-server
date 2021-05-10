// This file is copied from homeremote-server/src/api-types

// TODO share types between back-end and front-end, via homeremote-plugins?
export type DownloadStatus = "paused" | "Stopped" | "Downloading";

export interface DownloadItem {
    id: number;
    name: string;
    percentage: number;
    status: DownloadStatus;
    size: string;
    downloadSpeed: number;
    uploadSpeed: number;
    eta: number;
}
