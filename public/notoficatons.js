const notifier = require('node-notifier');
const openGoogle = require('open-google');


notifier.notify(
    {
      title: 'good alert :)',
      message: 'server from host 3000 is on port!',
      icon: 'https://techcrunch.com/wp-content/uploads/2015/04/codecode.jpg',
      sound: true, // Only Notification Center or Windows Toasters
      wait: true // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
    },
    function (err, response, metadata) {

    }

  );
  notifier.on('click', function (notifierObject, options, event) {
    openGoogle('http://localhost:3000/');
});

module.exports = {
    notifier,
}