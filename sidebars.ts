import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  // docsSidebar: [{type: 'autogenerated', dirName: '.', collapsed: false}],

  // But you can create a sidebar manually
  docsSidebar: [
    'concepts',
    'get-started',
    {
      type: 'category',
      label: 'Tutorial',
      items: [
          'tutorial/quick-example',
          'tutorial/use-with-gpt',
      ],
      collapsed: false
    },
    {
      type: 'category',
      label: 'Guide',
      items: [
        'guide/entity-and-relation',
        'guide/interaction',
        'guide/computed-data',
        'guide/activity',
        'guide/web-server'
      ],
      collapsed: false
    },
    {
      type: 'category',
      label: 'Reference',
      items: [
        'reference/database',
        'reference/storage',
        'reference/boolexp',
        'reference/api-response',
      ],
      collapsed: false
    },
    {
      type: 'category',
      label: 'Advanced',
      items: [
        'advanced/use-logto-as-authentication-system',
        'advanced/create-a-cms-in-5-min',
      ],
      collapsed: false
    },
    'interaqt-go',
    'interaqt-java',
  ],
};

export default sidebars;
