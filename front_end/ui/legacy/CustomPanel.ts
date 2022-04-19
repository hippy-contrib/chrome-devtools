// Copyright 2022 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import * as i18n from '../../core/i18n/i18n.js';
import * as Root from '../../core/root/root.js';
import * as Panel from './Panel.js';
import * as ViewManager from './ViewManager.js';

let requestId = 0;

export const bindIframeEvent = (iframe: HTMLIFrameElement) => {
  window.addEventListener(
    'message',
    e => {
      const { cmd, id } = e.data;
      if (cmd === 'getParentUrl') {
        iframe.contentWindow?.postMessage({
          id,
          data: window.location.href,
        }, e.origin);
      }
      if (cmd === 'getRequestId') {
        requestId -= 1;
        iframe.contentWindow?.postMessage({
          id,
          data: requestId,
        }, e.origin);
      }
    },
    false,
  );
};

export const createPanel = (panelName: string, iframeUrl: string): any => {
  return class CustomPanel extends Panel.Panel {
    private iframe: HTMLIFrameElement;
    private static panelInstance: CustomPanel;

    constructor() {
      super(panelName);

      this.setHideOnDetach();
      this.iframe = document.createElement('iframe');
      this.iframe.setAttribute('src', iframeUrl);
      this.iframe.style.width = '100%';
      this.iframe.style.height = '100%';
      this.iframe.style.overflow = 'auto';
      this.contentElement.appendChild(this.iframe);

      bindIframeEvent(this.iframe);
    }

    static instance(opts = { forceNew: null }): CustomPanel {
      const { forceNew } = opts;
      if (!CustomPanel.panelInstance || forceNew) {
        CustomPanel.panelInstance = new CustomPanel();
      }
      return CustomPanel.panelInstance;
    }
  };
};

type RegisterPanelOption = {
  viewId: string,
  UIStrings: any,
  UIStringsKey: string,
  moduleName: string,
  customModulePath: string,
  order?: number,
  tabName: string,
};
export const registerPanelView = ({
  viewId,
  UIStrings,
  UIStringsKey,
  moduleName,
  customModulePath,
  tabName,
  order = 20,
}: RegisterPanelOption): void => {
  const str_ = i18n.i18n.registerUIStrings(UIStringsKey, UIStrings);
  const i18nLazyString = i18n.i18n.getLazilyComputedLocalizedString.bind(undefined, str_);
  let loadedCustomModule: any;
  async function loadCustomModule() {
      if (!loadedCustomModule) {
          // await Root.Runtime.Runtime.instance().loadModulePromise(moduleName);
          loadedCustomModule = await import('../../' + customModulePath);
      }
      return loadedCustomModule;
  }

  ViewManager.registerViewExtension({
      location: ViewManager.ViewLocationValues.PANEL,
      id: viewId,
      title: i18nLazyString(UIStrings.custom),
      commandPrompt: i18nLazyString(UIStrings.showCustom),
      order,
      async loadView() {
          const Custom = await loadCustomModule();
          return Custom.CustomPanel.CustomPanel.instance();
      },
  });
};
