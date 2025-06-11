import {
    ActivityType,
    Client,
    Events,
    GatewayIntentBits,
    Interaction,
} from 'discord.js'
import config from './config'
import { commands, handleSlashCommand } from './commands'
import { getUsdPriceOfToken } from './services/alchemy'
import { detectAndPostWhalePurchases } from './services/discord'

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
    ],
})

client.once(Events.ClientReady, async (client) => {
    if (!client.user || !client.application) {
        throw new Error('Client user or application is not defined.')
    }

    await client.application.commands.set(commands)

    console.log(`Ready! Logged in as ${client.user.tag}`)

    // Set the initial activity to the current price at 30s intervals
    setInterval(async () => {
        const usdPrice = await getUsdPriceOfToken()

        client.user.setActivity({
            name: `$${usdPrice} ${config.TOKEN_SYMBOL}`,
            type: ActivityType.Watching,
        })

        await detectAndPostWhalePurchases({ client })
    }, config.DISCORD_PRICE_ACTIVITY_AND_WHALE_ALERT_INTERVAL_SECONDS * 1000)
})

client.on('interactionCreate', async (interaction: Interaction) => {
    if (interaction.isCommand() || interaction.isContextMenuCommand()) {
        await handleSlashCommand(interaction)
    }
})

if (!config.DISCORD_BOT_TOKEN.length) {
    throw new Error('BOT_TOKEN is not set in the environment variables.')
}

client.login(config.DISCORD_BOT_TOKEN)
