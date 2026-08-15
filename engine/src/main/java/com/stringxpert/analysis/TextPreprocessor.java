package com.stringxpert.analysis;

public class TextPreprocessor {
    
    private final boolean normalizeWhitespace;
    private final boolean normalizeCase;
    
    public TextPreprocessor(boolean normalizeWhitespace, boolean normalizeCase) {
        this.normalizeWhitespace = normalizeWhitespace;
        this.normalizeCase = normalizeCase;
    }
    
    /**
     * Preprocesses the text based on configuration.
     * Note: In a full system mapping offsets back to original text requires maintaining an index mapping.
     * For this phase, we apply transformations linearly if requested.
     */
    public String process(String text) {
        if (text == null) return "";
        
        String processed = text;
        
        if (normalizeWhitespace) {
            // Replace all whitespace characters (including newlines/tabs) with a single space
            // and trim leading/trailing spaces.
            processed = processed.replaceAll("\\s+", " ").trim();
        }
        
        if (normalizeCase) {
            // Lowercase mapping (Unicode safe in Java)
            processed = processed.toLowerCase();
        }
        
        return processed;
    }
    
    public static TextPreprocessor defaultPreprocessor() {
        return new TextPreprocessor(false, false);
    }
}
