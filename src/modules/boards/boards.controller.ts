import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Patch, Post } from '@nestjs/common'
import { BoardService } from './boards.service'
import { RequestCreateBoardDTO } from './dto/request-create-board.dto'
import { ApiBody, ApiOperation, ApiParam, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ResponseCreateBoardDTO } from './dto/response-create-board.dto'
import { OneBoardFromListDTO } from './dto/one-board-from-list.dto'
import { MessagePattern, Payload } from '@nestjs/microservices'

@ApiTags('boards')
@Controller('boards')
export class BoardController {
    constructor(private readonly boardService: BoardService) {}

    /**
     * Creates a new board.
     *
     * @param payload - The payload containing the information for creating the board.
     * @returns A promise that resolves to the response containing the created board.
     */
    @ApiBody({ type: RequestCreateBoardDTO })
    @ApiResponse({ status: 201, description: 'Board created', type: ResponseCreateBoardDTO })
    @ApiOperation({ summary: 'Create board', operationId: 'createBoard' })
    @HttpCode(HttpStatus.CREATED)
    @MessagePattern('boards.create_board')
    async create_board(@Payload() body: RequestCreateBoardDTO): Promise<ResponseCreateBoardDTO | HttpException> {
        const response = await this.boardService.create(body)
        if (response instanceof HttpException) {
            return new HttpException(response.message, response.getStatus())
        }
        return new ResponseCreateBoardDTO(response)
    }

    /**
     * Retrieves all boards.
     * @returns A promise that resolves to an array of OneBoardFromListDTO objects.
     */
    @ApiResponse({ status: 200, description: 'List of boards', type: [OneBoardFromListDTO] })
    @ApiOperation({ summary: 'List of boards', operationId: 'listBoards' })
    @HttpCode(HttpStatus.OK)
    @MessagePattern('boards.get_all_boards')
    async get_all_boards(): Promise<Array<OneBoardFromListDTO> | HttpException> {
        const response = await this.boardService.list()
        if (response instanceof HttpException) {
            return new HttpException(response.message, response.getStatus())
        }
        return response.map((board) => new OneBoardFromListDTO(board))
    }

    /**
     * Retrieves a board by its ID.
     *
     * @param id - The ID of the board to retrieve.
     * @returns A Promise that resolves to a OneBoardFromListDTO representing the retrieved board.
     */
    @ApiResponse({ status: 200, description: 'Board by id', type: OneBoardFromListDTO })
    @ApiOperation({ summary: 'Get board by id', operationId: 'getBoardById' })
    @ApiParam({ name: 'id', type: 'integer', required: true })
    @HttpCode(HttpStatus.OK)
    @MessagePattern('boards.get_board_by_id')
    async get_board_by_id(@Payload('id') id: number): Promise<OneBoardFromListDTO | HttpException> {
        const response = await this.boardService.get_by_id(id)
        if (response instanceof HttpException) {
            return new HttpException(response.message, response.getStatus())
        }
        return new OneBoardFromListDTO(response)
    }

    /**
     * Updates a board.
     *
     * @param id - The ID of the board to update.
     * @param payload - The payload containing the updated board information.
     * @returns A promise that resolves to a string or an HttpException.
     */
    @ApiOperation({ summary: 'Update board', operationId: 'updateBoard' })
    @ApiResponse({ status: 200, description: 'Board updated' })
    @ApiParam({ name: 'id', type: 'integer', required: true })
    @ApiBody({ type: RequestCreateBoardDTO })
    @HttpCode(HttpStatus.OK)
    @MessagePattern('boards.update_board')
    async update_board(@Payload() payload: { id: number; name: string; projectId: number }): Promise<string | HttpException> {
        const id = payload.id
        const data = { ...payload['payload'], id }
        const response = this.boardService.patch(id, data)
        if (response instanceof HttpException) {
            return new HttpException(response.message, response.getStatus())
        }
        return response
    }

    /**
     * Deletes a board.
     *
     * @param id - The ID of the board to delete.
     * @returns A promise that resolves to a string or an HttpException.
     */
    @ApiOperation({ summary: 'Delete board', operationId: 'deleteBoard' })
    @ApiResponse({ status: 200, description: 'Board deleted' })
    @ApiParam({ name: 'id', type: 'integer', required: true })
    @HttpCode(HttpStatus.NO_CONTENT)
    @MessagePattern('boards.delete_board')
    async delete_board(@Payload('id') id: number): Promise<string | HttpException> {
        const response = this.boardService.delete(id)
        if (response instanceof HttpException) {
            return new HttpException(response.message, response.getStatus())
        }
        return response
    }
}
