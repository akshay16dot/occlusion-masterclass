const country=document.getElementById('country'),pack=document.getElementById('package'),confirmed=document.getElementById('confirmed'),pay=document.getElementById('pay');
const plans={
 occlusion:{name:'Occlusion Made Easy',count:'One lecture: October 3',india:2999,regional:39,standard:199,group:'single',rule:'No prerequisite. Join October 3 to qualify for Vertical Dimension on October 17.'},
 vertical:{name:'Vertical Dimension with FMR',count:'One lecture: October 17',india:2999,regional:39,standard:199,group:'single',rule:'Requires our Occlusion module. Previous attendees already qualify.'},
 rehab:{name:'Occlusion & Rehabilitation',count:'Occlusion October 3 + Vertical Dimension October 17',india:5499,regional:null,standard:369,group:'two',rule:'Two lectures covering the foundations of our full-mouth rehabilitation teaching. No All-on-X commitment.'},
 implants:{name:'Implants: Foundations to Restoration',count:'Two lectures. Standalone module.',india:5499,regional:null,standard:369,group:'implants',rule:'Independent entry. Attend foundations and surgery, then restoration. No Occlusion or Vertical Dimension prerequisite.'},
 allx:{name:'All-on-X module',count:'Two lectures. For eligible previous attendees.',india:5499,regional:null,standard:369,group:'allx',rule:'Requires completion of our Occlusion and Vertical Dimension modules. Includes both All-on-X lectures.'},
 allxpath:{name:'All-on-X Pathway',count:'Occlusion + Vertical Dimension + both All-on-X lectures',india:9999,regional:null,standard:669,group:'allxpath',rule:'Four lectures. Includes both prerequisite modules and the complete All-on-X module.'},
 full:{name:'Complete Programme',count:'All four modules, six lectures',india:12999,regional:null,standard:849,group:'full',rule:'Includes Occlusion, Vertical Dimension, both All-on-X lectures and both Implant lectures.'}
};
let countries=[],links={},message='';
const tier=c=>c.code==='IN'?'india':c.tier;
const currency=c=>c.code==='IN'?'INR':'USD';
const money=(n,c)=>new Intl.NumberFormat(c.code==='IN'?'en-IN':'en-US',{style:'currency',currency:currency(c),maximumFractionDigits:0}).format(n);
const fee=(plan,c)=>plan[tier(c)]==null?'Bundle fee on enquiry':money(plan[tier(c)],c);
function selected(){return countries.find(c=>c.code===country.value)}
function payment(){
 const c=selected(),standard=c?.tier==='standard';
 const href=standard&&links.standard?.[plans[pack.value].group];
 const enabled=Boolean(confirmed.checked&&href);
 confirmed.closest('label').style.display=standard?'flex':'none';
 pay.style.display=c&&!standard?'none':'';
 const help=document.getElementById('payment-help');
 if(!c){pay.href='#registration-country';pay.textContent='Select your country to continue';pay.removeAttribute('aria-disabled');pay.style.opacity='1';pay.style.pointerEvents='auto';help.textContent='Select your country at the top of this form to see the right fee and payment step.';return;}
 if(enabled){pay.href=href;pay.removeAttribute('aria-disabled')}else{pay.removeAttribute('href');pay.setAttribute('aria-disabled','true')}
 pay.textContent='Continue to Stripe payment';pay.style.opacity=enabled?'1':'.45';pay.style.pointerEvents=enabled?'auto':'none';
 help.textContent=!standard?'Send your enrolment enquiry. We will confirm your regional tuition and send an individual payment link.':!href?'Checkout is temporarily unavailable. Please email your enquiry.':!confirmed.checked?'Confirm your session and prerequisites with Dr Parmar, then tick the checkbox to open Stripe.':'Stripe will collect your full name and email with your payment.';
}
function render(){document.getElementById('registration-country').value=country.value;const c=selected(),p=plans[pack.value],known=c&&['regional','standard'].includes(c.tier);const amount=known?fee(p,c):'Confirm your tuition';document.getElementById('amount').textContent=c?amount:'Select your country';document.getElementById('prerequisite').textContent=p.rule;document.getElementById('selected-country').textContent=c?'Country of primary practice: '+c.name:'Select your country in the form to see your fee.';document.getElementById('regional-note').textContent=known?(c.tier==='regional'?(c.code==='IN'?'Your tuition is shown and billed in Indian rupees.':'Your tuition is shown and billed in US dollars. Regional lectures are US$39; contact us for bundle options.'):'Your tuition is shown and billed in US dollars.'):'Select your country to see the applicable fee. If it is missing, contact us.';document.getElementById('price-list').replaceChildren();for(const key of ['occlusion','rehab','implants','allx','allxpath','full']){const item=plans[key],row=document.createElement('div');row.className='plan-row';const copy=document.createElement('div'),h=document.createElement('h3'),d=document.createElement('p'),cost=document.createElement('span');h.textContent=key==='occlusion'?'Single lecture: Occlusion or Vertical Dimension':item.name;d.textContent=key==='occlusion'?'One lecture. Vertical Dimension requires Occlusion.':item.count;cost.className='plan-price';cost.textContent=known?fee(item,c):'Select country';copy.append(h,d);row.append(copy,cost);document.getElementById('price-list').append(row)}message='Hello Dr Parmar, I would like to enrol in '+p.name+'. '+(known?'My tuition is '+amount+' ('+currency(c)+'). ':'')+(c?'I primarily practise in '+c.name+'. ':'')+'Please confirm my session time and send me the next steps to enrol.';updateEnquiry();document.getElementById('status').textContent='';confirmed.checked=false;payment();}
function updateEnquiry(){
 const question=document.getElementById('learning-question').value.trim(),name=document.getElementById('attendee-name').value.trim(),email=document.getElementById('attendee-email').value.trim();
 const contact=(name?' My name is '+name+'.':'')+(email?' My email is '+email+'.':'');
 const consent=document.getElementById('community-opt-in').checked?' I would also like STABLE Academy community news and future course updates by email.':' Please send course-related emails only.';
 const text=message+contact+(question?' I would like to understand: '+question:'')+consent;
 document.getElementById('enquiry').textContent=text;
 document.getElementById('email-enquiry').href='mailto:drparmardds@gmail.com?subject='+encodeURIComponent('STABLE Academy enrolment: '+plans[pack.value].name)+'&body='+encodeURIComponent(text);
}
function validContact(){for(const id of ['attendee-name','attendee-email']){const el=document.getElementById(id);if(!el.value.trim()||!el.checkValidity()){el.reportValidity();el.focus();return false}}return true}
for(const id of ['attendee-name','attendee-email'])document.getElementById(id).addEventListener('input',updateEnquiry);
document.getElementById('community-opt-in').addEventListener('change',updateEnquiry);
document.getElementById('email-enquiry').addEventListener('click',event=>{if(!validContact())event.preventDefault()});
document.getElementById('registration-country').addEventListener('change',event=>{country.value=event.target.value;render()});
document.getElementById('learning-question').addEventListener('input',updateEnquiry);
country.addEventListener('change',render);pack.addEventListener('change',render);confirmed.addEventListener('change',payment);
document.querySelectorAll('.pick').forEach(a=>a.addEventListener('click',()=>{pack.value=a.dataset.plan;render()}));
document.getElementById('copy').addEventListener('click',async()=>{if(!validContact())return;try{await navigator.clipboard.writeText(document.getElementById('enquiry').textContent);document.getElementById('status').textContent='Copied. Open Instagram and paste your enquiry.'}catch{document.getElementById('status').textContent='Please select and copy the enquiry above.'}});
async function init(){try{const [cr,lr]=await Promise.all([fetch('assets/countries.json'),fetch('assets/payment-links.json')]);if(!cr.ok||!lr.ok)throw Error('Unavailable');countries=(await cr.json()).countries;links=await lr.json();for(const c of countries){const o=document.createElement('option');o.value=c.code;o.textContent=c.name;country.append(o)}const other=document.createElement('option');other.value='OTHER';other.textContent='My country is not listed';country.append(other);countries.push({code:'OTHER',name:'a country not listed',tier:'enquiry'});document.getElementById('registration-country').replaceChildren(...Array.from(country.options,o=>o.cloneNode(true)));render()}catch{render();document.getElementById('status').textContent='Tuition options could not load. Please contact Dr Parmar to confirm your fee.'}}
init();
