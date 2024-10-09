import { TaskPriorityEnum } from '../enum/task-priority.enum'
import { TaskStatusEnum } from '../enum/task-status.enum'

export interface RequestCreateTaskInterface {
    title: string
    description: string
    status: TaskStatusEnum
    priority: TaskPriorityEnum
    assignee_id: number
    column_id: number
    due_date: Date
    order: number
}
