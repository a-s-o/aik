import createNgrokTunnel from '../ngrok';

jest.mock('ngrok');

test('should fail with host flag', done => {
  createNgrokTunnel({ host: 'custom_host' })
    .catch(done);
});

test('should be rejected if error occurs while connecting to ngrok', done => {
  createNgrokTunnel({ host: 'localhost', port: 0 })
    .catch(done);
});

test('should be rejected if error occurs while connecting to ngrok', () => {
  return createNgrokTunnel({ host: 'localhost', port: 80 })
    .then(url => expect(url).toBe('http://ngrok.url'));
});
