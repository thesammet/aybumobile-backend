const cheerio = require('cheerio-without-node-native')
const moment = require('moment')
const fetch = require('node-fetch')

let dayAndMeal = []
const foodListUrl = "https://aybu.edu.tr/sks/tr/sayfa/6265/Ayl%C4%B1k-Yemek-Men%C3%BCs%C3%BC"
const getFoodList = async () => {
    try {
        let response = await fetch(foodListUrl);
        let htmlString = await response.text();
        const $ = cheerio.load(htmlString);

        let dayAndFoodList = []; // Can't distinguish between meals and dates because they are both in strong tag. Both are coming.
        let dayList = [];
        let foodList = [];

        // Get all strong tags
        $('.alert')
            .find('strong')
            .each((i, element) => {
                let food = $(element)
                    .text()
                    .replace(/(\r\n|\n|\r)/gm, '')
                    .replace(/\s+/g, ' ')
                    .trim();
                dayAndFoodList.push(food);
            });

        // Get all dates
        dayAndFoodList.forEach((element, index) => {
            if (moment(element, 'DD.MM.YYYY', true).isValid()) {
                dayList.push(element);
            }
        });

        // Get all meals
        $('.alert')
            .find('ul')
            .each((i, element) => {
                let food = $(element)
                    .text()
                    .replace(/(\r\n|\n|\r)/gm, ',')
                    .replace(/\s+/g, ' ')
                    .trim();
                foodList.push(food);
            });

        // return today's food
        let todayFoodList = "off"
        dayList.forEach((element, index) => {
            if (moment().format('DD/MM/YYYY') === element) {
                todayFoodList = foodList[index]
            }
        });
        return todayFoodList == "off" ? null : todayFoodList
    } catch (error) {
        return error
    }
};

module.exports = getFoodList 