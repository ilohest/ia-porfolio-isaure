<template>
  <div class="root">

    <!-- ═══ HEADER ═══ -->
    <header class="header">
      <div class="header-left">
        <div class="logo-wrap">
          <div class="logo-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" stroke="url(#g1)" stroke-width="1.8" stroke-linejoin="round"/>
              <path d="M12 22V12M3 7l9 5 9-5" stroke="url(#g1)" stroke-width="1.8"/>
              <defs>
                <linearGradient id="g1" x1="3" y1="2" x2="21" y2="22">
                  <stop offset="0%" stop-color="#5b5d75"/>
                  <stop offset="100%" stop-color="#2e2b28"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <div class="logo-name">LexAI</div>
            <div class="logo-sub">Legal Intelligence Platform</div>
          </div>
        </div>

        <div class="h-sep"></div>

        <nav class="header-nav">
          <span class="nav-item active">Routage IA</span>
          <span class="nav-item">Dossiers</span>
          <span class="nav-item">Avocats</span>
        </nav>
      </div>

      <div class="header-right">
        <div class="hstat">
          <span class="hstat-n">2 847</span>
          <span class="hstat-l">Dossiers traités</span>
        </div>
        <div class="h-sep"></div>
        <div class="hstat">
          <span class="hstat-n">94.2%</span>
          <span class="hstat-l">Satisfaction</span>
        </div>
        <div class="avatar-btn">
          <div class="avatar-circle">JD</div>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#5b5d75" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </div>
    </header>

    <!-- ═══ LAYOUT ═══ -->
    <main class="layout">

      <!-- ══════════════════════
           LEFT — CLIENT INPUT
      ══════════════════════ -->
      <section class="panel panel-left">

        <div class="panel-label">
          <div class="plabel-dot blue"></div>
          <span>01 — Demande client</span>
        </div>

        <!-- Client inbox -->
        <div class="field-group inbox-group">
          <p class="field-label-sm">Boîte de réception clients</p>
          <div class="scenarios">
            <button
              v-for="(s, i) in scenarios" :key="i"
              class="scenario-btn"
              :class="{ active: selectedScenario === i }"
              @click="selectScenario(i)"
            >
              <div class="inbox-avatar" :style="{ background: s.avatarGradient }">{{ s.clientInitials }}</div>
              <div class="inbox-body">
                <div class="inbox-top">
                  <span class="client-name">{{ s.clientName }}</span>
                  <span class="received-at">{{ s.receivedAt }}</span>
                </div>
                <div class="inbox-sub">
                  <span class="stag" :style="{ background: s.tagBg, color: s.tagColor }">{{ s.tag }}</span>
                  <span class="request-title">{{ s.label }}</span>
                </div>
                <p class="request-preview">{{ s.preview }}</p>
              </div>
              <div class="inbox-state">
                <span class="status-dot" :class="s.statusClass"></span>
                <svg v-if="selectedScenario === i" class="scheck" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2e2b28" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
            </button>
          </div>
        </div>

        <div class="left-scroll">
          <div class="rule"></div>

          <!-- Description -->
          <div class="field-group">
            <label class="field-label">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              Description de la situation
            </label>
            <div class="client-message">
              <p v-if="clientText" class="client-message-text">{{ clientText }}</p>
              <p v-else class="client-message-empty">Sélectionnez une demande dans la boîte de réception.</p>
            </div>
          </div>

          <!-- Files -->
          <div class="field-group">
            <label class="field-label">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              Pièces jointes
            </label>
            <div class="dropzone" :class="{ 'has-f': uploadedFiles.length > 0 }" @click="simulateUpload">
              <template v-if="uploadedFiles.length === 0">
                <div class="dz-empty">
                  <div class="dz-icon-wrap">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#5b5d75" stroke-width="1.5">
                      <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
                      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                    </svg>
                  </div>
                  <span class="dz-main">Déposer vos documents ici</span>
                  <span class="dz-hint">PDF, DOCX, JPG — 10 Mo max</span>
                </div>
              </template>
              <template v-else>
                <div class="flist">
                  <div v-for="f in uploadedFiles" :key="f.name" class="frow">
                    <div class="ficon">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#5b5d75" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                      </svg>
                    </div>
                    <div class="fmeta">
                      <span class="fname">{{ f.name }}</span>
                      <span class="fsize">{{ f.size }}</span>
                    </div>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#5b5d75" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <button class="add-doc-btn" @click.stop="simulateUpload">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Ajouter un document
                  </button>
                </div>
              </template>
            </div>
          </div>
        </div>

        <!-- CTA -->
        <button v-if="!analysisReady" class="submit-btn" :disabled="!clientText.trim() || isAnalyzing" @click="startAnalysis">
          <template v-if="isAnalyzing">
            <div class="bspinner"></div>Analyse en cours…
          </template>
          <template v-else>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 19-7z"/>
            </svg>
            Analyser le dossier
          </template>
        </button>

      </section>

      <!-- ══════════════════════
           CENTER — AI ANALYSIS
      ══════════════════════ -->
      <section class="panel panel-center">

        <div class="panel-label">
          <div class="plabel-dot gold"></div>
          <span>02 — Analyse IA</span>
          <div class="model-chip">
            <div class="model-dot"></div>
            LexAI Engine v3.1
          </div>
          <div v-if="analysisReady" class="done-pill">
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
            Terminée
          </div>
        </div>

        <!-- IDLE -->
        <div v-if="!isAnalyzing && !analysisReady" class="empty-state">
          <div class="es-icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#cad2e3" stroke-width="1.2">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
            </svg>
          </div>
          <p class="es-title">En attente</p>
          <p class="es-desc">Soumettez une demande pour démarrer</p>
        </div>

        <!-- PROCESSING -->
        <div v-if="isAnalyzing" class="proc-view">
          <div class="proc-header">
            <div class="proc-spinner-wrap">
              <div class="proc-ring"></div>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#5b5d75" stroke-width="2">
                <path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <div>
              <p class="proc-title">Traitement en cours</p>
              <p class="proc-model">LexAI Engine v3.1</p>
            </div>
          </div>

          <div class="steps">
            <div
              v-for="(step, i) in analysisSteps" :key="i"
              class="step"
              :class="{ done: step.done, active: step.active, idle: !step.done && !step.active }"
            >
              <div class="step-track">
                <div class="step-line top" :class="{ lit: i > 0 && (analysisSteps[i-1].done || analysisSteps[i-1].active) }"></div>
                <div class="step-node">
                  <template v-if="step.done">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                  </template>
                  <div v-else-if="step.active" class="node-pulse"></div>
                  <span v-else class="node-num">{{ i + 1 }}</span>
                </div>
                <div class="step-line bottom"></div>
              </div>
              <div class="step-content">
                <span class="step-text">{{ step.label }}</span>
                <span v-if="step.done" class="step-time">{{ step.duration }}</span>
                <div v-if="step.active" class="step-bar"><div class="step-bar-fill"></div></div>
              </div>
            </div>
          </div>
        </div>

        <!-- RESULTS -->
        <transition name="rise">
          <div v-if="analysisReady" class="a-results">

            <!-- Case type -->
            <div class="case-card">
              <div class="case-icon" :style="{ background: result.caseColor + '15', borderColor: result.caseColor + '35' }">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" :stroke="result.caseColor" stroke-width="1.8">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
              </div>
              <div>
                <div class="case-type" :style="{ color: result.caseColor }">{{ result.caseType }}</div>
                <div class="case-ref">{{ result.caseCode }}</div>
              </div>
            </div>

            <!-- Metrics -->
            <div class="metrics">
              <div class="metric">
                <div class="m-label">Urgence</div>
                <div class="m-row">
                  <div class="m-dot" :style="{ background: urgencyColor }"></div>
                  <span class="m-val" :style="{ color: urgencyColor }">{{ result.urgency }}</span>
                </div>
                <div class="m-track"><div class="m-fill" :style="{ width: result.urgencyLevel + '%', background: urgencyColor }"></div></div>
              </div>
              <div class="metric">
                <div class="m-label">Complexité</div>
                <div class="cdots">
                  <span v-for="n in 5" :key="n" class="cdot" :class="{ on: n <= result.complexity }"></span>
                </div>
                <div class="m-sub">{{ result.complexityLabel }}</div>
              </div>
              <div class="metric">
                <div class="m-label">Confiance</div>
                <div class="conf-val">{{ result.confidence }}<span>%</span></div>
                <div class="m-track"><div class="m-fill gold" :style="{ width: result.confidence + '%' }"></div></div>
              </div>
            </div>

            <!-- Jurisdiction -->
            <div class="juris-row">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#5b5d75" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span class="j-label">Juridiction :</span>
              <span class="j-val">{{ result.jurisdiction }}</span>
            </div>

            <!-- Facts -->
            <div class="facts-box">
              <div class="facts-top">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#5b5d75" stroke-width="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                Faits clés extraits
              </div>
              <ul class="facts">
                <li v-for="(f, i) in result.facts" :key="i" class="fact-item" :style="{ animationDelay: i * 0.1 + 's' }">
                  <div class="fact-dot"></div>
                  <span>{{ f }}</span>
                </li>
              </ul>
            </div>

          </div>
        </transition>
      </section>

      <!-- ══════════════════════
           RIGHT — LAWYER
      ══════════════════════ -->
      <section class="panel panel-right">

        <div class="panel-label">
          <div class="plabel-dot green"></div>
          <span>03 — Avocat assigné</span>
          <div v-if="lawyerReady" class="done-pill green">
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
            À confirmer
          </div>
        </div>

        <!-- IDLE -->
        <div v-if="!isAnalyzing && !lawyerReady" class="empty-state">
          <div class="es-icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#cad2e3" stroke-width="1.2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <p class="es-title">Aucune assignation</p>
          <p class="es-desc">L'avocat sera sélectionné après l'analyse</p>
        </div>

        <!-- MATCHING -->
        <div v-if="isAnalyzing && !lawyerReady" class="matching">
          <div class="match-anim">
            <div class="mr r1"></div>
            <div class="mr r2"></div>
            <div class="mr r3"></div>
            <div class="mc">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#5b5d75" stroke-width="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
          </div>
          <p class="match-title">Recherche en cours…</p>
          <p class="match-sub">Comparaison de {{ lawyerPool }} profils avocats</p>
          <div class="match-chips">
            <span v-for="t in matchTags" :key="t" class="match-chip">{{ t }}</span>
          </div>
        </div>

        <!-- LAWYER CARD -->
        <transition name="rise">
          <div v-if="lawyerReady" class="lawyer-card">

            <!-- Score -->
            <div class="score-block">
              <div>
                <div class="score-label">Score de correspondance</div>
                <div class="score-num">{{ lawyer.matchScore }}<span>%</span></div>
              </div>
              <svg width="58" height="58" viewBox="0 0 58 58">
                <circle cx="29" cy="29" r="23" fill="none" stroke="#cad2e3" stroke-width="4"/>
                <circle
                  cx="29" cy="29" r="23"
                  fill="none" stroke="url(#sg)" stroke-width="4"
                  stroke-linecap="round"
                  stroke-dasharray="144.5"
                  :stroke-dashoffset="144.5 * (1 - lawyer.matchScore / 100)"
                  transform="rotate(-90 29 29)"
                  style="transition: stroke-dashoffset 1.5s ease"
                />
                <defs>
                  <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#5b5d75"/>
                    <stop offset="100%" stop-color="#2e2b28"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <!-- Identity -->
            <div class="l-identity">
              <div class="l-avatar" :style="{ background: lawyer.avatarGradient }">{{ lawyer.initials }}</div>
              <div>
                <div class="l-name">{{ lawyer.name }}</div>
                <div class="l-role">{{ lawyer.title }}</div>
                <div class="l-loc">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#5b5d75" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  {{ lawyer.location }}
                </div>
              </div>
            </div>

            <!-- Stats -->
            <div class="l-stats">
              <div class="lstat">
                <div class="lstat-n">{{ lawyer.experience }}<span>ans</span></div>
                <div class="lstat-l">Expérience</div>
              </div>
              <div class="lstat-sep"></div>
              <div class="lstat">
                <div class="lstat-n">{{ lawyer.cases }}</div>
                <div class="lstat-l">Affaires</div>
              </div>
              <div class="lstat-sep"></div>
              <div class="lstat">
                <div class="lstat-n">{{ lawyer.successRate }}<span>%</span></div>
                <div class="lstat-l">Succès</div>
              </div>
            </div>

            <!-- Specializations -->
            <div class="l-section">
              <div class="l-sec-label">Spécialisations</div>
              <div class="specs">
                <span v-for="s in lawyer.specializations" :key="s" class="spec" :class="{ primary: s === lawyer.primarySpec }">{{ s }}</span>
              </div>
            </div>

            <!-- Reasoning -->
            <div class="reasoning">
              <div class="r-head">
                <div class="r-icon">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#5b5d75" stroke-width="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  </svg>
                </div>
                Raisonnement IA
              </div>
              <p class="r-body">{{ lawyer.reasoning }}</p>
            </div>

            <!-- Past cases -->
            <div class="l-section">
              <div class="l-sec-label">Affaires similaires traitées</div>
              <div class="past-cases">
                <div v-for="(c, i) in lawyer.pastCases" :key="i" class="pcase">
                  <div class="pc-badge" :class="c.won ? 'won' : 'settled'">{{ c.won ? 'G' : 'A' }}</div>
                  <div class="pc-info">
                    <span class="pc-title">{{ c.title }}</span>
                    <span class="pc-verdict" :class="c.won ? 'won' : 'settled'">{{ c.won ? 'Gagné' : 'Accord amiable' }}</span>
                  </div>
                  <span class="pc-year">{{ c.year }}</span>
                </div>
              </div>
            </div>

            <!-- CTA -->
            <div class="l-cta">
              <button class="cta-confirm">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Confirmer l'assignation
              </button>
              <button class="cta-alt">Voir d'autres profils</button>
            </div>

          </div>
        </transition>

      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const scenarios = [
  {
    label: 'Licenciement abusif',
    clientName: 'Julien Martin',
    clientInitials: 'JM',
    receivedAt: '09:42',
    preview: 'Licenciement contesté après signalement aux RH et remplacement du poste.',
    statusClass: 'urgent',
    avatarGradient: 'linear-gradient(135deg, #5b5d75, #2e2b28)',
    tag: 'Travail', tagBg: '#d9f99d', tagColor: '#365314',
    text: `Je travaillais depuis 7 ans dans une entreprise de logistique en tant que responsable d'équipe. En mars dernier, j'ai été licencié sans cause réelle et sérieuse après m'être plaint auprès des RH de pratiques discriminatoires envers plusieurs collègues. Mon employeur prétend que le licenciement est économique, mais aucun plan social n'a été déclenché et j'ai été remplacé par quelqu'un d'autre trois semaines plus tard. Je souhaite contester ce licenciement devant le Conseil de Prud'hommes et obtenir des indemnités.`,
    files: [{ name: 'Lettre_licenciement.pdf', size: '124 Ko' }, { name: 'Echanges_RH_2024.pdf', size: '387 Ko' }],
    analysis: {
      caseType: 'Droit du travail', caseCode: 'ART. L1235-3 C. TRAV. — LICENCIEMENT SANS CAUSE', caseColor: '#2e2b28',
      urgency: 'Élevée', urgencyLevel: 78, complexity: 3, complexityLabel: 'Modérée',
      jurisdiction: 'Conseil de Prud\'hommes de Paris', confidence: 94,
      facts: [
        'Licenciement après signalement — représailles potentielles (art. L1132-3-3)',
        'Ancienneté de 7 ans — indemnités légales significatives à réclamer',
        'Remplacement du poste sous 3 semaines — contredit la cause économique invoquée',
        'Délai de saisine : 12 mois à compter de la notification du licenciement',
        'Preuves écrites disponibles (RH, fiches de paie) — dossier solide',
      ],
    },
    lawyer: {
      name: 'Maître Marie Fontaine', initials: 'MF',
      avatarGradient: 'linear-gradient(135deg, #5b5d75, #2e2b28)',
      title: 'Avocate en droit du travail', location: 'Paris, Île-de-France',
      experience: 14, cases: 312, successRate: 87, matchScore: 96,
      primarySpec: 'Licenciements abusifs',
      specializations: ['Droit du travail', 'Licenciements abusifs', 'Discrimination', 'Prud\'hommes'],
      reasoning: `Maître Fontaine se spécialise exclusivement dans les litiges prud'homaux liés aux licenciements abusifs et à la discrimination. Avec 87 % de succès sur 312 affaires et 14 ans au barreau de Paris, sa maîtrise de l'article L1235-3 et des procédures de représailles correspond précisément au profil de ce dossier.`,
      pastCases: [
        { title: 'Licenciement représailles après signalement harcèlement', won: true, year: '2024' },
        { title: 'Cause économique sans suppression de poste effective', won: true, year: '2023' },
        { title: 'Discrimination syndicale — cadre supérieur logistique', won: false, year: '2022' },
      ],
    },
  },
  {
    label: 'Vices cachés immobiliers',
    clientName: 'Claire Moreau',
    clientInitials: 'CM',
    receivedAt: 'Hier',
    preview: 'Infiltrations dans un appartement récemment acheté, expertise à l’appui.',
    statusClass: 'new',
    avatarGradient: 'linear-gradient(135deg, #5b5d75, #2e2b28)',
    tag: 'Immobilier', tagBg: '#99f6e4', tagColor: '#134e4a',
    text: `J'ai acquis un appartement il y a 14 mois. Lors de l'achat, le vendeur m'a assuré oralement que les travaux de rénovation de la toiture avaient été réalisés et payés. Depuis l'hiver, je constate des infiltrations d'eau importantes dans les deux chambres du dernier étage. Un expert mandaté par mon assurance a confirmé que la toiture n'avait jamais été rénovée. Le vendeur refuse de me rembourser les frais estimés à 28 000 €.`,
    files: [{ name: 'Rapport_expertise_toiture.pdf', size: '2.1 Mo' }, { name: 'Acte_de_vente.pdf', size: '512 Ko' }, { name: 'Photos_infiltrations.jpg', size: '4.3 Mo' }],
    analysis: {
      caseType: 'Droit immobilier', caseCode: 'ART. 1641 C. CIV. — GARANTIE DES VICES CACHÉS', caseColor: '#2e2b28',
      urgency: 'Modérée', urgencyLevel: 52, complexity: 4, complexityLabel: 'Élevée',
      jurisdiction: 'Tribunal judiciaire', confidence: 91,
      facts: [
        'Vice caché constitué : défaut antérieur, non apparent, impropre à l\'usage normal',
        'Délai d\'action : 2 ans à compter de la découverte (art. 1648 C. civ.)',
        'Préjudice chiffré à 28 000 € selon rapport d\'expertise contradictoire',
        'Dol potentiel : déclaration mensongère sur les travaux réalisés par le vendeur',
        'Rapport d\'expertise disponible — pièce maîtresse du dossier',
      ],
    },
    lawyer: {
      name: 'Maître Thomas Andreani', initials: 'TA',
      avatarGradient: 'linear-gradient(135deg, #5b5d75, #2e2b28)',
      title: 'Avocat en droit immobilier', location: 'Lyon, Auvergne-Rhône-Alpes',
      experience: 11, cases: 247, successRate: 82, matchScore: 93,
      primarySpec: 'Vices cachés',
      specializations: ['Droit immobilier', 'Vices cachés', 'Transactions & litiges', 'Construction'],
      reasoning: `Maître Andreani centre sa pratique sur les litiges post-acquisition et les actions en vice caché. Il maîtrise l'exploitation de rapports d'expertise contradictoires devant le Tribunal judiciaire, avec 82 % de succès sur 247 affaires — profil précisément adapté (dol + vice caché).`,
      pastCases: [
        { title: 'Vice caché — défaut structurel dissimulé par le vendeur', won: true, year: '2024' },
        { title: 'Dol — fausses déclarations sur permis de construire', won: true, year: '2023' },
        { title: 'Infiltrations toiture — action en réduction de prix', won: false, year: '2022' },
      ],
    },
  },
  {
    label: 'Divorce contentieux',
    clientName: 'Nadia Benali',
    clientInitials: 'NB',
    receivedAt: 'Lun.',
    preview: 'Demande de garde principale, pension alimentaire et domicile conjugal.',
    statusClass: 'pending',
    avatarGradient: 'linear-gradient(135deg, #5b5d75, #2e2b28)',
    tag: 'Famille', tagBg: '#f0abfc', tagColor: '#701a75',
    text: `Je souhaite divorcer de mon conjoint après 11 ans de mariage. Nous avons deux enfants de 6 et 9 ans. Mon conjoint refuse le consentement mutuel et conteste ma demande de garde principale. Je bénéficie d'un CDI stable et j'ai toujours assuré la présence parentale principale. Mon conjoint a des revenus irréguliers et voyage fréquemment à l'étranger. Je souhaite la garde principale, une pension alimentaire et conserver le domicile conjugal.`,
    files: [{ name: 'Jugement_mariage.pdf', size: '89 Ko' }, { name: 'Fiches_paie_2024.pdf', size: '631 Ko' }],
    analysis: {
      caseType: 'Droit de la famille', caseCode: 'ART. 229 ET S. C. CIV. — DIVORCE CONTENTIEUX', caseColor: '#2e2b28',
      urgency: 'Modérée', urgencyLevel: 60, complexity: 4, complexityLabel: 'Élevée',
      jurisdiction: 'Juge aux affaires familiales (JAF)', confidence: 89,
      facts: [
        'Divorce pour altération définitive du lien conjugal (art. 237 C. civ.) à confirmer',
        'Garde principale : intérêt de l\'enfant — stabilité professionnelle du demandeur favorable',
        'Présence parentale principale établie — élément central pour le JAF',
        'Revenus irréguliers du conjoint — atout pour la fixation de la pension alimentaire',
        'Attribution du domicile conjugal possible jusqu\'à majorité (art. 255 C. civ.)',
      ],
    },
    lawyer: {
      name: 'Maître Sophie Marchand', initials: 'SM',
      avatarGradient: 'linear-gradient(135deg, #5b5d75, #2e2b28)',
      title: 'Avocate en droit de la famille', location: 'Bordeaux, Nouvelle-Aquitaine',
      experience: 9, cases: 198, successRate: 84, matchScore: 91,
      primarySpec: 'Divorce contentieux',
      specializations: ['Droit de la famille', 'Divorce contentieux', 'Garde d\'enfants', 'Autorité parentale'],
      reasoning: `Maître Marchand est spécialisée dans les divorces contentieux impliquant des enfants mineurs. Son approche combine défense des intérêts parentaux et protection de l'intérêt de l'enfant — critère central pour le JAF. 9 ans d'expérience, 198 dossiers traités, majorité de gardes disputées.`,
      pastCases: [
        { title: 'Garde principale obtenue malgré opposition du conjoint', won: true, year: '2024' },
        { title: 'Attribution domicile conjugal — enfants en bas âge', won: true, year: '2023' },
        { title: 'Révision pension alimentaire — revenus variables', won: false, year: '2023' },
      ],
    },
  },
  {
    label: 'Loyers impayés',
    clientName: 'Antoine Girard',
    clientInitials: 'AG',
    receivedAt: '10:18',
    preview: 'Locataire en défaut depuis 4 mois malgré relances et commandement.',
    statusClass: 'urgent',
    avatarGradient: 'linear-gradient(135deg, #5b5d75, #2e2b28)',
    tag: 'Immobilier', tagBg: '#99f6e4', tagColor: '#134e4a',
    text: `Je suis propriétaire d'un appartement loué à Paris. Mon locataire n'a pas payé les loyers depuis quatre mois malgré plusieurs relances écrites. Un commandement de payer a été délivré, mais la situation reste inchangée. Je souhaite engager une procédure pour récupérer les loyers dus et obtenir, si nécessaire, la résiliation du bail.`,
    files: [{ name: 'Bail_location.pdf', size: '214 Ko' }, { name: 'Commandement_payer.pdf', size: '166 Ko' }],
    analysis: {
      caseType: 'Contentieux locatif', caseCode: 'ART. 24 LOI 1989 — RÉSILIATION DU BAIL', caseColor: '#2e2b28',
      urgency: 'Élevée', urgencyLevel: 74, complexity: 3, complexityLabel: 'Modérée',
      jurisdiction: 'Juge des contentieux de la protection', confidence: 92,
      facts: [
        'Impayés persistants sur 4 mois avec pièces justificatives disponibles',
        'Commandement de payer déjà délivré — étape procédurale utile accomplie',
        'Clause résolutoire du bail à vérifier pour accélérer la procédure',
        'Arriéré locatif chiffrable et documenté par relevés et quittances',
        'Action possible en paiement et expulsion selon situation du locataire',
      ],
    },
    lawyer: {
      name: 'Maître Thomas Andreani', initials: 'TA',
      avatarGradient: 'linear-gradient(135deg, #5b5d75, #2e2b28)',
      title: 'Avocat en droit immobilier', location: 'Lyon, Auvergne-Rhône-Alpes',
      experience: 11, cases: 247, successRate: 82, matchScore: 90,
      primarySpec: 'Baux d’habitation',
      specializations: ['Droit immobilier', 'Baux d’habitation', 'Contentieux locatif', 'Recouvrement'],
      reasoning: `Maître Andreani traite régulièrement les impayés locatifs et les résiliations de bail. Son expérience des procédures devant le juge des contentieux de la protection en fait un profil très adapté à un dossier avec commandement déjà délivré.`,
      pastCases: [
        { title: 'Résiliation bail après 5 mois d’impayés', won: true, year: '2024' },
        { title: 'Recouvrement loyers et charges locatives', won: true, year: '2023' },
        { title: 'Contestations sur clause résolutoire', won: false, year: '2022' },
      ],
    },
  },
  {
    label: 'Rupture conventionnelle contestée',
    clientName: 'Lucie Perrin',
    clientInitials: 'LP',
    receivedAt: '08:11',
    preview: 'Signature sous pression et doute sur le consentement libre.',
    statusClass: 'new',
    avatarGradient: 'linear-gradient(135deg, #5b5d75, #2e2b28)',
    tag: 'Travail', tagBg: '#d9f99d', tagColor: '#365314',
    text: `Mon employeur m'a demandé de signer une rupture conventionnelle après plusieurs semaines de pression managériale. J'ai accepté sur le moment, mais je considère aujourd'hui que mon consentement n'était pas libre. Je souhaite savoir si cette rupture peut être contestée et si je peux obtenir une requalification en licenciement sans cause réelle et sérieuse.`,
    files: [{ name: 'Convention_rupture.pdf', size: '143 Ko' }, { name: 'Echanges_manager.pdf', size: '298 Ko' }],
    analysis: {
      caseType: 'Droit du travail', caseCode: 'ART. L1237-11 C. TRAV. — RUPTURE CONVENTIONNELLE', caseColor: '#2e2b28',
      urgency: 'Modérée', urgencyLevel: 58, complexity: 3, complexityLabel: 'Modérée',
      jurisdiction: 'Conseil de Prud\'hommes', confidence: 88,
      facts: [
        'Consentement libre et éclairé contesté — axe central du contentieux',
        'Échanges écrits pouvant démontrer une pression ou une contrainte',
        'Possibilité de solliciter la nullité ou la requalification de la rupture',
        'Analyse des délais de contestation nécessaire selon homologation',
        'Dossier potentiellement renforcé par attestations de collègues ou RH',
      ],
    },
    lawyer: {
      name: 'Maître Marie Fontaine', initials: 'MF',
      avatarGradient: 'linear-gradient(135deg, #5b5d75, #2e2b28)',
      title: 'Avocate en droit du travail', location: 'Paris, Île-de-France',
      experience: 14, cases: 312, successRate: 87, matchScore: 92,
      primarySpec: 'Ruptures du contrat',
      specializations: ['Droit du travail', 'Ruptures conventionnelles', 'Licenciements abusifs', 'Prud\'hommes'],
      reasoning: `Maître Fontaine connaît bien les contentieux liés au consentement vicié et aux ruptures conventionnelles litigieuses. Le dossier repose sur des écrits et une mécanique de pression au travail qu’elle traite fréquemment.`,
      pastCases: [
        { title: 'Annulation rupture conventionnelle pour vice du consentement', won: true, year: '2024' },
        { title: 'Requalification en licenciement sans cause réelle', won: true, year: '2023' },
        { title: 'Homologation et pression hiérarchique contestées', won: false, year: '2022' },
      ],
    },
  },
  {
    label: 'Succession bloquée',
    clientName: 'Hélène Roussel',
    clientInitials: 'HR',
    receivedAt: 'Mar.',
    preview: 'Conflit entre héritiers et blocage sur un bien immobilier familial.',
    statusClass: 'pending',
    avatarGradient: 'linear-gradient(135deg, #5b5d75, #2e2b28)',
    tag: 'Famille', tagBg: '#f0abfc', tagColor: '#701a75',
    text: `À la suite du décès de mon père, la succession est bloquée depuis plus d'un an. Mon frère refuse de signer les actes nécessaires concernant la vente d'une maison familiale et conteste la répartition de certains biens mobiliers. Je souhaite débloquer la succession et faire avancer le partage.`,
    files: [{ name: 'Projet_acte_notoriete.pdf', size: '119 Ko' }, { name: 'Courriers_notaire.pdf', size: '241 Ko' }],
    analysis: {
      caseType: 'Droit patrimonial de la famille', caseCode: 'ART. 840 C. CIV. — PARTAGE JUDICIAIRE', caseColor: '#2e2b28',
      urgency: 'Modérée', urgencyLevel: 49, complexity: 4, complexityLabel: 'Élevée',
      jurisdiction: 'Tribunal judiciaire', confidence: 86,
      facts: [
        'Blocage persistant entre cohéritiers sur les actes de partage',
        'Bien immobilier indivis nécessitant potentiellement une vente judiciaire',
        'Échanges du notaire utiles pour démontrer l’impasse actuelle',
        'Action en partage judiciaire envisageable en cas de désaccord durable',
        'Évaluation des biens et des droits de chacun à consolider',
      ],
    },
    lawyer: {
      name: 'Maître Sophie Marchand', initials: 'SM',
      avatarGradient: 'linear-gradient(135deg, #5b5d75, #2e2b28)',
      title: 'Avocate en droit de la famille', location: 'Bordeaux, Nouvelle-Aquitaine',
      experience: 9, cases: 198, successRate: 84, matchScore: 88,
      primarySpec: 'Successions',
      specializations: ['Droit de la famille', 'Successions', 'Indivision', 'Partage judiciaire'],
      reasoning: `Maître Marchand intervient sur les conflits successoraux et les situations d’indivision bloquées. Son profil convient bien à un contentieux mêlant notaire, cohéritiers et partage judiciaire.`,
      pastCases: [
        { title: 'Partage judiciaire après blocage entre héritiers', won: true, year: '2024' },
        { title: 'Sortie d’indivision sur maison familiale', won: true, year: '2023' },
        { title: 'Contestations sur évaluation des biens successoraux', won: false, year: '2022' },
      ],
    },
  },
  {
    label: 'Malfaçons après travaux',
    clientName: 'Sébastien Noël',
    clientInitials: 'SN',
    receivedAt: 'Ven.',
    preview: 'Travaux de rénovation non conformes et artisan injoignable.',
    statusClass: 'new',
    avatarGradient: 'linear-gradient(135deg, #5b5d75, #2e2b28)',
    tag: 'Immobilier', tagBg: '#99f6e4', tagColor: '#134e4a',
    text: `J'ai fait réaliser des travaux de rénovation dans ma maison il y a six mois. Plusieurs malfaçons sont apparues : carrelage fissuré, défaut d'étanchéité dans la salle de bain et prises électriques mal posées. L'artisan ne répond plus à mes mises en demeure. Je souhaite engager sa responsabilité et obtenir réparation.`,
    files: [{ name: 'Devis_travaux.pdf', size: '187 Ko' }, { name: 'Mise_en_demeure.pdf', size: '101 Ko' }, { name: 'Photos_malfacons.zip', size: '5.2 Mo' }],
    analysis: {
      caseType: 'Droit de la construction', caseCode: 'ART. 1231-1 C. CIV. — RESPONSABILITÉ CONTRACTUELLE', caseColor: '#2e2b28',
      urgency: 'Modérée', urgencyLevel: 55, complexity: 4, complexityLabel: 'Élevée',
      jurisdiction: 'Tribunal judiciaire', confidence: 90,
      facts: [
        'Malfaçons multiples documentées par photos et devis',
        'Mises en demeure restées sans réponse — inexécution caractérisée',
        'Expertise amiable ou judiciaire à envisager rapidement',
        'Action en responsabilité contractuelle et indemnisation possible',
        'Garanties légales à qualifier selon nature exacte des désordres',
      ],
    },
    lawyer: {
      name: 'Maître Thomas Andreani', initials: 'TA',
      avatarGradient: 'linear-gradient(135deg, #5b5d75, #2e2b28)',
      title: 'Avocat en droit immobilier', location: 'Lyon, Auvergne-Rhône-Alpes',
      experience: 11, cases: 247, successRate: 82, matchScore: 91,
      primarySpec: 'Construction',
      specializations: ['Droit immobilier', 'Construction', 'Responsabilité contractuelle', 'Expertise'],
      reasoning: `Le dossier exige une bonne maîtrise des malfaçons, des garanties applicables et de la preuve technique. Maître Andreani a un profil cohérent pour encadrer une expertise et porter une action en réparation.`,
      pastCases: [
        { title: 'Réparation de désordres après rénovation intérieure', won: true, year: '2024' },
        { title: 'Expertise judiciaire sur défauts d’étanchéité', won: true, year: '2023' },
        { title: 'Contentieux artisan sur non-conformités électriques', won: false, year: '2022' },
      ],
    },
  },
]

