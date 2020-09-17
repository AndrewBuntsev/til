const AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-southeast-2' });


exports.sendNotification = function (subject, message, topicARN) {
    // send error notification via AWS SNS
    var params = {
        Subject: subject,
        Message: message,
        TopicArn: topicARN
    };

    (new AWS.SNS()).publish(params, (err, data) => {
        if (err) console.log(err, err.stack);
        else console.log(data);
    });
}
