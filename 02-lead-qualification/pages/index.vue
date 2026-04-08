<template>
  <div class="h-screen overflow-hidden bg-slate-950 text-slate-100 font-sans flex flex-col select-none">

    <!-- Header -->
    <header class="sticky top-0 z-30 bg-slate-950 border-b border-slate-800 px-6 py-3 flex items-center justify-between flex-shrink-0">
      <div class="flex items-center gap-3">
        <div class="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
          <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <span class="text-sm font-semibold text-slate-200 tracking-wide">CFO Advisory — Lead Intelligence</span>
      </div>
      <div class="flex items-center gap-4">
        <span class="text-xs text-slate-500">{{ leads.length }} new submissions</span>
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span class="text-xs text-slate-400">System active</span>
        </div>
      </div>
    </header>

    <!-- Body -->
    <div class="flex flex-1 overflow-hidden">

      <!-- COL 1 — Inbox -->
      <aside class="w-[300px] flex-shrink-0 border-r border-slate-800 flex flex-col overflow-hidden">
        <div class="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Inbox</span>
          <span class="text-[10px] font-medium bg-blue-600 text-white rounded-full px-1.5 py-0.5">{{ leads.length }}</span>
        </div>
        <div class="flex-1 overflow-y-auto">
          <button
            v-for="lead in leads"
            :key="lead.id"
            @click="selectLead(lead)"
            class="w-full text-left px-4 py-3.5 border-b border-slate-800/70 transition-colors"
            :class="selectedLead?.id === lead.id
              ? 'bg-blue-600/15 border-l-2 border-l-blue-500'
              : 'hover:bg-slate-800/50 border-l-2 border-l-transparent'"
          >
            <div class="flex items-start justify-between gap-2 mb-1">
              <div class="flex items-center gap-1.5 min-w-0">
                <span v-if="!lead.read" class="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0"></span>
                <span class="text-xs font-semibold text-slate-200 truncate">{{ lead.name }}</span>
              </div>
              <span class="text-[10px] text-slate-500 flex-shrink-0">{{ lead.time }}</span>
            </div>
            <p class="text-[11px] font-medium text-slate-400 truncate mb-0.5">{{ lead.company }}</p>
            <p class="text-[11px] text-slate-500 truncate leading-relaxed">{{ lead.preview }}</p>
          </button>
        </div>
      </aside>

      <!-- Main panel -->
      <main class="flex-1 flex flex-col overflow-hidden">
        <!-- Lead detail card -->
        <section class="sticky top-0 z-20 flex-shrink-0 bg-slate-950 px-6 pt-5 pb-4 border-b border-slate-900">
          <div v-if="selectedLead" class="bg-slate-900 border border-slate-800 rounded-lg p-5 shadow-2xl shadow-slate-950/30">
            <div class="flex items-start gap-6">
              <div class="w-[240px] flex-shrink-0">
                <div class="flex items-start justify-between gap-3 mb-1">
                  <h2 class="text-base font-bold text-slate-100">{{ selectedLead.name }}</h2>
                  <span class="inline-flex items-center gap-1 text-[10px] font-medium text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full flex-shrink-0">
                    <span class="w-1 h-1 rounded-full bg-amber-400"></span>
                    New
                  </span>
                </div>
                <p class="text-xs text-slate-500">Via website contact form · {{ selectedLead.date }}</p>
                <p class="text-[10px] text-slate-600 mt-0.5 font-mono">REF-2024-{{ selectedLead.ref }}</p>
              </div>

              <div class="grid grid-cols-4 gap-x-5 gap-y-3 flex-1 min-w-0">
                <LeadField label="Company" :value="selectedLead.company" />
                <LeadField label="Team size" :value="selectedLead.teamSize" />
                <LeadField label="Revenue range" :value="selectedLead.revenue" />
                <LeadField label="Budget" :value="selectedLead.budget" />
                <div class="col-span-3">
                  <p class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Message</p>
                  <p class="text-sm text-slate-300 leading-relaxed">
                    "{{ selectedLead.message }}"
                  </p>
                </div>
                <LeadField label="Urgency" :value="selectedLead.urgency" />
              </div>
            </div>
          </div>

          <div v-else class="bg-slate-900 border border-slate-800 rounded-lg px-5 py-8 text-center">
            <p class="text-sm text-slate-600">Select a submission</p>
          </div>
        </section>

        <!-- AI output -->
        <section class="flex-1 flex flex-col overflow-y-auto px-6 pt-5 pb-6 gap-4">
        <div class="flex items-center justify-between gap-4 h-10 flex-shrink-0">
          <div class="flex items-center gap-2">
            <span class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">AI Qualification</span>
            <div v-if="analysisState === 'analyzing'" class="flex items-center gap-1 ml-1">
              <span class="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style="animation-delay:0ms"></span>
              <span class="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style="animation-delay:150ms"></span>
              <span class="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style="animation-delay:300ms"></span>
            </div>
          </div>

          <button
            @click="startAnalysis"
            :disabled="analysisState !== 'idle'"
            class="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
            :class="analysisState === 'idle'
              ? 'bg-blue-600 hover:bg-blue-500 text-white cursor-pointer'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'"
          >
            <svg v-if="analysisState === 'idle'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <svg v-else-if="analysisState === 'analyzing'" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <svg v-else class="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>{{ analysisState === 'idle' ? 'Analyze lead' : analysisState === 'analyzing' ? 'Analyzing...' : 'Analysis complete' }}</span>
          </button>
        </div>

        <!-- Empty -->
        <div v-if="analysisState === 'idle'" class="flex-1 flex items-center justify-center">
          <div class="text-center">
            <div class="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.347.347a3.75 3.75 0 01-1.043 2.479H9.37a3.75 3.75 0 01-1.043-2.479l-.347-.347z" />
              </svg>
            </div>
            <p class="text-xs text-slate-500">Click <span class="text-slate-400 font-medium">Analyze lead</span> to qualify</p>
          </div>
        </div>

        <!-- Skeleton -->
        <div v-else-if="analysisState === 'analyzing'" class="grid grid-cols-12 gap-4">
          <div
            v-for="i in 6"
            :key="i"
            class="bg-slate-900 border border-slate-800 rounded-lg p-5 animate-pulse_soft"
            :class="[
              i === 1 ? 'col-span-5 min-h-[150px]' : '',
              i === 2 ? 'col-span-7 min-h-[150px]' : '',
              i === 3 ? 'col-span-8 min-h-[150px]' : '',
              i === 4 ? 'col-span-4 row-span-2 min-h-[300px]' : '',
              i === 5 ? 'col-span-4 min-h-[120px]' : '',
              i === 6 ? 'col-span-4 min-h-[120px]' : '',
            ]"
          >
            <div class="h-2.5 w-24 bg-slate-800 rounded mb-4"></div>
            <div class="flex flex-col gap-2">
              <div class="h-2.5 bg-slate-800 rounded w-full"></div>
              <div class="h-2.5 bg-slate-800 rounded" :class="i === 1 ? 'w-1/2' : i === 2 ? 'w-5/6' : 'w-4/6'"></div>
              <div v-if="i === 4" class="h-2.5 bg-slate-800 rounded w-3/4"></div>
            </div>
          </div>
        </div>

        <!-- Results -->
        <div v-else class="grid grid-cols-12 auto-rows-min gap-4">

          <!-- Score -->
          <div class="col-span-5 bg-slate-900 border border-emerald-500/25 rounded-lg p-5 animate-fadeInUp" style="animation-delay:0ms">
            <p class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Qualification score</p>
            <div class="flex items-end justify-between gap-4">
              <div>
                <div class="flex items-center gap-2 mb-3">
                  <div class="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                  <span class="text-2xl font-bold text-emerald-400">High fit</span>
                </div>
                <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-500/12 text-red-400 border border-red-500/20">
                  <span class="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
                  Priority: High
                </span>
              </div>
              <div class="text-right">
                <p class="text-[10px] text-slate-500">Score</p>
                <p class="text-4xl font-bold text-slate-100">91<span class="text-slate-500 text-sm font-normal">/100</span></p>
              </div>
            </div>
          </div>

          <!-- Summary -->
          <div class="col-span-7 bg-slate-900 border border-slate-800 rounded-lg p-5 animate-fadeInUp" style="animation-delay:80ms">
            <p class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Qualification summary</p>
            <ul class="grid grid-cols-2 gap-x-5 gap-y-3">
              <li v-for="(item, i) in summary" :key="i" class="flex items-start gap-2.5 text-sm text-slate-300">
                <svg class="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                {{ item }}
              </li>
            </ul>
          </div>

          <!-- Key signals -->
          <div class="col-span-8 bg-slate-900 border border-slate-800 rounded-lg p-5 animate-fadeInUp" style="animation-delay:160ms">
            <p class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Key signals</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(signal, i) in signals" :key="i"
                class="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-full"
                :class="signal.type === 'strong'
                  ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="signal.type === 'strong' ? 'bg-blue-400' : 'bg-slate-500'"></span>
                {{ signal.label }}
              </span>
            </div>
          </div>

          <!-- Next actions -->
          <div class="col-span-4 row-span-2 bg-slate-900 border border-slate-800 rounded-lg p-5 animate-fadeInUp" style="animation-delay:240ms">
            <p class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Suggested next action</p>
            <div class="flex flex-col gap-2">
              <div v-for="(action, i) in nextActions" :key="i"
                class="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/40">
                <div class="w-5 h-5 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span class="text-[10px] font-bold text-blue-400">{{ i + 1 }}</span>
                </div>
                <p class="text-sm text-slate-300">{{ action }}</p>
              </div>
            </div>
          </div>

          <div class="col-span-3 bg-slate-900 border border-slate-800 rounded-lg p-5 animate-fadeInUp" style="animation-delay:320ms">
            <p class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Buying intent</p>
            <p class="text-2xl font-bold text-slate-100 mb-2">Active</p>
            <p class="text-sm text-slate-400 leading-relaxed">Clear pain point, budget stated, and timing this month.</p>
          </div>

          <div class="col-span-3 bg-slate-900 border border-slate-800 rounded-lg p-5 animate-fadeInUp" style="animation-delay:400ms">
            <p class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Budget fit</p>
            <p class="text-2xl font-bold text-blue-300 mb-2">In range</p>
            <p class="text-sm text-slate-400 leading-relaxed">Monthly budget matches standard CFO advisory scope.</p>
          </div>

          <div class="col-span-2 bg-slate-900 border border-slate-800 rounded-lg p-5 animate-fadeInUp" style="animation-delay:480ms">
            <p class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Risk</p>
            <p class="text-2xl font-bold text-amber-300 mb-2">Low</p>
            <p class="text-sm text-slate-400 leading-relaxed">Need is specific, not exploratory.</p>
          </div>

        </div>
        </section>
      </main>
    </div>

    <!-- Telegram notification -->
    <Transition
      enter-active-class="transition-all duration-500 ease-out"
      enter-from-class="opacity-0 translate-y-4 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-2 scale-95"
    >
      <div v-if="showTelegram"
        class="fixed bottom-5 right-5 w-[320px] bg-[#17212b] border border-white/8 rounded-2xl shadow-2xl overflow-hidden z-50">
        <div class="flex items-center gap-3 px-4 py-3 border-b border-white/5">
          <div class="w-8 h-8 rounded-full bg-[#2b5278] flex items-center justify-center flex-shrink-0">
            <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z"/>
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-xs font-semibold text-white/90">CFO Advisory — Sales Alerts</p>
            <p class="text-[10px] text-white/40">bot notification</p>
          </div>
          <button @click="showTelegram = false" class="text-white/30 hover:text-white/60 transition-colors">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="px-4 py-3">
          <div class="bg-[#2b5278] rounded-xl rounded-tl-sm px-4 py-3">
            <div class="mb-2">
              <span class="text-[10px] font-bold text-red-400 uppercase tracking-wider">● HIGH PRIORITY</span>
            </div>
            <p class="text-sm font-semibold text-white mb-2">New qualified lead: {{ selectedLead.name }}</p>
            <div class="flex flex-col gap-1">
              <p class="text-xs text-blue-200"><span class="text-white/50">Company:</span> {{ selectedLead.company }} — {{ selectedLead.teamSize }}</p>
              <p class="text-xs text-blue-200"><span class="text-white/50">Need:</span> {{ notificationNeed }}</p>
              <p class="text-xs text-blue-200"><span class="text-white/50">Budget:</span> {{ selectedLead.budget }} <span v-if="selectedLead.budget !== 'Not specified'">✓</span></p>
              <p class="text-xs text-blue-200"><span class="text-white/50">Urgency:</span> {{ selectedLead.urgency }}</p>
            </div>
            <div class="mt-2.5 pt-2.5 border-t border-white/10">
              <p class="text-xs text-white/70"><span class="font-medium text-white/90">Action:</span> {{ notificationAction }}</p>
            </div>
          </div>
        </div>
        <div class="flex gap-2 px-4 pb-3">
          <button class="flex-1 py-2 rounded-lg bg-[#2b5278] hover:bg-[#3a6a9e] transition-colors text-xs font-medium text-white/80 hover:text-white">
            Assign to advisor
          </button>
          <button class="flex-1 py-2 rounded-lg bg-[#1e2c3a] hover:bg-[#2a3e52] transition-colors text-xs font-medium text-white/60 hover:text-white/80 border border-white/5">
            Schedule callback
          </button>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const analysisState = ref('idle')
