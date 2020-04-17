const MONGO_DB_NAME = 'TIL';
//const MONGO_URI = 'mongodb://username:password@server.andreibuntsev.com:27017/TIL';
const MONGO_URI = `mongodb://localhost:27017/${MONGO_DB_NAME}`;
const MongoClient = require('mongodb').MongoClient;
const MONGO_CLIENT_OPTIONS = { useUnifiedTopology: true, useNewUrlParser: true };




// exports.getClient = async options => {
//     const { clientId } = options;
//     if (!clientId) {
//         throw 'ClientId parameter is not provided';
//     }

//     // update online clients collection
//     const onlineClient = onlineClients.find(c => c.id == clientId);
//     if (onlineClient) {
//         onlineClient.time = new Date();
//     } else {
//         onlineClients.push({ id: clientId, time: new Date() });
//     }

//     const mongoClient = await MongoClient.connect(MONGO_URI, MONGO_CLIENT_OPTIONS);
//     const db = mongoClient.db(MONGO_DB_NAME);
//     let client = await db.collection('clients').findOne({ clientId: clientId });

//     mongoClient.close();
//     return client;
// };

// exports.getClientBrief = async options => {
//     const { clientId } = options;
//     if (!clientId) {
//         throw 'ClientId parameter is not provided';
//     }

//     const mongoClient = await MongoClient.connect(MONGO_URI, MONGO_CLIENT_OPTIONS);
//     const db = mongoClient.db(MONGO_DB_NAME);
//     let client = await db.collection('clients').find({ clientId: clientId }).limit(1).project({ clientId: 1, clientName: 1, _id: 0 }).next();

//     mongoClient.close();
//     return client;
// };

exports.addTil = async options => {
    const { header, text, user } = options;

    const mongoClient = await MongoClient.connect(MONGO_URI, MONGO_CLIENT_OPTIONS);
    const db = mongoClient.db(MONGO_DB_NAME);

    await db.collection('tils').insertOne({ header, text, user });
    mongoClient.close();
};

// exports.updateClient = async options => {
//     const { clientId, clientName, showNotifications, gender, status } = options;
//     if (!clientId) {
//         throw `Cannot update the client. The clientId parameter is mandatory.`;
//     }
//     if (!clientName) {
//         throw `Cannot update the client. The clientName parameter is mandatory. Client ID: ${clientId}`;
//     }

//     const mongoClient = await MongoClient.connect(MONGO_URI, MONGO_CLIENT_OPTIONS);
//     const db = mongoClient.db(MONGO_DB_NAME);

//     const exists = await db.collection('clients').find({ clientId: clientId }).limit(1).count();
//     if (!exists) {
//         throw `Cannot update the client. The client ID ${clientId} does not exist in the database`;
//     }

//     await db.collection('clients').updateOne({ clientId: clientId },
//         {
//             $set: { clientName, showNotifications, gender, status, isRefreshRequired: true }
//         });

//     mongoClient.close();
// };

// exports.addContact = async options => {
//     const { clientId, contact } = options;
//     if (!clientId) {
//         throw `Cannot add the contact to non-existent client. The clientId parameter is mandatory.`;
//     }

//     const mongoClient = await MongoClient.connect(MONGO_URI, MONGO_CLIENT_OPTIONS);
//     const db = mongoClient.db(MONGO_DB_NAME);

//     const exists = await db.collection('clients').find({ clientId: clientId }).limit(1).count();
//     if (!exists) {
//         throw `Cannot add the contact to non-existent client.`;
//     }

//     await addContactIfNotExists(db, clientId, contact.clientId);

//     mongoClient.close();
// };

// exports.removeContact = async options => {
//     const { clientId, contactId } = options;
//     if (!clientId) {
//         throw `Cannot remove the contact from non-existent client. The clientId parameter is mandatory.`;
//     }

//     if (!contactId) {
//         throw `Cannot remove the contact from the client {Clientid: ${clientId}}. The contactId parameter is mandatory.`;
//     }

//     const mongoClient = await MongoClient.connect(MONGO_URI, MONGO_CLIENT_OPTIONS);
//     const db = mongoClient.db(MONGO_DB_NAME);

//     await db.collection('clients').updateOne({ clientId: clientId },
//         {
//             $pull: { contacts: { clientId: contactId } }
//         });

//     mongoClient.close();
// };

