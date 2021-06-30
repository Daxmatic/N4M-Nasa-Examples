const Max = require("max-api");
let dotenv_module;
try {
	dotenv_module = require("dotenv");
	dotenv_module.config();
} catch (e) {
	Max.post(e, Max.POST_LEVELS.ERROR);
	Max.post("Could not load the dotenv module. Please be sure to send the message 'script npm install' to the node.script object to download node modules", Max.POST_LEVELS.ERROR);
	process.exit(1);
}

if (!process.env.NASA_API_KEY) {
	Max.post("No value for key NASA_API_KEY in .env file. Please make sure to create a file called .env with a NASA API key.", Max.POST_LEVELS.ERROR);
	process.exit(1);
}
const { setNasaApiKey,MarsPhotos} = require('nasa-sdk');
setNasaApiKey(process.env.NASA_API_KEY);




const handlers = {
    [Max.MESSAGE_TYPES.BANG]: () => {
      Max.post("got a bang");
    },
    [Max.MESSAGE_TYPES.NUMBER]: (num) => {
        Max.post('numbert');
    },
    // Get Manifest from the Nasa-Api
    manifest: (darg1) => {
        MarsPhotos
        .manifest(`${darg1}`)
        .then((man) => {
        // Send Manifest Dict to outlet
          Max.outlet("manifest",man)
          Max.outlet("max_sol",man.photo_manifest.max_sol)
          Max.post("manifest",man)
          Max.post("max_sol",man.photo_manifest.max_sol)
        })
        .catch(err => Max.post(err)); 
      },
//Get Pict and fill photo dict


      getpict: (parg1,parg2,parg3) => {
        Max.post(`got my arged message: ${parg1} ${parg2} ${parg3}`);
        MarsPhotos
      .fetch(`${parg1}`, {
        camera: `${parg2}`,
        sol: `${parg3}`
      })
      .then(pp => Max.outlet("getdict",pp))
      .catch(err => console.log(err))
      },
      [Max.MESSAGE_TYPES.ALL]: (handled, ...args) => {
        //Max.post("This will be called for ALL messages");
        Max.post(`The following inlet event was ${!handled ? "not " : "" }handled`);
        Max.post('last',...args);
      }
};
    Max.addHandlers(handlers);
