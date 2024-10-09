import { HttpException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { ColumnModel } from './models/column.model'
import { RequestCreateColumnInterface } from './interface/request-create-column.interface'
import { ResponseCreateColumnInterface } from './interface/response-create-column.interface'
import { BoardModel } from '../boards/models/board.model'
import { ResponseColumnsListInterface } from './interface/response-columns-list.interface'
import { TaskModel } from '../tasks/models/task.model'

@Injectable()
export class ColumnsService {
    constructor(@InjectModel(ColumnModel) private readonly columnModel: typeof ColumnModel) {}

    /**
     * Creates a new column with the given payload and associates it with the specified board.
     *
     * @param payload - The data for creating the column.
     * @param boardId - The ID of the board to associate the column with.
     * @param transaction - Optional transaction object for performing the operation within a transaction.
     * @returns A promise that resolves to the created column.
     * @throws Throws an error if an error occurs during the operation.
     */
    async create(payload: RequestCreateColumnInterface, transaction?: any): Promise<ResponseCreateColumnInterface | HttpException> {
        try {
            const board_exists = await BoardModel.findByPk(payload.board_id)
            if (!board_exists) {
                return new HttpException('Board not found', 404)
            }
            const column_without_board_id = { ...payload, board_id: undefined }
            if (!transaction) {
                transaction = await this.columnModel.sequelize.transaction()
                const column = await this.columnModel.create(column_without_board_id, { transaction })
                await column.$add('boards', payload.board_id, { transaction })
                await transaction.commit()
                return column
            } else {
                const column = await this.columnModel.create(column_without_board_id, { transaction })
                await column.$add('boards', payload.board_id, { transaction })
                return column
            }
        } catch (error) {
            throw error
        }
    }

    /**
     * Retrieves columns by board ID.
     *
     * @param boardId - The ID of the board.
     * @returns A promise that resolves to an array of columns.
     * @throws If there is an error fetching the columns.
     */
    async get_columns_by_id(boardId: number): Promise<Array<ResponseColumnsListInterface> | HttpException> {
        try {
            const columns = await this.columnModel.findAll({
                include: [
                    {
                        model: BoardModel,
                        as: 'boards',
                        through: { attributes: [] },
                        where: { id: boardId }
                    }
                ]
            })
            if (!columns || columns.length === 0) {
                return new HttpException('Columns not found', 404)
            }
            return columns
        } catch (error) {
            throw new Error(`Error fetching columns for board ${boardId}: ${error.message}`)
        }
    }

    /**
     * Retrieves a column by its ID.
     *
     * @param column_id - The ID of the column to retrieve.
     * @returns A promise that resolves to the retrieved column or an HttpException if the column is not found.
     * @throws An error if there was an issue fetching the column.
     */
    async get_column_by_id(column_id: number): Promise<ResponseColumnsListInterface | HttpException> {
        try {
            const column = await this.columnModel.findByPk(column_id, {
                include: [
                    {
                        model: TaskModel,
                        as: 'tasks',
                        attributes: ['title', 'description', 'status', 'priority', 'due_date', 'order', 'column_id']
                    }
                ]
            })
            if (!column) return new HttpException('Column not found', 404)
            return column
        } catch (error) {
            throw new Error(`Error fetching column ${column_id}: ${error.message}`)
        }
    }

    /**
     * Updates a column with the specified column_id using the provided payload.
     *
     * @param column_id - The ID of the column to be updated.
     * @param payload - The partial data to update the column with.
     * @returns A promise that resolves to the updated column or an HttpException if the column is not found.
     * @throws An error if there is an issue updating the column.
     */
    async update_column(column_id: number, payload: Partial<RequestCreateColumnInterface>): Promise<ResponseColumnsListInterface | HttpException> {
        const transaction = await this.columnModel.sequelize.transaction()
        try {
            const column = await this.columnModel.findByPk(Number(column_id), { transaction })
            if (!column) return new HttpException('Column not found', 404)
            await column.update(payload, { transaction })
            await transaction.commit()
            return column
        } catch (error) {
            await transaction.rollback()
            throw new Error(`Error updating column ${column_id}: ${error.message}`)
        }
    }

    /**
     * Deletes a column by its ID.
     *
     * @param column_id - The ID of the column to delete.
     * @returns A promise that resolves when the column is deleted.
     */
    async delete_column(column_id: number): Promise<void> {
        await this.columnModel.destroy({ where: { id: column_id } })
    }
}
