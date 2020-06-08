const hostname = '0.0.0.0';
const port = 3002;
const server = require('./controller.js');
const mongoose = require('mongoose');
const exec = require('child_process').execSync;


async function getRealHostname() {
  const stdout = exec('ipconfig', { encoding: 'utf-8' });
  var hostname = stdout.split("IPv4 Address. . . . . . . . . . . :")[1].split('\n')[0];
  return hostname;
}


function connectDB(){
    const url = "mongodb+srv://Bogdana-Hincean:Modafinil-12@obis-iyqwr.mongodb.net/test?retryWrites=true&w=majority"
    mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
    mongoose.connection.on('connected', () => {console.log("Mongodb: connected")});
  }



server.listen(port, hostname, () => {
    connectDB()
    getRealHostname().then( hostname => {
      console.log(`hostname: ${hostname}`);
      console.log(`port: ${port}`);
    })

});
