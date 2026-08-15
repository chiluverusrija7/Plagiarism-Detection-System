package com.stringxpert.models;

/**
 * Dedicated DTO/model for measured algorithm performance telemetry.
 * Contains only live, measured metrics without fabrication.
 */
public class PerformanceMetrics {

    private final String algorithmName;
    private final long preprocessingTimeNs;
    private final long matchingTimeNs;
    private final long totalExecutionTimeNs;
    private final long comparisons;
    private final long hashCandidates;
    private final long exactVerifications;
    private final long collisions;
    private final int inputSize;
    private final int patternSize;

    public PerformanceMetrics(String algorithmName, long preprocessingTimeNs, long matchingTimeNs,
                              long totalExecutionTimeNs, long comparisons, long hashCandidates,
                              long exactVerifications, long collisions, int inputSize, int patternSize) {
        this.algorithmName = algorithmName;
        this.preprocessingTimeNs = preprocessingTimeNs;
        this.matchingTimeNs = matchingTimeNs;
        this.totalExecutionTimeNs = totalExecutionTimeNs;
        this.comparisons = comparisons;
        this.hashCandidates = hashCandidates;
        this.exactVerifications = exactVerifications;
        this.collisions = collisions;
        this.inputSize = inputSize;
        this.patternSize = patternSize;
    }

    public static PerformanceMetrics fromAlgorithmResult(AlgorithmResult result) {
        if (result == null) return null;
        
        long exactVerifications = 0;
        long collisions = 0;
        if (result.getAlgorithmSpecificData().containsKey("ExactVerifications")) {
            exactVerifications = (Long) result.getAlgorithmSpecificData().get("ExactVerifications");
        }
        if (result.getAlgorithmSpecificData().containsKey("Collisions")) {
            collisions = (Long) result.getAlgorithmSpecificData().get("Collisions");
        }

        long preTime = result.getPreprocessingTimeNs();
        long totalTime = result.getExecutionTimeNs();
        long matchingTime = Math.max(0, totalTime - preTime);

        return new PerformanceMetrics(
            result.getAlgorithmName(),
            preTime,
            matchingTime,
            totalTime,
            result.getComparisons(),
            exactVerifications, // hash candidates equals exact verification passes in Rabin-Karp
            exactVerifications,
            collisions,
            result.getInputSize(),
            result.getPatternSize()
        );
    }

    public String getAlgorithmName() { return algorithmName; }
    public long getPreprocessingTimeNs() { return preprocessingTimeNs; }
    public long getMatchingTimeNs() { return matchingTimeNs; }
    public long getTotalExecutionTimeNs() { return totalExecutionTimeNs; }
    public double getTotalExecutionTimeMs() { return totalExecutionTimeNs / 1_000_000.0; }
    public long getComparisons() { return comparisons; }
    public long getHashCandidates() { return hashCandidates; }
    public long getExactVerifications() { return exactVerifications; }
    public long getCollisions() { return collisions; }
    public int getInputSize() { return inputSize; }
    public int getPatternSize() { return patternSize; }

    @Override
    public String toString() {
        return "PerformanceMetrics{" +
                "algorithm='" + algorithmName + '\'' +
                ", totalTimeNs=" + totalExecutionTimeNs +
                ", comparisons=" + comparisons +
                ", exactVerifications=" + exactVerifications +
                ", inputSize=" + inputSize +
                '}';
    }
}
