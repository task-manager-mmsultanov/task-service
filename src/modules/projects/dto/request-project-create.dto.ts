import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

export class RequestProjectCreate {
    @ApiProperty({ example: 'Project name', description: 'Project name', required: true })
    @IsString()
    name: string

    @ApiProperty({ example: 1, description: 'Creator id', required: true })
    @IsNumber()
    creator_id: number

    @ApiProperty({ example: [1], description: 'Members id', required: true })
    @IsNumber({}, { each: true })
    members: Array<number>
}
