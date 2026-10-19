import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';

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

describe('EmployeesController', () => {
  let controller: EmployeesController;
  const svc = {
    findAll: jest.fn().mockResolvedValue([mockEmployee]),
    findOne: jest.fn().mockResolvedValue(mockEmployee),
    create: jest.fn().mockResolvedValue(mockEmployee),
    update: jest.fn().mockResolvedValue(mockEmployee),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeesController],
      providers: [{ provide: EmployeesService, useValue: svc }],
    }).compile();
    controller = module.get(EmployeesController);
  });

  it('GET /api/employees returns array', async () => {
    const result = await controller.findAll();
    expect(Array.isArray(result)).toBe(true);
    expect(result[0].id).toBe(1);
  });

  it('GET /api/employees/:id returns employee', async () => {
    const result = await controller.findOne(1);
    expect(result.firstName).toBe('Alice');
  });

  it('POST /api/employees creates employee', async () => {
    const dto = { firstName: 'Alice', lastName: 'Johnson', email: 'a@b.com', jobTitle: 'Eng' };
    const result = await controller.create(dto as any);
    expect(result.id).toBe(1);
  });

  it('PUT /api/employees/:id updates employee', async () => {
    const result = await controller.update(1, { firstName: 'Bob' });
    expect(result.id).toBe(1);
  });

  it('DELETE /api/employees/:id returns success', async () => {
    const result = await controller.remove(1);
    expect(result).toEqual({ success: true });
  });

  it('findOne throws when service throws', async () => {
    svc.findOne.mockRejectedValueOnce(new Error('Not found'));
    await expect(controller.findOne(999)).rejects.toThrow();
  });
});