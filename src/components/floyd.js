function floyd(graph) {
    console.log("here");

    let n = graph.vertexes.length;
    let G = new Array(n);
    for (let i = 0; i < n; i++) {
        G[i] = new Array(n);
        for (let j = 0; j < n; j++) {
            G[i][j] = Infinity;
        }
        G[i][i] = 0;
    }

    graph.edges.forEach((edge) => {
        G[edge.from][edge.to] = G[edge.to][edge.from] = edge.dist;
    });

    for (let k = 0; k < n; k++) {
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                G[i][j] = Math.min(G[i][j], G[i][k] + G[k][j]);
            }
        }
    }
    console.log(G);
    return G;
}

export default floyd;