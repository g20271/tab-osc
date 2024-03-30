const OSC = require('osc-js');
// const osc = new OSC({
//     plugin: new OSC.DatagramPlugin({ send: { port: 5005, host: 'localhost' } })
//   });




// const message = new OSC.Message('/test', 12.221, 'hello')
// osc.send(message)

const config = {
    receiver: 'ws',         // @param {string} Where messages sent via 'send' method will be delivered to, 'ws' for Websocket clients, 'udp' for udp client
    // udpServer: {
    //   host: 'localhost',    // @param {string} Hostname of udp server to bind to
    //   port: 5005,          // @param {number} Port of udp server to bind to
    //   exclusive: false      // @param {boolean} Exclusive flag
    // },
    udpClient: {
      host: 'localhost',    // @param {string} Hostname of udp client for messaging
      port: 9000           // @param {number} Port of udp client for messaging
    },
    wsServer: {
      host: 'localhost',    // @param {string} Hostname of WebSocket server
      port: 8080,            // @param {number} Port of WebSocket server
      secure: false         
    }
  }
const osc = new OSC({ plugin: new OSC.BridgePlugin(config) })
osc.open()
console.log(osc.status())

// osc.send(new OSC.Message('/test'), { receiver: 'udp' }) // send only this message to udp client
// osc.send(new OSC.Message('/test', "hello"), { receiver: 'udp' }) // send only this message to websocket client
osc.on('/avatar/parameters/TabCount', (message) => {
    console.log(message.args)
    // osc.send(new OSC.Message('/test'), { receiver: 'udp' })
  }
)