const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Dados = require('./models/dados')
const path = require('path')
const app = express()
const port = 3000

app.use(bodyParser.json())

const bdURL = 'mongodb://localhost:27017'

mongoose
  .connect(bdURL)
  .then(() => {
    console.log('Conectado ao banco Mongo')
  })
  .catch(error => {
    console.error(error)
  })


app.post('/dados',async (req, res) => {
 try {
    const {temperature} = req.body
    const novoDado = new Dados({temperature});
    await novoDado.save();
    return res.status(201).send({message: "dados salvos", temperatura:temperature})
 } catch (error) {
  return  res.status(500).send({message: "erro ao salvar", errro:error.message})
 }
})

app.get('/dados',async (req, res) => {
try {
    const dados = await Dados.find();
    return res.status(200).json(dados)
} catch (error) {
    return res.sendStatus(500);
}

})


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'temperatura.html'));
});




app.listen(port, () => {
  console.log(`servidor rodando na porta ${port}`)
})
