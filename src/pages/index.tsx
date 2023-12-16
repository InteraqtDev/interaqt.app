import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
    const {siteConfig} = useDocusaurusContext();
    return (
        <header className={clsx('hero hero--primary', styles.heroBanner)}>
            <div className="container">
                <Heading as="h1" className="hero__title">
                    {siteConfig.title}
                </Heading>
                <p className="hero__subtitle">{siteConfig.tagline}</p>
                <div className={styles.buttons}>
                    <Link
                        className="button button--secondary button--lg"
                        to="/docs/intro">
                        Docusaurus Tutorial - 5min ⏱️
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default function Home(): JSX.Element {
    const {siteConfig} = useDocusaurusContext();
    return (
        <Layout
            title={`Hello from ${siteConfig.title}`}
            description="Description will go into a meta tag in <head />">
            <main className="flex flex-col items-center justify-center sm:py-72 py-32 ">
                <div className="max-w-2xl min-w-xl w-2/3">
                    <img src="/img/logo.svg" className="w-full"/>
                </div>
                <div className="text-xl font-mono font-bold text-gray-800 mt-10">
                    Better application framework for LLM era.
                </div>


            </main>
            <div className="flex justify-center mb-16">
                <div className="max-w-4xl h-128 w-full ring ring-1 ring-gray-200 rounded inset-0 block"></div>
            </div>


        </Layout>
    );
}
