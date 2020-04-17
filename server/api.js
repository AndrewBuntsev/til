const statusCodes = require('./const/statusCodes');
const dbClient = require('./dbClient');


const testApi = app => {
    app.get('/api/test', (req, res) => {
        console.log('Accepted request');
        res.status(200);
        res.json({ status: statusCodes.SUCCESS, message: '', payload: { hey: 'hello' } });
    });
};

const testDB = app => {
    app.get('/api/testDB', async (req, res) => {
        // try {
        //     await dbClient.addMessage('ff051f3d-0374-45d4-a16b-eba1b1045735', '5664df86-1abe-468b-8019-d66e17049d6d', 'in', 'guess who');
        //     res.json({ status: statusCodes.SUCCESS, message: '', payload: null });
        // }
        // catch (err) {
        //     res.status(500);
        //     console.error(err);
        //     res.json({ status: statusCodes.ERROR, message: err, payload: null });
        // }
    });
};

// const getClient = app => {
//     app.get('/api/getClient', async (req, res) => {
//         const { clientId } = req.query;
//         try {
//             const client = await dbClient.getClient({ clientId: clientId });
//             if (client) {
//                 res.status(200);
//                 res.json({ status: statusCodes.SUCCESS, message: '', payload: client });
//             } else {
//                 res.status(200);
//                 res.json({ status: statusCodes.SUCCESS, message: `Client with ID ${clientId} not found`, payload: null });
//             }
//         }
//         catch (err) {
//             res.status(500);
//             console.error(err);
//             res.json({ status: statusCodes.ERROR, message: err, payload: null })
//         }
//     });
// };

const addTil = app => {
    app.post('/api/addTil', async (req, res) => {
        const { header, text, user } = req.body;
        try {
            await dbClient.addTil({ header, text, user });
            res.json({ status: statusCodes.SUCCESS, message: 'TIL has been added successfully', payload: null });
        }
        catch (err) {
            res.status(500);
            console.error(err);
            res.json({ status: statusCodes.ERROR, message: err, payload: null });
        }
    });
};

// const updateClient = app => {
//     app.post('/api/updateClient', async (req, res) => {
//         const { clientId, clientName, showNotifications, gender, status } = req.body;
//         try {
//             await dbClient.updateClient({ clientId, clientName, showNotifications, gender, status });
//             const client = await dbClient.getClient({ clientId: clientId });
//             res.json({ status: statusCodes.SUCCESS, message: '', payload: client });
//         }
//         catch (err) {
//             res.status(500);
//             console.error(err);
//             res.json({ status: statusCodes.ERROR, message: err, payload: null });
//         }
//     });
// };

// const addContact = app => {
//     app.post('/api/addContact', async (req, res) => {
//         const { clientId, contact } = req.body;
//         try {
//             await dbClient.addContact({ clientId, contact });
//             const client = await dbClient.getClient({ clientId: clientId });
//             res.json({ status: statusCodes.SUCCESS, message: '', payload: client });
//         }
//         catch (err) {
//             res.status(500);
//             console.error(err);
//             res.json({ status: statusCodes.ERROR, message: err, payload: null });
//         }
//     });
// };

// const removeContact = app => {
//     app.post('/api/removeContact', async (req, res) => {
//         const { clientId, contactId } = req.body;
//         try {
//             await dbClient.removeContact({ clientId, contactId });
//             const client = await dbClient.getClient({ clientId: clientId });
//             res.json({ status: statusCodes.SUCCESS, message: '', payload: client });
//         }
//         catch (err) {
//             res.status(500);
//             console.error(err);
//             res.json({ status: statusCodes.ERROR, message: err, payload: null });
//         }
//     });
// };

const getTils = app => {
    app.get('/api/getTils', async (req, res) => {
        try {
            const tils = await dbClient.getTils({});
            res.status(200);
            res.json({ status: statusCodes.SUCCESS, message: '', payload: tils });
        }
        catch (err) {
            res.status(500);
            console.error(err);
            res.json({ status: statusCodes.ERROR, message: err, payload: null })
        }
    });
};

// const sendMessage = app => {
//     app.post('/api/sendMessage', async (req, res) => {
//         const { senderId, receiverId, message } = req.body;
//         try {
//             await dbClient.sendMessage({ senderId, receiverId, message });
//             const client = await dbClient.getClient({ clientId: senderId });
//             res.json({ status: statusCodes.SUCCESS, message: '', payload: client });
//         }
//         catch (err) {
//             res.status(500);
//             console.error(err);
//             res.json({ status: statusCodes.ERROR, message: err, payload: null });
//         }
//     });
// };



//TODO: add functions to swagger

module.exports = app => {
    testApi(app);
    testDB(app);
    // getClient(app);
    addTil(app);
    // updateClient(app);
    // addContact(app);
    // removeContact(app);
    getTils(app);
    // sendMessage(app);
};