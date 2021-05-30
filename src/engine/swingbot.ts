import { Swingbot } from "../interfaces/swingbot.interface";
import * as os from "os";
import { TwitterSB } from "./twitter";

export class SwingbotUtils {

    public static getSignal(tweetText: string): Swingbot.Signal {
        let signal: Swingbot.Signal;
        tweetText = (tweetText ?? '').toLowerCase();
        const buyTerm = 'Now Buying: $'.toLowerCase();
        const rtTerm1 = 'RT @SwingBot_Small'.toLowerCase();
        const rtTerm2 = 'RT @r_scalp'.toLowerCase();

        /**
         * Make sure that the tweet has the "Now Buying: $" text and that it is not a retweet.
         * Don't want to repeat buy on retweets.
         */
        if (tweetText.indexOf(buyTerm) >= 0 && tweetText.indexOf(rtTerm1) === -1 && tweetText.indexOf(rtTerm2) === -1) {
            signal = SwingbotUtils.parseSignal(tweetText);
        }
        return signal;
    }


    public static parseSignal(tweetText: string = ''): Swingbot.Signal {
        tweetText = tweetText.toLowerCase();
        const buyTerm = 'Now Buying: $'.toLowerCase();
        const buyPriceTerm = 'at ~$'.toLowerCase();
        const sellTerm = 'Exit Target: $'.toLowerCase();
        const stopTerm = 'Stop Loss: $'.toLowerCase();

        const symbol = SwingbotUtils.extractValue(tweetText, buyTerm);
        const buyPrice = SwingbotUtils.extractValue(tweetText, buyPriceTerm);
        const sellPrice = SwingbotUtils.extractValue(tweetText, sellTerm);
        const stopPrice = SwingbotUtils.extractValue(tweetText, stopTerm);

        return {
            symbol: (symbol ?? '').toUpperCase(),
            buyPrice: parseFloat(buyPrice),
            sellPrice: parseFloat(sellPrice),
            stopPrice: parseFloat(stopPrice)
        }
    }

    public static extractValue(tweetText: string, term: string) {
        let index = tweetText.indexOf(term) + term.length;
        const restOfText = tweetText.substring(index).trim();
        const endIndex = Math.min(restOfText.indexOf(' '), restOfText.indexOf(os.EOL))
        const value = endIndex >= 0 ? restOfText.substring(0, endIndex) : restOfText.substring(0);
        return (value ?? '').trim();
    }

    public static logSignal(signal, tweet) {
        console.log(`got signal from `, TwitterSB.getTweetUserName(tweet), ` (${TwitterSB.getTweetScreenName(tweet)}): `);
        console.log(JSON.stringify(signal));
        console.log('-------------------------------');
    }

    public static logWelcomeMessage() {
        console.log('');
        console.log(`   ********************************************************************`);
        console.log('   *                                                                  *')
        console.log('   *  Welcome to the SwingBot Trade Execution Engine (SwingBot TEE)   *');
        console.log('   *                                                                  *')
        console.log('   *         It will listen to Twitter signals from:                  *')
        console.log('   *          > "SwingBot Large Caps" (@r_scalp)                      *');
        console.log('   *          > "SwingBot Small Caps" (@SwingBot_Small)               *');
        console.log('   *                                                                  *')
        console.log('   *                                                                  *')
        console.log('   *         And will execute all signals as paper trades on:         *');
        console.log('   *          > Alpaca Stock Brokerage (www.alpaca.markets)           *');
        console.log('   *                                                                  *')
        console.log('   *                                                                  *')
        console.log('   *      This is not a financial advisor. USE AT YOUR OWN RISK.      *');
        console.log('   *                                                                  *')
        console.log(`   ********************************************************************`);
        console.log('');
    }
}
