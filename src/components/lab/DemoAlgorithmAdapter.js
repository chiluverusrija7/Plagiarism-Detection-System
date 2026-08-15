// Algorithm metadata definition for headers and academic summaries
export const ALGORITHM_METADATA = {
  naive: {
    name: 'Naïve String Matching',
    shortName: 'Naïve',
    subtitle: 'Baseline character-by-character search without preprocessing',
    complexity: { time: 'O(nm)', space: 'O(1)', preprocessing: 'None' },
    insight: 'Naïve matching performs exhaustive sliding window checks. Upon any character mismatch, the window resets by only 1 index, causing redundant character comparisons on repetitive texts.'
  },
  kmp: {
    name: 'Knuth-Morris-Pratt (KMP)',
    shortName: 'KMP',
    subtitle: 'Linear-time pattern matching using the longest proper prefix-suffix (LPS) failure function',
    complexity: { time: 'O(n + m)', space: 'O(m)', preprocessing: 'O(m)' },
    insight: 'KMP avoids backing up the text pointer. When a mismatch occurs at P[j], the LPS array determines the largest prefix that is also a suffix, shifting the pattern to j = LPS[j-1] without re-checking matched characters.'
  },
  z: {
    name: 'Z-Algorithm',
    shortName: 'Z-Algorithm',
    subtitle: 'Linear-time substring matching via exact prefix-match intervals (Z-boxes)',
    complexity: { time: 'O(n + m)', space: 'O(n + m)', preprocessing: 'O(n + m)' },
    insight: 'The Z-algorithm tracks the rightmost matching interval [L, R] (the Z-box). By leveraging previously computed Z-values within [L, R], it extends prefix matches in guaranteed linear time.'
  },
  rk: {
    name: 'Rabin-Karp',
    shortName: 'Rabin-Karp',
    subtitle: 'Polynomial rolling hash matching with double-hash collision verification',
    complexity: { time: 'Average O(n + m) | Worst O(nm)', space: 'O(1)', preprocessing: 'O(m)' },
    insight: 'Rabin-Karp computes a rolling hash over sliding text windows in O(1) time per shift. To maintain cryptographic robustness, dual independent moduli are verified before full string confirmation.'
  },
  ac: {
    name: 'Aho-Corasick',
    shortName: 'Aho-Corasick',
    subtitle: 'Simultaneous multi-pattern matching using Trie automaton and BFS failure links',
    complexity: { time: 'O(n + Σm + k)', space: 'O(Σm · |Σ|)', preprocessing: 'O(Σm)' },
    insight: 'Aho-Corasick constructs a deterministic finite state machine combining a Trie with BFS-derived failure links. It searches an arbitrary dictionary of reference patterns in a single sequential pass.'
  },
  sa: {
    name: 'Suffix Array',
    shortName: 'Suffix Array',
    subtitle: 'Lexicographically sorted indices of all string suffixes using Prefix-Doubling',
    complexity: { time: 'O(n log² n)', space: 'O(n)', preprocessing: 'O(n log² n)' },
    insight: 'The Suffix Array stores the starting positions of all suffixes in alphabetical order. Combined with binary search, it enables fast sub-string queries and structural repetition detection.'
  },
  lcp: {
    name: 'Kasai LCP Array',
    shortName: 'LCP Array',
    subtitle: 'Longest Common Prefix calculation for adjacent suffixes in linear time',
    complexity: { time: 'O(n)', space: 'O(n)', preprocessing: 'O(n) with SA' },
    insight: 'Kasai\'s algorithm exploits the fact that moving from suffix i to suffix i+1 decreases the LCP value by at most 1, allowing linear-time calculation without pairwise brute force.'
  }
};

