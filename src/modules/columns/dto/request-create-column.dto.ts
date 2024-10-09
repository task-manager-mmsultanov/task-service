import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

export class RequestCreateColumnDTO {
    @ApiProperty({ example: 'To Do', description: 'Name of the column' })
    @IsString()
    name: string

    @ApiProperty({ example: 1, description: 'Order of the column' })
    @IsNumber()
    order: number

    @ApiProperty({ example: [1], description: 'Array of board IDs' })
    @IsNumber({}, { each: true })
    boards?: Array<number>

    @ApiProperty({ example: 1, description: 'ID of the board' })
    @IsNumber()
    board_id: number
}
