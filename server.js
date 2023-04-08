let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
let express = require('express');
const e = require("express");

let word;
let meaning;
let example;
let translate;

let app = express();
app.get('/vocabulary/:word', function (req, res) {
    word = req.params.word;

    yandexRequest();
    apiRequest();

    setTimeout(() => {
        notionCall();
        res.end(JSON.stringify({'word': word, 'translate': translate, 'meaning': meaning, 'example': example}))
    }, 1000)

})


const PORT = 8080;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
    console.log(`Running on http://${HOST}:${PORT}`);
});


function yandexRequest() {
    var requestYandex = new XMLHttpRequest();
    requestYandex.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.status)
            let response = JSON.parse(this.responseText);
            translate = response.def[0].tr[0].text;
            console.log(translate);
            console.log(this.status)
        }
    };
    requestYandex.open('GET', 'https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20230405T111113Z.f976a41631fb1995.eb413c80abcf5570d666eb4a5d371e328fea0271&lang=en-ru&text=' + word);
    requestYandex.send();
}

function apiRequest() {

    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(this.responseText);
            word = response[0].word;
            meaning = response[0].meanings[0].definitions[0].definition;
            example = response[0].meanings[0].definitions[0].example;

            if (example === undefined) {
                example = '';
            }

            console.log(word, meaning, example);
        }
    };
    request.open('GET', 'https://api.dictionaryapi.dev/api/v2/entries/en/' + word);
    request.send();
}

function notionCall() {
    let notionAddListRequest = new XMLHttpRequest();
    let theUrl = "https://cors.yasbr.com/https://api.notion.com/v1/pages";
    notionAddListRequest.open("POST", theUrl);
    notionAddListRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    notionAddListRequest.setRequestHeader('Authorization', 'Bearer secret_GZZ0RVtS1zjIp67xLqj5XCjUJXD4DMBXrX68mWU6UZG');
    notionAddListRequest.setRequestHeader('Notion-Version', '2022-06-28');
    notionAddListRequest.send(JSON.stringify({
        "parent": {
            "database_id": "1914ab95-549a-43a5-9cb4-8bd55a144965"
        },
        "properties": {
            "Example": {
                "type": "rich_text",
                "rich_text": [
                    {
                        "type": "text",
                        "text": {
                            "content": example
                        }
                    }
                ]
            },
            "Meaning": {
                "type": "rich_text",
                "rich_text": [
                    {
                        "type": "text",
                        "text": {
                            "content": meaning
                        }
                    }
                ]
            },
            "Status": {
                "type": "status",
                "status": {
                    "name": "Not started"
                }
            },
            "Translation": {
                "type": "rich_text",
                "rich_text": [
                    {
                        "type": "text",
                        "text": {
                            "content": translate
                        }
                    }
                ]
            },
            "Name": {
                "type": "title",
                "title": [
                    {
                        "type": "text",
                        "text": {
                            "content": word
                        }
                    }
                ]
            }
        }
    }));
}
