<template>
  <div class="root">

    <!-- HEADER -->
    <header class="header">
      <div class="header-left">
        <div class="logo-mark">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" stroke="#c9a84c" stroke-width="1.5" stroke-linejoin="round"/>
            <path d="M12 22V12M3 7l9 5 9-5" stroke="#c9a84c" stroke-width="1.5"/>
          </svg>
        </div>
        <span class="logo-name">LexAI</span>
        <span class="logo-divider">|</span>
        <span class="logo-sub">Plateforme juridique intelligente</span>
      </div>
      <div class="header-right">
        <div class="status-dot"></div>
        <span class="status-label">Système opérationnel</span>
        <div class="header-badge">DEMO</div>
      </div>
    </header>

    <!-- MAIN LAYOUT -->
    <main class="layout">

      <!-- ═══════════════════════════════════════
           LEFT PANEL — Client input
      ═══════════════════════════════════════ -->
      <section class="panel panel-left">
        <div class="panel-header">
          <div class="panel-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <span>Demande client</span>
        </div>

        <!-- Scenario presets -->
        <div class="presets-label">Scénarios de démonstration</div>
        <div class="presets">
          <button
            v-for="(s, i) in scenarios"
            :key="i"
            class="preset-btn"
            :class="{ active: selectedScenario === i }"
            @click="selectScenario(i)"
          >
            <span class="preset-tag" :style="{ background: s.tagColor }">{{ s.tag }}</span>
            {{ s.label }}
          </button>
        </div>

        <!-- Description -->
        <div class="field">
          <label class="field-label">Description de la situation</label>
          <textarea
            v-model="clientText"
            class="textarea"
            placeholder="Décrivez votre situation juridique en détail…"
            rows="7"
            :disabled="isAnalyzing"
          />
          <div class="char-count">{{ clientText.length }} caractères</div>
        </div>

        <!-- File upload -->
        <div class="field">
          <label class="field-label">Pièces jointes</label>
          <div class="dropzone" :class="{ 'has-file': uploadedFiles.length > 0 }" @click="simulateUpload">
            <template v-if="uploadedFiles.length === 0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a5568" stroke-width="1.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              <span class="dropzone-text">Cliquer pour ajouter un document</span>
              <span class="dropzone-hint">PDF, DOCX, JPG — max 10 Mo</span>
            </template>
            <template v-else>
              <div v-for="f in uploadedFiles" :key="f.name" class="file-item">
                <div class="file-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                </div>
                <div class="file-info">
                  <span class="file-name">{{ f.name }}</span>
                  <span class="file-size">{{ f.size }}</span>
                </div>
                <div class="file-ok">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
              </div>
              <button class="add-more" @click.stop="simulateUpload">+ Ajouter</button>
            </template>
          </div>
        </div>

        <!-- Submit -->
        <button
          class="submit-btn"
          :disabled="!clientText.trim() || isAnalyzing"
          @click="startAnalysis"
        >
          <template v-if="isAnalyzing">
            <span class="spinner"></span>
            Analyse en cours…
          </template>
          <template v-else>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            Analyser le dossier
          </template>
        </button>

        <!-- Reset -->
        <button v-if="showReset" class="reset-btn" @click="reset">
          Réinitialiser
        </button>
      </section>

      <!-- ═══════════════════════════════════════
           CENTER PANEL — AI Analysis
      ═══════════════════════════════════════ -->
      <section class="panel panel-center">
        <div class="panel-header">
          <div class="panel-icon accent">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2a10 10 0 1 0 10 10"/>
              <path d="M12 6v6l4 2"/>
              <circle cx="19" cy="5" r="3" fill="#c9a84c" stroke="none"/>
            </svg>
          </div>
          <span>Analyse IA</span>
          <div v-if="analysisReady" class="panel-badge-ok">Complète</div>
        </div>

        <!-- IDLE STATE -->
        <div v-if="!isAnalyzing && !analysisReady" class="idle-state">
          <div class="idle-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2d3748" stroke-width="1.2">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M8 12h8M8 8h5M8 16h3"/>
            </svg>
          </div>
          <p class="idle-text">En attente de la demande client</p>
          <p class="idle-hint">L'analyse apparaîtra ici après soumission</p>
        </div>

        <!-- LOADING STATE -->
        <div v-if="isAnalyzing" class="loading-state">
          <div class="loading-header">
            <div class="pulse-ring"></div>
            <span class="loading-title">Traitement en cours…</span>
          </div>
          <div class="steps-list">
            <div
              v-for="(step, i) in analysisSteps"
              :key="i"
              class="step-item"
              :class="{
                done: step.done,
                active: step.active,
                pending: !step.done && !step.active
              }"
            >
              <div class="step-dot">
                <svg v-if="step.done" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span v-else-if="step.active" class="step-spinner"></span>
              </div>
              <span class="step-label">{{ step.label }}</span>
              <span v-if="step.done" class="step-time">{{ step.duration }}</span>
            </div>
          </div>
        </div>

        <!-- RESULTS STATE -->
        <div v-if="analysisReady" class="results">

          <!-- Case type -->
          <div class="result-block">
            <div class="result-label">Type de litige</div>
            <div class="case-type-row">
              <span class="case-badge" :style="{ background: result.caseColor + '22', color: result.caseColor, borderColor: result.caseColor + '44' }">
                {{ result.caseType }}
              </span>
              <span class="case-code">{{ result.caseCode }}</span>
            </div>
          </div>

          <!-- Urgency + Complexity -->
          <div class="result-row-2">
            <div class="result-block half">
              <div class="result-label">Urgence</div>
              <div class="urgency-row">
                <div class="urgency-dot" :style="{ background: urgencyColor }"></div>
                <span class="urgency-text" :style="{ color: urgencyColor }">{{ result.urgency }}</span>
              </div>
              <div class="urgency-bar-track">
                <div class="urgency-bar-fill" :style="{ width: result.urgencyLevel + '%', background: urgencyColor }"></div>
              </div>
            </div>
            <div class="result-block half">
              <div class="result-label">Complexité</div>
              <div class="complexity-dots">
                <span
                  v-for="n in 5"
                  :key="n"
                  class="complexity-dot"
                  :class="{ filled: n <= result.complexity }"
                ></span>
              </div>
              <div class="complexity-label">{{ result.complexityLabel }}</div>
            </div>
          </div>

          <!-- Jurisdiction -->
          <div class="result-block">
            <div class="result-label">Juridiction compétente</div>
            <div class="jurisdiction-tag">{{ result.jurisdiction }}</div>
          </div>

          <!-- Extracted facts -->
          <div class="result-block">
            <div class="result-label">Faits clés extraits</div>
            <ul class="facts-list">
              <li
                v-for="(fact, i) in result.facts"
                :key="i"
                class="fact-item"
                :style="{ animationDelay: (i * 0.12) + 's' }"
              >
                <div class="fact-bullet"></div>
                <span>{{ fact }}</span>
              </li>
            </ul>
          </div>

          <!-- Confidence -->
          <div class="result-block">
            <div class="result-label">Indice de confiance de l'analyse</div>
            <div class="confidence-row">
              <div class="confidence-track">
                <div class="confidence-fill" :style="{ width: result.confidence + '%' }"></div>
              </div>
              <span class="confidence-pct">{{ result.confidence }}%</span>
            </div>
          </div>

        </div>
      </section>

      <!-- ═══════════════════════════════════════
           RIGHT PANEL — Lawyer Match
      ═══════════════════════════════════════ -->
      <section class="panel panel-right">
        <div class="panel-header">
          <div class="panel-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <span>Avocat assigné</span>
          <div v-if="lawyerReady" class="panel-badge-ok">Assigné</div>
        </div>

        <!-- IDLE -->
        <div v-if="!isAnalyzing && !lawyerReady" class="idle-state">
          <div class="idle-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2d3748" stroke-width="1.2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <p class="idle-text">Aucun dossier en cours</p>
          <p class="idle-hint">L'avocat sera sélectionné après l'analyse</p>
        </div>

        <!-- LOADING -->
        <div v-if="isAnalyzing && !lawyerReady" class="idle-state">
          <div class="matching-anim">
            <div class="matching-ring r1"></div>
            <div class="matching-ring r2"></div>
            <div class="matching-ring r3"></div>
            <div class="matching-core">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
          </div>
          <p class="idle-text" style="margin-top: 1rem;">Recherche de correspondance…</p>
          <p class="idle-hint">Comparaison avec {{ lawyerPool.length }} avocats</p>
        </div>

        <!-- LAWYER CARD -->
        <div v-if="lawyerReady" class="lawyer-card">

          <!-- Match score banner -->
          <div class="match-banner">
            <div class="match-score-wrap">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span>Correspondance</span>
            </div>
            <div class="match-pct">{{ lawyer.matchScore }}%</div>
          </div>
          <div class="match-bar-track">
            <div class="match-bar-fill" :style="{ width: lawyer.matchScore + '%' }"></div>
          </div>

          <!-- Identity -->
          <div class="lawyer-identity">
            <div class="lawyer-avatar" :style="{ background: lawyer.avatarColor }">
              {{ lawyer.initials }}
            </div>
            <div class="lawyer-bio">
              <div class="lawyer-name">{{ lawyer.name }}</div>
              <div class="lawyer-title">{{ lawyer.title }}</div>
              <div class="lawyer-location">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                {{ lawyer.location }}
              </div>
            </div>
          </div>

          <!-- Stats -->
          <div class="lawyer-stats">
            <div class="stat-item">
              <div class="stat-value">{{ lawyer.experience }}</div>
              <div class="stat-label">Années d'exp.</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <div class="stat-value">{{ lawyer.cases }}</div>
              <div class="stat-label">Affaires traitées</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <div class="stat-value">{{ lawyer.successRate }}%</div>
              <div class="stat-label">Taux de succès</div>
            </div>
          </div>

          <!-- Specializations -->
          <div class="section-mini-label">Spécialisations</div>
          <div class="spec-tags">
            <span
              v-for="s in lawyer.specializations"
              :key="s"
              class="spec-tag"
              :class="{ primary: s === lawyer.primarySpec }"
            >{{ s }}</span>
          </div>

          <!-- AI Reasoning -->
          <div class="reasoning-box">
            <div class="reasoning-header">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              </svg>
              <span>Raisonnement IA</span>
            </div>
            <p class="reasoning-text">{{ lawyer.reasoning }}</p>
          </div>

          <!-- Relevant cases -->
          <div class="section-mini-label">Affaires similaires traitées</div>
          <div class="past-cases">
            <div v-for="(c, i) in lawyer.pastCases" :key="i" class="past-case">
              <div class="past-case-dot"></div>
              <div class="past-case-info">
                <span class="past-case-title">{{ c.title }}</span>
                <span class="past-case-outcome" :class="c.won ? 'won' : 'settled'">{{ c.won ? 'Gagné' : 'Accord amiable' }}</span>
              </div>
              <span class="past-case-year">{{ c.year }}</span>
            </div>
          </div>

          <!-- CTA -->
          <div class="cta-row">
            <button class="cta-primary">Confirmer l'assignation</button>
            <button class="cta-secondary">Voir d'autres avocats</button>
          </div>

        </div>
      </section>

    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// ─── MOCK DATA ──────────────────────────────────────────────────────────────

