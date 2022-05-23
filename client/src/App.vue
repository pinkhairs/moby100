<template>
  <div class="page">
    <div class="mobile-bg"></div>
    <header class="page-header">
      <h1>Moby Dick: Top 100 Words.</h1>
    </header>
    <p v-if="loading" class="loading">Loading, ye...</p>
    <div v-else>
      <ol class="words-list">
        <li :key="i" v-for="(entry, i) in words" :style="{ backgroundImage: 'url('+bgUrl+')' }">
          <span class="number">{{ entry.number }}</span>
          <span :style="{fontSize: getFontSize(i)}" class="word">{{ entry.name }}</span>
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
      words: [],
      loading: true,
      bgUrl: ''
    }
  },
  mounted() {
    this.getWords();
    let image;

    for (let i = 0; i < 27; i++) {
      image = new Image();
      image.src = require('./assets/bg/frame_'+i.toString().padStart(3, '0').toString()+'.jpg');
    }

    if (window.innerWidth > 768) this.bgUrl = require('./assets/bg/frame_000.jpg');

    window.onscroll = () => {
      if (window.innerWidth < 768) return;
      var windowHeight = document.body.offsetHeight - window.innerHeight;
      var scrollPosition = window.scrollY;
      var frameSpacing = Math.round(windowHeight / 27);
      var currentFrame = Math.round(scrollPosition / frameSpacing);
      var frameNumber = currentFrame.toString().padStart(3, '0').toString();
      this.bgUrl = require('./assets/bg/frame_'+frameNumber+'.jpg');
    }
  },
  methods: {
    getWords() {
      fetch('./api/words').
      then(response => response.json()).then((result) => {
        result.forEach((word, index) => {
          this.words.push({ name: word.name, number: word.number| 100 - index, count: word.count});
        })
        this.loading = false;
      })
    },
    getFontSize(index) {
      var fontSize = (124 - index) / 2;
      if (index === 0) return fontSize * 1.25 + 'px';
      return fontSize + 'px';
    }
  }
}
</script>

<style lang="scss">
html, body {
  margin: 0;
  padding: 0;
}
body {
  background: #111;
  font-family: Georgia, serif;
  @media (max-width: 768px) {
    &:before {
      content: "";
      display: block;
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -10;
      background: url(./assets/mobile-bg.jpg) no-repeat center center;
      -webkit-background-size: cover;
      -moz-background-size: cover;
      -o-background-size: cover;
      background-size: cover;
    }
  }
}
.page-header {
  font-family: Arial, sans-serif;
  align-items: center;
  justify-content: space-between;
  padding: 1em;
  text-align: center;
  color: #fff;
}
.loading {
  text-align: center;
  color: #fff;
}
h1 {
  font-size: 4rem;
  line-break: 1.5;
}
.words-list {
  list-style: none;
  padding-left: 0;
  display: grid;
  padding: 0 1em 1em;
  color: #fff;
  gap: 1em;
  @media (min-width: 1024px) and (max-width: 1279px) {
    display: grid;
    grid-template-columns: 4fr 3fr 2fr 1fr;
    grid-template-rows: 3fr 3fr 2fr 2fr repeat(16, 1fr);
  }
  @media (min-width: 1280px) {
    display: grid;
    grid-template-columns: 5fr 4fr 3fr 2fr 1fr;
    grid-template-rows: 3fr 3fr 2fr 2fr repeat(16, 1fr);
  }
}
li {
  transition: background-image 1s;
  background-attachment: fixed;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 1em;
  padding: 1em;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80px;
    background-size: cover;
  @media (max-width: 768px) {
    height: 100px;
    background-image: none;
    background: none;
  }
  &:before {
    background: rgba(0, 0, 0, .5);
    z-index: 3;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    content: '';
    display: block;
    border-radius: 1em;
  }
}
.word {
  position: relative;
  z-index: 5;
  font-weight: 500;
}
.count, .number {
  z-index: 5;
  position: absolute;
  font-size: 14px;
  color: #ccc;
}
.count {
  bottom: 1em;
  right: 1em;
  font-style: italic;
  &:after {
    content: 'x';
  }
}
.number {
  top: 1em;
  left: 1em;
  &:before {
    content: '#';
  }
}
</style>
