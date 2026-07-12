import { Kafka } from 'kafkajs';
import { SendJobMailToUser, SendJobNotificationToManager } from '../helpers/notification.helper';


const kafka = new Kafka({
  clientId: process.env.SERVICE_NAME,
  brokers: [process.env.KAFKA_BROKER as string],
  retry:{
    initialRetryTime:300,
    retries:8
  }
});

export const consumer = kafka.consumer({
    groupId:"management-service-job-app-approved-group"
});



export let isStarted = false

export const startKafkaJobAppApprovedConsumer = async () => {
  try {
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
  isStarted = false;
}

