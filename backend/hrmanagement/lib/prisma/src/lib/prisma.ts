import { PrismaClient } from '@prisma/client';
import {prismaConnectionGauge,prismaErrorsCounter,prismaQueriesCounter,prismaQueriesInRun,prismaQueryDuration} from "@hrmanagement/metrics"


const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });



prisma.$extends({
  query: {
    $allModels: {
      async $allOperations({ args,query }) {
        prismaQueriesInRun.inc();

        const end = prismaQueryDuration.startTimer();

        try {
          prismaConnectionGauge.set(1);
          prismaQueriesCounter.inc();
          return await query(args);
        }catch(err){
            prismaConnectionGauge.set(0);
            prismaErrorsCounter.inc();
            throw err;
        } finally {
          end();
          prismaQueriesInRun.dec();
        }
      },
    },
  },
});


if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

