import { TwitterSB } from "./engine/twitter";
import { swingbotSettings } from "./settings";
import { AlpacaSB } from "./engine/alpaca";
import { SwingbotUtils } from "./engine/swingbot";
import { testTweet } from "./engine/testing";


SwingbotUtils.logWelcomeMessage();

// create new instance of Twitter Client for the Swing Bot
const twitterSB = new TwitterSB(swingbotSettings);

// create new instance of Alpaca Client for the Swing Bot
const alpacaSB = new AlpacaSB(swingbotSettings);



function onTweetReceived(tweet) {

    TwitterSB.logTweet(tweet);

    // only signals from the users in this array are accepted
    const authorizedSignalsFromUsers = swingbotSettings.twitter.authorizedSignalsFromUsers;

    // screen name of the author of the tweet
    const tweetScreenName = TwitterSB.getTweetScreenName(tweet);

    // if tweet's author is found in the 'authorizedSignalsFromUsers' array try to parse the signal
    if (authorizedSignalsFromUsers.includes(tweetScreenName)) {
        const signal = SwingbotUtils.getSignal(TwitterSB.getTweetText(tweet));

        // if there's a signal, buy it on alpaca
        if (signal) {
            SwingbotUtils.logSignal(signal, tweet);
            alpacaSB.buyStock(signal)
                .then(r => AlpacaSB.logPurchaseSuccess(signal))
                .catch(e => AlpacaSB.logPurchaseError(signal, e));
        }
    }
}

twitterSB.startListening((tweet) => onTweetReceived(tweet))


/**
 * Testing - uncomment each test to run it
 **/

/* TEST 1) parse test tweet to turn it into a signal */
// console.log('Test Signal:', SwingbotUtils.getSignal(testTweet));


/* TEST 2) parse test tweet, turn into a signal, put an order on alpaca */
// const signal = SwingbotUtils.getSignal(testTweet);
// alpacaSB.buyStock(signal)
//     .then(r => AlpacaSB.logPurchaseSuccess(signal))
//     .catch(e => AlpacaSB.logPurchaseError(signal, e));
