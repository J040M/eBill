import {
    Body, Controller, Get, Post,
    Put, Param, UseInterceptors,
    UploadedFile, UseGuards,
    NotFoundException,
    BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EbillService } from './ebill.service';
import { StorageService } from '../storage/storage.service';
import { SupaAuthGuard } from '../supa-auth/supa-auth.guard';
import { Permissions } from '../permissions/permissions.decorator';
import { Ebill } from 'src/types';

@Controller('ebill')
@UseGuards(SupaAuthGuard)
export class EbillController {
    constructor(private readonly ebillService: EbillService, private readonly storageService: StorageService) { }

    @Get()
    @Permissions('ebill')
    async findAll() {
        return await this.ebillService.findAll()
    }

    @Get(':uuid')
    @Permissions('ebill')
    async find(@Param('uuid') uuid: string) {
        const response = await this.ebillService.findOneById(uuid)

        if (!response) throw new NotFoundException('No ebills found')
        return response
    }

    @Post('upload')
    @Permissions('ebill')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('File not found')
        }

        const response = await this.storageService.uploadFile(file)

        if (!response) {
            throw new BadRequestException('File upload failed')
        }

        return 'File uploaded successfully'
    }

    @Put()
    @Permissions('ebill')
    async updateEbill(@Body() ebill: Ebill) {
        const response = await this.ebillService.update(ebill)

        if (!response) {
            throw new NotFoundException('Ebill not found')
        }
        return response
    }
}
