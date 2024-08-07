import fs from 'node:fs/promises';
import path from 'node:path';

let fileNameList = await fs.readdir(path.resolve(__dirname, '../../posts'));

fileNameList = fileNameList.filter((file) => file.endsWith('.md'));

const activeArticleFileName = fileNameList[0];

export const genNav = () => {
  return [
    { text: '首页', link: '/' },
    {
      text: '文章',
      link: `/posts/${activeArticleFileName}`,
      activeMatch: `/posts/${activeArticleFileName}/`,
    },
  ];
};

export const genSidebar = () => {
  return [
    {
      text: '文章',
      items: fileNameList.map((name) => ({
        text: name.replace('.md', ''),
        link: `/posts/${name}`,
      })),
    },
  ];
};
