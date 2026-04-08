<template>
  <div class="theme-root flex flex-col h-screen bg-[#ffffff] text-[#1f2021] overflow-hidden">

    <!-- Top bar -->
    <header class="flex items-center justify-between px-6 py-3 border-b border-[#d64545] bg-[#D64545] shrink-0">
      <div class="flex items-center gap-3">
        <div class="w-7 h-7 rounded-md bg-white/18 border border-white/20 flex items-center justify-center">
          <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <span class="title-font text-[1.5rem] leading-none uppercase tracking-[0.08em] text-white">Nexus Immobilier</span>
      </div>
      <div class="flex items-center gap-4">
        <span class="text-xs text-white">Agent: M. Fontaine</span>
        <div class="w-7 h-7 rounded-full bg-white/16 border border-white/24 flex items-center justify-center text-xs text-white font-medium">MF</div>
      </div>
    </header>

    <!-- Main layout -->
    <div class="flex flex-1 overflow-hidden">

      <!-- LEFT PANEL: Document Viewer -->
      <div class="w-[52%] border-r border-[#9f8989]/18 flex flex-col overflow-hidden bg-[#ebebeb]">

        <!-- Document header -->
        <div class="px-5 py-3 border-b border-[#9f8989]/18 flex items-center justify-between shrink-0">
          <div class="flex items-center gap-2.5">
            <svg class="w-4 h-4 text-[#9f8989]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>
            <span class="text-xs font-medium text-[#1f2021]/66">Dossier de candidature — Julien Martin</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-[10px] text-[#1f2021]/45 bg-[#ffffff] px-2 py-0.5 rounded border border-[#9f8989]/18">PDF · 5 pièces</span>
            <span class="text-[10px] text-[#1f2021]/45 bg-[#ffffff] px-2 py-0.5 rounded border border-[#9f8989]/18">Reçu le 07/04/2026</span>
          </div>
        </div>

        <!-- Drop zone OR document content -->
        <div class="flex-1 overflow-y-auto">
          <div v-if="!fileLoaded" class="flex flex-col items-center justify-center h-full gap-4 px-10"
            @dragover.prevent @drop.prevent="handleDrop"
            :class="isDragging ? 'bg-[#982121]/5' : ''"
            @dragenter="isDragging = true" @dragleave="isDragging = false">
            <div class="w-14 h-14 rounded-xl border border-[#9f8989]/22 flex items-center justify-center"
              :class="isDragging ? 'border-[#982121]/40 bg-[#982121]/8' : 'bg-[#ffffff]'">
              <svg class="w-6 h-6" :class="isDragging ? 'text-[#982121]' : 'text-[#9f8989]'" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <div class="text-center">
              <p class="text-sm text-[#1f2021]/64 font-medium mb-1">Déposer le dossier locatif</p>
              <p class="text-xs text-[#9f8989]">PDF, ZIP ou dossier complet · max 50 Mo</p>
            </div>
            <button @click="simulateLoad"
              class="mt-2 px-4 py-2 text-xs font-medium bg-[#982121] hover:bg-[#1f2021] text-white rounded-lg transition-colors cursor-pointer">
              Charger le dossier démo
            </button>
          </div>

          <!-- Document content (shown after load) -->
          <div v-else class="px-6 py-5 space-y-6">

            <!-- Section: Identity -->
            <DocumentSection title="Pièce d'identité" badge="Vérifié" badge-color="green">
              <template #action>
                <button
                  class="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-[#9f8989]/18 bg-[#ffffff] text-[#1f2021]/48 transition-all duration-150 hover:text-[#982121] hover:border-[#982121]/24 hover:bg-[#ebebeb]"
                  aria-label="Voir la pièce d'identité"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1 1 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178a1 1 0 010 .644C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </template>
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
              <template #action>
                <button
                  class="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-[#9f8989]/18 bg-[#ffffff] text-[#1f2021]/48 transition-all duration-150 hover:text-[#982121] hover:border-[#982121]/24 hover:bg-[#ebebeb]"
                  aria-label="Voir le contrat de travail"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1 1 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178a1 1 0 010 .644C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </template>
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
      <div class="flex-1 flex flex-col overflow-hidden bg-[#ffffff]">

        <!-- Panel header -->
        <div class="px-5 py-3 border-b border-[#9f8989]/18 flex items-center justify-between shrink-0">
          <div class="flex items-center gap-2">
            <div class="w-1.5 h-1.5 rounded-full" :class="analysisState === 'done' ? 'bg-[#982121]' : analysisState === 'loading' ? 'bg-[#982121] animate-pulse' : 'bg-[#9f8989]'" />
            <span class="text-xs font-medium text-[#1f2021]/60">Analyse IA</span>
          </div>
          <div v-if="analysisState === 'done'" class="text-[10px] text-[#9f8989]">
            Modèle: Nexus-Document-v3 · {{ analysisDate }}
          </div>
        </div>

        <!-- Analysis content -->
        <div class="flex-1 overflow-y-auto px-5 py-5">

          <!-- Idle state -->
          <div v-if="analysisState === 'idle'" class="flex flex-col items-center justify-center h-full gap-3">
              <div class="w-10 h-10 rounded-xl bg-[#ebebeb] border border-[#9f8989]/18 flex items-center justify-center">
              <svg class="w-5 h-5 text-[#9f8989]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <p class="text-xs text-[#9f8989]">En attente du dossier</p>
          </div>

          <!-- Loading state -->
          <div v-else-if="analysisState === 'loading'" class="flex flex-col items-center justify-center h-full gap-4">
            <div class="relative w-12 h-12">
              <div class="absolute inset-0 rounded-full border border-[#9f8989]/25"></div>
              <div class="absolute inset-0 rounded-full border-t border-[#982121] animate-spin"></div>
            </div>
            <div class="text-center">
              <p class="text-sm font-medium text-[#1f2021]/72 mb-1">Analyse en cours…</p>
              <p class="text-xs text-[#9f8989]">{{ loadingStep }}</p>
            </div>
          </div>

          <!-- Results -->
          <div v-else-if="analysisState === 'done'" class="space-y-5">

            <!-- 1. Decision -->
            <Transition name="fade-up">
              <div v-if="showDecision" class="border rounded-xl p-4 space-y-3 border-[#982121]/16 bg-[#ebebeb] shadow-[0_10px_30px_rgba(31,32,33,0.04)]">
                <div class="flex items-center justify-between">
                  <SectionLabel icon="decision" text="Recommandation" />
                  <div class="flex items-center gap-2">
                    <span class="text-[10px] font-medium text-[#1f2021]/42">Confiance</span>
                    <div class="flex gap-0.5">
                      <div class="w-4 h-1.5 rounded-full bg-emerald-500"></div>
                      <div class="w-4 h-1.5 rounded-full bg-emerald-500"></div>
                      <div class="w-4 h-1.5 rounded-full bg-emerald-500"></div>
                    </div>
                    <span class="text-[10px] text-emerald-600/80">Élevée</span>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <div class="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200">
                    <span class="title-font text-sm text-emerald-700">Approuver</span>
                  </div>
                  <div class="flex gap-2">
                    <button @click="openDecisionModal('approved')"
                      class="px-3 py-1.5 text-xs font-medium rounded-lg transition-all"
                      :class="decision === 'approved' ? 'bg-emerald-600 text-white' : 'bg-[#ffffff] text-[#1f2021]/45 border border-[#9f8989]/16 hover:text-[#1f2021]/70 hover:bg-[#ebebeb]'">
                      Approuver
                    </button>
                    <button @click="openDecisionModal('rejected')"
                      class="px-3 py-1.5 text-xs font-medium rounded-lg transition-all"
                      :class="decision === 'rejected' ? 'bg-[#982121] text-white' : 'bg-[#ffffff] text-[#1f2021]/45 border border-[#9f8989]/16 hover:text-[#1f2021]/70 hover:bg-[#ebebeb]'">
                      Refuser
                    </button>
                  </div>
                </div>

                <p class="text-xs text-[#1f2021]/58 leading-relaxed border-t border-[#9f8989]/18 pt-3">
                  Recommandation IA: approuver la candidature avec prise de rendez-vous rapide.
                  Le candidat présente un CDI stable, trois bulletins cohérents et un garant solvable.
                  Le taux d'effort est légèrement au-dessus du seuil cible, mais le dossier reste globalement rassurant pour une mise en location standard.
                </p>

                <div class="flex items-center justify-between border-t border-[#9f8989]/18 pt-3">
                  <p class="text-[11px] text-[#1f2021]/42">La décision reste validée par l'agent. L'IA prépare seulement l'étape suivante.</p>
                  <span class="text-[10px] text-[#9f8989] uppercase tracking-[0.24em]">Validation humaine requise</span>
                </div>
              </div>
            </Transition>

            <!-- 2. Summary -->
            <Transition name="fade-up">
              <div v-if="showSummary" class="bg-[#ebebeb] border border-[#9f8989]/18 rounded-xl p-4 space-y-3 shadow-[0_10px_30px_rgba(31,32,33,0.04)]">
                <SectionLabel icon="summary" text="Résumé du profil" />
                <div class="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em]">
                  <span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-emerald-700">
                    <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    Favorable
                  </span>
                  <span class="inline-flex items-center gap-1 rounded-full bg-[#fff1f1] px-2 py-1 text-[#982121]">
                    <span class="h-1.5 w-1.5 rounded-full bg-[#d64545]"></span>
                    Vigilance
                  </span>
                </div>
                <p class="text-sm text-[#1f2021]/72 leading-relaxed">
                  Julien Martin, 29 ans, est salarié en CDI chez Altair Technologies depuis janvier 2022.
                  Son revenu net mensuel s'élève à <span class="text-[#1f2021] font-medium">2 450 €</span>.
                  Il postule pour un appartement à Lyon au loyer de <span class="text-[#1f2021] font-medium">950 € / mois</span>,
                  soit un taux d'effort de <span class="text-[#982121] font-medium">38,8 %</span>.
                  Son profil est stable mais les marges financières restent limitées. Un garant est présent.
                </p>
              </div>
            </Transition>

            <!-- 3. Key facts -->
            <Transition name="fade-up">
              <div v-if="showFacts" class="bg-[#ebebeb] border border-[#9f8989]/18 rounded-xl p-4 space-y-3 shadow-[0_10px_30px_rgba(31,32,33,0.04)]">
                <SectionLabel icon="facts" text="Données clés" />
                <div class="grid grid-cols-2 gap-2">
                  <FactCard label="Type de contrat" value="CDI" sub="Depuis jan. 2022" color="green" />
                  <FactCard label="Revenu net mensuel" value="2 450 €" sub="Stable sur 3 mois" color="green" />
                  <FactCard label="Taux d'effort" value="38,8 %" sub="Recommandé ≤ 33 %" color="amber" />
                  <FactCard label="Épargne disponible" value="3 303 €" sub="1,3 mois de loyer" color="amber" />
                  <FactCard label="Garant" value="Présent" sub="Caution solidaire · 3 900 €/m" color="green" />
                  <FactCard label="Ancienneté poste" value="4 ans 3 mois" sub="Période d'essai terminée" color="green" />
                </div>
              </div>
            </Transition>

            <!-- 4. Risks -->
            <Transition name="fade-up">
              <div v-if="showRisks" class="bg-[#ebebeb] border border-[#9f8989]/18 rounded-xl p-4 space-y-3 shadow-[0_10px_30px_rgba(31,32,33,0.04)]">
                <SectionLabel icon="risks" text="Signaux identifiés" />
                <div class="space-y-2">
                  <RiskItem level="info" text="Dossier cohérent : CDI confirmé, revenus réguliers et garant solvable" />
                  <RiskItem level="medium" text="Taux d'effort de 38,8 % — au-dessus du seuil cible, mais compensé par un garant solide" />
                  <RiskItem level="low" text="Épargne résiduelle modérée : 3 303 € soit 1,3 mensualité de loyer" />
                  <RiskItem level="low" text="Virement sortant non identifié de 290 € — aucun libellé sur le relevé" />
                  <RiskItem level="low" text="Dépenses loisirs élevées (510 €/mois) par rapport au reste à vivre" />
                  <RiskItem level="info" text="Prime décembre 2025 non récurrente — neutralisée dans l'appréciation finale" />
                </div>
              </div>
            </Transition>

          </div>
        </div>
      </div>
    </div>

    <Transition name="modal-fade">
      <div
        v-if="decisionModalOpen"
        class="absolute inset-0 z-30 flex items-center justify-center bg-[#1f2021]/18 backdrop-blur-sm px-6"
        @click.self="closeDecisionModal"
      >
        <div class="w-full max-w-3xl rounded-2xl border border-[#9f8989]/18 bg-[#ffffff] shadow-[0_30px_80px_rgba(31,32,33,0.16)] overflow-hidden">
          <div class="flex items-center justify-between px-5 py-4 border-b border-[#9f8989]/18 bg-[#ebebeb]">
            <div>
              <p class="title-font text-sm tracking-[0.06em] text-[#1f2021]">
                {{ decision === 'approved' ? 'Candidature approuvée' : 'Candidature refusée' }}
              </p>
              <p class="text-xs text-[#1f2021]/48 mt-1">
                {{ decision === 'approved' ? 'L’IA a préparé la suite opérationnelle pour l’agent.' : 'L’IA a préparé une réponse candidat et une trace interne.' }}
              </p>
            </div>
            <button
              @click="closeDecisionModal"
              class="w-8 h-8 rounded-lg bg-[#ffffff] border border-[#9f8989]/16 text-[#1f2021]/45 hover:text-[#1f2021]/80 hover:bg-[#ebebeb] transition-colors"
            >
              ✕
            </button>
          </div>

          <div class="p-5 space-y-4 max-h-[78vh] overflow-y-auto">
            <div v-if="decision === 'approved'" class="space-y-4">
              <div class="rounded-xl border border-[#982121]/16 bg-[#ebebeb] p-4 space-y-2">
                <div class="flex items-center justify-between">
                  <p class="title-font text-sm text-[#982121]">Email candidat prêt à envoyer</p>
                  <span class="text-[10px] text-[#982121]/60">Brouillon IA</span>
                </div>
                <div class="rounded-lg border border-[#9f8989]/18 bg-[#ffffff] p-3 space-y-3">
                  <div class="space-y-1">
                    <div class="flex items-center justify-between gap-3">
                      <label class="block text-[10px] uppercase tracking-[0.18em] text-[#9f8989]">Objet</label>
                      <button
                        @click="copyToClipboard(approvedEmailSubject)"
                        class="inline-flex items-center justify-center w-7 h-7 rounded-md bg-[#ebebeb] text-[#1f2021]/45 hover:text-[#982121] hover:bg-[#ffffff] border border-[#9f8989]/16 transition-colors"
                        aria-label="Copier l'objet"
                      >
                        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5V6.375A2.625 2.625 0 0110.875 3.75h6.75A2.625 2.625 0 0120.25 6.375v6.75a2.625 2.625 0 01-2.625 2.625H16.5M8.25 7.5H6.375A2.625 2.625 0 003.75 10.125v6.75A2.625 2.625 0 006.375 19.5h6.75a2.625 2.625 0 002.625-2.625V15M8.25 7.5h6.75A2.625 2.625 0 0117.625 10.125v6.75" />
                        </svg>
                      </button>
                    </div>
                    <input
                      v-model="approvedEmailSubject"
                      class="w-full rounded-md border border-[#9f8989]/18 bg-[#ffffff] px-3 py-2 text-sm text-[#1f2021]/80 outline-none"
                    />
                  </div>
                  <div class="space-y-1">
                    <div class="flex items-center justify-between gap-3">
                      <label class="block text-[10px] uppercase tracking-[0.18em] text-[#9f8989]">Message</label>
                      <button
                        @click="copyToClipboard(approvedEmailBody)"
                        class="inline-flex items-center justify-center w-7 h-7 rounded-md bg-[#ebebeb] text-[#1f2021]/45 hover:text-[#982121] hover:bg-[#ffffff] border border-[#9f8989]/16 transition-colors"
                        aria-label="Copier le message"
                      >
                        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5V6.375A2.625 2.625 0 0110.875 3.75h6.75A2.625 2.625 0 0120.25 6.375v6.75a2.625 2.625 0 01-2.625 2.625H16.5M8.25 7.5H6.375A2.625 2.625 0 003.75 10.125v6.75A2.625 2.625 0 006.375 19.5h6.75a2.625 2.625 0 002.625-2.625V15M8.25 7.5h6.75A2.625 2.625 0 0117.625 10.125v6.75" />
                        </svg>
                      </button>
                    </div>
                    <textarea
                      v-model="approvedEmailBody"
                      rows="10"
                      class="w-full resize-none rounded-md border border-[#9f8989]/18 bg-[#ffffff] px-3 py-3 text-sm text-[#1f2021]/72 leading-relaxed outline-none"
                    />
                  </div>
                </div>
              </div>

              <div class="rounded-xl border border-[#9f8989]/18 bg-[#ebebeb] p-4 space-y-2">
                <p class="title-font text-sm text-[#1f2021]">Note propriétaire / interne</p>
                <p class="text-sm text-[#1f2021]/64 leading-relaxed">
                  Profil stable, CDI depuis plus de 4 ans, revenus réguliers et garant solide.
                  Point de vigilance maîtrisé: taux d'effort un peu élevé, compensé par la présence d'une caution solvable.
                  Recommandation: confirmer en rendez-vous puis lancer la préparation du bail.
                </p>
              </div>

            </div>

            <div v-else class="space-y-4">
              <div class="rounded-xl border border-[#982121]/16 bg-[#ebebeb] p-4 space-y-2">
                <div class="flex items-center justify-between">
                  <p class="title-font text-sm text-[#982121]">Email candidat prêt à envoyer</p>
                  <span class="text-[10px] text-[#982121]/60">Brouillon IA</span>
                </div>
                <div class="rounded-lg border border-[#9f8989]/18 bg-[#ffffff] p-3 space-y-3">
                  <div class="space-y-1">
                    <div class="flex items-center justify-between gap-3">
                      <label class="block text-[10px] uppercase tracking-[0.18em] text-[#9f8989]">Objet</label>
                      <button
                        @click="copyToClipboard(rejectedEmailSubject)"
                        class="inline-flex items-center justify-center w-7 h-7 rounded-md bg-[#ebebeb] text-[#1f2021]/45 hover:text-[#982121] hover:bg-[#ffffff] border border-[#9f8989]/16 transition-colors"
                        aria-label="Copier l'objet"
                      >
                        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5V6.375A2.625 2.625 0 0110.875 3.75h6.75A2.625 2.625 0 0120.25 6.375v6.75a2.625 2.625 0 01-2.625 2.625H16.5M8.25 7.5H6.375A2.625 2.625 0 003.75 10.125v6.75A2.625 2.625 0 006.375 19.5h6.75a2.625 2.625 0 002.625-2.625V15M8.25 7.5h6.75A2.625 2.625 0 0117.625 10.125v6.75" />
                        </svg>
                      </button>
                    </div>
                    <input
                      v-model="rejectedEmailSubject"
                      class="w-full rounded-md border border-[#9f8989]/18 bg-[#ffffff] px-3 py-2 text-sm text-[#1f2021]/80 outline-none"
                    />
                  </div>
                  <div class="space-y-1">
                    <div class="flex items-center justify-between gap-3">
                      <label class="block text-[10px] uppercase tracking-[0.18em] text-[#9f8989]">Message</label>
                      <button
                        @click="copyToClipboard(rejectedEmailBody)"
                        class="inline-flex items-center justify-center w-7 h-7 rounded-md bg-[#ebebeb] text-[#1f2021]/45 hover:text-[#982121] hover:bg-[#ffffff] border border-[#9f8989]/16 transition-colors"
                        aria-label="Copier le message"
                      >
                        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5V6.375A2.625 2.625 0 0110.875 3.75h6.75A2.625 2.625 0 0120.25 6.375v6.75a2.625 2.625 0 01-2.625 2.625H16.5M8.25 7.5H6.375A2.625 2.625 0 003.75 10.125v6.75A2.625 2.625 0 006.375 19.5h6.75a2.625 2.625 0 002.625-2.625V15M8.25 7.5h6.75A2.625 2.625 0 0117.625 10.125v6.75" />
                        </svg>
                      </button>
                    </div>
                    <textarea
                      v-model="rejectedEmailBody"
                      rows="11"
                      class="w-full resize-none rounded-md border border-[#9f8989]/18 bg-[#ffffff] px-3 py-3 text-sm text-[#1f2021]/72 leading-relaxed outline-none"
                    />
                  </div>
                </div>
              </div>

              <div class="rounded-xl border border-[#9f8989]/18 bg-[#ebebeb] p-4 space-y-2">
                <p class="title-font text-sm text-[#1f2021]">Motif interne</p>
                <p class="text-sm text-[#1f2021]/64 leading-relaxed">
                  Refus motivé par un taux d'effort supérieur au seuil cible et une marge de sécurité financière jugée trop faible au regard des autres dossiers reçus.
                  Aucun élément bloquant isolé, mais arbitrage défavorable dans la comparaison finale.
                </p>
              </div>
            </div>
          </div>

          <div class="border-t border-[#9f8989]/18 bg-[#ebebeb] px-5 py-4">
            <div v-if="decision === 'approved'" class="grid grid-cols-3 gap-2">
              <button class="px-3 py-2 text-xs font-medium rounded-lg bg-[#982121] text-white hover:bg-[#1f2021] transition-colors">Envoyer l'email</button>
              <button class="px-3 py-2 text-xs font-medium rounded-lg bg-[#ffffff] text-[#1f2021]/70 border border-[#9f8989]/16 hover:text-[#1f2021] hover:bg-[#ebebeb] transition-colors">Planifier un rendez-vous</button>
              <button class="px-3 py-2 text-xs font-medium rounded-lg bg-[#ffffff] text-[#1f2021]/70 border border-[#9f8989]/16 hover:text-[#1f2021] hover:bg-[#ebebeb] transition-colors">Préparer le bail</button>
            </div>

            <div v-else class="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2">
              <button class="px-3 py-2 text-xs font-medium rounded-lg bg-[#982121] text-white text-left transition-all duration-150 hover:bg-[#1f2021] hover:-translate-y-[1px] hover:shadow-[0_10px_30px_rgba(152,33,33,0.18)]">
                Envoyer la réponse
              </button>
              <span class="text-[#9f8989] text-center">→</span>
              <div class="px-3 py-2 text-xs rounded-lg border border-[#9f8989]/18 bg-[#ffffff] text-[#1f2021]/60 transition-all duration-150 hover:bg-[#ebebeb] hover:border-[#9f8989]/30 hover:-translate-y-[1px]">
                Classer le dossier
              </div>
              <span class="text-[#9f8989] text-center">→</span>
              <div class="px-3 py-2 text-xs rounded-lg border border-[#9f8989]/18 bg-[#ffffff] text-[#1f2021]/60 transition-all duration-150 hover:bg-[#ebebeb] hover:border-[#9f8989]/30 hover:-translate-y-[1px]">
                Passer au candidat suivant
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
const fileLoaded = ref(false)
const isDragging = ref(false)
const analysisState = ref('idle') // idle | loading | done
const loadingStep = ref('')
const decision = ref(null)
const decisionModalOpen = ref(false)
const approvedEmailSubject = ref("Votre dossier a été retenu pour l'appartement situé rue des Capucins à Lyon")
const approvedEmailBody = ref(`Bonjour M. Martin,

Votre dossier a retenu notre attention et nous souhaitons avancer avec vous sur la location de l'appartement.

Nous vous proposons un rendez-vous de confirmation cette semaine afin de finaliser les derniers éléments du dossier et organiser la suite.

Bien cordialement,

M. Fontaine
Nexus Immobilier`)
const rejectedEmailSubject = ref("Suite donnée à votre candidature pour le bien situé rue des Capucins à Lyon")
const rejectedEmailBody = ref(`Bonjour M. Martin,

Nous vous remercions pour l'intérêt porté au bien ainsi que pour la qualité de votre dossier.

Après étude de l'ensemble des candidatures reçues, nous ne donnerons pas suite à votre demande pour ce logement.

Nous vous souhaitons une bonne continuation dans vos recherches.

Bien cordialement,

M. Fontaine
Nexus Immobilier`)

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

function openDecisionModal(nextDecision) {
  decision.value = nextDecision
  decisionModalOpen.value = true
}

function closeDecisionModal() {
  decisionModalOpen.value = false
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
  } catch (error) {
    console.error('Clipboard copy failed', error)
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
</script>

<style scoped>
@font-face {
  font-family: 'Messapia';
  src: url('../assets/fonts/Messapia-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
}

.title-font,
:deep(.section-title) {
  font-family: 'Messapia', serif;
}

.fade-up-enter-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
