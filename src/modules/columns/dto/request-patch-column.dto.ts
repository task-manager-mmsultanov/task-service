import { ApiProperty } from '@nestjs/swagger'

export class RequestPatchColumnDTO {
    @ApiProperty({ example: 'In Progress', description: 'The name of the column', required: false })
    name?: string
    @ApiProperty({ example: 1, description: 'The order of the column', required: false })
    order?: number
}
