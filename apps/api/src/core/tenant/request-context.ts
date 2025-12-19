import { AsyncLocalStorage } from 'async_hooks';

interface ContextStore {
  tenant: any;
}

const storage = new AsyncLocalStorage<ContextStore>();

export class RequestContext {
  static run(tenant: any, cb: () => void) {
    storage.run({ tenant }, cb);
  }

  static getTenant() {
    return storage.getStore()?.tenant;
  }
}
