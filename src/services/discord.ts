import { Client, EmbedBuilder } from 'discord.js' // if you're using discord.js v14+
import config from '../config'
import { getGeckoTerminalLatestTrades } from './geckoterminal'
import Cache from './cache'

const MAX_EMBEDS_PER_MESSAGE = 5

export const detectAndPostWhalePurchases = async ({
    client,
}: {
    client: Client
}): Promise<void> => {
    try {
        const trades = await getGeckoTerminalLatestTrades({
            network: config.GECKO_TERMINAL_NETWORK,
            lpAddress: config.LP_ADDRESS,
        })

        const embeds = trades
            .sort(
                (a, b) =>
                    new Date(b.attributes.block_timestamp).getTime() -
                    new Date(a.attributes.block_timestamp).getTime(),
            )
            .reduce((acc, trade) => {
                const {
                    tx_hash,
                    tx_from_address,
                    to_token_amount,
                    price_to_in_usd,
                    volume_in_usd,
                    block_timestamp,
                } = trade.attributes

                if (
                    trade.attributes.kind !== 'buy' ||
                    parseFloat(volume_in_usd) <
                        config.WHALE_PURCHASE_USD_ALERT_THRESHOLD
                ) {
                    return acc
                }

                const cacheKey = trade.id

                if (Cache.trades.get<boolean>(cacheKey)) {
                    return acc
                }

                acc.push(
                    new EmbedBuilder()
                        .setTitle('🚨 Whale Purchase Detected!')
                        .addFields(
                            {
                                name: 'Buyer',
                                value: `${tx_from_address}`,
                                inline: false,
                            },
                            {
                                name: 'Volume (USD)',
                                value: `$${Number(volume_in_usd).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                                inline: true,
                            },
                            {
                                name: 'Amount',
                                value: `${Number(to_token_amount).toLocaleString('en-US', { maximumFractionDigits: 0 })} $${config.TOKEN_SYMBOL}`,
                                inline: true,
                            },
                            {
                                name: `Price per $${config.TOKEN_SYMBOL}`,
                                value: `$${Number(price_to_in_usd).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                                inline: true,
                            },
                            {
                                name: 'Tx Hash',
                                value: `[View Tx](https://basescan.org/tx/${tx_hash})`,
                                inline: false,
                            },
                        )
                        .setURL(`https://basescan.org/tx/${tx_hash}`)
                        .setAuthor({
                            name: `${config.TOKEN_NAME} • Whale Watcher`,
                            iconURL: config.DISCORD_EMBED_ICON_URL,
                            url: config.DISCORD_AUTHOR_URL,
                        })
                        .setFooter({
                            text: `Whale Purchase Alert • $${config.TOKEN_SYMBOL}`,
                            iconURL: config.DISCORD_EMBED_ICON_URL,
                        })
                        .setThumbnail(config.DISCORD_EMBED_THUMBNAIL)
                        .setTimestamp(new Date(block_timestamp))
                        .setColor(config.DISCORD_EMBED_HEX_COLOR),
                )

                Cache.trades.set(cacheKey, true)

                return acc
            }, [] as EmbedBuilder[])

        if (!embeds.length) {
            console.log(
                `No whale purchases detected @ ${new Date().toISOString()}`,
            )
            return
        }

        await sendDiscordEmbedsToChannel({ client, embeds })
    } catch (error) {
        console.error(
            `Failed to detect and post whale purchases ${JSON.stringify(error)}`,
        )
        throw error
    }
}

export const sendDiscordEmbedsToChannel = async ({
    client,
    embeds,
}: {
    client: Client
    embeds: EmbedBuilder[]
}): Promise<void> => {
    try {
        if (!embeds.length) {
            return
        }

        const channel =
            client.channels.cache.get(config.DISCORD_CHANNEL_ID) ??
            (await client.channels.fetch(config.DISCORD_CHANNEL_ID))

        if (!channel?.isTextBased() || !channel.isSendable()) {
            console.error('Invalid or non-text Discord channel')
            return
        }

        for (let i = 0; i < embeds.length; i += MAX_EMBEDS_PER_MESSAGE) {
            const chunk = embeds.slice(i, i + MAX_EMBEDS_PER_MESSAGE)
            await channel.send({ embeds: chunk })

            await new Promise((resolve) => setTimeout(resolve, 150))
        }
    } catch (error) {
        console.error(
            `Error sending embeds to Discord channel with error: ${JSON.stringify(error)}`,
        )
        throw error
    }
}
