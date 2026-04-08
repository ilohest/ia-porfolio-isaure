<script setup>
import { computed, reactive, ref } from 'vue'

// ─── State ────────────────────────────────────────────────────────────────────
const phase = ref('idle')           // idle | analyzing | complete
const analysisStep = ref(0)         // 0–6, progressive reveal
const imagePreview = ref(null)      // base64 | 'demo'
const isDragging = ref(false)
const savedState = ref(false)
const draggedStepIndex = ref(null)
const demoImage = '/demo-recipe.jpg'
const currentImageSrc = computed(() => imagePreview.value === 'demo' ? demoImage : imagePreview.value)

// ─── Mock recipe data ─────────────────────────────────────────────────────────
const recipe = reactive({
  title: 'Poêlée de lentilles, carottes et épinards',
  description:
    'Une poêlée chaude aux lentilles, carottes fondantes, oignons, tomates et épinards, relevée avec des épices douces et un jus de cuisson onctueux.',
  ingredients: [
    { name: 'Lentilles cuites', amount: '260 g' },
    { name: 'Carottes', amount: '3 moyennes' },
    { name: 'Oignon jaune', amount: '1' },
    { name: 'Tomates concassées', amount: '200 g' },
    { name: 'Épinards frais', amount: '2 poignées' },
    { name: 'Ail', amount: '2 gousses' },
    { name: 'Huile d’olive', amount: '2 c. à soupe' },
    { name: 'Cumin', amount: '1 c. à café' },
    { name: 'Curcuma', amount: '1/2 c. à café' },
    { name: 'Bouillon végétal', amount: '120 ml' },
  ],
  allergens: [
    { name: 'Aucun allergène majeur détecté' },
  ],
  tags: ['rapide', 'chaud', 'sans four', 'batch cooking', 'trempage la veille'],
  steps: [
    'Faire revenir l’oignon émincé, l’ail et les rondelles de carottes dans l’huile d’olive pendant 6 à 8 minutes.',
    'Ajouter les lentilles, les tomates, le bouillon, le cumin et le curcuma, puis laisser mijoter jusqu à obtenir une sauce courte.',
    'Incorporer les épinards en fin de cuisson, rectifier l assaisonnement et servir chaud.',
  ],
  author: 'Isaure L.',
  initials: 'IL',
  time: '25 min',
  servings: 2,
  calories: '410 kcal',
})

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

  const delays = [900, 550, 650, 500, 500, 650]
  for (let i = 0; i < 6; i++) {
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
  draggedStepIndex.value = null
}

function addIngredient() {
  recipe.ingredients.push({ name: 'Nouvel ingrédient', amount: '' })
}

function removeIngredient(index) {
  recipe.ingredients.splice(index, 1)
}

function addAllergen() {
  recipe.allergens.push({ name: 'Allergène à vérifier' })
}

function removeAllergen(index) {
  recipe.allergens.splice(index, 1)
}

function addTag() {
  recipe.tags.push('nouvelle indication')
}

function removeTag(index) {
  recipe.tags.splice(index, 1)
}

function addStep() {
  recipe.steps.push('Nouvelle étape à compléter.')
}

function removeStep(index) {
  recipe.steps.splice(index, 1)
}

function decrementServings() {
  recipe.servings = Math.max(1, Number(recipe.servings || 1) - 1)
}

function incrementServings() {
  recipe.servings = Number(recipe.servings || 0) + 1
}

function handleStepDragStart(index) {
  draggedStepIndex.value = index
}

