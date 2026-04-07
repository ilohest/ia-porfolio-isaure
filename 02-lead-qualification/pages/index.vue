<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col select-none">

    <!-- Header -->
    <header class="border-b border-slate-800 px-6 py-3 flex items-center justify-between flex-shrink-0">
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

    <!-- Body: 3 columns -->
    <div class="flex flex-1 overflow-hidden">

      <!-- COL 1 — Inbox -->
      <aside class="w-[260px] flex-shrink-0 border-r border-slate-800 flex flex-col overflow-hidden">
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

      <!-- COL 2 — Lead detail -->
      <section class="w-[380px] flex-shrink-0 border-r border-slate-800 flex flex-col overflow-hidden">
        <div v-if="selectedLead" class="flex-1 overflow-y-auto">
          <!-- Lead header -->
          <div class="px-5 py-4 border-b border-slate-800">
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

          <!-- Fields -->
          <div class="px-5 py-4 flex flex-col gap-4">
            <div class="grid grid-cols-2 gap-4">
              <LeadField label="Company" :value="selectedLead.company" />
              <LeadField label="Team size" :value="selectedLead.teamSize" />
              <LeadField label="Revenue range" :value="selectedLead.revenue" />
              <LeadField label="Budget" :value="selectedLead.budget" />
            </div>

            <div class="border-t border-slate-800"></div>

            <div>
              <p class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Message</p>
              <p class="text-sm text-slate-300 leading-relaxed bg-slate-800/40 rounded-lg px-4 py-3 border border-slate-700/40 italic">
                "{{ selectedLead.message }}"
              </p>
            </div>

            <div class="border-t border-slate-800"></div>

            <LeadField label="Urgency" :value="selectedLead.urgency" />
          </div>

          <!-- Action button -->
          <div class="px-5 pb-5">
            <button
              @click="startAnalysis"
              :disabled="analysisState !== 'idle'"
              class="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
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
              <span>{{ analysisState === 'idle' ? 'Analyze lead' : analysisState === 'analyzing' ? 'Analyzing…' : 'Analysis complete' }}</span>
            </button>
          </div>
        </div>

        <div v-else class="flex-1 flex items-center justify-center">
          <p class="text-sm text-slate-600">Select a submission</p>
        </div>
      </section>

      <!-- COL 3 — AI output -->
      <section class="flex-1 flex flex-col overflow-y-auto px-6 py-5 gap-4">
        <div class="flex items-center gap-2 h-6 flex-shrink-0">
          <span class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">AI Qualification</span>
          <div v-if="analysisState === 'analyzing'" class="flex items-center gap-1 ml-1">
            <span class="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style="animation-delay:0ms"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style="animation-delay:150ms"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style="animation-delay:300ms"></span>
          </div>
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
        <div v-else-if="analysisState === 'analyzing'" class="flex flex-col gap-4">
          <div v-for="i in 4" :key="i" class="bg-slate-900 border border-slate-800 rounded-xl p-5 animate-pulse_soft">
            <div class="h-2.5 w-24 bg-slate-800 rounded mb-3"></div>
            <div class="flex flex-col gap-2">
              <div class="h-2.5 bg-slate-800 rounded w-full"></div>
              <div class="h-2.5 bg-slate-800 rounded" :class="i === 1 ? 'w-1/2' : i === 2 ? 'w-5/6' : 'w-4/6'"></div>
            </div>
          </div>
        </div>

        <!-- Results -->
        <div v-else class="flex flex-col gap-4">

          <!-- Score -->
          <div class="bg-slate-900 border border-emerald-500/25 rounded-xl p-5 animate-fadeInUp" style="animation-delay:0ms">
            <p class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Qualification score</p>
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2">
                <div class="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                <span class="text-xl font-bold text-emerald-400">High fit</span>
              </div>
              <div class="h-5 w-px bg-slate-700"></div>
              <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-500/12 text-red-400 border border-red-500/20">
                <span class="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
                Priority: High
              </span>
              <div class="ml-auto text-right">
                <p class="text-[10px] text-slate-500">Score</p>
                <p class="text-xl font-bold text-slate-100">91<span class="text-slate-500 text-xs font-normal">/100</span></p>
              </div>
            </div>
          </div>

          <!-- Summary -->
          <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 animate-fadeInUp" style="animation-delay:80ms">
            <p class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Qualification summary</p>
            <ul class="flex flex-col gap-2">
              <li v-for="(item, i) in summary" :key="i" class="flex items-start gap-2.5 text-sm text-slate-300">
                <svg class="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                {{ item }}
              </li>
            </ul>
          </div>

          <!-- Key signals -->
          <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 animate-fadeInUp" style="animation-delay:160ms">
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
          <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 animate-fadeInUp" style="animation-delay:240ms">
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

        </div>
      </section>
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
            <p class="text-sm font-semibold text-white mb-2">New qualified lead</p>
            <div class="flex flex-col gap-1">
              <p class="text-xs text-blue-200"><span class="text-white/50">Company:</span> Atelier Norte — 14 employees</p>
              <p class="text-xs text-blue-200"><span class="text-white/50">Need:</span> Reporting + cash flow support</p>
              <p class="text-xs text-blue-200"><span class="text-white/50">Budget:</span> €2,000–€3,000/month ✓</p>
              <p class="text-xs text-blue-200"><span class="text-white/50">Urgency:</span> Start this month</p>
            </div>
            <div class="mt-2.5 pt-2.5 border-t border-white/10">
              <p class="text-xs text-white/70"><span class="font-medium text-white/90">Action:</span> Route to senior advisor</p>
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
import { ref } from 'vue'

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
]

const selectedLead = ref(leads[0])

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
  analysisState.value = 'analyzing'
  await new Promise(r => setTimeout(r, 2200))
  analysisState.value = 'done'
  await new Promise(r => setTimeout(r, 600))
  showTelegram.value = true
}
</script>
