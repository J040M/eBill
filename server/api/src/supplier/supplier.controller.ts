import { Controller, UseGuards, Get, Post, Put } from '@nestjs/common';
import { SupaAuthGuard } from 'src/supa-auth/supa-auth.guard';
import { SupplierService } from './supplier.service';

@Controller('supplier')
@UseGuards(SupaAuthGuard)
export class SupplierController {
    constructor(private readonly supplierService: SupplierService) { }

    @Get()
    listAll() {
        console.log('listing all suppliers')
        return this.supplierService.findAll()
    }

    @Get(':uuid')
    find(uuid: string) {
        return this.supplierService.findOneById(uuid)
    }

    @Put(':uuid')
    update(uuid: string, supplier: any) {
        return this.supplierService.update(uuid, supplier)
    }

    @Post()
    createSupplier(supplier: any) {
        return this.supplierService.create(supplier)
    }
}
