import { Model, Table, Column, ForeignKey } from 'sequelize-typescript'
import { BoardModel } from '../../boards/models/board.model'
import { ColumnModel } from '../../columns/models/column.model'

@Table({
    tableName: 'board_columns',
    timestamps: false
})
export class BoardColumn extends Model<BoardColumn> {
    @ForeignKey(() => BoardModel)
    @Column
    boardId: number // Связываем с полем id из BoardModel

    @ForeignKey(() => ColumnModel)
    @Column
    columnId: number // Связываем с полем id из ColumnModel
}
