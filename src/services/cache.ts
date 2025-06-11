import NodeCache from 'node-cache'

export default {
    tokenPrice: new NodeCache({
        stdTTL: 60 * 5, // 5 minutes
        checkperiod: 60, // Expire key every minute
        deleteOnExpire: true,
        maxKeys: 1,
    }),
    trades: new NodeCache({
        stdTTL: 86400, // 1 day
        checkperiod: 3600, // Expire keys every hour
        deleteOnExpire: true,
    }),
}
