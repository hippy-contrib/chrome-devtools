// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// import * as Common from '../core/common/common.js';
import * as UI from '../../ui/legacy/legacy.js';
import type * as ReactDevtools from './react_devtools.js';

let loadedReactDevtoolsModule: (typeof ReactDevtools | undefined);
async function loadReactDevtoolsModule() {
  if(!loadedReactDevtoolsModule) {
    loadedReactDevtoolsModule = await import('./react_devtools.js');
  }
  return loadedReactDevtoolsModule;
}

/**
 * register view at the entry of devtools
 * enable this tab by UI.ViewManager.ViewManager.instance().showView interface
 */
UI.ViewManager.registerViewExtension({
  location: UI.ViewManager.ViewLocationValues.PANEL,
  id: 'custom-react-devtools',
  title: () => ('React Devtools' as any),
  commandPrompt: () => ('show React Devtools' as any),
  // set as closeable, firstscreen this tab is hidden, will change as visiable
  // when receive enableReactDevtools event
  persistence: UI.ViewManager.ViewPersistence.CLOSEABLE,
  order: 500,
  async loadView() {
    const ReactDevtools = await loadReactDevtoolsModule();
    return ReactDevtools.CustomPanel.CustomPanel.instance();
  },
});
