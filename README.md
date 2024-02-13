# roboape-edge

Robo Ape is a very simple bot, thrown into an ultimate frisbee team's GroupMe. When it gets a callback message from GroupMe, it checks it's bank of chat templates to see if any keywords have been mentioned. If a keyword is mentioned, there is a set chance per-template that Robo Ape will respond with a randomly selected response from the template.

Essentially Robo Ape is the perfect companion for any large groupchat. Easy to customize, but not too predictable. 

This is the third iteration of Robo Ape, now re-written for the Deno framework [fresh](https://fresh.deno.dev/), so that this dead simple chatbot can be deployed to the EDGE, that new new hotness, so that Robo Ape can respond before any other human or bot (probably).

# Requesting New Features/Messages

## New feature requests
If you want Robo Ape to do something cool that it doesn't do now I get it! I also want Robo Ape to do more rad shit. I only have so much time though. 

So either develop the feature yourself and make a pull request, or, open a new feature request issue on the 'Issues' tab here on GitHub. Make a good case there and it might get developed (absolutely no promises lol).

## New Jokes/Messages
Just [make a pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request) with your edits to the chatBank.json. 

# Storage of Message Templates

Robo Ape will read templates from `static/chatBank.json`. This file is just a JSON with one property, `templates`. `templates` is an array of `Template` objects as defined in `types/template.ts`

## Default chatBank.json

The `chatBank.json` inlcuded in this project serves as the chat bank for a college frisbee team. I would reccomend stealing the 'on a \[number between 1 and 6]\]`/'roll a die' functionality (for dice bets) and 'advice' from [Jenny Holzer](https://www.cs.utexas.edu/~field/holzer/truisms.txt)

## Pro Tips For Writing Fun Stuff
- It's more fun if you don't make a mean joke.
- Be prudent with high frequency messages, GroupMe is already annoying af
- Find your Robo Ape writing voice. I found my Robo Ape voice sitting in front of a laptop at a campus desk job hungover, dehydrated, and sleep deprived. The resulting word vomit I produced that shift was the basis for how Robo Ape talks, typos and all. Since then, I've gotten to know Robo Ape better, and just let Robo Ape do the talking. 



# Doing the dev on your machine

Start the project:

```
deno task start
```

This will watch the project directory and restart as necessary. From here you can test the bot by visiting the **the robo ape zone**, a simple UI built for testing messages, accesible in your browser at `localhost:8000`. These test messages won't be sent to the actual group.


# Deployment

This version of Robo Ape is deployed using [Deno Deploy](https://deno.com/deploy). In order for it to send a message to GroupMe, it needs a Bot ID token (provided in the GroupMe Dev site for the bot). It grabs that Bot ID to use based on the incoming message's group ID. Check `utils/groupBotIds.ts` and update that file with the group/bot id's you want. (oof those should probably be secret now that i think about it)


### On the GroupMe Side

Make sure to point your GroupMe bot's callback URL at the deployed url + `api/gmCallback`. That's the endpoint that needs to get the GroupMe message POST'ed to it


# Further Reading

[GroupMe Bot Tutorial](https://dev.groupme.com/tutorials/bots) (has everything you need to know, you may need to make a GroupMe dev account)

[Fresh Docs](https://fresh.deno.dev/docs/getting-started) (learn how the API and UI side of Robo Ape work)
