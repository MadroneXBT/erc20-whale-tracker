import dotenv from 'dotenv'

dotenv.config()

export default {
    DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN || '',
    DISCORD_CHANNEL_ID: process.env.DISCORD_CHANNEL_ID || '',
    DISCORD_EMBED_THUMBNAIL: process.env.DISCORD_EMBED_THUMBNAIL || '',
    DISCORD_EMBED_ICON_URL: process.env.DISCORD_EMBED_ICON_URL || '',
    DISCORD_EMBED_HEX_COLOR: (process.env.DISCORD_EMBED_HEX_COLOR ||
        '#4287f5') as `#${string}`,
    DISCORD_PRICE_ACTIVITY_AND_WHALE_ALERT_INTERVAL_SECONDS: parseFloat(
        process.env.DISCORD_PRICE_ACTIVITY_AND_WHALE_ALERT_INTERVAL_SECONDS ||
            '30',
    ),
    DISCORD_AUTHOR_URL: process.env.DISCORD_AUTHOR_URL || '',
    TOKEN_NAME: process.env.TOKEN_NAME || 'Keeta',
    TOKEN_SYMBOL: process.env.TOKEN_SYMBOL || 'KTA',
    CONTRACT_ADDRESS:
        process.env.CONTRACT_ADDRESS ||
        '0xc0634090f2fe6c6d75e61be2b949464abb498973',
    LP_ADDRESS:
        process.env.LP_ADDRESS || '0xd9edc75a3a797ec92ca370f19051babebfb2edee',
    ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY || '',
    ALCHEMY_NETWORK: process.env.ALCHEMY_NETWORK || 'base-mainnet',
    GECKO_TERMINAL_NETWORK: process.env.GECKO_TERMINAL_NETWORK || 'base',
    WHALE_PURCHASE_USD_ALERT_THRESHOLD: parseFloat(
        process.env.WHALE_PURCHASE_USD_ALERT_THRESHOLD || '20000',
    ),
}
