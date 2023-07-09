const express = require("express"),
    cors = require("cors"),
    app = express();

app.use(cors());

require("dotenv").config()
const PORT = process.env.PORT || '80';

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}

const { Client, GatewayIntentBits, Partials  } = require("discord.js"),
    client = new Client({
        allowedMentions: {
            parse: [ ],
            repliedUser: false,
          },
          partials: [Partials.Message, Partials.Channel, Partials.Reaction],
          intents: [ 
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.DirectMessageReactions,
            GatewayIntentBits.DirectMessageTyping
          ]
    });

const name = require("./package.json").name,
    version = require("./package.json").version,
    author = require("./package.json").author,
    url = require("./package.json").repository.url;

// ROUTES
app.get("/", cors(corsOptions), (req, res) => {
    const mainpage = ({ name: `${name}`, version: `${version}`, author: `${author}`, repository_url: `${url}` })
    return res.send(mainpage)
});

// GET USER INFORMATION
app.get("/discord/user/:userID", cors(corsOptions), (req, res) => {
    client.users.fetch(req.params.userID).then((user) => {
        const results = ({ username: `${user.username}`, bot: `${user.bot}`, url: `${user.displayAvatarURL({ format: "png", size: 4096, dynamic: true })}`, banner: `${user.bannerURL({ format: "png", size: 4096, dynamic: true })}`, accentHex: `${user.hexAccentColor}`, created: `${user.createdAt}` });
        return res.send(results);
    });
});

app.use(function (req, res, next) {
    res.status(404).send("Sorry, can't find that! the routes is :[/discord/user/:userId]")
});

// API START
client.on("ready", () => {
    console.log(`${client.user.username} ready!.`)
});

app.listen(PORT, console.log(`discord-web-api is listing to`, PORT));

client.login(process.env.TOKEN);