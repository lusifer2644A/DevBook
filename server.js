const express = require('express');

const app = express();
const PORT = process.env.PORT || 5000;


app.get('/', (req, res) => {
        res.send("API RUNNING ON PORT")
})


app.listen(PORT, () => {
        console.log(`MeetBook running on port ${PORT}`);
})