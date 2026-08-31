/** Ordered phase indicator: done ✓, current →, upcoming dimmed. */
export function Steps({ steps, current }: { steps: readonly string[]; current: string }) {
    if (current === 'idle') return null
    const activeIdx = current === 'done' ? steps.length : steps.indexOf(current)
    return (
        <ol className="steps">
            {steps.map((s, i) => (
                <li key={s} className={i < activeIdx ? 'done' : i === activeIdx ? 'current' : ''}>
                    {i < activeIdx ? '✓ ' : i === activeIdx ? '→ ' : '· '}
                    {s}
                </li>
            ))}
        </ol>
    )
}
