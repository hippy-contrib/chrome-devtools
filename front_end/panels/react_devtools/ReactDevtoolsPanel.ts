// Copyright 2022 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import * as UI from '../../ui/legacy/legacy.js';

const panelName = 'react_devtools';
const iframeUrl = '/extensions/react-devtools.html';
export const CustomPanel = UI.CustomPanel.createPanel(panelName, iframeUrl);
