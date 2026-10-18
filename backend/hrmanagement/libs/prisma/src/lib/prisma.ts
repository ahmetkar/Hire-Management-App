import { PrismaClient } from '@prisma/client';
import {
  prismaConnectionGauge,
  prismaErrorsCounter,
  prismaQueriesCounter,
  prismaQueriesInRun,
  prismaQueryDuration,
} from '@hrmanagement/metrics';

const createPrismaClient = () =>
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  }).$extends({
    query: {
      $allModels: {
        async $allOperations({ args, query }) {
          prismaQueriesInRun.inc();

          const end = prismaQueryDuration.startTimer();

          try {
            prismaConnectionGauge.set(1);
            prismaQueriesCounter.inc();

            return await query(args);
          } catch (error) {
            prismaConnectionGauge.set(0);
            prismaErrorsCounter.inc();
            throw error;
          } finally {
            end();
            prismaQueriesInRun.dec();
          }
        },
      },
    },
  });

type ExtendedPrismaClient = ReturnType<typeof createPrismaClient>;

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: ExtendedPrismaClient;
};

export const prisma =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
