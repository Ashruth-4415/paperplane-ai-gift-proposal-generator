const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.jsx')) results.push(file);
    }
  });
  return results;
}

const files = walk('src');
let changedCount = 0;

files.forEach(file => {
  let original = fs.readFileSync(file, 'utf8');
  let content = original;
  
  // Replace full gradient button classes
  content = content.replace(/bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500/g, 'bg-brand-600 hover:bg-brand-500');
  
  // Replace other gradient instances
  content = content.replace(/bg-gradient-to-r from-purple-600 to-indigo-600/g, 'bg-brand-600');
  
  // Replace solid purple buttons
  content = content.replace(/bg-purple-600 hover:bg-purple-500/g, 'bg-brand-600 hover:bg-brand-500');
  
  // Replace purple shadows on buttons
  content = content.replace(/shadow-purple-500\/15/g, 'shadow-brand-500/25 hover:shadow-brand-500/40');
  content = content.replace(/shadow-purple-500\/25/g, 'shadow-brand-500/25 hover:shadow-brand-500/40');
  
  if (original !== content) {
    fs.writeFileSync(file, content);
    changedCount++;
    console.log('Updated:', file);
  }
});

console.log(`Changed ${changedCount} files.`);
