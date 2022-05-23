// Copyright 2022 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// @ts-nocheck
import * as ReactDevtools from './react_devtools.js';

// 定义全局变量 ReactDevtools
self.ReactDevtools = self.ReactDevtools || {};

// eslint-disable-next-line no-global-assign
ReactDevtools = ReactDevtools || {};

// 定义全局变量 ReactDevtools.CustomPanel，对应 module.json 中 panel 插件的 className。在切换到 custom 模块时，调用 extension.instance() 新建 CustomPanel。
ReactDevtools.CustomPanel = ReactDevtools.CustomPanel.CustomPanel;
