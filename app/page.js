"use client";

import { DidIonMethod } from "@web5/dids";
import toast, { Toaster } from "react-hot-toast";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { Fragment, useRef, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { useDidStore } from "@/libs/zustand";
import CopyToClipboard from "react-copy-to-clipboard";
import Link from "next/link";

export default function Home() {
  const walletNameRef = useRef();
  let [isOpen, setIsOpen] = useState(false);
  let [isSubmitting, setIsSubmitting] = useState(false);

  const dids = useDidStore((state) => state.dids);
  const addADid = useDidStore((state) => state.addADid);
  const setDids = useDidStore((state) => state.setDids);

  const handleNewDid = async () => {
    setIsSubmitting(true);
    const walletName = walletNameRef.current.value;
    if (!walletName) {
      toast.dismiss();
      setIsSubmitting(false);
      return toast.error("Wallet name is required", { position: "bottom-center" });
    }

    const didIon = await DidIonMethod.create();
    addADid({ name: walletName, ...didIon });

    myToast("new DID created!");

    setIsOpen(false);
    setIsSubmitting(false);
  };

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

  const handleImport = () => {
    let input = document.createElement("input");
    input.type = "file";
    input.onchange = (e) => {
      let file = e.target.files[0];
      if (file.type !== "application/json") {
        return myToast("File not valid", "🚫");
      }

      var reader = new FileReader();
      reader.readAsText(file, "UTF-8");

      reader.onload = (readerEvent) => {
        const content = readerEvent.target.result;
        const jsonContent = JSON.parse(content);

        if (!jsonContent?.dids) {
          return myToast("Data not found", "🚫");
        }

        setDids(jsonContent?.dids);
        return myToast("Imported");
      };
    };
    input.click();
  };

  const handleExport = () => {
    if (!dids.length > 0) {
      return myToast("Data not found", "🚫");
    }

    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ dids: dids }));
    var dlAnchorElem = document.createElement("a");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "idendidy.json");
    dlAnchorElem.click();
  };

  return (
    <main className="h-screen bg-zinc-950 text-white p-0 sm:p-8">
      <div className="w-full flex flex-col sm:max-w-md mx-auto h-full rounded-none sm:rounded-xl bg-zinc-900 border border-zinc-800 py-4 pl-4">
        <div className="flex items-center justify-between mb-4 shrink-0 pr-2">
          <div className="flex items-center gap-2">
            <Icon icon="heroicons:finger-print-16-solid" className="w-7 h-7" />
            <h1 className="text-xl font-bold">
              Iden<span className="text-orange-500">did</span>y
            </h1>
          </div>
          <div className="flex items-center gap-0">
            <button
              className="bg-orange-600 flex items-center gap-1 px-4 py-2 text-sm font-semibold rounded-md hover:bg-orange-700 transition-all"
              onClick={() => setIsOpen(true)}
            >
              <Icon icon="heroicons:plus-16-solid" className="w-4 h-4" />
              New DID
            </button>
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="inline-flex w-full justify-center rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
                  <Icon icon="pepicons-pop:dots-y" className="w-6 h-6" />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute z-20 right-0 mt-2 w-44 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                  <div className="px-1 py-1 ">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => handleImport()}
                          className={`${
                            active ? "bg-orange-500 text-white" : "text-gray-900"
                          } gap-2 group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        >
                          <Icon icon="uil:import" className="w-4 h-4" />
                          Import
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => handleExport()}
                          className={`${
                            active ? "bg-orange-500 text-white" : "text-gray-900"
                          } gap-2 group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        >
                          <Icon icon="uil:export" className="w-4 h-4" />
                          Export
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto scrollbar scrollbar-w-1 scrollbar-thumb-orange-500 scrollbar-track-zinc-700 pr-3">
          {dids.length > 0 ? (
            <>
              {dids.map((i) => (
                <div key={i.did} className="bg-zinc-800 rounded-xl p-4 border border-zinc-800 hover:bg-zinc-950 transition-all group relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <h5 className="mb-2">{i.name}</h5>
                    <div className="sm:translate-x-24 sm:group-hover:translate-x-0 sm:opacity-0 sm:transition-all sm:duration-300 sm:group-hover:opacity-100">
                      <Link href={`/${i.canonicalId}`} className="flex items-center gap-2 text-white/50 sm:text-orange-500 font-medium">
                        <p className="text-sm sm:text-xs">Detail</p>
                        <Icon icon="teenyicons:arrow-right-solid" />
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-white/10 p-3 rounded-md gap-2">
                    <p className="truncate flex-1 text-white/60">{i.did}</p>
                    <CopyToClipboard text={i.did} onCopy={() => myToast("Tbe " + i.name + " is copied", "✅")}>
                      <button className="shrink-0 hover:text-orange-500 hover:scale-110 transition-all active:scale-95">
                        <Icon icon="uil:copy" className="w-6 h-6" />
                      </button>
                    </CopyToClipboard>
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
              <button
                className="bg-orange-600 flex items-center gap-1 px-4 py-2 text-sm font-semibold rounded-md hover:bg-orange-700 transition-all"
                onClick={() => setIsOpen(true)}
              >
                <Icon icon="heroicons:plus-16-solid" className="w-4 h-4" />
                New DID
              </button>
            </div>
          )}
        </div>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-zinc-900">
                    Create new DID
                  </Dialog.Title>

                  <div className="mt-2">
                    <input type="text" ref={walletNameRef} className="w-full border border-gray-300 rounded-md px-4 py-2" placeholder="Wallet name" />
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center gap-1 rounded-md border border-transparent bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 transition-all disabled:contrast-50 disabled:hover:bg-orange-600 disabled:cursor-not-allowed"
                      onClick={() => handleNewDid()}
                      disabled={isSubmitting}
                    >
                      {isSubmitting && <Icon icon="mingcute:loading-fill" className="animate-spin" />}
                      Submit
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-orange-100 px-4 py-2 text-sm font-medium text-orange-900 hover:bg-orange-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 transition-all disabled:contrast-50 disabled:hover:bg-orange-600 disabled:cursor-not-allowed"
                      onClick={() => setIsOpen(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Toaster />
    </main>
  );
}
