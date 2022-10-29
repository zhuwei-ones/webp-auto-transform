import EventEmitter from 'eventemitter3';
import createWebp from './createWebp';
import removeWebp from './removeWebp';
import removeDir from './removeDir';

export const CreateWebpEventName = 'create-webp';
export const RemoveWebpEventName = 'remove-webp';
export const RemoveDirEventName = 'remove-dir';

function WebpInit(options) {
  const event = new EventEmitter();

  event.on(CreateWebpEventName, createWebp, { options });
  event.on(RemoveWebpEventName, removeWebp, { options });
  event.on(RemoveDirEventName, removeDir, { options });

  return event;
}

export default WebpInit;
