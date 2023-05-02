
type Thumbnail = {
    url: string
    height: number
    width: number
}

export type Category = {
    id: string
    createdAt: string
    updatedAt: string
    publishedAt: string
    revisedAt: string
    category: string
}


export type Recipi = {
    id: string
    createdAt: string
    updatedAt: string
    publishedAt: string
    revisedAt: string
    name: string
    thumbnails: Thumbnail
    ricchText: string
    category: Category[]
}