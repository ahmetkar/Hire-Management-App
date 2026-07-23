import {io} from "socket.io-client"

export const socket = io("http://localhost:4000",{autoConnect:false})


export const connectSocket = (jobId: string,queueName:string,callback:()=>void) => {
    
   
        console.log("socket:", socket);
        console.log("connected:", socket.connected);
        
    if (socket.connected) {
          
        socket.emit("join-job", { queueName: queueName, jobId });
        console.log("workera eklendi",jobId)
        return;
    }

    const timeout = setTimeout(() => {
        console.log("Socket bağlantısı kurulamadı.");

        socket.off("connect", onConnect);
        socket.off("connect_error", onError);

        callback();
    }, 5000);

    const onConnect = () => {
        clearTimeout(timeout);

        socket.emit("join-job", { queueName: queueName, jobId });

        socket.off("connect_error", onError);
    };

    const onError = (err: Error) => {
        clearTimeout(timeout);

        console.error("Socket bağlantı hatası:", err);

        socket.off("connect", onConnect);

        // Hata durumunda yapılacak işlem
    };

    socket.once("connect", onConnect);
    socket.once("connect_error", onError);

    socket.connect();
};