<template>
  <NuxtPage />
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html, body {
  font-family: 'Inter', system-ui, sans-serif;
  background: #f1ece6;
  color: #2e2b28;
  height: 100%;
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
}

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #cad2e3; border-radius: 2px; }
::-webkit-scrollbar-thumb:hover { background: #a8b4cc; }
</style>
