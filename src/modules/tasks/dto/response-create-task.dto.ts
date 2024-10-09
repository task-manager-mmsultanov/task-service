import { ApiProperty } from '@nestjs/swagger'
import { TaskStatusEnum } from '../enum/task-status.enum'
import { TaskPriorityEnum } from '../enum/task-priority.enum'

export class ResponseCreateTaskDTO {
    @ApiProperty({ example: 'Task 1', description: 'Title of the task', type: String })
    title: string
    @ApiProperty({ example: 'Description of task 1', description: 'Description of the task', type: String })
    description: string
    @ApiProperty({ example: 'todo', description: 'Status of the task', type: String, enum: TaskStatusEnum })
    status: string
    @ApiProperty({ example: 'low', description: 'Priority of the task', type: String, enum: TaskPriorityEnum })
    priority: string
    @ApiProperty({ example: 1, description: 'Assignee ID of the task', type: Number })
    assignee_id: number
    @ApiProperty({ example: '2021-12-31', description: 'Due date of the task', type: Date })
    due_date: Date
    @ApiProperty({ example: '2021-12-31T00:00:00.000Z', description: 'Date when the task was created', type: Date })
    createdAt?: Date
    @ApiProperty({ example: '2021-12-31T00:00:00.000Z', description: 'Date when the task was updated', type: Date })
    updatedAt?: Date

    constructor(data: {
        title: string
        description: string
        status: string
        priority: string
        assignee_id: number
        due_date: Date
        createdAt?: Date
        updatedAt?: Date
    }) {
        this.title = data.title
        this.description = data.description
        this.status = data.status
        this.priority = data.priority
        this.assignee_id = data.assignee_id
        this.due_date = data.due_date
        this.createdAt = data.createdAt
        this.updatedAt = data.updatedAt
    }

    toString(): string {
        return JSON.stringify(this)
    }
}
