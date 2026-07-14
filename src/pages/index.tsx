import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HeroSection() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <Heading as="h1" className={styles.heroTitle}>
          {siteConfig.title}
        </Heading>
        <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
        <div className={styles.heroButtons}>
          <Link className={styles.primaryButton} to="/docs/">
            查看作品集
          </Link>
          <Link className={styles.secondaryButton} to="/blog">
            阅读建站手记
          </Link>
        </div>
      </div>
    </section>
  );
}

type FeatureItem = {
  title: string;
  description: string;
  icon: string;
  link: string;
};

const features: FeatureItem[] = [
  {
    title: '文档工程',
    description: '从概念说明到 API 参考，覆盖多种文档类型。注重结构化表达、信息完整和开发者体验。',
    icon: '\u{1F4DD}',
    link: '/docs/iot-overview',
  },
  {
    title: '质量体系设计',
    description: '从 0 到 1 设计文档质量评分系统，接入 DeepSeek API 做自动化评估，集成到 CI 流水线。',
    icon: '\u{1F3AF}',
    link: '/blog/doc-score',
  },
  {
    title: '工程化实践',
    description: '用 Docs as Code 的方式管理文档：Markdown 写作、Git 版本控制、Lint 规范检查、CI/CD 自动部署。',
    icon: '\u{1F527}',
    link: '/blog/docs-as-code',
  },
];

function FeatureCard({title, description, icon, link}: FeatureItem) {
  return (
    <Link to={link} className={styles.featureCard}>
      <span className={styles.featureIcon}>{icon}</span>
      <Heading as="h3" className={styles.featureTitle}>
        {title}
      </Heading>
      <p className={styles.featureDescription}>{description}</p>
      <span className={styles.featureArrow}>&rarr;</span>
    </Link>
  );
}

function FeaturesSection() {
  return (
    <section className={styles.features}>
      <div className={styles.featuresInner}>
        <Heading as="h2" className={styles.sectionTitle}>
          核心能力
        </Heading>
        <p className={styles.sectionSubtitle}>
          内容有质量，流程有体系
        </p>
        <div className={styles.featureGrid}>
          {features.map((feature, idx) => (
            <FeatureCard key={idx} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectsSection() {
  return (
    <section className={styles.projects}>
      <div className={styles.projectsInner}>
        <Heading as="h2" className={styles.sectionTitle}>
          项目作品
        </Heading>
        <p className={styles.sectionSubtitle}>
          真实工作中产出的文档与体系设计
        </p>
        <div className={styles.projectGrid}>
          <Link to="/docs/iot-overview" className={styles.projectCard}>
            <span className={styles.projectTag}>概念解释</span>
            <Heading as="h3" className={styles.projectTitle}>IoT 基础概念说明</Heading>
            <p className={styles.projectDesc}>以小米智能家居为例，说明对 IoT 基础概念的理解</p>
          </Link>
          <Link to="/docs/iot-platform-guide" className={styles.projectCard}>
            <span className={styles.projectTag}>操作指南</span>
            <Heading as="h3" className={styles.projectTitle}>小米 IoT 平台接入指南</Heading>
            <p className={styles.projectDesc}>从创建产品到申请上线的完整接入流程</p>
          </Link>
          <Link to="/docs/api-docs" className={styles.projectCard}>
            <span className={styles.projectTag}>API 参考</span>
            <Heading as="h3" className={styles.projectTitle}>IoT 平台 API 文档</Heading>
            <p className={styles.projectDesc}>函数计算 API 接口文档，结构清晰、示例完整</p>
          </Link>
          <Link to="/docs/competitor-analysis" className={styles.projectCard}>
            <span className={styles.projectTag}>分析研究</span>
            <Heading as="h3" className={styles.projectTitle}>平台文档优化</Heading>
            <p className={styles.projectDesc}>行业文档体系观察与启发</p>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="技术文档作品集 — 文档工程与产品思维">
      <HeroSection />
      <main>
        <FeaturesSection />
        <ProjectsSection />
      </main>
    </Layout>
  );
}
