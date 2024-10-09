import { ApiProperty } from '@nestjs/swagger'
import { TaskPriorityEnum } from '../enum/task-priority.enum'
import { TaskStatusEnum } from '../enum/task-status.enum'

export class OneTaskFromListDTO {
    @ApiProperty({ example: 1, description: 'Unique identifier of the task', type: 'integer' })
    id: number
    @ApiProperty({ example: 1, description: 'Unique identifier of the task', type: 'integer' })
    title: string
    @ApiProperty({ example: 'Task 1', description: 'Name of the task', type: 'string' })
    description: string
    @ApiProperty({ example: 'todo', description: 'Status of the task', type: 'string', enum: TaskStatusEnum })
    status: string
    @ApiProperty({ example: 'low', description: 'Priority of the task', type: 'string', enum: TaskPriorityEnum })
    priority: string
    @ApiProperty({ example: 1, description: 'Unique identifier of the assignee', type: 'integer' })
    assignee_id: number
    @ApiProperty({ example: 1, description: 'Order of the task', type: 'integer' })
    order: number
    @ApiProperty({ example: '2022-01-01T00:00:00.000Z', description: 'Due date of the task', type: 'string' })
    due_date: Date
    @ApiProperty({ example: '2022-01-01T00:00:00.000Z', description: 'Date of creation', type: 'string' })
    createdAt?: Date

    constructor(data: {
        id: number
        title: string
        description: string
        status: string
        priority: string
        assignee_id: number
        due_date: Date
        order: number
        createdAt?: Date
    }) {
        this.id = data.id
        this.title = data.title
        this.description = data.description
        this.status = data.status
        this.priority = data.priority
        this.due_date = data.due_date
        this.order = data.order
        this.createdAt = data.createdAt
    }

    toString(): string {
        return JSON.stringify(this)
    }
}
