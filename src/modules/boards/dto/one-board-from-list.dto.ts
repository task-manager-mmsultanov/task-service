import { ApiProperty } from '@nestjs/swagger'
import { OneColumnFromListDTO } from '../../columns/dto/one-column-from-list.dto'

export class OneBoardFromListDTO {
    @ApiProperty({ example: 1, description: 'Unique identifier of the board', type: 'integer' })
    id: number
    @ApiProperty({ example: 'Board 1', description: 'Name of the board', type: 'string' })
    name: string
    @ApiProperty({ example: 1, description: 'Unique identifier of the project', type: 'integer' })
    projectId: number
    @ApiProperty({ example: '2022-01-01T00:00:00.000Z', description: 'Date of creation', type: 'string' })
    createdAt?: Date
    @ApiProperty({ type: [OneColumnFromListDTO] })
    columns: Array<OneColumnFromListDTO>

    constructor(data: { id: number; name: string; projectId: number; createdAt?: Date; columns: Array<OneColumnFromListDTO> }) {
        this.id = data.id
        this.name = data.name
        this.projectId = data.projectId
        this.createdAt = data.createdAt
        this.columns = Array.isArray(data.columns) ? data.columns.map((column) => new OneColumnFromListDTO(column)) : []
    }

    toString(): string {
        return JSON.stringify(this)
    }
}
