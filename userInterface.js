//Importando os modulos
var func = require('users/Amazonas21/acelen:files/functions.js')
var datasets = require('users/Amazonas21/acelen:files/datasets.js')
var options = require('users/Amazonas21/acelen:files/styles.js')

//Criando variáveis de tipagem dinâmica para alteração no mapa pelo usuário
var result,buttonPopUp,buttonSeries,btnFilter,btnFarm,finalyear,edafo
var select_year,selectChart,selectFilter,selectFarm,years,select_fonte, fieldData, fieldValue
var data

//Objeto de atividades do app
var app = {
    //Informaçõas de ativação das ações do usuário no Mapa
    options:{
      activeLegend:0,
      activeChart:0,
      activeChartSeries:0,
      insertNewSeries:0,
      activeinformation:0,
      activeGrafParc:0,
      activeBtnFilter:0,
      activeBtnFarm:0
    },
    //Funções de intereção no mapa do app pelo usuário
    functions:{
      //Construção da interface gráfica
      guis: function(maplayer){
          //-------------------------------Logo-Lapig----------------------------------
          var logo = ee.Image('projects/saomartinho/assets/logo').visualize({
              bands:  ['b1', 'b2', 'b3'],
              min: 0,
              max: 255
          });
          
          //Gerando um Thumbnail da logo do Lapig e UFG
          var thumb = ui.Thumbnail({
                  image: logo,
                  params: {
                        dimensions: '300x80',
                        format: 'png'
                  },
                  style: {height: '50px', width: '200px',padding :'0'}
          });
         
          //Criando o painel para inserir a logo do Lapig e UFG
          var toolPanel = ui.Panel(thumb, 'flow', {width: '310px'});
         
          //--------------------------------Painel-Nome da ferramenta------------------
          var btnLapig = ui.Label({
                        value:'ANÁLISE TEMPORAL DA DINÂMICA DA COBERTURA E USO DA TERRA - AtDCT',
                        style:{fontSize:'20',fontWeight:'bold'}
          })
          
          //---------------------------------Painel-Seleção da área------------------------------
          //Configuração do rótulo do painel da seleção da área
          var legendArea = ui.Label('Dados de Entrada');
              legendArea.style().set(options.labelStyle);
          
          //Ativar o filtro 
          var chkFiltroAsset = ui.Checkbox({
            label:'Filtro',
            disabled:true,
            onChange:function(checked){
              if(checked){
                 fieldData.setDisabled(false)
                 fieldValue.setDisabled(false)
                 var atrb = ee.FeatureCollection(select_area.getValue())
                     atrb = atrb.first().propertyNames().getInfo()
                 
                 fieldData.items().reset(atrb);
                 fieldData.setValue(atrb[0]);
                 
              }else{
                fieldValue.setDisabled(true)
                fieldData.setDisabled(true)
              }
              
            }
          })
          chkFiltroAsset.setDisabled(true)
          
          //Upload do arquivo externo
          var select_area = ui.Textbox({
            placeholder:'Asset',
            style:{
              width:'100px'
            },
            onChange:function(value){
                chkFiltroAsset.setDisabled(false)
              }
            })
            
          
          fieldData = ui.Select({placeholder:'Escolha o Atributo',style:{maxWidth:'100px'}})
          fieldValue = ui.Select({placeholder:'Escolha o Valor',style:{maxWidth:'100px'}})
          fieldData.onChange(function(value){
               var data = ee.FeatureCollection(select_area.getValue())
                          .aggregate_histogram(value)
                          .getInfo()
               fieldValue.items().reset(Object.keys(data))
               fieldValue.setValue(Object.keys(data)[0])
            
          })
          
          fieldValue.setDisabled(true)
          fieldData.setDisabled(true)
          
          var fieldButton = ui.Button({
                  label:'Carregar',
                  onClick:function(){
                    //Voltar a configuração das ações e os camadas do mapa
                    app.options.activeLegend = 0
                    app.options.activeChart = 0
                    app.options.activeChartSeries = 0
                    app.options.insertNewSeries = 0
              
                    //Reiniciar todas a funções 
                    painelChart.widgets().reset()
                    popup.widgets().reset()
                    ChartSeries.widgets().reset()
              
                    //Remoção de itens no mapa
                    maplayer.clear()
                    maplayer.add(buttonPopUp)
                    maplayer.add(buttonSeries)
                    maplayer.add(btnFilter)
                    maplayer.add(btnFarm)
              
                    //Desativar a função de onclick dos botões no mapa
                    buttonPopUp.setDisabled(false)
                    buttonSeries.setDisabled(true)
                    btnFilter.setDisabled(true)
                    btnFarm.setDisabled(true)
                    
                    //Dado selecionado pelo usuário
                    data = ee.FeatureCollection(select_area.getValue())
                    
                    //Ativação do filtro da camada de entrada
                    if(chkFiltroAsset.getValue()){
                      data = data.filter(ee.Filter.eq(fieldData.getValue(),fieldValue.getValue()))
                    }
                    
                    //Nome da camada de entrada para adicionar no mapa do Google Earth Engine
                    var nomeCamada = ee.String(select_area.getValue()).split('/').getString(-1).getInfo()
                
                    //Adicionando a camada e centralizando o mapa
                    maplayer.centerObject(data.bounds())
                    maplayer.addLayer(data,{color:'black'},nomeCamada)
                  }
          })
          //--------------------------------Painel do filtro de dados
          var painelArea = ui.Panel([legendArea,select_area,chkFiltroAsset],
              ui.Panel.Layout.Flow('horizontal'),
              {stretch: 'both'}
          )
          var painelFieldFilter = ui.Panel([fieldData,fieldValue,fieldButton],
              ui.Panel.Layout.Flow('horizontal'),
              {stretch: 'both'}
          )
          //---------------------------------Painel da base de dados---------------------
          var legendBase = ui.Label('Fonte de dados');
              legendBase.style().set(options.labelStyle);
          
          select_fonte = ui.Select({
              items: ['Escolha a fonte','Mapbiomas'],
              placeholder:'Escolha a fonte',
              onChange:function(value){
            
                  years = {}
                  var yearsbands = datasets.Imagescluster[value].bandNames().getInfo()
                  for (var year in yearsbands){
                      year = yearsbands[year].replace('classification_','')
                      years[year] = year
                  }
            
                  var qtdYears = Object.keys(years).length
                  finalyear = Object.keys(years)[qtdYears - 1]
            
                  select_year.items().reset(Object.keys(years));
                  select_year.setValue(Object.keys(years)[0])
            
              }
          })
          var painelFonteDados = ui.Panel([legendBase,select_fonte],
              ui.Panel.Layout.Flow('horizontal'),
              {stretch: 'both'}
          )
          
          //---------------------------------Painel-Ano------------------------------
          var legendYear = ui.Label('Ano da análise');
              legendYear.style().set(options.labelStyle);
          
          select_year = ui.Select()
          
          var painelYear = ui.Panel([legendYear,select_year],
              ui.Panel.Layout.Flow('horizontal'),
              {stretch: 'both'}
          )
          
          //---------------------------------Painel-Tipo Agregação------------------------------
          var legendAgregacao = ui.Label('Tipo de classificação');
              legendAgregacao.style().set(options.labelStyle);
          
          var select_agregacao = ui.Select({
              items: Object.keys(options.AggregationTypes),
              placeholder:'Escolha o tipo'
          });
          
          var painelAgregacao = ui.Panel([legendAgregacao,select_agregacao],
              ui.Panel.Layout.Flow('horizontal'),
              {stretch: 'both'}
          )
          
          //Criação do painel de gráficos
          var painelChart = ui.Panel({style: {position: 'bottom-right',width:'450px',padding: '1px 1px'}});
          
          //Criação do botão de gerar a classificação
          var button = ui.Button({label:'Gerar a classificação do ano de análise'})
              button.onClick(function(){
                
                
                btnFilter.setDisabled(false)
                btnFarm.setDisabled(false)
                
                var typeclass = select_agregacao.getValue()
                var areaInfo = select_area.getValue()
                var yearInfo = select_year.getValue()
                var fonteInfo = select_fonte.getValue()
                
                //Função para adquirir imagem classificada do ano sob a área da usina da São Martinho
                result = func.runprocess(maplayer,data,areaInfo,yearInfo,typeclass,fonteInfo)
                
                //Criar a legenda
                if (app.options.activeLegend == 0){
                      var titulo = 'Classe do uso da terra'
                      func.createLegend(maplayer,options.classes[fonteInfo],options.palette[fonteInfo],titulo)
                      app.options.activeLegend = 1
                }      
                
                //Gerar gráfico apenas da Moda
                if (typeclass == 'Moda'){  
                  buttonSeries.setDisabled(false)
                  
                  if (app.options.activeChart == 0){
                      maplayer.add(painelChart)
                  }else{
                      painelChart.widgets().reset()
                  }
                  
                  var parcels = func.countParcels(result,typeclass)
                  var values = parcels.values()
                  
                  var classChart = parcels.keys().getInfo().map(function(value){
                      return options.classes[fonteInfo][value-1]
                  })
                 
                  var chart = ui.Chart.array.values({array: values, axis: 0, xLabels:classChart})
                          .setChartType('BarChart')
                          .setOptions({
                              title:'Áreas por classes - '+yearInfo+" ("+typeclass+") - "+fonteInfo,
                              legend: {position: 'none'},
                             
                              hAxis: {
                                  title: 'Quantidade de áreas'
                              }
                          })
                  var buttonMin = ui.Button('Ocultar gráfico')
                      buttonMin.onClick(function(){
                       
                        if (app.options.activeGrafParc == 0){
                          app.options.activeGrafParc = 1
                          painelChart.remove(chart)
                          painelChart.style().set('width', '110px');
                          buttonMin.setLabel('Mostrar gráfico')
                        }else{
                          app.options.activeGrafParc = 0
                          chart = ui.Chart.array.values({array: values, axis: 0, xLabels:classChart})
                          .setChartType('BarChart')
                          .setOptions({
                              title:'Áreas por classes - '+yearInfo+" ("+typeclass+") - "+fonteInfo,
                              legend: {position: 'none'},
                             
                              hAxis: {
                                  title: 'Quantidade de áreas'
                              }
                          })
                          painelChart.widgets().reset([chart,buttonMin]);
                          painelChart.style().set('width', '450px');
                          buttonMin.setLabel('Ocultar gráfico')
                        }
                       
                      })
                  if(app.options.activeChart == 0){
                      app.options.activeChart = 1
                      painelChart.widgets().reset()
                      painelChart.add(chart)
                      painelChart.add(buttonMin)
                 
                  }else{
                       app.options.activeGrafParc = 0
                       painelChart.widgets().reset([chart,buttonMin]);
                       painelChart.style().set('width', '450px');
                  }
                  
                }  
           })
          //-------------------------------------Painel Imagem Landsat--------------------------------------
          var legendImage = ui.Label('Imagem Landsat de fundo (Background)');
              legendImage.style().set(options.labelStyle);
          
          var select_image = ui.Select({
              items: Object.keys(options.ImagesTypes),
              placeholder:Object.keys(options.ImagesTypes)[0],
              style:{width:'150px'}
          });
          
          var buttonImgBack = ui.Button('Gerar imagem')
              buttonImgBack.onClick(function(){
                //var area = select_area.getValue()
                var year = select_year.getValue()
                var season = select_image.getValue()
                    season = options.ImagesTypes[season]
                
                //func.showLandsatImage(season,maplayer,year,area,options.realce)
                func.showLandsatImage(season,maplayer,year,data,options.realce)
          })
          
          var painelImage = ui.Panel([select_image,buttonImgBack],
              ui.Panel.Layout.Flow('horizontal'),
              {stretch: 'both'}
          )
          //------------------------------Vigor Pastagem-----------------------------------------------
          var lblVigorTool = ui.Label('Vigor da pastagem');
              legendImage.style().set(options.labelStyle);
          
          var yearsVigor = ee.Image(datasets.Dataset['Vigor-Mapbiomas']).bandNames().getInfo()
              yearsVigor = yearsVigor.map(function(e){
                return e.replace('vigor_','')
              })
          
          //Selecionar o ano do vigor
          var selectVigorYear = ui.Select({
              items: yearsVigor,
              placeholder:'Escolha o ano',
              style:{width:'150px'}
          });
          
          //Botão para visualizar o vigor
          var btnVigor = ui.Button('Visualizar vigor')
              btnVigor.onClick(function(){
                
                //Coletando informações do asset e o ano selecionado do vigor
                var year = selectVigorYear.getValue()
                
                //Selecionando o vigor do ano selecionado
                var imgVigor = ee.Image(datasets.Dataset['Vigor-Mapbiomas'])
                               .select('vigor_'+year)
                               .clip(data)
                
                //Adicionar o mapa de vigor
                var titulo = 'Clase de vigor'
                maplayer.addLayer(imgVigor,options.configVigor,'Vigor-'+year)
                
                //Criar a legenda no mapa
                func.createLegend(maplayer,Object.keys(options.paletteVigor),options.paletteVigor,titulo) 
              })
          
          var painelVigor = ui.Panel([selectVigorYear,btnVigor],
              ui.Panel.Layout.Flow('horizontal'),
              {stretch: 'both'}
          )
          //-----------------------------Funções do Mapa------------------------------------------------
          //-----------------------------Informação da camada-------------------------------------------
          var popup = ui.Panel({style: {
                                      position: 'top-center',
                                      padding: '10px 10px',
                                      maxWidth:'300px'
                      }
                })
          buttonPopUp = ui.Button(options.confBtnPopup)
          buttonPopUp.onClick(function(){
                popup.add(ui.Label('Clique na área'))
               
                buttonPopUp.style().set({
                        color:options.stylesMouse[app.options.activeinformation].color,
                        backgroundColor :options.stylesMouse[app.options.activeinformation].backgroundColor 
                })
                
                maplayer.style().set({
                    cursor:options.stylesMouse[app.options.activeinformation].cursor
                })
                
                if (app.options.activeinformation == 0){
                    
                    app.options.activeinformation = 1
                    maplayer.add(popup)
                    func.popupInformation(maplayer,select_area.getValue(),popup)
                  
                }else{
                    popup.widgets().reset()
                    app.options.activeinformation = 0
                    
                    var layers = maplayer.layers()
                        layers.forEach(function(lay){
                          if(lay.getName() == 'Camada selecionada'){
                              maplayer.remove(lay)
                          }
                        })
                    
                    maplayer.remove(popup)
                }
          })
          //--------------------------------Gráfico da série temporal--------------------------
          var ChartSeries = ui.Panel({style: {position: 'bottom-right',padding: '10px 10px'}});
          buttonSeries = ui.Button(options.confBtnSeries)
          buttonSeries.onClick(function(){
                
                buttonSeries.style().set({
                        color:options.stylesMouse[app.options.activeChartSeries].color,
                        backgroundColor:options.stylesMouse[app.options.activeChartSeries].backgroundColor 
                })
                
                maplayer.style().set({
                        cursor:options.stylesMouse[app.options.activeChartSeries].cursor
                })
                
                if (app.options.activeChartSeries == 0){
                    
                    app.options.activeChartSeries = 1
                    app.options.insertNewSeries = 1
                    ChartSeries.add(ui.Label('Clique área para adquirir a série temporal'))
                    
                    maplayer.add(ChartSeries)
                    maplayer.add(selectChart)
                    app.functions.seriesValuesClass(maplayer,select_area.getValue(),ChartSeries,
                                                    app.options.activeChartSeries,selectChart)
                }else{
                    
                    app.options.activeChartSeries = 0
                    app.options.insertNewSeries = 0
                    
                    //Removendo a camada selecionada no mapa
                    var layers = maplayer.layers()
                        layers.forEach(function(lay){
                          if(lay.getName() == 'Camada selecionada'){
                              maplayer.remove(lay)
                          }
                    })
                    
                    //Reinicializando o painel do gráfico
                    ChartSeries.widgets().reset()
                    
                    //Removendo o painel de seleção do tipo e do gráfico no mapa
                    maplayer.remove(ChartSeries)
                    maplayer.remove(selectChart)
                }
                
              });
          
          //O tipo de seleção do gráfico
          selectChart = ui.Select({
                items:Object.keys(options.chartSelect) ,
                value:Object.keys(options.chartSelect)[0],
                style:{position:'top-center'}
          })
          
          //-------------------------------------Filtro painel----------------------------------------------
          var FilterPainel = ui.Panel([],ui.Panel.Layout.Flow('horizontal'),
              {stretch: 'both',height:'45px',position: 'top-center',padding: '0px 0px'}
          );
          
          var FilterPainelFarm = ui.Panel([],ui.Panel.Layout.Flow('horizontal'),
              {stretch: 'both',height:'45px',position: 'top-center',padding: '0px 0px'}
          );
          
          btnFilter =  ui.Button(options.confBtnFilter)
          btnFarm = ui.Button(options.confBtnFarm)
          
          btnFilter.onClick(function(){
            
            //Mostra que o botão do 'Filtro classe' foi ativado
            btnFilter.style().set({
                    backgroundColor :options.stylesMouse[app.options.activeBtnFilter].backgroundColor,
                    color:options.stylesMouse[app.options.activeBtnFilter].color
            })
            if (app.options.activeBtnFilter == 0){
                app.options.activeBtnFilter = 1
                var layers = maplayer.layers()
                var itemsFilter = []
            
                layers.forEach(function(lyr){
                    var namelyr = lyr.getName()
                    if (namelyr.indexOf(select_fonte.getValue()) != -1){
                      itemsFilter.push(lyr.getName())
                    }
                })
                
                selectFilter = ui.Select({
                    placeholder:'Escolha a opção',
                    items:itemsFilter,
                    style:{width:'115px'}
                })
                var selectClass = ui.Select({
                    placeholder:'Escolha a classe'
                })
                
                selectFilter.onChange(function(value){
                   var idfonte = select_fonte.getValue()
                   var classlist = options.classes[idfonte]
                   selectClass.items().reset(classlist)
                })
                
                
                //Inserir e configurar o botão 'filtrar'
                var btngetFilter = ui.Button('Filtrar')
                    btngetFilter.onClick(function(){
                        
                        var layers = maplayer.layers()
                            layers.forEach(function(lyr){
                      
                              if(lyr.getName() == selectFilter.getValue()){
                                  
                                  var idfonte = select_fonte.getValue()
                                  var codClassFilter = selectClass.getValue()
                                      codClassFilter = (options.classes[idfonte].indexOf(codClassFilter))
                                  var palette = options.classesFilter[idfonte]
                                  
                                  maplayer.remove(lyr)
                                  var colorFilter = palette.values().getInfo()
                                  
                                  for (var i in colorFilter){
                                    if(codClassFilter != i){
                                        colorFilter[i] = '#000000'
                                    }
                                  }
                            
                                  var imgTemp = lyr.getEeObject()
                                  maplayer.addLayer(imgTemp,{
                                        min:options.minMax[idfonte].min,
                                        max:options.minMax[idfonte].max,
                                        palette:colorFilter
                                    },lyr.getName())
                              }
                            })
                  
                    })
            
                //Inserir e configurar o botão 'Limpar'
                var btngetClear =  ui.Button('Limpar')
                    btngetClear.onClick(function(){
                        
                        var layers = maplayer.layers()
                        layers.forEach(function(lyr){
                          if(lyr.getName() == selectFilter.getValue()){
                              
                              var idfonte = select_fonte.getValue()
                              var codClassFilter = selectClass.getValue()
                                  codClassFilter = (options.classes[idfonte].indexOf(codClassFilter))
                              var palette = options.classesFilter[idfonte]
                              
                              maplayer.remove(lyr)
                              var colorFilter = palette.values().getInfo()
                              var imgTemp = lyr.getEeObject()
                              maplayer.addLayer(imgTemp,{
                                min:options.minMax[idfonte].min,
                                max:options.minMax[idfonte].max,
                                palette:colorFilter
                              },lyr.getName())
                          }
                        })
                    })
                    
                    //Adicionando os botoes e seleções no painel do filtro
                    FilterPainel.add(selectFilter)
                    FilterPainel.add(selectClass)
                    FilterPainel.add(btngetFilter)
                    FilterPainel.add(btngetClear)
            
                    //Adicionando o painel do filtro no mapa
                    maplayer.add(FilterPainel)
          
            }else{
                //Desativar o botão filtro classe
                app.options.activeBtnFilter = 0
                
                //Reinicializa o painel
                FilterPainel.widgets().reset()
                
                //Remove o painel do mapa
                maplayer.remove(FilterPainel)
            }    
          })
          btnFarm.onClick(function(){
            
            //Mostra que o botão do 'Filtro fazenda' foi ativado
            btnFarm.style().set({
                    backgroundColor :options.stylesMouse[app.options.activeBtnFarm].backgroundColor,
                    color:options.stylesMouse[app.options.activeBtnFarm].color
            })
            if (app.options.activeBtnFarm == 0){
                app.options.activeBtnFarm = 1
                var fields = ee.FeatureCollection(data)//select_area.getValue())
                             .first()
                             .propertyNames()
                
                
                var selectFarm = ui.Select({
                  placeholder:'Selecione a coluna',
                  items:fields.getInfo()
                  
                })
                var nameFarm = ui.Select({//ui.Textbox({
                        placeholder: 'Selecione o valor',
                        style:{width:'150px'}
                })
                selectFarm.onChange(function(value){
                   var valuesFields = ee.FeatureCollection(data)//select_area.getValue())
                                   .aggregate_histogram(selectFarm.getValue())
                                   .getInfo()
                  
                   nameFarm.items().reset(Object.keys(valuesFields));
                   nameFarm.setValue(Object.keys(valuesFields)[0])
                  
                })
                var valuesFields = ee.FeatureCollection(data)//select_area.getValue())
                                   .aggregate_histogram(selectFarm.getValue())
                                   .keys()
              
                var btnFilterFarm = ui.Button('Filtrar')
                    btnFilterFarm.onClick(function(){
                        
                        //Excluir selecao passada
                        var layers = maplayer.layers()
                              layers.forEach(function(lay) {
                                  if(lay.getName() == 'Camada selecionada'){
                                  maplayer.remove(lay)
                              }
                        })

                        //Colocar as informações dos valores do filtro em Maiúsculo
                        var idfarm = selectFarm.getValue()
                        
                        //Filtar as fazenda por selecao escolhida pelo usuário
                        var featFarm = ee.FeatureCollection(data).map(function(feat){
                          var f = selectFarm.getValue()
                          var v = feat.get(selectFarm.getValue())
                          return feat.set(f, ee.String(v))
                        })
                          featFarm = featFarm.filter(ee.Filter.eq(selectFarm.getValue(),nameFarm.getValue()))
                      
                        //Verificar se algum registro foi selecionado
                        if(featFarm.size().getInfo() != 0){
                            var config = {
                                          color:'cyan',
                                          fillColor: '#00000000',
                                          lineType: 'solid'
                            }
                            maplayer.addLayer(featFarm,config,'Camada selecionada')
                            maplayer.centerObject(featFarm)
                        }
                        
                    })
                var btnClearFarm = ui.Button({
                            label:'Limpar',
                            onClick:function(){
                                
                                //Excluir selecao passada
                                var layers = maplayer.layers()
                                    layers.forEach(function(lay) {
                                        if(lay.getName() == 'Camada selecionada'){
                                            maplayer.remove(lay)
                                        }
                                    })
                            }
                  })
                  
                FilterPainelFarm.add(selectFarm)
                FilterPainelFarm.add(nameFarm)
                FilterPainelFarm.add(btnFilterFarm)
                FilterPainelFarm.add(btnClearFarm)
                maplayer.add(FilterPainelFarm)
                
            }else{
                app.options.activeBtnFarm = 0
                FilterPainelFarm.widgets().reset()
                maplayer.remove(FilterPainelFarm)
            }
            
          })
          
          maplayer.add(buttonPopUp)
          maplayer.add(buttonSeries)
          maplayer.add(btnFilter)
          maplayer.add(btnFarm)
          
          
          //--------------------------------Junção dos paineis da aplicacao
          var mainPanel = ui.Panel({style: {width: '315px',position:'top-right'}});
          var listPainels = [
                             toolPanel,btnLapig,painelArea,
                             painelFieldFilter,painelFonteDados,
                             painelYear,painelAgregacao,button,
                             legendImage,painelImage,
                             lblVigorTool,painelVigor
                            ]
          
          for(var i in listPainels){
              mainPanel.add(listPainels[i])
          }
          
          return mainPanel
      },
      seriesValuesClass:function(maplayer,dataset,panelChart,active,selectCharttype){
          
            if (active){
              
              maplayer.onClick(function(coords){
                
                if (app.options.insertNewSeries){
                    panelChart.widgets().reset()
                    app.options.insertNewSeries = 0
                    panelChart.add(ui.Label('Carregando série temporal...'))
                    
                }else{
                    panelChart.widgets().reset([ui.Label('Carregando série temporal...')])
                }
                
                var lat = coords.lat
                var lng = coords.lon
                
                var points = ee.Geometry.Point(lng,lat)
                
                var typeChart = options.chartSelect[selectCharttype.getValue()]
                var dataValue = ee.FeatureCollection(dataset)
                    dataValue = dataValue.filter(ee.Filter.bounds(points))
                
                var datasource = select_fonte.getValue()
                var total = datasets.Imagescluster[datasource]
                
                if(dataValue.size().getInfo() != 0){
                    var layers = maplayer.layers()
                        layers.forEach(function(lay){
                            if(lay.getName() == 'Camada selecionada'){
                                maplayer.remove(lay)
                            }
                        })
                    maplayer.addLayer(dataValue,{color:'blue'},'Camada selecionada')
                    var aggreType = {
                          'landcover': ee.Reducer.mode(),
                          'perconv':ee.Reducer.frequencyHistogram(),
                          'percpasture':ee.Reducer.frequencyHistogram()
                    }
                    
                    var initial = 1985
                    
                    if(typeChart == 'landcover'){
                      var cls =  options.codClass 
                      
                      var statstotal = total.reduceRegions({
                              collection: dataValue,
                              reducer: aggreType[typeChart],
                              scale: 30
                      })
                      
                          statstotal = statstotal.map(function(feature){
                              var dicColumn = {}
                              for (var i = initial;i <= finalyear;i = i +1){
                                    var bandname = 'classification_' + i
                                    dicColumn[String(i)] = ee.Number(ee.Number(feature.get(bandname)).round()).int()
                              }
                              return ee.Feature(feature.geometry(),dicColumn)
                          })
                  
                      dataValue = statstotal.first().toDictionary()
                      var values = dataValue.values()
                      var years = dataValue.keys()
                      var colors = values.map(function(col){
                          return ee.Dictionary(options.palette[datasource]).get(cls[datasource].get(col))
                      })
                
                      var columnHeader = ee.List([['Year','Value',{ role: "style" }]])
                      var zipdata = years.zip(values).zip(colors)
                          zipdata = zipdata.map(function(data){
                              var listData = ee.List(data)
                              var color = listData.get(1)
                              listData = ee.List(listData.get(0))
                                
                              return ee.List([listData.get(0),listData.get(1),color])
                      })
                  
                      var dataTable = columnHeader.cat(zipdata)
                          dataTable.evaluate(function(dataTableClient){ 
                              var chart = ui.Chart(dataTableClient)
                                          .setChartType('ScatterChart')
                                          .setOptions({
                                                  title:'Dinâmica da classe de cobertura do solo ('+initial+'-'+finalyear+') - Moda',
                                                  legend: {position: 'none'},
                                                  vAxis: {title: 'Código da classe dominante - Moda)'},
                                          })
                              panelChart.widgets().reset([chart])
                      })
                    }else if(typeChart == 'perconv' || typeChart == 'percpasture'){
                      
                      //Seleção do tipo de gráfico para conversão de área natural para antrópica e/ou conversão das áreas de pastagens
                      if (typeChart == 'perconv'){
                        
                        //Classe de conversão de área natural para antrópica
                        var classesConvert = {1:[4]}
                    
                      }else if(typeChart == 'percpasture'){
                        
                        //conversão das áreas de pastagens
                        var classesConvert = {1:[3],2:[4]}
                      }
                      
                      var classes = classesConvert
                      var outros = 0
                      var reclass = func.ReClassFromImages(total,classes,outros)
                      
                      var statstotal = reclass.reduceRegions({
                              collection: dataValue,
                              reducer: aggreType[typeChart],
                              scale: 30
                      })
                      print(statstotal)
                      statstotal = statstotal.map(function(feature){
                            var dicColumn = {}
                            for (var i = initial;i <= finalyear;i = i +1){
                                  var bandname = 'classification_' + i
                                  var dados = ee.Dictionary(feature.get(bandname))
                                  var total = dados.values().reduce(ee.Reducer.sum())
                                  var area = ee.Number(feature.area()).divide(10000.00)
                                  
                                  if(typeChart == 'perconv'){
                                    var perc = ee.Number(dados.get('0')).divide(total)
                                        perc = perc.multiply(100.00)
                                    dicColumn[String(i)] = ee.List([String(i),perc.round()])
                                  }else{
                                    dados = dados.set('total',total)
                                    dicColumn[String(i)] = dados.set('Areatotal',area)
                                   
                                  }
                            }
                            return ee.Feature(null,dicColumn)
                      })
                      dataValue = statstotal.first().toDictionary()
                      
                      var keysYear = dataValue.keys().getInfo()
                      var values = dataValue.values()
                      
                      var columnHeader = ee.List([['Year','Value']])
                      if (typeChart == 'percpasture'){
                          columnHeader = ee.List([['Year','Outras Classes','Pastagem','Vegetação Natural']])
                          values = values.getInfo()
                        
                          var valuesPerc = []
                        
                          for(var i in values){
                            var dicClasse = {'0':0,'1':0,'2':0}
                            var valuesClass = []
                            var keys = Object.keys(values[i])
                          
                            for(var j in keys){
                              var perc = (values[i][String(keys[j])]/values[i]['total'])
                              var areatotalperc = perc * values[i]['Areatotal']
                              dicClasse[String(keys[j])] = areatotalperc
                            }
                            for(var k in Object.keys(dicClasse)){
                              valuesClass.push(dicClasse[k])
                            }
                            valuesClass.unshift(keysYear[i])
                            valuesClass = valuesClass.slice(0, -2);
                            valuesPerc.push(valuesClass)
                          }
                          values = valuesPerc
                      }
                      var dataTable = columnHeader.cat(values)
                          dataTable.evaluate(function(dataTableClient){ 
                              if(typeChart == 'perconv'){
                                var chart = ui.Chart(dataTableClient)
                                          .setChartType('AreaChart')
                                          .setOptions({
                                                  title:'Proporção de área convertida ('+initial+'-'+finalyear+')',
                                                  legend: {position: 'none'},
                                                  vAxis: {title: '(%)',viewWindow: {min: 0, max: 100}},
                                                  colors: ['red'],
                                                  
                                            
                                          })
                              
                              }else if(typeChart == 'percpasture'){
                                var chart = ui.Chart(dataTableClient)
                                          .setChartType('ColumnChart')
                                          .setOptions({
                                                  title:'Proporção de área convertida de pastagem,vegetação natural e outros classe ('+initial+'-'+finalyear+')',
                                                  legend: {position: 'none'},
                                                  vAxis: {title: '(hectare)'},//viewWindow: {min: 0,max: 100}},
                                                  colors: ['red','#fee500','#33a02c'],
                                                  isStacked:true,
                                                  legend:true
                                          })  
                              }
                              panelChart.widgets().reset([chart])
                      })
                      
                      
                    }else{
                      panelChart.widgets().reset([ui.Label('Nenhuma variável selecioanda')])
                    }
                
              }else{
                  var layers = maplayer.layers()
                      layers.forEach(function(lay){
                            if(lay.getName() == 'Propriedade selecionada'){
                                maplayer.remove(lay)
                            }
                      })
                  panelChart.widgets().reset([ui.Label('Nenhuma área selecionada')])
                
              }
                  
              })
            }
      }
    },
    init:function(){
        //Criacao do mapa de fundo
        function newMap(){
            var map = ui.Map().clear();
                map.setOptions('SATELLITE');
                map.setCenter(-53.23,-16.48, 4)
            return map
        }
        var maplayer = newMap()
        
        //Carregando as interfaces gráficas
        var gui = app.functions.guis(maplayer) 
        var listPanel = [gui,maplayer]
          
        //Unificando todos os paineis
        var mapPainel = ui.Panel(listPanel,
              ui.Panel.Layout.Flow('horizontal'), 
              {stretch: 'both',height:'100%',width:'100%'}
        ); 
        
        ui.root.widgets().reset([mapPainel]);
        
    }
}
app.init()
