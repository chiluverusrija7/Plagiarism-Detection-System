package com.stringxpert.algorithms;

import com.stringxpert.analysis.AnalysisEngine;
import com.stringxpert.models.*;
import org.junit.jupiter.api.Test;

import java.util.*;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;

public class AlgorithmTests {

    private final NaiveMatcher naive = new NaiveMatcher();
    private final KMPMatcher kmp = new KMPMatcher();
    private final ZAlgorithm zAlgo = new ZAlgorithm();
    private final RabinKarpMatcher rabinKarp = new RabinKarpMatcher();
    private final AhoCorasickMatcher aho = new AhoCorasickMatcher();
    private final SuffixArray suffixArray = new SuffixArray();
    private final KasaiLCP kasai = new KasaiLCP();
    private final AnalysisEngine analysisEngine = new AnalysisEngine(null);

    private void assertMatchPositions(List<MatchResult> matches, Integer... expectedPositions) {
        List<Integer> actualPositions = matches.stream()
                .map(MatchResult::getStartPosition)
                .collect(Collectors.toList());
        assertEquals(Arrays.asList(expectedPositions), actualPositions, "Positions mismatch");
    }

    private void runCrossConsistencyTest(String text, String pattern, Integer... expected) {
        List<MatchResult> mNaive = naive.search(text, pattern, "S1").getMatches();
        List<MatchResult> mKmp = kmp.search(text, pattern, "S1").getMatches();
        List<MatchResult> mZ = zAlgo.search(text, pattern, "S1").getMatches();
        List<MatchResult> mRk = rabinKarp.search(text, pattern, "S1").getMatches();

        assertMatchPositions(mNaive, expected);
        assertMatchPositions(mKmp, expected);
        assertMatchPositions(mZ, expected);
        assertMatchPositions(mRk, expected);
    }

    @Test
    void testBasicMatching() {
        runCrossConsistencyTest("ABABDABACDABABCABAB", "ABABCABAB", 10);
    }

    @Test
    void testOverlappingMatches() {
        runCrossConsistencyTest("AAAAA", "AAA", 0, 1, 2);
    }

    @Test
    void testNoMatch() {
        runCrossConsistencyTest("ABCDEFG", "XYZ");
    }

    @Test
    void testRepeatedPatterns() {
        runCrossConsistencyTest("ABCABCABCABC", "ABC", 0, 3, 6, 9);
    }

    @Test
    void testSingleCharacter() {
        runCrossConsistencyTest("AAAAAAAA", "A", 0, 1, 2, 3, 4, 5, 6, 7);
    }

    @Test
    void testEmptyTextOrPattern() {
        runCrossConsistencyTest("", "A");
        runCrossConsistencyTest("A", "");
        runCrossConsistencyTest("", "");
    }

    @Test
    void testPatternLongerThanText() {
        runCrossConsistencyTest("ABC", "ABCDEFG");
    }

    @Test
    void testUnicode() {
        runCrossConsistencyTest("こんにちは世界こんにちは", "こんにちは", 0, 7);
    }

    @Test
    void testAhoCorasick() {
        AlgorithmResult res = aho.search("ahishers", Arrays.asList("he", "she", "his", "hers"), "S1");
        List<MatchResult> matches = res.getMatches();
        
        matches.sort(Comparator.comparingInt(MatchResult::getStartPosition));
        
        assertEquals(4, matches.size());
        assertEquals("his", matches.get(0).getMatchedText());
        assertEquals(1, matches.get(0).getStartPosition());
        
        assertEquals("she", matches.get(1).getMatchedText());
        assertEquals(3, matches.get(1).getStartPosition());
        
        assertTrue(matches.get(2).getStartPosition() == 4);
        assertTrue(matches.get(3).getStartPosition() == 4);
    }

    @Test
    void testSuffixArrayAndLCP() {
        String text = "banana";
        AlgorithmResult saRes = suffixArray.construct(text);
        int[] sa = (int[]) saRes.getAlgorithmSpecificData().get("SuffixArray");
        int[] rank = (int[]) saRes.getAlgorithmSpecificData().get("RankArray");

        // Suffixes of banana:
        // 5: a
        // 3: ana
        // 1: anana
        // 0: banana
        // 4: na
        // 2: nana
        int[] expectedSA = {5, 3, 1, 0, 4, 2};
        assertArrayEquals(expectedSA, sa, "Suffix array ordering mismatch");

        // Verify rank array consistency: rank[sa[r]] == r and sa[rank[i]] == i
        for (int r = 0; r < text.length(); r++) {
            assertEquals(r, rank[sa[r]], "Rank invariant failed at rank " + r);
        }
        for (int i = 0; i < text.length(); i++) {
            assertEquals(i, sa[rank[i]], "SA invariant failed at index " + i);
        }

        AlgorithmResult lcpRes = kasai.construct(text, sa);
        int[] lcp = (int[]) lcpRes.getAlgorithmSpecificData().get("LCPArray");

        // LCP values indexed by rank r:
        // rank 0 (suffix 'a'): 0
        // rank 1 (suffix 'ana'): LCP(ana, a) = 1
        // rank 2 (suffix 'anana'): LCP(anana, ana) = 3
        // rank 3 (suffix 'banana'): LCP(banana, anana) = 0
        // rank 4 (suffix 'na'): LCP(na, banana) = 0
        // rank 5 (suffix 'nana'): LCP(nana, na) = 2
        assertEquals(0, lcp[0]);
        assertEquals(1, lcp[1]);
        assertEquals(3, lcp[2]);
        assertEquals(0, lcp[3]);
        assertEquals(0, lcp[4]);
        assertEquals(2, lcp[5]);

        // Validation using rank-lookup lcp[rank[i]] for each text position i:
        assertEquals(0, lcp[rank[0]], "LCP for suffix at pos 0 ('banana')");
        assertEquals(3, lcp[rank[1]], "LCP for suffix at pos 1 ('anana')");
        assertEquals(2, lcp[rank[2]], "LCP for suffix at pos 2 ('nana')");
        assertEquals(1, lcp[rank[3]], "LCP for suffix at pos 3 ('ana')");
        assertEquals(0, lcp[rank[4]], "LCP for suffix at pos 4 ('na')");
        assertEquals(0, lcp[rank[5]], "LCP for suffix at pos 5 ('a')");
    }

