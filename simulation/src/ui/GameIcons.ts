/** Đảo Thiên Nguyên's illustrated vocabulary. No font or external icon dependency. */
export const ICON_ART: Record<string, { label: string; art: string }> = {
 'wild-wolf':{label:'Sói hoang',art:'<path d="M13 42q-8-9-7-17l12 7q17-9 30 0v17H17Z" fill="#9baca5"/><path d="M18 43v13m23-13v13" stroke="#708b85" stroke-width="7"/><path d="m32 18-2-13 13 9 12-7-2 18q9 17-8 21-16-1-16-14Z" fill="#a9bbb2"/><path d="m35 18-1-7 7 6m7 0 5-5-2 8" fill="#d2b59f"/><ellipse cx="44" cy="34" rx="11" ry="7" fill="#e5dec9"/><path d="M40 28h1m9-1h1" stroke="#45534b" stroke-width="3"/><path d="m41 32 6 0-3 4Z" fill="#45534b"/>'},
 'wild-boar':{label:'Lợn rừng',art:'<path d="M12 31q1-18 24-13 20 0 19 23-1 13-24 12-23 1-23-13Z" fill="#a68a6b"/><path d="M17 48v9m24-9v9" stroke="#765e47" stroke-width="7"/><path d="m36 23 2-15 9 10 10-5-2 16" fill="#a68a6b"/><ellipse cx="47" cy="37" rx="12" ry="10" fill="#c2a181"/><ellipse cx="51" cy="40" rx="8" ry="5" fill="#dcc0a0"/><path d="M48 40h1m5 0h1M42 28h1" stroke="#5b4939" stroke-width="3"/><path d="m39 40 1 8 5-4" fill="#eee0b8"/><path d="M10 36q-9-8-6-14" stroke="#a68a6b" stroke-width="4"/>'},
 'ancient-stone':{label:'Bia đá cổ',art:'<path d="M15 54 18 14Q32 2 46 14l3 40Z" fill="#8a9d8e" stroke="#586b59" stroke-width="3"/><path d="M23 20h16m-13 7 11 3m-13 6h15m-10 6 5 3" stroke="#e0d7ad" stroke-width="3" fill="none"/><path d="M9 55q10-11 18 1m13 0q10-12 16-1" stroke="#7f9c69" stroke-width="4" fill="none"/>'},
 torch:{label:'Đuốc',art:'<path d="m23 56 5-30 10 2-4 30Z" fill="#a47a4d" stroke="#654c37" stroke-width="3"/><path d="M22 27h22v8H22Z" fill="#d6b77a" stroke="#654c37" stroke-width="3"/><path d="M33 5q-18 15-10 22 14 13 23-4 3-7-6-13 0 10-7-5Z" fill="#dc8743" stroke="#9b633a" stroke-width="2"/><path d="M32 18q-8 11 0 13 11-4 0-13Z" fill="#f5d985"/>'},
  spiritStone:{label:'Linh thạch',art:'<path d="m16 45 6-27 14-11 12 22-7 28-16 2Z" fill="#72bca9" stroke="#5c6552" stroke-width="3"/><path d="m22 18 8 22 6-33m-6 33 11 17m-11-17 18-11" fill="none" stroke="#d7ecbb" stroke-width="2"/><path d="m10 25 3-6 2 6 6 2-6 2-2 6-3-6-5-2Z" fill="#dfc882"/>'},
  spiritEssence:{label:'Tinh chất',art:'<path d="M23 8h18v8l-3 5c17 17 17 35-6 37-23-2-23-20-6-37l-3-5Z" fill="#c5d8bc" stroke="#637963" stroke-width="3"/><path d="M19 37q13-9 26 0v10q-13 15-26 0Z" fill="#75baac"/><path d="m26 41 6-10 6 10-6 10Z" fill="#e7d593"/><path d="M24 9h16m-15 8h14" stroke="#8d7451" stroke-width="4"/>'},
  microchips:{label:'Vi mạch',art:'<path d="M17 17h30v30H17Z" fill="#537f7a" stroke="#584e3b" stroke-width="3"/><path d="M24 24h16v16H24Z" fill="#c9b77c"/><path d="M23 8v9m9-9v9m9-9v9M23 47v9m9-9v9m9-9v9M8 23h9m-9 9h9m-9 9h9m30-18h9m-9 9h9m-9 9h9" stroke="#c6a467" stroke-width="4"/><path d="m27 31 4 4 7-8" fill="none" stroke="#547d79" stroke-width="2"/>'},
  components:{label:'Linh kiện',art:'<path fill="#729996" d="m12 14 24-8 17 12v29L30 59 12 45Z"/><path fill="#436975" d="m12 14 18 14 23-10v29L30 59V28Z"/><path fill="#e1c883" d="m23 26 15-6 6 5-15 7Z"/><path stroke="#e1c883" d="M20 36v8m7-4v9m10-9v8m7-12v8M16 21l5 4m20-11 5 3"/>'},
  steel:{label:'Thép',art:'<path fill="#9fbdc5" d="m5 28 32-16 23 12-32 17z"/><path fill="#607c88" d="M5 28v12l23 14 32-17V24L28 41z"/><path stroke="#e2eadc" d="m12 28 23-11m-25 21 18 11 26-13m-26 5v12"/>'},
  cutStone:{label:'Đá xây',art:'<path fill="#c1d0c4" d="m6 31 28-15 24 13-28 15z"/><path fill="#839d96" d="M6 31v17l24 13 28-16V29L30 44z"/><path stroke="#e6e3c8" d="m8 39 22 12 26-14M30 44v16m-14-17v10m27-9v10"/>'},
  machineParts:{label:'Bộ phận máy',art:'<path fill="#b9ad77" d="m25 7 13-1 2 10 9-3 7 11-8 7 8 7-6 12-11-3-2 10H23l-2-10-10 3-6-12 9-7-9-7 7-11 10 3z"/><circle fill="#72919b" cx="31" cy="31" r="13"/><circle fill="#e5d3a2" cx="31" cy="31" r="6"/><path stroke="#f3dba2" d="m28 11 7-1M13 24l6-3m-6 19 6 2m26-21 5 3"/>'},
  raider: {label:'Kẻ đột kích',art:'<path fill="#713c31" d="M12 28Q12 7 32 5q20 2 20 23l7 25-15 6H20L5 53z"/><path fill="#d1a06b" d="M18 23h28v17q-14 16-28 0z"/><path fill="#402d28" d="M16 30h32v9H16z"/><path stroke="#ecd09a" d="M23 34h4m10 0h4"/><path fill="#b56742" d="m19 45 13 7 13-7 5 15H14z"/>'},
  exhaustion: { label: 'Kiệt sức thần thánh', art: '<path fill="#83aaa8" d="M22 7q-22 30-6 43 16 5 17-10 0-13-11-33zM47 18Q31 41 40 53q13 6 16-7 1-10-9-28z"/><path d="M17 29q-6 13 1 15m25-7q-3 9 2 10" stroke="#e2ddba"/>' },
  pickaxe: { label: 'Cuốc đá', art: '<path fill="#ac8051" d="M15 55 36 17l7 4-20 38z"/><path fill="#91a49d" d="M8 18q21-19 48 3l-3 9q-19-17-42-6z"/><path d="M18 19q17-8 29 4m-27 27 14-25" stroke="#dfcc9e"/>' },
  'fishing-rod': { label: 'Cần câu', art: '<path fill="none" d="M10 57 39 7q13 8 15 22" stroke="#b9945c" stroke-width="6"/><path fill="none" d="M54 29v18q0 10-8 6l-2-5" stroke="#decba0"/><path d="M18 43l7 4m4-22 7 4" stroke="#e7d3a6"/>' },
  undo: { label: 'Hoàn tác', art: '<path fill="#cdb178" d="M27 8 5 27l22 18V32h12q15 0 15 21 12-32-15-32H27z"/><path d="M17 27l4-3m14 3h8" stroke="#efdaad"/>' },
  redo: { label: 'Làm lại', art: '<g transform="translate(64 0) scale(-1 1)"><path fill="#cdb178" d="M27 8 5 27l22 18V32h12q15 0 15 21 12-32-15-32H27z"/><path d="M17 27l4-3m14 3h8" stroke="#efdaad"/></g>' },
  storage: { label: 'Kho hàng', art: '<path fill="#af8758" d="M7 18l26-10 24 11v35l-26 7-24-11z"/><path fill="#d5b984" d="M7 18l26-10 24 11-26 9z"/><path d="M31 28v33m-18-33 11 22m-11-19 11 2m14-1 12-3m-12 13 12-3M22 12l24 11"/>' },
  chart: { label: 'Thống kê', art: '<path fill="#ac8958" d="M7 56V8h5v43h47v5z"/><path fill="#91aa83" d="M18 34h9v15h-9z"/><path fill="#d1b374" d="M32 23h9v26h-9z"/><path fill="#6d9995" d="M46 12h9v37h-9z"/><path d="M20 16l15-6 12 1"/>' },
  pointer: { label: 'Chọn và ra lệnh', art: '<path fill="#e4cb97" d="M14 5l40 31-19 3-9 19z"/><path fill="#789b91" d="M35 39l11 16-7 5-11-17z"/><path d="M20 17l7 19m-7-19 17 13"/>' },
  boat: { label: 'Thuyền', art: '<path fill="#aa8053" d="M5 39h54L47 55H18z"/><path d="M31 6v33" stroke-width="4"/><path fill="#e4d0a0" d="M28 9v24H9zm7 4 19 20H35z"/><path d="M14 45h35m-27-23-8 8M7 60q8-6 16-1t17 0 17 0" stroke="#638b85"/>' },
  rainfall: {label:'Cầu Mưa',art:'<path fill="#88b3b2" d="M12 32q-10-13 5-19 3-13 18-6 14-4 16 10 14 4 6 15z"/><path fill="#6b9fbb" d="M16 37q-9 12 0 14 9-2 0-14zm16 4q-9 12 0 14 9-2 0-14zm16-4q-9 12 0 14 9-2 0-14z"/>'},
  day: { label: 'Ngày', art: '<path fill="#b1915f" d="M10 10h44v47H10z"/><path fill="#ecd8aa" d="M10 23h44v34H10z"/><path d="M21 4v13m22-13v13" stroke-width="5"/><path fill="#769a89" d="M17 30h7v7h-7zm12 0h7v7h-7zm12 0h7v7h-7zM17 43h7v7h-7zm12 0h7v7h-7z"/>' },
  island: { label: 'Thiên Nguyên', art: '<path fill="#5c9c9a" d="M5 44q12-9 26-5t28 5l-5 10H10z"/><path fill="#dec285" d="M12 42q14-18 39 0l-7 7H19z"/><path fill="#9c7048" d="M30 41l3-24h5l-2 24z"/><path fill="#679470" d="M35 18Q17 6 12 24q12-7 23-4Q42 2 55 15q-13-1-19 6Q52 17 55 30q-12-8-20-9z"/><path fill="#edbd67" d="M8 10l4-3 4 3-4 4z"/>' },
  map: { label: 'Bản đồ', art: '<path fill="#e8d4a5" d="M6 15l17-5 18 6 17-5v39l-17 5-18-6-17 5z"/><path d="M23 10v39m18-33v39"/><path fill="#6fa697" d="M10 33l9-11 4 6 10-3 8 10 12-7v12l-12 6-13-10-9 8-9-3z"/><path d="M44 22l7 5m0-5-7 5"/>' },
  population: { label: 'Cư dân', art: '<path fill="#789d91" d="M5 53v-7q0-14 14-14t14 14v7z"/><circle fill="#d6a375" cx="19" cy="23" r="9"/><path fill="#d6b066" d="M29 54V43q0-14 15-14t15 14v11z"/><circle fill="#e3bb88" cx="44" cy="19" r="10"/><path d="M37 15q8-7 14 1M12 20q8-7 14 1m-4 22 5 4m17-8-5 5"/>' },
  person: { label: 'Cư dân', art: '<circle fill="#dcb087" cx="32" cy="20" r="12"/><path fill="#67948c" d="M12 55V44q0-14 20-14t20 14v11z"/><path fill="#684b3c" d="M20 19q-1-18 14-14 14 0 10 16l-8-9-5 5-5-2z"/><path d="M25 42l7 6 7-6m-7 6v7"/>' },
  terrain: { label: 'Địa hình', art: '<path fill="#8d9c94" d="M3 53l20-38 15 25 9-17 14 30z"/><path fill="#e6dec5" d="M17 27l6-12 8 13-8-4zM41 34l6-11 6 12-6-3z"/><path fill="#6c9875" d="M3 53l10-16 8 9 17-6 8 13z"/>' },
  research: { label: 'Nghiên cứu', art: '<path fill="#986743" d="M6 16q15-6 26 2 12-8 26-2v37q-14-6-26 1-11-7-26-1z"/><path fill="#efdcaf" d="M9 10q15-3 23 7 10-10 23-7v37q-13-4-23 5-10-9-23-5z"/><path d="M32 17v35m-17-29 11 2m-11 7 11 2m12-11 11-2m-11 11 11-2"/><path fill="#759987" d="M22 40q-5-12-10-5 0 7 10 5z"/>' },
  build: { label: 'Xây dựng', art: '<path fill="#b88859" d="M11 31h39v24H11z"/><path fill="#d6b16e" d="M4 32l26-22 27 22z"/><path fill="#516f70" d="M25 39h12v16H25z"/><path d="M12 26l18-10 17 10M16 37v13m29-13v13"/><path fill="#ddd3b4" d="M40 8l10-4 9 11-7 7-5-8-24 33-5-4z"/>' },
  relicBone:{label:'Xương cốt di tích',art:'<path d="M13 14q-8-10-4-2-7 6 1 9l22 22q-3 13 6 12 4 9 12 2 8-4 2-11L29 22q3-12-5-12-6-8-11 4Z" fill="#e0cfb8" stroke="#816c71" stroke-width="3"/><path d="m20 24 19 20" stroke="#b7a495" stroke-width="3"/>'},
  bloodstone:{label:'Huyết thạch',art:'<path d="m14 46 5-28 17-12 15 25-9 28-18-1Z" fill="#b27388" stroke="#79536c" stroke-width="3"/><path d="m19 18 13 21 4-33m-4 33 10 20m-10-20 19-8" stroke="#e8b5b1" stroke-width="2" fill="none"/>'},
  biomatter:{label:'Sinh chất ổn định',art:'<path d="M22 7h20v12l-4 4q18 27 5 33H21q-13-6 5-33l-4-4Z" fill="#d6c6cf" stroke="#7b6480" stroke-width="3"/><path d="M19 39q13-8 26 0v11q-13 7-26 0Z" fill="#a57c9c"/><path d="M25 42q7-9 14 0-7 11-14 0Z" fill="#c7d4bb"/><path d="M24 8h16m-16 9h16" stroke="#8e708c" stroke-width="4"/>'},
  medicine:{label:'Thuốc băng bó',art:'<path fill="#b4c5a0" d="M18 11h28v11l5 8v28H13V30l5-8z"/><path fill="#76998b" d="M18 6h28v10H18z"/><path fill="#eee0b4" d="M18 31h28v18H18z"/><path d="M32 34v12m-6-6h12" stroke="#71916c" stroke-width="4"/>'},
  spear:{label:'Giáo đá',art:'<path fill="#a78258" d="M16 59l27-44 5 3-26 44z"/><path fill="#b6c4b5" d="M47 3l9 2-6 17-10-5z"/><path d="M41 20l8 5m-9-1 7 5"/>'},
  'padded-vest':{label:'Áo phòng vệ dệt',art:'<path fill="#829e91" d="M13 10l12-5q7 10 14 0l12 5 9 18-12 6v24H16V34L4 28z"/><path d="M19 18l26 26M19 29l24 25M28 16l17 17M19 43l22-24M19 54l26-25" stroke="#d6bb80"/>'},
  shield: { label: 'Bảo vệ', art: '<path fill="#6b928b" d="M10 11l22-5 22 5v21Q53 47 32 59 11 47 10 32z"/><path fill="#d7b977" d="M17 17l15-4 15 4v16q-2 10-15 18-13-8-15-18z"/><path fill="#74543d" d="M31 19l-9 17h7v10h6V36h7z"/><path d="M22 13l-3 6m26-6 3 6"/>' },
  creatures: { label: 'Sinh vật', art: '<path fill="#bb8d62" d="M14 44q5-14 18-14t18 14q0 14-18 8-18 6-18-8z"/><ellipse fill="#d3ad7c" cx="11" cy="26" rx="6" ry="9" transform="rotate(-25 11 26)"/><ellipse fill="#d3ad7c" cx="26" cy="16" rx="6" ry="9"/><ellipse fill="#d3ad7c" cx="42" cy="17" rx="6" ry="9"/><ellipse fill="#d3ad7c" cx="55" cy="28" rx="5" ry="8" transform="rotate(25 55 28)"/><path d="M25 43q7-5 14 0"/>' },
  clan: { label: 'Gia tộc', art: '<path d="M32 16v14M15 43V30h34v13"/><path fill="#739a86" d="M17 8l15-5 15 5-5 13H22z"/><path fill="#d8b777" d="M5 44l10-8 10 8v13H5zm34 0 10-8 10 8v13H39z"/><path d="M25 12h14M11 49h8m26 0h8"/>' },
  settings: { label: 'Tùy chọn', art: '<path fill="#b28a55" d="M27 5h10l2 9 8-4 7 7-4 8 9 2v10l-9 2 4 8-7 7-8-4-2 9H27l-2-9-8 4-7-7 4-8-9-2V27l9-2-4-8 7-7 8 4z"/><circle fill="#e2c38c" cx="32" cy="32" r="16"/><circle fill="#527c7b" cx="32" cy="32" r="7"/><path d="M20 26l4-4m17 16-4 4"/>' },
  quest: { label: 'Nhiệm vụ', art: '<path fill="#eed8a8" d="M16 6h37v46H16z"/><path fill="#a8784d" d="M10 6h10v47q0 6-5 6t-5-6zM16 48h42v7H16"/><path d="M28 16h16m-16 9h16m-16 9h9"/><path fill="#789b7c" d="M33 41l7 7 16-20 4 4-20 25-11-12z"/>' },
  food: { label: 'Thức ăn', art: '<path fill="#bd7955" d="M8 35q-3-15 13-18 14-4 22 11l8 10-10 10-11-6q-16 11-22-7z"/><path fill="#ecd6a8" d="M40 38l11 10q8-5 10 3 1 8-7 7-5 8-10 2-3-4 0-7L33 43z"/><path fill="#e2a371" d="M14 31q0-8 11-8l7 7-8 5z"/><path d="M15 43l5-3"/>' },
  wood: { label: 'Gỗ', art: '<path fill="#987044" d="M8 26l33-16 13 20-33 17z"/><path fill="#c39a61" d="M9 38l33-16 13 21-33 15z"/><ellipse fill="#e5c38e" cx="16" cy="47" rx="9" ry="12" transform="rotate(-33 16 47)"/><ellipse fill="#a87745" cx="16" cy="47" rx="4" ry="6" transform="rotate(-33 16 47)"/><path d="M28 38l17-8m-11 16 17-8m-34-13 20-10"/>' },
  stone: { label: 'Đá', art: '<path fill="#829792" d="M6 43l11-23 21-10 19 20-3 20-27 8z"/><path fill="#bec9b5" d="M17 20l21-10-3 25-18 6z"/><path fill="#5d7472" d="M35 35l22-5-3 20-27 8z"/><path d="M17 41l10 17M17 20l18 15m0 0-8 23"/>' },
  herbs: { label: 'Thảo dược', art: '<path d="M30 55l5-40m-5 30-15-9m18-2 14-10"/><path fill="#7ca375" d="M30 44Q8 47 8 25q19 0 22 19zm3-13q-3-22 23-21-2 21-23 21z"/><path fill="#d4bd74" d="M36 17q-12-6-5-14 13 1 5 14z"/><path fill="#ddbd86" d="M24 51l17 2-3 7H23z"/>' },
  'copper-ore': { label: 'Quặng đồng', art: '<path fill="#668f86" d="M6 43l11-23 23-10 17 20-4 21-26 6z"/><path fill="#c58a55" d="M20 23l15-7 6 14-14 9zM37 39l12-4 2 12-12 6zM11 42l9-5 8 12-11 3z"/><path d="M23 25l5 7m15 7 2 7"/>' },
  copper: { label: 'Đồng', art: '<path fill="#bd8051" d="M8 31l12-13h32l7 22-12 9H8z"/><path fill="#e6b27e" d="M8 31l12-13h32l-8 13z"/><path fill="#915e43" d="M44 31l8-13 7 22-12 9z"/><path d="M15 37h22m-17-14h20"/>' },
  lumber: { label: 'Ván gỗ', art: '<path fill="#bc9460" d="M6 22l38-12 14 9-38 13zM6 33l38-12 14 9-38 13zM6 44l38-12 14 9-38 13z"/><path d="M20 32v7m0 4v6m0 5v7M17 22l28-9m-28 20 28-9m-28 20 28-9"/>' },
  clay: { label: 'Đất sét', art: '<path fill="#b47b5c" d="M7 47l9-16 9 2 9-20 16 8 8 27-20 9z"/><path fill="#d49b76" d="M25 33l9-20 7 19-8 15z"/><path d="M12 47l12 3m17-2 10-3m-4-14-3-6"/>' },
  bricks: { label: 'Gạch', art: '<path fill="#bc7855" d="M5 35l22-10 31 9v17l-23 10-30-9zM8 18l20-9 27 9v15L34 43 8 35z"/><path fill="#deaa7b" d="M8 18l20-9 27 9-21 10z"/><path d="M34 28v15m1 2v16M8 25l20 7m13-7 9-4M9 44l20 5m12-5 11-5"/>' },
  pottery: { label: 'Đồ gốm', art: '<path fill="#ba8059" d="M20 10h24l-3 12q18 12 11 29-3 7-20 7T12 51q-7-17 11-29z"/><ellipse fill="#e6bc86" cx="32" cy="10" rx="12" ry="4"/><path d="M17 35q15 7 30 0m-31 9q16 6 32 0"/><path fill="#dfba81" d="M24 36l8 8 8-8-8-8z"/>' },
  wheat: { label: 'Lúa', art: '<path d="M31 59V9m-3 49L15 35m19 15 15-21"/><path fill="#dab868" d="M31 33Q9 30 15 16q17 2 16 17zm0-11Q16 17 22 7q12 0 9 15zm1 18q-3-20 17-24 3 17-17 24zm0 13q1-16 19-20-2 17-19 20z"/><path d="M22 24l8 8m10-3-8 10"/>' },
  'iron-ore': { label: 'Quặng sắt', art: '<path fill="#6a777b" d="M5 44l9-24 26-9 18 18-5 25-26 4z"/><path fill="#b3bab1" d="M15 20l20-5-6 21-15 3zM36 38l15-5-5 16-12 5z"/><path fill="#b58161" d="M8 44l11-6 8 12-12 3z"/><path d="M23 23l-5 11m25 7-5 7"/>' },
  iron: { label: 'Sắt', art: '<path fill="#7d9195" d="M5 30l13-15h34l8 27-15 8H5z"/><path fill="#c2cfbe" d="M5 30l13-15h34l-10 15z"/><path fill="#4a646d" d="M42 30l10-15 8 27-15 8z"/><path d="M12 36h24m-19-15h26"/>' },
  coal: { label: 'Than', art: '<path fill="#4c6065" d="M5 45l7-17 15-8 13 7 9-7 11 25-10 12-25 2z"/><path fill="#85938b" d="M12 28l15-8-2 19-15 8zm28-1 9-7 1 18-12 8z"/><path d="M25 39l13 7 12-8M25 39l-1 20m14-13 5 12"/>' },
  fiber: { label: 'Sợi cây', art: '<path d="M20 58l15-42m-6 42 14-41m-5 40 12-40"/><path fill="#a0b77b" d="M34 21q-14 0-8-15 13-2 8 15zm8-1q-6-17 9-15 9 7-9 15zm9 8q-3-18 10-17 8 8-10 17z"/><path fill="#dabb7a" d="M12 43l34 10-3 8L10 50z"/>' },
  cloth: { label: 'Vải', art: '<path fill="#7fa7a0" d="M13 10l40 9-8 40L5 49z"/><path fill="#c5d2bb" d="M13 10l40 9-4 9-30-7-2 10-12-3z"/><path d="M15 35l27 6M13 42l27 6m-14-22-5 26m14-23-5 26"/>' },
  fire: { label: 'Lửa trại', art: '<path fill="#a4774b" d="M8 48l43-4 6 9-43 6zM13 41l42 13-5 7L8 48z"/><path fill="#cb7a48" d="M32 5q-10 18 0 20 7-7 6-15 20 22 11 31-17 16-33 0-10-12 6-23-2 17 4 15 3-12 6-28z"/><path fill="#edca78" d="M31 28q14 12 7 19-10 7-15-1-4-7 8-18z"/>' },
  sun: { label: 'Ban ngày', art: '<path fill="#d8af61" d="M29 3h6v10h-6zm0 48h6v10h-6zM3 29h10v6H3zm48 0h10v6H51zM9 12l4-4 8 9-4 4zm34 35 4-4 9 8-4 4zM8 51l9-8 4 4-8 9zm35-34 8-9 4 4-8 9z"/><circle fill="#e5c580" cx="32" cy="32" r="17"/><path d="M23 33q4 10 13 9m3-20 4 5"/>' },
  moon: { label: 'Ban đêm', art: '<path fill="#ded7aa" d="M42 6q-13 5-10 23 4 15 24 12-8 21-28 16Q3 50 10 27q5-18 32-21z"/><path fill="#86aaa4" d="M46 11l3 8 8 3-8 3-3 8-3-8-8-3 8-3z"/><path d="M17 39q0 8 8 10"/>' },
  meal: { label: 'Bữa ăn', art: '<path fill="#d6b47c" d="M6 31h52q-2 24-26 24T6 31z"/><path fill="#72938a" d="M6 31q26-12 52 0-26 10-52 0z"/><path d="M16 40q15 8 32 0m-26-16q-8-8 0-16m10 15q-8-8 0-16m10 17q-8-8 0-16"/>' },
  sleep: { label: 'Nghỉ ngơi', art: '<path fill="#997751" d="M5 28h5v31H5zm49 7h5v24h-5z"/><path fill="#7faaa0" d="M10 29h43v22H10z"/><path fill="#e3d5b4" d="M11 29h15v12H11z"/><path d="M10 51h44m-22-13 15 3"/><path fill="#dbbd76" d="M37 6q-5 12 8 13-9 7-15-2-4-8 7-11z"/>' },
  heart: { label: 'Sức khỏe', art: '<path fill="#bb7566" d="M32 55 9 33Q-2 12 16 9q10-2 16 9 6-11 17-9 17 3 6 24z"/><path fill="#e6b09b" d="M13 19q4-8 12 0l-4 8z"/><path d="M10 38l12-8 18 17 12-7M22 30l-4 13m12-5-5 12m15-3-4 7"/>' },
  tools: { label: 'Công cụ', art: '<path fill="#aa8455" d="M14 54l24-37 6 4-24 37z"/><path fill="#9faea2" d="M9 15q22-17 45 2l-4 8q-21-12-38-1z"/><path d="M32 10l7 9m-9-1 7 5"/>' },
  axe: { label: 'Rìu', art: '<path fill="#a78052" d="M16 57l21-45 7 3-20 46z"/><path fill="#a4b4a7" d="M25 15l9-10 23 12-10 19-18-13z"/><path d="M33 11l-1 10m5-8-1 11"/>' },
  swords: { label: 'Quân sự', art: '<path fill="#c4cbb5" d="M10 5l10 4 30 34-6 6L12 16zM54 5l-10 4-30 34 6 6 32-33z"/><path fill="#b78f54" d="M33 47l14-13 5 5-14 13zM12 39l5-5 14 13-5 5z"/><path fill="#735c43" d="M43 49l6-6 11 12-6 6zM15 43l6 6-11 12-6-6z"/>' },
  trade: { label: 'Trao đổi', art: '<path fill="#9b7952" d="M8 25h44l-5 23H16z"/><path fill="#dac18b" d="M17 17h17v18H17z"/><path fill="#76998c" d="M35 13h13v22H35z"/><path d="M5 15h6l6 34h35"/><circle fill="#d5b57b" cx="22" cy="55" r="5"/><circle fill="#d5b57b" cx="44" cy="55" r="5"/><path d="M23 23h5m12-4v9"/>' },
  dialogue: { label: 'Trò chuyện', art: '<path fill="#d4c493" d="M6 10h45v31H26L13 54V41H6z"/><path fill="#759d92" d="M35 25h24v24h-7v10L42 49h-7z"/><path d="M14 19h28m-28 8h18m10 7h10m-10 7h10"/>' },
  faith: { label: 'Niềm tin', art: '<path fill="#b68c59" d="M12 55h40l-5-9H17zM24 23h16v23H24z"/><path fill="#dbba7c" d="M20 13l12-8 12 8-6 12H26z"/><path fill="#779e95" d="M13 21l13 5 6-6 6 6 13-5-5 16-14 6-14-6z"/><path d="M27 14h10m-17 17 5 3m19-3-5 3m-12 19h10"/>' },
  compass: { label: 'La bàn', art: '<circle fill="#bb9c67" cx="32" cy="34" r="25"/><circle fill="#e7d4a8" cx="32" cy="34" r="19"/><path fill="#648f88" d="M39 17l-3 21-13 13 3-21z"/><path fill="#b87658" d="M39 17l-3 21-10-8z"/><path d="M29 4h6v5M12 34h4m32 0h4m-20 16v4"/>' },
  save: { label: 'Lưu đảo', art: '<path fill="#7c9890" d="M9 6h37l10 10v42H9z"/><path fill="#e7ce9f" d="M19 6h23v19H19zm-1 30h29v22H18z"/><path fill="#a98456" d="M31 10h7v11h-7z"/><path d="M24 44h17m-17 7h17"/>' },
  lock: { label: 'Chưa mở', art: '<path fill="none" d="M19 28V18q0-14 13-14t13 14v10" stroke-width="6"/><path fill="#b69966" d="M12 26h40v30H12z"/><path fill="#526d69" d="M29 36h6v13h-6z"/><path d="M17 32h6m18 18h6"/>' },
  check: { label: 'Hoàn thành', art: '<path fill="#6c9984" d="M4 32l13-13 13 12L48 8l12 10-30 40z"/><path d="M13 32l17 16 21-30" stroke="#cdd4a5"/>' },
  warning: { label: 'Cảnh báo', art: '<path fill="#d0aa62" d="M32 5l28 50H4z"/><path fill="#765438" d="M28 20h8l-2 20h-4zm2 26h5v5h-5z"/><path d="M14 49l6-10" stroke="#ead5a2"/>' },
  time: { label: 'Thời gian', art: '<path fill="#ac8958" d="M14 6h36v7H14zm0 45h36v7H14z"/><path fill="#d2cda8" d="M19 13h26q0 13-10 19 10 6 10 19H19q0-13 10-19-10-6-10-19z"/><path fill="#cda760" d="M22 20h20l-10 9zm-1 30 11-10 11 10z"/>' },
  pause: { label: 'Tạm dừng', art: '<path fill="#dbbd7f" d="M12 9h14v46H12zm26 0h14v46H38z"/><path d="M17 15v32m26-32v32" stroke="#f2dfaf"/>' },
  play: { label: 'Chạy', art: '<path fill="#d8bc7b" d="M16 7l40 25-40 25z"/><path d="M23 19l23 13-23 13" stroke="#efdcaa"/>' },
  fast: { label: 'Tăng tốc', art: '<path fill="#dab975" d="M4 10l26 22L4 54zm28 0 26 22-26 22z"/><path d="M9 21l13 11m16-11 13 11" stroke="#f1ddad"/>' },
  lightning: { label: 'Sức mạnh', art: '<path fill="#dfb66c" d="M34 3 12 35h17l-5 26 28-37H35z"/><path d="M30 20l-7 10h12l-2 11" stroke="#f3dfa5"/>' },
  chicken: { label: 'Gà', art: '<path fill="#d3b774" d="M13 23l7 5q16-13 29 1 11 15-5 22H21q-14-8-8-28z"/><path fill="#dfcc98" d="M25 32q21-3 12 14-12 4-12-14z"/><path fill="#bc7358" d="M42 25l-1-12 6 3 3-9 6 9-3 14z"/><path fill="#d8ab64" d="M53 28l8 6-8 4z"/><path d="M24 51v9m17-9v9m8-35v1"/>' },
  cattle: { label: 'Bò', art: '<path fill="#c3a477" d="M11 20h42l-4 26-17 11-17-11z"/><path fill="#e8d5a3" d="M13 24Q0 19 5 5l13 13m33 6Q64 19 59 5L46 18"/><path fill="#718e85" d="M17 21h12l-3 20-11-3z"/><path fill="#d4bc91" d="M17 42h30v10l-15 8-15-8z"/><path d="M22 47v2m20-2v2m-20-20v3m20-3v3"/>' },
  dog: { label: 'Chó', art: '<path fill="#c7a372" d="M17 17h30l7 24-10 15H20L10 41z"/><path fill="#83654a" d="M17 17 4 11l3 26 10-5zm30 0 13-6-3 26-10-5z"/><path fill="#e7cca1" d="M23 37h18l5 12-14 9-14-9z"/><path fill="#597471" d="M26 37h12l-6 8z"/><path d="M23 28v3m18-3v3m-9 14v5m-7 0q7 5 14 0"/>' },
  fish: { label: 'Cá', art: '<path fill="#74a299" d="M8 33q23-26 40-7l12-11v34L48 39Q27 59 8 33z"/><path fill="#d8bc7e" d="M27 15l12-6 5 16M26 47l13 9 5-14"/><path d="M23 23q12 10 0 20m21-14v7m-26-5v1"/>' },
  mushroom: { label: 'Nấm', art: '<path fill="#e4cdaa" d="M26 29h12l5 27H21z"/><path fill="#ae7759" d="M6 34q1-27 26-27t26 27z"/><path fill="#d8b77e" d="M18 22l4-5 5 6zm19-8 5 3-3 6zm9 13 4 1-3 3z"/><path d="M29 39v11"/>' },
  bread: { label: 'Bánh mì', art: '<path fill="#b98a51" d="M7 36q-2-24 21-25l15 3q20 9 14 31-2 10-22 11L15 51z"/><path fill="#e0bc78" d="M8 33q6-22 27-18 15 4 17 20L34 46 12 41z"/><path d="M19 22l7 10m4-13 7 10m4-8 7 10"/>' },
  tree: { label: 'Rừng', art: '<path fill="#96734e" d="M26 32h11v27H26z"/><path fill="#6d9675" d="M32 4 12 25h9L5 43h54L44 25h8z"/><path d="M22 33h21m-14-16 3-5m-1 33v9"/>' },
  sea: { label: 'Biển', art: '<path fill="#75a4a1" d="M4 27q8-16 18-5t19-1 19 5v30H4z"/><path d="M5 36q8-10 17-1t19 0 19 1M5 47q8-10 17-1t19 0 19 1" stroke="#d4d7b5"/>' },
  settler: { label: 'Đón dân', art: '<path fill="#ae8a5e" d="M11 23h42v34H11z"/><path fill="none" d="M24 23V12h16v11" stroke-width="5"/><path fill="#d6bd84" d="M11 29h42v10H11z"/><path fill="#76988b" d="M24 29h16v18H24z"/><path d="M30 34h4m-16 12v5m28-5v5"/>' },
  child: { label: 'Trẻ nhỏ', art: '<path fill="#9db8a5" d="M8 47q8-25 26-17l22 11-7 18H20z"/><circle fill="#dfbc91" cx="32" cy="22" r="14"/><path fill="#896a4b" d="M25 12q3-13 13-7 5 7-6 9"/><path d="M25 23v2m14-2v2m-11 5q4 4 8 0m-16 14 23 8"/>' },
  anomaly: { label: 'Dị tượng', art: '<path fill="#7e9e99" d="M32 5q23 0 25 24t-20 28Q15 59 8 42-4 20 19 10"/><path fill="none" d="M20 13q28-4 28 20 0 18-20 16-16-2-10-19 5-12 18-6 9 7 0 14-5 2-6-4" stroke="#e4c88d" stroke-width="5"/>' },
  modern: { label: 'Văn minh', art: '<path fill="#789592" d="M7 25h15v33H7zm20-19h16v52H27zm21 28h10v24H48z"/><path d="M12 32h5m-5 9h5m-5 9h5m16-35h5m-5 10h5m-5 10h5m-5 10h5m15-3h3m-3 9h3" stroke="#e8cb8f"/>' },
  ruler: { label: 'Đo khoảng cách', art: '<path fill="#d1b47a" d="M5 44l39-39 15 15-39 39z"/><path d="M15 37l6 6m2-14 4 4m4-12 6 6m2-14 4 4"/>' },
  paint: { label: 'Vẽ địa hình', art: '<path fill="#a68455" d="M20 39l25-34 9 6-25 34z"/><path fill="#75a192" d="M16 34q22 1 14 15-5 10-24 9 10-10 10-24z"/><path d="M20 42l-4 8m19-21 9 6"/>' },
  erase: { label: 'Xóa', art: '<path fill="#bd8f73" d="M6 35l23-26 29 22-22 27H24z"/><path fill="#e0c797" d="M6 35l12-13 29 22-11 14H24z"/><path d="M24 58h34M18 22l29 22"/>' },
  happy: { label: 'Hạnh phúc', art: '<circle fill="#d6b774" cx="32" cy="32" r="25"/><path d="M19 23v5m26-5v5M18 37q14 23 28 0"/><path d="M13 32h6m26 0h6" stroke="#bc7d5c"/>' },
  fear: { label: 'Lo lắng', art: '<path fill="#799c98" d="M32 5 12 14 7 35l14 22h22l14-22-5-21z"/><path d="M17 23l9 4m12 0 9-4m-25 9v2m20-2v2m-16 13q6-6 12 0"/>' },
  skull: { label: 'Qua đời', art: '<path fill="#d5c6a5" d="M13 41Q3 9 32 7q29 2 19 34l-8 3v13H21V44z"/><path fill="#657973" d="M17 25h10v10H17zm20 0h10v10H37zM32 34l-5 9h10z"/><path d="M27 49v8m10-8v8"/>' },
  spark: { label: 'Khám phá', art: '<path fill="#d3b476" d="M32 4l9 19 19 9-19 9-9 19-9-19-19-9 19-9z"/><path fill="#e6d1a1" d="M32 19l5 8 8 5-8 5-5 8-5-8-8-5 8-5z"/>' },
};

