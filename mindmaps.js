/**
 * mindmaps.js – Interactive CSS Mind Maps for PGE/RJ Exam Prep
 * Pure vanilla JS IIFE – no external dependencies.
 */
(function () {
  'use strict';

  /* ===================================================================
   *  DATA – 6 disciplines, each with branches split into left / right
   * =================================================================== */

  var disciplines = [
    {
      id: 'dir-administrativo',
      title: 'Direito Administrativo',
      icon: '⚖️',
      color: '#6366f1',
      left: [
        {
          topic: 'Contratos e Concessões',
          subs: [
            'Equilíbrio econômico-financeiro',
            'Reajuste e revisão contratual',
            'Matriz de riscos (Lei 14.133)',
            'PPP – Parceria Público-Privada',
            'Garantias e seguros'
          ]
        },
        {
          topic: 'Licitações',
          subs: [
            'Fase preparatória e planejamento',
            'Modalidades (Lei 14.133/21)',
            'Contratação direta: dispensa e inexigibilidade',
            'Registro de preços',
            'Critérios de julgamento'
          ]
        },
        {
          topic: 'Regulação e Serviços',
          subs: [
            'Tarifas e modicidade',
            'Agências reguladoras',
            'Universalização do serviço',
            'Delegação e concessão',
            'Poder normativo das agências'
          ]
        },
        {
          topic: 'Estatais e Desinvestimento',
          subs: [
            'Lei 13.303/16 – regime jurídico',
            'Governança e compliance',
            'Alienação de participações',
            'Desinvestimento e privatização',
            'Controle pelo TCE/TCU'
          ]
        }
      ],
      right: [
        {
          topic: 'Poder de Polícia',
          subs: [
            'Fases: ordem, consentimento, fiscalização, sanção',
            'Delegação a particulares',
            'Autoexecutoriedade e coercibilidade',
            'Proporcionalidade e razoabilidade',
            'Taxas de polícia'
          ]
        },
        {
          topic: 'Bens Públicos',
          subs: [
            'Classificação: uso comum, especial, dominical',
            'Uso privativo: autorização, permissão, concessão',
            'Ocupação e aforamento',
            'Tombamento e patrimônio cultural',
            'Inalienabilidade e impenhorabilidade'
          ]
        },
        {
          topic: 'Consensualidade / LINDB',
          subs: [
            'Acordo de leniência',
            'TAC – Termo de Ajustamento de Conduta',
            'Arts. 20-30 LINDB (segurança jurídica)',
            'Decisões em zonas de incerteza',
            'Regime de transição'
          ]
        },
        {
          topic: 'Responsabilidade Civil',
          subs: [
            'Teoria do risco administrativo',
            'Responsabilidade objetiva (art. 37, §6º)',
            'Omissão estatal – culpa anônima',
            'Ação regressiva',
            'Nexo de causalidade e excludentes'
          ]
        }
      ]
    },

    {
      id: 'proc-civil',
      title: 'Processual Civil',
      icon: '📜',
      color: '#0ea5e9',
      left: [
        {
          topic: 'Fazenda Pública em Juízo',
          subs: [
            'Prazos especiais (dobro)',
            'Intimação pessoal',
            'Remessa necessária',
            'Precatórios e RPV',
            'Dispensa de caução / garantias'
          ]
        },
        {
          topic: 'Mandado de Segurança',
          subs: [
            'Autoridade coatora – legitimidade',
            'Liminar contra Fazenda',
            'Prazo decadencial de 120 dias',
            'Lei 12.016/09 – aspectos processuais',
            'Mandado de segurança coletivo'
          ]
        },
        {
          topic: 'Tutelas e Contracautela',
          subs: [
            'Suspensão de segurança (SLS, STA, SS)',
            'Tutela provisória contra Fazenda',
            'Vedações legais (Lei 8.437)',
            'Efeito suspensivo automático',
            'Caução e contracautela'
          ]
        }
      ],
      right: [
        {
          topic: 'ACP – Ação Civil Pública',
          subs: [
            'Legitimidade ativa e concorrente',
            'Competência territorial',
            'Coisa julgada erga omnes / ultra partes',
            'Execução coletiva',
            'Inquérito civil e compromisso'
          ]
        },
        {
          topic: 'Execução e Medidas Atípicas',
          subs: [
            'Princípio da adequação',
            'Proporcionalidade na coerção',
            'Impenhorabilidade de bens públicos',
            'Multa cominatória e astreintes',
            'Medidas executivas atípicas (art. 139, IV)'
          ]
        },
        {
          topic: 'Precedentes e Arbitragem',
          subs: [
            'Vinculação de precedentes (CPC 927)',
            'Controle judicial de sentença arbitral',
            'Arbitragem envolvendo Fazenda (Lei 13.129)',
            'IRDR e IAC',
            'Distinguishing e overruling'
          ]
        },
        {
          topic: 'Juizados da Fazenda',
          subs: [
            'Valor da causa (até 60 SM)',
            'Competência absoluta',
            'Recursos – turma recursal',
            'Execução simplificada',
            'Vedações (mandado de segurança, ACP)'
          ]
        }
      ]
    },

    {
      id: 'constitucional',
      title: 'Constitucional',
      icon: '🏛️',
      color: '#f59e0b',
      left: [
        {
          topic: 'Controle de Constitucionalidade',
          subs: [
            'ADI – Ação Direta de Inconstitucionalidade',
            'ADPF – Arguição de Descumprimento',
            'ADC – Ação Declaratória de Constitucionalidade',
            'Modulação de efeitos',
            'Medida cautelar e liminar'
          ]
        },
        {
          topic: 'Federalismo',
          subs: [
            'Repartição de competências (arts. 21-24)',
            'Normas gerais da União',
            'Competência suplementar dos Estados',
            'Autonomia municipal',
            'Intervenção federal e estadual'
          ]
        },
        {
          topic: 'Políticas Públicas',
          subs: [
            'Mínimo existencial',
            'Reserva do possível',
            'Separação de poderes e ativismo',
            'Controle judicial de políticas',
            'Estado de coisas inconstitucional (ECI)'
          ]
        }
      ],
      right: [
        {
          topic: 'Direitos Fundamentais',
          subs: [
            'Proporcionalidade e razoabilidade',
            'Laicidade estatal',
            'Igualdade formal e material',
            'Eficácia horizontal',
            'Núcleo essencial e vedação ao retrocesso'
          ]
        },
        {
          topic: 'Poder Constituinte',
          subs: [
            'Originário – ilimitado, incondicionado',
            'Derivado reformador (EC)',
            'Limites: cláusulas pétreas (art. 60, §4º)',
            'Mutação constitucional',
            'Poder constituinte decorrente'
          ]
        },
        {
          topic: 'Tribunais de Contas',
          subs: [
            'Controle externo (art. 71)',
            'Princípio da juridicidade',
            'Efeitos das decisões',
            'Súmula 347 STF – cautelares',
            'Imputação de débito e multa'
          ]
        },
        {
          topic: 'Orçamento e Ordem Econômica',
          subs: [
            'LRF e responsabilidade fiscal',
            'Livre iniciativa e livre concorrência',
            'Intervenção estatal no domínio econômico',
            'Monopólios estatais',
            'PPA, LDO e LOA'
          ]
        }
      ]
    },

    {
      id: 'tributario',
      title: 'Tributário e Financeiro',
      icon: '💰',
      color: '#10b981',
      left: [
        {
          topic: 'ICMS',
          subs: [
            'Incidência – operações e prestações',
            'Base de cálculo e alíquotas',
            'Substituição tributária (ICMS-ST)',
            'Importação e ICMS',
            'Energia elétrica e combustíveis'
          ]
        },
        {
          topic: 'Benefícios e Guerra Fiscal',
          subs: [
            'Convênio CONFAZ (LC 24/75)',
            'Glosa de créditos',
            'Isonomia tributária',
            'Convalidação (LC 160/17)',
            'Incentivos condicionados e incondicionados'
          ]
        },
        {
          topic: 'Crédito Tributário',
          subs: [
            'Lançamento: modalidades',
            'Suspensão da exigibilidade (art. 151 CTN)',
            'Decadência (arts. 150, §4º e 173)',
            'Prescrição (art. 174 CTN)',
            'Extinção e exclusão do crédito'
          ]
        }
      ],
      right: [
        {
          topic: 'Execução Fiscal e CDA',
          subs: [
            'Certeza e liquidez do título',
            'Substituição e emenda da CDA',
            'Lei 6.830/80 – procedimento',
            'Exceção de pré-executividade',
            'Penhora e garantia do juízo'
          ]
        },
        {
          topic: 'Imunidades',
          subs: [
            'Imunidade recíproca (art. 150, VI, a)',
            'Imunidades religiosas e culturais',
            'Finalidade essencial',
            'Extensão às autarquias e fundações',
            'Distinção: imunidade vs isenção'
          ]
        },
        {
          topic: 'ITCMD',
          subs: [
            'Fato gerador – doação e causa mortis',
            'Competência estadual (art. 155, I)',
            'ITCMD no exterior – RE 851.108',
            'Lei complementar pendente',
            'Base de cálculo e progressividade'
          ]
        },
        {
          topic: 'LRF e RRF',
          subs: [
            'Renúncia de receita (art. 14 LRF)',
            'Impacto orçamentário-financeiro',
            'Vedações e limites de endividamento',
            'Metas fiscais e anexos',
            'Regime de Recuperação Fiscal (LC 159/17)'
          ]
        }
      ]
    },

    {
      id: 'civil-empresarial',
      title: 'Civil e Empresarial',
      icon: '📑',
      color: '#ec4899',
      left: [
        {
          topic: 'Prescrição',
          subs: [
            'Pretensão e actio nata',
            'Termo inicial e dies a quo',
            'Causas de interrupção (art. 202)',
            'Causas de suspensão / impedimento',
            'Prazos especiais e gerais (art. 205-206)'
          ]
        },
        {
          topic: 'Contratos',
          subs: [
            'Qualificação contratual',
            'Boa-fé objetiva (art. 422)',
            'Revisão por onerosidade excessiva',
            'Alocação de riscos',
            'Extinção e resolução'
          ]
        },
        {
          topic: 'Responsabilidade Civil',
          subs: [
            'Dano patrimonial e extrapatrimonial',
            'Nexo causal – teorias',
            'Excludentes de responsabilidade',
            'Quantificação e arbitramento',
            'Responsabilidade objetiva especial'
          ]
        }
      ],
      right: [
        {
          topic: 'Direitos Reais',
          subs: [
            'Posse – classificação e efeitos',
            'Direito de superfície',
            'Servidão e usufruto',
            'Usucapião – espécies e prazos',
            'Propriedade fiduciária'
          ]
        },
        {
          topic: 'Sociedades e Estatais',
          subs: [
            'Personalidade jurídica e desconsideração',
            'Governança corporativa',
            'Controle acionário estatal',
            'SEM e EP – regime híbrido',
            'Responsabilidade dos administradores'
          ]
        },
        {
          topic: 'Recuperação Judicial',
          subs: [
            'Classes de credores',
            'Créditos concursais e extraconcursais',
            'Credor fiduciário – exclusão',
            'Plano de recuperação e aprovação',
            'Efeitos sobre a Fazenda'
          ]
        },
        {
          topic: 'Qualificação Contratual',
          subs: [
            'Realidade econômica da operação',
            'Prestação nuclear do contrato',
            'Contratos coligados e conexos',
            'Contratos atípicos e mistos',
            'Interpretação e integração'
          ]
        }
      ]
    },

    {
      id: 'trabalho-prev',
      title: 'Trabalho / Previdência / PGE',
      icon: '👷',
      color: '#f97316',
      left: [
        {
          topic: 'Empregado Público',
          subs: [
            'Natureza do vínculo celetista',
            'Regime CLT aplicado à Administração',
            'Concurso público obrigatório',
            'Regime temporal de contratação',
            'Despedida motivada e imotivada'
          ]
        },
        {
          topic: 'Competência',
          subs: [
            'Estatutário – Justiça Comum',
            'Celetista – Justiça do Trabalho',
            'Temporário – controvérsias',
            'Ações acidentárias',
            'Complementação de aposentadoria'
          ]
        },
        {
          topic: 'Responsabilidade Subsidiária',
          subs: [
            'Súmula 331 TST – requisitos',
            'Fiscalização pelo ente público',
            'Ônus da prova (culpa in vigilando)',
            'ADPF 324 e RE 958.252 (terceirização)',
            'Limites da condenação subsidiária'
          ]
        }
      ],
      right: [
        {
          topic: 'Contribuições Sindicais',
          subs: [
            'Espécies (confederativa, assistencial)',
            'Necessidade de autorização prévia',
            'Reforma trabalhista (Lei 13.467/17)',
            'Jurisprudência TST e STF',
            'Contribuição negocial'
          ]
        },
        {
          topic: 'RPPS',
          subs: [
            'Paridade e integralidade (regras antigas)',
            'Regras de transição (EC 41, 47, 103)',
            'EC 103/2019 – Reforma da Previdência',
            'Tempo de contribuição e idade mínima',
            'Aposentadoria especial do servidor'
          ]
        },
        {
          topic: 'Acumulação',
          subs: [
            'Cargos acumuláveis (art. 37, XVI)',
            'Compatibilidade de horários',
            'Averbação de tempo de contribuição',
            'Acumulação de proventos e vencimentos',
            'Teto remuneratório e acumulação'
          ]
        },
        {
          topic: 'Parecerista',
          subs: [
            'Opinião jurídica vs decisão',
            'Erro grosseiro e má-fé',
            'Independência funcional',
            'Responsabilização pelo TCU/TCE',
            'Súmula vinculante e parecerista'
          ]
        }
      ]
    }
  ];

  /* ===================================================================
   *  RENDER HELPERS
   * =================================================================== */

  /**
   * Create a DOM element with optional class(es) and textContent.
   */
  function el(tag, classes, text) {
    var node = document.createElement(tag);
    if (classes) {
      classes.split(' ').forEach(function (c) { if (c) node.classList.add(c); });
    }
    if (text !== undefined) node.textContent = text;
    return node;
  }

  /**
   * Build a single branch (topic node + sub-topics).
   * @param {object}  branch   – { topic, subs }
   * @param {string}  side     – 'left' | 'right'
   * @param {number}  index    – branch index (for stagger animation)
   * @param {string}  color    – accent colour
   */
  function buildBranch(branch, side, index, color) {
    var wrapper = el('div', 'mm-branch mm-' + side);
    wrapper.style.setProperty('--branch-index', index);
    wrapper.style.setProperty('--branch-color', color);

    // Topic node (clickable)
    var node = el('div', 'mm-node');
    node.textContent = branch.topic;
    node.setAttribute('data-expanded', 'true');
    node.setAttribute('tabindex', '0');
    node.setAttribute('role', 'button');
    node.setAttribute('aria-expanded', 'true');
    node.style.setProperty('--branch-color', color);

    // Sub-topics container
    var subContainer = el('div', 'mm-sub');
    subContainer.style.setProperty('--branch-color', color);

    branch.subs.forEach(function (s) {
      var leaf = el('div', 'mm-leaf', s);
      leaf.style.setProperty('--branch-color', color);
      subContainer.appendChild(leaf);
    });

    // Toggle handler
    function toggle() {
      var expanded = node.getAttribute('data-expanded') === 'true';
      node.setAttribute('data-expanded', String(!expanded));
      node.setAttribute('aria-expanded', String(!expanded));
      subContainer.classList.toggle('mm-collapsed', expanded);
    }
    node.addEventListener('click', toggle);
    node.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });

    // Connector line (visual)
    var connector = el('div', 'mm-connector');
    connector.style.setProperty('--branch-color', color);

    if (side === 'left') {
      wrapper.appendChild(subContainer);
      wrapper.appendChild(node);
      wrapper.appendChild(connector);
    } else {
      wrapper.appendChild(connector);
      wrapper.appendChild(node);
      wrapper.appendChild(subContainer);
    }

    return wrapper;
  }

  /**
   * Build the full mind map for a discipline.
   */
  function buildMap(disc) {
    var map = el('div', 'mindmap');
    map.setAttribute('data-discipline', disc.id);

    // Left branches column
    var leftCol = el('div', 'mm-col mm-col-left');
    disc.left.forEach(function (b, i) {
      leftCol.appendChild(buildBranch(b, 'left', i, disc.color));
    });

    // Central node
    var center = el('div', 'mm-center');
    center.style.setProperty('--center-color', disc.color);
    var centerIcon = el('span', 'mm-center-icon', disc.icon);
    var centerTitle = el('span', 'mm-center-title', disc.title);
    center.appendChild(centerIcon);
    center.appendChild(centerTitle);

    // Right branches column
    var rightCol = el('div', 'mm-col mm-col-right');
    disc.right.forEach(function (b, i) {
      rightCol.appendChild(buildBranch(b, 'right', i, disc.color));
    });

    map.appendChild(leftCol);
    map.appendChild(center);
    map.appendChild(rightCol);

    return map;
  }

  /* ===================================================================
   *  TAB & MAP CONTROLLER
   * =================================================================== */

  function init() {
    var tabsContainer = document.getElementById('mindmap-tabs');
    var mapContainer  = document.getElementById('mindmap-container');

    if (!tabsContainer || !mapContainer) return; // silently bail if containers absent

    var activeIdx = 0;

    /**
     * Render tabs and attach click handlers.
     */
    function renderTabs() {
      tabsContainer.innerHTML = '';
      disciplines.forEach(function (disc, idx) {
        var btn = el('button', 'mm-tab');
        btn.setAttribute('data-index', idx);
        btn.setAttribute('type', 'button');
        if (idx === activeIdx) btn.classList.add('mm-tab--active');
        btn.style.setProperty('--tab-color', disc.color);
        btn.innerHTML = '<span class="mm-tab-icon">' + disc.icon + '</span>' +
                         '<span class="mm-tab-label">' + disc.title + '</span>';
        btn.addEventListener('click', function () {
          if (activeIdx === idx) return;
          activeIdx = idx;
          renderTabs();
          renderMap();
        });
        tabsContainer.appendChild(btn);
      });
    }

    /**
     * Render active mind map.
     */
    function renderMap() {
      mapContainer.innerHTML = '';
      var map = buildMap(disciplines[activeIdx]);
      mapContainer.appendChild(map);

      // Animate entrance
      requestAnimationFrame(function () {
        map.classList.add('mm-visible');
      });
    }

    renderTabs();
    renderMap();
  }

  /* ===================================================================
   *  BOOTSTRAP
   * =================================================================== */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
