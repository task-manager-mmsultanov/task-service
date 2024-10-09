import { ApiProperty } from '@nestjs/swagger'
import { OneTaskFromListDTO } from 'src/modules/tasks/dto/one-task-from-list.dto'

export class OneColumnFromListDTO {
    @ApiProperty({ example: 1, description: 'Id of the column', type: 'integer' })
    id: number
    @ApiProperty({ example: 'Column 1', description: 'Name of the column', type: 'string' })
    name: string
    @ApiProperty({ example: 1, description: 'Order of the column', type: 'integer' })
    order: number
    @ApiProperty({ type: [OneTaskFromListDTO] })
    tasks: Array<OneTaskFromListDTO>

    constructor(data: { id: number; name: string; order: number; tasks: Array<OneTaskFromListDTO> }) {
        this.id = data.id
        this.name = data.name
        this.order = data.order
        this.tasks = Array.isArray(data.tasks) ? data.tasks.map((task) => new OneTaskFromListDTO(task)) : []
    }

    toString(): string {
        return JSON.stringify(this)
    }
}
