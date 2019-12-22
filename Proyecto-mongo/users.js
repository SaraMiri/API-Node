const insertDocument = function (db, document, callback) {
        const collection = db.collection('users');
        // Insertar documento
        collection.insertOne(document, function (err, result) {
            if (err) { console.log("Error insertando documento: ", err); }
            // Llamada a la función callback con el resultado final 
            callback(err, result);
        });
    }
    const findDocuments = function (db, callback) {
        // Obtener la referencia a la colección
        const collection = db.collection('users');
        // Recuperar documentos
        collection.find({}).toArray(function (err, docs) {
        if (err) {
        console.log("Error recuperando documentos: ", err);
        }
        callback(err, docs);
        })
    }

    exports.insertDocument = insertDocument;
    exports.findDocuments = findDocuments;