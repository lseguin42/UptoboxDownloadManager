interface IDownload {
    id: string
    status: string
    recv: number
    size: number
    name: string
    link: string
}

interface IDownloadUpdate {
    status?: string
    recv?: number
    size?: number
    name?: string
    link?: string
}