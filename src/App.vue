<template>
  <!-- <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav> -->
  <router-view/>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,400;1,700&display=swap');
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

* {
  font-family: "Source Sans Pro",sans-serif;;
}

.page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 80vw;
  margin: auto;

  @media screen and (max-width: 576px) {
    width: 95vw;
  }
}

</style>
