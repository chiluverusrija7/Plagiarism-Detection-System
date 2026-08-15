package com.stringxpert.analysis;

import com.stringxpert.algorithms.*;
import com.stringxpert.models.*;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class AnalysisEngine {

    private final TextPreprocessor preprocessor;
    private final NaiveMatcher naive;
    private final KMPMatcher kmp;
    private final ZAlgorithm zAlgo;
    private final RabinKarpMatcher rabinKarp;
    private final AhoCorasickMatcher ahoCorasick;

    public AnalysisEngine(TextPreprocessor preprocessor) {
        this.preprocessor = preprocessor != null ? preprocessor : TextPreprocessor.defaultPreprocessor();
        this.naive = new NaiveMatcher();
        this.kmp = new KMPMatcher();
        this.zAlgo = new ZAlgorithm();
        this.rabinKarp = new RabinKarpMatcher();
        this.ahoCorasick = new AhoCorasickMatcher();
    }

    /**
     * Extracts substantial search patterns (sentences, clauses, phrases) from reference text.
     */
    public List<String> extractPatterns(String text) {
        List<String> patterns = new ArrayList<>();
        if (text == null || text.trim().isEmpty()) return patterns;

        String cleanText = text.trim();

        // 1. If text is short/medium, include entire text as a pattern
        if (cleanText.length() <= 150) {
            patterns.add(cleanText);
        }

        // 2. Extract sentences (split by punctuation [.!?\n;] or multi-newline)
        Pattern sentencePattern = Pattern.compile("[^.!?\\n;]+[.!?\\n;]*");
        Matcher matcher = sentencePattern.matcher(cleanText);
        while (matcher.find()) {
            String sentence = matcher.group().trim();
            if (sentence.length() >= 15) {
                patterns.add(sentence);
                String stripped = sentence.replaceAll("[.!?\\n;]+$", "").trim();
                if (stripped.length() >= 15 && !stripped.equals(sentence)) {
                    patterns.add(stripped);
                }
            }
        }

        // 3. Extract 4-to-8 word sliding phrases for unpunctuated text or long sentences
        String[] words = cleanText.split("\\s+");
        if (words.length >= 4) {
            int step = Math.max(1, words.length / 30);
            for (int i = 0; i <= words.length - 4; i += step) {
                int phraseLen = Math.min(8, words.length - i);
                StringBuilder sb = new StringBuilder();
                for (int j = 0; j < phraseLen; j++) {
                    if (j > 0) sb.append(" ");
                    sb.append(words[i + j]);
                }
                String phrase = sb.toString().trim();
                if (phrase.length() >= 20 && !patterns.contains(phrase)) {
                    patterns.add(phrase);
                }
            }
        }

        return new ArrayList<>(new LinkedHashSet<>(patterns));
    }

    /**
     * Fuses evidence from multiple exact match algorithms into a consolidated list of regions.
     */
    public List<EvidenceRegion> fuseEvidence(List<MatchResult> allMatches) {
        if (allMatches == null || allMatches.isEmpty()) {
            return Collections.emptyList();
        }

        Map<String, EvidenceRegion> regionMap = new LinkedHashMap<>();

        for (MatchResult match : allMatches) {
            if (match.getLength() <= 0) continue;
            String key = match.getSourceId() + ":" + match.getStartPosition() + ":" + match.getLength();
            
            EvidenceRegion region = regionMap.get(key);
            if (region == null) {
                region = new EvidenceRegion(match.getStartPosition(), match.getLength(), 
                                            match.getMatchedText(), match.getSourceId());
                regionMap.put(key, region);
            }
            region.addAlgorithm(match.getAlgorithm());
        }

        List<EvidenceRegion> initialRegions = new ArrayList<>(regionMap.values());
        initialRegions.sort(Comparator.comparingInt(EvidenceRegion::getStartPosition));

        Map<String, List<EvidenceRegion>> bySource = new LinkedHashMap<>();
        for (EvidenceRegion reg : initialRegions) {
            bySource.computeIfAbsent(reg.getSourceId(), k -> new ArrayList<>()).add(reg);
        }

        List<EvidenceRegion> consolidated = new ArrayList<>();
        for (Map.Entry<String, List<EvidenceRegion>> entry : bySource.entrySet()) {
            String sourceId = entry.getKey();
            List<EvidenceRegion> list = entry.getValue();
            if (list.isEmpty()) continue;

            EvidenceRegion current = list.get(0);
            for (int i = 1; i < list.size(); i++) {
                EvidenceRegion next = list.get(i);
                if (next.getStartPosition() <= current.getEndPosition() + 2) {
                    int newStart = Math.min(current.getStartPosition(), next.getStartPosition());
                    int newEnd = Math.max(current.getEndPosition(), next.getEndPosition());
                    int newLen = newEnd - newStart + 1;
                    
                    EvidenceRegion merged = new EvidenceRegion(newStart, newLen, current.getMatchedText(), sourceId);
                    for (String algo : current.getDetectingAlgorithms()) merged.addAlgorithm(algo);
                    for (String algo : next.getDetectingAlgorithms()) merged.addAlgorithm(algo);
                    current = merged;
                } else {
                    consolidated.add(current);
                    current = next;
                }
            }
            consolidated.add(current);
        }

        consolidated.sort(Comparator.comparingInt(EvidenceRegion::getStartPosition));
        return consolidated;
    }

    /**
     * Performs analysis and returns fused evidence regions.
     */
    public List<EvidenceRegion> analyze(String targetText, Map<String, String> references) {
        AnalysisResult fullResult = analyzeComplete("target_doc", targetText, references);
        return fullResult.getFusedEvidenceRegions();
    }

    /**
     * Performs a complete multi-algorithm forensic analysis returning a comprehensive AnalysisResult.
     */
    public AnalysisResult analyzeComplete(String targetDocName, String targetText, Map<String, String> references) {
        long timestamp = System.currentTimeMillis();
        String processedTarget = preprocessor.process(targetText);
        int targetCharCount = processedTarget.length();
        int targetWordCount = processedTarget.trim().isEmpty() ? 0 : processedTarget.trim().split("\\s+").length;

        List<MatchResult> aggregatedMatches = new ArrayList<>();
        List<AlgorithmResult> algoResults = new ArrayList<>();
        List<PerformanceMetrics> performanceMetricsList = new ArrayList<>();

        if (references == null || references.isEmpty() || targetCharCount == 0) {
            return new AnalysisResult(
                "ANALYSIS-" + timestamp, targetDocName, targetCharCount, targetWordCount,
                0, 0, 0.0, 100.0, 0,
                Collections.emptyList(), Collections.emptyMap(),
                Collections.emptyList(), Collections.emptyList(),
                Collections.emptyList(), timestamp
            );
        }

        // 1. Extract Patterns from all references
        List<String> allPatterns = new ArrayList<>();
        Map<String, String> patternToSource = new HashMap<>();
        Map<String, List<String>> sourceToPatterns = new LinkedHashMap<>();

        for (Map.Entry<String, String> entry : references.entrySet()) {
            String sourceId = entry.getKey();
            String rawRefText = entry.getValue();
            String processedRef = preprocessor.process(rawRefText);
            
            List<String> patternsForSource = extractPatterns(processedRef);
            sourceToPatterns.put(sourceId, patternsForSource);

            for (String p : patternsForSource) {
                String patternId = "P" + (allPatterns.size() + 1);
                allPatterns.add(p);
                patternToSource.put(patternId, sourceId);
            }
        }

        // Per-algorithm raw lists for aggregation
        List<PerformanceMetrics> naiveRuns = new ArrayList<>();
        List<PerformanceMetrics> kmpRuns = new ArrayList<>();
        List<PerformanceMetrics> zRuns = new ArrayList<>();
        List<PerformanceMetrics> rkRuns = new ArrayList<>();
        PerformanceMetrics acMetric = null;

        // 2. Aho-Corasick Multi-Pattern Search
        if (!allPatterns.isEmpty()) {
            AlgorithmResult acResult = ahoCorasick.search(processedTarget, allPatterns, "MULTI_SOURCE");
            algoResults.add(acResult);
            acMetric = PerformanceMetrics.fromAlgorithmResult(acResult);
            performanceMetricsList.add(acMetric);

            for (MatchResult mr : acResult.getMatches()) {
                String correctSource = patternToSource.getOrDefault(mr.getPatternId(), "UNKNOWN");
                aggregatedMatches.add(new MatchResult(
                    mr.getAlgorithm(), correctSource, mr.getStartPosition(), mr.getLength(),
                    mr.getMatchedText(), mr.getPatternId(), mr.isExactVerification()
                ));
            }
        }

        // 3. Individual Pattern Search Algorithms (KMP, Z, Rabin-Karp, Naïve)
        for (Map.Entry<String, List<String>> entry : sourceToPatterns.entrySet()) {
            String sourceId = entry.getKey();
            List<String> patternsForSource = entry.getValue();

            for (String pattern : patternsForSource) {
                if (pattern.length() < 10) continue;

                // Naïve
                AlgorithmResult naiveRes = naive.search(processedTarget, pattern, sourceId);
                algoResults.add(naiveRes);
                PerformanceMetrics naivePm = PerformanceMetrics.fromAlgorithmResult(naiveRes);
                naiveRuns.add(naivePm);
                performanceMetricsList.add(naivePm);
                aggregatedMatches.addAll(naiveRes.getMatches());

                // KMP
                AlgorithmResult kmpRes = kmp.search(processedTarget, pattern, sourceId);
                algoResults.add(kmpRes);
                PerformanceMetrics kmpPm = PerformanceMetrics.fromAlgorithmResult(kmpRes);
                kmpRuns.add(kmpPm);
                performanceMetricsList.add(kmpPm);
                aggregatedMatches.addAll(kmpRes.getMatches());

                // Z-Algorithm
                AlgorithmResult zRes = zAlgo.search(processedTarget, pattern, sourceId);
                algoResults.add(zRes);
                PerformanceMetrics zPm = PerformanceMetrics.fromAlgorithmResult(zRes);
                zRuns.add(zPm);
                performanceMetricsList.add(zPm);
                aggregatedMatches.addAll(zRes.getMatches());

                // Rabin-Karp
                AlgorithmResult rkRes = rabinKarp.search(processedTarget, pattern, sourceId);
                algoResults.add(rkRes);
                PerformanceMetrics rkPm = PerformanceMetrics.fromAlgorithmResult(rkRes);
                rkRuns.add(rkPm);
                performanceMetricsList.add(rkPm);
                aggregatedMatches.addAll(rkRes.getMatches());
            }
        }

        // 4. Evidence Fusion
        List<EvidenceRegion> fusedRegions = fuseEvidence(aggregatedMatches);

        // 5. Calculate Union Interval Coverage
        Map<String, Integer> sourceMatchedChars = new HashMap<>();
        for (Map.Entry<String, String> entry : references.entrySet()) {
            String srcId = entry.getKey();
            List<int[]> srcIntervals = new ArrayList<>();
            for (EvidenceRegion reg : fusedRegions) {
                if (reg.getSourceId().equals(srcId)) {
                    srcIntervals.add(new int[]{ reg.getStartPosition(), reg.getEndPosition() + 1 });
                }
            }
            srcIntervals.sort(Comparator.comparingInt(a -> a[0]));
            
            List<int[]> mergedSrc = new ArrayList<>();
            for (int[] curr : srcIntervals) {
                if (mergedSrc.isEmpty()) {
                    mergedSrc.add(new int[]{ curr[0], curr[1] });
                } else {
                    int[] prev = mergedSrc.get(mergedSrc.size() - 1);
                    if (curr[0] <= prev[1]) {
                        prev[1] = Math.max(prev[1], curr[1]);
                    } else {
                        mergedSrc.add(new int[]{ curr[0], curr[1] });
                    }
                }
            }
            int chars = 0;
            for (int[] inter : mergedSrc) {
                chars += (inter[1] - inter[0]);
            }
            sourceMatchedChars.put(srcId, Math.min(targetCharCount, chars));
        }

        List<int[]> globalIntervals = new ArrayList<>();
        for (EvidenceRegion reg : fusedRegions) {
            globalIntervals.add(new int[]{ reg.getStartPosition(), reg.getEndPosition() + 1 });
        }
        globalIntervals.sort(Comparator.comparingInt(a -> a[0]));

        List<int[]> mergedGlobal = new ArrayList<>();
        for (int[] curr : globalIntervals) {
            if (mergedGlobal.isEmpty()) {
                mergedGlobal.add(new int[]{ curr[0], curr[1] });
            } else {
                int[] prev = mergedGlobal.get(mergedGlobal.size() - 1);
                if (curr[0] <= prev[1]) {
                    prev[1] = Math.max(prev[1], curr[1]);
                } else {
                    mergedGlobal.add(new int[]{ curr[0], curr[1] });
                }
            }
        }

        int totalDistinctMatchedChars = 0;
        for (int[] inter : mergedGlobal) {
            totalDistinctMatchedChars += (inter[1] - inter[0]);
        }
        totalDistinctMatchedChars = Math.min(targetCharCount, totalDistinctMatchedChars);

        Map<String, Double> sourceDistribution = new LinkedHashMap<>();
        for (Map.Entry<String, String> entry : references.entrySet()) {
            int chars = sourceMatchedChars.getOrDefault(entry.getKey(), 0);
            double pct = targetCharCount > 0 ? (chars * 100.0) / targetCharCount : 0.0;
            sourceDistribution.put(entry.getKey(), Math.round(pct * 10.0) / 10.0);
        }

        double overlapPct = targetCharCount > 0 
            ? Math.round(((totalDistinctMatchedChars * 100.0) / targetCharCount) * 10.0) / 10.0 
            : 0.0;
        double originalityPct = Math.max(0.0, Math.round((100.0 - overlapPct) * 10.0) / 10.0);
        int matchedWords = targetWordCount > 0 ? (int) Math.round((overlapPct / 100.0) * targetWordCount) : 0;

        List<EvidenceRegion> enrichedFused = new ArrayList<>();
        for (EvidenceRegion reg : fusedRegions) {
            int s = Math.max(0, reg.getStartPosition());
            int e = Math.min(targetCharCount, reg.getEndPosition() + 1);
            String snippet = (s < e && e <= processedTarget.length()) ? processedTarget.substring(s, e) : reg.getMatchedText();
            EvidenceRegion enriched = new EvidenceRegion(s, e - s, snippet, reg.getSourceId());
            for (String algo : reg.getDetectingAlgorithms()) enriched.addAlgorithm(algo);
            enrichedFused.add(enriched);
        }

        // 6. Construct Algorithm Performance Summaries
        List<AlgorithmPerformanceSummary> summaries = new ArrayList<>();

        // Naïve
        summaries.add(aggregateSinglePatternSummary("Naïve Matching", naiveRuns));
        // KMP
        summaries.add(aggregateSinglePatternSummary("Knuth-Morris-Pratt (KMP)", kmpRuns));
        // Z-Algorithm
        summaries.add(aggregateSinglePatternSummary("Z-Algorithm", zRuns));
        // Rabin-Karp
        summaries.add(aggregateRabinKarpSummary("Rabin-Karp", rkRuns));

        // Aho-Corasick
        if (acMetric != null) {
            summaries.add(new AlgorithmPerformanceSummary(
                "Aho-Corasick",
                "MULTI_PATTERN",
                allPatterns.size(),
                acMetric.getTotalExecutionTimeNs(),
                acMetric.getPreprocessingTimeNs(),
                acMetric.getMatchingTimeNs(),
                acMetric.getComparisons(),
                null,
                null,
                Collections.singletonList(acMetric)
            ));
        }

        return new AnalysisResult(
            "ANALYSIS-" + timestamp,
            targetDocName,
            targetCharCount,
            targetWordCount,
            totalDistinctMatchedChars,
            matchedWords,
            overlapPct,
            originalityPct,
            references.size(),
            enrichedFused,
            sourceDistribution,
            algoResults,
            performanceMetricsList,
            summaries,
            timestamp
        );
    }

    private AlgorithmPerformanceSummary aggregateSinglePatternSummary(String name, List<PerformanceMetrics> runs) {
        int patternCount = runs.size();
        long totalExecNs = 0;
        long totalPreNs = 0;
        long totalMatchNs = 0;
        long totalComps = 0;

        for (PerformanceMetrics pm : runs) {
            totalExecNs += pm.getTotalExecutionTimeNs();
            totalPreNs += pm.getPreprocessingTimeNs();
            totalMatchNs += pm.getMatchingTimeNs();
            totalComps += pm.getComparisons();
        }

        return new AlgorithmPerformanceSummary(
            name,
            "SINGLE_PATTERN",
            patternCount,
            totalExecNs,
            totalPreNs,
            totalMatchNs,
            totalComps,
            null,
            null,
            runs
        );
    }

    private AlgorithmPerformanceSummary aggregateRabinKarpSummary(String name, List<PerformanceMetrics> runs) {
        int patternCount = runs.size();
        long totalExecNs = 0;
        long totalPreNs = 0;
        long totalMatchNs = 0;
        long totalComps = 0;
        int totalVerifs = 0;
        int totalColls = 0;

        for (PerformanceMetrics pm : runs) {
            totalExecNs += pm.getTotalExecutionTimeNs();
            totalPreNs += pm.getPreprocessingTimeNs();
            totalMatchNs += pm.getMatchingTimeNs();
            totalComps += pm.getComparisons();
            totalVerifs += pm.getExactVerifications();
            totalColls += pm.getCollisions();
        }

        return new AlgorithmPerformanceSummary(
            name,
            "SINGLE_PATTERN",
            patternCount,
            totalExecNs,
            totalPreNs,
            totalMatchNs,
            totalComps,
            totalVerifs,
            totalColls,
            runs
        );
    }
}
