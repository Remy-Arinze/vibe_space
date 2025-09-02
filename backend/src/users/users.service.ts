import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto & { verificationToken?: string; verificationTokenExpiry?: Date }): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      verificationToken: createUserDto.verificationToken,
      verificationTokenExpiry: createUserDto.verificationTokenExpiry,
    });
    
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findByVerificationToken(token: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { verificationToken: token } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    
    // If password is being updated, hash it
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    
    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async markEmailAsVerified(id: string): Promise<User> {
    const user = await this.findOne(id);
    user.isEmailVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiry = null;
    return this.usersRepository.save(user);
  }

  async updateVerificationToken(id: string, token: string, expiry: Date): Promise<User> {
    const user = await this.findOne(id);
    user.verificationToken = token;
    user.verificationTokenExpiry = expiry;
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }
}