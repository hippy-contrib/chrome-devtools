// Copyright 2022 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

const glob = require('glob');
const fs = require('fs');
const path = require('path');

const cwd = path.join(__dirname, '../../out/Release/gen/front_end');

if(!process.env.VERSION) {
  console.error('need set VERSION env');
  process.exit(1);
}

function addVersionToJS() {
  glob('**/*.js', { cwd }, (e, files) => {
    if(e) {
      console.error(e);
      return;
    }
    Promise.all(files.map(file => {
      const src = path.join(cwd, file);
      const dist = path.join(cwd, '../../../Version/gen/front_end/', file);
      return replaceImport(src, dist);
    }));
  });
}

async function replaceImport(src, dist) {
  const code = await fs.promises.readFile(src, 'utf8');
  const replacer = (match, p1) => {
    return match.replace(p1, `${p1}?v=${process.env.VERSION}`);
  };
  const contents = code.replace(/import\s+.*['"](.*)['"]/g, replacer).replace(/import\(['"](.*)['"]\)/g, replacer);

  const dir = path.dirname(dist);
  await fs.promises.mkdir(dir, {recursive: true});
  return fs.promises.writeFile(dist, contents);
}

async function replaceHTMLScript(src, dist) {
  const code = await fs.promises.readFile(src, 'utf8');
  const replacer = (match, p1) => {
    return match.replace(p1, `${p1}?v=${process.env.VERSION}`);
  };
  const contents = code.replace(/src="\.\/entrypoints\/(.*)"/g, replacer);

  const dir = path.dirname(dist);
  await fs.promises.mkdir(dir, {recursive: true});
  return fs.promises.writeFile(dist, contents);
}

function addVersionToHTML() {
  glob('*.html', { cwd }, (e, files) => {
    if(e) {
      console.error(e);
      return;
    }
    Promise.all(files.map(file => {
      const src = path.join(cwd, file);
      const dist = path.join(cwd, '../../../Version/gen/front_end/', file);
      return replaceHTMLScript(src, dist);
    }));
  });
}

addVersionToJS();
addVersionToHTML();
