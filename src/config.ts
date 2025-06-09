import dotenv from 'dotenv'

dotenv.config()

export default {
    BOT_TOKEN: process.env.BOT_TOKEN || '',
    TOKEN_NAME: process.env.TOKEN_NAME || 'Keeta',
    TOKEN_SYMBOL: process.env.TOKEN_SYMBOL || 'KTA',
    CONTRACT_ADDRESS:
        process.env.CONTRACT_ADDRESS ||
        '0xc0634090f2fe6c6d75e61be2b949464abb498973',
    LP_ADDRESS:
        process.env.LP_ADDRESS || '0xd9edc75a3a797ec92ca370f19051babebfb2edee',
    ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY || '',
    ALCHEMY_NETWORK: process.env.ALCHEMY_NETWORK || 'base-mainnet',
}
