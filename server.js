const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const res = require('express/lib/response');
const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.json());

//GET A LIST OF ALL ONLINE PLAYERS ON CERTAIN SERVER ID
app.get('/online', (req, res) => {
    const { server_id } = req.body;
    axios.get(`https://www.battlemetrics.com/servers/rust/${server_id}`)
        .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);
            var players = [];
            $('a[class=css-zwebxb]').each(function() {
                players.push($(this).text());
            });
            res.status(200).send({
                "online":players
            });
        });
});

//VIEW STATUS OF CERTAIN PLAYER ON A CERTAIN SERVER ID
app.get('/target', (req, res) => {
    var found = false;
    const { server_id } = req.body;
    const { player_name } = req.body;
    axios.get(`https://www.battlemetrics.com/servers/rust/${server_id}`)
        .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);
            $('a[class=css-zwebxb]').each(function() {
                if($(this).text() == player_name) {
                    found = true;
                    res.send({
                        'status':'online'
                    });
                    return;
                }
            });
            if(found == false) {
                res.send({
                    'status':'offline'
                });
            }
        });
});

//GET INFO ABOUT A RUST SERVER
app.get('/info', (req, res) => {
    var info = {
        "Seed":"",
        "Size":"",
        "Map":"",
        "Monuments":""
    };
    var i = 0;
    const { server_id } = req.body;
    axios.get(`https://www.battlemetrics.com/servers/rust/${server_id}`)
        .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);
            $('div[class=css-1af6rii]').each(function() {
                i++;
                if(i==1) {
                    info["Seed"] = $(this).text().replace('Seed','');
                } else if(i==2) {
                    info["Size"] = $(this).text().replace('Size','');
                } else if(i==3) {
                    info["Map"] = $(this).text().replace('Map','');
                } else if(i==4) {
                    info["Monuments"] = $(this).text().replace('Monuments','');
                }
            });
            res.send({
                'info':info
            });
        });
});

//GET A SMALL IMAGE OF RUST SERVER MAP
app.get('/thumbnail', (req, res) => {
    var src = "";
    const { server_id } = req.body;
    axios.get(`https://www.battlemetrics.com/servers/rust/${server_id}`)
        .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);
            src = $('.css-1jeg8p6').attr('src');
            res.send({
                'img':src
            });
        });
});

//GET A LINK TO VIEW A RUST MAP
app.get('/map', (req, res) => {
    var link = "";
    const { server_id } = req.body;
    axios.get(`https://www.battlemetrics.com/servers/rust/${server_id}`)
        .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);
            link = $('a[class=css-nrfi72]').attr('href');
            res.send({
                'map':link
            });
        });
});

//START SERVER
app.listen(PORT, () => {
    console.log(`LISTENING ON PORT ${PORT}`);
});