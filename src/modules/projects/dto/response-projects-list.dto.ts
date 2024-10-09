import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsNumber, IsString } from 'class-validator'

export class ResponseProjectsListDTO {
    @ApiProperty({ type: Number, description: 'The project ID', example: 1 })
    @IsNumber()
    id: number

    @ApiProperty({ type: String, description: 'The project name', example: 'Project 1' })
    @IsString()
    name: string

    @ApiProperty({ type: Number, description: 'The owner ID', example: 1 })
    @IsNumber()
    creator_id: number

    @ApiProperty({ type: [Number], description: 'The members IDs', example: [1, 2] })
    @IsNumber({}, { each: true })
    members: Array<number>

    @ApiProperty({ type: Date, description: 'The creation date', example: '2021-06-15T12:00:00.000Z' })
    @IsDate()
    createdAt?: Date

    constructor(data: { id: number; name: string; creator_id: number; members: Array<number>; createdAt?: Date }) {
        this.id = data.id
        this.name = data.name
        this.creator_id = data.creator_id
        this.members = data.members
        this.createdAt = data.createdAt
    }

    toString(): string {
        return JSON.stringify(this)
    }
}
