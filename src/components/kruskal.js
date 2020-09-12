function kruskal(graph) {
    let sequence = [];

    let n = graph.vertexes.length;
    let edges = graph.edges;
    edges.sort(function (a, b) {
        return a.dist - b.dist;
    })
    let par = new Array(n);
    for (let i = 0; i < n; i++) {
        par[i] = i;
    }
    function find(x) {
        return par[x] == x ? x : par[x] = find(par[x]);
    }

    let cnt = 0;
    for (let i = 0; i < edges.length; i++) {
        let edge = edges[i];
        sequence.push({ type: "activate", index: i });
        let u = find(edge.from);
        let v = find(edge.to);
        if (u != v) {
            sequence.push({ type: "selectEdge", index: i });
            par[u] = v;
            if (++cnt == n - 1) {
                return sequence;
            }
        }
        else {
            sequence.push({ type: "deactivate", index: i });
        }
    }

    return sequence;
}

export default kruskal;