const showTelegram = ref(false)

const leads = [
  {
    id: 1,
    name: 'Clara Mendes',
    company: 'Atelier Norte',
    time: '09:14',
    date: 'Today, 09:14',
    ref: '1047',
    teamSize: '14 employees',
    revenue: '€1.2M – €2M',
    budget: '€2,000 – €3,000/mo',
    urgency: 'We\'d like to start this month.',
    message: 'We need help structuring our monthly reporting and cash flow forecast. We\'ve grown quickly and finance is becoming messy.',
    preview: 'We need help structuring our monthly reporting…',
    read: false,
  },
  {
    id: 2,
    name: 'Thomas Guillot',
    company: 'Fern Studio',
    time: 'Yesterday',
    date: 'Yesterday, 16:42',
    ref: '1046',
    teamSize: '6 employees',
    revenue: '€400K – €600K',
    budget: '€800 – €1,200/mo',
    urgency: 'No specific timeline, exploring options.',
    message: 'We\'re a small creative agency looking for help with our annual accounts and maybe some financial guidance as we grow.',
    preview: 'We\'re a small creative agency looking for help…',
    read: true,
  },
  {
    id: 3,
    name: 'Anaïs Vernet',
    company: 'Bloc Santé',
    time: 'Mon',
    date: 'Monday, 11:05',
    ref: '1045',
    teamSize: '32 employees',
    revenue: '€3.5M – €5M',
    budget: '€4,000 – €6,000/mo',
    urgency: 'Board meeting in 6 weeks, need reporting in place.',
    message: 'We\'re preparing for a Series A and need a solid financial reporting structure and cash flow visibility for our investors.',
    preview: 'We\'re preparing for a Series A and need solid…',
    read: true,
  },
  {
    id: 4,
    name: 'Mehdi Larbi',
    company: 'Volta Mobility',
    time: 'Fri',
    date: 'Friday, 14:30',
    ref: '1044',
    teamSize: '8 employees',
    revenue: '€250K – €400K',
    budget: 'Not specified',
    urgency: 'Just browsing for now.',
    message: 'Hi, I saw your services and was wondering if you work with startups at early stage. We\'re pre-revenue but growing.',
    preview: 'Hi, I saw your services and was wondering if…',
    read: true,
  },
  {
    id: 5,
    name: 'Julia Hofmann',
    company: 'Nord Kitchen',
    time: 'Thu',
    date: 'Thursday, 10:18',
    ref: '1043',
    teamSize: '21 employees',
    revenue: '€2M – €3M',
    budget: '€2,500 – €4,000/mo',
    urgency: 'Need help before opening our second location next quarter.',
    message: 'We are expanding to a second restaurant and need better cost control, weekly dashboards and cash planning before signing the lease.',
    preview: 'We are expanding to a second restaurant and need…',
    read: false,
  },
  {
    id: 6,
    name: 'Nicolas Bérard',
    company: 'Luma Dental',
    time: 'Wed',
    date: 'Wednesday, 15:36',
    ref: '1042',
    teamSize: '18 employees',
    revenue: '€1.8M – €2.4M',
    budget: '€1,500 – €2,500/mo',
    urgency: 'We want to make a decision this week.',
    message: 'Our clinic is profitable but cash flow is unpredictable. We need a clearer view on payroll, equipment financing and monthly reporting.',
    preview: 'Our clinic is profitable but cash flow is unpredictable…',
    read: true,
  },
  {
    id: 7,
    name: 'Sofia Romano',
    company: 'Casa Verde',
    time: 'Tue',
    date: 'Tuesday, 08:55',
    ref: '1041',
    teamSize: '11 employees',
    revenue: '€900K – €1.3M',
    budget: '€1,200 – €1,800/mo',
    urgency: 'Before the end of the month.',
    message: 'We sell home goods online and margins are getting harder to track. We need help with inventory reporting and a cleaner finance rhythm.',
    preview: 'We sell home goods online and margins are getting…',
    read: true,
  },
  {
    id: 8,
    name: 'Elliot Price',
    company: 'BrightLoop Energy',
    time: 'Apr 2',
    date: 'April 2, 13:20',
    ref: '1040',
    teamSize: '27 employees',
    revenue: '€4M – €6M',
    budget: '€5,000 – €7,000/mo',
    urgency: 'Investor reporting package due in 4 weeks.',
    message: 'We need support preparing investor reporting, refining burn forecast and setting up a monthly board finance pack.',
    preview: 'We need support preparing investor reporting, refining burn…',
    read: true,
  },
  {
    id: 9,
    name: 'Marina Soler',
    company: 'Papel & Co',
    time: 'Mar 29',
    date: 'March 29, 17:48',
    ref: '1039',
    teamSize: '5 employees',
    revenue: '€300K – €450K',
    budget: '€600 – €900/mo',
    urgency: 'No rush, just comparing options.',
    message: 'We run a small stationery brand and would like occasional guidance around pricing and tax planning, maybe quarterly.',
    preview: 'We run a small stationery brand and would like…',
    read: true,
  },
  {
    id: 10,
    name: 'Omar Benali',
    company: 'Atlas Repair',
    time: 'Mar 27',
    date: 'March 27, 12:11',
    ref: '1038',
    teamSize: '44 employees',
    revenue: '€5M – €7M',
    budget: '€3,500 – €5,000/mo',
    urgency: 'Need a new reporting process before hiring a finance manager.',
    message: 'We manage repair teams across three cities and our financial reporting is too slow. We need help building reliable monthly close and KPI tracking.',
    preview: 'We manage repair teams across three cities and our…',
    read: true,
  },
]

