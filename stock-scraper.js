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
      return parseInt(webpage.data.match(/<td class="td_right"><span class="message_positive">([0-9]+)<\/span> in stock<\/td>/)[1]);
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

module.exports = {getTaydaStock,getSparkfunStock,getPololuStock}