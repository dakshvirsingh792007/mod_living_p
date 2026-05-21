const ModLivingAuth = (() => {
  const LOCAL_KEY = 'modLivingAuth';
  const SESSION_KEY = 'modLivingSessionAuth';
  const ENTRY_KEY = 'modLivingEntryLoginShown';
  const LOGIN_PAGE = 'login.html';
  const HOME_PAGE = 'index (1).html';

  function safeJson(value) {
    try {
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  }

  function currentFile() {
    const file = window.location.pathname.split('/').pop();
    return file ? decodeURIComponent(file) : HOME_PAGE;
  }

  function isLoginPage() {
    return currentFile().toLowerCase() === LOGIN_PAGE;
  }

  function getUser() {
    return safeJson(localStorage.getItem(LOCAL_KEY)) || safeJson(sessionStorage.getItem(SESSION_KEY));
  }

  function setUser(user, remember) {
    const payload = JSON.stringify({
      email: user.email,
      name: user.name || user.email,
      loggedInAt: new Date().toISOString()
    });

    clearUser();
    if (remember) {
      localStorage.setItem(LOCAL_KEY, payload);
    } else {
      sessionStorage.setItem(SESSION_KEY, payload);
    }
  }

  function clearUser() {
    localStorage.removeItem(LOCAL_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  }

  function pageWithQuery() {
    return currentFile() + window.location.search + window.location.hash;
  }

  function markEntryLoginShown() {
    sessionStorage.setItem(ENTRY_KEY, 'yes');
  }

  function redirectAfterLogin() {
    markEntryLoginShown();
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');
    window.location.href = redirect || HOME_PAGE;
  }

  function requireAuth() {
    if (isLoginPage()) {
      markEntryLoginShown();
      return;
    }

    if (!sessionStorage.getItem(ENTRY_KEY)) {
      markEntryLoginShown();
      const redirect = encodeURIComponent(pageWithQuery());
      window.location.href = `${LOGIN_PAGE}?redirect=${redirect}`;
    }
  }

  function signOut() {
    clearUser();
    const authNav = document.querySelector('.auth-nav');
    if (authNav) authNav.remove();
    renderAuthButton();
  }

  function cleanGuestMode() {
    const hash = window.location.hash;
    const base = currentFile();
    const params = new URLSearchParams(window.location.search);
    params.delete('guest');
    const query = params.toString();
    return `${base}${query ? `?${query}` : ''}${hash}`;
  }

  function signIn() {
    const redirect = encodeURIComponent(currentFile() === LOGIN_PAGE ? HOME_PAGE : cleanGuestMode());
    window.location.href = `${LOGIN_PAGE}?redirect=${redirect}`;
  }

  function injectStyles() {
    if (document.getElementById('mod-living-auth-styles')) return;

    const style = document.createElement('style');
    style.id = 'mod-living-auth-styles';
    style.textContent = `
      nav{align-items:center;}
      .nav-links{margin-left:auto;justify-content:flex-end;}
      .auth-nav{display:flex;align-items:center;margin-left:1rem;}
      .auth-btn{
        border:1.5px solid var(--green,#00e676);
        border-radius:999px;
        cursor:pointer;
        font-family:'Jost',sans-serif;
        font-size:.78rem;
        font-weight:700;
        letter-spacing:.6px;
        min-width:98px;
        padding:.58rem 1.15rem;
        text-transform:uppercase;
        transition:transform .22s,box-shadow .22s,background .22s,color .22s,border-color .22s;
      }
      .auth-btn-in{
        background:var(--gradient-green,linear-gradient(135deg,#00e676,#00c853));
        color:var(--black,#080c0a);
        box-shadow:0 0 22px var(--green-glow,rgba(0,230,118,.18));
      }
      .auth-btn-in:hover{transform:translateY(-2px);box-shadow:0 8px 24px var(--green-glow-strong,rgba(0,230,118,.32));}
      .auth-btn-out{
        background:rgba(8,12,10,.55);
        color:var(--green,#00e676);
      }
      .auth-btn-out:hover{background:var(--green-dim,#0a2e14);color:var(--white,#f0fff4);box-shadow:0 0 18px var(--green-glow,rgba(0,230,118,.18));}
      @media(max-width:768px){
        .auth-nav{margin-left:auto;margin-right:.8rem;}
        .auth-btn{min-width:84px;padding:.5rem .8rem;font-size:.7rem;}
      }
    `;
    document.head.appendChild(style);
  }

  function renderAuthButton() {
    const nav = document.querySelector('nav');
    if (!nav || isLoginPage() || document.querySelector('.auth-nav')) return;

    const user = getUser();
    const wrap = document.createElement('div');
    wrap.className = 'auth-nav';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `auth-btn ${user ? 'auth-btn-out' : 'auth-btn-in'}`;
    btn.textContent = user ? 'Sign Out' : 'Sign In';
    btn.addEventListener('click', user ? signOut : signIn);

    wrap.appendChild(btn);

    const menuButton = nav.querySelector('.mobile-menu-btn');
    if (menuButton) {
      nav.insertBefore(wrap, menuButton);
    } else {
      nav.appendChild(wrap);
    }
  }

  function init() {
    requireAuth();
    injectStyles();
    renderAuthButton();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  const api = {
    getUser,
    login: setUser,
    logout: signOut,
    redirectAfterLogin
  };

  window.ModLivingAuth = api;

  return api;
})();
