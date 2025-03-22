const {Wit,log} = require("node-wit")
const highlight = require("cli-highlight").highlight
require("dotenv").config()

const actions = {
	confirm_order(contextmap){
		return {context_map:{...contextmap,ask_order:"ask_order"}}
	}
}

const config = {
	accessToken : process.env.WITAI_CLIENT_ACCESS_TOKEN,
	//logger: new log.Logger(log.DEBUG), // optional
	actions
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
const sessionId = "123"
const client = WitClient(Wit,config)

function handleContext(ctx){
    if (typeof ctx != "object"){
        throw new Error("argumen rsp harus object")
    }
    return {context_map : {...ctx}}
    
}

async function App(){
    let context = {}
    try{
	const resp = await client.message(messageText,context)
	context = handleContext(resp)
	const jsonString = JSON.stringify(resp, null, 2);
	console.log(highlight(jsonString, { language: 'json', theme: 'default' }))
    } catch(err){
        throw new Error("error :",err)
    }
}

App()
