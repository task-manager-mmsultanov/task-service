import { Column, HasMany, Model, Table, DataType } from 'sequelize-typescript'
import { BoardModel } from '../../boards/models/board.model'

@Table({
    tableName: 'projects',
    timestamps: true,
    paranoid: true
})
export class ProjectsModel extends Model<ProjectsModel> {
    @Column({
        primaryKey: true,
        autoIncrement: true
    })
    id: number

    @Column({ allowNull: false })
    name: string

    @Column({ allowNull: false })
    creator_id: number

    @Column({
        allowNull: true,
        defaultValue: [],
        type: DataType.ARRAY(DataType.INTEGER)
    })
    members: Array<number>

    @HasMany(() => BoardModel, { foreignKey: 'projectId' }) // Один проект может иметь много досок
    boards: Array<BoardModel>
}