const selectedScenario = ref(null)
const clientText = ref('')
const uploadedFiles = ref([])
const isAnalyzing = ref(false)
const analysisReady = ref(false)
const lawyerReady = ref(false)
const result = ref({})
const lawyer = ref({})
const lawyerPool = ref(48)
const matchTags = ref([])

const analysisSteps = ref([
  { label: 'Lecture et indexation des documents', done: false, active: false, duration: '' },
  { label: 'Classification du type de litige', done: false, active: false, duration: '' },
  { label: 'Évaluation urgence & complexité', done: false, active: false, duration: '' },
  { label: 'Extraction des faits clés', done: false, active: false, duration: '' },
  { label: 'Scoring & sélection de l\'avocat', done: false, active: false, duration: '' },
])

const urgencyColor = computed(() => {
  if (!result.value.urgencyLevel) return '#5b5d75'
  if (result.value.urgencyLevel >= 70) return '#2e2b28'
  if (result.value.urgencyLevel >= 40) return '#5b5d75'
  return '#cad2e3'
})

function selectScenario(i) {
  if (isAnalyzing.value) return
  selectedScenario.value = i
  clientText.value = scenarios[i].text
  uploadedFiles.value = [...scenarios[i].files]
  analysisReady.value = false
  lawyerReady.value = false
  resetSteps()
  matchTags.value = [scenarios[i].analysis.caseType, scenarios[i].lawyer.primarySpec, scenarios[i].lawyer.location.split(',')[0]]
}

