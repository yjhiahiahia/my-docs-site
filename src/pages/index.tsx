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
            阅读博客
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
    description: '从 API 参考到操作指南，覆盖多种文档类型。注重结构化表达、信息完整和开发者体验。',
    icon: '\u{1F4DD}',
    link: '/docs/doc-projects/api-docs',
  },
  {
    title: '质量体系设计',
    description: '从 0 到 1 设计文档质量评分系统，融合 AI 评估与 CI/CD 自动化，实现质量闭环管控。',
    icon: '\u{1F3AF}',
    link: '/docs/doc-projects/doc-score/intro',
  },
  {
    title: '产品思维',
    description: '具备 Docs as Code 工程化实践经验，善于竞品分析和方法论沉淀，关注文档的系统性与可持续性。',
    icon: '\u{1F4A1}',
    link: '/docs/product-thinking/docs-as-code',
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
          文档能力与产品思维的结合，让复杂的事情变得清晰可执行
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
          <Link to="/docs/doc-projects/iot-overview" className={styles.projectCard}>
            <span className={styles.projectTag}>概念解释</span>
            <Heading as="h3" className={styles.projectTitle}>IoT 物联网行业认知</Heading>
            <p className={styles.projectDesc}>基于两年平台工作经验，对物联网行业的理解和思考</p>
          </Link>
          <Link to="/docs/doc-projects/iot-platform-guide" className={styles.projectCard}>
            <span className={styles.projectTag}>操作指南</span>
            <Heading as="h3" className={styles.projectTitle}>小米 IoT 平台接入指南</Heading>
            <p className={styles.projectDesc}>从注册到设备上线的完整接入流程</p>
          </Link>
          <Link to="/docs/doc-projects/api-docs" className={styles.projectCard}>
            <span className={styles.projectTag}>API 参考</span>
            <Heading as="h3" className={styles.projectTitle}>IoT 平台 API 文档</Heading>
            <p className={styles.projectDesc}>函数计算 API 接口文档，结构清晰、示例完整</p>
          </Link>
          <Link to="/docs/doc-projects/doc-score/intro" className={styles.projectCard}>
            <span className={styles.projectTag}>体系设计</span>
            <Heading as="h3" className={styles.projectTitle}>文档质量评分系统</Heading>
            <p className={styles.projectDesc}>AI + CI/CD 驱动的文档质量自动评估方案</p>
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
