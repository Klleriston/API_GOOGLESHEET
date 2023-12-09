
const { GoogleSpreadsheet } = require('google-spreadsheet');
const credenciais = require('./credentials.json');
const arquivo = require('./arquivo.json');
const { JWT } = require('google-auth-library');

const SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets'
];

const jwt = new JWT({
    email: credenciais.client_email,
    key: credenciais.private_key,
    scopes: SCOPES,
});

//Função assincrona para criar um obejto de arquivo de planilhas com id e jwt. Retornando o proprio objeto 
async function GetDoc() {
    const doc = new GoogleSpreadsheet(arquivo.id, jwt);
    await doc.loadInfo();
    return doc;
}

//Função assincrona para ler a planilha(linhas -> criar lista de objetos de usuario -> retornar lista)
async function ReadWorkSheet() {
    let sheet = (await GetDoc()).sheetsByIndex[0];
    let rows = await sheet.getRows();
    let users = rows.map(rows => {
        return rows.toObject()
    })
    return users;
}

//API criada na DronaHQ, recebe a URL com as propriedades JSON e cria uma função POST
async function AddUser(data = {}) {
    const response = await fetch('https://apigenerator.dronahq.com/api/eTqKzM53/ex ', {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(data),
    })
    return response.json();
}

async function TrackData() {
    let data = await ReadWorkSheet();
    await Promise.all(data.map(async (user) => {
        let response = await AddUser(user)
        console.log(response)
    }))
    return console.log('Dados copiados !!')
}

TrackData()