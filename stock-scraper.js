const axios = require("axios");

//This function grabs stock from tayda electronics based on the page name.
//everything on tayde is in the format https://www.taydaelectronics.com/${itemName}.html
async function getTaydaStock(itemName) {
  try {
    const webpage = await axios.get(
      `https://www.taydaelectronics.com/${itemName}.html`
    );
    return parseInt(webpage.data.match(/Qty Available: ([0-9]+)/)[1]);
  } catch (e) {
    return null;
  }
}

async function getPololuStock(productNumber) {
  try {
    const webpage = await axios.get(
      `https://www.pololu.com/product/${productNumber}`
    );
    return parseInt(
      webpage.data.match(
        /<td class="td_right"><span class="message_positive">([0-9]+)<\/span> in stock<\/td>/
      )[1]
    );
  } catch (e) {
    return null;
  }
}

async function getSparkfunStock(productNumber) {
  try {
    const webpage = await axios.get(
      `https://www.sparkfun.com/products/${productNumber}.json`
    );
    return parseInt(webpage.data.quantity);
  } catch (e) {
    return null;
  }
}

async function getAlliedStock(productNumber) {
  try {
    const webpage = await axios.get(
      `https://www.alliedelec.com/product/${productNumber}`
    );
    return parseInt(webpage.data.match(/<p><b>([0-9\,]+)/)[1].replace(",", ""));
  } catch (e) {
    return null;
  }
}

async function getNewarkStock(productNumber) {
  console.log("here",productNumber);
  try {
    const webpage = await axios.get(`https://www.newark.com/${productNumber}`);
    return parseInt(
      webpage.data.match(/    ([0-9\,]+) In stock/)[1].replace(",", "")
    );
  } catch (e) {
    console.log(e);
    return null;
  }
}

async function getStock(vendor, productId) {
  switch (vendor) {
    case "tayda":
      return getTaydaStock(productId);
    case "sparkfun":
      return getSparkfunStock(productId);
    case "pololu":
      return getPololuStock(productId);
    case "newark":
      return getNewarkStock(productId);
    case "allied":
      return getAlliedStock(productId);
    default:
      return null;
  }
}

module.exports = { getTaydaStock, getSparkfunStock, getPololuStock, getStock };