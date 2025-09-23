//Import functions
var func = require('users/Amazonas21/acelen:files/functions.js')
var data = require('users/Amazonas21/acelen:files/datasets.js')
var styles = require('users/Amazonas21/acelen:files/styles.js')

//Parameters of the random forest algorithm
var rfNTrees = 500; //#Number of random trees - lesser faster, but worst. 100-500 is the optimal;
var rfBagFraction = 0.5; //#Fraction (10^-2%) of variables in the bag - 0.5/50% is the default;
var rfVarPersplit = 13 //#Number of varibales per tree branch - estimated by the square root of the number of variables used in the feature space;

//Function made to convert deegre image to percent
function radians(img) {
    return img.toFloat().multiply(Math.PI).divide(180)
}

//var gppdata = data.datasets['gpp']
var terrain = ee.Algorithms.Terrain(ee.Image("NASA/NASADEM_HGT/001")); //Terrain variables (i.e. elevation, slope, aspect) extraction from the NASADEM 
var elevation = terrain.select('elevation'); //Selection of the elevation band
var slope = (radians(terrain.select('slope'))).expression('b("slope")*100'); //Selection of the slope band and conversion from deegre to percentage

//List of names to rename the bands
var BandsWet = ['blue_wet', 'green_wet', 'red_wet', 'rededge1_wet', 'rededge2_wet', 'rededge3_wet',
    'nir_wet', 'rededge4_wet', 'swir1_wet', 'swir2_wet', 'ndvi_wet', 'ndwi_wet', 'cai_wet',
    'cri1_wet', 'ari1_wet', 'rgr_wet', 'psri_wet', 'satvi_wet'
];

//Creating automated smaples
//var samplesautomated = func.automatedSamples(imgs,type,year,area,numberSamples,scale)

//########################################

//Main function, responsible to execute the classification. Accept as parameters the chart name (e.g. 'SE-22-X-A') and the year (e.g. 2022)
function run_classfication(carta, year,samples,target,mask) {

    //var nm_carta = carta; //Changes the chart variable name
    
    var cartas_area = carta//cartas.filter(ee.Filter.eq('grid_name', nm_carta)); // Filters the main charts feature collection by the choosed chart
    var cartas_buffer = cartas_area.geometry().buffer(5000); // Selects the charts around the choosed chart

    //OK
    var START_DATE = year+'-01-01'//ee.Date(year+'-01-01')//ee.Date((year - 1) + '-07-01'); //Start date to filter the image collection (usually six months before the main year)
    var END_DATE = year+'-12-31'//ee.Date(year+'-12-31')//ee.Date((year + 1) + '-06-30'); //End date to filter the image collection (usually six months after the main year)

    //OK
    var s2 = ee.ImageCollection("COPERNICUS/S2_HARMONIZED") //Selects the Sentinel 2 TOA Harmonized time series 
        .filterBounds(cartas_buffer) //Filters the images that intersects with the main and neighbor charts
        .filterDate(START_DATE, END_DATE) //Filters the images by the range of dates (start and end)
    
    //OK
    var csPlus = (ee.ImageCollection('GOOGLE/CLOUD_SCORE_PLUS/V1/S2_HARMONIZED') //Selects the Google Sentinel 2 AI Cloud Score +, the best cloud and shadow mask from Sentinel 2
        .filterBounds(cartas_buffer) //Filters the images that intersects with the main and neighbor charts
        .filterDate(START_DATE, END_DATE)); //Filters the images by the range of dates (start and end)
    
    //OK
    var csPlusBands = csPlus.first().bandNames(); //Get the band names of the Cloud Score+ bands

    //OK
    var s2CloudMasked = (s2.linkCollection(csPlus, csPlusBands) //Link the Sentinel collection with the CloudScore+
        .filter(ee.Filter.lte('CLOUDY_PIXEL_PERCENTAGE', 80)) //Filter the images with more than 80% of cloud
        .map(func.maskEdges) //Applies the filter to mask fault edges
        .map(func.maskClouds) //Applies the filter to mask cloud and shadows
        .map(func.res_bilinear)); //Applies the bilinear resampling on the lower resolution images (i.e. 20 meters)
    
    //OK - Applies the spectral index calculations and selects the bands to be used
    var spectralDataNei = (s2CloudMasked
        .map(func.spectralFeatures)
        .select(['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B8A',
            'B11', 'B12', 'NDVI', 'NDWI', 'CAI', 'CRI1', 'ARI_1', 'RGR',
            'PSRI', 'SATVI'
        ]));
    
    //OK - Calculates the 25% NDVI percentile to use as a noise mask
    var wetThresholdNei = (spectralDataNei
        .select("NDVI")
        .reduce(ee.Reducer.percentile([25])));
    
    
    //OK - Function made to get the image NDVI and mask it according to the 25% NDVI percentile
    function onlyWetSeasonNei(image){
        var seasonMask = image.select("ndvi_wet").gte(wetThresholdNei);
        return image.mask(seasonMask);
    }
        
    //OK - Applies the 25% NDVI percentile mask to each image in the collection
    var wetSpectralDataNei = (spectralDataNei
        .select(spectralDataNei.first().bandNames(), BandsWet)
        .map(onlyWetSeasonNei));
    
    //OK - Applies the functions to calculate percentiles, get latitude and longitude, calculate the temporal reducers and adds the elevation and slope data.
    var temporalData = func.getLatLong(func.temporalPercs(wetSpectralDataNei))
      .addBands([func.temporalFeatures(wetSpectralDataNei),elevation, slope]);
    
    //OK
    var featureSpace = ee.Image(temporalData)
    
    //OK - Defines the name of the column to be used as training reference (e.g. cons_2022); NEEDS TO BE INTERGER DATA (i.e. 1 ,2 ,3 4)
    var classFieldName = 'cons_' + year;
    
    //Samples to train
    var trainSamples = samples
    
    //Creates and define the classifier parameters (NUmber of Trees, Variables per Split, Minimum Leaf Population, Bag Fraction, Max nodes and Seed)
    var classifier = ee.Classifier.smileRandomForest(rfNTrees, rfVarPersplit, 1, rfBagFraction, null, parseInt(year));

    //Sets the classifier to the Probability Mode - Default is CLASSIFICATION
    classifier = classifier.setOutputMode('PROBABILITY');
    
    
    //Crosses the training samples with the feature space variables to associate the information with the classes
    var trainSamplesFeeded = (featureSpace.sampleRegions({
        collection: trainSamples,//.filterBounds(cartas_buffer).filter(ee.Filter.neq(classFieldName, null)),
        properties: [target],//[classFieldName],
        scale: 20,
        tileScale: 16,
        
    }));
    
    
    //Trains the classifier using the training samples asociated with the feature space information
    classifier = classifier.train(trainSamplesFeeded, target);//classFieldName);
    
    //Visualization Feature Importance
    //print(func.calcFeatureImportance(classifier))
    
    //Takes the trained classifier and use it to classify the entire feature space pixel by pixel
    var classification = featureSpace.multiply(mask).classify(classifier).select(0);
        classification = classification.gte(0.51).selfMask()
        
    
    return {'classification':classification}
   
}

