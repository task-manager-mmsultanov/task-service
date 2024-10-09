import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { BoardModel } from './models/board.model'
import { RequestCreateBoardInterface } from './interface/request-create-board.interface'
import { ResponseCreateBoardInterface } from './interface/response-create-board.interface'
import { ColumnsService } from '../columns/columns.service'
import { ColumnModel } from '../columns/models/column.model'
import { OneBoardFromListInterface } from './interface/one-board-from-list.interface'
import { ProjectsModel } from '../projects/models/project.model'
import { TaskModel } from '../tasks/models/task.model'

@Injectable()
export class BoardService {
    constructor(
        @InjectModel(BoardModel) private boardModel: typeof BoardModel,
        @InjectModel(ProjectsModel) private ProjectModel: typeof ProjectsModel,
        private readonly columnService: ColumnsService
    ) {}

    /**
     * Creates default columns for a board.
     *
     * @param boardId - The ID of the board.
     * @param transaction - The transaction object for database operations.
     * @throws {Error} If an error occurs while creating the columns.
     */
    private async create_default_columns(boardId: number, transaction: any) {
        try {
            const columns = await Promise.all([
                this.columnService.create({ name: 'To Do', order: 0, board_id: boardId }, transaction),
                this.columnService.create({ name: 'In Progress', order: 1, board_id: boardId }, transaction),
                this.columnService.create({ name: 'Done', order: 2, board_id: boardId }, transaction),
                this.columnService.create({ name: 'Testing', order: 3, board_id: boardId }, transaction)
            ])
        } catch (error) {
            throw error
        }
    }

    /**
     * Creates a new board.
     *
     * @param payload - The payload containing the data for the new board.
     * @returns A promise that resolves to the created board.
     * @throws If an error occurs during the creation process.
     */
    async create(payload: RequestCreateBoardInterface): Promise<ResponseCreateBoardInterface | HttpException> {
        const transaction = await this.boardModel.sequelize.transaction()
        try {
            const project_exists = await this.ProjectModel.findByPk(payload.projectId)
            if (!project_exists) {
                await transaction.rollback()
                return new HttpException('Project not found', HttpStatus.NOT_FOUND)
            }
            const board = await this.boardModel.create(payload, { transaction })
            const id = board.id
            await this.create_default_columns(id, transaction)
            await transaction.commit()
            return board
        } catch (error) {
            await transaction.rollback()
            throw error
        }
    }

    /**
     * Retrieves a list of boards along with their columns.
     * @returns A promise that resolves to an array of OneBoardFromListInterface.
     */
    async list(): Promise<Array<OneBoardFromListInterface> | HttpException> {
        try {
            const response = await this.boardModel.findAll({
                include: [
                    {
                        model: ColumnModel,
                        as: 'columns'
                    }
                ],
                order: [['id', 'DESC']]
            })
            return response
        } catch (error) {
            return new HttpException('An error occurred while fetching the boards', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    /**
     * Retrieves a board by its ID.
     *
     * @param id - The ID of the board to retrieve.
     * @returns A promise that resolves to the retrieved board or an HttpException if the board is not found or an error occurs.
     */
    async get_by_id(id: number): Promise<OneBoardFromListInterface | HttpException> {
        try {
            const get_board = await this.boardModel.findByPk(Number(id), {
                include: [
                    {
                        model: ColumnModel,
                        as: 'columns',
                        include: [{ model: TaskModel, as: 'tasks' }]
                    }
                ]
            })

            if (!get_board) {
                return new HttpException('Board not found', HttpStatus.NOT_FOUND)
            }
            return get_board
        } catch (error) {
            throw new HttpException('An error occurred while fetching the board', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    /**
     * Updates a board with the specified ID.
     *
     * @param id - The ID of the board to update.
     * @param payload - The payload containing the new name and project ID.
     * @returns A promise that resolves to a string indicating the success of the update or an HttpException if an error occurs.
     */
    async patch(id: number, payload: { name: string; projectId: number }): Promise<string | HttpException> {
        const existsProject = await this.ProjectModel.findByPk(payload.projectId)
        if (!existsProject) {
            return new HttpException('Project not found', HttpStatus.NOT_FOUND)
        }
        const response = await this.boardModel.update(payload, { where: { id } })
        if (response[0] === 0) {
            return new HttpException('Board not found', HttpStatus.NOT_FOUND)
        }
        return 'Board updated'
    }

    /**
     * Deletes a board by its ID.
     *
     * @param id - The ID of the board to delete.
     * @returns A promise that resolves to a string indicating the result of the deletion or an HttpException if the board is not found.
     */
    async delete(id: number): Promise<string | HttpException> {
        const response = await this.boardModel.destroy({ where: { id } })
        if (response === 0) {
            return new HttpException('Board not found', HttpStatus.NOT_FOUND)
        }
        return 'Board deleted'
    }

    /**
     * Retrieves an array of boards based on the provided board IDs.
     *
     * @param board_ids - An array of board IDs to fetch.
     * @returns A promise that resolves to an array of BoardModel objects.
     * @throws If there is an error fetching the boards.
     */
    async get_boards_by_ids(board_ids: Array<number>): Promise<Array<BoardModel>> {
        try {
            const boards = await BoardModel.findAll({ where: { id: board_ids } })
            return boards
        } catch (error) {
            throw new Error(`Error fetching boards: ${error.message}`)
        }
    }
}
