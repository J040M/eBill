import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { SupabaseModule } from 'nestjs-supabase-js';

import { AppController } from './app.controller';
import { EbillController } from './ebill/ebill.controller';

import { AppService } from './app.service';
import { StorageService } from './storage/storage.service';
import { UserService } from './user/user.service';
import { EbillService } from './ebill/ebill.service';

import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UserController } from './user/user.controller';
import { SupplierController } from './supplier/supplier.controller';
import { SupplierService } from './supplier/supplier.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
    
    SupabaseModule.forRoot({
      supabaseUrl: process.env.SUPABASE_URL as string,
      supabaseKey: process.env.SUPABASE_ANON_KEY as string,
    }),
    SupabaseModule.injectClient(),
  ],
  controllers: [AppController, EbillController, UserController, SupplierController],
  providers: [
    AppService,
    StorageService,
    UserService,
    EbillService,
    SupplierService
  ],
})
export class AppModule {}
