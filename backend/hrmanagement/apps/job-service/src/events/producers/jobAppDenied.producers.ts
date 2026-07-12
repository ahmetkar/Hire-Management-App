import {JOB_TOPICS} from '../../constants'

const {producer} = require('../kafka')


export const publishJobAppDenied = async (data:any) => {
    const topic = JOB_TOPICS.JOB_APP_DENIED

    console.log(` publishing message to topic ${topic} with message : ${JSON.stringify(data)} `)

    await producer.send({
        topic,messages:[
            {
                key:data.key,
                value:JSON.stringify(data.value)
            }
        ]
    })
}


