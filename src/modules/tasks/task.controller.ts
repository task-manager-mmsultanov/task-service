import { Controller, HttpCode, HttpException, HttpStatus } from '@nestjs/common'
import { TaskService } from './task.service'
import { RequestCreateTaskDTO } from './dto/request-create-task.dto'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ResponseCreateTaskDTO } from './dto/response-create-task.dto'
import { OneTaskFromListDTO } from './dto/one-task-from-list.dto'
import { MessagePattern, Payload } from '@nestjs/microservices'

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
    constructor(private readonly taskService: TaskService) {}

    /**
     * Creates a new task.
     *
     * @param payload - The payload containing the details of the task to be created.
     * @returns A promise that resolves to the response containing the created task.
     */
    @ApiResponse({ status: 201, description: 'Task created successfully', type: ResponseCreateTaskDTO })
    @ApiOperation({ summary: 'Create task' })
    @HttpCode(HttpStatus.CREATED)
    @MessagePattern('task.create')
    async create_task(@Payload() payload: RequestCreateTaskDTO): Promise<ResponseCreateTaskDTO | HttpException> {
        const response = await this.taskService.create_task(payload)
        if (response instanceof HttpException) {
            return new HttpException(response.message, response.getStatus())
        }
        return new ResponseCreateTaskDTO(response)
    }

    /**
     * Retrieves all tasks from board.
     *
     * @param board_id - The unique identifier of the board.
     * @returns A promise that resolves to an array of tasks.
     */
    @ApiResponse({ status: 200, description: 'Tasks retrieved successfully', type: [OneTaskFromListDTO] })
    @ApiOperation({ summary: 'Get all tasks' })
    @HttpCode(HttpStatus.OK)
    @MessagePattern('task.get_tasks_by_board_id')
    async get_tasks(@Payload('board_id') board_id: number): Promise<Array<OneTaskFromListDTO>> {
        const response = await this.taskService.get_tasks(board_id)
        return response.map((task) => new OneTaskFromListDTO(task))
    }

    /**
     * Retrieves a task by its unique identifier.
     *
     * @param task_id - The unique identifier of the task.
     * @returns A promise that resolves to the task.
     */
    @ApiResponse({ status: 200, description: 'Task retrieved successfully', type: OneTaskFromListDTO })
    @ApiOperation({ summary: 'Get task' })
    @HttpCode(HttpStatus.OK)
    @MessagePattern('task.get_by_id')
    async get_task(@Payload() task_id: number): Promise<OneTaskFromListDTO | HttpException> {
        const response = await this.taskService.get_task(task_id)
        if (response instanceof HttpException) {
            return new HttpException(response.message, response.getStatus())
        }
        return new OneTaskFromListDTO(response)
    }

    /**
     * Updates a task by its unique identifier.
     *
     * @param task_id - The unique identifier of the task.
     * @param payload - The payload containing the details of the task to be updated.
     * @returns A promise that resolves to the updated task.
     */
    @ApiResponse({ status: 200, description: 'Task updated successfully', type: OneTaskFromListDTO })
    @ApiOperation({ summary: 'Update task' })
    @ApiBody({ type: RequestCreateTaskDTO })
    @HttpCode(HttpStatus.OK)
    @MessagePattern('task.update')
    async update_task(@Payload() payload: Partial<RequestCreateTaskDTO>): Promise<OneTaskFromListDTO | HttpException> {
        const id = payload['id']
        const data = payload['payload']
        const response = await this.taskService.update_task(id, data)
        if (response instanceof HttpException) {
            return new HttpException(response.message, response.getStatus())
        }
        return new OneTaskFromListDTO(response)
    }

    /**
     * Deletes a task by its unique identifier.
     *
     * @param task_id - The unique identifier of the task.
     * @returns A promise that resolves to void.
     */
    @ApiResponse({ status: 204, description: 'Task deleted successfully' })
    @ApiOperation({ summary: 'Delete task' })
    @HttpCode(HttpStatus.NO_CONTENT)
    @MessagePattern('task.delete')
    async delete_task(@Payload() task_id: number): Promise<void> {
        return this.taskService.delete_task(task_id)
    }
}
