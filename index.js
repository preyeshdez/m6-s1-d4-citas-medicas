import express from 'express';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import chalk from 'chalk';
import moment from 'moment';
import _ from 'lodash';

moment.locale('es');

const app = express();
const PORT = 3000;

app.listen(PORT, console.log(`Servidor iniciado en http://localhost:${PORT}/usuarios`));

let usuarios = [];

app.get("/usuarios", async (req, res) => {
    const consulta = await axios.get('https://randomuser.me/api/');
    let nombre = consulta.data.results[0].name.first;
    let apellido = consulta.data.results[0].name.last;
    let genero = consulta.data.results[0].gender;
    let id = uuidv4().slice(0, 6);
    let timeStamp = moment().format("DD/MM/YY HH:mm:ss");
    // console.log(nombre, apellido, genero, id, timeStamp);
    usuarios.push({ nombre, apellido, genero, id, timeStamp });
    // console.log(usuarios);

    let listaSeparada = _.partition(usuarios, (usuario) => usuario.genero == 'female');
    // console.log(listaSeparada);

    let mujeres = {
        data: listaSeparada[0],
        nombre: "Mujeres"
    };
    let hombres = {
        data: listaSeparada[1],
        nombre: "Hombres"
    };

    let template = `
        <h3>Total Mujeres: ${mujeres.data.length}</h3>
        <ol>${crearListaHTML(mujeres)}</ol>
        <br>
        <h3>Total Hombres: ${hombres.data.length}</h3>
        <ol>${crearListaHTML(hombres)}</ol>
    `;

    console.log("<--------------- Lista Pacientes --------------->\n")
    crarListaConsola(mujeres);
    crarListaConsola(hombres);
    console.log("<--------------------- FIN --------------------->\n")

    res.send(template);

});

let crearListaHTML = (lista) => {
    let template = ``;

    lista.data.forEach(persona => {
        template += `<li>${persona.nombre} ${persona.apellido} - ID: ${persona.id} - Llegada: ${persona.timeStamp}</li>`;
    })

    return template

}

let crarListaConsola = (lista) => {
    let template = ``;
    let contador = 0

    lista.data.forEach(persona => {
        contador ++
        template += `${contador}. ${persona.nombre} ${persona.apellido} - ID: ${persona.id} - Llegada: ${persona.timeStamp}\n`
    })

    console.log(chalk.white.bgBlue(`Total ${lista.nombre}: ${lista.data.length}`));
    console.log(chalk.blue.bgWhite(template));
}