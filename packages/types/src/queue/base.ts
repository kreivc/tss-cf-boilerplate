export type QueueType = "sendEmail" | "receivedWebhook";

export interface BaseQueueData<T = unknown> {
  type: QueueType;
  data: T;
}
