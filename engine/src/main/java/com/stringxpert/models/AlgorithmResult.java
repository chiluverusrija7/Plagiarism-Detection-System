package com.stringxpert.models;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

public class AlgorithmResult {
    private final String algorithmName;
    private final List<MatchResult> matches;
    private final long executionTimeNs;
    private final long preprocessingTimeNs;
    private final long comparisons;
    private final int inputSize;
    private final int patternSize;
    
    // Store algorithm-specific data (e.g., LPS array, Z array, double hashes)
    private final Map<String, Object> algorithmSpecificData;

    public AlgorithmResult(String algorithmName, List<MatchResult> matches, 
                           long executionTimeNs, long preprocessingTimeNs, 
                           long comparisons, int inputSize, int patternSize) {
        this.algorithmName = algorithmName;
        this.matches = matches;
        this.executionTimeNs = executionTimeNs;
        this.preprocessingTimeNs = preprocessingTimeNs;
        this.comparisons = comparisons;
        this.inputSize = inputSize;
        this.patternSize = patternSize;
        this.algorithmSpecificData = new HashMap<>();
    }

    public void addAlgorithmData(String key, Object value) {
        algorithmSpecificData.put(key, value);
    }

    public String getAlgorithmName() { return algorithmName; }
    public List<MatchResult> getMatches() { return matches; }
    public long getExecutionTimeNs() { return executionTimeNs; }
    public long getPreprocessingTimeNs() { return preprocessingTimeNs; }
    public long getComparisons() { return comparisons; }
    public int getInputSize() { return inputSize; }
    public int getPatternSize() { return patternSize; }
    public Map<String, Object> getAlgorithmSpecificData() { return algorithmSpecificData; }
}
