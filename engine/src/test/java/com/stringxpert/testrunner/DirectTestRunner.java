package com.stringxpert.testrunner;

import com.stringxpert.algorithms.*;
import com.stringxpert.analysis.AnalysisEngine;
import com.stringxpert.models.*;

import java.util.*;
import java.util.stream.Collectors;

public class DirectTestRunner {

    private static int passed = 0;
    private static int failed = 0;

    private static void assertTrue(boolean condition, String msg) {
        if (!condition) {
            System.err.println("FAIL: " + msg);
            failed++;
            throw new AssertionError(msg);
        }
    }

    private static void assertEquals(Object expected, Object actual, String msg) {
        if (!Objects.equals(expected, actual)) {
            System.err.println("FAIL: " + msg + " Expected: " + expected + ", Actual: " + actual);
            failed++;
            throw new AssertionError(msg + " Expected: " + expected + ", Actual: " + actual);
        }
    }

    private static void assertArrayEquals(int[] expected, int[] actual, String msg) {
        if (!Arrays.equals(expected, actual)) {
            System.err.println("FAIL: " + msg + " Expected: " + Arrays.toString(expected) + ", Actual: " + Arrays.toString(actual));
            failed++;
            throw new AssertionError(msg);
        }
    }

    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println("STRINGXPERT JAVA ENGINE SUITE — TEST EXECUTION");
        System.out.println("==================================================");

        NaiveMatcher naive = new NaiveMatcher();
        KMPMatcher kmp = new KMPMatcher();
        ZAlgorithm zAlgo = new ZAlgorithm();
        RabinKarpMatcher rabinKarp = new RabinKarpMatcher();
        AhoCorasickMatcher aho = new AhoCorasickMatcher();
        SuffixArray suffixArray = new SuffixArray();
        KasaiLCP kasai = new KasaiLCP();
        AnalysisEngine analysisEngine = new AnalysisEngine(null);

        runTest("Basic Exact Matching", () -> {
            String text = "ABABDABACDABABCABAB";
            String pattern = "ABABCABAB";
            assertEquals(Arrays.asList(10), getStarts(naive.search(text, pattern, "S1")), "Naive mismatch");
            assertEquals(Arrays.asList(10), getStarts(kmp.search(text, pattern, "S1")), "KMP mismatch");
            assertEquals(Arrays.asList(10), getStarts(zAlgo.search(text, pattern, "S1")), "Z mismatch");
            assertEquals(Arrays.asList(10), getStarts(rabinKarp.search(text, pattern, "S1")), "Rabin-Karp mismatch");
        });

        runTest("Overlapping Matches", () -> {
            String text = "AAAAA";
            String pattern = "AAA";
            List<Integer> expected = Arrays.asList(0, 1, 2);
            assertEquals(expected, getStarts(naive.search(text, pattern, "S1")), "Naive overlap");
            assertEquals(expected, getStarts(kmp.search(text, pattern, "S1")), "KMP overlap");
            assertEquals(expected, getStarts(zAlgo.search(text, pattern, "S1")), "Z overlap");
            assertEquals(expected, getStarts(rabinKarp.search(text, pattern, "S1")), "RK overlap");
        });

        runTest("Repeated Patterns", () -> {
            String text = "ABCABCABCABC";
            String pattern = "ABC";
            List<Integer> expected = Arrays.asList(0, 3, 6, 9);
            assertEquals(expected, getStarts(naive.search(text, pattern, "S1")), "Naive repeated");
            assertEquals(expected, getStarts(kmp.search(text, pattern, "S1")), "KMP repeated");
            assertEquals(expected, getStarts(zAlgo.search(text, pattern, "S1")), "Z repeated");
            assertEquals(expected, getStarts(rabinKarp.search(text, pattern, "S1")), "RK repeated");
        });

        runTest("Unicode Multilingual Patterns", () -> {
            String text = "こんにちは世界こんにちは";
            String pattern = "こんにちは";
            List<Integer> expected = Arrays.asList(0, 7);
            assertEquals(expected, getStarts(naive.search(text, pattern, "S1")), "Naive unicode");
            assertEquals(expected, getStarts(kmp.search(text, pattern, "S1")), "KMP unicode");
            assertEquals(expected, getStarts(zAlgo.search(text, pattern, "S1")), "Z unicode");
            assertEquals(expected, getStarts(rabinKarp.search(text, pattern, "S1")), "RK unicode");
        });

        runTest("Aho-Corasick Multi-Pattern Trie Traversal", () -> {
            AlgorithmResult res = aho.search("ahishers", Arrays.asList("he", "she", "his", "hers"), "S1");
            List<MatchResult> matches = res.getMatches();
            matches.sort(Comparator.comparingInt(MatchResult::getStartPosition));
            assertEquals(4, matches.size(), "Aho-Corasick match count");
            assertEquals("his", matches.get(0).getMatchedText(), "Aho first match");
            assertEquals("she", matches.get(1).getMatchedText(), "Aho second match");
        });

        runTest("Suffix Array + Kasai LCP Linear Construction", () -> {
            String text = "banana";
            AlgorithmResult saRes = suffixArray.construct(text);
            int[] sa = (int[]) saRes.getAlgorithmSpecificData().get("SuffixArray");
            int[] rank = (int[]) saRes.getAlgorithmSpecificData().get("RankArray");
            int[] expectedSA = {5, 3, 1, 0, 4, 2};
            assertArrayEquals(expectedSA, sa, "Suffix Array banana");

            AlgorithmResult lcpRes = kasai.construct(text, sa);
            int[] lcp = (int[]) lcpRes.getAlgorithmSpecificData().get("LCPArray");
            int[] expectedLCP = {0, 1, 3, 0, 0, 2};
            assertArrayEquals(expectedLCP, lcp, "Kasai LCP banana");
        });

        runTest("AnalysisEngine Full Multi-Algorithm Evidence Pipeline", () -> {
            String target = "The Knuth-Morris-Pratt algorithm offers linear-time pattern matching.";
            Map<String, String> refs = new HashMap<>();
            refs.put("REF-01", "Knuth-Morris-Pratt algorithm offers linear-time");
            refs.put("REF-02", "unrelated text content here");

            AnalysisResult result = analysisEngine.analyzeComplete("target.txt", target, refs);
            assertTrue(result.getTargetDocumentName().equals("target.txt"), "Target name");
            assertTrue(result.getTextualOverlapPercentage() > 0, "Overlap > 0");
            assertTrue(result.getTextualOriginalityPercentage() > 0, "Originality > 0");
            assertEquals(100.0, (double) Math.round(result.getTextualOverlapPercentage() + result.getTextualOriginalityPercentage()), "Sum to 100%");
            assertTrue(!result.getFusedEvidenceRegions().isEmpty(), "Evidence regions not empty");
            assertTrue(!result.getAlgorithmSummaries().isEmpty(), "Algorithm summaries not empty");
        });

        System.out.println("==================================================");
        System.out.printf("RESULTS: %d PASSED, %d FAILED\n", passed, failed);
        System.out.println("==================================================");
        if (failed > 0) System.exit(1);
    }

    private static List<Integer> getStarts(AlgorithmResult res) {
        return res.getMatches().stream().map(MatchResult::getStartPosition).collect(Collectors.toList());
    }

    private static void runTest(String name, Runnable test) {
        try {
            test.run();
            passed++;
            System.out.println("✔ PASS: " + name);
        } catch (Throwable t) {
            failed++;
            System.err.println("✖ FAIL: " + name + " -> " + t.getMessage());
        }
    }
}
