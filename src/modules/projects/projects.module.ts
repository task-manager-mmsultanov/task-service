import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { ProjectsModel } from './models/project.model'
import { ProjectsController } from './projects.controller'
import { ProjectsService } from './projects.services'

@Module({
    imports: [SequelizeModule.forFeature([ProjectsModel])],
    controllers: [ProjectsController],
    providers: [ProjectsService]
})
export class ProjectsModule {}
