"use client";

import { useDidStore } from "@/libs/zustand";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import toast, { Toaster } from "react-hot-toast";

export default function Home() {
  const router = useRouter();
  const params = useParams();
  const dids = useDidStore((state) => state.dids);
  const setDids = useDidStore((state) => state.setDids);
  const [data, setData] = useState();

  useEffect(() => {
    setData(dids.find((o) => o.canonicalId === decodeURIComponent(params.id)));
  }, [params]);

  const myToast = (msg, emoji = "🚀") => {
    toast.dismiss();
    toast(msg, {
      position: "bottom-center",
      icon: emoji,
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
  };

  const handleDownloadDocument = () => {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data?.document));
    var dlAnchorElem = document.createElement("a");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "document.json");
    dlAnchorElem.click();
  };

  const handleDeleteDID = () => {
    const selectedDid = dids.find((o) => o.canonicalId === decodeURIComponent(params.id));
    console.log(dids.filter((o) => o.did !== selectedDid.did))
    setDids(dids.filter((o) => o.did !== selectedDid.did));
    myToast("Deleted!");
    router.push("/");
  };

  return (
    <main className="h-screen bg-zinc-950 text-white p-0 sm:p-8">
      <div className="w-full flex flex-col sm:max-w-md mx-auto h-full rounded-none sm:rounded-xl bg-zinc-900 border border-zinc-800 py-4 pl-4">
        <div className="flex items-center justify-between mb-4 shrink-0 pr-4">
          <div className="flex items-center gap-2">
            <Icon icon="heroicons:finger-print-16-solid" className="w-7 h-7" />
            <h1 className="text-xl font-bold">
              Iden<span className="text-orange-500">did</span>y
            </h1>
          </div>
          <Link href="/" className="bg-orange-600 flex items-center gap-1 px-4 py-2 text-sm font-semibold rounded-md hover:bg-orange-700 transition-all">
            <Icon icon="heroicons:arrow-left-solid" className="w-4 h-4" />
            Back
          </Link>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto scrollbar scrollbar-w-1 scrollbar-thumb-orange-500 scrollbar-track-zinc-700 pr-3">
          <div className="space-y-2">
            <label htmlFor="did" className="text-sm">
              DID
            </label>
            <div className="flex items-center justify-between rounded-md gap-4">
              <input type="text" id="did" value={data?.did} className="w-full px-2 py-2 bg-zinc-700 rounded-md text-white/80" readOnly />
              <CopyToClipboard text={data?.did} onCopy={() => myToast("Tbe DID is copied", "✅")}>
                <button className="shrink-0 hover:text-orange-500 hover:scale-110 transition-all active:scale-95">
                  <Icon icon="uil:copy" className="w-6 h-6" />
                </button>
              </CopyToClipboard>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="canonicalId" className="text-sm">
              Canonical ID
            </label>
            <div className="flex items-center justify-between rounded-md gap-4">
              <input type="text" id="canonicalId" value={data?.canonicalId} className="w-full px-2 py-2 bg-zinc-700 rounded-md text-white/80" readOnly />
              <CopyToClipboard text={data?.canonicalId} onCopy={() => myToast("Tbe Canonical ID is copied", "✅")}>
                <button className="shrink-0 hover:text-orange-500 hover:scale-110 transition-all active:scale-95">
                  <Icon icon="uil:copy" className="w-6 h-6" />
                </button>
              </CopyToClipboard>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="document" className="text-sm">
                Document
              </label>
              <button className="text-orange-500 flex items-center gap-2 text-sm hover:text-orange-600" onClick={() => handleDownloadDocument()}>
                <Icon icon="uil:import" className="w-4 h-4" />
                Download Document
              </button>
            </div>

            <textarea
              rows={10}
              id="document"
              value={JSON.stringify(data?.document)}
              className="w-full px-2 py-2 bg-zinc-700 rounded-md text-white/80"
              readOnly
            ></textarea>
          </div>
          <button
            className="bg-red-500 flex items-center w-full justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-md hover:bg-red-600 transition-all"
            onClick={() => handleDeleteDID()}
          >
            <Icon icon="uil:trash" className="w-4 h-4" />
            Delete DID
          </button>
        </div>
      </div>

      <Toaster />
    </main>
  );
}
