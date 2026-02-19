const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');


mongoose.connect("mongodb://localhost:27017/trena",{useNewUrlParser:true , useUnifiedTopology:true}).
then(()=>{console.log("conectado ao mongo")}).catch(erro=>{
    console.error("erro ao conectaro ao banco", erro)
});

const DadosSchema = new mongoose.Schema({
    distancia: Number
});


const Dados = mongoose.model('Dados',DadosSchema);






const app =  express()

app.use(cors());
app.use(bodyparser.json());




app.get('/', function(req,res){
    res.send('reposta');
})

app.post('/dados',async function(req,res){
 
const data = req.body

try {
    const novoDado = new Dados({distancia:parseFloat(data.distancia)});
    await novoDado.save();

    console.log('dado salvo', data.distancia);

    res.status(200).send(novoDado);

} catch (error) {
    console.error("erro ao conectaro ao banco", error)
}

})


app.get('/distancias',async function(req,res){
try {
    
    const dados = await Dados.find({}, { _id: 0, distancia: 1 })

res.json(dados)

} catch (error) {
    console.error("erro ao conectaro ao banco", error)
    res.status(500).send(error);
}


} )


app.listen(3000, function(){

    console.log("app rodandno na porta 3000")

})






