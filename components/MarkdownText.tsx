// Hafif, bağımlılıksız "kalın yazı" desteği — admin panelinde metin
// içine **kalın** yazılan kısımlar burada <strong>'e çevrilir. Tam bir
// zengin metin editörü değil ama textarea'dan çok daha ifade gücü sağlıyor.
export function MarkdownText({text}: {text: string}) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={i}>{part.slice(2, -2)}</strong>
        ) : (
          part
        )
      )}
    </>
  )
}
