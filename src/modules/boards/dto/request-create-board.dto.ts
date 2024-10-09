import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

export class RequestCreateBoardDTO {
    @ApiProperty({ example: 'Board 1', description: 'Name of the board', required: true })
    @IsString()
    name: string

    @ApiProperty({ example: 1, description: 'Project ID', required: true })
    @IsNumber()
    projectId: number
}
