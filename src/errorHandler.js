import path from 'path';

export default (err) => {
  if (err.code === 'EAI_AGAIN') console.log('No network connection!');
  if (err.code === 'ENOENT') console.log(`No such directory, open ${path.dirname(err.path)}`);
};
