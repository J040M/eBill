import { Controller, Body, Get, Post, Put, Param, Query, UseGuards, Provider } from '@nestjs/common';
import { SignInWithOAuthCredentials, SignInWithPasswordCredentials, User } from '@supabase/supabase-js';
import { BadRequestException, NotFoundException } from '@nestjs/common/exceptions';
import { UserService } from './user.service';
import { SupaAuthGuard } from '../supa-auth/supa-auth.guard';
import { Permissions } from '../permissions/permissions.decorator';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    @UseGuards(SupaAuthGuard)
    @Permissions('superadmin', 'users:r')
    async listAll() {
        return await this.userService.listAll()
    }

    @Get(':uuid')
    @UseGuards(SupaAuthGuard)
    @Permissions('superadmin')
    async find(@Param(':uuid') uuid: string) {
        return await this.userService.find(uuid)
    }

    @Put(':uuid')
    @UseGuards(SupaAuthGuard)
    async update(@Param(':uuid') uuid: string, @Body() user: User) {
        const response = await this.userService.update(uuid, user)
        if (response) return response

        throw new NotFoundException('User not found')
    }

    @Get('verify')
    async verifyEmailWithOtp(@Query('token') token: string, @Query('email') email: string) {
        const response = await this.userService.verifyEmailOtp(email, token)
        if (response) return response

        throw new NotFoundException('User not found')
    }

    @Post()
    async createUser(@Body() signup: SignInWithPasswordCredentials) {
        if ('email' in signup) {
            return await this.userService.create(signup.email, signup.password)
        }

        throw new BadRequestException('Email and password are required')
    }

    @Post('login')
    async login(@Body() body: { oauth?: SignInWithOAuthCredentials, login?: SignInWithPasswordCredentials }) {
        if (body.oauth) {
            return await this.userService.signInWithOAuth(body.oauth)
        } else if (body.login) {
            if ('email' in body.login) {
                return await this.userService.signInWithPassword(body.login.email, body.login.password)
            }
        }
        throw new Error('Invalid login payload')
    }

    @Post('refresh')
    async refresh(@Body() refresh: { refresh_token: string }) {
        return await this.userService.refresh(refresh.refresh_token)
    }
}
