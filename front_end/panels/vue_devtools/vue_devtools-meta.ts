// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// import * as Common from '../core/common/common.js';
import * as UI from '../../ui/legacy/legacy.js';
import * as Root from '../../core/root/root.js';
import type * as VueDevtools from './vue_devtools.js';

// UI.CustomPanel.registerPanelView({
//   viewId: 'custom-vue-devtools',
//   UIStrings,
//   UIStringsKey: 'panels/vue_devtools/vue_devtools-meta.ts',
//   moduleName: 'panels/vue_devtools',
//   customModulePath: 'panels/vue_devtools/vue_devtools.js',
//   tabName: 'vue_devtools',
// });

let loadedVueDevtoolsModule: (typeof VueDevtools | undefined);
async function loadVueDevtoolsModule() {
  if(!loadedVueDevtoolsModule) {
    // await Root.Runtime.Runtime.instance().loadModulePromise('panels/vue_devtools');
    loadedVueDevtoolsModule = await import('./vue_devtools.js');
  }
  return loadedVueDevtoolsModule;
}

/**
 * register view at the entry of devtools
 * enable this tab by UI.ViewManager.ViewManager.instance().showView interface
 */
UI.ViewManager.registerViewExtension({
  location: UI.ViewManager.ViewLocationValues.PANEL,
  id: 'custom-vue-devtools',
  title: () => ('Vue Devtools' as any),
  commandPrompt: () => ('show Vue Devtools' as any),
  // set as closeable, firstscreen this tab is hidden, will change as visiable
  // when receive enableVueDevtools event
  persistence: UI.ViewManager.ViewPersistence.CLOSEABLE,
  order: 500,
  async loadView() {
    const VueDevtools = await loadVueDevtoolsModule();
    return VueDevtools.CustomPanel.CustomPanel.instance();
  },
});
