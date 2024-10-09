export interface OneTaskFromListInterface {
    id: number
    title: string
    description: string
    status: string
    priority: string
    assignee_id: number
    order: number
    due_date: Date
    createdAt?: Date
}
