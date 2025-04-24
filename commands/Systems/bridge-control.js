const { SlashCommandBuilder, ChatInputCommandInteraction, Client, PermissionsBitField, Colors, PermissionFlagsBits } = require("discord.js");
const vars = global.config.variables; 

module.exports = {
    data: new SlashCommandBuilder()
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setName("bridge")
        .setDescription("Bridge control commands")
        .addSubcommand(cmd => cmd.setName("lock")
            .setDescription("Lock/Disable the chat bridge between discord and minecraft.")
        )
        .addSubcommand(cmd => cmd.setName("unlock")
            .setDescription("Unlock/Enable the chat bridge between discord and minecraft.")
        ), 
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute (interaction, client) {

        const cmd = interaction.options.getSubcommand(); 
                
        // fetch key variables
        const BridgeChannel = interaction.guild.channels.cache.get(vars.BridgeChannelId); 
        const MinecraftBotRole = interaction.guild.roles.cache.get(vars.MinecraftBotRoleId);
        
        // conidition to for checking if mc bot has send messages perms
        const MinecraftPermCheck = await BridgeChannel
            .permissionsFor(MinecraftBotRole)
            .has(PermissionsBitField.Flags.SendMessages); 

        // initialise the switch to control each command.
        switch (cmd) {
            case "lock": {
                
                // checks to see if the channel is unlocked
                if (!MinecraftPermCheck) {
                    return interaction.reply({
                        embeds: [{
                            description: `The Minecraft chat bridge is already locked. To unlock, run **/bridge unlock**.`,
                            color: Colors.DarkRed, 
                            timestamp: new Date()
                        }]
                    })
                }
                
                /**
                 * removes any permissions from the minecraft bot role. 
                 * specifically: Manage Webhooks
                 * 
                 * This stops the bot from using webhooks.
                 */
                await MinecraftBotRole.setPermissions([]);

                /**
                 * Update channel perms for Minecraft bot role id:
                 * - Denied: Send Messages
                 * - Denied: View Channel
                 */
                BridgeChannel.edit({
                    permissionOverwrites: [
                        {
                            id: MinecraftBotRole.id, 
                            deny: ["SendMessages", "ViewChannel"]
                        }
                    ]
                })
                .then(() => {
                    interaction.reply({
                        embeds: [{
                            description: `The Minecraft chat bridge is now **locked**. To unlock, run **/bridge unlock**.`,
                            color: Colors.Red, 
                            timestamp: new Date()
                        }]
                    })
                })

            }
            break; 

            case "unlock": {

                // checks to see if channel is locked.
                if (MinecraftPermCheck) {
                    return interaction.reply({
                        embeds: [{
                            description: `The Minecraft chat bridge is already unlocked. To lock, run **/bridge lock**.`,
                            color: Colors.DarkRed, 
                            timestamp: new Date()
                        }]
                    })
                }

                // readds the ManageWebhooks permission which the bridge needs to work.
                await MinecraftBotRole.setPermissions(["ManageWebhooks"]);

                /**
                 * Update channel perms for Minecraft bot role id:
                 * - Denied: Send Messages
                 * - Denied: View Channel
                 */
                BridgeChannel.edit({
                    permissionOverwrites: [
                        {
                            id: MinecraftBotRole.id, 
                            allow: ["SendMessages", "ViewChannel"]
                        }
                    ]
                })
                .then(() => {
                    interaction.reply({
                        embeds: [{
                            description: `The Minecraft chat bridge is now **unlocked**. To lock, run **/bridge lock**.`, 
                            color: Colors.Green, 
                            timestamp: new Date()
                        }]
                    })
                })
            }
            break; 
        }


    }
}