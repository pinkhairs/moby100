<template>
  <div class="section">
    <header class="container has-text-centered">
      <p>🐋</p>
      <h1>Moby Dick.</h1>
      <h2>Top 100 Words.</h2>
    </header>
    <div v-if="loading">Loading...</div>
    <div v-else class="container">
      <ol>
        <li :key="i" v-for="(entry, i) in topWords">
          <span class="word">{{ entry.word }}</span>
          <span class="count">{{ entry.count }}</span>
        </li>
      </ol>
    </div>
  </div>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
      topWords: [],
      loading: true
    }
  },
  mounted() {
    fetch("http://localhost:3001/api/words")
    .then(response => response.json())
    .then(words => {
      for (let word of words) {
        this.topWords.push(word);
      }
      this.loading = false;
    })
  }
}
</script>

<style lang="scss" scoped>
ol {
  list-style: none;
  padding-left: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1em;
}
</style>