export type GameIcon = keyof typeof ICON_ART;
export function gameIconURL(name: GameIcon): string { return `assets/icons/${name}.svg`; }
export function iconHTML(name: GameIcon): string {
  return `<img class="game-icon" data-game-icon="${name}" src="${gameIconURL(name)}" alt="" aria-hidden="true" draggable="false">`;
}

/** Compatibility at the presentation boundary: persisted logs and simulation labels remain plain text. */
export const SYMBOL_ICONS: Record<string, GameIcon> = {};
const aliases: Record<string, string> = {
  island:'🏝️ 🌍 🌎 🌏', map:'🗺️ 🗺', population:'👥', person:'👤 🧑 👨 👩 👷', terrain:'🏔️ ⛰️',
  research:'📖 📚 🎓 🧠 🔭 🔬', build:'🏗️ 🏠 🏡 🏪 🏛️ 🏙 🚧', shield:'🛡️ 🛡', creatures:'🐾', clan:'👨‍👩‍👧 🧬', settings:'⚙️', quest:'📋 📜',
  food:'🍖 🍽️ 🍽', wood:'🪵', stone:'🪨', herbs:'🌿 🥀 💐', 'copper-ore':'🔶', copper:'🏺', lumber:'🪚', clay:'🟤', bricks:'🧱', wheat:'🌾',
  'iron-ore':'⛏️', iron:'⚒️', coal:'⚫', cloth:'🧵', fire:'🔥', moon:'☾ 🌙', meal:'🍲', sleep:'🛏️ 💤 😴', heart:'❤️ ❤ 💕 💛 💚 💔 💍',
  tools:'🔨', axe:'🪓', swords:'⚔️', trade:'🛒 🤝 ⛵ 🌉', dialogue:'💬 🤫 🙏', faith:'🛕 ✝', compass:'🧭 📍', save:'💾 ☁️', lock:'🔒',
  check:'✅ 🟢 🟩', warning:'⚠️ ⚠ 🔴 💢 😠 ❌ 😨', time:'⏳ ⏱️ ⏱', day:'📅', pause:'⏸️ ⏸', play:'▶️ ▶', fast:'⏩ 💨', lightning:'⚡',
  chicken:'🐓 🐔 🐣', cattle:'🐄', dog:'🐕', fish:'🐟', mushroom:'🍄', bread:'🍞 🥖', tree:'🌲', sea:'🌊', settler:'🧳', child:'👶 🤰', anomaly:'🌀',
  modern:'🏙️ 🖥️', ruler:'📏', paint:'🖊️ ✍️ 🖌️', erase:'🗑️', happy:'😊 🎉', fear:'😨', skull:'💀', spark:'✨ 🔍 🔎 🎲 🔵 🔷 🟨 🤏 🧙‍♂️',
  pointer:'🖱️ 👆', storage:'📦', chart:'📊', boat:'🚢', sun:'☀️ ☀ ☁️ ☁',
  undo:'↩', redo:'↪',
};
for (const [name, symbols] of Object.entries(aliases)) for (const symbol of symbols.split(' ')) {
  SYMBOL_ICONS[symbol] = name;
  SYMBOL_ICONS[symbol.replace(/\uFE0F/g,'')] = name;
}
const symbolPattern = new RegExp(Object.keys(SYMBOL_ICONS).sort((a,b)=>b.length-a.length).join('|'), 'gu');

