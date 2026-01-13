// const fs = require('fs'); // File system module

// fs.writeFileSync('example.txt', 'Hello, World!');
// const arquivo = fs.readFileSync('example.txt', 'utf-8');
// console.log(arquivo);

const moment = require('moment');

const time = new Date();

const timerConvertido = moment(time).format('DD/MM/YYYY HH:mm:ss');

console.log(timerConvertido);