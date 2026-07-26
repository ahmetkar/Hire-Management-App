import client from "prom-client"


export const redisCacheConnectionGauge = new client.Gauge({
    name: "redis_connection_status",
    help: "Redis bağlantı durumu"
});


export const redisPubConnectionGauge = new client.Gauge({
    name: "redis_pub_connection_status",
    help: "Redis bağlantı durumu"
});


export const redisSubConnectionGauge = new client.Gauge({
    name: "redis_sub_connection_status",
    help: "Redis bağlantı durumu"
});

export const kafkaConnectionGauge = new client.Gauge({
    name: "kafka_connection_status",
    help: "Kafka bağlantı durumu"
});


export const prismaConnectionGauge = new client.Gauge({
    name: "prisma_connection_status",
    help: "Prisma bağlantı durumu"
});

export const socketConnectionGauge = new client.Gauge({
    name: "socket_connection_status",
    help: "Socket bağlantı durumu"
});


export const prismaQueriesInRun = new client.Gauge({
  name: "prisma_queries_inrun",
  help: "Total Prisma queries",
});