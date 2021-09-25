import axios from "axios";
import request from "request";
import slug from "slug";
import { TELEGRAM_BOT_TOKEN, TELEGRAM_GROUP_ID } from '../constants';

require("dotenv").config();

let sendNotification = async (user) => {
  const labeldataCOvid = await getDataCovidByProvinceService();
  return new Promise((resolve, reject) => {
    try {
      let data = {
        chat_id: TELEGRAM_GROUP_ID,
        parse_mode: "HTML",
        text: `${labeldataCOvid.data}`
//         text: `Fullname: <b>${user.fullName}</b>
// Email: <b>${user.email}</b>
// Description: <i>${user.description}</i>`,
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

let getDataCovidByProvinceService = async () => {
  try {
    const data = await axios.get('https://vnexpress.net/microservice/sheet/type/covid19_2021_by_location').then(resp => {
      return resp;
    });
    const nowDay = new Date();
    let currentDate = `"${nowDay.getDate()}/${nowDay.getMonth() + 1}"`;
    let array, objectData = {}, currentIndex;
    if (data.data) {
      // array = data.data.replace('\"', '').replace(`\`, '');
      array = data.data.split('\n');
      for (let i = 0; i < array.length; i++) {
        // Get province
        const hasKEY = array[i].indexOf(',');
        const key = array[i].slice(0, hasKEY);
        const newString = array[i].slice(hasKEY + 1);

        if (array[i].slice(hasKEY + 1).split(',').length > 2) {
          objectData[slug(key, '/').toString().replace(/[^a-zA-Z/0-9 ]/g, '')] = array[i].slice(hasKEY + 1).split(',');
        }
      }
    }

    const payload = [];
    let dataString = `<b>Số ca nhiễm Covid-19 ngày ${slug(currentDate, '/').toString()}</b>`;
    objectData.ngay.forEach((province, index) => {
      if (slug(province, ' ').toString() !== 'iii') {
        payload.push({
          province: province.replace('"'),
          cases: slug(objectData[slug(currentDate, '/').toString()][index]).toString() === 'iii' ? '0' : slug(objectData[slug(currentDate, '/').toString()][index])
        });
        const caseINdex = slug(objectData[slug(currentDate, '/').toString()][index]).toString() === 'iii' ? '0' : slug(objectData[slug(currentDate, '/').toString()][index]);

        dataString += `
${province.replace('"', '').replace('\"', '')} : <b>${caseINdex}</b>`;
      }
    });

    return {
      data: dataString
    };
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  sendNotification: sendNotification,
  sendMeAGif: sendMeAGif,
  getDataCovidByProvinceService: getDataCovidByProvinceService
};