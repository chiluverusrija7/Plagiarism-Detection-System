package com.stringxpert.algorithms;

import com.stringxpert.models.AlgorithmResult;
import com.stringxpert.models.MatchResult;

import java.util.ArrayList;
import java.util.List;

public class NaiveMatcher {

    /**
     * O(nm) baseline string matching algorithm.
     */
    public AlgorithmResult search(String text, String pattern, String sourceId) {
        long startTime = System.nanoTime();
        
        List<MatchResult> matches = new ArrayList<>();
        long comparisons = 0;
        
        if (text == null || pattern == null || pattern.isEmpty() || text.length() < pattern.length()) {
            return new AlgorithmResult("Naïve", matches, System.nanoTime() - startTime, 0, comparisons, 
                                       text == null ? 0 : text.length(), pattern == null ? 0 : pattern.length());
        }

        int n = text.length();
        int m = pattern.length();

        for (int i = 0; i <= n - m; i++) {
            int j;
            for (j = 0; j < m; j++) {
                comparisons++;
                if (text.charAt(i + j) != pattern.charAt(j)) {
                    break;
                }
            }
            if (j == m) {
                // Exact match found
                matches.add(new MatchResult(
                    "Naïve", sourceId, i, m, text.substring(i, i + m), "P1", true
                ));
            }
        }

        long executionTime = System.nanoTime() - startTime;
        
        return new AlgorithmResult("Naïve", matches, executionTime, 0, comparisons, n, m);
    }
}
