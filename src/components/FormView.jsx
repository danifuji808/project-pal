import { useState } from 'react';
import { useSwipeBack } from '../hooks/useSwipeBack';
import { CRAFT, TYPES } from '../constants';
import { uid, makeYarn, uniq, offMs, ms2str } from '../utils';
import { Card, Btn, Fld, Sec, StatusBtns } from './ui';

export function FormView({ initial, projects, isEdit, settings, onSave, onCancel }) {
  useSwipeBack(onCancel);
  var [form, setForm] = useState(initial);

  function sf(k, v) {
    setForm(f => {
      var n = { ...f, [k]: v };
      if (k === "pattern" && !f._nameEdited) n.name = v;
      if (k === "name") n._nameEdited = true;
      return n;
    });
  }

  function sn(i, v) { var a = form.needleSizes.slice(); a[i] = v; sf("needleSizes", a); }
  function an() { sf("needleSizes", form.needleSizes.concat([""])); }
  function rn(i) { var a = form.needleSizes.filter((_, j) => j !== i); sf("needleSizes", a.length ? a : [""]); }

  function sy(i, k, v) { var a = form.yarns.slice(); a[i] = { ...a[i], [k]: v }; sf("yarns", a); }
  function ay() { sf("yarns", form.yarns.concat([makeYarn(settings.defaultUnit)])); }
  function ry(i) { var a = form.yarns.filter((_, j) => j !== i); sf("yarns", a.length ? a : [makeYarn(settings.defaultUnit)]); }

  function save() {
    var fn = form.name || form.pattern || "Untitled";
    var cs = form.needleSizes.filter(s => s.trim());
    var cy = form.yarns.filter(y => y.brand || y.name || y.colorway);
    var pm = isEdit ? 0 : offMs(form.priorHours, form.priorMins);
    var ps = pm > 0 ? [{ id: uid(), start: null, end: null, duration: pm, note: "imported" }] : [];
    var autoWip = !isEdit && pm > 0 && form.status === "Queued" && settings.autoWip ? "WIP" : form.status;
    onSave({
      ...form,
      name: uniq(fn, projects, isEdit ? form.id : null),
      status: autoWip,
      needleSizes: cs,
      yarns: cy.length ? cy : [makeYarn(settings.defaultUnit)],
      sessions: isEdit ? form.sessions : ps.concat(form.sessions)
    });
  }

  var pm = offMs(form.priorHours, form.priorMins);

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Btn onClick={onCancel}>← Back</Btn>
        <h2 className="text-xl font-bold text-warm-800 dark:text-warm-100 flex-1">{isEdit ? "Edit project" : "New project"}</h2>
        <Btn variant="primary" onClick={save}>{isEdit ? "Save" : "Create"}</Btn>
      </div>

      <Sec label="Pattern">
        <Fld id="f-name" value={form.name} onChange={e => sf("name", e.target.value)} placeholder="Project name" className="mb-3"/>
        <Fld id="f-pattern" value={form.pattern} onChange={e => sf("pattern", e.target.value)} placeholder="Pattern name (auto-fills project name if blank)" className="mb-3"/>
        <Fld id="f-url" value={form.patternUrl || ""} onChange={e => sf("patternUrl", e.target.value)} placeholder="Pattern link (Ravelry, PDF, Drive…)" className="mb-3"/>
        <Fld id="f-size" value={form.size || ""} onChange={e => sf("size", e.target.value)} placeholder="Size (optional, e.g. S, M, 42cm)"/>
      </Sec>

      <Sec label="Craft & type">
        <div className="flex flex-wrap gap-2 mb-3">
          {CRAFT.map(c => (
            <button key={c} type="button" onClick={() => sf("craft", c)} className={"px-4 py-1.5 rounded-xl text-sm border-2 font-medium transition-all focus:outline-none active:scale-95 border-warm-400 dark:border-warm-500 " + (form.craft === c ? "bg-warm-200 dark:bg-warm-600 font-bold text-warm-900 dark:text-warm-100" : "bg-transparent text-warm-600 dark:text-warm-400 hover:bg-warm-100 dark:hover:bg-warm-700")}>
              {c}
            </button>
          ))}
        </div>
        <Fld id="f-type" as="select" value={form.type} onChange={e => sf("type", e.target.value)}>
          {TYPES.map(t => <option key={t}>{t}</option>)}
        </Fld>
      </Sec>

      <Sec label="Status">
        <StatusBtns current={form.status} onChange={v => sf("status", v)}/>
      </Sec>

      <Sec label="Needle / hook sizes">
        {form.needleSizes.map((sz, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <Fld id={"f-needle-" + i} value={sz} onChange={e => sn(i, e.target.value)} placeholder="e.g. US 7 / 4.5mm" className="flex-1"/>
            {form.needleSizes.length > 1 && <Btn variant="ghost" onClick={() => rn(i)} className="px-2">×</Btn>}
          </div>
        ))}
        <Btn onClick={an} className="mt-1 text-xs">+ Add size</Btn>
      </Sec>

      <Sec label="Yarn">
        {form.yarns.map((y, i) => {
          var sub = (parseFloat(y.amountPerSkein) || 0) * (parseFloat(y.numSkeins) || 0);
          return (
            <div key={y.id} className="border border-warm-200 dark:border-warm-600 rounded-2xl p-4 mb-3">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold text-warm-400 uppercase tracking-wider">{form.yarns.length > 1 ? "Yarn " + (i + 1) : "Yarn"}</span>
                {form.yarns.length > 1 && <Btn variant="ghost" onClick={() => ry(i)} className="text-xs px-2 py-1">× Remove</Btn>}
              </div>
              <Fld id={"y-brand-" + i} value={y.brand} onChange={e => sy(i, "brand", e.target.value)} placeholder="Brand" className="mb-2"/>
              <Fld id={"y-name-" + i} value={y.name} onChange={e => sy(i, "name", e.target.value)} placeholder="Yarn name" className="mb-2"/>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <Fld id={"y-cw-" + i} value={y.colorway} onChange={e => sy(i, "colorway", e.target.value)} placeholder="Colorway"/>
                <Fld id={"y-dl-" + i} value={y.dyeLot} onChange={e => sy(i, "dyeLot", e.target.value)} placeholder="Dye lot"/>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div className="text-xs text-warm-400 mb-1">Amount/skein</div>
                  <Fld id={"y-amt-" + i} type="number" min="0" value={y.amountPerSkein} onChange={e => sy(i, "amountPerSkein", e.target.value)} placeholder="220"/>
                </div>
                <div>
                  <div className="text-xs text-warm-400 mb-1">Unit</div>
                  <Fld id={"y-unit-" + i} as="select" value={y.unit || "yards"} onChange={e => sy(i, "unit", e.target.value)}>
                    <option value="yards">Yards</option>
                    <option value="meters">Meters</option>
                    <option value="grams">Grams</option>
                  </Fld>
                </div>
                <div>
                  <div className="text-xs text-warm-400 mb-1"># of skeins</div>
                  <Fld id={"y-sk-" + i} type="number" min="0" value={y.numSkeins} onChange={e => sy(i, "numSkeins", e.target.value)} placeholder="3"/>
                </div>
              </div>
              {sub > 0 && <div className="text-xs text-warm-500 dark:text-warm-400 mt-2">Total: {sub.toLocaleString()} {y.unit || "yards"}</div>}
            </div>
          );
        })}
        <Btn onClick={ay} className="text-xs">+ Add yarn</Btn>
      </Sec>

      <Sec label="Recipient (optional)">
        <Fld id="f-recip" value={form.recipient} onChange={e => sf("recipient", e.target.value)} placeholder="Who is this for?"/>
      </Sec>

      {!isEdit && (
        <Sec label="Prior time (optional)">
          <p className="text-xs text-warm-400 dark:text-warm-500 mb-3">Already spent time on this project? Add it here so your total is accurate.</p>
          <div className="flex items-center gap-3">
            <Fld id="f-ph" type="number" min="0" value={form.priorHours} onChange={e => sf("priorHours", e.target.value)} placeholder="0" className="w-20"/>
            <span className="text-sm text-warm-500">h</span>
            <Fld id="f-pm" type="number" min="0" max="59" value={form.priorMins} onChange={e => sf("priorMins", e.target.value)} placeholder="0" className="w-20"/>
            <span className="text-sm text-warm-500">m</span>
            {pm > 0 && <span className="text-xs text-warm-400">= {ms2str(pm)}</span>}
          </div>
        </Sec>
      )}

      <div className="flex gap-3 mt-8">
        <Btn variant="primary" onClick={save} className="flex-1">{isEdit ? "Save changes" : "Create project"}</Btn>
        <Btn onClick={onCancel}>Cancel</Btn>
      </div>
    </div>
  );
}