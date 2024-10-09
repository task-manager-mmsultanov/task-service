export interface ResponseProjectsListInterface {
    id: number
    name: string
    creator_id: number
    members: Array<number>
    createdAt?: Date
}
