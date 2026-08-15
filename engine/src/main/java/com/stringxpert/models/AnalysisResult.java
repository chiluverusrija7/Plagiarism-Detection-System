package com.stringxpert.models;

import java.util.*;

/**
 * Top-level container representing the unified forensic analysis output.
 * Encapsulates target metadata, source contributions, fused evidence regions,
 * per-algorithm summaries, and per-pattern raw telemetry.
 */
public class AnalysisResult {

    private final String analysisId;
    private final String targetDocumentName;
    private final int targetCharCount;
    private final int targetWordCount;
    private final int totalMatchedCharacters;
    private final int totalMatchedWords;
    private final double textualOverlapPercentage;
    private final double textualOriginalityPercentage;
    private final int referencesCount;
    private final List<EvidenceRegion> fusedEvidenceRegions;
    private final Map<String, Double> sourceDistribution; // sourceId -> percentage
    private final List<AlgorithmResult> algorithmResults;
    private final List<PerformanceMetrics> performanceMetrics;
    private final List<AlgorithmPerformanceSummary> algorithmSummaries;
    private final long timestamp;

    public AnalysisResult(String analysisId,
                          String targetDocumentName,
                          int targetCharCount,
                          int targetWordCount,
                          int totalMatchedCharacters,
                          int totalMatchedWords,
                          double textualOverlapPercentage,
                          double textualOriginalityPercentage,
                          int referencesCount,
                          List<EvidenceRegion> fusedEvidenceRegions,
                          Map<String, Double> sourceDistribution,
                          List<AlgorithmResult> algorithmResults,
                          List<PerformanceMetrics> performanceMetrics,
                          List<AlgorithmPerformanceSummary> algorithmSummaries,
                          long timestamp) {
        this.analysisId = analysisId;
        this.targetDocumentName = targetDocumentName;
        this.targetCharCount = targetCharCount;
        this.targetWordCount = targetWordCount;
        this.totalMatchedCharacters = totalMatchedCharacters;
        this.totalMatchedWords = totalMatchedWords;
        this.textualOverlapPercentage = textualOverlapPercentage;
        this.textualOriginalityPercentage = textualOriginalityPercentage;
        this.referencesCount = referencesCount;
        this.fusedEvidenceRegions = fusedEvidenceRegions != null ? Collections.unmodifiableList(fusedEvidenceRegions) : Collections.emptyList();
        this.sourceDistribution = sourceDistribution != null ? Collections.unmodifiableMap(sourceDistribution) : Collections.emptyMap();
        this.algorithmResults = algorithmResults != null ? Collections.unmodifiableList(algorithmResults) : Collections.emptyList();
        this.performanceMetrics = performanceMetrics != null ? Collections.unmodifiableList(performanceMetrics) : Collections.emptyList();
        this.algorithmSummaries = algorithmSummaries != null ? Collections.unmodifiableList(algorithmSummaries) : Collections.emptyList();
        this.timestamp = timestamp;
    }

    public AnalysisResult(String analysisId,
                          String targetDocumentName,
                          int targetCharCount,
                          int targetWordCount,
                          int totalMatchedCharacters,
                          int totalMatchedWords,
                          double textualOverlapPercentage,
                          double textualOriginalityPercentage,
                          int referencesCount,
                          List<EvidenceRegion> fusedEvidenceRegions,
                          Map<String, Double> sourceDistribution,
                          List<AlgorithmResult> algorithmResults,
                          List<PerformanceMetrics> performanceMetrics,
                          long timestamp) {
        this(analysisId, targetDocumentName, targetCharCount, targetWordCount,
             totalMatchedCharacters, totalMatchedWords, textualOverlapPercentage,
             textualOriginalityPercentage, referencesCount, fusedEvidenceRegions,
             sourceDistribution, algorithmResults, performanceMetrics, Collections.emptyList(), timestamp);
    }

    public String getAnalysisId() { return analysisId; }
    public String getTargetDocumentName() { return targetDocumentName; }
    public int getTargetCharCount() { return targetCharCount; }
    public int getTargetWordCount() { return targetWordCount; }
    public int getTotalMatchedCharacters() { return totalMatchedCharacters; }
    public int getTotalMatchedWords() { return totalMatchedWords; }
    public double getTextualOverlapPercentage() { return textualOverlapPercentage; }
    public double getTextualOriginalityPercentage() { return textualOriginalityPercentage; }
    public int getReferencesCount() { return referencesCount; }
    public List<EvidenceRegion> getFusedEvidenceRegions() { return fusedEvidenceRegions; }
    public Map<String, Double> getSourceDistribution() { return sourceDistribution; }
    public List<AlgorithmResult> getAlgorithmResults() { return algorithmResults; }
    public List<PerformanceMetrics> getPerformanceMetrics() { return performanceMetrics; }
    public List<AlgorithmPerformanceSummary> getAlgorithmSummaries() { return algorithmSummaries; }
    public long getTimestamp() { return timestamp; }

    @Override
    public String toString() {
        return "AnalysisResult{" +
                "id='" + analysisId + '\'' +
                ", target='" + targetDocumentName + '\'' +
                ", overlap=" + textualOverlapPercentage + "%" +
                ", originality=" + textualOriginalityPercentage + "%" +
                ", regions=" + fusedEvidenceRegions.size() +
                ", references=" + referencesCount +
                ", summaries=" + algorithmSummaries.size() +
                '}';
    }
}
