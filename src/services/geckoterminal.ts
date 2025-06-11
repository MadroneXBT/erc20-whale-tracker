import axios from 'axios'
import { GetTokenPriceByAddressResponse } from 'alchemy-sdk'
import config from '../config'
import Cache from './cache'

const geckoTerminalAPI = axios.create({
    baseURL: 'https://api.geckoterminal.com/api/v2/networks/',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
})

type GeckoTerminalTrade = {
    id: string
    type: 'trade'
    attributes: {
        block_number: number
        tx_hash: string
        tx_from_address: string
        from_token_amount: string
        to_token_amount: string
        price_from_in_currency_token: string
        price_to_in_currency_token: string
        price_from_in_usd: string
        price_to_in_usd: string
        block_timestamp: string // ISO timestamp
        kind: 'buy' | 'sell'
        volume_in_usd: string
        from_token_address: string
        to_token_address: string
    }
}

export const getGeckoTerminalLatestTrades = async ({
    network,
    lpAddress,
}: {
    network: string
    lpAddress: string
}) => {
    try {
        const res = await geckoTerminalAPI.get<{
            data: GeckoTerminalTrade[]
        }>(`${network}/pools/${lpAddress}/trades`)

        const trades = res.data?.data

        if (!trades || !Array.isArray(trades)) {
            throw new Error(
                `Invalid data format received from GeckoTerminal API: ${JSON.stringify(trades)}`,
            )
        }

        return trades
    } catch (error) {
        console.error('Error fetching latest swaps:', error.message)
        throw error
    }
}
