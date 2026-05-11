<template>
  <v-app>
    <v-main class="bg-gradient">
      <v-container class="fill-height">
        <v-row justify="center" align="center">
          <v-col cols="12">
            <slot />
            <router-view />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
}

.bg-gradient {
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%) !important;
}

.glass-card {
  background: rgba(255, 255, 255, 0.05) !important;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px !important;
  color: white !important;
}

.gradient-text {
  background: linear-gradient(to right, #818cf8, #c084fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
