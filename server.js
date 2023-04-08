let express = require('express');
const axios = require('axios')

let app = express();
app.get('/vocabulary/:word', function (req, res) {

    word = req.params.word;

    Promise.all([
        axios.get('https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20230405T111113Z.f976a41631fb1995.eb413c80abcf5570d666eb4a5d371e328fea0271&lang=en-ru&text=' + word)
            .then(resp => {
                let translate = resp.data.def[0].tr[0].text;
                return translate;
            })
            .catch(error => {
                console.log(error);
                throw error;
            }),

        axios.get('https://api.dictionaryapi.dev/api/v2/entries/en/' + word)
            .then(resp => {
                let meaning = resp.data[0].meanings[0].definitions[0].definition;
                let example = resp.data[0].meanings[0].definitions[0].example;
                console.log(meaning)
                console.log(example)
                if (example === undefined) {
                    example = '';
                }
                return {meaning: meaning, example: example}
            })
            .catch(error => {
                console.log(error);
                throw error;
            })
    ])
        .then(response => {
            let translate = response[0];
            let meaning_example = response[1];
            let meaning = meaning_example.meaning
            let example = meaning_example.example

            const result = axios.post('https://cors.yasbr.com/https://api.notion.com/v1/pages',
                {
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
                }, {
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8',
                        'Notion-Version': '2022-06-28',
                        'Authorization': 'Bearer secret_GZZ0RVtS1zjIp67xLqj5XCjUJXD4DMBXrX68mWU6UZG'
                    }
                });

            res.sendStatus(200);
            res.send();
        })
        .catch(error => {
            res.sendStatus(400);
            res.send();
        });

})


const PORT = 8080;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
    console.log(`Running on http://${HOST}:${PORT}`);
});



