import { readFileSync } from 'node:fs';
import { Kafka, Partitioners, type KafkaConfig } from 'kafkajs';
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

export const producer = kafka.producer({
  allowAutoTopicCreation: true,
  createPartitioner: Partitioners.DefaultPartitioner,
});


export const connectKafkaProducer = async () => {
  try {
    await producer.connect();
    console.log('Kafka producer connected');
    kafkaConnectionGauge.set(1)
  } catch (error) {
    console.log('Failed to connect Kafka producer/consumer', error);
    throw error;
  }
};

export const disconnectKafkaProducer = async () => {
  try {
    await producer.disconnect();
    console.log('Kafka producer disconnected');
    kafkaConnectionGauge.set(0)
  } catch (error) {
    console.log('Failed to disconnect Kafka producer', error);
  }
};

process.on(`SIGTERM`,async () => {
    await producer.disconnect()
})

process.on(`SIGINT`,async () => {
    await producer.disconnect()
})