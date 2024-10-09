import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Patch, Post } from '@nestjs/common'
import { ColumnsService } from './columns.service'
import { RequestCreateColumnDTO } from './dto/request-create-column.dto'
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ResponseCreateColumnDTO } from './dto/response-create-column.dto'
import { ResponseColumnsListDTO } from './dto/response-columns-list.dto'
import { RequestPatchColumnDTO } from './dto/request-patch-column.dto'
import { MessagePattern, Payload } from '@nestjs/microservices'

@ApiTags('Columns')
@Controller('columns')
export class ColumnsController {
    constructor(private readonly column_service: ColumnsService) {}

    /**
     * Creates a new column.
     *
     * @param payload - The payload containing the data for the new column.
     * @returns A promise that resolves to the response containing the created column.
     */
    @ApiResponse({ status: 201, description: 'Column created successfully', type: ResponseCreateColumnDTO })
    @ApiOperation({ summary: 'Create a new column' })
    @ApiBody({ type: RequestCreateColumnDTO })
    @HttpCode(HttpStatus.CREATED)
    @MessagePattern('columns.create')
    @Post()
    async create_column(@Payload() payload: RequestCreateColumnDTO): Promise<ResponseCreateColumnDTO | HttpException> {
        const response = await this.column_service.create(payload, null)
        if (response instanceof HttpException) {
            return new HttpException(response.message, response.getStatus())
        }
        return new ResponseCreateColumnDTO(response)
    }

    /**
     * Retrieves the columns for a given board.
     *
     * @param board_id - The ID of the board.
     * @returns A promise that resolves to an array of ResponseColumnsListDTO objects representing the columns.
     */
    @ApiResponse({ status: 200, description: 'Columns retrieved successfully', type: [ResponseColumnsListDTO] })
    @ApiParam({ name: 'board_id', description: 'The ID of the board to get columns for', type: 'integer' })
    @ApiOperation({ summary: 'Get columns by board ID' })
    @HttpCode(HttpStatus.OK)
    @MessagePattern('columns.get_columns_by_id')
    async get_columns(@Payload('board_id') board_id: number): Promise<Array<ResponseColumnsListDTO> | HttpException> {
        const response = await this.column_service.get_columns_by_id(board_id)
        if (response instanceof HttpException) {
            return new HttpException(response.message, response.getStatus())
        }
        return response.map((column) => new ResponseColumnsListDTO(column))
    }

    /**
     * Retrieves a column by its ID.
     *
     * @param id - The ID of the column.
     * @returns A promise that resolves to a ResponseColumnsListDTO object if successful, or an HttpException object if an error occurs.
     */
    @ApiResponse({ status: 200, description: 'Column retrieved successfully', type: ResponseColumnsListDTO })
    @ApiParam({ name: 'id', description: 'The ID of the column to get', type: 'integer' })
    @ApiOperation({ summary: 'Get a column by ID' })
    @HttpCode(HttpStatus.OK)
    @MessagePattern('columns.get_column_by_id')
    async get_column(@Payload('id') id: number): Promise<ResponseColumnsListDTO | HttpException> {
        const response = await this.column_service.get_column_by_id(id)
        if (response instanceof HttpException) {
            return new HttpException(response.message, response.getStatus())
        }
        return new ResponseColumnsListDTO(response)
    }

    /**
     * Updates a column.
     *
     * @param id - The ID of the column.
     * @param payload - The payload containing the updated column data.
     * @returns A promise that resolves to the updated column data or an HttpException if an error occurs.
     */
    @ApiResponse({ status: 200, description: 'Column updated successfully', type: ResponseColumnsListDTO })
    @ApiParam({ name: 'id', description: 'The ID of the column to update', type: 'integer' })
    @ApiOperation({ summary: 'Update a column by ID' })
    @ApiBody({ type: RequestPatchColumnDTO })
    @HttpCode(HttpStatus.OK)
    @MessagePattern('columns.update_column')
    async update_column(@Payload() payload: RequestPatchColumnDTO): Promise<ResponseColumnsListDTO | HttpException> {
        const id = payload['id']
        const data = payload['payload']
        const response = await this.column_service.update_column(id, data)
        if (response instanceof HttpException) {
            return new HttpException(response.message, response.getStatus())
        }
        return new ResponseColumnsListDTO(response)
    }

    /**
     * Deletes a column by its ID.
     *
     * @param id - The ID of the column to delete.
     * @returns A promise that resolves when the column is successfully deleted.
     */
    @ApiResponse({ status: 204, description: 'Column deleted successfully' })
    @ApiParam({ name: 'id', description: 'The ID of the column to delete', type: 'integer' })
    @ApiOperation({ summary: 'Delete a column by ID' })
    @HttpCode(HttpStatus.NO_CONTENT)
    @MessagePattern('columns.delete_column')
    async delete_column(@Payload('id') id: number): Promise<void> {
        await this.column_service.delete_column(id)
    }
}
