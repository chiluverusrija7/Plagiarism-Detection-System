package com.stringxpert.algorithms;

import com.stringxpert.models.AlgorithmResult;

import java.util.ArrayList;

public class KasaiLCP {

    /**
     * Kasai's O(n) algorithm to construct the Longest Common Prefix (LCP) array.
     * Takes the text and its corresponding suffix array.
     */
    public AlgorithmResult construct(String text, int[] sa) {
        long startTotalTime = System.nanoTime();
        
        if (text == null || text.isEmpty() || sa == null || sa.length == 0) {
             return new AlgorithmResult("Kasai LCP", new ArrayList<>(), System.nanoTime() - startTotalTime, 0, 0, text == null ? 0 : text.length(), 0);
        }

        int n = text.length();
        int[] lcp = new int[n];
        int[] rank = new int[n];
        long comparisonsCount = 0;

        // Construct inverse suffix array (rank array)
        for (int i = 0; i < n; i++) {
            rank[sa[i]] = i;
        }

        int h = 0;
        for (int i = 0; i < n; i++) {
            if (rank[i] > 0) {
                int j = sa[rank[i] - 1];
                while (i + h < n && j + h < n) {
                    comparisonsCount++;
                    if (text.charAt(i + h) == text.charAt(j + h)) {
                        h++;
                    } else {
                        break;
                    }
                }
                lcp[rank[i]] = h;
                if (h > 0) {
                    h--;
                }
            } else {
                lcp[rank[i]] = 0; // LCP of first suffix is undefined/0
            }
        }

        long executionTime = System.nanoTime() - startTotalTime;
        
        AlgorithmResult result = new AlgorithmResult("Kasai LCP", new ArrayList<>(), executionTime, 0, comparisonsCount, n, 0);
        result.addAlgorithmData("LCPArray", lcp);
        
        return result;
    }
}
