// Shared helper to extract valid JSON from AI text responses
// AI models often wrap JSON in markdown code fences or add preamble text

export function parseJsonFromAI(text: string): unknown {
  let clean = text.trim()
  // Strip markdown code fences
  const jsonMatch = clean.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/)
  if (jsonMatch) {
    clean = jsonMatch[1].trim()
  }
  // Try to find JSON object/array boundaries
  const firstBrace = clean.indexOf('{')
  const firstBracket = clean.indexOf('[')
  if (firstBrace === -1 && firstBracket === -1) {
    throw new Error('No JSON found in AI response')
  }
  const start = firstBrace >= 0 && (firstBracket < 0 || firstBrace < firstBracket) ? firstBrace : firstBracket
  const isObject = clean[start] === '{'
  const lastClose = isObject ? clean.lastIndexOf('}') : clean.lastIndexOf(']')
  if (lastClose < start) throw new Error('Malformed JSON in AI response')
  clean = clean.slice(start, lastClose + 1)
  return JSON.parse(clean)
}
