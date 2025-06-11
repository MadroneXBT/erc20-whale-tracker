import axios from 'axios'
import { GetTokenPriceByAddressResponse } from 'alchemy-sdk'
import config from '../config'
import Cache from './cache'

const alchemyAPI = axios.create({
    baseURL: 'https://api.g.alchemy.com',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
})

export const getUsdPriceOfToken = async (): Promise<string> => {
    const cacheKey = config.CONTRACT_ADDRESS
    const cached = Cache.tokenPrice.get<string>(cacheKey)

    if (cached) {
        return cached
    }

    const res = await alchemyAPI.post<GetTokenPriceByAddressResponse>(
        `/prices/v1/${config.ALCHEMY_API_KEY}/tokens/by-address`,
        {
            addresses: [
                {
                    address: config.CONTRACT_ADDRESS,
                    network: config.ALCHEMY_NETWORK,
                },
            ],
        },
    )

    const token = res.data.data[0]

    if (!token || token.error) {
        throw new Error(
            `Cannot find currency token ${
                config.TOKEN_NAME
            } on ${config.ALCHEMY_NETWORK} with error: ${
                token?.error?.message || 'N/A'
            }`,
        )
    }

    const usdPrice = token?.prices.find((price) => price.currency === 'usd')

    if (!usdPrice) {
        throw new Error(
            `Cannot find USD price for currency token ${
                config.TOKEN_NAME
            } on ${config.ALCHEMY_NETWORK} for ${JSON.stringify(token)}`,
        )
    }

    const parsedUsdPrice = Number(usdPrice.value).toFixed(2)

    Cache.tokenPrice.set(cacheKey, parsedUsdPrice)

    return parsedUsdPrice
}
