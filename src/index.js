const {Wit,log} = require("node-wit")
const highlight = require("cli-highlight").highlight
require("dotenv").config()

const messageText = "saya mesen mie goreng"


const actions = {
	confirm_order(contextmap){
		return {context_map:{...contextmap}}
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


const client = WitClient(Wit,config)

function handleContext(ctx){
    if (typeof ctx != "object"){
        throw new Error("argumen rsp harus object")
    }
    const val = Object.entries(ctx.entities)
	const ctxVal = val[0][1][0].name
	const key = ctx.intents[0].name
    const newCtx= {
    	[key]:ctxVal
    }
    
    return {context_map : { ...newCtx}}
    
}

async function App(){
    let context = {}
    let final   = false
    let sessionId = ""
    let respMsg = ""
    let messageText2 = ""
    try {
    if(!sessionId){
    	const resp = await client.message(messageText,context)
    	respMsg  = resp
    	messageText2 = messageText 

    }else{
    	const resp2 = await client.message(messageText2,context)
    	respMsg = resp2

    }
	
	context = handleContext(respMsg)
	if (context || !final){
		console.log("========== event ==================================")
		const respEvt = await client.event(sessionId,messageText,context)
		sessionId++
		context = {...context}
		respEvt.context_map = context.context_map
		respEvt.is_final = final

		const jsonStringEvt = JSON.stringify(respEvt, null, 2);
		console.log(highlight(jsonStringEvt, { language: 'json', theme: 'default' }))
		console.log(sessionId)

	}
	console.log("==================== message ==============================")
	console.log(JSON.stringify(context,null,2))
	const jsonStringMsg = JSON.stringify(respMsg, null, 2);
	console.log(highlight(jsonStringMsg, { language: 'json', theme: 'default' }))

	

    } catch(err){
        console.log("error :",err)
    }
}

App()
