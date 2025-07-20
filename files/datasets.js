//Base de dados utilizadas no app
//Vigor das pastagens
exports.Dataset = {
  'Vigor-Mapbiomas':ee.Image('projects/mapbiomas-public/assets/brazil/lulc/collection9/mapbiomas_collection90_pasture_vigor_v1'),
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
