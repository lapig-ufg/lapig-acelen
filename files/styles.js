//Função dos estilos
var IconName= function(Name){ 
    return 'https://fonts.gstatic.com/s/i/materialiconsoutlined/'+Name+'/v11/24px.svg'
}

//Estilos do mouse no mapa quando clicar no mapa
exports.stylesMouse = {
            0:{color:'blue',cursor:'crosshair',backgroundColor:'cyan'},
            1:{color:'black',cursor:'hand',backgroundColor:'white'},
}

//Configuração da paleta de cores das classes
exports.palette = {
              'Mapbiomas':{
                          'Soja':'#c71585',
                          'Cana':'#6fd977',
                          'Pastagem':'#fee500',
                          'Vegetação natural':'#33a02c',
                          'Silvicultura':'#9c0027',
                          'Outras lavouras':'#e31a1c',
                          'Outros':'#ffffb2',
                          'Água':'#1f78b4',
                          'Mosaico de usos':'#e974ed'
              }
             
}

//Nome das classes da fonte de dados
exports.classes = {
              'Mapbiomas':[
                            'Soja','Cana','Pastagem','Vegetação natural',
                            'Silvicultura','Outras lavouras','Outros','Água',
                            'Mosaico de usos'
              ]
}

//Cores para o filtro das classes selecioanadas
exports.classesFilter ={
              'Mapbiomas':ee.Dictionary({
                          1:'#c71585',
                          2:'#6fd977',
                          3:'#fee500',
                          4:'#33a02c',
                          5:'#9c0027',
                          6:'#e31a1c',
                          7:'#ffffb2',
                          8:'#1f78b4',
                          9:'#e974ed'
              })
}

exports.codClass = {
                    'Mapbiomas':ee.Dictionary({
                                    1:'Soja',
                                    2:'Cana',
                                    3:'Pastagem',
                                    4:'Vegetação natural',
                                    5:'Silvicultura',
                                    6:'Outras lavouras',
                                    7:'Outros',
                                    8:'Água',
                                    9:'Mosaico de usos'
                    }),
                  }
//Nome das opções das imagens de plano de fundo
exports.ImagesTypes = {
         'Escolha o tipo de imagem Landsat':'Escolha o tipo de imagem Landsat',
         'Imagem Annual do ano da Análise':'Annual',
         'Período Chuvoso do ano da análise':'Wet',
         'Período Seco do ano da análise':'Dry'
}

//Nome das agregações
exports.AggregationTypes = {
        'Moda':'Moda',
        'Original':'Original',
        'Original - Área total':'Original - Área total'
}

//Nome dos gráficos
exports.chartSelect = {
        'Escolha a variável para plotar a série temporal':'Choose options',
        'Cobertura da terra':'landcover',
        'Proporção Área convertida':'perconv',
        'Evolução das áreas de pastagens':'percpasture'
}

//Opções do ano de vigor
exports.yearvigor = ['2000','2001','2002','2003','2004','2005','2006','2007']

//Paleta de cores do Vigor
exports.paletteVigor = {
  'Baixo':'#ed0707',
  'Médio':'#edc307',
  'Alto':'#07ed0b'
}

//Configurações da visualização das imagens
exports.realce = {
        'L5':{
              min : [0,0,0], 
              max : [0.6,0.6,0.6],
              bands: ['B5','B4','B3']
        },
        'L8':{
             min : [0,0,0],
             max : [0.6,0.6,0.6],
             bands: ['B6','B5','B4']
        }
             
}

//Os valores mínimos de máximos para visualização da app
exports.minMax = {
              'Mapbiomas':{min:1,max:9}
}

//Configuração das cores do vigor
exports.configVigor = {
    min:1,
    max:3,
    palette:['#ed0707','#edc307','#07ed0b']
}

//Configuração do Botão de Filtro do uso do solo   
exports.confBtnFilter = {
    label:'Filtro classe de uso do solo',
    imageUrl: IconName('filter_alt'),
    disabled:true,
    style:{
          position:'top-left',
          fontStyle:'bold',
          padding: '1px 1px'
    }
}

//Configuração do Botão de Seleção da área análise 
exports.confBtnFarm = {
    label:'Selecionar áreas',
    imageUrl: IconName('label'),
    disabled:true,
    style:{
        position:'top-left',
        fontStyle:'bold',
        padding: '1px 1px'
    }
}

//Configuração do Botão de informação da camda
exports.confBtnPopup = {
    label:'Informação da camada',
    imageUrl: IconName('info'),
    disabled:true,
    style:{
        position:'top-left',
        fontStyle:'bold',
        padding: '1px 1px'
    }
}
//Configuração do Botão do gráfico da série
exports.confBtnSeries = {
    label:'Gráfico Série Temporal',
    imageUrl: IconName('timeline'),
    disabled:true,
    style:{
        position:'top-left',
        fontStyle:'bold',
        padding: '1px 1px'
    }
}

//Estilos dos rótulos
exports.labelStyle = {
                fontSize:'8',
                textAlign : 'center',
                padding: '4px 0px 0px 0%'
              }

//Configuração do Botão de download
exports.confBtnDown = {
    label:'Download das camadas',
    imageUrl: IconName('vertical_align_bottom'),
    disabled:false,
    style:{
        position:'top-left',
        fontStyle:'bold',
        padding: '1px 1px'
    }
  
}
//Estilos do título das ferramentas
exports.labelTitleTool = {
                fontSize:'13px',
                fontWeight:'bold',
                textAlign:'center',
                width:'95%'
}

//Estilos da toolkit versão 2.0
//Dados do GPW
exports.pastureYearGPW = ['2000','2001','2002','2003','2004','2005',
                    '2006','2007','2008','2009','2010','2011',
                    '2012','2013','2014','2015','2016','2017',
                    '2018','2019','2020','2021','2022']

//Cor do mapa de pastagem
exports.styleclass = {
      min:1,
      max:1,
      palette:['gold']
}
//Paleta de cores do Vigor
//Paleta de cores do Vigor
exports.paletteRusle = {
  '0 - 1.5':'#006837',
  '1.5 - 3.0':'#31a354',
  '3.0 - 5.0':'#addd8e',
  '5.0 - 10':'#ffffb2',
  '10 - 20':'#feb24c',
  '20 - 50':'#f03b20',
  '> 50':'#bd0026'
}
