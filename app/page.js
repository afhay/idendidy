"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { useState } from "react";

// const identities = [
//   { did: "1111111111", name: "First" },
//   { did: "2222222222", name: "Second" },
//   { did: "3333333333", name: "Third" },
//   { did: "4444444444", name: "Fourth" },
//   { did: "5555555555", name: "Fifth" },
//   { did: "6666666666", name: "Sixth" },
//   { did: "7777777777", name: "Seventh" },
// ];

export default function Home() {
  const [dids, setDids] = useState([]);

  return (
    <main className="h-screen bg-zinc-950 text-white p-0 sm:p-8">
      <div className="w-full flex flex-col sm:max-w-md mx-auto h-full rounded-xl bg-zinc-900 border border-zinc-800 py-4 pl-4">
        <div className="flex items-center justify-between mb-4 shrink-0 pr-4">
          <div className="flex items-center gap-2">
            <Icon icon="heroicons:finger-print-16-solid" className="w-7 h-7" />
            <h1 className="text-xl font-bold">
              Iden<span className="text-orange-500">did</span>y
            </h1>
          </div>
          <button className="bg-orange-600 flex items-center gap-1 px-4 py-2 text-sm font-semibold rounded-md hover:bg-orange-700 transition-all">
            <Icon icon="heroicons:plus-16-solid" className="w-4 h-4" />
            New DID
          </button>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto scrollbar scrollbar-w-1 scrollbar-thumb-orange-500 scrollbar-track-zinc-700 pr-3">
          {dids.length > 0 ? (
            <>
              {dids.map((i) => (
                <div key={i.did} className="bg-zinc-800 rounded-xl p-4 border border-zinc-800 hover:bg-zinc-950 transition-all">
                  <h5 className="mb-2">{i.name}</h5>
                  <div className="flex items-center justify-between bg-white/10 p-3 rounded-md">
                    <p className="truncate flex-1">{i.did}</p>
                    <button className="shrink-0 hover:text-orange-500 hover:scale-110 transition-all active:scale-95">
                      <Icon icon="uil:copy" className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center relative">
              <div className="relative w-2/3 aspect-square mx-auto">
                <Image src="/img/looking.webp" fill alt="Looking" />
              </div>
              <p className="font-medium text-lg mt-4 mb-4">You don&apos;t have a DID</p>
              <button className="bg-orange-600 flex items-center gap-1 px-4 py-2 text-sm font-semibold rounded-md hover:bg-orange-700 transition-all">
                <Icon icon="heroicons:plus-16-solid" className="w-4 h-4" />
                New DID
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
