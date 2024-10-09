import { BelongsTo, Column, Model, Table } from 'sequelize-typescript'
import { ColumnModel } from '../../columns/models/column.model'

@Table({
    tableName: 'tasks',
    timestamps: true,
    paranoid: true
})
export class TaskModel extends Model<TaskModel> {
    @Column({ primaryKey: true, autoIncrement: true })
    id: number

    @Column({ allowNull: false })
    title: string

    @Column({ allowNull: true })
    description: string

    @Column({ allowNull: false, defaultValue: 'To Do' })
    status: string // Значения: 'To Do', 'In Progress', 'Done'

    @Column({ allowNull: false, defaultValue: 'medium' })
    priority: string // Значения: 'low', 'medium', 'high'

    @Column({ allowNull: false })
    assignee_id: number // ID исполнителя

    @BelongsTo(() => ColumnModel, { foreignKey: 'column_id' })
    column: number

    @Column({ allowNull: true, defaultValue: 0 })
    order: number

    @Column({ allowNull: true, defaultValue: null })
    due_date: Date // Срок выполнения
}
