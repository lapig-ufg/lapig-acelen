# 3. DESCRIÇÃO E ABORDAGEM DO ALGORITMO

Nesta seção serão abordadas todas as funcionalidades do toolkit, versão 5.0, especificamente voltado à Análise Temporal da Dinâmica da Cobertura e Uso da Terra, tendo por referência os mapas de cobertura e uso da terra, vigor das pastagens da Coleção 10.1 do Mapbiomas, bem como imagens das séries Landsat, mapeamento detalhado das pastagens em nível de propriedade e o cálculo da perda anual média do solo

## 3.1 - Análise Temporal da Dinâmica da Cobertura e Uso da Terra (toolkit 5.0)

O toolkit versão 5.0 permite ao usuário explorar a série histórica dos mapas de cobertura e uso da terra da Coleção 10.1 do MapBiomas, mapear em nível de propriedade as pastagens e calcular a perda anual média do solo. Ao fazer o upload de um arquivo vetorial, o usuário pode analisar instantaneamente a dinâmica da cobertura da terra entre 1985 e 2024 para as classes: Soja, Cana, Pastagem, Vegetação Natural, Silvicultura, Outras Lavouras, Outros, Água e Mosaico de Uso. Além disso, é possível acessar imagens Landsat de diferentes anos e períodos (seco, chuvoso e anual), e identificar o nível de vigor das pastagens.

A Figura 03 mostra o fluxograma do processo de usabilidade da Análise Temporal da Dinâmica de Cobertura e Uso da Terra.

<center>
<img width="600px" title="Figura 2.8 - Método Elbow" src="/figures/figure_01.png"/>
<div>Figura 03 - Fluxograma de processo da Análise da Dinâmica de Cobertura e Uso da Terra.</div>
<p></p>
</center>


### 3.1.1 - Variáveis e Parâmetros

A entrada principal do toolkit é um arquivo poligonal das áreas de interesse da Acelen Renováveis. O usuário insere esse arquivo fazendo o upload dele como um asset no Google Earth Engine.

O usuário pode interagir com os seguintes parâmetros do toolkit:

- Filtro da camada de entrada: Permite ao usuário filtrar a camada de entrada a partir do conjunto de atributos, antes da inserção no mapa;

- Visualização da camada a partir de um raio de Influência: Permite que o usuário visualize sua área de interesse sobre um raio de influência (buffer)

- Data de análise da cobertura e uso da terra: O período específico para a análise temporal;

- Período de aquisição das cenas Landsat: O período (chuvoso, seca ou anual) de visualização das imagens dos satélites Landsat (5, 7, 8 e 9);

- Tipo de classificação: Forma de visualização das classes de cobertura e uso da terra na propriedade, sendo: Moda, Original e Original - Área Total;

- Visualização do vigor de pastagens: Visualização dos níveis de vigor das áreas de interesse da Acelen Renováveis, a partir dos dados do vigor da vegetação normalizados por biomas (Brasil) e por estados (no momento, disponível apenas para Minas Gerais e Bahia);

- Mapeamento automático das pastagens ao nível de propriedade: O mapeamento automático das pastagens é realizado sobre a camada de entrada. O usuário pode selecionar a quantidade de amostras, a área de influência (buffer) e as bases de dados de uso e cobertura da terra, a fim de coletar informações das pastagens usadas no processo de classificação;

- Cálculo da perda média anual de solo: O cálculo da perda média anual de solo, usando a equação RUSLE, é aplicado na bacia hidrográfica onde a área de interesse do usuário está inserida;

- Análise de tendência da pastagem na propriedade: Analisa-se a tendência dos valores de NDVI e dos valores de produtividade primária bruta (GPP), derivados de séries temporais de imagens Landsat, nas áreas de pastagem contidas na camada de entrada definida pelo usuário.

- Série temporal de cobertura e uso da terra (gráfico): Gera um gráfico (para a área de interesse) que mostra a evolução do uso e cobertura da terra ao longo do tempo;

- Taxa de conversão: Verifica a taxa de conversão de áreas naturais para antrópicas para cada área de interesse;

- Análise temporal da evolução das áreas de pastagem sobre áreas naturais e outros: Visualização dos valores das áreas em hectares das classes (pastagem, vegetação natural e outras), ao longo do tempo, para cada área de interesse.

- Download das camadas do toolkit: Permite o usuário fazer download da camada que está presente no mapa e/ou a série temporal das bases de dados contidas no toolkit, como: Vigor das pastagens e o uso e cobertura da terra (Mapbiomas)

### 3.1.2 - Processamento

Os mapas de cobertura e uso da terra compreendem 29 classes, as quais, com o intuito de melhorar o entendimento e as análises da dinâmica e uso da terra nas áreas de interesse da Acelen Renováveis, foram agrupadas em nove classes: Soja, Cana, Pastagem, Vegetação Natural, Silvicultura, Outras Lavouras, Outros, Água e Mosaico de Uso. A tabela 02 mostra o agrupamento das classes de cobertura e uso da terra em relação à base de dados original:

#### Tabela 02 - Classes agrupadas conforme as nove classes de interesse consideradas neste estudo.

| Classe Agrupada | Classe Original |
|---|---|
| Soja | Soja |
| Cana | Cana |
| Pastagem | Pastagem |
| Vegetação Natural | Formação Florestal, Formação Savânica, Mangue, Restinga Arbórea, Campo Alagado e Área Pantanosa, Formação Campestre e Restinga Herbácea |
| Silvicultura | Silvicultura |
| Outras lavouras | Lavoura temporária, Arroz, Algodão, Outras lavouras temporárias, Café, Citrus, Outras Lavouras perenes |
| Água | Rio, lago, oceano e aquicultura |
| Mosaico de usos | Mosaico de usos |
| Outros | Todas as classes que restaram e que não foram adicionadas nas anteriores |

Quando o usuário opta por visualizar a moda das classes dentro de uma área de interesse, a ferramenta identifica e classifica essa área com base na classe de cobertura e uso da terra que mais se repete. Isso proporciona uma visão clara da cobertura dominante na região selecionada.

### 3.1.3 - Dados de entrada

Os dados de entrada para o toolkit são informações vetoriais na estrutura poligonal. Inicialmente, o dado de entrada deve estar no formato de arquivo vetorial shapefile, e compactado no formato .zip. Com o dado no formato .zip, é necessário fazer o upload desse arquivo na plataforma Google Earth Engine, com o usuário já autenticado nessa mesma plataforma.

Uma vez que o arquivo vetorial tenha sido adicionado ao toolkit, o usuário pode filtrar áreas de interesse a partir das informações contidas no respectivo conjunto de atributos. Especificamente, no menu Entrada de Dados, cole o link do asset para integrá-lo à ferramenta. Após a visualização no mapa, você pode refinar a análise utilizando filtros específicos. Basta clicar na opção e filtro e depois, selecionar o campo e o valor desejado para isolar a área geográfica de interesse dentro do seu conjunto de dados.

### 3.1.4 - Visualização dos mapas de cobertura e uso da terra no

Para visualizar os mapas de cobertura e uso da terra na ferramenta a partir de um arquivo externo, no menu Classificação Uso da Terra, o usuário deve seguir estas etapas:

- Na opção "Fonte de dados", selecione a fonte de dados de uso da terra que deseja visualizar. Atualmente, o toolkit suporta apenas a fonte MapBiomas;

- No campo "Ano de Análise", deve-se escolher o ano da análise, que está ligado à fonte de dados selecionada;

- Na opção "Buffer (m)", o usuário pode expandir o limite (raio de influência) da camada de entrada. O objetivo é visualizar os dados de classificação em uma área que se estende além dos limites originais da camada;

- Após isso, selecione o tipo de classificação que deseja visualizar.

O campo Tipo de Classificação, possui três opções, sendo elas:

- Moda: O limite de cada área de interesse será classificado a partir da classe majoritária, ou seja, a classe de cobertura e uso da terra que mais se repetir na propriedade / área de interesse;

- Original: Cada elemento do arquivo externo mostrará todas as classificações em seu interior;

- Original - Área total: Serão visualizadas todas as classes de cobertura e uso da terra de toda a extensão geográfica do arquivo externo inserido.

Depois da seleção do tipo de classificação, clique no botão Gerar classificação do ano da análise para visualizar o mapa na tela da ferramenta. A tela traz a informação das classes de cobertura e uso da terra, legenda e os gráficos do quantitativo das classes no arquivo inserido, conforme o respectivo ano selecionado pelo usuário. O gráfico gerado pode ser exportado nos formatos: CSV (tabela de dados), SVG e PNG (Figura 04).

<center>
<img width="500px" title="Figura 2.8 - Método Elbow" src="/figures/figure_02.png"/>
<div>Figura 04 - Visualização do arquivo no mapa da ferramenta Análise Temporal da Dinâmica de Cobertura e Uso da Terra.</div>
<p></p>
</center>


### 3.1.5 - Visualização da dinâmica de cobertura e uso da terra, conversão para uso antrópico e evolução das áreas de pastagens

Para visualizar a dinâmica das classes de cobertura e uso da terra, é necessário que a opção escolhida no campo Tipo de Classificação seja a moda. Clique no ícone e aparecerá no centro superior da tela as opções das informações que o usuário deseja visualizar (Figura 05):

<center>
<img width="300px" title="Figura 05 - (a) O menu da ferramenta de gráfico" src="/figures/figure_03_a.png"/>
<img width="300px" title="Figura 05 - (b) Opções de visualização do gráfico" src="/figures/figure_03_b.png"/>
<div>Figura 05 - (a) O menu da ferramenta de gráfico, e (b) opções de visualização do gráfico.</div>
<p></p>
</center>

Após selecionar a opção de visualização do gráfico, clique na propriedade do arquivo externo que você deseja analisar. As Figuras 04, 05 e 06 ilustram os resultados dos gráficos de Cobertura da Terra, Proporção de Área Convertida e Evolução das áreas de pastagens.

<center>
<img width="400px" src="/figures/figure_04.png"/>
<div>Figura 06 - Dinâmica da Cobertura e Uso da Terra do elemento selecionado.</div>
<p></p>
</center>

<center>
<img width="400px" src="/figures/figure_05.png"/>
<div>Figura 07 - Proporção de área convertida do elemento selecionado.</div>
<p></p>
</center>

<center>
<img width="400px" src="/figures/figure_06.png"/>
<div>Figura 08 - Evolução das áreas de pastagem.</div>
<p></p>
</center>


### 3.1.6 - Vigor da pastagem

Para visualizar os níveis de vigor da pastagem, siga os seguintes passos no menu "Análise de Vigor":

