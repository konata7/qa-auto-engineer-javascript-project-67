import path from 'path';
import debug from 'debug';

const logError = debug('page-loader:error');

export default (err) => {
  if (err.code === 'EAI_AGAIN') {
    logError(`There was a network error: ${err.message}`);
    console.error('No network connection!');
    throw err;
  }
  if (err.name === 'AxiosError' && (err.response.status !== 200 && err.response.status !== undefined)) {
    logError(`There was a network error: ${err.message}`);
    console.error(`Request to ${err.response.config.url} failed with status code: ${err.response.status}`);
    throw err;
  }
  if (err.code === 'ENOTFOUND') {
    logError(`There was a network error: ${err.message}`);
    console.error(`There was a network error: ${err.message}`);
    throw err;
  }
  if (err.code === 'ERR_INVALID_ARG_TYPE') {
    logError(`Cannot write file to disk: ${err.message}`);
    return;
  }
  if (err.code === 'ENOENT') {
    logError(`Cannot write file to disk: ${err.message}`);
    console.error(`Output directory doesn't exist (${path.dirname(err.path)})`);
    throw err;
  }
  if (err.code === 'EACCES') {
    logError(`Cannot write file to disk: ${err.message}`);
    console.error(`Write access to file system denied: ${err.syscall} ${err.path}`);
    throw err;
  }
  logError(`There was an error: ${err.message}`);
  console.error(`There was an error: ${err.message}`);
  throw err;
};
