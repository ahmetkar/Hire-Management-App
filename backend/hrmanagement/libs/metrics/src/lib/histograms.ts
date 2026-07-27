import client from "prom-client";



export const requestHistogram = new client.Histogram({
    name: "http_request_duration_seconds",
    help: "HTTP request duration in seconds",
    labelNames: ["method", "route", "status"],
    buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5]
});
export const prismaQueryDuration = new client.Histogram({
  name: "prisma_query_duration_seconds",
  help: "Prisma query duration",
  buckets: [0.005, 0.01, 0.05, 0.1, 0.5, 1, 2],
});

export const applicationDuration =
        new client.Histogram({

            name:"job_application_duration_seconds",

            help:"Application duration",

            buckets:[
                0.1,
                0.25,
                0.5,
                1,
                2,
                5,
                10,
                20,
                30,
                60
            ]

        });