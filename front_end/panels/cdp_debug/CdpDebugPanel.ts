// Copyright 2022 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import * as UI from '../../ui/legacy/legacy.js';

const panelName = 'cdp_debug';
const iframeUrl = '/extensions/cdp-debug.html';
export const CustomPanel = UI.CustomPanel.createPanel(panelName, iframeUrl);
