import { Module } from '@nestjs/common'
import { TaskService } from './task.service'
import { TasksController } from './task.controller'
import { SequelizeModule } from '@nestjs/sequelize'
import { TaskModel } from './models/task.model'
import { BoardsModule } from '../boards/boards.module'

@Module({
    imports: [BoardsModule, SequelizeModule.forFeature([TaskModel])],
    controllers: [TasksController],
    providers: [TaskService]
})
export class TaskModule {}
