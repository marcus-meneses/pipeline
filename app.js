/* eslint-disable no-undef */
'use strict';
require('dotenv').config({ path: './.env' });
const express = require('express');
const bodyParser = require('body-parser');
const Port = process.env.API_PORT;
const Method = require('./classes/method');

global.methods = [];
global.timeouts = [];

global.timeouts['ticker']=setInterval(function () {
    //console.log('--------------------------------');
    //console.log('Methods:',Object.keys(global.methods));
    //console.log('Timeouts:',Object.keys(global.timeouts));
    //console.log('Memory:',(process.memoryUsage().heapUsed/1024/1024).toFixed(2),'MB');
    
}, 1000);

let app = express();

app.use(bodyParser.json());

//create route named pipeline with parameter flow
app.post('/pipeline/:flow', (req, res) => {
    let flow = req.params.flow;
    let context = req.body;
    try {
        let responseData = context;
        res.json({ context: responseData, pipeline: flow });
    } catch (err) {
        res.status(401);
        res.json({ Error: err.message });
    }
});

app.all('/runsingle/:method', async (req, res) => {
    let method = req.params.method;
    let context = req.body;
    let verb = req.method;
    context.req = req;
    context.returnData = null;
    try {
        const methodHandler = new Method(method, context, verb);
        const methodResponse = await methodHandler.run();

        if (methodResponse.error) {
            res.status(methodResponse.error.status);
            res.json({ Error: methodResponse.error.message });
        } else {
            res.json(methodResponse);
        }
    } catch (err) {
        console.log(err);
        return;
        res.status(err.status);
        res.json({ Error: err.message });
    }
});

const server = app.listen(Port, () => {
    console.log(`API running on port ${Port}`);
});

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);
process.on('SIGQUIT', shutDown);

function shutDown() {
    console.log(`API terminated, port ${Port} released`);
    process.exit(0);
}