const selectedLead = ref(leads[0])

const notificationNeed = computed(() => summarizeNeed(selectedLead.value))
const notificationAction = computed(() => suggestAction(selectedLead.value))

const summary = [
  'Growing company with operational complexity',
  'Clear need for reporting and cash flow support',
  'Budget aligned with standard service engagement',
  'Immediate timing suggests strong buying intent',
]

const signals = [
  { label: 'Revenue significant', type: 'strong' },
  { label: 'Operational complexity', type: 'strong' },
  { label: 'Specific pain point', type: 'strong' },
  { label: 'High urgency', type: 'strong' },
  { label: 'Strong fit: outsourced CFO', type: 'strong' },
  { label: 'Budget in range', type: 'neutral' },
  { label: 'No competing offer', type: 'neutral' },
]

const nextActions = [
  'Contact within 2 hours — buying intent is active',
  'Route to senior advisor for initial scoping',
  'Offer intro call focused on reporting + cash flow visibility',
]

function selectLead(lead) {
  selectedLead.value = lead
  analysisState.value = 'idle'
  showTelegram.value = false
}

async function startAnalysis() {
  if (analysisState.value !== 'idle') return
  const analyzedLead = selectedLead.value
  analysisState.value = 'analyzing'
  await new Promise(r => setTimeout(r, 2200))
  if (selectedLead.value.id !== analyzedLead.id) return
  analysisState.value = 'done'
  await new Promise(r => setTimeout(r, 600))
  if (selectedLead.value.id !== analyzedLead.id) return
  showTelegram.value = true
}

