import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { ColumnModel } from './models/column.model'
import { ColumnsController } from './columns.controller'
import { ColumnsService } from './columns.service'
import { BoardModel } from '../boards/models/board.model'

@Module({
    imports: [SequelizeModule.forFeature([ColumnModel, BoardModel])],
    controllers: [ColumnsController],
    providers: [ColumnsService],
    exports: [ColumnsService]
})
export class ColumnsModule {}
