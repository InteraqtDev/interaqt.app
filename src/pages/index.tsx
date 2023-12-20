import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import './index.css';


export default function Home(): JSX.Element {
    const {siteConfig} = useDocusaurusContext();
    return (
        <Layout
            title={`${siteConfig.title}`}
            description="Better application framework for LLM era.">
            <main className="flex flex-col items-center justify-center sm:py-72 py-32 ">
                <div className="max-w-2xl min-w-xl w-2/3">
                    <img src="/img/logo.svg" className="w-full"/>
                </div>
                <div className="text-xl font-mono font-bold text-gray-800 mt-10 flex items-center items-stretch">
                    Better application framework for LLM era.
                </div>

            </main>
            <div className="text-center text-lg font-mono font-bold mb-6">
                Using Interaqt and ChatGPT to create a fully functional system in minutes:
            </div>
            <div className="flex justify-center mb-16">
                <div className="max-w-4xl  ring ring-1 ring-gray-200 rounded inset-0 block">
                    <video src="/demo-square-compressed.mp4" controls className="w-full"/>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center ">
                <div className=" text-lg font-mono  mb-6 max-w-2xl">
                    To start understanding how to use Interaqt, refer to the Concepts documentation, or directly view the Use-With-ChatGPT document for a quick experience on how to create a functional system with ChatGPT in just a few minutes.
                </div>
                <div className="text-center mb-16">
                    <a className="button button--secondary" href="/docs/concepts">Concepts</a>
                    <a className="button button--secondary margin-left--xs" href="/docs/tutorial/use-with-gpt">Use With ChatGPT!</a>
                </div>
            </div>


        </Layout>
    );
}
