# 2. BASE TEÓRICA DO ALGORITMO

As metodologias empregadas são baseadas em princípios de sensoriamento remoto, inteligência artificial, modelo linear e análise de séries temporais, incluindo: Uso de imagens de satélites com diferentes resoluções espaciais, uso de técnicas de aprendizagem de máquina e aprendizado profundo (DeepLearning) para classificação automática, aplicação de modelos lineares no cálculo da perda média do solo, cálculo de índices de vegetação e produtividade, e análises de tendência.

## 2.1 - Dados satelitários

Os dados de sensoriamento remoto a serem utilizados neste projeto incluem tanto imagens públicas e gratuitas, a exemplo daquelas adquiridas pelos sensores a bordo dos satélites Landsat e Sentinel, bem como imagens comerciais (ex. Planet Scope). No caso das imagens Landsat, estas serão obtidas dos satélites Landsat 5, 8 e 9, com resoluções espaciais de 30 metros, e resoluções espectrais de 8 e 11 bandas espectrais, respectivamente. A resolução espacial é a capacidade que o sensor a bordo de um satélite tem de detectar e separar um alvo de interesse na superfície terrestre; já a resolução espectral diz respeito à quantidade de “canais” (bandas) que o sensor tem para diferenciar, espectralmente, objetos na superfície terrestre. Os satélites da série Landsat fornecem informações sistemáticas desde 1985, sendo os seus dados ideais para análises baseadas em séries históricas, com vistas a se entender a dinâmica do uso e cobertura da terra em uma determinada região.

Em relação aos satélites Sentinel-2 (a, b, e c), estes oferecem uma resolução espacial máxima de 10 metros, permitindo um mapeamento significativamente mais detalhado (~ 0.1 hectare). Com suas 12 bandas de resolução espectral, o Sentinel-2 consegue diferenciar objetos com maior precisão em comparação aos sensores da série Landsat; contudo, os seus dados estão disponíveis apenas a partir de 2016, o que limita a análise de séries históricas mais longas.

Mais recentemente, com o avanço da Inteligência Artificial e tecnologias e desenvolvimentos associados, novas maneiras de acessar dados e informações de sensoriamento remoto, a exemplo dos Embeddings, se tornaram possíveis. Os Embeddings são uma forma de representação espaço-temporal altamente precisa e compacta, utilizada para mapear e monitorar objetos na superfície terrestre. Em essência, os embeddings são vetores que resumem grandes quantidades de informações geográficas complexas, incluindo dados de satélites (como o Sentinel-2), textos, vídeos e etc. Essa capacidade de integração de dados tem o potencial de tornar os mapeamentos baseados em embeddings mais eficientes e precisos (Brown et al., 2025).

As principais características dos embeddings são:

- Assimilação de contexto: Esse dados são capazes de avaliar a similaridade entre pixels a partir do seu contexto (vizinhança) no espaço e no tempo;
- Universalidade: Os embeddings são desenvolvidos com o objetivo de resolver problemas de mapeamento global, gerando um espaço de características gerais e universais;
- Sumarização compacta dos dados: Atuam como síntese temporal, descrevendo de forma compacta as propriedades da superfície terrestre e encapsulando informações que representam a trajetória temporal das variáveis (dados utilizados).

Especificamente, para a produção dos Alpha Earth Embeddings, a Google Deepmind utilizou diversas fontes para o treinamento do respectivo foundation model, com destaque para:

- Imagens dos satélites: das séries Landsat (8 e 9) e Sentinel (1 e 2);
- Dados geoespaciais: Dados de altimetria, climáticos, campo gravitacional, cobertura e uso da terra;
- Outras informações auxiliares: textos da Wikipedia e bases relacionadas à biodiversidade.

Estes embeddings anuais, disponibilizados a partir do ano 2017 por meio da plataforma Google Earth Engine, são compostos por 64 dimensões (bandas) com uma resolução espacial de 10 metros.

## 2.2 - Plataforma Google Earth Engine

