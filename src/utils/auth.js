const TOKEN_KEY = 'ASG_TOKEN';
const PROFILE_KEY = 'PROFILE';
const windowGlobal = typeof window !== 'undefined' && window;

function setToken(token) {
  if (windowGlobal) sessionStorage.setItem(TOKEN_KEY, token)
}


function getToken() {
  if (windowGlobal) return sessionStorage.getItem(TOKEN_KEY)
}

function deleteToken() {
  if (windowGlobal) sessionStorage.removeItem(TOKEN_KEY)
}

function setProfile(profile) {
  if (windowGlobal) return sessionStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
}

function deleteProfile() {
  if (windowGlobal) sessionStorage.removeItem(PROFILE_KEY)
}

function getProfile() {
  if (windowGlobal) return JSON.parse(sessionStorage.getItem(PROFILE_KEY))
}

function getProfileHome() {
  if (windowGlobal) {
    try {
      return JSON.parse(sessionStorage.getItem(PROFILE_KEY))['HOME']
    } catch (err) {
      return '/'
    }
  }
}

function getProfileCode() {
  if (windowGlobal) {
    try {
      return JSON.parse(sessionStorage.getItem(PROFILE_KEY))['PROFILE_CODE']
    } catch (err) {
      return undefined
    }
  }
}

function deleteOptionAsesor() {
  sessionStorage.removeItem('SHOWING_ADVERTISING')
}
export {
  setToken,
  getToken,
  deleteToken,
  setProfile,
  deleteProfile,
  getProfile,
  getProfileCode,
  getProfileHome,
  deleteOptionAsesor
}