const scenarios = [
  {
    label: 'Licenciement abusif',
    tag: 'Travail',
    tagColor: '#1d4ed8',
    text: `Je travaillais depuis 7 ans dans une entreprise de logistique en tant que responsable d'équipe. En mars dernier, j'ai été licencié sans cause réelle et sérieuse après m'être plaint auprès des RH de pratiques discriminatoires envers plusieurs collègues. Mon employeur prétend que le licenciement est économique, mais aucun plan social n'a été déclenché et j'ai été remplacé par quelqu'un d'autre trois semaines plus tard. Je souhaite contester ce licenciement devant le Conseil de Prud'hommes et obtenir des indemnités. J'ai conservé tous mes échanges écrits avec les RH et mes fiches de paie.`,
    files: [
      { name: 'Lettre_licenciement.pdf', size: '124 Ko' },
      { name: 'Echanges_RH_2024.pdf', size: '387 Ko' },
    ],
    analysis: {
      caseType: 'Droit du travail',
      caseCode: 'ART. L1235-3 C. TRAV.',
      caseColor: '#3b82f6',
      urgency: 'Élevée',
      urgencyLevel: 78,
      complexity: 3,
      complexityLabel: 'Modérée',
      jurisdiction: 'Conseil de Prud\'hommes de Paris',
      confidence: 94,
      facts: [
        'Licenciement après signalement de discrimination — potentiel licenciement en représailles',
        'Ancienneté de 7 ans — indemnités légales significatives',
        'Remplacement du poste sous 3 semaines — contredit la cause économique invoquée',
        'Délai de saisine prud\'homale : 12 mois à partir de la notification',
        'Preuves écrites disponibles (échanges RH, lettres)',
      ],
    },
    lawyer: {
      name: 'Maître Marie Fontaine',
      initials: 'MF',
      avatarColor: '#1e3a5f',
      title: 'Avocate en droit du travail',
      location: 'Paris, Île-de-France',
      experience: 14,
      cases: 312,
      successRate: 87,
      matchScore: 96,
      primarySpec: 'Droit du travail',
      specializations: ['Droit du travail', 'Licenciements abusifs', 'Discrimination', 'Prud\'hommes'],
      reasoning: `Maître Fontaine est identifiée comme le meilleur profil : elle se spécialise exclusivement dans les litiges prud'homaux liés aux licenciements abusifs et à la discrimination, avec un taux de succès de 87 % sur 312 affaires. Son expérience de 14 ans au barreau de Paris et sa connaissance approfondie de l'article L1235-3 du Code du travail correspondent exactement au profil du dossier.`,
      pastCases: [
        { title: 'Licenciement représailles après signalement harcèlement', won: true, year: '2024' },
        { title: 'Cause économique invoquée sans suppression de poste réelle', won: true, year: '2023' },
        { title: 'Discrimination syndicale — cadre supérieur', won: false, year: '2022' },
      ],
    },
  },
  {
    label: 'Litige immobilier',
    tag: 'Immobilier',
    tagColor: '#059669',
    text: `J'ai acquis un appartement il y a 14 mois. Lors de l'achat, le vendeur m'a assuré oralement que les travaux de rénovation de la toiture avaient été réalisés et payés. Depuis l'hiver, je constate des infiltrations d'eau importantes dans les deux chambres du dernier étage. Un expert mandaté par mon assurance a confirmé que la toiture n'avait jamais été rénovée. Le vendeur refuse de me rembourser les frais de réparation (estimés à 28 000 €) et prétend avoir vendu en l'état. Je cherche à agir en justice pour vices cachés.`,
    files: [
      { name: 'Rapport_expertise_toiture.pdf', size: '2.1 Mo' },
      { name: 'Acte_de_vente.pdf', size: '512 Ko' },
      { name: 'Photos_infiltrations.jpg', size: '4.3 Mo' },
    ],
    analysis: {
      caseType: 'Droit immobilier',
      caseCode: 'ART. 1641 C. CIV. — VICES CACHÉS',
      caseColor: '#10b981',
      urgency: 'Modérée',
      urgencyLevel: 52,
      complexity: 4,
      complexityLabel: 'Élevée',
      jurisdiction: 'Tribunal judiciaire',
      confidence: 91,
      facts: [
        'Vice caché constitué : défaut antérieur à la vente, non apparent, rendant le bien impropre à l\'usage',
        'Délai d\'action : 2 ans à compter de la découverte du vice (art. 1648 C. civ.)',
        'Préjudice chiffré : 28 000 € de travaux selon expert',
        'Déclaration mensongère du vendeur sur les travaux — dol potentiel',
        'Rapport d\'expertise contradictoire disponible — pièce clé',
      ],
    },
    lawyer: {
      name: 'Maître Thomas Andreani',
      initials: 'TA',
      avatarColor: '#14532d',
      title: 'Avocat en droit immobilier',
      location: 'Lyon, Auvergne-Rhône-Alpes',
      experience: 11,
      cases: 247,
      successRate: 82,
      matchScore: 93,
      primarySpec: 'Droit immobilier',
      specializations: ['Droit immobilier', 'Vices cachés', 'Transactions & litiges', 'Droit de la construction'],
      reasoning: `Maître Andreani présente le profil idéal pour ce dossier : sa pratique est centrée sur les litiges post-acquisition et les actions en garantie des vices cachés. Il a traité 247 affaires immobilières avec un taux de succès de 82 %, et dispose d'une solide expérience dans l'exploitation de rapports d'expertise contradictoires devant le Tribunal judiciaire.`,
      pastCases: [
        { title: 'Vice caché — défaut structurel dissimulé par le vendeur', won: true, year: '2024' },
        { title: 'Dol du vendeur — fausses déclarations sur permis de construire', won: true, year: '2023' },
        { title: 'Infiltrations toiture — action en réduction de prix', won: false, year: '2022' },
      ],
    },
  },
  {
    label: 'Divorce contentieux',
    tag: 'Famille',
    tagColor: '#7c3aed',
    text: `Je souhaite divorcer de mon conjoint après 11 ans de mariage. Nous avons deux enfants de 6 et 9 ans. Mon conjoint refuse le divorce par consentement mutuel et conteste ma demande de garde principale. Je bénéficie d'un CDI stable et j'ai toujours été le parent principal. Mon conjoint a des revenus irréguliers et voyage fréquemment à l'étranger pour son activité professionnelle. Je souhaite obtenir la garde principale, une pension alimentaire, et conserver le domicile conjugal jusqu'à la majorité des enfants.`,
    files: [
      { name: 'Jugement_mariage.pdf', size: '89 Ko' },
      { name: 'Fiches_paie_2024.pdf', size: '631 Ko' },
    ],
    analysis: {
      caseType: 'Droit de la famille',
      caseCode: 'ART. 229 ET S. C. CIV. — DIVORCE',
      caseColor: '#8b5cf6',
      urgency: 'Modérée',
      urgencyLevel: 60,
      complexity: 4,
      complexityLabel: 'Élevée',
      jurisdiction: 'Juge aux affaires familiales (JAF)',
      confidence: 89,
      facts: [
        'Divorce pour faute ou altération définitive du lien conjugal — à qualifier selon les faits',
        'Enfants mineurs : résidence principale à définir selon l\'intérêt de l\'enfant',
        'Stabilité professionnelle du demandeur vs revenus irréguliers du conjoint — atout en garde',
        'Présence parentale principale établie — élément favorable à la garde',
        'Domicile conjugal : attribution possible jusqu\'à majorité des enfants',
      ],
    },
    lawyer: {
      name: 'Maître Sophie Marchand',
      initials: 'SM',
      avatarColor: '#4c1d95',
      title: 'Avocate en droit de la famille',
      location: 'Bordeaux, Nouvelle-Aquitaine',
      experience: 9,
      cases: 198,
      successRate: 84,
      matchScore: 91,
      primarySpec: 'Droit de la famille',
      specializations: ['Droit de la famille', 'Divorce contentieux', 'Garde d\'enfants', 'Autorité parentale'],
      reasoning: `Maître Marchand est spécialisée dans les divorces contentieux impliquant des enfants mineurs. Son approche combine la défense des intérêts parentaux et la protection de l'intérêt de l'enfant, critère central pour le JAF. Son expérience de 9 ans et ses 198 dossiers traités, dont une majorité de cas avec garde disputée, en font le profil le plus adapté à cette situation.`,
      pastCases: [
        { title: 'Garde principale obtenue malgré opposition du conjoint', won: true, year: '2024' },
        { title: 'Attribution du domicile conjugal — enfants en bas âge', won: true, year: '2023' },
        { title: 'Révision pension alimentaire — revenus variables', won: false, year: '2023' },
      ],
    },
  },
]