function handleStepDrop(index) {
  if (draggedStepIndex.value === null || draggedStepIndex.value === index) return
  const [step] = recipe.steps.splice(draggedStepIndex.value, 1)
  recipe.steps.splice(index, 0, step)
  draggedStepIndex.value = null
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
</script>

<template>
  <div class="min-h-screen bg-[#f1d1ea] flex flex-col text-[#1f1e20]">

    <!-- ── Top bar ─────────────────────────────────────────────────────────── -->
    <header class="fixed left-6 right-6 top-4 z-50 flex h-14 items-center justify-between rounded-lg border-2 border-[#1f1e20] bg-white/95 px-4 shadow-[3px_3px_0_#c24e00] backdrop-blur">
      <div class="flex items-center gap-2.5">
        <span class="title-font text-[25px] font-semibold leading-none tracking-tight text-[#1f1e20]">ForkSpace</span>
      </div>
      <nav class="hidden items-center gap-1 rounded-md border-2 border-[#1f1e20] bg-white p-0.5 md:flex">
        <button class="menu-pill menu-pill-active" type="button">Importer</button>
        <button class="menu-pill" type="button">Recettes</button>
        <button class="menu-pill" type="button">Planifier</button>
      </nav>
      <button class="profile-menu flex items-center gap-2 rounded-md border-2 border-[#1f1e20] bg-[#f0ffa8] px-2.5 py-1" type="button">
        <div class="hidden text-right leading-tight sm:block">
          <p class="text-[12px] font-semibold text-[#1f1e20]">Isaure L.</p>
        </div>
        <div class="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#1f1e20] bg-[#c24e00] text-[10px] font-black text-white">
          IL
        </div>
        <svg class="h-3.5 w-3.5 text-[#1f1e20]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </button>
    </header>

    <!-- ── Main panels ─────────────────────────────────────────────────────── -->
    <main class="flex flex-1 overflow-hidden pt-[84px] pb-4">
      <div class="flex min-h-0 flex-1 border-y-2 border-[#1f1e20]">

      <!-- LEFT — Photo upload ───────────────────────────────────────────────── -->
      <section class="w-[280px] shrink-0 border-r-2 border-[#1f1e20] flex flex-col bg-[#f0ffa8]">
        <div class="px-8 pt-8 pb-5">
          <p class="title-font text-[11px] font-semibold uppercase tracking-widest text-[#1f1e20]">Image source</p>
        </div>

        <!-- Upload zone -->
        <div class="px-4 flex-1 flex flex-col">
          <div
            v-if="!imagePreview"
            class="relative flex-1 max-h-[240px] rounded-lg border-2 border-dashed border-[#1f1e20] bg-white flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-200"
            :class="isDragging ? 'shadow-[6px_6px_0_#c24e00]' : 'hover:shadow-[6px_6px_0_#f1d1ea]'"
            @dragover.prevent="isDragging = true"
            @dragleave="isDragging = false"
            @drop="handleDrop"
            @click="$refs.fileInput.click()"
          >
            <div class="w-10 h-10 rounded-full bg-[#c24e00] flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
              </svg>
            </div>
            <div class="text-center px-4">
              <p class="text-[13px] text-[#1f1e20]">Déposez une photo ici</p>
              <p class="text-[11px] text-[#c24e00] mt-1">ou cliquez pour choisir</p>
            </div>
            <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileInput" />
          </div>

          <!-- Image preview -->
          <div v-else class="relative rounded-lg overflow-hidden flex-1 max-h-[240px] bg-white border-2 border-[#1f1e20] shadow-[6px_6px_0_#c24e00]">
            <!-- Real uploaded image -->
            <img
              v-if="currentImageSrc"
              :src="currentImageSrc"
              class="w-full h-full object-cover"
              alt="Plat importé"
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
              <div v-if="phase === 'analyzing'" class="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-md px-2 py-1 border border-[#1f1e20]">
                <div class="flex gap-0.5">
                  <span class="w-1 h-1 rounded-full bg-[#f0ffa8] animate-bounce" style="animation-delay: 0ms"></span>
                  <span class="w-1 h-1 rounded-full bg-[#f0ffa8] animate-bounce" style="animation-delay: 150ms"></span>
                  <span class="w-1 h-1 rounded-full bg-[#f0ffa8] animate-bounce" style="animation-delay: 300ms"></span>
                </div>
                <span class="text-[11px] text-[#1f1e20]">Analyse</span>
              </div>
              <div v-else-if="phase === 'complete'" class="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-md px-2 py-1 border border-[#1f1e20]">
                <div class="w-1.5 h-1.5 rounded-full bg-[#c24e00]"></div>
                <span class="text-[11px] text-[#1f1e20]">Traité</span>
              </div>
            </div>
          </div>

          <!-- Reset button -->
          <div class="mt-4 flex flex-col gap-2">
            <button
              v-if="imagePreview"
              class="w-full py-2.5 rounded-lg border-2 border-[#1f1e20] bg-white hover:bg-[#f1d1ea] text-[#1f1e20] text-[13px] font-semibold transition-colors duration-150"
              @click="reset"
            >
              Réinitialiser
            </button>
          </div>

        </div>

        <div class="h-8"></div>
      </section>

      <!-- CENTER — AI Analysis ─────────────────────────────────────────────── -->
      <section class="flex-1 flex flex-col overflow-y-auto">
        <!-- Empty state -->
        <div v-if="phase === 'idle'" class="flex-1 flex flex-col items-center justify-center text-center px-8 gap-4">
          <div class="w-12 h-12 rounded-lg bg-[#c24e00] border-2 border-[#1f1e20] flex items-center justify-center shadow-[5px_5px_0_#f0ffa8]">
            <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
            </svg>
          </div>
          <div>
            <p class="text-[14px] text-[#1f1e20] font-semibold">Importez une photo pour commencer</p>
            <p class="text-[12px] text-[#1f1e20]/65 mt-1">L’IA extrait les informations de recette depuis votre image</p>
          </div>
        </div>

        <!-- Analysis content -->
        <div v-else class="px-10 py-8 space-y-6">

          <!-- Header -->
          <div class="flex items-center justify-between">
            <div>
              <p class="title-font text-[11px] font-semibold uppercase tracking-widest text-[#c24e00]">Analyse IA</p>
              <p v-if="phase === 'analyzing'" class="text-[13px] text-[#1f1e20]/70 mt-0.5">Extraction de la recette...</p>
              <p v-else class="text-[13px] text-[#1f1e20]/70 mt-0.5">Analyse terminée - cliquez sur un champ pour le corriger</p>
            </div>
            <div v-if="phase === 'analyzing'" class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#f0ffa8] border-2 border-[#1f1e20]">
              <div class="w-1.5 h-1.5 rounded-full bg-[#c24e00] animate-pulse-slow"></div>
              <span class="text-[12px] text-[#1f1e20] font-semibold">Traitement</span>
            </div>
          </div>

          <!-- ① Title -->
          <Transition name="fade-up">
            <div v-if="analysisStep >= 2" class="grid gap-3 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,0.5fr)_minmax(0,0.5fr)_minmax(0,0.5fr)]">
              <div class="analysis-block">
                <div class="block-label">Titre de la recette</div>
                <div class="block-content">
                  <input
                    v-model="recipe.title"
                    class="editable-field title-font text-[17px] font-semibold leading-snug"
                    aria-label="Titre de la recette"
                  />
                </div>
              </div>

              <div class="analysis-block">
                <div class="block-label">Portions</div>
                <div class="block-content">
                  <div class="servings-stepper">
                    <button class="servings-button" type="button" aria-label="Réduire le nombre de portions" @click="decrementServings">-</button>
                    <input
                      v-model.number="recipe.servings"
                      type="number"
                      min="1"
                      class="servings-input"
                      aria-label="Nombre de portions"
                    />
                    <button class="servings-button" type="button" aria-label="Augmenter le nombre de portions" @click="incrementServings">+</button>
                  </div>
                </div>
              </div>

              <div class="analysis-block">
                <div class="block-label">Temps</div>
                <div class="block-content">
                  <input
                    v-model="recipe.time"
                    class="editable-field text-[14px] font-semibold"
                    aria-label="Temps de préparation"
                  />
                </div>
              </div>

              <div class="analysis-block">
                <div class="block-label">Calories</div>
                <div class="block-content">
                  <input
                    v-model="recipe.calories"
                    class="editable-field text-[14px] font-semibold"
                    aria-label="Calories"
                  />
                </div>
              </div>
            </div>
          </Transition>

          <Transition name="fade-up">
            <div v-if="analysisStep >= 1 && analysisStep < 2" class="analysis-block">
              <div class="block-label">Titre de la recette</div>
              <div class="block-content">
                <input
                  v-model="recipe.title"
                  class="editable-field title-font text-[17px] font-semibold leading-snug"
                  aria-label="Titre de la recette"
                />
              </div>
            </div>
          </Transition>

          <!-- ① Skeleton title -->
          <div v-if="analysisStep < 1 && phase === 'analyzing'" class="analysis-block">
            <div class="block-label">Titre de la recette</div>
            <div class="h-5 w-3/4 rounded-md bg-white/10 shimmer-block"></div>
          </div>

          <!-- ② Description -->
          <Transition name="fade-up">
            <div v-if="analysisStep >= 2" class="analysis-block">
              <div class="block-label">Description</div>
              <div class="block-content">
                <textarea
                  v-model="recipe.description"
                  class="editable-field min-h-[92px] resize-none text-[13px] leading-relaxed"
                  aria-label="Description"
                ></textarea>
              </div>
            </div>
          </Transition>

          <div v-if="analysisStep === 1 && phase === 'analyzing'" class="analysis-block">
            <div class="block-label">Description</div>
            <div class="space-y-2">
              <div class="h-3 w-full rounded-md bg-white/10 shimmer-block"></div>
              <div class="h-3 w-5/6 rounded-md bg-white/10 shimmer-block"></div>
            </div>
          </div>

          <!-- ③ Ingredients -->
          <Transition name="fade-up">
            <div v-if="analysisStep >= 3" class="analysis-block">
              <div class="flex items-center justify-between mb-3">
                <div class="block-label !mb-0">Ingrédients</div>
                <button class="add-button" type="button" @click="addIngredient">+ Ingrédient</button>
              </div>
              <div class="block-content">
                <div class="grid grid-cols-2 gap-x-6 gap-y-2">
                  <div
                    v-for="(ing, i) in recipe.ingredients"
                    :key="i"
                    class="editable-row"
                    :style="{ animationDelay: `${i * 50}ms` }"
                  >
                    <input
                      v-model="ing.name"
                      class="editable-field ingredient-name text-[13px]"
                      aria-label="Nom de l’ingrédient"
                    />
                    <input
                      v-model="ing.amount"
                      class="editable-field ingredient-amount text-[12px] tabular-nums text-right"
                      aria-label="Quantité"
                    />
                    <button class="remove-button" type="button" aria-label="Retirer l’ingrédient" @click="removeIngredient(i)">×</button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>

          <div v-if="analysisStep === 2 && phase === 'analyzing'" class="analysis-block">
            <div class="block-label">Ingrédients</div>
            <div class="grid grid-cols-2 gap-x-6 gap-y-2">
              <div v-for="n in 8" :key="n" class="h-3 rounded-md bg-white/10 shimmer-block"></div>
            </div>
          </div>

          <!-- ④ Allergènes -->
          <Transition name="fade-up">
            <div v-if="analysisStep >= 4" class="analysis-block">
              <div class="flex items-center justify-between mb-3">
                <div class="block-label !mb-0">Allergènes détectés</div>
                <button class="add-button" type="button" @click="addAllergen">+ Allergène</button>
              </div>
              <div class="block-content">
                <p class="mb-3 text-[12px] leading-relaxed text-[#1f1e20]/65">
                  Résultat indicatif: vérifiez toujours la liste complète des ingrédients avant de servir.
                </p>
                <div class="grid grid-cols-2 gap-x-6 gap-y-2">
                  <div
                    v-for="(allergen, i) in recipe.allergens"
                    :key="i"
                    class="editable-row"
                  >
                    <input
                      v-model="allergen.name"
                      class="editable-field allergen-name text-[13px]"
                      aria-label="Allergène détecté"
                    />
                    <button class="remove-button" type="button" aria-label="Retirer l’allergène" @click="removeAllergen(i)">×</button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>

          <div v-if="analysisStep === 3 && phase === 'analyzing'" class="analysis-block">
            <div class="block-label">Allergènes détectés</div>
            <div class="space-y-2">
              <div class="h-3 w-full rounded-md bg-white/10 shimmer-block"></div>
              <div class="h-3 w-2/3 rounded-md bg-white/10 shimmer-block"></div>
            </div>
          </div>

          <!-- ⑤ Tags -->
          <Transition name="fade-up">
            <div v-if="analysisStep >= 5" class="analysis-block">
              <div class="flex items-center justify-between mb-3">
                <div class="block-label !mb-0">Étiquettes</div>
                <button class="add-button" type="button" @click="addTag">+ Étiquette</button>
              </div>
              <div class="block-content flex flex-wrap gap-2">
                <span
                  v-for="(tag, i) in recipe.tags"
                  :key="i"
                  class="tag-chip"
                  :style="{ animationDelay: `${i * 70}ms` }"
                >
                  <input
                    v-model="recipe.tags[i]"
                    class="tag-input"
                    aria-label="Étiquette"
                  />
                  <button class="tag-remove-button" type="button" aria-label="Retirer l’étiquette" @click="removeTag(i)">×</button>
                </span>
              </div>
            </div>
          </Transition>

          <div v-if="analysisStep === 4 && phase === 'analyzing'" class="analysis-block">
            <div class="block-label">Étiquettes</div>
            <div class="flex flex-wrap gap-2">
              <div v-for="n in 6" :key="n" class="h-6 w-20 rounded-full bg-white/10 shimmer-block"></div>
            </div>
          </div>

          <!-- ⑥ Preparation steps -->
          <Transition name="fade-up">
            <div v-if="analysisStep >= 6" class="analysis-block">
              <div class="flex items-center justify-between mb-3">
                <div class="block-label !mb-0">Étapes</div>
                <button class="add-button" type="button" @click="addStep">+ Étape</button>
              </div>
              <div class="block-content space-y-3">
                <div
                  v-for="(step, i) in recipe.steps"
                  :key="i"
                  class="step-row"
                  draggable="true"
                  @dragstart="handleStepDragStart(i)"
                  @dragover.prevent
                  @drop="handleStepDrop(i)"
                  @dragend="draggedStepIndex = null"
                >
                  <div class="drag-handle" title="Glisser pour réordonner">⋮⋮</div>
                  <div class="w-5 h-5 shrink-0 rounded-full bg-[#f0ffa8] border-2 border-[#1f1e20] flex items-center justify-center mt-1">
                    <span class="text-[10px] font-semibold text-[#1f1e20]">{{ i + 1 }}</span>
                  </div>
                  <textarea
                    v-model="recipe.steps[i]"
                    class="editable-field min-h-[58px] resize-none text-[13px] leading-relaxed"
                    aria-label="Étape de préparation"
                  ></textarea>
                  <button class="remove-button self-start mt-1" type="button" aria-label="Retirer l’étape" @click="removeStep(i)">×</button>
                </div>
              </div>
            </div>
          </Transition>

          <div v-if="analysisStep === 5 && phase === 'analyzing'" class="analysis-block">
            <div class="block-label">Étapes</div>
            <div class="space-y-3">
              <div v-for="n in 3" :key="n" class="flex gap-3 items-center">
                <div class="w-5 h-5 shrink-0 rounded-full bg-white/10"></div>
                <div class="h-3 flex-1 rounded-md bg-white/10 shimmer-block"></div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- RIGHT — Post preview ─────────────────────────────────────────────── -->
      <section class="w-[300px] shrink-0 border-l-2 border-[#1f1e20] flex flex-col bg-[#c24e00]">
        <div class="px-8 pt-8 pb-5">
          <p class="title-font text-[11px] font-semibold uppercase tracking-widest text-white">Aperçu</p>
        </div>

        <!-- Empty state -->
        <div v-if="phase !== 'complete'" class="flex-1 flex flex-col items-center justify-start px-6 gap-3">
          <div class="w-full h-[240px] max-h-[240px] rounded-lg border-2 border-dashed border-[#1f1e20] bg-[#f1d1ea] flex items-center justify-center">
            <svg class="w-7 h-7 text-[#1f1e20]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21l6.75-6.75 1.5 1.5"/>
            </svg>
          </div>
          <p class="text-[12px] text-white text-center">L aperçu de la recette apparaîtra ici une fois l analyse terminée</p>
        </div>

        <!-- Recipe card (complete state) -->
        <Transition name="slide-in">
          <div v-if="phase === 'complete'" class="px-4 flex flex-col gap-4 pb-6">

            <!-- Card -->
            <div class="rounded-lg overflow-hidden border-2 border-[#1f1e20] bg-white shadow-[6px_6px_0_#f1d1ea]">

              <!-- Image thumb -->
              <div class="relative h-[160px] overflow-hidden border-b-2 border-[#1f1e20] bg-[#f1d1ea]">
                <img
                  v-if="currentImageSrc"
                  :src="currentImageSrc"
                  class="w-full h-full object-cover"
                  alt="Recette"
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
                <div v-if="savedState" class="absolute top-2.5 right-2.5 flex items-center gap-1.5 bg-[#f0ffa8] backdrop-blur-sm rounded-md px-2 py-1 border border-[#1f1e20]">
                  <svg class="w-3 h-3 text-[#1f1e20]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                  </svg>
                  <span class="text-[10px] text-[#1f1e20] font-medium">Enregistré</span>
                </div>
              </div>

              <!-- Card body -->
              <div class="p-4 space-y-3">
                <!-- Author -->
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-full bg-[#f1d1ea] flex items-center justify-center">
                    <span class="text-[9px] font-semibold text-[#1f1e20]">{{ recipe.initials }}</span>
                  </div>
                  <span class="text-[12px] text-[#1f1e20]/70">{{ recipe.author }}</span>
                  <span class="text-[#f1d1ea] text-xs ml-auto">À l’instant</span>
                </div>

                <!-- Title -->
                <h3 class="title-font text-[14px] font-semibold text-[#1f1e20] leading-snug">{{ recipe.title }}</h3>

                <!-- Description -->
                <p class="text-[12px] text-[#1f1e20]/70 leading-relaxed line-clamp-2">{{ recipe.description }}</p>

                <!-- Tags -->
                <div class="flex flex-wrap gap-1.5">
                  <span
                    v-for="tag in recipe.tags.slice(0, 4)"
                    :key="tag"
                    class="text-[10px] px-2 py-0.5 rounded-full bg-[#f1d1ea] text-[#1f1e20] border border-[#f1d1ea]"
                  >
                    {{ tag }}
                  </span>
                  <span v-if="recipe.tags.length > 4" class="text-[10px] px-2 py-0.5 rounded-full bg-[#f0ffa8] text-[#1f1e20] border border-[#1f1e20]">
                    +{{ recipe.tags.length - 4 }}
                  </span>
                </div>

                <!-- Stats -->
                <div class="flex items-center gap-3 pt-1 border-t border-[#1f1e20]/15">
                  <div class="flex items-center gap-1">
                    <svg class="w-3.5 h-3.5 text-[#f0ffa8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span class="text-[11px] text-[#1f1e20]/65">{{ recipe.time }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <svg class="w-3.5 h-3.5 text-[#f0ffa8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
                    </svg>
                    <span class="text-[11px] text-[#1f1e20]/65">{{ recipe.servings }} {{ recipe.servings > 1 ? 'portions' : 'portion' }}</span>
                  </div>
                  <span class="text-[11px] text-[#1f1e20]/65 ml-auto">{{ recipe.calories }}</span>
                </div>
              </div>
            </div>

            <!-- Save / published action -->
            <div v-if="!savedState">
              <button
                class="w-full py-3 rounded-lg border-2 border-[#1f1e20] bg-[#f0ffa8] hover:bg-[#f1d1ea] text-[#1f1e20] text-[13px] font-semibold transition-colors duration-150"
                @click="saveRecipe"
              >
                Enregistrer dans mes recettes
              </button>
            </div>

            <div v-else class="flex items-center gap-2.5 px-4 py-3 rounded-lg bg-[#f0ffa8] border-2 border-[#1f1e20]">
              <svg class="w-4 h-4 text-[#1f1e20] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <div>
                <p class="text-[13px] font-medium text-[#1f1e20]">Publié dans vos recettes</p>
                <p class="text-[11px] text-[#1f1e20]/70">Visible dans votre collection</p>
              </div>
            </div>

          </div>
        </Transition>
      </section>
      </div>
    </main>

    <footer class="mx-auto mb-4 flex items-center gap-3 rounded-lg border-2 border-[#1f1e20] bg-white/95 px-4 py-2 text-[11px] text-[#1f1e20] shadow-[3px_3px_0_#f0ffa8] backdrop-blur">
      <span class="title-font text-[#c24e00]">IA assistive</span>
      <span class="h-1.5 w-1.5 rounded-full bg-[#c24e00]"></span>
      <span>Vérifiez ingrédients et allergènes</span>
      <span class="hidden sm:inline">Confidentialité</span>
      <span class="hidden sm:inline">Conditions</span>
    </footer>
  </div>
</template>

<style scoped>
@font-face {
  font-family: 'Apfel Grotezk Fett';
  src: url('/fonts/ApfelGrotezk-Fett.woff2') format('woff2');
  font-weight: 800;
  font-style: normal;
  font-display: swap;
}

.title-font,
.block-label,
button {
  font-family: 'Apfel Grotezk Fett', ui-sans-serif, system-ui, sans-serif;
}

.menu-pill {
  border-radius: 5px;
  color: #1f1e20;
  font-family: 'Apfel Grotezk Fett', ui-sans-serif, system-ui, sans-serif;
  font-size: 11px;
  padding: 5px 11px;
  transition: background-color 140ms ease, color 140ms ease;
}

.menu-pill:hover,
.menu-pill-active {
  background-color: #c24e00;
  color: #ffffff;
}

.profile-menu {
  transition: background-color 140ms ease, transform 140ms ease;
}

.profile-menu:hover {
  background-color: #f1d1ea;
  transform: translateY(-1px);
}

/* Analysis blocks */
.analysis-block {
  padding: 16px;
  border-radius: 8px;
  background-color: #ffffff;
  border: 2px solid #1f1e20;
  box-shadow: 6px 6px 0 #f0ffa8;
}

.block-label {
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #c24e00;
  margin-bottom: 12px;
}

.block-content {
  /* inherits */
}

.editable-field {
  width: 100%;
  border-radius: 8px;
  border: 2px solid transparent;
  background-color: #f1d1ea;
  color: #1f1e20;
  outline: none;
  padding: 8px 10px;
  transition: border-color 150ms ease, background-color 150ms ease, box-shadow 150ms ease;
}

.editable-field:hover {
  border-color: #1f1e20;
}

.editable-field:focus {
  border-color: #1f1e20;
  background-color: #ffffff;
  box-shadow: 4px 4px 0 #f0ffa8;
}

.mini-edit-card {
  display: flex;
  min-height: 48px;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  border-radius: 8px;
  border: 2px solid #1f1e20;
  background-color: #f0ffa8;
  padding: 8px 10px;
}

.mini-edit-label {
  font-family: 'ApfelGrotezk Fett', ui-sans-serif, system-ui, sans-serif;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  color: #c24e00;
}

.mini-edit-input {
  width: 100%;
  border: 0;
  background: transparent;
  color: #1f1e20;
  font-size: 14px;
  font-weight: 800;
  outline: none;
}

.mini-edit-input:focus {
  color: #c24e00;
}

.servings-stepper {
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr) 36px;
  align-items: center;
  gap: 8px;
}

.servings-button {
  height: 36px;
  border-radius: 8px;
  border: 2px solid #1f1e20;
  background-color: #f0ffa8;
  color: #1f1e20;
  font-size: 18px;
  font-weight: 800;
  line-height: 1;
  transition: transform 120ms ease, background-color 120ms ease, color 120ms ease;
}

.servings-button:hover {
  transform: translate(-1px, -1px);
  background-color: #c24e00;
  color: #ffffff;
}

.servings-input {
  width: 100%;
  min-width: 0;
  border-radius: 8px;
  border: 2px solid transparent;
  background-color: #f1d1ea;
  color: #1f1e20;
  font-size: 14px;
  font-weight: 800;
  text-align: center;
  outline: none;
  padding: 8px 10px;
  -moz-appearance: textfield;
}

.servings-input::-webkit-outer-spin-button,
.servings-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.servings-input:hover,
.servings-input:focus {
  border-color: #1f1e20;
  background-color: #ffffff;
  box-shadow: 4px 4px 0 #f0ffa8;
}

.editable-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ingredient-name {
  max-width: 58%;
}

.ingredient-amount {
  max-width: 30%;
  color: #c24e00;
  font-weight: 700;
}

.allergen-name {
  flex: 1;
  max-width: none;
}

.add-button,
.remove-button,
.tag-remove-button {
  border: 2px solid #1f1e20;
  font-weight: 800;
  transition: transform 120ms ease, background-color 120ms ease, color 120ms ease;
}

.add-button {
  border-radius: 9999px;
  background-color: #f0ffa8;
  color: #1f1e20;
  font-size: 12px;
  padding: 5px 10px;
}

.remove-button,
.tag-remove-button {
  width: 28px;
  height: 28px;
  flex: 0 0 28px;
  border-radius: 9999px;
  background-color: #ffffff;
  color: #c24e00;
  line-height: 1;
}

.tag-remove-button {
  width: 22px;
  height: 22px;
  flex-basis: 22px;
}

.add-button:hover,
.remove-button:hover,
.tag-remove-button:hover {
  transform: translate(-1px, -1px);
  background-color: #c24e00;
  color: #ffffff;
}

.step-row {
  display: flex;
  gap: 12px;
  border-radius: 8px;
  cursor: grab;
}

.step-row:active {
  cursor: grabbing;
}

.drag-handle {
  color: #c24e00;
  font-size: 18px;
  font-weight: 900;
  line-height: 1.2;
  padding-top: 9px;
  user-select: none;
}

/* Tag chips */
.tag-chip {
  align-items: center;
  display: inline-flex;
  gap: 5px;
  padding: 3px 5px 3px 8px;
  border-radius: 9999px;
  border: 2px solid #1f1e20;
  background-color: #f1d1ea;
  color: #1f1e20;
}

.tag-input {
  width: 96px;
  border: 0;
  background: transparent;
  color: #1f1e20;
  font-size: 12px;
  font-weight: 600;
  outline: none;
}

.tag-input:focus {
  color: #c24e00;
}

/* Shimmer skeleton */
.shimmer-block {
  background: linear-gradient(90deg, #ffffff 25%, #f0ffa8 50%, #ffffff 75%);
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite;
}

.rounded-xl,
.rounded-2xl {
  border-radius: 8px;
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
