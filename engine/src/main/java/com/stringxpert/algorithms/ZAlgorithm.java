package com.stringxpert.algorithms;

import com.stringxpert.models.AlgorithmResult;
import com.stringxpert.models.MatchResult;

import java.util.ArrayList;
import java.util.List;

public class ZAlgorithm {

    /**
     * Z-Algorithm O(n + m) for pattern matching.
     */
    public AlgorithmResult search(String text, String pattern, String sourceId) {
        long startTotalTime = System.nanoTime();
        
        List<MatchResult> matches = new ArrayList<>();
        long comparisons = 0;
        
        if (text == null || pattern == null || pattern.isEmpty() || text.length() < pattern.length()) {
            return new AlgorithmResult("Z-Algorithm", matches, System.nanoTime() - startTotalTime, 0, comparisons, 
                                       text == null ? 0 : text.length(), pattern == null ? 0 : pattern.length());
        }

        int n = text.length();
        int m = pattern.length();
        int totalLen = m + 1 + n;

        int[] Z = new int[totalLen];
        int L = 0, R = 0;

        // Start from 1 because Z[0] is trivially totalLen, but we only need it for pattern matching
        for (int i = 1; i < totalLen; i++) {
            if (i > R) {
                L = R = i;
                while (R < totalLen) {
                    comparisons++;
                    if (charAt(R, pattern, text) == charAt(R - L, pattern, text)) {
                        R++;
                    } else {
                        break;
                    }
                }
                Z[i] = R - L;
                R--;
            } else {
                int k = i - L;
                if (Z[k] < R - i + 1) {
                    Z[i] = Z[k];
                } else {
                    L = i;
                    while (R < totalLen) {
                        comparisons++;
                        if (charAt(R, pattern, text) == charAt(R - L, pattern, text)) {
                            R++;
                        } else {
                            break;
                        }
                    }
                    Z[i] = R - L;
                    R--;
                }
            }
            
            // Check if match is found
            if (Z[i] == m && i > m) {
                int matchStart = i - m - 1;
                matches.add(new MatchResult(
                    "Z-Algorithm", sourceId, matchStart, m, text.substring(matchStart, matchStart + m), "P1", true
                ));
            }
        }

        long executionTime = System.nanoTime() - startTotalTime;
        
        AlgorithmResult result = new AlgorithmResult("Z-Algorithm", matches, executionTime, 0, comparisons, n, m);
        result.addAlgorithmData("ZArray", Z);
        
        return result;
    }

    /**
     * Virtual concatenation to avoid actual string creation and separator clashes.
     * Logically represents: pattern + '\0' + text
     */
    private char charAt(int index, String pattern, String text) {
        int m = pattern.length();
        if (index < m) {
            return pattern.charAt(index);
        } else if (index == m) {
            return '\0'; // Virtual unique separator
        } else {
            return text.charAt(index - m - 1);
        }
    }
}
