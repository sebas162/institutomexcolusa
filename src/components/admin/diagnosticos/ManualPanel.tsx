"use client";

import { AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { MANUAL_INTRO, MANUAL_SECTIONS, MANUAL_TITLE, type ManualBlock } from "./manual-content";

function Block({ block }: { block: ManualBlock }) {
  switch (block.type) {
    case "paragraph":
      return <p className="leading-relaxed">{block.text}</p>;

    case "list": {
      const List = block.ordered ? "ol" : "ul";
      return (
        <List className={`flex flex-col gap-2 pl-5 leading-relaxed ${block.ordered ? "list-decimal" : "list-disc"}`}>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </List>
      );
    }

    case "table":
      return (
        <>
          {/* Móvil: una ficha por fila, para que se lea sin deslizar de lado. */}
          <ul className="flex flex-col gap-2 md:hidden">
            {block.rows.map((row) => (
              <li key={row[0]} className="flex flex-col gap-1.5 rounded-xl border p-3 text-sm">
                <span className="font-semibold">{row[0]}</span>
                {row.slice(1).map((cell, i) => (
                  <span key={i} className="leading-relaxed">
                    <span className="text-muted-foreground">{block.headers[i + 1]}: </span>
                    {cell}
                  </span>
                ))}
              </li>
            ))}
          </ul>
          <div className="hidden overflow-x-auto rounded-xl border md:block">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-muted">
              <tr>
                {block.headers.map((header) => (
                  <th key={header} scope="col" className="px-3 py-2 font-semibold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row[0]} className="border-t align-top">
                  {row.map((cell, i) =>
                    i === 0 ? (
                      <th key={i} scope="row" className="px-3 py-2 font-semibold">
                        {cell}
                      </th>
                    ) : (
                      <td key={i} className="px-3 py-2 leading-relaxed">
                        {cell}
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </>
      );

    case "important":
      return (
        <p className="flex items-start gap-2.5 rounded-xl border border-[#B45309] bg-[#B45309]/5 px-4 py-3 font-semibold leading-relaxed text-[#B45309]">
          <AlertTriangle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
          {block.text}
        </p>
      );
  }
}

/** Pestaña "Cómo funciona": manual de uso del equipo. Los textos viven en manual-content.ts. */
export default function ManualPanel() {
  return (
    <Card>
      <CardContent className="flex max-w-3xl flex-col gap-8 pt-6">
        <header className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">{MANUAL_TITLE}</h2>
          <p className="leading-relaxed text-muted-foreground">{MANUAL_INTRO}</p>
          <nav aria-label="Secciones del manual" className="mt-2">
            <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
              {MANUAL_SECTIONS.map((section) => (
                <li key={section.id}>
                  {/* Botón y no <a href="#…">: RouteProgress arranca su barra con enlaces internos. */}
                  <button
                    type="button"
                    onClick={() => document.getElementById(`manual-${section.id}`)?.scrollIntoView({ block: "start" })}
                    className="min-h-8 rounded font-medium text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {section.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        {MANUAL_SECTIONS.map((section) => (
          <section key={section.id} id={`manual-${section.id}`} className="flex scroll-mt-6 flex-col gap-3">
            <h3 className="text-lg font-bold text-primary">{section.title}</h3>
            {section.blocks.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </section>
        ))}
      </CardContent>
    </Card>
  );
}
