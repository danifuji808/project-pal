import { useState } from 'react';
import { CRAFT } from '../constants';
import { Card, Btn } from './ui';

export function Onboarding({ onDone }) {
  var [step, setStep] = useState(0);
  var [craft, setCraft] = useState("Knit");
  var [unit, setUnit] = useState("yards");
  var [dark, setDark] = useState(false);

  function finish(skip) {
    onDone({ defaultCraft: skip ? "Knit" : craft, defaultUnit: skip ? "yards" : unit, onboardingDone: true }, skip ? false : dark);
  }

  var steps = [
    {
      title: "Welcome to Project Pal! 🧶",
      sub: "Your crafting companion for knitting, crochet, and beyond.",
      content: (
        <div className="text-center space-y-4">
          <div className="text-6xl">🧶</div>
          <p className="text-warm-600 dark:text-warm-400 text-sm">Let's get you set up in just a few steps. You can change any of these later in Settings.</p>
        </div>
      )
    },
    {
      title: "What do you primarily make?",
      sub: "Sets your default craft for new projects.",
      content: (
        <div className="flex flex-col gap-3">
          {CRAFT.map(c => (
            <button key={c} type="button" onClick={() => setCraft(c)} className={"w-full py-3 px-5 rounded-2xl border-2 text-sm font-medium transition-all " + (craft === c ? "border-warm-500 bg-warm-100 dark:bg-warm-700 dark:border-warm-400 font-bold" : "border-warm-200 dark:border-warm-700 hover:bg-warm-50 dark:hover:bg-warm-800")}>
              {c === "Knit" ? "🪡 Knit" : c === "Crochet" ? "🪝 Crochet" : "🧵 Tunisian Crochet"}
            </button>
          ))}
        </div>
      )
    },
    {
      title: "Preferred yarn units?",
      sub: "Sets your default when logging yarn.",
      content: (
        <div className="flex flex-col gap-3">
          {[["yards","📏 Yards"], ["meters","📐 Meters"], ["grams","⚖️ Grams"]].map(x => (
            <button key={x[0]} type="button" onClick={() => setUnit(x[0])} className={"w-full py-3 px-5 rounded-2xl border-2 text-sm font-medium transition-all " + (unit === x[0] ? "border-warm-500 bg-warm-100 dark:bg-warm-700 dark:border-warm-400 font-bold" : "border-warm-200 dark:border-warm-700 hover:bg-warm-50 dark:hover:bg-warm-800")}>
              {x[1]}
            </button>
          ))}
        </div>
      )
    },
    {
      title: "Light or dark mode?",
      sub: "Pick your vibe. Change it anytime.",
      content: (
        <div className="flex gap-3">
          {[[false,"☀️ Light","Warm and bright"],[true,"🌙 Dark","Easy on the eyes"]].map(x => (
            <button key={String(x[0])} type="button" onClick={() => setDark(x[0])} className={"flex-1 py-4 px-3 rounded-2xl border-2 text-sm font-medium transition-all text-center " + (dark === x[0] ? "border-warm-500 bg-warm-100 dark:bg-warm-700 dark:border-warm-400 font-bold" : "border-warm-200 dark:border-warm-700 hover:bg-warm-50 dark:hover:bg-warm-800")}>
              <div className="text-2xl mb-1">{x[1].split(" ")[0]}</div>
              <div className="font-semibold">{x[1].split(" ")[1]}</div>
              <div className="text-xs text-warm-400 mt-0.5">{x[2]}</div>
            </button>
          ))}
        </div>
      )
    },
  ];

  var cur = steps[step];
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-warm-50 dark:bg-warm-900">
      <div className="w-full max-w-sm">
        <div className="flex gap-1.5 mb-8 justify-center">
          {steps.map((_, i) => (
            <div key={i} className={"h-1.5 rounded-full transition-all " + (i === step ? "w-8 bg-warm-500" : "w-3 " + (i < step ? "bg-warm-400" : "bg-warm-200 dark:bg-warm-700"))}/>
          ))}
        </div>
        <Card>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-warm-900 dark:text-warm-100 mb-1">{cur.title}</h2>
            <p className="text-sm text-warm-500 dark:text-warm-400">{cur.sub}</p>
          </div>
          {cur.content}
          <div className="flex gap-3 mt-6">
            {step > 0 && <Btn onClick={() => setStep(step - 1)} className="px-3">←</Btn>}
            {step < steps.length - 1
              ? <Btn variant="primary" onClick={() => setStep(step + 1)} className="flex-1">Continue →</Btn>
              : <Btn variant="primary" onClick={() => finish(false)} className="flex-1">Get started 🧶</Btn>
            }
          </div>
          <button type="button" onClick={() => finish(true)} className="w-full mt-3 text-xs text-warm-300 dark:text-warm-600 hover:text-warm-500 dark:hover:text-warm-400 transition">
            Skip setup, use defaults
          </button>
        </Card>
      </div>
    </div>
  );
}
