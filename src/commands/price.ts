import {
    ApplicationCommandType,
    CommandInteraction,
    MessageFlags,
} from 'discord.js'
import config from '../config'
import { Command } from '../types/command'
import { getUsdPriceOfToken } from '../services/alchemy'

let lastUsedTimestamp: number | null = null

const COOLDOWN_ONE_MIN_MS = 60 * 1000

const price: Command = {
    name: 'price',
    description: `Get the current price of the ${config.TOKEN_NAME}`,
    type: ApplicationCommandType.ChatInput,
    async execute(interaction: CommandInteraction): Promise<void> {
        const now = Date.now()

        if (
            lastUsedTimestamp &&
            now - lastUsedTimestamp < COOLDOWN_ONE_MIN_MS
        ) {
            const timeLeft = Math.ceil(
                (COOLDOWN_ONE_MIN_MS - (now - lastUsedTimestamp)) / 1000,
            )
            await interaction.reply({
                content: `⏳ Please wait ${timeLeft} more second(s) before using this command again.`,
                flags: MessageFlags.Ephemeral,
            })
            return
        }

        lastUsedTimestamp = now

        await interaction.deferReply()

        const usdPrice = await getUsdPriceOfToken()
        await interaction.followUp(`**$${usdPrice}**`)
    },
}

export default price
