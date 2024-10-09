import { IsNumber, IsString } from 'class-validator'

export class ResponseProjectCreateDTO {
    @IsNumber()
    id: number

    @IsString()
    name: string

    @IsNumber()
    creator_id: number

    @IsNumber({}, { each: true })
    members: Array<number>

    constructor(data: { id: number; name: string; members: Array<number>; creator_id: number }) {
        this.id = data.id
        this.name = data.name
        this.creator_id = data.creator_id
        this.members = data.members
    }

    toString(): string {
        return JSON.stringify(this)
    }
}