O Google Earth Engine é uma plataforma para o processamento de dados geoespaciais em nuvem, em escala planetária, a qual traz enormes recursos computacionais da Google para lidar com uma variedade de questões de alto impacto, incluindo desmatamento, monitoramento climático e proteção ambiental. O catálogo de dados no Google Earth Engine abriga um grande repositório de dados geoespaciais que são disponíveis publicamente, incluindo, imagens de satélite, dados meteorológicos e climáticos, mapeamentos da cobertura e uso da terra (local e global), dados topográficos e socioeconômicos, que podem ser acessados de forma pública e gratuita (Gorelick et al., 2017).

Nesta plataforma, os usuários podem utilizar funções que vão desde a matemática simples até níveis avançados de classificação de imagens por meio de algoritmos de aprendizagem de máquina (Amani, 2020).

No trabalho de Souza et al. (2020) foi descrito uma nova abordagem de mapeamento anual da cobertura e uso da terra, a partir de 1985, para o Brasil, com base no algoritmo Random Forest aplicado às imagens da série Landsat usando a plataforma Google Earth Engine. Esta abordagem é a base da iniciativa MapBiomas, já em sua Coleção 10 de mapas.

Para acessar a plataforma do Google Earth Engine, basta ter uma conta do Google (gmail), e fazer o registro disponível no link: <https://earthengine.google.com/>.

## 2.3 - Classificação do Uso e Cobertura da Terra

As classificações de cobertura e uso da terra são geradas a partir de dados de sensoriamento remoto, por exemplo, satélites Landsat 5, 7 e 8, onde cada informação associada à cada elemento de imagem (pixel) é fundamentada no comportamento espectral dos diferentes alvos terrestres (vegetação, pastagem, água, etc). Este comportamento, relacionado à capacidade de cada objeto na superfície em em absorver e/ou refletir a radiação eletromagnética em seus vários comprimentos de onda e que varia sazonalmente, é base para a discriminação e classificação de objetos em qualquer algoritmo.

Em geral, para a classificação dos tipos de uso e cobertura da terra se utiliza algoritmos baseados em técnicas de aprendizado de máquina, aplicadas pixel à pixel, onde o algoritmo identifica padrões específicos, conforme os tipos de cobertura da Terra, através das diferenças espectrais (e temporais) associadas à cada objeto (i.e. classe de cobertura e/ou uso).

De acordo com Mitchell (1997), a aprendizagem de máquina está relacionada à construção de soluções computacionais que melhoram suas percepções automaticamente com a experiência (amostras). Isso significa que, ao inserir novos dados, esses sistemas computacionais são treinados para melhorar seu desempenho e precisão preditiva.

Conforme MapBiomas (2024), os mapas de cobertura e uso da terra disponíveis na plataforma do MapBiomas são elaboradas da seguinte forma:

- **Mosaico Anual - Landsat:** Para cada ano, todas as imagens landsat são selecionadas para o cálculo de índices espectrais e frações espectrais. Em seguida, são calculados as médias, máximos, mínimos, amplitude para cada pixel da imagem, resultando em 105 imagens no ano. Esse processo é repetido anualmente; se o período de tempo for de 1985 à 2024, essa operação será repetida 40 vezes.

- **Aplicação do Modelo de Aprendizagem de Máquina:** Após a geração dos mosaicos anuais, o algoritmo Random Forest (Breiman, 2001) é aplicado no processo de classificação, usando a infraestrutura de nuvem da Google. O algoritmo emprega amostras inspecionadas visualmente a partir das imagens de satélite para seu treinamento e teste. Nesta etapa, é realizada a análise da acurácia do algoritmo e, se a precisão for satisfatória, a classificação das imagens é executada.

- **Pós-processamento:** Esta etapa consiste na aplicação de filtros para remover ruídos gerados pela classificação das imagens durante o mapeamento da cobertura e uso do solo. O primeiro filtro aplicado é o espacial, que visa manter a consistência dos dados espaciais, eliminando pixels classificados de forma isolada ou em bordas de transição entre classes. Em seguida, para garantir a consistência temporal e reduzir mudanças de uso e cobertura que sejam impossíveis ou não permitidas (por exemplo, transições abruptas de "Floresta Natural" para "Não Floresta" e novamente para "Floresta Natural"), são aplicados filtros de consistência temporal.

