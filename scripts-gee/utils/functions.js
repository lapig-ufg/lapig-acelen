//Importando modulos
var datasets = require('users/Amazonas21/acelen:files/datasets.js')
var style = require('users/Amazonas21/acelen:files/styles.js')

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
  
  //Mascara de QA (pixel limpo) da imagem do Landsat 5
  var maskL5 = img.expression("(b('QA_PIXEL') == 5440 || b('QA_PIXEL') == 5504)");

  //Mascara de QA (pixel limpo) da imagem do Landsat 8
  var maskL8 = img.expression("(b('QA_PIXEL') == 21824 || b('QA_PIXEL') == 21952)");

  //Condicao para selecionar a image Landsat 5 ou Landsat 8
  var condition =  year.lt(2013)
  var qaMask = ee.Image(ee.Algorithms.If(condition,maskL5,maskL8))

  //Máscara final: pixel com QA bom E com valor de banda válido (>0)
  var result = qaMask.and(img.gt(0))

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
      
      //Verificando qual o tipo da estação
      if(seasonType == 'Wet'){
          finalyear = parseInt(year)+1
      }else{
          finalyear = year
      }
      //Filtrando, excluinod as nuvens e calculando a mediana da imagem do Landsat
      var imgMap = img.filterDate(year+Season[seasonType].initial,finalyear+Season[seasonType].end)
                          .map(exports.clearCloud)
                          .median()
                          .clip(bounds.bounds())
      
      //Inserindo a imagem no Mapa          
          imgMap = ui.Map.Layer(imgMap,realceImg,seasonType+" "+sateliteName+" "+year).setShown(1)
      maplayer.layers().insert(0,imgMap)
  
}

