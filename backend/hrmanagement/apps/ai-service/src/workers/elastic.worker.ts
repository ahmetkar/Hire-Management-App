import { Worker } from "bullmq";
import redis from "../configs/redis";
import {prisma}  from "@hrmanagement/prisma"
import { GetEmbedIndex, SearchEmbedIndex } from "../helpers/elastic.helpers";

function handleError(errorMsg: string): never {
    throw new Error(errorMsg);
}

const worker = new Worker(
    "elastic-search",
    async (job) => {
        switch (job.name) {
            case "oldest-search": {
                const data = job.data.data;

                const appInfo = await prisma.jobapplication.findUnique({
                    where: { id: data.applicationId },
                    include: { appPrompts: true },
                });

                if (!appInfo) {
                    return handleError("İş başvurusu bilgisi bulunamadı.");
                }

                if (appInfo.jobId == null) {
                    return handleError("İş başvurusu iş bilgilerinde sorun var.");
                }

                if (appInfo.appPrompts == null) {
                    return handleError("Personel için prompt bilgisi yok.");
                }

                const jobInfo = await prisma.jobs.findUnique({
                    where: { id: appInfo.jobId },
                });

                if (!jobInfo) {
                    return handleError("İş başvurusundaki iş bilgisi bulunamadı.");
                }

                const foundOldest = await prisma.staff.findMany({
                    where: {
                        jobId: appInfo.jobId,
                        staffPrompts: {
                            some: {},
                        },
                    },
                    orderBy: {
                        signupdate: "asc",
                    },
                    take: 10,
                    include: {
                        staffPrompts: true,
                    },
                });

                if (!foundOldest) {
                    return handleError("Personel bilgileri bulunamadı.");
                }

                const embedIndexIdList = await Promise.all(
                    foundOldest.map(async (s) => {
                        const getPrompt = s.staffPrompts.at(-1);

                        if (getPrompt != undefined) {
                            if (
                                (await GetEmbedIndex(getPrompt.elasticId)) ==
                                null
                            ) {
                                return null;
                            } else {
                                return getPrompt.elasticId;
                            }
                        } else {
                            return null;
                        }
                    })
                );

                if (embedIndexIdList.every((item) => item == null)) {
                    return handleError(
                        "Personeller için Elastic Search kayıtları bulunamadı."
                    );
                }

                const embedIndexIdListNotNull =
                    embedIndexIdList.filter((el) => el != null);

                console.log(appInfo.appPrompts);

                const getAppPrompt = appInfo.appPrompts.at(-1);

                if (getAppPrompt == undefined) {
                    return handleError(
                        "Application için prompt kaydı yok."
                    );
                }

                console.log(getAppPrompt);

                const appEmbeddingGet = await GetEmbedIndex(
                    getAppPrompt.elasticId
                );

                console.log(appEmbeddingGet);

                const appEmbedding =
                    appEmbeddingGet != null
                        ? appEmbeddingGet.embedding
                        : null;

                if (appEmbedding == null) {
                    return handleError(
                        "Application için elastic search kaydı yok."
                    );
                }

                const search = await SearchEmbedIndex(
                    appEmbedding,
                    embedIndexIdListNotNull
                );

                if (search) {
                    await redis.set(`elasticstatus:${job.id}`,"completed","EX",300)  
                    return {
                        results: search,
                        success: true,
                        message: "Arama başarılı",
                    };
                } else {
                    return handleError("Arama başarısız.");
                }
            }

            case "newest-search": {
                const data = job.data.data;

                const appInfo = await prisma.jobapplication.findUnique({
                    where: { id: data.applicationId },
                    include: { appPrompts: true },
                });

                if (!appInfo) {
                    return handleError("İş başvurusu bilgisi bulunamadı.");
                }

                if (appInfo.jobId == null) {
                    return handleError("İş başvurusu iş bilgilerinde sorun var.");
                }

                if (appInfo.appPrompts == null) {
                    return handleError("Personel için prompt bilgisi yok.");
                }

                const jobInfo = await prisma.jobs.findUnique({
                    where: { id: appInfo.jobId },
                });

                if (!jobInfo) {
                    return handleError("İş başvurusundaki iş bilgisi bulunamadı.");
                }

                const foundNewest = await prisma.staff.findMany({
                    where: {
                        jobId: appInfo.jobId,
                        staffPrompts: {
                            some: {},
                        },
                    },
                    orderBy: {
                        signupdate: "desc",
                    },
                    take: 10,
                    include: {
                        staffPrompts: true,
                    },
                });

                if (!foundNewest) {
                    return handleError("Personel bilgileri bulunamadı.");
                }

                const embedIndexIdList = await Promise.all(
                    foundNewest.map(async (s) => {
                        const getPrompt = s.staffPrompts.at(-1);

                        if (getPrompt != undefined) {
                            if (
                                (await GetEmbedIndex(getPrompt.elasticId)) ==
                                null
                            ) {
                                return null;
                            } else {
                                return getPrompt.elasticId;
                            }
                        } else {
                            return null;
                        }
                    })
                );

                if (embedIndexIdList.every((item) => item == null)) {
                    return handleError(
                        "Personeller için Elastic Search kayıtları bulunamadı."
                    );
                }

                const embedIndexIdListNotNull =
                    embedIndexIdList.filter((el) => el != null);

                const getAppPrompt = appInfo.appPrompts.at(-1);

                if (getAppPrompt == undefined) {
                    return handleError(
                        "Application için prompt kaydı yok."
                    );
                }

                const appEmbeddingGet = await GetEmbedIndex(
                    getAppPrompt.elasticId
                );

                const appEmbedding =
                    appEmbeddingGet != null
                        ? appEmbeddingGet.embedding
                        : null;

                if (appEmbedding == null) {
                    return handleError(
                        "Application için elastic search kaydı yok."
                    );
                }

                const search = await SearchEmbedIndex(
                    appEmbedding,
                    embedIndexIdListNotNull
                );

                    if (search) {
                     await redis.set(`elasticstatus:${job.id}`,"completed","EX",300)  
                    return {
                        results: search,
                        success: true,
                        message: "Arama başarılı.",
                    };
                } else {
                    return handleError("Arama başarısız.");
                }
            }
        }
    },
    {
        connection: redis,
        concurrency: 5,
    }
);

worker.on("completed", (job) => {
    console.log("tamamlandı", job.id);
});

worker.on("failed", (job, error) => {
    console.log("hata :", job?.id, "->", error);
});