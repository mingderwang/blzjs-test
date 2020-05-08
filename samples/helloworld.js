const { bluzelle } = require('../src/main.js');
const config = require('./blz-config.js');
const gas_params = {'gas_price': '10.0'};
var bz;
const main = async () => { bz = await bluzelle({
          address: config.address,
          mnemonic: config.mnemonic,
          uuid: "demo-c",
          endpoint: config.endpoint,
          chain_id: config.chain_id
     }); 
     try
     {
          res = await bz.create("test1", "awesome", gas_params);
          console.log(typeof res != 'undefined' ? res : "success");
          res = await bz.read("test1", false);
          console.log(typeof res != 'undefined' ? res : "success");
     } catch(e)
     {
          console.log(e)
          console.error(e.message);
     }};
main();
