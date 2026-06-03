# 1. INTRODUÇÃO

## 1.1 - Visão Geral

A Acelen Renováveis é uma empresa de energia criada pelo fundo Mubadala Capital com o objetivo de ser protagonista na transição energética a partir de uma nova fonte de matéria-prima, a macaúba, para produção de SAF (Sustainable Aviation Fuel) e HVO (Hydrotreated Vegetable Oil) no Brasil e no mundo. O ciclo sustentável da macaúba começa com a identificação e recuperação de áreas de pastagens degradadas e, após a recuperação dessas áreas, é iniciado o cultivo das palmeiras de macaúba.

Neste sentido, a análise da dinâmica de uso e cobertura da terra é de fundamental importância, tanto para o monitoramento ambiental e gestão de recursos naturais quanto para a tomada de decisões estratégicas. Especificamente, a Acelen Renováveis necessita de informações atualizadas e históricas sobre suas áreas de interesse, localizadas principalmente em regiões dos estados de Minas Gerais e Bahia.

O projeto em questão consiste no desenvolvimento de metodologias e protocolos, integrados em um toolkit criado na plataforma Google Earth Engine, para análise de dados satelitários, complementada por metodologias para coleta e análise de dados. Este toolkit envolve a inserção das áreas de interesse da Acelen para visualização dos dados de uso e cobertura da terra e sua dinâmica, refinamento (detalhamento) do mapeamento e determinação do nível de vigor e tendências da produtividade primária bruta (GPP) das áreas de pastagens de interesse.

## 1.2 - Escopo e Objetivo do documento

Desenvolvimento de um toolkit para Análise Temporal da Dinâmica do Uso e Cobertura da Terra, que possibilite compreender a dinâmica do uso e cobertura da terra, gerar mapeamento com maior detalhe (à escala da propriedade rural) de modo interativo (on-the-fly) e atualizado das áreas de pastagens, calcular perda média anual do solo nas áreas de interesse da Acelen Renováveis, gerar e analisar os dados de produtividade primária bruta (GPP), e conceber estratégias de amostragem em campo para verificação das práticas de manejo, avaliação visual das pastagens e amostras de biomassa. Por meio deste toolkit e protocolos, será possível obter informações atualizadas e históricas para o monitoramento ambiental, gestão de recursos naturais e tomada de decisões estratégicas por parte da Acelen Renováveis.

A Tabela 01 mostra as atividades detalhadas que serão executadas no âmbito do desenvolvimento do toolkit e da geração de protocolos para a coleta de informações em campo.

### **Tabela 01** - Descrição das atividades relacionadas ao desenvolvimento do toolkit e às estratégias de amostragem de campo

| Atividades | Descrição das Atividades |
|---|---|
| Análise da Dinâmica do Uso e Cobertura da Terra | Com esta versão do toolkit (1.0), o usuário será capaz de verificar, para as áreas de interesse e com base nos dados MapBiomas, a dinâmica da cobertura e uso da terra, o nível de vigor das pastagens identificadas e a transição de área natural para antrópica. |
| Mapeamento Refinado da pastagem e o cálculo da perda média anual dos solos | Na versão 2.0 do toolkit será possível ao usuário fazer um mapeamento da pastagem com precisão aproximada de 0.1 hectare, no modo on-the-fly (via aquisição automática de amostras de treinamento e validação), e o cálculo da perda média anual do solo nas áreas de interesse. |
| Geração e Análise de Tendência da produtividade das pastagens | Com a versão 3.0 do toolkit, o usuário verificará se a produtividade da pastagem da área selecionada está tendo ganho ou perdas significativas através do dado de produtividade primária bruta (GPP). Os dados de GPP serão calculados a partir das imagens do satélite Landsat e Sentinel 2, com resolução espacial de 30 e 10 metros, respectivamente. |
| Estratégias de amostragem de campo | Desenvolvimento de um protocolo de trabalho de campo para verificar as condições de manejo e produtividade das pastagens. |

Para assegurar o sigilo da informação, o usuário deverá logar com a sua conta do gmail e acessar a base de dados (asset) que encontra-se vinculado à sua conta no Google Earth Engine.

Este documento tem como objetivo detalhar o protocolo para coleta de informações em campo e, principalmente, todas as etapas do desenvolvimento do toolkit, desde suas funcionalidades e bases teóricas, até sua aplicação para os colaboradores da Acelen Renováveis.

## 1.3 - Regiões de Interesse

As regiões de interesse, estabelecidas no documento da parceria entre LAPIG/UFG e Acelen Renováveis, compreendem os estados da Bahia e Minas Gerais. No entanto, a ferramenta possui aplicabilidade em todo o território nacional, conforme a disponibilidade dos dados satelitários.
