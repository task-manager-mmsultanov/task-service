export class ResponseCreateBoardDTO {
    id: number
    name: string
    createdAt?: Date

    constructor(data: { id: number; name: string; createdAt?: Date }) {
        this.id = data.id
        this.name = data.name
        this.createdAt = data.createdAt
    }

    toString(): string {
        return JSON.stringify(this)
    }
}
