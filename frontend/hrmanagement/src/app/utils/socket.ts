import { io } from "socket.io-client";

export const socket = io("http://localhost:4000", {
  autoConnect: false,
});

export const connectSocket = (
  jobId: string,
  queueName: string,
  callback:()=>void
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const joinRoom = () => {
      socket.emit(
        "join-job",
        { queueName, jobId },
        (success: boolean) => {
          if (success) {
            console.log("Room'a katıldı:", `${queueName}:${jobId}`);
            resolve();
          } else {
            reject(new Error("Room'a katılamadı."));
          }
        }
      );
    };

    if (socket.connected) {
      joinRoom();
      return;
    }

    socket.once("connect", () => {
      console.log("Socket connected:", socket.id);
      joinRoom();
    });

    socket.once("connect_error", (err) => {
      callback();
      reject(err);
    });

    socket.connect();
  });
};