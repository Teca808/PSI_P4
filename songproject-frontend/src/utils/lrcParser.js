/**
 * Parsea el contenido de un fichero .lrc y devuelve un array de líneas
 * con su timestamp en segundos, el texto y la palabra oculta (si existe).
 *
 * Formato de entrada:
 *   [ti:Does Your Mother Know]
 *   [ar:ABBA]
 *   [00:22.48]You're so {hot}, teasing me
 *
 * Formato de salida:
 *   [
 *     { time: 22.48, textBefore: "You're so ", hiddenWord: "hot", textAfter: ", teasing me" },
 *     ...
 *   ]
 *
 * Las cabeceras [ti:], [ar:], [lang:], etc. se ignoran.
 */
export function parseLrc(lrcContent) {
  const lines = []
  const rawLines = lrcContent.split('\n')

  // Regex para extraer [mm:ss.xx] al inicio de la línea
  const timestampRegex = /^\[(\d{1,2}):(\d{1,2}(?:\.\d+)?)\](.*)$/
  // Regex para detectar cabeceras del tipo [ti:...] o [ar:...] (letras, no números)
  const headerRegex = /^\[[a-zA-Z]+:/

  for (const raw of rawLines) {
    const line = raw.trim()
    if (!line) continue

    // Ignorar cabeceras (metadatos)
    if (headerRegex.test(line)) continue

    const match = line.match(timestampRegex)
    if (!match) continue

    const minutes = parseInt(match[1], 10)
    const seconds = parseFloat(match[2])
    const text = match[3]

    const timeInSeconds = minutes * 60 + seconds

    // Detectar palabra entre llaves: {palabra}
    const hiddenMatch = text.match(/^(.*?)\{([^}]+)\}(.*)$/)

    if (hiddenMatch) {
      lines.push({
        time: timeInSeconds,
        textBefore: hiddenMatch[1],
        hiddenWord: hiddenMatch[2],
        textAfter: hiddenMatch[3],
        hasGap: true,
      })
    } else {
      lines.push({
        time: timeInSeconds,
        textBefore: text,
        hiddenWord: '',
        textAfter: '',
        hasGap: false,
      })
    }
  }

  // Ordenar por tiempo por si acaso
  lines.sort((a, b) => a.time - b.time)

  return lines
}

/**
 * Dado el tiempo actual del audio y el array de líneas parseadas,
 * devuelve el índice de la línea que debe estar sonando en ese momento.
 * Si el tiempo está antes de la primera línea, devuelve -1.
 */
export function getCurrentLineIndex(currentTime, lines) {
  let idx = -1
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].time <= currentTime) {
      idx = i
    } else {
      break
    }
  }
  return idx
}