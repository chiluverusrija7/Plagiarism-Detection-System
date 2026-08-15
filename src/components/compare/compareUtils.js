/**
 * Compare text segmentation & alignment utilities.
 * Deterministically splits target and reference texts into interactive matched and unmatched spans.
 */

export function buildDocumentSpans(text, matches = [], isReference = false) {
  if (!text) return [];
  if (!matches || matches.length === 0) {
    return [{ type: 'unmatched', text }];
  }

  const spans = [];
  const normalizedSpans = [];

  matches.forEach(m => {
    let start = isReference ? (m.refStart !== undefined ? m.refStart : -1) : m.targetStart;
    let end = isReference ? (m.refEnd !== undefined ? m.refEnd : -1) : m.targetEnd;

    // If reference position is not stored directly, find it by matchedText
    if (isReference && (start === -1 || start === undefined)) {
      if (m.matchedText) {
        const foundPos = text.indexOf(m.matchedText);
        if (foundPos !== -1) {
          start = foundPos;
          end = foundPos + m.matchedText.length;
        }
      }
    }

    if (start !== undefined && end !== undefined && start >= 0 && end <= text.length && start < end) {
      normalizedSpans.push({
        matchId: m.id,
        start,
        end,
        intensity: m.intensity || 'MODERATE',
        matchedText: m.matchedText || text.substring(start, end)
      });
    }
  });

  normalizedSpans.sort((a, b) => a.start - b.start);

  // Merge overlapping spans
  const consolidated = [];
  normalizedSpans.forEach(curr => {
    if (consolidated.length === 0) {
      consolidated.push({ ...curr });
    } else {
      const prev = consolidated[consolidated.length - 1];
      if (curr.start < prev.end) {
        prev.end = Math.max(prev.end, curr.end);
        prev.matchedText = text.substring(prev.start, prev.end);
      } else {
        consolidated.push({ ...curr });
      }
    }
  });

  let cursor = 0;
  consolidated.forEach(span => {
    if (span.start > cursor) {
      spans.push({
        type: 'unmatched',
        text: text.substring(cursor, span.start)
      });
    }

    spans.push({
      type: 'match',
      matchId: span.matchId,
      intensity: span.intensity,
      start: span.start,
      end: span.end,
      text: text.substring(span.start, span.end)
    });

    cursor = span.end;
  });

  if (cursor < text.length) {
    spans.push({
      type: 'unmatched',
      text: text.substring(cursor)
    });
  }

  return spans;
}
