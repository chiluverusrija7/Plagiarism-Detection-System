package com.stringxpert.algorithms;

import com.stringxpert.models.AlgorithmResult;
import com.stringxpert.models.MatchResult;

import java.util.ArrayList;
import java.util.List;

public class KMPMatcher {

    /**
     * Knuth-Morris-Pratt O(n + m) string matching algorithm.
     */
    public AlgorithmResult search(String text, String pattern, String sourceId) {
        long startTotalTime = System.nanoTime();
        
        List<MatchResult> matches = new ArrayList<>();
        long comparisons = 0;
        
        if (text == null || pattern == null || pattern.isEmpty() || text.length() < pattern.length()) {
            return new AlgorithmResult("KMP", matches, System.nanoTime() - startTotalTime, 0, comparisons, 
                                       text == null ? 0 : text.length(), pattern == null ? 0 : pattern.length());
        }

        int n = text.length();
        int m = pattern.length();

        // 1. Preprocessing (Compute LPS/Pi array)
        long startPreTime = System.nanoTime();
        int[] lps = computeLPS(pattern);
        long preTime = System.nanoTime() - startPreTime;

        // 2. Matching
        int i = 0; // index for text
        int j = 0; // index for pattern

        while (i < n) {
            comparisons++;
            if (pattern.charAt(j) == text.charAt(i)) {
                j++;
                i++;
            }

            if (j == m) {
                // Found a match
                matches.add(new MatchResult(
                    "KMP", sourceId, i - j, m, text.substring(i - j, i), "P1", true
                ));
                j = lps[j - 1]; // Reset j using LPS to find overlapping matches
            } else if (i < n && pattern.charAt(j) != text.charAt(i)) {
                comparisons++; // Additional comparison count for the mismatch check
                if (j != 0) {
                    j = lps[j - 1];
                } else {
                    i++;
                }
            }
        }

        long executionTime = System.nanoTime() - startTotalTime;
        
        AlgorithmResult result = new AlgorithmResult("KMP", matches, executionTime, preTime, comparisons, n, m);
        result.addAlgorithmData("LPS", lps);
        
        return result;
    }

    private int[] computeLPS(String pattern) {
        int m = pattern.length();
        int[] lps = new int[m];
        int len = 0;
        int i = 1;
        lps[0] = 0;

        while (i < m) {
            if (pattern.charAt(i) == pattern.charAt(len)) {
                len++;
                lps[i] = len;
                i++;
            } else {
                if (len != 0) {
                    len = lps[len - 1];
                } else {
                    lps[i] = 0;
                    i++;
                }
            }
        }
        return lps;
    }
}
