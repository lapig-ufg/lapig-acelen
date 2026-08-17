//Ponto de entrada do app (usado ao publicar o script como Earth Engine App).
//userInterface.js só monta o objeto 'app' e o exporta; é este script que efetivamente
//Importando o módulo
var userInterface = require('users/Amazonas21/acelen:userInterface.js')

//inicializa a interface e o mapa.
userInterface.app.init()
