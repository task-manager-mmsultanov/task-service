import { BelongsTo, BelongsToMany, Column, HasOne, Model, Table } from 'sequelize-typescript'
import { ColumnModel } from '../../columns/models/column.model'
import { ProjectsModel } from '../../projects/models/project.model'
import { BoardColumn } from './board-column.model' // Импортируем промежуточную модель

@Table({
    tableName: 'boards',
    timestamps: true,
    paranoid: true
})
export class BoardModel extends Model<BoardModel> {
    @Column({
        primaryKey: true,
        autoIncrement: true
    })
    id: number

    @Column({ allowNull: false })
    name: string

    @BelongsTo(() => ProjectsModel, { foreignKey: 'projectId' }) // Внешний ключ projectId
    project: ProjectsModel

    @Column
    projectId: number // Внешний ключ

    @BelongsToMany(() => ColumnModel, () => BoardColumn) // Промежуточная таблица
    columns: Array<ColumnModel>
}
