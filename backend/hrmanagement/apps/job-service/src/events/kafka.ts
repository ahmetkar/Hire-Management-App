import { Kafka, Partitioners } from 'kafkajs';
import {kafkaConnectionGauge} from "@hrmanagement/metrics"

const kafka = new Kafka({
  clientId: process.env.SERVICE_NAME,
  brokers: [process.env.KAFKA_BROKER as string],
});

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