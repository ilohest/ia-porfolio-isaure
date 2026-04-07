<template>
  <div class="flex flex-col h-screen bg-[#0d0d0d] overflow-hidden">

    <!-- Top bar -->
    <header class="flex items-center justify-between px-6 py-3 border-b border-white/[0.06] bg-[#111111] shrink-0">
      <div class="flex items-center gap-3">
        <div class="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center">
          <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <span class="text-sm font-medium text-white/80">Nexus Immobilier</span>
        <span class="text-white/20 text-xs">·</span>
        <span class="text-xs text-white/40">Analyse de dossiers locatifs</span>
      </div>
      <div class="flex items-center gap-4">
        <span class="text-xs text-white/30">Agent: M. Fontaine</span>
        <div class="w-7 h-7 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-xs text-indigo-300 font-medium">MF</div>
      </div>
    </header>

    <!-- Main layout -->
    <div class="flex flex-1 overflow-hidden">

      <!-- LEFT PANEL: Document Viewer -->
      <div class="w-[52%] border-r border-white/[0.06] flex flex-col overflow-hidden">

        <!-- Document header -->
        <div class="px-5 py-3 border-b border-white/[0.06] flex items-center justify-between shrink-0">
          <div class="flex items-center gap-2.5">
            <svg class="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>
            <span class="text-xs font-medium text-white/60">Dossier de candidature — Julien Martin</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-[10px] text-white/25 bg-white/[0.04] px-2 py-0.5 rounded">PDF · 5 pièces</span>
            <span class="text-[10px] text-white/25 bg-white/[0.04] px-2 py-0.5 rounded">Reçu le 07/04/2026</span>
          </div>
        </div>

        <!-- Drop zone OR document content -->
        <div class="flex-1 overflow-y-auto">
          <div v-if="!fileLoaded" class="flex flex-col items-center justify-center h-full gap-4 px-10"
            @dragover.prevent @drop.prevent="handleDrop"
            :class="isDragging ? 'bg-indigo-600/5' : ''"
            @dragenter="isDragging = true" @dragleave="isDragging = false">
            <div class="w-14 h-14 rounded-xl border border-white/10 flex items-center justify-center"
              :class="isDragging ? 'border-indigo-500/50 bg-indigo-600/10' : 'bg-white/[0.03]'">
              <svg class="w-6 h-6" :class="isDragging ? 'text-indigo-400' : 'text-white/20'" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <div class="text-center">
              <p class="text-sm text-white/50 font-medium mb-1">Déposer le dossier locatif</p>
              <p class="text-xs text-white/25">PDF, ZIP ou dossier complet · max 50 Mo</p>
            </div>
            <button @click="simulateLoad"
              class="mt-2 px-4 py-2 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors cursor-pointer">
              Charger le dossier démo
            </button>
          </div>

          <!-- Document content (shown after load) -->
          <div v-else class="px-6 py-5 space-y-6">

            <!-- Section: Identity -->
            <DocumentSection title="Pièce d'identité" badge="Vérifié" badge-color="green">
              <div class="grid grid-cols-2 gap-x-8 gap-y-2 text-xs">
                <DocField label="Nom" value="MARTIN Julien" />
                <DocField label="Date de naissance" value="12 mars 1997 (29 ans)" />
                <DocField label="Nationalité" value="Française" />
                <DocField label="N° CNI" value="061 234 5678 9" />
                <DocField label="Validité" value="14/08/2029" />
                <DocField label="Adresse actuelle" value="14 rue des Lilas, 69007 Lyon" />
              </div>
            </DocumentSection>

            <!-- Section: Employment -->
            <DocumentSection title="Contrat de travail" badge="CDI" badge-color="blue">
              <div class="grid grid-cols-2 gap-x-8 gap-y-2 text-xs">
                <DocField label="Employeur" value="ALTAIR Technologies SAS" />
                <DocField label="Poste" value="Développeur logiciel" />
                <DocField label="Type de contrat" value="CDI — Temps plein" />
                <DocField label="Date d'embauche" value="03 janvier 2022" />
                <DocField label="Salaire brut" value="3 100 € / mois" />
                <DocField label="Salaire net" value="2 450 € / mois" />
                <DocField label="Période d'essai" value="Terminée" />
                <DocField label="Lieu de travail" value="Lyon Part-Dieu" />
              </div>
            </DocumentSection>

            <!-- Section: Payslips -->
            <DocumentSection title="Bulletins de salaire" badge="3 fiches" badge-color="gray">
              <div class="space-y-2.5">
                <PayslipRow month="Février 2026" gross="3 100 €" net="2 450 €" />
                <PayslipRow month="Janvier 2026" gross="3 100 €" net="2 450 €" />
                <PayslipRow month="Décembre 2025" gross="3 420 €" net="2 680 €" note="Prime de fin d'année" />
              </div>
            </DocumentSection>

            <!-- Section: Bank statement -->
            <DocumentSection title="Relevé bancaire — Février 2026" badge="Crédit Agricole" badge-color="gray">
              <div class="space-y-1.5">
                <BankRow label="Solde au 01/02" value="3 210 €" />
                <BankRow label="Total crédits" value="+ 2 450 €" positive />
                <BankRow label="Loyer actuel" value="- 730 €" />
                <BankRow label="Courses & vie courante" value="- 640 €" />
                <BankRow label="Loisirs & divers" value="- 510 €" highlight />
                <BankRow label="Prélèvements abonnements" value="- 187 €" />
                <BankRow label="Virement sortant non identifié" value="- 290 €" highlight />
                <BankRow label="Solde au 28/02" value="3 303 €" strong />
              </div>
            </DocumentSection>

            <!-- Section: Guarantor -->
            <DocumentSection title="Garant" badge="Parent" badge-color="purple">
              <div class="grid grid-cols-2 gap-x-8 gap-y-2 text-xs">
                <DocField label="Nom" value="MARTIN Élisabeth" />
                <DocField label="Lien" value="Mère" />
                <DocField label="Revenu mensuel net" value="3 900 € (retraite)" />
                <DocField label="Propriétaire" value="Oui — bien immobilier à Lyon" />
                <DocField label="Acte de caution solidaire" value="Signé le 05/04/2026" />
              </div>
            </DocumentSection>

          </div>
        </div>
      </div>

      <!-- RIGHT PANEL: AI Analysis -->
      <div class="flex-1 flex flex-col overflow-hidden">

        <!-- Panel header -->
        <div class="px-5 py-3 border-b border-white/[0.06] flex items-center justify-between shrink-0">
          <div class="flex items-center gap-2">
            <div class="w-1.5 h-1.5 rounded-full" :class="analysisState === 'done' ? 'bg-emerald-400' : analysisState === 'loading' ? 'bg-amber-400 animate-pulse' : 'bg-white/20'"></div>
            <span class="text-xs font-medium text-white/60">Analyse IA</span>
          </div>
          <div v-if="analysisState === 'done'" class="text-[10px] text-white/25">
            Modèle: Nexus-Document-v3 · {{ analysisDate }}
          </div>
        </div>

        <!-- Analysis content -->
        <div class="flex-1 overflow-y-auto px-5 py-5">

          <!-- Idle state -->
          <div v-if="analysisState === 'idle'" class="flex flex-col items-center justify-center h-full gap-3">
            <div class="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.07] flex items-center justify-center">
              <svg class="w-5 h-5 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <p class="text-xs text-white/25">En attente du dossier</p>
          </div>

          <!-- Loading state -->
          <div v-else-if="analysisState === 'loading'" class="flex flex-col items-center justify-center h-full gap-4">
            <div class="relative w-12 h-12">
              <div class="absolute inset-0 rounded-full border border-indigo-500/20"></div>
              <div class="absolute inset-0 rounded-full border-t border-indigo-400 animate-spin"></div>
            </div>
            <div class="text-center">
              <p class="text-sm font-medium text-white/70 mb-1">Analyse en cours…</p>
              <p class="text-xs text-white/30">{{ loadingStep }}</p>
            </div>
          </div>

          <!-- Results -->
          <div v-else-if="analysisState === 'done'" class="space-y-5">

            <!-- 1. Decision -->
            <Transition name="fade-up">
              <div v-if="showDecision" class="border rounded-xl p-4 space-y-3 border-amber-500/25 bg-amber-500/[0.04]">
                <div class="flex items-center justify-between">
                  <SectionLabel icon="decision" text="Recommandation" />
                  <div class="flex items-center gap-2">
                    <span class="text-[10px] font-medium text-white/40">Confiance</span>
                    <div class="flex gap-0.5">
                      <div class="w-4 h-1.5 rounded-full bg-amber-400"></div>
                      <div class="w-4 h-1.5 rounded-full bg-amber-400"></div>
                      <div class="w-4 h-1.5 rounded-full bg-white/15"></div>
                    </div>
                    <span class="text-[10px] text-amber-400/80">Moyenne</span>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <div class="px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30">
                    <span class="text-sm font-semibold text-amber-300">À examiner</span>
                  </div>
                  <div class="flex gap-2">
                    <button @click="decision = 'approved'"
                      class="px-3 py-1.5 text-xs font-medium rounded-lg transition-all"
                      :class="decision === 'approved' ? 'bg-emerald-600 text-white' : 'bg-white/[0.05] text-white/40 hover:text-white/70 hover:bg-white/[0.08]'">
                      Approuver
                    </button>
                    <button @click="decision = 'rejected'"
                      class="px-3 py-1.5 text-xs font-medium rounded-lg transition-all"
                      :class="decision === 'rejected' ? 'bg-red-600 text-white' : 'bg-white/[0.05] text-white/40 hover:text-white/70 hover:bg-white/[0.08]'">
                      Refuser
                    </button>
                  </div>
                </div>

                <p class="text-xs text-white/50 leading-relaxed border-t border-white/[0.06] pt-3">
                  Le candidat dispose d'un emploi stable et d'un garant solide.
                  Le taux d'effort dépasse néanmoins le seuil recommandé et l'épargne reste faible.
                  Un entretien complémentaire ou une caution bancaire renforcée est conseillé avant validation.
                </p>
              </div>
            </Transition>

            <!-- 2. Summary -->
            <Transition name="fade-up">
              <div v-if="showSummary" class="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 space-y-3">
                <SectionLabel icon="summary" text="Résumé du profil" />
                <p class="text-sm text-white/70 leading-relaxed">
                  Julien Martin, 29 ans, est salarié en CDI chez Altair Technologies depuis janvier 2022.
                  Son revenu net mensuel s'élève à <span class="text-white/90 font-medium">2 450 €</span>.
                  Il postule pour un appartement à Lyon au loyer de <span class="text-white/90 font-medium">950 € / mois</span>,
                  soit un taux d'effort de <span class="text-amber-400 font-medium">38,8 %</span>.
                  Son profil est stable mais les marges financières restent limitées. Un garant est présent.
                </p>
              </div>
            </Transition>

            <!-- 3. Key facts -->
            <Transition name="fade-up">
              <div v-if="showFacts" class="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 space-y-3">
                <SectionLabel icon="facts" text="Données clés" />
                <div class="grid grid-cols-2 gap-2">
                  <FactCard label="Type de contrat" value="CDI" sub="Depuis jan. 2022" color="blue" />
                  <FactCard label="Revenu net mensuel" value="2 450 €" sub="Stable sur 3 mois" color="default" />
                  <FactCard label="Taux d'effort" value="38,8 %" sub="Recommandé ≤ 33 %" color="amber" />
                  <FactCard label="Épargne disponible" value="3 303 €" sub="1,3 mois de loyer" color="amber" />
                  <FactCard label="Garant" value="Présent" sub="Caution solidaire · 3 900 €/m" color="green" />
                  <FactCard label="Ancienneté poste" value="4 ans 3 mois" sub="Période d'essai terminée" color="default" />
                </div>
              </div>
            </Transition>

            <!-- 4. Risks -->
            <Transition name="fade-up">
              <div v-if="showRisks" class="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 space-y-3">
                <SectionLabel icon="risks" text="Signaux identifiés" />
                <div class="space-y-2">
                  <RiskItem level="medium" text="Taux d'effort de 38,8 % — dépasse le seuil recommandé de 33 %" />
                  <RiskItem level="medium" text="Épargne résiduelle faible : 3 303 € soit 1,3 mensualité de loyer" />
                  <RiskItem level="low" text="Virement sortant non identifié de 290 € — aucun libellé sur le relevé" />
                  <RiskItem level="low" text="Dépenses loisirs élevées (510 €/mois) par rapport au reste à vivre" />
                  <RiskItem level="info" text="Prime décembre 2025 non récurrente — incluse dans le calcul initial" />
                </div>
              </div>
            </Transition>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const fileLoaded = ref(false)
