import NodeCache from 'node-cache'

export default {
    tokenPrice: new NodeCache({
        stdTTL: 60 * 5, // 5 minutes
        checkperiod: 60, // Check every minute
        deleteOnExpire: true,
        maxKeys: 1,
    }),
}
