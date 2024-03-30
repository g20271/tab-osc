const OSC = require("osc-js");

const osc = new OSC.WebsocketClientPlugin({
    port: 8080,
    host: "localhost",
    secure: false,
});
let oscConnectionInterval;
let oscPolingInterval;
osc.open();

function connectToOSC() {
    if (osc.status() === OSC.STATUS.IS_OPEN) {
        clearInterval(oscConnectionInterval);
        console.log("OSC connection established");
        oscPolingInterval = setInterval(sendTabCount, 2000);
        sendTabCount();
    } else {
        console.log("Attempting to connect to OSC server...");
        clearInterval(oscPolingInterval);
        osc.open();
    }
}

function sendTabCount() {
    
    if (osc.status() !== OSC.STATUS.IS_OPEN) {
        console.log("OSC not initialized");
        return;
    }
    
    let message = new OSC.Message('/avatar/parameters/TabCount', tabCount/100);
    let messageBytes = message.pack();

    // メッセージのバイト長が4の倍数でない場合、パディングを追加
    if (messageBytes.byteLength % 4 !== 0) {
        let padding = new Uint8Array(4 - (messageBytes.byteLength % 4));
        messageBytes = new Uint8Array([...messageBytes, ...padding]);
    }

    osc.send(messageBytes);
    console.log(`Sent tab count: ${tabCount}`);
}


let tabCount = 0;

chrome.tabs.query({}, (tabs) => {
    tabCount = tabs.length;
    console.log(`Initial tab count: ${tabCount}`);

    // OSC接続を試みる
    connectToOSC();
    // 5秒ごとにOSC接続を試みる
    oscConnectionInterval = setInterval(connectToOSC, 5000);
    oscPolingInterval = setInterval(sendTabCount, 2000);
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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "getTabCount") {
        sendResponse({ tabCount });
        return true;
    }
});
