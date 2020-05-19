const Mongo = require('mongodb');
const statusCodes = require('../const/statusCodes');
const dbClient = require('../db/dbClient');
const { authoriseTilUser } = require('./../authoriseTilUser');


// const updateUser = app => {
//     app.post('/api/updateUser', async (req, res) => {
//         const { ghId, liId, ghAccessToken, liAccessToken } = req.body;
//         try {
//             let authResult = await authoriseTilUser({ ghId, liId, ghAccessToken, liAccessToken });
//             let tilUser = authResult.payload;
//             if (!tilUser) {
//                 res.status(200);
//                 res.json(authResult);
//                 return;
//             }

//             await dbClient.updateUser({ _id: tilUser._id, likedTils });
//             res.status(200);
//             res.json({ status: statusCodes.SUCCESS, message: 'User data has been updated successfully', payload: null });
//         }
//         catch (err) {
//             res.status(500);
//             console.error(err);
//             res.json({ status: statusCodes.ERROR, message: err, payload: null });
//         }
//     });
// };



module.exports = app => {
    //updateUser(app);
};