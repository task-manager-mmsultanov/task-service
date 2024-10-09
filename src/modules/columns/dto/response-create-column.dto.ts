import { ApiProperty } from '@nestjs/swagger'

export class ResponseCreateColumnDTO {
    @ApiProperty({ example: 1, description: 'Id of the column', type: 'integer' })
    id: number
    @ApiProperty({ example: 'Column 1', description: 'Name of the column', type: 'string' })
    name: string
    @ApiProperty({ example: 1, description: 'Order of the column', type: 'integer' })
    order: number
    @ApiProperty({ example: '2021-09-20T15:00:00.000Z', description: 'Date and time the column was created', type: 'string' })
    createdAt?: Date

    constructor(data: { id: number; name: string; order: number; createdAt?: Date }) {
        this.id = data.id
        this.name = data.name
        this.order = data.order
        this.createdAt = data.createdAt
    }

    toString(): string {
        return JSON.stringify(this)
    }
}
