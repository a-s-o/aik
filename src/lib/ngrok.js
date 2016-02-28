import ngrok from 'ngrok';

export default function createNgrokTunnel(flags) {
  return new Promise((resolve, reject) => {
    ngrok.connect(flags.port, (err, url) => {
      if (err) {
        return reject(err);
      }

      resolve(url);
    });
  });
}