/**
	* File: index.js
	* Description:  Script do servidor dentro do repositório https://github.com/csviana/portfolio
	* Author: Cleirton Viana
	* Create Date: 19/05/2018
*/
'use strinct';
//Carregando pacotes de roteamento
var express = require('express');
var app = express();

//Configurando Rota Principal
app.use("/", express.static("public"));

//Iniciando a Aplicação:
app.listen(80);