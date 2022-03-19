let cobaJson = require("./cobaJson.json");
cobaJson = JSON.stringify(cobaJson);
console.log(cobaJson);
console.log(cobaJson.nama);
console.log(cobaJson.umur);
console.log(cobaJson.hobi);
console.log(cobaJson.lulus);



// const cmds = {};
// const command = function (cmd, callback) {
//   cmds[cmd] = callback;
// };

// function start(cmd) {
//   command("info", handlerInfo);
//   command("home", handlerHome);

//   if (cmds[cmd]) {
//     return cmds[cmd]();
//   }
// }

// function handlerInfo() {
//   console.log("ini info")
// }
// function handlerHome() {
//   console.log("ini home")
// }

// start("info");
// start("home");