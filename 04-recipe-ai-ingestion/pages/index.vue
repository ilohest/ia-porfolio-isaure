<script setup>
import { ref } from 'vue'

// ─── State ────────────────────────────────────────────────────────────────────
const phase = ref('idle')           // idle | analyzing | complete
const analysisStep = ref(0)         // 0–5, progressive reveal
const imagePreview = ref(null)      // base64 | 'demo'
const isDragging = ref(false)
const savedState = ref(false)

// ─── Mock recipe data ─────────────────────────────────────────────────────────
const recipe = {
  title: 'Roasted Veggie Quinoa Bowl',
  description:
    'A warm grain bowl with roasted seasonal vegetables, crispy chickpeas, crumbled feta, and a creamy tahini dressing. Simple to prep, rich in flavor.',
  ingredients: [
    { name: 'Quinoa',       amount: '200 g' },
    { name: 'Chickpeas',    amount: '1 can' },
    { name: 'Zucchini',     amount: '1 medium' },
    { name: 'Carrots',      amount: '2 medium' },
    { name: 'Red onion',    amount: '½' },
    { name: 'Feta cheese',  amount: '80 g' },
    { name: 'Tahini',       amount: '2 tbsp' },
    { name: 'Olive oil',    amount: '3 tbsp' },
    { name: 'Lemon',        amount: '1' },
    { name: 'Garlic',       amount: '2 cloves' },
  ],
  tags: ['vegetarian', 'meal prep', 'oven-roasted', 'high-protein', 'quick dinner', 'warm'],
  steps: [
    'Toss vegetables and chickpeas in olive oil, salt, and cumin. Roast at 200 °C for 25 min.',
    'Cook quinoa in vegetable broth over medium heat for 15 minutes until fluffy.',
    'Assemble: quinoa base, roasted vegetables, crumbled feta, lemon tahini drizzle.',
  ],
  author: 'Sophie L.',
  initials: 'SL',
  time: '40 min',
  servings: '2 servings',
  calories: '520 kcal',
}

// ─── Handlers ─────────────────────────────────────────────────────────────────
function handleFileInput(e) {
  const file = e.target.files[0]
  if (!file) return
  loadFile(file)
}

function handleDrop(e) {
  e.preventDefault()
  isDragging.value = false
  const file = e.dataTransfer.files[0]
  if (!file || !file.type.startsWith('image/')) return
  loadFile(file)
}

function loadFile(file) {
  const reader = new FileReader()
  reader.onload = (ev) => {
    imagePreview.value = ev.target.result
    startAnalysis()
  }
  reader.readAsDataURL(file)
}

function useDemo() {
  imagePreview.value = 'demo'
  startAnalysis()
}

async function startAnalysis() {
  phase.value = 'analyzing'
  analysisStep.value = 0
  savedState.value = false

  const delays = [900, 550, 650, 500, 650]
  for (let i = 0; i < 5; i++) {
    await sleep(delays[i])
    analysisStep.value = i + 1
  }

  await sleep(400)
  phase.value = 'complete'
}

async function saveRecipe() {
  await sleep(600)
  savedState.value = true
}

