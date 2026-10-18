import { readFileSync } from 'node:fs';
import { Kafka, type KafkaConfig } from 'kafkajs';
import { SendJobMailToUser, SendJobNotificationToManager } from '../helpers/notification.helper';
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
    groupId:"management-service-job-app-approved-group"
});



export let isStarted = false

export const startKafkaJobAppApprovedConsumer = async () => {
  try {
    await consumer.connect();
    kafkaConnectionGauge.set(1);

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

                console.log(`Kafka mesajı :  ${data} -> topic :  ${topic} -> partition:${partition}
                     -> offset:${message.offset} -> key -> ${message.key}  `)
              
              if(data.role == "staff"){
                SendJobNotificationToManager(data.approverId,data.jobId,data.jobAppId,"approved");
              }else if(data.role == "admin"){
                SendJobMailToUser(data.email,data.name,data.jobId,data.jobAppId,"approved");
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
  kafkaConnectionGauge.set(0);
  isStarted = false;
}

