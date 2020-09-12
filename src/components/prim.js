import Heap from "./heap.js"

function prim(graph) {
    let sequence = [];

    let n = graph.vertexes.length;
    if (n == 0) {
        return sequence;
    }

    console.log(graph)

    let visited = new Array(n);

    sequence.push({ type: "lock", indexes: [0] });
    visited[0] = true;

    let pq = new Heap([], function (edgeA, edgeB) {
        return edgeA.dist > edgeB.dist;
    });

    graph.adjacencyList[0].forEach(edge => {
        pq.push(edge);
    });

    let cnt = 0;
    let sum = 0;

    while (!pq.empty()) {
        let e = pq.top();
        pq.pop();
        if (visited[e.to]) {
            continue;
        }
        visited[e.to] = true;
        sequence.push({ type: "selectEdge", index: e.index });

        sum += e.dist;
        console.log(sum, e.dist);
        if (++cnt == graph.vertexes.length) {
            return sequence;
        }

        graph.adjacencyList[e.to].forEach(edge => {
            pq.push(edge);
        });
    }

    return sequence;
}

export default prim;