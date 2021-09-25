import telegramService from "../services/telegramService";

let getHomePage = (req, res) => {
    return res.render("homepage.ejs");
};

let handlePushTeleNotification = async (req, res) => {
    //send noti to telegram
    let user = {
        fullName: req.body.fullName,
        email: req.body.email,
        description: req.body.description
    };
    await telegramService.sendNotification(user);
    //then redirect to the telegram page
    return res.redirect("/telegram");
};

let getTelegramPage = (req, res) => {
    return res.render("telegram.ejs");
};

let sendAnimation = async (req, res) => {
    await telegramService.sendMeAGif();
    return res.redirect("/");
};

let getDataCovidByProvince = async (req, res) => {
    const payload = await telegramService.getDataCovidByProvinceService();
    return res.send(payload);
};

module.exports = {
    getHomePage: getHomePage,
    handlePushTeleNotification: handlePushTeleNotification,
    getTelegramPage: getTelegramPage,
    sendAnimation: sendAnimation,
    getDataCovidByProvince: getDataCovidByProvince
};