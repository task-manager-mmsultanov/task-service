import { ApiProperty } from '@nestjs/swagger'

export class ResponseColumnsListDTO {
    @ApiProperty({ example: 'To Do', description: 'The name of the column', type: String })
    name: string
    @ApiProperty({ example: 1, description: 'The order of the column', type: Number })
    order: number
    @ApiProperty({ example: '2021-09-01T00:00:00.000Z', description: 'The date and time the column was created', type: Date })
    createdAt?: Date

    constructor(data: { name: string; order: number; createdAt?: Date }) {
        this.name = data.name
        this.order = data.order
        this.createdAt = data.createdAt
    }

    toString(): string {
        return JSON.stringify(this)
    }
}
