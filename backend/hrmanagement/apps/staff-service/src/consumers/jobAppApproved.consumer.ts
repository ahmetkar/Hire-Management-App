import { readFileSync } from 'node:fs';
import { Kafka, type KafkaConfig } from 'kafkajs';
import { AddApprovedJobApplicationToStaff } from '../helpers/staff.helper';
import {kafkaConnectionGauge} from "@hrmanagement/metrics"


const kafkaBroker = process.env.KAFKA_BROKER;
const kafkaSaslUsername = process.env.KAFKA_SASL_USERNAME;
const kafkaSaslPassword = process.env.KAFKA_SASL_PASSWORD;
const kafkaCaPath = process.env.KAFKA_CA_PATH;

if (!kafkaBroker) {
  throw new Error("KAFKA_BROKER is required");
}

const kafkaConfig: KafkaConfig = {
  clientId: process.env.SERVICE_NAME,
  brokers: [kafkaBroker],
  retry: {
    initialRetryTime: 300,
    retries: 8,
  },
};

const hasKafkaSecuritySettings = Boolean(
  kafkaSaslUsername || kafkaSaslPassword || kafkaCaPath
);

if (process.env.NODE_ENV === "production" || hasKafkaSecuritySettings) {
  if (!kafkaSaslUsername || !kafkaSaslPassword || !kafkaCaPath) {
    throw new Error(
      "Kafka TLS/SCRAM requires KAFKA_SASL_USERNAME, " +
      "KAFKA_SASL_PASSWORD and KAFKA_CA_PATH"
    );
  }

  kafkaConfig.ssl = {
    ca: [readFileSync(kafkaCaPath, "utf8")],
    rejectUnauthorized: true,
  };

  kafkaConfig.sasl = {
    mechanism: "scram-sha-512",
    username: kafkaSaslUsername,
    password: kafkaSaslPassword,
  };
}

const kafka = new Kafka(kafkaConfig);

export const consumer = kafka.consumer({
    groupId:"staff-service-job-app-approved-group"
});



export let isStarted = false



async function testKafkaConnection(): Promise<void> {
  const admin = kafka.admin();

  try {
    await admin.connect();
    kafkaConnectionGauge.set(1)

    const cluster = await admin.describeCluster();
    const metadata = await admin.fetchTopicMetadata({
      topics: ['job.application.approved'],
    });

    console.dir(
      {
        configuredBroker: process.env.KAFKA_BROKER,
        cluster,
        metadata,
      },
      { depth: null },
    );
  } finally {
    await admin.disconnect();
  }
}


export const startKafkaJobAppApprovedConsumer = async () => {
  try {
    testKafkaConnection();
    await consumer.connect();

    await consumer.subscribe({
        topic:"job.application.approved",
        fromBeginning:true

    })

    isStarted = true

    await consumer.run({
        eachMessage:async ({topic,partition,message})=>{
            try {
                const value = message.value?.toString();

                if(!value){
                    console.log("Boş kafka mesajı alındı");
                    return;
                }

                const data = JSON.parse(value);

                console.log("Kafka mesajı : ",data)
                console.log(`Kafka mesajı :  ${data} -> topic :  ${topic} -> partition:${partition}
                     -> offset:${message.offset} -> key -> ${message.key}  `)
                  
                if(data){
                  AddApprovedJobApplicationToStaff(data.jobAppId,data.jobId);
                }

            }catch(error){
                console.error("Kafka mesajı işlenemedi ",error);
                isStarted = false;

                throw error;
            }
        }
    })


    console.log('Kafka consumer connected');
  } catch (error) {
    isStarted = false;
    console.log('Failed to connect Kafka consumer', error);
    throw error;
  }
};




export async function JobAppApprovedConsumerShutdown(): Promise<void> {
  if(!isStarted) return;
  await consumer.disconnect();
  kafkaConnectionGauge.set(0)
  isStarted = false;
}

