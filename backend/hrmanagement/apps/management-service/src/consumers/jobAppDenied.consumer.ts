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
    groupId:"management-service-job-app-denied-group"
});



export let isStarted = false

export const startKafkaJobAppDeniedConsumer = async () => {
  try {
    await consumer.connect();

    await consumer.subscribe({
        topic:"job.application.denied",
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
                    SendJobNotificationToManager(data.deniedById,data.jobId,data.jobAppId,"denied");
                }
                SendJobMailToUser(data.email,data.name,data.jobId,data.jobAppId,"denied");

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




export async function JobAppDeniedConsumerShutdown(): Promise<void> {
  if(!isStarted) return;
  await consumer.disconnect();
  isStarted = false;
}