// ─── STATE ───────────────────────────────────────────────────────────────────

const selectedScenario = ref(null)
const clientText = ref('')
const uploadedFiles = ref([])
const isAnalyzing = ref(false)
const analysisReady = ref(false)
const lawyerReady = ref(false)
const showReset = ref(false)
const result = ref({})
const lawyer = ref({})

const analysisSteps = ref([
  { label: 'Lecture et indexation des documents', done: false, active: false, duration: '' },
  { label: 'Identification du type de litige', done: false, active: false, duration: '' },
  { label: 'Évaluation de l\'urgence et de la complexité', done: false, active: false, duration: '' },
  { label: 'Extraction des faits clés', done: false, active: false, duration: '' },
  { label: 'Scoring et sélection de l\'avocat', done: false, active: false, duration: '' },
])

// ─── COMPUTED ─────────────────────────────────────────────────────────────────

const urgencyColor = computed(() => {
  if (!result.value.urgencyLevel) return '#4a5568'
  if (result.value.urgencyLevel >= 70) return '#ef4444'
  if (result.value.urgencyLevel >= 40) return '#f59e0b'
  return '#22c55e'
})

// ─── METHODS ─────────────────────────────────────────────────────────────────

function selectScenario(i) {
  if (isAnalyzing.value) return
  selectedScenario.value = i
  clientText.value = scenarios[i].text
  uploadedFiles.value = [...scenarios[i].files]
  analysisReady.value = false
  lawyerReady.value = false
  showReset.value = false
  resetSteps()
}

