import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/core/repository/user/user.entity';
import { USER_REPOSITORY } from 'src/core/repository/user/user.module';
import { ApiResponse } from 'src/utils/apiresponse.dto';
import { Repository } from 'typeorm';
import { LoginRequestDto, RegisterRequestDto } from './auth.dto';
import { hash, compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY) private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async login(loginRequest: LoginRequestDto): Promise<ApiResponse<any>> {
    const user = await this.userRepository.findOneOrFail({
      where: {
        username: loginRequest.username,
      },
    });
    if (user && (await compare(loginRequest.password, user.password))) {
      // const userData = this.getUserData(user);
      const jwtPayload = this.getPayload(user);
      return {
        success: true,
        data: { user: user, token: this.jwtService.sign(jwtPayload) },
        message: 'Login Success',
      };
    }
    throw new UnauthorizedException('Password not match');
  }

  getPayload(user: UserEntity) {
    return {
      id: user.id,
    };
  }

  findUser(id: number) {
    return this.userRepository.findOne({
      where: {
        id: id,
      },
    });
  }
}