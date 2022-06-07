const CAPITAL_KEY = 'CAPITAL_KEY';
const windowGlobal = typeof window !== 'undefined' && window;

function setCapital(dataPay) {
  if (windowGlobal) return sessionStorage.setItem(CAPITAL_KEY, JSON.stringify(dataPay))
}

function deleteCapital() {
  if (windowGlobal) sessionStorage.removeItem(CAPITAL_KEY)
}

function getCapital() {
  if (windowGlobal) return JSON.parse(sessionStorage.getItem(CAPITAL_KEY))
}

export {
  setCapital,
  deleteCapital,
  getCapital
}