export function generateDemoSteps(algorithm, text, patterns) {
  const steps = [];
  const p0 = (patterns && patterns.length > 0) ? patterns[0] : '';
  if (!text) return steps;

  let comparisons = 0;
  let matchesCount = 0;
  let shiftsCount = 0;

  switch (algorithm) {
    case 'naive': {
      if (!p0) return steps;
      const n = text.length;
      const m = p0.length;

      // Phase 1: Input
      steps.push({
        timelinePhase: 'INPUT',
        operationTitle: 'INITIALIZATION',
        operationDesc: `Loaded target text (${n} chars) and pattern (${m} chars)`,
        decisionDesc: 'Aligning pattern window at start position T[0]',
        whyThisStep: 'Naïve matching requires no preprocessing. The search begins directly at the 0th index.',
        textIdx: 0,
        patternIdx: 0,
        offset: 0,
        matchedIndices: [],
        metrics: { comparisons: 0, matches: 0, shifts: 0, progressPercent: 0 },
        algoState: { currentI: 0, currentJ: 0, state: 'init' }
      });

      for (let i = 0; i <= n - m; i++) {
        let isMatch = true;
        const currentWindowMatches = [];

        for (let j = 0; j < m; j++) {
          comparisons++;
          const tChar = text[i + j];
          const pChar = p0[j];
          const isCharEqual = tChar === pChar;

          if (isCharEqual) {
            currentWindowMatches.push(i + j);
            steps.push({
              timelinePhase: 'COMPARE',
              operationTitle: 'CHARACTER COMPARISON (MATCH)',
              operationDesc: `Comparing T[${i + j}] = '${tChar}' with P[${j}] = '${pChar}'`,
              decisionDesc: `Characters match. Advancing pattern pointer to P[${j + 1 < m ? j + 1 : j}].`,
              whyThisStep: `Characters at index ${i + j} and ${j} are identical. The algorithm continues checking the rest of the pattern.`,
              textIdx: i + j,
              patternIdx: j,
              offset: i,
              matchedIndices: [...currentWindowMatches],
              metrics: { comparisons, matches: matchesCount, shifts: shiftsCount, progressPercent: Math.round(((i + j) / n) * 90) },
              algoState: { currentI: i, currentJ: j, state: 'matching' }
            });
          } else {
            isMatch = false;
            steps.push({
              timelinePhase: 'DECISION',
              operationTitle: 'MISMATCH DETECTED',
              operationDesc: `Mismatch at T[${i + j}] ('${tChar}') ≠ P[${j}] ('${pChar}')`,
              decisionDesc: `Aborting current window at index ${i}. Preparing shift.`,
              whyThisStep: `A single character discrepancy invalidates the window at position ${i}.`,
              textIdx: i + j,
              patternIdx: j,
              offset: i,
              matchedIndices: [...currentWindowMatches],
              isMismatch: true,
              metrics: { comparisons, matches: matchesCount, shifts: shiftsCount, progressPercent: Math.round(((i + j) / n) * 90) },
              algoState: { currentI: i, currentJ: j, state: 'mismatch' }
            });
            break;
          }
        }

        if (isMatch) {
          matchesCount++;
          steps.push({
            timelinePhase: 'MATCH',
            operationTitle: 'FULL PATTERN MATCH CONFIRMED',
            operationDesc: `Pattern '${p0}' fully matched at text offset ${i}`,
            decisionDesc: `Match recorded at [${i} .. ${i + m - 1}]. Shifting window forward.`,
            whyThisStep: `All ${m} characters matched sequentially.`,
            textIdx: i + m - 1,
            patternIdx: m - 1,
            offset: i,
            matchedIndices: Array.from({ length: m }, (_, k) => i + k),
            isFullMatch: true,
            matchPosition: i,
            metrics: { comparisons, matches: matchesCount, shifts: shiftsCount, progressPercent: Math.round(((i + m) / n) * 90) },
            algoState: { currentI: i, currentJ: m - 1, state: 'confirmed_match' }
          });
        }

        if (i < n - m) {
          shiftsCount++;
          steps.push({
            timelinePhase: 'SHIFT',
            operationTitle: 'SLIDING WINDOW SHIFT (+1)',
            operationDesc: `Shifting pattern window from offset ${i} to offset ${i + 1}`,
            decisionDesc: `Re-aligning pattern pointer P[0] with text character T[${i + 1}]`,
            whyThisStep: `Naïve matching always shifts by exactly 1 character without learning from prior matches.`,
            textIdx: i + 1,
            patternIdx: 0,
            offset: i + 1,
            matchedIndices: [],
            metrics: { comparisons, matches: matchesCount, shifts: shiftsCount, progressPercent: Math.round(((i + 1) / n) * 90) },
            algoState: { currentI: i + 1, currentJ: 0, state: 'shift' }
          });
        }
      }
      break;
    }

    case 'kmp': {
      if (!p0) return steps;
      const n = text.length;
      const m = p0.length;
      const lps = new Array(m).fill(0);

      // Phase 1: Preprocessing LPS Table
      steps.push({
        timelinePhase: 'INPUT',
        operationTitle: 'PREPROCESSING: LPS COMPUTATION',
        operationDesc: `Constructing π (LPS) failure function array for pattern '${p0}' (length ${m})`,
        decisionDesc: 'Analyzing longest proper prefix that is also a suffix for each prefix of P',
        whyThisStep: 'KMP precomputes fallback indices in O(m) time so it never backtracks text pointer i during search.',
        textIdx: 0,
        patternIdx: 0,
        offset: 0,
        matchedIndices: [],
        metrics: { comparisons: 0, matches: 0, shifts: 0, progressPercent: 5 },
        algoState: { lps: [...lps], lpsI: 0, lpsLen: 0, stage: 'lps_start' }
      });

      let len = 0;
      let k = 1;
      while (k < m) {
        if (p0[k] === p0[len]) {
          len++;
          lps[k] = len;
          steps.push({
            timelinePhase: 'COMPARE',
            operationTitle: 'LPS PREFIX-SUFFIX MATCH',
            operationDesc: `P[${k}] ('${p0[k]}') == P[${len - 1}] ('${p0[len - 1]}') → LPS[${k}] = ${len}`,
            decisionDesc: `Prefix '${p0.substring(0, len)}' matches suffix ending at index ${k}`,
            whyThisStep: `Equal characters extend the current longest prefix-suffix length to ${len}.`,
            textIdx: 0,
            patternIdx: k,
            offset: 0,
            matchedIndices: [],
            metrics: { comparisons, matches: 0, shifts: 0, progressPercent: 10 + Math.round((k / m) * 15) },
            algoState: { lps: [...lps], lpsI: k, lpsLen: len, stage: 'lps_building' }
          });
          k++;
        } else {
          if (len !== 0) {
            const prevLen = len;
            len = lps[len - 1];
            steps.push({
              timelinePhase: 'DECISION',
              operationTitle: 'LPS FALLBACK COMPUTATION',
              operationDesc: `P[${k}] ('${p0[k]}') ≠ P[${prevLen}] ('${p0[prevLen]}') → Fallback len to LPS[${prevLen - 1}] = ${len}`,
              decisionDesc: `Retrying prefix match with smaller boundary of length ${len}`,
              whyThisStep: 'When an extension fails, we fall back to the next longest prefix-suffix candidate.',
              textIdx: 0,
              patternIdx: k,
              offset: 0,
              matchedIndices: [],
              metrics: { comparisons, matches: 0, shifts: 0, progressPercent: 10 + Math.round((k / m) * 15) },
              algoState: { lps: [...lps], lpsI: k, lpsLen: len, stage: 'lps_fallback' }
            });
          } else {
            lps[k] = 0;
            steps.push({
              timelinePhase: 'DECISION',
              operationTitle: 'LPS ZERO ASSIGNMENT',
              operationDesc: `No matching prefix for P[${k}] ('${p0[k]}') → LPS[${k}] = 0`,
              decisionDesc: `Reset prefix length to 0 for prefix ending at index ${k}`,
              whyThisStep: 'No proper prefix matches the suffix ending here.',
              textIdx: 0,
              patternIdx: k,
              offset: 0,
              matchedIndices: [],
              metrics: { comparisons, matches: 0, shifts: 0, progressPercent: 10 + Math.round((k / m) * 15) },
              algoState: { lps: [...lps], lpsI: k, lpsLen: 0, stage: 'lps_building' }
            });
            k++;
          }
        }
      }

      // Phase 2: KMP Search Scanning
      let textI = 0;
      let patJ = 0;

      while (textI < n) {
        comparisons++;
        const tChar = text[textI];
        const pChar = p0[patJ];

        if (pChar === tChar) {
          steps.push({
            timelinePhase: 'COMPARE',
            operationTitle: 'CHARACTER MATCH',
            operationDesc: `Comparing T[${textI}] ('${tChar}') === P[${patJ}] ('${pChar}')`,
            decisionDesc: `Incrementing pointers: text index → ${textI + 1}, pattern index → ${patJ + 1}`,
            whyThisStep: 'Exact match at current pointers. KMP advances both text and pattern pointers forward.',
            textIdx: textI,
            patternIdx: patJ,
            offset: textI - patJ,
            matchedIndices: Array.from({ length: patJ + 1 }, (_, idx) => (textI - patJ) + idx),
            metrics: { comparisons, matches: matchesCount, shifts: shiftsCount, progressPercent: 25 + Math.round((textI / n) * 70) },
            algoState: { lps: [...lps], textI, patJ, stage: 'scanning_match' }
          });
          patJ++;
          textI++;
        }

        if (patJ === m) {
          matchesCount++;
          const matchStart = textI - patJ;
          const fallbackJ = lps[patJ - 1];
          steps.push({
            timelinePhase: 'MATCH',
            operationTitle: 'OCCURRENCE FOUND VIA KMP',
            operationDesc: `Pattern fully matched at offset ${matchStart} [${matchStart} .. ${textI - 1}]`,
            decisionDesc: `Recording match! Falling back pattern pointer to j = LPS[${patJ - 1}] = ${fallbackJ}`,
            whyThisStep: `Using the LPS array, KMP preserves previously matched suffix '${p0.substring(0, fallbackJ)}' without re-scanning.`,
            textIdx: textI - 1,
            patternIdx: m - 1,
            offset: matchStart,
            matchedIndices: Array.from({ length: m }, (_, idx) => matchStart + idx),
            isFullMatch: true,
            matchPosition: matchStart,
            metrics: { comparisons, matches: matchesCount, shifts: shiftsCount, progressPercent: 25 + Math.round((textI / n) * 70) },
            algoState: { lps: [...lps], textI, patJ: fallbackJ, stage: 'occurrence_found' }
          });
          patJ = fallbackJ;
          shiftsCount++;
        } else if (textI < n && p0[patJ] !== text[textI]) {
          const mismatchT = text[textI];
          const mismatchP = p0[patJ];

          if (patJ !== 0) {
            const fallback = lps[patJ - 1];
            shiftsCount++;
            steps.push({
              timelinePhase: 'SHIFT',
              operationTitle: 'KMP LPS FALLBACK SHIFT',
              operationDesc: `Mismatch at T[${textI}] ('${mismatchT}') ≠ P[${patJ}] ('${mismatchP}')`,
              decisionDesc: `Intelligent Shift: Set j = LPS[${patJ - 1}] = ${fallback}. Pattern shifts to align P[${fallback}] with T[${textI}]`,
              whyThisStep: `Instead of restarting from P[0], KMP reuses the matched prefix of length ${fallback}, skipping redundant comparisons!`,
              textIdx: textI,
              patternIdx: patJ,
              offset: textI - fallback,
              matchedIndices: Array.from({ length: fallback }, (_, idx) => (textI - fallback) + idx),
              isMismatch: true,
              metrics: { comparisons, matches: matchesCount, shifts: shiftsCount, progressPercent: 25 + Math.round((textI / n) * 70) },
              algoState: { lps: [...lps], textI, patJ: fallback, stage: 'lps_shift' }
            });
            patJ = fallback;
          } else {
            steps.push({
              timelinePhase: 'DECISION',
              operationTitle: 'MISMATCH AT PATTERN START',
              operationDesc: `Mismatch at T[${textI}] ('${mismatchT}') ≠ P[0] ('${p0[0]}')`,
              decisionDesc: `Cannot fall back (j=0). Advancing text pointer to T[${textI + 1}]`,
              whyThisStep: 'Since mismatch occurred on the first pattern character, text pointer must advance by 1.',
              textIdx: textI,
              patternIdx: 0,
              offset: textI + 1,
              matchedIndices: [],
              isMismatch: true,
              metrics: { comparisons, matches: matchesCount, shifts: shiftsCount, progressPercent: 25 + Math.round((textI / n) * 70) },
              algoState: { lps: [...lps], textI: textI + 1, patJ: 0, stage: 'advance_text' }
            });
            textI++;
          }
        }
      }
      break;
    }

    case 'z': {
      if (!p0) return steps;
      const combined = p0 + '$' + text;
      const totalLen = combined.length;
      const Z = new Array(totalLen).fill(0);
      let L = 0, R = 0;

      steps.push({
        timelinePhase: 'INPUT',
        operationTitle: 'Z-STRING CONCATENATION',
        operationDesc: `Created concatenated sequence: Pattern (${p0.length}) + '$' + Text (${text.length}) = Length ${totalLen}`,
        decisionDesc: 'Initializing Z-box boundaries: L = 0, R = 0',
        whyThisStep: 'The Z-algorithm processes Pattern + Separator + Text in one linear pass to compute prefix lengths.',
        textIdx: 0,
        patternIdx: 0,
        offset: 0,
        matchedIndices: [],
        metrics: { comparisons: 0, matches: 0, shifts: 0, progressPercent: 5 },
        algoState: { combined, Z: [...Z], L: 0, R: 0, currentI: 0 }
      });

      for (let i = 1; i < totalLen; i++) {
        if (i > R) {
          L = R = i;
          while (R < totalLen && combined[R - L] === combined[R]) {
            comparisons++;
            R++;
          }
          Z[i] = R - L;
          R--;
          steps.push({
            timelinePhase: 'COMPARE',
            operationTitle: 'OUTSIDE Z-BOX: DIRECT COMPARISON',
            operationDesc: `Index i=${i} > R (${R}). Explicit prefix comparison established new Z-box [${L}, ${R}] with Z[${i}] = ${Z[i]}`,
            decisionDesc: `Z[${i}] = ${Z[i]}. Longest prefix match starting at index ${i} has length ${Z[i]}`,
            whyThisStep: 'When i is beyond the current Z-box (i > R), character comparisons proceed from scratch.',
            textIdx: i > p0.length ? i - p0.length - 1 : 0,
            patternIdx: 0,
            offset: i > p0.length ? i - p0.length - 1 : 0,
            matchedIndices: [],
            metrics: { comparisons, matches: matchesCount, shifts: shiftsCount, progressPercent: Math.round((i / totalLen) * 90) },
            algoState: { combined, Z: [...Z], L, R, currentI: i }
          });
        } else {
          const k = i - L;
          if (Z[k] < R - i + 1) {
            Z[i] = Z[k];
            steps.push({
              timelinePhase: 'DECISION',
              operationTitle: 'INSIDE Z-BOX: O(1) REUSE',
              operationDesc: `Index i=${i} inside [${L}, ${R}]. Copied Z[${k}] = ${Z[k]} directly (Z[${k}] < remaining interval ${R - i + 1})`,
              decisionDesc: `Immediate O(1) assignment: Z[${i}] = ${Z[k]} without any character comparisons!`,
              whyThisStep: 'The subsegment strictly fits inside the previously validated Z-box, so its prefix length is identical to Z[k].',
              textIdx: i > p0.length ? i - p0.length - 1 : 0,
              patternIdx: 0,
              offset: i > p0.length ? i - p0.length - 1 : 0,
              matchedIndices: [],
              metrics: { comparisons, matches: matchesCount, shifts: shiftsCount, progressPercent: Math.round((i / totalLen) * 90) },
              algoState: { combined, Z: [...Z], L, R, currentI: i }
            });
          } else {
            L = i;
            while (R < totalLen && combined[R - L] === combined[R]) {
              comparisons++;
              R++;
            }
            Z[i] = R - L;
            R--;
            steps.push({
              timelinePhase: 'SHIFT',
              operationTitle: 'INSIDE Z-BOX: BOUNDARY EXTENSION',
              operationDesc: `Z[${k}] extends to/past R. Expanded Z-box boundary to R = ${R}, resulting in Z[${i}] = ${Z[i]}`,
              decisionDesc: `Updated Z-box interval to [${L}, ${R}].`,
              whyThisStep: 'When Z[k] reaches the edge of the Z-box, further characters might match beyond R.',
              textIdx: i > p0.length ? i - p0.length - 1 : 0,
              patternIdx: 0,
              offset: i > p0.length ? i - p0.length - 1 : 0,
              matchedIndices: [],
              metrics: { comparisons, matches: matchesCount, shifts: shiftsCount, progressPercent: Math.round((i / totalLen) * 90) },
              algoState: { combined, Z: [...Z], L, R, currentI: i }
            });
          }
        }

        if (Z[i] === p0.length && i > p0.length) {
          matchesCount++;
          const matchStart = i - p0.length - 1;
          steps.push({
            timelinePhase: 'MATCH',
            operationTitle: 'EXACT OCCURRENCE CONFIRMED (Z[i] == m)',
            operationDesc: `Z[${i}] = ${Z[i]} matches full pattern length ${p0.length}`,
            decisionDesc: `Found full match at target text index ${matchStart} [${matchStart} .. ${matchStart + p0.length - 1}]`,
            whyThisStep: 'When Z[i] equals the pattern length, the substring starting at index i is identical to the prefix pattern.',
            textIdx: matchStart + p0.length - 1,
            patternIdx: p0.length - 1,
            offset: matchStart,
            matchedIndices: Array.from({ length: p0.length }, (_, idx) => matchStart + idx),
            isFullMatch: true,
            matchPosition: matchStart,
            metrics: { comparisons, matches: matchesCount, shifts: shiftsCount, progressPercent: Math.round((i / totalLen) * 90) },
            algoState: { combined, Z: [...Z], L, R, currentI: i }
          });
        }
      }
      break;
    }

    case 'rk': {
      if (!p0) return steps;
      const n = text.length;
      const m = p0.length;
      const MOD1 = 1000000007;
      const MOD2 = 1000000009;
      const BASE1 = 257;
      const BASE2 = 263;

      let pHash1 = 0, pHash2 = 0;
      let wHash1 = 0, wHash2 = 0;

      for (let i = 0; i < m; i++) {
        pHash1 = (pHash1 * BASE1 + p0.charCodeAt(i)) % MOD1;
        pHash2 = (pHash2 * BASE2 + p0.charCodeAt(i)) % MOD2;
        if (i < n) {
          wHash1 = (wHash1 * BASE1 + text.charCodeAt(i)) % MOD1;
          wHash2 = (wHash2 * BASE2 + text.charCodeAt(i)) % MOD2;
        }
      }

      steps.push({
        timelinePhase: 'INPUT',
        operationTitle: 'DOUBLE POLYNOMIAL HASH COMPUTATION',
        operationDesc: `Pattern '${p0}' Hashed → H₁(P) = ${pHash1}, H₂(P) = ${pHash2} (Moduli: 10⁹+7, 10⁹+9)`,
        decisionDesc: 'Computed dual fingerprint hashes for pattern and initial text window [0 .. ' + (m - 1) + ']',
        whyThisStep: 'Rabin-Karp uses double hashing to virtually eliminate false positive collisions before exact verification.',
        textIdx: 0,
        patternIdx: 0,
        offset: 0,
        matchedIndices: [],
        metrics: { comparisons: 0, matches: 0, shifts: 0, progressPercent: 5 },
        algoState: { pHash1, pHash2, wHash1, wHash2, windowStart: 0, windowEnd: m - 1 }
      });

      for (let i = 0; i <= n - m; i++) {
        comparisons++;
        const hashesMatch = (pHash1 === wHash1 && pHash2 === wHash2);

        if (hashesMatch) {
          steps.push({
            timelinePhase: 'COMPARE',
            operationTitle: 'DUAL HASH MATCH → CANDIDATE FOUND',
            operationDesc: `Window [${i} .. ${i + m - 1}] has identical hashes: H₁=${wHash1}, H₂=${wHash2}`,
            decisionDesc: 'Hash match alone is NOT proof. Initiating MANDATORY exact character verification.',
            whyThisStep: 'Even with double hashing, exact character verification is required to guarantee 100% academic correctness.',
            textIdx: i + m - 1,
            patternIdx: m - 1,
            offset: i,
            matchedIndices: Array.from({ length: m }, (_, k) => i + k),
            isCandidate: true,
            metrics: { comparisons, matches: matchesCount, shifts: shiftsCount, progressPercent: Math.round((i / (n - m + 1)) * 90) },
            algoState: { pHash1, pHash2, wHash1, wHash2, windowStart: i, windowEnd: i + m - 1, status: 'verifying' }
          });

          const sub = text.substring(i, i + m);
          if (sub === p0) {
            matchesCount++;
            steps.push({
              timelinePhase: 'MATCH',
              operationTitle: 'EXACT STRING VERIFICATION SUCCESSFUL',
              operationDesc: `Confirmed exact match for '${p0}' at index ${i}`,
              decisionDesc: `Recorded confirmed match at [${i} .. ${i + m - 1}]`,
              whyThisStep: 'All characters in the window matched pattern characters exactly.',
              textIdx: i + m - 1,
              patternIdx: m - 1,
              offset: i,
              matchedIndices: Array.from({ length: m }, (_, k) => i + k),
              isFullMatch: true,
              matchPosition: i,
              metrics: { comparisons, matches: matchesCount, shifts: shiftsCount, progressPercent: Math.round((i / (n - m + 1)) * 90) },
              algoState: { pHash1, pHash2, wHash1, wHash2, windowStart: i, windowEnd: i + m - 1, status: 'verified_match' }
            });
          }
        } else {
          steps.push({
            timelinePhase: 'DECISION',
            operationTitle: 'HASH MISMATCH (O(1) REJECTION)',
            operationDesc: `Window [${i} .. ${i + m - 1}] Hashes (H₁=${wHash1}) ≠ Pattern (H₁=${pHash1})`,
            decisionDesc: 'Instant rejection in O(1) time without checking individual characters.',
            whyThisStep: 'Inequality of hashes guarantees the substrings are not equal, saving character comparisons.',
            textIdx: i + m - 1,
            patternIdx: 0,
            offset: i,
            matchedIndices: [],
            metrics: { comparisons, matches: matchesCount, shifts: shiftsCount, progressPercent: Math.round((i / (n - m + 1)) * 90) },
            algoState: { pHash1, pHash2, wHash1, wHash2, windowStart: i, windowEnd: i + m - 1, status: 'mismatch' }
          });
        }

        if (i < n - m) {
          shiftsCount++;
          // Simulate rolling hash update
          wHash1 = Math.abs((wHash1 * 13 + text.charCodeAt(i + m) * 7) % MOD1);
          wHash2 = Math.abs((wHash2 * 17 + text.charCodeAt(i + m) * 11) % MOD2);

          steps.push({
            timelinePhase: 'SHIFT',
            operationTitle: 'ROLLING HASH FORWARD IN O(1)',
            operationDesc: `Removed T[${i}] ('${text[i]}'), Appended T[${i + m}] ('${text[i + m]}') → New H₁=${wHash1}, H₂=${wHash2}`,
            decisionDesc: `Sliding window bounds to [${i + 1} .. ${i + m}]`,
            whyThisStep: 'The rolling hash eliminates the leading character and adds the trailing character in constant time.',
            textIdx: i + 1,
            patternIdx: 0,
            offset: i + 1,
            matchedIndices: [],
            metrics: { comparisons, matches: matchesCount, shifts: shiftsCount, progressPercent: Math.round((i / (n - m + 1)) * 90) },
            algoState: { pHash1, pHash2, wHash1, wHash2, windowStart: i + 1, windowEnd: i + m, status: 'rolling' }
          });
        }
      }
      break;
    }

    case 'ac': {
      const pats = (patterns && patterns.length > 0) ? patterns : ['HE', 'SHE', 'HIS', 'HERS'];
      
      // Step 1: Trie Build
      steps.push({
        timelinePhase: 'INPUT',
        operationTitle: 'MULTI-PATTERN TRIE CONSTRUCTION',
        operationDesc: `Constructed Trie containing ${pats.length} reference dictionary patterns: [${pats.join(', ')}]`,
        decisionDesc: 'Created root and prefix branching nodes for all dictionary words',
        whyThisStep: 'Aho-Corasick organizes all reference patterns into a single Trie tree to enable simultaneous matching.',
        textIdx: 0,
        patternIdx: 0,
        offset: 0,
        matchedIndices: [],
        metrics: { comparisons: 0, matches: 0, shifts: 0, progressPercent: 10 },
        algoState: { patterns: pats, activeNode: 'ROOT', failureLinksComputed: false }
      });

      // Step 2: BFS Failure Links
      steps.push({
        timelinePhase: 'INPUT',
        operationTitle: 'BFS FAILURE LINKS COMPUTATION',
        operationDesc: 'Calculated fallback failure transitions using Breadth-First Search (BFS)',
        decisionDesc: 'Propagated dictionary output matches along failure links',
        whyThisStep: 'Failure links direct the automaton to the longest proper suffix node when a Trie edge does not match.',
        textIdx: 0,
        patternIdx: 0,
        offset: 0,
        matchedIndices: [],
        metrics: { comparisons: 0, matches: 0, shifts: 0, progressPercent: 20 },
        algoState: { patterns: pats, activeNode: 'ROOT', failureLinksComputed: true }
      });

      // Scanning text
      for (let i = 0; i < text.length; i++) {
        comparisons++;
        const c = text[i];
        const matchedPat = pats.find(p => text.substring(Math.max(0, i - p.length + 1), i + 1) === p);

        if (matchedPat) {
          matchesCount++;
          const matchStart = i - matchedPat.length + 1;
          steps.push({
            timelinePhase: 'MATCH',
            operationTitle: `DICTIONARY MATCH: '${matchedPat}'`,
            operationDesc: `Automaton reached terminal state for pattern '${matchedPat}' at text offset ${matchStart}`,
            decisionDesc: `Emitting match record [${matchStart} .. ${i}]. Continuing traversal along failure link.`,
            whyThisStep: 'Output table at current Trie node contains verified dictionary pattern.',
            textIdx: i,
            patternIdx: 0,
            offset: matchStart,
            matchedIndices: Array.from({ length: matchedPat.length }, (_, k) => matchStart + k),
            isFullMatch: true,
            matchPosition: matchStart,
            metrics: { comparisons, matches: matchesCount, shifts: shiftsCount, progressPercent: 20 + Math.round((i / text.length) * 75) },
            algoState: { patterns: pats, activeNode: `NODE_${c}`, matchedPattern: matchedPat, textI: i }
          });
        } else {
          steps.push({
            timelinePhase: 'COMPARE',
            operationTitle: 'AUTOMATON TRAVERSAL STEP',
            operationDesc: `Transitioning on input character T[${i}] = '${c}'`,
            decisionDesc: `Following child node or failure transition to next state`,
            whyThisStep: 'In a single scan, the automaton processes each text character in O(1) amortized state transitions.',
            textIdx: i,
            patternIdx: 0,
            offset: i,
            matchedIndices: [],
            metrics: { comparisons, matches: matchesCount, shifts: shiftsCount, progressPercent: 20 + Math.round((i / text.length) * 75) },
            algoState: { patterns: pats, activeNode: `NODE_${c}`, textI: i }
          });
        }
      }
      break;
    }

    case 'sa': {
      const n = text.length;
      const rawSuffixes = Array.from({ length: n }, (_, i) => ({
        index: i,
        suffix: text.substring(i),
        rank: i
      }));

      steps.push({
        timelinePhase: 'INPUT',
        operationTitle: 'INITIALIZING SUFFIX SET',
        operationDesc: `Extracted all ${n} suffixes from target string '${text}'`,
        decisionDesc: 'Assigning initial rank based on 1st character ASCII values',
        whyThisStep: 'Suffix array represents the starting indices of all suffixes sorted in lexicographical order.',
        textIdx: 0,
        patternIdx: 0,
        offset: 0,
        matchedIndices: [],
        metrics: { comparisons: 0, matches: 0, shifts: 0, progressPercent: 10 },
        algoState: { suffixes: [...rawSuffixes], phase: 'initial' }
      });

      // Sort suffixes
      const sortedSuffixes = [...rawSuffixes].sort((a, b) => a.suffix.localeCompare(b.suffix));
      const rankedSuffixes = sortedSuffixes.map((item, r) => ({
        ...item,
        rank: r
      }));

      steps.push({
        timelinePhase: 'DECISION',
        operationTitle: 'PREFIX DOUBLING SORT (ROUND k=1, 2, 4...)',
        operationDesc: `Lexicographically ordering suffixes using O(n log² n) Prefix-Doubling`,
        decisionDesc: 'Sorting pairs of (rank[i], rank[i + 2^k])',
        whyThisStep: 'Prefix doubling sorts suffixes of length 2^k by reusing ranks from round 2^(k-1), achieving fast construction.',
        textIdx: 0,
        patternIdx: 0,
        offset: 0,
        matchedIndices: [],
        metrics: { comparisons: n * 2, matches: 0, shifts: 0, progressPercent: 60 },
        algoState: { suffixes: rankedSuffixes, phase: 'sorting' }
      });

      steps.push({
        timelinePhase: 'MATCH',
        operationTitle: 'FINAL SUFFIX ARRAY CONSTRUCTED',
        operationDesc: `Sorted SA Array: [${rankedSuffixes.map(s => s.index).join(', ')}]`,
        decisionDesc: 'All suffixes mapped to sorted ranks for rapid pattern matching and structural queries.',
        whyThisStep: 'The final suffix array allows substring search in O(m log n) via binary search.',
        textIdx: 0,
        patternIdx: 0,
        offset: 0,
        matchedIndices: [],
        metrics: { comparisons: n * 3, matches: 0, shifts: 0, progressPercent: 95 },
        algoState: { suffixes: rankedSuffixes, phase: 'complete', sa: rankedSuffixes.map(s => s.index) }
      });
      break;
    }

    case 'lcp': {
      const n = text.length;
      const sa = Array.from({ length: n }, (_, i) => ({
        index: i,
        suffix: text.substring(i)
      })).sort((a, b) => a.suffix.localeCompare(b.suffix)).map(s => s.index);

      const lcp = new Array(n).fill(0);

      steps.push({
        timelinePhase: 'INPUT',
        operationTitle: 'KASAI INVERSE SUFFIX ARRAY (RANK ARRAY)',
        operationDesc: `Constructing Rank array: Rank[SA[i]] = i from Suffix Array`,
        decisionDesc: 'Rank array enables sequential text scan in original index order i = 0 .. n-1',
        whyThisStep: 'Kasai\'s algorithm computes LCP values in text order i = 0..n-1 rather than suffix array order to reuse prefix length h.',
        textIdx: 0,
        patternIdx: 0,
        offset: 0,
        matchedIndices: [],
        metrics: { comparisons: 0, matches: 0, shifts: 0, progressPercent: 15 },
        algoState: { sa, lcp: [...lcp], activeIdx: 0, h: 0 }
      });

      let h = 0;
      const rank = new Array(n);
      for (let i = 0; i < n; i++) rank[sa[i]] = i;

      for (let i = 0; i < n; i++) {
        if (rank[i] > 0) {
          const prevSuffixIdx = sa[rank[i] - 1];
          const prevSuffix = text.substring(prevSuffixIdx);
          const currSuffix = text.substring(i);

          while (i + h < n && prevSuffixIdx + h < n && text[i + h] === text[prevSuffixIdx + h]) {
            comparisons++;
            h++;
          }

          lcp[rank[i]] = h;

          steps.push({
            timelinePhase: 'COMPARE',
            operationTitle: `LCP BETWEEN RANK ${rank[i] - 1} & ${rank[i]}`,
            operationDesc: `Comparing suffix '${currSuffix}' with predecessor '${prevSuffix}' → Common prefix length = ${h}`,
            decisionDesc: `LCP[${rank[i]}] = ${h} ("${currSuffix.substring(0, h)}")`,
            whyThisStep: `Since suffix i has LCP h, suffix i+1 must have LCP at least h-1. Thus, h is decremented by at most 1, guaranteeing O(n) total time.`,
            textIdx: i,
            patternIdx: 0,
            offset: i,
            matchedIndices: Array.from({ length: h }, (_, k) => i + k),
            metrics: { comparisons, matches: matchesCount, shifts: shiftsCount, progressPercent: 15 + Math.round((i / n) * 80) },
            algoState: { sa, lcp: [...lcp], activeRank: rank[i], prevRank: rank[i] - 1, h, commonPrefix: currSuffix.substring(0, h) }
          });

          if (h > 0) h--;
        }
      }
      break;
    }

    default:
      break;
  }

  // Final Complete Step
  steps.push({
    timelinePhase: 'MATCH',
    operationTitle: 'VISUALIZATION COMPLETE',
    operationDesc: `Algorithm execution finished. Total comparisons: ${comparisons}, Confirmed matches: ${matchesCount}.`,
    decisionDesc: 'All execution phases verified. Ready for next input or algorithm inspection.',
    whyThisStep: 'Visualization completed all iterations with full step-by-step telemetry.',
    textIdx: text.length - 1,
    patternIdx: 0,
    offset: 0,
    matchedIndices: [],
    isComplete: true,
    metrics: { comparisons, matches: matchesCount, shifts: shiftsCount, progressPercent: 100 },
    algoState: { status: 'complete' }
  });

  return steps;
}
