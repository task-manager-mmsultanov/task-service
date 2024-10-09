import { BelongsToMany, Column, HasMany, Model, Table } from 'sequelize-typescript'
import { TaskModel } from '../../tasks/models/task.model'
import { BoardModel } from '../../boards/models/board.model'
import { BoardColumn } from '../../boards/models/board-column.model' // Промежуточная модель

@Table({
    tableName: 'columns',
    timestamps: true,
    paranoid: true
})
export class ColumnModel extends Model<ColumnModel> {
    @Column({
        primaryKey: true,
        autoIncrement: true
    })
    id: number

    @Column({ allowNull: false })
    name: string

    @HasMany(() => TaskModel, { foreignKey: 'column_id' })
    tasks: Array<TaskModel>

    @Column({ allowNull: false, defaultValue: 0 })
    order: number

    @BelongsToMany(() => BoardModel, () => BoardColumn) // Промежуточная таблица
    boards: Array<BoardModel>
}
