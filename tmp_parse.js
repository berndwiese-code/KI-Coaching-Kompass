const fs = require('fs');
const path = require('path');
const repo = 'c:/Users/bernd/Desktop/KI-Coaching-Kompass - AntiGravity';
try {
  const data = JSON.parse(fs.readFileSync(path.join(repo, 'claude_archive/conversations.json'), 'utf8'));
  const kckChats = data.filter(c => c.name && c.name.toLowerCase().startsWith('kck-'));
  const cwChats = kckChats.filter(c => c.name.toLowerCase().startsWith('kck-cw-'));
  const otherKckChats = kckChats.filter(c => !c.name.toLowerCase().startsWith('kck-cw-'));

  const result = {
    total: kckChats.length,
    cwChats: cwChats.map(c => ({ name: c.name, messages: c.chat_messages.length })),
    otherKckChats: otherKckChats.map(c => ({ name: c.name, messages: c.chat_messages.length }))
  };
  fs.writeFileSync(path.join(repo, 'output.json'), JSON.stringify(result, null, 2));

  cwChats.forEach((c, idx) => {
    fs.writeFileSync(path.join(repo, `chat_cw_${idx}.json`), JSON.stringify(c, null, 2));
  });
  otherKckChats.forEach((c, idx) => {
    fs.writeFileSync(path.join(repo, `chat_other_${idx}.json`), JSON.stringify(c, null, 2));
  });

} catch (e) {
  fs.writeFileSync(path.join(repo, 'error.txt'), String(e));
}