const isDragging = ref(false)
const analysisState = ref('idle') // idle | loading | done
const loadingStep = ref('')
const decision = ref(null)

const showSummary = ref(false)
const showFacts = ref(false)
const showRisks = ref(false)
const showDecision = ref(false)

const analysisDate = new Date().toLocaleString('fr-FR', {
  day: '2-digit', month: '2-digit', year: 'numeric',
  hour: '2-digit', minute: '2-digit'
})

const loadingSteps = [
  'Extraction des données personnelles…',
  'Lecture du contrat de travail…',
  'Analyse des bulletins de salaire…',
  'Vérification du relevé bancaire…',
  'Évaluation du profil garant…',
  'Calcul des indicateurs financiers…',
  'Génération de la synthèse…',
]

async function runAnalysis() {
  analysisState.value = 'loading'
  showSummary.value = false
  showFacts.value = false
  showRisks.value = false
  showDecision.value = false

  for (const step of loadingSteps) {
    loadingStep.value = step
    await sleep(320)
  }

  analysisState.value = 'done'

  await sleep(200)
  showDecision.value = true
  await sleep(400)
  showSummary.value = true
  await sleep(400)
  showFacts.value = true
  await sleep(400)
  showRisks.value = true
}

async function simulateLoad() {
  fileLoaded.value = true
  await sleep(300)
  runAnalysis()
}

function handleDrop() {
  isDragging.value = false
  simulateLoad()
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
</script>

<style scoped>
.fade-up-enter-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
</style>
