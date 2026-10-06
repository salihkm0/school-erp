import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  CalendarDaysIcon, 
  UserGroupIcon, 
  BuildingOffice2Icon, 
  ArrowPathRoundedSquareIcon,
  Cog6ToothIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  PrinterIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { LayoutGrid, FlaskConical, Users, School, ArrowRightLeft } from 'lucide-react';
import toast from 'react-hot-toast';

import { fetchClasses } from '../store/slices/classSlice';
import { fetchStaff } from '../store/slices/staffSlice';
import timetableService from '../services/timetableService';

import ClassTimetableView from '../components/timetable/ClassTimetableView';
import TeacherTimetableView from '../components/timetable/TeacherTimetableView';
import MasterMatrixView from '../components/timetable/MasterMatrixView';
import SubstitutionManager from '../components/timetable/SubstitutionManager';
import RoomLabScheduleView from '../components/timetable/RoomLabScheduleView';
import TimetableStructureModal from '../components/timetable/TimetableStructureModal';
import PrintableTimetableModal from '../components/timetable/PrintableTimetableModal';

const TimetablePage = () => {
  const dispatch = useDispatch();
  const { classes = [] } = useSelector((state) => state.classes);
  const { staff = [] } = useSelector((state) => state.staff);
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('class'); // 'class' | 'teacher' | 'master' | 'substitution' | 'room'
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [structure, setStructure] = useState(null);
  const [masterData, setMasterData] = useState(null);
  const [substitutionsCount, setSubstitutionsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isStructureModalOpen, setIsStructureModalOpen] = useState(false);
  const [printModalState, setPrintModalState] = useState({
    isOpen: false,
    type: 'class',
    data: null
  });

  // Load initial timetable structure & master data
  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const [structRes, masterRes, subRes] = await Promise.all([
        timetableService.getTimetableStructure(),
        timetableService.getMasterTimetable(),
        timetableService.getSubstitutions({ date: new Date().toISOString().split('T')[0] })
      ]);

      if (structRes.success) setStructure(structRes.structure);
      if (masterRes.success) setMasterData(masterRes);
      if (subRes.success) setSubstitutionsCount(subRes.count || 0);
    } catch (err) {
      console.error('Error loading timetable data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    dispatch(fetchClasses({ limit: 100 }));
    dispatch(fetchStaff({ limit: 1000, role: 'teacher' }));
    loadInitialData();
  }, [dispatch]);

  // Set default selected class & teacher once list is available
  useEffect(() => {
    if (classes.length > 0 && !selectedClassId) {
      setSelectedClassId(classes[0]._id);
    }
  }, [classes, selectedClassId]);

  useEffect(() => {
    if (staff.length > 0 && !selectedTeacherId) {
      // If logged in user is teacher, default to them
      const myStaffProfile = staff.find(s => s.userId === user?._id || s.email === user?.email);
      setSelectedTeacherId(myStaffProfile ? myStaffProfile._id : staff[0]._id);
    }
  }, [staff, user, selectedTeacherId]);

  const handleOpenPrint = (type, data) => {
    setPrintModalState({
      isOpen: true,
      type,
      data
    });
  };

  const conflictCount = masterData?.conflictCount || 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              Timetable Management Cockpit
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              v2.0 Advanced Suite
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Class schedules, teacher workloads, clash prevention, live daily substitution manager, and lab allocations.
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsStructureModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 shadow-2xs transition-all"
          >
            <Cog6ToothIcon className="w-4 h-4 text-gray-500" />
            Period Structure & Bell Timings
          </button>

          <button
            onClick={() => handleOpenPrint(activeTab === 'class' ? 'class' : activeTab === 'teacher' ? 'teacher' : 'master', {
              classes,
              structure,
              selectedDay: 'Monday'
            })}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all"
          >
            <PrinterIcon className="w-4 h-4" />
            Print Studio
          </button>
        </div>
      </div>

      {/* Analytics & Health Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Classes Scheduled */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 flex-shrink-0">
            <School className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Classes</div>
            <div className="text-xl font-extrabold text-gray-900 mt-0.5">{classes.length} Classes</div>
          </div>
        </div>

        {/* Active Teachers */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 flex-shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">Teaching Staff</div>
            <div className="text-xl font-extrabold text-gray-900 mt-0.5">{staff.length} Teachers</div>
          </div>
        </div>

        {/* Clash Engine Health */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs flex items-center gap-3.5">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center border flex-shrink-0 ${
            conflictCount > 0 
              ? 'bg-rose-50 text-rose-600 border-rose-100' 
              : 'bg-emerald-50 text-emerald-600 border-emerald-100'
          }`}>
            {conflictCount > 0 ? (
              <ExclamationTriangleIcon className="w-5 h-5" />
            ) : (
              <ShieldCheckIcon className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">Conflict Engine</div>
            <div className={`text-xl font-extrabold mt-0.5 ${conflictCount > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
              {conflictCount > 0 ? `${conflictCount} Clashes Detected` : '0 Clashes (Clean)'}
            </div>
          </div>
        </div>

        {/* Today's Substitutions */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 flex-shrink-0">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">Today's Substitutions</div>
            <div className="text-xl font-extrabold text-gray-900 mt-0.5">{substitutionsCount} Active</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('class')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'class'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <School className="w-4 h-4" />
          Class Timetables
        </button>

        <button
          onClick={() => setActiveTab('teacher')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'teacher'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Users className="w-4 h-4" />
          Teacher Schedules & Workload
        </button>

        <button
          onClick={() => setActiveTab('master')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'master'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          Master Day Matrix
        </button>

        <button
          onClick={() => setActiveTab('substitution')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'substitution'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" />
          Daily Substitution Manager
          {substitutionsCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-400 text-amber-950">
              {substitutionsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('room')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'room'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          Room & Lab Schedules
        </button>
      </div>

      {/* Main Tab View Rendering */}
      <div>
        {activeTab === 'class' && (
          <ClassTimetableView
            classes={classes}
            selectedClassId={selectedClassId}
            onSelectClass={(id) => setSelectedClassId(id)}
            structure={structure}
            staffList={staff}
            onOpenPrint={handleOpenPrint}
          />
        )}

        {activeTab === 'teacher' && (
          <TeacherTimetableView
            staffList={staff}
            selectedTeacherId={selectedTeacherId}
            onSelectTeacher={(id) => setSelectedTeacherId(id)}
            structure={structure}
            onOpenPrint={handleOpenPrint}
          />
        )}

        {activeTab === 'master' && (
          <MasterMatrixView
            masterData={masterData}
            structure={structure}
            onOpenPrint={handleOpenPrint}
          />
        )}

        {activeTab === 'substitution' && (
          <SubstitutionManager
            staffList={staff}
            classes={classes}
            structure={structure}
            onOpenPrint={handleOpenPrint}
          />
        )}

        {activeTab === 'room' && (
          <RoomLabScheduleView
            structure={structure}
            onOpenPrint={handleOpenPrint}
          />
        )}
      </div>

      {/* Period Structure & Timing Configurator Modal */}
      <TimetableStructureModal
        isOpen={isStructureModalOpen}
        onClose={() => setIsStructureModalOpen(false)}
        structure={structure}
        onStructureUpdated={(newStruct) => {
          setStructure(newStruct);
          loadInitialData();
        }}
      />

      {/* Printable High-DPI Timetable Modal */}
      <PrintableTimetableModal
        isOpen={printModalState.isOpen}
        onClose={() => setPrintModalState({ ...printModalState, isOpen: false })}
        printType={printModalState.type}
        printData={printModalState.data}
      />
    </div>
  );
};

export default TimetablePage;
