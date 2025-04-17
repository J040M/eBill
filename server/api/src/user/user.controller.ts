import { Controller, Body, Get, Post, Put, Param, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { SupaAuthGuard } from 'src/supa-auth/supa-auth.guard';
import { Permissions } from 'src/permissions/permissions.decorator';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    @UseGuards(SupaAuthGuard)
    @Permissions('superadmin', 'users:r')
    listAll() {
        console.log('listing all users')
        return this.userService.listAll()
    }

    @Get(':uuid')
    @UseGuards(SupaAuthGuard)
    @Permissions('superadmin')
    find(@Param(':uuid') uuid: string) {
        return this.userService.find(uuid)
    }
    
    @Put(':uuid')
    @UseGuards(SupaAuthGuard)
    update(@Param(':uuid') uuid: string, @Body() user: any) {
        return this.userService.update(uuid, user)
    }

    @Get('verify')
    verifyEmailWithOtp(@Query('token') token: string, @Query('email') email: string) {
        return this.userService.verifyEmailOtp(email, token)
    }

    @Post()
    createUser(@Body() signup: any) {
        return this.userService.create(signup.email, signup.password)
    }

    @Post('login')
    login(@Body() login: any) {
        if(login.type === 'oauth') {
            return this.userService.signInWithOAuth(login.provider)
        } else if(login.type === 'password') {
            return this.userService.signInWithPassword(login.email, login.password)
        }
        throw new Error('Invalid login type')
    }

    @Post('refresh')
    refresh(@Body() refresh: any) {
        return this.userService.refresh(refresh.token)
    }

}
