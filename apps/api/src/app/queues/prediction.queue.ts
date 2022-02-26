import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import Bull from 'bull';

// duplicated from service - get the services and add this part next way
const predictionQueue = new Bull('prediction-queue');

const serverAdapter = new ExpressAdapter();

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: [new BullAdapter(predictionQueue)],
  serverAdapter: serverAdapter,
});

export { serverAdapter };
