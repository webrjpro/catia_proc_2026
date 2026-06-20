(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const store = {
    get(key, fallback) {
      try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* private mode */ }
    }
  };

  const DATA = {
    priorities: [
      ["Administrativo", "A+", 100], ["Processual Civil", "A+", 100],
      ["Constitucional", "A+", 96], ["Tributário / Financeiro", "A+", 96],
      ["Civil / Empresarial", "A", 82], ["Trabalho / Previdência", "A", 80]
    ],
    patterns: [
      ["01", "Caso antes do conceito", "Mesmo a questão doutrinária tende a desembocar em decisão, defesa, parecer ou providência."],
      ["02", "Fundamentação conectada", "Citar artigo sem demonstrar sua consequência no caso não completa o item pontuável."],
      ["03", "Visão institucional", "Interesse público primário, juridicidade, risco fiscal e execução prática aparecem juntos."],
      ["04", "Subitens visíveis", "Respostas divididas por controvérsia ajudam o examinador a localizar fundamento e conclusão."]
    ],
    exams: [
      { label: "15º concurso", year: "2007", title: "Fundação clássica", text: "Contratos, transporte concedido, modulação, ICMS, execução fiscal, previdência e trabalho.", tags: ["base dogmática", "lei e doutrina"] },
      { label: "16º concurso", year: "2009", title: "Controle e contracautela", text: "Equilíbrio, licitação, TCE, mandado de segurança, mutação constitucional e benefícios fiscais.", tags: ["controle", "via processual"] },
      { label: "17º concurso", year: "2012–13", title: "Interdisciplinaridade", text: "Regulação, patrimônio cultural, políticas públicas, arbitragem, recuperação e guerra fiscal.", tags: ["casos complexos", "aplicação"] },
      { label: "18º concurso", year: "2021", title: "Estado contemporâneo", text: "Desinvestimento, leniência, liberdade econômica, RRF, pandemia, precedentes e execução atípica.", tags: ["governança", "consequências"] }
    ],
    traps: [
      ["01", "Interesse público ilimitado", "Competência, forma, motivo, finalidade, proporcionalidade e procedimento continuam indispensáveis."],
      ["02", "Doutrina sem decisão", "Depois de explicar, aplique os fatos e indique a providência institucional."],
      ["03", "Competência invisível", "Cheque competência federativa, administrativa, judicial, controladora e de representação."],
      ["04", "Fazenda como litigante comum", "Tutelas, contracautela, precatórios, prazos e indisponibilidade alteram a estratégia."],
      ["05", "Regime temporal esquecido", "Identifique a lei, a data dos fatos e eventual transição normativa ou jurisprudencial."],
      ["06", "Conclusão neutra", "Escolha a tese mais defensável, explicite ressalvas e feche com orientação ou pedido."]
    ],
    disciplines: [
      {
        id: "administrativo", short: "Administrativo", name: "Direito Administrativo", priority: "A+",
        intro: "O núcleo consultivo da Procuradoria: contratação, regulação, patrimônio, estatais, controle e responsabilização sob juridicidade consequencialista.",
        centrality: "Presente nos quatro concursos e diretamente ligado à orientação de gestores, modelagem contratual e proteção de políticas públicas.",
        axes: [
          ["Contratos, concessões e equilíbrio", "Diferencie reajuste, repactuação, revisão, recomposição, fato do príncipe, fato da Administração e risco alocado. A resposta deve preservar simultaneamente continuidade, matriz de riscos e equação econômico-financeira."],
          ["Licitações, modelagem e controle", "Organize a análise por fase preparatória, motivação, orçamento, competição, julgamento e controle. O órgão de controle corrige ilegalidades, mas a substituição de escolha técnica legítima exige fundamento específico."],
          ["Regulação e serviços públicos", "Conecte tarifa, aporte, subsídio, universalização, modicidade, sanção, bens reversíveis e competência da agência. Identifique o espaço de decisão regulatória antes de discutir o mérito da escolha."],
          ["Estatais, desestatização e desinvestimento", "Distinga alienação de controle, privatização, participação minoritária, ativos e reorganização. Examine autorização legislativa quando cabível, governança, avaliação, impessoalidade e procedimento competitivo."],
          ["Poder de polícia e sanções", "Separe ordem, consentimento, fiscalização e sanção. Verifique base legal, delegação, devido processo, urgência, autoexecutoriedade, proporcionalidade e controle."],
          ["Bens públicos e patrimônio cultural", "Confronte uso privativo, ocupação, moradia, retomada, tombamento, acessibilidade e benfeitorias. Bem público não elimina direitos fundamentais, mas mantém regime de afetação e proteção."],
          ["Consensualidade, leniência e LINDB", "Acordos exigem competência, motivação, vantagens públicas demonstráveis, coordenação institucional e limites ao afastamento de sanções ou ressarcimento."],
          ["Responsabilidade civil do Estado", "Estruture conduta, dano, nexo, regime objetivo, excludentes, omissão, prescrição e ação regressiva. Evite converter garantia pública em assunção ilimitada de risco privado."]
        ],
        protocol: ["Defina o instituto e a competência.", "Fixe lei, contrato e regime temporal.", "Separe regra, exceção e procedimento.", "Avalie motivação, controle e consequências.", "Conclua com condicionantes e providências."],
        laws: ["CRFB, art. 37", "LINDB, arts. 20–30", "Lei 14.133/2021", "Lei 13.303/2016", "Lei 8.987/1995", "Lei 11.079/2004", "Lei 12.846/2013"],
        trap: "Invocar supremacia do interesse público sem demonstrar competência, procedimento, proporcionalidade e finalidade concreta."
      },
      {
        id: "processual", short: "Processual", name: "Direito Processual Civil", priority: "A+",
        intro: "A técnica de escolher a via, preservar a política pública e conduzir o litígio da tutela inicial ao pagamento constitucional.",
        centrality: "Aparece nos quatro concursos e converte qualquer tese material em estratégia contenciosa utilizável.",
        axes: [
          ["Fazenda Pública em juízo", "Revise prazos, intimação, remessa necessária, honorários, tutelas, cumprimento, precatório/RPV e negócios processuais. Sempre pergunte qual prerrogativa é aplicável ao ato concreto."],
          ["Mandado de segurança", "Diferencie autoridade coatora, pessoa jurídica interessada e representação judicial. Controle decadência, prova pré-constituída, liminar, recursos, suspensão e efeitos patrimoniais."],
          ["Tutelas e contracautela", "A suspensão não é sucedâneo recursal. Demonstre grave lesão institucional e articule-a com recurso, prova técnica e restrições legais às tutelas contra o Poder Público."],
          ["ACP, competência e coisa julgada", "Mapeie legitimidade, competência, conexão, tutela coletiva, limites subjetivos/objetivos e execução. Políticas públicas exigem prova da omissão e desenho judicial executável."],
          ["Execução e medidas atípicas", "Teste adequação, necessidade, contraditório, proporcionalidade e efetividade. Contra a Fazenda, preserve o regime constitucional de pagamento e a inalienabilidade dos bens."],
          ["Precedentes e arbitragem", "Diferencie persuasão, vinculação judicial, dever de fundamentação e hipóteses legais de invalidação da sentença arbitral. Não trate revisão judicial como recurso sobre o mérito."],
          ["Juizados da Fazenda", "Cheque valor, matéria, competência absoluta, sistema recursal e meios excepcionais de impugnação. Não transplante automaticamente o procedimento comum."]
        ],
        protocol: ["Escolha a via e o órgão competente.", "Fixe legitimidade, interesse e prazo.", "Ataque todos os fundamentos da decisão.", "Avalie recurso, tutela e contracautela.", "Formule pedido principal e subsidiários."],
        laws: ["CPC/2015", "Lei 12.016/2009", "Lei 7.347/1985", "Lei 8.437/1992", "Lei 9.494/1997", "Lei 6.830/1980", "Lei 12.153/2009"],
        trap: "Resolver o mérito antes de identificar competência, legitimidade, prazo, cabimento e efeitos da medida processual."
      },
      {
        id: "constitucional", short: "Constitucional", name: "Direito Constitucional", priority: "A+",
        intro: "Constituição aplicada à autonomia estadual: controle, federalismo, direitos fundamentais, orçamento e desenho institucional.",
        centrality: "Matriz de validade das políticas estaduais e argumento transversal de todas as provas analisadas.",
        axes: [
          ["Controle de constitucionalidade", "Identifique parâmetro, objeto, legitimidade, via, órgão, cautelar, mérito, efeitos e modulação. Diferencie representação estadual, ADI, ADPF, controle difuso e omissão."],
          ["Federalismo e competências", "Classifique competência privativa, concorrente, comum, suplementar e local. Só depois compare norma geral, peculiaridade regional e exercício administrativo."],
          ["Políticas públicas e controle judicial", "Articule mínimo existencial, reserva do possível comprovada, separação de Poderes, capacidade institucional, planejamento, igualdade e solução estrutural."],
          ["Direitos fundamentais e laicidade", "Evite absolutos. Use proporcionalidade, neutralidade estatal, igualdade, liberdade religiosa, proteção ambiental, moradia e direitos de comunidades vulneráveis."],
          ["Poder constituinte e transição", "Diferencie poder originário, reformador e decorrente; controle limites formais, materiais e circunstanciais; examine retroatividade e segurança jurídica."],
          ["Tribunais de Contas", "Qualifique o controle de juridicidade no caso concreto sem equipará-lo a controle concentrado. Verifique a jurisprudência vigente antes de afirmar extensão ou efeitos."],
          ["Orçamento e ordem econômica", "Conecte legalidade orçamentária, vedação de despesa, responsabilidade fiscal, livre iniciativa, atuação estatal e deveres sociais."]
        ],
        protocol: ["Defina parâmetro e objeto.", "Classifique competência e via de controle.", "Examine direitos e limites institucionais.", "Aplique proporcionalidade e precedentes.", "Conclua sobre validade, interpretação ou modulação."],
        laws: ["CRFB, arts. 1º e 5º", "CRFB, arts. 18–24", "CRFB, arts. 37 e 60", "CRFB, arts. 97 e 100", "CRFB, arts. 102–103", "CRFB, arts. 170–175", "CRFB, arts. 196 e 225"],
        trap: "Confundir competência legislativa com competência administrativa ou tratar direito fundamental como ordem judicial automática."
      },
      {
        id: "tributario", short: "Tributário", name: "Tributário e Financeiro", priority: "A+",
        intro: "Receita, crédito, benefícios e equilíbrio fiscal do Estado examinados da materialidade à cobrança.",
        centrality: "Presença constante e alta sensibilidade patrimonial: ICMS, execução fiscal, renúncia, RRF, imunidades e ITCMD.",
        axes: [
          ["ICMS: incidência e base", "Classifique operação, circulação jurídica, importação, energia, serviço e base. Separe desconto condicionado, substituição tributária, crédito e não cumulatividade."],
          ["Benefícios e guerra fiscal", "Examine legalidade, convênio quando exigido, isonomia, impacto, compensação, convalidação e restrições fiscais. Benefício por decreto é sinal de alerta, não resposta pronta."],
          ["Crédito tributário", "Organize fato gerador, lançamento, notificação, exigibilidade, suspensão, decadência, prescrição, responsabilidade e extinção. Cada etapa tem vícios e remédios próprios."],
          ["Execução fiscal e CDA", "Audite certeza, liquidez, requisitos, sujeito, fundamento e valor. A substituição tem limites e não deve alterar a essência do lançamento ou o sujeito passivo."],
          ["Imunidades", "Parta da finalidade constitucional e do vínculo com atividades essenciais. Não confunda imunidade, isenção, não incidência e alíquota zero."],
          ["ITCMD, exterior e RERCT", "Cheque fato, domicílio, localização, competência, reserva de lei complementar, legislação posterior e regime temporal. Atualização jurisprudencial é indispensável."],
          ["LRF, RRF e gasto tributário", "Trate renúncia e benefício como decisão orçamentária: impacto, compensação, transparência, metas e vedações reforçadas do regime fiscal."],
          ["ICMS x ISS e operações mistas", "Identifique obrigação predominante, materialidade, lista de serviços, mercadoria incorporada e competência. O rótulo contratual não decide a tributação."]
        ],
        protocol: ["Identifique materialidade e competência.", "Fixe sujeito, base e regime temporal.", "Separe constituição, exigibilidade e cobrança.", "Teste benefícios e restrições fiscais.", "Conclua por manter, revisar ou anular."],
        laws: ["CRFB, arts. 145–162", "CTN", "LC 24/1975", "LC 87/1996", "LC 101/2000", "Lei 6.830/1980", "Normas do RRF"],
        trap: "Misturar incidência, lançamento, decadência, exigibilidade, responsabilidade e execução em uma única conclusão."
      },
      {
        id: "civil", short: "Civil / Empresarial", name: "Civil e Empresarial", priority: "A",
        intro: "A infraestrutura patrimonial dos casos estatais: qualificação, contratos, responsabilidade, reais, sociedades e insolvência.",
        centrality: "Disciplina de suporte com presença nos quatro concursos e impacto direto em estatais, contratos privados e patrimônio público.",
        axes: [
          ["Prescrição e pretensão", "Defina a natureza da pretensão e o termo inicial antes do prazo. Diferencie obrigação, pretensão, decadência, prescrição e efeitos da interrupção."],
          ["Contratos e revisão", "Aplique interpretação, boa-fé, alocação de riscos, intervenção mínima e prova de fato extraordinário. Inflação ou pandemia não produzem revisão automática."],
          ["Responsabilidade civil", "Estruture ato, culpa quando exigida, dano, nexo, excludentes, quantificação e prevenção de enriquecimento sem causa."],
          ["Direitos reais e bens públicos", "Trabalhe posse, superfície, servidão, passagem, benfeitorias e usucapião. A natureza pública do bem altera aquisição, disponibilidade e remédios."],
          ["Sociedades e estatais", "Diferencie personalidade, patrimônio, capital, controle, governança e proteção de credores. O capital não se confunde com a garantia patrimonial efetiva."],
          ["Recuperação judicial", "Classifique crédito sujeito, extraconcursal, fiduciário, tributário e garantias; compatibilize preservação da empresa com regime legal específico."],
          ["Qualificação contratual", "A realidade econômica prevalece sobre o nome. Identifique prestações nucleares, riscos, disciplina aplicável e consequência patrimonial."]
        ],
        protocol: ["Qualifique a relação e a pretensão.", "Fixe validade, prazo e regime temporal.", "Mapeie inadimplemento, dano e prova.", "Identifique remédio e garantias.", "Conclua pelo efeito patrimonial."],
        laws: ["CC, arts. 113 e 187", "CC, arts. 421–422", "CC, arts. 478–480", "CC, arts. 884, 927 e 944", "Lei 11.101/2005", "Lei 6.404/1976"],
        trap: "Aceitar o nome dado pelas partes ao contrato ou escolher o prazo prescricional sem qualificar a pretensão."
      },
      {
        id: "trabalho", short: "Trabalho / RPPS", name: "Trabalho, Previdência e PGE", priority: "A",
        intro: "Regime do vínculo, competência, estatais, servidores, previdência e responsabilidade funcional do parecerista.",
        centrality: "Presente em toda a série e sensível ao impacto financeiro, às transições constitucionais e ao regime jurídico do agente.",
        axes: [
          ["Empregado público e estatais", "Comece pela natureza da entidade e do vínculo. Depois examine concurso, CLT, função de confiança, norma interna, alteração contratual e regime temporal."],
          ["Competência trabalhista", "Diferencie vínculo estatutário, celetista, temporário e previdência complementar. A competência depende da causa de pedir e da relação jurídica."],
          ["Responsabilidade subsidiária", "Evite automatismo. Analise contratação, fiscalização, ônus probatório, culpa, extensão e tese jurisprudencial vigente."],
          ["Contribuições sindicais", "Separe sindical, confederativa e assistencial; filiação, autorização/oposição e evolução jurisprudencial. Atualize a tese antes da prova."],
          ["RPPS e transições", "Mapeie filiação, benefício, paridade, integralidade, contribuição, déficit atuarial, direito adquirido, expectativa e regras de transição."],
          ["Acumulação e tempo de contribuição", "Verifique cargos, compatibilidade, regimes, datas, averbação, compensação e vedações constitucionais."],
          ["Parecerista e princípios institucionais", "Distinga opinião jurídica, decisão administrativa, dolo, fraude e erro grosseiro. Delimite a consulta, riscos e condicionantes no próprio parecer."]
        ],
        protocol: ["Qualifique vínculo e entidade.", "Defina competência jurisdicional.", "Fixe norma e data relevantes.", "Meça transição e impacto financeiro.", "Conclua com tese e regime de pagamento."],
        laws: ["CRFB, arts. 7º e 37–41", "CRFB, arts. 40 e 114", "CLT", "EC 41/2003", "EC 47/2005", "EC 103/2019", "Normas estaduais de RPPS"],
        trap: "Aplicar ao empregado público a mesma solução do estatutário ou ignorar a data que define a regra de transição."
      }
    ],
    phases: [
      { weeks: "Semanas 1–4", title: "Fundação", text: "Constituição, CPC, Administrativo geral, CTN e regimes de agentes.", tasks: ["8 respostas curtas", "fichas de artigos", "caderno de erros"] },
      { weeks: "Semanas 5–10", title: "Núcleo PGE", text: "Contratos, concessões, estatais, Fazenda em juízo, controle e ICMS.", tasks: ["12 pareceres/discursivas", "lei seca direcionada", "revisão D1/D7"] },
      { weeks: "Semanas 11–16", title: "Avançado aplicado", text: "Políticas públicas, orçamento, arbitragem, leniência, recuperação e RPPS.", tasks: ["6 casos interdisciplinares", "precedentes em fichas", "reescrita integral"] },
      { weeks: "Semanas 17–24", title: "Consolidação", text: "Provas completas, tempo, espelhos, lei atualizada e redução de erros.", tasks: ["4 simulados integrados", "36 comandos", "checklist final"] }
    ],
    week: [
      ["Segunda", "Administrativo", "Teoria + uma discursiva curta."], ["Terça", "Processual", "Precedentes + escolha de vias."],
      ["Quarta", "Constitucional", "Competências + controle."], ["Quinta", "Tributário", "Lei seca + auto de infração."],
      ["Sexta", "Civil / Trabalho", "Alternância semanal aplicada."], ["Sábado", "Simulado", "Correção + reescrita da pior."],
      ["Domingo", "Recuperação", "Leitura leve e organização."]
    ],
    writingCases: [
      { discipline: "Administrativo", title: "Desinvestimento em empresa estatal", text: "Empresa estatal estadual pretende alienar participação minoritária em subsidiária lucrativa por procedimento competitivo simplificado. O Ministério Público afirma serem indispensáveis lei específica e licitação tradicional.", command: "Como Procurador do Estado, examine a juridicidade da operação e indique condicionantes e providências." },
      { discipline: "Processual", title: "Liminar em política de saúde", text: "Em ACP, o juízo determina fornecimento universal de medicamento de alto custo fora do protocolo estadual, sem prévia oitiva nem prova técnica sobre capacidade e alternativas terapêuticas.", command: "Indique a estratégia processual imediata, os fundamentos de mérito e os pedidos subsidiários." },
      { discipline: "Tributário", title: "Benefício fiscal no RRF", text: "Decreto estadual concede benefício de ICMS sem estimativa de impacto e sem demonstração do requisito interestadual aplicável, durante a vigência do Regime de Recuperação Fiscal.", command: "Produza parecer sobre validade, risco fiscal, possibilidade de correção e atos administrativos necessários." },
      { discipline: "Constitucional", title: "Desapropriação e política industrial", text: "Lei estadual autoriza desapropriar área para implantação de polo tecnológico e prevê transferência posterior a empresa privada escolhida pelo Executivo.", command: "Analise competência, finalidade pública, impessoalidade, procedimento e parâmetros de controle." }
    ],
    rubric: [["Compreensão do caso",20],["Fundamento normativo",20],["Jurisprudência e princípios",15],["Aplicação aos fatos",25],["Conclusão e utilidade",20]],
    questions: [
      { level:"Fundação", discipline:"Administrativo", title:"Equilíbrio e risco extraordinário", text:"Contrato administrativo atribui genericamente ao contratado todos os eventos extraordinários futuros. Após ruptura relevante da base econômica, o particular requer recomposição. Analise.", mirror:"Distinguir matriz de riscos válida de renúncia genérica; identificar evento, nexo, extraordinariedade e regime legal; preservar a equação inicial; concluir sobre instrução, prova e eventual recomposição." },
      { level:"Fundação", discipline:"Processual", title:"Mandado de segurança e representação", text:"Mandado de segurança é impetrado contra ato de Secretário de Estado. Diferencie autoridade coatora, pessoa jurídica interessada e atuação da Procuradoria.", mirror:"Indicar imputação do ato, ciência/ingresso do ente, representação judicial, informações, recurso, eventual suspensão e efeitos patrimoniais; não confundir órgão, autoridade e pessoa jurídica." },
      { level:"Fundação", discipline:"Constitucional", title:"Competência concorrente", text:"Lei estadual disciplina matéria já regulada por normas gerais federais e cria requisito regional adicional. Examine a validade.", mirror:"Classificar competência; identificar espaço suplementar; testar compatibilidade com normas gerais e peculiaridade regional; concluir por validade total, parcial ou interpretação conforme." },
      { level:"Fundação", discipline:"Tributário", title:"Imunidade de templo", text:"Entidade religiosa aluga imóvel próprio e aplica a renda declaradamente em suas finalidades essenciais. O Estado pretende tributar.", mirror:"Distinguir tributo e competência; interpretar imunidade conforme finalidade; exigir vínculo da renda; distribuir argumentos e prova; evitar confundir imunidade com isenção." },
      { level:"Fundação", discipline:"Trabalho", title:"Servidor e competência", text:"Servidor submetido a regime jurídico-administrativo ajuíza demanda remuneratória na Justiça do Trabalho.", mirror:"Qualificar o vínculo e a causa; definir competência; tratar eventual contratação irregular sem converter automaticamente o regime; indicar medida processual." },
      { level:"Intermediário", discipline:"Administrativo", title:"Subsídio cruzado e controle externo", text:"Agência escolhe aporte público como política tarifária; a Corte de Contas determina substituição por subsídio cruzado por considerá-lo mais eficiente.", mirror:"Separar legalidade e mérito regulatório; competência da agência e do controle; motivação técnica, modicidade, universalização e orçamento; concluir sobre limites da determinação e instrução necessária." },
      { level:"Intermediário", discipline:"Processual", title:"ACP para obras estruturais", text:"ACP pede execução imediata de todas as obras de contenção de encostas, sem priorização técnica ou previsão orçamentária.", mirror:"Não negar controle judicial em abstrato; demonstrar plano, risco, cronograma, capacidade e igualdade; atacar ordem genérica; propor solução executável, monitorada e tecnicamente priorizada." },
      { level:"Intermediário", discipline:"Tributário", title:"CDA após embargos", text:"Após embargos, o Estado identifica erro material na CDA e pretende substituí-la. O contribuinte alega alteração do lançamento.", mirror:"Separar erro formal/material de mudança do fundamento ou sujeito; aplicar limites temporais e legais da substituição; preservar contraditório; concluir conforme a natureza do vício." },
      { level:"Intermediário", discipline:"Civil", title:"Crédito fiduciário na recuperação", text:"Sociedade em recuperação pede liberação de recebíveis cedidos fiduciariamente por serem essenciais à atividade.", mirror:"Classificar crédito e garantia; verificar sujeição, essencialidade, período de proteção e limites da constrição; compatibilizar regime fiduciário e preservação sem apagar a regra legal." },
      { level:"Intermediário", discipline:"Trabalho", title:"RPPS e regra de transição", text:"Reforma estadual altera contribuição e critérios de benefício de servidor próximo à aposentadoria, que invoca direito adquirido.", mirror:"Distinguir direito adquirido, expectativa e regra de transição; datas e requisitos completos; competência e simetria; equilíbrio atuarial sem retroação indevida." },
      { level:"Avançado", discipline:"Administrativo", title:"Leniência e ressarcimento", text:"Acordo de leniência prevê colaboração e multa, enquanto decisão de controle quantifica dano superior. A empresa pede quitação integral.", mirror:"Examinar competências, coordenação, extensão subjetiva/objetiva, reparação, benefícios e segurança jurídica; não prometer quitação além da competência; indicar compatibilização institucional." },
      { level:"Avançado", discipline:"Processual", title:"Precedente e sentença arbitral", text:"Sentença arbitral em contrato estatal afasta tese de tribunal superior sem enfrentar argumento central. O Estado pretende anulá-la.", mirror:"Distinguir erro de julgamento de hipótese legal de invalidação; convenção, ordem pública, fundamentação e contraditório; tratar precedentes com qualificação; respeitar controle judicial limitado e prazo." },
      { level:"Avançado", discipline:"Constitucional", title:"Desapropriação para particular", text:"Estado desapropria imóveis para política industrial e transfere área a agente privado selecionado sem critérios públicos.", mirror:"Finalidade pública pode coexistir com execução privada, mas requer motivação, impessoalidade, seleção, indenização, proporcionalidade e controle de desvio/favorecimento." },
      { level:"Avançado", discipline:"Tributário", title:"RERCT, doação exterior e ITCMD", text:"Contribuinte regulariza ativos no exterior e declara ter recebido doação anos antes. O Estado lança ITCMD.", mirror:"Separar regularização federal e fato gerador estadual; competência, reserva normativa, regime temporal, decadência, prova da doação e efeitos de eventual mudança jurisprudencial." },
      { level:"Avançado", discipline:"Trabalho", title:"Responsabilidade do parecerista", text:"Parecer jurídico favorável precede ato depois invalidado. Ação busca responsabilizar pessoalmente o parecerista.", mirror:"Delimitar natureza do parecer, competência decisória, nexo, dolo/fraude/erro grosseiro, contexto informacional e independência técnica; invalidade posterior não gera responsabilidade automática." }
    ],
    sims: [
      ["Simulado 01", "Fundação", ["Equilíbrio e matriz de riscos", "MS e pessoa jurídica", "Competência concorrente", "Imunidade de templo", "Servidor estatutário"]],
      ["Simulado 02", "Intermediário", ["Política tarifária", "ACP estrutural", "CDA e substituição", "Recuperação judicial", "Transição no RPPS"]],
      ["Simulado 03", "Avançado", ["Leniência e controle", "Arbitragem e precedentes", "Desapropriação", "RERCT e ITCMD", "Parecerista"]]
    ],
    checklist: {
      "Administrativo": ["Lei 14.133: planejamento, contratação direta, riscos, contratos e controle.", "Lei 13.303: governança, contratação, estatais e desinvestimento.", "Concessões/PPP: tarifa, aporte, equilíbrio, reversibilidade e sanção.", "Poder de polícia: delegação, fases, devido processo e autoexecutoriedade.", "Bens públicos: uso, ocupação, retomada, moradia e patrimônio cultural."],
      "Processual Civil": ["MS: autoridade, ente, liminar, recurso, suspensão e efeitos.", "Fazenda: prazos, honorários, remessa, tutela, precatório e RPV.", "ACP: legitimidade, competência, coisa julgada e execução.", "Arbitragem com Administração: convenção, controle e fundamentação.", "Execução: impugnação, medidas atípicas e limites contra a Fazenda."],
      "Constitucional": ["Controle: vias, parâmetros, plenário, efeitos e modulação.", "Federalismo: competências privativas, concorrentes, comuns e suplementares.", "Políticas públicas: prova, orçamento, capacidade e mínimo existencial.", "Direitos: laicidade, moradia, ambiente, saúde e vulneráveis.", "Poder constituinte: emendas, limites e transição."],
      "Tributário / Financeiro": ["ICMS: incidência, base, ST, importação, energia e benefícios.", "Crédito e execução: lançamento, CDA, decadência, prescrição e defesa.", "Imunidades: finalidade essencial e distinções.", "LRF/RRF: renúncia, impacto, compensação e vedações.", "ITCMD, exterior e regime temporal."],
      "Civil / Empresarial": ["Prescrição conforme a pretensão e termo inicial.", "Contratos: qualificação, riscos, revisão e boa-fé.", "Responsabilidade: dano, nexo, excludentes e quantificação.", "Reais: superfície, servidão, posse e bens públicos.", "Recuperação: classes de crédito, garantias e Fazenda."],
      "Trabalho / Previdência": ["Empregado público, estatal, função e regime temporal.", "Competência: estatutário, celetista, temporário e complementar.", "RPPS: paridade, contribuição, transição e equilíbrio atuarial.", "Contribuições sindicais: espécies e jurisprudência atual.", "Parecerista, erro grosseiro e princípios institucionais."]
    },
    documents: [
      ["15º concurso · 2007", "6 páginas · prova geral e específica", "15º concurso para Procurador do Estado do RJ - Provas.pdf"],
      ["16º concurso · 2009", "6 páginas · prova geral e específica", "16º concurso para Procurador do Estado do RJ - Provas.pdf"],
      ["17º concurso · 2012/2013", "14 páginas · prova geral e específica", "17º concurso para Procurador do Estado do RJ - Provas.pdf"],
      ["18º concurso · 2021", "18 páginas · provas gerais e específicas", "18º concurso para Procurador do Estado do RJ - Provas Gerais e Específicas.pdf"]
    ],
    official: [
      ["Constituição Federal", "Planalto", "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm"],
      ["Lei 14.133/2021", "Licitações e contratos", "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14133.htm"],
      ["Código de Processo Civil", "Lei 13.105/2015", "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13105.htm"],
      ["Código Tributário Nacional", "Lei 5.172/1966", "https://www.planalto.gov.br/ccivil_03/leis/l5172compilado.htm"],
      ["Jurisprudência STF", "Pesquisa oficial", "https://jurisprudencia.stf.jus.br/"],
      ["Jurisprudência STJ", "Pesquisa oficial", "https://scon.stj.jus.br/SCON/"],
      ["Legislação do RJ", "ALERJ", "https://www.alerj.rj.gov.br/"],
      ["PGE/RJ", "Portal institucional", "https://pge.rj.gov.br/"]
    ]
  };

  function escapeHTML(value = "") {
    return String(value).replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
  }
  function slugify(value) {
    return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 70);
  }
  function toast(message) {
    const node = $("#toast"); node.textContent = message; node.classList.add("show");
    clearTimeout(toast.timer); toast.timer = setTimeout(() => node.classList.remove("show"), 2400);
  }

  function renderStaticData() {
    $("#priority-chart").innerHTML = DATA.priorities.map(([name, grade, width]) => `<div class="priority-row"><label>${name}</label><div class="bar-track"><i style="--w:${width}%"></i></div><b>${grade}</b></div>`).join("");
    $("#pattern-grid").innerHTML = DATA.patterns.map(([n,t,p]) => `<article class="pattern-card"><b>${n}</b><h3>${t}</h3><p>${p}</p></article>`).join("");
    $("#exam-timeline").innerHTML = DATA.exams.map(x => `<article class="timeline-item"><time>${x.year} · ${x.label}</time><h3>${x.title}</h3><p>${x.text}</p><div class="timeline-tags">${x.tags.map(t=>`<span>${t}</span>`).join("")}</div></article>`).join("");
    $("#trap-list").innerHTML = DATA.traps.map(([n,t,p]) => `<article class="trap-item"><b>${n}</b><div><h3>${t}</h3><p>${p}</p></div></article>`).join("");
    $("#phase-grid").innerHTML = DATA.phases.map((x,i) => `<article class="phase-card" data-phase="${i}"><span class="phase-number">0${i+1}</span><time>${x.weeks}</time><h3>${x.title}</h3><p>${x.text}</p><ul>${x.tasks.map(t=>`<li>${t}</li>`).join("")}</ul></article>`).join("");
    $("#weekly-grid").innerHTML = DATA.week.map(([day,title,text]) => `<article class="day-card"><b>${day}</b><h3>${title}</h3><p>${text}</p></article>`).join("");
    $("#progressive-sims").innerHTML = DATA.sims.map(([tag,title,items]) => `<article class="sim-card"><b>${tag}</b><h3>${title}</h3><ul>${items.map(i=>`<li>${i}</li>`).join("")}</ul></article>`).join("");
  }

  function renderDisciplines() {
    const tabs = $("#discipline-tabs");
    tabs.innerHTML = DATA.disciplines.map((d,i) => `<button class="discipline-tab" role="tab" aria-selected="${i===0}" data-discipline="${d.id}"><b>${d.priority}</b>${d.short}</button>`).join("");
    tabs.addEventListener("click", e => {
      const button = e.target.closest("[data-discipline]"); if (!button) return;
      $$('[data-discipline]', tabs).forEach(b=>b.setAttribute("aria-selected", String(b===button)));
      showDiscipline(button.dataset.discipline);
    });
    showDiscipline(DATA.disciplines[0].id);
  }
  function showDiscipline(id) {
    const d = DATA.disciplines.find(x=>x.id===id) || DATA.disciplines[0];
    $("#discipline-content").innerHTML = `
      <div class="discipline-hero"><div><p class="kicker">Teoria + aplicação</p><h2>${d.name}</h2><p>${d.intro}</p></div><div class="priority-seal"><b>${d.priority}</b><span>${d.centrality}</span></div></div>
      <div class="topic-map"><section class="axes-panel"><div class="panel-head"><h3>Eixos de domínio</h3><span>${d.axes.length} eixos</span></div>${d.axes.map(([title,text],i)=>`<article class="axis-item ${i===0?'open':''}"><button class="axis-trigger" type="button"><b>${String(i+1).padStart(2,'0')}</b><span>${title}</span><i>+</i></button><div class="axis-body">${text}</div></article>`).join("")}</section>
      <div class="side-stack"><section class="protocol-panel"><h3>Protocolo de resposta</h3><ol>${d.protocol.map(x=>`<li>${x}</li>`).join("")}</ol></section><section class="law-panel"><h3>Lei seca nuclear</h3><div class="law-chips">${d.laws.map(x=>`<span>${x}</span>`).join("")}</div></section></div></div>
      <div class="discipline-alert"><b>Pegadinha-mãe</b><p>${d.trap}</p></div>`;
    $$(".axis-trigger", $("#discipline-content")).forEach(button => button.addEventListener("click", () => button.parentElement.classList.toggle("open")));
  }

  function setupPlan() {
    const range = $("#weekly-hours"), output = $("#hours-value"), advice = $("#hours-advice");
    const update = () => {
      const hours = +range.value; output.textContent = hours;
      advice.textContent = hours < 12 ? "Preserve o ciclo e estenda a duração; não elimine escrita." : hours < 20 ? "Faixa equilibrada: cerca de 55% teoria, 25% escrita e 20% revisão." : "Use a carga adicional para lei seca, correção e simulados — não para acumular cursos.";
      $$(".phase-card").forEach((card,i)=>card.classList.toggle("active-phase", i === (hours < 12 ? 0 : hours < 20 ? 1 : 2)));
      store.set("pge-hours", hours);
    };
    range.value = store.get("pge-hours", 15); range.addEventListener("input", update); update();
  }

  let writingIndex = 0, timerInterval = null, secondsLeft = 40 * 60;
  function setupWritingLab() {
    const textarea = $("#answer-draft"); textarea.value = store.get("pge-draft", ""); updateWordCount();
    textarea.addEventListener("input", () => { store.set("pge-draft", textarea.value); updateWordCount(); });
    $("[data-new-writing-case]").addEventListener("click", () => { writingIndex=(writingIndex+1)%DATA.writingCases.length; showWritingCase(); });
    $("[data-writing-timer]").addEventListener("click", toggleTimer);
    showWritingCase(); renderRubric();
  }
  function showWritingCase(custom) {
    const c = custom || DATA.writingCases[writingIndex];
    $(".lab-head span").textContent = `CASO ${String(writingIndex+1).padStart(2,"0")} · ${c.discipline.toUpperCase()}`;
    $("#writing-case-title").textContent = c.title; $("#writing-case-text").textContent = c.text; $("#writing-case-command").textContent = c.command;
  }
  function updateWordCount() { $("#word-count").textContent = ($("#answer-draft").value.trim().match(/\S+/g)||[]).length; }
  function toggleTimer() {
    const button = $("[data-writing-timer]");
    if (timerInterval) { clearInterval(timerInterval); timerInterval=null; button.textContent="Continuar"; return; }
    button.textContent="Pausar";
    timerInterval=setInterval(()=>{ secondsLeft=Math.max(0,secondsLeft-1); const m=Math.floor(secondsLeft/60),s=secondsLeft%60; $("#writing-timer").textContent=`${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`; if(!secondsLeft){clearInterval(timerInterval);timerInterval=null;button.textContent="Encerrado";toast("Tempo encerrado. Feche a conclusão.");}},1000);
  }
  function renderRubric() {
    const scores = store.get("pge-rubric", [0,0,0,0,0]);
    $("#rubric").innerHTML = DATA.rubric.map(([label],i)=>`<div class="rubric-row"><span>${label}</span>${[0,1,2,3,4].map(v=>`<button type="button" data-rubric="${i}" data-value="${v}" class="${scores[i]===v&&v>0?'selected':''}">${v}</button>`).join("")}</div>`).join("");
    $("#rubric").onclick=e=>{const b=e.target.closest("[data-rubric]");if(!b)return;scores[+b.dataset.rubric]=+b.dataset.value;store.set("pge-rubric",scores);renderRubric();};
    const total = DATA.rubric.reduce((sum,[,weight],i)=>sum+(scores[i]/4)*weight,0); $("#rubric-score").textContent=Math.round(total);
  }

  let questionFilter = "Todas", currentQuestion = 0;
  function setupSimulations() {
    const levels = ["Todas","Fundação","Intermediário","Avançado"];
    $("#sim-filter").innerHTML=levels.map((x,i)=>`<button type="button" class="${i===0?'active':''}" data-level="${x}">${x}</button>`).join("");
    $("#sim-filter").addEventListener("click",e=>{const b=e.target.closest("[data-level]");if(!b)return;questionFilter=b.dataset.level;$$('button',$("#sim-filter")).forEach(x=>x.classList.toggle('active',x===b));randomQuestion();});
    $("[data-random-question]").addEventListener("click",randomQuestion);
    $("[data-toggle-mirror]").addEventListener("click",()=>{const m=$("#answer-mirror");m.hidden=!m.hidden;$("[data-toggle-mirror]").textContent=m.hidden?"Ver espelho de correção":"Ocultar espelho";});
    $("[data-send-to-lab]").addEventListener("click",()=>{const q=DATA.questions[currentQuestion];showWritingCase({discipline:q.discipline,title:q.title,text:q.text,command:"Produza resposta fundamentada pela estrutura PEGE e conclua com providência."});location.hash="escrita";});
    showQuestion(0);
  }
  function randomQuestion(){const pool=DATA.questions.map((q,i)=>({q,i})).filter(x=>questionFilter==="Todas"||x.q.level===questionFilter);const pick=pool[Math.floor(Math.random()*pool.length)];showQuestion(pick.i);}
  function showQuestion(index){currentQuestion=index;const q=DATA.questions[index];$("#question-level").textContent=q.level.toUpperCase();$("#question-discipline").textContent=q.discipline.toUpperCase();$("#question-title").textContent=q.title;$("#question-text").textContent=q.text;$("#answer-mirror").innerHTML=`<strong>Espelho mínimo</strong>${q.mirror}`;$("#answer-mirror").hidden=true;$("[data-toggle-mirror]").textContent="Ver espelho de correção";}

  function setupChecklist() {
    renderChecklist(); $("[data-reset-progress]").addEventListener("click",()=>{if(confirm("Zerar todas as marcações do checklist?")){store.set("pge-checks",{});renderChecklist();toast("Progresso zerado.");}});
  }
  function renderChecklist() {
    const checked=store.get("pge-checks",{}), groups=$("#checklist-groups");
    groups.innerHTML=Object.entries(DATA.checklist).map(([group,items])=>{const done=items.filter((_,i)=>checked[`${group}-${i}`]).length;return `<section class="checklist-group"><div class="checklist-head"><h2>${group}</h2><span>${done}/${items.length}</span></div>${items.map((item,i)=>{const key=`${group}-${i}`;return `<label class="check-item"><input type="checkbox" data-check="${escapeHTML(key)}" ${checked[key]?'checked':''}><span class="fake-check"></span><span>${item}</span></label>`}).join("")}</section>`}).join("");
    $$('[data-check]',groups).forEach(input=>input.addEventListener('change',()=>{checked[input.dataset.check]=input.checked;store.set('pge-checks',checked);renderChecklist();}));
    updateProgress();
  }
  function updateProgress(){const checked=store.get("pge-checks",{});const total=Object.values(DATA.checklist).reduce((a,x)=>a+x.length,0);const done=Object.values(checked).filter(Boolean).length;const pct=Math.round(done/total*100);$("#review-percent").textContent=`${pct}%`;$("#review-donut").style.setProperty('--p',pct);$("#global-progress-label").textContent=`${pct}%`;$("#global-progress-bar").style.width=`${pct}%`;$("#progress-detail").textContent=`${done} de ${total} núcleos dominados.`;let title="Diagnóstico inicial",copy="Marque somente o que você consegue aplicar sem consulta.";if(pct>=25){title="Base em construção";copy="Continue alternando lei, caso e reescrita."}if(pct>=60){title="Núcleo competitivo";copy="Transforme lacunas restantes em simulados direcionados."}if(pct>=85){title="Reta final";copy="Preserve revisão, tempo de prova e atualização jurisprudencial."}$("#review-status").textContent=title;$("#review-status-copy").textContent=copy;}

  function renderSources(){
    $("#document-list").innerHTML=DATA.documents.map(([name,meta,path])=>`<a class="document-card" href="${encodeURI(path)}" target="_blank"><span class="document-icon"><svg><use href="#i-file"></use></svg></span><div><strong>${name}</strong><small>${meta}</small></div><svg><use href="#i-external"></use></svg></a>`).join("");
    $("#official-links").innerHTML=DATA.official.map(([name,meta,url])=>`<a class="official-card" href="${url}" target="_blank" rel="noreferrer"><span class="document-icon"><svg><use href="#i-external"></use></svg></span><div><strong>${name}</strong><small>${meta}</small></div></a>`).join("");
  }

  function parseLibrary() {
    const source = window.APOSTILA_SOURCE || "Conteúdo integral não encontrado. Mantenha apostila-content.js ao lado de index.html.";
    const rawLines=source.replace(/\r/g,"").split("\n"); const lines=[];
    for(const raw of rawLines){const line=raw.trim();if(!line||/^Página \d+ de \d+/i.test(line)||/^Apostila Estratégica PGE-RJ - Provas anteriores$/i.test(line))continue;lines.push(line);}
    let html="", paragraph=[], listOpen=false, ids=new Set(), toc=[];
    const flush=()=>{if(paragraph.length){html+=`<p>${escapeHTML(paragraph.join(" "))}</p>`;paragraph=[];}if(listOpen){html+="</ul>";listOpen=false;}};
    const headingLevel=line=>{if(/^APOSTILA ESTRATÉGICA$/i.test(line))return 1;if(/^\d+\.\d+\./.test(line))return 3;if(/^\d+\.\s+/.test(line))return 2;if(/^Eixo \d+/i.test(line))return 3;if(/^(Premissa de ouro|Roteiro de resposta|Pegadinha comum|Como corrigir|Modelo de conclusão consultiva|Regra dos|Parecer .*esqueleto|Contestação .*esqueleto|Agravo\/contracautela|Informações em ADI)/i.test(line))return 4;if(/^(Administrativo|Processual Civil|Constitucional|Civil\/Empresarial|Tributário\/Financeiro|Trabalho\/Previdência\/PGE)$/i.test(line))return 3;return 0;};
    lines.forEach(line=>{const level=headingLevel(line);if(level){flush();let id=slugify(line)||`sec-${toc.length}`;while(ids.has(id))id+=`-${toc.length}`;ids.add(id);html+=`<h${level} id="${id}">${escapeHTML(line)}</h${level}>`;if(level<=2)toc.push([id,line.replace(/^\d+\.\s*/,"")]);return;}if(line.startsWith("•")){if(paragraph.length)flush();if(!listOpen){html+="<ul>";listOpen=true;}html+=`<li>${escapeHTML(line.replace(/^•\s*/,""))}</li>`;return;}if(listOpen){html+="</ul>";listOpen=false;}if(line==="Premissa de ouro"){flush();html+=`<h4>${line}</h4>`;return;}paragraph.push(line);});flush();
    $("#library-content").innerHTML=html;$("#library-toc").innerHTML=toc.map(([id,title])=>`<a href="#${id}" data-library-anchor>${escapeHTML(title)}</a>`).join("");
    $$('[data-library-anchor]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();document.getElementById(a.getAttribute('href').slice(1))?.scrollIntoView({behavior:'smooth'});}));
  }

  function setupSearch() {
    const dialog=$("#search-dialog"), input=$("#global-search"), results=$("#search-results");
    const sourceLines=(window.APOSTILA_SOURCE||"").split(/\r?\n/).map(x=>x.trim()).filter(x=>x&&!/^Página \d+/i.test(x));
    const libraryIndex=[];for(let i=0;i<sourceLines.length;i+=7){const block=sourceLines.slice(i,i+7).join(" ");libraryIndex.push({type:"Apostila integral",title:sourceLines[i].slice(0,90),text:block,hash:"apostila"});}
    const index=[...DATA.disciplines.flatMap(d=>d.axes.map(([t,p])=>({type:d.short,title:t,text:p,hash:"disciplinas",discipline:d.id}))),...DATA.questions.map(q=>({type:`Simulado · ${q.level}`,title:q.title,text:q.text,hash:"simulados"})),...DATA.traps.map(([,t,p])=>({type:"Pegadinha",title:t,text:p,hash:"dna-banca"})),...libraryIndex];
    const open=()=>{dialog.showModal();setTimeout(()=>input.focus(),30);render("");};
    const render=query=>{const q=query.trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();if(!q){results.innerHTML='<p class="search-hint">Sugestões: “controle”, “ICMS”, “precedentes”, “desinvestimento”.</p>';return;}const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();let found=index.filter(x=>normalize(`${x.title} ${x.text} ${x.type}`).includes(q)).slice(0,12);results.innerHTML=found.length?found.map((x,i)=>`<article class="search-result" data-result="${i}"><b>${x.type}</b><strong>${x.title}</strong><p>${x.text.slice(0,155)}…</p></article>`).join(''):'<div class="search-empty">Nenhum resultado estratégico. Tente um termo mais amplo.</div>';$$('[data-result]',results).forEach((node,i)=>node.addEventListener('click',()=>{const x=found[i];if(x.discipline){const tab=$(`[data-discipline="${x.discipline}"]`);tab?.click();}dialog.close();location.hash=x.hash;}));};
    $$('[data-open-search]').forEach(b=>b.addEventListener('click',open));input.addEventListener('input',()=>render(input.value));document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();open();}if(e.key==='Escape'&&dialog.open)dialog.close();});
  }

  function setupNavigation() {
    const route=()=>{const id=location.hash.slice(1)||'visao-geral';const view=document.getElementById(id)||$("#visao-geral");$$('.view').forEach(v=>v.classList.toggle('active-view',v===view));$$('.nav-link').forEach(a=>a.classList.toggle('active',a.getAttribute('href')===`#${view.id}`));document.title=`${view.dataset.title} — PGE Estratégia`;document.body.classList.remove('menu-open');window.scrollTo({top:0,behavior:'auto'});};
    window.addEventListener('hashchange',route);route();
    $('[data-toggle-menu]').addEventListener('click',()=>document.body.classList.toggle('menu-open'));$('[data-close-menu]').addEventListener('click',()=>document.body.classList.remove('menu-open'));
  }

  function setupThemeAndPrint() {
    const saved=store.get('pge-theme','light');document.documentElement.dataset.theme=saved;
    $('[data-theme-toggle]').addEventListener('click',()=>{const next=document.documentElement.dataset.theme==='light'?'dark':'light';document.documentElement.dataset.theme=next;store.set('pge-theme',next);});
    $('[data-print]').addEventListener('click',()=>{toast('Preparando a apostila completa para impressão…');setTimeout(()=>window.print(),300);});
    $$('[data-font-size]').forEach(b=>b.addEventListener('click',()=>{const article=$('#library-content');let size=parseFloat(getComputedStyle(article).fontSize);size+=b.dataset.fontSize==='up'?1:-1;size=Math.max(13,Math.min(20,size));article.style.setProperty('--library-size',`${size}px`);}));
  }

  function init() {
    renderStaticData(); renderDisciplines(); setupPlan(); setupWritingLab(); setupSimulations(); setupChecklist(); renderSources(); parseLibrary(); setupSearch(); setupNavigation(); setupThemeAndPrint();
  }
  document.addEventListener("DOMContentLoaded", init);
})();
