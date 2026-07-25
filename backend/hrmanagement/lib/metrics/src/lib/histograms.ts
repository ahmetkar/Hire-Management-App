import client from "prom-client";


export const requestHistogram = new client.Histogram({
    name: "http_request_duration_seconds",
    help: "HTTP istek süreleri",
    labelNames: ["method", "route", "status"]
});

export const prismaQueryDuration = new client.Histogram({
  name: "prisma_query_duration_seconds",
  help: "Prisma query duration",
  buckets: [0.005, 0.01, 0.05, 0.1, 0.5, 1, 2],
});