- A validação do resultado final dos mapas gerados automáticamente é feita por meio da análise de acurácia, com base em pontos amostrais obtidos via interpretação visual das imagens utilizadas no processo de classificação.

## 2.4 - Vigor da Pastagem

O vigor da pastagem é uma medida que reflete o desenvolvimento da planta forrageira, auxiliando na avaliação da produtividade ou estágio de degradação das pastagens (Santos et al., 2022; Ferreira Jr et al., 2023). Sua medição é feita a partir de imagens do sensor MODIS a bordo do satélite Terra, com dados disponíveis desde o ano 2000.

Inicialmente os dados do índice de vegetação EVI passam por um preenchimento de dados faltantes (lacunas) ocasionado pela contaminação de nuvens e/ou sombras, através de um algoritmo de preenchimento dessas lacunas (i.e. gap filling). Em seguida é feito um ajuste sazonal (dessazonalização), removendo os efeitos sazonais dos valores das séries temporais, para evitar distorções na análise. Após a dessazonalização, são gerados imagens medianas anuais do conjunto de dados, cobrindo um período de 2000 à 2024. A mediana foi escolhida por ser uma medida estatística que minimiza a influência de valores anômalos (outliers) na análise.

A análise envolve a extração de pixels de EVI medianos anuais em áreas identificadas como pastagem nos mapas, os quais são submetidos à um filtro temporal mediano (5 anos), seguida de uma normalização. O processo de normalização consiste no cálculo dos valores de EVI máximo e mínimo, onde o valor máximo é a média do 1% dos valores mais altos de EVI e o valor mínimo, a média do 1% dos valores mais baixos de EVI, conforme a equação 01. O resultado da equação corresponde a valores entre 0 e 1.

$$
EVI{norm} = \frac{EVI{i}  - EVI{min}}{EVI{min}  - EVI{max}} \tag{Eq. 01}                                                        
$$

Onde:
<small>

* $EVI{\text{norm}}$: Valor do EVI normalizado entre 0 e 1

* $EVI{\text{i}}$: Valor do EVI da série temporal.

* $EVI{\text{min}}$: Valor médio de 1% dos máximos de todos os valores de EVI na série temporal.

* $EVI{\text{max}}$: Valor médio de 1% dos mínimos de todos os valores de EVI na série temporal.

</small>

Às imagens normalizadas são estratificadas em três níveis de vigor:

- Baixo Vigor: menor que 0,4;
- Médio Vigor: maior que 0,4 e menor que 0,6; e
- Alto Vigor: maior que 0,6

Todo o processo de geração de dados de vigor é feito em regiões com características ambientais similares.

## 2.5 - Produtividade Primária Bruta ( Gross Primary Productivity - GPP)

Conforme Aragão (2004), a Produtividade Primária Bruta (GPP) quantifica o C atmosférico convertido em matéria orgânica via fotossíntese. Isso nos permite não só verificar a quantidade de C fixado pelas pastagens, conforme diferentes níveis de vigor, mas também identificar ganhos e perdas de produtividade ao longo do tempo.

Os valores de GPP (Produtividade Primária Bruta) podem ser determinados pelo modelo que considera a Eficiência do Uso de Luz Absorvida (LUE - Light Use Efficiency), no qual a quantidade de energia absorvida da radiação solar visível disponível pelas plantas determina o carbono fixado por meio das atividades fotossintéticas (Monteith, 1972; Veloso, 2018; Su et al., 2022). Essencialmente, o cálculo do GPP é aplicado conforme a equação 02.

$$
GPP = PAR \times fAPAR \times LUE_{max} \tag{Eq. 02}                                                        
$$

Onde:
<small>

* $PAR$: Radiação fotossinteticamente

* $fPAR$: Fração da radiação fotossinteticamente

* $LUEmax$: Eficiência da Luz

</small>

