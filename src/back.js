const OSC = require('osc-js');

const osc = new OSC({

    plugin: new OSC.WebsocketClientPlugin({  port: 8080, host: 'localhost', secure: false})});

osc.open()

let tabCount = 0;

chrome.tabs.query({}, (tabs) => {

    tabCount = tabs.length;

    console.log(`Initial tab count: ${tabCount}`);

    sendTabCount();

});

chrome.tabs.onCreated.addListener(() => {

    tabCount++;

    console.log(`New tab opened, tab count: ${tabCount}`);

    sendTabCount();

});

chrome.tabs.onRemoved.addListener(() => {

    tabCount--;

    console.log(`Tab closed, tab count: ${tabCount}`);

    sendTabCount();

});

function sendTabCount() {

    if (osc.status() !== 1) {

        console.log(`OSC not initialized: ${osc.status()}`);

        osc.open();

        return;

    }

    osc.send(new OSC.Message('/test', tabCount));

    console.log(`Sent tab count: ${tabCount}`);

}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    if (request.type === 'getTabCount') {

      // sendResponseの呼び出し時期が遅れているため、

      // 関数を返して非同期に対応する

      sendResponse({ tabCount });

      // sendResponseの結果は無視される

      return true;

    }

  });