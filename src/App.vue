<template>
  <div id="app">
    <graph-view :graph="graph"></graph-view>
  </div>
</template>

<script>
import Graph from "./components/graph.js";
import GraphView from "./components/GraphView.vue";

export default {
  name: "app",
  components: {
    GraphView,
  },
  data: function () {
    let vertexes = [
      {
        x: 200,
        y: 100,
      },
      {
        x: 150,
        y: 150,
      },
      {
        x: 250,
        y: 150,
      },
      {
        x: 150,
        y: 250,
      },
      {
        x: 250,
        y: 250,
      },
      {
        x: 200,
        y: 300,
      },
    ];
    let edges = [
      {
        from: 0,
        to: 1,
        dist: 1,
      },
      {
        from: 0,
        to: 2,
        dist: 5,
      },
      {
        from: 1,
        to: 3,
        dist: 2,
      },
      {
        from: 3,
        to: 5,
        dist: 7,
      },
      {
        from: 0,
        to: 4,
        dist: 5,
      },
      {
        from: 3,
        to: 4,
        dist: 1,
      },
      {
        from: 2,
        to: 5,
        dist: 3,
      },
      {
        from: 1,
        to: 2,
        dist: 4,
      },
      {
        from: 0,
        to: 5,
        dist: 3,
      },
      {
        from: 2,
        to: 3,
        dist: 4,
      },
      {
        from: 4,
        to: 5,
        dist: 2,
      },
      {
        from: 1,
        to: 4,
        dist: 7,
      },
    ];
    return {
      graph: new Graph(vertexes, edges),
    };
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
