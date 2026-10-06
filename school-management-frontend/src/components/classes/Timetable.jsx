import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchClasses, fetchClassById } from "../../store/slices/classSlice";
import { fetchStaff } from "../../store/slices/staffSlice";
import timetableService from "../../services/timetableService";
import ClassTimetableView from "../timetable/ClassTimetableView";
import PrintableTimetableModal from "../timetable/PrintableTimetableModal";
import LoadingSpinner from "../common/LoadingSpinner";
import { ArrowLeftIcon, ClockIcon } from "@heroicons/react/24/outline";

const Timetable = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { classes = [], currentClass, isLoading } = useSelector((state) => state.classes);
  const { staff = [] } = useSelector((state) => state.staff);

  const [structure, setStructure] = useState(null);
  const [printModalState, setPrintModalState] = useState({
    isOpen: false,
    type: 'class',
    data: null
  });

  useEffect(() => {
    dispatch(fetchClasses({ limit: 100 }));
    dispatch(fetchClassById(id));
    dispatch(fetchStaff({ limit: 1000, role: "teacher" }));

    timetableService.getTimetableStructure().then(res => {
      if (res.success) setStructure(res.structure);
    }).catch(err => console.error(err));
  }, [dispatch, id]);

  const handleOpenPrint = (type, data) => {
    setPrintModalState({
      isOpen: true,
      type,
      data
    });
  };

  if (isLoading && !currentClass) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header with Navigation Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/classes/${id}`)}
            className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Class Schedule • {currentClass?.displayName || currentClass?.name}
            </h1>
            <p className="text-xs text-gray-500">
              Weekly timetable with real-time clash prevention
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/timetable')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all shadow-2xs"
        >
          <ClockIcon className="w-4 h-4 text-emerald-600" />
          Open Timetable Cockpit
        </button>
      </div>

      {/* Embedded Modern Class Timetable View */}
      <ClassTimetableView
        classes={classes}
        selectedClassId={id}
        onSelectClass={(newClassId) => navigate(`/classes/${newClassId}/timetable`)}
        structure={structure}
        staffList={staff}
        onOpenPrint={handleOpenPrint}
      />

      {/* Printable Modal */}
      <PrintableTimetableModal
        isOpen={printModalState.isOpen}
        onClose={() => setPrintModalState({ ...printModalState, isOpen: false })}
        printType={printModalState.type}
        printData={printModalState.data}
      />
    </div>
  );
};

export default Timetable;
