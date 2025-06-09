import { Client, Events, GatewayIntentBits, Interaction } from 'discord.js'
import config from './config'
import { commands, handleSlashCommand } from './commands'

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
    ],
})

client.once(Events.ClientReady, async (client) => {
    if (!client.user || !client.application) {
        console.error('Client user or application is not defined.')
        return
    }

    await client.application.commands.set(commands)

    console.log(`Ready! Logged in as ${client.user.tag}`)
})

client.on('interactionCreate', async (interaction: Interaction) => {
    if (interaction.isCommand() || interaction.isContextMenuCommand()) {
        await handleSlashCommand(interaction)
    }
})

if (!config.BOT_TOKEN.length) {
    throw new Error('BOT_TOKEN is not set in the environment variables.')
}

client.login(config.BOT_TOKEN)
