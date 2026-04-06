const fs = require('fs');
let content = fs.readFileSync('src/App.vue', 'utf8');

// remove photoWall component from App.vue template
content = content.replace(
  /<PhotoWallScene[\s\S]*?@next="currentStage = 'final'"\n      \/>\n      \n      /g,
  ""
);

fs.writeFileSync('src/App.vue', content);
