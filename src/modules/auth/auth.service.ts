import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import * as bcrypt from 'bcrypt';
import { envs } from 'src/config/envs';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async signIn(signInDto: SignInDto) {
    const { username, password } = signInDto;

    const isOkPassword = bcrypt.compareSync(password, envs.signInPassword);

    if (username !== envs.signInUsername || !isOkPassword)
      throw new ForbiddenException('Credenciales inválidas');

    const payload = { username, access_time: new Date() };

    const token = await this.jwtService.signAsync(payload);

    return { user: payload, token };
  }
}
