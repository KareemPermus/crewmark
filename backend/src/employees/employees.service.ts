import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly repo: Repository<Employee>,
  ) {}

  async findAll(search?: string): Promise<Employee[]> {
    if (search) {
      return this.repo
        .createQueryBuilder('e')
        .where('e.first_name LIKE :q OR e.last_name LIKE :q OR e.email LIKE :q OR e.job_title LIKE :q OR e.department LIKE :q', { q: `%${search}%` })
        .getMany();
    }
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<Employee> {
    const emp = await this.repo.findOne({ where: { id } });
    if (!emp) throw new NotFoundException(`Employee #${id} not found`);
    return emp;
  }

  async create(dto: CreateEmployeeDto): Promise<Employee> {
    const entity = this.repo.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone ?? null,
      jobTitle: dto.jobTitle,
      department: dto.department ?? null,
      location: dto.location ?? null,
      avatarUrl: dto.avatarUrl ?? null,
    });
    return this.repo.save(entity);
  }

  async update(id: number, dto: UpdateEmployeeDto): Promise<Employee> {
    const emp = await this.findOne(id);
    if (dto.firstName !== undefined) emp.firstName = dto.firstName;
    if (dto.lastName !== undefined) emp.lastName = dto.lastName;
    if (dto.email !== undefined) emp.email = dto.email;
    if (dto.phone !== undefined) emp.phone = dto.phone ?? null;
    if (dto.jobTitle !== undefined) emp.jobTitle = dto.jobTitle;
    if (dto.department !== undefined) emp.department = dto.department ?? null;
    if (dto.location !== undefined) emp.location = dto.location ?? null;
    if (dto.avatarUrl !== undefined) emp.avatarUrl = dto.avatarUrl ?? null;
    return this.repo.save(emp);
  }

  async remove(id: number): Promise<void> {
    const emp = await this.findOne(id);
    await this.repo.remove(emp);
  }
}