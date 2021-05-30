import { Swingbot } from "../interfaces/swingbot.interface";

const Alpaca = require('@alpacahq/alpaca-trade-api');

export class AlpacaSB {
    private alpaca;
    private settings = { paper: true, usePolygon: false };

    constructor(private swingbotSettings: Swingbot.Settings) {
        this.alpaca = new Alpaca(Object.assign({}, swingbotSettings.alpaca.api, this.settings));
    }

    public checkAccount() {
        this.alpaca.getAccount()
            .then((account) => {
                console.log('...connected to alpaca = OK')
            })
            .catch(e => {
                console.log('...failed to connected to alpaca = NOT OK')
                console.log(e)
            })
    }

    public buyStock(signal: Swingbot.Signal): any {
        const amountPerTradeInDollars = 2500;
        const quantity = parseInt(`${amountPerTradeInDollars / signal.buyPrice}`);
        const order = {
            symbol: signal.symbol.toUpperCase(),
            qty: quantity,
            side: 'buy',
            type: 'market',
            time_in_force: 'day',
            order_class: 'bracket',
            stop_loss: {
                stop_price: signal.stopPrice,
            },
            take_profit: {
                limit_price: signal.sellPrice
            }
        };
        console.log('');
        console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
        console.log("Buying: ", JSON.stringify(order));
        console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
        console.log('');
        return this.alpaca.createOrder(order);
    }

    public static logPurchaseSuccess(signal: Swingbot.Signal) {
        console.log(`Bought ${signal.symbol} on Alpaca = OK`)
    }

    public static logPurchaseError(signal: Swingbot.Signal, e: any) {
        console.log('***********************************')
        console.log(' ALPACA ERROR')
        console.log(` ERROR BUYING '${signal.symbol}'`)
        console.log(' MESSAGE: ', e.error?.message)
        console.log('***********************************')
    }

}
