const fs = require('fs');
let content = fs.readFileSync('src/components/FlightScene.vue', 'utf8');

// 1. Add state for photo wall
content = content.replace(
  'const currentStopIndex = ref(-1);',
  `const currentStopIndex = ref(-1);
const showPhotoWall = ref(false);
const currentImages = ref<string[]>([]);`
);

// 2. Change the button click handler to show photo wall first
content = content.replace(
  '@click="flyToNext"',
  '@click="handleNextAction"'
);

// 3. Add handleNextAction function before flyToNext
content = content.replace(
  'const flyToNext = () => {',
  `const handleNextAction = () => {
  if (currentStopIndex.value >= 0 && stops[currentStopIndex.value].images?.length) {
    currentImages.value = stops[currentStopIndex.value].images;
    showPhotoWall.value = true;
  } else {
    flyToNext();
  }
};

const closePhotoWall = () => {
  showPhotoWall.value = false;
  flyToNext();
};

const flyToNext = () => {`
);

// 4. Add the component to the template, right before closing div.flight-scene
content = content.replace(
  '  </div>\n</template>',
  `    <Transition name="fade">\n      <PhotoWallScene v-if="showPhotoWall" :images="currentImages" @close="closePhotoWall" />\n    </Transition>\n  </div>\n</template>`
);

// remove duplicate imports if any
content = content.replace(/import { graduationData } from '\.\.\/data\/config';\nimport PhotoWallScene from '\.\/PhotoWallScene.vue';\nimport { graduationData } from '\.\.\/data\/config';/, "import PhotoWallScene from './PhotoWallScene.vue';\nimport { graduationData } from '../data/config';");

fs.writeFileSync('src/components/FlightScene.vue', content);
