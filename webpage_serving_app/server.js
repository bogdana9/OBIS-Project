const hostname = '0.0.0.0';
const port = 3001;
const server = require('./controller.js');
const exec = require('child_process').execSync;


async function getRealHostname() {
  const stdout = exec('ipconfig', { encoding: 'utf-8' });
  var hostname = stdout.split("IPv4 Address. . . . . . . . . . . :")[1].split('\n')[0];
  return hostname;
}



server.listen(port, hostname, () => {
    getRealHostname().then( hostname => {
      console.log(`hostname: ${hostname}`);
      console.log(`port: ${port}`);
    })
});
