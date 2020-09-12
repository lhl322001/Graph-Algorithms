<template>
  <div>
    <el-container >
      <el-header>
        <el-button type="primary" round @click="showKruskal()">Kruskal</el-button>
        <el-button type="primary" round @click="showPrim()">Prim</el-button>
        <el-button type="primary" round @click="reset()">Reset</el-button>&nbsp;&nbsp;
        <el-popover placement="bottom" width="400" trigger="click">
          <div class="adjList" v-for="(node,index) in graph.adjacencyList" :key="index">
            <div style="display:inline-block">{{ index }}</div>
            <div
              class="adjSubNode"
              v-for="(edge,edgeIndex) in node"
              :key="index+'_'+edgeIndex"
            >{{ edge.to }}</div>
          </div>
          <el-button type="primary" round slot="reference">邻接表</el-button>
        </el-popover>&nbsp;&nbsp;
        <el-button type="primary" round @click="showDijkstra()">Dijkstra</el-button>
        <el-button type="primary" round @click="showFloyd()">Floyd</el-button>
        <el-select v-model="dijStart">
          <el-option
            v-for="(node,index) in graph.vertexes"
            :key="index"
            :label="index"
            :value="index"
          >{{index}}</el-option>
        </el-select>
      </el-header>
    </el-container>
    <el-container style="height:500px">
      <el-aside style="border: 1px solid #eee">
        <div style="position:absolute;top:120px;left:10px">
          <div
            class="edge"
            v-for="(edge,index) in edgesDisp"
            :key="index"
            v-bind:style="{
          width: edge.width,
          transform: edge.transform,
          top: edge.top,
          left: edge.left,
          borderTopColor: edge.color
        }"
          ></div>
        </div>
        <div style="position:absolute;top:120px;left:10px">
          <div
            class="vertex"
            v-for="(vertex,index) in vertexesDisp"
            :key="index"
            v-bind:style="{left:vertex.left,top:vertex.top,backgroundColor:vertex.color}"
          ><div style="position:absolute;top:7px;left:10px">{{ vertex.index }}</div></div>
        </div>
      </el-aside>

      <el-main style="border: 1px solid #eee">
        <el-table
          v-if="!shortestPathFinished"
          :data="graph.edges"
          style="width: 100%"
          :row-class-name="tableRowClassName"
        >
          <el-table-column label="from" prop="from"></el-table-column>
          <el-table-column label="to" prop="to"></el-table-column>
          <el-table-column label="dist" prop="dist"></el-table-column>
        </el-table>
        <el-table v-if="shortestPathFinished" :data="shortestPathData" style="width: 100%">
          <el-table-column label="起点\终点" prop="from"></el-table-column>

          <el-table-column v-for="(item,index) in vertexes" :key="index" :label="''+index">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="showPath(scope.$index,index)"
              >{{ scope.row.dist[index] }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import kruksal from "./kruskal.js";
import prim from "./prim.js";
import dijkstra from "./dijkstra.js";
import floyd from "./floyd.js";

export default {
  name: "GraphView",
  props: {
    graph: Object,
  },
  computed: {
    vertexesDisp: function () {
      const activeVertexColor = "aliceblue";
      const normalVertexColor = "#b1c1d1";
      const lockVertexColor = "#66b1ff";

      let vertexesDisp = [];
      //console.log(this.vertexes.length);
      for (let i = 0; i < this.vertexes.length; i++) {
        let element = this.vertexes[i];
        vertexesDisp.push({
          index: i,
          left: element.x + "px",
          top: element.y + "px",
          color: element.isActive
            ? activeVertexColor
            : element.isLocked
            ? lockVertexColor
            : normalVertexColor,
        });
      }
      return vertexesDisp;
    },
    edgesDisp: function () {
      let edgesDisp = [];
      this.edges.forEach((edge) => {
        let u = this.graph.vertexes[edge.from];
        let v = this.graph.vertexes[edge.to];

        let dist = Math.sqrt(
          (u.x - v.x) * (u.x - v.x) + (u.y - v.y) * (u.y - v.y)
        );
        let angle = Math.atan2(v.y - u.y, v.x - u.x);
        const selectedEdgeColor = "#000";
        const activeEdgeColor = "blue";
        const normalEdgeColor = "darkgray";
        edgesDisp.push({
          width: dist + "px",
          transform: "rotate(" + angle + "rad)",
          left: u.x + "px",
          top: u.y + "px",
          color: edge.isSelected
            ? selectedEdgeColor
            : edge.isActive
            ? activeEdgeColor
            : normalEdgeColor,
        });
      });
      return edgesDisp;
    }
  },
  created() {
    this.reset();
  },
  methods: {
    tableRowClassName({rowIndex}) {
      if(typeof this.edges === 'undefined' || typeof rowIndex === 'undefined' || rowIndex >= this.edges.length) {
        return "";
      }
      if (this.edges[rowIndex].isActive) {
        return "active-row";
      }
      if (this.edges[rowIndex].isSelected) {
        return "success-row";
      }
      return "";
    },
    resetGraph() {
      this.vertexes = [];
      this.edges = [];
      this.graph.vertexes.forEach((element) => {
        this.vertexes.push({
          x: element.x,
          y: element.y,
          isActive: false,
          isLocked: false,
        });
      });
      this.graph.edges.forEach((element) => {
        this.edges.push({
          from: element.from,
          to: element.to,
          dist: element.dist,
          isActive: false,
          isSelected: false,
        });
      });
      if (this.animationHandle !== null) {
        clearInterval(this.animationHandle);
        this.animationHandle = null;
      }
      this.stepNum = 0;
    },
    reset() {
      this.resetGraph();
      this.shortestPathFinished = false;
    },
    showKruskal() {
      this.reset();
      this.operations = kruksal(this.graph);
      console.log(this.operations);
      this.animationHandle = setInterval(this.animationStep, 500);
    },
    showPrim() {
      this.reset();
      this.operations = prim(this.graph);
      console.log(this.operations);
      this.animationHandle = setInterval(this.animationStep, 500);
    },
    showDijkstra() {
      this.reset();
      this.shortestPathData = this.dijToTable(
        dijkstra(this.graph, this.dijStart),
        this.dijStart
      );
      this.shortestPathFinished = true;
    },
    showFloyd() {
      this.reset();
      this.shortestPathData = this.floydToTable(floyd(this.graph));
      this.shortestPathFinished = true;
    },
    showPath(u, v) {
      this.resetGraph();
      let res = dijkstra(this.graph, u);
      if (res.distance[v] === Infinity) {
        this.$message({
          type: "warn",
          message: "路径不存在！",
        });
        return;
      }
      let x = v;
      while (x != u) {
        this.vertexes[x].isLocked = true;
        this.edges[res.pre[x].index].isSelected = true;
        x = res.pre[x].from;
      }
      this.vertexes[u].isLocked = true;
    },
    dijToTable(res, dijStart) {
      let table = new Array(1);
      table[0] = {
        from: dijStart,
        dist: new Array(this.vertexes.length),
      };
      for (let i = 0; i < table[0].dist.length; i++) {
        table[0].dist[i] = res.distance[i];
      }
      return table;
    },
    floydToTable(res) {
      let table = new Array(this.vertexes.length);

      for (let i = 0; i < table.length; i++) {
        table[i] = {
          from: i,
          dist: new Array(this.vertexes.length),
        };
      }
      for (let i = 0; i < table.length; i++) {
        for (let j = 0; j < table.length; j++) {
          table[i].dist[j] = res[i][j];
        }
      }
      return table;
    },
    animationStep() {
      if (this.stepNum >= this.operations.length) {
        clearInterval(this.animationHandle);
        this.animationHandle = null;
        return;
      }
      let curOpt = this.operations[this.stepNum];
      //console.log(curOpt);
      if (curOpt.type === "activate") {
        let u=this.edges[curOpt.index].from;
        let v=this.edges[curOpt.index].to;
        this.vertexes[u].isActive = true;
        this.vertexes[v].isActive = true;
        this.edges[curOpt.index].isActive = true;
      } else if (curOpt.type === "deactivate") {
        let u=this.edges[curOpt.index].from;
        let v=this.edges[curOpt.index].to;
        this.vertexes[u].isActive = false;
        this.vertexes[v].isActive = false;
        this.edges[curOpt.index].isActive = false;
      } else if (curOpt.type === "selectEdge") {
        let e = this.edges[curOpt.index];
        this.vertexes[e.from].isActive = false;
        this.vertexes[e.to].isActive = false;
        this.vertexes[e.from].isLocked = true;
        this.vertexes[e.to].isLocked = true;
        this.edges[curOpt.index].isActive = false;
        this.edges[curOpt.index].isSelected = true;
        //console.log(e.from, e.to);
        //console.log(this.edges[curOpt.index].isSelected);
      }
      this.stepNum++;
    },
  },
  data: function () {
    return {
      vertexes: [],
      edges: [],
      operations: [],
      stepNum: 0,
      animationHandle: null,
      dijStart: 0,
      shortestPathData: [],
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.vertex {
  position: absolute;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  color: #000;
  background-color: #42b983;
  transition: background-color 500ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform: translateX(-50%) translateY(-50%);
}

.edge {
  position: absolute;
  transform-origin: top left;
  border-top: 2px solid;
  transition: color 500ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.adjList {
  border-radius: 2px;
  text-align: center;
  background: aliceblue;
  margin: 2%;
}

.adjSubNode {
  display: inline-block;
  text-align: center;
  background: cyan;
  margin: 5% 2% 5% 2%;
  width: 20px;
  height: 20px;
}

.el-table .success-row {
  background: rgba(2, 238, 255, 0.404);
}

.el-table .active-row {
  background: rgba(253, 249, 2, 0.966);
}
</style>
