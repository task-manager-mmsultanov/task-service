import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { ProjectsService } from './projects.services'
import { RequestProjectCreate } from './dto/request-project-create.dto'
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger'
import { ResponseProjectCreateDTO } from './dto/response-project-create.dto'
import { ResponseProjectsListDTO } from './dto/response-projects-list.dto'
import { MessagePattern, Payload } from '@nestjs/microservices'

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {}

    /**
     * Creates a new project.
     *
     * @param payload - The payload containing the project details.
     * @returns A promise that resolves to the created project.
     * @throws Error if the project could not be created.
     * // make example by responeProjectCreateDTO
     * @example {ResponseProjectCreateDTO}
     */
    @ApiOperation({ summary: 'Create a new project', operationId: 'createProject' })
    @ApiResponse({ status: 201, type: ResponseProjectCreateDTO, description: 'Project created successfully' })
    @ApiBody({ type: RequestProjectCreate })
    @HttpCode(HttpStatus.CREATED)
    @MessagePattern('projects.create_project')
    @Post()
    async create_project(@Body() payload: RequestProjectCreate): Promise<ResponseProjectCreateDTO | HttpException> {
        const res = await this.projectsService.create(payload)

        if (res instanceof HttpException) {
            throw new HttpException(res.message, res.getStatus())
        }

        return new ResponseProjectCreateDTO(res)
    }

    /**
     * Retrieves a list of projects.
     * @returns A promise that resolves to an array of ResponseProjectsListDTO objects.
     */
    @ApiResponse({ status: 200, type: [ResponseProjectsListDTO], description: 'List of projects' })
    @ApiOperation({ summary: 'Get all projects', operationId: 'getProjects' })
    @HttpCode(HttpStatus.OK)
    @MessagePattern('projects.get_projects')
    @Get()
    async get_projects(): Promise<Array<ResponseProjectsListDTO>> {
        const response = await this.projectsService.get_all()
        return response.map((project) => new ResponseProjectsListDTO(project))
    }

    /**
     * Retrieves a project by its ID.
     *
     * @param id - The ID of the project.
     * @returns A promise that resolves to a ResponseProjectsListDTO object representing the project.
     */
    @ApiResponse({ status: 200, type: ResponseProjectsListDTO, description: 'Project details' })
    @ApiOperation({ summary: 'Get a project by ID', operationId: 'getProject' })
    @HttpCode(HttpStatus.OK)
    @MessagePattern('projects.get_project')
    async get_project(@Payload('id') id: string): Promise<ResponseProjectsListDTO | HttpException> {
        const response = await this.projectsService.get_project(id)
        if (response instanceof HttpException) {
            return new HttpException(response.message, response.getStatus())
        }
        return new ResponseProjectsListDTO(response)
    }

    /**
     * Updates a project.
     *
     * @param id - The ID of the project to update.
     * @param payload - The partial project data to update.
     * @returns A promise that resolves to the updated project.
     */
    @ApiResponse({ status: 200, type: ResponseProjectsListDTO, description: 'Project updated successfully' })
    @ApiOperation({ summary: 'Update a project', operationId: 'updateProject' })
    @ApiBody({ type: RequestProjectCreate })
    @HttpCode(HttpStatus.OK)
    @MessagePattern('projects.update_project')
    async update_project(@Payload() payload: Partial<RequestProjectCreate>): Promise<ResponseProjectsListDTO | HttpException> {
        const id = payload['id']
        const data = { ...payload['payload'], id }
        const response = await this.projectsService.update(id, data)
        if (response instanceof HttpException) {
            return new HttpException(response.message, response.getStatus())
        }
        return new ResponseProjectsListDTO(response)
    }

    /**
     * Deletes a project by its ID.
     *
     * @param id - The ID of the project to delete.
     * @returns A promise that resolves when the project is deleted.
     */
    @ApiResponse({ status: 204, description: 'Project deleted successfully' })
    @ApiOperation({ summary: 'Delete a project', operationId: 'deleteProject' })
    @ApiParam({ name: 'id', type: String, required: true, description: 'The project ID' })
    @HttpCode(HttpStatus.NO_CONTENT)
    @MessagePattern('projects.delete_project')
    async delete_project(@Payload('id') id: number): Promise<void | HttpException> {
        return await this.projectsService.delete(id)
    }
}
