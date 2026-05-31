import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ 
      where: { email },
      include: { role: { include: { permissions: { include: { permission: true } } } } }
    });
    if (user && await bcrypt.compare(pass, user.passwordHash)) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role?.name,
      permissions: user.role?.permissions?.map((p: any) => `${p.permission.action}:${p.permission.subject}`)
    };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role?.name,
        permissions: payload.permissions
      },
    };
  }

  async register(data: { email: string, password: string, firstName: string, lastName: string }) {
    const existingUser = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Ensure default CUSTOMER role exists
    let customerRole = await this.prisma.role.findUnique({ where: { name: 'CUSTOMER' } });
    if (!customerRole) {
      customerRole = await this.prisma.role.create({ data: { name: 'CUSTOMER' } });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        roleId: customerRole.id,
      },
      include: { role: { include: { permissions: { include: { permission: true } } } } }
    });

    return this.login(user);
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.prisma.user.findUnique({ 
        where: { id: payload.sub },
        include: { role: { include: { permissions: { include: { permission: true } } } } }
      });
      if (!user) throw new UnauthorizedException();
      return this.login(user);
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
