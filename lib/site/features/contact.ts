// @ts-nocheck — ported 1:1 from the original site script; type it file by file.
import { $, esc, t } from '../core/util';
import { icon } from '../core/icons';

// Phase 1 (before the yield) shares this feature's functions on the shared site context;
// phase 2 runs its setup code, in the same order as the original single script.
export default function* contact(site: any) {
  Object.assign(site, { renderTopics });
  yield;
  /* ================= CONTACT ================= */
  function renderTopics() {
    const s = $('#fTopic');
    const v = s.value;
    s.innerHTML = ['tp1', 'tp2', 'tp3', 'tp4'].map(k => '<option value="' + k + '">' + esc(t(k)) + '</option>').join('');
    if (v) s.value = v
  }
  try { $('#ctForm').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.currentTarget;
    let ok = true;
    const chk = (id, cond, msg) => {
      const fl = $('#' + id).closest('.field');
      fl.classList.toggle('err', !cond);
      $('.e', fl).textContent = cond ? '' : t(msg);
      if (!cond && ok) {
        ok = false;
        $('#' + id).focus()
      }
    };
    chk('fName', $('#fName').value.trim().length > 1, 'eName');
    chk('fEmail', /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test($('#fEmail').value.trim()), 'eEmail');
    chk('fMsg', $('#fMsg').value.trim().length > 4, 'eMsg');
    const box = $('#fmMsgBox');
    if (ok) {
      box.hidden = false;
      box.innerHTML = icon('chat') + '<span>' + esc(t('fmPreview')) + '</span>'
    } else box.hidden = true
  }); } catch (e) { site.report(e, 'contact') }
}
