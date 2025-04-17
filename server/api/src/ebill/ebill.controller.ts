import { Body, Controller, Get, Post, Put, Param, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { EbillService } from './ebill.service';
import { StorageService } from '../storage/storage.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { SupaAuthGuard } from '../supa-auth/supa-auth.guard';
import { Permissions } from '../permissions/permissions.decorator';

@Controller('ebill')
@UseGuards(SupaAuthGuard)
export class EbillController {
    constructor(private readonly ebillService: EbillService, private readonly storageService: StorageService) { }

    @Get()
    @Permissions('ebill:r')
    getAllEbill() {
        return this.ebillService.findAll()
    }

    @Get(':uuid')
    @Permissions('ebill:r')
    getEbill(@Param(':uuid') uuid: string) {
        return this.ebillService.findOneById(uuid)
    }

    @Post('upload')
    @Permissions('ebill:w')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        return this.storageService.uploadFile(file)
    }

    @Put(':uuid')
    @Permissions('ebill:r')
    updateEbill(@Param(':uuid') uuid: string, @Body() ebill: any) {
        return this.ebillService.update(uuid, ebill)
    }
}
