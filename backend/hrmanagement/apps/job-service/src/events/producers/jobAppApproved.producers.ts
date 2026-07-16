import {JOB_TOPICS} from '../../constants'
import { JobApplicationApprovedEvent } from '../JobApplicationApprovedEvent'

const {producer} = require('../kafka')


export const publishJobAppApproved = async (event:JobApplicationApprovedEvent) => {
    const topic = JOB_TOPICS.JOB_APP_APPROVED

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


