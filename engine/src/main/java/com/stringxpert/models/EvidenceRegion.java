package com.stringxpert.models;

import java.util.HashSet;
import java.util.Set;

public class EvidenceRegion {
    private final int startPosition;
    private final int endPosition;
    private final int length;
    private final String matchedText;
    private final String sourceId;
    private final Set<String> detectingAlgorithms;

    public EvidenceRegion(int startPosition, int length, String matchedText, String sourceId) {
        this.startPosition = startPosition;
        this.length = length;
        this.endPosition = startPosition + length - 1;
        this.matchedText = matchedText;
        this.sourceId = sourceId;
        this.detectingAlgorithms = new HashSet<>();
    }

    public void addAlgorithm(String algorithm) {
        this.detectingAlgorithms.add(algorithm);
    }

    public int getStartPosition() { return startPosition; }
    public int getEndPosition() { return endPosition; }
    public int getLength() { return length; }
    public String getMatchedText() { return matchedText; }
    public String getSourceId() { return sourceId; }
    public Set<String> getDetectingAlgorithms() { return detectingAlgorithms; }

    @Override
    public String toString() {
        return "EvidenceRegion{" +
                "start=" + startPosition +
                ", length=" + length +
                ", sourceId='" + sourceId + '\'' +
                ", algorithms=" + detectingAlgorithms +
                '}';
    }
}
