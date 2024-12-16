

cog.before(() => {
  const randomizer = Math.floor(Math.random() * 10);
  if (randomizer >= 0) return;
  return cog.error("caught at <before> hook", 500);
});

cog.get(async () => {
  try {
    const axios = require("axios").default;
    const returnData = await axios({
      url: url,
      method: method,
      data: data,
      headers: headers,
    });
    return returnData.data;
  } catch (error) {
    return cog.error("error during request: "+error.message, 500);
  }
});

cog.post(async () => {
  return "post";
});

cog.put(async () => {
  return "put";
});

cog.patch(async () => {
  return "patch";
});

cog.delete(async () => {
  return "delete";
});

cog.any(async () => {
  console.log("make_request");
  return "any verb";
});