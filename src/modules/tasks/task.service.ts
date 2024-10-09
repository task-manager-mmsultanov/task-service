import { HttpException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { TaskModel } from './models/task.model'
import { ResponseCreateTaskInterface } from './interface/response-create-task.interface'
import { BoardService } from '../boards/boards.service'
import { OneTaskFromListInterface } from './interface/one-task-from-list.interface'
import { RequestCreateTaskInterface } from './interface/request-create-task.interface'

@Injectable()
export class TaskService {
    constructor(
        @InjectModel(TaskModel) private taskModel: typeof TaskModel,
        private readonly boardService: BoardService
    ) {}

    /**
     * Creates a new task.
     *
     * @param payload - The payload containing the task details.
     * @returns A promise that resolves to the created task.
     * @throws If an error occurs while creating the task.
     */
    async create_task(payload: RequestCreateTaskInterface): Promise<ResponseCreateTaskInterface | HttpException> {
        const transaction = await this.taskModel.sequelize.transaction()
        try {
            const task = await this.taskModel.create(payload, { transaction })
            await transaction.commit()
            return task
        } catch (error) {
            await transaction.rollback()
            return new HttpException(error.message, 500)
        }
    }

    /**
     * Retrieves all tasks from a specific board.
     *
     * @param board_id - The ID of the board to retrieve tasks from.
     * @returns A promise that resolves to an array of tasks from the specified board.
     * @throws {HttpException} If the board is not found.
     */
    async get_tasks(board_id: number): Promise<Array<OneTaskFromListInterface>> {
        const board = await this.boardService.get_by_id(board_id)
        if (!board) {
            throw new HttpException('Board not found', 404)
        }
        if (!board['columns']) {
            throw new HttpException('Board not found', 404)
        }

        const boards = board['columns']
        const tasks = []
        for (const column of boards) {
            tasks.push(...column['tasks'])
        }
        return tasks
    }

    /**
     * Retrieves a task by its ID.
     *
     * @param task_id - The ID of the task to retrieve.
     * @returns A promise that resolves to the task object.
     * @throws {HttpException} If the task is not found.
     */
    async get_task(task_id: number): Promise<OneTaskFromListInterface | HttpException> {
        const task = await this.taskModel.findByPk(task_id)
        if (!task) {
            return new HttpException('Task not found', 404)
        }
        return task
    }

    /**
     * Updates a task with the given task ID and payload.
     *
     * @param task_id - The ID of the task to update.
     * @param payload - The partial task data to update.
     * @returns A promise that resolves to the updated task.
     * @throws {HttpException} If the task is not found.
     */
    async update_task(task_id: number, payload: Partial<RequestCreateTaskInterface>): Promise<OneTaskFromListInterface | HttpException> {
        const task = await this.taskModel.findByPk(task_id)
        if (!task) {
            return new HttpException('Task not found', 404)
        }
        const transaction = await this.taskModel.sequelize.transaction()
        try {
            await task.update(payload, { transaction })
            await transaction.commit()
            return task
        } catch (error) {
            await transaction.rollback()
            throw error
        }
    }

    /**
     * Deletes a task by its ID.
     *
     * @param task_id - The ID of the task to be deleted.
     * @returns A Promise that resolves to void.
     * @throws HttpException if the task is not found.
     */
    async delete_task(task_id: number): Promise<void> {
        const task = await this.taskModel.findByPk(task_id)
        if (!task) {
            throw new HttpException('Task not found', 404)
        }
        const transaction = await this.taskModel.sequelize.transaction()
        try {
            await task.destroy({ transaction })
            await transaction.commit()
        } catch (error) {
            await transaction.rollback()
            throw error
        }
    }
}
