// Shared RoundFlow app sidebar — injects into [data-sidebar], highlights active by data-active
(function () {
  function icon(name) {
    const I = {
      dash: '<path d="M4 13h7V4H4v9zM13 20h7v-9h-7v9zM13 4v5h7V4h-7zM4 20h7v-5H4v5z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
      camp: '<rect x="3" y="4" width="5" height="16" rx="1.5" stroke="currentColor" stroke-width="1.7"/><rect x="10" y="4" width="5" height="11" rx="1.5" stroke="currentColor" stroke-width="1.7"/><rect x="17" y="4" width="4" height="8" rx="1.5" stroke="currentColor" stroke-width="1.7"/>',
      inf: '<circle cx="9" cy="8" r="3.2" stroke="currentColor" stroke-width="1.7"/><path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M16 6.2A3 3 0 0 1 16 12M17 14c2.5.3 4 2.3 4 4.7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
      review: '<path d="M6 3h9l4 4v14H6z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M14 3v5h5M9 13h7M9 17h7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
      bill: '<path d="M5 4h14v16l-3-2-2 2-2-2-2 2-3-2V4z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M9 9h6M9 13h4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
      portal: '<path d="M10 13a4 4 0 0 0 5.7.3l3-3A4 4 0 0 0 13 4.7l-1.7 1.6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M14 11a4 4 0 0 0-5.7-.3l-3 3A4 4 0 0 0 11 19.3l1.6-1.6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
      link: '<rect x="7" y="3" width="10" height="18" rx="2.5" stroke="currentColor" stroke-width="1.7"/><path d="M11 18h2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>'
    };
    return '<svg viewBox="0 0 24 24" fill="none">' + I[name] + '</svg>';
  }
  function link(key, href, label, count) {
    return '<a class="sb-link" data-k="' + key + '" href="' + href + '">' + icon(key) + label +
      (count ? '<span class="count">' + count + '</span>' : '') + '</a>';
  }
  const html =
    '<div class="sb-brand">' +
      '<svg class="mark" viewBox="0 0 34 34" fill="none"><circle cx="17" cy="17" r="16" fill="#B9FF66"/><path d="M17 6a11 11 0 1 0 0 22" stroke="#191A23" stroke-width="3.4"/><circle cx="17" cy="17" r="4" fill="#191A23"/></svg>' +
      'RoundFlow</div>' +
    '<div class="sb-sec">운영</div>' +
    '<nav class="sb-nav">' +
      link('dash', 'Dashboard.html', '대시보드') +
      link('camp', 'Campaigns.html', '캠페인', '8') +
      link('inf', 'Influencers.html', '인플루언서 DB') +
      link('review', 'Campaign Detail.html', '원고 검수', '12') +
      link('bill', '#', '정산') +
    '</nav>' +
    '<div class="sb-sec">외부 공유 링크</div>' +
    '<nav class="sb-nav">' +
      link('portal', 'Portal.html', '광고주 포털') +
      link('link', 'Influencer Link.html', '인플루언서 링크') +
    '</nav>' +
    '<div class="sb-foot"><div class="av">우</div><div><div class="nm">김현우</div><div class="rl">캠페인 매니저</div></div></div>';

  document.querySelectorAll('[data-sidebar]').forEach(function (el) {
    el.innerHTML = html;
    const active = el.getAttribute('data-active');
    const a = el.querySelector('.sb-link[data-k="' + active + '"]');
    if (a) a.classList.add('active');
  });
})();
