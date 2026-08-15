package com.stringxpert.algorithms;

import com.stringxpert.models.AlgorithmResult;

import java.util.Arrays;
import java.util.Comparator;
import java.util.ArrayList;

public class SuffixArray {

    /**
     * Practical O(n log^2 n) Prefix-Doubling Suffix Array Construction.
     */
    public AlgorithmResult construct(String text) {
        long startTotalTime = System.nanoTime();
        
        if (text == null || text.isEmpty()) {
            return new AlgorithmResult("Suffix Array", new ArrayList<>(), System.nanoTime() - startTotalTime, 0, 0, text == null ? 0 : text.length(), 0);
        }

        int n = text.length();
        Integer[] sa = new Integer[n];
        int[] rank = new int[n];
        int[] comparisonsCount = new int[1];

        // Initial ranking based on first character
        for (int i = 0; i < n; i++) {
            sa[i] = i;
            rank[i] = text.charAt(i);
        }

        // Prefix doubling
        for (int k = 1; k < n; k *= 2) {
            final int len = k;
            final int[] currentRank = rank;
            
            // Sort based on current rank and next rank (offset by k)
            Arrays.sort(sa, new Comparator<Integer>() {
                @Override
                public int compare(Integer a, Integer b) {
                    comparisonsCount[0]++;
                    if (currentRank[a] != currentRank[b]) {
                        return Integer.compare(currentRank[a], currentRank[b]);
                    }
                    int rankNextA = (a + len < n) ? currentRank[a + len] : -1;
                    int rankNextB = (b + len < n) ? currentRank[b + len] : -1;
                    return Integer.compare(rankNextA, rankNextB);
                }
            });

            // Reassign ranks
            int[] tempRank = new int[n];
            tempRank[sa[0]] = 0;
            for (int i = 1; i < n; i++) {
                int prev = sa[i - 1];
                int curr = sa[i];
                
                int rankPrevNext = (prev + k < n) ? currentRank[prev + k] : -1;
                int rankCurrNext = (curr + k < n) ? currentRank[curr + k] : -1;
                
                if (currentRank[prev] == currentRank[curr] && rankPrevNext == rankCurrNext) {
                    tempRank[curr] = tempRank[prev];
                } else {
                    tempRank[curr] = tempRank[prev] + 1;
                }
            }
            rank = tempRank;
            
            // Optimization: if all ranks are unique, we are done early
            if (rank[sa[n - 1]] == n - 1) {
                break;
            }
        }

        // Convert Integer[] to int[]
        int[] finalSa = new int[n];
        for(int i=0; i<n; i++) finalSa[i] = sa[i];

        long executionTime = System.nanoTime() - startTotalTime;
        
        AlgorithmResult result = new AlgorithmResult("Suffix Array", new ArrayList<>(), executionTime, 0, comparisonsCount[0], n, 0);
        result.addAlgorithmData("SuffixArray", finalSa);
        result.addAlgorithmData("RankArray", rank);
        
        return result;
    }
}
