<template>
  <div class="faq-view">
    <div class="header">
      <h1>Frequently Asked Questions</h1>
      <p>Everything you need to know about Songs</p>
    </div>

    <div class="faq-list">
      <details v-for="(item, idx) in faqs" :key="idx" class="faq-item">
        <summary>
          <span>{{ item.question }}</span>
          <span class="chevron">›</span>
        </summary>
        <p>{{ item.answer }}</p>
      </details>
    </div>
  </div>
</template>

<script setup>
const faqs = [
  {
    question: 'What is Songs?',
    answer: 'Songs is a web app for learning languages through music. Listen to your favorite tracks while filling in the missing words from their lyrics.',
  },
  {
    question: 'Do I need to register?',
    answer: 'No registration is required to use the app, but signed-in users have their progress saved automatically.',
  },
  {
    question: 'How does the karaoke mode work?',
    answer: 'Songs play with synchronized lyrics. Some words are hidden — type them correctly and the playback continues without pauses.',
  },
  {
    question: "What if I don't know a word?",
    answer: 'Press the "Skip" button to skip it. It counts as a miss but lets you continue with the song.',
  },
  {
    question: 'How are scores calculated?',
    answer: 'Each correct word counts as a hit. Each incorrect attempt or skip counts as a miss. The summary appears as you play.',
  },
]
</script>

<style scoped>
.faq-view {
  max-width: 720px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.header h1 {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.5px;
  margin-bottom: 0.5rem;
}

.header p {
  color: var(--text-secondary);
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.faq-item {
  background-color: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: border-color 0.2s;
}

.faq-item:hover,
.faq-item[open] {
  border-color: var(--border-strong);
}

.faq-item summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.1rem 1.4rem;
  font-weight: 600;
  cursor: pointer;
  list-style: none;
  color: var(--text-primary);
  user-select: none;
}

.faq-item summary::-webkit-details-marker {
  display: none;
}

.chevron {
  color: var(--accent);
  font-size: 1.5rem;
  transition: transform 0.2s;
  font-weight: 700;
}

.faq-item[open] .chevron {
  transform: rotate(90deg);
}

.faq-item p {
  padding: 0 1.4rem 1.2rem;
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.7;
}
</style>