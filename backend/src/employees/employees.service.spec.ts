import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EmployeesService } from './employees.service';
import { Employee } from './employee.entity';
import { NotFoundException } from '@nestjs/common';

const mockEmployee = {
  id: 1,
  firstName: 'Alice',
  lastName: 'Johnson',
  email: 'alice@test.com',
  phone: null,
  jobTitle: 'Engineer',
  department: 'Eng',
  location: 'SF',
  avatarUrl: null,
  createdAt: new Date(),
};

describe('EmployeesService', () => {
  let service: EmployeesService;
  const repo = {
    find: jest.fn().mockResolvedValue([mockEmployee]),
    findOne: jest.fn().mockResolvedValue(mockEmployee),
    count: jest.fn().mockResolvedValue(1),
    create: jest.fn().mockImplementation((d) => ({ ...mockEmployee, ...d })),
    save: jest.fn().mockImplementation((e) => Promise.resolve({ ...mockEmployee, ...e })),
    remove: jest.fn().mockResolvedValue(undefined),
    createQueryBuilder: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([mockEmployee]),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeesService,
        { provide: getRepositoryToken(Employee), useValue: repo },
      ],
    }).compile();
    service = module.get(EmployeesService);
  });

  it('findAll returns array', async () => {
    const result = await service.findAll();
    expect(result.length).toBeGreaterThan(0);
  });

  it('findAll with search uses query builder', async () => {
    await service.findAll('alice');
    expect(repo.createQueryBuilder).toHaveBeenCalled();
  });

  it('findOne throws NotFoundException for missing id', async () => {
    repo.findOne.mockResolvedValueOnce(null);
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('create returns saved employee', async () => {
    const dto = { firstName: 'Bob', lastName: 'S', email: 'b@c.com', jobTitle: 'PM' };
    const result = await service.create(dto);
    expect(result.firstName).toBe('Bob');
  });

  it('remove calls repo.remove', async () => {
    await service.remove(1);
    expect(repo.remove).toHaveBeenCalled();
  });
});