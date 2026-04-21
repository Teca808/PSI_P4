<template>
  <div class="faq-view">
    <h1>Frequently Asked Questions</h1>

    <div class="faq-list">
      <details v-for="(item, idx) in faqs" :key="idx" class="faq-item">
        <summary>{{ item.question }}</summary>
        <p>{{ item.answer }}</p>
      </details>
    </div>
  </div>
</template>

<script setup>
const faqs = [
  {
    question: '¿Qué es Songs?',
    answer: 'Songs es una aplicación web para aprender idiomas a través de la música. Escucha canciones mientras completas los huecos de la letra.',
  },
  {
    question: '¿Necesito registrarme para usar la aplicación?',
    answer: 'No es obligatorio. Los usuarios anónimos pueden usar la plataforma, pero si te registras se guardará tu progreso e historial de canciones reproducidas.',
  },
  {
    question: '¿Cómo funciona el modo karaoke?',
    answer: 'La canción se reproduce mientras se muestran las letras sincronizadas. Algunas palabras están ocultas y debes escribirlas correctamente para que la reproducción continúe sin pausas.',
  },
  {
    question: '¿Qué ocurre si no sé una palabra?',
    answer: 'Puedes pulsar el botón "Skip" para saltarla. Cuenta como un fallo, pero te permite seguir con la canción.',
  },
  {
    question: '¿Cómo se cuentan los aciertos y fallos?',
    answer: 'Cada palabra correcta cuenta como un acierto. Cada palabra incorrecta tecleada o cada pulsación de "Skip" cuenta como un fallo. Al final de la canción se muestra el resumen.',
  },
]
</script>

<style scoped>
.faq-view {
  max-width: 700px;
  margin: 0 auto;
}

.faq-view h1 {
  font-weight: 400;
  margin-bottom: 2rem;
  text-align: center;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.faq-item {
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 1rem 1.25rem;
}

.faq-item summary {
  font-weight: 500;
  cursor: pointer;
  color: #333;
}

.faq-item summary:hover {
  color: #3b82f6;
}

.faq-item p {
  margin-top: 0.75rem;
  color: #555;
  font-size: 0.95rem;
}
</style>