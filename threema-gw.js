'use strict';
const utils =    require(__dirname + '/lib/utils'); // Get common adapter utils

const adapter = new utils.Adapter('threema-gw');

/*Variable declaration, since ES6 there are let to declare variables. Let has a more clearer definition where 
it is available then var.The variable is available inside a block and it's childs, but not outside. 
You can define the same variable name inside a child without produce a conflict with the variable of the parent block.*/
let variable = 1234;

// is called when adapter shuts down - callback has to be called under any circumstances!
adapter.on('unload', function (callback) {
    try {
        adapter.log.info('cleaned everything up...');
        callback();
    } catch (e) {
        callback();
    }
});

// is called if a subscribed object changes
adapter.on('objectChange', function (id, obj) {
    // Warning, obj can be null if it was deleted
    adapter.log.info('objectChange ' + id + ' ' + JSON.stringify(obj));
});

// is called if a subscribed state changes
adapter.on('stateChange', function (id, state) {
    // Warning, state can be null if it was deleted
    adapter.log.info('stateChange ' + id + ' ' + JSON.stringify(state));

    // you can use the ack flag to detect if it is status (true) or command (false)
    if (state && !state.ack) {
        //adapter.log.info('ack is not set!');
    }
});

// Some message was sent to adapter instance over message box. Used by email, pushover, text2speech, ...
adapter.on('message', function (obj) {
    if (typeof obj === 'object' && obj.message) {
        if (obj.command === 'send') {
            // e.g. send email or pushover or whatever
            console.log('send command');

            // Send response in callback if required
            if (obj.callback) adapter.sendTo(obj.from, obj.command, 'Message received', obj.callback);
        }
    }
});

var ThreemaRequest = require('request');
var ThreemaSecret, ThreemaFrom, ThreemaTo, ThreemaText;

const ThreemaURL='https://msgapi.threema.ch';

// is called when databases are connected and adapter received configuration.
// start here!
adapter.on('ready', function () {
    GetThreemaGWCredits();
    main();
});

function main() {

    // The adapters config (in the instance object everything under the attribute "native") is accessible via
    // adapter.config:

    adapter.log.info('config API Secret: '    + ThreemaSecret);
    adapter.log.info('config Threema send from: '    + ThreemaFrom);
    adapter.log.info('config Threema send to: ' + ThreemaTo);
    
    
    /**
     *
     *      For every state in the system there has to be also an object of type state
     *
     *      Here a simple template for a boolean variable named "testVariable"
     *
     *      Because every adapter instance uses its own unique namespace variable names can't collide with other adapters variables
     *
     */

    adapter.setObject('SendMessage', {
        type: 'state',
        common: {
            name: 'testVariable',
            type: 'string',
            role: 'text'
        },
        native: {}
    });

    // in this template all states changes inside the adapters namespace are subscribed
    adapter.subscribeStates('*');


    /**
     *   setState examples
     *
     *   you will notice that each setState will cause the stateChange event to fire (because of above subscribeStates cmd)
     *
     */

    // the variable testVariable is set to true as command (ack=false)
    //adapter.setState('testVariable', true);

    // same thing, but the value is flagged "ack"
    // ack should be always set to true if the value is received from or acknowledged from the target system
    // adapter.setState('testVariable', {val: true, ack: true});

    // adapter.setState('info.connection', {val: true});
    // adapter.setState('info.credits', {val: -999});
    // same thing, but the state is deleted after 30s (getState will return null afterwards)
    //adapter.setState('testVariable', {val: true, ack: true, expire: 30});


}

function GetThreemaGWCredits(){
    var error, response, result;
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
                    adapter.setState('info.lastresponse', {val: '200 - connection successful'});
                    adapter.setState('info.credits', {val: result});    //amount of credits at Threema gateway
                    adapter.setState('info.connection', {val: true});  //connection to Threema gateway established
                    break;
                case 401:
                    adapter.setState('info.lastresponse', {val: '401 - API identity or secret are incorrect'});
                    adapter.setState('info.credits', {val: -999});    //set credits at Threema gateway to a defaul value (-999 = 'unknown')
                    adapter.setState('info.connection', {val: false});  //connection to Threema gateway established
                    break;
                case 402:
                    adapter.setState('info.lastresponse', {val: '402 - no credits remain'});
                    adapter.setState('info.credits', {val: 0});    //amount of credits at Threema gateway
                    adapter.setState('info.connection', {val: true});  //connection to Threema gateway established
                    break;
                case 404:
                    adapter.setState('info.lastresponse', {val: '404 - using phone or email as the recipient specifier, and the corresponding recipient could not be found'});
                    adapter.setState('info.connection', {val: true});  //connection to Threema gateway established
                    break;
                case 413:
                    adapter.setState('info.lastresponse', {val: '413 - the message is too long'});
                    adapter.setState('info.connection', {val: true});  //connection to Threema gateway established
                    break;
                case 500:
                    adapter.setState('info.lastresponse', {val: '500 - a temporary internal server error occurs'});
                    adapter.setState('info.connection', {val: false});  //connection to Threema gateway established
                    break;
                default:
                    adapter.setState('info.lastresponse', {val: '000 - undefined'});
                    adapter.setState('info.credits', {val: -999});    //set credits at Threema gateway to a defaul value (-999 = 'unknown')
                    adapter.setState('info.connection', {val: false}); //connection to Threema gateway established
            }
            adapter.log.info(adapter.config.info.lastresponse);
            }).on("error", function (e) {console.error(e);});
        } 
        catch (e) { console.error(e); }

}
