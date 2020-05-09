import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET_KEY,
            signOptions: { expiresIn: '30 minutes' }
        })
    ],
    providers: [AuthService],
    exports: [AuthService]
})
export class AuthModule {}
