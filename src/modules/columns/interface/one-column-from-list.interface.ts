import { OneTaskFromListInterface } from 'src/modules/tasks/interface/one-task-from-list.interface'

export interface OneColumnFromListInterface {
    id: number
    name: string
    order: number
    tasks: Array<OneTaskFromListInterface>
}
