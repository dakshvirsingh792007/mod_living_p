// script.js for Mod Living - merged from all HTML files

// JavaScript from all HTML files will be placed here.
// (No JavaScript was detected in the provided HTML summaries, but this file is ready for your scripts.)
// Scripts from about.html
const revObs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');revObs.unobserve(e.target);}});},{threshold:0.1});
document.querySelectorAll('.reveal').forEach(el=>revObs.observe(el));
// End of scripts from about.html

// Scripts from contact.html
function submitContact(){
	const fields=[
		{id:'f-first',eid:'e-first',check:v=>v.trim().length>0},
		{id:'f-last',eid:'e-last',check:v=>v.trim().length>0},
		{id:'f-email',eid:'e-email',check:v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)},
		{id:'f-interest',eid:'e-interest',check:v=>v!==''}
	];
	let ok=true;
	fields.forEach(f=>{
		const el=document.getElementById(f.id);
		const err=document.getElementById(f.eid);
		const pass=f.check(el.value);
		err.style.display=pass?'none':'block';
		el.style.borderColor=pass?'':'#ef4444';
		if(!pass) ok=false;
	});
	if(ok){
		document.getElementById('f-success').style.display='block';
		fields.forEach(f=>{
			const field=document.getElementById(f.id);
			field.value='';
		});
	}
}
// End of scripts from contact.html

// Scripts from emi-calculator.html
// ...JS from emi-calculator.html...
// End of scripts from emi-calculator.html

// Scripts from main.html
// ...JS from main.html...
// End of scripts from main.html

// Scripts from owners.html
// ...JS from owners.html...
// End of scripts from owners.html

// Scripts from properties.html
// ...JS from properties.html...
// End of scripts from properties.html
