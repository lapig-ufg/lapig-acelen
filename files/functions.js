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

exports.automatedSamples = function(img,year,area,numSamples,scale,buffer,fonte){
  
 
  //Area images
  var cliparea = area.geometry().buffer(parseInt(buffer))

  //Calculation samples        
  var reducers = ee.Reducer.sum().combine({
                reducer2: ee.Reducer.frequencyHistogram(),
                sharedInputs: true
  });
  
  print(img)
  
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
  
  
  
  var classData = ee.Dictionary(prop.get('targetMap_histogram'))
  var total = ee.Number(classData.get('0')).add(ee.Number(classData.get('1')))
  var classPasture = ee.Number(classData.get('1')).divide(total).multiply(numSamples)
  var classNotPasture = ee.Number(classData.get('0')).divide(total).multiply(numSamples)
  
  
  print(classPasture.toInt())
  print(classNotPasture.toInt())
  print(classData)
  
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
  
  print(samples.aggregate_histogram('targetMap'))
  
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
  var lulc = modisLandCoverCollection.filterDate(date1, date2).select('LC_Type1')
        .first() // Gets the LULC map for the year defined by date1/date2
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
