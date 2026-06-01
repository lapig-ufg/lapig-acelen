//Importando os modulos
var func = require('users/Amazonas21/acelen:files/functions.js')
var datasets = require('users/Amazonas21/acelen:files/datasets.js')
var options = require('users/Amazonas21/acelen:files/styles.js')
var classfunc = require('users/Amazonas21/acelen:files/runclassification.js')


//Criando variáveis de tipagem dinâmica para alteração no mapa pelo usuário
var result,buttonPopUp,buttonSeries,btnFilter,btnFarm,finalyear,edafo,btnDown
var select_year,selectChart,selectFilter,selectFarm,years,select_fonte, fieldData, fieldValue
var data,windowYear,windowDays

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
      activeBtnFarm:0, 
      activeLegendVigor:0,
      activeDown:0,
      activeLegendRusle:0,
      menuImage:0
    },
    //Funções de intereção no mapa do app pelo usuário
    functions:{
      //Construção da interface gráfica
      guis: function(maplayer){
          
          //Criando o painel para inserir a logo do Lapig, UFG e Acelen
          var base64LogoAcelen = 'data:image/png;base64,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' 
          var logoAcelen = ui.Label({
                      value:'',
                      targetUrl:'https://www.acelenrenovaveis.com.br/',
                      imageUrl:base64LogoAcelen,
                      
          })
          var baseLapig = 'data:image/png;base64,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'
          var baseUFG = 'data:image/png;base64,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'
          
          var logoLapig = ui.Label({
                      value:'',
                      targetUrl:'https://lapig.iesa.ufg.br/',
                      imageUrl:baseLapig,
                      
          })
          var logoUFG = ui.Label({
                      value:'',
                      targetUrl:'https://ufg.br/',
                      imageUrl:baseUFG,
                      
          })
          //var toolPanel = ui.Panel([thumb,logoAcelen], 'flow', {width: '100%'});
          var toolPanel = ui.Panel([logoLapig,logoUFG,logoAcelen],
              ui.Panel.Layout.Flow('horizontal'),
              {stretch: 'both',width:'100%'}
          )
          //--------------------------------Painel-Nome da ferramenta------------------
          var btnLapig = ui.Label({
                        value:'ANÁLISE TEMPORAL DA DINÂMICA DA COBERTURA E USO DA TERRA - AtDCT',
                        style:{fontSize:'20',fontWeight:'bold'}
          })
          
          
          //---------------------------------Painel-Seleção da área------------------------------
           //Configuração do rótulo do painel da seleção da área
          //var lblCls = ui.Label({
          //    value:'ENTRADA DOS DADOS E PARÂMETROS DA CLASSIFICAÇÃO',
          //    style:options.labelTitleTool
          //})
          var labelEntrada = ui.Button({
              label:'▼ MENU ENTRADA DOS DADOS' ,
              style:{width:'95%',color:'#0076FF'},
              onClick:function(){
                
                var estaAberto = painelEntrada.style().get('shown')
                painelEntrada.style().set('shown', !estaAberto)
                labelEntrada.set('label',estaAberto ? '▶ MENU ENTRADA DOS DADOS' : '▼ MENU ENTRADA DOS DADOS')
              }
          })
          
          
          var legendArea = ui.Label('Dados de Entrada');
              legendArea.style().set(options.labelStyle);
          
          //Ativar o filtro 
          var chkFiltroAsset = ui.Checkbox({
            label:'Filtro',
            disabled:true,
            onChange:function(checked){
              if(checked){
                 fieldData.style().set('shown', true);
                 fieldValue.style().set('shown', true);
                 var atrb = ee.FeatureCollection(select_area.getValue())
                     atrb = atrb.first().propertyNames().getInfo()  
                     
                 fieldData.items().reset(atrb);
                 fieldValue.items().reset();
                 
              }else{
                fieldValue.style().set('shown', false)
                fieldData.style().set('shown', false)
                
              }
            }
          })
          chkFiltroAsset.setDisabled(true)
          
          //Upload do arquivo externo
          var select_area = ui.Textbox({
            placeholder:'Asset da camada vetorial',
            style:{width:'45%'},
            onChange:function(value){
                chkFiltroAsset.setDisabled(false)
              }
            })
            
          var panelClassrow01 = ui.Panel([legendArea,select_area,chkFiltroAsset],
              ui.Panel.Layout.Flow('horizontal'),
              {stretch: 'both'}
          )
          
          fieldData = ui.Select({placeholder:'Escolha o Atributo da camada',style:{width:'45%',shown: false}})
          fieldValue = ui.Select({placeholder:'Escolha o Valor do atributo',style:{width:'45%',shown: false}})
          fieldData.onChange(function(value){
               var data = ee.FeatureCollection(select_area.getValue())
                          .aggregate_histogram(value)
                          .getInfo()
               fieldValue.items().reset(Object.keys(data))
               fieldValue.setValue(Object.keys(data)[0])
            
          })
          
          var fieldButton = ui.Button({
                  label:'Carregar a camada no mapa',
                  style:{width:'94%'},
                  onClick:function(){
                    //Voltar a configuração das ações e os camadas do mapa
                    app.options.activeLegend = 0
                    app.options.activeChart = 0
                    app.options.activeChartSeries = 0
                    app.options.insertNewSeries = 0
                    app.options.activeDown = 0,
                    app.options.activeLegendRusle = 0
              
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
                    maplayer.add(btnDown)
                    
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
          
          var panelClassrow02 = ui.Panel([fieldData,fieldValue],
              ui.Panel.Layout.Flow('horizontal'),
              {stretch: 'both'}
          )
          
          var painelFieldButton = ui.Panel([fieldButton],
              ui.Panel.Layout.Flow('horizontal'),
              {stretch: 'both'}
          )
          var painelEntrada = ui.Panel([panelClassrow01,panelClassrow02,fieldButton],
              ui.Panel.Layout.Flow('vertical'),
              {stretch: 'both'}
          )
          
          //---------------------------------Painel da base de dados---------------------
          
          var labelLulc =  ui.Button({
              label:'▶ MENU CLASSIFICAÇÃO USO DA TERRA',
              style:{width:'95%',color:'#0076FF'},
              onClick:function(){
                var activateMenu = painelLulc.style().get('shown')
                if (!activateMenu){
                  labelLulc.set('label','▼ MENU CLASSIFICAÇÃO USO DA TERRA')
                }else{
                  labelLulc.set('label','▶ MENU CLASSIFICAÇÃO USO DA TERRA')
                }
                painelLulc.style().set('shown',!activateMenu)
              }
          })
          labelLulc.style().set('border','2px solid lightgray');
          var legendBase = ui.Label({
              value:'Fonte de dados',
              style:{width:'30%'}
          });
          
          select_fonte = ui.Select({
              items: ['Escolha a fonte','Mapbiomas'],
              placeholder:'Escolha a fonte',
              style:{width:'60%'},
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
          var legendYear = ui.Label({
              value:'Ano análise',
              style:{width:'25%'}
          });
              
          //Opção de seleção dos anos para classificação
          select_year = ui.Select({
            style:{width:'65%'}
          })
          
          //Painel do rótulo do ano da análise e a opção da seleção dos anos da classificação
          var painelYear = ui.Panel([legendYear,select_year],
              ui.Panel.Layout.Flow('horizontal'),
              {stretch: 'both'}
          )
          
          //---------------------------------Painel-Tipo Agregação------------------------------
          var legendAgregacao = ui.Label({
              value:'Tipo de classificação',
              style:{width:'30%'}
          });
          
          //Selecionar os tipos de agregação    
          var select_agregacao = ui.Select({
              items: Object.keys(options.AggregationTypes),
              placeholder:'Escolha o tipo',
              style:{width:'60%'},
          });
          
          //Criação do painel de agregação
          var painelAgregacao = ui.Panel([legendAgregacao,select_agregacao],
              ui.Panel.Layout.Flow('horizontal'),
              {stretch: 'both'}
          )
          
          //Criação do painel de gráficos
          var painelChart = ui.Panel({style: {position: 'bottom-right',width:'450px',padding: '1px 1px'}});
          
          //Rótulo do buffer na Classe
          var lblBufferCls = ui.Label({value:'Buffer (m)',style:{width:'20%'}})
          
          //Controle deslizante para selecionar a distância do buffer em metros para visualizar a classificação
          var sliderBufferCls = ui.Slider({
            value:100,
            min:0,
            max:2000,
            step:100,
            style:{width:'72%'}
          })
          
          var painelBufferCls = ui.Panel([lblBufferCls,sliderBufferCls],
              ui.Panel.Layout.Flow('horizontal'),
              {stretch: 'both'}
          )
          
          //Criação do botão de gerar a classificação
          var button = ui.Button({
              label:'Gerar a classificação do ano de análise',
              style:{width:'95%'},          
          })
              
              button.onClick(function(){
                
                btnFilter.setDisabled(false)
                btnFarm.setDisabled(false)
                
                //Parâmetros da classificar as áreas de análise
                var typeclass = select_agregacao.getValue()
                var areaInfo = select_area.getValue()
                var yearInfo = select_year.getValue()
                var fonteInfo = select_fonte.getValue()
                var bfCls = sliderBufferCls.getValue()
                
                //Função para adquirir imagem classificada do ano sob a área de consulta
                result = func.runprocess(maplayer,data,areaInfo,yearInfo,typeclass,fonteInfo,bfCls)
                
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
           
           var painelLulc = ui.Panel([painelFonteDados,painelYear,painelAgregacao,painelBufferCls,button],
              ui.Panel.Layout.Flow('vertical'),
              {stretch: 'both',shown:false}
          )
          //-------------------------------------Painel Imagem Landsat--------------------------------------
          //Rótulo de identificação do bloco do Painel da seleção de imagem landsat como plano de fundo
          var legendImage = ui.Button({
              label:'▶ MENU IMAGEM DE FUNDO' ,
              style:{width:'95%',color:'#0076FF'},
              onClick:function(){
                var activateMenu = painelImage.style().get('shown')
                if (!activateMenu){
                  legendImage.set('label','▼ MENU IMAGEM DE FUNDO')
                }else{
                  legendImage.set('label','▶ MENU IMAGEM DE FUNDO')
                }
                painelImage.style().set('shown',!activateMenu)
              }
          }) 
          legendImage.style().set('border','2px solid lightgray');
          //Selecionar o período de aquisição da imagem
          var select_image = ui.Select({
              items: Object.keys(options.ImagesTypes),
              placeholder:Object.keys(options.ImagesTypes)[0],
              style:{width:'45%'}
          })
          
          //Botão para adicionar a imagem landsat no mapa 
          var buttonImgBack = ui.Button({
                  label:'Gerar imagem',
                  style:{width:'45%'},
                  onClick:function(){
                    var year = select_year.getValue()
                    var season = select_image.getValue()
                        season = options.ImagesTypes[season]
                
                    func.showLandsatImage(season,maplayer,year,data,options.realce)
                  }
                     
          })
             
          //Criar o painel de seleção da imagem landsat de plano de fundo
          var painelImage = ui.Panel({
              widgets: [select_image,buttonImgBack],
              layout:ui.Panel.Layout.Flow('horizontal'),
              style:{stretch: 'both',shown:false}
          })
          //------------------------------Vigor Pastagem-----------------------------------------------
          var lblVigorTool = ui.Button({
              label:'▶ MENU ANÁLISE DE VIGOR',
               style:{width:'95%',color:'#0076FF'},
              onClick:function(){
                var activateMenu = painelVigor.style().get('shown')
                if (!activateMenu){
                  lblVigorTool.set('label','▼ MENU ANÁLISE DE VIGOR')
                }else{
                  lblVigorTool.set('label','▶ MENU ANÁLISE DE VIGOR')
                }
                painelVigor.style().set('shown',!activateMenu)
              }
          })     
          lblVigorTool.style().set('border','2px solid lightgray');
          var yearsVigor = ee.Image(datasets.Dataset['Vigor-Mapbiomas']).bandNames().getInfo()
              yearsVigor = yearsVigor.map(function(e){
                  return e.replace('vigor_','')
              })
          
          //Selecionar o ano do vigor
          var selectVigorYear = ui.Select({
              items: yearsVigor,
              placeholder:'Escolha o ano',
              style:{width:'45%'}
          });
          
          //Selecionar a região
          var selectVigorRegion = ui.Select({
              items: yearsVigor,
              placeholder:'Escolha a regiao',
              items:['Brasil','MG','BA'],
              style:{width:'45%'}
          });
          
          //Criar o painel de seleção do área e ano do vigor da pastagem 
          var painelVigor01 = ui.Panel({
              widgets:[selectVigorYear,selectVigorRegion],
              layout:ui.Panel.Layout.Flow('horizontal'),
              style:{stretch: 'both'}
          })
          
          //Rótulo de buffer em metros de selecionar o vigor
          var lblBufferVigor = ui.Label({value:'Buffer (m)',style:{width:'20%'}})
          
          //Controle deslizante para selecionar a distância do buffer em metros para visualizar a classificação
          var sliderBufferVigor = ui.Slider({
            value:100,
            min:0,
            max:2000,
            step:100,
            style:{width:'45%'}
          })
          
          //Botão para visualizar o vigor
          var btnVigor = ui.Button({
                label:'Visualizar',
                style:{width:'20%'},
              })
              btnVigor.onClick(function(){
                
                //Selecionando a região para o vigor
                var regionVigor = selectVigorRegion.getValue()
                
                //Coletando informações do asset e o ano selecionado do vigor
                var year = selectVigorYear.getValue()
                
                //Buffer da área
                var bfVigor = sliderBufferVigor.getValue()
                
                //Verificando se o valor de buffer é igual da zero
                if (parseInt(bfVigor) > 0){
                  var bfVigorData = data.geometry().buffer(parseInt(bfVigor))
                }else{
                  var bfVigorData = data
                }
                //Selecionar a imagem a partir da região selecionada
                if (regionVigor == 'Brasil'){
                  
                  //Nomeado o endereço do arquivo e sua respectiva banda
                  var idVigorImg = datasets.Dataset['Vigor-Mapbiomas']
                  var bandVigor = 'vigor_'+year
              
                }else{
                  
                  //Nomeado o endereço do arquivo e sua respectiva banda
                  var idVigorImg = 'projects/ee-amazonas21/assets/Acelen/Vigor/'+regionVigor+'/cvp_states_pasture_br_Y'+year+'_'+regionVigor
                  var bandVigor = 'b1'
                  
                }
                //Selecionando o vigor do ano selecionado
                var imgVigor = ee.Image(idVigorImg)
                               .select(bandVigor)
                               .clip(bfVigorData)
                
                //Adicionar o mapa de vigor
                var titulo = 'Clase de vigor'
                maplayer.addLayer(imgVigor,options.configVigor,'Vigor-'+year+'-'+regionVigor)
                
                //Criar a legenda
                if (app.options.activeLegendVigor == 0){
                      
                      //Criar a legenda do vigor
                      func.createLegend(maplayer,Object.keys(options.paletteVigor),options.paletteVigor,titulo) 
                      app.options.activeLegendVigor = 1
                }
              })
          
          //Criar o painel de escolher o valor de buffer da área para visualização do vigor da pastagem
          var painelVigor02 = ui.Panel([lblBufferVigor,sliderBufferVigor,btnVigor],
              ui.Panel.Layout.Flow('horizontal'),
              {stretch: 'both'}
          )
          //Criar o painel de seleção do área e ano do vigor da pastagem 
          var painelVigor = ui.Panel({
              widgets:[painelVigor01,painelVigor02],
              layout:ui.Panel.Layout.Flow('vertical'),
              style:{stretch: 'both',shown:false}
          })
         
         
          //-----------------------------------Mapemaneto detalhado automático-------------------------------
          var lblClsAuto = ui.Button({
              label:'▶ MENU MAPEAMENTO AUTOMÁTICO DETALHADO - PASTAGEM' ,
              style:{width:'95%',color:'#0076FF'},
              onClick:function(){
                var activateMenu = painelMapPasture.style().get('shown')
                if (!activateMenu){
                  lblClsAuto.set('label','▼  MAPEAMENTO AUTOMÁTICO DETALHADO - PASTAGEM')
                }else{
                  lblClsAuto.set('label','▶ MAPEAMENTO AUTOMÁTICO DETALHADO - PASTAGEM')
                }
                painelMapPasture.style().set('shown',!activateMenu)
              }
          }) 
          lblClsAuto.style().set('border','2px solid lightgray');
          //Rótulo da opção amostra
          var lblAmostras = ui.Label({
              value:'Amostras',
              style:{width:'20%'}//style:options.labelStyle
          })
          
          //Controle deslizante para selecionar a quanrtidade de amostras
          var sliderAmostras = ui.Slider({
            value:100,
            min:0,
            max:2000,
            step:100,
            style:{width:'70%'}
          })
          
          //Painel da amostra
          var painelMapPasture01 = ui.Panel([lblAmostras,sliderAmostras],
              ui.Panel.Layout.Flow('horizontal'),
              {stretch: 'both'}
          )
          
          //Rótulo da opção de buffer
          var lblBuffer = ui.Label({
              value:'Buffer (m)',
              style:{width:'20%'}//style:options.labelStyle
          })
          
          //Controle deslizante para selecionar a distância do buffer em metros
          var sliderBuffer = ui.Slider({
            value:100,
            min:0,
            max:2000,
            step:100,
            style:{width:'70%'}
          })
          
          //Painel do buffer
          var painelMapPasture02 = ui.Panel([lblBuffer,sliderBuffer],
              ui.Panel.Layout.Flow('horizontal'),
              {stretch: 'both'}
          )
          //Ano de Classificação da pastagem
          var anoClsPast = ui.Select({
            placeholder:'Escolha o ano',
            items:['2017','2018','2019','2020','2021','2022'],
            style:{width:'27%'}
          })
          
          //Base de dados usados no mapeamento detalhado
          var classData = ui.Select({
            placeholder:'Escolha o dados',
            items:['Sentinel-2','Embeddings'],
            style:{width:'27%'}
          })
          
          //Dados de pastagem utilizados como amostras para classificação
          var pastureData = ui.Select({
            placeholder:'Escolha a base',
            items:['Global Pasture Watch','Mapbiomas','Todas'],
            style:{width:'27%'}
          })
          
          //Painel dos dados utilizados para a classificação
          var painelMapPasture03 = ui.Panel([classData,anoClsPast,pastureData],
              ui.Panel.Layout.Flow('horizontal'),
              {stretch: 'both'}
          )
          
          //Botão para classificar automaticamente
          var btnClspasture = ui.Button({
            label:'Classificar pastagem',
            style:{width:'90%'},
            onClick:function(){
                
                //Informações para classificação
                var DataClassUse = classData.getValue()
                var Nsamples = sliderAmostras.getValue()
                var Buffer = sliderBuffer.getValue()
                var YearPastureClass = anoClsPast.getValue()//select_year.getValue()
                var fonteData = pastureData.getValue()
                
                var classmap = classfunc.getRun(YearPastureClass,data,Nsamples,Buffer,fonteData,DataClassUse)
                maplayer.addLayer(classmap[0],{palette:['gold'],max:1},'Pasture -'+YearPastureClass+' '+DataClassUse+' '+fonteData+' Amostras:'+Nsamples+' Buffer:'+Buffer)
                
            }
          })
          var painelMapPasture = ui.Panel({
              widgets:[painelMapPasture01,painelMapPasture02,painelMapPasture03,btnClspasture],
              layout:ui.Panel.Layout.Flow('vertical'),
              style:{stretch: 'both',shown:false}
          })
          //-------------------------------------------RUSLE--------------------------------------------
          var lblRusle = ui.Label({
              value:'MÉTODO RUSLE (versão beta)',
              style:options.labelTitleTool
          })
          
          var lblRusle = ui.Button({
              label:'▶ MÉTODO RUSLE (versão beta) ',
              style:{width:'95%',color:'#0076FF'},
              onClick:function(){
                var activateMenu = painelRusle.style().get('shown')
                if (!activateMenu){
                  lblRusle.set('label','▼  MÉTODO RUSLE (versão beta)')
                }else{
                  lblRusle.set('label','▶ MÉTODO RUSLE (versão beta)')
                }
                painelRusle.style().set('shown',!activateMenu)
              }
          })
          lblRusle.style().set('border','2px solid lightgray');
          //Ano de Cálculo da RuSLE
          var anoRusle = ui.Select({
            placeholder:'Escolha o ano',
            items:['2017','2018','2019','2020','2021','2022','2023','2024'],
            style:{width:'28%'}
          })
          
          
          var baciaRusle = ui.Select({
            placeholder:'Escolha a bacia',
            items:Object.keys(datasets.Dataset['Bacias Hidrográficas']),
            style:{width:'29%'}
          })
          
          
          //Ano de Cálculo da RuSLE
          var produtosRusle = ui.Select({
            placeholder:'Escolha o produto',
            items:['A - Perda Média Anual de Solo','R - Fator de Erosividade','K - Fator Erodibilidade do Solo',
                  'LS - Fator Topográfico','C - Fator de Manejo do Solo','P - Fator de Prática de Suporte'],
            style:{width:'29%'}
          })
          
          var painelRusle01 = ui.Panel([anoRusle,baciaRusle,produtosRusle],
              ui.Panel.Layout.Flow('horizontal'),
              {stretch: 'both'}
          )
          
          var btnRusle = ui.Button({
            label:'Calcular',
            style:{width:'92%'},
            onClick:function(){
              
              //Parâmetros para o cálculo da RUSLE
              var idBacia = datasets.Dataset['Bacias Hidrográficas'][baciaRusle.getValue()]
              var ano = parseInt(anoRusle.getValue()) 
              var produto = produtosRusle.getValue()
              var startDate =  ano+'-01-01'
              var endDate = (ano+1)+'-01-01'
              var aoi = ee.FeatureCollection(idBacia)
                            .filterBounds(data)
              
              //Dicionário dos produtos
              var dicproduto = {
                'A - Perda Média Anual de Solo':'',
                'R - Fator de Erosividade': func.calcR(aoi,ano),
                'K - Fator Erodibilidade do Solo':func.calcK(aoi),
                'LS - Fator Topográfico':func.calcLS(aoi),
                'C - Fator de Manejo do Solo':func.calcC(startDate,endDate,aoi),
                'P - Fator de Prática de Suporte':func.calcP(startDate,endDate,aoi)
              }
              if (produto == 'A - Perda Média Anual de Solo'){
                 
                  //Calculando os fatores da RusLE
                  var R = func.calcR(aoi,ano)
                  var C = func.calcC(startDate,endDate,aoi)
                  var K = func.calcK(aoi)
                  var P = func.calcP(startDate,endDate,aoi)
                  var LS = func.calcLS(aoi)
                 
                  var prod = ee.Image(R.multiply(K).multiply(LS).multiply(C).multiply(P)).rename("Soil Loss").selfMask()
                      prod = prod.expression(
                            "(b('Soil Loss') < 5) ? 1" +   // Class 1
                            ": (b('Soil Loss') < 1.5) ? 2" +  // Class 2
                            ": (b('Soil Loss') < 3) ? 3" +  // Class 3
                            ": (b('Soil Loss') < 5) ? 4" +  // Class 4
                            ": (b('Soil Loss') < 10) ? 5" +  // Class 5
                            ": (b('Soil Loss') < 20) ? 6" +  // Class 6
                            ": (b('Soil Loss') < 50) ? 7" +  // Class 7
                            ": 8")                         // Class 8 (>= 200)
                  
                  if (app.options.activeLegendRusle == 0){
                    func.createLegend(maplayer,Object.keys(options.paletteRusle),options.paletteRusle,'Perda média anual do solo (t/ha/ano)') 
                    app.options.activeLegendRusle = 1
                  }
              }else{
                var prod = dicproduto[produto]
               
              }
              //Criar a legenda do vigor
              var paletteRusle = ee.Dictionary(options.paletteRusle).values()
                  paletteRusle = paletteRusle.getInfo()
              maplayer.addLayer(prod.clip(aoi),{palette:paletteRusle},produto+"-"+ano)
             
            }
           })
           
           var painelRusle = ui.Panel([painelRusle01,btnRusle],
              ui.Panel.Layout.Flow('vertical'),
              {stretch: 'both',shown:false}
          )
          //-------------------------------------------ANALISE DE TENDENCIA DAS PASTAGENS---------------
          var lblAnaliseTendencia = ui.Button({
              label:'▶ MENU ANÁLISE DE TENDÊNCIA DAS PASTAGENS',
              style:{width:'95%',color:'#0076FF'},
              onClick:function(){
                var activateMenu = painelTrend.style().get('shown')
                if (!activateMenu){
                  lblAnaliseTendencia.set('label','▼  ANÁLISE DE TENDÊNCIA DAS PASTAGENS')
                }else{
                  lblAnaliseTendencia.set('label','▶ ANÁLISE DE TENDÊNCIA DAS PASTAGENS')
                }
                painelTrend.style().set('shown',!activateMenu)
              }
          })
          lblAnaliseTendencia.style().set('border','2px solid lightgray');
          
          var produtoTrend = ui.Select({
                      placeholder:'Escolha o produto',
                      items:['Produtividade primária bruta (GPP)','Índice de vegetação (NDVI)'],
                      style:{width:'92%'},
                      onChange:function(value){
                        if (value != 'Produtividade primária bruta (GPP)'){
                          windowYear.setDisabled(false)
                          windowDays.setDisabled(false)
                        }else{
                          windowYear.setDisabled(true)
                          windowDays.setDisabled(true)
                        }
                      }
                  })
                  
          var anoInicialTrend = ui.Select({
                      placeholder:'Ano Inicial',
                      items:options.yearsGPP,
                      style:{width:'45%'}
                  })
          
          var anoFinalTrend = ui.Select({
                      placeholder:'Ano Final',
                      items:options.yearsGPP,
                      style:{width:'45%'}
                  })
         
          var painelTrend01 = ui.Panel([anoInicialTrend,anoFinalTrend],
              ui.Panel.Layout.Flow('horizontal'),
              {stretch: 'both'}
          )
          
          windowYear = ui.Select({
                    placeholder:'Tamanho da Janela - Anos',
                    items:['1','2','3','4','5'],
                    disabled:true,
                    style:{width:'45%'}
          })
          
          windowDays = ui.Select({
                    placeholder:'Tamanho da Janela - Dias',
                    items:['30','60','90','120','150','180'],
                    disabled:true,
                    style:{width:'45%'}
          })
          
          var painelTrend02 = ui.Panel([windowYear,windowDays],
              ui.Panel.Layout.Flow('horizontal'),
              {stretch: 'both'}
          )
          
          
          var btnTrend = ui.Button({
            label:'Calcular tendência',
            style:{width:'92%'},
            onClick:function(){
               
              //Criando o painel para inserir a tendência no mapa
              var ChartTrend = ui.Panel({style: {position: 'bottom-right',padding: '.1% .1%'}});
              ChartTrend.add(ui.Label('Gerando a análise de tendência...'))
              maplayer.add(ChartTrend)
              
              //Criando o botão para fechar a janela da tendência 
              var btcClose = ui.Button({
                    label:'Fechar',
                    onClick:function(){
                      ChartTrend.widgets().reset([])
                      maplayer.remove(ChartTrend)
                    }
              })
              
              var typeTrend = {
                'Produtividade primária bruta (GPP)':{
                  fields:['trend','median'],
                  series:['Tendência', 'GPP-Mediano'],
                },
                'Índice de vegetação (NDVI)':{
                  fields:['trend','median'],
                  series:['Tendência', 'NDVI mediano'],
                }
              }
              
               
              //Parâmetros de entrada
              var ini = parseInt(anoInicialTrend.getValue())
              var fin = parseInt(anoFinalTrend.getValue())
              if (produtoTrend.getValue() != 'Produtividade primária bruta (GPP)'){
                  var winAno = ee.List.sequence(1,parseInt(windowYear.getValue()),1).getInfo()
                  var winDia = ee.List.sequence(30,parseInt(windowDays.getValue()),30).getInfo()
                  var idCollection = "LANDSAT/LC08/C02/T1_TOA";
                  var lulc = ee.Image('projects/ee-amazonas21/assets/datasets-app/us-brazil')
               
                  //Executando o gapfill
                  var img = func.runTMWMFilter(data, idCollection, ini, fin, winAno, winDia,lulc) 
                      img = img['gapfill-data']
               
                  //Calculando a tendência de NDVI
                  var datatrend = func.getTrend(img,'system:time_start','median')
                      print('datatrend_ndvi',datatrend)
                      datatrend = datatrend.map(function(feat){
                              return feat.set('median',feat.get('median'))
                  })
                  
              }else{
                  //Calculando a tendência do GPP
                  var datatrend = func.getTrendGPP(ini,fin,data)
              }
              print(datatrend)
              //Gerando o gráfico de tendência
              var chart = ui.Chart.feature
                        .byFeature({
                            features: datatrend,//trendGPP,
                            xProperty: 'system:time_start',
                            yProperties:typeTrend[produtoTrend.getValue()]['fields']//['trend','gpp-median']
                        })
                        .setSeriesNames(typeTrend[produtoTrend.getValue()]['series'])
                        .setOptions({
                          title: 'Tendência' + produtoTrend.getValue() + ' sobre a área de pastagem',
                          hAxis:{
                              title: 'Data',
                              //gridlines: {color: 'FFFFFF'}
                          },
                          vAxis: {
                              title: 'gC/m²/day',
                              //gridlines: {color: 'FFFFFF'}
                          },
                          //chartArea: {backgroundColor: 'EBEBEB'}
                        })

               ChartTrend.widgets().reset([chart,btcClose])
               ChartTrend.style().set('width', '35%');
               
            }
          })
          
          var painelTrend = ui.Panel([produtoTrend,painelTrend01,painelTrend02,btnTrend],
              ui.Panel.Layout.Flow('vertical'),
              {stretch: 'both',shown:false}
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
                var fields = ee.FeatureCollection(data)
                             .first()
                             .propertyNames()
                
                
                var selectFarm = ui.Select({
                  placeholder:'Selecione a coluna',
                  items:fields.getInfo()
                  
                })
                var nameFarm = ui.Select({
                        placeholder: 'Selecione o valor',
                        style:{width:'150px'}
                })
                selectFarm.onChange(function(value){
                   var valuesFields = ee.FeatureCollection(data)
                                   .aggregate_histogram(selectFarm.getValue())
                                   .getInfo()
                  
                   nameFarm.items().reset(Object.keys(valuesFields));
                   nameFarm.setValue(Object.keys(valuesFields)[0])
                  
                })
                var valuesFields = ee.FeatureCollection(data)
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
          
          var OptionLayerDown = ui.Select({placeholder:'Escolha a camada',style:{Width:'30%'}})
          var OptionDown = ui.Select({
            placeholder:'Escolha a origem para download',
            items:['Camada do mapa','Camada da base de dados'],
            style:{Width:'30%'},
            onChange:function(value){
              if(value == 'Camada do mapa'){
                var listCamadas = []
                var layers = maplayer.layers()
                    layers.forEach(function(lay){
                       listCamadas.push(lay.getName())
                    })
                    OptionLayerDown.items().reset(listCamadas)
              }else{
                    OptionLayerDown.items().reset([
                                            'Vigor-Mapbiomas',
                                            'Mapbiomas',
                                            ])
              }
            }
          })
          
          var btnDownload = ui.Button({
                        label:'Download',
                        style:{Width:'30%'},
                        onClick:function(){
                          var chooseLayer = OptionLayerDown.getValue()
                          if (OptionDown.getValue() == 'Camada do mapa'){
                              var lyr = maplayer.layers()
                              lyr.forEach(function(layer){
                              if(layer.getName() == chooseLayer){
                                  var lyrdown = layer.getEeObject()
                                  print(lyrdown)
                                  var lyrdesc = layer.getName()
                                  var lyrscale = layer.getEeObject().projection().nominalScale().getInfo()
                                  Export.image.toDrive({
                                        image:lyrdown,
                                        description:lyrdesc,
                                        folder:'GEEX',
                                        region:data,
                                        scale:lyrscale
                                  })
                                  
                              }
                              })
                          }else{
                             var lyrdown = datasets.Dataset[OptionLayerDown.getValue()]
                             var lyrdesc = OptionLayerDown.getValue()
                             var lyrscale = 30
                          }
                          Export.image.toDrive({
                                        image:lyrdown,
                                        description:lyrdesc,
                                        folder:'GEEX',
                                        region:data,
                                        scale:lyrscale
                          })
                          
                        }
          })
          var DownPanel = ui.Panel([OptionDown,OptionLayerDown,btnDownload],ui.Panel.Layout.Flow('horizontal'),
              {stretch: 'both',width:'40%',position: 'bottom-center',padding: '.5% .5%'}
          );
         
          
          btnDown = ui.Button(options.confBtnDown)
          btnDown.onClick(function(){
             print(app.options.activeDown)
             if (app.options.activeDown == 0){
               app.options.activeDown = 1
               maplayer.add(DownPanel)
               
             }else{
               app.options.activeDown = 0
               maplayer.remove(DownPanel)
             }
          })
          maplayer.add(buttonPopUp)
          maplayer.add(buttonSeries)
          maplayer.add(btnFilter)
          maplayer.add(btnFarm)
          maplayer.add(btnDown)
          
          
          //--------------------------------Junção dos paineis da aplicacao
          var mainPanel = ui.Panel({
              style: {width: '25%',stretch: 'both'}
          })
  
          
          var listPainels = [
                            
                            btnLapig,
                            labelEntrada,painelEntrada,//painelArea,
                            labelLulc,painelLulc,
                            legendImage,painelImage,
                            lblVigorTool,painelVigor,
                            lblClsAuto,painelMapPasture,
                            lblRusle,painelRusle,
                            lblAnaliseTendencia,painelTrend,
                            toolPanel
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