function simulateUpload() {
  if (isAnalyzing.value) return
  const fakeFiles = [
    { name: 'Document_justificatif.pdf', size: '248 Ko' },
    { name: 'Courrier_officiel.pdf', size: '185 Ko' },
    { name: 'Preuves_photos.jpg', size: '3.2 Mo' },
  ]
  const next = fakeFiles.find(f => !uploadedFiles.value.some(u => u.name === f.name))
  if (next) uploadedFiles.value.push(next)
}

function resetSteps() {
  analysisSteps.value.forEach(s => { s.done = false; s.active = false; s.duration = '' })
}

async function startAnalysis() {
  if (!clientText.value.trim() || isAnalyzing.value) return

  const scenario = selectedScenario.value !== null ? scenarios[selectedScenario.value] : scenarios[0]

  isAnalyzing.value = true
  analysisReady.value = false
  lawyerReady.value = false
  showReset.value = false
  resetSteps()

  const durations = ['0.4s', '0.6s', '0.8s', '0.5s', '1.1s']
  const delays = [800, 1200, 1000, 1100, 1400]

  for (let i = 0; i < analysisSteps.value.length; i++) {
    analysisSteps.value[i].active = true
    await sleep(delays[i])
    analysisSteps.value[i].active = false
    analysisSteps.value[i].done = true
    analysisSteps.value[i].duration = durations[i]

    // After step 3 (facts extracted), show analysis panel
    if (i === 3) {
      result.value = { ...scenario.analysis }
      await sleep(300)
      analysisReady.value = true
    }
  }

  // Show lawyer after all steps
  await sleep(600)
  lawyer.value = { ...scenario.lawyer }
  lawyerReady.value = true
  isAnalyzing.value = false
  showReset.value = true
}