const TECH_ICONS: Record<string, GameIcon> = {
  stone_tools:'axe', fire:'fire', research_table:'research', basic_agriculture:'wheat', woodcutting:'tree',
  basic_shelter:'build', mineral_survey:'compass', nature_observation:'herbs', community_rites:'faith',
  domesticate_cattle:'cattle', domesticate_chicken:'chicken', domesticate_dog:'dog', copper_smelting:'copper',
  bronze_construction:'build', ceramics:'pottery', grain_processing:'bread', writing:'quest', iron_survey:'iron-ore',
  biological_adaptation:'biomatter',spiritual_attunement:'spiritEssence',assistive_augmentation:'microchips',relic_handling:'relicBone',biomatter_processing:'biomatter',bio_containment:'biomatter',modern_medicine:'medicine',spirit_channeling:'spiritStone',essence_refining:'spiritEssence',resonance_care:'spiritEssence',advanced_semiconductors:'microchips',industrial_control:'microchips',measurement_science:'research',field_surveys:'research',industrial_supply:'trade',industrial_assembly:'components',iron_smelting:'iron', textiles:'cloth', iron_construction:'modern', trade_routes:'trade', herbalism:'herbs',
  ai_behavior:'clan', navigation:'sea',
};

function decorateText(node: Text): void {
  const parent = node.parentElement;
  if (!parent || parent.closest('script,style,textarea,title,[data-keep-symbols]')) return;
  const value = node.data;
  if(parent.closest('option')) {
    symbolPattern.lastIndex=0;
    const plain=value.replace(symbolPattern,'').trimStart();
    if(plain!==value)node.data=plain;
    return;
  }
  const tech = parent.classList.contains('tc-icon') ? parent.closest<HTMLElement>('[data-tech]')?.dataset.tech : undefined;
  if (tech && TECH_ICONS[tech]) { parent.innerHTML=iconHTML(TECH_ICONS[tech]); return; }
  symbolPattern.lastIndex = 0;
  if (!symbolPattern.test(value)) return;
  symbolPattern.lastIndex = 0;
  const fragment = document.createDocumentFragment(); let cursor = 0;
  for (const match of value.matchAll(symbolPattern)) {
    fragment.append(value.slice(cursor,match.index));
    const img = document.createElement('img');
    img.className='game-icon'; img.dataset.gameIcon=SYMBOL_ICONS[match[0]];
    img.src=gameIconURL(SYMBOL_ICONS[match[0]]); img.alt=''; img.setAttribute('aria-hidden','true'); img.draggable=false;
    fragment.append(img); cursor=match.index!+match[0].length;
  }
  fragment.append(value.slice(cursor)); node.replaceWith(fragment);
}
function decorate(root: Node): void {
  if (root instanceof Text) { decorateText(root); return; }
  const walker = document.createTreeWalker(root,NodeFilter.SHOW_TEXT), nodes: Text[]=[];
  while(walker.nextNode()) nodes.push(walker.currentNode as Text);
  nodes.forEach(decorateText);
}