Isik et al., 2024, no âmbito da iniciativa Global Pasture Watch, produziram um conjunto de dados de GPP com a resolução espacial de 30 metros bimestral nas áreas de pastagem globais no período de 2000 a 2024. Para calcular o GPP bimestral, foram utilizados um repositório Landsat reconstruído e disponível bimestralmente (Consoli et al.,2024), combinado com dados de temperatura do MODIS com 1 Km de resolução espacial e a Radiação Fotossinteticamente Ativa (PAR) do sensor CERES (a bordo da plataforma Terra), com resolução espacial aproximada de 100 km.

Neste projeto, teremos por referência as estratégias adotadas por Isik et al.(2024). Contudo, essas estratégias também serão adaptadas para os Landsat; da mesma forma, utilizaremos valores de LUE mais próximos à realidade das regiões de interesse.

## 2.6 - Equação Revisada Universal de Perda do Solo (RUSLE)

A Equação Universal de Perda do Solo Revisada (RUSLE) é um modelo matemático desenvolvido pelo Departamento da Agricultura dos Estados Unidos (USDA), com o intuito de estimar a erosão laminar do solo a partir de fatores como erodibilidade (precipitação), erosividade do solo, declividade, cobertura da terra e práticas de controle da erosão (Alebachew et. al, 2025). A implementação da RUSLE em ambiente cloud (processamento na nuvem), como o Google Earth Engine, utiliza dados de satélites de diversas resoluções espaciais para o cálculo preciso de seus fatores, por exemplo: [CHIRPS](https://www.chc.ucsb.edu/data/chirps) **(para Precipitação)**, [Textura do Solo](https://zenodo.org/records/2525817) (Tomislav, 2018), **Altimetria e Declividade** [(SRTM)](https://www.earthdata.nasa.gov/data/instruments/srtm), e o índice de vegetação [(NDVI)](https://ntrs.nasa.gov/api/citations/19750020419/downloads/19750020419.pdf) calculado a partir do do sensor OLI a bordo do satélite Landsat 8, com resoluções espaciais de 5.566, 250 e 30 metros, respectivamente.

Este modelo é uma versão revisada da USLE (Universal Soil Losses Equation) por Renard et. al (1997), descrita conforme a equação 03.

$$
A = R \times K \times LS \times C \times P \tag{Eq. 03}                                                        
$$

Onde :
<small>

* $A$: Perda média anual do solo.

* $R$: Fração da radiação fotossinteticamente.

* $K$: Fator de Erodibilidade, que quantifica o potencial de desprendimento de sedimentos causado pela chuva (CHIRPS) e pelo escoamento superficial.

* $LS$: Fator topográfico, que mede o impacto da inclinação e do comprimento da encosta na velocidade do escoamento superficial, a partir dos dados do SRTM.

* $C$: Fator de Manejo do Solo, que considera a influência da cobertura vegetal, por meio do NDVI.

* $P$: Eficiência da Luz.

</small>

Conforme Barbosa (2024), os cinco fatores da RUSLE são utilizados para determinar o potencial de erosão do solo, sendo que:

- Os fatores R, K e LS avaliam o potencial natural de erosão;
- Já os fatores C e P determinam a influência de ações antrópicas (ou seja, humanas) na erosão do solo.

A Rusle é aplicada em uma bacia hidrográfica, a qual, conforme a Política Nacional de Recursos Hídricos (Lei 9.433, de 08 de janeiro de 1997), é unidade territorial para o gerenciamento dos recursos hídricos, sendo que a água drenada nessas bacias deve ser gerenciada como um patrimônio público finito e com valor econômico.

A divisão do território brasileiro em bacias hidrográficas evoluiu com as crescentes necessidades de gestão da água. Em 1972, o Departamento Nacional de Águas e Energia Elétrica (DNAEE) estabeleceu a primeira proposta de divisão hidrográfica usando o método hierárquico de Otto Pfafstetter (baseado em áreas de drenagem) para otimizar a oferta e o processamento de dados. Já em 2003, conforme a resolução Federal nº32 do Conselho Nacional de Recursos Hídricos instituiu a Divisão Hidrográfica Nacional (DHN), com o objetivo de organizar o país em grandes 12 regiões hidrográficas. Essa divisão foi definida com base nos limites naturais das bacias e na semelhança das características ambientais, sociais e econômicas dos territórios vizinhos.

O cálculo da RUSLE no toolkit é aplicado nos níveis 1 à 3 da divisão do DHN e níveis 1 e 2 do DNAEE, onde os níveis 1 das bacias são mais amplas (generalizadas), enquanto os níveis 2 e 3 possuem um detalhamento maior.

## 2.7 - Análise de Tendência em Sensoriamento Remoto

O uso de imagens de satélites em séries temporais na medição de vigor e produtividade das pastagens estão correlacionados as metodologias da análise de tendência e/ou detecção de mudança do uso e cobertura da terra, que auxiliam na compreensão do seu processo de degradação (Souza, 2017). No estudo de Andrade (2014), foram identificadas áreas de pastagens potencialmente em processo de degradação, por meio dos valores (magnitude) da tendência da regressão linear (slope) ajustada, pixel a pixel, às imagens do sensor Terra MODIS.

O propósito de analisar tendências em séries temporais de imagens de satélite é importante para várias aplicações em larga escala e de longo prazo; por isso, é necessária a harmonização e o preenchimento de lacunas (buracos) nas imagens, causados por contaminação de nuvens e/ou sombras no pixel, a fim de garantir consistência espacial e ao longo do tempo na série temporal das imagens de satélite.

A Mediana Temporal de Janela móvel (Temporal Moving Window Median) é um método personalizado de preenchimento de lacunas (gap-filling) que foi desenvolvido e implementado para preencher valores ausentes (NoData). O algoritmo é projetado para ser computacionalmente rápido e adequado para preencher dados destinados ao mapeamento anuais em escala continental e multidecenal. Este método foi utilizado no contexto da criação do EcoDataCube para imputar dados ausentes na série temporal do Landsat (2000–2020), especificamente nos agregados trimestrais (Witjes,2023) .

A principal diferenciação do TMWM de outros modelos de gapfiling é que ele utiliza apenas valores existentes no conjunto de dados, como medianas de pixels vizinhos temporais. Isso garante que os valores imputados permaneçam no mesmo espaço de características no qual os modelos subsequentes de aprendizado de máquina serão treinados.

O TMWM tenta derivar um valor para pixels ausentes em três fases sequenciais. Em cada fase, o algoritmo segue uma lógica de expansão da janela de busca.

- **Mediana do mesmo período em diferentes anos:** O algoritmo tenta primeiro calcular a mediana do mesmo período (por exemplo, trimestre) nos anos adjacentes (anterior e/ou seguinte). Se não houver valores no ano anterior ou seguinte, a janela de busca se expande para incluir valores desse período em anos progressivamente anteriores e posteriores.

- **Média das medianas de períodos adjacentes:** caso a fase 1 falhar, o TMWM deriva o valor a partir de uma média das medianas do período anterior e seguinte do mesmo ano. Caso necessário, a janela de busca se expande novamente para incluir esses períodos anterior e seguinte em anos progressivamente adjacentes.

- **Mediana de todos os períodos:** se as fases anteriores falharem, a janela de busca abrange todos os valores em toda série temporal do pixel, e o valor imputado é a mediana desses valores.

Na opção de Análise de tendência das pastagem do toolkit, é feito a exclusão dos pixels contaminados por nuvens e/ou sombra utilizando a banda de qualidade, do satélite, seja Landsat ou Sentinel, e após a exclusão dos pixels contaminado, esse são preenchidos usando o Método TMWM (implementado no Google Earth Engine) e depois é calculado o coeficiente angular nas áreas de pastagem da propriedade inserida pelo usuário, no qual informa magnitude e a direção da mudança que ocorre ao longo do tempo. Quando o valor do coeficiente angular é positivo, indica uma tendência positiva, ou seja, um aumento no vigor ou na produtividade das pastagens, e os valores negativos, sugere que há um processo de queda do vigor da pastagem.
