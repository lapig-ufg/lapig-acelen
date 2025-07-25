//Importando modulos
var datasets = require('users/Amazonas21/acelen-prod:files/datasets') 
var style = require('users/Amazonas21/acelen-prod:files/styles')
  
//--------------------------------------------FUNCTIONS----------------------------------------------
//Reclassificação dos dados do Mapbiomas datasets para aplicação da são matinho
exports.ReClassFromImages = function(image,classes,defaultValue){

  var listOriginal = []
  var listTarget = []
  for(var i in classes){
    var list = classes[i]
    for (var j in list){
        listOriginal.push(parseInt(list[j]))
        listTarget.push(parseInt(i))
    } 
  }  
  var original = listOriginal
  var target = listTarget
  
  var count = image.bandNames().getInfo()
  var listImages = []
  for (var i in count){
    var img = image.select(count[i])
        img = img.remap({
          from:original,
          to:target,
          defaultValue:defaultValue
        })
    img = img.rename(count[i])
    listImages.push(img)
  }
  return ee.Image.cat(listImages)
}

//Remover nuvens da imagem Landsat
exports.clearCloud = function(img){
  
  //Verificar o ano da imagem
  var year = ee.Date(img.get('system:time_start')).get('year')
  
  //Mascara da imagem do Landsat 5
  var maskL5 = img.expression("(b('QA_PIXEL') == 5440 || b('QA_PIXEL') == 5504)").add(img.lte(0));
  
  //Mascara da imagem do Landsat 8
  var maskL8 = img.expression("(b('QA_PIXEL') == 21824 || b('QA_PIXEL') == 21952)").add(img.lte(0));   
  
  //Condicao para selecionar a image Landsat 5 ou Landsat 8 
  var condition =  year.lt(2013)
  var result = ee.Algorithms.If(condition,maskL5,maskL8)
  
  // Returna a imagem sem pixels contimanados por nuvens
  return img.updateMask(result);
  
}

//Visualização das melhores bandas do landsat
exports.showLandsatImage = function(seasonType,maplayer,year,area,realce){
    
      //Criando a variável
      var img,sateliteName,bounds,bands,realceImg,finalyear
      
      //Condicional para verificar qual o satélite usar a partir do ano escolhido     
      if (year < 2012){
        img = datasets.ImagesBackground.L5
        sateliteName = 'Landsat-5'
        realceImg = realce.L5
      }else if(year == 2012){
        img = datasets.ImagesBackground.L7
        sateliteName = 'Landsat-7'
        realceImg = realce.L5
      }else if(year > 2012){
        img = datasets.ImagesBackground.L8
        sateliteName = 'Landsat-8'
        realceImg = realce.L8
      }
      
      //Área de extensão do arquivo externo
      bounds = area//ee.FeatureCollection(area)
      
      //Datas do período do ano
      var Season = {
          'Annual':{
                'initial':'-01-01',
                'end':'-12-31'
            },
           'Dry':{
                'initial':'-06-01',
                'end':'-09-30'
            },
           'Wet':{
                'initial':'-10-01',
                'end':'-04-30'
            }
      }
      if(seasonType == 'Wet'){
          finalyear = parseInt(year)+1
      }else{
          finalyear = year
      }
        
      var imgMap = img.filterDate(year+Season[seasonType].initial,finalyear+Season[seasonType].end)
                          .map(exports.clearCloud)
                          .median()
                          .clip(bounds.bounds())
               
          imgMap = ui.Map.Layer(imgMap,realceImg,seasonType+" "+sateliteName+" "+year).setShown(1)
      maplayer.layers().insert(0,imgMap)
  
}

//Criação da Legenda do mapa
exports.createLegend = function(maplayer,names,palette,title){
          
          // Posição da legenda no mapa
          var legend = ui.Panel({style: {position: 'bottom-left',padding: '8px 15px'}});
          
          // Criar o título do legenda do mapa
          var legendTitle = ui.Label({
                  value:title,
                  style: {
                      fontWeight: 'normal',
                      fontSize: '12px',
                      margin: '0 0 4px 0',
                      padding: '0'
                  }
          });
 
          //Adicionar o título da legenda
          legend.add(legendTitle);
          
          //Função para criar uma linha da legenda
          var makeRow = function(color, name) {
                // Criar o rótulo com o nome da classe
                var colorBox = ui.Label({
                  style: {
                      backgroundColor: color,
                      padding: '6px', //Tamanho
                      margin: '0 0 2px 0'
                  }
                });
 
                // Criando o rótulo da descrição da legenda.
                var description = ui.Label({
                      value: name,
                      style: {
                              margin: '0 0 4px 6px',
                              fontWeight: 'normal',
                              fontSize: '11px'
                      }
                });
 
                // returnando o painel
                return ui.Panel({
                      widgets: [colorBox, description],
                      layout: ui.Panel.Layout.Flow('horizontal')
                });
          };
          
          //Nomes e cores da classes
          var names = names
          var palette = palette
          
          // Adicionando cores e nomes na legenda
          for (var i = 0; i< names.length; i++) {
                
                //Adicionando cada classe na legenda
                legend.add(makeRow(palette[names[i]], names[i]));
                 
          }  
          
          //Adicionando a legenda no mapa
          maplayer.add(legend);
          
}

