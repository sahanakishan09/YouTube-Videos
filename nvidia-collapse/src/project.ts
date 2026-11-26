import {makeProject} from '@motion-canvas/core';

import act0Hook from './scenes/act0_hook?scene';
import act1Foundation from './scenes/act1_foundation?scene';
import act1bSurvival from './scenes/act1b_survival?scene';
import act2GpuMap from './scenes/act2_gpu_map?scene';
import act3Reckoning from './scenes/act3_reckoning?scene';
import act4Fallout from './scenes/act4_fallout?scene';
import act5Epilogue from './scenes/act5_epilogue?scene';

export default makeProject({
  scenes: [
    act0Hook,
    act1Foundation,
    act1bSurvival,
    act2GpuMap,
    act3Reckoning,
    act4Fallout,
    act5Epilogue,
  ],
});