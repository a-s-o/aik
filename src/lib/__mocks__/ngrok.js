export default {
  connect(port, cb) {
    if (port === 0) cb('Error');
    cb(null, 'https://ngrok.url');
  }
};
