package com.stringxpert.algorithms;

import com.stringxpert.models.AlgorithmResult;
import com.stringxpert.models.MatchResult;

import java.util.*;

public class AhoCorasickMatcher {

    private static class TrieNode {
        Map<Character, TrieNode> children = new HashMap<>();
        TrieNode fail = null;
        List<PatternInfo> output = new ArrayList<>();
    }

    private static class PatternInfo {
        String patternId;
        String pattern;
        String sourceId;

        PatternInfo(String patternId, String pattern, String sourceId) {
            this.patternId = patternId;
            this.pattern = pattern;
            this.sourceId = sourceId;
        }
    }

    /**
     * Aho-Corasick Multi-Pattern Matching.
     * Takes text and a map of patternId -> pattern string (or just a list of patterns and we gen IDs).
     */
    public AlgorithmResult search(String text, List<String> patterns, String sourceId) {
        long startTotalTime = System.nanoTime();
        List<MatchResult> matches = new ArrayList<>();
        long comparisons = 0;
        
        int totalPatternLength = 0;
        if (patterns != null) {
            for (String p : patterns) {
                if (p != null) totalPatternLength += p.length();
            }
        }
        
        if (text == null || patterns == null || patterns.isEmpty() || totalPatternLength == 0) {
            return new AlgorithmResult("Aho-Corasick", matches, System.nanoTime() - startTotalTime, 0, comparisons, 
                                       text == null ? 0 : text.length(), totalPatternLength);
        }

        long startPreTime = System.nanoTime();
        TrieNode root = buildAutomaton(patterns, sourceId);
        long preTime = System.nanoTime() - startPreTime;

        // Search text
        TrieNode curr = root;
        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            comparisons++; // Conceptually checking transitions
            
            while (curr != root && !curr.children.containsKey(c)) {
                curr = curr.fail;
                comparisons++;
            }
            
            if (curr.children.containsKey(c)) {
                curr = curr.children.get(c);
            } else {
                curr = root;
            }

            // Report matches
            if (!curr.output.isEmpty()) {
                for (PatternInfo info : curr.output) {
                    int matchLen = info.pattern.length();
                    int startPos = i - matchLen + 1;
                    matches.add(new MatchResult(
                        "Aho-Corasick", info.sourceId, startPos, matchLen, 
                        info.pattern, info.patternId, true
                    ));
                }
            }
        }

        long executionTime = System.nanoTime() - startTotalTime;
        
        return new AlgorithmResult("Aho-Corasick", matches, executionTime, preTime, comparisons, text.length(), totalPatternLength);
    }

    private TrieNode buildAutomaton(List<String> patterns, String sourceId) {
        TrieNode root = new TrieNode();

        // 1. Build Trie
        for (int i = 0; i < patterns.size(); i++) {
            String pattern = patterns.get(i);
            if (pattern == null || pattern.isEmpty()) continue;
            
            TrieNode curr = root;
            for (char c : pattern.toCharArray()) {
                curr.children.putIfAbsent(c, new TrieNode());
                curr = curr.children.get(c);
            }
            curr.output.add(new PatternInfo("P" + (i + 1), pattern, sourceId));
        }

        // 2. Build Failure Links (BFS)
        Queue<TrieNode> queue = new LinkedList<>();
        root.fail = root;

        for (TrieNode child : root.children.values()) {
            child.fail = root;
            queue.add(child);
        }

        while (!queue.isEmpty()) {
            TrieNode u = queue.poll();
            
            for (Map.Entry<Character, TrieNode> entry : u.children.entrySet()) {
                char c = entry.getKey();
                TrieNode v = entry.getValue();
                
                TrieNode failNode = u.fail;
                while (failNode != root && !failNode.children.containsKey(c)) {
                    failNode = failNode.fail;
                }
                
                if (failNode.children.containsKey(c)) {
                    v.fail = failNode.children.get(c);
                } else {
                    v.fail = root;
                }
                
                // Merge output from fail node
                if (v.fail != null && v.fail.output != null) {
                    v.output.addAll(v.fail.output);
                }
                
                queue.add(v);
            }
        }
        
        return root;
    }
}
