//-logger.ts
import {
  isAuthenticated,
  pfUser,
  lastAttemptedPath,
} from "../stores/localDataStore";
import { get } from 'svelte/store';

import log from 'loglevel';
log.setLevel('debug'); // Set the desired log level: trace, debug, info, warn, error, silent

function getLogger(moduleName: string) {
  function getStoreValues() {
    return '';
    return {
      lastAttemptedPath: get(lastAttemptedPath),
      pfUser: get(pfUser),
      isAuthenticated: get(isAuthenticated)
    };
  }

  return {
    debug: (fnName: string, ...args: any[]) => log.debug(`[${moduleName}] [${fnName}]`, ...args, getStoreValues()),
    info: (fnName: string, ...args: any[]) => log.info(`[${moduleName}] [${fnName}]`, ...args, getStoreValues()),
    warn: (fnName: string, ...args: any[]) => log.warn(`[${moduleName}] [${fnName}]`, ...args, getStoreValues()),
    error: (fnName: string, ...args: any[]) => log.error(`[${moduleName}] [${fnName}]`, ...args, getStoreValues())
  };
}

  export default getLogger;