/** Covers dynamic inspectors, cards and chronicles without replacing buttons or their listeners. */
export function installGameIcons(): void {
  for(const [id,name] of Object.entries({copper:'copper',pottery:'pottery',fiber:'fiber'})) {
    const slot=document.querySelector(`#chip-${id} .chip-icon`);
    if(slot) slot.innerHTML=iconHTML(name);
  }
  decorate(document.body);
  const observer = new MutationObserver(records => {
    for (const record of records) {
      if (record.type==='characterData') decorate(record.target);
      else record.addedNodes.forEach(decorate);
    }
  });
  observer.observe(document.body,{childList:true,subtree:true,characterData:true});
}

const images = new Map<string,HTMLImageElement>();
export function drawGameIcon(ctx: CanvasRenderingContext2D, name: GameIcon, x: number, y: number, size: number): void {
  let img=images.get(name);
  if(!img){img=new Image();img.src=gameIconURL(name);images.set(name,img);}
  if(img.complete&&img.naturalWidth>0) ctx.drawImage(img,x-size/2,y-size/2,size,size);
}
export function drawSymbolIcon(ctx: CanvasRenderingContext2D, symbol: string, x: number, y: number, size: number): void {
  drawGameIcon(ctx,SYMBOL_ICONS[symbol]??'spark',x,y,size);
}

export function gameIconSVG(name: GameIcon): string {
  const icon=ICON_ART[name];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><title>${icon.label}</title><defs><pattern id="grain" width="7" height="9" patternUnits="userSpaceOnUse"><path d="M1 2h2m2 4h1" stroke="#fff3d0" stroke-width=".65" opacity=".3"/></pattern></defs><g fill="none" stroke="#4f493b" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">${icon.art}</g><path fill="url(#grain)" d="M5 5h54v54H5z" opacity=".36"/></svg>`;
}
