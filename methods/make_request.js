/* eslint-disable no-unreachable */

cog.before(()=>{
    const randomizer = Math.floor(Math.random() * 10);
    if (randomizer>=7) return;
    return cog.error('caught at <before> hook', 500);
});

cog.get(async ()=>{
    try {
        const axios = require('axios').default;
        const returnData = await axios({
            url: url,
            method: method,
            data: data,
            headers: headers
        });
        //console.log(returnData);
        return returnData.data;
    } catch(error) {
        //console.log(error);
        return cog.error('error making request', 500);
    }   
 
});

cog.post(async ()=>{
    return 'post';
});

cog.put(async ()=>{
    return 'put';
});

cog.patch(async ()=>{
    return 'patch';
});

cog.delete(async ()=>{
    return 'delete';
});

cog.any( async ()=>{
    console.log('make_request');
    return 'any verb';
});