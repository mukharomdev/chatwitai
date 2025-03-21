const {Wit,log} = require("node-wit")
require("dotenv").config()

const config = {
	accessToken : process.env.WITAI_CLIENT_ACCESS_TOKEN,
	logger: new log.Logger(log.DEBUG), // optional
}



function WitClient(wit,config){
	if(typeof wit != "function"){
		throw new Error("Harus berupa class Wit")
	}

	if(typeof config != "object"){
		throw new Error("harus berupa Object ")
	}
	const clientWit = new wit(config)

	return clientWit
}

const messageText = "hi"
const ctxMap	  = {
	ask_order : "ask_order"
}
const sessionId = ""
const client = WitClient(Wit,config)

async function App(){
	const resp = await client.event(messageText,ctxMap)
	console.log(resp)
}

App()
