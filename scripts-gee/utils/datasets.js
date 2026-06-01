//Base de dados utilizadas no app
//Dados
exports.Dataset = {
  //Dataset versão 1.0 toolkit
  'Vigor-Mapbiomas':ee.Image('projects/mapbiomas-public/assets/brazil/lulc/collection9/mapbiomas_collection90_pasture_vigor_v1'),
  'Mapbiomas':ee.Image('projects/ee-amazonas21/assets/datasets-app/us-brazil'),
  
  //Dataset versão 2.0 toolkit
  'Embeddings':ee.ImageCollection("GOOGLE/SATELLITE_EMBEDDING/V1/ANNUAL"),
  'Global Pasture Watch':ee.ImageCollection("projects/global-pasture-watch/assets/ggc-30m/v1/grassland_c"),
  
  //Dataset versão 3.0 toolkit - Dados das bacias hidrográficas
  'Bacias Hidrográficas':{
      'DHN250 Nível 1':'projects/mapbiomas-territories/assets/TERRITORIES-OLD/LULC/BRAZIL/COLLECTION9/WORKSPACE/DHN250_LEVEL_1',
      'DHN250 Nível 2':'projects/mapbiomas-territories/assets/TERRITORIES-OLD/LULC/BRAZIL/COLLECTION9/WORKSPACE/DHN250_LEVEL_2',
      'DHN250 Nível 3':'projects/mapbiomas-territories/assets/TERRITORIES-OLD/LULC/BRAZIL/COLLECTION9/WORKSPACE/DHN250_LEVEL_3',

      // ------------BACIAS HIDROGRAFICAS DNAEE ------------- //
      'DNAEE Nível 1':'projects/mapbiomas-territories/assets/TERRITORIES-OLD/LULC/BRAZIL/COLLECTION9/WORKSPACE/BASIN_LEVEL_1_DNAEE',
      'DNAEE Nível 2':'projects/mapbiomas-territories/assets/TERRITORIES-OLD/LULC/BRAZIL/COLLECTION9/WORKSPACE/BASIN_LEVEL_2_DNAEE',
  }
}

//Imagens das classes agrupadas
exports.Imagescluster = {
  'Mapbiomas':ee.Image('projects/ee-amazonas21/assets/datasets-app/us-brazil'),
}

//Imagesn background
exports.ImagesBackground = {
  'L8':ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA'),
  'L7':ee.ImageCollection('LANDSAT/LE07/C02/T1_TOA'),
  'L5':ee.ImageCollection('LANDSAT/LT05/C02/T1_TOA'),
}
