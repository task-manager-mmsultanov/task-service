import { OneColumnFromListInterface } from '../..//columns/interface/one-column-from-list.interface'

export interface OneBoardFromListInterface {
    id: number
    name: string
    projectId: number
    createdAt?: Date
    columns: Array<OneColumnFromListInterface>
}
