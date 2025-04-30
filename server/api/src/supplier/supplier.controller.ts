import { Controller, UseGuards, Get, Post, Put } from '@nestjs/common';
import { SupaAuthGuard } from '../supa-auth/supa-auth.guard';
import { SupplierService } from './supplier.service';
import { Supplier } from 'src/types';

@Controller('supplier')
@UseGuards(SupaAuthGuard)
export class SupplierController {
    constructor(private readonly supplierService: SupplierService) { }

    @Get()
    findAll() {
        return this.supplierService.findAll()
    }

    @Get(':uuid')
    find(uuid: string) {
        return this.supplierService.find(uuid)
    }

    @Post()
    create(supplier: Supplier) {
        return this.supplierService.create(supplier)
    }
    
    @Put(':uuid')
    update(uuid: string, supplier: Supplier) {
        return this.supplierService.update(uuid, supplier)
    }

}
