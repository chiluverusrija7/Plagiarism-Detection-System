package com.stringxpert.models;

import java.util.Collections;
import java.util.List;

/**
 * Analysis-level aggregated performance summary for a specific string algorithm.
 * Encapsulates total execution time, preprocessing, comparisons, pattern counts,
 * and maintains granular per-pattern raw execution runs.
 */
public class AlgorithmPerformanceSummary {

    private final String algorithmName;
    private final String workloadType; // "SINGLE_PATTERN" | "MULTI_PATTERN" | "INDEX_STRUCTURE"
    private final int patternCount;
    private final long totalExecutionTimeNs;
    private final double totalExecutionTimeMs;
    private final long totalPreprocessingTimeNs;
    private final double totalPreprocessingTimeMs;
    private final long totalMatchingTimeNs;
    private final double totalMatchingTimeMs;
    private final long averageTimePerPatternNs;
    private final double averageTimePerPatternMs;
    private final long totalComparisons;
    private final Integer exactVerifications;
    private final Integer collisions;
    private final List<PerformanceMetrics> rawRuns;

    public AlgorithmPerformanceSummary(String algorithmName,
                                       String workloadType,
                                       int patternCount,
                                       long totalExecutionTimeNs,
                                       long totalPreprocessingTimeNs,
                                       long totalMatchingTimeNs,
                                       long totalComparisons,
                                       Integer exactVerifications,
                                       Integer collisions,
                                       List<PerformanceMetrics> rawRuns) {
        this.algorithmName = algorithmName;
        this.workloadType = workloadType;
        this.patternCount = patternCount;
        this.totalExecutionTimeNs = totalExecutionTimeNs;
        this.totalExecutionTimeMs = totalExecutionTimeNs / 1_000_000.0;
        this.totalPreprocessingTimeNs = totalPreprocessingTimeNs;
        this.totalPreprocessingTimeMs = totalPreprocessingTimeNs / 1_000_000.0;
        this.totalMatchingTimeNs = totalMatchingTimeNs;
        this.totalMatchingTimeMs = totalMatchingTimeNs / 1_000_000.0;
        this.averageTimePerPatternNs = patternCount > 0 ? totalExecutionTimeNs / patternCount : totalExecutionTimeNs;
        this.averageTimePerPatternMs = averageTimePerPatternNs / 1_000_000.0;
        this.totalComparisons = totalComparisons;
        this.exactVerifications = exactVerifications;
        this.collisions = collisions;
        this.rawRuns = rawRuns != null ? Collections.unmodifiableList(rawRuns) : Collections.emptyList();
    }

    public String getAlgorithmName() { return algorithmName; }
    public String getWorkloadType() { return workloadType; }
    public int getPatternCount() { return patternCount; }
    public long getTotalExecutionTimeNs() { return totalExecutionTimeNs; }
    public double getTotalExecutionTimeMs() { return totalExecutionTimeMs; }
    public long getTotalPreprocessingTimeNs() { return totalPreprocessingTimeNs; }
    public double getTotalPreprocessingTimeMs() { return totalPreprocessingTimeMs; }
    public long getTotalMatchingTimeNs() { return totalMatchingTimeNs; }
    public double getTotalMatchingTimeMs() { return totalMatchingTimeMs; }
    public long getAverageTimePerPatternNs() { return averageTimePerPatternNs; }
    public double getAverageTimePerPatternMs() { return averageTimePerPatternMs; }
    public long getTotalComparisons() { return totalComparisons; }
    public Integer getExactVerifications() { return exactVerifications; }
    public Integer getCollisions() { return collisions; }
    public List<PerformanceMetrics> getRawRuns() { return rawRuns; }

    @Override
    public String toString() {
        return "AlgorithmPerformanceSummary{" +
                "name='" + algorithmName + '\'' +
                ", patterns=" + patternCount +
                ", totalTime=" + totalExecutionTimeMs + "ms" +
                ", comparisons=" + totalComparisons +
                '}';
    }
}
