// Requerir el interfaz http
const http = require('http');
// Definir el puerto a utilizar
const port = 3000;
const querystring = require('querystring');
const userFunctions = require('./users');
var MongoClient = require('mongodb').MongoClient;
var urlMongo = "mongodb://localhost:27017/";

//Nombre Base de datos
const dbName = 'nodejs-mongo';

// Crear una instancia del cliente de MongoDB
const client = new MongoClient(urlMongo, {  useNewUrlParser: true, useUnifiedTopology: true });
// Crear el servidor y definir la respuesta que se le da a las peticiones

const server = http.createServer((request, response) => {

const { headers, method, url } = request;
    console.log('headers: ', headers);
    console.log('method: ', method);
    console.log('url: ', url);

let body = [];
    request.on('error', (err) => {
    console.error(err);
    }).on('data', (chunk) => {
    // El cuerpo de la petición puede venir en partes, aquí se concatenan

    body.push(chunk);
    }).on('end', () => {
    // El cuerpo de la petición está completo
    body = Buffer.concat(body).toString();
    console.log('body: ', body);
    var parsed = querystring.parse(body);

    const document = {
        "name": parsed.name,
        "phone": parsed.phone
    };

    // Conectar el cliente al servidor
       client.connect().then(async () => {
            
    console.log("Conectado con éxito al servidor");
    const db = client.db(dbName);

    const collection = db.collection('users');

    await collection.insertOne(document)

    const resultList = await collection.find({}).toArray();
    
    client.close();  

    // Código de estado HTTP que se devuelve
 response.statusCode = 200;
 // Encabezados de la respuesta, texto plano
 response.setHeader('Content-Type', 'text/json');
 // Contenido de la respuesta
 response.end(JSON.stringify(resultList));
// Llamar a la función para insertar
userFunctions.insertDocument(db, document, function (err, result) {
    if (!err) { console.log("Resultado de la inserción: ", result.result); 
}
});

userFunctions.findDocuments(db, function (err, result) {
    if (!err) {
    console.log("Documentos recuperados: ", result);
    }
});

client.close(); 

}); }) })