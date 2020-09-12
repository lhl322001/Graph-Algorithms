import Heap from "./heap.js"

function dijkstra(graph, start) {
    let n = graph.vertexes.length;
    let distance = new Array(n);
    let pre = new Array(n);
    let done = new Array(n);
    for (let i = 0; i < n; i++) {
        distance[i] = Infinity;
    }
    distance[start] = 0;
    pre[start] = start;
    let pq = new Heap([], function (a, b) {
        return a.dist > b.dist;
    });
    pq.push({
        index: start,
        dist: 0
    })
    while (!pq.empty()) {
        let u = pq.top();
        pq.pop();
        if (done[u.index]) {
            continue;
        }
        console.log(u.index + "miao");
        done[u.index] = true;
        //console.log(graph.adjacencyList[u.index]);
        graph.adjacencyList[u.index].forEach(edge => {
            if (distance[edge.to] > distance[edge.from] + edge.dist) {
                distance[edge.to] = distance[edge.from] + edge.dist;
                pq.push({
                    index: edge.to,
                    dist: distance[edge.to]
                });
                pre[edge.to] = {
                    index: edge.index,
                    from: edge.from
                };
            }
        });
    }
    console.log(distance);
    return {
        distance: distance,
        pre: pre
    };
}

export default dijkstra;