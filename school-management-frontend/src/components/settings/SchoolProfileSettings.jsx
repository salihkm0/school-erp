// src/components/settings/SchoolProfileSettings.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSchoolProfile, updateSchoolProfile, uploadSchoolBranding } from '../../store/slices/schoolProfileSlice';
import {
  BuildingOffice2Icon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  IdentificationIcon,
  PhotoIcon,
  DocumentCheckIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  EyeIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const SchoolProfileSettings = () => {
  const dispatch = useDispatch();
  const { profile, loading } = useSelector((state) => state.schoolProfile);

  const [formData, setFormData] = useState({
    name: '',
    shortName: '',
    code: '',
    affiliation: '',
    tagline: '',
    address: {
      street: '',
      city: '',
      district: '',
      state: '',
      pincode: '',
      country: 'India',
    },
    contact: {
      phone: '',
      alternatePhone: '',
      email: '',
      website: '',
    },
    branding: {
      logoUrl: '',
      faviconUrl: '',
      principalSignatureUrl: '',
      schoolSealUrl: '',
      primaryColor: '#059669',
      secondaryColor: '#1e293b',
    },
    keyPersonnel: {
      principalName: '',
      principalPhone: '',
      headmasterName: '',
      headmasterPhone: '',
      sitcName: '',
      sitcPhone: '',
      ptaPresidentName: '',
      ptaPresidentPhone: '',
    },
  });

  const [activeSubTab, setActiveSubTab] = useState('identity');
  const [isUploading, setIsUploading] = useState({ logo: false, signature: false, seal: false });
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    dispatch(fetchSchoolProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        shortName: profile.shortName || '',
        code: profile.code || '',
        affiliation: profile.affiliation || '',
        tagline: profile.tagline || '',
        address: {
          street: profile.address?.street || '',
          city: profile.address?.city || '',
          district: profile.address?.district || '',
          state: profile.address?.state || '',
          pincode: profile.address?.pincode || '',
          country: profile.address?.country || 'India',
        },
        contact: {
          phone: profile.contact?.phone || '',
          alternatePhone: profile.contact?.alternatePhone || '',
          email: profile.contact?.email || '',
          website: profile.contact?.website || '',
        },
        branding: {
          logoUrl: profile.branding?.logoUrl || '',
          faviconUrl: profile.branding?.faviconUrl || '',
          principalSignatureUrl: profile.branding?.principalSignatureUrl || '',
          schoolSealUrl: profile.branding?.schoolSealUrl || '',
          primaryColor: profile.branding?.primaryColor || '#059669',
          secondaryColor: profile.branding?.secondaryColor || '#1e293b',
        },
        keyPersonnel: {
          principalName: profile.keyPersonnel?.principalName || '',
          principalPhone: profile.keyPersonnel?.principalPhone || '',
          headmasterName: profile.keyPersonnel?.headmasterName || '',
          headmasterPhone: profile.keyPersonnel?.headmasterPhone || '',
          sitcName: profile.keyPersonnel?.sitcName || '',
          sitcPhone: profile.keyPersonnel?.sitcPhone || '',
          ptaPresidentName: profile.keyPersonnel?.ptaPresidentName || '',
          ptaPresidentPhone: profile.keyPersonnel?.ptaPresidentPhone || '',
        },
      });
    }
  }, [profile]);

  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleRootChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit');
      return;
    }

    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('type', type);

    setIsUploading((prev) => ({ ...prev, [type]: true }));
    try {
      const result = await dispatch(uploadSchoolBranding(uploadData)).unwrap();
      if (result?.fileUrl) {
        let key = 'logoUrl';
        if (type === 'signature') key = 'principalSignatureUrl';
        if (type === 'seal') key = 'schoolSealUrl';
        if (type === 'favicon') key = 'faviconUrl';

        handleNestedChange('branding', key, result.fileUrl);
      }
    } catch (err) {
      // Toast handled in thunk
    } finally {
      setIsUploading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updateSchoolProfile(formData));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-800 rounded-xl p-5 sm:p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 flex items-center gap-1">
              <SparklesIcon className="w-3.5 h-3.5" /> Multi-School Configuration
            </span>
            <span className="text-xs text-emerald-200">ERP Branding Hub</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            {formData.name || 'School Profile & Branding'}
          </h2>
          <p className="text-sm text-emerald-100/80 max-w-2xl">
            Configure institutional identity, logos, contact details, and affiliations. All changes automatically reflect across web portals, PDFs, report cards, and mobile apps.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 text-sm font-medium transition-all shadow-sm"
          >
            <EyeIcon className="w-4 h-4" />
            {previewMode ? 'Edit Settings' : 'Live Document Preview'}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-900 font-semibold text-sm transition-all shadow-md disabled:opacity-50"
          >
            {loading ? (
              <ArrowPathIcon className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircleIcon className="w-4 h-4" />
            )}
            Save Changes
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-2">
        {[
          { id: 'identity', label: 'School Identity', icon: BuildingOffice2Icon },
          { id: 'branding', label: 'Logos & Visual Assets', icon: PhotoIcon },
          { id: 'location', label: 'Address & Location', icon: MapPinIcon },
          { id: 'contact', label: 'Contact & Links', icon: PhoneIcon },
          { id: 'personnel', label: 'Key Officials', icon: IdentificationIcon },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveSubTab(tab.id);
                setPreviewMode(false);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive && !previewMode
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* LIVE PREVIEW MODE */}
      {previewMode ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Official Document Letterhead & PDF Preview</h3>
              <p className="text-xs text-gray-500">Simulated rendering of report card headers and export documents</p>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-mono px-2.5 py-1 rounded-full font-medium">
              A4 Format Standard
            </span>
          </div>

          {/* Letterhead Paper Mock */}
          <div className="max-w-3xl mx-auto bg-white border-2 border-gray-800 p-8 shadow-md rounded-sm space-y-6 font-serif">
            <div className="text-center space-y-2 border-b-2 border-gray-800 pb-5">
              {formData.branding.logoUrl ? (
                <img
                  src={formData.branding.logoUrl}
                  alt="School Logo"
                  className="w-16 h-16 object-contain mx-auto mb-1"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-100 border border-dashed border-gray-400 rounded-full mx-auto flex items-center justify-center text-xs text-gray-400">
                  Logo
                </div>
              )}
              <h1 className="text-2xl font-bold uppercase tracking-wider text-gray-900">
                {formData.name || 'NAME OF THE SCHOOL'}
              </h1>
              <p className="text-xs italic text-gray-600 font-sans">
                {formData.tagline || 'Excellence in Education'}
              </p>
              <p className="text-xs text-gray-700 font-sans">
                {[formData.address.street, formData.address.city, formData.address.district, formData.address.state, formData.address.pincode]
                  .filter(Boolean)
                  .join(', ')}
              </p>
              <p className="text-xs text-gray-600 font-sans">
                {formData.contact.phone && `Tel: ${formData.contact.phone} `}
                {formData.contact.email && `| Email: ${formData.contact.email} `}
                {formData.contact.website && `| Web: ${formData.contact.website}`}
              </p>
              <div className="text-[11px] font-mono text-gray-600 font-sans mt-1">
                {formData.code && `School Code: ${formData.code} `}
                {formData.affiliation && `| Affiliation: ${formData.affiliation}`}
              </div>
            </div>

            <div className="py-4 text-center">
              <span className="inline-block px-4 py-1 text-xs font-bold uppercase tracking-widest border border-gray-800 bg-gray-50">
                Official Student Academic Report / Record
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-sans border border-gray-300 p-3 bg-gray-50/50">
              <div><span className="font-bold">Student Name:</span> John Doe</div>
              <div><span className="font-bold">Admission No:</span> 10845</div>
              <div><span className="font-bold">Class & Division:</span> Grade 10 - A</div>
              <div><span className="font-bold">Academic Year:</span> 2026 - 2027</div>
            </div>

            {/* Footer with Principal Signature */}
            <div className="pt-10 flex justify-between items-end text-xs font-sans">
              <div className="text-center space-y-1">
                {formData.branding.schoolSealUrl ? (
                  <img src={formData.branding.schoolSealUrl} alt="Seal" className="w-14 h-14 object-contain mx-auto" />
                ) : (
                  <div className="w-14 h-14 border border-dashed border-gray-300 rounded-full mx-auto flex items-center justify-center text-[10px] text-gray-400">Seal</div>
                )}
                <p className="font-bold">Institution Seal</p>
              </div>

              <div className="text-center space-y-1">
                {formData.branding.principalSignatureUrl ? (
                  <img src={formData.branding.principalSignatureUrl} alt="Signature" className="h-10 object-contain mx-auto" />
                ) : (
                  <div className="h-10 w-24 border-b border-gray-400 mx-auto" />
                )}
                <p className="font-bold">{formData.keyPersonnel.principalName || 'Principal'}</p>
                <p className="text-[10px] text-gray-500">Authorized Signature</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* EDIT FORMS */
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* TAB 1: IDENTITY */}
          {activeSubTab === 'identity' && (
            <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                <BuildingOffice2Icon className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-semibold text-gray-900">Institutional Identity</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Full Official School Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleRootChange('name', e.target.value)}
                    placeholder="e.g. Greenwood International High School"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">Appears on top of all reports, page headers, and login screens.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Short Name / Abbreviation
                  </label>
                  <input
                    type="text"
                    value={formData.shortName}
                    onChange={(e) => handleRootChange('shortName', e.target.value)}
                    placeholder="e.g. GIHS"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">Used in mobile app headers and compact breadcrumbs.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    School Code / Recognition No.
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => handleRootChange('code', e.target.value)}
                    placeholder="e.g. SCH-10482 / 18020"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Affiliation Board / Authority
                  </label>
                  <input
                    type="text"
                    value={formData.affiliation}
                    onChange={(e) => handleRootChange('affiliation', e.target.value)}
                    placeholder="e.g. CBSE / ICSE / State Board of Kerala"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Motto / Tagline
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => handleRootChange('tagline', e.target.value)}
                    placeholder="e.g. Excellence in Education & Character"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BRANDING & ASSETS */}
          {activeSubTab === 'branding' && (
            <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                <PhotoIcon className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-semibold text-gray-900">Logos & Visual Assets</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. School Logo */}
                <div className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50/50">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-900">Official School Logo</span>
                    <span className="text-[10px] text-gray-500">PNG / JPG (Square)</span>
                  </div>
                  <div className="h-36 border border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white overflow-hidden relative">
                    {formData.branding.logoUrl ? (
                      <img src={formData.branding.logoUrl} alt="Logo" className="max-h-full max-w-full object-contain p-2" />
                    ) : (
                      <div className="text-center p-3 text-gray-400">
                        <PhotoIcon className="w-8 h-8 mx-auto stroke-1" />
                        <span className="text-xs mt-1 block">No logo uploaded</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block">
                      <span className="sr-only">Upload School Logo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'logo')}
                        disabled={isUploading.logo}
                        className="block w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                      />
                    </label>
                  </div>
                </div>

                {/* 2. Principal Signature Stamp */}
                <div className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50/50">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-900">Principal Signature</span>
                    <span className="text-[10px] text-gray-500">Transparent PNG</span>
                  </div>
                  <div className="h-36 border border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white overflow-hidden relative">
                    {formData.branding.principalSignatureUrl ? (
                      <img src={formData.branding.principalSignatureUrl} alt="Signature" className="max-h-full max-w-full object-contain p-2" />
                    ) : (
                      <div className="text-center p-3 text-gray-400">
                        <DocumentCheckIcon className="w-8 h-8 mx-auto stroke-1" />
                        <span className="text-xs mt-1 block">No signature stamp</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block">
                      <span className="sr-only">Upload Principal Signature</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'signature')}
                        disabled={isUploading.signature}
                        className="block w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                      />
                    </label>
                  </div>
                </div>

                {/* 3. School Seal Stamp */}
                <div className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50/50">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-900">Official School Seal</span>
                    <span className="text-[10px] text-gray-500">Circular Stamp</span>
                  </div>
                  <div className="h-36 border border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white overflow-hidden relative">
                    {formData.branding.schoolSealUrl ? (
                      <img src={formData.branding.schoolSealUrl} alt="Seal" className="max-h-full max-w-full object-contain p-2" />
                    ) : (
                      <div className="text-center p-3 text-gray-400">
                        <IdentificationIcon className="w-8 h-8 mx-auto stroke-1" />
                        <span className="text-xs mt-1 block">No seal stamp</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block">
                      <span className="sr-only">Upload School Seal</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'seal')}
                        disabled={isUploading.seal}
                        className="block w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LOCATION & ADDRESS */}
          {activeSubTab === 'location' && (
            <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                <MapPinIcon className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-semibold text-gray-900">Campus Address & Location</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Street Address / Campus Landmark
                  </label>
                  <input
                    type="text"
                    value={formData.address.street}
                    onChange={(e) => handleNestedChange('address', 'street', e.target.value)}
                    placeholder="e.g. Kottukkara, Near Junction"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    City / Town / Taluk
                  </label>
                  <input
                    type="text"
                    value={formData.address.city}
                    onChange={(e) => handleNestedChange('address', 'city', e.target.value)}
                    placeholder="e.g. Kondotty"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    District
                  </label>
                  <input
                    type="text"
                    value={formData.address.district}
                    onChange={(e) => handleNestedChange('address', 'district', e.target.value)}
                    placeholder="e.g. Malappuram"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    State / Province
                  </label>
                  <input
                    type="text"
                    value={formData.address.state}
                    onChange={(e) => handleNestedChange('address', 'state', e.target.value)}
                    placeholder="e.g. Kerala"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    PIN / Postal Code
                  </label>
                  <input
                    type="text"
                    value={formData.address.pincode}
                    onChange={(e) => handleNestedChange('address', 'pincode', e.target.value)}
                    placeholder="e.g. 673638"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CONTACT & DIGITAL PRESENCE */}
          {activeSubTab === 'contact' && (
            <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                <PhoneIcon className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-semibold text-gray-900">Contact Details & Web Presence</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Primary Office Phone
                  </label>
                  <input
                    type="text"
                    value={formData.contact.phone}
                    onChange={(e) => handleNestedChange('contact', 'phone', e.target.value)}
                    placeholder="e.g. +91 483 2712345"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Alternate / Helpline Phone
                  </label>
                  <input
                    type="text"
                    value={formData.contact.alternatePhone}
                    onChange={(e) => handleNestedChange('contact', 'alternatePhone', e.target.value)}
                    placeholder="e.g. +91 81570 24638"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Official Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.contact.email}
                    onChange={(e) => handleNestedChange('contact', 'email', e.target.value)}
                    placeholder="e.g. office@schoolname.edu.in"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Official Website URL
                  </label>
                  <input
                    type="url"
                    value={formData.contact.website}
                    onChange={(e) => handleNestedChange('contact', 'website', e.target.value)}
                    placeholder="e.g. https://schoolname.edu.in"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: KEY PERSONNEL */}
          {activeSubTab === 'personnel' && (
            <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                <IdentificationIcon className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-semibold text-gray-900">Key Institutional Officials</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Principal Name
                  </label>
                  <input
                    type="text"
                    value={formData.keyPersonnel.principalName}
                    onChange={(e) => handleNestedChange('keyPersonnel', 'principalName', e.target.value)}
                    placeholder="e.g. Dr. A. Sharma"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Principal Contact Number
                  </label>
                  <input
                    type="text"
                    value={formData.keyPersonnel.principalPhone}
                    onChange={(e) => handleNestedChange('keyPersonnel', 'principalPhone', e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Headmaster / Vice Principal Name
                  </label>
                  <input
                    type="text"
                    value={formData.keyPersonnel.headmasterName}
                    onChange={(e) => handleNestedChange('keyPersonnel', 'headmasterName', e.target.value)}
                    placeholder="e.g. M. K. Alavi"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Headmaster Contact Number
                  </label>
                  <input
                    type="text"
                    value={formData.keyPersonnel.headmasterPhone}
                    onChange={(e) => handleNestedChange('keyPersonnel', 'headmasterPhone', e.target.value)}
                    placeholder="e.g. +91 94470 00000"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    SITC / IT In-Charge Name
                  </label>
                  <input
                    type="text"
                    value={formData.keyPersonnel.sitcName}
                    onChange={(e) => handleNestedChange('keyPersonnel', 'sitcName', e.target.value)}
                    placeholder="e.g. Technical Coordinator"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    SITC Contact Number
                  </label>
                  <input
                    type="text"
                    value={formData.keyPersonnel.sitcPhone}
                    onChange={(e) => handleNestedChange('keyPersonnel', 'sitcPhone', e.target.value)}
                    placeholder="e.g. +91 94470 11111"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Bottom Save Button */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-all shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <ArrowPathIcon className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircleIcon className="w-4 h-4" />
              )}
              Save Configuration
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SchoolProfileSettings;
