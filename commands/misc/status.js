const {
    ChatInputCommandInteraction,
    Client,
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    Colors,
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Get the status of the bot.'),

    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */

    async execute(interaction, client) {
        interaction.reply({
            ephemeral: true,
            content: `Calculating Status.`,
        });

        await interaction.fetchReply().then(async (reply) => {
            let interactionSpeed =
                reply.createdTimestamp - interaction.createdTimestamp;

            let websocket_speed = client.ws.ping;

            let f;

            if (interactionSpeed <= 300) {
                f = `🟢`;
            } else if (interactionSpeed <= 400) {
                f = `🟡`;
            } else {
                f = `🔴`;
            }

            let e;

            if (websocket_speed <= 185) {
                e = `🟢`;
              } else if (client.ws.ping <= 250) {
                e = `🟡`;
              } else {
                e = `🔴`;
              }

            interaction.editReply({
                content: '',
                embeds: [
                    {
                        color: Colors.White,
                        title: 'Latency Status',
                        timestamp: new Date(),
                        fields: [
                            {
                                name: 'Websocket Speed',
                                value: `${e} | ${websocket_speed}ms`,
                                inline: true,
                            },
                            {
                                name: 'Interaction Speed',
                                value: `${f} | ${interactionSpeed}ms`,
                                inline: true,
                            },
                        ],
                    },
                ],
            });
        });
    },
};