    @Test
    void testSuffixArrayAndKasaiAgainstBruteForce() {
        String[] testStrings = {
            "banana",
            "mississippi",
            "ABABCABAB",
            "GATAGACA$",
            "AAAAAAAA"
        };

        for (String str : testStrings) {
            verifyAgainstBruteForce(str);
        }
    }

    private void verifyAgainstBruteForce(String text) {
        int n = text.length();
        
        // 1. Brute-force suffix array
        Integer[] bruteSA = new Integer[n];
        for (int i = 0; i < n; i++) bruteSA[i] = i;
        Arrays.sort(bruteSA, (a, b) -> text.substring(a).compareTo(text.substring(b)));

        int[] expectedSA = new int[n];
        for (int i = 0; i < n; i++) expectedSA[i] = bruteSA[i];

        // Algorithm under test
        AlgorithmResult saRes = suffixArray.construct(text);
        int[] actualSA = (int[]) saRes.getAlgorithmSpecificData().get("SuffixArray");
        int[] rank = (int[]) saRes.getAlgorithmSpecificData().get("RankArray");

        assertArrayEquals(expectedSA, actualSA, "Suffix array failed for: " + text);

        // 2. Brute-force LCP
        int[] expectedLCP = new int[n];
        expectedLCP[0] = 0;
        for (int r = 1; r < n; r++) {
            String s1 = text.substring(actualSA[r - 1]);
            String s2 = text.substring(actualSA[r]);
            int common = 0;
            while (common < s1.length() && common < s2.length() && s1.charAt(common) == s2.charAt(common)) {
                common++;
            }
            expectedLCP[r] = common;
        }

        AlgorithmResult lcpRes = kasai.construct(text, actualSA);
        int[] actualLCP = (int[]) lcpRes.getAlgorithmSpecificData().get("LCPArray");

        assertArrayEquals(expectedLCP, actualLCP, "Kasai LCP array failed for: " + text);

        // Verify rank mapping lookup for every character position
        for (int i = 0; i < n; i++) {
            int r = rank[i];
            assertEquals(expectedLCP[r], actualLCP[rank[i]], "LCP[rank[i]] failed at text pos " + i + " in " + text);
        }
    }

    @Test
    void testAnalysisEngineComplete() {
        String target = "The Knuth-Morris-Pratt algorithm offers linear-time pattern matching.";
        Map<String, String> refs = new HashMap<>();
        refs.put("REF-01", "Knuth-Morris-Pratt algorithm offers linear-time");
        refs.put("REF-02", "unrelated text content here");

        AnalysisResult result = analysisEngine.analyzeComplete("target.txt", target, refs);

        assertNotNull(result);
        assertEquals("target.txt", result.getTargetDocumentName());
        assertEquals(2, result.getReferencesCount());
        assertTrue(result.getTextualOverlapPercentage() > 0);
        assertTrue(result.getTextualOriginalityPercentage() > 0);
        assertEquals(100.0, Math.round(result.getTextualOverlapPercentage() + result.getTextualOriginalityPercentage()));
        assertFalse(result.getFusedEvidenceRegions().isEmpty());
        assertFalse(result.getAlgorithmResults().isEmpty());
        assertFalse(result.getPerformanceMetrics().isEmpty());
    }

    @Test
    void testPerformanceMetricsTelemetry() {
        AlgorithmResult res = rabinKarp.search("ABCDEFABCGHI", "ABC", "REF-01");
        PerformanceMetrics metrics = PerformanceMetrics.fromAlgorithmResult(res);

        assertNotNull(metrics);
        assertEquals("Rabin-Karp", metrics.getAlgorithmName());
        assertTrue(metrics.getTotalExecutionTimeNs() >= 0);
        assertTrue(metrics.getComparisons() > 0);
        assertEquals(12, metrics.getInputSize());
        assertEquals(3, metrics.getPatternSize());
    }
}
