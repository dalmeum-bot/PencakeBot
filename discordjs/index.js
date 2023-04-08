const Filestream = require('fs');
const Path = require('path');
const getAllFiles = require('./utils/getAllFiles.js');
const { Client, Events, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const { token, clientId, guildId } = require('./config.json');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, c => {
    console.log(`Logged in as ${c.user.tag}`);
})

client.commands = new Collection();
const commandFoldersPath = Path.join(__dirname, 'commands');
getAllFiles(commandFoldersPath, true).forEach(folder => getAllFiles(folder).forEach(file => {
    client.commands.set(file, require(file));
}));

const rest = new REST({ version: '10' }).setToken(token);
(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommand(clientId, guildId['Pencake 2']),
            { body: client.commands }
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
})

client.login(token);