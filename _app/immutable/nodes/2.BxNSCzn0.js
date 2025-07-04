import"../chunks/NZTpNUN0.js";import"../chunks/N4jhN1f4.js";import{i as lo,b as co,c as uo,d as be,n as fo,e as vo,s as st,w as Rn,f as Ut,g as Lt,o as Ne,j as Tt,k as ho}from"../chunks/BGDNP5C_.js";import{R as as,at as ls,h as Pe,aC as cs,L as Qt,i as ut,q as Zt,j as ne,g as l,a0 as ds,H as po,J as mo,K as Vn,M as Jt,p as Ot,ak as us,an as go,N as fn,m as ye,O as fs,aD as Qe,ar as vs,ah as Te,aE as vn,aF as Dn,aG as hn,V as U,X as zn,ai as hs,aH as xo,aI as bo,aq as yo,aJ as _o,o as me,aK as wo,al as ps,B as ht,aL as $o,ao as Eo,am as So,l as sn,k as Co,aM as ko,E as To,aN as Ao,P as ms,aO as Io,aP as Mo,t as Lo,f as Ho,aQ as No,aR as Po,aS as Oo,aT as Ro,aU as Vo,A as Bt,aV as Do,v as k,C as jt,b as B,e as mt,D as f,G as w,F as u,y as K,z as q,ac as zo,aW as Bo,aX as $t,W as L,aY as ie,s as W,w as Ct,aZ as gs,ad as jo}from"../chunks/7R9NPaHB.js";import{l as X,p as Q,s as tt,_ as Fo,i as it,a as Oe,d as Et,b as Re,c as xs}from"../chunks/Bku_AVuN.js";import{i as Ft}from"../chunks/CTZZR7bV.js";import{_ as Bn,a as jn,i as Wo,w as Uo,L as bs}from"../chunks/Bo0nr6Fr.js";function qo(e,t){if(t){const n=document.body;e.autofocus=!0,as(()=>{document.activeElement===n&&e.focus()})}}function Ae(e,t){return t}function Ko(e,t,n,s){for(var o=[],r=t.length,i=0;i<r;i++)bo(t[i].e,o,!0);var a=r>0&&o.length===0&&n!==null;if(a){var h=n.parentNode;yo(h),h.append(n),s.clear(),qt(e,t[0].prev,t[r-1].next)}_o(o,()=>{for(var v=0;v<r;v++){var d=t[v];a||(s.delete(d.k),qt(e,d.prev,d.next)),me(d.e,!a)}})}function se(e,t,n,s,o,r=null){var i=e,a={flags:t,items:new Map,first:null},h=(t&cs)!==0;if(h){var v=e;i=ut?Qt(Zt(v)):v.appendChild(ls())}ut&&ne();var d=null,p=!1,m=ds(()=>{var g=n();return hs(g)?g:g==null?[]:vs(g)});Pe(()=>{var g=l(m),x=g.length;if(p&&x===0)return;p=x===0;let y=!1;if(ut){var T=po(i)===mo;T!==(x===0)&&(i=Vn(),Qt(i),Jt(!1),y=!0)}if(ut){for(var _=null,I,E=0;E<x;E++){if(Ot.nodeType===us&&Ot.data===go){i=Ot,y=!0,Jt(!1);break}var b=g[E],$=s(b,E);I=ys(Ot,a,_,null,b,$,E,o,t,n),a.items.set($,I),_=I}x>0&&Qt(Vn())}ut||Yo(g,a,i,o,t,s,n),r!==null&&(x===0?d?fn(d):d=ye(()=>r(i)):d!==null&&fs(d,()=>{d=null})),y&&Jt(!0),l(m)}),ut&&(i=Ot)}function Yo(e,t,n,s,o,r,i){var a=(o&xo)!==0,h=(o&(vn|hn))!==0,v=e.length,d=t.items,p=t.first,m=p,g,x=null,y,T=[],_=[],I,E,b,$;if(a)for($=0;$<v;$+=1)I=e[$],E=r(I,$),b=d.get(E),b!==void 0&&(b.a?.measure(),(y??=new Set).add(b));for($=0;$<v;$+=1){if(I=e[$],E=r(I,$),b=d.get(E),b===void 0){var M=m?m.e.nodes_start:n;x=ys(M,t,x,x===null?t.first:x.next,I,E,$,s,o,i),d.set(E,x),T=[],_=[],m=x.next;continue}if(h&&Jo(b,I,$,o),(b.e.f&Qe)!==0&&(fn(b.e),a&&(b.a?.unfix(),(y??=new Set).delete(b))),b!==m){if(g!==void 0&&g.has(b)){if(T.length<_.length){var S=_[0],A;x=S.prev;var j=T[0],Y=T[T.length-1];for(A=0;A<T.length;A+=1)Fn(T[A],S,n);for(A=0;A<_.length;A+=1)g.delete(_[A]);qt(t,j.prev,Y.next),qt(t,x,j),qt(t,Y,S),m=S,x=Y,$-=1,T=[],_=[]}else g.delete(b),Fn(b,m,n),qt(t,b.prev,b.next),qt(t,b,x===null?t.first:x.next),qt(t,x,b),x=b;continue}for(T=[],_=[];m!==null&&m.k!==E;)(m.e.f&Qe)===0&&(g??=new Set).add(m),_.push(m),m=m.next;if(m===null)continue;b=m}T.push(b),x=b,m=b.next}if(m!==null||g!==void 0){for(var O=g===void 0?[]:vs(g);m!==null;)(m.e.f&Qe)===0&&O.push(m),m=m.next;var R=O.length;if(R>0){var D=(o&cs)!==0&&v===0?n:null;if(a){for($=0;$<R;$+=1)O[$].a?.measure();for($=0;$<R;$+=1)O[$].a?.fix()}Ko(t,O,D,d)}}a&&as(()=>{if(y!==void 0)for(b of y)b.a?.apply()}),Te.first=t.first&&t.first.e,Te.last=x&&x.e}function Jo(e,t,n,s){(s&vn)!==0&&Dn(e.v,t),(s&hn)!==0?Dn(e.i,n):e.i=n}function ys(e,t,n,s,o,r,i,a,h,v){var d=(h&vn)!==0,p=(h&wo)===0,m=d?p?U(o,!1,!1):zn(o):o,g=(h&hn)===0?i:zn(i),x={i:g,v:m,k:r,a:null,e:null,prev:n,next:s};try{return x.e=ye(()=>a(e,m,g,v),ut),x.e.prev=n&&n.e,x.e.next=s&&s.e,n===null?t.first=x:(n.next=x,n.e.next=x.e),s!==null&&(s.prev=x,s.e.prev=x.e),x}finally{}}function Fn(e,t,n){for(var s=e.next?e.next.e.nodes_start:n,o=t?t.e.nodes_start:n,r=e.e.nodes_start;r!==s;){var i=ps(r);o.before(r),r=i}}function qt(e,t,n){t===null?e.first=n:(t.next=n,t.e.next=n&&n.e),n!==null&&(n.prev=t,n.e.prev=t&&t.e)}function pn(e,t,n=!1,s=!1,o=!1){var r=e,i="";ht(()=>{var a=Te;if(i===(i=t()??"")){ut&&ne();return}if(a.nodes_start!==null&&($o(a.nodes_start,a.nodes_end),a.nodes_start=a.nodes_end=null),i!==""){if(ut){Ot.data;for(var h=ne(),v=h;h!==null&&(h.nodeType!==us||h.data!=="");)v=h,h=ps(h);if(h===null)throw Eo(),So;sn(Ot,v),r=Qt(h);return}var d=i+"";n?d=`<svg>${d}</svg>`:s&&(d=`<math>${d}</math>`);var p=Co(d);if((n||s)&&(p=Zt(p)),sn(Zt(p),p.lastChild),n||s)for(;Zt(p);)r.before(Zt(p));else r.before(p)}})}function Z(e,t,n,s,o){ut&&ne();var r=t.$$slots?.[n],i=!1;r===!0&&(r=t.children,i=!0),r===void 0||r(e,i?()=>s:s)}function Go(e,t,n,s,o,r){let i=ut;ut&&ne();var a,h,v=null;ut&&Ot.nodeType===ko&&(v=Ot,ne());var d=ut?Ot:e,p;Pe(()=>{const m=t()||null;var g=Ao;m!==a&&(p&&(m===null?fs(p,()=>{p=null,h=null}):m===h?fn(p):me(p)),m&&m!==h&&(p=ye(()=>{if(v=ut?v:document.createElementNS(g,m),sn(v,v),s){ut&&lo(m)&&v.append(document.createComment(""));var x=ut?Zt(v):v.appendChild(ls());ut&&(x===null?Jt(!1):Qt(x)),s(v,x)}Te.nodes_end=v,d.before(v)})),a=m,a&&(h=a))},To),i&&(Jt(!0),Qt(d))}function Xo(e,t){var n=void 0,s;Pe(()=>{n!==(n=t())&&(s&&(me(s),s=null),n&&(s=ye(()=>{ms(()=>n(e))})))})}function _s(e){var t,n,s="";if(typeof e=="string"||typeof e=="number")s+=e;else if(typeof e=="object")if(Array.isArray(e)){var o=e.length;for(t=0;t<o;t++)e[t]&&(n=_s(e[t]))&&(s&&(s+=" "),s+=n)}else for(n in e)e[n]&&(s&&(s+=" "),s+=n);return s}function Zo(){for(var e,t,n=0,s="",o=arguments.length;n<o;n++)(e=arguments[n])&&(t=_s(e))&&(s&&(s+=" "),s+=t);return s}function Qo(e){return typeof e=="object"?Zo(e):e??""}const Wn=[...` 	
\r\f \v\uFEFF`];function ti(e,t,n){var s=e==null?"":""+e;if(t&&(s=s?s+" "+t:t),n){for(var o in n)if(n[o])s=s?s+" "+o:o;else if(s.length)for(var r=o.length,i=0;(i=s.indexOf(o,i))>=0;){var a=i+r;(i===0||Wn.includes(s[i-1]))&&(a===s.length||Wn.includes(s[a]))?s=(i===0?"":s.substring(0,i))+s.substring(a+1):i=a}}return s===""?null:s}function Un(e,t=!1){var n=t?" !important;":";",s="";for(var o in e){var r=e[o];r!=null&&r!==""&&(s+=" "+o+": "+r+n)}return s}function tn(e){return e[0]!=="-"||e[1]!=="-"?e.toLowerCase():e}function ei(e,t){if(t){var n="",s,o;if(Array.isArray(t)?(s=t[0],o=t[1]):s=t,e){e=String(e).replaceAll(/\s*\/\*.*?\*\/\s*/g,"").trim();var r=!1,i=0,a=!1,h=[];s&&h.push(...Object.keys(s).map(tn)),o&&h.push(...Object.keys(o).map(tn));var v=0,d=-1;const y=e.length;for(var p=0;p<y;p++){var m=e[p];if(a?m==="/"&&e[p-1]==="*"&&(a=!1):r?r===m&&(r=!1):m==="/"&&e[p+1]==="*"?a=!0:m==='"'||m==="'"?r=m:m==="("?i++:m===")"&&i--,!a&&r===!1&&i===0){if(m===":"&&d===-1)d=p;else if(m===";"||p===y-1){if(d!==-1){var g=tn(e.substring(v,d).trim());if(!h.includes(g)){m!==";"&&p++;var x=e.substring(v,p).trim();n+=" "+x+";"}}v=p+1,d=-1}}}}return s&&(n+=Un(s)),o&&(n+=Un(o,!0)),n=n.trim(),n===""?null:n}return e==null?null:String(e)}function ct(e,t,n,s,o,r){var i=e.__className;if(ut||i!==n||i===void 0){var a=ti(n,s,r);(!ut||a!==e.getAttribute("class"))&&(a==null?e.removeAttribute("class"):t?e.className=a:e.setAttribute("class",a)),e.__className=n}else if(r&&o!==r)for(var h in r){var v=!!r[h];(o==null||v!==!!o[h])&&e.classList.toggle(h,v)}return r}function en(e,t={},n,s){for(var o in n){var r=n[o];t[o]!==r&&(n[o]==null?e.style.removeProperty(o):e.style.setProperty(o,r,s))}}function ge(e,t,n,s){var o=e.__style;if(ut||o!==t){var r=ei(t,s);(!ut||r!==e.getAttribute("style"))&&(r==null?e.removeAttribute("style"):e.style.cssText=r),e.__style=t}else s&&(Array.isArray(s)?(en(e,n?.[0],s[0]),en(e,n?.[1],s[1],"important")):en(e,n,s));return s}function on(e,t,n){if(e.multiple){if(t==null)return;if(!hs(t))return Io();for(var s of e.options)s.selected=t.includes(qn(s));return}for(s of e.options){var o=qn(s);if(Mo(o,t)){s.selected=!0;return}}(!n||t!==void 0)&&(e.selectedIndex=-1)}function ni(e){var t=new MutationObserver(()=>{on(e,e.__value)});t.observe(e,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["value"]}),Lo(()=>{t.disconnect()})}function qn(e){return"__value"in e?e.__value:e.value}const he=Symbol("class"),pe=Symbol("style"),ws=Symbol("is custom element"),$s=Symbol("is html");function si(e,t){t?e.hasAttribute("selected")||e.setAttribute("selected",""):e.removeAttribute("selected")}function Gt(e,t,n,s){var o=Es(e);ut&&(o[t]=e.getAttribute(t),t==="src"||t==="srcset"||t==="href"&&e.nodeName==="LINK")||o[t]!==(o[t]=n)&&(t==="loading"&&(e[Ro]=n),n==null?e.removeAttribute(t):typeof n!="string"&&Ss(e).includes(t)?e[t]=n:e.setAttribute(t,n))}function oi(e,t,n,s,o=!1){var r=Es(e),i=r[ws],a=!r[$s];let h=ut&&i;h&&Jt(!1);var v=t||{},d=e.tagName==="OPTION";for(var p in t)p in n||(n[p]=null);n.class?n.class=Qo(n.class):n[he]&&(n.class=null),n[pe]&&(n.style??=null);var m=Ss(e);for(const E in n){let b=n[E];if(d&&E==="value"&&b==null){e.value=e.__value="",v[E]=b;continue}if(E==="class"){var g=e.namespaceURI==="http://www.w3.org/1999/xhtml";ct(e,g,b,s,t?.[he],n[he]),v[E]=b,v[he]=n[he];continue}if(E==="style"){ge(e,b,t?.[pe],n[pe]),v[E]=b,v[pe]=n[pe];continue}var x=v[E];if(!(b===x&&!(b===void 0&&e.hasAttribute(E)))){v[E]=b;var y=E[0]+E[1];if(y!=="$$")if(y==="on"){const $={},M="$$"+E;let S=E.slice(2);var T=vo(S);if(co(S)&&(S=S.slice(0,-7),$.capture=!0),!T&&x){if(b!=null)continue;e.removeEventListener(S,v[M],$),v[M]=null}if(b!=null)if(T)e[`__${S}`]=b,be([S]);else{let A=function(j){v[E].call(this,j)};v[M]=uo(S,e,A,$)}else T&&(e[`__${S}`]=void 0)}else if(E==="style")Gt(e,E,b);else if(E==="autofocus")qo(e,!!b);else if(!i&&(E==="__value"||E==="value"&&b!=null))e.value=e.__value=b;else if(E==="selected"&&d)si(e,b);else{var _=E;a||(_=fo(_));var I=_==="defaultValue"||_==="defaultChecked";if(b==null&&!i&&!I)if(r[E]=null,_==="value"||_==="checked"){let $=e;const M=t===void 0;if(_==="value"){let S=$.defaultValue;$.removeAttribute(_),$.defaultValue=S,$.value=$.__value=M?S:null}else{let S=$.defaultChecked;$.removeAttribute(_),$.defaultChecked=S,$.checked=M?S:!1}}else e.removeAttribute(E);else I||m.includes(_)&&(i||typeof b!="string")?e[_]=b:typeof b!="function"&&Gt(e,_,b)}}}return h&&Jt(!0),v}function Kn(e,t,n=[],s,o=!1,r=Ho){const i=n.map(r);var a=void 0,h={},v=e.nodeName==="SELECT",d=!1;if(Pe(()=>{var m=t(...i.map(l)),g=oi(e,a,m,s,o);d&&v&&"value"in m&&on(e,m.value,!1);for(let y of Object.getOwnPropertySymbols(h))m[y]||me(h[y]);for(let y of Object.getOwnPropertySymbols(m)){var x=m[y];y.description===No&&(!a||x!==a[y])&&(h[y]&&me(h[y]),h[y]=ye(()=>Xo(e,()=>x))),g[y]=x}a=g}),v){var p=e;ms(()=>{on(p,a.value),ni(p)})}d=!0}function Es(e){return e.__attributes??={[ws]:e.nodeName.includes("-"),[$s]:e.namespaceURI===Po}}var Yn=new Map;function Ss(e){var t=Yn.get(e.nodeName);if(t)return t;Yn.set(e.nodeName,t=[]);for(var n,s=e,o=Element.prototype;o!==s;){n=Vo(s);for(var r in n)n[r].set&&t.push(r);s=Oo(s)}return t}function ii(e){return function(...t){var n=t[0];return n.stopPropagation(),e?.apply(this,t)}}/**
 * @license lucide-svelte v0.525.0 - ISC
 *
 * ISC License
 * 
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
 * 
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 * 
 */const ri={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};var ai=Do("<svg><!><!></svg>");function et(e,t){const n=X(t,["children","$$slots","$$events","$$legacy"]),s=X(n,["name","color","size","strokeWidth","absoluteStrokeWidth","iconNode"]);Bt(t,!1);let o=Q(t,"name",8,void 0),r=Q(t,"color",8,"currentColor"),i=Q(t,"size",8,24),a=Q(t,"strokeWidth",8,2),h=Q(t,"absoluteStrokeWidth",8,!1),v=Q(t,"iconNode",24,()=>[]);const d=(...x)=>x.filter((y,T,_)=>!!y&&_.indexOf(y)===T).join(" ");Ft();var p=ai();Kn(p,(x,y)=>({...ri,...s,width:i(),height:i(),stroke:r(),"stroke-width":x,class:y}),[()=>(mt(h()),mt(a()),mt(i()),B(()=>h()?Number(a())*24/Number(i()):a())),()=>(mt(o()),mt(n),B(()=>d("lucide-icon","lucide",o()?`lucide-${o()}`:"",n.class)))]);var m=f(p);se(m,1,v,Ae,(x,y)=>{var T=zo(()=>Bo(l(y),2));let _=()=>l(T)[0],I=()=>l(T)[1];var E=K(),b=q(E);Go(b,_,!0,($,M)=>{Kn($,()=>({...I()}))}),k(x,E)});var g=w(m);Z(g,t,"default",{}),u(p),k(e,p),jt()}function li(e,t){const n=X(t,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.525.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 */const s=[["path",{d:"m8 2 1.88 1.88"}],["path",{d:"M14.12 3.88 16 2"}],["path",{d:"M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"}],["path",{d:"M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"}],["path",{d:"M12 20v-9"}],["path",{d:"M6.53 9C4.6 8.8 3 7.1 3 5"}],["path",{d:"M6 13H2"}],["path",{d:"M3 21c0-2.1 1.7-3.9 3.8-4"}],["path",{d:"M20.97 5c0 2.1-1.6 3.8-3.5 4"}],["path",{d:"M22 13h-4"}],["path",{d:"M17.2 17c2.1.1 3.8 1.9 3.8 4"}]];et(e,tt({name:"bug"},()=>n,{get iconNode(){return s},children:(o,r)=>{var i=K(),a=q(i);Z(a,t,"default",{}),k(o,i)},$$slots:{default:!0}}))}function ci(e,t){const n=X(t,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.525.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 */const s=[["path",{d:"m6 9 6 6 6-6"}]];et(e,tt({name:"chevron-down"},()=>n,{get iconNode(){return s},children:(o,r)=>{var i=K(),a=q(i);Z(a,t,"default",{}),k(o,i)},$$slots:{default:!0}}))}function di(e,t){const n=X(t,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.525.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 */const s=[["path",{d:"m18 15-6-6-6 6"}]];et(e,tt({name:"chevron-up"},()=>n,{get iconNode(){return s},children:(o,r)=>{var i=K(),a=q(i);Z(a,t,"default",{}),k(o,i)},$$slots:{default:!0}}))}function Jn(e,t){const n=X(t,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.525.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 */const s=[["circle",{cx:"12",cy:"12",r:"10"}]];et(e,tt({name:"circle"},()=>n,{get iconNode(){return s},children:(o,r)=>{var i=K(),a=q(i);Z(a,t,"default",{}),k(o,i)},$$slots:{default:!0}}))}function ui(e,t){const n=X(t,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.525.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 */const s=[["path",{d:"M12 6v6l4 2"}],["circle",{cx:"12",cy:"12",r:"10"}]];et(e,tt({name:"clock"},()=>n,{get iconNode(){return s},children:(o,r)=>{var i=K(),a=q(i);Z(a,t,"default",{}),k(o,i)},$$slots:{default:!0}}))}function fi(e,t){const n=X(t,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.525.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 */const s=[["path",{d:"m18 16 4-4-4-4"}],["path",{d:"m6 8-4 4 4 4"}],["path",{d:"m14.5 4-5 16"}]];et(e,tt({name:"code-xml"},()=>n,{get iconNode(){return s},children:(o,r)=>{var i=K(),a=q(i);Z(a,t,"default",{}),k(o,i)},$$slots:{default:!0}}))}function Cs(e,t){const n=X(t,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.525.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 */const s=[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"}]];et(e,tt({name:"copy"},()=>n,{get iconNode(){return s},children:(o,r)=>{var i=K(),a=q(i);Z(a,t,"default",{}),k(o,i)},$$slots:{default:!0}}))}function vi(e,t){const n=X(t,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.525.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 */const s=[["path",{d:"m15 15 6 6"}],["path",{d:"m15 9 6-6"}],["path",{d:"M21 16v5h-5"}],["path",{d:"M21 8V3h-5"}],["path",{d:"M3 16v5h5"}],["path",{d:"m3 21 6-6"}],["path",{d:"M3 8V3h5"}],["path",{d:"M9 9 3 3"}]];et(e,tt({name:"expand"},()=>n,{get iconNode(){return s},children:(o,r)=>{var i=K(),a=q(i);Z(a,t,"default",{}),k(o,i)},$$slots:{default:!0}}))}function ks(e,t){const n=X(t,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.525.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 */const s=[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"}],["circle",{cx:"12",cy:"12",r:"3"}]];et(e,tt({name:"eye"},()=>n,{get iconNode(){return s},children:(o,r)=>{var i=K(),a=q(i);Z(a,t,"default",{}),k(o,i)},$$slots:{default:!0}}))}function hi(e,t){const n=X(t,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.525.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 */const s=[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4"}],["path",{d:"M10 9H8"}],["path",{d:"M16 13H8"}],["path",{d:"M16 17H8"}]];et(e,tt({name:"file-text"},()=>n,{get iconNode(){return s},children:(o,r)=>{var i=K(),a=q(i);Z(a,t,"default",{}),k(o,i)},$$slots:{default:!0}}))}function pi(e,t){const n=X(t,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.525.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 */const s=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2"}],["path",{d:"M3 9h18"}],["path",{d:"M3 15h18"}],["path",{d:"M9 3v18"}],["path",{d:"M15 3v18"}]];et(e,tt({name:"grid-3x3"},()=>n,{get iconNode(){return s},children:(o,r)=>{var i=K(),a=q(i);Z(a,t,"default",{}),k(o,i)},$$slots:{default:!0}}))}function mi(e,t){const n=X(t,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.525.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 */const s=[["circle",{cx:"9",cy:"12",r:"1"}],["circle",{cx:"9",cy:"5",r:"1"}],["circle",{cx:"9",cy:"19",r:"1"}],["circle",{cx:"15",cy:"12",r:"1"}],["circle",{cx:"15",cy:"5",r:"1"}],["circle",{cx:"15",cy:"19",r:"1"}]];et(e,tt({name:"grip-vertical"},()=>n,{get iconNode(){return s},children:(o,r)=>{var i=K(),a=q(i);Z(a,t,"default",{}),k(o,i)},$$slots:{default:!0}}))}function Gn(e,t){const n=X(t,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.525.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 */const s=[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"}],["path",{d:"M3 3v5h5"}],["path",{d:"M12 7v5l4 2"}]];et(e,tt({name:"history"},()=>n,{get iconNode(){return s},children:(o,r)=>{var i=K(),a=q(i);Z(a,t,"default",{}),k(o,i)},$$slots:{default:!0}}))}function Xn(e,t){const n=X(t,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.525.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 */const s=[["path",{d:"M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"}],["path",{d:"M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"}],["path",{d:"M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"}]];et(e,tt({name:"layers"},()=>n,{get iconNode(){return s},children:(o,r)=>{var i=K(),a=q(i);Z(a,t,"default",{}),k(o,i)},$$slots:{default:!0}}))}function gi(e,t){const n=X(t,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.525.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 */const s=[["rect",{width:"20",height:"14",x:"2",y:"3",rx:"2"}],["line",{x1:"8",x2:"16",y1:"21",y2:"21"}],["line",{x1:"12",x2:"12",y1:"17",y2:"21"}]];et(e,tt({name:"monitor"},()=>n,{get iconNode(){return s},children:(o,r)=>{var i=K(),a=q(i);Z(a,t,"default",{}),k(o,i)},$$slots:{default:!0}}))}function xi(e,t){const n=X(t,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.525.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 */const s=[["rect",{x:"5",y:"2",width:"14",height:"20",rx:"7"}],["path",{d:"M12 6v4"}]];et(e,tt({name:"mouse"},()=>n,{get iconNode(){return s},children:(o,r)=>{var i=K(),a=q(i);Z(a,t,"default",{}),k(o,i)},$$slots:{default:!0}}))}function Ie(e,t){const n=X(t,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.525.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 */const s=[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"}]];et(e,tt({name:"pen"},()=>n,{get iconNode(){return s},children:(o,r)=>{var i=K(),a=q(i);Z(a,t,"default",{}),k(o,i)},$$slots:{default:!0}}))}function mn(e,t){const n=X(t,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.525.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 */const s=[["path",{d:"M5 12h14"}],["path",{d:"M12 5v14"}]];et(e,tt({name:"plus"},()=>n,{get iconNode(){return s},children:(o,r)=>{var i=K(),a=q(i);Z(a,t,"default",{}),k(o,i)},$$slots:{default:!0}}))}function Ts(e,t){const n=X(t,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.525.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 */const s=[["path",{d:"m15 14 5-5-5-5"}],["path",{d:"M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13"}]];et(e,tt({name:"redo-2"},()=>n,{get iconNode(){return s},children:(o,r)=>{var i=K(),a=q(i);Z(a,t,"default",{}),k(o,i)},$$slots:{default:!0}}))}function bi(e,t){const n=X(t,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.525.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 */const s=[["circle",{cx:"6",cy:"6",r:"3"}],["path",{d:"M8.12 8.12 12 12"}],["path",{d:"M20 4 8.12 15.88"}],["circle",{cx:"6",cy:"18",r:"3"}],["path",{d:"M14.8 14.8 20 20"}]];et(e,tt({name:"scissors"},()=>n,{get iconNode(){return s},children:(o,r)=>{var i=K(),a=q(i);Z(a,t,"default",{}),k(o,i)},$$slots:{default:!0}}))}function rn(e,t){const n=X(t,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.525.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 */const s=[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"}],["circle",{cx:"12",cy:"12",r:"3"}]];et(e,tt({name:"settings"},()=>n,{get iconNode(){return s},children:(o,r)=>{var i=K(),a=q(i);Z(a,t,"default",{}),k(o,i)},$$slots:{default:!0}}))}function yi(e,t){const n=X(t,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.525.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 */const s=[["rect",{width:"14",height:"20",x:"5",y:"2",rx:"2",ry:"2"}],["path",{d:"M12 18h.01"}]];et(e,tt({name:"smartphone"},()=>n,{get iconNode(){return s},children:(o,r)=>{var i=K(),a=q(i);Z(a,t,"default",{}),k(o,i)},$$slots:{default:!0}}))}function ke(e,t){const n=X(t,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.525.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 */const s=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2"}]];et(e,tt({name:"square"},()=>n,{get iconNode(){return s},children:(o,r)=>{var i=K(),a=q(i);Z(a,t,"default",{}),k(o,i)},$$slots:{default:!0}}))}function _i(e,t){const n=X(t,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.525.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 */const s=[["rect",{width:"16",height:"20",x:"4",y:"2",rx:"2",ry:"2"}],["line",{x1:"12",x2:"12.01",y1:"18",y2:"18"}]];et(e,tt({name:"tablet"},()=>n,{get iconNode(){return s},children:(o,r)=>{var i=K(),a=q(i);Z(a,t,"default",{}),k(o,i)},$$slots:{default:!0}}))}function an(e,t){const n=X(t,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.525.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 */const s=[["path",{d:"M3 6h18"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17"}]];et(e,tt({name:"trash-2"},()=>n,{get iconNode(){return s},children:(o,r)=>{var i=K(),a=q(i);Z(a,t,"default",{}),k(o,i)},$$slots:{default:!0}}))}function wi(e,t){const n=X(t,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.525.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 */const s=[["path",{d:"M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"}]];et(e,tt({name:"triangle"},()=>n,{get iconNode(){return s},children:(o,r)=>{var i=K(),a=q(i);Z(a,t,"default",{}),k(o,i)},$$slots:{default:!0}}))}function As(e,t){const n=X(t,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.525.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 */const s=[["path",{d:"M12 4v16"}],["path",{d:"M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2"}],["path",{d:"M9 20h6"}]];et(e,tt({name:"type"},()=>n,{get iconNode(){return s},children:(o,r)=>{var i=K(),a=q(i);Z(a,t,"default",{}),k(o,i)},$$slots:{default:!0}}))}function Is(e,t){const n=X(t,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.525.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 */const s=[["path",{d:"M9 14 4 9l5-5"}],["path",{d:"M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"}]];et(e,tt({name:"undo-2"},()=>n,{get iconNode(){return s},children:(o,r)=>{var i=K(),a=q(i);Z(a,t,"default",{}),k(o,i)},$$slots:{default:!0}}))}function ln(e,t){const n=X(t,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.525.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 */const s=[["path",{d:"M18 6 6 18"}],["path",{d:"m6 6 12 12"}]];et(e,tt({name:"x"},()=>n,{get iconNode(){return s},children:(o,r)=>{var i=K(),a=q(i);Z(a,t,"default",{}),k(o,i)},$$slots:{default:!0}}))}if(Bn)jn(Uo),Bn();else{const e=await Fo(()=>import("../chunks/Bo0nr6Fr.js").then(n=>n.w),[],import.meta.url),t=new WebAssembly.Instance(e.default,{"./loro_wasm_bg.js":Wo});jn(t.exports)}const $i=["Map","Text","List","Tree","MovableList","Counter"];function Ei(e){return e.startsWith("cid:")}function Zn(e){if(typeof e!="object"||e==null)return!1;const t=Object.getPrototypeOf(e);return t==null||typeof t!="object"||typeof t.kind!="function"?!1:$i.includes(e.kind())}bs.prototype.toJsonWithReplacer=function(e){const t=new Set,n=this,s=(i,a)=>{if(typeof a=="string"&&Ei(a)&&!t.has(a)){t.add(a);const v=n.getContainerById(a);if(v==null)throw new Error(`ContainerID not found: ${a}`);const d=e(i,v);if(d===v){const p=v.getShallowValue();return typeof p=="object"?o(p):p}if(Zn(d))throw new Error("Using new container is not allowed in toJsonWithReplacer");return typeof d=="object"&&d!=null?o(d):d}if(typeof a=="object"&&a!=null)return o(a);const h=e(i,a);if(Zn(h))throw new Error("Using new container is not allowed in toJsonWithReplacer");return h},o=i=>{if(Array.isArray(i))return i.map((h,v)=>s(v,h)).filter(h=>h!==void 0);const a={};for(const[h,v]of Object.entries(i)){const d=s(h,v);d!==void 0&&(a[h]=d)}return a},r=n.getShallowValue();return o(r)};class Si{textHistories=new Map;elementIdMap=new WeakMap;elementMap=new Map;listeners=new Map;pendingUpdates=new Map;updateDelay=500;editHistory=[];editHistoryIndex=-1;structuralSnapshots=[];structuralHistoryIndex=-1;contentContainer=null;constructor(){}registerElement(t,n=""){let s=this.elementIdMap.get(t);if(!s){s=`text-${Date.now()}-${Math.random().toString(36).substring(2,9)}`,this.elementIdMap.set(t,s),this.elementMap.set(s,new WeakRef(t));const o=new bs,r=o.getText("content");n&&r.insert(0,n);const i={doc:o,text:r,versions:[n],currentIndex:0,lastEditTimestamp:Date.now()};this.textHistories.set(s,i),o.subscribe(()=>{const a=this.listeners.get(s);a&&a(r.toString())})}return s}updateText(t,n){const s=this.textHistories.get(t);if(!s)return;const o=s.text.toString();if(o===n)return;s.text.delete(0,o.length),s.text.insert(0,n);const r=this.pendingUpdates.get(t);r&&clearTimeout(r.timer);const i=window.setTimeout(()=>{const a=s.versions[s.currentIndex];s.versions=s.versions.slice(0,s.currentIndex+1),s.versions.push(n),s.currentIndex=s.versions.length-1,s.lastEditTimestamp=Date.now();const h={elementId:t,timestamp:s.lastEditTimestamp,fromText:a,toText:n};this.editHistory=this.editHistory.slice(0,this.editHistoryIndex+1),this.editHistory.push(h),this.editHistoryIndex=this.editHistory.length-1,s.versions.length>50&&(s.versions.shift(),s.currentIndex--),this.editHistory.length>100&&(this.editHistory.shift(),this.editHistoryIndex--),this.pendingUpdates.delete(t)},this.updateDelay);this.pendingUpdates.set(t,{text:n,timer:i})}onTextChange(t,n){this.listeners.set(t,n)}canUndo(){return this.editHistoryIndex>=0||this.structuralHistoryIndex>0}canRedo(){return this.editHistoryIndex<this.editHistory.length-1||this.structuralHistoryIndex<this.structuralSnapshots.length-1}undo(){if(this.structuralHistoryIndex>0&&this.contentContainer){this.structuralHistoryIndex--;const t=this.structuralSnapshots[this.structuralHistoryIndex];return this.contentContainer.innerHTML=t.html,"structural-change"}if(this.editHistoryIndex>=0){const t=this.editHistory[this.editHistoryIndex],n=this.textHistories.get(t.elementId);if(!n)return null;const s=n.text.toString();n.text.delete(0,s.length),n.text.insert(0,t.fromText),n.currentIndex=n.versions.indexOf(t.fromText),n.currentIndex===-1&&(n.currentIndex=Math.max(0,n.currentIndex-1)),this.editHistoryIndex--;const o=this.listeners.get(t.elementId);return o&&o(t.fromText),t.elementId}return null}redo(){if(this.structuralHistoryIndex<this.structuralSnapshots.length-1&&this.contentContainer){this.structuralHistoryIndex++;const t=this.structuralSnapshots[this.structuralHistoryIndex];return this.contentContainer.innerHTML=t.html,"structural-change"}if(this.editHistoryIndex<this.editHistory.length-1){this.editHistoryIndex++;const t=this.editHistory[this.editHistoryIndex],n=this.textHistories.get(t.elementId);if(!n)return null;const s=n.text.toString();n.text.delete(0,s.length),n.text.insert(0,t.toText),n.currentIndex=n.versions.indexOf(t.toText),n.currentIndex===-1&&(n.currentIndex=Math.min(n.versions.length-1,n.currentIndex+1));const o=this.listeners.get(t.elementId);return o&&o(t.toText),t.elementId}return null}startTransaction(){}commitTransaction(){}clear(){for(const[t,n]of this.pendingUpdates)clearTimeout(n.timer);this.pendingUpdates.clear(),this.textHistories.clear(),this.listeners.clear(),this.elementIdMap=new WeakMap,this.elementMap.clear(),this.editHistory=[],this.editHistoryIndex=-1}commitPendingChanges(t){if(t){const n=this.pendingUpdates.get(t);if(n){clearTimeout(n.timer),this.pendingUpdates.delete(t);const s=this.textHistories.get(t);if(s&&s.currentIndex>=0){const o=s.versions[s.currentIndex];s.versions=s.versions.slice(0,s.currentIndex+1),s.versions.push(n.text),s.currentIndex=s.versions.length-1,s.lastEditTimestamp=Date.now();const r={elementId:t,timestamp:s.lastEditTimestamp,fromText:o,toText:n.text};this.editHistory=this.editHistory.slice(0,this.editHistoryIndex+1),this.editHistory.push(r),this.editHistoryIndex=this.editHistory.length-1,s.versions.length>50&&(s.versions.shift(),s.currentIndex--),this.editHistory.length>100&&(this.editHistory.shift(),this.editHistoryIndex--)}}}else{for(const[n,s]of this.pendingUpdates){clearTimeout(s.timer);const o=this.textHistories.get(n);if(o&&o.currentIndex>=0){const r=o.versions[o.currentIndex];o.versions=o.versions.slice(0,o.currentIndex+1),o.versions.push(s.text),o.currentIndex=o.versions.length-1,o.lastEditTimestamp=Date.now();const i={elementId:n,timestamp:o.lastEditTimestamp,fromText:r,toText:s.text};this.editHistory=this.editHistory.slice(0,this.editHistoryIndex+1),this.editHistory.push(i),this.editHistoryIndex=this.editHistory.length-1,o.versions.length>50&&(o.versions.shift(),o.currentIndex--),this.editHistory.length>100&&(this.editHistory.shift(),this.editHistoryIndex--)}}this.pendingUpdates.clear()}}getElementId(t){return this.elementIdMap.get(t)}getElementById(t){return this.elementMap.get(t)?.deref()}getHistoryInfo(t){const n=this.textHistories.get(t);return n?{canUndo:n.currentIndex>0,canRedo:n.currentIndex<n.versions.length-1,currentVersion:n.currentIndex+1,totalVersions:n.versions.length,currentText:n.text.toString()}:null}saveState(){console.log("saveState called - using structural history")}saveStructuralState(t){this.contentContainer=t;const n={id:`struct-${Date.now()}-${Math.random().toString(36).substring(2,9)}`,timestamp:Date.now(),html:t.innerHTML};this.structuralSnapshots=this.structuralSnapshots.slice(0,this.structuralHistoryIndex+1),this.structuralSnapshots.push(n),this.structuralHistoryIndex=this.structuralSnapshots.length-1,this.structuralSnapshots.length>50&&(this.structuralSnapshots.shift(),this.structuralHistoryIndex--)}getHistoryLength(){return Math.max(this.editHistory.length,this.structuralSnapshots.length)}getCurrentVersion(){return{text:this.editHistoryIndex+1,structural:this.structuralHistoryIndex+1}}}const pt=new Si;function Ci(e,t){if(!t())return;const n=t().textContent||t().outerHTML;navigator.clipboard.writeText(n)}function ki(e,t){t()&&t().remove()}function Ti(e,t,n){!t()||l(n)!=="text"||t().focus()}var Ai=W('<div class="flex justify-between"><span class="text-stone-600">Max Length</span> <span class="text-stone-900"> </span></div>'),Ii=W("<span> </span>"),Mi=W('<div class="card p-4"><h4 class="text-sm font-medium text-stone-900 mb-3">Content</h4> <div class="bg-stone-50 p-3 text-xs text-stone-800 font-mono border border-stone-200"> </div> <div class="flex justify-between text-xs text-stone-500 mt-2"><span> </span> <!></div></div>'),Li=W('<button class="btn btn-primary w-full text-sm"><!> Edit Text</button>'),Hi=W('<div class="card p-4"><h4 class="text-sm font-medium text-stone-900 mb-3">Classes</h4> <code class="bg-stone-50 p-3 text-xs text-stone-800 block break-all border border-stone-200"> </code></div>'),Ni=W('<div class="space-y-6 animate-fade-in"><div><div class="flex items-center gap-2 mb-3"><!> <span class="text-sm font-medium text-stone-900 capitalize"> </span></div></div> <div class="card p-4"><h4 class="text-sm font-medium text-stone-900 mb-3">Element</h4> <div class="space-y-2 text-xs"><div class="flex justify-between"><span class="text-stone-600">Tag</span> <code class="bg-stone-100 px-2 py-1 text-stone-800"> </code></div> <div class="flex justify-between"><span class="text-stone-600">Type</span> <span class="text-stone-900 capitalize"> </span></div> <!></div></div> <!> <div class="space-y-2"><!> <button class="btn w-full text-sm"><!> Copy</button> <button class="btn w-full text-sm hover:bg-red-50 hover:text-red-600 hover:border-red-200"><!> Delete</button></div> <!></div>'),Pi=W("<div><!></div>");function Oi(e,t){Bt(t,!1);const n=U(),s=U(),o=U();let r=Q(t,"selectedElement",8,null);$t(()=>mt(r()),()=>{L(n,r()?.dataset.editable||"")}),$t(()=>mt(r()),()=>{L(s,!!r())}),$t(()=>(mt(r()),l(n)),()=>{L(o,r()?{tag:r().tagName.toLowerCase(),content:r().textContent||"",maxLength:r().dataset.maxLength,classes:Array.from(r().classList).join(" "),type:l(n)}:null)}),ie(),Ft();var i=Pi(),a=f(i);{var h=v=>{var d=Ni(),p=f(d),m=f(p),g=f(m);{var x=F=>{As(F,{class:"w-4 h-4 text-stone-600"})},y=F=>{hi(F,{class:"w-4 h-4 text-stone-600"})};it(g,F=>{l(n)==="text"?F(x):F(y,!1)})}var T=w(g,2),_=f(T,!0);u(T),u(m),u(p);var I=w(p,2),E=w(f(I),2),b=f(E),$=w(f(b),2),M=f($,!0);u($),u(b);var S=w(b,2),A=w(f(S),2),j=f(A,!0);u(A),u(S);var Y=w(S,2);{var O=F=>{var nt=Ai(),G=w(f(nt),2),vt=f(G,!0);u(G),u(nt),ht(()=>st(vt,(l(o),B(()=>l(o).maxLength)))),k(F,nt)};it(Y,F=>{l(o),B(()=>l(o)?.maxLength)&&F(O)})}u(E),u(I);var R=w(I,2);{var D=F=>{var nt=Mi(),G=w(f(nt),2),vt=f(G,!0);u(G);var wt=w(G,2),xt=f(wt),St=f(xt);u(xt);var bt=w(xt,2);{var yt=_t=>{var z=Ii(),dt=f(z);u(z),ht(()=>st(dt,`/ ${l(o),B(()=>l(o).maxLength)??""} max`)),k(_t,z)};it(bt,_t=>{l(o),B(()=>l(o).maxLength)&&_t(yt)})}u(wt),u(nt),ht(()=>{st(vt,(l(o),B(()=>l(o).content))),st(St,`${l(o),B(()=>l(o).content.length)??""} chars`)}),k(F,nt)};it(R,F=>{l(n),l(o),B(()=>l(n)==="text"&&l(o)?.content)&&F(D)})}var V=w(R,2),ot=f(V);{var at=F=>{var nt=Li();nt.__click=[Ti,r,n];var G=f(nt);Ie(G,{class:"w-4 h-4 mr-2"}),Ct(),u(nt),k(F,nt)};it(ot,F=>{l(n)==="text"&&F(at)})}var H=w(ot,2);H.__click=[Ci,r];var P=f(H);Cs(P,{class:"w-4 h-4 mr-2"}),Ct(),u(H);var J=w(H,2);J.__click=[ki,r];var ft=f(J);an(ft,{class:"w-4 h-4 mr-2"}),Ct(),u(J),u(V);var gt=w(V,2);{var kt=F=>{var nt=Hi(),G=w(f(nt),2),vt=f(G,!0);u(G),u(nt),ht(()=>st(vt,(l(o),B(()=>l(o).classes)))),k(F,nt)};it(gt,F=>{l(o),B(()=>l(o)?.classes)&&F(kt)})}u(d),ht(()=>{st(_,l(n)),st(M,(l(o),B(()=>l(o)?.tag))),st(j,l(n))}),k(v,d)};it(a,v=>{l(s)&&v(h)})}u(i),k(e,i),jt()}be(["click"]);var Ri=(e,t)=>t()("undo"),Vi=(e,t)=>t()("redo"),Di=W('<div class="card p-4"><h4 class="text-sm font-medium text-stone-900 mb-3">Current Content</h4> <div class="bg-stone-50 p-3 text-xs text-stone-800 font-mono"> </div> <div class="text-xs text-stone-500 mt-2"> </div></div>'),zi=W('<div class="space-y-6 animate-fade-in"><div class="card p-4"><h4 class="text-sm font-medium text-stone-900 mb-3 flex items-center gap-2"><!> History</h4> <div class="space-y-2 text-xs"><div class="flex justify-between"><span class="text-stone-600">Current Version</span> <code class="bg-stone-100 px-2 py-1 text-stone-800"> </code></div> <div class="flex justify-between"><span class="text-stone-600">Total Versions</span> <span class="text-stone-900"> </span></div></div></div> <div class="space-y-2"><button class="btn w-full text-sm disabled:opacity-50 disabled:cursor-not-allowed"><!> Undo</button> <button class="btn w-full text-sm disabled:opacity-50 disabled:cursor-not-allowed"><!> Redo</button></div> <!></div>');function Bi(e,t){Bt(t,!1);let n=Q(t,"historyInfo",8),s=Q(t,"onHistoryAction",8);Ft();var o=zi(),r=f(o),i=f(r),a=f(i);ui(a,{class:"w-4 h-4"}),Ct(),u(i);var h=w(i,2),v=f(h),d=w(f(v),2),p=f(d);u(d),u(v);var m=w(v,2),g=w(f(m),2),x=f(g,!0);u(g),u(m),u(h),u(r);var y=w(r,2),T=f(y);T.__click=[Ri,s];var _=f(T);Is(_,{class:"w-4 h-4 mr-2"}),Ct(),u(T);var I=w(T,2);I.__click=[Vi,s];var E=f(I);Ts(E,{class:"w-4 h-4 mr-2"}),Ct(),u(I),u(y);var b=w(y,2);{var $=M=>{var S=Di(),A=w(f(S),2),j=f(A,!0);u(A);var Y=w(A,2),O=f(Y);u(Y),u(S),ht(()=>{st(j,(mt(n()),B(()=>n().currentText))),st(O,`${mt(n()),B(()=>n().currentText.length)??""} characters`)}),k(M,S)};it(b,M=>{mt(n()),B(()=>n().currentText)&&M($)})}u(o),ht(()=>{st(p,`v${mt(n()),B(()=>n().currentVersion)??""}`),st(x,(mt(n()),B(()=>n().totalVersions))),T.disabled=(mt(n()),B(()=>!n().canUndo)),I.disabled=(mt(n()),B(()=>!n().canRedo))}),k(e,o),jt()}be(["click"]);const ji={section:{outline:"2px solid rgb(99, 102, 241)",backgroundColor:"rgba(99, 102, 241, 0.1)",overlayColor:"rgb(79, 70, 229)",color:"indigo"},repeatable:{outline:"2px solid rgb(34, 197, 94)",backgroundColor:"rgba(34, 197, 94, 0.1)",overlayColor:"rgb(22, 163, 74)",hoverOutline:"2px dashed rgb(34, 197, 94)",hoverBackgroundColor:"rgba(34, 197, 94, 0.05)",color:"green"},text:{outline:"2px solid rgb(59, 130, 246)",backgroundColor:"rgba(59, 130, 246, 0.1)",overlayColor:"rgb(37, 99, 235)",color:"blue"},image:{outline:"2px solid rgb(251, 146, 60)",backgroundColor:"rgba(251, 146, 60, 0.1)",overlayColor:"rgb(249, 115, 22)",color:"orange"},icon:{outline:"2px solid rgb(168, 85, 247)",backgroundColor:"rgba(168, 85, 247, 0.1)",overlayColor:"rgb(147, 51, 234)",color:"purple"},link:{outline:"2px solid rgb(6, 182, 212)",backgroundColor:"rgba(6, 182, 212, 0.1)",overlayColor:"rgb(8, 145, 178)",color:"cyan"}};class Fi{items;config;selectedItems;selectedElements;selectedSectionIndex;activeType;activeContext;activeStyle;isEmpty;count;onSelectionChange;onStyleApply;constructor(t){this.config=Rn({mode:"single",allowCrossContext:!1,styles:ji,...t}),this.items=Rn(new Map),this.selectedItems=Ut(this.items,n=>Array.from(n.values())),this.selectedElements=Ut(this.items,n=>{const s=new Set;return n.forEach(o=>{o.element instanceof HTMLElement&&s.add(o.element)}),s}),this.selectedSectionIndex=Ut(this.items,n=>{const s=Array.from(n.values()).find(o=>o.type==="section");return s&&typeof s.element=="number"?s.element:null}),this.activeType=Ut(this.items,n=>{const s=Array.from(n.values()).map(o=>o.type);return s.includes("section")?"section":s.includes("repeatable")?"repeatable":s[0]||null}),this.activeContext=Ut(this.items,n=>Array.from(n.values()).map(o=>o.context)[0]||null),this.activeStyle=Ut([this.activeType,this.config],([n,s])=>n?s.styles[n]:null),this.isEmpty=Ut(this.items,n=>n.size===0),this.count=Ut(this.items,n=>n.size)}setCallbacks(t){t.onSelectionChange&&(this.onSelectionChange=t.onSelectionChange),t.onStyleApply&&(this.onStyleApply=t.onStyleApply)}select(t,n,s,o,r={}){const i=Lt(this.config),a=Lt(this.items),h=r.id||this.generateId(t,n,s);if(!r.multi||i.mode==="single")this.clear();else if(!i.allowCrossContext){const d=Array.from(a.values())[0]?.context;d&&d!==s&&this.clear()}const v={id:h,type:n,element:t,context:s,data:o};return this.items.update(d=>(d.set(h,v),new Map(d))),t instanceof HTMLElement&&this.applyStyles(t,n,!0),this.onSelectionChange?.(Lt(this.selectedItems)),h}deselect(t){const s=Lt(this.items).get(t);return s?(s.element instanceof HTMLElement&&this.removeStyles(s.element),this.items.update(o=>(o.delete(t),new Map(o))),this.onSelectionChange?.(Lt(this.selectedItems)),!0):!1}toggle(t,n,s,o){const r=this.findId(t,n,s);return r?(this.deselect(r),{selected:!1,id:r}):{selected:!0,id:this.select(t,n,s,o,{multi:!0})}}clear(){Lt(this.items).forEach(n=>{n.element instanceof HTMLElement&&this.removeStyles(n.element)}),this.items.set(new Map),this.onSelectionChange?.([])}isSelected(t,n,s){return this.findId(t,n,s)!==null}getById(t){return Lt(this.items).get(t)||null}getByType(t){return Array.from(Lt(this.items).values()).filter(n=>n.type===t)}getByContext(t){return Array.from(Lt(this.items).values()).filter(n=>n.context===t)}getConfig(){return Lt(this.config)}updateConfig(t){this.config.update(n=>({...n,...t}))}updateStyles(t,n){this.config.update(s=>({...s,styles:{...s.styles,[t]:{...s.styles[t],...n}}}))}generateId(t,n,s){if(typeof t=="number")return`${s}-${n}-${t}`;if(t.id)return t.id;const o=t.tagName.toLowerCase(),r=t.className.split(" ")[0]||"element",i=Array.from(t.parentElement?.children||[]).indexOf(t);return`${s}-${n}-${o}-${r}-${i}`}findId(t,n,s){const o=Lt(this.items);for(const[r,i]of o)if(i.element===t&&(!n||i.type===n)&&(!s||i.context===s))return r;return null}applyStyles(t,n,s){const r=Lt(this.config).styles[n];s&&(t.style.outline=r.outline,t.style.outlineOffset="2px",r.backgroundColor&&(t.style.backgroundColor=r.backgroundColor)),this.onStyleApply?.(t,r,s)}removeStyles(t){t.style.outline="",t.style.outlineOffset="",t.style.backgroundColor=""}}const rt=new Fi;rt.select.bind(rt);rt.deselect.bind(rt);rt.toggle.bind(rt);rt.clear.bind(rt);rt.isSelected.bind(rt);const Ms=rt.selectedItems,Wi=rt.selectedElements,gn=rt.selectedSectionIndex,xn=rt.activeType,Ui=rt.activeContext,Ls=rt.activeStyle,Hs=rt.isEmpty,bn=rt.count;var qi=(e,t)=>t(!1),Ki=(e,t)=>L(t,"debug"),Yi=(e,t)=>L(t,"inspector"),Ji=(e,t)=>L(t,"history"),Gi=W('<div class="p-4"><div class="space-y-4"><div><h3 class="text-sm font-semibold text-stone-700 mb-2">Selection State</h3> <pre class="bg-stone-100 p-3 rounded text-xs overflow-x-auto"> </pre></div> <div><h3 class="text-sm font-semibold text-stone-700 mb-2">History State</h3> <pre class="bg-stone-100 p-3 rounded text-xs overflow-x-auto"> </pre></div> <div><h3 class="text-sm font-semibold text-stone-700 mb-2">Selection Manager Config</h3> <pre class="bg-stone-100 p-3 rounded text-xs overflow-x-auto"> </pre></div></div></div>'),Xi=W('<div class="flex flex-col items-center justify-center py-16 text-center"><div class="w-12 h-12 bg-stone-100 flex items-center justify-center mb-4"><!></div> <p class="text-sm text-stone-600">Select an element to inspect</p></div>'),Zi=W('<div class="p-4"><!></div>'),Qi=W('<div class="flex flex-col items-center justify-center py-16 text-center"><div class="w-12 h-12 bg-stone-100 flex items-center justify-center mb-4"><!></div> <p class="text-sm text-stone-600">No history available</p></div>'),tr=W('<div class="p-4"><!></div>'),er=W('<div class="fixed right-0 top-12 bottom-0 w-80 bg-white shadow-lg overflow-y-auto z-10 animate-slide-in border-l border-stone-200"><div class="h-full flex flex-col"><div class="bg-stone-50 p-4"><div class="flex items-center justify-between mb-4"><h2 class="text-lg font-semibold text-stone-900">Panel</h2> <button class="icon-btn" title="Close Panel"><!></button></div> <div class="flex gap-1"><button><!> Debug</button> <button><!> Inspector</button> <button><!> History</button></div></div> <div class="flex-1 overflow-y-auto"><!></div></div></div>');function nr(e,t){Bt(t,!1);const[n,s]=Oe(),o=()=>Et(Ms,"$selectedItems",n),r=()=>Et(gn,"$selectedSectionIndex",n),i=()=>Et(xn,"$activeSelectionType",n),a=()=>Et(Ui,"$activeSelectionContext",n),h=()=>Et(bn,"$selectionCount",n),v=U(),d=U();let p=Q(t,"selectedElement",8,null),m=Q(t,"historyInfo",8,null),g=Q(t,"onHistoryAction",8),x=Q(t,"isOpen",12,!1),y=U("debug");$t(()=>mt(p()),()=>{L(v,!!p())}),$t(()=>mt(m()),()=>{L(d,!!m())}),ie(),Ft();var T=K(),_=q(T);{var I=E=>{var b=er(),$=f(b),M=f($),S=f(M),A=w(f(S),2);A.__click=[qi,x];var j=f(A);ln(j,{class:"w-4 h-4"}),u(A),u(S);var Y=w(S,2),O=f(Y);O.__click=[Ki,y];var R=f(O);li(R,{class:"w-4 h-4"}),Ct(),u(O);var D=w(O,2);D.__click=[Yi,y];var V=f(D);rn(V,{class:"w-4 h-4"}),Ct(),u(D);var ot=w(D,2);ot.__click=[Ji,y];var at=f(ot);Gn(at,{class:"w-4 h-4"}),Ct(),u(ot),u(Y),u(M);var H=w(M,2),P=f(H);{var J=gt=>{var kt=Gi(),F=f(kt),nt=f(F),G=w(f(nt),2),vt=f(G,!0);u(G),u(nt);var wt=w(nt,2),xt=w(f(wt),2),St=f(xt,!0);u(xt),u(wt);var bt=w(wt,2),yt=w(f(bt),2),_t=f(yt,!0);u(yt),u(bt),u(F),u(kt),ht((z,dt,Pt)=>{st(vt,z),st(St,dt),st(_t,Pt)},[()=>(o(),r(),i(),a(),h(),B(()=>JSON.stringify({selectedItems:Array.from(o()).map(z=>({id:z.id,type:z.type,context:z.context,element:z.element instanceof HTMLElement?{tagName:z.element.tagName,className:z.element.className,id:z.element.id||"no-id",dataAttributes:Object.fromEntries(Object.entries(z.element.dataset))}:z.element,data:z.data})),selectedSectionIndex:r(),activeType:i(),activeContext:a(),selectionCount:h()},null,2))),()=>(mt(pt),B(()=>JSON.stringify({canUndo:pt.canUndo(),canRedo:pt.canRedo(),historyLength:pt.getHistoryLength(),currentVersion:pt.getCurrentVersion()},null,2))),()=>(mt(rt),B(()=>JSON.stringify({mode:rt.getConfig().mode,allowCrossContext:rt.getConfig().allowCrossContext,styles:Object.fromEntries(Object.entries(rt.getConfig().styles).map(([z,dt])=>[z,{color:dt.color,outline:dt.outline}]))},null,2)))],ds),k(gt,kt)},ft=(gt,kt)=>{{var F=G=>{var vt=Zi(),wt=f(vt);{var xt=bt=>{var yt=Xi(),_t=f(yt),z=f(_t);rn(z,{class:"w-6 h-6 text-stone-400"}),u(_t),Ct(2),u(yt),k(bt,yt)},St=bt=>{Oi(bt,{get selectedElement(){return p()}})};it(wt,bt=>{l(v)?bt(St,!1):bt(xt)})}u(vt),k(G,vt)},nt=(G,vt)=>{{var wt=xt=>{var St=tr(),bt=f(St);{var yt=z=>{var dt=Qi(),Pt=f(dt),Dt=f(Pt);Gn(Dt,{class:"w-6 h-6 text-stone-400"}),u(Pt),Ct(2),u(dt),k(z,dt)},_t=(z,dt)=>{{var Pt=Dt=>{Bi(Dt,{get historyInfo(){return m()},get onHistoryAction(){return g()}})};it(z,Dt=>{m()&&Dt(Pt)},dt)}};it(bt,z=>{l(d)?z(_t,!1):z(yt)})}u(St),k(xt,St)};it(G,xt=>{l(y)==="history"&&xt(wt)},vt)}};it(gt,G=>{l(y)==="inspector"?G(F):G(nt,!1)},kt)}};it(P,gt=>{l(y)==="debug"?gt(J):gt(ft,!1)})}u(H),u($),u(b),ht(()=>{ct(O,1,`flex items-center gap-2 px-3 py-2 text-sm transition-colors ${l(y)==="debug"?"bg-blue-500 text-white shadow-sm":"text-stone-600 hover:bg-stone-100"}`),ct(D,1,`flex items-center gap-2 px-3 py-2 text-sm transition-colors ${l(y)==="inspector"?"bg-blue-500 text-white shadow-sm":"text-stone-600 hover:bg-stone-100"}`),ct(ot,1,`flex items-center gap-2 px-3 py-2 text-sm transition-colors ${l(y)==="history"?"bg-blue-500 text-white shadow-sm":"text-stone-600 hover:bg-stone-100"}`),ot.disabled=!l(d)}),k(E,b)};it(_,E=>{x()&&E(I)})}k(e,T),jt(),s()}be(["click"]);var sr=W('<div><div class="absolute left-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-move z-10"><!></div> <button class="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity z-10" title="Toggle visibility"><!></button> <div class="flex items-center gap-1.5 px-2 py-1 bg-white"><span class="text-[9px] text-stone-500 font-medium"> </span> <span class="text-[10px] font-medium text-stone-700 truncate flex-1"> </span></div> <div class="relative overflow-hidden bg-stone-50" style="height: 50px;"><div class="preview-wrapper transform scale-[0.08] origin-top svelte-15tpi43" style="width: 1250%; transform-origin: top center; position: absolute; left: 50%; transform: translateX(-50%) scale(0.08);"><div class="mx-auto" style="width: 1200px;"><!></div></div></div></div>'),or=W('<div class="text-center py-6"><!> <p class="text-xs text-stone-500">No sections</p></div>'),ir=W('<div class="fixed left-0 top-12 bottom-0 z-20 flex"><div><div class="h-full flex flex-col"><div class="flex items-center justify-between px-2 py-2 border-b border-stone-200"><div class="flex items-center gap-1"><!> <h3 class="text-[11px] font-medium text-stone-900">Sections</h3> <span class="text-[11px] text-stone-500"> </span></div> <button class="w-5 h-5 flex items-center justify-center hover:bg-stone-100 rounded transition-colors" title="Add Section"><!></button></div> <div class="flex-1 overflow-y-auto p-1.5 space-y-1"><!> <!></div></div></div></div>');function rr(e,t){Bt(t,!1);const[n,s]=Oe(),o=()=>Et(gn,"$selectedSectionIndex",n);let r=Q(t,"isOpen",8,!0),i=Q(t,"templates",24,()=>[]),a=Q(t,"onSelectSection",8,()=>{}),h=Q(t,"onReorderSections",8,()=>{}),v=Q(t,"onToggleVisibility",8,()=>{}),d=Q(t,"onAddSection",8,()=>{}),p=U([]),m=null,g=U(null);function x(H){let P=H.html;return P=P.replace(/<section([^>]*)>/gi,'<section$1 style="padding: 12px; margin: 0;">'),P}function y(H,P){m=P,H.dataTransfer&&(H.dataTransfer.effectAllowed="move")}function T(H,P){H.preventDefault(),H.dataTransfer&&(H.dataTransfer.dropEffect="move"),L(g,P)}function _(){m!==null&&l(g)!==null&&m!==l(g)&&h()(m,l(g)),m=null,L(g,null)}function I(H){H.preventDefault()}Ne(()=>()=>{}),Ft();var E=ir(),b=f(E),$=f(b),M=f($),S=f(M),A=f(S);Xn(A,{class:"w-3 h-3 text-stone-600"});var j=w(A,4),Y=f(j,!0);u(j),u(S);var O=w(S,2),R=f(O);mn(R,{class:"w-3 h-3 text-stone-600"}),u(O),u(M);var D=w(M,2),V=f(D);se(V,3,i,(H,P)=>H.id+P,(H,P,J)=>{var ft=sr();Gt(ft,"draggable",!0);var gt=f(ft),kt=f(gt);mi(kt,{class:"w-3 h-3 text-stone-400"}),u(gt);var F=w(gt,2),nt=f(F);ks(nt,{class:"w-3 h-3 text-stone-600"}),u(F);var G=w(F,2),vt=f(G),wt=f(vt,!0);u(vt);var xt=w(vt,2),St=f(xt,!0);u(xt),u(G);var bt=w(G,2),yt=f(bt),_t=f(yt),z=f(_t);pn(z,()=>(l(P),B(()=>x(l(P))))),u(_t),Re(_t,(dt,Pt)=>gs(p,l(p)[Pt]=dt),dt=>l(p)?.[dt],()=>[l(J)]),u(yt),u(bt),u(ft),ht(()=>{ct(ft,1,`group relative bg-stone-50 border rounded overflow-hidden transition-all hover:shadow-sm cursor-pointer ${l(g)===l(J)?"border-blue-500":o()===l(J)?"border-2 border-indigo-500 bg-indigo-50":"border-stone-200 hover:border-stone-300"}`,"svelte-15tpi43"),st(wt,l(J)+1),st(St,(l(P),B(()=>l(P).name)))}),Tt("click",F,ii(()=>v()(l(J)))),Tt("click",ft,()=>a()(l(J))),Tt("dragstart",ft,dt=>y(dt,l(J))),Tt("dragover",ft,dt=>T(dt,l(J))),Tt("dragend",ft,_),Tt("drop",ft,I),k(H,ft)});var ot=w(V,2);{var at=H=>{var P=or(),J=f(P);Xn(J,{class:"w-6 h-6 text-stone-300 mx-auto mb-1"}),Ct(2),u(P),k(H,P)};it(ot,H=>{mt(i()),B(()=>i().length===0)&&H(at)})}u(D),u($),u(b),u(E),ht(()=>{ct(b,1,`bg-white border-r border-stone-200 shadow-sm transition-all duration-300 overflow-hidden ${r()?"w-40":"w-0"}`),st(Y,(mt(i()),B(()=>i().length)))}),Tt("click",O,function(...H){d()?.apply(this,H)}),k(e,E),jt(),s()}const zt=[{id:"hero-minimal",name:"Hero",description:"Simple hero section",category:"hero",html:`
			<section class="py-24 text-center border-b border-stone-200">
				<div class="max-w-4xl mx-auto px-8">
					<div class="inline-block px-3 py-1 bg-stone-100 text-stone-600 text-sm mb-8 font-medium">
						Beta
					</div>
					<h1 class="hero-title text-4xl md:text-6xl font-bold mb-6 text-stone-900 leading-tight">Product Name</h1>
					<p class="hero-description text-xl text-stone-600 max-w-2xl mx-auto mb-8">Brief description of what this product does</p>
					<div class="flex flex-col sm:flex-row gap-3 justify-center">
						<button class="hero-cta px-6 py-3 bg-stone-900 text-white font-medium hover:bg-stone-800 transition-colors">
							Get Started
						</button>
						<button class="px-6 py-3 border border-stone-300 text-stone-700 font-medium hover:bg-stone-50 transition-colors">
							Learn More
						</button>
					</div>
				</div>
			</section>
		`,editableElements:[{selector:".hero-title",type:"text",defaultValue:"Product Name",constraints:{maxLength:60}},{selector:".hero-description",type:"text",defaultValue:"Brief description of what this product does",constraints:{maxLength:150}},{selector:".hero-cta",type:"text",defaultValue:"Get Started",constraints:{maxLength:30}}]},{id:"hero-centered",name:"Centered Hero",description:"Centered hero with subtitle",category:"hero",html:`
			<section class="py-32 text-center">
				<div class="max-w-3xl mx-auto px-8">
					<h1 class="hero-title text-5xl md:text-7xl font-bold mb-6 text-stone-900 tracking-tight">Simple. Powerful.</h1>
					<p class="hero-subtitle text-2xl text-stone-500 mb-8 font-light">Focus on what matters</p>
					<button class="hero-cta px-8 py-4 bg-stone-900 text-white font-medium hover:bg-stone-800 transition-colors">
						Start Building
					</button>
				</div>
			</section>
		`,editableElements:[{selector:".hero-title",type:"text",defaultValue:"Simple. Powerful.",constraints:{maxLength:50}},{selector:".hero-subtitle",type:"text",defaultValue:"Focus on what matters",constraints:{maxLength:100}},{selector:".hero-cta",type:"text",defaultValue:"Start Building",constraints:{maxLength:30}}]},{id:"features-grid",name:"Features",description:"3-column feature grid",category:"features",html:`
			<section class="py-24 border-b border-stone-200">
				<div class="max-w-6xl mx-auto px-8">
					<div class="text-center mb-16">
						<h2 class="section-title text-3xl font-bold text-stone-900 mb-4">Features</h2>
						<p class="text-stone-600">Everything you need to get started</p>
					</div>
					<div class="grid grid-cols-1 md:grid-cols-3 gap-12">
						<div class="text-center" data-repeatable="feature">
							<div class="w-12 h-12 bg-stone-900 mx-auto mb-6"></div>
							<h3 class="feature-title text-xl font-semibold text-stone-900 mb-3" data-editable="text">Fast</h3>
							<p class="feature-description text-stone-600" data-editable="text">Built for speed and performance</p>
						</div>
						<div class="text-center" data-repeatable="feature">
							<div class="w-12 h-12 bg-stone-900 mx-auto mb-6"></div>
							<h3 class="feature-title text-xl font-semibold text-stone-900 mb-3" data-editable="text">Secure</h3>
							<p class="feature-description text-stone-600" data-editable="text">Enterprise-grade security</p>
						</div>
						<div class="text-center" data-repeatable="feature">
							<div class="w-12 h-12 bg-stone-900 mx-auto mb-6"></div>
							<h3 class="feature-title text-xl font-semibold text-stone-900 mb-3" data-editable="text">Simple</h3>
							<p class="feature-description text-stone-600" data-editable="text">Easy to use and understand</p>
						</div>
					</div>
				</div>
			</section>
		`,editableElements:[{selector:".section-title",type:"text",defaultValue:"Features",constraints:{maxLength:50}},{selector:".feature-title",type:"text",defaultValue:"Feature Name",constraints:{maxLength:30}},{selector:".feature-description",type:"text",defaultValue:"Feature description",constraints:{maxLength:100}}]},{id:"cta-simple",name:"CTA",description:"Simple call-to-action",category:"cta",html:`
			<section class="py-24 bg-stone-900 text-white text-center">
				<div class="max-w-3xl mx-auto px-8">
					<h2 class="cta-title text-3xl md:text-4xl font-bold mb-6">Ready to get started?</h2>
					<p class="cta-description text-xl text-stone-300 mb-8">Join thousands of users today</p>
					<button class="cta-button px-8 py-4 bg-white text-stone-900 font-medium hover:bg-stone-100 transition-colors">
						Get Started
					</button>
				</div>
			</section>
		`,editableElements:[{selector:".cta-title",type:"text",defaultValue:"Ready to get started?",constraints:{maxLength:60}},{selector:".cta-description",type:"text",defaultValue:"Join thousands of users today",constraints:{maxLength:100}},{selector:".cta-button",type:"text",defaultValue:"Get Started",constraints:{maxLength:30}}]},{id:"content-two-column",name:"Two Column",description:"Two-column content layout",category:"content",html:`
			<section class="py-24 border-b border-stone-200">
				<div class="max-w-6xl mx-auto px-8">
					<div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
						<div>
							<h2 class="content-title text-3xl font-bold text-stone-900 mb-6">Why choose us</h2>
							<p class="content-text text-stone-600 text-lg leading-relaxed mb-6">We provide the tools and infrastructure you need to build amazing products.</p>
							<ul class="space-y-3">
								<li class="list-item flex items-center text-stone-700">
									<div class="w-2 h-2 bg-stone-900 mr-3"></div>
									Built for developers
								</li>
								<li class="list-item flex items-center text-stone-700">
									<div class="w-2 h-2 bg-stone-900 mr-3"></div>
									Production ready
								</li>
								<li class="list-item flex items-center text-stone-700">
									<div class="w-2 h-2 bg-stone-900 mr-3"></div>
									24/7 support
								</li>
							</ul>
						</div>
						<div class="aspect-video bg-stone-100 border border-stone-200"></div>
					</div>
				</div>
			</section>
		`,editableElements:[{selector:".content-title",type:"text",defaultValue:"Why choose us",constraints:{maxLength:50}},{selector:".content-text",type:"text",defaultValue:"We provide the tools and infrastructure you need to build amazing products.",constraints:{maxLength:200}},{selector:".list-item",type:"text",defaultValue:"List item",constraints:{maxLength:50}}]},{id:"testimonial-single",name:"Testimonial",description:"Single testimonial",category:"testimonial",html:`
			<section class="py-24 text-center border-b border-stone-200">
				<div class="max-w-4xl mx-auto px-8">
					<blockquote class="testimonial-quote text-2xl md:text-3xl font-light text-stone-900 mb-8 leading-relaxed">
						"This product has transformed how we work. Highly recommended."
					</blockquote>
					<div class="testimonial-author">
						<div class="author-name text-stone-900 font-semibold">John Smith</div>
						<div class="author-role text-stone-600">CEO, Company</div>
					</div>
				</div>
			</section>
		`,editableElements:[{selector:".testimonial-quote",type:"text",defaultValue:'"This product has transformed how we work. Highly recommended."',constraints:{maxLength:200}},{selector:".author-name",type:"text",defaultValue:"John Smith",constraints:{maxLength:50}},{selector:".author-role",type:"text",defaultValue:"CEO, Company",constraints:{maxLength:50}}]},{id:"pricing-simple",name:"Pricing",description:"Simple pricing table",category:"pricing",html:`
			<section class="py-24 text-center border-b border-stone-200">
				<div class="max-w-4xl mx-auto px-8">
					<h2 class="section-title text-3xl font-bold text-stone-900 mb-4">Pricing</h2>
					<p class="text-stone-600 mb-12">Simple, transparent pricing</p>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
						<div class="border border-stone-200 p-8 text-left">
							<h3 class="price-plan text-xl font-semibold text-stone-900 mb-2">Starter</h3>
							<div class="price-amount text-3xl font-bold text-stone-900 mb-4">$29</div>
							<p class="price-description text-stone-600 mb-6">Perfect for getting started</p>
							<button class="price-button w-full px-6 py-3 border border-stone-300 text-stone-700 font-medium hover:bg-stone-50 transition-colors">
								Choose Plan
							</button>
						</div>
						<div class="border border-stone-900 p-8 text-left bg-stone-900 text-white">
							<h3 class="price-plan text-xl font-semibold mb-2">Pro</h3>
							<div class="price-amount text-3xl font-bold mb-4">$99</div>
							<p class="price-description text-stone-300 mb-6">For growing teams</p>
							<button class="price-button w-full px-6 py-3 bg-white text-stone-900 font-medium hover:bg-stone-100 transition-colors">
								Choose Plan
							</button>
						</div>
					</div>
				</div>
			</section>
		`,editableElements:[{selector:".section-title",type:"text",defaultValue:"Pricing",constraints:{maxLength:50}},{selector:".price-plan",type:"text",defaultValue:"Plan Name",constraints:{maxLength:30}},{selector:".price-amount",type:"text",defaultValue:"$99",constraints:{maxLength:20}},{selector:".price-description",type:"text",defaultValue:"Plan description",constraints:{maxLength:100}},{selector:".price-button",type:"text",defaultValue:"Choose Plan",constraints:{maxLength:30}}]}];class Qn{static htmlToEditableComponent(t,n={}){const{preserveStyles:s=!0,addEditableMarkers:o=!0,generateProps:r=!1}=n,h=new DOMParser().parseFromString(t.html,"text/html").body;return o&&t.editableElements.forEach(d=>{h.querySelectorAll(d.selector).forEach(m=>{m.setAttribute("data-editable",d.type),d.constraints?.maxLength&&m.setAttribute("data-max-length",d.constraints.maxLength.toString())})}),this.generateSvelteComponent(h.innerHTML,t,n)}static generateSvelteComponent(t,n,s){const o=s.generateProps?this.generateProps(n):"";return this.generateEventHandlers(),`<script lang="ts">
	import { getContext } from 'svelte';
	${o}

	// Editor context에서 핸들러 가져오기
	const { handleElementClick, handleTextInput, stopEdit } = getContext('editor') || {};
<\/script>

${this.processHtmlForSvelte(t)}

<style>
	/* 템플릿 스타일 */
	${s.preserveStyles?this.extractStyles(n.html):""}
</style>`}static generateProps(t){return t.editableElements.filter(s=>s.type==="text").map(s=>`export let ${this.selectorToPropName(s.selector)} = '${s.defaultValue}';`).join(`
	`)}static generateEventHandlers(){return`
	function onElementClick(e: MouseEvent) {
		handleElementClick?.(e);
	}

	function onTextInput(e: Event) {
		handleTextInput?.(e.currentTarget as HTMLElement);
	}

	function onBlur() {
		stopEdit?.();
	}`}static processHtmlForSvelte(t){let n=t;return n=n.replace(/(<[^>]+data-editable="text"[^>]*)(>)/g,"$1 on:click={handleElementClick} on:blur={stopEdit} on:input={handleTextInput}$2"),n=n.replace(/(<[^>]+data-editable="(?:icon|image|link)"[^>]*)(>)/g,"$1 on:click={handleElementClick}$2"),n=n.replace(/(data-editable="text"[^>]*class="[^"]*)/g,"$1 cursor-pointer hover:bg-gray-50 rounded-lg px-4 py-2 transition-colors"),n}static extractStyles(t){const n=t.match(/<style[^>]*>([\s\S]*?)<\/style>/i);return n?n[1]:""}static selectorToPropName(t){return t.replace(/[#.]/g,"").replace(/-([a-z])/g,(n,s)=>s.toUpperCase()).replace(/\s+/g,"")}}var ar=W("<button><!> </button>"),lr=W('<div class="bg-white shadow-sm hover:shadow-md transition-all animate-fade-in"><div class="aspect-video bg-stone-50 relative overflow-hidden"><div class="scale-[0.08] origin-top-left w-[1250px] h-[940px] pointer-events-none"><!></div> <div class="absolute inset-0 bg-black/0 hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 hover:opacity-100"><div class="flex gap-2"><button class="icon-btn bg-white/90" title="View Code"><!></button> <button class="icon-btn bg-stone-900 text-white" title="Add Template"><!></button></div></div></div> <div class="p-3"><h3 class="font-medium text-stone-900 text-sm"> </h3> <p class="text-xs text-stone-600 mt-1"> </p> <div class="flex justify-between items-center mt-2"><span class="text-xs text-stone-400 capitalize"> </span> <span class="text-xs text-stone-400"> </span></div></div></div>'),cr=W('<div class="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"><div class="bg-white shadow-lg max-w-6xl w-full max-h-[90vh] overflow-hidden animate-slide-in"><div class="bg-stone-50 p-4 flex items-center justify-between"><h2 class="text-lg font-semibold text-stone-900">Templates</h2> <button class="icon-btn"><!></button></div> <div class="flex h-[calc(90vh-80px)]"><div class="w-32 bg-stone-50 p-4"><div class="space-y-1"></div></div> <div class="flex-1 p-6 overflow-y-auto"><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div></div></div></div></div>'),dr=W('<div class="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fade-in"><div class="bg-white shadow-lg max-w-4xl w-full max-h-[80vh] overflow-hidden animate-slide-in"><div class="bg-stone-50 p-4 flex items-center justify-between"><h3 class="text-lg font-semibold text-stone-900"> </h3> <button class="icon-btn"><!></button></div> <div class="p-4 overflow-y-auto max-h-[calc(80vh-80px)]"><pre class="bg-stone-50 text-stone-800 p-4 text-xs overflow-x-auto svelte-c1htnj"><code class="svelte-c1htnj"> </code></pre></div></div></div>'),ur=W("<!> <!>",1);function fr(e,t){Bt(t,!1);const n=U(),s=U();let o=Q(t,"isOpen",12,!1),r=Q(t,"onSelectTemplate",8),i=U("all"),a=U(null),h=U(!1);function v(_){r()(_),o(!1)}function d(_){L(a,_),L(h,!0)}const p=[{id:"all",name:"All",icon:ke},{id:"hero",name:"Hero",icon:ke},{id:"features",name:"Features",icon:Jn},{id:"cta",name:"CTA",icon:wi},{id:"content",name:"Content",icon:ke},{id:"testimonial",name:"Testimonial",icon:Jn},{id:"pricing",name:"Pricing",icon:ke}];$t(()=>(l(i),zt),()=>{L(n,l(i)==="all"?zt:zt.filter(_=>_.category===l(i)))}),$t(()=>(l(a),Qn),()=>{L(s,l(a)?Qn.htmlToEditableComponent(l(a),{preserveStyles:!0,addEditableMarkers:!0,generateProps:!1}):"")}),ie(),Ft();var m=ur(),g=q(m);{var x=_=>{var I=cr(),E=f(I),b=f(E),$=w(f(b),2),M=f($);ln(M,{class:"w-4 h-4"}),u($),u(b);var S=w(b,2),A=f(S),j=f(A);se(j,5,()=>p,Ae,(R,D)=>{var V=ar(),ot=f(V);xs(ot,()=>l(D).icon,(H,P)=>{P(H,{class:"w-4 h-4"})});var at=w(ot);u(V),ht(()=>{ct(V,1,`w-full flex flex-col items-center gap-2 p-3 text-xs hover:bg-stone-50 transition-colors ${l(i),l(D),B(()=>l(i)===l(D).id?"bg-stone-900 text-white":"text-stone-600")??""}`),st(at,` ${l(D),B(()=>l(D).name)??""}`)}),Tt("click",V,()=>L(i,l(D).id)),k(R,V)}),u(j),u(A);var Y=w(A,2),O=f(Y);se(O,5,()=>l(n),Ae,(R,D,V)=>{var ot=lr();ge(ot,`animation-delay: ${V*.05}s`);var at=f(ot),H=f(at),P=f(H);pn(P,()=>(l(D),B(()=>l(D).html))),u(H);var J=w(H,2),ft=f(J),gt=f(ft),kt=f(gt);fi(kt,{class:"w-4 h-4"}),u(gt);var F=w(gt,2),nt=f(F);mn(nt,{class:"w-4 h-4"}),u(F),u(ft),u(J),u(at);var G=w(at,2),vt=f(G),wt=f(vt,!0);u(vt);var xt=w(vt,2),St=f(xt,!0);u(xt);var bt=w(xt,2),yt=f(bt),_t=f(yt,!0);u(yt);var z=w(yt,2),dt=f(z);u(z),u(bt),u(G),u(ot),ht(()=>{st(wt,(l(D),B(()=>l(D).name))),st(St,(l(D),B(()=>l(D).description))),st(_t,(l(D),B(()=>l(D).category))),st(dt,`${l(D),B(()=>l(D).editableElements.length)??""} elements`)}),Tt("click",gt,()=>d(l(D))),Tt("click",F,()=>v(l(D))),k(R,ot)}),u(O),u(Y),u(S),u(E),u(I),Tt("click",$,()=>o(!1)),k(_,I)};it(g,_=>{o()&&_(x)})}var y=w(g,2);{var T=_=>{var I=dr(),E=f(I),b=f(E),$=f(b),M=f($);u($);var S=w($,2),A=f(S);ln(A,{class:"w-4 h-4"}),u(S),u(b);var j=w(b,2),Y=f(j),O=f(Y),R=f(O,!0);u(O),u(Y),u(j),u(E),u(I),ht(()=>{st(M,`${l(a),B(()=>l(a).name)??""} Code`),st(R,l(s))}),Tt("click",S,()=>{L(h,!1),L(a,null)}),k(_,I)};it(y,_=>{l(h)&&l(a)&&_(T)})}k(e,m),jt()}var vr=W('<div class="template-content svelte-1myzxo"><!></div>');function hr(e,t){Bt(t,!1);const n=U();let s=Q(t,"template",8),o=Q(t,"handleElementClick",8);Q(t,"handleTextInput",8),Q(t,"stopEdit",8);let r=U();function i(p){const x=new DOMParser().parseFromString(p.html,"text/html").body;return p.editableElements.forEach(y=>{x.querySelectorAll(y.selector).forEach(_=>{if(_.setAttribute("data-editable",y.type),y.constraints?.maxLength&&_.setAttribute("data-max-length",y.constraints.maxLength.toString()),y.type==="text"){const I=_.getAttribute("class")||"";_.setAttribute("class",`${I} cursor-pointer hover:bg-gray-50 rounded-lg px-4 py-2 transition-colors`)}})}),x.innerHTML}function a(){if(!l(r))return;l(r).querySelectorAll("[data-editable]").forEach(g=>{const x=g;x.dataset.editable==="text"&&x.textContent&&(x.textContent=x.textContent.trim()),x.addEventListener("click",o())}),l(r).querySelectorAll("[data-repeatable]").forEach(g=>{g.addEventListener("click",o())})}function h(){if(!l(r))return;l(r).querySelectorAll("[data-editable]").forEach(g=>{g.removeEventListener("click",o())}),l(r).querySelectorAll("[data-repeatable]").forEach(g=>{g.removeEventListener("click",o())})}Ne(()=>(a(),()=>{h()})),ho(()=>{h(),a()}),$t(()=>mt(s()),()=>{L(n,i(s()))}),ie(),Ft();var v=vr(),d=f(v);pn(d,()=>l(n)),u(v),Re(v,p=>L(r,p),()=>l(r)),k(e,v),jt()}var pr=W('<nav class="hidden md:flex items-center space-x-8"><a href="#" class="text-stone-600 hover:text-stone-900 text-sm font-medium">Home</a> <a href="#" class="text-stone-600 hover:text-stone-900 text-sm font-medium">Products</a> <a href="#" class="text-stone-600 hover:text-stone-900 text-sm font-medium">About</a> <a href="#" class="text-stone-600 hover:text-stone-900 text-sm font-medium">Contact</a></nav> <div class="hidden md:flex items-center space-x-4"><button class="text-stone-600 hover:text-stone-900 text-sm font-medium">Sign in</button> <button class="px-4 py-2 bg-stone-900 text-white text-sm font-medium rounded hover:bg-stone-800 transition-colors">Get Started</button></div>',1),mr=W('<button class="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg></button>'),gr=W('<header class="bg-white border-b border-stone-200 sticky top-0 z-10"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex items-center justify-between h-16"><div class="flex items-center"><div class="flex-shrink-0"><div class="w-8 h-8 bg-stone-900 rounded"></div></div> <div class="ml-3"><span class="text-lg font-semibold text-stone-900">Brand</span></div></div> <!> <!></div></div></header>');function xr(e,t){let n=Q(t,"devicePreview",8,"full");var s=gr(),o=f(s),r=f(o),i=w(f(r),2);{var a=d=>{var p=pr();Ct(2),k(d,p)};it(i,d=>{(n()==="desktop"||n()==="full")&&d(a)})}var h=w(i,2);{var v=d=>{var p=mr();k(d,p)};it(h,d=>{(n()==="mobile"||n()==="tablet")&&d(v)})}u(r),u(o),u(s),k(e,s)}var br=W('<div><h4 class="text-sm font-semibold mb-4">Product</h4> <ul class="space-y-2"><li><a href="#" class="text-stone-400 hover:text-white text-sm transition-colors">Features</a></li> <li><a href="#" class="text-stone-400 hover:text-white text-sm transition-colors">Pricing</a></li> <li><a href="#" class="text-stone-400 hover:text-white text-sm transition-colors">Documentation</a></li> <li><a href="#" class="text-stone-400 hover:text-white text-sm transition-colors">API</a></li></ul></div> <div><h4 class="text-sm font-semibold mb-4">Company</h4> <ul class="space-y-2"><li><a href="#" class="text-stone-400 hover:text-white text-sm transition-colors">About</a></li> <li><a href="#" class="text-stone-400 hover:text-white text-sm transition-colors">Blog</a></li> <li><a href="#" class="text-stone-400 hover:text-white text-sm transition-colors">Careers</a></li> <li><a href="#" class="text-stone-400 hover:text-white text-sm transition-colors">Contact</a></li></ul></div>',1),yr=W('<footer class="bg-stone-900 text-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div><div><div class="flex items-center gap-3 mb-4"><div class="w-8 h-8 bg-white rounded"></div> <span class="text-lg font-semibold">Brand</span></div> <p class="text-stone-400 text-sm">Building amazing products for developers and designers around the world.</p></div> <!></div> <div class="py-6 border-t border-stone-800"><div><p class="text-stone-400 text-sm">© 2024 Brand. All rights reserved.</p> <div class="flex items-center gap-4"><a href="#" class="text-stone-400 hover:text-white transition-colors"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path></svg></a> <a href="#" class="text-stone-400 hover:text-white transition-colors"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path></svg></a> <a href="#" class="text-stone-400 hover:text-white transition-colors"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"></path></svg></a></div></div></div></div></footer>');function _r(e,t){let n=Q(t,"devicePreview",8,"full");var s=yr(),o=f(s),r=f(o),i=f(r),a=w(i,2);{var h=p=>{var m=br();Ct(2),k(p,m)};it(a,p=>{n()!=="mobile"&&p(h)})}u(r);var v=w(r,2),d=f(v);u(v),u(o),u(s),ht(()=>{ct(r,1,`py-12 ${n()==="mobile"?"space-y-8":"grid grid-cols-4 gap-8"}`),ct(i,1,n()==="mobile"?"":"col-span-2"),ct(d,1,n()==="mobile"?"space-y-4":"flex items-center justify-between")}),k(e,s)}const cn=Math.min,te=Math.max,Me=Math.round,Rt=e=>({x:e,y:e}),wr={left:"right",right:"left",bottom:"top",top:"bottom"},$r={start:"end",end:"start"};function ts(e,t,n){return te(e,cn(t,n))}function Ve(e,t){return typeof e=="function"?e(t):e}function Xt(e){return e.split("-")[0]}function De(e){return e.split("-")[1]}function Ns(e){return e==="x"?"y":"x"}function Ps(e){return e==="y"?"height":"width"}const Er=new Set(["top","bottom"]);function Kt(e){return Er.has(Xt(e))?"y":"x"}function Os(e){return Ns(Kt(e))}function Sr(e,t,n){n===void 0&&(n=!1);const s=De(e),o=Os(e),r=Ps(o);let i=o==="x"?s===(n?"end":"start")?"right":"left":s==="start"?"bottom":"top";return t.reference[r]>t.floating[r]&&(i=Le(i)),[i,Le(i)]}function Cr(e){const t=Le(e);return[dn(e),t,dn(t)]}function dn(e){return e.replace(/start|end/g,t=>$r[t])}const es=["left","right"],ns=["right","left"],kr=["top","bottom"],Tr=["bottom","top"];function Ar(e,t,n){switch(e){case"top":case"bottom":return n?t?ns:es:t?es:ns;case"left":case"right":return t?kr:Tr;default:return[]}}function Ir(e,t,n,s){const o=De(e);let r=Ar(Xt(e),n==="start",s);return o&&(r=r.map(i=>i+"-"+o),t&&(r=r.concat(r.map(dn)))),r}function Le(e){return e.replace(/left|right|bottom|top/g,t=>wr[t])}function Mr(e){return{top:0,right:0,bottom:0,left:0,...e}}function Lr(e){return typeof e!="number"?Mr(e):{top:e,right:e,bottom:e,left:e}}function He(e){const{x:t,y:n,width:s,height:o}=e;return{width:s,height:o,top:n,left:t,right:t+s,bottom:n+o,x:t,y:n}}function ss(e,t,n){let{reference:s,floating:o}=e;const r=Kt(t),i=Os(t),a=Ps(i),h=Xt(t),v=r==="y",d=s.x+s.width/2-o.width/2,p=s.y+s.height/2-o.height/2,m=s[a]/2-o[a]/2;let g;switch(h){case"top":g={x:d,y:s.y-o.height};break;case"bottom":g={x:d,y:s.y+s.height};break;case"right":g={x:s.x+s.width,y:p};break;case"left":g={x:s.x-o.width,y:p};break;default:g={x:s.x,y:s.y}}switch(De(t)){case"start":g[i]-=m*(n&&v?-1:1);break;case"end":g[i]+=m*(n&&v?-1:1);break}return g}const Hr=async(e,t,n)=>{const{placement:s="bottom",strategy:o="absolute",middleware:r=[],platform:i}=n,a=r.filter(Boolean),h=await(i.isRTL==null?void 0:i.isRTL(t));let v=await i.getElementRects({reference:e,floating:t,strategy:o}),{x:d,y:p}=ss(v,s,h),m=s,g={},x=0;for(let y=0;y<a.length;y++){const{name:T,fn:_}=a[y],{x:I,y:E,data:b,reset:$}=await _({x:d,y:p,initialPlacement:s,placement:m,strategy:o,middlewareData:g,rects:v,platform:i,elements:{reference:e,floating:t}});d=I??d,p=E??p,g={...g,[T]:{...g[T],...b}},$&&x<=50&&(x++,typeof $=="object"&&($.placement&&(m=$.placement),$.rects&&(v=$.rects===!0?await i.getElementRects({reference:e,floating:t,strategy:o}):$.rects),{x:d,y:p}=ss(v,m,h)),y=-1)}return{x:d,y:p,placement:m,strategy:o,middlewareData:g}};async function Rs(e,t){var n;t===void 0&&(t={});const{x:s,y:o,platform:r,rects:i,elements:a,strategy:h}=e,{boundary:v="clippingAncestors",rootBoundary:d="viewport",elementContext:p="floating",altBoundary:m=!1,padding:g=0}=Ve(t,e),x=Lr(g),T=a[m?p==="floating"?"reference":"floating":p],_=He(await r.getClippingRect({element:(n=await(r.isElement==null?void 0:r.isElement(T)))==null||n?T:T.contextElement||await(r.getDocumentElement==null?void 0:r.getDocumentElement(a.floating)),boundary:v,rootBoundary:d,strategy:h})),I=p==="floating"?{x:s,y:o,width:i.floating.width,height:i.floating.height}:i.reference,E=await(r.getOffsetParent==null?void 0:r.getOffsetParent(a.floating)),b=await(r.isElement==null?void 0:r.isElement(E))?await(r.getScale==null?void 0:r.getScale(E))||{x:1,y:1}:{x:1,y:1},$=He(r.convertOffsetParentRelativeRectToViewportRelativeRect?await r.convertOffsetParentRelativeRectToViewportRelativeRect({elements:a,rect:I,offsetParent:E,strategy:h}):I);return{top:(_.top-$.top+x.top)/b.y,bottom:($.bottom-_.bottom+x.bottom)/b.y,left:(_.left-$.left+x.left)/b.x,right:($.right-_.right+x.right)/b.x}}const Nr=function(e){return e===void 0&&(e={}),{name:"flip",options:e,async fn(t){var n,s;const{placement:o,middlewareData:r,rects:i,initialPlacement:a,platform:h,elements:v}=t,{mainAxis:d=!0,crossAxis:p=!0,fallbackPlacements:m,fallbackStrategy:g="bestFit",fallbackAxisSideDirection:x="none",flipAlignment:y=!0,...T}=Ve(e,t);if((n=r.arrow)!=null&&n.alignmentOffset)return{};const _=Xt(o),I=Kt(a),E=Xt(a)===a,b=await(h.isRTL==null?void 0:h.isRTL(v.floating)),$=m||(E||!y?[Le(a)]:Cr(a)),M=x!=="none";!m&&M&&$.push(...Ir(a,y,x,b));const S=[a,...$],A=await Rs(t,T),j=[];let Y=((s=r.flip)==null?void 0:s.overflows)||[];if(d&&j.push(A[_]),p){const V=Sr(o,i,b);j.push(A[V[0]],A[V[1]])}if(Y=[...Y,{placement:o,overflows:j}],!j.every(V=>V<=0)){var O,R;const V=(((O=r.flip)==null?void 0:O.index)||0)+1,ot=S[V];if(ot&&(!(p==="alignment"?I!==Kt(ot):!1)||Y.every(P=>P.overflows[0]>0&&Kt(P.placement)===I)))return{data:{index:V,overflows:Y},reset:{placement:ot}};let at=(R=Y.filter(H=>H.overflows[0]<=0).sort((H,P)=>H.overflows[1]-P.overflows[1])[0])==null?void 0:R.placement;if(!at)switch(g){case"bestFit":{var D;const H=(D=Y.filter(P=>{if(M){const J=Kt(P.placement);return J===I||J==="y"}return!0}).map(P=>[P.placement,P.overflows.filter(J=>J>0).reduce((J,ft)=>J+ft,0)]).sort((P,J)=>P[1]-J[1])[0])==null?void 0:D[0];H&&(at=H);break}case"initialPlacement":at=a;break}if(o!==at)return{reset:{placement:at}}}return{}}}},Pr=new Set(["left","top"]);async function Or(e,t){const{placement:n,platform:s,elements:o}=e,r=await(s.isRTL==null?void 0:s.isRTL(o.floating)),i=Xt(n),a=De(n),h=Kt(n)==="y",v=Pr.has(i)?-1:1,d=r&&h?-1:1,p=Ve(t,e);let{mainAxis:m,crossAxis:g,alignmentAxis:x}=typeof p=="number"?{mainAxis:p,crossAxis:0,alignmentAxis:null}:{mainAxis:p.mainAxis||0,crossAxis:p.crossAxis||0,alignmentAxis:p.alignmentAxis};return a&&typeof x=="number"&&(g=a==="end"?x*-1:x),h?{x:g*d,y:m*v}:{x:m*v,y:g*d}}const Rr=function(e){return e===void 0&&(e=0),{name:"offset",options:e,async fn(t){var n,s;const{x:o,y:r,placement:i,middlewareData:a}=t,h=await Or(t,e);return i===((n=a.offset)==null?void 0:n.placement)&&(s=a.arrow)!=null&&s.alignmentOffset?{}:{x:o+h.x,y:r+h.y,data:{...h,placement:i}}}}},Vr=function(e){return e===void 0&&(e={}),{name:"shift",options:e,async fn(t){const{x:n,y:s,placement:o}=t,{mainAxis:r=!0,crossAxis:i=!1,limiter:a={fn:T=>{let{x:_,y:I}=T;return{x:_,y:I}}},...h}=Ve(e,t),v={x:n,y:s},d=await Rs(t,h),p=Kt(Xt(o)),m=Ns(p);let g=v[m],x=v[p];if(r){const T=m==="y"?"top":"left",_=m==="y"?"bottom":"right",I=g+d[T],E=g-d[_];g=ts(I,g,E)}if(i){const T=p==="y"?"top":"left",_=p==="y"?"bottom":"right",I=x+d[T],E=x-d[_];x=ts(I,x,E)}const y=a.fn({...t,[m]:g,[p]:x});return{...y,data:{x:y.x-n,y:y.y-s,enabled:{[m]:r,[p]:i}}}}}};function ze(){return typeof window<"u"}function re(e){return Vs(e)?(e.nodeName||"").toLowerCase():"#document"}function At(e){var t;return(e==null||(t=e.ownerDocument)==null?void 0:t.defaultView)||window}function Wt(e){var t;return(t=(Vs(e)?e.ownerDocument:e.document)||window.document)==null?void 0:t.documentElement}function Vs(e){return ze()?e instanceof Node||e instanceof At(e).Node:!1}function Ht(e){return ze()?e instanceof Element||e instanceof At(e).Element:!1}function Vt(e){return ze()?e instanceof HTMLElement||e instanceof At(e).HTMLElement:!1}function os(e){return!ze()||typeof ShadowRoot>"u"?!1:e instanceof ShadowRoot||e instanceof At(e).ShadowRoot}const Dr=new Set(["inline","contents"]);function _e(e){const{overflow:t,overflowX:n,overflowY:s,display:o}=Nt(e);return/auto|scroll|overlay|hidden|clip/.test(t+s+n)&&!Dr.has(o)}const zr=new Set(["table","td","th"]);function Br(e){return zr.has(re(e))}const jr=[":popover-open",":modal"];function Be(e){return jr.some(t=>{try{return e.matches(t)}catch{return!1}})}const Fr=["transform","translate","scale","rotate","perspective"],Wr=["transform","translate","scale","rotate","perspective","filter"],Ur=["paint","layout","strict","content"];function yn(e){const t=_n(),n=Ht(e)?Nt(e):e;return Fr.some(s=>n[s]?n[s]!=="none":!1)||(n.containerType?n.containerType!=="normal":!1)||!t&&(n.backdropFilter?n.backdropFilter!=="none":!1)||!t&&(n.filter?n.filter!=="none":!1)||Wr.some(s=>(n.willChange||"").includes(s))||Ur.some(s=>(n.contain||"").includes(s))}function qr(e){let t=Yt(e);for(;Vt(t)&&!oe(t);){if(yn(t))return t;if(Be(t))return null;t=Yt(t)}return null}function _n(){return typeof CSS>"u"||!CSS.supports?!1:CSS.supports("-webkit-backdrop-filter","none")}const Kr=new Set(["html","body","#document"]);function oe(e){return Kr.has(re(e))}function Nt(e){return At(e).getComputedStyle(e)}function je(e){return Ht(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.scrollX,scrollTop:e.scrollY}}function Yt(e){if(re(e)==="html")return e;const t=e.assignedSlot||e.parentNode||os(e)&&e.host||Wt(e);return os(t)?t.host:t}function Ds(e){const t=Yt(e);return oe(t)?e.ownerDocument?e.ownerDocument.body:e.body:Vt(t)&&_e(t)?t:Ds(t)}function zs(e,t,n){var s;t===void 0&&(t=[]);const o=Ds(e),r=o===((s=e.ownerDocument)==null?void 0:s.body),i=At(o);return r?(un(i),t.concat(i,i.visualViewport||[],_e(o)?o:[],[])):t.concat(o,zs(o,[]))}function un(e){return e.parent&&Object.getPrototypeOf(e.parent)?e.frameElement:null}function Bs(e){const t=Nt(e);let n=parseFloat(t.width)||0,s=parseFloat(t.height)||0;const o=Vt(e),r=o?e.offsetWidth:n,i=o?e.offsetHeight:s,a=Me(n)!==r||Me(s)!==i;return a&&(n=r,s=i),{width:n,height:s,$:a}}function js(e){return Ht(e)?e:e.contextElement}function ee(e){const t=js(e);if(!Vt(t))return Rt(1);const n=t.getBoundingClientRect(),{width:s,height:o,$:r}=Bs(t);let i=(r?Me(n.width):n.width)/s,a=(r?Me(n.height):n.height)/o;return(!i||!Number.isFinite(i))&&(i=1),(!a||!Number.isFinite(a))&&(a=1),{x:i,y:a}}const Yr=Rt(0);function Fs(e){const t=At(e);return!_n()||!t.visualViewport?Yr:{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}}function Jr(e,t,n){return t===void 0&&(t=!1),!n||t&&n!==At(e)?!1:t}function xe(e,t,n,s){t===void 0&&(t=!1),n===void 0&&(n=!1);const o=e.getBoundingClientRect(),r=js(e);let i=Rt(1);t&&(s?Ht(s)&&(i=ee(s)):i=ee(e));const a=Jr(r,n,s)?Fs(r):Rt(0);let h=(o.left+a.x)/i.x,v=(o.top+a.y)/i.y,d=o.width/i.x,p=o.height/i.y;if(r){const m=At(r),g=s&&Ht(s)?At(s):s;let x=m,y=un(x);for(;y&&s&&g!==x;){const T=ee(y),_=y.getBoundingClientRect(),I=Nt(y),E=_.left+(y.clientLeft+parseFloat(I.paddingLeft))*T.x,b=_.top+(y.clientTop+parseFloat(I.paddingTop))*T.y;h*=T.x,v*=T.y,d*=T.x,p*=T.y,h+=E,v+=b,x=At(y),y=un(x)}}return He({width:d,height:p,x:h,y:v})}function wn(e,t){const n=je(e).scrollLeft;return t?t.left+n:xe(Wt(e)).left+n}function Ws(e,t,n){n===void 0&&(n=!1);const s=e.getBoundingClientRect(),o=s.left+t.scrollLeft-(n?0:wn(e,s)),r=s.top+t.scrollTop;return{x:o,y:r}}function Gr(e){let{elements:t,rect:n,offsetParent:s,strategy:o}=e;const r=o==="fixed",i=Wt(s),a=t?Be(t.floating):!1;if(s===i||a&&r)return n;let h={scrollLeft:0,scrollTop:0},v=Rt(1);const d=Rt(0),p=Vt(s);if((p||!p&&!r)&&((re(s)!=="body"||_e(i))&&(h=je(s)),Vt(s))){const g=xe(s);v=ee(s),d.x=g.x+s.clientLeft,d.y=g.y+s.clientTop}const m=i&&!p&&!r?Ws(i,h,!0):Rt(0);return{width:n.width*v.x,height:n.height*v.y,x:n.x*v.x-h.scrollLeft*v.x+d.x+m.x,y:n.y*v.y-h.scrollTop*v.y+d.y+m.y}}function Xr(e){return Array.from(e.getClientRects())}function Zr(e){const t=Wt(e),n=je(e),s=e.ownerDocument.body,o=te(t.scrollWidth,t.clientWidth,s.scrollWidth,s.clientWidth),r=te(t.scrollHeight,t.clientHeight,s.scrollHeight,s.clientHeight);let i=-n.scrollLeft+wn(e);const a=-n.scrollTop;return Nt(s).direction==="rtl"&&(i+=te(t.clientWidth,s.clientWidth)-o),{width:o,height:r,x:i,y:a}}function Qr(e,t){const n=At(e),s=Wt(e),o=n.visualViewport;let r=s.clientWidth,i=s.clientHeight,a=0,h=0;if(o){r=o.width,i=o.height;const v=_n();(!v||v&&t==="fixed")&&(a=o.offsetLeft,h=o.offsetTop)}return{width:r,height:i,x:a,y:h}}const ta=new Set(["absolute","fixed"]);function ea(e,t){const n=xe(e,!0,t==="fixed"),s=n.top+e.clientTop,o=n.left+e.clientLeft,r=Vt(e)?ee(e):Rt(1),i=e.clientWidth*r.x,a=e.clientHeight*r.y,h=o*r.x,v=s*r.y;return{width:i,height:a,x:h,y:v}}function is(e,t,n){let s;if(t==="viewport")s=Qr(e,n);else if(t==="document")s=Zr(Wt(e));else if(Ht(t))s=ea(t,n);else{const o=Fs(e);s={x:t.x-o.x,y:t.y-o.y,width:t.width,height:t.height}}return He(s)}function Us(e,t){const n=Yt(e);return n===t||!Ht(n)||oe(n)?!1:Nt(n).position==="fixed"||Us(n,t)}function na(e,t){const n=t.get(e);if(n)return n;let s=zs(e,[]).filter(a=>Ht(a)&&re(a)!=="body"),o=null;const r=Nt(e).position==="fixed";let i=r?Yt(e):e;for(;Ht(i)&&!oe(i);){const a=Nt(i),h=yn(i);!h&&a.position==="fixed"&&(o=null),(r?!h&&!o:!h&&a.position==="static"&&!!o&&ta.has(o.position)||_e(i)&&!h&&Us(e,i))?s=s.filter(d=>d!==i):o=a,i=Yt(i)}return t.set(e,s),s}function sa(e){let{element:t,boundary:n,rootBoundary:s,strategy:o}=e;const i=[...n==="clippingAncestors"?Be(t)?[]:na(t,this._c):[].concat(n),s],a=i[0],h=i.reduce((v,d)=>{const p=is(t,d,o);return v.top=te(p.top,v.top),v.right=cn(p.right,v.right),v.bottom=cn(p.bottom,v.bottom),v.left=te(p.left,v.left),v},is(t,a,o));return{width:h.right-h.left,height:h.bottom-h.top,x:h.left,y:h.top}}function oa(e){const{width:t,height:n}=Bs(e);return{width:t,height:n}}function ia(e,t,n){const s=Vt(t),o=Wt(t),r=n==="fixed",i=xe(e,!0,r,t);let a={scrollLeft:0,scrollTop:0};const h=Rt(0);function v(){h.x=wn(o)}if(s||!s&&!r)if((re(t)!=="body"||_e(o))&&(a=je(t)),s){const g=xe(t,!0,r,t);h.x=g.x+t.clientLeft,h.y=g.y+t.clientTop}else o&&v();r&&!s&&o&&v();const d=o&&!s&&!r?Ws(o,a):Rt(0),p=i.left+a.scrollLeft-h.x-d.x,m=i.top+a.scrollTop-h.y-d.y;return{x:p,y:m,width:i.width,height:i.height}}function nn(e){return Nt(e).position==="static"}function rs(e,t){if(!Vt(e)||Nt(e).position==="fixed")return null;if(t)return t(e);let n=e.offsetParent;return Wt(e)===n&&(n=n.ownerDocument.body),n}function qs(e,t){const n=At(e);if(Be(e))return n;if(!Vt(e)){let o=Yt(e);for(;o&&!oe(o);){if(Ht(o)&&!nn(o))return o;o=Yt(o)}return n}let s=rs(e,t);for(;s&&Br(s)&&nn(s);)s=rs(s,t);return s&&oe(s)&&nn(s)&&!yn(s)?n:s||qr(e)||n}const ra=async function(e){const t=this.getOffsetParent||qs,n=this.getDimensions,s=await n(e.floating);return{reference:ia(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,width:s.width,height:s.height}}};function aa(e){return Nt(e).direction==="rtl"}const la={convertOffsetParentRelativeRectToViewportRelativeRect:Gr,getDocumentElement:Wt,getClippingRect:sa,getOffsetParent:qs,getElementRects:ra,getClientRects:Xr,getDimensions:oa,getScale:ee,isElement:Ht,isRTL:aa},ca=Rr,da=Vr,ua=Nr,fa=(e,t,n)=>{const s=new Map,o={platform:la,...n},r={...o.platform,_c:s};return Hr(e,t,{...o,platform:r})};var va=W('<div class="w-px h-5 bg-white/20"></div>'),ha=W("<button><!></button>"),pa=W('<div class="px-2 text-xs text-white/80"> </div>'),ma=W('<div class="absolute shadow-xl flex items-center gap-1 px-1 py-1 z-30 animate-fade-in floating-ui svelte-18w8z7b"><!> <!></div>');function ga(e,t){Bt(t,!1);const[n,s]=Oe(),o=()=>Et(xn,"$activeSelectionType",n),r=()=>Et(Ls,"$activeSelectionStyle",n),i=()=>Et(Hs,"$isSelectionEmpty",n),a=()=>Et(Ms,"$selectedItems",n),h=()=>Et(bn,"$selectionCount",n),v=U(),d=U();let p=Q(t,"container",8,null),m=Q(t,"onAction",8,()=>{}),g=U(),x=U(!1),y=U({x:0,y:0});function T(M){if(!M)return[];const S=[{id:"copy",icon:Cs,title:"Copy",shortcut:"Ctrl+C"},{id:"delete",icon:an,title:"Delete",shortcut:"Delete",color:"text-red-400"}];switch(M){case"text":return[{id:"edit",icon:As,title:"Edit",shortcut:"Enter"},...S];case"repeatable":return[...S,{id:"cut",icon:bi,title:"Cut",shortcut:"Ctrl+X"}];case"section":return[{id:"moveUp",icon:di,title:"Move Up"},{id:"moveDown",icon:ci,title:"Move Down"},{id:"toggleVisibility",icon:ks,title:"Toggle Visibility"},{id:"delete",icon:an,title:"Remove Section",color:"text-red-400"}];case"image":case"icon":return[{id:"replace",icon:Ie,title:"Replace"},...S];case"link":return[{id:"editLink",icon:Ie,title:"Edit Link"},...S];default:return S}}async function _(){if(i()||!p()){L(x,!1);return}const M=Array.from(a())[0];if(!M){L(x,!1);return}let S;if(M.context==="sidebar"&&typeof M.element=="number"){const V=document.querySelectorAll(".template-section")[M.element];if(!V){L(x,!1);return}S=V.getBoundingClientRect()}else if(M.element instanceof HTMLElement)S=M.element.getBoundingClientRect();else{L(x,!1);return}const A=p().getBoundingClientRect(),j={top:S.top-A.top,left:S.left-A.left,bottom:S.bottom-A.top,right:S.right-A.left,width:S.width,height:S.height},Y={getBoundingClientRect(){return{x:A.left+j.left,y:A.top+j.top,top:A.top+j.top,left:A.left+j.left,bottom:A.top+j.bottom,right:A.left+j.right,width:j.width,height:j.height}}},{x:O,y:R}=await fa(Y,l(g),{placement:"top",middleware:[ca(8),ua(),da({padding:8})]});L(y,{x:O-A.left,y:R-A.top}),L(x,!0)}function I(M){m()(M,{selection:a(),type:o()})}Ne(()=>(window.addEventListener("resize",_),window.addEventListener("scroll",_,!0),()=>{window.removeEventListener("resize",_),window.removeEventListener("scroll",_,!0)})),$t(()=>o(),()=>{L(v,T(o()))}),$t(()=>r(),()=>{L(d,r()?.overlayColor||"rgb(31, 41, 55)")}),$t(()=>a(),()=>{a().size>0?requestAnimationFrame(_):L(x,!1)}),ie(),Ft();var E=K(),b=q(E);{var $=M=>{var S=ma(),A=f(S);se(A,1,()=>l(v),Ae,(O,R)=>{var D=K(),V=q(D);{var ot=H=>{var P=va();k(H,P)},at=H=>{var P=ha(),J=f(P);xs(J,()=>l(R).icon,(ft,gt)=>{gt(ft,{class:"w-4 h-4"})}),u(P),ht(()=>{ct(P,1,`w-8 h-8 flex items-center justify-center text-white hover:bg-white/20 rounded transition-all ${l(R),B(()=>l(R).color||"")??""}`,"svelte-18w8z7b"),Gt(P,"title",`${l(R),B(()=>l(R).title)??""}${l(R),B(()=>l(R).shortcut?` (${l(R).shortcut})`:"")??""}`)}),Tt("click",P,()=>I(l(R).id)),k(H,P)};it(V,H=>{l(R),B(()=>l(R).id==="divider")?H(ot):H(at,!1)})}k(O,D)});var j=w(A,2);{var Y=O=>{var R=pa(),D=f(R,!0);u(R),ht(()=>st(D,h())),k(O,R)};it(j,O=>{h()>1&&O(Y)})}u(S),Re(S,O=>L(g,O),()=>l(g)),ht(()=>ge(S,`
			left: ${l(y),B(()=>l(y).x)??""}px; 
			top: ${l(y),B(()=>l(y).y)??""}px; 
			background-color: ${l(d)??""};
			border-radius: 8px;
		`)),k(M,S)};it(b,M=>{l(x)&&!i()&&p()&&M($)})}k(e,E),jt(),s()}var xa=(e,t)=>L(t,!l(t)),ba=(e,t)=>t("select"),ya=(e,t)=>t("edit"),_a=W('<div><span class="font-medium">Selection:</span> <span class="capitalize"> <!></span></div>'),wa=(e,t)=>L(t,"mobile"),$a=(e,t)=>L(t,"tablet"),Ea=(e,t)=>L(t,"desktop"),Sa=(e,t)=>L(t,"full"),Ca=(e,t)=>L(t,!l(t)),ka=W('<div role="button" tabindex="0"><!></div>'),Ta=(e,t)=>L(t,!0),Aa=W('<div class="flex flex-col items-center justify-center min-h-[60vh] text-center"><div class="w-16 h-16 border-2 border-dashed border-stone-300 flex items-center justify-center mb-4"><!></div> <button class="btn btn-primary"><!> Add Template</button></div>'),Ia=W('<div class="fixed top-0 left-0 right-0 h-12 bg-white border-b border-stone-200 z-30 flex items-center px-2"><div class="flex items-center gap-2"><button><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M15 19l-7-7 7-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></button></div> <div class="flex-1 flex justify-center"><div class="flex items-center gap-2"><div class="flex items-center gap-0.5 p-0.5 bg-stone-100 rounded"><button title="Select Mode"><!></button> <button><!></button></div> <!> <div class="flex items-center gap-0.5 p-0.5 bg-stone-100 rounded"><button class="icon-btn disabled:opacity-50 disabled:cursor-not-allowed" title="Undo"><!></button> <button class="icon-btn disabled:opacity-50 disabled:cursor-not-allowed" title="Redo"><!></button></div> <div class="flex items-center gap-0.5 p-0.5 bg-stone-100 rounded"><button title="Mobile Preview (375px)"><!></button> <button title="Tablet Preview (768px)"><!></button> <button title="Desktop Preview (1280px)"><!></button> <button title="Full Width"><!></button></div></div></div> <div class="flex items-center gap-2 absolute right-2"><button title="Settings"><!></button></div></div> <!> <div class="flex h-screen pt-12"><div><div><div style="width: 100%;"><!> <div class="p-8"><div class="space-y-8"><!> <!></div> <!> <!></div></div></div></div></div> <!> <!>',1);function Va(e,t){Bt(t,!1);const[n,s]=Oe(),o=()=>Et(Wi,"$selectedElements",n),r=()=>Et(Ls,"$activeSelectionStyle",n),i=()=>Et(xn,"$activeSelectionType",n),a=()=>Et(gn,"$selectedSectionIndex",n),h=()=>Et(Hs,"$isSelectionEmpty",n),v=()=>Et(bn,"$selectionCount",n),d=U(),p=U(),m=U(),g=U(),x=U();let y=U("select"),T=U(!0),_=U(!0),I=U(!1),E=U(!1),b=U(!1),$=null,M=U([zt[0],zt[2],zt[4],zt[5],zt[6],zt[3]]),S=U(),A=U("full"),j=U(null);function Y(c){c==="undo"?yt():_t()}function O(c){const C=c.target,N=C.closest("[data-editable]"),lt=C.closest("[data-repeatable]");if(lt&&!N){c.stopPropagation(),c.shiftKey||c.metaKey||c.ctrlKey?D(lt):(V(),R(lt,!1));return}if(N){if(c.stopPropagation(),l(g)){N.dataset.editable==="text"&&N!==l(d)&&J(N,c);return}c.shiftKey||c.metaKey||c.ctrlKey?D(N):o().has(N)&&o().size===1?at(c):(V(),R(N,!1))}}function R(c,C=!1){let N="text";if(c.hasAttribute("data-repeatable")?N="repeatable":c.dataset.editable&&(N=c.dataset.editable),rt.select(c,N,"canvas",void 0,{multi:C}),l(g)&&(c.style.outline="3px solid #f59e0b",c.style.outlineOffset="3px"),c.dataset.editable==="text"){const lt=pt.registerElement(c,c.textContent||"");pt.onTextChange(lt,It=>{c.textContent!==It&&(c.textContent=It)}),z()}}function D(c){let C="text";c.hasAttribute("data-repeatable")?C="repeatable":c.dataset.editable&&(C=c.dataset.editable),rt.toggle(c,C,"canvas")}function V(){o().forEach(c=>{c.hasAttribute("contenteditable")&&(c.removeAttribute("contenteditable"),c.removeEventListener("input",P))}),rt.clear()}function ot(c){c==="select"&&l(g)&&H(),L(y,c)}function at(c){if(!(!l(d)||l(p)!=="text")){if(L(y,"edit"),gs(d,l(d).contentEditable="true"),l(d).focus(),c){const C=document.caretRangeFromPoint(c.clientX,c.clientY);if(C){const N=window.getSelection();N?.removeAllRanges(),N?.addRange(C)}}else{const C=document.createRange(),N=window.getSelection();C.selectNodeContents(l(d)),C.collapse(!1),N?.removeAllRanges(),N?.addRange(C)}l(d).addEventListener("blur",H,{once:!0}),l(d).addEventListener("input",P)}}function H(){l(d)&&(l(d).removeAttribute("contenteditable"),l(d).removeEventListener("input",P),L(y,"select"),V())}function P(c){const C=c.target,N=pt.getElementId(C);N&&C.textContent&&(pt.updateText(N,C.textContent),z())}function J(c,C){l(d)&&H(),V(),R(c),setTimeout(()=>at(C),10)}function ft(){if(!l(d))return;const c=l(d).textContent||l(d).outerHTML;navigator.clipboard.writeText(c)}function gt(){o().forEach(c=>{c.remove()}),V()}function kt(){const c=Array.from(o()).find(C=>C.hasAttribute("data-repeatable"));c&&($=c.cloneNode(!0),c.animate([{transform:"scale(1)",opacity:1},{transform:"scale(1.05)",opacity:.8},{transform:"scale(1)",opacity:1}],{duration:300,easing:"ease-out"}))}function F(){const c=Array.from(o()).find(C=>C.hasAttribute("data-repeatable"));c&&($=c.cloneNode(!0),l(S)&&pt.saveStructuralState(l(S)),c.animate([{transform:"scale(1)",opacity:1},{transform:"scale(0.95)",opacity:.5}],{duration:200,easing:"ease-out"}).onfinish=()=>{c.remove(),z()},V())}function nt(c){c.hasAttribute("data-repeatable")&&c.addEventListener("click",O),c.querySelectorAll("[data-editable]").forEach(lt=>{lt.addEventListener("click",O)}),c.querySelectorAll("[data-repeatable]").forEach(lt=>{lt.addEventListener("click",O)})}function G(){if(!l(S))return;const c=l(S).querySelectorAll("[data-editable], [data-repeatable]");c.forEach(C=>{C.removeEventListener("click",O)}),c.forEach(C=>{C.addEventListener("click",O)})}function vt(){if(!$)return;const c=Array.from(o()).find(C=>C.hasAttribute("data-repeatable"));if(c&&c.parentElement){l(S)&&pt.saveStructuralState(l(S));const C=$.cloneNode(!0);c.parentElement.insertBefore(C,c.nextSibling),nt(C),z(),V(),R(C,!1),C.animate([{transform:"scale(0.9)",opacity:0},{transform:"scale(1)",opacity:1}],{duration:300,easing:"ease-out"})}}function wt(){const c=Array.from(o()).filter(C=>C.hasAttribute("data-repeatable"));c.length>0&&(l(S)&&pt.saveStructuralState(l(S)),c.forEach((C,N)=>{C.animate([{transform:"scale(1)",opacity:1},{transform:"scale(0.9)",opacity:0}],{duration:200,easing:"ease-out"}).onfinish=()=>{C.remove(),N===c.length-1&&z()}}),V())}function xt(c,C){switch(c){case"edit":at();break;case"copy":i()==="repeatable"?kt():ft();break;case"cut":F();break;case"delete":if(i()==="repeatable")wt();else if(i()==="section"){const N=a();N!==null&&dt(N)}else gt();break;case"moveUp":i()==="section"&&a()!==null&&a()>0&&Fe(a(),a()-1);break;case"moveDown":i()==="section"&&a()!==null&&a()<l(M).length-1&&Fe(a(),a()+1);break;case"toggleVisibility":i()==="section"&&a()!==null&&$n(a());break;case"replace":console.log("Replace action for",i());break;case"editLink":console.log("Edit link action");break}}function St(c){c.key==="Escape"?(l(g)?H():V(),bt()):c.key==="Enter"&&!l(g)&&l(d)&&l(p)==="text"?at():(c.metaKey||c.ctrlKey)&&c.key==="z"&&!c.shiftKey?(c.preventDefault(),yt()):(c.metaKey||c.ctrlKey)&&(c.key==="Z"||c.shiftKey&&c.key==="z")?(c.preventDefault(),_t()):(c.metaKey||c.ctrlKey)&&c.key==="c"&&!l(g)?(c.preventDefault(),kt()):(c.metaKey||c.ctrlKey)&&c.key==="x"&&!l(g)?(c.preventDefault(),F()):(c.metaKey||c.ctrlKey)&&c.key==="v"&&!l(g)&&$?(c.preventDefault(),vt()):c.key==="Delete"&&!l(g)&&(c.preventDefault(),wt())}function bt(){document.querySelectorAll("[contenteditable]").forEach(c=>{c.removeAttribute("contenteditable")})}function yt(){if(l(I)){const c=pt.undo();if(z(),G(),c){const C=pt.getElementById(c);C&&(V(),R(C,!1),C.animate([{backgroundColor:"rgba(59, 130, 246, 0.3)"},{backgroundColor:"transparent"}],{duration:600,easing:"ease-out"}))}}}function _t(){if(l(E)){const c=pt.redo();if(z(),G(),c){const C=pt.getElementById(c);C&&(V(),R(C,!1),C.animate([{backgroundColor:"rgba(59, 130, 246, 0.3)"},{backgroundColor:"transparent"}],{duration:600,easing:"ease-out"}))}}}function z(){L(I,pt.canUndo()),L(E,pt.canRedo())}function dt(c){L(M,l(M).filter((C,N)=>N!==c))}function Pt(c){L(M,[...l(M),c]),L(b,!1)}function Dt(c){V(),rt.select(c,"section","sidebar",l(M)[c]);const C=l(S)?.querySelectorAll(".template-section");C&&C[c]&&C[c].scrollIntoView({behavior:"smooth",block:"start"})}function Fe(c,C){const N=[...l(M)],[lt]=N.splice(c,1);N.splice(C,0,lt),L(M,N)}function $n(c){console.log("Toggle visibility for section",c)}function En(c){const N=c.target.closest("[data-editable]");N&&N.dataset.editable==="text"&&(c.stopPropagation(),o().has(N)||(V(),R(N)),at(c))}Ne(()=>(document.addEventListener("click",V),document.addEventListener("dblclick",En),document.addEventListener("keydown",St),z(),setTimeout(()=>{l(S)&&pt.saveStructuralState(l(S))},100),()=>{document.querySelectorAll("[contenteditable]").forEach(c=>{c.removeAttribute("contenteditable")}),document.removeEventListener("click",V),document.removeEventListener("dblclick",En),document.removeEventListener("keydown",St)})),$t(()=>o(),()=>{L(d,Array.from(o())[0])}),$t(()=>l(d),()=>{L(p,l(d)?.dataset.editable||(l(d)?.dataset.repeatable?"repeatable":""))}),$t(()=>o(),()=>{L(m,o().size>1)}),$t(()=>l(y),()=>{L(g,l(y)==="edit")}),$t(()=>r(),()=>{L(x,r())}),$t(()=>(l(d),l(p),pt),()=>{if(l(d)&&l(p)==="text"){const c=pt.getElementId(l(d));L(j,c?pt.getHistoryInfo(c):null)}else L(j,null)}),ie(),Ft();var Sn=Ia(),We=q(Sn),Ue=f(We),ae=f(Ue);ae.__click=[xa,_];var Ks=f(ae);u(ae),u(Ue);var we=w(Ue,2),Cn=f(we),qe=f(Cn),le=f(qe);le.__click=[ba,ot];var Ys=f(le);xi(Ys,{class:"w-4 h-4"}),u(le);var ce=w(le,2);ce.__click=[ya,ot];var Js=f(ce);Ie(Js,{class:"w-4 h-4"}),u(ce),u(qe);var kn=w(qe,2);{var Gs=c=>{var C=_a(),N=w(f(C),2),lt=f(N),It=w(lt);{var Mt=Ze=>{var On=jo();ht(()=>st(On,`(${v()??""})`)),k(Ze,On)};it(It,Ze=>{v()>1&&Ze(Mt)})}u(N),u(C),ht(()=>{ct(C,1,`flex items-center gap-2 px-3 py-1 text-sm ${i()==="repeatable"?"bg-green-200 text-green-800":"bg-stone-200 text-stone-700"} rounded`),st(lt,`${i()??""} `)}),k(c,C)};it(kn,c=>{!h()&&i()&&c(Gs)})}var Ke=w(kn,2),de=f(Ke);de.__click=yt;var Xs=f(de);Is(Xs,{class:"w-4 h-4"}),u(de);var $e=w(de,2);$e.__click=_t;var Zs=f($e);Ts(Zs,{class:"w-4 h-4"}),u($e),u(Ke);var Tn=w(Ke,2),ue=f(Tn);ue.__click=[wa,A];var Qs=f(ue);yi(Qs,{class:"w-4 h-4"}),u(ue);var fe=w(ue,2);fe.__click=[$a,A];var to=f(fe);_i(to,{class:"w-4 h-4"}),u(fe);var ve=w(fe,2);ve.__click=[Ea,A];var eo=f(ve);gi(eo,{class:"w-4 h-4"}),u(ve);var Ee=w(ve,2);Ee.__click=[Sa,A];var no=f(Ee);vi(no,{class:"w-4 h-4"}),u(Ee),u(Tn),u(Cn),u(we);var An=w(we,2),Se=f(An);Se.__click=[Ca,T];var so=f(Se);rn(so,{class:"w-4 h-4"}),u(Se),u(An),u(We);var In=w(We,2);rr(In,{get templates(){return l(M)},onSelectSection:Dt,onReorderSections:Fe,onToggleVisibility:$n,onAddSection:()=>L(b,!0),get isOpen(){return l(_)},set isOpen(c){L(_,c)},$$legacy:!0});var Ye=w(In,2),Je=f(Ye),Ge=f(Je),Ce=f(Ge),Mn=f(Ce);xr(Mn,{get devicePreview(){return l(A)}});var Ln=w(Mn,2),Xe=f(Ln),Hn=f(Xe);se(Hn,3,()=>l(M),(c,C)=>c.id+C,(c,C,N)=>{var lt=ka();lt.__click=Mt=>{Mt.target===Mt.currentTarget&&(Mt.stopPropagation(),Dt(l(N)))},lt.__keydown=Mt=>{(Mt.key==="Enter"||Mt.key===" ")&&(Mt.preventDefault(),Dt(l(N)))};var It=f(lt);hr(It,{get template(){return l(C)},handleElementClick:O,handleTextInput:Mt=>{},stopEdit:()=>{}}),u(lt),ht(()=>{ct(lt,1,`template-section animate-fade-in ${a()===l(N)?"ring-2 ring-blue-500 ring-offset-4":""}`,"svelte-1u07k7e"),ge(lt,`animation-delay: ${l(N)*.1}s`),Gt(lt,"data-section-index",l(N))}),k(c,lt)});var oo=w(Hn,2);{var io=c=>{var C=Aa(),N=f(C),lt=f(N);pi(lt,{class:"w-8 h-8 text-stone-400"}),u(N);var It=w(N,2);It.__click=[Ta,b];var Mt=f(It);mn(Mt,{class:"w-4 h-4 mr-2"}),Ct(),u(It),u(C),k(c,C)};it(oo,c=>{l(M),B(()=>l(M).length===0)&&c(io)})}u(Xe);var Nn=w(Xe,2);_r(Nn,{get devicePreview(){return l(A)}});var ro=w(Nn,2);ga(ro,{get container(){return l(S)},onAction:xt}),u(Ln),u(Ce),Re(Ce,c=>L(S,c),()=>l(S)),u(Ge),u(Je),u(Ye);var Pn=w(Ye,2);nr(Pn,{get selectedElement(){return l(d)},get historyInfo(){return l(j)},onHistoryAction:Y,get isOpen(){return l(T)},set isOpen(c){L(T,c)},$$legacy:!0});var ao=w(Pn,2);fr(ao,{onSelectTemplate:Pt,get isOpen(){return l(b)},set isOpen(c){L(b,c)},$$legacy:!0}),ht(()=>{ct(ae,1,`icon-btn ${l(_)?"bg-stone-200":""}`),Gt(ae,"title",`${l(_)?"Hide":"Show"} sections`),ct(Ks,0,`w-4 h-4 text-stone-600 transition-transform ${l(_)?"":"rotate-180"}`),ge(we,`margin-left: ${l(_)?"140px":"0"}; margin-right: ${l(T)?"304px":"0"}; transition: margin 300ms;`),ct(le,1,`icon-btn ${l(y)==="select"?"bg-blue-500 text-white":"text-stone-600"}`),ct(ce,1,`icon-btn ${l(y)==="edit"?l(g)?"bg-amber-500 text-white":"bg-blue-500 text-white":"text-stone-600"}`),Gt(ce,"title",l(g)?"Editing Text":"Edit Mode"),de.disabled=!l(I),$e.disabled=!l(E),ct(ue,1,`icon-btn ${l(A)==="mobile"?"bg-blue-500 text-white":"text-stone-600"}`),ct(fe,1,`icon-btn ${l(A)==="tablet"?"bg-blue-500 text-white":"text-stone-600"}`),ct(ve,1,`icon-btn ${l(A)==="desktop"?"bg-blue-500 text-white":"text-stone-600"}`),ct(Ee,1,`icon-btn ${l(A)==="full"?"bg-blue-500 text-white":"text-stone-600"}`),ct(Se,1,`icon-btn ${l(T)?"bg-stone-200":""}`),ct(Je,1,`flex-1 overflow-auto ${l(T)?"mr-80":""} ${l(_)?"ml-40":"ml-0"} transition-all duration-300 bg-stone-100`),ct(Ge,1,`flex justify-center ${l(A)==="full"?"p-0":"p-8"}`),ct(Ce,1,`relative bg-white transition-all duration-300 ${l(A)==="full"?"w-full":"shadow-lg"} ${l(A)==="mobile"?"max-w-[375px]":l(A)==="tablet"?"max-w-[768px]":l(A)==="desktop"?"max-w-[1280px]":"max-w-full"}`)}),k(e,Sn),jt(),s()}be(["click","keydown"]);export{Va as component};
