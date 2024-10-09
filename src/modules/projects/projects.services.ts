import { HttpException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { ProjectsModel } from './models/project.model'
import { RequestCreateProjectInterface } from './interface/request-create-project.interface'
import { ResponseCreateProjectInterface } from './interface/response-create-project.interface'
import { QueryTypes } from 'sequelize'
import { ResponseProjectsListInterface } from './interface/response-projects-list.interface'

@Injectable()
export class ProjectsService {
    constructor(@InjectModel(ProjectsModel) private readonly projectsRepository: typeof ProjectsModel) {}

    /**
     * Finds all users with the given user IDs.
     *
     * @param userIds - An array of user IDs.
     * @returns A promise that resolves to an array of users.
     * @throws {HttpException} If one or more users are not found.
     * @throws {HttpException} If there is an error finding users.
     */
    private async _find_all_users(userIds: Array<number>): Promise<any[]> {
        try {
            const users = await this.projectsRepository.sequelize.query('SELECT * FROM users WHERE id IN (:userIds)', {
                replacements: { userIds },
                type: QueryTypes.SELECT // Update this line
            })
            if (users.length !== userIds.length) {
                throw new HttpException('One or more users not found', 404)
            }
            return users
        } catch (error) {
            throw new HttpException('Error finding users', 500)
        }
    }

    /**
     * Creates a new project.
     *
     * @param payload - The payload containing the project details.
     * @returns A promise that resolves to the created project or an HttpException if an error occurs.
     */
    async create(payload: RequestCreateProjectInterface): Promise<ResponseCreateProjectInterface | HttpException> {
        const transaction = await this.projectsRepository.sequelize.transaction()
        try {
            const project = await this.projectsRepository.create(payload, { transaction })
            const users = await this._find_all_users(payload.members)

            if (!users) throw new HttpException('One or more users not found', 404)

            await transaction.commit()
            return project
        } catch (error) {
            await transaction.rollback()
            throw new HttpException(error, 500)
        }
    }

    /**
     * Retrieves all projects.
     *
     * @returns A promise that resolves to an array of ResponseProjectsListInterface.
     * @throws {HttpException} If there is an error finding projects.
     */
    async get_all(): Promise<Array<ResponseProjectsListInterface>> {
        try {
            const projects = await this.projectsRepository.findAll({
                order: [['createdAt', 'DESC']]
            })
            return projects
        } catch (error) {
            throw new HttpException('Error finding projects', 500)
        }
    }

    /**
     * Retrieves a project by its ID.
     *
     * @param id - The ID of the project to retrieve.
     * @returns A promise that resolves to the project object.
     * @throws {HttpException} If there is an error finding the project.
     */
    async get_project(id: string): Promise<ResponseProjectsListInterface | HttpException> {
        try {
            const project = await this.projectsRepository.findByPk(id)
            if (!project) {
                return new HttpException('Project not found', 404)
            }
            return project
        } catch (error) {
            throw new HttpException('Error finding project', 500)
        }
    }

    /**
     * Updates a project with the given ID.
     *
     * @param id - The ID of the project to update.
     * @param payload - The partial data to update the project with.
     * @returns A promise that resolves to the updated project.
     * @throws {HttpException} If the project is not found or an error occurs during the update.
     */
    async update(id: number, payload: Partial<RequestCreateProjectInterface>): Promise<ResponseProjectsListInterface | HttpException> {
        const transaction = await this.projectsRepository.sequelize.transaction()
        try {
            const project = await this.projectsRepository.findByPk(id)

            if (!project) {
                return new HttpException('Project not found', 404)
            }

            await project.update(payload, { transaction })
            await transaction.commit()
            return project
        } catch (error) {
            await transaction.rollback()
            throw new HttpException(error, 500)
        }
    }

    /**
     * Deletes a project by its ID.
     *
     * @param id - The ID of the project to delete.
     * @returns A Promise that resolves to void.
     * @throws {HttpException} If the project is not found or an error occurs during deletion.
     */
    async delete(id: number): Promise<void | HttpException> {
        const transaction = await this.projectsRepository.sequelize.transaction()
        try {
            const project = await this.projectsRepository.findByPk(id)

            if (!project) {
                return new HttpException('Project not found', 404)
            }

            await project.destroy({ transaction })
            await transaction.commit()
        } catch (error) {
            await transaction.rollback()
            throw new HttpException(error, 500)
        }
    }
}
