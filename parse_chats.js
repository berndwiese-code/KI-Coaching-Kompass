const fs = require('fs');

try {
  const data = JSON.parse(fs.readFileSync('claude_archive/conversations.json', 'utf8'));
  let markdown = '# Claude Chats Context\n\n';

  const kckChats = data.filter(c => c.name && c.name.toLowerCase().startsWith('kck-') && !c.name.toLowerCase().startsWith('kck-cw-'));
  const cwChats = data.filter(c => c.name && c.name.toLowerCase().startsWith('kck-cw-'));

  markdown += '## KCK-CW Chats\n\n';
  cwChats.forEach(c => {
    markdown += `### ${c.name}\n\n`;
    markdown += `**Summary:**\n${c.summary || 'No summary'}\n\n`;
    markdown += `**Messages:**\n`;
    c.chat_messages.forEach(m => {
      const text = (m.text || '').replace(/\n/g, ' ');
      markdown += `- **${m.sender}**: ${text.substring(0, 1000)}\n`;
    });
    markdown += '\n---\n\n';
  });

  markdown += '## Other KCK Chats\n\n';
  kckChats.forEach(c => {
    markdown += `### ${c.name}\n\n`;
    markdown += `**Summary:**\n${c.summary || 'No summary'}\n\n`;
    markdown += `**Messages:**\n`;
    c.chat_messages.forEach(m => {
      const text = (m.text || '').replace(/\n/g, ' ');
      markdown += `- **${m.sender}**: ${text.substring(0, 1000)}\n`;
    });
    markdown += '\n---\n\n';
  });

  fs.writeFileSync('claude_chats.md', markdown);
  console.log('Success! Wrote', cwChats.length, 'cw chats and', kckChats.length, 'kck chats.');
} catch (e) {
  console.error("Error:", e);
}
