import { ApplicationCommandType, CommandInteraction } from 'discord.js'
import config from '../config'
import { Command } from '../types/command'
import { getUsdPriceOfToken } from '../services/alchemy'

const price: Command = {
    name: 'price',
    description: `Get the current price of the ${config.TOKEN_NAME}`,
    type: ApplicationCommandType.ChatInput,
    async execute(interaction: CommandInteraction): Promise<void> {
        const usdPrice = await getUsdPriceOfToken()

        await interaction.followUp(
            `**$${Number(usdPrice).toFixed(2)}** per ${config.TOKEN_SYMBOL}`,
        )
    },
}

export default price