function reset() {
  selectedScenario.value = null
  clientText.value = ''
  uploadedFiles.value = []
  isAnalyzing.value = false
  analysisReady.value = false
  lawyerReady.value = false
  showReset.value = false
  result.value = {}
  lawyer.value = {}
  resetSteps()
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}
</script>

<style scoped>
/* ── ROOT ── */
.root {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #0f1117;
  overflow: hidden;
}

/* ── HEADER ── */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  height: 52px;
  border-bottom: 1px solid #1e2535;
  background: #0b0e17;
  flex-shrink: 0;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.logo-mark {
  display: flex;
  align-items: center;
}
.logo-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: #c9a84c;
  letter-spacing: 0.04em;
}
.logo-divider {
  color: #2d3748;
  font-size: 0.9rem;
}
.logo-sub {
  font-size: 0.72rem;
  color: #4a5568;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.status-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 6px #22c55e88;
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
.status-label { font-size: 0.72rem; color: #4a5568; }
.header-badge {
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #c9a84c;
  border: 1px solid #c9a84c44;
  padding: 2px 6px;
  border-radius: 3px;
  background: #c9a84c11;
}

/* ── LAYOUT ── */
.layout {
  display: grid;
  grid-template-columns: 320px 1fr 340px;
  flex: 1;
  overflow: hidden;
  gap: 0;
}

/* ── PANELS ── */
.panel {
  border-right: 1px solid #1e2535;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.panel:last-child { border-right: none; }
.panel-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.2rem;
  border-bottom: 1px solid #1e2535;
  font-size: 0.78rem;
  font-weight: 600;
  color: #94a3b8;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  background: #0b0e17;
  flex-shrink: 0;
}
.panel-icon {
  width: 24px; height: 24px;
  border-radius: 6px;
  background: #1e2535;
  display: flex; align-items: center; justify-content: center;
  color: #64748b;
}
.panel-icon.accent { background: #c9a84c22; color: #c9a84c; }
.panel-badge-ok {
  margin-left: auto;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #22c55e;
  border: 1px solid #22c55e44;
  padding: 2px 7px;
  border-radius: 3px;
  background: #22c55e11;
}

/* LEFT panel body */
.panel-left {
  padding: 1rem;
  overflow-y: auto;
  gap: 0.9rem;
  display: flex;
  flex-direction: column;
}

/* ── PRESETS ── */
.presets-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #4a5568;
  font-weight: 600;
}
.presets {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.preset-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 0.75rem;
  border-radius: 7px;
  border: 1px solid #1e2535;
  background: #161b27;
  color: #94a3b8;
  font-size: 0.78rem;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s ease;
}
.preset-btn:hover { border-color: #2d3748; color: #e2e8f0; }
.preset-btn.active { border-color: #c9a84c44; background: #c9a84c0d; color: #e2e8f0; }
.preset-tag {
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  padding: 2px 6px;
  border-radius: 3px;
  color: #fff;
  opacity: 0.9;
  flex-shrink: 0;
}

/* ── FIELDS ── */
.field { display: flex; flex-direction: column; gap: 0.4rem; }
.field-label {
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #4a5568;
  font-weight: 600;
}
.textarea {
  background: #161b27;
  border: 1px solid #1e2535;
  border-radius: 8px;
  padding: 0.75rem;
  color: #cbd5e1;
  font-size: 0.78rem;
  line-height: 1.6;
  resize: none;
  font-family: inherit;
  transition: border-color 0.15s;
}
.textarea:focus { outline: none; border-color: #c9a84c55; }
.textarea:disabled { opacity: 0.5; }
.char-count { font-size: 0.62rem; color: #2d3748; text-align: right; }

/* ── DROPZONE ── */
.dropzone {
  border: 1px dashed #2d3748;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  cursor: pointer;
  transition: border-color 0.15s;
  min-height: 80px;
  background: #161b27;
}
.dropzone:hover { border-color: #4a5568; }
.dropzone.has-file {
  align-items: stretch;
  border-style: solid;
  border-color: #1e2535;
  gap: 0.5rem;
}
.dropzone-text { font-size: 0.75rem; color: #4a5568; }
.dropzone-hint { font-size: 0.62rem; color: #2d3748; }
.file-item {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.4rem 0.5rem;
  background: #0f1117;
  border-radius: 5px;
  border: 1px solid #1e2535;
}
.file-icon { flex-shrink: 0; }
.file-info { flex: 1; min-width: 0; }
.file-name { font-size: 0.72rem; color: #94a3b8; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.file-size { font-size: 0.62rem; color: #4a5568; }
.file-ok { flex-shrink: 0; }
.add-more {
  font-size: 0.68rem; color: #4a5568;
  background: none; border: none; cursor: pointer;
  text-align: center; padding: 0.25rem;
}
.add-more:hover { color: #94a3b8; }

/* ── BUTTONS ── */
.submit-btn {
  display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  background: #c9a84c;
  color: #0b0e17;
  font-size: 0.82rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  letter-spacing: 0.02em;
  transition: all 0.15s;
}
.submit-btn:hover:not(:disabled) { background: #d4b45e; }
.submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.reset-btn {
  background: none;
  border: 1px solid #1e2535;
  color: #4a5568;
  font-size: 0.72rem;
  padding: 0.45rem;
  border-radius: 7px;
  cursor: pointer;
  text-align: center;
  transition: all 0.15s;
}
.reset-btn:hover { color: #94a3b8; border-color: #2d3748; }

/* ── SPINNER ── */
.spinner {
  width: 14px; height: 14px;
  border: 2px solid #0b0e17;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── CENTER PANEL ── */
.panel-center {
  overflow-y: auto;
}

/* ── IDLE STATE ── */
.idle-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 2rem;
}
.idle-icon { opacity: 0.4; }
.idle-text { font-size: 0.82rem; color: #4a5568; font-weight: 500; }
.idle-hint { font-size: 0.72rem; color: #2d3748; }

/* ── LOADING STATE ── */
.loading-state {
  padding: 1.5rem 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.loading-header {
  display: flex; align-items: center; gap: 0.7rem;
}
.pulse-ring {
  width: 10px; height: 10px;
  border-radius: 50%;
  background: #c9a84c;
  box-shadow: 0 0 0 0 #c9a84c44;
  animation: ping 1.2s infinite;
}
@keyframes ping {
  0% { box-shadow: 0 0 0 0 #c9a84c55; }
  70% { box-shadow: 0 0 0 10px transparent; }
  100% { box-shadow: 0 0 0 0 transparent; }
}
.loading-title { font-size: 0.82rem; color: #c9a84c; font-weight: 600; }

.steps-list { display: flex; flex-direction: column; gap: 0.6rem; }
.step-item {
  display: flex; align-items: center; gap: 0.7rem;
  padding: 0.6rem 0.8rem;
  border-radius: 7px;
  border: 1px solid transparent;
  transition: all 0.3s ease;
}
.step-item.pending { opacity: 0.3; }
.step-item.active {
  background: #c9a84c0d;
  border-color: #c9a84c33;
}
.step-item.done {
  background: #161b27;
  border-color: #1e2535;
}
.step-dot {
  width: 18px; height: 18px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.step-item.done .step-dot { background: #22c55e22; color: #22c55e; }
.step-item.active .step-dot { background: #c9a84c22; }
.step-item.pending .step-dot { background: #1e2535; }
.step-label { flex: 1; font-size: 0.76rem; color: #94a3b8; }
.step-item.active .step-label { color: #c9a84c; }
.step-item.done .step-label { color: #64748b; }
.step-time { font-size: 0.62rem; color: #2d3748; font-family: 'Courier New', monospace; }
.step-spinner {
  display: block;
  width: 10px; height: 10px;
  border: 1.5px solid #c9a84c44;
  border-top-color: #c9a84c;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

/* ── RESULTS ── */
.results {
  padding: 1rem 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  animation: fadeUp 0.4s ease;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.result-block {
  display: flex; flex-direction: column; gap: 0.5rem;
}
.result-label {
  font-size: 0.62rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #4a5568;
  font-weight: 600;
}
.case-type-row { display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; }
.case-badge {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 4px;
  border: 1px solid transparent;
}
.case-code {
  font-size: 0.62rem;
  color: #4a5568;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.03em;
}
.result-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
.half {}
.urgency-row { display: flex; align-items: center; gap: 0.4rem; }
.urgency-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.urgency-text { font-size: 0.78rem; font-weight: 600; }
.urgency-bar-track { height: 3px; background: #1e2535; border-radius: 2px; margin-top: 4px; }
.urgency-bar-fill { height: 3px; border-radius: 2px; transition: width 1s ease; }
.complexity-dots { display: flex; gap: 4px; }
.complexity-dot {
  width: 8px; height: 8px; border-radius: 2px;
  background: #1e2535;
  transition: background 0.3s ease;
}
.complexity-dot.filled { background: #c9a84c; }
.complexity-label { font-size: 0.7rem; color: #64748b; }
.jurisdiction-tag {
  display: inline-flex;
  font-size: 0.72rem;
  color: #94a3b8;
  background: #161b27;
  border: 1px solid #1e2535;
  padding: 4px 10px;
  border-radius: 5px;
  width: fit-content;
}
.facts-list { display: flex; flex-direction: column; gap: 0.4rem; list-style: none; }
.fact-item {
  display: flex; align-items: flex-start; gap: 0.6rem;
  font-size: 0.76rem;
  color: #94a3b8;
  line-height: 1.5;
  animation: fadeUp 0.4s ease both;
}
.fact-bullet {
  width: 5px; height: 5px; border-radius: 50%;
  background: #c9a84c;
  margin-top: 6px;
  flex-shrink: 0;
}
.confidence-row { display: flex; align-items: center; gap: 0.7rem; }
.confidence-track { flex: 1; height: 4px; background: #1e2535; border-radius: 2px; overflow: hidden; }
.confidence-fill {
  height: 4px;
  background: linear-gradient(90deg, #c9a84c, #f0c96a);
  border-radius: 2px;
  transition: width 1.2s ease;
}
.confidence-pct { font-size: 0.76rem; color: #c9a84c; font-weight: 700; min-width: 36px; }

/* ── RIGHT PANEL ── */
.panel-right { overflow-y: auto; }
.lawyer-card {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  animation: fadeUp 0.5s ease;
}

/* Match banner */
.match-banner {
  display: flex; align-items: center; justify-content: space-between;
  background: #c9a84c11;
  border: 1px solid #c9a84c33;
  border-radius: 8px 8px 0 0;
  padding: 0.55rem 0.8rem;
}
.match-score-wrap {
  display: flex; align-items: center; gap: 0.4rem;
  font-size: 0.65rem;
  color: #c9a84c;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.match-pct {
  font-size: 1.2rem;
  font-weight: 800;
  color: #c9a84c;
}
.match-bar-track {
  height: 3px;
  background: #1e2535;
  border-radius: 0 0 3px 3px;
  overflow: hidden;
}
.match-bar-fill {
  height: 3px;
  background: linear-gradient(90deg, #c9a84c, #f0c96a);
  transition: width 1.5s ease;
}

/* Identity */
.lawyer-identity { display: flex; align-items: center; gap: 0.75rem; }
.lawyer-avatar {
  width: 44px; height: 44px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.82rem; font-weight: 700; color: #fff;
  flex-shrink: 0;
  letter-spacing: 0.03em;
}
.lawyer-name { font-size: 0.88rem; font-weight: 700; color: #e2e8f0; }
.lawyer-title { font-size: 0.72rem; color: #64748b; margin-top: 2px; }
.lawyer-location {
  display: flex; align-items: center; gap: 4px;
  font-size: 0.65rem; color: #4a5568; margin-top: 3px;
}

/* Stats */
.lawyer-stats {
  display: flex;
  border: 1px solid #1e2535;
  border-radius: 8px;
  background: #161b27;
  overflow: hidden;
}
.stat-item {
  flex: 1; padding: 0.6rem 0;
  display: flex; flex-direction: column; align-items: center; gap: 2px;
}
.stat-value { font-size: 0.95rem; font-weight: 700; color: #e2e8f0; }
.stat-label { font-size: 0.58rem; text-transform: uppercase; letter-spacing: 0.07em; color: #4a5568; }
.stat-divider { width: 1px; background: #1e2535; margin: 8px 0; }

/* Specs */
.section-mini-label {
  font-size: 0.62rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #4a5568;
  font-weight: 600;
}
.spec-tags { display: flex; flex-wrap: wrap; gap: 0.35rem; }
.spec-tag {
  font-size: 0.65rem;
  padding: 3px 9px;
  border-radius: 4px;
  background: #161b27;
  border: 1px solid #1e2535;
  color: #64748b;
}
.spec-tag.primary {
  background: #c9a84c15;
  border-color: #c9a84c44;
  color: #c9a84c;
  font-weight: 600;
}

/* Reasoning */
.reasoning-box {
  background: #0b0e17;
  border: 1px solid #1e2535;
  border-left: 2px solid #c9a84c;
  border-radius: 6px;
  padding: 0.75rem;
}
.reasoning-header {
  display: flex; align-items: center; gap: 0.4rem;
  font-size: 0.65rem;
  color: #c9a84c;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-bottom: 0.5rem;
}
.reasoning-text { font-size: 0.73rem; color: #64748b; line-height: 1.65; }

/* Past cases */
.past-cases { display: flex; flex-direction: column; gap: 0.4rem; }
.past-case {
  display: flex; align-items: center; gap: 0.6rem;
  padding: 0.45rem 0.65rem;
  background: #161b27;
  border: 1px solid #1e2535;
  border-radius: 6px;
}
.past-case-dot { width: 6px; height: 6px; border-radius: 50%; background: #2d3748; flex-shrink: 0; }
.past-case-info { flex: 1; min-width: 0; }
.past-case-title { font-size: 0.68rem; color: #64748b; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.past-case-outcome {
  font-size: 0.58rem; font-weight: 700; letter-spacing: 0.05em;
  text-transform: uppercase;
}
.past-case-outcome.won { color: #22c55e; }
.past-case-outcome.settled { color: #f59e0b; }
.past-case-year { font-size: 0.62rem; color: #2d3748; flex-shrink: 0; }

/* CTA */
.cta-row { display: flex; flex-direction: column; gap: 0.4rem; margin-top: 0.2rem; }
.cta-primary {
  padding: 0.65rem;
  background: #c9a84c;
  color: #0b0e17;
  border: none;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 0.02em;
  transition: background 0.15s;
}
.cta-primary:hover { background: #d4b45e; }
.cta-secondary {
  padding: 0.6rem;
  background: transparent;
  color: #4a5568;
  border: 1px solid #1e2535;
  border-radius: 8px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.15s;
}
.cta-secondary:hover { border-color: #2d3748; color: #64748b; }

/* Matching animation */
.matching-anim {
  position: relative;
  width: 60px; height: 60px;
  display: flex; align-items: center; justify-content: center;
}
.matching-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid #c9a84c;
  animation: expand 2s infinite;
}
.r1 { width: 20px; height: 20px; animation-delay: 0s; }
.r2 { width: 36px; height: 36px; animation-delay: 0.5s; }
.r3 { width: 54px; height: 54px; animation-delay: 1s; }
@keyframes expand {
  0% { opacity: 0.6; transform: scale(0.8); }
  100% { opacity: 0; transform: scale(1.2); }
}
.matching-core {
  position: relative;
  z-index: 1;
  width: 28px; height: 28px;
  background: #c9a84c15;
  border: 1px solid #c9a84c44;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
}
</style>
