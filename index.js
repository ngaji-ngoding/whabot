const {
  default: makeWASocket,
  //makeWALegacySocket,
  DisconnectReason,
  useSingleFileAuthState,
  // useSingleFileLegacyAuthState,
} = require("@adiwajshing/baileys");
const { Boom } = require("@hapi/boom");

const { state, saveState } = useSingleFileAuthState("./auth_info.json");

function startBot() {
  const sock = makeWASocket({
    printQRInTerminal: true,
    auth: state,
  });

  sock.ev.on("connection.update", (update) => {
    console.log(update);
    const { connection, lastDisconnect } = update;
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

  sock.ev.on("creds.update", saveState);
  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    console.log(messages);
    let pesan, responseList, responbutton, noHp;

    if (messages[0].message) {
      pesan = messages[0].message.conversation;
      responseList = messages[0].message.listResponseMessage;
      responbutton = messages[0].message.buttonsResponseMessage;
      noHp = messages[0].key.remoteJid;
      // sock.chatRead(messages[0].key, 1);
    }
    if (!messages[0].key.fromMe && pesan == "gabung group") {
      sock.groupParticipantsUpdate("120363040098805358@g.us", [noHp], "add");
    }
    if (!messages[0].key.fromMe && pesan == "fck") {
      sock.groupParticipantsUpdate(
        "120363040098805358@g.us",
        [messages[0].participant],
        "remove"
      );
    }
    if (!messages[0].key.fromMe && pesan == "ping") {
      sock.sendMessage(noHp, {
        text: "pong",
      });
    }
    if (!messages[0].key.fromMe && pesan == "hallo") {
      sock.sendMessage(noHp, {
        text: "Haaiiiii",
      });
    }
    if (!messages[0].key.fromMe && pesan == "menu") {
      const menus = [
        {
          title: "menus",
          rows: [
            {
              title: "kopi hitam",
              rowId: "1",
            },
            {
              title: "kopi susu",
              rowId: "2",
            },
            {
              title: "omelet",
              rowId: "3",
            },
          ],
        },
      ];
      sock.sendMessage(noHp, {
        text: "ini daftar menu kafe",
        title: "daftar menu",
        buttonText: "tampilkan menu",
        sections: menus,
      });
    }
    if (responseList) {
      const buttons = [
        {
          buttonId: "1",
          buttonText: {
            displayText: "ya",
          },
          type: 1,
        },
        {
          buttonId: "0",
          buttonText: {
            displayText: "tidak",
          },
          type: 1,
        },
      ];
      await sock.sendMessage(noHp, {
        image: {
          url: "./img/" + responseList.title + ".jpeg",
        },
        caption: responseList.title,
      });
      sock.sendMessage(noHp, {
        text: "mau pesan?",
        buttons,
        headerType: 1,
      });
    }
    if (responbutton) {
      responbutton.selectedButtonId === "1"
        ? sock.sendMessage(noHp, {
            text: "silahkan bayar melalui link berikut\n https://link.dana.id/minta/2q3x16jaw9",
          })
        : sock.sendMessage(noHp, {
            text: "terima kasih telah berkunjung",
          });
    }
  });
  sock.ev.on("group-participants.update", (update) => {
    if (update.action === "add") {
      sock.sendMessage(update.id, {
        text: "selamat datang di group " + update.id,
      });
    }
  });
}

startBot();