function simulateUpload() {
  if (isAnalyzing.value) return
  const pool = [
    { name: 'Document_justificatif.pdf', size: '248 Ko' },
    { name: 'Courrier_officiel.pdf', size: '185 Ko' },
    { name: 'Preuves_photos.jpg', size: '3.2 Mo' },
  ]
  const next = pool.find(f => !uploadedFiles.value.some(u => u.name === f.name))
  if (next) uploadedFiles.value.push(next)
}

function resetSteps() {
  analysisSteps.value.forEach(s => { s.done = false; s.active = false; s.duration = '' })
}

async function startAnalysis() {
  if (!clientText.value.trim() || isAnalyzing.value) return
  const s = selectedScenario.value !== null ? scenarios[selectedScenario.value] : scenarios[0]
  isAnalyzing.value = true; analysisReady.value = false; lawyerReady.value = false
  resetSteps()

  const durations = ['0.4s', '0.7s', '0.6s', '0.9s', '1.2s']
  const delays = [900, 1300, 1100, 1200, 1500]

  for (let i = 0; i < analysisSteps.value.length; i++) {
    analysisSteps.value[i].active = true
    await sleep(delays[i])
    analysisSteps.value[i].active = false
    analysisSteps.value[i].done = true
    analysisSteps.value[i].duration = durations[i]
    if (i === 3) { result.value = { ...s.analysis }; await sleep(150); analysisReady.value = true }
  }

  await sleep(700)
  lawyer.value = { ...s.lawyer }
  lawyerReady.value = true
  isAnalyzing.value = false
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }
</script>