exports.getTils = async options => {

    const mongoClient = await MongoClient.connect(MONGO_URI, MONGO_CLIENT_OPTIONS);
    const db = mongoClient.db(MONGO_DB_NAME);

    //TODO: not effective
    const results = await db.collection('tils').find().toArray();

    mongoClient.close();
    // return list of unique clients (unique by clientId)
    return results;
};

// exports.sendMessage = async options => {
//     const { senderId, receiverId, message } = options;
//     if (!senderId) {
//         throw `The senderId parameter is mandatory.`;
//     }

//     if (!receiverId) {
//         throw `The receiverId parameter is mandatory.`;
//     }

//     if (!message) {
//         throw `The message parameter is mandatory.`;
//     }

//     const mongoClient = await MongoClient.connect(MONGO_URI, MONGO_CLIENT_OPTIONS);
//     const db = mongoClient.db(MONGO_DB_NAME);

//     await Promise.all([
//         addMessage(db, senderId, receiverId, 'out', message),
//         addMessage(db, receiverId, senderId, 'in', message)
//     ]);

//     mongoClient.close();
// };





// // ----------------------------------private functions-------------------------

// const addContactIfNotExists = async (db, clientId, contactId) => {
//     // if the contact already exists, do nothing
//     const exists = await db.collection('clients').find({ clientId: clientId, 'contacts.clientId': contactId }).limit(1).count();
//     if (exists) return;

//     const contact = await db.collection('clients').find({ clientId: contactId }).limit(1).project({ clientId: 1, clientName: 1, gender: 1, status: 1, _id: 0 }).next();

//     // create the contact
//     await db.collection('clients').updateOne(
//         { clientId: clientId },
//         {
//             $push:
//             {
//                 'contacts': { clientId: contact.clientId, clientName: contact.clientName, gender: contact.gender, status: contact.status }
//             }
//         });
// };


// const addMessage = async (db, clientId, contactId, type, msg) => {
//     // add contact if it doesn't exist
//     await addContactIfNotExists(db, clientId, contactId);

//     // add the message
//     await db.collection('clients').updateOne(
//         { clientId: clientId, 'contacts.clientId': contactId },
//         {
//             $push:
//             {
//                 'contacts.$.messages': { type, msg, time: new Date() }
//             }
//         });
// };


// async function refreshClientsData() {
//     const mongoClient = await MongoClient.connect(MONGO_URI, MONGO_CLIENT_OPTIONS);
//     const db = mongoClient.db(MONGO_DB_NAME);

//     const clientsToRefresh = await db.collection('clients')
//         .find({ isRefreshRequired: true })
//         .toArray();

//     await Promise.all(clientsToRefresh.map(client => db.collection('clients').updateOne({ clientId: client.clientId }, { $set: { isRefreshRequired: false } })));
//     await Promise.all(clientsToRefresh.map(client => {
//         const contacts = client.contacts ? client.contacts : [];
//         return Promise.all(contacts.map(contact =>
//             db.collection('clients').updateOne(
//                 { clientId: contact.clientId, 'contacts.clientId': client.clientId },
//                 {
//                     $set:
//                     {
//                         'contacts.$.clientName': client.clientName,
//                         'contacts.$.gender': client.gender,
//                         'contacts.$.status': client.status
//                     }
//                 })
//         ))
//     }
//     ));

//     mongoClient.close();
// }

// async function refreshOnlineClients() {

//     const time = new Date();
//     onlineClients = onlineClients.filter(c => c.time.getTime() > time.getTime() - 10000);

//     //console.log(onlineClients);

//     const mongoClient = await MongoClient.connect(MONGO_URI, MONGO_CLIENT_OPTIONS);
//     const db = mongoClient.db(MONGO_DB_NAME);

//     await db.collection('clients').updateMany(
//         {
//             //status: { $nin: ['off', 'inv'] },
//             clientId: { $nin: onlineClients.map(c => c.id) }
//         },
//         {
//             $set:
//             {
//                 status: 'off',
//                 isRefreshRequired: true
//             }
//         }
//     )
//     // await Promise.all(offlineClients.map(c => db.collection('clients').updateOne({ clientId: c.clientId },
//     //     {
//     //         $set:
//     //         {
//     //             status: 'off',
//     //             isRefreshRequired: true
//     //         }
//     //     }
//     // )));

//     mongoClient.close();



// }