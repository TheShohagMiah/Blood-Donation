import { Edit3, ExternalLink, Trash2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { donationRequestData } from "../../data/donationRequest";
import RequestViewModal from "../../ui/RequestViewModal";
import DeleteUserModal from "../../ui/DeleteModal";

const getStatusStyles = (status) => {
  switch (status) {
    case "Completed":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    case "Pending":
      return "bg-amber-50 text-amber-700 border-amber-100";
    case "In Progress":
      return "bg-blue-50 text-blue-700 border-blue-100";
    default:
      return "bg-slate-50 text-slate-600 border-slate-100";
  }
};

const AllDonationRequests = () => {
  const [isActionDropdownOpen, setIsActionDropdownOpen] = useState(null);
  const [viewData, setViewData] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const handleViewModal = (data) => {
    setViewData(data);
  };

  const openDeleteModal = (item) => {
    setDeleteModal(item);
  };

  const confirmDelete = () => {
    console.log("Deleting request:", deleteModal.id);
    donationRequestData.filter((d) => d.id !== deleteModal.id);
    // Logic to update state/database goes here
    setDeleteModal(null);
  };
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsActionDropdownOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Donation Requests
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review and manage blood donation requests from the community.
          </p>
        </div>

        {/* Mobile View: High-End Card Layout (Hidden on Desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
          {donationRequestData.map((item) => (
            <div
              key={item.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {item.recipient}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Requested by {item.requester}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-sm font-bold text-red-600 bg-red-50 px-3 py-1 rounded-lg border border-red-100">
                    {item.bloodGroup}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest border ${getStatusStyles(item.status)}`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-50">
                <div>
                  <span className="block text-[10px] font-bold uppercase text-slate-400 tracking-tight">
                    Location
                  </span>
                  <span className="text-xs font-medium text-slate-700">
                    {item.hospital}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase text-slate-400 tracking-tight">
                    Schedule
                  </span>
                  <span className="text-xs font-medium text-slate-700 tabular-nums">
                    {item.date}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center relative">
                <span className="text-xs text-slate-500 tabular-nums">
                  {item.contact}
                </span>
                <button
                  onClick={() =>
                    setIsActionDropdownOpen(
                      isActionDropdownOpen === item.id ? null : item.id,
                    )
                  }
                  className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  ...
                </button>

                {isActionDropdownOpen === item.id && (
                  <div
                    ref={menuRef}
                    className="absolute right-6 top-0 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1.5 animate-in fade-in zoom-in duration-150"
                  >
                    <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors">
                      <ExternalLink size={14} className="text-slate-400" /> View
                      Details
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors">
                      <Edit3 size={14} className="text-slate-400" /> Edit
                      Request
                    </button>
                    <div className="h-px bg-slate-100 my-1" />
                    <button
                      onClick={() => openDeleteModal(item)}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors font-medium"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Industry-Standard Table (Hidden on Mobile) */}
        <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    ID
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Recipient
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Hospital & Area
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 text-center">
                    Group
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Schedule
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Status
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {donationRequestData.map((item) => (
                  <tr
                    key={item.id}
                    className="group hover:bg-slate-50/30 transition-all"
                  >
                    <td className="px-6 py-5">
                      <span className="text-[12px] text-slate-500 mt-0.5">
                        {item.id}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 leading-tight">
                          {item.recipient}
                        </span>
                        <span className="text-[12px] text-slate-500 mt-0.5">
                          By {item.requester}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm text-slate-700 font-medium">
                          {item.hospital}
                        </span>
                        <span className="text-[12px] text-slate-500 italic mt-0.5">
                          {item.location}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="inline-block text-sm font-black text-red-600 bg-red-50 w-11 py-1 rounded-md border border-red-100">
                        {item.bloodGroup}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col tabular-nums">
                        <span className="text-sm text-slate-700 font-semibold">
                          {item.date}
                        </span>
                        <span className="text-[12px] text-slate-500">
                          {item.time}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${getStatusStyles(item.status)}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right relative">
                      <button
                        onClick={() =>
                          setIsActionDropdownOpen(
                            isActionDropdownOpen === item.id ? null : item.id,
                          )
                        }
                        className="text-[16px] font-black text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        ...
                      </button>

                      {isActionDropdownOpen === item.id && (
                        <div
                          ref={menuRef}
                          className="absolute right-6 top-14 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1.5 animate-in fade-in zoom-in duration-150"
                        >
                          <button
                            onClick={() => handleViewModal(item)}
                            className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                          >
                            <ExternalLink
                              size={14}
                              className="text-slate-400"
                            />{" "}
                            View Details
                          </button>
                          <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors">
                            <Edit3 size={14} className="text-slate-400" /> Edit
                            Request
                          </button>
                          <div className="h-px bg-slate-100 my-1" />
                          <button
                            onClick={() => openDeleteModal(item)}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors font-medium"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {viewData && (
        <RequestViewModal data={viewData} onClose={() => setViewData(null)} />
      )}
      {deleteModal && (
        <DeleteUserModal
          isOpen={deleteModal}
          onClose={() => setDeleteModal(false)}
          userName={deleteModal.requester}
          onDelete={confirmDelete}
        />
      )}
      {}
    </div>
  );
};

export default AllDonationRequests;
