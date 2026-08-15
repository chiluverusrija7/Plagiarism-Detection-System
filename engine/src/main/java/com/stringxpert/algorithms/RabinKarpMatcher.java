package com.stringxpert.algorithms;

import com.stringxpert.models.AlgorithmResult;
import com.stringxpert.models.MatchResult;

import java.util.ArrayList;
import java.util.List;

public class RabinKarpMatcher {

    // Use two large primes for double hashing to avoid collisions
    private static final long MOD1 = 1_000_000_007L;
    private static final long MOD2 = 1_000_000_009L;
    private static final long BASE1 = 257L;
    private static final long BASE2 = 263L;

    /**
     * Rabin-Karp O(n + m) average with double hashing and exact verification.
     */
    public AlgorithmResult search(String text, String pattern, String sourceId) {
        long startTotalTime = System.nanoTime();
        
        List<MatchResult> matches = new ArrayList<>();
        long comparisons = 0;
        long exactVerifications = 0;
        long collisions = 0;
        
        if (text == null || pattern == null || pattern.isEmpty() || text.length() < pattern.length()) {
            return new AlgorithmResult("Rabin-Karp", matches, System.nanoTime() - startTotalTime, 0, comparisons, 
                                       text == null ? 0 : text.length(), pattern == null ? 0 : pattern.length());
        }

        int n = text.length();
        int m = pattern.length();

        // 1. Precompute hash values for pattern and first window of text
        long startPreTime = System.nanoTime();
        
        long h1 = 1;
        long h2 = 1;
        for (int i = 0; i < m - 1; i++) {
            h1 = (h1 * BASE1) % MOD1;
            h2 = (h2 * BASE2) % MOD2;
        }

        long pHash1 = 0, pHash2 = 0;
        long tHash1 = 0, tHash2 = 0;

        for (int i = 0; i < m; i++) {
            pHash1 = (BASE1 * pHash1 + pattern.charAt(i)) % MOD1;
            pHash2 = (BASE2 * pHash2 + pattern.charAt(i)) % MOD2;
            
            tHash1 = (BASE1 * tHash1 + text.charAt(i)) % MOD1;
            tHash2 = (BASE2 * tHash2 + text.charAt(i)) % MOD2;
        }
        
        long preTime = System.nanoTime() - startPreTime;

        // 2. Slide the window over the text
        for (int i = 0; i <= n - m; i++) {
            // Check if hashes match
            comparisons++; // Hashing check comparison conceptually
            if (pHash1 == tHash1 && pHash2 == tHash2) {
                // Exact string verification (MANDATORY)
                exactVerifications++;
                boolean match = true;
                for (int j = 0; j < m; j++) {
                    comparisons++;
                    if (text.charAt(i + j) != pattern.charAt(j)) {
                        match = false;
                        collisions++;
                        break;
                    }
                }
                
                if (match) {
                    matches.add(new MatchResult(
                        "Rabin-Karp", sourceId, i, m, text.substring(i, i + m), "P1", true
                    ));
                }
            }

            // Calculate hash for next window
            if (i < n - m) {
                // Rolling hash update for hash 1
                tHash1 = (BASE1 * (tHash1 - text.charAt(i) * h1) + text.charAt(i + m)) % MOD1;
                if (tHash1 < 0) tHash1 += MOD1;
                
                // Rolling hash update for hash 2
                tHash2 = (BASE2 * (tHash2 - text.charAt(i) * h2) + text.charAt(i + m)) % MOD2;
                if (tHash2 < 0) tHash2 += MOD2;
            }
        }

        long executionTime = System.nanoTime() - startTotalTime;
        
        AlgorithmResult result = new AlgorithmResult("Rabin-Karp", matches, executionTime, preTime, comparisons, n, m);
        result.addAlgorithmData("PatternHash1", pHash1);
        result.addAlgorithmData("PatternHash2", pHash2);
        result.addAlgorithmData("ExactVerifications", exactVerifications);
        result.addAlgorithmData("Collisions", collisions);
        
        return result;
    }
}
