// src/utils/schoolProfileHelper.js
const AppConfig = require('../models/AppConfig');
const path = require('path');
const fs = require('fs');

const DEFAULT_SCHOOL_PROFILE = {
  name: 'P.P.M. Higher Secondary School',
  shortName: 'PPMHSS',
  code: '18020',
  affiliation: 'State Board of Kerala',
  tagline: 'Excellence in Education & Character',
  address: {
    street: 'Kottukkara',
    city: 'Kondotty',
    district: 'Malappuram',
    state: 'Kerala',
    pincode: '673638',
    country: 'India'
  },
  contact: {
    phone: '+91 483 2712345',
    alternatePhone: '+91 81570 24638',
    email: 'ppmhsskottukkara@gmail.com',
    website: 'https://ppmhsskottukkara.com'
  },
  branding: {
    logoUrl: 'https://res.cloudinary.com/dmjqgjcut/image/upload/v1769946977/school-logo_uugskb.jpg',
    faviconUrl: '',
    principalSignatureUrl: '',
    schoolSealUrl: '',
    primaryColor: '#059669',
    secondaryColor: '#1e293b'
  },
  keyPersonnel: {
    principalName: 'Principal',
    principalPhone: '+91 81570 24638',
    headmasterName: '',
    headmasterPhone: '',
    sitcName: '',
    sitcPhone: '',
    ptaPresidentName: '',
    ptaPresidentPhone: ''
  }
};

let cachedProfile = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 1 minute in-memory cache

/**
 * Get current school profile configuration with fallback to defaults
 */
async function getSchoolProfile() {
  const now = Date.now();
  if (cachedProfile && (now - lastCacheTime < CACHE_TTL_MS)) {
    return cachedProfile;
  }

  try {
    const configDoc = await AppConfig.findOne({ key: 'SCHOOL_PROFILE' });
    if (configDoc && configDoc.value) {
      cachedProfile = {
        ...DEFAULT_SCHOOL_PROFILE,
        ...configDoc.value,
        address: { ...DEFAULT_SCHOOL_PROFILE.address, ...(configDoc.value.address || {}) },
        contact: { ...DEFAULT_SCHOOL_PROFILE.contact, ...(configDoc.value.contact || {}) },
        branding: { ...DEFAULT_SCHOOL_PROFILE.branding, ...(configDoc.value.branding || {}) },
        keyPersonnel: { ...DEFAULT_SCHOOL_PROFILE.keyPersonnel, ...(configDoc.value.keyPersonnel || {}) }
      };
    } else {
      cachedProfile = DEFAULT_SCHOOL_PROFILE;
    }
  } catch (err) {
    console.error('Error fetching SCHOOL_PROFILE from DB:', err.message);
    cachedProfile = DEFAULT_SCHOOL_PROFILE;
  }

  lastCacheTime = now;
  return cachedProfile;
}

/**
 * Invalidate the memory cache when settings change
 */
function invalidateSchoolProfileCache() {
  cachedProfile = null;
  lastCacheTime = 0;
}

/**
 * Get base64 Data URI for school logo (ideal for offline PDF rendering)
 */
async function getSchoolLogoDataUri() {
  const profile = await getSchoolProfile();
  const logoUrl = profile.branding?.logoUrl;

  if (logoUrl && logoUrl.startsWith('data:')) {
    return logoUrl;
  }

  // If local file path in /uploads/
  if (logoUrl && logoUrl.startsWith('/uploads/')) {
    try {
      const localPath = path.join(__dirname, '../../', logoUrl);
      if (fs.existsSync(localPath)) {
        const ext = path.extname(localPath).replace('.', '') || 'png';
        const buf = fs.readFileSync(localPath);
        return `data:image/${ext};base64,${buf.toString('base64')}`;
      }
    } catch (e) {
      console.error('Error reading local logo file:', e);
    }
  }

  return logoUrl || DEFAULT_SCHOOL_PROFILE.branding.logoUrl;
}

module.exports = {
  DEFAULT_SCHOOL_PROFILE,
  getSchoolProfile,
  invalidateSchoolProfileCache,
  getSchoolLogoDataUri
};
