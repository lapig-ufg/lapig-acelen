# 4. CONSIDERAÇÕES DE IMPLEMENTAÇÃO

Este capítulo reúne as condições práticas de operação dos dois componentes descritos no Capítulo 3: o *toolkit* de análise orbital (Seção 3.1) e a estratégia de amostragem em campo (Seção 3.2). São dois ambientes de execução distintos, com requisitos, dependências e limitações próprios.

## 4.1 - Toolkit de Análise Temporal

O toolkit versão 5.0 (Análise Temporal da Dinâmica de Cobertura e Uso da Terra) foi desenvolvido no ambiente do Google Earth Engine, a partir do Javascript, que é uma linguagem open source e gratuita. Para acessar o toolkit é necessária uma conexão à internet, um navegador compatível com o Google Earth Engine e uma conta da Google (Gmail).

É importante enfatizar que a qualidade e nível de informação acessíveis nesta versão do toolkit são função dos dados utilizados, i.e. Coleção 10.1 do Mapbiomas, cuja acurácia global está em torno de 93% e imagens da série Landsat, com resolução de 30 metros e cuja disponibilidade e qualidade dos dados variam entre os sensores Thematic Mapper (Landsat 5), ETM+ (Landsat 7) e OLI (Landsat 8 e 9). Da mesma forma, é importante reiterar que a velocidade de visualização e consulta aos dados depende da complexidade dos dados poligonais, da conexão ao Google Earth Engine e da própria capacidade de processamento da plataforma da Google.

