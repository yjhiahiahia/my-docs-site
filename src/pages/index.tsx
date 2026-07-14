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
    title: '质量评估助手',
    description: '设计文档质量评估规则，让 AI 按标准检查文档，并接入 CI 流程输出修改建议。',
    icon: '\u{1F3AF}',
    link: '/blog/doc-score',
  },
  {
    title: '建站与维护',
    description: '记录这个文档站从搭建、内容整理、格式检查到自动发布的完整过程。',
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
            <Heading as="h3" className={styles.projectTitle}>IoT 核心概念</Heading>
            <p className={styles.projectDesc}>接入小米 IoT 平台前需要理解的概念和路径判断</p>
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
          <Link to="/blog/iot-doc-thoughts" className={styles.projectCard}>
            <span className={styles.projectTag}>工作思考</span>
            <Heading as="h3" className={styles.projectTitle}>IoT 文档调研思考</Heading>
            <p className={styles.projectDesc}>从竞品文档里整理出来的改进想法</p>
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