function reset() {
  phase.value = 'idle'
  analysisStep.value = 0
  imagePreview.value = null
  savedState.value = false
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
</script>

<template>
  <div class="min-h-screen bg-[#0d0b09] flex flex-col">

    <!-- ── Top bar ─────────────────────────────────────────────────────────── -->
    <header class="flex items-center justify-between px-8 py-4 border-b border-[#1f1c18]">
      <div class="flex items-center gap-3">
        <div class="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center">
          <svg class="w-4 h-4 text-[#0d0b09]" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-.293.707L13 10.414V17a1 1 0 01-.553.894l-4 2A1 1 0 017 19v-8.586L3.293 6.707A1 1 0 013 6V4z"/>
          </svg>
        </div>
        <span class="text-[15px] font-semibold tracking-tight text-[#e2dbd2]">ForkSpace</span>
        <span class="text-[#3a3530] text-sm">/</span>
        <span class="text-[13px] text-[#7a6f64]">AI Recipe Ingestion</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-[11px] text-[#4a4540] font-medium uppercase tracking-wider">Beta</span>
        <div class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse-slow"></div>
      </div>
    </header>

    <!-- ── Main panels ─────────────────────────────────────────────────────── -->
    <main class="flex flex-1 overflow-hidden">

      <!-- LEFT — Photo upload ───────────────────────────────────────────────── -->
      <section class="w-[280px] shrink-0 border-r border-[#1f1c18] flex flex-col bg-[#0f0d0b]">
        <div class="px-5 pt-6 pb-4">
          <p class="text-[11px] font-medium uppercase tracking-widest text-[#4a4540]">Source image</p>
        </div>

        <!-- Upload zone -->
        <div class="px-4 flex-1 flex flex-col">
          <div
            v-if="!imagePreview"
            class="relative flex-1 max-h-[240px] rounded-xl border border-dashed border-[#2a2520] flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-200"
            :class="isDragging ? 'border-amber-500/50 bg-amber-500/5' : 'hover:border-[#3a3530] hover:bg-[#141210]'"
            @dragover.prevent="isDragging = true"
            @dragleave="isDragging = false"
            @drop="handleDrop"
            @click="$refs.fileInput.click()"
          >
            <div class="w-10 h-10 rounded-full bg-[#1c1a18] flex items-center justify-center">
              <svg class="w-5 h-5 text-[#4a4540]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
              </svg>
            </div>
            <div class="text-center px-4">
              <p class="text-[13px] text-[#7a6f64]">Drop a photo here</p>
              <p class="text-[11px] text-[#3a3530] mt-1">or click to browse</p>
            </div>
            <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileInput" />
          </div>

          <!-- Image preview -->
          <div v-else class="relative rounded-xl overflow-hidden flex-1 max-h-[240px] bg-[#141210]">
            <!-- Real uploaded image -->
            <img
              v-if="imagePreview !== 'demo'"
              :src="imagePreview"
              class="w-full h-full object-cover"
              alt="Uploaded dish"
            />
            <!-- CSS demo plate illustration -->
            <div v-else class="w-full h-full relative overflow-hidden" style="background: radial-gradient(ellipse at 40% 35%, #3d2e1a 0%, #1e1409 55%, #0f0a05 100%)">
              <!-- Bowl shape -->
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="relative w-36 h-28">
                  <!-- Grain base -->
                  <div class="absolute inset-0 rounded-full" style="background: radial-gradient(ellipse at 50% 60%, #c9a96e 0%, #a07c45 50%, #7a5c2e 100%); transform: scaleY(0.65); top: 20%"></div>
                  <!-- Vegetables -->
                  <div class="absolute w-6 h-6 rounded-full" style="background: #e8742a; top: 22%; left: 18%; opacity:0.9; filter: blur(0.5px)"></div>
                  <div class="absolute w-5 h-5 rounded-full" style="background: #6aaa5a; top: 30%; left: 55%; opacity:0.9; filter: blur(0.5px)"></div>
                  <div class="absolute w-7 h-5 rounded-full" style="background: #9b4ea8; top: 18%; left: 38%; opacity:0.8; filter: blur(0.5px)"></div>
                  <div class="absolute w-4 h-4 rounded-full" style="background: #e8c050; top: 40%; left: 25%; opacity:0.9; filter: blur(0.5px)"></div>
                  <!-- Feta crumbles -->
                  <div class="absolute w-2.5 h-2 rounded-sm" style="background: #f5f0e8; top: 28%; right: 22%; opacity:0.85"></div>
                  <div class="absolute w-2 h-1.5 rounded-sm" style="background: #f5f0e8; top: 38%; right: 30%; opacity:0.75"></div>
                  <!-- Tahini drizzle -->
                  <div class="absolute" style="width: 2px; height: 28px; background: linear-gradient(to bottom, #d4a843, transparent); top: 20%; left: 48%; transform: rotate(15deg); opacity: 0.7; border-radius: 2px"></div>
                </div>
              </div>
              <!-- Ambient light -->
              <div class="absolute top-0 left-0 w-24 h-24 rounded-full opacity-10" style="background: radial-gradient(circle, #fbbf24, transparent)"></div>
              <div class="absolute bottom-0 right-0 w-20 h-20 rounded-full opacity-5" style="background: radial-gradient(circle, #f59e0b, transparent)"></div>
            </div>

            <!-- Status badge -->
            <div class="absolute top-2.5 left-2.5">
              <div v-if="phase === 'analyzing'" class="flex items-center gap-1.5 bg-[#0d0b09]/80 backdrop-blur-sm rounded-md px-2 py-1">
                <div class="flex gap-0.5">
                  <span class="w-1 h-1 rounded-full bg-amber-500 animate-bounce" style="animation-delay: 0ms"></span>
                  <span class="w-1 h-1 rounded-full bg-amber-500 animate-bounce" style="animation-delay: 150ms"></span>
                  <span class="w-1 h-1 rounded-full bg-amber-500 animate-bounce" style="animation-delay: 300ms"></span>
                </div>
                <span class="text-[11px] text-amber-500/80">Analyzing</span>
              </div>
              <div v-else-if="phase === 'complete'" class="flex items-center gap-1.5 bg-[#0d0b09]/80 backdrop-blur-sm rounded-md px-2 py-1">
                <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                <span class="text-[11px] text-emerald-400">Processed</span>
              </div>
            </div>
          </div>

          <!-- Demo + Reset buttons -->
          <div class="mt-4 flex flex-col gap-2">
            <button
              v-if="!imagePreview"
              class="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-[#0d0b09] text-[13px] font-semibold transition-colors duration-150"
              @click="useDemo"
            >
              Try with demo
            </button>
            <button
              v-if="imagePreview"
              class="w-full py-2.5 rounded-lg border border-[#2a2520] hover:border-[#3a3530] text-[#7a6f64] text-[13px] transition-colors duration-150"
              @click="reset"
            >
              Reset
            </button>
          </div>

          <!-- Meta info when image loaded -->
          <div v-if="imagePreview && phase === 'complete'" class="mt-4 p-3 rounded-lg bg-[#141210] border border-[#1f1c18]">
            <div class="flex items-center justify-between mb-2">
              <span class="text-[11px] text-[#4a4540] uppercase tracking-wider">Image metadata</span>
            </div>
            <div class="space-y-1.5">
              <div class="flex justify-between">
                <span class="text-[12px] text-[#7a6f64]">Format</span>
                <span class="text-[12px] text-[#a09080]">JPEG · 2.4 MB</span>
              </div>
              <div class="flex justify-between">
                <span class="text-[12px] text-[#7a6f64]">Confidence</span>
                <span class="text-[12px] text-emerald-400">94%</span>
              </div>
              <div class="flex justify-between">
                <span class="text-[12px] text-[#7a6f64]">Model</span>
                <span class="text-[12px] text-[#a09080]">vision-v2</span>
              </div>
            </div>
          </div>
        </div>

        <div class="h-8"></div>
      </section>

      <!-- CENTER — AI Analysis ─────────────────────────────────────────────── -->
      <section class="flex-1 flex flex-col overflow-y-auto">
        <!-- Empty state -->
        <div v-if="phase === 'idle'" class="flex-1 flex flex-col items-center justify-center text-center px-8 gap-4">
          <div class="w-12 h-12 rounded-2xl bg-[#141210] border border-[#1f1c18] flex items-center justify-center">
            <svg class="w-6 h-6 text-[#3a3530]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
            </svg>
          </div>
          <div>
            <p class="text-[14px] text-[#4a4540]">Upload a food photo to start</p>
            <p class="text-[12px] text-[#2a2520] mt-1">AI will extract structured recipe data from your image</p>
          </div>
        </div>

        <!-- Analysis content -->
        <div v-else class="px-8 py-6 space-y-6">

          <!-- Header -->
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[11px] font-medium uppercase tracking-widest text-[#4a4540]">AI Analysis</p>
              <p v-if="phase === 'analyzing'" class="text-[13px] text-[#7a6f64] mt-0.5">Extracting recipe structure…</p>
              <p v-else class="text-[13px] text-emerald-400/80 mt-0.5">Analysis complete — 5 fields extracted</p>
            </div>
            <div v-if="phase === 'analyzing'" class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141210] border border-[#1f1c18]">
              <div class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse-slow"></div>
              <span class="text-[12px] text-amber-500/80">Processing</span>
            </div>
            <div v-else class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
              </svg>
              <span class="text-[12px] text-emerald-400">Done</span>
            </div>
          </div>

          <!-- ① Title -->
          <Transition name="fade-up">
            <div v-if="analysisStep >= 1" class="analysis-block">
              <div class="block-label">Recipe title</div>
              <div class="block-content">
                <p class="text-[17px] font-semibold text-[#e2dbd2] leading-snug">{{ recipe.title }}</p>
              </div>
            </div>
          </Transition>

          <!-- ① Skeleton title -->
          <div v-if="analysisStep < 1 && phase === 'analyzing'" class="analysis-block">
            <div class="block-label">Recipe title</div>
            <div class="h-5 w-3/4 rounded-md bg-[#1f1c18] shimmer-block"></div>
          </div>

          <!-- ② Description -->
          <Transition name="fade-up">
            <div v-if="analysisStep >= 2" class="analysis-block">
              <div class="block-label">Description</div>
              <div class="block-content">
                <p class="text-[13px] text-[#a09080] leading-relaxed">{{ recipe.description }}</p>
              </div>
            </div>
          </Transition>

          <div v-if="analysisStep === 1 && phase === 'analyzing'" class="analysis-block">
            <div class="block-label">Description</div>
            <div class="space-y-2">
              <div class="h-3 w-full rounded-md bg-[#1f1c18] shimmer-block"></div>
              <div class="h-3 w-5/6 rounded-md bg-[#1f1c18] shimmer-block"></div>
            </div>
          </div>

          <!-- ③ Ingredients -->
          <Transition name="fade-up">
            <div v-if="analysisStep >= 3" class="analysis-block">
              <div class="block-label">Detected ingredients</div>
              <div class="block-content">
                <div class="grid grid-cols-2 gap-x-6 gap-y-2">
                  <div
                    v-for="(ing, i) in recipe.ingredients"
                    :key="ing.name"
                    class="flex items-center justify-between"
                    :style="{ animationDelay: `${i * 50}ms` }"
                  >
                    <span class="text-[13px] text-[#c8bfb0]">{{ ing.name }}</span>
                    <span class="text-[12px] text-[#5a5048] tabular-nums">{{ ing.amount }}</span>
                  </div>
                </div>
              </div>
            </div>
          </Transition>

          <div v-if="analysisStep === 2 && phase === 'analyzing'" class="analysis-block">
            <div class="block-label">Detected ingredients</div>
            <div class="grid grid-cols-2 gap-x-6 gap-y-2">
              <div v-for="n in 8" :key="n" class="h-3 rounded-md bg-[#1f1c18] shimmer-block"></div>
            </div>
          </div>

          <!-- ④ Tags -->
          <Transition name="fade-up">
            <div v-if="analysisStep >= 4" class="analysis-block">
              <div class="block-label">Suggested tags</div>
              <div class="block-content flex flex-wrap gap-2">
                <span
                  v-for="(tag, i) in recipe.tags"
                  :key="tag"
                  class="tag-chip"
                  :style="{ animationDelay: `${i * 70}ms` }"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </Transition>

          <div v-if="analysisStep === 3 && phase === 'analyzing'" class="analysis-block">
            <div class="block-label">Suggested tags</div>
            <div class="flex flex-wrap gap-2">
              <div v-for="n in 6" :key="n" class="h-6 w-20 rounded-full bg-[#1f1c18] shimmer-block"></div>
            </div>
          </div>

          <!-- ⑤ Preparation steps -->
          <Transition name="fade-up">
            <div v-if="analysisStep >= 5" class="analysis-block">
              <div class="block-label">Preparation summary</div>
              <div class="block-content space-y-3">
                <div
                  v-for="(step, i) in recipe.steps"
                  :key="i"
                  class="flex gap-3"
                >
                  <div class="w-5 h-5 shrink-0 rounded-full bg-amber-500/15 border border-amber-500/25 flex items-center justify-center mt-0.5">
                    <span class="text-[10px] font-semibold text-amber-500">{{ i + 1 }}</span>
                  </div>
                  <p class="text-[13px] text-[#a09080] leading-relaxed">{{ step }}</p>
                </div>
              </div>
            </div>
          </Transition>

          <div v-if="analysisStep === 4 && phase === 'analyzing'" class="analysis-block">
            <div class="block-label">Preparation summary</div>
            <div class="space-y-3">
              <div v-for="n in 3" :key="n" class="flex gap-3 items-center">
                <div class="w-5 h-5 shrink-0 rounded-full bg-[#1f1c18]"></div>
                <div class="h-3 flex-1 rounded-md bg-[#1f1c18] shimmer-block"></div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- RIGHT — Post preview ─────────────────────────────────────────────── -->
      <section class="w-[300px] shrink-0 border-l border-[#1f1c18] flex flex-col bg-[#0f0d0b]">
        <div class="px-5 pt-6 pb-4">
          <p class="text-[11px] font-medium uppercase tracking-widest text-[#4a4540]">Post preview</p>
        </div>

        <!-- Empty state -->
        <div v-if="phase !== 'complete'" class="flex-1 flex flex-col items-center justify-center px-6 gap-3 pb-12">
          <div class="w-full rounded-xl border border-dashed border-[#1f1c18] h-40 flex items-center justify-center">
            <svg class="w-7 h-7 text-[#2a2520]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21l6.75-6.75 1.5 1.5"/>
            </svg>
          </div>
          <p class="text-[12px] text-[#3a3530] text-center">Recipe preview will appear here once AI analysis is complete</p>
        </div>

        <!-- Recipe card (complete state) -->
        <Transition name="slide-in">
          <div v-if="phase === 'complete'" class="px-4 flex flex-col gap-4 pb-6">

            <!-- Card -->
            <div class="rounded-xl overflow-hidden border border-[#1f1c18] bg-[#141210]">

              <!-- Image thumb -->
              <div class="relative h-[160px] overflow-hidden bg-[#1a1612]">
                <img
                  v-if="imagePreview && imagePreview !== 'demo'"
                  :src="imagePreview"
                  class="w-full h-full object-cover"
                  alt="Recipe"
                />
                <div v-else class="w-full h-full relative overflow-hidden" style="background: radial-gradient(ellipse at 40% 35%, #3d2e1a 0%, #1e1409 55%, #0f0a05 100%)">
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div class="relative w-28 h-22">
                      <div class="absolute inset-0 rounded-full" style="background: radial-gradient(ellipse at 50% 60%, #c9a96e 0%, #a07c45 50%, #7a5c2e 100%); transform: scaleY(0.65); top: 20%"></div>
                      <div class="absolute w-5 h-5 rounded-full" style="background: #e8742a; top: 22%; left: 18%; opacity:0.9"></div>
                      <div class="absolute w-4 h-4 rounded-full" style="background: #6aaa5a; top: 30%; left: 55%; opacity:0.9"></div>
                      <div class="absolute w-5 h-4 rounded-full" style="background: #9b4ea8; top: 18%; left: 38%; opacity:0.8"></div>
                      <div class="absolute w-2 h-1.5 rounded-sm" style="background: #f5f0e8; top: 28%; right: 22%"></div>
                    </div>
                  </div>
                </div>
                <!-- Saved badge -->
                <div v-if="savedState" class="absolute top-2.5 right-2.5 flex items-center gap-1.5 bg-emerald-500/15 backdrop-blur-sm rounded-md px-2 py-1 border border-emerald-500/20">
                  <svg class="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                  </svg>
                  <span class="text-[10px] text-emerald-400 font-medium">Saved</span>
                </div>
              </div>

              <!-- Card body -->
              <div class="p-4 space-y-3">
                <!-- Author -->
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <span class="text-[9px] font-semibold text-amber-500">{{ recipe.initials }}</span>
                  </div>
                  <span class="text-[12px] text-[#7a6f64]">{{ recipe.author }}</span>
                  <span class="text-[#2a2520] text-xs ml-auto">Just now</span>
                </div>

                <!-- Title -->
                <h3 class="text-[14px] font-semibold text-[#e2dbd2] leading-snug">{{ recipe.title }}</h3>

                <!-- Description -->
                <p class="text-[12px] text-[#7a6f64] leading-relaxed line-clamp-2">{{ recipe.description }}</p>

                <!-- Tags -->
                <div class="flex flex-wrap gap-1.5">
                  <span
                    v-for="tag in recipe.tags.slice(0, 4)"
                    :key="tag"
                    class="text-[10px] px-2 py-0.5 rounded-full bg-[#1f1c18] text-[#5a5048] border border-[#2a2520]"
                  >
                    {{ tag }}
                  </span>
                  <span v-if="recipe.tags.length > 4" class="text-[10px] px-2 py-0.5 rounded-full bg-[#1f1c18] text-[#4a4540] border border-[#2a2520]">
                    +{{ recipe.tags.length - 4 }}
                  </span>
                </div>

                <!-- Stats -->
                <div class="flex items-center gap-3 pt-1 border-t border-[#1f1c18]">
                  <div class="flex items-center gap-1">
                    <svg class="w-3.5 h-3.5 text-[#4a4540]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span class="text-[11px] text-[#5a5048]">{{ recipe.time }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <svg class="w-3.5 h-3.5 text-[#4a4540]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
                    </svg>
                    <span class="text-[11px] text-[#5a5048]">{{ recipe.servings }}</span>
                  </div>
                  <span class="text-[11px] text-[#5a5048] ml-auto">{{ recipe.calories }}</span>
                </div>
              </div>
            </div>

            <!-- Save / published action -->
            <div v-if="!savedState">
              <button
                class="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#0d0b09] text-[13px] font-semibold transition-colors duration-150"
                @click="saveRecipe"
              >
                Save to my recipes
              </button>
            </div>

            <div v-else class="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <svg class="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <div>
                <p class="text-[13px] font-medium text-emerald-400">Published to your recipes</p>
                <p class="text-[11px] text-emerald-400/50">Now visible in your collection</p>
              </div>
            </div>

            <!-- Structured data note -->
            <div class="px-4 py-3 rounded-xl bg-[#141210] border border-[#1f1c18]">
              <p class="text-[11px] text-[#4a4540] uppercase tracking-wider mb-2">Structured output</p>
              <div class="space-y-1.5">
                <div class="flex items-center gap-2">
                  <div class="w-1 h-1 rounded-full bg-amber-500/50"></div>
                  <span class="text-[11px] text-[#5a5048]">Indexed for search & discovery</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-1 h-1 rounded-full bg-amber-500/50"></div>
                  <span class="text-[11px] text-[#5a5048]">Tagged for filter & recommendation</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-1 h-1 rounded-full bg-amber-500/50"></div>
                  <span class="text-[11px] text-[#5a5048]">Ready for collection sync</span>
                </div>
              </div>
            </div>

          </div>
        </Transition>
      </section>
    </main>
  </div>
</template>

<style scoped>
/* Analysis blocks */
.analysis-block {
  @apply p-4 rounded-xl bg-[#111008] border border-[#1f1c18];
}

.block-label {
  @apply text-[11px] font-medium uppercase tracking-widest text-[#4a4540] mb-3;
}

.block-content {
  /* inherits */
}

/* Tag chips */
.tag-chip {
  @apply text-[12px] px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/8 text-amber-500/80;
}

/* Shimmer skeleton */
.shimmer-block {
  background: linear-gradient(90deg, #1f1c18 25%, #2a2520 50%, #1f1c18 75%);
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite;
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Fade-up transition */
.fade-up-enter-active {
  transition: opacity 0.45s ease-out, transform 0.45s ease-out;
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-up-enter-to {
  opacity: 1;
  transform: translateY(0);
}

/* Slide-in from right */
.slide-in-enter-active {
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;
}
.slide-in-enter-from {
  opacity: 0;
  transform: translateX(16px);
}
.slide-in-enter-to {
  opacity: 1;
  transform: translateX(0);
}
</style>
