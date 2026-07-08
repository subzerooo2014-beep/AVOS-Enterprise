import { Worker } from "bullmq";

export const defaultWorker = new Worker(
  "default",
  async (job) => {
    return {
      processed: true,
      id: job.id,
    };
  },
  {
    connection: {
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: Number(process.env.REDIS_PORT || 6379),
    },
  },
);
