package com.stringxpert.server;

import com.stringxpert.algorithms.*;
import com.stringxpert.analysis.AnalysisEngine;
import com.stringxpert.models.*;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.*;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class EngineServer {

    private static final int PORT = 8085;
    private final AnalysisEngine analysisEngine;
    private final SuffixArray suffixArray;
    private final KasaiLCP kasai;
    private final NaiveMatcher naive;
    private final KMPMatcher kmp;
    private final ZAlgorithm zAlgo;
    private final RabinKarpMatcher rabinKarp;
    private final AhoCorasickMatcher ahoCorasick;

    public EngineServer() {
        this.analysisEngine = new AnalysisEngine(null);
        this.suffixArray = new SuffixArray();
        this.kasai = new KasaiLCP();
        this.naive = new NaiveMatcher();
        this.kmp = new KMPMatcher();
        this.zAlgo = new ZAlgorithm();
        this.rabinKarp = new RabinKarpMatcher();
        this.ahoCorasick = new AhoCorasickMatcher();
    }

    public static void main(String[] args) throws Exception {
        EngineServer server = new EngineServer();
        server.start();
    }

    public void start() throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);
        server.createContext("/api/health", new HealthHandler());
        server.createContext("/api/analyze", new AnalyzeHandler());
        server.createContext("/api/lab", new LabHandler());
        server.setExecutor(null);
        server.start();
        System.out.println("STRINGXPERT Java Engine Server running on http://localhost:" + PORT);
    }

    private static void handleCors(HttpExchange exchange) {
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    }

    private static void sendJsonResponse(HttpExchange exchange, int statusCode, String jsonResponse) throws IOException {
        handleCors(exchange);
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        byte[] bytes = jsonResponse.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }

    private static String readRequestBody(HttpExchange exchange) throws IOException {
        try (InputStream is = exchange.getRequestBody();
             ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            byte[] buffer = new byte[4096];
            int read;
            while ((read = is.read(buffer)) != -1) {
                baos.write(buffer, 0, read);
            }
            return baos.toString(StandardCharsets.UTF_8.name());
        }
    }

    private class HealthHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            handleCors(exchange);
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            String response = "{\"status\":\"OK\",\"engine\":\"STRINGXPERT Java Engine\",\"version\":\"2.0\",\"algorithms\":[\"Naive\",\"KMP\",\"Z-Algorithm\",\"Rabin-Karp\",\"Aho-Corasick\",\"Suffix-Array\",\"Kasai-LCP\"]}";
            sendJsonResponse(exchange, 200, response);
        }
    }

    private class AnalyzeHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            handleCors(exchange);
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendJsonResponse(exchange, 405, "{\"error\":\"Method Not Allowed\"}");
                return;
            }

            try {
                String body = readRequestBody(exchange);
                String targetDocName = extractJsonString(body, "targetDocName", "target_document.txt");
                String targetText = extractJsonString(body, "targetText", "");
                Map<String, String> references = extractReferencesMap(body);

                // Execute Java Analysis Engine
                AnalysisResult result = analysisEngine.analyzeComplete(targetDocName, targetText, references);

                // Suffix Array & Kasai LCP execution
                AlgorithmResult saRes = suffixArray.construct(targetText);
                int[] sa = (int[]) saRes.getAlgorithmSpecificData().get("SuffixArray");
                AlgorithmResult lcpRes = kasai.construct(targetText, sa);

                PerformanceMetrics saMetrics = PerformanceMetrics.fromAlgorithmResult(saRes);
                PerformanceMetrics lcpMetrics = PerformanceMetrics.fromAlgorithmResult(lcpRes);

                AlgorithmPerformanceSummary saSummary = new AlgorithmPerformanceSummary(
                    "Suffix Array", "INDEX_STRUCTURE", 1,
                    saRes.getExecutionTimeNs(), 0, saRes.getExecutionTimeNs(),
                    saRes.getComparisons(), null, null, Collections.singletonList(saMetrics)
                );

                AlgorithmPerformanceSummary lcpSummary = new AlgorithmPerformanceSummary(
                    "Kasai LCP", "INDEX_STRUCTURE", 1,
                    lcpRes.getExecutionTimeNs(), 0, lcpRes.getExecutionTimeNs(),
                    lcpRes.getComparisons(), null, null, Collections.singletonList(lcpMetrics)
                );

                List<AlgorithmPerformanceSummary> allSummaries = new ArrayList<>(result.getAlgorithmSummaries());
                allSummaries.add(saSummary);
                allSummaries.add(lcpSummary);

                // Build complete JSON response
                StringBuilder json = new StringBuilder();
                json.append("{");
                json.append("\"analysisId\":").append(quote(result.getAnalysisId())).append(",");
                json.append("\"status\":\"COMPLETED\",");
                json.append("\"targetDocument\":{");
                json.append("\"filename\":").append(quote(result.getTargetDocumentName())).append(",");
                json.append("\"charCount\":").append(result.getTargetCharCount()).append(",");
                json.append("\"wordCount\":").append(result.getTargetWordCount());
                json.append("},");
                json.append("\"summaryMetrics\":{");
                json.append("\"textualOverlap\":").append(result.getTextualOverlapPercentage()).append(",");
                json.append("\"noveltyIndex\":").append(result.getTextualOriginalityPercentage()).append(",");
                json.append("\"matchedChars\":").append(result.getTotalMatchedCharacters()).append(",");
                json.append("\"totalChars\":").append(result.getTargetCharCount()).append(",");
                json.append("\"matchedWords\":").append(result.getTotalMatchedWords()).append(",");
                json.append("\"totalWords\":").append(result.getTargetWordCount()).append(",");
                json.append("\"matchingRegionsCount\":").append(result.getFusedEvidenceRegions().size()).append(",");
                json.append("\"referencesAnalyzed\":").append(result.getReferencesCount());
                json.append("},");

                // Source Distribution
                json.append("\"sourceDistribution\":[");
                int sIdx = 0;
                for (Map.Entry<String, Double> entry : result.getSourceDistribution().entrySet()) {
                    if (sIdx > 0) json.append(",");
                    json.append("{");
                    json.append("\"sourceId\":").append(quote(entry.getKey())).append(",");
                    json.append("\"percentage\":").append(entry.getValue());
                    json.append("}");
                    sIdx++;
                }
                json.append("],");

                // Fused Evidence Regions / Matches
                json.append("\"matches\":[");
                List<EvidenceRegion> regions = result.getFusedEvidenceRegions();
                for (int i = 0; i < regions.size(); i++) {
                    EvidenceRegion reg = regions.get(i);
                    if (i > 0) json.append(",");
                    json.append("{");
                    json.append("\"id\":\"MATCH-").append(String.format("%02d", i + 1)).append("\",");
                    json.append("\"sourceId\":").append(quote(reg.getSourceId())).append(",");
                    json.append("\"targetStart\":").append(reg.getStartPosition()).append(",");
                    json.append("\"targetEnd\":").append(reg.getEndPosition() + 1).append(",");
                    json.append("\"length\":").append(reg.getLength()).append(",");
                    json.append("\"matchedText\":").append(quote(reg.getMatchedText())).append(",");
                    json.append("\"consensusCount\":").append(reg.getDetectingAlgorithms().size()).append(",");
                    json.append("\"algorithms\":[");
                    int aIdx = 0;
                    for (String algo : reg.getDetectingAlgorithms()) {
                        if (aIdx > 0) json.append(",");
                        json.append(quote(algo));
                        aIdx++;
                    }
                    json.append("]");
                    json.append("}");
                }
                json.append("],");

                // 7 Aggregated Algorithm Performance Summaries
                json.append("\"algorithmSummaries\":[");
                for (int i = 0; i < allSummaries.size(); i++) {
                    AlgorithmPerformanceSummary s = allSummaries.get(i);
                    if (i > 0) json.append(",");
                    json.append("{");
                    json.append("\"algorithmName\":").append(quote(s.getAlgorithmName())).append(",");
                    json.append("\"workloadType\":").append(quote(s.getWorkloadType())).append(",");
                    json.append("\"patternCount\":").append(s.getPatternCount()).append(",");
                    json.append("\"totalExecutionTimeNs\":").append(s.getTotalExecutionTimeNs()).append(",");
                    json.append("\"totalExecutionTimeMs\":").append(String.format(Locale.US, "%.4f", s.getTotalExecutionTimeMs())).append(",");
                    json.append("\"totalPreprocessingTimeNs\":").append(s.getTotalPreprocessingTimeNs()).append(",");
                    json.append("\"totalPreprocessingTimeMs\":").append(String.format(Locale.US, "%.4f", s.getTotalPreprocessingTimeMs())).append(",");
                    json.append("\"totalMatchingTimeNs\":").append(s.getTotalMatchingTimeNs()).append(",");
                    json.append("\"totalMatchingTimeMs\":").append(String.format(Locale.US, "%.4f", s.getTotalMatchingTimeMs())).append(",");
                    json.append("\"averageTimePerPatternNs\":").append(s.getAverageTimePerPatternNs()).append(",");
                    json.append("\"averageTimePerPatternMs\":").append(String.format(Locale.US, "%.4f", s.getAverageTimePerPatternMs())).append(",");
                    json.append("\"totalComparisons\":").append(s.getTotalComparisons()).append(",");
                    json.append("\"exactVerifications\":").append(s.getExactVerifications() != null ? s.getExactVerifications() : "null").append(",");
                    json.append("\"collisions\":").append(s.getCollisions() != null ? s.getCollisions() : "null").append(",");
                    
                    // Embed raw runs
                    json.append("\"rawRuns\":[");
                    for (int j = 0; j < s.getRawRuns().size(); j++) {
                        PerformanceMetrics rm = s.getRawRuns().get(j);
                        if (j > 0) json.append(",");
                        json.append("{");
                        json.append("\"executionTimeNs\":").append(rm.getTotalExecutionTimeNs()).append(",");
                        json.append("\"executionTimeMs\":").append(String.format(Locale.US, "%.4f", rm.getTotalExecutionTimeMs())).append(",");
                        json.append("\"preprocessingTimeNs\":").append(rm.getPreprocessingTimeNs()).append(",");
                        json.append("\"matchingTimeNs\":").append(rm.getMatchingTimeNs()).append(",");
                        json.append("\"comparisons\":").append(rm.getComparisons()).append(",");
                        json.append("\"exactVerifications\":").append(rm.getExactVerifications()).append(",");
                        json.append("\"collisions\":").append(rm.getCollisions()).append(",");
                        json.append("\"inputSize\":").append(rm.getInputSize()).append(",");
                        json.append("\"patternSize\":").append(rm.getPatternSize());
                        json.append("}");
                    }
                    json.append("]");
                    json.append("}");
                }
                json.append("],");

                // Raw Performance Telemetry (all passes)
                json.append("\"performanceMetrics\":[");
                List<PerformanceMetrics> allMetrics = new ArrayList<>(result.getPerformanceMetrics());
                if (saMetrics != null) allMetrics.add(saMetrics);
                if (lcpMetrics != null) allMetrics.add(lcpMetrics);

                for (int i = 0; i < allMetrics.size(); i++) {
                    PerformanceMetrics pm = allMetrics.get(i);
                    if (i > 0) json.append(",");
                    json.append("{");
                    json.append("\"algorithm\":").append(quote(pm.getAlgorithmName())).append(",");
                    json.append("\"executionTimeNs\":").append(pm.getTotalExecutionTimeNs()).append(",");
                    json.append("\"executionTimeMs\":").append(String.format(Locale.US, "%.4f", pm.getTotalExecutionTimeMs())).append(",");
                    json.append("\"preprocessingTimeNs\":").append(pm.getPreprocessingTimeNs()).append(",");
                    json.append("\"matchingTimeNs\":").append(pm.getMatchingTimeNs()).append(",");
                    json.append("\"comparisons\":").append(pm.getComparisons()).append(",");
                    json.append("\"exactVerifications\":").append(pm.getExactVerifications()).append(",");
                    json.append("\"collisions\":").append(pm.getCollisions()).append(",");
                    json.append("\"inputSize\":").append(pm.getInputSize()).append(",");
                    json.append("\"patternSize\":").append(pm.getPatternSize());
                    json.append("}");
                }
                json.append("],");
                json.append("\"timestamp\":").append(result.getTimestamp());
                json.append("}");

                sendJsonResponse(exchange, 200, json.toString());

            } catch (Exception e) {
                e.printStackTrace();
                sendJsonResponse(exchange, 500, "{\"error\":\"" + escapeJson(e.getMessage()) + "\"}");
            }
        }
    }

    private class LabHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            handleCors(exchange);
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            try {
                String body = readRequestBody(exchange);
                String algorithm = extractJsonString(body, "algorithm", "KMP");
                String text = extractJsonString(body, "text", "");
                String pattern = extractJsonString(body, "pattern", "");

                AlgorithmResult result;
                switch (algorithm.toUpperCase()) {
                    case "NAIVE":
                    case "NAÏVE":
                        result = naive.search(text, pattern, "LAB");
                        break;
                    case "KMP":
                        result = kmp.search(text, pattern, "LAB");
                        break;
                    case "Z":
                    case "Z-ALGORITHM":
                        result = zAlgo.search(text, pattern, "LAB");
                        break;
                    case "RABIN-KARP":
                    case "RABINKARP":
                        result = rabinKarp.search(text, pattern, "LAB");
                        break;
                    case "AHO-CORASICK":
                    case "AHOCORASICK":
                        List<String> patterns = Arrays.asList(pattern.split(","));
                        result = ahoCorasick.search(text, patterns, "LAB");
                        break;
                    case "SUFFIX-ARRAY":
                    case "SUFFIX ARRAY":
                        result = suffixArray.construct(text);
                        break;
                    case "KASAI-LCP":
                    case "KASAI LCP":
                    case "LCP":
                        AlgorithmResult saR = suffixArray.construct(text);
                        int[] saArr = (int[]) saR.getAlgorithmSpecificData().get("SuffixArray");
                        result = kasai.construct(text, saArr);
                        break;
                    default:
                        result = kmp.search(text, pattern, "LAB");
                }

                PerformanceMetrics pm = PerformanceMetrics.fromAlgorithmResult(result);
                StringBuilder json = new StringBuilder();
                json.append("{");
                json.append("\"algorithm\":").append(quote(result.getAlgorithmName())).append(",");
                json.append("\"matchCount\":").append(result.getMatches().size()).append(",");
                json.append("\"executionTimeNs\":").append(result.getExecutionTimeNs()).append(",");
                json.append("\"executionTimeMs\":").append(String.format(Locale.US, "%.4f", result.getExecutionTimeNs() / 1_000_000.0)).append(",");
                json.append("\"comparisons\":").append(result.getComparisons()).append(",");
                json.append("\"matches\":[");
                for (int i = 0; i < result.getMatches().size(); i++) {
                    MatchResult mr = result.getMatches().get(i);
                    if (i > 0) json.append(",");
                    json.append("{");
                    json.append("\"start\":").append(mr.getStartPosition()).append(",");
                    json.append("\"length\":").append(mr.getLength()).append(",");
                    json.append("\"text\":").append(quote(mr.getMatchedText()));
                    json.append("}");
                }
                json.append("]");
                json.append("}");

                sendJsonResponse(exchange, 200, json.toString());

            } catch (Exception e) {
                e.printStackTrace();
                sendJsonResponse(exchange, 500, "{\"error\":\"" + escapeJson(e.getMessage()) + "\"}");
            }
        }
    }

    // Helper JSON extractors with flexible whitespace support
    private static String extractJsonString(String json, String key, String defaultVal) {
        if (json == null) return defaultVal;
        Pattern p = Pattern.compile("\"" + Pattern.quote(key) + "\"\\s*:\\s*\"((?:\\\\.|[^\"\\\\])*)\"");
        Matcher m = p.matcher(json);
        if (m.find()) {
            return unescapeJson(m.group(1));
        }
        return defaultVal;
    }

    private static Map<String, String> extractReferencesMap(String json) {
        Map<String, String> map = new LinkedHashMap<>();
        if (json == null) return map;
        Pattern p = Pattern.compile("\"references\"\\s*:\\s*\\{([\\s\\S]*?)\\}");
        Matcher m = p.matcher(json);
        if (!m.find()) return map;

        String refsBlock = m.group(1);
        Pattern entryPattern = Pattern.compile("\"((?:\\\\.|[^\"\\\\])*)\"\\s*:\\s*\"((?:\\\\.|[^\"\\\\])*)\"");
        Matcher entryMatcher = entryPattern.matcher(refsBlock);
        while (entryMatcher.find()) {
            String k = unescapeJson(entryMatcher.group(1));
            String v = unescapeJson(entryMatcher.group(2));
            map.put(k, v);
        }
        return map;
    }

    private static String quote(String s) {
        if (s == null) return "\"\"";
        return "\"" + escapeJson(s) + "\"";
    }

    private static String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\b", "\\b")
                .replace("\f", "\\f")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }

    private static String unescapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\n", "\n")
                .replace("\\r", "\r")
                .replace("\\t", "\t")
                .replace("\\\"", "\"")
                .replace("\\\\", "\\");
    }
}