- Selecione o Ano do Vigor (a série temporal disponível vai de 2000 a 2024).
- Defina a região para Análise (selecionando entre Brasil e Unidades da Federação - UF's).
- Ajuste o valor do Buffer em metros para a análise.
- Por fim, clique no botão "Visualizar Vigor"..

A Figura 09 mostra a visualização do Vigor da pastagem:

<center>
<img width="500px" src="/figures/figure_07.png"/>
<div>Figura 09 - Visualização do Vigor da Pastagem em 2000 no nível Baixo (Vermelho), Médio (Ocre) e Alto (Verde).</div>
<p></p>
</center>


Os dados de vigor utilizado neste toolkit são disponibilizados pelo MapBiomas, sendo gerados pelo Laboratório de Sensoriamento Remoto e Geoprocessamento - LAPIG da Universidade Federal de Goiás (conforme metodologia proposta por Santos et al., 2022 e modificada por Ferreira Jr et al., 2023).

### 3.1.7 - Mapeamento automático de pastagens em nível de propriedade

Para o mapeamento automatizado das pastagens em nível de propriedade, o usuário deve, inicialmente, acessar o Menu Mapeamento Automático Detalhado - Pastagem, selecionar a base de dados para a classificação. As opções disponíveis são Sentinel-2 e Embeddings, ambas com resolução espacial de 10 metros.

Após a seleção, o usuário define a quantidade de amostras, o buffer (em metros) e o ano para o mapeamento. Por fim, ele escolhe a fonte de dados de pastagem existentes para a geração de amostras, as quais serão usadas pelo algoritmo Random Forest para o mapeamento final.

As fontes de mapeamento existentes incluem dados do MapBiomas, dados da iniciativa Global Pasture Watch (Parente et al., 2024) e a sobreposição das áreas de pastagem de ambas as fontes. A Figura 10 apresenta o resultado do mapeamento automático de pastagem em nível de propriedade.

<center>
<img width="500px" src="/figures/figure_08.png"/>
<div>Figura 10 - Exemplo do mapeamento automático das pastagens em nível de propriedade.</div>
<p></p>
</center>

### 3.1.8 - Cálculo da perda média anual do solo (RUSLE)

Para calcular a perda média anual de solo, no menu Método RUSLE, selecione um ano no período de 2017 a 2024. Em seguida, escolha qual fator deseja visualizar ou a própria perda média anual de solo e posteriormente, o usuário selecionará qual divisão da bacia hidrográfica deseja calcular, sendo as opções a divisão do DHN e do DNAEE. A Figura 11 apresenta um exemplo do resultado.

<center>
<img width="500px" src="/figures/figure_09.png"/>
<div>Figura 11 - Exemplo da perda média potencial anual de solo (t/ha/ano).</div>
<p></p>
</center>


### 3.1.9 - Análise de tendência da pastagem na propriedade

Nesta etapa é possível avaliar a tendência dos valores de produtividade primária bruta e NDVI, conforme a mancha de pastagem identificada nas áreas de interesse na Acelen. Para realizar a análise de tendência da pastagem, acesse o menu "Análise de Tendência das Pastagens".

#### 3.1.9.1 - Análise de tendência da Produtividade Primária Bruta (GPP)

Na análise de tendência da produtividade das pastagens nas áreas de interesse da Acelen, tivemos que organizar uma base de dados histórica bimestral de GPP, cobrindo o período de 2000 a 2024. A inserção desses dados no toolkit seguiu três grandes etapas:

1. **Coleta de Dados:** Baixamos as imagens via shell que estão armazenados no servidor da OpenGeoHub, que é uma fundação de Pesquisa sediada em Doorwerth, localizada nos Países Baixos, que se dedica a promover o acesso aberto a dados geoespaciais e softwares de código aberto. Os dados possuem uma resolução espacial de 30 metros, e o cálculo do GPP segue a metodologia adotadas por Isik et al. (2024).

2. **Junção das imagens e um único arquivo:** Em vez de manipular centenas de arquivos individuais, agrupamos todas as imagens baixadas em um único arquivo georreferenciado (formato multibanda). Nele, cada registro bimestral do GPP é armazenado como uma banda distinta, facilitando o processamento e a organização espacial.

3. **Upload dos arquivos no Google Earth Engine:** Por fim, fizemos o upload desse arquivo para o Google Earth Engine. Para usuários de conta gratuita, o Google Earth Engine limita a quantidade de upload por imagem em 10GB, com isso, tivemos que recortar as imagens do GPP bimestral em pedaços inferior ao tamanho permitido pela Google.

Com os arquivos de GPP na plataforma do Google Earth Engine, o usuário pode fazer a análise da tendência nas áreas de pastagem na propriedade, acessando o menu de Análise de Tendência das Pastagem. De acordo com as seguintes etapas:

1. Selecione o produto Produtividade Primária Bruta (GPP)

2. Selecione o período de análise nos campos Ano Inicial e Ano Final.

3. Após a seleção de todos os parâmetros, clique no botão "Calcular Tendência" para gerar o gráfico que indica se a tendência do GPP nas áreas de pastagem é positiva ou negativa.

As figuras 10 e 11 apresentam exemplos do resultado da Análise de tendência da pastagem usando o produto Produtividade Primária Bruta (GPP).

<center>
<img width="500px" src="/figures/figure_10.png"/>
<div>Figura 12 - Ocupação da área de uso e cobertura da terra em 2001.</div>
<p></p>
</center>

<center>
<img width="600px" src="/figures/figure_11.png"/>
<div>Figura 13 - Tendência de GPP da pastagem da propriedade rural de 2001 à 2023.</div>
<p></p>
</center>

#### 3.1.9.2 - Análise de tendência do NDVI

Para verificar a tendência dos valores de índice de vegetação (NDVI) nas áreas de pastagem da propriedade, acesse o menu Análise de Tendência das Pastagem.

4. Selecione o produto Índice de Vegetação (NDVI)

5. Selecione o período de análise nos campos Ano Inicial e Ano Final.

6. Em seguida, escolha os parâmetros Janelas de Análise do Algoritmo TMWM:

- O campo "Tamanho da Janela - Anos" representa o número máximo de anos do mesmo mês utilizado no gap filling.

- O campo "Tamanho da Janela - Dias" define o valor em dias dos vizinhos adjacentes do mesmo ano.

7. Após a seleção de todos os parâmetros, clique no botão "Calcular Tendência" para gerar o gráfico que indica se a tendência do NDVI nas áreas de pastagem é positiva ou negativa

As figuras 12 e 13 apresentam exemplos do resultado da Análise de tendência da pastagem usando o Índice de Vegetação (NDVI).

<center>
<img width="550px" title="Figura 2.8 - Método Elbow" src="/figures/figure_12.png"/>
<div>Figura 14 - Área ocupada por pastagem a partir 2016.</div>
<p></p>
</center>

<center>
<img width="650px" title="Figura 2.8 - Método Elbow" src="/figures/figure_13.png"/>
<div>Figura 15 - Tendência da pastagem da propriedade rural de 2016 à 2024</div>
<p></p>
</center>


### 3.1.10 - Análise de Biomassa Seca

No menu "Análise de Biomassa Seca", o usuário pode estimar a série temporal mensal de biomassa seca das áreas de pastagem dentro da propriedade de interesse selecionada no toolkit. O cálculo é feito a partir dos dados de Produtividade Primária Bruta em calculos a partir dos dados do satélite Sentinel com 10 metros de resolução, disponibilizados pela iniciativa WRI Land & Carbon Lab (Time2Graze).

Para realizar a análise, o usuário deve:

1. Informar o valor de Eficiência de Uso da Luz (LUE, em gC/m²/dia/MJ) — parâmetro que representa a eficiência com que a vegetação de pastagem converte a radiação fotossinteticamente ativa absorvida em biomassa.

2. Informar o valor do fator de conversão da biomassa (fator IPCC), utilizado para converter a produtividade primária bruta estimada em massa de biomassa seca.

3. Clicar no botão "Calcular série temporal da Biomassa" para gerar o gráfico.

Internamente, o toolkit multiplica os dois parâmetros informados pelo usuário (LUE × fator de conversão IPCC) para obter o fator de conversão de biomassa seca. Em seguida, para cada mês do período de análise (janeiro de 2025 a abril de 2026), a ferramenta:

- Filtra e calcula a média mensal do uGPP dentro da área de interesse selecionada;
- Aplica o fator de escala do produto uGPP e converte a unidade de gC/m²/dia para toneladas de carbono por hectare (tC/ha), multiplicando o resultado pelo número de dias do respectivo mês para obter o total mensal;
- Restringe o resultado às áreas classificadas como pastagem pela máscara da Global Pasture Watch referente a 2024;
- Aplica o fator de conversão de biomassa seca (LUE × fator IPCC) sobre o valor mensal de carbono, obtendo a estimativa de biomassa seca (tC/ha/mês).

O resultado é exibido em um gráfico de série temporal (linha), com a média mensal de biomassa seca de pastagem (tC/ha) no eixo vertical e os meses no eixo horizontal, intitulado "Média Mensal da Biomassa Seca de Pastagem (Jan 2025 — Abr 2026)". O usuário pode fechar a janela do gráfico clicando no botão "Fechar".

### 3.1.11 - Download das camadas no toolkit

No toolkit, o usuário pode fazer o download tanto das camadas geradas por sua interação com a ferramenta quanto das bases de dados estáticas, como os dados de uso e cobertura da terra do MapBiomas e os dados de vigor da pastagem. Para executar o download, o usuário deve clicar no ícone.

Na parte central inferior da tela, surgirá uma janela (conforme a Figura 14), onde é possível selecionar as camadas da base de dados estática ou as camadas geradas que estão sendo visualizadas no mapa. Após selecionar a camada desejada, clique no botão "Download". Em seguida, acesse a aba "Tasks" e clique no botão "Run" referente à camada selecionada para iniciar a exportação. O arquivo será exportado para a pasta "GEEX" no Google Drive pessoal do usuário.

A Figura 16 mostra o painel de download do toolkit.

<center>
<img width="350px" title="Figura 2.8 - Método Elbow" src="/figures/figure_14.png"/>
<div>Figura 16 - Painel de download da camada do toolkit.</div>
<p></p>
</center>


## 3.2 - Estratégia de Amostragem em Campo para Verificação de Pastagens Degradadas

Enquanto a Seção 3.1 descreve o algoritmo do *toolkit* propriamente dito — a análise, na escala orbital, da dinâmica de cobertura, do vigor e da tendência de produtividade das pastagens —, esta seção descreve o algoritmo complementar de verificação em campo, referido na Tabela 01 (Seção 1.2) como "Estratégias de amostragem de campo". Seu papel é gerar a verdade terrestre (*ground truth*) necessária para confirmar, calibrar e auditar as saídas do *toolkit*, aplicando os fundamentos de auditabilidade, amostragem espacialmente balanceada, alocação ótima, inferência para proporções, normalização sazonal e metrologia de campo apresentados nas Seções 2.8 a 2.13.

Nessa estratégia de campo, é aplicado um detalhamento de amostragem em uma estrutura hierárquica do funil no sete níveis (N0A, N0B, N1A, N1B, N2, N3 e N4), no qual cada nível aumenta a resolução da evidência coletada — e, consequentemente, o custo por unidade — e é aninhado estatisticamente no nível anterior por meio do algoritmo GRTS (Seção 2.9.1). A descrição a seguir toma como referência de aplicação a área piloto do projeto: a Região Intermediária de Montes Claros (MG), no recorte que faz interseção com o bioma Cerrado, com cerca de 1,6 milhão de hectares de pastagens. Os quantitativos apresentados (número de propriedades, de pontos e de sítios) são, portanto, valores de referência dimensionados para essa área; os critérios e as fórmulas que os geram são gerais e escaláveis para as demais regiões de interesse.

### 3.2.1 - Enquadramento Regulatório e Evidências Exigidas

O ponto de partida do algoritmo não é uma escolha metodológica interna, mas um conjunto de evidências que precisam existir ao final do processo. A aviação civil responde por aproximadamente 2,5% das emissões diretas de CO₂ globais, com impacto climático total ainda maior quando considerados os efeitos não-CO₂ (IPCC, 2022; IEA, 2023; ICAO, 2022). O Combustível Sustentável de Aviação (SAF) emerge como a alternativa mais viável no curto e médio prazo, e marcos regulatórios como o ReFuelEU Aviation (Regulamento UE 2023/2405), o *SAF Blending Mandate* do Reino Unido e o CORSIA/ICAO já impõem mandatos progressivos de incorporação de SAF, exigindo comprovação rigorosa de sustentabilidade de toda a cadeia produtiva.

A aplicação que motiva o plano de amostragem de campo é a identificação de pastagens degradadas elegíveis ao cultivo da macaúba (*Acrocomia aculeata*), palmeira nativa do Cerrado com emissões de 19,32 gCO₂eq/MJ ao longo do ciclo de vida e capacidade comprovada de recuperação do solo, implantada **exclusivamente em áreas de pastagem degradada**. Para que essa premissa seja reconhecida pelos sistemas de certificação internacionais, a simples declaração de degradação não é suficiente: exige-se metodologia de verificação transparente, auditável e replicável. Cada sistema estabelece critérios próprios sobre a condição da terra antes da conversão, e é a partir deles que se define o que precisa ser medido, com que rastreabilidade e em que nível do funil. A Tabela 20 explicita essa correspondência.

#### Tabela 20 - Requisitos de certificação e evidências correspondentes produzidas pelo algoritmo de campo

| Certificação / Diretiva | Critério aplicável | Evidências exigidas — atendidas pelo algoritmo |
| --- | --- | --- |
| ISCC EU 202 | Critérios de sustentabilidade de terra | Comprovação de degradação da terra antes da conversão (evidências orbitais + campo); ausência de conversão de vegetação nativa desde jan/2008 |
| RSB Standard 03 | Biomassa e uso da terra | Demonstração de que a expansão ocorre exclusivamente em pastagens degradadas; levantamento de solo e carbono; evidências de biodiversidade |
| RED III (Dir. UE 2023/2413, Art. 29) | Terras degradadas | Evidências de degradação severa e persistente por pelo menos 10 anos; ausência de alto valor de carbono; dados de campo auditáveis e rastreáveis |
| Verificação de campo (critérios Acelen) | Inspeção e validação presencial | Inspeção visual em imagens de sensoriamento remoto + visita de campo com escore 0–10; coleta de biomassa e solo; documentação fotográfica e imageamento por drone |

A leitura da Tabela 20 na direção inversa define a arquitetura do funil: o requisito de persistência decenal é atendido pela análise de tendência da série orbital (Seção 3.1.9); a comprovação de degradação, pela combinação de triagem em gabinete (N0B) e validação presencial (N1B); o levantamento de solo e carbono, pelos níveis N3 e N4; e a rastreabilidade, pelo sistema de identificadores hierárquicos e pelo registro digital descritos em 3.2.7.

### 3.2.2 - Quadro Amostral e População-Alvo

A população-alvo é constituída pelas propriedades rurais privadas delimitadas pela malha fundiária ambiental do LAPIG/UFG, que integra dados do Cadastro Ambiental Rural (CAR) e do Sistema de Gestão Fundiária (SIGEF) com mitigação de inconsistências geométricas. Trata-se do mesmo tipo de camada de entrada utilizada pelo *toolkit* (Seção 3.1.3), agora empregada como quadro amostral (*frame*) e não apenas como recorte de consulta.

Três critérios restritivos e concorrentes são aplicados na filtragem:

1. **Delimitação geográfico-ecológica.** Imóveis situados na região de interesse, no recorte de interseção com o bioma alvo.
2. **Aptidão temática.** A propriedade deve intersectar áreas de pastagem mapeadas no ano de referência pelo produto de cobertura de 10 m adotado pelo projeto. O arquivo raster e a legenda correspondentes permanecem anexados ao dossiê técnico, de modo que a composição do quadro amostral seja reconstituível.
3. **Limiar de dimensão.** Apenas propriedades com área igual ou superior a 2 hectares, o que exclui minifúndios e ruídos de vetorização.

Na área piloto, o resultado é um quadro amostral de **N = 52.719 propriedades**. Sobre esse quadro são aplicados o agrupamento K-Means e o sorteio GRTS. As variáveis empregadas na estratificação, listadas na Tabela 21, combinam os próprios produtos gerados pelo *toolkit* — vigor da pastagem (Seção 3.1.6) e tendência de vigor (Seção 3.1.9) — com variáveis complementares de degradação agronômica e de pressão pecuária.

#### Tabela 21 - Variáveis utilizadas no agrupamento K-Means para estratificação das propriedades

| Variável | Fonte | Resolução | Papel na estratificação |
| --- | --- | --- | --- |
| Vigor de pastagem (EVI médio do período chuvoso) | Sentinel-2 (GEE) | 10 m / 16 d | Discrimina pastagens produtivas de pastagens de baixo vigor |
| Tendência de vigor (coeficiente angular, Mann-Kendall) | Sentinel-2 (GEE) | 10 m | Identifica áreas em declínio crônico de produtividade |
| Fração de solo exposto (NDTI) | Sentinel-2 (GEE) | 10 m | Proxy de degradação agronômica e biológica |
| Altura mediana da vegetação | Hunter et al., 2024 | 10 m | Diferencia campos baixos de regeneração arbórea |
| Matéria seca mensal (GPW 10m) | Global Pasture Watch / LAPIG-ACELEN (base do projeto; metadados a anexar) | 10 m | Estima capacidade de suporte e biomassa forrageira |
| Densidade bovina estimada (UA/ha) | LAPIG-ACELEN (base modelada do projeto); IBGE PPM como referência auxiliar | ~1 km ou resolução do modelo |Pressão pecuária como agente de degradação; documentar método de interpolação/desagregação e fonte primária |


### 3.2.3 - Estratificação e Dimensionamento da Amostra de Propriedades

A estratificação é obtida por agrupamento K-Means sobre as seis variáveis normalizadas por escore-z (Seção 2.9). O número de estratos *k* é determinado pelo método Elbow combinado ao índice de Davies-Bouldin, com validação em mapa; na área piloto, espera-se *k* entre 6 e 8, faixa que captura os principais gradientes de degradação da paisagem regional.

A validação dos agrupamentos responde a duas perguntas independentes. A primeira é espacial: propriedades de um mesmo estrato estão geograficamente próximas ou compartilham condições similares de relevo e clima? A segunda é temática: cada estrato representa uma condição de pastagem interpretável — por exemplo, alto vigor com baixa densidade animal, em oposição a baixo vigor com alta densidade? Estratos que respondam afirmativamente a ambas são mantidos. Estratos que representem menos de 5% do quadro amostral têm variabilidade insuficiente para sustentar alocação própria e são fundidos ao estrato de perfil multivariado mais próximo, medido pela distância euclidiana entre centroides normalizados.

Definidos os estratos, o tamanho amostral total é calculado pela Eq. 08 e distribuído entre os estratos pela alocação ótima de Neyman (Eq. 09, Seção 2.9). Na área piloto adotou-se, como referência de planejamento, nível de confiança de 95% (*z* = 1,96), margem de erro de 2,8% (\(\varepsilon\) = 0,028), variância máxima para proporções (\(\sigma_h^2 = 1/4\)) e *N* = 52.719, resultando em aproximadamente **1.200 propriedades** no nível N0A. O valor \(\sigma_h^2 = 1/4\) é conservador e superestima a amostra; assim que estimativas específicas de variabilidade por estrato estiverem disponíveis, elas substituem esse valor na aplicação da alocação de Neyman, tipicamente reduzindo o esforço necessário.

### 3.2.4 - Estrutura Hierárquica do Funil

A inovação do desenho em relação a planos amostrais convencionais está na introdução do nível N0B. Inspecionar visualmente a totalidade da área de pastagem de uma propriedade grande não é viável em gabinete: uma fazenda com 500 ha de pastagem corresponde a uma janela de aproximadamente 1.118 × 1.118 pixels em um sensor de 2 m. Sorteia-se, portanto, um conjunto de pontos de inspeção dentro de cada propriedade selecionada. O mesmo princípio de subamostragem interna se repete em todos os níveis subsequentes — pontos dentro de propriedades visitadas, subpontos dentro de sítios de drone — e é o que mantém o custo controlado sem quebrar a cadeia probabilística. A Tabela 22 sintetiza a estrutura completa.

#### Tabela 22 - Estrutura hierárquica do funil de amostragem de campo (7 níveis)

| Nível | Unidade | N amostral (referência) | Método de seleção | Custo relativo |
| --- | --- | --- | --- | --- |
| N0A - Seleção de propriedades | Propriedade rural | ≈ 1.200 | GRTS por estrato K-Means (N = 52.719) | Muito baixo (gabinete) |
| N0B - Pontos de inspeção em imagem de alta resolução | Ponto amostral (~1-4 ha) por propriedade | ≈ 5.000-7.000 (média ≈ 5 pontos/propriedade) | GRTS aninhado na máscara de pastagem de cada propriedade N0A; \(k_i = \max(3,\ \min(20,\ \lceil A_i/20 \rceil))\) | Muito baixo (gabinete) |
| N1A - Propriedades para campo (principal + controle) | Propriedade rural | ≈ 228 principais + 12 de controle (≈ 240) | Principal: GRTS entre propriedades com ≥ 30% de pontos N0B elegíveis. Controle (5%): GRTS no pool inelegível (\(\hat p_i < 0{,}10\)) | Baixo |
| N1B - Pontos de validação em campo | Ponto amostral *in loco* | ≈ 480-960 (2-4 por propriedade N1A) | GRTS aninhado nos pontos N0B elegíveis; \(n_i = \max(2,\ \lceil A_i/100 \rceil)\) | Baixo-Médio |
| N2 - Sobrevoo de drone (principal + controle) | Sítio de voo (100-250 m) | ≈ 72 principais + 8 de controle (≈ 80) | PPrincipal: GRTS nos pontos N1B com escore 0–6; Controle (10%): GRTS nos pontos N1B com escore 7–10 (D0/D1) para calcular especificidade do modelo | Médio |
| N3 - Biomassa (método do quadrado) | Subponto amostral no sítio N2 | ≈ 40 sítios; ≈ 120-200 subpontos | GRTS sobre grade de 20 m dentro do footprint do drone de cada sítio N2 selecionado (50% de N2) | Médio-Alto |
| N4 - Solo (trado, 0-30 cm) | Subponto aninhado em N3 | ≈ 15-20 sítios; ≥ 1 amostra composta por sítio | Seleção aleatória simples nos subpontos N3 do sítio; mínimo 1 solo por sítio N4 | Alto |

Em todos os níveis, o GRTS produz também uma lista sequencial de unidades de substituição (sobreamostragem de 50%). Unidades inelegíveis — acesso negado, cobertura de nuvens persistente, uso atual incompatível — são substituídas pela unidade imediatamente seguinte da lista, dentro do mesmo estrato, o que preserva o balanceamento espacial e temático do sorteio original. Cada substituição é registrada no banco de dados com o motivo específico, mantendo a auditabilidade do quadro efetivamente amostrado.

### 3.2.5 - Nível N0A - Seleção de Propriedades e Preparo das Imagens

Aplicado o GRTS por estrato, o produto do nível N0A é um arquivo vetorial georreferenciado contendo, para cada propriedade sorteada: identificador hierárquico, estrato K-Means, coordenadas do centroide, área total, área de pastagem no ano de referência e os valores das seis variáveis de estratificação. Esse arquivo é a base de todas as etapas seguintes — geração da grade de pontos N0B, identificação das propriedades N1A, navegação das equipes de campo e vinculação dos registros digitais.

A inspeção visual do nível seguinte exige a combinação de dois conjuntos de imagens com papéis distintos. As imagens Sentinel-2 (10 m) funcionam como **base geométrica de referência** e como fonte das variáveis de estratificação. As imagens de alta resolução — CBERS-4A/4B, sensor WPM (2 m) — são o **instrumento de inspeção**, pois permitem identificar manchas de solo exposto, erosão em sulcos, padrões de invasoras e estrutura do dossel em detalhe inacessível ao Sentinel-2. 

Caso a ACELEN disponibilize acesso às imagens Planet, estas oferecem duas vantagens complementares: (a) maior número de bandas espectrais (até 8 bandas, incluindo Red-Edge e NIR estreito), melhorando a caracterização da composição botânica e da biomassa das pastagens em comparação ao CBERS-4A/WPM (4 bandas); (b) datas de aquisição distintas das imagens CBERS, permitindo inspeção de um mesmo ponto em períodos diferentes do ano e reforçando a confiabilidade das interpretações visuais ao confrontar avaliações independentes da mesma área.

O uso combinado dessas fontes só é válido após o co-registro sub-pixel descrito na Seção 2.12. A necessidade é concreta: o erro de co-registro do Sentinel-2 é inferior a 6 m em escala global (Rengarajan et al., 2024), enquanto o erro posicional absoluto das imagens CBERS-4B pode atingir cerca de 400 m (Akiyama et al., 2018) — deslocamento que supera a própria janela de inspeção. A correção é executada com o software AROSICS, que alinha as cenas CBERS à base Sentinel-2 por correlação de fase com eliminação de falsos positivos por RANSAC, alcançando co-registro residual inferior a 2 m, isto é, menos de um pixel CBERS. *Tiles* cujo RMSE residual exceda 3 m são reprocessados com pontos de controle adicionais, e o relatório de RMSE por *tile* integra a documentação de qualidade do levantamento.

A janela de aquisição das imagens e a janela de coleta em campo são condicionadas pela fenologia e pela cobertura de nuvens, conforme a Tabela 23. 

#### Tabela 23 - Calendário fenológico para aquisição de imagens e coleta de campo

| Período | Cobertura de nuvens | Imagens de alta resolução (N0B) | Sentinel-2 | Campo (N1B-N4) | Observações |
| --- | --- | --- | --- | --- | --- |
| Jan-Mar | Alta (> 70%) | Inadequado | Inadequado | Evitar | Acesso rural difícil; pastagens verdes mascaram o solo exposto |
| Abr-Mai | Média (30-60%) | Parcial | Parcial | Adequado (início) | Transição; janela para imagens de final do período chuvoso |
| Jun-Set | Baixa (< 20%) | Ideal | Ideal | Ideal | Maior visibilidade de solo exposto e invasoras; acesso rural viável |
| Out-Nov | Crescente (20-50%) | Parcial | Parcial | Adequado | Início do período chuvoso; complementar com imagens de jun-set |
| Dez | Alta (> 60%) | Inadequado | Inadequado | Evitar | Pico de chuvas; concentrar em análises laboratoriais e processamento |

### 3.2.6 - Nível N0B - Triagem por Inspeção Visual em Gabinete

Dentro de cada propriedade N0A, os pontos de inspeção são sorteados por GRTS sobre a máscara de pastagem de 2024 (MapBiomas 10 m / acervo do projeto). Cada ponto representa uma janela visual de aproximadamente 4 ha (200 × 200 m, inspecionada em escala 1:5.000). O número de pontos \(k_i\) da propriedade *i*, com área de pastagem \(A_i\) em hectares, é dado por:

\[
k_i = \max\left(k_{\min},\ \min\left(k_{\max},\ \left\lceil A_i / d \right\rceil\right)\right) \tag{Eq. 16}
\]

com \(k_{\min} = 3\) (mínimo necessário para avaliar heterogeneidade espacial), \(k_{\max} = 20\) (teto operacional por propriedade) e \(d = 20\) ha/ponto (densidade de referência, correspondente à cobertura de cerca de 20% da área por janelas de 4 ha). A Tabela 24 detalha os quantitativos por faixa de área e a justificativa de cada faixa.

#### Tabela 24 - Número de pontos N0B por faixa de área de pastagem

| Área de pastagem (\(A_i\)) | Pontos N0B (\(k_i\)) | Janela visual por ponto | Cobertura total estimada | Justificativa estatística |
| --- | --- | --- | --- | --- |
| < 20 ha | 3 (mínimo) | ~4 ha (200 × 200 m) | 12 ha (até ~60%) | Censo visual praticamente completo; mínimo para avaliar heterogeneidade espacial |
| 20-60 ha | 3 | ~4 ha |12 ha (~20-60%) | Suficiente para triagem visual padronizada, com confirmação posterior em N1B |
| > 60-200 ha | 4-10 (pontos)| ~4 ha |16-40 ha (~20-27%) | Densidade de 1 ponto/20 ha; permite estimar a proporção degradada com distribuição balanceada |
| > 200-500 ha | 11-20 (pontos)| ~4 ha | 44-80 ha (~16-22%) | O GRTS garante distribuição espacialmente balanceada e evita agrupamento em áreas de fácil leitura |
| > 500 ha | 20 (máximo) | ~4 ha | 80 ha (≤ 16%, decrescente com a área) | Teto operacional; propriedades grandes são compensadas por peso amostral e validação hierárquica |

Com base na distribuição de tamanhos das 52.719 fazendas da malha fundiária, e considerando que a área mediana de pastagem por fazenda na região é de aproximadamente 50–80 ha (distribuição log-normal), estima-se um total de 5.000 a 7.000 pontos N0B distribuídos pelas ≈ 1.200 fazendas selecionadas. A inspeção de cada ponto leva, em média, 4–6 minutos por analista experiente, implicando carga de trabalho de aproximadamente 400–700 horas-analista no total — executáveis em 2–3 meses com 4 analistas em paralelo.

#### 3.2.6.1 Procedimento padronizado de inspeção

Para cada ponto N0B sorteado, o analista segue a sequência padronizada::

1. Centraliza o QGIS/WebGIS no ponto N0B (coordenadas carregadas automaticamente como camada ponto);
2. Visualiza a composição colorida falsa-cor do Sentinel-2 (B8-B4-B3) no período chuvoso para verificar o vigor geral da pastagem nessa janela;
3. Visualiza a composição do CBERS-4A (NIR-vermelho-verde) na janela de estiagem (jun–set) para identificar solo exposto, erosão e invasoras em detalhe;
4. Visualiza a série temporal do EVI no ponto (gráfico de 2019–2025) para confirmar tendência de degradação;
5. Preenche o formulário digital de inspeção no ODK Collect (perfil 'N0B — Inspeção CBERS'); vide Apêndice A;
6. Captura obrigatória de screenshot da janela inspecionada como evidência auditável;
7. Classifica o ponto em: Elegível / Inelegível / Inconclusivo.

**Nota:** Inconclusivos (alta cobertura de nuvens, mosaico incompleto, ambiguidade de uso) são remetidos ao supervisor, que tenta imagem complementar (Planet ou data alternativa CBERS). Se não houver imagem disponível, o ponto é descartado e substituído pelo próximo da lista GRTS da mesma fazenda.

#### 3.2.6.2 Critérios de elegibilidade do ponto N0B

O ponto é classificado como **elegível** quando atende simultaneamente a dois critérios. O primeiro é de **persistência temporal**: presença de pastagem em pelo menos 3 dos últimos 5 anos na série de cobertura e uso da terra do MapBiomas (evita falsos positivos por conversões recentes). O segundo é de **evidência de degradação**: solo exposto estimado em pelo menos 5%, ou presença moderada a dominante de invasoras, ou vigor baixo (EVI2 inferior a 0,35) na imagem CBERS da estação seca.

O ponto é **inelegível** quando o uso foi convertido para agricultura ou área urbanizada, quando há regeneração florestal com mais de 50% de cobertura arbórea, ou quando a área de pastagem < 0,5 ha na janela de 4 ha inspecionada.

#### 3.2.6.3 Aplicação da normalização sazonal

Os critérios acima só são comparáveis entre propriedades inspecionadas em épocas distintas do ano se os índices forem previamente normalizados pelos fatores de correção sazonal definidos nas Eq. 13 e Eq. 14 (Seção 2.13). A aplicação é **obrigatória** sempre que a imagem inspecionada tiver data de aquisição fora do período de referência. O analista registra o mês da imagem no formulário digital, os valores normalizados são calculados na rotina de pós-processamento, e a decisão de elegibilidade é sempre tomada sobre os índices normalizados. A Tabela 25 apresenta valores regionais típicos dos dois fatores para o Cerrado norte-mineiro.

#### Tabela 25 - Fatores de correção sazonal para inspeção de imagens (N0B), referência jun-set

| Mês | Estação | Viés no solo exposto observado | Viés no vigor observado | FCS<sub>EVI2</sub> | FCS<sub>BS</sub> | Ação recomendada |
| --- | --- | --- | --- | --- | --- | --- |
| Jan-Fev | Chuvosa intensa | Subestimativa severa (–10 a –20 pp) | Superestimativa severa (+0,15 a +0,25) | 0,60-0,70 | 3,0-5,0 | Evitar. Se inevitável, aplicar os dois fatores separadamente e confrontar com a série temporal do ponto |
| Mar | Chuvosa tardia | Subestimativa moderada (–6 a –12 pp) | Superestimativa moderada (+0,10 a +0,18) | 0,70-0,82 | 2,0-3,5 | Somente como complemento; exigir confirmação com imagem de jun-set |
| Abr-Mai | Transição para a seca | Subestimativa leve (–3 a –6 pp) | Superestimativa leve (+0,05 a +0,10) | 0,82-0,94 | 1,3-2,0 | Aceitável com correção; anotar o estágio de senescência |
| Jun-Set | Seca (referência) | Sem viés | Sem viés | 1,00 | 1,00 | Período ideal; nenhuma correção necessária |
| Out-Nov | Transição para a chuva | Subestimativa leve (–2 a –5 pp) | Superestimativa leve (+0,03 a +0,08) | 0,92-0,97 | 1,1-1,4 | Aceitável; preferir imagens de ago-set e anotar chuvas recentes (< 5 dias) |
| Dez | Chuvosa inicial | Subestimativa moderada (–5 a –10 pp) | Superestimativa moderada (+0,08 a +0,15) | 0,75-0,88 | 1,5-2,5 | Evitar. Se usado, aplicar ambos os fatores e confrontar com a série temporal |

Os valores da Tabela 25 são aproximações climatológicas regionais. Propriedades situadas em microclimas diferenciados — proximidade de grandes cursos d'água, áreas de cerradão, veredas — podem desviar dessa climatologia. Sempre que o processamento em nuvem estiver disponível, recomenda-se calcular \(\mu_{\text{EVI2}}(p,M)\) e \(\mu_{\text{BS}}(p,M)\) diretamente para o pixel da propriedade, dispensando os fatores tabelados e obtendo normalização pixel a pixel, mais precisa e mais defensável em auditoria.

#### 3.2.6.3 Priorização das propriedades para o nível seguinte

Concluída a inspeção dos \(k_i\) pontos de uma propriedade, seja \(x_i\) o número de pontos elegíveis. Como cada ponto tem resultado binário, \(x_i\) segue distribuição Binomial de parâmetros \(k_i\) e \(p_i\). Dado que \(k_i\) é pequeno por construção — entre 3 e 20 —, a incerteza sobre \(p_i\) é quantificada por inferência Bayesiana com *a priori* de Jeffreys, conforme a Eq. 10, e a estimativa pontual \(\hat p_i\) é a média da posteriori (Eq. 11, Seção 2.10). O intervalo de credibilidade de 95% é obtido diretamente dos quantis da distribuição Beta posterior.

A estimativa \(\hat p_i\) define a classe de prioridade da propriedade, conforme a Tabela 26. A priorização em três classes, em lugar de um corte binário, é o que permite ao GRTS selecionar as propriedades de campo cobrindo todo o gradiente de degradação, e não apenas os casos extremos.

#### Tabela 26 - Critérios de priorização de propriedades para o nível N1A

| Proporção estimada de pontos N0B elegíveis (\(\hat p_i\)) | Decisão N1A | Justificativa |
| --- | --- | --- |
| \(\hat p_i \geq 0{,}50\) | Elegível — prioridade alta | Maioria dos pontos com evidência de degradação; alta probabilidade de confirmação em campo |
| \(0{,}30 \leq \hat p_i < 0{,}50\) | Elegível — prioridade média | Degradação presente em 30-50% dos pontos; sorteada via GRTS para representar o gradiente |
| \(0{,}10 \leq \hat p_i < 0{,}30\) | Elegível — prioridade baixa | Reserva da lista GRTS; usada para substituição ou ampliação amostral |
| \(\hat p_i < 0{,}10\) | Inelegível | Sem evidências relevantes de degradação; compõe o pool de sorteio da subamostra de controle (3.2.7) |

#### 3.2.6.4 Controle de qualidade inter-observador (Kappa N0B)

Vinte por cento dos pontos N0B — cerca de 1.000 a 1.400 pontos na área piloto — são inspecionados de forma independente por dois analistas. A concordância é medida quinzenalmente pelo coeficiente Kappa de Cohen (Eq. 12, Seção 2.11), com a seguinte escala de decisão: \(\kappa \geq 0{,}85\) indica desempenho excelente; \(0{,}75 \leq \kappa < 0{,}85\) dispara revisão dos critérios com o supervisor; e \(\kappa < 0{,}75\) exige sessão obrigatória de recalibração com análise dos casos divergentes antes da continuidade da triagem. O procedimento é análogo ao controle de acurácia aplicado à classificação automática de uso e cobertura da terra (Seção 2.3), com a diferença de que aqui o objeto avaliado é a consistência do julgamento humano.

> **Nota técnica — divergência de limiares a resolver.** O Plano Amostral LAPIG/ACELEN v6.0, em seu item 5.6, apresenta duas escalas de decisão distintas para o mesmo controle. A escala acima trata \(\kappa < 0{,}75\) como reprovação, enquanto a Tabela 37 adota \(\kappa \geq 0{,}75\) como limiar de aceitação — de modo que um valor como \(\kappa = 0{,}78\) é aceitável sob um critério e dispara revisão sob o outro. A divergência é anterior a este documento e precisa ser dirimida pela equipe responsável pelo plano antes da campanha de triagem; até lá, recomenda-se adotar a escala mais conservadora.

### 3.2.7 - Níveis N1A e N1B - Validação em Campo

#### 3.2.7.1 Seleção das Fazendas para Visita de Campo (N1A)

Das aproximadamente 1.200 fazendas N0A, são selecionadas ≈ 240 para visita de campo (N1A), aplicando o critério da Tabela 26. O sorteio GRTS é executado sobre a lista de fazendas elegíveis (prioridade alta + média + baixa), ponderado pela prioridade, e com balanceamento por estrato K-Means — garantindo que todos os estratos tenham representação proporcional em N1A. O critério de ≥ 30% dos pontos N0B elegíveis equivale, em termos práticos, a exigir que pelo menos 30% da área de pastagem inspecionada visualmente em CBERS apresente evidências de degradação, o que é consistente com as definições das categorias D2 a D4 (Seção 3.2.10) e com os requisitos de comprovação das certificações ISCC e RSB.

Um filtro baseado exclusivamente em evidência de degradação produz, por construção, uma amostra enviesada: apenas propriedades já suspeitas são visitadas. Isso basta para estimar a prevalência de degradação, mas é insuficiente para avaliar a qualidade do próprio modelo preditivo, pois sem dados de campo em propriedades classificadas como íntegras não é possível calcular a taxa de falsos positivos nem a Especificidade (Seção 2.11). Reserva-se, portanto, uma **subamostra de controle** correspondente a 5% das unidades N1A — cerca de 12 propriedades —, sorteada por GRTS exclusivamente no pool inelegível (\(\hat p_i < 0{,}10\)). Essas propriedades recebem exatamente o mesmo protocolo de campo, sem qualquer hipótese prévia de degradação, e alimentam as células de Verdadeiro Negativo e Falso Positivo da matriz de confusão (Seção 3.2.11). O custo marginal é baixo frente ao ganho metodológico: sem esse controle, o sistema não pode ser validado quanto à sua taxa de alarmes falsos, lacuna crítica em auditoria de certificação.


#### 3.2.7.2 Seleção de Pontos de Campo dentro de cada Fazenda N1A

Dentro de cada propriedade N1A, os pontos de validação são sorteados por GRTS aninhado, tendo como base prioritária os pontos N0B já classificados como elegíveis naquela propriedade. Isso concentra as visitas em locais com pré-evidência de degradação, o que maximiza a taxa de confirmação e a eficiência logística. A Tabela 27 define o número de pontos e as restrições de espaçamento por faixa de área.

#### Tabela 27 - Critérios de seleção de pontos N1B por faixa de área de pastagem

| Área de pastagem (\(A_i\)) | Pontos N1B (\(n_i\)) | Base de seleção | Distância mínima entre pontos | Critério de posicionamento |
| --- | --- | --- | --- | --- |
| < 50 ha | 2 | GRTS nos pontos N0B elegíveis da fazenda | ≥ 50 m | Havendo menos de 2 pontos N0B elegíveis, complementar com novo sorteio GRTS na máscara de pastagem |
| 50-200 ha | 3 | GRTS nos pontos N0B elegíveis da fazenda | ≥ 75 m | Priorizar pontos N0B com maior evidência espectral de degradação (menor EVI2) |
| 200-500 ha | 4 | GRTS nos pontos N0B elegíveis da fazenda | ≥ 100 m | Estratificar por sub-área (ex.: proximidade ao cocho) quando a heterogeneidade for evidente |
| > 500 ha | 4 | GRTS nos pontos N0B elegíveis da fazenda |≥ 150 m ou setores separados | Teto logístico de 4 pontos por propriedade por dia; propriedades muito grandes podem ser divididas em setores |

Os pontos N1B são exportados como waypoints GPS (formato GPX) para os receptores de campo antes da mobilização, servindo como alvos de navegação. Cada ponto tem coordenadas com precisão posicional de ≤ 10 m no GPS de mão, suficiente para localizar o ponto sorteado em campo.

####  3.2.7.3 Protocolo de Campo — Janela Temporal e Equipes

A coleta de campo é concentrada no período de junho a outubro, com prioridade para julho–setembro (período de estiagem do Cerrado). Duas equipes de campo simultâneas, cada uma composta por: técnico líder (SR + avaliação de pastagens), técnico de campo (biomassa + solo) e motorista com veículo 4×4. Cada equipe cobre aproximadamente 3–5 fazendas por dia (1–2 fazendas com coleta extensiva N3/N4). A Tabela 28 lista os materiais por equipe.

#### Tabela 28 - Equipamentos e materiais por equipe de campo

| Categoria | Itens |
| --- | --- |
| GPS e navegação | GPS de mão (precisão < 3 m); receptor GNSS RTK para GCPs do drone; smartphone com ODK Collect / KoBoCollect |
| Avaliação da pastagem | Trena de 100 m (LPI); quadrados de amostragem (0,25 m² e 1,0 m²); tesoura de poda; sacos de papel kraft etiquetados; balança digital (precisão 1 g) |
| Solo | Trado holandês (0–30 cm); sacos plásticos Ziploc; etiquetas impermeáveis; balde de 5 L (composição); caixa isotérmica com gelo seco |
| Imageamento | Drone DJI Mavic 3 Multispectral ou equivalente; painel de calibração radiométrica; GCPs (alvos 50×50 cm); câmera georreferenciada |
| Segurança e logística | Colete refletivo; kit de primeiros socorros; veículo 4×4; comunicação via rádio ou satélite em áreas sem sinal |
| Documentação | Tablet resistente (IP67) com formulário digital em modo off-line; bateria externa; caderneta de campo impermeável como redundância analógica |

#### 3.2.7.4 Sistema de IDs e Rastreabilidade

A Tabela 29 apresenta a convenção adotada para identificação e rastreabilidade das amostras.

#### Tabela 29 - Sistema de identificação e rastreabilidade de amostras

| Entidade | Formato do identificador | Exemplo |
| --- | --- | --- |
| Propriedade (N0A) | `MC-[ESTRATO]-[SEQ6]` | `MC-E3-000142` — propriedade 142 do estrato 3 |
| Ponto de inspeção em imagem (N0B) | `[ID-PROPRIEDADE]-C[SEQ2]` | `MC-E3-000142-C01` |
| Ponto de campo (N1B) | `[ID-PROPRIEDADE]-P[SEQ2]` | `MC-E3-000142-P02` |
| Sítio de drone (N2) | `[ID-PONTO-CAMPO]-D` | `MC-E3-000142-P02-D` |
| Subponto de biomassa (N3) | `[ID-DRONE]-B[SEQ2]` | `MC-E3-000142-P02-D-B01` |
| Quadrado de biomassa | `[ID-SUBPONTO]-Q[SEQ2]` | `MC-E3-000142-P02-D-B01-Q03` |
| Amostra de solo (N4) | `[ID-DRONE]-S[PROFUNDIDADE]` | `MC-E3-000142-P02-D-S0-10` — camada 0-10 cm |

#### 3.2.7.5 Plataforma Digital de Coleta (ODK Collect / KoBoToolbox)

Todos os dados de campo são coletados em formulários digitais via ODK Collect (Android), operando em modo off-line. Vantagens para auditoria: timestamp automático e geolocalizado; campos obrigatórios (*) impedem envio incompleto; fotos são georeferenciadas via EXIF; dados sincronizados diretamente ao servidor LAPIG. O formulário exibe automaticamente o ID do ponto N1B, as coordenadas do target e os valores N0B da inspeção CBERS daquele ponto (EVI2, % solo exposto, decisão N0B) — servindo como contexto para o técnico de campo.

#### 3.2.7.6 Roteiro Socioeconômico e de Manejo

Cada visita registra também o contexto de manejo que condiciona a interpretação do estado da pastagem, organizado em quatro blocos. O **contexto fundiário e de acesso** cobre o tipo de posse, o sistema de pastejo praticado (contínuo, rotativo, diferido ou transumante) e o estado atual do piquete (em pastejo ou em descanso). A **composição botânica e estrutura funcional** registra a espécie forrageira dominante, a proporção estimada de gramíneas, leguminosas e componente lenhoso, a identificação de espécies invasoras e o estágio fenológico predominante. O **histórico de manejo** documenta a última intervenção realizada — reforma, queima prescrita, roçagem mecânica ou nenhuma —, além de adubação, calagem e irrigação. A **pressão pecuária** registra categoria e número de animais no piquete, tamanho estimado do piquete e a avaliação visual da pressão de pastejo. Esse conjunto é o que permite distinguir, na análise posterior, degradação estrutural de efeitos transitórios de manejo.

#### 3.2.7.7 Sistema de Escores Visuais (0–10) e Método LPI

O escore visual integra cinco atributos (cobertura por forragem; solo exposto; invasoras; altura e uniformidade do dossel; sinais de compactação/erosão), cada um com peso de 0–2, totalizando até 10. A avaliação é feita por dois observadores independentes; discrepâncias > 1,5 ponto são dirimidas pelo Método LPI (Tabela 30).

#### Tabela 30 - Sistema de escores visuais para avaliação de pastagens em campo (adaptado de Teles et al., 2025)

| Escore | Categoria | Solo exposto | Invasoras | Vigor (EVI2) | Classe | Indicação de manejo |
| --- | --- | --- | --- | --- | --- | --- |
| 9-10 | Excelente | < 5% | Ausente | > 0,55 | D0 | Manutenção |
| 7-8 | Bom | 5-10% | Raro | 0,40-0,55 | D0-D1 | Monitorar |
| 5-6 | Regular | 10-20% | Moderado | 0,25-0,40 | D1-D2 | Ajuste de carga e fertilização |
| 3-4 | Degradação incipiente | 20-40% | Alto | 0,10-0,25 | D2-D3 | Recuperação parcial (overseeding, calagem) |
| 1-2 | Degradação severa | > 40% | Dominante | < 0,10 | D3-D4 | Reforma completa ou integração lavoura-pecuária |
| 0 | Solo degradado / erosão ativa | > 60% | Solo nu | Nulo | D4 | Recuperação de área degradada e controle de erosão |

O escore bruto assim obtido está sujeito ao mesmo viés sazonal discutido na Seção 2.13 e é convertido em escore corrigido pela Eq. 15, com os valores de \(\Delta s\) da Tabela 31. O escore corrigido é o valor utilizado em todos os critérios de seleção dos níveis subsequentes, nas análises de calibração e nos relatórios de certificação; o escore bruto, o \(\Delta s\) aplicado e o mês da visita são sempre preservados no banco de dados como dado primário, o que garante rastreabilidade e permite reanálise futura com fatores recalibrados.

#### Tabela 31 - Fator de ajuste sazonal do escore de campo (\(\Delta s\)), referência jun-set

| Mês da visita | Estação | \(\Delta s\) | Confiança na avaliação visual | Justificativa e cuidados |
| --- | --- | --- | --- | --- |
| Jan-Fev | Chuvosa intensa | –2,0 | Baixa | Rebrote pleno: cobertura verde alta mesmo em áreas degradadas. LPI obrigatório e fotografias nadir essenciais; considerar reagendamento |
| Mar | Chuvosa tardia | –1,5 | Baixa-Média | Senescência incipiente nas gramíneas mais degradadas; ainda há mascaramento |
| Abr-Mai | Transição | –1,0 | Média | Visita aceitável; solo começando a ficar visível. Anotar altura média do dossel |
| Jun-Set | Seca (referência) | 0 | Alta | Período ideal: solo exposto máximo, invasoras visíveis, vigor mínimo. Sem correção |
| Out-Nov | Transição | –0,5 | Média-Alta | Primeiras chuvas; correção pequena. Anotar chuvas recentes (< 5 dias) |
| Dez | Chuvosa inicial | –1,5 | Baixa | Rebrote inicial. Evitar; se inevitável, registrar a precipitação dos 10 dias anteriores |

Acumulados 20 ou mais pares de visitas ao mesmo ponto em épocas distintas — produto esperado dos ciclos anuais de monitoramento —, os valores de \(\Delta s\) podem ser recalibrados empiricamente para a região, substituindo os valores de referência desta tabela.

### 3.2.8 - Nível N2 - Sobrevoo de Drone
#### 3.2.8.1 Critério de Seleção dos Sítios N2

Cerca de 80 sítios de voo são selecionados por GRTS entre os pontos N1B já visitados e validados, com estratificação pelo escore corrigido de campo. A seleção é estratificada pelo escore de campo (0–10) para garantir que o conjunto de sítios N2 cubra toda a amplitude do gradiente de degradação — de pastagens severamente degradadas (escore 0–2) a pastagens regulares (5–6), evitando o viés de amostrar apenas os casos extremos. A Tabela 32 define a proporcionalidade por faixa de escore.

#### Tabela 32 - Critério de seleção e proporcionalidade dos sítios N2 por classe de escore de campo

| Escore de campo (ponto N1B) | Classe de degradação | Elegibilidade para N2 | Proporção N2/N1B por estrato | Justificativa |
| --- | --- | --- | --- | --- |
| 0-2 (degradação severa) | D3-D4 | Alta prioridade | ~35% dos pontos N1B nessa faixa | Calibração dos índices espectrais nos extremos; maior variabilidade de resposta orbital |
| 3-4 (degradação incipiente) | D2-D3 | Prioridade média | ~40% dos pontos N1B nessa faixa | Faixa de maior incerteza classificatória; o drone permite desambiguar D2 de D3 |
| 5-6 (regular) | D1-D2 | Prioridade baixa (reserva) | ~25% dos pontos N1B nessa faixa | Incluídos como pontos de referência para calibração no gradiente moderado de degradação |
| 7-10 (bom a excelente) | D0-D1 | GRUPO CONTROLE(~10% de N2, via GRTS) | ~8 sítios de controle(de um total de ~80 N2) | Pastagens classificadas como não degradadas pelo modelo de gabinete. Sua inclusão é essencial para calcular a Especificidade (Taxa de Verdadeiros Negativos) e detectar Falsos Positivos do modelo preditivo. Sem esse controle, a acurácia do modelo é impossível de verificar adequadamente |

A cobertura espacial dos ≈ 80 sítios de drone (footprint médio de 150 × 150 m ≈ 2,25 ha por sítio) totaliza cerca de 180 ha de imageamento de altíssima resolução (GSD ≤ 5 cm), distribuídos proporcionalmente pelos 6–8 estratos K-Means. Esse volume é suficiente para calibrar os índices espectrais do Sentinel-2 (pixel de 100 m²) e do CBERS (pixel de 4 m²) em toda a extensão do gradiente de degradação da região piloto.

#### 3.2.8.1.1 Sítios de Controle em N2 — Cálculo da Especificidade do Modelo

A exclusão das pastagens de escore alto da seleção principal é metodologicamente justificada — concentra o imageamento onde há variabilidade a calibrar —, mas introduz exatamente o mesmo viés discutido em 3.2.7: o modelo nunca seria testado sobre pastagens que ele próprio classificou como saudáveis, e um eventual excesso de falsos positivos permaneceria invisível. Por isso, cerca de 8 sítios de controle são sorteados por GRTS exclusivamente entre pontos N1B com escore corrigido igual ou superior a 7, recebendo o mesmo protocolo de voo e, quando selecionados, também coleta de biomassa e solo.


#### 3.2.8.2 Protocolo de Voo

O protocolo de voo é padronizado nos seguintes parâmetros: altura de aproximadamente 50 m acima do nível do solo; câmera em posição nadir, com o eixo óptico perpendicular ao terreno; área de cobertura de 100 × 100 m em pastagens homogêneas, 150 × 150 m em pastagens semi-heterogêneas e 250 × 250 m em sistemas silvipastoris; sensores RGB e multiespectral com resolução no solo igual ou inferior a 5 cm; sobreposição frontal de ao menos 80% e lateral de ao menos 70%; e no mínimo 4 alvos de controle no solo com coordenadas RTK de precisão centimétrica, distribuídos nos vértices e no centro da área imageada.

A posição nadir é obrigatória e não é uma preferência operacional: ângulos oblíquos introduzem sombreamento, variação de BRDF e erros de projeção que comprometem simultaneamente a acurácia geométrica do ortomosaico e a integridade radiométrica dos índices extraídos. Voos oblíquos são admitidos apenas como missão complementar de reconhecimento tridimensional, nunca como missão principal de sensoriamento remoto quantitativo. Os produtos gerados — ortomosaico, modelo digital do terreno, modelo digital de superfície e índices de vegetação por parcela — constituem a ponte de escala entre a parcela de campo, da ordem de 1 m², e o pixel Sentinel-2, de 100 m². O detalhamento operacional do voo consta do Apêndice B.

### 3.2.9 - Níveis N3 e N4 - Coleta de Biomassa e Solo

#### 3.2.9.1 Seleção de Subpontos e Coleta de Biomassa 

Dentro de cada sítio de drone N2 selecionado para coleta de biomassa (≈ 40 sítios = 50% de N2), o posicionamento dos subpontos de amostragem não é arbitrário: é executado via GRTS sobre a grade de pixels de 10 m do footprint do drone, respeitando um buffer de borda de 10 m e distância mínima entre subpontos conforme o tamanho do footprint. A estratificação interna é feita com base nos valores de NDVI do ortomosaico de drone (zona de maior NDVI vs. zona de menor NDVI dentro do sítio), garantindo que os subpontos cubram a heterogeneidade de vigor detectada no drone.

#### Tabela 33 - Grade de subpontos N3 por tamanho de *footprint* de drone

| *Footprint* e gatilho de enquadramento | Subpontos N3 por sítio | Quadrados por subponto | Método deposicionamento | Total por sítio |
| --- | --- | --- | --- | --- |
| 100 × 100 m — pastagem homogênea (dossel ≤ 30 cm e CV de biomassa ≤ 25%) | 3 subpontos (±20 m espaçamento mínimo) | 3 quadrados de 0,5 m² | GRTS na grade 10 m do footprint; buffer borda 10 m |9 quadrados (4,5 m²) |
| 150 × 150 m — semi-heterogênea (dossel > 30 cm ou CV > 25% ou cobertura arbustiva de 10-30%) | 4 subpontos (±30 m espaçamento) | 5 quadrados 1,0 m²(usar 1,0 m² quando: pastagem com touceiras, vegetação nativa intercalada ou dossel > 30 cm — heterogeneidade exige área maior para representatividade) | GRTS na grade 10 m; estratificação por zona (EVI2 do drone) |20 quadrados (20 m²) |
| 250 × 250 m — heterogênea ou silvipastoril (cobertura lenhosa > 30% ou dossel > 60 cm ou campo nativo) | 5 subpontos (±40 m espaçamento) |5 quadrados 1,0 m² por subponto + 1 parcela lenhosa 100 m² | GRTS na grade 10 m; 1 parcela lenhosa por subponto | 25 quadrados (25 m²) + 5 parcelas lenhosas |

A escolha do tamanho do quadrado segue o princípio metrológico discutido na Seção 2.14: conforme a Tabela 34, além do Método LPI no transecto de 100 m passando pelo subponto central.

#### Tabela 34 - Protocolo de amostragem de biomassa por tipo de pastagem

| Tipo de pastagem | Quadrado | Altura de corte | Repetições mínimas por subponto | Pós-coleta |
| --- | --- | --- | --- | --- |
| Pastagem cultivada (homogênea) | 0,25 m² | 1-2 cm acima do solo | 5 quadrados/subponto | Pesagem do peso fresco e sub-amostra de ~300 g para matéria seca e bromatologia |
| Pastagem natural (heterogênea) | 1,0 m² | 1-2 cm acima do solo | 10 quadrados/subponto | Pesagem do peso fresco e separação morfológica (folha, haste, material morto) |
| Sistema silvipastoril | 0,25 m² (herbáceo) + parcela de 10 × 10 m (lenhoso) | Conforme a espécie | 5 herbáceos + censo lenhoso por parcela | Diâmetro à altura do peito, altura total e espécie; aplicação de equações alométricas |

#### 3.2.9.1.1 Procedimento padronizado por subponto N3 

O procedimento padronizado por subponto compreende: registro das coordenadas antes do início; medição da altura do dossel em 5 a 10 pontos com régua ou prato nivelador; corte da biomassa acima da altura especificada, com exclusão da serapilheira; pesagem imediata do peso fresco em balança digital; homogeneização dos quadrados do subponto e separação de cerca de 300 g para determinação de matéria seca, separação morfológica e análise bromatológica; e etiquetagem, acondicionamento refrigerado e entrega ao laboratório em até 48 horas. O método LPI é aplicado em transecto de 100 m passando pelo subponto central, conforme a Seção 2.14.

#### 3.2.9.2 Seleção de Subpontos para Coleta de Solo 

Em cerca de 40% dos sítios com coleta de biomassa, a amostragem de solo é aninhada nos subpontos N3 por amostragem aleatória simples sem reposição, com mínimo de um subponto por sítio. Sítios com 3 subpontos N3 fornecem 1 a 2 subpontos de solo; sítios com 5 subpontos fornecem 2 a 3.

#### 3.2.9.2.1 Procedimento padronizado por subponto N4 — Coleta por Camadas 

A coleta é feita por camadas — 0-10 cm, 10-20 cm e 20-30 cm —, com 5 a 8 subamostras por camada em raio de 3 m, acondicionadas separadamente e identificadas com o código de profundidade da Tabela 29. Havendo cálculo de estoque de carbono, coleta-se adicionalmente amostra indeformada com anel volumétrico em cada camada, registrando volume, massa úmida, massa seca e umidade gravimétrica. O controle de contaminação prevê limpeza do trado entre camadas e subpontos, uso de luvas, descarte do material de borda e registro de duplicata de campo em pelo menos 5% das amostras ou uma duplicata por dia de coleta. As subamostras de cada camada são homogeneizadas separadamente, secas ao ar à sombra e enviadas ao laboratório em até 5 dias, acompanhadas de ficha de cadeia de custódia. As análises mínimas por camada são textura, pH, matéria orgânica, carbono total e nitrogênio total; na camada superficial acrescentam-se os atributos de fertilidade e a densidade aparente.

Uma ressalva de suficiência amostral deve ser explicitada. Os 15 a 20 sítios N4 são suficientes para a caracterização descritiva e para a auditoria mínima exigida pelas certificações da Tabela 20. Não são, contudo, suficientes para a construção de modelos robustos de interpolação geoestatística do carbono orgânico do solo, que requerem variograma estável e validação cruzada confiável — a literatura recomenda tipicamente de 50 a 100 pontos de treinamento distribuídos ao longo da variabilidade espacial de interesse. Os sítios N4 devem, portanto, ser tratados como **base de calibração primária**, a ser complementada em fases posteriores por coletas de baixo custo caso a modelagem espacial de carbono venha a ser um entregável do projeto.

#### 3.2.9.3 Protocolo Fotográfico

O registro fotográfico segue dois padrões complementares. A **fotografia nadir**, tomada com câmera georreferenciada a 1,5 m de altura sobre o quadrado, antes e depois da coleta, permite estimar por análise digital a cobertura fracional e as proporções de vegetação fotossintética, não-fotossintética e solo exposto. As **fotografias panorâmicas**, tomadas nas quatro direções cardeais a partir do centro do subponto, documentam o contexto da paisagem. Em ambos os casos são obrigatórios os metadados de identificador, data e hora, coordenadas e observador.

### 3.2.10 - Classificação Integrada da Condição das Pastagens
#### 3.2.10.1 - Categorias de Degradação D0 - D4

Com base na metodologia LAPIG/UFG (Teles et al., 2025, base metodológica LAPIG/UFG a documentar), as pastagens são classificadas em cinco categorias (D0 a D4), obtidas pela integração dos escores visuais de campo, frações PV/NPV/BS (LPI), índices espectrais (EVI2, NDTI de imagens Sentinel-2/CBERS) e análises laboratoriais de biomassa e solo (Tabela 35).

#### Tabela 35 - Categorias de degradação de pastagens (D0-D4), adaptado de Teles et al. (2025)

| Categoria | Denominação | Solo exposto + invasoras | EVI2 médio (estação seca) | Indicador agronômico / biológico |
| --- | --- | --- | --- | --- |
| D0 | Sem degradação | < 5% | > 0,50 | Forragem vigorosa; composição desejada > 95% |
| D1 | Indícios leves (agronômica) | 5-15% | 0,35-0,50 | Início de invasão por plantas indesejadas; vigor reduzido, recuperável com adubação |
| D2 | Degradação moderada (agronômica) | 15-30% | 0,20-0,35 | Invasoras ocupam 15-30% da área; reforma parcial ou sobressemeadura necessárias |
| D3 | Degradação severa (biológica incipiente) | 30-50% | 0,10-0,20 | Compactação superficial e erosão laminar visíveis; solo empobrecido; reforma completa |
| D4 | Degradação severa (biológica avançada) | > 50% | < 0,10 | Erosão em sulcos e voçorocas; solo nu dominante; perda do banco de sementes |

#### 3.2.10.2 - Matriz de decisão Integrada para Elegibilidade

Para fins de certificação (ISCC, RSB, RED III), uma propriedade é classificada como **área de pastagem degradada elegível para plantio de Macaúba** quando apresenta confluência de pelo menos **dois** dos quatro critérios independentes a seguir:

1. Escore corrigido médio de campo igual ou inferior a 4 (categoria D2 ou superior) em pelo menos 50% dos pontos N1B visitados;
2. EVI2 médio da estação seca inferior a 0,25 em pelo menos 30% da área de pastagem da propriedade;
3. Fração de solo exposto medida por LPI igual ou superior a 15% em pelo menos um ponto N1B;
4. Tendência negativa significativa de vigor (Mann-Kendall, *p* < 0,05) no período de 2019-2025.

#### 3.2.10.3 - Calibração dos Modelos de Sensoriamento Remoto

Os dados coletados retroalimentam diretamente a calibração dos modelos orbitais em três direções. As frações de cobertura medidas por LPI nos subpontos N3 são correlacionadas com o índice espectral de solo exposto do pixel Sentinel-2 correspondente, ajustando os limiares de classificação. A biomassa seca por hectare valida as estimativas mensais de matéria seca empregadas na estratificação (Tabela 21) e nas análises de produtividade (Seção 3.1.9). As análises de carbono total do nível N4 alimentam a interpolação geoestatística dos mapas de carbono orgânico do solo, com a ressalva de suficiência amostral registrada em 3.2.9.

#### 3.2.10.4 - Matriz de confusão e métricas de acurácia do sistema de classificação

A acurácia do sistema hierárquico de classificação de pastagens — que integra inspeção visual de imagens (N0B), avaliação de campo (N1B) e imageamento de drone (N2) — é avaliada pela comparação entre a predição do modelo de gabinete (baseada em índices de SR) e a verdade de campo (ground truth, obtida nos níveis N1B e N2). Para que essa avaliação seja válida e não enviesada, é imprescindível que a amostra de validação inclua tanto áreas positivas (degradadas) quanto áreas negativas (não degradadas) — o que justifica as subamostras de controle descritas nas XXX . A Tabela 36 apresenta a estrutura da matriz de confusão binária (degradada vs. não degradada) que será calculada ao final das campanhas de campo, com as métricas derivadas e as metas de desempenho estabelecidas para este projeto. 

#### Tabela 36 - Matriz de confusão e métricas de acurácia do sistema de classificação (modelo de gabinete × verdade de campo).

| | Campo confirma degradada (D1-D4) | Campo confirma não degradada (D0) | Métrica derivada |
| --- | --- | --- | --- |
| **Gabinete prediz degradada** | **VP** — Verdadeiro Positivo. Fonte: unidades N1A e N2 da amostra principal | **FP** — Falso Positivo. Fonte: unidades sinalizadas pelo gabinete e refutadas em campo | Precisão (VPP) = VP / (VP + FP) |
| **Gabinete prediz não degradada** | **FN** — Falso Negativo. Fonte: subamostra de controle sorteada no pool inelegível | **VN** — Verdadeiro Negativo. Fonte: subamostra de controle N1A e sítios N2 de controle | Valor preditivo negativo = VN / (VN + FN) |
| **Métrica derivada** | Sensibilidade = VP / (VP + FN). Meta: ≥ 90% | Especificidade = VN / (VN + FP). Meta: ≥ 80% | Acurácia global = (VP + VN) / total. Meta: ≥ 85% |

A interpretação das métricas deve considerar o contexto de aplicação. A Sensibilidade é crítica porque um falso negativo — propriedade degradada não detectada — representa perda de área elegível e, no limite, risco regulatório. A Especificidade mede a capacidade de não alarmar em pastagens saudáveis e só é calculável com a subamostra de controle. As metas adotadas são Sensibilidade de ao menos 90%, Especificidade de ao menos 80% e acurácia global de ao menos 85%. Caso não sejam atingidas na campanha piloto, os limiares dos índices espectrais e os critérios de elegibilidade N0B e N1A são revisados antes da campanha plena — ciclo de calibração análogo ao já empregado na validação da classificação automática de uso e cobertura da terra (Seção 2.3).

Uma limitação deve ser declarada explicitamente: como o campo visita apenas cerca de 20% das propriedades N0A, a taxa de falsos negativos no universo completo não é diretamente calculável. Ela é estimada por reamostragem *bootstrap* a partir da proporção de degradação observada nos pontos N0B das propriedades classificadas como inelegíveis e visitadas como controle.

### 3.2.11 - Gestão de Dados e Controle de Qualidade
#### 3.2.11.1 - Fluxo de dados

O fluxo de dados percorre quatro etapas encadeadas: coleta digital off-line em campo; sincronização ao servidor institucional; processamento automatizado em rotinas versionadas; e carga em banco de dados geoespacial, do qual derivam os painéis de acompanhamento. Cada etapa é documentada com o resumo criptográfico (*hash*) dos arquivos, o que permite verificar a integridade dos dados em qualquer ponto da cadeia e detectar alterações não registradas.

#### 3.2.11.2 - Controle da Qualidade por Nível

O controle de qualidade é aplicado nível a nível, com limiares de aceitação e ações corretivas predefinidas, conforme a Tabela 37.

#### Tabela 37 - Métricas de QA/QC, limiares de aceitação e ações corretivas

| Nível | Métrica | Limiar de aceitação | Ação corretiva |
| --- | --- | --- | --- |
| N0B | Kappa de Cohen inter-observador (20% dos pontos em dupla) | \(\kappa \geq 0{,}75\) | Retreinar analistas; sessão de calibração com casos divergentes |
| N0B | Taxa de concordância bruta | ≥ 85% | Revisão dos critérios de elegibilidade com o supervisor |
| N1B | Discrepância entre observadores no escore 0-10 | ≤ 1,5 ponto | Dirimir por medição LPI |
| N1B | Precisão das coordenadas registradas | < 5 m (CEP95) | Recoletar o ponto; usar receptor diferencial se necessário |
| N2 | Resolução no solo (GSD) | ≤ 5 cm/pixel | Refazer o voo em altitude menor; verificar o sensor |
| N2 | Sobreposição frontal / lateral | ≥ 75% / ≥ 65% | Ajustar o plano de voo e reexecutar |
| N3 | Coeficiente de variação entre quadrados do subponto | CV ≤ 30% | Aumentar o número de quadrados; registrar a heterogeneidade observada |
| N4 | Integridade da amostra composta | ≥ 5 subamostras por camada, sem contaminação | Recoletar a amostra |
| Geral | Preenchimento do formulário digital | 100% dos campos obrigatórios | Alerta automático; envio bloqueado até o preenchimento completo |

#### 3.2.11.3 - Armazenamento, Backup e Acesso

1. **Servidor primário:** Banco PostgreSQL/PostGIS no servidor LAPIG (backup automático diário).
2. **Backup remoto:** Google Drive institucional com versionamento automático a cada sincronização ODK.
3. **Acesso ACELEN:** Dashboards em tempo real via LAPIG WebGIS; exportação em shapefile e CSV sob demanda.
4. **Retenção:** Dados brutos e processados retidos por mínimo de 10 anos (requisito RED III Art. 29).


### 3.2.12 - Cronograma de execução

O cronograma de execução do plano de campo é organizada em cinco fases encadeadas. A Tabela 38 apresenta o sequenciamento tomando como referência a campanha da área piloto.

#### Tabela 38 - Cronograma de execução por fase

| Fase | Atividade principal | Período de referência | Responsável |
| --- | --- | --- | --- |
| 1 — Pré-processamento | Filtragem do quadro amostral; K-Means; dimensionamento por Cochran/Neyman; sorteio GRTS N0A; geração da grade de pontos N0B | Jul-Ago 2026 | Equipes de sensoriamento remoto e estatística |
| 2 — Triagem em gabinete (N0B) | Co-registro das imagens; inspeção visual dos pontos N0B; QA/QC por Kappa; priorização das propriedades para N1A | Ago-Out 2026 | 4 analistas + 1 supervisor |
| 3 — Campo I (piloto) | Visita a cerca de metade das propriedades N1A; pontos N1B; escores; LPI; caracterização socioeconômica | Ago-Set 2026 | 2 equipes de campo |
| 3 — Campo II (pleno) | Visitas restantes; sobrevoos N2; biomassa N3; solo N4 | Set-Nov 2026 | 2 equipes + piloto de drone certificado |
| 4 — Laboratório | Análise bromatológica e química de solo; processamento dos mosaicos de drone; extração de índices; integração ao banco de dados | Out-Dez 2026 | Laboratório parceiro + equipe de sensoriamento remoto |
| 5 — Análise e relatório | Integração dos dados; calibração dos modelos; estimativas de carbono; relatório final | Nov 2026-Fev 2027 | Equipe do projeto |

O período de campo coincide com a transição da estação seca para a chuvosa, o que impõe uma condição logística: a programação das rotas deve prever alternativa de saída em caso de chuvas antecipadas, sob pena de perda de acesso a propriedades já mobilizadas.

## Apêndice A - Formulário Digital de Inspeção Visual (Nível N0B)

O formulário é implementado como perfil de coleta digital e preenchido pelo analista durante a inspeção descrita em 3.2.6. Campos assinalados com asterisco são obrigatórios: o aplicativo bloqueia o envio enquanto houver campo obrigatório vazio, o que garante que nenhuma decisão de elegibilidade seja registrada sem a evidência que a sustenta.

### Tabela 39 - Campos do formulário digital de inspeção visual por ponto N0B

| Campo | Tipo de dado | Valores / critérios |
| --- | --- | --- |
| Identificador do ponto N0B | Alfanumérico (automático) | `MC-E[k]-[SEQ6]-C[SEQ2]` |
| Identificador da propriedade N0A | Alfanumérico | `MC-E[k]-[SEQ6]` |
| Analista responsável (*) | Texto | Nome completo |
| Data e hora de início da inspeção (*) | Registro temporal | Gerado automaticamente |
| Imagem utilizada e data de passagem (*) | Lista + data | CBERS-4A / CBERS-4B / Sentinel-2 / PlanetScope |
| Escala de visualização (*) | Lista | 1:5.000 / 1:10.000 / 1:20.000 — anotar a escala do julgamento final |
| Área de pastagem visível no ponto (*) | Sim / Não / Parcialmente | Se "Não", registrar o motivo (nuvem, sombra, mosaico incompleto) |
| Solo exposto estimado (*) | Lista | < 5% / 5-15% / 15-30% / 30-50% / > 50% |
| Sinais de invasoras ou arbustização (*) | Lista | Ausente / Raro (< 10%) / Moderado (10-30%) / Dominante (> 30%) |
| Sinais de erosão (sulcos, voçorocas) (*) | Sim / Não | Verificar padrão linear de solo exposto em relação ao relevo |
| Vigor vegetativo geral (*) | Lista | Alto (EVI2 > 0,40) / Médio (0,25-0,40) / Baixo (< 0,25) |
| Uso atual confirmado como pastagem (*) | Sim / Não / Incerto | Verificar ausência de padrão agrícola ou florestal |
| Mês da imagem inspecionada (*) | Lista | Insumo para os fatores de correção sazonal (Tabela 25) |
| Decisão de elegibilidade do ponto (*) | Lista | Elegível / Inelegível / Inconclusivo |
| Captura de tela (*) | Imagem | Evidência auditável da inspeção visual |
| Observações do analista | Texto livre | Qualquer observação relevante sobre a imagem ou o ponto |

## Apêndice B - Protocolo Operacional de Voo de Drone (Nível N2)

Complementa os parâmetros técnicos definidos em 3.2.8, detalhando a sequência operacional que assegura a repetibilidade radiométrica e geométrica entre sítios e entre campanhas.

**B.1 — Pré-voo.** Verificar avisos aeronáuticos e autorização de espaço aéreo com pelo menos 24 horas de antecedência; posicionar os alvos de controle no solo com receptor RTK e registrar suas coordenadas tridimensionais com precisão centimétrica; calibrar o painel radiométrico antes do primeiro voo do dia; configurar a missão autônoma com altura de 50 m acima do nível do solo, câmera nadir e sobreposições de 85% frontal e 75% lateral; verificar carga de bateria de ao menos 80%, memória livre de ao menos 16 GB e fixação de posição inferior a 5 m.

**B.2 — Durante o voo.** Iniciar com a captura do painel radiométrico em ambos os sensores; executar a missão em modo autônomo, mantendo a aeronave em linha de visada; registrar horários de início e término e as condições atmosféricas. Vento superior a 8 m/s ou ocorrência de chuva impõem aborto e reagendamento — não são condições de julgamento do operador, mas critérios objetivos de interrupção.

**B.3 — Pós-voo.** Capturar novamente o painel radiométrico, o que permite detectar deriva das condições de iluminação ao longo da missão; transferir as imagens para armazenamento externo em cópia dupla; processar o mosaico com os alvos de controle; exportar ortomosaico RGB e multiespectral, modelo digital do terreno, modelo digital de superfície e índices de vegetação; validar o erro quadrático médio do processamento e arquivar o relatório vinculado ao identificador do sítio, conforme a Tabela 29.