// ##############CHECK#################
exports.getRun = function(year,area,numberSamples,Buffer,fonteSamples,classDataUse){
  
  //Ano selecionado
  var year = year
  if(fonteSamples == 'Todas'){
    //Unificação de todas as bases de dados
    var imgsMapbiomas = data.Dataset['Mapbiomas']
        imgsMapbiomas = imgsMapbiomas.select('classification_'+year).eq(3)
    
    var imgsGPW = data.Dataset['Global Pasture Watch']
        imgsGPW = imgsGPW.filterDate(year+'-01-01',year+'-12-31').first().gt(0)
                  
    var imgs = imgsMapbiomas.multiply(imgsGPW)
    
  }else{
    //Base de dados selecionada pelo usuário
    var imgs = data.Dataset[fonteSamples]
  
  }
  
  //Parametros da amostras
  var numberSamples = parseInt(numberSamples)
  var scale = 10
  
  var mask = area.map(function(feat){
        return feat.set('value',1)  
  }).reduceToImage({properties: ['value'],reducer: ee.Reducer.first()}).selfMask();
  
  //Creating automated smaples
  var samplesautomated = func.automatedSamples(imgs,year,area,numberSamples,scale,Buffer,fonteSamples)
  
  print(samplesautomated['samples'])
  
  //Run classification and GPP
  if (classDataUse == 'Sentinel-2'){
    
    var classRF = run_classfication(area,year,samplesautomated['samples'],'targetMap',mask)
  
    
  }else if(classDataUse == 'Embeddings'){
    
    //Classificador Random Forest
    var classifier = ee.Classifier.smileRandomForest(rfNTrees, rfVarPersplit, 1, rfBagFraction, null, parseInt(year));

    //Sets the classifier to the Probability Mode - Default is CLASSIFICATION
    classifier = classifier.setOutputMode('PROBABILITY');
    
    var featEmbeddings = data.Dataset['Embeddings']
        featEmbeddings = featEmbeddings
                          .filterBounds(area)
                          .filterDate(year+'-01-01',year+'-12-31')
                          .toBands()
    
    //Crosses the training samples with the feature space variables to associate the information with the classes
    var trainSamplesFeeded = featEmbeddings.sampleRegions({
        collection: samplesautomated['samples'],
        properties: ['targetMap'],
        scale: 10,
        tileScale: 16,
    });
    
    classifier = classifier.train(trainSamplesFeeded, 'targetMap');//classFieldName);
    
    var classification = featEmbeddings.multiply(mask).classify(classifier).select(0);
        classRF = classification.gte(0.51).selfMask()
        
    var classRF =  {'classification':classRF}
  }
  
  return [classRF['classification'],samplesautomated['samples']]
}

