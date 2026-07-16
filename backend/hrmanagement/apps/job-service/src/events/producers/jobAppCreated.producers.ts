import {JOB_TOPICS} from '../../constants'
import { JobApplicationCreatedEvent } from '../JobApplicationCreatedEvent'

const {producer} = require('../kafka')


export const publishJobAppCreated = async (event:JobApplicationCreatedEvent) => {
    const topic = JOB_TOPICS.JOB_APP_CREATED

    if(!event){
        console.log("Veri gelmedi")
    }

    const value = JSON.stringify(event)

    console.log(` publishing message to topic ${topic} with message : ${value} `)

    await producer.send({
        topic,messages:[
            {
               key:event.key,
               value:value
            }
        ]
    })
}




