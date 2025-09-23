//Base de dados utilizadas no app
//Dados
exports.Dataset = {
  'Vigor-Mapbiomas':ee.Image('projects/mapbiomas-public/assets/brazil/lulc/collection9/mapbiomas_collection90_pasture_vigor_v1'),
  'Global Pasture Watch':ee.ImageCollection("projects/global-pasture-watch/assets/ggc-30m/v1/grassland_c"),
  'Mapbiomas':ee.Image('projects/ee-amazonas21/assets/datasets-app/us-brazil'),
  'Embeddings':ee.ImageCollection("GOOGLE/SATELLITE_EMBEDDING/V1/ANNUAL")
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
