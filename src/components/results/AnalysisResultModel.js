/**
 * Centralized immutable AnalysisResult data model.
 * Single source of truth ensuring mathematical consistency across all cards, heatmaps, and summaries.
 */
export const ANALYSIS_RESULT_DATA = {
  analysisId: 'DEMO-ANALYSIS-001',
  status: 'COMPLETED',
  executionMode: 'UI_PREVIEW',
  timestamp: 'Just now',
  
  targetDocument: {
    filename: 'research_paper_v2.txt',
    charCount: 429,
    wordCount: 57,
    lineCount: 2,
    encoding: 'UTF-8'
  },

  summaryMetrics: {
    textualOverlap: 31.6, // 18 / 57 words = 31.6%
    noveltyIndex: 68.4,   // 100 - 31.6 = 68.4%
    matchedWords: 18,
    totalWords: 57,
    matchedChars: 136,
    totalChars: 429,
    matchingRegionsCount: 3,
    sourcesDetected: 3,
    referencesAnalyzed: 3,
    classification: 'MODERATE',
    interpretation: 'Moderate textual overlap detected across 3 reference sources. The majority of content (68.4%) exhibits independent phrasing.'
  },

  sourceDistribution: [
    {
      sourceId: 'REF-03',
      name: 'Reference_03_Survey.txt',
      percentage: 18.4,
      matchedChars: 79,
      matchCount: 1,
      color: '#F54260' // Strong overlap indicator
    },
    {
      sourceId: 'REF-01',
      name: 'Reference_01_Algorithms.txt',
      percentage: 9.2,
      matchedChars: 39,
      matchCount: 1,
      color: '#F5A623' // Moderate overlap indicator
    },
    {
      sourceId: 'REF-02',
      name: 'Reference_02_Foundations.txt',
      percentage: 4.0,
      matchedChars: 18,
      matchCount: 1,
      color: '#4A90E2' // Low overlap indicator
    },
    {
      sourceId: 'UNMATCHED',
      name: 'Original / Unmatched Text',
      percentage: 68.4,
      matchedChars: 293,
      matchCount: 0,
      color: 'rgba(255, 255, 255, 0.15)'
    }
  ],

  // Interactive Match Regions mapped to text spans
  matches: [
    {
      id: 'MATCH-01',
      sourceId: 'REF-03',
      sourceName: 'Reference_03_Survey.txt',
      matchedText: 'Knuth-Morris-Pratt (KMP) algorithm offers linear-time pattern matching by utilizing a prefix function to avoid redundant comparisons.',
      targetSpan: [75, 203],
      refSpan: [402, 530],
      length: 128,
      wordCount: 17,
      type: 'EXACT SEQUENCE',
      intensity: 'STRONG',
      consensusCount: 4,
      supportingAlgorithms: [
        { name: 'KMP', note: 'Exact pattern match verified' },
        { name: 'Z-Algorithm', note: 'Linear matching region confirmed' },
        { name: 'Rabin-Karp', note: 'Double hash candidate + verified string match' },
        { name: 'Kasai LCP', note: 'Longest common prefix segment confirmed' }
      ]
    },
    {
      id: 'MATCH-02',
      sourceId: 'REF-01',
      sourceName: 'Reference_01_Algorithms.txt',
      matchedText: 'Suffix Arrays, combined with the Longest Common Prefix (LCP) array, provide powerful capabilities',
      targetSpan: [240, 337],
      refSpan: [110, 207],
      length: 97,
      wordCount: 13,
      type: 'LONG COMMON SEQUENCE',
      intensity: 'MODERATE',
      consensusCount: 3,
      supportingAlgorithms: [
        { name: 'Kasai LCP', note: 'Common suffix prefix overlap discovered' },
        { name: 'Suffix Array', note: 'Sorted lexicographical index alignment' },
        { name: 'Z-Algorithm', note: 'Sub-interval Z-box boundary match' }
      ]
    },
    {
      id: 'MATCH-03',
      sourceId: 'REF-02',
      sourceName: 'Reference_02_Foundations.txt',
      matchedText: 'Aho-Corasick algorithm constructs a finite state machine',
      targetSpan: [350, 406],
      refSpan: [55, 111],
      length: 56,
      wordCount: 7,
      type: 'MULTI-PATTERN MATCH',
      intensity: 'POSSIBLE',
      consensusCount: 2,
      supportingAlgorithms: [
        { name: 'Aho-Corasick', note: 'Dictionary Trie automaton traversal match' },
        { name: 'Rabin-Karp', note: 'Rolling hash verification match' }
      ]
    }
  ],

  // Heatmap text breakdown with text segments
  heatmapSegments: [
    {
      type: 'unmatched',
      text: 'The study of algorithmic text analysis has grown significantly in recent years. Modern methods demonstrate that the '
    },
    {
      type: 'match',
      matchId: 'MATCH-01',
      sourceId: 'REF-03',
      intensity: 'STRONG',
      text: 'Knuth-Morris-Pratt (KMP) algorithm offers linear-time pattern matching by utilizing a prefix function to avoid redundant comparisons.'
    },
    {
      type: 'unmatched',
      text: ' Furthermore, in academic literature, '
    },
    {
      type: 'match',
      matchId: 'MATCH-02',
      sourceId: 'REF-01',
      intensity: 'MODERATE',
      text: 'Suffix Arrays, combined with the Longest Common Prefix (LCP) array, provide powerful capabilities'
    },
    {
      type: 'unmatched',
      text: ' for multi-document correlation where the '
    },
    {
      type: 'match',
      matchId: 'MATCH-03',
      sourceId: 'REF-02',
      intensity: 'POSSIBLE',
      text: 'Aho-Corasick algorithm constructs a finite state machine'
    },
    {
      type: 'unmatched',
      text: ' to resolve simultaneous patterns.'
    }
  ],

  algorithmEvidenceSummary: [
    { name: 'Naïve Matching', role: 'Baseline Comparator', status: 'Active Baseline', findings: 'Used as baseline comparison model; verified against all optimized passes.' },
    { name: 'Knuth-Morris-Pratt', role: 'Linear Exact Matching', status: 'Confirmed Overlap', findings: '1 exact match sequence confirmed via failure function (π array).' },
    { name: 'Z-Algorithm', role: 'Prefix Interval Matching', status: 'Confirmed Overlap', findings: 'Validated 2 matching intervals via Z-box [L, R] boundary analysis.' },
    { name: 'Rabin-Karp', role: 'Rolling Hash Verification', status: 'Confirmed Overlap', findings: '2 candidates detected with 0 false collisions after double-hash exact verification.' },
    { name: 'Aho-Corasick', role: 'Multi-Pattern Automaton', status: 'Confirmed Overlap', findings: 'Detected 1 multi-pattern dictionary phrase in single linear pass.' },
    { name: 'Suffix Array', role: 'Lexicographic Ordering', status: 'Structural Match', findings: 'Constructed prefix-doubling suffix order for structural cross-document comparison.' },
    { name: 'Kasai LCP', role: 'Longest Common Prefix', status: 'Confirmed Overlap', findings: 'Discovered longest shared structural substring of 97 characters in O(n) time.' }
  ],

  originalityBreakdown: {
    unmatchedContentPct: 68.4,
    uniquePhrasesPct: 74.0,
    internalRepetitionPct: 4.8,
    repeatedPhrase: 'algorithmic text analysis',
    repeatedOccurrences: 2,
    sourceConcentration: 'LOW (Distributed across 3 independent sources)'
  },

  performanceTelemetry: [
    { algorithm: 'Naïve Matching', time: '—', comparisons: '—', status: 'Awaiting engine metrics' },
    { algorithm: 'Knuth-Morris-Pratt', time: '—', comparisons: '—', status: 'Awaiting engine metrics' },
    { algorithm: 'Z-Algorithm', time: '—', comparisons: '—', status: 'Awaiting engine metrics' },
    { algorithm: 'Rabin-Karp', time: '—', comparisons: '—', status: 'Awaiting engine metrics' },
    { algorithm: 'Aho-Corasick', time: '—', comparisons: '—', status: 'Awaiting engine metrics' },
    { algorithm: 'Suffix Array', time: '—', comparisons: '—', status: 'Awaiting engine metrics' },
    { algorithm: 'Kasai LCP', time: '—', comparisons: '—', status: 'Awaiting engine metrics' }
  ]
};
