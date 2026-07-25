import client from "prom-client";

export const loginCounter = new client.Counter({
    name: "auth_login_total",
    help: "Toplam başarılı giriş sayısı"
});

export const jobAppCreatedCounter = new client.Counter({
    name: "job_app_created_total",
    help: "Toplam oluşturulan iş başvurusu sayısı"
});

export const prismaQueriesCounter = new client.Counter({
    name: "prisma_queries_total",
    help: "Toplam oluşturulan query sayısı"
});

export const prismaErrorsCounter = new client.Counter({
    name: "prisma_errors_total",
    help: "Toplam oluşan prisma error sayısı"
});


export const socketDisconnectReasons = new client.Counter({
  name: "socket_disconnect_reason_total",
  help: "Disconnect reasons",
  labelNames: ["reason"],
});

