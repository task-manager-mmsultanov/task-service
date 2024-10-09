export interface ResponseCreateTaskInterface {
    title: string
    description: string
    status: string
    priority: string
    assignee_id: number
    due_date: Date
    createdAt?: Date
    updatedAt?: Date
}
