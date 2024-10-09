import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { TaskModel } from '../tasks/models/task.model'
import { ColumnModel } from '../columns/models/column.model'
import { BoardModel } from '../boards/models/board.model'
import { ProjectsModel } from '../projects/models/project.model'
import { BoardsModule } from '../boards/boards.module'
import { ColumnsModule } from '../columns/columns.module'
import { ProjectsModule } from '../projects/projects.module'
import { TaskModule } from '../tasks/task.module'
import { JwtModule } from '@nestjs/jwt'
import { BoardColumn } from '../boards/models/board-column.model'

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: process.env.SECRET_KEY,
            signOptions: { expiresIn: process.env.EXPIRES_IN }
        }),
        ConfigModule.forRoot({
            isGlobal: true
        }),
        SequelizeModule.forRootAsync({
            useFactory: () => ({
                global: true,
                dialect: 'postgres',
                host: process.env.DB_HOST,
                port: Number(process.env.DB_PORT),
                username: process.env.DB_USER,
                password: process.env.DB_PASS,
                database: process.env.DB_NAME,
                autoLoadModels: true,
                synchronize: true,
                models: [TaskModel, ColumnModel, BoardModel, ProjectsModel, BoardColumn]
            })
        }),
        ProjectsModule,
        BoardsModule,
        ColumnsModule,
        TaskModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
