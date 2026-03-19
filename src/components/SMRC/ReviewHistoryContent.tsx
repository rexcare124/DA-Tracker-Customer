"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import Loading from "@/components/Loading";
import type { SMRCDocument } from "@/lib/firebase/smrc-types";
import PreviousResidencesModal from "./PreviousResidencesModal";
import { getSmrcApiBase } from "@/lib/smrc-api";

const PER_PAGE = 10;

export default function ReviewHistoryContent() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const currentPageRef = useRef(0);
  const fetchingRef = useRef(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [data, setData] = useState<{
    isFetching: boolean;
    data: SMRCDocument[];
    page: number;
    lastPage: number;
    totalCount: number;
  }>({
    isFetching: true,
    data: [],
    page: 1,
    lastPage: 1,
    totalCount: 0,
  });
  const [drafts, setDrafts] = useState<{
    isFetching: boolean;
    data: SMRCDocument[];
  }>({ isFetching: true, data: [] });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/dashboard/got-smrc");
      return;
    }
    if (status !== "authenticated") return;

    if (currentPageRef.current === data.page || fetchingRef.current) return;
    fetchingRef.current = true;

    fetch(
      `${getSmrcApiBase()}/my-smrc?page=${data.page}&perPage=${PER_PAGE}&status=published&user_id=${session?.user?.id}`,
      { credentials: "include" },
    )
      .then((res) => res.json())
      .then((resData) => {
        currentPageRef.current = resData.page ?? data.page;
        fetchingRef.current = false;
        setData({
          ...resData,
          isFetching: false,
        });
      })
      .catch(() => {
        fetchingRef.current = false;
        setData((prev) => ({ ...prev, isFetching: false }));
      });
  }, [status, session, data.page, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    setDrafts((prev) => ({ ...prev, isFetching: true }));
    fetch(`${getSmrcApiBase()}/my-smrc?page=1&perPage=50&status=draft&user_id=${session?.user?.id}`, {
      credentials: "include",
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((resData) => {
        setDrafts({
          isFetching: false,
          data: Array.isArray(resData.data) ? resData.data : [],
        });
      })
      .catch(() => setDrafts((prev) => ({ ...prev, isFetching: false })));
  }, [status, pathname]);

  const setPage = (page: number) => {
    setData((prev) => ({ ...prev, page }));
  };

  const handleDeleteDraft = (draftId: string) => {
    if (deletingId) return;
    setDeletingId(draftId);
    fetch(`${getSmrcApiBase()}/${encodeURIComponent(draftId)}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.error) {
          setDeletingId(null);
          return;
        }
        setDrafts((prev) => ({
          ...prev,
          data: prev.data.filter((d) => d.id !== draftId),
        }));
      })
      .finally(() => setDeletingId(null));
  };

  if (status === "loading") return <Loading />;

  return (
    <>
      <PreviousResidencesModal isOpen={showSubmitModal} onClose={() => setShowSubmitModal(false)} />
      <div className="font-lato mx-auto w-full max-w-[1140px]">
        <div className="mx-auto max-w-[1140px]">
          <h1
            className="text-center font-normal text-[#38464d]"
            style={{
              fontSize: "30px",
              lineHeight: 1.4,
              marginBottom: "30px",
            }}
          >
            Review History
          </h1>

          {data.isFetching ? (
            <div className="flex items-center justify-center py-12">
              <Loading />
            </div>
          ) : data.data.length === 0 ? (
            <p
              className="text-center font-normal text-[#38464d]"
              style={{
                fontSize: "18px",
                lineHeight: 1.4,
                marginBottom: "30px",
              }}
            >
              Apparently, you haven't posted any thoughtful reviews. Let's do someting about that.
            </p>
          ) : (
            <>
              <div className="overflow-x-auto overflow-y-hidden" style={{ margin: "30px 0" }}>
                <table
                  className="w-full border-collapse border border-[#ebebeb] font-normal text-[#38464d]"
                  style={{ fontSize: "17px" }}
                >
                  <thead>
                    <tr className="bg-[#f8f8f8] font-bold">
                      <th
                        className="border border-[#ebebeb] text-left md:whitespace-nowrap"
                        style={{ padding: "10px" }}
                      >
                        Date/Time Completed
                      </th>
                      <th
                        className="border border-[#ebebeb] text-left md:whitespace-nowrap"
                        style={{ padding: "10px" }}
                      >
                        Government/Municipality
                      </th>
                      <th
                        className="border border-[#ebebeb] text-left md:whitespace-nowrap"
                        style={{ padding: "10px" }}
                      >
                        State
                      </th>
                      <th
                        className="border border-[#ebebeb] text-left md:whitespace-nowrap"
                        style={{ padding: "10px" }}
                      >
                        Government Level
                      </th>
                      <th
                        className="border border-[#ebebeb] text-left md:whitespace-nowrap"
                        style={{ padding: "10px" }}
                      >
                        Residency
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.data.map((el) => (
                      <tr key={el.id}>
                        <td className="border border-[#ebebeb] capitalize" style={{ padding: "10px" }}>
                          <Link
                            href={`/dashboard/show-review/${el.id}`}
                            className="text-[#0b83e6dc] underline hover:no-underline"
                          >
                            {el.createdAt ? format(new Date(el.createdAt), "EEEE, MMMM d, yyyy, h:mm a") : ""}
                          </Link>
                        </td>
                        <td className="border border-[#ebebeb] capitalize" style={{ padding: "10px" }}>
                          {el.agencyName}
                        </td>
                        <td className="border border-[#ebebeb] capitalize" style={{ padding: "10px" }}>
                          {el.state}
                        </td>
                        <td className="border border-[#ebebeb] capitalize" style={{ padding: "10px" }}>
                          {el.agencyLevel}
                        </td>
                        <td className="border border-[#ebebeb] capitalize" style={{ padding: "10px" }}>
                          {el.notResident
                            ? "Not a Resident"
                            : el.currentResidence
                              ? "Current Residence"
                              : "Previous Residence"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex flex-wrap items-center justify-between" style={{ marginTop: "20px", gap: "20px" }}>
                  <p className="font-normal text-muted-foreground" style={{ fontSize: "14px" }}>
                    Showing {Math.max(1, (data.page - 1) * PER_PAGE + 1)} to{" "}
                    {Math.min(data.page * PER_PAGE, data.totalCount)} out of {data.totalCount}
                  </p>
                  {data.lastPage > 1 && (
                    <div className="flex gap-2" style={{ gap: "10px" }}>
                      {Array.from({ length: data.lastPage }, (_, i) => i + 1).map((p) => (
                        <Fragment key={p}>
                          {p === data.page ? (
                            <span
                              className="flex items-center justify-center border bg-transparent font-normal"
                              style={{
                                width: 35,
                                height: 35,
                                borderColor: "#0b83e6dc",
                                color: "#0b83e6dc",
                              }}
                            >
                              {p}
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setPage(p)}
                              className="flex cursor-pointer items-center justify-center border border-[#ebebeb] bg-transparent font-normal hover:bg-muted"
                              style={{ width: 35, height: 35 }}
                            >
                              {p}
                            </button>
                          )}
                        </Fragment>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Incomplete/Draft Reviews – always show section so users know where to find drafts */}
          <div style={{ marginTop: "40px" }}>
            <h2
              className="font-normal text-[#38464d]"
              style={{
                fontSize: "22px",
                lineHeight: 1.4,
                marginBottom: "16px",
              }}
            >
              Incomplete/Draft Reviews
            </h2>
            <p className="text-[#38464d] text-sm" style={{ marginBottom: "12px" }}>
              Reviews you saved to complete later. Click Complete to continue where you left off.
            </p>
            {drafts.isFetching ? (
              <div className="flex items-center justify-center py-8">
                <Loading />
              </div>
            ) : drafts.data.length === 0 ? (
              <p
                className="text-[#38464d] text-sm border border-[#ebebeb] rounded p-4 bg-[#f8f8f8]"
                style={{ marginBottom: "16px" }}
              >
                You have no incomplete reviews. When you leave a review in progress and choose &quot;Save Draft&quot;,
                it will appear here so you can complete it later.
              </p>
            ) : (
              <div className="overflow-x-auto overflow-y-hidden" style={{ margin: "16px 0" }}>
                <table
                  className="w-full border-collapse border border-[#ebebeb] font-normal text-[#38464d]"
                  style={{ fontSize: "17px" }}
                >
                  <thead>
                    <tr className="bg-[#f8f8f8] font-bold">
                      <th
                        className="border border-[#ebebeb] text-left md:whitespace-nowrap"
                        style={{ padding: "10px" }}
                      >
                        Date Saved
                      </th>
                      <th
                        className="border border-[#ebebeb] text-left md:whitespace-nowrap"
                        style={{ padding: "10px" }}
                      >
                        Government/Municipality
                      </th>
                      <th
                        className="border border-[#ebebeb] text-left md:whitespace-nowrap"
                        style={{ padding: "10px" }}
                      >
                        State
                      </th>
                      <th
                        className="border border-[#ebebeb] text-left md:whitespace-nowrap"
                        style={{ padding: "10px" }}
                      >
                        Government Level
                      </th>
                      <th
                        className="border border-[#ebebeb] text-left md:whitespace-nowrap"
                        style={{ padding: "10px" }}
                      >
                        Residency
                      </th>
                      <th
                        className="border border-[#ebebeb] text-left md:whitespace-nowrap"
                        style={{ padding: "10px" }}
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {drafts.data.map((el) => (
                      <tr key={el.id}>
                        <td className="border border-[#ebebeb] capitalize" style={{ padding: "10px" }}>
                          {el.updatedAt
                            ? format(new Date(el.updatedAt), "EEEE, MMMM d, yyyy, h:mm a")
                            : el.createdAt
                              ? format(new Date(el.createdAt), "EEEE, MMMM d, yyyy, h:mm a")
                              : ""}
                        </td>
                        <td className="border border-[#ebebeb] capitalize" style={{ padding: "10px" }}>
                          {el.agencyName || "—"}
                        </td>
                        <td className="border border-[#ebebeb] capitalize" style={{ padding: "10px" }}>
                          {el.state || "—"}
                        </td>
                        <td className="border border-[#ebebeb] capitalize" style={{ padding: "10px" }}>
                          {el.agencyLevel || "—"}
                        </td>
                        <td className="border border-[#ebebeb] capitalize" style={{ padding: "10px" }}>
                          {el.notResident
                            ? "Not a Resident"
                            : el.currentResidence
                              ? "Current Residence"
                              : "Previous Residence"}
                        </td>
                        <td className="border border-[#ebebeb]" style={{ padding: "10px" }}>
                          <div className="flex flex-wrap items-center gap-2">
                            <Link
                              href={`/dashboard/got-smrc?draftId=${encodeURIComponent(el.id)}`}
                              className="inline-block cursor-pointer rounded border border-[#0b83e6dc] bg-[#0b83e6dc] px-4 py-2 text-center text-sm font-normal text-white no-underline hover:opacity-90"
                            >
                              Complete
                            </Link>
                            <button
                              type="button"
                              disabled={deletingId === el.id}
                              onClick={() => handleDeleteDraft(el.id)}
                              className="cursor-pointer rounded border border-[#dc3545] bg-[#dc3545] px-4 py-2 text-center text-sm font-normal text-white hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                              {deletingId === el.id ? "Deleting…" : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="flex justify-center" style={{ marginTop: "30px" }}>
            <button
              type="button"
              onClick={() => setShowSubmitModal(true)}
              className="cursor-pointer rounded border border-[#0b83e6dc] bg-[#0b83e6dc] text-center font-normal text-white"
              style={{
                padding: "10px 16px",
                fontSize: "18px",
                borderRadius: "5px",
              }}
            >
              Submit New Review
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
