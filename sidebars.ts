import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: '文档作品',
      items: [
        'doc-projects/iot-overview',
        'doc-projects/iot-platform-guide',
        'doc-projects/api-docs',
        {
          type: 'category',
          label: '文档质量评分系统',
          items: [
            'doc-projects/doc-score/intro',
            'doc-projects/doc-score/scoring-rules',
            'doc-projects/doc-score/writing-check',
            'doc-projects/doc-score/ci-integration',
            'doc-projects/doc-score/results',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: '产品思维',
      items: [
        'product-thinking/docs-as-code',
        'product-thinking/competitor-analysis',
      ],
    },
    {
      type: 'category',
      label: '技能展示',
      items: [
        'skills/mermaid',
      ],
    },
  ],
};

export default sidebars;