<style scoped>
@font-face {
  font-family: 'Necto Mono';
  src: url('/fonts/NectoMono-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

/* ═══════════════════════════════════════
   TOKENS
═══════════════════════════════════════ */
/* Palette
  --ink:      #2e2b28   (texte principal)
  --mid:      #5b5d75   (texte secondaire)
  --border:   #cad2e3   (bordures, dividers)
  --bg:       #f1ece6   (fond global)
  --surface:  #ffffff   (cartes, panneaux)
  Status colors conservées (bleu, vert, violet, or)
*/

/* ═══════════════════════════════════════
   ROOT
═══════════════════════════════════════ */
.root {
  display: flex; flex-direction: column;
  height: 100vh; overflow: hidden;
  background: #f1ece6;
  color: #2e2b28;
  font-family: 'Inter', system-ui, sans-serif;
}

/* ═══════════════════════════════════════
   HEADER
═══════════════════════════════════════ */
.header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 1.5rem; height: 56px;
  background: #5b5d75;
  border-bottom: 1px solid #cad2e3;
  flex-shrink: 0;
  z-index: 10;
}

.header-left { display: flex; align-items: center; gap: 1.2rem; }
.logo-wrap { display: flex; align-items: center; gap: 0.6rem; }
.logo-icon {
  width: 32px; height: 32px; border-radius: 8px;
  background: #cad2e3;
  border: 1px solid #cad2e3;
  display: flex; align-items: center; justify-content: center;
}
.logo-name {
  font-size: 0.95rem; font-weight: 800;
  color: #ffffff; letter-spacing: 0.04em;
  line-height: 1.1;
}
.logo-sub { font-size: 0.55rem; color: #cad2e3; text-transform: uppercase; letter-spacing: 0.1em; }

.h-sep { width: 1px; height: 22px; background: #cad2e3; opacity: 0.7; }

.header-nav { display: flex; gap: 0.1rem; }
.nav-item {
  font-size: 0.73rem; color: #cad2e3; padding: 0.3rem 0.75rem;
  border-radius: 6px; cursor: pointer; transition: all 0.15s;
  font-weight: 500;
}
.nav-item:hover { background: #cad2e3; color: #2e2b28; }
.nav-item.active { background: #cad2e3; color: #2e2b28; font-weight: 600; }

.header-right { display: flex; align-items: center; gap: 1rem; }
.hstat { display: flex; flex-direction: column; align-items: flex-end; }
.hstat-n { font-size: 0.8rem; font-weight: 700; color: #ffffff; line-height: 1; }
.hstat-l { font-size: 0.55rem; color: #cad2e3; text-transform: uppercase; letter-spacing: 0.07em; }

@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

.avatar-btn {
  display: flex; align-items: center; gap: 0.3rem;
  border: 1px solid #cad2e3; border-radius: 20px;
  padding: 0.2rem 0.45rem 0.2rem 0.2rem;
  cursor: pointer; background: #cad2e3;
}
.avatar-circle {
  width: 24px; height: 24px; border-radius: 50%;
  background: linear-gradient(135deg, #5b5d75, #2e2b28);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.55rem; font-weight: 700; color: #ffffff; letter-spacing: 0.04em;
}

.model-chip {
  margin-left: auto; display: flex; align-items: center; gap: 0.4rem;
  padding: 0.2rem 0.65rem;
  background: #f1ece6; border: 1px solid #cad2e3;
  border-radius: 20px; font-size: 0.56rem; font-weight: 700;
  color: #5b5d75; letter-spacing: 0.04em;
  white-space: nowrap;
}
.model-dot {
  width: 5px; height: 5px; border-radius: 50%;
  background: #5b5d75; box-shadow: none;
  animation: pulse 2s infinite;
}

/* ═══════════════════════════════════════
   LAYOUT
═══════════════════════════════════════ */
.layout {
  display: grid; grid-template-columns: repeat(3, minmax(0, 1fr));
  flex: 1; overflow: hidden;
}

/* ═══════════════════════════════════════
   PANELS
═══════════════════════════════════════ */
.panel {
  display: flex; flex-direction: column;
  overflow: hidden;
  border-right: 1px solid #cad2e3;
  background: #ffffff;
}
.panel:last-child { border-right: none; }

/* Alternating subtle bg */
.panel-left  { background: #ffffff; }
.panel-center { background: #f1ece6; }
.panel-right  { background: #ffffff; }

.panel-label {
  display: flex; align-items: center; gap: 0.5rem;
  height: 44px; padding: 0 1.2rem;
  border-bottom: 1px solid #cad2e3;
  background: #f1ece6;
  font-size: 0.62rem; font-weight: 700;
  color: #5b5d75; letter-spacing: 0.1em; text-transform: uppercase;
  flex-shrink: 0;
}
.plabel-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.plabel-dot.blue,
.plabel-dot.gold,
.plabel-dot.green { background: #5b5d75; box-shadow: none; }

.done-pill {
  margin-left: auto; display: flex; align-items: center; gap: 0.3rem;
  font-size: 0.58rem; font-weight: 700; letter-spacing: 0.08em;
  color: #2e2b28; background: #ffffff;
  border: 1px solid #cad2e3; padding: 2px 8px; border-radius: 20px;
}
.done-pill.green { color: #2e2b28; background: #ffffff; border-color: #cad2e3; }
.model-chip + .done-pill { margin-left: 0; }

.logo-name,
.nav-item,
.hstat-n,
.hstat-l,
.model-chip,
.panel-label,
.field-label-sm,
.field-label,
.client-name,
.request-title,
.stag,
.submit-btn,
.es-title,
.proc-title,
.step-text,
.case-type,
.m-label,
.j-label,
.facts-top,
.match-title,
.score-label,
.score-num,
.l-name,
.l-sec-label,
.r-head,
.pc-title,
.cta-confirm,
.cta-alt {
  font-family: 'Necto Mono', 'Courier New', monospace;
}

/* ═══════════════════════════════════════
   LEFT PANEL
═══════════════════════════════════════ */
.panel-left {
  padding: 0; overflow: hidden;
  display: flex; flex-direction: column;
}
.inbox-group {
  padding: 1rem;
  background: #ffffff;
  border-bottom: 1px solid #cad2e3;
  flex-shrink: 0;
}
.left-scroll {
  flex: 1; min-height: 0;
  overflow-y: auto;
  padding: 1rem;
  display: flex; flex-direction: column; gap: 0.85rem;
}

.field-group { display: flex; flex-direction: column; gap: 0.45rem; }
.field-label-sm {
  font-size: 0.6rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.09em; color: #5b5d75;
}
.field-label {
  display: flex; align-items: center; gap: 0.35rem;
  font-size: 0.62rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.09em; color: #5b5d75;
}

/* Scenarios */
.scenarios {
  display: flex; flex-direction: column; gap: 0.3rem;
  max-height: 282px; overflow-y: auto; padding-right: 0.2rem;
}
.scenario-btn {
  display: flex; align-items: flex-start; gap: 0.6rem;
  padding: 0.6rem 0.75rem; border-radius: 8px;
  border: 1px solid #cad2e3; background: #ffffff;
  cursor: pointer; text-align: left; transition: all 0.15s;
}
.scenario-btn:hover { border-color: #5b5d75; background: #f1ece6; }
.scenario-btn.active { border-color: #5b5d75; background: #f1ece6; }

.inbox-avatar {
  width: 28px; height: 28px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: #ffffff; font-size: 0.58rem; font-weight: 800;
  letter-spacing: 0.04em; flex-shrink: 0;
}
.inbox-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 0.25rem; }
.inbox-top { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }
.client-name {
  font-size: 0.74rem; color: #2e2b28; font-weight: 700;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.received-at { font-size: 0.56rem; color: #5b5d75; flex-shrink: 0; }
.inbox-sub { display: flex; align-items: center; gap: 0.35rem; min-width: 0; }
.stag {
  font-size: 0.58rem; font-weight: 700; letter-spacing: 0.06em;
  padding: 2px 7px; border-radius: 4px; flex-shrink: 0;
}
.request-title {
  font-size: 0.68rem; color: #5b5d75;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.scenario-btn.active .request-title { color: #2e2b28; font-weight: 600; }
.request-preview {
  font-size: 0.62rem; color: #5b5d75; line-height: 1.35;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
  overflow: hidden;
}
.inbox-state {
  display: flex; flex-direction: column; align-items: center; gap: 0.45rem;
  padding-top: 0.2rem; flex-shrink: 0;
}
.status-dot { width: 7px; height: 7px; border-radius: 50%; background: #cad2e3; }
.status-dot.urgent { background: #2e2b28; box-shadow: none; }
.status-dot.new { background: #5b5d75; box-shadow: none; }
.status-dot.pending { background: #cad2e3; box-shadow: none; }
.scheck { flex-shrink: 0; }

.rule { height: 1px; background: #cad2e3; }

/* Client message */
.client-message {
  border: 1px solid #cad2e3; border-radius: 9px;
  background: #ffffff; overflow: hidden;
}
.client-message-text {
  min-height: 165px; padding: 0.75rem;
  color: #2e2b28; font-size: 0.76rem;
  line-height: 1.65;
}
.client-message-empty {
  min-height: 165px; padding: 0.75rem;
  color: #5b5d75; font-size: 0.76rem;
  line-height: 1.65;
  display: flex; align-items: center;
}
/* Dropzone */
.dropzone {
  border: 1.5px dashed #cad2e3; border-radius: 9px;
  background: #ffffff; cursor: pointer;
  transition: border-color 0.18s;
}
.dropzone:hover { border-color: #5b5d75; }
.dropzone.has-f { border-style: solid; border-color: #cad2e3; }

.dz-empty {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; gap: 0.35rem; padding: 1.2rem;
}
.dz-icon-wrap {
  width: 36px; height: 36px; border-radius: 8px;
  background: #f1ece6; border: 1px solid #cad2e3;
  display: flex; align-items: center; justify-content: center;
}
.dz-main { font-size: 0.72rem; color: #5b5d75; font-weight: 500; }
.dz-hint { font-size: 0.6rem; color: #5b5d75; }

.flist { padding: 0.6rem; display: flex; flex-direction: column; gap: 0.35rem; }
.frow {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.4rem 0.55rem;
  background: #ffffff; border: 1px solid #cad2e3;
  border-radius: 7px;
}
.ficon { flex-shrink: 0; }
.fmeta { flex: 1; min-width: 0; }
.fname { font-size: 0.68rem; color: #2e2b28; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 500; }
.fsize { font-size: 0.58rem; color: #5b5d75; }

.add-doc-btn {
  display: flex; align-items: center; justify-content: center; gap: 0.35rem;
  padding: 0.35rem; background: none;
  border: 1px dashed #cad2e3; border-radius: 6px;
  font-size: 0.65rem; color: #5b5d75;
  cursor: pointer; transition: all 0.15s; width: 100%;
}
.add-doc-btn:hover { border-color: #5b5d75; color: #2e2b28; }

/* Submit */
.submit-btn {
  flex-shrink: 0;
  margin: 1rem;
  display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  padding: 0.75rem; border-radius: 9px;
  background: #2e2b28; color: #ffffff;
  font-size: 0.78rem; font-weight: 700;
  border: none; cursor: pointer; letter-spacing: 0.02em;
  transition: all 0.18s; box-shadow: 0 2px 12px rgba(46,43,40,0.2);
}
.submit-btn:hover:not(:disabled) { background: #5b5d75; box-shadow: 0 4px 18px rgba(46,43,40,0.3); transform: translateY(-1px); }
.submit-btn:disabled { opacity: 0.3; cursor: not-allowed; transform: none; box-shadow: none; }

.bspinner {
  width: 13px; height: 13px;
  border: 2px solid rgba(255,255,255,0.3); border-top-color: #ffffff;
  border-radius: 50%; animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ═══════════════════════════════════════
   EMPTY STATE
═══════════════════════════════════════ */
.empty-state {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 0.5rem; padding: 2rem;
}
.es-icon { color: #cad2e3; }
.es-title { font-size: 0.8rem; color: #5b5d75; font-weight: 600; }
.es-desc { font-size: 0.68rem; color: #5b5d75; text-align: center; max-width: 180px; }

/* ═══════════════════════════════════════
   CENTER PANEL
═══════════════════════════════════════ */
.panel-center { overflow-y: auto; }

/* Processing */
.proc-view { padding: 1.2rem; display: flex; flex-direction: column; gap: 1.4rem; }

.proc-header {
  display: flex; align-items: center; gap: 0.85rem;
  padding: 0.85rem 1rem;
  background: #ffffff; border: 1px solid #cad2e3;
  border-radius: 10px;
}
.proc-spinner-wrap {
  position: relative; width: 32px; height: 32px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.proc-ring {
  position: absolute; inset: 0; border-radius: 50%;
  border: 2px solid transparent;
  border-top-color: #2e2b28;
  border-right-color: #cad2e3;
  animation: spin 1.2s linear infinite;
}
.proc-title { font-size: 0.78rem; font-weight: 700; color: #2e2b28; }
.proc-model { font-size: 0.62rem; color: #5b5d75; margin-top: 1px; }

/* Steps */
.steps { display: flex; flex-direction: column; }
.step { display: flex; align-items: flex-start; gap: 0.7rem; }

.step-track {
  display: flex; flex-direction: column; align-items: center;
  flex-shrink: 0; width: 20px;
}
.step-line {
  width: 1px; flex: 1; min-height: 10px; background: #cad2e3;
}
.step-line.top.lit { background: #5b5d75; }
.step-node {
  width: 20px; height: 20px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; transition: all 0.3s;
}
.step.done .step-node { background: #f1ece6; border: 1.5px solid #5b5d75; color: #2e2b28; }
.step.active .step-node { background: #ffffff; border: 1.5px solid #5b5d75; }
.step.idle .step-node { background: #ffffff; border: 1.5px solid #cad2e3; }

.node-num { font-size: 0.55rem; color: #5b5d75; font-weight: 700; }
.node-pulse {
  width: 6px; height: 6px; border-radius: 50%;
  background: #2e2b28;
  box-shadow: none;
  animation: pulse 0.9s infinite;
}

.step-content {
  flex: 1; padding: 0.35rem 0;
  display: flex; align-items: center; justify-content: space-between;
  min-height: 40px; border-bottom: 1px solid #f1ece6;
}
.step:last-child .step-content { border-bottom: none; }
.step-text { font-size: 0.73rem; color: #5b5d75; transition: color 0.2s; flex: 1; }
.step.done .step-text { color: #5b5d75; }
.step.active .step-text { color: #2e2b28; font-weight: 500; }
.step.idle .step-text { color: #5b5d75; }
.step-time { font-size: 0.6rem; color: #5b5d75; font-family: 'Courier New', monospace; }

.step-bar { height: 2px; background: #cad2e3; border-radius: 1px; overflow: hidden; width: 60px; }
.step-bar-fill {
  height: 100%; border-radius: 1px;
  background: linear-gradient(90deg, #5b5d75, #2e2b28);
  animation: prog 1.2s ease infinite;
}
@keyframes prog { 0% { width: 0; } 80% { width: 100%; } 100% { width: 100%; } }

/* Analysis results */
.a-results {
  padding: 1.2rem; display: flex; flex-direction: column; gap: 1rem;
}

.case-card {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.9rem; border-radius: 10px;
  background: #ffffff; border: 1px solid #cad2e3;
  box-shadow: 0 1px 4px rgba(91,93,117,0.08);
}
.case-icon {
  width: 40px; height: 40px; border-radius: 9px;
  border: 1px solid; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
.case-type { font-size: 0.9rem; font-weight: 800; }
.case-ref { font-size: 0.58rem; color: #5b5d75; margin-top: 3px; font-family: 'Courier New', monospace; letter-spacing: 0.03em; }

.metrics { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.6rem; }
.metric {
  padding: 0.75rem; border-radius: 9px;
  background: #ffffff; border: 1px solid #cad2e3;
  display: flex; flex-direction: column; gap: 0.4rem;
  box-shadow: 0 1px 3px rgba(91,93,117,0.06);
}
.m-label {
  font-size: 0.58rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.09em; color: #5b5d75;
}
.m-row { display: flex; align-items: center; gap: 0.4rem; }
.m-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.m-val { font-size: 0.78rem; font-weight: 700; }
.m-track { height: 3px; background: #cad2e3; border-radius: 2px; overflow: hidden; }
.m-fill { height: 100%; border-radius: 2px; transition: width 1.2s ease; }
.m-fill.gold { background: linear-gradient(90deg, #5b5d75, #2e2b28); }
.m-sub { font-size: 0.62rem; color: #5b5d75; }
.cdots { display: flex; gap: 4px; }
.cdot { width: 8px; height: 8px; border-radius: 2px; background: #cad2e3; transition: background 0.4s ease; }
.cdot.on { background: #2e2b28; }
.conf-val { font-size: 1.1rem; font-weight: 800; color: #2e2b28; line-height: 1; }
.conf-val span { font-size: 0.65rem; color: #5b5d75; font-weight: 700; }

.juris-row {
  display: flex; align-items: center; gap: 0.45rem;
  padding: 0.55rem 0.8rem;
  background: #ffffff; border: 1px solid #cad2e3;
  border-radius: 7px;
}
.j-label { font-size: 0.65rem; color: #2e2b28; font-weight: 600; }
.j-val { font-size: 0.65rem; color: #5b5d75; }

.facts-box {
  background: #ffffff; border: 1px solid #cad2e3;
  border-radius: 10px; overflow: hidden;
  box-shadow: 0 1px 3px rgba(91,93,117,0.06);
}
.facts-top {
  display: flex; align-items: center; gap: 0.4rem;
  padding: 0.6rem 0.9rem; border-bottom: 1px solid #cad2e3;
  font-size: 0.6rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.09em; color: #5b5d75;
  background: #f1ece6;
}
.facts { list-style: none; padding: 0.6rem; display: flex; flex-direction: column; gap: 0.35rem; }
.fact-item {
  display: flex; align-items: flex-start; gap: 0.55rem;
  padding: 0.45rem 0.6rem; border-radius: 6px;
  background: #ffffff; border: 1px solid #cad2e3;
  font-size: 0.72rem; color: #5b5d75; line-height: 1.5;
  animation: riseIn 0.4s ease both;
}
.fact-dot {
  width: 4px; height: 4px; border-radius: 50%;
  background: #5b5d75; margin-top: 7px; flex-shrink: 0;
}

/* ═══════════════════════════════════════
   RIGHT PANEL
═══════════════════════════════════════ */
.panel-right { overflow: hidden; }

/* Matching */
.matching {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 2rem; gap: 0.5rem;
}
.match-anim {
  position: relative; width: 72px; height: 72px;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 0.5rem;
}
.mr {
  position: absolute; border-radius: 50%;
  border: 1px solid #5b5d75; animation: ripple 2s infinite;
}
.mr.r1 { width: 24px; height: 24px; animation-delay: 0s; }
.mr.r2 { width: 44px; height: 44px; animation-delay: 0.6s; }
.mr.r3 { width: 66px; height: 66px; animation-delay: 1.2s; }
@keyframes ripple { 0% { opacity: 0.6; transform: scale(0.85); } 100% { opacity: 0; transform: scale(1.1); } }
.mc {
  position: relative; z-index: 1;
  width: 30px; height: 30px; border-radius: 50%;
  background: #ffffff; border: 1.5px solid #cad2e3;
  display: flex; align-items: center; justify-content: center;
}
.match-title { font-size: 0.78rem; font-weight: 600; color: #5b5d75; }
.match-sub { font-size: 0.65rem; color: #5b5d75; }
.match-chips { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.3rem; margin-top: 0.4rem; }
.match-chip {
  font-size: 0.58rem; padding: 2px 8px;
  border: 1px solid #cad2e3; border-radius: 20px;
  color: #5b5d75; background: #ffffff;
}

/* Lawyer card */
.lawyer-card {
  flex: 1; min-height: 0; overflow-y: auto;
  padding: 1rem 1rem 0; display: flex; flex-direction: column; gap: 0.85rem;
}

.score-block {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.9rem 1rem;
  background: #ffffff; border: 1px solid #cad2e3;
  border-radius: 12px;
}
.score-label {
  font-size: 0.58rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.09em; color: #5b5d75;
  margin-bottom: 4px;
}
.score-num {
  font-size: 2.2rem; font-weight: 800; line-height: 1; color: #2e2b28;
}
.score-num span { font-size: 1rem; color: #5b5d75; font-weight: 700; }

.l-identity { display: flex; align-items: center; gap: 0.85rem; }
.l-avatar {
  width: 48px; height: 48px; border-radius: 13px;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.82rem; font-weight: 800; color: #ffffff; flex-shrink: 0;
  box-shadow: 0 3px 12px rgba(46,43,40,0.2);
  letter-spacing: 0.04em;
}
.l-name { font-size: 0.88rem; font-weight: 800; color: #2e2b28; }
.l-role { font-size: 0.68rem; color: #5b5d75; margin-top: 2px; }
.l-loc {
  display: flex; align-items: center; gap: 3px;
  font-size: 0.62rem; color: #5b5d75; margin-top: 4px;
}

.l-stats {
  display: flex; border: 1px solid #cad2e3; border-radius: 10px;
  background: #ffffff; overflow: hidden; align-items: stretch;
}
.lstat { flex: 1; padding: 0.8rem 0 0.7rem; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; min-height: 56px; }
.lstat-n { font-size: 1rem; font-weight: 800; color: #2e2b28; line-height: 1; }
.lstat-n span { font-size: 0.6rem; color: #5b5d75; font-weight: 500; }
.lstat-l { display: block; font-size: 0.55rem; line-height: 1.15; text-transform: uppercase; letter-spacing: 0.07em; color: #5b5d75; }
.lstat-sep { width: 1px; background: #cad2e3; margin: 8px 0; }

.l-section { display: flex; flex-direction: column; gap: 0.45rem; }
.l-sec-label {
  font-size: 0.6rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.09em; color: #5b5d75;
}
.specs { display: flex; flex-wrap: wrap; gap: 0.3rem; }
.spec {
  font-size: 0.62rem; padding: 3px 9px; border-radius: 20px;
  background: #f1ece6; border: 1px solid #cad2e3; color: #5b5d75;
}
.spec.primary {
  background: #ffffff; border-color: #5b5d75;
  color: #2e2b28; font-weight: 600;
}

.reasoning {
  background: #ffffff; border: 1px solid #cad2e3;
  border-left: 3px solid #5b5d75;
  border-radius: 0 8px 8px 0; padding: 0.75rem 0.9rem;
}
.r-head {
  display: flex; align-items: center; gap: 0.4rem;
  margin-bottom: 0.5rem;
  font-size: 0.6rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.09em; color: #2e2b28;
}
.r-icon {
  width: 18px; height: 18px; border-radius: 4px;
  background: #f1ece6; border: 1px solid #cad2e3;
  display: flex; align-items: center; justify-content: center;
}
.r-body { font-size: 0.7rem; color: #5b5d75; line-height: 1.7; }

.past-cases { display: flex; flex-direction: column; gap: 0.35rem; }
.pcase {
  display: flex; align-items: center; gap: 0.55rem;
  padding: 0.45rem 0.6rem; border-radius: 7px;
  background: #ffffff; border: 1px solid #cad2e3;
  cursor: pointer; transition: all 0.16s ease;
}
.pcase:hover {
  background: #f1ece6; border-color: #5b5d75;
  box-shadow: 0 4px 12px rgba(46,43,40,0.12);
  transform: translateY(-1px);
}
.pc-badge {
  width: 20px; height: 20px; border-radius: 5px;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.6rem; font-weight: 800; flex-shrink: 0;
}
.pc-badge.won { background: #f1ece6; color: #2e2b28; }
.pc-badge.settled { background: #f1ece6; color: #5b5d75; }
.pc-info { flex: 1; min-width: 0; }
.pc-title { font-size: 0.65rem; color: #5b5d75; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pc-verdict { font-size: 0.55rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }
.pc-verdict.won { color: #2e2b28; }
.pc-verdict.settled { color: #5b5d75; }
.pc-year { font-size: 0.6rem; color: #5b5d75; flex-shrink: 0; }

.l-cta {
  position: sticky; bottom: 0; z-index: 3;
  display: flex; flex-direction: column; gap: 0.4rem;
  margin: 0 -1rem; padding: 0.75rem 1rem 1rem;
  background: #ffffff; border-top: 1px solid #cad2e3;
  box-shadow: 0 -12px 18px rgba(255,255,255,0.94);
}
.cta-confirm {
  display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  padding: 0.72rem; border-radius: 9px;
  background: #2e2b28; color: #ffffff;
  font-size: 0.76rem; font-weight: 700; border: none;
  cursor: pointer; letter-spacing: 0.02em;
  box-shadow: 0 2px 12px rgba(46,43,40,0.2);
  transition: all 0.18s;
}
.cta-confirm:hover { background: #5b5d75; box-shadow: 0 4px 18px rgba(46,43,40,0.3); transform: translateY(-1px); }
.cta-alt {
  padding: 0.65rem; border-radius: 9px;
  background: transparent; border: 1px solid #cad2e3;
  color: #5b5d75; font-size: 0.72rem; cursor: pointer;
  transition: all 0.15s;
}
.cta-alt:hover { border-color: #5b5d75; color: #2e2b28; background: #f1ece6; }

/* ═══════════════════════════════════════
   TRANSITIONS
═══════════════════════════════════════ */
.rise-enter-active { animation: riseIn 0.45s ease; }
@keyframes riseIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
