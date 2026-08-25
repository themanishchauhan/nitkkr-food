// Shim for promise-limit@2.7.0 to provide default export
import promiseLimit from 'promise-limit';

// Re-export with default export
export default promiseLimit;
export { promiseLimit } from 'promise-limit';