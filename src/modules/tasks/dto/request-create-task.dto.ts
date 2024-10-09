import { ApiProperty } from '@nestjs/swagger'
import { TaskPriorityEnum } from '../enum/task-priority.enum'
import { TaskStatusEnum } from '../enum/task-status.enum'

export class RequestCreateTaskDTO {
    @ApiProperty({ example: 'Task title', description: 'Task title', required: true })
    title: string
    @ApiProperty({ example: 'Task description', description: 'Task description', required: true })
    description: string
    @ApiProperty({ example: 'To Do', description: 'Task status', required: true, enum: TaskStatusEnum })
    status: TaskStatusEnum
    @ApiProperty({ example: 'low', description: 'Task priority', required: true, enum: TaskPriorityEnum })
    priority: TaskPriorityEnum
    @ApiProperty({ example: 1, description: 'Assignee ID', required: true })
    assignee_id: number
    @ApiProperty({ example: 1, description: 'Project ID', required: true })
    column_id: number
    @ApiProperty({ example: '2021-01-01', description: 'Task due date', required: true })
    due_date: Date
    @ApiProperty({ example: 1, description: 'Task order', required: true })
    order: number
}
