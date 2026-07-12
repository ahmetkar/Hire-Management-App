import {connectKafkaProducer} from "../events/kafka"

export default async () => {
    await connectKafkaProducer();       
}