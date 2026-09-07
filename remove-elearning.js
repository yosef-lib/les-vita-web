const fs = require('fs');
let c = fs.readFileSync('src/app/page.tsx', 'utf8');
c = c.replace(/\{ href: '#e-learning', label: 'E-Learning' \},?/, '');
c = c.replace(/<li><Link href="\/pengajar"[\s\S]*?Portal Pengajar<\/Link><\/li>/, '');
c = c.replace(/\{\/\* ====================== E-LEARNING ====================== \*\/\}[\s\S]*?<\/section>/, '');
c = c.replace(/const digitalProducts = \[[\s\S]*?\];/, '');
fs.writeFileSync('src/app/page.tsx', c);
