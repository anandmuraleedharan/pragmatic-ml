import { Concept } from '../types';

export const GRAPH_CONCEPTS: Concept[] = [
  {
    id: 'pagerank',
    title: 'PageRank',
    subtitle: 'Iterative Random Walk Stationary Distribution for Graph Node Centrality',
    sectionId: 'graph-algorithms',
    sectionTitle: 'Graph & Network Algorithms',
    level: 'Core ML',
    tags: ['Graph Theory', 'Centrality', 'Markov Chains', 'Ranking', 'Search Engines'],
    llmAntiPattern: {
      scenario: 'Prompting an LLM with raw JSON graph edge lists to determine the top authoritative nodes in a 50,000-node network.',
      whyItFails: 'LLMs hallucinate link traversal, suffer quadratic attention cost ($O(N^2)$) on edge tokens, cannot compute eigenvalues, and produce non-deterministic rankings.',
      tcoComparison: {
        specialized: { latency: '12ms on CPU', costPerMillion: '$0.00', determinism: '100% Deterministic' },
        llmAlternative: { latency: '4,500ms', costPerMillion: '$18,000 (huge prompt context)', determinism: 'Nondeterministic Hallucinations' }
      }
    },
    intuition: {
      summary: 'PageRank models a "random surfer" navigating the web. A node is important if it is linked to by other important nodes.',
      keyPoints: [
        'A link from node A to node B represents a vote of confidence in B.',
        'Votes from highly ranked pages carry more mathematical weight.',
        'Out-links divide a page’s prestige evenly among its targets.',
        'A damping factor d (typically 0.85) simulates a surfer getting bored and jumping to a random page, preventing infinite loops in dead-ends (sinks).'
      ],
      detailedExplanation: 'Mathematically, PageRank calculates the principal eigenvector of the Google stochastic transition matrix. Over successive iterations (Power Iteration method), the probability distribution converges to a stationary state where the rank of each node matches its long-run probability of being visited.'
    },
    diagram: {
      type: 'mermaid',
      content: `graph LR
    A["Node A (High Rank)"] -->|d * PR(A) / 2| B["Node B"]
    A -->|d * PR(A) / 2| C["Node C"]
    B -->|d * PR(B)| C
    C -->|d * PR(C)| A
    RandomSurfer["(1 - d) / |V| Uniform Teleportation"] -.-> A
    RandomSurfer -.-> B
    RandomSurfer -.-> C
    style A fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#f8fafc
    style B fill:#1e293b,stroke:#818cf8,stroke-width:2px,color:#f8fafc
    style C fill:#1e293b,stroke:#34d399,stroke-width:2px,color:#f8fafc
    style RandomSurfer fill:#0f172a,stroke:#f59e0b,stroke-width:1px,stroke-dasharray: 5 5,color:#fbbf24`,
      caption: 'PageRank flow: Node importance spreads across directed edges, with uniform random teleportation resolving sink traps.'
    },
    mathematics: {
      coreFormula: 'PR(u) = \\frac{1 - d}{|V|} + d \\sum_{v \\in B_u} \\frac{PR(v)}{L(v)}',
      variableDefinitions: [
        { symbol: 'u', meaning: 'Target node whose rank is being calculated' },
        { symbol: 'B_u', meaning: 'Set of all in-neighbor nodes linking into u' },
        { symbol: 'PR(v)', meaning: 'Current PageRank score of in-neighbor node v' },
        { symbol: 'L(v)', meaning: 'Total number of outbound links from node v' },
        { symbol: 'd', meaning: 'Damping factor (typically 0.85), probability of following a link' },
        { symbol: '|V|', meaning: 'Total number of nodes in the graph' }
      ],
      derivationOrIntuition: 'In matrix form: \\mathbf{p} = \\left( \\frac{1-d}{|V|} \\mathbf{E} + d \\mathbf{M} \\right) \\mathbf{p}, where \\mathbf{M} is the row-normalized adjacency matrix. By the Perron-Frobenius theorem, because the matrix is irreducible and aperiodic, a unique dominant eigenvector exists with eigenvalue \\lambda = 1.'
    },
    engineeringCriteria: {
      whenToUse: [
        'Ranking nodes by structural importance or authority in citation networks, code dependency graphs, or web pages.',
        'Personalized PageRank (PPR) for recommendation engines (e.g., Twitter "Who to Follow", Pinterest Pins).',
        'TextRank for unsupervised keyword extraction and text summarization from word co-occurrence graphs.'
      ],
      whenToAvoid: [
        'Dynamic graphs with sub-second millisecond edge mutations where full power-iteration cannot keep pace (use incremental random walks instead).',
        'When node importance is solely a function of intrinsic features rather than relational topology.'
      ],
      complexity: {
        timeTraining: 'O(k * (|V| + |E|)) where k is the number of power iterations (typically 20-50 iterations).',
        timeInference: 'O(1) precomputed lookup',
        space: 'O(|V| + |E|) in sparse CSR/CSC matrix format'
      }
    },
    codeRecipe: {
      framework: 'Python (NumPy / NetworkX)',
      code: `import networkx as nx
import numpy as np

def compute_pagerank(adjacency_dict, d=0.85, max_iter=100, tol=1e-6):
    """
    Computes PageRank using NetworkX and Power Iteration.
    """
    G = nx.DiGraph(adjacency_dict)
    
    # 1. Standard NetworkX PageRank (power iteration)
    ranks = nx.pagerank(G, alpha=d, max_iter=max_iter, tol=tol)
    
    # Sort nodes by rank descending
    sorted_ranks = sorted(ranks.items(), key=lambda item: item[1], reverse=True)
    return sorted_ranks

# Example Graph
graph_data = {
    'PageA': ['PageB', 'PageC'],
    'PageB': ['PageC'],
    'PageC': ['PageA'],
    'PageD': ['PageC'] # PageD links to C but has no in-links
}

print(compute_pagerank(graph_data))`,
      explanation: 'Constructs a directed graph and runs power iteration until the $L_1$ norm between successive rank vectors drops below $10^{-6}$.'
    },
    principalInterviewFocus: {
      question: 'How do you handle Spider Traps and Dead Ends in PageRank, and how does Personalized PageRank (PPR) adapt this for recommendation feeds?',
      insight: 'Spider traps (cycles with no exit) hoard all probability mass, while dead ends (out-degree 0) leak probability out of the system. The damping factor (1-d)/|V| injects a uniform restart distribution that makes the Markov chain ergodic. For Personalized PageRank, instead of teleporting uniformly across all nodes, the teleportation vector concentrates mass solely on the user’s recent interaction nodes (seed set), producing localized recommendation scores.',
      failureModesInProduction: [
        'Dangling nodes (zero out-degree) causing total probability mass to drain to zero during matrix multiplication unless handled by redistributing 1/|V|.',
        'Graph scale exceeding single-machine RAM; requires distributed matrix-vector multiplication via GraphX or cuGraph on GPUs.'
      ]
    }
  },
  {
    id: 'dijkstra',
    title: "Dijkstra's Algorithm",
    subtitle: 'Optimal Single-Source Shortest Path for Non-Negative Weighted Graphs',
    sectionId: 'graph-algorithms',
    sectionTitle: 'Graph & Network Algorithms',
    level: 'Foundational',
    tags: ['Graph Theory', 'Shortest Path', 'Greedy', 'Priority Queue', 'Routing'],
    llmAntiPattern: {
      scenario: 'Asking an LLM agent to find the lowest-latency API hop sequence or shortest road network delivery route across 2,000 nodes.',
      whyItFails: 'LLMs lack mathematical execution guarantees. They hallucinate impossible edge connections, violate weight accumulation, and fail on scale.',
      tcoComparison: {
        specialized: { latency: '0.4ms', costPerMillion: '$0.00', determinism: 'Mathematically Optimal' },
        llmAlternative: { latency: '2,200ms', costPerMillion: '$9,000', determinism: 'Often Invalid / Sub-optimal' }
      }
    },
    intuition: {
      summary: 'Dijkstra explores nodes greedily by always visiting the currently known closest unvisited node using a min-priority queue.',
      keyPoints: [
        'Maintains a tentative distance array initialized to infinity for all nodes except the source (0).',
        'Extracts the minimum tentative distance node u from the priority queue.',
        'Relaxes all outgoing edges (u, v): if dist[u] + weight(u, v) < dist[v], updates dist[v] and pushes to queue.',
        'Guaranteed optimal provided that no negative edge weights exist.'
      ],
      detailedExplanation: 'Dijkstra builds a shortest-path tree spanning outward from the origin. Because edge weights are non-negative, once a node is settled (popped from the min-heap), its shortest path distance is mathematically finalized and will never need to be reconsidered.'
    },
    diagram: {
      type: 'mermaid',
      content: `graph LR
    S((Source: 0)) -->|Weight: 4| A((A: 4))
    S -->|Weight: 2| B((B: 2))
    B -->|Weight: 1| A
    B -->|Weight: 5| C((C: 7))
    A -->|Weight: 2| C
    style S fill:#0284c7,stroke:#38bdf8,stroke-width:3px,color:#fff
    style B fill:#059669,stroke:#34d399,stroke-width:2px,color:#fff
    style A fill:#1e293b,stroke:#818cf8,stroke-width:2px,color:#fff
    style C fill:#1e293b,stroke:#f59e0b,stroke-width:2px,color:#fff`,
      caption: 'Edge relaxation: Although path S->A has weight 4, relaxing through B yields a shorter path S->B->A of weight 3.'
    },
    mathematics: {
      coreFormula: '\\text{dist}[v] = \\min(\\text{dist}[v], \\text{dist}[u] + w(u, v))',
      variableDefinitions: [
        { symbol: 'u', meaning: 'The currently settled node with the minimum tentative distance' },
        { symbol: 'v', meaning: 'A direct outgoing neighbor of node u' },
        { symbol: 'w(u, v)', meaning: 'Non-negative weight / cost of edge connecting u to v' },
        { symbol: '\\text{dist}[v]', meaning: 'Current best known cumulative distance from source to node v' }
      ],
      derivationOrIntuition: 'Dijkstra works by proof by induction: at each step, the greedy choice of picking the minimal unsettled node u ensures no other path through an unsettled node could reach u with a lower cost, because all future edge extensions add non-negative values.'
    },
    engineeringCriteria: {
      whenToUse: [
        'Network packet routing (OSPF, IS-IS protocols).',
        'Physical logistics, flight routes, and map navigation with guaranteed non-negative travel times.',
        'Game AI pathfinding on uniform or weighted grids when no targeted destination heuristic is available.'
      ],
      whenToAvoid: [
        'Graphs containing negative weight edges (must use Bellman-Ford or Johnson’s algorithm).',
        'Targeted point-to-point navigation where spatial coordinates allow heuristic guidance (use A* instead to explore 80% fewer nodes).'
      ],
      complexity: {
        timeTraining: 'N/A (Algorithmic Traversal)',
        timeInference: 'O((|V| + |E|) * log |V|) using a binary min-heap / priority queue',
        space: 'O(|V|) for distance table and heap tracking'
      }
    },
    codeRecipe: {
      framework: 'Python (heapq)',
      code: `import heapq

def dijkstra(graph, start_node):
    """
    graph: dict mapping node -> list of (neighbor, weight)
    Returns: distances dict, predecessors dict for path reconstruction
    """
    distances = {node: float('inf') for node in graph}
    distances[start_node] = 0
    predecessors = {node: None for node in graph}
    
    # Priority Queue stores tuples: (current_distance, node)
    pq = [(0, start_node)]
    
    while pq:
        curr_dist, curr_node = heapq.heappop(pq)
        
        # Skip stale entries in heap
        if curr_dist > distances[curr_node]:
            continue
            
        for neighbor, weight in graph[curr_node]:
            distance = curr_dist + weight
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                predecessors[neighbor] = curr_node
                heapq.heappush(pq, (distance, neighbor))
                
    return distances, predecessors`,
      explanation: 'Uses Python heapq to pop the lowest-cost unsettled node in $O(\\log |V|)$ time, pruning out-of-date distance records on the fly.'
    },
    principalInterviewFocus: {
      question: 'Why does Dijkstra fail when edge weights are negative, and what is the difference in time complexity between using a Fibonacci Heap vs Binary Min-Heap?',
      insight: 'Dijkstra assumes once a node is popped from the heap, its distance is finalized. A negative edge introduced later could invalidate settled nodes and require re-relaxing them, which breaks the greedy invariant and can trigger infinite loops in negative cycles. A Fibonacci Heap reduces the decrease-key operation from O(log V) to amortized O(1), bringing total complexity down to O(|E| + |V| log |V|). However, in production, binary heaps or pairing heaps are preferred due to constant factor overhead and memory locality.',
      failureModesInProduction: [
        'High memory churn in Python heapq if duplicate node entries are pushed without stale entry checks.',
        'Negative weight edge bugs introduced dynamically (e.g. promotional discounts or toll credits in routing engines).'
      ]
    }
  },
  {
    id: 'a-star',
    title: 'A* Search Algorithm',
    subtitle: 'Heuristic-Guided Optimal Pathfinding with Admissible Evaluation Functions',
    sectionId: 'graph-algorithms',
    sectionTitle: 'Graph & Network Algorithms',
    level: 'Core ML',
    tags: ['Graph Search', 'Heuristics', 'Pathfinding', 'Robotics', 'Game AI'],
    llmAntiPattern: {
      scenario: 'Using an LLM to navigate a 2D/3D robotics spatial grid to plan obstacle-avoidance trajectory.',
      whyItFails: 'LLMs lack coordinate spatial reasoning, fail on continuous spatial constraints, and produce invalid diagonal collisions.',
      tcoComparison: {
        specialized: { latency: '0.8ms', costPerMillion: '$0.00', determinism: '100% Collision-Free & Optimal' },
        llmAlternative: { latency: '3,000ms', costPerMillion: '$12,000', determinism: 'Frequent Collisions' }
      }
    },
    intuition: {
      summary: 'A* accelerates Dijkstra by adding an admissible heuristic h(n) estimating the distance to the goal, steering the search beam directly toward the target.',
      keyPoints: [
        'Evaluates nodes using f(n) = g(n) + h(n).',
        'g(n) is the exact cost from the start node to node n.',
        'h(n) is the estimated cost from node n to the goal.',
        'If h(n) never overestimates the true remaining cost (admissible), A* is guaranteed to find the optimal path.'
      ],
      detailedExplanation: 'While Dijkstra searches uniformly in all directions like expanding ripples on a pond, A* prioritizes nodes that lie along the vector heading toward the destination. With a Euclidean distance heuristic, the search area narrows down from a massive circle to an efficient ellipse.'
    },
    diagram: {
      type: 'mermaid',
      content: `graph LR
    Start((Start)) -->|g=3, h=7, f=10| B((Node B))
    Start -->|g=2, h=4, f=6| A((Node A - Best Candidate))
    A -->|g=4, h=2, f=6| Target((Target Goal))
    B -->|g=6, h=5, f=11| C((Node C))
    style Start fill:#0284c7,stroke:#38bdf8,stroke-width:2px,color:#fff
    style A fill:#059669,stroke:#34d399,stroke-width:3px,color:#fff
    style Target fill:#e11d48,stroke:#fda4af,stroke-width:2px,color:#fff`,
      caption: 'A* evaluation: Node A is preferred because its combined f(n) = g(n) + h(n) of 6 is significantly lower than B (10).'
    },
    mathematics: {
      coreFormula: 'f(n) = g(n) + h(n), \\quad \\text{where } h(n) \\le h^*(n)',
      variableDefinitions: [
        { symbol: 'f(n)', meaning: 'Total estimated path cost through node n' },
        { symbol: 'g(n)', meaning: 'Actual cumulative cost from the start node to node n' },
        { symbol: 'h(n)', meaning: 'Heuristic estimate of the cost from node n to the destination' },
        { symbol: 'h^*(n)', meaning: 'True optimal cost from node n to the destination' }
      ],
      derivationOrIntuition: 'If h(n) is admissible (h(n) <= h*(n)), A* never overlooks a shorter path. If h(n) is consistent (monotonic: h(u) <= c(u, v) + h(v)), the f-values along any path never decrease, ensuring no node needs to be re-opened once closed.'
    },
    engineeringCriteria: {
      whenToUse: [
        'Point-to-point map routing (Google Maps, OpenStreetMap).',
        'Robotics motion planning and autonomous navigation in grid or mesh environments.',
        'Video game NPC pathfinding around static and dynamic obstacles.'
      ],
      whenToAvoid: [
        'When the goal is not a specific target point but finding distances to all other nodes (use Dijkstra).',
        'When no reliable or admissible heuristic function can be formulated.'
      ],
      complexity: {
        timeTraining: 'N/A',
        timeInference: 'O(|E|) in best case (perfect heuristic) to O(b^d) worst case if h(n)=0',
        space: 'O(|V|) storing open and closed sets'
      }
    },
    codeRecipe: {
      framework: 'Python (math, heapq)',
      code: `import heapq
import math

def euclidean_heuristic(pos_a, pos_b):
    return math.hypot(pos_a[0] - pos_b[0], pos_a[1] - pos_b[1])

def a_star_search(grid, start, goal):
    """
    grid: 2D array (0: open, 1: obstacle)
    """
    open_heap = []
    heapq.heappush(open_heap, (0, start))
    
    g_score = {start: 0}
    came_from = {}
    
    while open_heap:
        _, current = heapq.heappop(open_heap)
        
        if current == goal:
            path = []
            while current in came_from:
                path.append(current)
                current = came_from[current]
            path.append(start)
            return path[::-1]
            
        for dx, dy in [(-1,0), (1,0), (0,-1), (0,1)]:
            neighbor = (current[0] + dx, current[1] + dy)
            if 0 <= neighbor[0] < len(grid) and 0 <= neighbor[1] < len(grid[0]):
                if grid[neighbor[0]][neighbor[1]] == 1:
                    continue # obstacle
                tentative_g = g_score[current] + 1
                if tentative_g < g_score.get(neighbor, float('inf')):
                    came_from[neighbor] = current
                    g_score[neighbor] = tentative_g
                    f_score = tentative_g + euclidean_heuristic(neighbor, goal)
                    heapq.heappush(open_heap, (f_score, neighbor))
    return None`,
      explanation: 'Evaluates coordinates on a grid, guiding the search directly toward the target goal with Euclidean distance heuristic.'
    },
    principalInterviewFocus: {
      question: 'What is the distinction between Admissibility and Consistency in A*, and what happens if your heuristic is inadmissible?',
      insight: 'Admissibility guarantees optimality on tree search (it never overestimates). Consistency (or monotonicity) guarantees that the heuristic obeys triangle inequality: h(u) <= cost(u, v) + h(v). Consistency is strictly stronger: it ensures that when a node is expanded in graph search, its path is guaranteed optimal, meaning the closed set never needs re-evaluation. If a heuristic is inadmissible, A* loses its theoretical optimality guarantee, but becomes a greedy best-first search, which can run significantly faster in video games and high-scale logistics where a 95% optimal path in 1ms is preferable to a 100% optimal path in 500ms.',
      failureModesInProduction: [
        'Memory exhaustion on massive road networks; production navigation systems use Contraction Hierarchies (CH) or Transit Node Routing.'
      ]
    }
  },
  {
    id: 'bellman-ford',
    title: 'Bellman-Ford Algorithm',
    subtitle: 'Shortest Paths with Negative Edge Weights & Negative Cycle Detection',
    sectionId: 'graph-algorithms',
    sectionTitle: 'Graph & Network Algorithms',
    level: 'Core ML',
    tags: ['Graph Theory', 'Dynamic Programming', 'Arbitrage', 'Financial Networks'],
    llmAntiPattern: {
      scenario: 'Prompting an LLM to scan a currency exchange FX table to detect triangular arbitrage opportunities.',
      whyItFails: 'LLMs cannot perform precision floating-point arithmetic or multiply sequence probabilities without rounding errors and hallucinations.',
      tcoComparison: {
        specialized: { latency: '1.2ms', costPerMillion: '$0.00', determinism: '100% Exact Arbitrage Proof' },
        llmAlternative: { latency: '3,800ms', costPerMillion: '$15,000', determinism: 'Math Hallucinations' }
      }
    },
    intuition: {
      summary: 'Bellman-Ford iteratively relaxes all edges |V| - 1 times. If an edge can still be relaxed on the |V|-th iteration, a negative-weight cycle exists.',
      keyPoints: [
        'Unlike Dijkstra, Bellman-Ford safely handles negative edge weights.',
        'Relaxes every edge in the graph across |V| - 1 rounds.',
        'A single additional pass verifies whether any edge can still be updated.',
        'Detects negative-weight cycles—crucial for finding financial arbitrage cycles.'
      ],
      detailedExplanation: 'In any graph without negative cycles, the shortest path between any two vertices has at most |V| - 1 edges. By relaxing every edge |V| - 1 times, we guarantee that shortest paths of length 1, 2, ..., |V|-1 are fully propagated. An update on round |V| proves an infinite negative loop exists.'
    },
    diagram: {
      type: 'mermaid',
      content: `graph LR
    USD((USD)) -->|"-log(1.08)"| EUR((EUR))
    EUR -->|"-log(1.15)"| GBP((GBP))
    GBP -->|"-log(0.82)"| USD
    style USD fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#fff
    style EUR fill:#0f172a,stroke:#34d399,stroke-width:2px,color:#fff
    style GBP fill:#0f172a,stroke:#f59e0b,stroke-width:2px,color:#fff`,
      caption: 'FX Currency Arbitrage: Transforming exchange rates via -log(R) turns currency multiplication into negative cycle detection.'
    },
    mathematics: {
      coreFormula: '\\text{dist}[v]^{(k)} = \\min\\left(\\text{dist}[v]^{(k-1)}, \\min_{(u, v) \\in E}(\\text{dist}[u]^{(k-1)} + w(u, v))\\right)',
      variableDefinitions: [
        { symbol: 'k', meaning: 'Iteration index (runs from 1 to |V| - 1)' },
        { symbol: '(u, v)', meaning: 'Directed edge in edge set E' },
        { symbol: 'w(u, v)', meaning: 'Arbitrary edge weight (positive or negative)' }
      ],
      derivationOrIntuition: 'For FX arbitrage: Given exchange rates r1 * r2 * r3 > 1, taking the negative natural log gives -ln(r1) - ln(r2) - ln(r3) < 0. Thus, detecting currency arbitrage is mathematically identical to finding a negative-weight cycle using Bellman-Ford.'
    },
    engineeringCriteria: {
      whenToUse: [
        'Currency arbitrage detection in crypto and FX order books.',
        'Distance-vector network routing protocols (e.g. RIP - Routing Information Protocol).',
        'Systems with edge costs that can be negative (e.g., carbon credits or fuel recharge bonuses).'
      ],
      whenToAvoid: [
        'Graphs with strictly positive edge weights where Dijkstra is O((V+E) log V) compared to Bellman-Ford O(V * E).'
      ],
      complexity: {
        timeTraining: 'N/A',
        timeInference: 'O(|V| * |E|)',
        space: 'O(|V|)'
      }
    },
    codeRecipe: {
      framework: 'Python',
      code: `def bellman_ford(vertices, edges, source):
    """
    edges: list of (u, v, weight)
    Returns: distances dict, has_negative_cycle bool
    """
    distances = {v: float('inf') for v in vertices}
    distances[source] = 0
    
    # Relax all edges |V| - 1 times
    for _ in range(len(vertices) - 1):
        for u, v, w in edges:
            if distances[u] != float('inf') and distances[u] + w < distances[v]:
                distances[v] = distances[u] + w
                
    # Detect negative cycles on |V|-th pass
    for u, v, w in edges:
        if distances[u] != float('inf') and distances[u] + w < distances[v]:
            return distances, True # Negative cycle detected!
            
    return distances, False`,
      explanation: 'Relaxes all edges |V| - 1 times and executes a final sweep to flag negative cycles.'
    },
    principalInterviewFocus: {
      question: 'How do you formulate triangular currency arbitrage as a graph problem, and how does the Shortest Path Faster Algorithm (SPFA) optimize Bellman-Ford?',
      insight: 'We map each currency to a node and conversion rates as directed edges with weight w = -log(rate). Finding a multiplicative cycle where product(rates) > 1 translates directly into finding a directed cycle where sum(-log(rates)) < 0. SPFA optimizes standard Bellman-Ford by maintaining a queue of candidate vertices whose distances have changed, avoiding blind sweeps over unaffected edges and achieving average-case O(|E|) time.',
      failureModesInProduction: [
        'Floating-point precision accumulation issues in -log calculations leading to phantom arbitrage loops; requires epsilon thresholding.'
      ]
    }
  }
];
