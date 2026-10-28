'use strict';
const STORAGE_KEY = 'spendwise_expenses_v1';
const $ = id => document.getElementById(id);
const form = $('expenseForm');
const categories = ['Food & Drinks','Shopping','Transport','Bills','Health','Entertainment','Other'];
let expenses = loadExpenses();
let editingId = null;
function loadExpenses() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(stored) ? stored.filter(item => item && typeof item.id === 'string' && typeof item.title === 'string' && Number.isFinite(item.amount) && item.amount > 0 && categories.includes(item.category)) : [];
  } catch (error) { console.warn('Could not read saved expenses:', error); return []; }
}
function saveExpenses() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses)); return true; }
  catch (error) { $('error').textContent = 'Unable to save. Check your browser storage settings.'; return false; }
}
function money(amount) { return new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR'}).format(amount); }
function createCell(row,value) { const cell = document.createElement('td'); cell.textContent = value; row.appendChild(cell); return cell; }
function render() {
  const search = $('search').value.trim().toLowerCase();
  const filter = $('filter').value;
  const visible = expenses.filter(e => e.title.toLowerCase().includes(search) && (filter === 'all' || e.category === filter));
  $('total').textContent = money(expenses.reduce((sum,e) => sum + e.amount,0));
  $('count').textContent = String(expenses.length);
  const totals = {};
  expenses.forEach(e => { totals[e.category] = (totals[e.category] || 0) + e.amount; });
  $('topCategory').textContent = Object.keys(totals).sort((a,b) => totals[b]-totals[a])[0] || '—';
  $('resultCount').textContent = `${visible.length} record${visible.length === 1 ? '' : 's'}`;
  const body = $('expenseRows'); body.replaceChildren();
  visible.forEach(expense => {
    const row = document.createElement('tr');
    createCell(row,expense.title);
    const cat = createCell(row,''); const chip = document.createElement('span'); chip.className='category-chip'; chip.textContent=expense.category; cat.appendChild(chip);
    createCell(row,money(expense.amount));
    const actions = createCell(row,'');
    const edit = document.createElement('button'); edit.className='action'; edit.textContent='Edit'; edit.setAttribute('aria-label',`Edit ${expense.title}`); edit.addEventListener('click',()=>startEdit(expense.id));
    const remove = document.createElement('button'); remove.className='action delete'; remove.textContent='Delete'; remove.setAttribute('aria-label',`Delete ${expense.title}`); remove.addEventListener('click',()=>deleteExpense(expense.id));
    actions.append(edit,remove); body.appendChild(row);
  });
  $('empty').hidden = visible.length > 0;
  $('empty').textContent = expenses.length === 0 ? 'No expenses yet. Add your first one to get started.' : 'No expenses match your search or filter.';
}
function resetForm() { form.reset(); editingId=null; $('formHeading').textContent='Add an expense'; $('submitBtn').textContent='Add expense'; $('cancelBtn').hidden=true; $('error').textContent=''; }
function startEdit(id) {
  const expense=expenses.find(e=>e.id===id); if(!expense)return;
  editingId=id; $('title').value=expense.title; $('amount').value=expense.amount; $('category').value=expense.category;
  $('formHeading').textContent='Edit expense'; $('submitBtn').textContent='Save changes'; $('cancelBtn').hidden=false; $('error').textContent=''; $('title').focus();
  if(window.innerWidth < 1000) form.scrollIntoView({behavior:'smooth',block:'center'});
}
function deleteExpense(id) {
  if(!window.confirm('Delete this expense?'))return;
  const old=expenses; expenses=expenses.filter(e=>e.id!==id);
  if(!saveExpenses()){expenses=old;return;}
  if(editingId===id)resetForm();render();
}
form.addEventListener('submit',event=>{
  event.preventDefault(); $('error').textContent='';
  const title=$('title').value.trim(); const rawAmount=$('amount').value.trim(); const amount=Number(rawAmount); const category=$('category').value;
  if(!title || title.length>80){$('error').textContent='Enter an expense title (up to 80 characters).';return;}
  if(!rawAmount || !Number.isFinite(amount) || amount<=0 || amount>100000000 || !/^\d+(\.\d{1,2})?$/.test(rawAmount)){$('error').textContent='Enter a valid amount greater than zero (up to 2 decimal places).';return;}
  if(!categories.includes(category)){$('error').textContent='Select a valid category.';return;}
  const old=expenses.slice();
  if(editingId){expenses=expenses.map(e=>e.id===editingId?{...e,title,amount,category}:e);}
  else{expenses.unshift({id:crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,title,amount,category});}
  if(!saveExpenses()){expenses=old;return;}
  resetForm();render();
});
$('cancelBtn').addEventListener('click',resetForm);
$('search').addEventListener('input',render);
$('filter').addEventListener('change',render);
render();