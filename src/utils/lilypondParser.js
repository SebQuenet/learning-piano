/**
 * LilyPond notation parser for extracting musical notes
 * Supports: basic notes, patterns, variable references, and transpositions
 */

// Base MIDI note numbers (C4 = 60)
const NOTE_BASE_MIDI = {
  c: 0,
  d: 2,
  e: 4,
  f: 5,
  g: 7,
  a: 9,
  b: 11,
};

// Semitone offsets for transposition
const TRANSPOSE_SEMITONES = {
  c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11,
};

/**
 * Converts a LilyPond note to MIDI number
 * @param {string} note - LilyPond note (e.g., "c", "d'", "e,", "fis", "bes")
 * @param {number} baseOctave - Base octave for relative notation (default 4 = middle C)
 * @param {number} previousMidi - Previous MIDI number for relative calculation
 * @returns {Object} { midiNumber, noteName }
 */
export const lilypondNoteToMidi = (note, baseOctave = 4, previousMidi = 60) => {
  // Remove fingering annotations (e.g., "c-1" -> "c")
  const cleanNote = note.replace(/-\d+/g, '').trim();

  // Extract base note name (remove accidentals and octave markers)
  const baseNoteName = cleanNote.match(/^[a-g]/)?.[0];
  if (!baseNoteName) return null;

  let midiNumber = NOTE_BASE_MIDI[baseNoteName];
  if (midiNumber === undefined) return null;

  // Handle accidentals and build display name
  let displayName = baseNoteName.toUpperCase();
  if (cleanNote.includes('is')) {
    midiNumber += 1; // sharp
    displayName += '#';
  }
  if (cleanNote.includes('es') || cleanNote.includes('as')) {
    midiNumber -= 1; // flat
    displayName += 'b';
  }

  // Add base octave
  midiNumber += baseOctave * 12;

  // Handle octave modifiers
  const upOctaves = (cleanNote.match(/'/g) || []).length;
  const downOctaves = (cleanNote.match(/,/g) || []).length;
  midiNumber += upOctaves * 12;
  midiNumber -= downOctaves * 12;

  // For relative mode, adjust to nearest octave from previous note
  if (previousMidi !== null && previousMidi !== undefined) {
    while (midiNumber - previousMidi > 6) {
      midiNumber -= 12;
    }
    while (previousMidi - midiNumber > 6) {
      midiNumber += 12;
    }
  }

  return {
    midiNumber,
    noteName: displayName,
  };
};

/**
 * Parses a LilyPond voice line and extracts notes
 * @param {string} voiceLine - LilyPond voice definition
 * @returns {Array} Array of note objects with MIDI numbers
 */
export const parseLilypondVoice = (voiceLine) => {
  const notes = [];

  // Extract the base octave from \relative command
  const relativeMatch = voiceLine.match(/\\relative\s+([a-g][',]*)/);
  let baseOctave = 4; // Default to C4
  let previousMidi = null;

  if (relativeMatch) {
    const relativeNote = relativeMatch[1];
    const temp = lilypondNoteToMidi(relativeNote, 4, null);
    if (temp) {
      previousMidi = temp.midiNumber;
      baseOctave = Math.floor(temp.midiNumber / 12);
    }
  }

  // Extract note sequence (everything between { and })
  const contentMatch = voiceLine.match(/\{([^}]+)\}/);
  if (!contentMatch) return notes;

  const content = contentMatch[1];

  // Split by bars and remove comments
  const cleanContent = content
    .replace(/%.*$/gm, '') // Remove comments
    .replace(/\\clef\s+\w+/g, '') // Remove clef commands
    .replace(/\\[a-z]+\s+[\d/]+/g, '') // Remove commands like \tempo, \key, \time
    .replace(/\\[a-z]+/g, '') // Remove other commands
    .replace(/[<>!]/g, ''); // Remove articulation markers

  // Match notes with duration (more precise pattern)
  // Pattern: note name + optional accidentals + optional octave markers + optional fingering + optional duration
  const notePattern = /\b([a-g](?:is|es|as)?[',]*(?:-\d+)?)\d*\b/g;
  let match;

  while ((match = notePattern.exec(cleanContent)) !== null) {
    const noteStr = match[1];
    if (!noteStr) continue;

    const noteData = lilypondNoteToMidi(noteStr, baseOctave, previousMidi);
    if (noteData) {
      notes.push({
        ...noteData,
        originalNotation: noteStr,
      });
      previousMidi = noteData.midiNumber;
    }
  }

  return notes;
};

/**
 * Extracts all variable definitions from LilyPond content
 * Handles nested braces properly
 * @param {string} content - LilyPond file content
 * @returns {Object} Map of variable names to their content
 */
const extractVariables = (content) => {
  const variables = {};

  // Find variable assignments
  const assignmentPattern = /(\w+)\s*=\s*\{/g;
  let match;

  while ((match = assignmentPattern.exec(content)) !== null) {
    const varName = match[1];
    let startPos = match.index + match[0].length;
    let depth = 1;
    let endPos = startPos;

    // Find matching closing brace
    while (depth > 0 && endPos < content.length) {
      if (content[endPos] === '{') depth++;
      if (content[endPos] === '}') depth--;
      endPos++;
    }

    if (depth === 0) {
      const body = content.substring(startPos, endPos - 1).trim();
      variables[varName] = body;
    }
  }

  return variables;
};

/**
 * Expands variable references and transpositions in LilyPond content
 * @param {string} content - Content with variable references
 * @param {Object} variables - Variable definitions
 * @param {number} transposeOffset - Semitone offset for transposition
 * @param {number} maxDepth - Maximum recursion depth to prevent infinite loops
 * @returns {string} Expanded content with actual notes
 */
const expandContent = (content, variables, transposeOffset = 0, maxDepth = 50) => {
  if (maxDepth <= 0) return content;

  let expanded = content;
  let changed = true;

  // Keep expanding until nothing changes (fully expanded)
  while (changed && maxDepth > 0) {
    const before = expanded;

    // Handle \transpose commands with proper brace matching
    const transposePattern = /\\transpose\s+([a-g][',]*)\s+([a-g][',]*)\s*\{/g;
    let match;
    let result = '';
    let lastIndex = 0;

    while ((match = transposePattern.exec(expanded)) !== null) {
      const from = match[1];
      const to = match[2];
      const startPos = match.index + match[0].length;
      let depth = 1;
      let endPos = startPos;

      // Find matching closing brace
      while (depth > 0 && endPos < expanded.length) {
        if (expanded[endPos] === '{') depth++;
        if (expanded[endPos] === '}') depth--;
        endPos++;
      }

      if (depth === 0) {
        const inner = expanded.substring(startPos, endPos - 1);

        const fromSemitones = TRANSPOSE_SEMITONES[from[0]] || 0;
        const toSemitones = TRANSPOSE_SEMITONES[to[0]] || 0;

        const fromOctave = (from.match(/'/g) || []).length - (from.match(/,/g) || []).length;
        const toOctave = (to.match(/'/g) || []).length - (to.match(/,/g) || []).length;

        const offset = (toSemitones - fromSemitones) + ((toOctave - fromOctave) * 12);

        result += expanded.substring(lastIndex, match.index);
        result += expandContent(inner, variables, transposeOffset + offset, maxDepth - 1);
        lastIndex = endPos;
      }
    }
    result += expanded.substring(lastIndex);
    expanded = result;

    // Handle variable references: \variableName
    const varRefPattern = /\\(\w+)\b/g;
    const currentMaxDepth = maxDepth - 1;
    expanded = expanded.replace(varRefPattern, (match, varName) => {
      if (variables[varName]) {
        return expandContent(variables[varName], variables, transposeOffset, currentMaxDepth);
      }
      return match; // Keep unknown commands as-is
    });

    changed = (before !== expanded);
    maxDepth--;
  }

  // Apply transposition to notes if needed
  if (transposeOffset !== 0) {
    const notePattern = /\b([a-g](?:is|es|as)?[',]*(?:-\d+)?)\d*\b/g;
    expanded = expanded.replace(notePattern, (match, note) => {
      return transposeNote(note, transposeOffset);
    });
  }

  return expanded;
};

/**
 * Transposes a single note by semitone offset
 * @param {string} note - Original note
 * @param {number} semitones - Semitone offset
 * @returns {string} Transposed note
 */
const transposeNote = (note, semitones) => {
  if (semitones === 0) return note;

  // Extract base note, accidentals, octave markers, and fingering
  const baseMatch = note.match(/^([a-g])(is|es|as)?([',]*)(-\d+)?$/);
  if (!baseMatch) return note;

  const [, baseName, accidental, octaves, fingering] = baseMatch;

  // Calculate current MIDI value (relative to C0)
  let midiValue = TRANSPOSE_SEMITONES[baseName] || 0;

  if (accidental === 'is') midiValue += 1;
  if (accidental === 'es' || accidental === 'as') midiValue -= 1;

  const octaveAdjust = (octaves.match(/'/g) || []).length - (octaves.match(/,/g) || []).length;
  midiValue += octaveAdjust * 12;

  // Apply transposition
  midiValue += semitones;

  // Convert back to note name
  const noteNames = ['c', 'cis', 'd', 'dis', 'e', 'f', 'fis', 'g', 'gis', 'a', 'ais', 'b'];
  const newOctave = Math.floor(midiValue / 12);
  const newPitch = ((midiValue % 12) + 12) % 12; // Handle negative values

  let newNote = noteNames[newPitch];

  // Add octave markers
  if (newOctave > 0) {
    newNote += "'".repeat(newOctave);
  } else if (newOctave < 0) {
    newNote += ",".repeat(-newOctave);
  }

  // Preserve fingering if present
  if (fingering) {
    newNote += fingering;
  }

  return newNote;
};

/**
 * Parses a complete LilyPond file
 * @param {string} content - LilyPond file content
 * @returns {Object} Parsed score with upper and lower voices
 */
export const parseLilypondFile = (content) => {
  const result = {
    upper: [],
    lower: [],
    metadata: {},
  };

  // Extract header information
  const titleMatch = content.match(/title\s*=\s*"([^"]+)"/);
  const composerMatch = content.match(/composer\s*=\s*"([^"]+)"/);

  if (titleMatch) result.metadata.title = titleMatch[1];
  if (composerMatch) result.metadata.composer = composerMatch[1];

  // Extract all variable definitions
  const variables = extractVariables(content);

  // Extract upper voice
  const upperMatch = content.match(/upper\s*=\s*\\relative\s+([a-g][',]*)\s*\{([^}]+)\}/s);
  if (upperMatch) {
    const [, relativeNote, body] = upperMatch;
    const expanded = expandContent(body, variables);
    const fullContent = `\\relative ${relativeNote} { ${expanded} }`;
    result.upper = parseLilypondVoice(fullContent);
  }

  // Extract lower voice
  const lowerMatch = content.match(/lower\s*=\s*\\relative\s+([a-g][',]*)\s*\{([^}]+)\}/s);
  if (lowerMatch) {
    const [, relativeNote, body] = lowerMatch;
    const expanded = expandContent(body, variables);
    const fullContent = `\\relative ${relativeNote} { ${expanded} }`;
    result.lower = parseLilypondVoice(fullContent);
  }

  return result;
};