//Criação da Legenda do mapa
exports.createLegend = function(maplayer,names,palette,title){
          
          
          // Posição da legenda no mapa
          var legend = ui.Panel({style: {position: 'bottom-left',padding: '8px 15px'}});
          
          // Criar o título do legenda do mapa
          var legendTitle = ui.Button({
                  label:'▼ '+title+' (Ocultar)',
                  style: {
                      fontWeight: 'normal',
                      fontSize: '12px',
                      margin: '0 0 4px 0',
                      padding: '0'
                  },
                  onClick:function(){
                          var estaAberto = panelClass.style().get('shown')
                          panelClass.style().set('shown', !estaAberto)
                          legendTitle.set('label',estaAberto ? '▲ '+title+' (Mostrar)' : '▼ '+title+' (Ocultar)')
                  }
          })
          

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
          
          var panelClass = ui.Panel()
          // Adicionando cores e nomes na legenda
          for (var i = 0; i< names.length; i++) {
                
                //Adicionando cada classe na legenda
                //legend.add(makeRow(palette[names[i]], names[i]));
                panelClass.add(makeRow(palette[names[i]], names[i]))
          }  
          legend.add(panelClass)
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

exports.runprocess = function(map,area,nomeAsset,year,type,datasource,buffer){
  
  var Carregando = ui.Panel([ui.Label('Gerando a classificação...')])
  map.add(Carregando)

  //Resultado default para os tipos 'Original'/'Original - Área total', que não calculam estatística por talhão
  var stats = null

  var minMax = style.minMax//{
  //  'Mapbiomas':{min:1,max:9}
  //}
  
  //Configuração dos valores máximos e mínimos
  var min = minMax[datasource]['min']
  var max = minMax[datasource]['max']
 
  //Area de estudo
  var vetor = area//ee.FeatureCollection(area)
  
  //Verificar se o valor do buffer é 0 
  if (parseInt(buffer) > 0){
      vetor = vetor.geometry().buffer(ee.Number(buffer))
  }
  
  //Nome da camada
  var nameDataset = ee.String(nomeAsset).split('/').get(-1).getInfo()
 
  //Importando imagem do mapbiomas
  var reclass = datasets.Dataset[datasource]//ee.Image('projects/ee-amazonas21/assets/datasets-app/us-brazil')
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
      stats = reclass.reduceRegions({
          collection: vetor,//.bounds()//vetor.filterBounds(vetor.bounds()),
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
      //map.addLayer(vetor,{color:'cyan'},nameDataset)
    }
  }
  classe.evaluate(function(results){
        map.remove(Carregando)
  })
  return stats
}

//Remove todas as camadas atualmente adicionadas ao mapa
exports.RemoveAllLayers= function(map){
  var layers = map.layers()
  layers.forEach(function(layer){
    map.remove(layer)
  })
}

//----------------------------------------------------------Função versão 2.0 Toolkit---------------------------------------------------
//Dictionary containing spectral indexes and their formulas
var indexes = {
    'CAI': "(b('B12') / b('B11'))", //Cellulose absorption index
    'NDVI': "(b('B8') - b('B4')) / (b('B8') + b('B4'))", //Normalized Difference Vegetation Index
    'NDWI': "(b('B8') - b('B11')) / (b('B8') + b('B11'))", //Normalized Difference Water/Wetness Index
    'CRI1': "1/(b('B2')) - 1/(b('B3'))", //Carotenoid Reflectance Index 1
    'ARI_1': "(1/b('B3') - 1/b('B5'))*1000", //Anthocyanin Reflectance Index 1
    'RGR': "b('B4')/b('B3')", //Simple Ratio Red/Green Red-Green Ratio
    'PSRI': "(b('B4') - b('B2') )/(b('B6'))", //Plant Senescence Reflectance Index
    'SATVI': "((b('B11') - b('B4'))/(b('B11') + b('B4') + 0.5))*(1*0.5)-(b('B12')/2)*0.0001" //Soil-Adjusted Total Vegetation Index
}

//List of names to rename amplitude bands
var BandsWetAmp = ['blue_wet_amp', 'green_wet_amp', 'red_wet_amp', 'rededge1_wet_amp',
    'rededge2_wet_amp', 'rededge3_wet_amp', 'nir_wet_amp', 'rededge4_wet_amp', 'swir1_wet_amp', 'swir2_wet_amp',
    'ndvi_wet_amp', 'ndwi_wet_amp', 'cai_wet_amp', 'cri1_wet_amp', 'ari1_wet_amp', 'rgr_wet_amp',
    'psri_wet_amp', 'satvi_wet_amp'
];

//Function made to estimate spectral indexes for each image in the Image Collection
exports.spectralFeatures = function (image) {

    var ndvi = image.expression(indexes["NDVI"]).select([0], ['NDVI']) //Calculates the NDVI
    var ndwi = image.expression(indexes["NDWI"]).select([0], ['NDWI']) //Calculates the NDWI
    var cai = image.expression(indexes["CAI"]).select([0], ['CAI']) //Calculate thes CAI
    var cri1 = image.expression(indexes["CRI1"]).select([0], ['CRI1']) //Calculates the CRI1
    var ari1 = image.expression(indexes["ARI_1"]).select([0], ['ARI_1']) //Calculates the ARI_1
    var rgr = image.expression(indexes["RGR"]).select([0], ['RGR']) //Calculates the RGR
    var psri = image.expression(indexes["PSRI"]).select([0], ['PSRI']) //Calculates the PSRI
    var satvi = image.expression(indexes["SATVI"]).select([0], ['SATVI']) //Calculates the SATVI

    image = image.addBands([ndvi, ndwi, cai, cri1, ari1, rgr, psri, satvi]) //Adds the spectral indexes to the image with the spectral bands

    return image
}

//Function made to reduce all images/band in the collection to their specific reductor, e.g. median.
exports.temporalFeatures = function(image) {

    var min = image.reduce(ee.Reducer.min()) //Reduces all bands to the minimum of their values per pixel
    var max = image.reduce(ee.Reducer.max()) //Reduces all bands to the maximum of their values per pixel
    var median = image.reduce(ee.Reducer.median()) //Reduces all bands to the median of their values per pixel
    var stdv = image.reduce(ee.Reducer.stdDev()) //Reduces all bands to the standaard deviation of their values per pixel

    var amp = (image.reduce(ee.Reducer.max()) //Reduces all bands to the amplitude (max - min) of their values per pixel
        .subtract(image.reduce(ee.Reducer.min()))
        .rename(BandsWetAmp))

    var result = (ee.Image().select()
        .addBands([min, max, median, amp, stdv])) //Creates an empty image and add the reduced bands to it
    return result
}

//Function made to reduce all images/band in the collection to their percentiles, e.g. 10%, 25%, 75% and 90%.
exports.temporalPercs = function(image) {

    var percs = image.reduce(ee.Reducer.percentile([10, 25, 75, 90]))

    var result = ee.Image().select().addBands([percs])

    return result
}

//Function made to generate the latitude and the longitude of each pixel
exports.getLatLong  = function(img){
    // Gets the projection
    var proj = ee.Image(img).select(0).projection() //Gets the reference projection from one image
    var latlon = ee.Image.pixelLonLat() //Estimates the latitude and longitude for each pixel
    return ee.Image(img).addBands(latlon.select('longitude', 'latitude')) //Adds the latitude and the longitude as a band
}

//Function made to mask cloud and shadows in the images, based on the quality band from Google Cloud Score (cs)
exports.maskClouds = function(img) {
    // The threshold for masking; values between 0.50 and 0.65 generally work well.
    // Higher values will remove thin clouds, haze & cirrus shadows.
    var CLEAR_THRESHOLD = 0.50;
    var mask = img.select('cs').gte(CLEAR_THRESHOLD); //Masks the pixels with 50% of chance or more to be clouds.
    return img.updateMask(mask);
}

exports.res_bilinear = function(img) {

    //#Resamples the 20 meters bands to 10m using bilinear resampling method
    var bands = img.select('B5', 'B6', 'B7', 'B8A', 'B11', 'B12'); //Bands to be resampled from 20 to 10 meters

    return img.resample('bilinear').reproject({
        'crs': bands.projection().crs(), //Gets the projection
        'scale': img.select('B8').projection().nominalScale() //Gets the pixel size
    })
}

//Function made to mask some weird black edges which can appear in some Sentinel 2 images
exports.maskEdges = function(s2_img){
    return s2_img.updateMask(
        s2_img.select('B8A').mask().updateMask(s2_img.select('B9').mask())) //Defined
}

//Gera amostras estratificadas (pastagem/não-pastagem) para treinar o classificador Random Forest,
//balanceando a quantidade de pontos de cada classe proporcionalmente à área ocupada por ela
exports.automatedSamples = function(img,year,area,numSamples,scale,buffer,fonte){


  //Area images
  var cliparea = area.geometry().buffer(parseInt(buffer))

  //Calculation samples
  var reducers = ee.Reducer.sum().combine({
                reducer2: ee.Reducer.frequencyHistogram(),
                sharedInputs: true
  });
  
  //Selecionando as fontes para amostragem
  if(fonte == 'Global Pasture Watch'){
    var target = img.filterDate(year+'-01-01',year+'-12-31')
              //.filterBounds(cliparea)
              .first()
              .gt(0)
  }else if(fonte == 'Mapbiomas'){
    var target = img.select('classification_'+year)
              //.clip(cliparea)
              .eq(3)
    
  }else if(fonte == 'Todas'){
    var target  = img//.clip(cliparea)
  }

  
  target = target.rename('targetMap')//exports.thresholdSamples(img,cliparea,type,year)
  
  var prop = target.reduceRegion({
            reducer:reducers,//ee.Reducer.frequencyHistogram(),
            geometry:cliparea,
            scale:10
  })
  
  
  
  //Distribui numSamples proporcionalmente entre as classes 0 (não-pastagem) e 1 (pastagem),
  //conforme a frequência de cada uma dentro da área de interesse
  var classData = ee.Dictionary(prop.get('targetMap_histogram'))
  var total = ee.Number(classData.get('0')).add(ee.Number(classData.get('1')))
  var classPasture = ee.Number(classData.get('1')).divide(total).multiply(numSamples)
  var classNotPasture = ee.Number(classData.get('0')).divide(total).multiply(numSamples)
  
  ////Create points from samples positive and negative from GPW maps
  var samples = target.stratifiedSample({
    numPoints:numSamples,
    classBand: 'targetMap',
    region:cliparea,
    scale:scale,
    geometries: true,
    classValues:[0,1],
    classPoints:[classNotPasture.round(),classPasture.round()]
  })
  
  return {'samples':samples}//'target-data':target,'samples':samples}
}

exports.calcFeatureImportance = function(classifier){
 //Calculates the feature/variable importance for the classifier
    var importance = ee.Dictionary(classifier.explain().get('importance'))
    
    //Do something to rank/sort the importance of the features from highest to lowest
    var keys = importance.keys().sort(importance.values()).reverse()
    var values = importance.values(keys);

    var rows = keys.zip(values).map(function(list) {
        return {
            c: ee.List(list).map(function(n) {
                return {
                    v: n
                };
            })
        }
    })

    var dataTable = {
        cols: [{
                id: 'band',
                label: 'Band',
                type: 'string'
            },
            {
                id: 'importance',
                label: 'Importance',
                type: 'number'
            }
        ],
        rows: rows
    };
    
    //Prints the ranked feature importance
    return keys.zip(values)
}

//----------------------------------------------------------Função RUSLE---------------------------------------------------
//Remover edges
var removeEdges = function(img){
  return img.updateMask(img.select('B8A').mask().updateMask(img.select('B9').mask())); 
}

//Removendo nuvens e sombras 
var removeCloud = function(img){
  var mask_exp = "(b('QA_PIXEL') == 21824 || b('QA_PIXEL') == 21952)"
  var cloud_mask = img.expression(mask_exp).add(img.gt(0)).select([0],['QA']);
  return img.updateMask(cloud_mask)
}

//Calculando o NDVI 
var calcNDVI = function(img){
  return img.normalizedDifference(['SR_B5','SR_B4']).select([0],['NDVI'])
}

//Calcular o Erosividade do solo - R
exports.calcR = function(aoi,year){
  
  var id = "UCSB-CHG/CHIRPS/DAILY"
  var precipMean = ee.ImageCollection(id)
             .filterDate(year+'-01-01',year+1+'-01-01')
             .filterBounds(aoi)
             //.select('precipitation')
             .mean()
             .clip(aoi)

             
  var month = ee.List.sequence(1,12)
  var listR = month.map(function(date){
      
      var precipMonth = ee.ImageCollection(id)
                .filterDate(year+'-01-01',year+1+'-01-01')
                .filterBounds(aoi)
                .filter(ee.Filter.calendarRange(date, date, 'month'))
                .mean()
                .clip(aoi)
  
      var R = precipMonth.divide(precipMean)
          R = R.pow(ee.Image(0.85))
          R = R.multiply(67.355)
      
      return R
          
  })
  var R = ee.ImageCollection(listR).reduce(ee.Reducer.sum())
      R = R.rename('R')
    
  return R
}
//Calcular a erodibilidade do solo - K
exports.calcK = function(aoi){
  // Define Data Sources
  var soilTextureImage = ee.Image("OpenLandMap/SOL/SOL_TEXTURE-CLASS_USDA-TT_M/v02")
  
  // --- K Factor Calculation (from OpenLandMap Soil Texture) ---
  var soil_raw = soilTextureImage.select('b0').clip(aoi).rename('soil')
  
  //opção de Usar dados da Embrapa
  var K = soil_raw.expression( // USDA TT Codes to K values
    "(b('soil') == 12) ? 0.0053" + // Clay
      ": (b('soil') == 11) ? 0.0170" + // Silty clay
        ": (b('soil') == 10) ? 0.045" +  // Sandy clay
           ": (b('soil') == 9) ? 0.050" +  // Clay loam
            ": (b('soil') == 8) ? 0.0499" + // Silty clay loam
            ": (b('soil') == 7) ? 0.0394" + // Sandy clay loam
            ": (b('soil') == 6) ? 0.0264" + // Loam
            ": (b('soil') == 5) ? 0.0423" + // Silt loam
            ": (b('soil') == 4) ? 0.0394" + // Silt
            ": (b('soil') == 3) ? 0.036" +  // Sandy loam
            ": (b('soil') == 2) ? 0.0341" + // Loamy sand
            ": (b('soil') == 1) ? 0.0288" + // Sand
             ": 0")
             .rename('K').clip(aoi);
   //Retornando a imagem K
   return K
}

//Calcular o fator topográfico - LS
exports.calcLS = function(aoi){
  var elevationImage = ee.Image("USGS/SRTMGL1_003")
  var elevation = elevationImage.select('elevation')
  var slope_deg = ee.Terrain.slope(elevation);
  var slope = slope_deg.divide(180).multiply(Math.PI).tan().multiply(100).clip(aoi);
  
  var comprimento = 150
  
  var LS4 = Math.sqrt(comprimento/22)
  var LS2 = slope.multiply(slope).multiply(0.0065)
  var LS3 = slope.multiply(0.45)
  var LS1 = LS3.add(LS2).add(0.065)
  var LS = LS1.multiply(LS4).rename("LS").clip(aoi);
  
  return LS
  
}

//Calcular o Manejo de uso pelo Indice de Vegetação - C
exports.calcC = function(initial,final,aoi){
  
  // --- C Factor Calculation (from LandSat) ---
  var s2 = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2")//ee.ImageCollection("COPERNICUS/S2_HARMONIZED")//ee.ImageCollection("MODIS/006/MOD13A2")
    .filterBounds(aoi)
    .filterDate(initial, final)
    .map(removeCloud)
    .map(calcNDVI)
 
       
  var ndvi_median = s2.median().select('NDVI').clip(aoi)
    
  // Using original C Factor formula provided by user
  var expression = '0.1 * (((- NDVI + 1) / (2)))'
  var C = ndvi_median.expression(expression, {'NDVI': ndvi_median})
    .rename('Factor-C')
    .unmask(0.5); // Unmask gaps with a mid-range C value (adjust if needed)
  
  return C
  
}

//Calcular do suporte de prática - P
exports.calcP = function(date1,date2,aoi){
  var elevationImage = ee.Image("USGS/SRTMGL1_003")
  var elevation = elevationImage.select('elevation')
  var slope_deg = ee.Terrain.slope(elevation);
  var slope = slope_deg.divide(180).multiply(Math.PI).tan().multiply(100).clip(aoi);
  
  var modisLandCoverCollection = ee.ImageCollection("MODIS/061/MCD12Q1")//ee.ImageCollection("MODIS/006/MCD12Q1");
  // --- P Factor Calculation (from MODIS LULC & Slope) ---
  // O MCD12Q1 tem atraso de publicação (o ano mais recente escolhido no menu RUSLE pode ainda não
  // ter imagem disponível); nesse caso, usa a imagem mais recente existente em vez de falhar com coleção vazia.
  var filteredLulc = modisLandCoverCollection.filterDate(date1, date2).select('LC_Type1')
  var hasLulcImage = filteredLulc.size().gt(0)
  var lulcImage = ee.Image(ee.Algorithms.If(
        hasLulcImage,
        filteredLulc.first(),
        modisLandCoverCollection.select('LC_Type1').sort('system:time_start', false).first()
  ))
  var lulc = lulcImage // Gets the LULC map for the year defined by date1/date2 (ou o mais recente disponível)
        .clip(aoi).rename('lulc');
  // Map.addLayer (lulc, {}, 'LULC (MODIS)', false); // Optional display
  var lulc_slope = lulc.addBands(slope);
  var P = lulc_slope.expression( // Based on LULC type and slope ranges
     "(b('lulc') < 11) ? 0.8" + // Forests/Shrubs etc.
      ": (b('lulc') == 11) ? 1.0" + // Wetlands (assume P=1)
      ": (b('lulc') == 13) ? 1.0" + // Urban
      ": (b('lulc') > 14) ? 1.0" + // Barren/Water etc. (assume P=1)
      // Cropland/Mosaic P-values based on slope: Adjust these based on local practices/literature if known
      ": (b('slope') <= 2) and ((b('lulc')==12) or (b('lulc')==14)) ? 0.6" +
    ": (b('slope') > 2 and b('slope') <= 5) and ((b('lulc')==12) or (b('lulc')==14)) ? 0.5" +
    ": (b('slope') > 5 and b('slope') <= 8) and ((b('lulc')==12) or (b('lulc')==14)) ? 0.5" +
    ": (b('slope') > 8 and b('slope') <= 12) and ((b('lulc')==12) or (b('lulc')==14)) ? 0.6" +
    ": (b('slope') > 12 and b('slope') <= 16) and ((b('lulc')==12) or (b('lulc')==14)) ? 0.7" +
    ": (b('slope') > 16 and b('slope') <= 20) and ((b('lulc')==12) or (b('lulc')==14)) ? 0.8" +
    ": (b('slope') > 20) and ((b('lulc')==12) or (b('lulc')==14)) ? 0.9" +
    ": 1" // Default
  ).rename('P').clip(aoi)
  
  return P
}

//----------------------------------------------------------Função versão 3.0 Toolkit---------------------------------------------------
//-------------------------------------------------Análise de tendência das pastagens----------------------------------------
//--------------------------------------------------------FUNÇÕES AUXILIARES-------------------------------------------------

/**
 * Calcula o Índice de Vegetação por Diferença Normalizada (NDVI).
 */
exports.ndvi = function(img) {
    // NDVI = (NIR - RED) / (NIR + RED) -> (B5 - B4) / (B5 + B4)
    return img.addBands(img.normalizedDifference(['B5', 'B4']).rename('NDVI'));
}

/**
 * Adiciona propriedades de tempo (ano, mês, dia) à imagem.
 */
exports.fillDtProps = function(img) {
    var dt = ee.Date(img.get('system:time_start'));
    return img
        .set('dt_year', dt.get('year'))
        .set('dt_month', dt.get('month'))
        .set('dt_day', dt.get('day'));
};

// ----------------------------------------FUNÇÃO PRINCIPAL: TMWM FILTER---------------------------------------

/**
 * Função principal que realiza o pré-processamento, a filtragem TMWM (Temporal Moving Window Median)
 * e o preenchimento de gaps (Gapfilling) na coleção Landsat.
 */
exports.runTMWMFilter  = function(aoi, idCollection, StartDate, EndDate, qtYears, qtDays,lulc) {
    
    // 1. DADOS: Pré-processamento e Filtragem Inicial
    var data = ee.ImageCollection(idCollection)
        .filterBounds(aoi) // Filtra pela Área de Interesse
        .filterDate(String(StartDate), String(EndDate)) // Filtra pelo intervalo de anos
        .map(removeCloud)                               // Aplica máscara de nuvem/sombra
        .map(exports.ndvi)                              // Calcula NDVI
        .map(exports.fillDtProps)                       // Adiciona propriedades de data
        .select('NDVI');                                // Seleciona apenas a banda NDVI
    
    // Define as janelas de vizinhança temporais a serem usadas
    var listYears = qtYears; // Ex: [1, 2] -> 1 ano antes/depois, 2 anos antes/depois
    var listDays = qtDays;   // Ex: [30, 60] -> 30 dias antes/depois, 60 dias antes/depois
    

    // -------------------1. GAPFILLING POR ANO/MÊS (VIZINHOS MAIS DISTANTES)-------------------------------------------------

    var join_collection_month = data; // Coleção inicial (Primary Collection para o Join)
    
    // Loop para cada janela de ano (e.g., vizinhos de +/- 1 ano, +/- 2 anos)
    for (var i in listYears) {
        var window = listYears[i];
        var namefield = "img_same_month_0" + window + "_year"; // Nome da propriedade: e.g., 'img_same_month_01_year'
        
        // Calcula a diferença de tempo máxima (em milissegundos) para a janela de ano
        var millisYear = ee.Number(window).multiply(365.25 * 1000 * 60 * 60 * 24);

        // Filtro: Encontra imagens cuja data esteja dentro da janela de +/- 'window' anos
        var dtMonth = ee.Filter.maxDifference({
            "difference": millisYear,
            "leftField": "system:time_start",
            "rightField": "system:time_start"
        });

        // Configuração do Join: Salva todas as correspondências na propriedade 'namefield'
        var join = ee.Join.saveAll({
            matchesKey: namefield,
            ordering: "system:time_start",
            ascending: true,
        });

        // Aplicação do Join Iterativo
        // 'primary' acumula as propriedades a cada iteração; 'secondary' é sempre a coleção
        // limpa 'data', que é o universo de imagens candidatas a vizinhas para o filtro 'dtMonth'.
        join_collection_month = ee.ImageCollection(join.apply({
            primary: join_collection_month,
            secondary: data,
            condition: dtMonth
        }));

        // Mapeamento: Processa a lista de vizinhos para calcular a Mediana
        join_collection_month = join_collection_month.map(function(img){
            var dateMonth = ee.Date(img.get('system:time_start')).get('month');
            
            // Converte a lista de vizinhos (salva no 'namefield') de volta para ImageCollection
            var imgMonth = ee.ImageCollection.fromImages(ee.List(img.get(namefield)))
                // Filtra para garantir que as imagens sejam **EXATAMENTE** do mesmo mês do ano corrente (mesmo mês, anos diferentes)
                .filter(ee.Filter.calendarRange(dateMonth, dateMonth, 'month'));
                
            // Redução: Calcula a mediana de todos os vizinhos filtrados
            var reduceImg = imgMonth.reduce(ee.Reducer.median());
            
            // Define a mediana calculada como uma propriedade da imagem
            return img.set(namefield, reduceImg);
        });
    }
    
    // -------------------2. GAPFILLING POR DIAS (VIZINHOS MAIS PRÓXIMOS)-------------------------------------------------
    // Coleção de entrada é a coleção que já tem as propriedades de ano/mês
    var join_collection_days = join_collection_month; 
    
    // Loop para cada janela de dias (e.g., vizinhos de +/- 30 dias, +/- 60 dias)
    for (var i in listDays) {
        var window = listDays[i];
        var namefield = "img_same_month_" + window + "_days"; // Nome da propriedade: e.g., 'img_same_month_30_days'
        var millisDays = ee.Number(window).multiply(1000 * 60 * 60 * 24); // Diferença em milissegundos em dias
        
        // Filtro: Encontra imagens dentro da janela de +/- 'window' dias
        var dtDays = ee.Filter.maxDifference({
            "difference": millisDays,
            "leftField": "system:time_start",
            "rightField": "system:time_start"
        });
        
        //Salvando os atributos 
        var join = ee.Join.saveAll({
            matchesKey: namefield,
            ordering: "system:time_start",
            ascending: true,
        });
        
        // Aplicação do Join Iterativo: 'primary' acumula as propriedades a cada iteração;
        // 'secondary' é sempre a coleção limpa 'data' (mesmo padrão do loop de ano/mês acima).
        join_collection_days = ee.ImageCollection(join.apply({
            primary: join_collection_days,
            secondary: data,
            condition: dtDays
        }));

        // Mapeamento: Processa a lista de vizinhos para calcular a Mediana
        join_collection_days = join_collection_days.map(function(img){
            // Converte a lista de vizinhos (salva no 'namefield') de volta para ImageCollection
            var redutorImg = ee.ImageCollection.fromImages(img.get(namefield))
                               .reduce(ee.Reducer.median());
            
            // Define a mediana calculada como uma propriedade da imagem
            return img.set(namefield, redutorImg);
        });
    }
    
    // ----------------------------------------3. APLICAÇÃO DO PREENCHIMENTO (GAPFILLING)-------------------------------------------------
    
    // Mapeia sobre a coleção final para aplicar o preenchimento de fato
    var l8_gapfilled = join_collection_days.map(function(img) {
        
        var lulcYear = lulc.select(ee.String('classification_').cat(img.get('dt_year')))
                           .eq(3)
                           .selfMask()
        var newImage = ee.Image(img).select('NDVI')//.clip(aoi); // Imagem NDVI original com Gaps
        
        // Sequência de preenchimento (prioriza o mais estável/distante primeiro, ou vice-versa, dependendo da ordem dos loops)
        
        // LOOP 1: Aplica o filtro de Ano/Mês
        for (var i in listYears){
            var window = listYears[i];
            var imgCol = ee.Image(img.get("img_same_month_0"+window+"_year"))//.clip(aoi); // A mediana já foi reduzida e salva como Image
            var median_same_month = imgCol;
            
            // Identifica os pixels faltantes (gaps) na 'newImage'
            var gaps = newImage.unmask(-9999).eq(-9999);
            
            // Preenche: newImage = newImage (pixels bons) + (gaps * mediana)
            newImage = newImage.unmask(0).add(gaps.multiply(median_same_month));
        }
        
        // LOOP 2: Aplica o filtro de Dias (Preenche os gaps que sobraram)
        for(var i in listDays){
            var window = listDays[i];
            var imgCol = ee.Image(img.get("img_same_month_"+window+"_days"))//.clip(aoi); // A mediana já foi reduzida e salva como Image
            var median_same_month = imgCol;
            
            // Re-identifica os gaps restantes (que não foram preenchidos pelo LOOP 1)
            var gaps = newImage.unmask(-9999).eq(-9999);
            
            // Preenche: newImage = newImage (pixels bons/preenchidos) + (gaps * mediana)
            newImage = newImage.unmask(0).add(gaps.multiply(median_same_month));
        }
        newImage = newImage.clip(aoi)
        newImage = newImage.addBands(newImage.multiply(lulcYear).rename('NVDI-pasture'))
        
        // Retorna a imagem final, copiando a propriedade de tempo original
        var medianNVDIprop = newImage.reduceRegion({
                          reducer:ee.Reducer.median(),
                          geometry:aoi,
                          scale:30
        })
        
        //Retornando o valor da data e o NDVI mediano
        return newImage.set("system:time_start",img.get("system:time_start"))
                       //.set("median-ndvi",medianNVDIprop.get('NVDI-pasture'))
                       .set("median",medianNVDIprop.get('NVDI-pasture'))
    });
    // Retorna as duas coleções: a original (para comparação) e a preenchida
    return {
        //'original-data': data,
        'gapfill-data': l8_gapfilled,
        
    };
};

//Função para calcular a tendência
exports.convertImage2FeatureAtr = function(img){
                  return ee.Feature(null,{
                    'system:time_start': img.get('system:time_start'),
                    'median': img.get('median'),
                    'trend': img.get('trend')
                  })
              }


//Função para calcular a tendência
exports.getTrend = function(dataimg,bandTime,field){//band,bandTime,field){
  
      //Aplicando a Regressão Linear
      var linearRegression = dataimg.reduceColumns({//dataimg.select(band).reduceColumns({
                              reducer:ee.Reducer.linearFit(),
                              selectors:[bandTime,field]
      })
  
      //Calculando a tendência do NDVI
      dataimg = dataimg.map(function(img){
                var ndvi_trend = ee.Number(img.get(bandTime)).multiply(linearRegression.get('scale'))
                    ndvi_trend = ndvi_trend.add(linearRegression.get('offset'))
                    return img.set('trend',ndvi_trend)
                })
  
      //Convertendo a imageCollection para FeatureCOllection
      var feat = dataimg.map(exports.convertImage2FeatureAtr)

      //Ordenando por data para o gráfico não ligar pontos fora de ordem cronológica
      feat = feat.sort(bandTime)

      return feat
}

//----------------------------------------------------------Função versão 4.0 Toolkit---------------------------------------------------

exports.getTrendGPP = function(intial,final,data){
  //Parâmetros de entrada
  var ini = parseInt(intial)
  var fin = parseInt(final)

  //Anos que realmente existem como banda 'classification_<ano>' no dataset Mapbiomas (lulc).
  //Usado para restringir o período pedido apenas aos anos com máscara de pastagem disponível,
  //evitando selecionar uma banda inexistente mais abaixo (causa do erro "Image.multiply: ...
  //Got 0 and 1" quando lulc.select() não encontrava a banda do ano).
  var lulc = datasets.Dataset['Mapbiomas']
  var lulcYears = lulc.bandNames().getInfo()
        .filter(function(b){ return b.indexOf('classification_') === 0 })
        .map(function(b){ return parseInt(b.replace('classification_','')) })

  //Interseção entre o período pedido pelo usuário e os anos disponíveis em lulc
  var validYears = lulcYears.filter(function(y){ return y >= ini && y <= fin })

  //Dados do bimestre
  var bimestres = ee.List(['-01-01','-03-01','-05-01','-07-01','-09-01','-11-01'])
  var anos = ee.List.sequence(2000,2024,1)

  //Criando a Lista de Bimestre
  var name = anos.map(function(ano){
                return bimestres.map(function(bimestre){
                        return ee.String(ee.Number(ano).int()).cat(bimestre)
                })
  }).flatten()

  //Renomeando as bandas
  var folder = ee.data.listAssets('projects/ee-amazonas21/assets/Acelen/uGPP/')
  var listAssets = []
  var assets = folder['assets']
      assets.forEach(function(src){
        var files = ee.data.listAssets(src.id)
            files['assets'].forEach(function(asset){
                    listAssets.push(ee.Image(asset.id))
        })
   
  })

  var col = ee.ImageCollection.fromImages(listAssets)
  var gpp = col.filterBounds(data.geometry()).toBands().multiply(0.1).rename(name)
              
  //Criando a ImageCollection
  var imgCollection = ee.ImageCollection.fromImages(name.map(function(n){
              return gpp.select(ee.String(n)).rename('uGPP')
                          .set('system:time_start',ee.Date(ee.String(n)).millis())
                          .set('year',ee.Date(ee.String(n)).get('year'))
  })).filter(ee.Filter.inList('year', validYears))
  var gppPasture = imgCollection.map(function(img){
      var mask = lulc.select(ee.String('classification_').cat(ee.String(img.get('year'))))
                     .eq(3)
                       
      var newImage = img.multiply(mask).rename('gpp-pasture').selfMask()
      var medianGPP = newImage.reduceRegion({
                        reducer:ee.Reducer.median(),
                        geometry:data.geometry(),
                        scale:30
                      })
      return img.set('system:time_start',img.get('system:time_start'))
                .set('year',img.get('year'))
                .set('median',medianGPP.get('gpp-pasture'))
  }).filter(ee.Filter.inList('year', validYears))
             
  //Criando a ImageCollection
  var trendGPP = exports.getTrend(gppPasture,'system:time_start','median')
      trendGPP = trendGPP.map(function(feat){
                    return feat.set('median',feat.get('median'))
      })
  return trendGPP
}

//--------------------------------------------------------Função versão 5.0 Toolkit--------------------------------------------- 
exports.analisarBiomassa = function(param) {
  
  var DRY_BIOMASS_FACTOR = param.GRASS_LUEMAX_FACTOR * param.IPCC_FACTOR
  var grassland_mask = param.mask_grass.filterDate('2024-01-01','2024-12-31').first().gte(1)

  // Definir o período de análise (Janeiro de 2025 a Abril de 2026)
  var startDate = ee.Date('2025-01-01');
  var endDate = ee.Date('2026-05-31'); // Data limite exclusiva (garante a inclusão de abril de 2026)

  // Calcular o número total de meses no período
  var numberOfMonths = endDate.difference(startDate, 'month').round();
  var monthlyOffsets = ee.List.sequence(0, numberOfMonths.subtract(1));

  // Criar a coleção de imagens mensais de uGPP
  var monthlyCollection = ee.ImageCollection.fromImages(monthlyOffsets.map(function(n) {
    n = ee.Number(n);
    var start = startDate.advance(n, 'month');
    var end = start.advance(1, 'month');
    var daysInMonth = end.difference(start, 'day'); // Conta os dias dinamicamente

    // Filtra ugpp para o mês específico
    var ugppMonth = param.ugpp
        ugppMonth = ugppMonth.filterBounds(param.geom)
                             .filterDate(start, end);

    // Calcula a média mensal, aplica os fatores e multiplica pelos dias do mês
    var meanImg = ugppMonth.mean()
      .multiply(param.UGPP_SCALE_FACTOR)
      .multiply(0.01) // gC/m²/dia  para toneladas C/ha
      .multiply(daysInMonth) // Multiplica pelo número de dias do mês
      .rename('tC_ha_month');

    // Retorna a imagem com propriedades temporais para controle
    return meanImg.set({
      'month': start.get('month'),
      'year': start.get('year'),
      'days': daysInMonth,
      'system:time_start': start.millis()
    });
  }));

  // Criar a coleção mensal de biomassa seca aplicando a máscara e o fator correspondente
  var monthlyBiomass = monthlyCollection.map(function(img) {
    return img.updateMask(grassland_mask)
      .multiply(DRY_BIOMASS_FACTOR)
      .rename('tC_ha_month')
      .copyProperties(img, ['month', 'year', 'system:time_start']);
  });

  return monthlyBiomass
 
}
