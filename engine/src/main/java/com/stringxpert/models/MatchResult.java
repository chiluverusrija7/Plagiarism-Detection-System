package com.stringxpert.models;

import java.util.List;

public class MatchResult {
    private final String algorithm;
    private final String sourceId;
    private final int startPosition;
    private final int endPosition;
    private final int length;
    private final String matchedText;
    private final String patternId;
    private final boolean exactVerification;

    public MatchResult(String algorithm, String sourceId, int startPosition, int length, 
                       String matchedText, String patternId, boolean exactVerification) {
        this.algorithm = algorithm;
        this.sourceId = sourceId;
        this.startPosition = startPosition;
        this.length = length;
        this.endPosition = startPosition + length - 1;
        this.matchedText = matchedText;
        this.patternId = patternId;
        this.exactVerification = exactVerification;
    }

    public String getAlgorithm() { return algorithm; }
    public String getSourceId() { return sourceId; }
    public int getStartPosition() { return startPosition; }
    public int getEndPosition() { return endPosition; }
    public int getLength() { return length; }
    public String getMatchedText() { return matchedText; }
    public String getPatternId() { return patternId; }
    public boolean isExactVerification() { return exactVerification; }

    @Override
    public String toString() {
        return "MatchResult{" +
                "algorithm='" + algorithm + '\'' +
                ", sourceId='" + sourceId + '\'' +
                ", startPosition=" + startPosition +
                ", length=" + length +
                ", matchedText='" + matchedText + '\'' +
                '}';
    }
}
