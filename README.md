# SwingBot Trade Execution Engine (SwingBot TEE)
 
                                                              
It will listen to Twitter signals from:                
 > "SwingBot Large Caps" (@r_scalp)                    
 > "SwingBot Small Caps" (@SwingBot_Small)             
                                                       
                                                       
And will execute all signals as paper trades on:       
 > Alpaca Stock Brokerage (www.alpaca.markets)         
                                                       
                                                              
### This is not a financial advisor. USE AT YOUR OWN RISK.
#### DISCLAIMER: This software is provided AS IS. It is not responsible for any financial loss or gain. (Unless you win big, then I'll accept a Tesla, Ludicrous+ Mode only...with Warp Speed of course)
#### This is not affiliated with SwingBot (independent project)

## How to use
Once you clone this repository run: ``` npm install ``` to install all dependencies

Once dependencies are installed run: ``` npm start ``` in your terminal

## Before you start

### You will need two accounts:
1) Twitter Developer Account: https://developer.twitter.com/
2) Alpaca Account: https://www.alpaca.markets

### From the Twitter Developer account you will need to get:
1) consumer_api_key
2) consumer_api_secret
3) access_token_key
4) access_token_secret

### From the Alpaca Paper Trading Account you will need to get
1) keyId
2) secretKey
> **IF YOU RESET YOUR ALPACA PAPER TRADING ACCOUNT YOU WILL NEED TO RE-GENERATE YOUR KEYS OR THE APP WILL NOT WORK**

Once you have all credentials open the ```src/settings.ts``` file and add your credentials:

```javascript
{
    twitter: {
        api: {
            consumer_key: '--- TWITTER CONSUMER API KEY HERE ---',
            consumer_secret: '--- TWITTER CONSUMER API SECRET HERE ---',
            access_token_key: '--- TWITTER AUTHENTICATION ACCESS TOKEN KEY HERE ---',
            access_token_secret: '--- TWITTER AUTHENTICATION ACCESS TOKEN SECRET HERE --- ',
        }
    },
    alpaca: {
        api: {
            keyId: '--- ALPACA API KEY HERE ---',
            secretKey: '--- ALPACA SECRET KEY HERE ---',
        }
    }
}
```

## OTHER NOTES

### Following Signals from one source only
If you only want to listen to signals from (@r_scalp) or (@SwingBot_Small) individually (but not both) just comment out the user in the ```followUsers``` property in the ```src/settings.ts``` file.

This setup will only follow (and trade) "SwingBot Large Caps" (@r_scalp):

```javascript
{
    twitter: {
        followUsers: [
            { name: "@r_scalp", id: "1379234944652697600" },
            // { name: "@SwingBot_Small", id: "1388217130709962753" },
        ]
    }
}
```

## Follow yourself

You can follow yourself as well. This is good for testing and making sure the twitter stream is set up and working. If you add yourself and tweet something, you should see your tweet show up in the terminal. To add yourself:

```javascript
{
    twitter: {
        followUsers: [
            { name: "@r_scalp", id: "1379234944652697600" },
            { name: "@SwingBot_Small", id: "1388217130709962753" },
            { name: "@my-twitter-handle", id: "my-id-number" },
        ]
    }
}
```
> HOW TO GET YOUR TWITTER ID: To get your Twitter ID # go to: 
> https://www.codeofaninja.com/tools/find-twitter-id/

## Authorize Trades From Yourself

Currently, the only authorized signals are from twitter users (@r_scalp) and (@SwingBot_Small). That is evident in the ```src/settings.ts``` file:

```javascript
{
    twitter: {
        authorizedSignalsFromUsers: ['@r_scalp', '@SwingBot_Small']
    }
}
```

You can add yourself to that list (but you also must add yourself to the ```followUsers``` list as well). Such as:
```javascript
{
    twitter: {
        followUsers: [
            { name: "@r_scalp", id: "1379234944652697600" },
            { name: "@SwingBot_Small", id: "1388217130709962753" },
            { name: "@my-twitter-handle", id: "my-id-number" },
        ],
        authorizedSignalsFromUsers: ['@r_scalp', '@SwingBot_Small', '@my-twitter-handle']
    }
}
```
Then, as long as you follow the Tweet format from (@r_scalp) and (@SwingBot_Small) you can tweet out:

```text
Now Buying: $CCL at ~$29.51

Exit Target: $29.96 (Profit: $X.XX (x.xx%))

Stop Loss: $28.92
```

and the engine will execute your paper trade. This is great for testing and making sure the system is working properly.

> NOTE: You can test and execute trades on Alpaca even when markets are closed. The trade will show up in the order history as ```accepted/held``` and wont be executed until the markets open. You can always go in any time and cancel it yourself manually.

## TESTING

There are a couple of quick tests at the bottom of the ```src/index.ts``` file that are commented out. You can uncomment them and run them individually to test that the system is working properly. All credentials must be added to the ```src/settings.ts``` file before any tests can run.
