'use strict';
const utils =    require(__dirname + '/lib/utils'); // Get common adapter utils
const adapter = new utils.Adapter('threema-gw');

// is called when adapter shuts down - callback has to be called under any circumstances!
adapter.on('unload', function (callback) {
    try {
        adapter.setState('info.connection', {val: false}); //connection to Threema gateway not established
        adapter.setState('info.credits', {val: -999});    //set credits at Threema gateway to a defaul value (-999 = 'unknown')
        adapter.setState('info.lastresponse', {val: 'adapter is not running'});
        adapter.log.info('threema gateway stopped - cleaned everything up...');
        callback();
    } catch (e) {
        callback();
    }
});

// Some message was sent to adapter instance over message box.
adapter.on('message', function (obj) {
    if (typeof obj === 'object' && obj.message) {
        if (obj.command === 'send') {
            // sendto command received
            // adapter.log.info('send via Threema gateway: ' + obj.message);
            SendThreemaSimpleMessage(obj)
            GetThreemaGWCredits(false);
        }
    }
});


var ThreemaRequest = require('request');
var ThreemaSecret, ThreemaFrom, ThreemaTo;
const ThreemaURL='https://msgapi.threema.ch';

// start here!
adapter.on('ready', function () {
    GetThreemaGWCredits(true);
    main();
});

function main() {

}

function GetThreemaGWCredits(firstTime){
    var error, response, result, responseFromAPI;
    ThreemaSecret = adapter.config.apisecret;
    ThreemaFrom = adapter.config.from;
    ThreemaTo = adapter.config.to;
    let ThreemaGatewayCall = ThreemaURL +
        '/credits' +
        '?from=' + ThreemaFrom +
        '&secret=' + ThreemaSecret;
    try {
        ThreemaRequest(ThreemaGatewayCall, function (error, response, result) {
            switch(response.statusCode){
                case 200:
                    responseFromAPI = '200 - connection successful';
                    adapter.setState('info.credits', {val: result});    //amount of credits at Threema gateway
                    adapter.setState('info.connection', {val: true});  //connection to Threema gateway established
                    break;
                case 401:
                    responseFromAPI = '401 - API identity or secret are incorrect';
                    adapter.setState('info.credits', {val: -999});    //set credits at Threema gateway to a defaul value (-999 = 'unknown')
                    adapter.setState('info.connection', {val: false});  //connection to Threema gateway established
                    break;
                case 402:
                    aresponseFromAPI = '402 - no credits remain';
                    adapter.setState('info.credits', {val: 0});    //amount of credits at Threema gateway
                    adapter.setState('info.connection', {val: true});  //connection to Threema gateway established
                    break;
                case 404:
                    responseFromAPI = '404 - using phone or email as the recipient specifier, and the corresponding recipient could not be found';
                    adapter.setState('info.connection', {val: true});  //connection to Threema gateway established
                    break;
                case 413:
                    responseFromAPI = '413 - the message is too long';
                    adapter.setState('info.connection', {val: true});  //connection to Threema gateway established
                    break;
                case 500:
                    responseFromAPI = '500 - a temporary internal server error occurs';
                    adapter.setState('info.connection', {val: false});  //connection to Threema gateway not established
                    break;
                default:
                    responseFromAPI = '000 - undefined';
                    adapter.setState('info.credits', {val: -999});    //set credits at Threema gateway to a defaul value (-999 = 'unknown')
                    adapter.setState('info.connection', {val: false}); //connection to Threema gateway not established
            }
            adapter.log.info(responseFromAPI);
            if (firstTime) {adapter.setState('info.lastresponse', {val: responseFromAPI})};

        }).on("error", function (e) {console.error(e);});
    }
    catch (e) { console.error(e); }

}

function SendThreemaSimpleMessage(obj){
    var error, response, result, responseFromAPI;
    ThreemaSecret = adapter.config.apisecret;
    ThreemaFrom = adapter.config.from;
    ThreemaTo = adapter.config.to;
    let ThreemaText = obj.message
    //adapter.log.info(ThreemaText);
    let ThreemaGatewaySendSimple = ThreemaURL + '/send_simple';
    let formdata = {
        from:ThreemaFrom,
        to:ThreemaTo,
        text:ThreemaText,
        secret:ThreemaSecret
    };
    adapter.log.info(ThreemaGatewaySendSimple);
    try {
        ThreemaRequest.post({url:ThreemaGatewaySendSimple, form: formdata}, function (error, response, result) {
            switch(response.statusCode){
                case 200:
                    responseFromAPI = '200 - message send successful';
                    //adapter.setState('info.credits', {val: result});    //amount of credits at Threema gateway
                    adapter.setState('info.connection', {val: true});  //connection to Threema gateway established
                    break;
                case 401:
                    responseFromAPI = '401 - API identity or secret are incorrect';
                    adapter.setState('info.credits', {val: -999});    //set credits at Threema gateway to a defaul value (-999 = 'unknown')
                    adapter.setState('info.connection', {val: false});  //connection to Threema gateway established
                    break;
                case 402:
                    responseFromAPI = '402 - no credits remain';
                    adapter.setState('info.credits', {val: 0});    //amount of credits at Threema gateway
                    adapter.setState('info.connection', {val: true});  //connection to Threema gateway established
                    break;
                case 404:
                    responseFromAPI = '404 - using phone or email as the recipient specifier, and the corresponding recipient could not be found';
                    adapter.setState('info.connection', {val: true});  //connection to Threema gateway established
                    break;
                case 413:
                    responseFromAPI = '413 - the message is too long';
                    adapter.setState('info.connection', {val: true});  //connection to Threema gateway established
                    break;
                case 500:
                    responseFromAPI = '500 - a temporary internal server error occurs';
                    adapter.setState('info.connection', {val: false});  //connection to Threema gateway not established
                    break;
                default:
                    responseFromAPI = '000 - undefined';
                    adapter.setState('info.credits', {val: -999});    //set credits at Threema gateway to a defaul value (-999 = 'unknown')
                    adapter.setState('info.connection', {val: false}); //connection to Threema gateway not established
            }
            adapter.log.info(responseFromAPI);
            adapter.setState('info.lastresponse', {val: responseFromAPI});
        }).on("error", function (e) {adapter.log.error(e);});
    }
    catch (e) { console.error(e); }
}
