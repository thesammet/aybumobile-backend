const cheerio = require('cheerio-without-node-native')
const moment = require('moment')
const fetch = require('node-fetch')

const foodListUrl = "https://aybu.edu.tr/sks/tr/sayfa/6265/Ayl%C4%B1k-Yemek-Men%C3%BCs%C3%BC"
const getFoodList = async () => {
    try {
        let response = await fetch(foodListUrl);
        let htmlString = await response.text();
        const $ = cheerio.load(htmlString);

        let dayAndFoodList = [];
        let dayList = [];
        let dayListResult = [];
        let foodList = [];
        let resultList = [];
        $('h2.mb-2')
            .find('strong')
            .each((i, element) => {
                //console.log(element.children[0].data)
                dayList.push(element.children[0].data);
            });
        $('div.alert')
            .find('ul')
            .each((i, element) => {
                let food = $(element)
                    .text()
                    .replace(/(\r\n|\n|\r)/gm, ',')
                    .replace(/\s+/g, ' ')
                    .trim();
                if (food != (", , , , ," || ", , , ," || ", , , , , ,")) {
                    foodList.push(food);
                }
            });


        // Tarih aralıklarını gün gün ayır ve dayListResult'a ekle
        dayList.forEach((dateRange) => {
            let [startDate, endDate] = dateRange.split('-');
            let currentDate = moment(startDate, 'DD.MM.YYYY');


            while (currentDate.isSameOrBefore(moment(endDate, 'DD.MM.YYYY'))) {
                dayListResult.push(currentDate.format('DD.MM.YYYY'));
                currentDate.add(1, 'day');
            }
        });


        for (let i = 0; i < dayListResult.length; i++) {
            resultList.push({ date: dayListResult[i], meal: foodList[i] })
        }
        return resultList
    } catch (error) {
        return error
    }
};

module.exports = getFoodList 