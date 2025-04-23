const { Client, Partials, Collection, Events } = require('discord.js');
const { LoadEvents } = require('./structure/handlers/events');
const { ServiceLogger } = require('./structure/classes/logger');
const client = new Client({
    intents: [3276799],
    partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.Reaction,
        Partials.ThreadMember,
        Partials.User,
    ],
});

require('dotenv').config();

global.client = client;
global.env = process.env;
global.commands = new Collection();
global.events = new Collection();

LoadEvents(client);

client.login(env.TOKEN);
