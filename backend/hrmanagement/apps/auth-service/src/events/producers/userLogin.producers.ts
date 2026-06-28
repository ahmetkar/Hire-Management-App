import {USER_TOPICS} from '../../constants'

const {producer} = require('../kafka')


export const publishUserLogin = async (data:any) => {
    const topic = USER_TOPICS.USER_LOGIN

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


