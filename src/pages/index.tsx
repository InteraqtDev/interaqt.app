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

            <div className="lg:flex block items-center betw justify-center ml-auto mr-auto max-w-4xl">
                <div className="lg:w-1/2 w-2/3 ml-auto mr-auto shrink-0">
                    <img src={"/img/architecture.png"} className="w-full" />
                </div>
                <div className="font-mono ml-6 grow-0">
                    <div>
                        <strong>Interaqt</strong> is a project dedicated to maximizing the speed of application software development.
                    </div>
                    <div>
                        To achieve this goal, Interaqt has developed a <strong>DSL (Domain-Specific Language)</strong> that is both intuitive and sufficiently formalized for describing business logic.
                        It has also pioneered a revolutionary method and set of tools to generate appropriate architecture and code based on the user's DSL, along with considerations for performance and cost, while also facilitating automatic migration during changes.
                    </div>
                    <div>
                        In the current release, users can begin to experience defining their business logic using the DSL.
                        Upon completion of the description, a functional system (comprising a database, web server, and API) is immediately available.
                        If you have access to ChatGPT4, you don't even need to understand DSL right away.
                        By following the <strong>Use-With-ChatGPT</strong> document, you can have a functional system up and running in just <strong>a few minutes</strong>.
                    </div>
                </div>

            </div>

            <div className="flex flex-col items-center justify-center mt-10">
                <div className="text-center mb-16">
                    <button type="button" onClick={() => location.href="/docs/concepts"} className="cursor-pointer rounded-md bg-black px-3 border-0  py-2 text-sm font-semibold text-white ">Check out Concepts</button>
                    <button type="button" onClick={() => location.href="/docs/tutorial/use-with-gpt"}  className="cursor-pointer  rounded-md border-0 bg-black px-3 py-2 text-sm font-semibold text-white ml-8">Use With ChatGPT!</button>
                </div>
            </div>


        </Layout>
    );
}
