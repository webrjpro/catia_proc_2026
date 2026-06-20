/**
 * flashcards.js — Sistema de Flashcards com Repetição Espaçada (SM-2 Simplificado)
 * Plataforma de Preparação PGE/RJ
 *
 * IIFE autocontida — sem dependências externas.
 * Renderiza em #flashcard-controls, #flashcard-stage e #flashcard-stats.
 * Persiste estado em localStorage (chave: pge-flashcard-state).
 */
;(function () {
  'use strict';

  /* ================================================================
     0. CONSTANTES & CONFIGURAÇÃO
     ================================================================ */
  const STORAGE_KEY = 'pge-flashcard-state';
  const DISCIPLINES = [
    'Administrativo',
    'Processual',
    'Constitucional',
    'Tributário',
    'Civil',
    'Trabalho'
  ];

  const DISCIPLINE_COLORS = {
    Administrativo:  { bg: '#6366f1', light: '#eef2ff', text: '#4338ca' },
    Processual:      { bg: '#0ea5e9', light: '#e0f2fe', text: '#0369a1' },
    Constitucional:  { bg: '#f59e0b', light: '#fef3c7', text: '#b45309' },
    'Tributário':    { bg: '#10b981', light: '#d1fae5', text: '#047857' },
    Civil:           { bg: '#ec4899', light: '#fce7f3', text: '#be185d' },
    Trabalho:        { bg: '#8b5cf6', light: '#ede9fe', text: '#6d28d9' }
  };

  /* ================================================================
     1. BANCO DE FLASHCARDS (60 cards)
     ================================================================ */
  const CARDS = [
    /* ── Administrativo (10) ─────────────────────────────────────── */
    {
      id: 'adm-01',
      discipline: 'Administrativo',
      front: 'Qual a diferença entre reajuste, repactuação e revisão contratual?',
      back: 'Reajuste: atualização monetária automática por índice. Repactuação: recomposição por alteração de custos em contratos de serviço contínuo (art. 135, Lei 14.133). Revisão: reequilíbrio por álea extraordinária e extracontratual (art. 134, §2º). Só a revisão exige fato imprevisível.',
      tags: ['contratos', 'Lei 14.133', 'reequilíbrio']
    },
    {
      id: 'adm-02',
      discipline: 'Administrativo',
      front: 'O que é a matriz de riscos na Lei 14.133/2021?',
      back: 'Cláusula que distribui objetivamente os riscos do contrato entre Administração e contratado (art. 6º, XXVII). Define quem assume cada álea e quando cabe reequilíbrio. Torna previsível a alocação e limita pedidos genéricos de revisão.',
      tags: ['contratos', 'Lei 14.133', 'matriz de riscos']
    },
    {
      id: 'adm-03',
      discipline: 'Administrativo',
      front: 'Empresa estatal pode contratar diretamente sem licitação?',
      back: 'Sim, nos casos do art. 29 da Lei 13.303/2016: dispensa e inexigibilidade. Mas a contratação direta exige justificativa, ratificação e publicação. Estatal não se submete à Lei 14.133, salvo expressa opção legislativa.',
      tags: ['licitação', 'estatais', 'Lei 13.303']
    },
    {
      id: 'adm-04',
      discipline: 'Administrativo',
      front: 'Qual o alcance da LINDB (arts. 20-30) na decisão administrativa?',
      back: 'Impõe ao decisor considerar consequências práticas (art. 20), motivar com base em fatos e fundamentos (art. 21), proteger confiança legítima (art. 23), e limitar invalidação retroativa (art. 24). Erros administrativos não são punidos se proporcional ao contexto.',
      tags: ['LINDB', 'motivação', 'segurança jurídica']
    },
    {
      id: 'adm-05',
      discipline: 'Administrativo',
      front: 'O Tribunal de Contas pode anular contrato administrativo?',
      back: 'Pode sustar ato, mas contrato exige comunicação ao Legislativo (art. 71, §1º, CRFB). TCU/TCE controla juridicidade, não mérito administrativo. Pode fixar prazo para correção, mas não substituir a decisão do gestor.',
      tags: ['Tribunal de Contas', 'controle externo', 'CRFB']
    },
    {
      id: 'adm-06',
      discipline: 'Administrativo',
      front: 'Diferencie poder de polícia originário e delegado.',
      back: 'Originário: exercido pela Administração Direta. Delegado: transferido a entidades da Administração Indireta. STF (RE 633782): autarquias podem exercer todas as fases. Consentimento e fiscalização são delegáveis a entidades privadas; sanção, apenas com reservas.',
      tags: ['poder de polícia', 'STF', 'delegação']
    },
    {
      id: 'adm-07',
      discipline: 'Administrativo',
      front: 'Quando é necessária autorização legislativa para desinvestimento de estatal?',
      back: 'STF (ADI 5624): necessária para alienação de controle acionário de empresa estatal mãe. Para subsidiárias ou participações minoritárias, basta autorização genérica + procedimento competitivo impessoal. A avaliação prévia é sempre indispensável.',
      tags: ['estatais', 'desinvestimento', 'STF']
    },
    {
      id: 'adm-08',
      discipline: 'Administrativo',
      front: 'O que é acordo de leniência e quais seus efeitos?',
      back: 'Previsto na Lei 12.846/2013 (art. 16): reduz até 2/3 da multa em troca de colaboração efetiva. Não exime de reparação integral. A CGU celebra na esfera federal. Exige confissão, cessação do ilícito e cooperação. Não vincula esferas de controle não signatárias.',
      tags: ['anticorrupção', 'leniência', 'Lei 12.846']
    },
    {
      id: 'adm-09',
      discipline: 'Administrativo',
      front: 'Tombamento pode incidir sobre bem privado? Gera indenização?',
      back: 'Sim. O DL 25/37 permite tombamento de bens públicos e privados. Não gera indenização automática — apenas se esvaziar o conteúdo econômico. Restringe alienação (notificação ao ente), modificação (prévia autorização) e impõe dever de conservação.',
      tags: ['tombamento', 'patrimônio', 'intervenção']
    },
    {
      id: 'adm-10',
      discipline: 'Administrativo',
      front: 'Qual a diferença entre responsabilidade objetiva e subjetiva do Estado?',
      back: 'Objetiva (art. 37, §6º, CRFB): conduta comissiva + dano + nexo, sem exigir culpa. Subjetiva: cobrada na omissão quando havia dever legal de agir e a omissão foi específica. Excludentes: caso fortuito, força maior, culpa exclusiva da vítima.',
      tags: ['responsabilidade civil', 'Estado', 'CRFB']
    },

    /* ── Processual Civil (10) ───────────────────────────────────── */
    {
      id: 'proc-01',
      discipline: 'Processual',
      front: 'Quem é a autoridade coatora no mandado de segurança contra ato de Secretário de Estado?',
      back: 'Autoridade coatora é o Secretário que praticou o ato (Lei 12.016, art. 6º). O Estado é pessoa jurídica interessada e será intimado para ingressar. A PGE atua na representação judicial do ente, não como litisconsorte.',
      tags: ['mandado de segurança', 'autoridade coatora', 'PGE']
    },
    {
      id: 'proc-02',
      discipline: 'Processual',
      front: 'A Fazenda Pública tem prazo em dobro?',
      back: 'Sim, para todas as manifestações processuais (art. 183, CPC). Exceção: se a lei fixar prazo próprio (ex.: MS - informações em 10 dias úteis). O prazo conta em dias úteis (art. 219, CPC).',
      tags: ['Fazenda Pública', 'prazos', 'CPC']
    },
    {
      id: 'proc-03',
      discipline: 'Processual',
      front: 'O que é suspensão de segurança?',
      back: 'Pedido ao presidente do Tribunal para suspender execução de decisão contra o Poder Público (Lei 12.016, art. 15; Lei 8.437, art. 4º). Requisito: demonstrar grave lesão à ordem, saúde, segurança ou economia públicas. Não é recurso — não ataca mérito.',
      tags: ['suspensão de segurança', 'Fazenda Pública', 'tutela']
    },
    {
      id: 'proc-04',
      discipline: 'Processual',
      front: 'Qual o regime de precatórios e RPV?',
      back: 'Art. 100, CRFB: condenações contra a Fazenda são pagas por precatório (inscrição até 2/4, pagamento no exercício seguinte). RPV: obrigações de pequeno valor (Lei define limite). Exceção: créditos alimentícios têm preferência.',
      tags: ['precatório', 'RPV', 'execução contra Fazenda']
    },
    {
      id: 'proc-05',
      discipline: 'Processual',
      front: 'A Fazenda está sujeita a medidas executivas atípicas (art. 139, IV, CPC)?',
      back: 'Com severas restrições. Regime de precatório (art. 100 CRFB) e impenhorabilidade de bens públicos limitam a aplicação. Medidas devem respeitar adequação, necessidade e proporcionalidade. STJ tem admitido com cautela.',
      tags: ['execução atípica', 'CPC', 'Fazenda Pública']
    },
    {
      id: 'proc-06',
      discipline: 'Processual',
      front: 'Quais os limites da coisa julgada em ACP?',
      back: 'Art. 16, LACP: eficácia erga omnes nos limites da competência territorial do órgão prolator. STF em repercussão geral: a limitação territorial é constitucional. Secundum eventum litis nas ações coletivas (CDC, art. 103).',
      tags: ['ACP', 'coisa julgada', 'ações coletivas']
    },
    {
      id: 'proc-07',
      discipline: 'Processual',
      front: 'Arbitragem em contratos com a Administração é possível?',
      back: 'Sim (Lei 13.129/2015 + Lei 14.133/2021, art. 151). Apenas sobre direitos patrimoniais disponíveis. O controle judicial da sentença arbitral é limitado às hipóteses do art. 32 da Lei 9.307/96. Não cabe revisão do mérito.',
      tags: ['arbitragem', 'contratos públicos', 'Lei 14.133']
    },
    {
      id: 'proc-08',
      discipline: 'Processual',
      front: 'Remessa necessária: quando é dispensada?',
      back: 'Art. 496, §§3º-4º, CPC: dispensada quando a condenação ou o benefício for de valor certo inferior a limites fixados (500/1000 salários-mínimos conforme o ente). Também dispensada quando fundada em súmula, acórdão de repetitivo ou tese firmada.',
      tags: ['remessa necessária', 'Fazenda Pública', 'CPC']
    },
    {
      id: 'proc-09',
      discipline: 'Processual',
      front: 'A ACP pode determinar implementação de políticas públicas?',
      back: 'Sim, mas com limites. Exige-se: prova da omissão inconstitucional, demonstração orçamentária, solução tecnicamente viável e monitoramento judicial. Ordens genéricas (\'faça tudo\') são vedadas. Preferir soluções estruturais dialogadas.',
      tags: ['ACP', 'políticas públicas', 'controle judicial']
    },
    {
      id: 'proc-10',
      discipline: 'Processual',
      front: 'Qual a diferença entre legitimidade e representação no MS?',
      back: 'Legitimidade passiva: autoridade coatora (impetração contra ela). Representação processual: PGE atua representando o ente estatal. Pessoa jurídica é intimada (art. 7º, II, Lei 12.016). Não confundir órgão, autoridade e pessoa jurídica.',
      tags: ['mandado de segurança', 'legitimidade', 'PGE']
    },

    /* ── Constitucional (10) ─────────────────────────────────────── */
    {
      id: 'const-01',
      discipline: 'Constitucional',
      front: 'Quais são as ações do controle concentrado de constitucionalidade?',
      back: 'ADI (art. 102, I, \'a\'), ADC (art. 102, I, \'a\'), ADPF (art. 102, §1º), ADO (art. 103, §2º). Legitimados: art. 103, CRFB. Efeitos erga omnes e vinculantes. Modulação temporal possível (art. 27, Lei 9.868).',
      tags: ['controle concentrado', 'ADI', 'STF']
    },
    {
      id: 'const-02',
      discipline: 'Constitucional',
      front: 'O que é competência concorrente e quando o Estado pode legislar?',
      back: 'Art. 24, CRFB: União edita normas gerais, Estados suplementam. Na ausência de lei federal, o Estado tem competência legislativa plena (§3º). Superveniência de norma geral federal suspende eficácia da lei estadual no que conflitar (§4º).',
      tags: ['competência legislativa', 'federalismo', 'CRFB']
    },
    {
      id: 'const-03',
      discipline: 'Constitucional',
      front: 'Qual a cláusula de reserva de plenário?',
      back: 'Art. 97, CRFB + Súmula Vinculante 10: somente pelo voto da maioria absoluta do tribunal pleno ou órgão especial pode ser declarada inconstitucionalidade. Exceção: se já houver pronunciamento do STF ou do próprio tribunal (art. 949, parágrafo único, CPC).',
      tags: ['reserva de plenário', 'SV 10', 'controle difuso']
    },
    {
      id: 'const-04',
      discipline: 'Constitucional',
      front: 'Diferencie mínimo existencial e reserva do possível.',
      back: 'Mínimo existencial: núcleo intangível dos direitos fundamentais que o Estado deve garantir independentemente de restrição orçamentária. Reserva do possível: limite fático/jurídico à prestação estatal — deve ser comprovada, não apenas alegada.',
      tags: ['direitos fundamentais', 'mínimo existencial', 'reserva do possível']
    },
    {
      id: 'const-05',
      discipline: 'Constitucional',
      front: 'O Governador pode propor ADI no STF?',
      back: 'Sim (art. 103, V, CRFB). É legitimado universal? Não — exige pertinência temática (nexo entre a norma impugnada e o interesse do Estado). ADI estadual: representação no TJ, com parâmetro na Constituição Estadual.',
      tags: ['ADI', 'legitimidade', 'Governador']
    },
    {
      id: 'const-06',
      discipline: 'Constitucional',
      front: 'O que é modulação de efeitos?',
      back: 'Art. 27, Lei 9.868/99: o STF pode, por razões de segurança jurídica ou excepcional interesse social, restringir efeitos da declaração ou decidir que ela só produza efeitos a partir de data futura. Exige quórum de 2/3.',
      tags: ['modulação', 'STF', 'controle de constitucionalidade']
    },
    {
      id: 'const-07',
      discipline: 'Constitucional',
      front: 'Estados podem conceder benefícios fiscais de ICMS unilateralmente?',
      back: 'Não. Art. 155, §2º, XII, \'g\', CRFB + LC 24/75: benefícios de ICMS exigem convênio no CONFAZ (decisão unânime). Concessão unilateral é inconstitucional — gera guerra fiscal. LC 160/2017 permite convalidação/remissão.',
      tags: ['ICMS', 'guerra fiscal', 'CONFAZ']
    },
    {
      id: 'const-08',
      discipline: 'Constitucional',
      front: 'O que é ADPF e quando cabe?',
      back: 'Art. 102, §1º, CRFB + Lei 9.882/99: arguição de descumprimento de preceito fundamental. Caráter subsidiário: cabe quando não houver outro meio eficaz. Alcança direito pré-constitucional, atos do poder público e controvérsia constitucional relevante.',
      tags: ['ADPF', 'subsidiariedade', 'preceito fundamental']
    },
    {
      id: 'const-09',
      discipline: 'Constitucional',
      front: 'O Tribunal de Contas pode declarar inconstitucionalidade de lei?',
      back: 'Sim, em controle incidental/difuso para afastar a aplicação no caso concreto (Súmula 347/STF). Mas NÃO pode declarar com efeitos erga omnes — isso é reserva do Judiciário. A extensão atual dessa súmula é debatida no STF.',
      tags: ['Tribunal de Contas', 'controle difuso', 'Súmula 347']
    },
    {
      id: 'const-10',
      discipline: 'Constitucional',
      front: 'O que é poder constituinte decorrente?',
      back: 'Poder dos Estados-membros de elaborar suas Constituições Estaduais (art. 25, CRFB). Limitado: deve observar princípios da CF (sensíveis, extensíveis e estabelecidos). Sujeito a controle de constitucionalidade no STF.',
      tags: ['poder constituinte', 'Constituição Estadual', 'federalismo']
    },

    /* ── Tributário (10) ─────────────────────────────────────────── */
    {
      id: 'trib-01',
      discipline: 'Tributário',
      front: 'Quais as hipóteses de suspensão do crédito tributário?',
      back: 'Art. 151, CTN: moratória, depósito do montante integral, reclamações/recursos administrativos, liminar em MS, liminar/tutela em outras ações, parcelamento. A suspensão impede a exigibilidade, não extingue o crédito.',
      tags: ['crédito tributário', 'suspensão', 'CTN']
    },
    {
      id: 'trib-02',
      discipline: 'Tributário',
      front: 'Qual o prazo de decadência para lançamento tributário?',
      back: 'Art. 150, §4º, CTN (lançamento por homologação): 5 anos do fato gerador. Art. 173, I, CTN (lançamento de ofício): 5 anos do primeiro dia do exercício seguinte. Havendo dolo/fraude, aplica-se o art. 173, I.',
      tags: ['decadência', 'lançamento', 'CTN']
    },
    {
      id: 'trib-03',
      discipline: 'Tributário',
      front: 'A CDA pode ser substituída após os embargos?',
      back: 'Lei 6.830, art. 2º, §8º: até a decisão de primeira instância. Limite: não pode alterar sujeito passivo (Súmula 392/STJ). Erro material/formal pode ser corrigido. Alteração do fundamento legal ou da materialidade exige novo lançamento.',
      tags: ['CDA', 'execução fiscal', 'STJ']
    },
    {
      id: 'trib-04',
      discipline: 'Tributário',
      front: 'Diferencie imunidade, isenção e não incidência.',
      back: 'Imunidade: limitação constitucional ao poder de tributar (arts. 150-152, CRFB). Isenção: exclusão legal do crédito tributário (art. 175, I, CTN). Não incidência: fato não se subsume à hipótese de incidência — não há norma aplicável.',
      tags: ['imunidade', 'isenção', 'não incidência']
    },
    {
      id: 'trib-05',
      discipline: 'Tributário',
      front: 'ICMS incide sobre software?',
      back: 'STF (ADIs 5659 e 1945): operações com software, inclusive por download, estão sujeitas ao ISS (LC 116, item 1.05), não ao ICMS. Superou a distinção software de prateleira vs. customizado.',
      tags: ['ICMS', 'ISS', 'software', 'STF']
    },
    {
      id: 'trib-06',
      discipline: 'Tributário',
      front: 'O que é substituição tributária progressiva (para frente)?',
      back: 'Art. 150, §7º, CRFB: o contribuinte antecipa o pagamento com base em fato gerador presumido. Se o fato não ocorrer ou a base for menor, cabe restituição (RE 593.849, repercussão geral). O Estado deve devolver o excesso.',
      tags: ['substituição tributária', 'ICMS', 'STF']
    },
    {
      id: 'trib-07',
      discipline: 'Tributário',
      front: 'ITCMD sobre doação no exterior: o Estado pode cobrar?',
      back: 'Art. 155, §1º, III, CRFB: competência para ITCMD quando doador domiciliado no exterior depende de lei complementar federal. Na ausência, STF (RE 851.108) julgou que o Estado não pode instituir por lei própria. Acompanhar modulação.',
      tags: ['ITCMD', 'doação', 'STF']
    },
    {
      id: 'trib-08',
      discipline: 'Tributário',
      front: 'O que é a LRF e quais seus pilares?',
      back: 'LC 101/2000: planejamento (PPA, LDO, LOA), transparência, controle e responsabilização. Limita despesas com pessoal, operações de crédito e renúncia de receita. Renúncia exige estimativa de impacto e compensação (art. 14).',
      tags: ['LRF', 'responsabilidade fiscal', 'LC 101']
    },
    {
      id: 'trib-09',
      discipline: 'Tributário',
      front: 'Princípio da não cumulatividade do ICMS: como funciona?',
      back: 'Art. 155, §2º, I, CRFB: o contribuinte compensa o imposto devido com o cobrado nas operações anteriores. Crédito físico vs. financeiro. Isenção/não incidência não geram crédito, salvo disposição em contrário (§2º, II).',
      tags: ['ICMS', 'não cumulatividade', 'crédito']
    },
    {
      id: 'trib-10',
      discipline: 'Tributário',
      front: 'O que é o Regime de Recuperação Fiscal (RRF)?',
      back: 'LC 159/2017: regime para Estados em desequilíbrio fiscal. Suspende dívida com a União em troca de vedações: não criar despesas obrigatórias, não conceder benefícios fiscais, não reajustar remuneração. Prazo de até 9 anos.',
      tags: ['RRF', 'responsabilidade fiscal', 'LC 159']
    },

    /* ── Civil / Empresarial (10) ────────────────────────────────── */
    {
      id: 'civ-01',
      discipline: 'Civil',
      front: 'Como identificar o prazo prescricional correto?',
      back: 'Primeiro qualifique a pretensão (natureza do direito violado). Busque prazo especial. Na ausência, prazo geral de 10 anos (art. 205, CC). Prazo contra a Fazenda: 5 anos (Decreto 20.910/32). Termo inicial: ciência inequívoca (actio nata).',
      tags: ['prescrição', 'prazos', 'actio nata']
    },
    {
      id: 'civ-02',
      discipline: 'Civil',
      front: 'Quando cabe revisão contratual por onerosidade excessiva?',
      back: 'Arts. 478-480, CC: fato extraordinário e imprevisível + onerosidade excessiva + extrema vantagem à outra parte. Inflação ou pandemia não revisam automaticamente — exige prova concreta de desequilíbrio e de que o risco não foi alocado.',
      tags: ['revisão contratual', 'onerosidade', 'CC']
    },
    {
      id: 'civ-03',
      discipline: 'Civil',
      front: 'Diferencie posse e propriedade sobre bens públicos.',
      back: 'Bens públicos são imprescritíveis (art. 183, §3º e 191, parágrafo único, CRFB) — vedada usucapião. Posse em bem público pode gerar direito a benfeitorias (art. 1.219, CC) e indenização, mas não propriedade. Reintegração é possível.',
      tags: ['bens públicos', 'posse', 'usucapião']
    },
    {
      id: 'civ-04',
      discipline: 'Civil',
      front: 'O crédito tributário se submete à recuperação judicial?',
      back: 'Não (art. 187, CTN + art. 6º, Lei 11.101/05). Crédito tributário é extraconcursal. A Fazenda cobra por execução fiscal. O parcelamento é condição para concessão da recuperação (art. 57). Multa tributária segue regra própria.',
      tags: ['recuperação judicial', 'crédito tributário', 'execução fiscal']
    },
    {
      id: 'civ-05',
      discipline: 'Civil',
      front: 'O que é a desconsideração da personalidade jurídica?',
      back: 'Art. 50, CC (alterado pela Lei 13.874/2019): exige abuso — desvio de finalidade ou confusão patrimonial. É objetiva quanto ao pressuposto, mas exige incidente processual (arts. 133-137, CPC). Não basta insolvência.',
      tags: ['desconsideração', 'personalidade jurídica', 'CC']
    },
    {
      id: 'civ-06',
      discipline: 'Civil',
      front: 'Responsabilidade civil por ato lícito do Estado?',
      back: 'Possível quando ato legal causa dano especial e anormal a particular (ex.: obra pública que inviabiliza comércio). Fundamento: igualdade dos ônus, não ilicitude. Indenização por dano emergente e lucros cessantes.',
      tags: ['responsabilidade civil', 'ato lícito', 'indenização']
    },
    {
      id: 'civ-07',
      discipline: 'Civil',
      front: 'O que é boa-fé objetiva e quais suas funções?',
      back: 'Art. 422, CC: dever de lealdade, cooperação e informação. Três funções: interpretativa (art. 113), integrativa (suprir lacunas) e limitativa (proibir abuso). Desdobramentos: venire contra factum proprium, supressio, surrectio, tu quoque.',
      tags: ['boa-fé', 'contratos', 'CC']
    },
    {
      id: 'civ-08',
      discipline: 'Civil',
      front: 'Como funciona a cessão fiduciária de recebíveis na recuperação?',
      back: 'Art. 49, §3º, Lei 11.101/05: crédito com garantia fiduciária não se submete à recuperação. O credor pode executar diretamente. Porém, se os recebíveis forem essenciais, o juízo pode limitar a constrição durante o stay period.',
      tags: ['cessão fiduciária', 'recuperação judicial', 'trava bancária']
    },
    {
      id: 'civ-09',
      discipline: 'Civil',
      front: 'Prescrição de ação indenizatória contra o Estado?',
      back: '5 anos (Decreto 20.910/32). STF e STJ consolidaram esse prazo, afastando o prazo trienal do CC (art. 206, §3º, V) para ações contra a Fazenda. Termo inicial: ciência inequívoca do dano. Interrupção recomeça pela metade.',
      tags: ['prescrição', 'Fazenda Pública', 'indenização']
    },
    {
      id: 'civ-10',
      discipline: 'Civil',
      front: 'O que é intervenção mínima nos contratos (art. 421-A, CC)?',
      back: 'Lei 13.874/2019: em contratos paritários, presume-se paridade e simetria. A revisão judicial é excepcional. Respeita-se a alocação de riscos definida pelas partes. Não se aplica automaticamente a contratos administrativos ou de consumo.',
      tags: ['intervenção mínima', 'liberdade contratual', 'Lei 13.874']
    },

    /* ── Trabalho / Previdência / PGE (10) ───────────────────────── */
    {
      id: 'trab-01',
      discipline: 'Trabalho',
      front: 'Empregado de empresa estatal tem estabilidade do art. 41, CRFB?',
      back: 'Não. Empregado público é celetista (art. 173, §1º, II, CRFB). Não tem estabilidade estatutária. Porém, STF (RE 688.267): a dispensa deve ser motivada (não arbitrária). Motivação não é estabilidade — é dever de fundamentação.',
      tags: ['empregado público', 'estabilidade', 'STF']
    },
    {
      id: 'trab-02',
      discipline: 'Trabalho',
      front: 'Contribuição assistencial pode ser cobrada de não filiados?',
      back: 'STF (ARE 1.018.459, Tema 935): sim, desde que haja assembleia, direito de oposição e não abusividade. Superou entendimento anterior. Acompanhar modulação e regulamentação.',
      tags: ['contribuição sindical', 'STF', 'Tema 935']
    },
    {
      id: 'trab-03',
      discipline: 'Trabalho',
      front: 'Qual a competência para julgar litígio de servidor estatutário?',
      back: 'Justiça Comum (Estadual ou Federal, conforme o ente). ADI 3.395/STF: a Justiça do Trabalho não tem competência para regime estatutário. Se o vínculo é celetista (empresa estatal), competência da JT.',
      tags: ['competência', 'servidor', 'Justiça do Trabalho']
    },
    {
      id: 'trab-04',
      discipline: 'Trabalho',
      front: 'O parecerista pode ser responsabilizado pelo ato administrativo?',
      back: 'STF (MS 24.631): parecer é opinião técnica, não decisão. Responsabilização exige dolo, fraude ou erro grosseiro (art. 28, LINDB). Parecer obrigatório/vinculante pode gerar responsabilidade compartilhada. O contexto informacional importa.',
      tags: ['parecerista', 'responsabilidade', 'LINDB']
    },
    {
      id: 'trab-05',
      discipline: 'Trabalho',
      front: 'O que mudou com a EC 103/2019 para servidores estaduais?',
      back: 'Idade mínima: 62 (M) e 65 (H). Cálculo: média de 100% das contribuições × alíquota progressiva. Fim da paridade para novos servidores. Regras de transição preservam direitos adquiridos. Estado deve regulamentar por lei própria.',
      tags: ['EC 103', 'previdência', 'reforma']
    },
    {
      id: 'trab-06',
      discipline: 'Trabalho',
      front: 'Servidor pode acumular cargos?',
      back: 'Art. 37, XVI, CRFB: vedada acumulação, exceto: 2 de professor; 1 professor + 1 técnico/científico; 2 na saúde com profissão regulamentada. Compatibilidade de horários é indispensável. Não se aplica entre emprego privado e cargo público.',
      tags: ['acumulação', 'servidor', 'CRFB']
    },
    {
      id: 'trab-07',
      discipline: 'Trabalho',
      front: 'Responsabilidade subsidiária da Administração por terceirizados?',
      back: 'Súmula 331, IV, TST: Administração responde subsidiariamente se não fiscalizou o contrato. ADC 16/STF: constitucional a vedação de responsabilidade automática (art. 71, Lei 8.666). Exige prova de culpa in vigilando.',
      tags: ['terceirização', 'responsabilidade subsidiária', 'Súmula 331']
    },
    {
      id: 'trab-08',
      discipline: 'Trabalho',
      front: 'O que é tempo de contribuição e como se averba?',
      back: 'Período em que houve contribuição previdenciária. Averbação: contagem de tempo de regime diverso (CPC, RPPS, RGPS). Compensação financeira entre regimes (Lei 9.796/99). Não se confunde com tempo de serviço.',
      tags: ['averbação', 'tempo de contribuição', 'previdência']
    },
    {
      id: 'trab-09',
      discipline: 'Trabalho',
      front: 'Servidor temporário tem direito a FGTS e verbas celetistas?',
      back: 'Em regra, não — o vínculo é administrativo (art. 37, IX, CRFB). Se a contratação for nula (sem processo seletivo), STF/TST: apenas saldo de salários e FGTS (Súmula 363/TST). Não gera vínculo empregatício com o Poder Público.',
      tags: ['servidor temporário', 'FGTS', 'contratação nula']
    },
    {
      id: 'trab-10',
      discipline: 'Trabalho',
      front: 'Princípios institucionais da PGE: quais são?',
      back: 'Unidade, indivisibilidade e independência funcional (por analogia ao MP e Advocacia Pública). O Procurador atua com independência técnica, mas vinculado ao interesse público primário. Deve delimitar consulta, riscos e condicionantes no parecer.',
      tags: ['PGE', 'princípios institucionais', 'Advocacia Pública']
    }
  ];

  /* ================================================================
     2. ALGORITMO SM-2 SIMPLIFICADO
     ================================================================ */

  /**
   * Retorna o estado padrão para um card novo.
   */
  function defaultCardState () {
    return {
      interval: 1,        // dias até próxima revisão
      easeFactor: 2.5,     // fator de facilidade
      repetitions: 0,      // sequência de acertos
      nextReview: today()  // data ISO da próxima revisão
    };
  }

  /**
   * Retorna a data de hoje no formato YYYY-MM-DD.
   */
  function today () {
    return new Date().toISOString().slice(0, 10);
  }

  /**
   * Atualiza o estado do card conforme a qualidade da resposta.
   * quality: 'hard' | 'good' | 'easy'
   */
  function sm2Update (state, quality) {
    var s = Object.assign({}, state);
    var now = new Date();

    if (quality === 'hard') {
      // Reseta — revisa amanhã
      s.repetitions = 0;
      s.interval = 1;
      s.easeFactor = Math.max(1.3, s.easeFactor - 0.2);
    } else if (quality === 'good') {
      s.repetitions += 1;
      if (s.repetitions === 1) {
        s.interval = 1;
      } else if (s.repetitions === 2) {
        s.interval = 3;
      } else {
        s.interval = Math.round(s.interval * s.easeFactor);
      }
      s.easeFactor = Math.max(1.3, s.easeFactor + 0.0);
    } else if (quality === 'easy') {
      s.repetitions += 1;
      if (s.repetitions === 1) {
        s.interval = 2;
      } else if (s.repetitions === 2) {
        s.interval = 4;
      } else {
        s.interval = Math.round(s.interval * s.easeFactor * 1.3);
      }
      s.easeFactor = Math.max(1.3, s.easeFactor + 0.15);
    }

    var next = new Date(now);
    next.setDate(next.getDate() + s.interval);
    s.nextReview = next.toISOString().slice(0, 10);
    return s;
  }

  /* ================================================================
     3. PERSISTÊNCIA — localStorage
     ================================================================ */

  function loadStates () {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveStates (states) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(states));
    } catch (e) { /* silently ignore */ }
  }

  function getCardState (states, cardId) {
    return states[cardId] || defaultCardState();
  }

  /* ================================================================
     4. ESTADO DA APLICAÇÃO
     ================================================================ */
  var appState = {
    states: loadStates(),
    activeDiscipline: null,   // null = todas
    onlyDue: false,
    queue: [],
    currentIndex: 0,
    revealed: false,
    reviewedToday: loadReviewedToday()
  };

  function loadReviewedToday () {
    try {
      var raw = localStorage.getItem(STORAGE_KEY + '-reviewed');
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed.date === today()) return parsed.ids;
      }
    } catch (e) { /* ignore */ }
    return [];
  }

  function saveReviewedToday () {
    try {
      localStorage.setItem(STORAGE_KEY + '-reviewed', JSON.stringify({
        date: today(),
        ids: appState.reviewedToday
      }));
    } catch (e) { /* ignore */ }
  }

  /* ================================================================
     5. QUEUE MANAGEMENT
     ================================================================ */

  function buildQueue () {
    var d = today();
    var filtered = CARDS.filter(function (c) {
      if (appState.activeDiscipline && c.discipline !== appState.activeDiscipline) return false;
      if (appState.onlyDue) {
        var st = getCardState(appState.states, c.id);
        return st.nextReview <= d;
      }
      return true;
    });
    // Shuffle
    for (var i = filtered.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = filtered[i];
      filtered[i] = filtered[j];
      filtered[j] = tmp;
    }
    // Sort: due first
    filtered.sort(function (a, b) {
      var sa = getCardState(appState.states, a.id);
      var sb = getCardState(appState.states, b.id);
      var da = sa.nextReview <= d ? 0 : 1;
      var db = sb.nextReview <= d ? 0 : 1;
      return da - db;
    });
    appState.queue = filtered;
    appState.currentIndex = 0;
    appState.revealed = false;
  }

  /* ================================================================
     6. ESTATÍSTICAS
     ================================================================ */

  function computeStats () {
    var d = today();
    var total = 0;
    var due = 0;
    var mastered = 0;
    var source = appState.activeDiscipline
      ? CARDS.filter(function (c) { return c.discipline === appState.activeDiscipline; })
      : CARDS;

    source.forEach(function (c) {
      total++;
      var st = getCardState(appState.states, c.id);
      if (st.nextReview <= d) due++;
      if (st.repetitions >= 5 && st.interval >= 21) mastered++;
    });

    return {
      total: total,
      due: due,
      reviewed: appState.reviewedToday.length,
      mastered: mastered
    };
  }

  /* ================================================================
     7. INJEÇÃO DE ESTILOS
     ================================================================ */

  function injectStyles () {
    if (document.getElementById('fc-styles')) return;
    var style = document.createElement('style');
    style.id = 'fc-styles';
    style.textContent = [
      '/* ── Flashcard System Styles ─────────────────────────── */',

      '#flashcard-controls {',
      '  display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center;',
      '  margin-bottom: 1.5rem;',
      '}',

      '.fc-filter-btn {',
      '  padding: 0.45rem 1rem; border-radius: 9999px; border: 2px solid transparent;',
      '  font-size: 0.82rem; font-weight: 600; cursor: pointer;',
      '  transition: all 0.25s cubic-bezier(.4,0,.2,1);',
      '  letter-spacing: 0.01em;',
      '}',
      '.fc-filter-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,.12); }',
      '.fc-filter-btn.active { color: #fff !important; border-color: transparent !important; transform: scale(1.05); }',

      '.fc-due-btn {',
      '  padding: 0.45rem 1.2rem; border-radius: 9999px; border: 2px solid #f59e0b;',
      '  background: transparent; color: #f59e0b; font-weight: 600; font-size: 0.82rem;',
      '  cursor: pointer; transition: all 0.25s;',
      '}',
      '.fc-due-btn:hover { background: #f59e0b; color: #fff; }',
      '.fc-due-btn.active { background: #f59e0b; color: #fff; }',

      '.fc-reset-btn {',
      '  padding: 0.45rem 1rem; border-radius: 9999px; border: 2px solid #ef4444;',
      '  background: transparent; color: #ef4444; font-weight: 600; font-size: 0.82rem;',
      '  cursor: pointer; transition: all 0.25s; margin-left: auto;',
      '}',
      '.fc-reset-btn:hover { background: #ef4444; color: #fff; }',

      /* ── Card Stage ── */
      '#flashcard-stage {',
      '  perspective: 1200px; min-height: 340px; display: flex;',
      '  align-items: center; justify-content: center; margin-bottom: 1.5rem;',
      '}',

      '.fc-card-wrapper {',
      '  width: 100%; max-width: 680px; min-height: 300px;',
      '  position: relative; cursor: pointer;',
      '}',

      '.fc-card-inner {',
      '  position: relative; width: 100%; min-height: 300px;',
      '  transition: transform 0.6s cubic-bezier(.4,0,.2,1);',
      '  transform-style: preserve-3d;',
      '}',
      '.fc-card-inner.flipped { transform: rotateY(180deg); }',

      '.fc-card-face {',
      '  position: absolute; top: 0; left: 0; width: 100%; min-height: 300px;',
      '  backface-visibility: hidden; -webkit-backface-visibility: hidden;',
      '  border-radius: 1.2rem; padding: 2rem 2.2rem;',
      '  display: flex; flex-direction: column; justify-content: center;',
      '  box-shadow: 0 8px 32px rgba(0,0,0,.08), 0 1px 4px rgba(0,0,0,.04);',
      '  overflow-wrap: break-word; word-wrap: break-word;',
      '}',

      '.fc-front {',
      '  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);',
      '  color: #e0e7ff;',
      '}',

      '.fc-back {',
      '  transform: rotateY(180deg);',
      '  background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #d1fae5 100%);',
      '  color: #064e3b;',
      '}',

      '.fc-discipline-badge {',
      '  display: inline-block; padding: 0.25rem 0.85rem; border-radius: 9999px;',
      '  font-size: 0.72rem; font-weight: 700; text-transform: uppercase;',
      '  letter-spacing: 0.06em; margin-bottom: 1rem; align-self: flex-start;',
      '}',

      '.fc-front .fc-discipline-badge { background: rgba(255,255,255,.15); color: #c7d2fe; }',
      '.fc-back .fc-discipline-badge { background: rgba(5,150,105,.12); color: #047857; }',

      '.fc-question {',
      '  font-size: 1.15rem; line-height: 1.6; font-weight: 500;',
      '}',

      '.fc-answer {',
      '  font-size: 1.02rem; line-height: 1.7; font-weight: 400;',
      '}',

      '.fc-tags {',
      '  display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 1.2rem;',
      '}',
      '.fc-tag {',
      '  padding: 0.15rem 0.6rem; border-radius: 9999px; font-size: 0.68rem;',
      '  font-weight: 600;',
      '}',
      '.fc-front .fc-tag { background: rgba(255,255,255,.1); color: #a5b4fc; }',
      '.fc-back .fc-tag { background: rgba(5,150,105,.08); color: #059669; }',

      '.fc-reveal-hint {',
      '  text-align: center; font-size: 0.78rem; color: #94a3b8; margin-top: 0.8rem;',
      '  opacity: 0.7;',
      '}',

      /* ── Reveal Button ── */
      '.fc-reveal-btn {',
      '  display: block; margin: 1.2rem auto 0; padding: 0.7rem 2.5rem;',
      '  border-radius: 9999px; border: none; font-size: 0.95rem; font-weight: 700;',
      '  background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff;',
      '  cursor: pointer; transition: all 0.3s; letter-spacing: 0.02em;',
      '  box-shadow: 0 4px 15px rgba(99,102,241,.35);',
      '}',
      '.fc-reveal-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(99,102,241,.5); }',

      /* ── Rating Buttons ── */
      '.fc-rating-bar {',
      '  display: flex; justify-content: center; gap: 0.8rem; margin-top: 1.2rem;',
      '  flex-wrap: wrap;',
      '}',
      '.fc-rate-btn {',
      '  padding: 0.65rem 1.6rem; border-radius: 9999px; border: none;',
      '  font-size: 0.88rem; font-weight: 700; cursor: pointer;',
      '  transition: all 0.25s; letter-spacing: 0.01em;',
      '}',
      '.fc-rate-btn:hover { transform: translateY(-2px); }',
      '.fc-rate-hard {',
      '  background: linear-gradient(135deg, #ef4444, #dc2626); color: #fff;',
      '  box-shadow: 0 4px 12px rgba(239,68,68,.3);',
      '}',
      '.fc-rate-good {',
      '  background: linear-gradient(135deg, #f59e0b, #d97706); color: #fff;',
      '  box-shadow: 0 4px 12px rgba(245,158,11,.3);',
      '}',
      '.fc-rate-easy {',
      '  background: linear-gradient(135deg, #10b981, #059669); color: #fff;',
      '  box-shadow: 0 4px 12px rgba(16,185,129,.3);',
      '}',
      '.fc-rate-btn .fc-rate-sub {',
      '  display: block; font-size: 0.65rem; font-weight: 400; opacity: 0.85; margin-top: 0.15rem;',
      '}',

      /* ── Navigation ── */
      '.fc-nav-bar {',
      '  display: flex; justify-content: center; align-items: center; gap: 1rem;',
      '  margin-top: 1rem;',
      '}',
      '.fc-nav-btn {',
      '  padding: 0.5rem 1.2rem; border-radius: 9999px; border: 2px solid #64748b;',
      '  background: transparent; color: #64748b; font-weight: 600; font-size: 0.82rem;',
      '  cursor: pointer; transition: all 0.25s;',
      '}',
      '.fc-nav-btn:hover { background: #64748b; color: #fff; }',
      '.fc-nav-btn:disabled { opacity: 0.35; cursor: not-allowed; }',
      '.fc-nav-btn:disabled:hover { background: transparent; color: #64748b; }',
      '.fc-nav-counter {',
      '  font-size: 0.85rem; font-weight: 600; color: #94a3b8;',
      '}',

      /* ── Stats ── */
      '#flashcard-stats {',
      '  display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));',
      '  gap: 1rem; margin-top: 1rem;',
      '}',
      '.fc-stat-card {',
      '  border-radius: 1rem; padding: 1.2rem; text-align: center;',
      '  background: rgba(255,255,255,.04);',
      '  border: 1px solid rgba(255,255,255,.08);',
      '  backdrop-filter: blur(8px);',
      '  box-shadow: 0 2px 8px rgba(0,0,0,.04);',
      '}',
      '.fc-stat-value {',
      '  font-size: 1.8rem; font-weight: 800; line-height: 1;',
      '  background: linear-gradient(135deg, #6366f1, #a855f7);',
      '  -webkit-background-clip: text; -webkit-text-fill-color: transparent;',
      '  background-clip: text;',
      '}',
      '.fc-stat-label {',
      '  font-size: 0.75rem; font-weight: 600; text-transform: uppercase;',
      '  letter-spacing: 0.08em; margin-top: 0.4rem; opacity: 0.6;',
      '}',

      /* ── Empty State ── */
      '.fc-empty {',
      '  text-align: center; padding: 3rem 1rem; color: #94a3b8;',
      '}',
      '.fc-empty-icon { font-size: 3rem; margin-bottom: 0.8rem; }',
      '.fc-empty-title { font-size: 1.2rem; font-weight: 700; margin-bottom: 0.4rem; }',
      '.fc-empty-sub { font-size: 0.88rem; opacity: 0.7; }',

      /* ── Progress Bar ── */
      '.fc-progress-wrap {',
      '  width: 100%; max-width: 680px; margin: 0 auto 1.2rem; height: 6px;',
      '  background: rgba(255,255,255,.08); border-radius: 9999px; overflow: hidden;',
      '}',
      '.fc-progress-fill {',
      '  height: 100%; border-radius: 9999px; transition: width 0.5s cubic-bezier(.4,0,.2,1);',
      '  background: linear-gradient(90deg, #6366f1, #a855f7, #ec4899);',
      '}',

      /* ── Animations ── */
      '@keyframes fcFadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }',
      '.fc-fade-in { animation: fcFadeIn 0.4s ease-out both; }',

      /* ── Responsive ── */
      '@media (max-width: 640px) {',
      '  .fc-card-face { padding: 1.4rem 1.2rem; min-height: 260px; }',
      '  .fc-question { font-size: 1rem; }',
      '  .fc-answer { font-size: 0.92rem; }',
      '  .fc-rating-bar { gap: 0.5rem; }',
      '  .fc-rate-btn { padding: 0.55rem 1.1rem; font-size: 0.8rem; }',
      '}'
    ].join('\n');
    document.head.appendChild(style);
  }

  /* ================================================================
     8. RENDERIZAÇÃO
     ================================================================ */

  var $controls, $stage, $stats;

  function getContainers () {
    $controls = document.getElementById('flashcard-controls');
    $stage    = document.getElementById('flashcard-stage');
    $stats    = document.getElementById('flashcard-stats');
  }

  /* ── Controls ── */
  function renderControls () {
    if (!$controls) return;
    $controls.innerHTML = '';

    // "Todas" button
    var allBtn = document.createElement('button');
    allBtn.className = 'fc-filter-btn' + (!appState.activeDiscipline ? ' active' : '');
    allBtn.textContent = 'Todas';
    allBtn.style.background = !appState.activeDiscipline ? '#475569' : 'rgba(255,255,255,.06)';
    allBtn.style.color = !appState.activeDiscipline ? '#fff' : '#94a3b8';
    allBtn.style.borderColor = '#475569';
    allBtn.addEventListener('click', function () {
      appState.activeDiscipline = null;
      buildQueue();
      renderAll();
    });
    $controls.appendChild(allBtn);

    // Discipline buttons
    DISCIPLINES.forEach(function (disc) {
      var colors = DISCIPLINE_COLORS[disc];
      var isActive = appState.activeDiscipline === disc;
      var btn = document.createElement('button');
      btn.className = 'fc-filter-btn' + (isActive ? ' active' : '');
      btn.textContent = disc;
      btn.style.background = isActive ? colors.bg : colors.light;
      btn.style.color = isActive ? '#fff' : colors.text;
      btn.style.borderColor = colors.bg;
      btn.addEventListener('click', function () {
        appState.activeDiscipline = disc;
        buildQueue();
        renderAll();
      });
      $controls.appendChild(btn);
    });

    // Due button
    var dueBtn = document.createElement('button');
    dueBtn.className = 'fc-due-btn' + (appState.onlyDue ? ' active' : '');
    dueBtn.textContent = '⏰ Revisar pendentes';
    dueBtn.addEventListener('click', function () {
      appState.onlyDue = !appState.onlyDue;
      buildQueue();
      renderAll();
    });
    $controls.appendChild(dueBtn);

    // Reset button
    var resetBtn = document.createElement('button');
    resetBtn.className = 'fc-reset-btn';
    resetBtn.textContent = '↺ Resetar progresso';
    resetBtn.addEventListener('click', function () {
      if (confirm('Tem certeza? Todo o progresso será perdido.')) {
        appState.states = {};
        appState.reviewedToday = [];
        saveStates({});
        saveReviewedToday();
        buildQueue();
        renderAll();
      }
    });
    $controls.appendChild(resetBtn);
  }

  /* ── Card ── */
  function renderCard () {
    if (!$stage) return;
    $stage.innerHTML = '';

    if (appState.queue.length === 0) {
      var empty = document.createElement('div');
      empty.className = 'fc-empty fc-fade-in';
      empty.innerHTML = appState.onlyDue
        ? '<div class="fc-empty-icon">🎉</div><div class="fc-empty-title">Nenhum card pendente!</div><div class="fc-empty-sub">Volte mais tarde ou desative o filtro de pendentes.</div>'
        : '<div class="fc-empty-icon">📚</div><div class="fc-empty-title">Nenhum card encontrado</div><div class="fc-empty-sub">Ajuste os filtros para ver seus flashcards.</div>';
      $stage.appendChild(empty);
      return;
    }

    var card = appState.queue[appState.currentIndex];
    if (!card) {
      appState.currentIndex = 0;
      card = appState.queue[0];
    }
    var st = getCardState(appState.states, card.id);
    var colors = DISCIPLINE_COLORS[card.discipline] || DISCIPLINE_COLORS.Administrativo;
    var isDue = st.nextReview <= today();

    // Progress bar
    var progWrap = document.createElement('div');
    progWrap.className = 'fc-progress-wrap';
    var progFill = document.createElement('div');
    progFill.className = 'fc-progress-fill';
    var pct = appState.queue.length > 0
      ? ((appState.currentIndex + 1) / appState.queue.length * 100)
      : 0;
    progFill.style.width = pct + '%';
    progWrap.appendChild(progFill);
    $stage.appendChild(progWrap);

    // Card wrapper
    var wrapper = document.createElement('div');
    wrapper.className = 'fc-card-wrapper fc-fade-in';

    var inner = document.createElement('div');
    inner.className = 'fc-card-inner' + (appState.revealed ? ' flipped' : '');

    // Front face
    var front = document.createElement('div');
    front.className = 'fc-card-face fc-front';
    front.innerHTML =
      '<span class="fc-discipline-badge">' + escHtml(card.discipline) + '</span>' +
      '<div class="fc-question">' + escHtml(card.front) + '</div>' +
      '<div class="fc-tags">' + card.tags.map(function (t) {
        return '<span class="fc-tag">' + escHtml(t) + '</span>';
      }).join('') + '</div>';

    // Back face
    var back = document.createElement('div');
    back.className = 'fc-card-face fc-back';
    back.innerHTML =
      '<span class="fc-discipline-badge">' + escHtml(card.discipline) + ' — Resposta</span>' +
      '<div class="fc-answer">' + escHtml(card.back) + '</div>' +
      '<div class="fc-tags">' + card.tags.map(function (t) {
        return '<span class="fc-tag">' + escHtml(t) + '</span>';
      }).join('') + '</div>';

    inner.appendChild(front);
    inner.appendChild(back);
    wrapper.appendChild(inner);
    $stage.appendChild(wrapper);

    // Action area
    if (!appState.revealed) {
      // Reveal button
      var revealBtn = document.createElement('button');
      revealBtn.className = 'fc-reveal-btn';
      revealBtn.textContent = 'Revelar';
      revealBtn.addEventListener('click', function () {
        appState.revealed = true;
        renderCard();
      });
      $stage.appendChild(revealBtn);

      var hint = document.createElement('div');
      hint.className = 'fc-reveal-hint';
      hint.textContent = 'Clique no card ou no botão para revelar a resposta';
      $stage.appendChild(hint);

      // Click card to flip
      wrapper.addEventListener('click', function () {
        appState.revealed = true;
        renderCard();
      });
    } else {
      // Rating buttons
      var ratingBar = document.createElement('div');
      ratingBar.className = 'fc-rating-bar fc-fade-in';

      var ratings = [
        { key: 'hard', label: 'Difícil',  cls: 'fc-rate-hard', sub: '1 dia' },
        { key: 'good', label: 'Bom',      cls: 'fc-rate-good', sub: previewInterval(st, 'good') },
        { key: 'easy', label: 'Fácil',    cls: 'fc-rate-easy', sub: previewInterval(st, 'easy') }
      ];

      ratings.forEach(function (r) {
        var btn = document.createElement('button');
        btn.className = 'fc-rate-btn ' + r.cls;
        btn.innerHTML = r.label + '<span class="fc-rate-sub">' + r.sub + '</span>';
        btn.addEventListener('click', function () {
          rateCard(card.id, r.key);
        });
        ratingBar.appendChild(btn);
      });
      $stage.appendChild(ratingBar);
    }

    // Navigation
    var nav = document.createElement('div');
    nav.className = 'fc-nav-bar';

    var prevBtn = document.createElement('button');
    prevBtn.className = 'fc-nav-btn';
    prevBtn.textContent = '← Anterior';
    prevBtn.disabled = appState.currentIndex <= 0;
    prevBtn.addEventListener('click', function () {
      if (appState.currentIndex > 0) {
        appState.currentIndex--;
        appState.revealed = false;
        renderCard();
      }
    });
    nav.appendChild(prevBtn);

    var counter = document.createElement('span');
    counter.className = 'fc-nav-counter';
    counter.textContent = (appState.currentIndex + 1) + ' / ' + appState.queue.length;
    nav.appendChild(counter);

    var nextBtn = document.createElement('button');
    nextBtn.className = 'fc-nav-btn';
    nextBtn.textContent = 'Próximo →';
    nextBtn.disabled = appState.currentIndex >= appState.queue.length - 1;
    nextBtn.addEventListener('click', function () {
      if (appState.currentIndex < appState.queue.length - 1) {
        appState.currentIndex++;
        appState.revealed = false;
        renderCard();
      }
    });
    nav.appendChild(nextBtn);

    $stage.appendChild(nav);
  }

  /* ── Stats ── */
  function renderStats () {
    if (!$stats) return;
    var s = computeStats();
    $stats.innerHTML = '';

    var items = [
      { value: s.total,    label: 'Total de cards',    gradient: 'linear-gradient(135deg, #6366f1, #818cf8)' },
      { value: s.due,      label: 'Pendentes hoje',    gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)' },
      { value: s.reviewed, label: 'Revisados hoje',    gradient: 'linear-gradient(135deg, #10b981, #34d399)' },
      { value: s.mastered, label: 'Dominados',         gradient: 'linear-gradient(135deg, #a855f7, #c084fc)' }
    ];

    items.forEach(function (item) {
      var card = document.createElement('div');
      card.className = 'fc-stat-card fc-fade-in';

      var val = document.createElement('div');
      val.className = 'fc-stat-value';
      val.style.background = item.gradient;
      val.style.webkitBackgroundClip = 'text';
      val.style.webkitTextFillColor = 'transparent';
      val.style.backgroundClip = 'text';
      val.textContent = item.value;

      var lbl = document.createElement('div');
      lbl.className = 'fc-stat-label';
      lbl.textContent = item.label;

      card.appendChild(val);
      card.appendChild(lbl);
      $stats.appendChild(card);
    });
  }

  /* ── Render All ── */
  function renderAll () {
    renderControls();
    renderCard();
    renderStats();
  }

  /* ================================================================
     9. HELPERS
     ================================================================ */

  function escHtml (str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function previewInterval (state, quality) {
    var preview = sm2Update(state, quality);
    if (preview.interval === 1) return '1 dia';
    if (preview.interval < 30) return preview.interval + ' dias';
    if (preview.interval < 365) return Math.round(preview.interval / 30) + ' mês(es)';
    return Math.round(preview.interval / 365) + ' ano(s)';
  }

  function rateCard (cardId, quality) {
    var currentState = getCardState(appState.states, cardId);
    var newState = sm2Update(currentState, quality);
    appState.states[cardId] = newState;
    saveStates(appState.states);

    // Track reviewed
    if (appState.reviewedToday.indexOf(cardId) === -1) {
      appState.reviewedToday.push(cardId);
      saveReviewedToday();
    }

    // Move to next card
    appState.revealed = false;

    // If filtering only due, remove from queue if no longer due
    if (appState.onlyDue && newState.nextReview > today()) {
      appState.queue.splice(appState.currentIndex, 1);
      if (appState.currentIndex >= appState.queue.length) {
        appState.currentIndex = Math.max(0, appState.queue.length - 1);
      }
    } else {
      if (appState.currentIndex < appState.queue.length - 1) {
        appState.currentIndex++;
      } else {
        // Wrap around
        appState.currentIndex = 0;
      }
    }

    renderAll();
  }

  /* ================================================================
     10. INICIALIZAÇÃO
     ================================================================ */

  function init () {
    injectStyles();
    getContainers();
    if (!$controls && !$stage && !$stats) {
      console.warn('[Flashcards] Nenhum container encontrado (#flashcard-controls, #flashcard-stage, #flashcard-stats).');
      return;
    }
    buildQueue();
    renderAll();

    // Keyboard shortcuts
    document.addEventListener('keydown', function (e) {
      // Only respond if stage exists and is visible
      if (!$stage || !$stage.offsetParent) return;

      if (e.key === ' ' || e.key === 'Enter') {
        if (!appState.revealed && appState.queue.length > 0) {
          e.preventDefault();
          appState.revealed = true;
          renderCard();
        }
      } else if (e.key === '1' && appState.revealed) {
        e.preventDefault();
        var c = appState.queue[appState.currentIndex];
        if (c) rateCard(c.id, 'hard');
      } else if (e.key === '2' && appState.revealed) {
        e.preventDefault();
        var c2 = appState.queue[appState.currentIndex];
        if (c2) rateCard(c2.id, 'good');
      } else if (e.key === '3' && appState.revealed) {
        e.preventDefault();
        var c3 = appState.queue[appState.currentIndex];
        if (c3) rateCard(c3.id, 'easy');
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (appState.currentIndex > 0) {
          appState.currentIndex--;
          appState.revealed = false;
          renderCard();
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (appState.currentIndex < appState.queue.length - 1) {
          appState.currentIndex++;
          appState.revealed = false;
          renderCard();
        }
      }
    });
  }

  /* ── Wait for DOM ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
