import axios from "axios";
import request from "request";
import { TELEGRAM_BOT_TOKEN, TELEGRAM_GROUP_ID } from '../constants';

require("dotenv").config();

let sendNotification = (user) => {
  return new Promise((resolve, reject) => {
    try {
      let data = {
        chat_id: TELEGRAM_GROUP_ID,
        parse_mode: "HTML",
        text: `Fullname: <b>${user.fullName}</b>
Email: <b>${user.email}</b>
Description: <i>${user.description}</i>
`
      };
      request({
        // GET - https://api.telegram.org/bot2037734889:AAH_0rKAsAezm6CSqirGOq37WbvXLt17BuM/sendMessage?chat_id=-578231241&text=abc
        uri: `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        method: "POST",
        json: data
      }, function (err, res, body) {
        if (!err) {
          resolve("done!");
        } else {
          console.log(err);
          reject(err);
        }
      });
    } catch (e) {
      reject(e);
    }
  });
};

let sendMeAGif = () => {
  return new Promise((resolve, reject) => {
    try {
      let TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
      let TELEGRAM_GROUP_ID = process.env.TELEGRAM_GROUP_ID;

      let data = {
        chat_id: TELEGRAM_GROUP_ID,
        parse_mode: "HTML",
        animation: "https://media.giphy.com/media/mCRJDo24UvJMA/giphy.gif",
        caption: "<b>Check out</b> my <i>new gif</i>"
      };

      request({
        uri: `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendAnimation`,
        method: "POST",
        json: data
      }, function (err, res, body) {
        if (!err) {
          resolve("done!");
        } else {
          console.log(err);
          reject(err);
        }
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  sendNotification: sendNotification,
  sendMeAGif: sendMeAGif
};