//Pop-up information from São Martinho datasets
exports.popupInformation = function(map,area,painel){
        map.onClick(function(coords){
          painel.widgets().reset([ui.Label({value:'Carregando informações...'})])
          var layers = map.layers()
              layers.forEach(function(lay) {
                  if(lay.getName() == 'Camada selecionada'){
                    map.remove(lay)
                  }
              })
          var lat = coords.lat
          var lng = coords.lon
          var points = ee.Geometry.Point([lng,lat])
          
          var data = ee.FeatureCollection(area)
          
          var dataValue = data.filter(ee.Filter.bounds(points))
          if(dataValue.size().getInfo() != 0){
            map.addLayer(dataValue,{color:'blue',fillColor: '#00000000',lineType: 'solid'},'Camada selecionada')
            
            var values = dataValue.first().toDictionary().values()
                values = values.map(function(value){return ee.String(value)})
            var keys = dataValue.first().toDictionary().keys()
          
            var columnHeader = ee.List([['Coluna','Valor']])
            var dt = keys.zip(values)
                dt = columnHeader.cat(dt)
                
                dt.evaluate(function(dataTableClient){ 
                            var chart = ui.Chart(dataTableClient)
                                          .setChartType('Table')
                            painel.widgets().reset([chart])
                })
          }else{
            painel.widgets().reset([ui.Label('Nenhuma camada selecionada')])
          }
        })
}

//Gráfico quantitativo de propriedades
exports.countParcels = function(data,typeClass){
    
    //Verificar o tipo de agrupamento
    if(typeClass == 'Moda'){
        data = data.map(function(feature){
            return feature.set({'classe_mode':ee.String(feature.get('mode'))})
        })
        data = data.aggregate_histogram('classe_mode')
    }else{
        data = data
    }
    
    //Retornar o quantitativo de cada classe na área
    return data
}

exports.runprocess = function(map,area,nomeAsset,year,type,datasource){
  
  var Carregando = ui.Panel([ui.Label('Gerando a classificação...')])
  map.add(Carregando)
  
  var minMax = {
    'Mapbiomas':{min:1,max:9}
  }
  
  //Configuração dos valores máximos e mínimos
  var min = minMax[datasource]['min']
  var max = minMax[datasource]['max']
 
  //Area de estudo
  var vetor = area//ee.FeatureCollection(area)
  
  //Nome da camada
  var nameDataset = ee.String(nomeAsset).split('/').get(-1).getInfo()
 
  //Importando imagem do mapbiomas
  var reclass = ee.Image('projects/ee-amazonas21/assets/datasets-app/us-brazil')
      reclass = reclass.select('classification_'+year)
  
  //----------------------Classes 01
  /* Novas classes da coleção 09 Floresta alagável foi adicionado na vegetação natural
     e Dênde, adicionado em Outras lavouras
  1 - Soja
  2 - Cana
  3 - Pastagem
  4 - Vegetação natural
  5 - Silvicultura
  6 - Outras lavouras
  7 - Outros
  8 - Água
  9 - Mosaico de usos
  */
  
  //Adquirindo as cores a partir do arquivo styles
  var paletteColor = style.classesFilter[datasource].values()
      paletteColor = paletteColor.getInfo()
 
  //Definindo o nome do arquivo no 'Layers'
  var nameLayer = nameDataset+' '+type+' '+datasource+' '+year
  
  //Calculando a estatística moda
  if(type == 'Moda'){
      
      //Calcular a moda das classes de cada talhão e/ou propriedade
      var stats = reclass.reduceRegions({
          collection: vetor.filterBounds(vetor.bounds()),
          reducer: ee.Reducer.mode(),
          scale: 30
      });
      
      //Arredondar o valor da moda
      stats = stats.map(function(feature){
          return feature.set({'mode':ee.Number(ee.Number(feature.get('mode')).round()).int()})
      })
     
      //Converter o Vetor para Image
      var classe = stats.reduceToImage({
          properties: ['mode'],
          reducer: ee.Reducer.first()
      });
      
      //Adicionando o dado no mapa
      map.addLayer(classe,{palette:paletteColor,min:min,max:max},nameLayer)
  
  //Visualizar as classes de uso e cobertura do solo original de cada talhão
  }else{
    var classe = reclass
    if (type != 'Original'){
      var layers = map.layers()
          layers.forEach(function(lay){
                if(lay.getName() == nomeAsset){//area){
                        map.remove(lay)
                }
          })
    }
    
    if(type == 'Original'){
      map.addLayer(classe.clip(vetor),{palette:paletteColor,min:min,max:max},nameLayer)
    }else{
      map.addLayer(classe.clip(vetor.bounds()),{palette:paletteColor,min:min,max:max},nameLayer)
      map.addLayer(vetor,{color:'cyan'},nameDataset)
    }
  }
  classe.evaluate(function(results){
        map.remove(Carregando)
  })
  return stats
}

exports.RemoveAllLayers= function(map){
  var layers = map.layers()
  layers.forEach(function(layer){
    map.remove(layer)
  })
}
