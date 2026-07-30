import { io } from "socket.io-client";

export const socket = io(process.env.NEXT_PUBLIC_SERVER_URI!, {
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket", "polling"],
});

export async function connectSocket(
  jobId: string,
  queueName: string,
  callback?: () => void
) {
  if (!socket.connected) {
    await new Promise<void>((resolve, reject) => {
      const onConnect = () => {
        socket.off("connect_error", onError);
        resolve();
      };

      const onError = (err: Error) => {
        socket.off("connect", onConnect);
        callback?.();
        reject(err);
      };

      socket.once("connect", onConnect);
      socket.once("connect_error", onError);

      if (!socket.active) {
        socket.connect();
      }
    });
  }

  await new Promise<void>((resolve, reject) => {
    socket
      .timeout(5000)
      .emit(
        "join-job",
        {
          queueName,
          jobId,
        },
        (err: Error | null, success: boolean) => {
          if (err) {
            reject(err);
            return;
          }

          if (!success) {
            reject(new Error("Room'a katılamadı."));
            return;
          }

          console.log(`Joined ${queueName}:${jobId}`);
          resolve();
        }
      );
  });
}