Para ter acesso ao código fonte e a interface do toolkit desenvolvido, acesse os links do GitHub no endereço [https://github.com/lapig-ufg/lapig-acelen](https://github.com/lapig-ufg/lapig-acelen) e o do Google Earth Engine [https://code.earthengine.google.com/bfad226b58bbb70d9524c9b6f9bb7462](https://code.earthengine.google.com/bfad226b58bbb70d9524c9b6f9bb7462) respectivamente.

### 4.1.1 - Material de apoio à operação

Complementando esta documentação, um vídeo tutorial registra a operação do toolkit de ponta a ponta, com narração e demonstração em tela de todas as funcionalidades descritas na Seção 3.1. O material está disponível em vídeo_tutorial neste link [link-video](https://drive.google.com/file/d/1_GYqF-2kMnPF4Lnsrr97450Kq_Bqhhvy/view?usp=sharing). A base de entrada no vídeo tutorial é a Malha Fundiária Ambiental, desenvolvida pelo LAPIG/UFG e descrita, quanto à metodologia de construção, na Seção 2.8. Para as análises deste projeto, foi preparado um recorte específico, disponível no Google Earth Engine sob o identificador projects/ee-amazonas21/assets/Acelen/Datasets/propriedade_montes_claros_lapig. Esse recorte abrange os imóveis rurais privados com área igual ou superior a 2 hectares situados na Região Intermediária de Montes Claros, no trecho que faz interseção com o bioma Cerrado. É essa camada que delimita a unidade de análise do toolkit — a propriedade rural — e que constitui o quadro amostral da estratégia de verificação em campo, conforme a Seção 3.2.2.

## 4.2 - Estratégia de Amostragem em Campo

Diferentemente do *toolkit*, que roda integralmente na nuvem do Google Earth Engine e é acessado pelo navegador, a estratégia de amostragem descrita na Seção 3.2 se distribui por cinco ambientes computacionais distintos, articulados em uma cadeia que vai do sorteio estatístico em gabinete até o armazenamento auditável do dado de campo.

O detalhamento operacional completo da estratégia consta do [Plano Amostral LAPIG/ACELEN v6.0](https://drive.google.com/file/d/1iAWiSv4eULe4YCC-0zVxQXdN1Z6Qg4l-/view?usp=sharing), documento que originou a Seção 3.2 e que reúne o dimensionamento por área, os formulários de campo e os protocolos de coleta.

### 4.2.1 - Plataformas e ambientes computacionais

A Tabela 23 relaciona cada etapa do algoritmo de campo à plataforma que a executa e ao produto que dela resulta.

#### Tabela 23 - Plataformas empregadas na execução do algoritmo de campo

| Etapa (Seção 3.2) | Plataforma | Produto |
| --- | --- | --- |
| Estratificação e sorteio amostral (3.2.3 a 3.2.5) | R, pacote `spsurvey` | Arquivo vetorial das unidades sorteadas, com estrato, identificador e lista de substituição |
| Extração das variáveis de estratificação e das climatologias (3.2.2 e 3.2.6) | Google Earth Engine | Tabelas de covariáveis por propriedade; fatores de correção sazonal por pixel |
| Co-registro das imagens de alta resolução (3.2.5) | AROSICS (Python) | Cenas CBERS alinhadas ao Sentinel-2; relatório de RMSE por *tile* |
| Inspeção visual em gabinete (3.2.6) | QGIS ou LAPIG WebGIS, com ODK Collect | Classificação de cada ponto N0B e captura de tela como evidência |
| Coleta de campo (3.2.7 a 3.2.9) | ODK Collect (Android) ou KoBoToolbox | Registros georreferenciados, fotografias com metadados EXIF |
| Processamento das imagens de drone (3.2.8) | Agisoft Metashape ou OpenDroneMap | Ortomosaico GeoTIFF (EPSG:4674), MDT, MDS e índices de vegetação |
| Integração e análise (3.2.10 a 3.2.12) | Rotinas de Python e R sobre PostgreSQL/PostGIS | Banco consolidado, matriz de confusão, métricas de acurácia |
| Acompanhamento e entrega (3.2.12) | LAPIG WebGIS | Painéis em tempo real; exportação em *shapefile* e CSV |

Três características desse arranjo merecem registro. A primeira é que **nenhuma etapa depende de software proprietário de uso obrigatório**: R, QGIS, AROSICS, ODK Collect, KoBoToolbox, OpenDroneMap, PostgreSQL e PostGIS são de código aberto e gratuitos, e o Agisoft Metashape, único componente comercial da cadeia, tem alternativa aberta equivalente indicada na mesma linha da tabela. A segunda é que a coleta em campo opera **inteiramente off-line**, com sincronização posterior — condição necessária em propriedades rurais sem cobertura de dados móveis. A terceira é que a cadeia é **reprodutível**: as rotinas de sorteio e de processamento são versionadas, e cada arquivo transferido entre etapas carrega resumo criptográfico MD5, de modo que qualquer resultado pode ser refeito a partir dos dados brutos.

### 4.2.2 - Armazenamento, acesso e retenção

O repositório primário é o banco PostgreSQL/PostGIS hospedado no servidor do LAPIG/UFG, com rotina de backup diário e cópia remota em Google Drive institucional, versionada a cada sincronização do ODK. O acesso da Acelen Renováveis se dá por painéis do LAPIG WebGIS, com exportação sob demanda em *shapefile* e CSV.

Os dados brutos e processados são retidos por no mínimo dez anos. Esse prazo não é uma convenção interna: decorre do requisito de rastreabilidade do Artigo 29 da Diretiva RED III, discutido na Seção 3.2.1, e é o que permite que uma auditoria futura reconstitua a evidência que sustentou a classificação de uma área como degradada.

### 4.2.3 - Requisitos operacionais

A execução do plano de amostragem de campo impõe condições que não se aplicam ao *toolkit* e que precisam ser consideradas no planejamento:

- **Janela sazonal.** A aquisição de imagens e a coleta de campo concentram-se no período de estiagem (Seção 3.2.5 Tabela 06). Fora dessa janela, os índices exigem normalização sazonal e a confiança na avaliação visual diminui, além de o acesso rural se tornar incerto.
- **Equipe qualificada.** A triagem em gabinete requer analistas treinados em interpretação de imagens, submetidos a controle de concordância inter-observador. As campanhas de campo exigem equipes com formação em sensoriamento remoto e em avaliação de pastagens, além de piloto de drone certificado.
- **Autorização de voo.** Os sobrevoos dependem de consulta a NOTAM e de autorização de espaço aéreo junto ao DECEA, pelo sistema SARPAS, com antecedência mínima de 24 horas.
- **Autorização de acesso.** A visita a propriedades privadas depende de anuência do proprietário. A recusa é tratada como inelegibilidade e aciona o protocolo de substituição pela próxima unidade da lista GRTS.
- **Capacidade laboratorial.** As análises bromatológicas e de solo dependem de laboratório parceiro, com prazos de entrega que condicionam o cronograma da Tabela 21 na seção 3.2.12.

### 4.2.4 - Limitações reconhecidas

Assim como a qualidade do *toolkit* é função dos dados que o alimentam, o alcance do algoritmo de campo é limitado por quatro fatores que devem ser explicitados perante auditoria.

A **disponibilidade de imagens de alta resolução** condiciona a triagem: pontos sem cena adequada na janela de estiagem são classificados como inconclusivos e substituídos, o que reduz a cobertura efetiva em regiões de nebulosidade persistente.

A **suficiência amostral para modelagem de carbono do solo** é limitada. Conforme registrado na Seção 3.2.9, os sítios de coleta de solo bastam para a caracterização descritiva e para a auditoria mínima exigida pelas certificações, mas não para interpolação geoestatística robusta, que demandaria número consideravelmente maior de pontos.

A **taxa de falsos negativos no universo completo não é diretamente calculável**, já que apenas uma fração das propriedades triadas recebe visita. Ela é estimada por reamostragem, conforme a Seção 3.2.11, e essa estimativa carrega incerteza própria.

Os **fatores de correção sazonal são, inicialmente, valores de referência regionais**. Sua substituição por climatologias calculadas pixel a pixel, e a recalibração empírica do ajuste de escore de campo, dependem do acúmulo de observações ao longo dos ciclos de monitoramento — de modo que a precisão do sistema tende a melhorar entre campanhas sucessivas.

---

## 4.3 - Próximos Passos

O *toolkit* permanece em desenvolvimento ativo, em regime de **atualização constante até outubro de 2026**. Duas dessas atualizações incidem diretamente sobre os dados de entrada descritos neste documento e já têm prazo definido, conforme a Tabela 24.

#### Tabela 24 - Atualizações previstas do toolkit

| Prazo | Atualização | Seções afetadas |
| --- | --- | --- |
| Primeira quinzena de setembro de 2026 | Migração dos dados do MapBiomas da Coleção 10.1 para a **Coleção 11**, com série estendida até 2025 | 2.3, 3.1.4, 3.1.5 e 4.1 |
| Final de outubro de 2026 | Atualização dos dados de **biomassa** para o ano de 2026 para as áreas de interesse da ACELEN, com cobertura até outubro | 3.1.10 |

### 4.3.1 - Migração para a Coleção 11 do MapBiomas

Até a primeira quinzena de setembro de 2026, o LAPIG/UFG atualizará a base de cobertura e uso da terra da Coleção 10.1 para a **Coleção 11 do MapBiomas**, cuja série histórica se estende até 2025. A migração amplia em um ano o período analisável e incorpora as revisões metodológicas e os ganhos de acurácia introduzidos pela nova coleção.

O efeito se propaga por todos os produtos que derivam dessa base: a classificação de uso e cobertura, os gráficos de dinâmica e de conversão para uso antrópico, a evolução das áreas de pastagem e a máscara que delimita as áreas de vigor. As menções à coleção e ao período da série neste documento — em especial na Seção 4.1, onde consta a declaração de acurácia do dado de entrada — deverão ser revistas quando a migração for concluída.

### 4.3.2 - Atualização dos dados de biomassa

Até o final de outubro de 2026, os dados de biomassa serão atualizados para o ano de 2026, com cobertura até o mês de outubro. A atualização mantém a série mensal empregada na análise descrita na Seção 3.1.10 e permite que o diagnóstico de capacidade de suporte acompanhe o ciclo produtivo corrente, em vez de operar sobre o ano anterior.

### 4.3.3 - Regime de atualização

Até outubro de 2026, o *toolkit* segue em atualização constante, o que significa que correções, ajustes de desempenho e incorporação de novas versões dos dados de entrada ocorrem de forma contínua, sem necessidade de intervenção do usuário — as alterações ficam disponíveis na próxima sessão no Google Earth Engine.

Duas implicações decorrem desse regime. A primeira é de **reprodutibilidade**: análises executadas em datas distintas podem apresentar resultados diferentes se, entre elas, houver atualização da base de entrada. Recomenda-se, por isso, registrar a data de execução junto de qualquer resultado destinado a relatório ou auditoria. A segunda é **documental**: cada atualização relevante deve ser refletida neste ATBD e registrada no controle de versões da página inicial, de modo que a documentação e a ferramenta permaneçam correspondentes.
