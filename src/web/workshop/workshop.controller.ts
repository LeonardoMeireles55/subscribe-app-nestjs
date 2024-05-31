import { Body, Controller, Delete, Get, HttpCode, HttpException, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { WorkshopService } from './workshop.service';
import { CreateWorkshopDto } from '../../dto/create.workshop.dto';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PartialWorkshopDto } from '../../dto/partial.workshop.dto';
import { WorkshopEntity } from 'src/entities/workshop.entity';
import { Public } from '../auth/constants/isPublic.decorator';
import { Roles } from '../auth/constants/roles.decorator'
import { Role } from '../auth/constants/roles.enum';

@ApiTags('Workshop')
@ApiBearerAuth()
@Controller('workshop')
export class WorkshopController {
    constructor(
        private readonly workshopService: WorkshopService,
    ) { }

    @HttpCode(201)
    @Roles(Role.Admin)
    @Post('createWorkshop')
    async createWorkshop(@Body() body: CreateWorkshopDto): Promise<PartialWorkshopDto> {
        try {
            const workshop = await this.workshopService.createWorkshop(body);

            const workshopDto: PartialWorkshopDto = {
                name: workshop.name,
                description: workshop.description,
                capacity: workshop.capacity,
                startDate: workshop.startDate,
                endDate: workshop.endDate
            };
            return workshopDto;

        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    @HttpCode(200)
    @Roles(Role.Admin)
    @Get('list')
    async getAllWorkshops(): Promise<WorkshopEntity[] | { message: string }> {
        try {
            const workShops = await this.workshopService.getAllWorkshops();
            return workShops.length == 0 ? { message: 'No workshops found' } : workShops;
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    @ApiQuery({ name: 'id', type: Number })
    @HttpCode(200)
    @Public()
    @Get('capacity/:id')
    async getWorkshopCapacity(@Query("id", ParseIntPipe) id: number): Promise<number> {
        try {
            const capacity = await this.workshopService.getWorkshopCapacity(id);
            return capacity;
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    @ApiParam({ name: 'id', type: Number })
    @HttpCode(204)
    @Roles(Role.Admin)
    @Delete('delete/:id')
    async deleteWorkshopById(@Query('id', ParseIntPipe) id: number): Promise<void> {
        try {
            await this.workshopService.deleleWorkshopById(id);
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    @ApiQuery({ name: 'id', type: Number })
    @HttpCode(200)
    @Public()
    @Get('workshop/:id')
    async getWorkshopById(@Query("id", ParseIntPipe) id: number): Promise<WorkshopEntity> {
        try {
            const workshop = await this.workshopService.getWorkshopById(id);
            return workshop;
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }
}
