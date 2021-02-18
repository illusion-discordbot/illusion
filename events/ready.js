const Dashboard = require("../dashboard/dashboard");
module.exports = async client => {
    // Log that the bot is online.
    // client.logger.log("╭─────────────────────────────────────────────────────────────────╮", "ready");
    // client.logger.log("│                                                                 │", "ready");
    // client.logger.log(`│                   ${client.user.tag} Is Online                  │`, "ready");
    // client.logger.log(`│                 Ready to serve ${client.users.cache.size} users in ${client.guilds.cache.size} servers.            │ `, "ready");
    // client.logger.log("│                                                                 │ ", "ready");
    // client.logger.log("╰─────────────────────────────────────────────────────────────────╯ ", "ready");


    client.logger.log(`${client.user.tag}, ready to serve ${client.users.cache.size} users in ${client.guilds.cache.size} servers.`, "ready");
  
    // Make the bot "play the game" which is the help command with default prefix.
    client.user.setActivity(`-help`, {type: "PLAYING"});
    if(process.env.DASHBOARD_ENABLED === "true"){Dashboard(client)}
  };