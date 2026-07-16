import {JOB_TOPICS} from '../../constants'
import { JobApplicationDeniedEvent } from '../JobApplicationDeniedEvent'

const {producer} = require('../kafka')


export const publishJobAppDenied = async (event:JobApplicationDeniedEvent) => {
    const topic = JOB_TOPICS.JOB_APP_DENIED

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


