import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './employees/employee.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Employee)
    private readonly repo: Repository<Employee>,
  ) {}

  async onModuleInit() {
    const count = await this.repo.count();
    if (count > 0) return;

    const seeds: Partial<Employee>[] = [
      { firstName: 'Alice', lastName: 'Johnson', email: 'alice.johnson@crewmark.io', phone: '+1-555-0101', jobTitle: 'Frontend Engineer', department: 'Engineering', location: 'San Francisco, CA', avatarUrl: null },
      { firstName: 'Bob', lastName: 'Smith', email: 'bob.smith@crewmark.io', phone: '+1-555-0102', jobTitle: 'Product Manager', department: 'Product', location: 'New York, NY', avatarUrl: null },
      { firstName: 'Clara', lastName: 'Davis', email: 'clara.davis@crewmark.io', phone: '+1-555-0103', jobTitle: 'UX Designer', department: 'Design', location: 'Austin, TX', avatarUrl: null },
      { firstName: 'David', lastName: 'Lee', email: 'david.lee@crewmark.io', phone: null, jobTitle: 'Backend Engineer', department: 'Engineering', location: 'Seattle, WA', avatarUrl: null },
      { firstName: 'Emma', lastName: 'Wilson', email: 'emma.wilson@crewmark.io', phone: '+1-555-0105', jobTitle: 'HR Manager', department: 'People Ops', location: 'Chicago, IL', avatarUrl: null },
    ];

    await this.repo.save(seeds.map((s) => this.repo.create(s)));
    console.log('Seeded 5 employees');
  }
}