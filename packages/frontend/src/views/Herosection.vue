<script scoped lang="ts">

</script>

<template>
  <section class="hero-section">
    <!-- Grid background -->
    <div class="hero-grid" />

    <!-- Scan line overlay -->
    <div class="hero-scanline" />

    <v-container class="hero-container">
      <div class="hero-content">

        <p class="hero-eyebrow">// curitiba — 041</p>

        <h1 class="hero-title">
          O pulso tech de<br />
          Curitiba em um<br />
          <span class="hero-gradient">só lugar.</span>
        </h1>

        <p class="hero-sub">
          Descubra, divulgue e participe dos eventos da comunidade
          tech da capital paranaense.
        </p>

      </div>
    </v-container>
  </section>
</template>

<style scoped>
/* ── Layout ───────────────────────────────────────── */
.hero-section {
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid rgba(var(--v-theme-outline), 0.5);
  padding: 80px 0;
  background-color: rgb(var(--v-theme-background));
}

@media (min-width: 768px)  { .hero-section { padding: 112px 0; } }

/* ── Grid background ──────────────────────────────── */
.hero-grid {
  pointer-events: none;
  position: absolute;
  inset: 0;
  opacity: 0.035;
  background-image:
    linear-gradient(hsl(185 80% 55% / 0.3) 1px, transparent 1px),
    linear-gradient(90deg, hsl(185 80% 55% / 0.3) 1px, transparent 1px);
  background-size: 60px 60px;
}

/* ── Scanline ─────────────────────────────────────── */
.hero-scanline {
  pointer-events: none;
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(var(--v-theme-on-background), 0.015) 2px,
    rgba(var(--v-theme-on-background), 0.015) 4px
  );
}

/* ── Content ──────────────────────────────────────── */
.hero-container {
  position: relative;
  z-index: 1;
}

.hero-content {
  max-width: 760px;
  animation: heroFadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes heroFadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Eyebrow ──────────────────────────────────────── */
.hero-eyebrow {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgb(var(--v-theme-primary));
  margin-bottom: 16px;
}

/* ── Title ────────────────────────────────────────── */
.hero-title {
  font-size: clamp(2.2rem, 6vw, 4.5rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.03em;
  color: rgb(var(--v-theme-on-background));
  margin-bottom: 24px;
}

/* ── Gradient span ────────────────────────────────── */
.hero-gradient {
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary)),
    rgb(var(--v-theme-secondary))
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ── Subtitle ─────────────────────────────────────── */
.hero-sub {
  max-width: 480px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.82rem;
  line-height: 1.75;
  color: rgb(var(--v-theme-medium));
}

@media (min-width: 768px) {
  .hero-sub { font-size: 0.9rem; }
}
</style>