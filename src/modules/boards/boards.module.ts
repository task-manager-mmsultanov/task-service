import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { BoardModel } from './models/board.model'
import { BoardService } from './boards.service'
import { BoardController } from './boards.controller'
import { ColumnsModule } from '../columns/columns.module'
import { ProjectsModel } from '../projects/models/project.model'

@Module({
    imports: [SequelizeModule.forFeature([BoardModel, ProjectsModel]), ColumnsModule],
    controllers: [BoardController],
    providers: [BoardService],
    exports: [BoardService]
})
export class BoardsModule {}
