// Simple Photo Diary app.js
// Expects firebase.init.js to initialize firebase and provide `db` and `storage` globals.

const monthLabel = document.getElementById('monthLabel');
const calendarEl = document.getElementById('calendar');
const prevBtn = document.getElementById('prevMonth');
const nextBtn = document.getElementById('nextMonth');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const modalDateLabel = document.getElementById('modalDateLabel');
const photoInput = document.getElementById('photoInput');
const photoPreview = document.getElementById('photoPreview');
const diaryText = document.getElementById('diaryText');
const peopleInput = document.getElementById('peopleInput');
const tagsInput = document.getElementById('tagsInput');
const locationInput = document.getElementById('locationInput');
const saveBtn = document.getElementById('saveBtn');
const existingPhotos = document.getElementById('existingPhotos');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

let current = new Date();
current.setDate(1);
let selectedDateStr = null;
let selectedFiles = [];
let loadedDiaries = {}; // cache

function fmtDate(d){
  const y = d.getFullYear(); const m = String(d.getMonth()+1).padStart(2,'0'); const day = String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
}

function renderCalendar(){
  calendarEl.innerHTML = '';
  const year = current.getFullYear();
  const month = current.getMonth();
  const firstDay = new Date(year, month, 1);
  const startWeekday = firstDay.getDay(); // 0..6
  const daysInMonth = new Date(year, month+1, 0).getDate();

  monthLabel.textContent = `${year}년 ${month+1}월`;

  // empty cells
  for(let i=0;i<startWeekday;i++){
    const el = document.createElement('div');
    el.className = 'day-cell empty';
    calendarEl.appendChild(el);
  }

  // day cells
  for(let day=1; day<=daysInMonth; day++){
    const date = new Date(year, month, day);
    const dateStr = fmtDate(date);
    const cell = document.createElement('div');
    cell.className = 'day-cell';
    const dateEl = document.createElement('div');
    dateEl.className = 'date';
    dateEl.textContent = day;
    const thumb = document.createElement('div');
    thumb.className = 'thumb';
    cell.appendChild(dateEl);
    cell.appendChild(thumb);

    cell.addEventListener('click', ()=> openModal(dateStr));

    // if we have cached diary with main photo, show it
    const doc = loadedDiaries[dateStr];
    if(doc && doc.photos && doc.photos.length){
      const main = doc.photos.find(p=>p.isMain) || doc.photos[0];
      thumb.style.backgroundImage = `url('${main.url}')`;
    } else {
      thumb.style.backgroundImage = '';
    }

    calendarEl.appendChild(cell);
  }
}

async function loadMonthEntries(){
  // load all diaries for the visible month
  const year = current.getFullYear();
  const month = current.getMonth()+1;
  const monthPrefix = `${year}-${String(month).padStart(2,'0')}`;

  loadedDiaries = {};
  if(!window.db) return renderCalendar();

  const snapshot = await db.collection('diaries')
    .where('date', '>=', monthPrefix + '-01')
    .where('date', '<=', monthPrefix + '-31')
    .get();

  snapshot.forEach(doc=> {
    loadedDiaries[doc.id] = doc.data();
  });
  renderCalendar();
}

function openModal(dateStr){
  selectedDateStr = dateStr;
  modalDateLabel.textContent = dateStr;
  diaryText.value = '';
  peopleInput.value = '';
  tagsInput.value = '';
  locationInput.value = '';
  photoPreview.innerHTML = '';
  existingPhotos.innerHTML = '';
  selectedFiles = [];

  // load existing diary if any
  const cached = loadedDiaries[dateStr];
  if(cached){
    diaryText.value = cached.text || '';
    peopleInput.value = (cached.people||[]).join(',');
    tagsInput.value = (cached.tags||[]).join(',');
    locationInput.value = cached.location || '';
    // show existing photos
    (cached.photos||[]).forEach((p, idx)=>{
      const img = document.createElement('img');
      img.src = p.url;
      if(p.isMain) img.classList.add('main');
      img.addEventListener('click', ()=> {
        // toggle main
        cached.photos.forEach(x=>x.isMain=false);
        p.isMain = true;
        // update highlight
        Array.from(existingPhotos.children).forEach(c=>c.classList.remove('main'));
        img.classList.add('main');
      });
      existingPhotos.appendChild(img);
    });
  }

  modal.classList.remove('hidden');
}

closeModal.addEventListener('click', ()=> modal.classList.add('hidden'));

photoInput.addEventListener('change', (e)=>{
  const files = Array.from(e.target.files);
  files.forEach(file=>{
    selectedFiles.push(file);
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    photoPreview.appendChild(img);
  });
});

saveBtn.addEventListener('click', async ()=>{
  if(!selectedDateStr) return;
  // prepare doc
  const docRef = db.collection('diaries').doc(selectedDateStr);
  const docSnap = await docRef.get();
  let docData = docSnap.exists ? docSnap.data() : { date: selectedDateStr, photos: [] };

  // upload new photos
  for(const file of selectedFiles){
    const path = `photos/${selectedDateStr}/${Date.now()}_${file.name}`;
    const storageRef = storage.ref(path);
    await storageRef.put(file);
    const url = await storageRef.getDownloadURL();
    docData.photos.push({ url, isMain: false, name: file.name });
  }

  // if there was no main photo, set the first one as main
  if(!docData.photos.find(p=>p.isMain) && docData.photos.length) docData.photos[0].isMain = true;

  // update metadata
  docData.text = diaryText.value;
  docData.people = peopleInput.value ? peopleInput.value.split(',').map(s=>s.trim()).filter(Boolean) : [];
  docData.tags = tagsInput.value ? tagsInput.value.split(',').map(s=>s.trim()).filter(Boolean) : [];
  docData.location = locationInput.value || '';

  await docRef.set(docData);
  // refresh
  selectedFiles = [];
  photoInput.value = '';
  await loadMonthEntries();
  modal.classList.add('hidden');
});

prevBtn.addEventListener('click', ()=>{
  current.setMonth(current.getMonth()-1);
  loadMonthEntries();
});
nextBtn.addEventListener('click', ()=>{
  current.setMonth(current.getMonth()+1);
  loadMonthEntries();
});

searchBtn.addEventListener('click', async ()=>{
  const q = searchInput.value.trim();
  if(!q) return loadMonthEntries();

  // very simple search: search tags, people, location fields. This makes multiple queries.
  // For demo purposes only.
  loadedDiaries = {};
  if(!db) return renderCalendar();
  const col = db.collection('diaries');
  // search tags
  const tagSnap = await col.where('tags', 'array-contains', q).get();
  tagSnap.forEach(d=> loadedDiaries[d.id]=d.data());
  const peopleSnap = await col.where('people', 'array-contains', q).get();
  peopleSnap.forEach(d=> loadedDiaries[d.id]=d.data());
  const locSnap = await col.where('location', '==', q).get();
  locSnap.forEach(d=> loadedDiaries[d.id]=d.data());

  renderCalendar();
});

// initial load
loadMonthEntries();
