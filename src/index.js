const app = require('./app')
const port = process.env.PORT
/* const axios = require('axios');
const cron = require('node-cron');

const job = cron.schedule('0 12 1 * *', async () => {
    try {
        axios({
            method: 'post',
            url: 'https://aybu-mobile.herokuapp.com/food',
            headers: { Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzlkNGY0ZGI4NTUyNjcxMDQwMWI4NTkiLCJpYXQiOjE2OTU4MzA5NjR9.MnjbdWEMl2zIrJ7vCFLtIE1cnuyNe5r46jmJ7Ej-548" },
        })
    } catch (error) {
        console.error('Cron job error:', error);
    }
}, {
    timezone: 'Europe/Istanbul'
});


job.start(); */

app.listen(port, async () => {
    console.log('Server is up on port ' + port)
})