'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

type Lifter = {
    name: string;
    sex?: string;
    country?: string;
    earliest_year?: number;
    latest_year?: number;
    federations?: string[];
    meets_count?: number;
    score?: number;
    age_division?: string;
};

type Props = {
    placeholder?: string;
    limit?: number;
    onSelect?: (lifter: Lifter) => void; // called when user picks a row
};

export default function LifterAutosuggest({
    placeholder = 'Search lifter name…',
    limit = 10,
    onSelect,
}: Props) {
    const [q, setQ] = useState('');
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<Lifter[]>([]);
    const [highlight, setHighlight] = useState(0);
    const justSelectedRef = useRef(false); // use ref to prevent re-search after selection
    const rootRef = useRef<HTMLDivElement>(null);
    const listId = 'lifter-suggest-list';

  // close on outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
        if (!rootRef.current) return;
        if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  // debounced fetch
  useEffect(() => {
    // skip search if we just selected an item
    if (justSelectedRef.current) {
        justSelectedRef.current = false;
        return;
    }

    if (q.trim().length < 2) {
        setResults([]);
        setOpen(false);
        setLoading(false);
        return;
    }

    const ac = new AbortController();
    const t = setTimeout(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ q: q.trim(), limit: String(limit) });
            const res = await fetch(`/api/search-lifters?${params}`, { signal: ac.signal });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            setResults(Array.isArray(data.results) ? data.results : []);
            setOpen(true);
            setHighlight(0);
        } catch {
            if (!ac.signal.aborted) setResults([]);
            } finally {
            if (!ac.signal.aborted) setLoading(false);
        }
    }, 250);

    return () => {
        ac.abort();
        clearTimeout(t);
    };
  }, [q, limit]);

  const selectIndex = useCallback(
    (idx: number) => {
        const item = results[idx];
        if (!item) return;
        justSelectedRef.current = true; // prevent re-search when q changes
        setQ(item.name);
        setOpen(false);
        setResults([]); // clear results to prevent dropdown from showing again
        onSelect?.(item);
    },
    [results, onSelect]
  );

//   keyboard stuff
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        setOpen(true);
        return;
    }
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlight((h) => Math.min(h + 1, Math.max(results.length - 1, 0)));
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter') {
        if (open && results.length) {
        e.preventDefault();
        selectIndex(highlight);
        }
    } else if (e.key === 'Escape') {
        setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className="w-full max-w-xl">
      <div className="dropdown dropdown-open w-full">
        <div className="join w-full">
          <input
            type="text"
            className="input input-bordered join-item w-full"
            placeholder={placeholder}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => results.length && setOpen(true)}
            onKeyDown={onKeyDown}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={open}
            aria-controls={listId}
            aria-activedescendant={
              open && results[highlight] ? `option-${highlight}` : undefined
            }
          />
          <button
            type="button"
            className="btn join-item"
            onClick={() => {
                if (q.trim().length >= 2) setOpen((o) => !o);
            }}
          >
            {loading ? <span className="loading loading-spinner loading-sm" /> : 'Search'}
          </button>
        </div>

        {/* dropdown panel */}
        {open && (
          <ul
            id={listId}
            className="dropdown-content z-50 menu p-2 mt-2 shadow bg-base-100 rounded-box w-full max-h-80 overflow-auto border border-base-300"
            role="listbox"
          >
            {loading && results.length === 0 ? (
              <li className="opacity-70 pointer-events-none">
                <a>Searching…</a>
              </li>
            ) : results.length === 0 ? (
              <li className="opacity-70 pointer-events-none">
                <a>No matches</a>
              </li>
            ) : (
              results.map((r, idx) => {
                const isActive = idx === highlight;
                const sub =
                    [
                    r.sex ? `• ${r.sex}` : null,
                    r.country ? `• ${r.country}` : null,
                    
                    r.earliest_year && r.latest_year
                        ? `• ${r.earliest_year}–${r.latest_year}`
                        : null,
                    r.meets_count ? `• ${r.meets_count} meets` : null,
                    ]
                    .filter(Boolean)
                    .join(' ');

                return (
                  <li key={r.name + idx} role="option" aria-selected={isActive}>
                    <a
                        id={`option-${idx}`}
                        className={isActive ? 'bg-base-200' : ''}
                        onMouseEnter={() => setHighlight(idx)}
                        onMouseDown={(e) => {
                        // prevent input blur before click fires
                        e.preventDefault();
                        }}
                        onClick={() => selectIndex(idx)}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{r.name}</span>
                        <span className="text-xs opacity-70">{sub}</span>
                      </div>
                    </a>
                  </li>
                );
              })
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
