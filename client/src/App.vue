<template>
  <div>
    <header class="page-header">
      <p>🐋</p>
      <h1>Moby Dick.</h1>
    </header>
    <table class="top-words">
      <caption>Top 100 Words</caption>
      <thead>
        <tr>
          <th></th>
          <th>Word</th>
          <th>Instances</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>100</td>
          <td>whale</td>
          <td>100</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

export default {
  name: 'App'
}
</script>

<style lang="scss" scoped>
.page-header {
  text-align: center;
}
.top-words {
  width: 100%;
  border-color: #E1E1E1;
  border-style: solid;
  border-width: 1px 1px 0 1px;
  width: 50%;
  margin: 0 auto;
}
th,
td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #E1E1E1; }
th:first-child,
td:first-child {
  padding-left: 0; }
th:last-child,
td:last-child {
  padding-right: 0; }
</style>
