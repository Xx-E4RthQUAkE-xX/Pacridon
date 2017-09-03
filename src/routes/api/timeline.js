const redis = require('../../redis');

module.exports = function(app) {
  app.ws('/api/timeline', function(ws, req) {
    let subscriber = redis();

    subscriber.on('message', (channel, message) => {
      ws.send(message);
    });
    
    ws.on('close', () => {
      subscriber.unsubscribe();
      subscriber.quit();
    })

    subscriber.subscribe('local');
  });
}