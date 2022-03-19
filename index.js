const {
  makeWALegacySocket,
  DisconnectReason,
  useSingleFileLegacyAuthState,
} = require("@adiwajshing/baileys");
const {
  Boom
} = require("@hapi/boom");

const {
  state,
  saveState
} = useSingleFileLegacyAuthState("./auth_info.json");

function startBot() {
  const sock = makeWALegacySocket({
    printQRInTerminal: true,
    auth: state,
  });

  sock.ev.on("connection.update", (update) => {
    console.log(update);
    const {
      connection, lastDisconnect
    } = update;
    if (connection === "close") {
      const shouldReconnect = (lastDisconnect.error =
        Boom?.output?.statusCode !== DisconnectReason.loggedOut);
      console.log(
        "connection closed due to ",
        lastDisconnect.error,
        ", reconnecting ",
        shouldReconnect
      );
      // reconnect if not logged out
      if (shouldReconnect) {
        startBot();
      }
    } else if (connection === "open") {
      console.log("opened connection");
    }
  });

  sock.ev.on("creds.update",
    saveState);

  sock.ev.on("messages.upsert",
    ({
      messages, type
    }) => {
      console.log(messages);
      const pesan = messages[0].message.conversation;
      const responseList = messages[0].message.listResponseMessage;
      const responseButtons = messages[0].message.buttonsResponseMessage;
      const noHp = messages[0].key.remoteJid;
      const menus = [{
        title: 'menus',
        rows: [{
          title: 'kopi hitam',
          rowId: '1'
        },
          {
            title: 'kopi susu',
            rowId: '2'
          },
          {
            title: 'omelet',
            rowId: '3'
          },
        ]
      }];
      if (!messages[0].key.fromMe && pesan == "ping") {
        sock.sendMessage(noHp, {
          text: "pong"
        });
      }
      if (!messages[0].key.fromMe && pesan == "hallo") {
        sock.sendMessage(noHp, {
          text: "Haaiiiii"
        });
      }
      if (!messages[0].key.fromMe && pesan == "menu") {

        sock.sendMessage(noHp, {
          text: 'ini daftar menu kafe',
          title: 'daftar menu',
          buttonText: 'tampilkan menu',
          sections: menus
        })
      }
      if (responseList) {
        const buttons = [{
          buttonId: '1',
          buttonText: {
            displayText: 'ya'
          },
          type: 1
        },
          {
            buttonId: '0',
            buttonText: {
              displayText: 'tidak'
            },
            type: 1
          }];
        sock.sendMessage(noHp, {
          text: 'mau pesan lagi?',
          buttons,
          headerType: 1
        })
      }
      if (responseButtons) {
        responseButtons.selectedButtonId == '1'?sock.sendMessage(noHp, {
          text: 'ini daftar menu kafe',
          title: 'daftar menu',
          buttonText: 'tampilkan menu',
          sections: menus
        }): sock.sendMessage(noHp, {
          text: 'terima kasih'
        })
      }

    });
}

startBot();