function summarizeNeed(lead) {
  const message = lead.message.toLowerCase()

  if (message.includes('investor') || message.includes('series a') || message.includes('board')) {
    return 'Investor reporting + finance pack'
  }

  if (message.includes('inventory') || message.includes('margins')) {
    return 'Margin tracking + inventory reporting'
  }

  if (message.includes('restaurant') || message.includes('location') || message.includes('cost control')) {
    return 'Expansion planning + cost control'
  }

  if (message.includes('cash flow') || message.includes('cash')) {
    return 'Cash flow visibility + reporting'
  }

  if (message.includes('monthly close') || message.includes('kpi')) {
    return 'Monthly close + KPI tracking'
  }

  if (message.includes('pricing') || message.includes('tax')) {
    return 'Pricing guidance + tax planning'
  }

  return 'Financial guidance + reporting support'
}

function suggestAction(lead) {
  if (lead.budget === 'Not specified') {
    return 'Clarify budget before advisor routing'
  }

  const urgency = lead.urgency.toLowerCase()

  if (urgency.includes('week') || urgency.includes('month') || urgency.includes('board') || urgency.includes('due')) {
    return 'Route to senior advisor'
  }

  if (urgency.includes('no rush') || urgency.includes('exploring') || urgency.includes('browsing')) {
    return 'Add to nurture sequence'
  }

  return 'Schedule discovery call'
}
</script>
