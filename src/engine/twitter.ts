import { Swingbot } from "../interfaces/swingbot.interface";

const Twitter = require('twitter-lite');
import * as moment from "moment";

export class TwitterSB {
    private oneMinuteInMilliseconds = 1000 * 60;
    private lastTimestamp: number;
    private stream;
    private client;
    private followUsers: Swingbot.FollowUser[] = [];
    private onTweetCallback: any;
    private keepAliveInterval: NodeJS.Timeout;

    constructor(private swingbotSettings: Swingbot.Settings) {
        this.client = new Twitter(swingbotSettings.twitter.api);
        this.followUsers = swingbotSettings.twitter.followUsers;
    }

    private get streamParameters() {
        return {
            track: "",
            follow: this.followUsers.map(u => u.id).join(","),
            locations: ""
        };
    }

    public startListening(onTweetCallback: any) {
        this.onTweetCallback = onTweetCallback;
        this._startListening(this.onTweetCallback);
        this.keepTwitterAlive();
    }

    private _startListening(onTweetCallback: any) {
        try {
            if (this.stream) {
                this.stream?.destroy();
                console.log('...destroying old stream');
            }
        } catch (e) {
            console.log('ERROR Destroying Stream')
            console.log(e)
        }

        this.stream = this.client.stream("statuses/filter", this.streamParameters)
            .on("start", response => console.log("...listening on Twitter for buy signal from: ", this.followUsers.map(u => u.name).join(", ")))
            .on("data", tweet => {
                if (this.swingbotSettings.swingbot.logging === 'verbose') {
                    console.log('---- raw tweet ---')
                    console.log(tweet)
                }
                onTweetCallback(tweet)
            })
            .on("ping", () => {
                console.log("...ping Twitter @", moment().format('MMMM Do YYYY, h:mm:ss a'));
                this.lastTimestamp = Date.now();
            })
            .on("error", error => {
                console.log('***********************************')
                console.log(' TWITTER ERROR')
                console.log(' Code:', error.status);
                console.log(' Message:', error.statusText);
                console.log('***********************************')
            })
            .on("end", response => {
                console.log("...Twitter stream ended");
            });
    }

    private keepTwitterAlive() {
        if (this.keepAliveInterval) {
            clearInterval(this.keepAliveInterval);
        }
        this.keepAliveInterval = setInterval(() => {
            const now = Date.now();
            if (now - this.lastTimestamp > this.oneMinuteInMilliseconds) {
                console.log('***********************************************');
                console.log('  No ping in more than 1 minute. Restarting');
                console.log('***********************************************');
                this._startListening(this.onTweetCallback);
            } else {
                console.log('...checking last ping < 1 min ago = OK')
            }
        }, this.oneMinuteInMilliseconds);
    }

    public static logTweet(tweet: any = {}) {
        if (tweet?.user) {
            let tweetText = TwitterSB.getTweetText(tweet);
            console.log('-------------------------------');
            console.log('');
            console.log('tweet by: ', TwitterSB.getTweetUserName(tweet), ` (${TwitterSB.getTweetScreenName(tweet)})`);
            console.log('');
            console.log(tweetText);
            console.log('');
            console.log('-------------------------------');
        }
    }

    public static getTweetText(tweet: any): string {
        return tweet.truncated ? tweet.extended_tweet?.full_text : tweet.text;
    }

    public static getTweetUserName(tweet: any): string {
        return tweet?.user?.name;
    }

    public static getTweetScreenName(tweet: any, prependAtChar: boolean = true): string {
        return `${prependAtChar ? '@' : ''}${tweet?.user?.screen_name}`;
    }

}





