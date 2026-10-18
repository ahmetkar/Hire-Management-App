import { prisma } from './prisma';

describe('prisma client', () => {
  it('should expose a PrismaClient instance', () => {
    expect(prisma).toBeDefined();
    expect(typeof prisma.$connect).toBe('function');
  });
});
