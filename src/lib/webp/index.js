import EventEmitter from 'eventemitter3';
import createWebp from './createWebp';
import removeWebp from './removeWebp';
import removeDir from './removeDir';
import { nextTickWrapper } from '../../utils';

export const CreateWebpEventName = 'create-webp';
export const RemoveWebpEventName = 'remove-webp';
export const RemoveDirEventName = 'remove-dir';

function WebpInit(options) {
  const event = new EventEmitter();

  event.on(CreateWebpEventName, nextTickWrapper(createWebp), { options });
  event.on(RemoveWebpEventName, nextTickWrapper(removeWebp), { options });
  event.on(RemoveDirEventName, nextTickWrapper(removeDir), { options });

  return event;
}

export default WebpInit;
