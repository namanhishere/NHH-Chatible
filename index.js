require("dotenv").config()
const express = require("express")
const superagent = require("superagent")
let mongoose = require('mongoose');
const {FacebookControler,templateBuilder,messageBuilder} = require("./functions/facebook")
const {User} = require("./functions/mongooes")



const messenger = new FacebookControler(process.env.MESS_API)
const app = new express()
mongoose.connect(process.env.MONGODB)

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.listen(3001)

//weeebhoooook handling

app.get("/webhook", (req,res) => {

  let VERIFY_TOKEN = 'connaingoicanhcontronconnaithaytheliemtaicontron';

  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
  console.log(`🟨 Received Verify Request`);

  if (mode && token === VERIFY_TOKEN) {

      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }

})


app.post("/webhook", (req, res) => {
    let body = req.body;
    if(!body.object === "page") return res.sendStatus(404);

    console.log(`\u{1F7EA} Received webhook:`);
    console.dir(body, { depth: null });
    res.status(200).send("EVENT_RECEIVED");
    body.entry.forEach(entries => {
      entries.messaging.forEach(mess =>{
        // console.log(mess)
        if("read" in mess) handleReadEvent(mess)
        if("message" in mess) handleMessageEvent(mess)
        if("postback" in mess) handlePostbackEvent(mess)
        if("attachments" in mess) handleAttachmentsEvent(mess)
      })
    });
    

})


async function handleReadEvent(mess) {
  
}

async function handleMessageEvent(mess) {
  let userID = mess.sender.id
  console.log(userID)
  let userInDB = await User.find({userID})
  console.log(userInDB)
  if(userInDB=[]) {
    messenger.sendMessage(userID,new messageBuilder().addGenericTemplate(new templateBuilder().setTitle("🤗 Chào mừng bạn lần đầu đã đến với NHH Chatible").setSubtitle("Trước hết, bạn cần phải chấp nhận điều khoản sử dụng của hệ thống").addWebviewButton("Điều khoản sử dụng","https://google.com").addPostbackButton("Tôi đồng ý","NEW_USER_START").data).message)
  }  
  

  

}

async function sendMessage(userID,payloads){
}