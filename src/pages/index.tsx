import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import ThemedImage from '@theme/ThemedImage';
import Translate, {translate} from '@docusaurus/Translate';
import './index.css';


export default function Home(): JSX.Element {
    const {siteConfig} = useDocusaurusContext();
    return (
        <Layout
            title={`${siteConfig.title}`}
            description="Better application framework for LLM era. CMS alternative. Web framework. NodeJS framwork">
            <main className="flex flex-col items-center justify-center sm:py-72 py-32 ">
                <div className="max-w-2xl min-w-xl w-2/3">
                    <ThemedImage
                        alt="Docusaurus themed image"
                        sources={{
                            light: useBaseUrl('/img/logo.svg'),
                            dark: useBaseUrl('/img/logo-white.svg'),
                        }}
                        className="w-full"
                    />
                </div>
                <div className="text-xl font-mono font-bold text-gray-800 mt-10 flex items-center items-stretch dark:text-white">
                    <Translate id="index.solgan">Better application framework for LLM era.</Translate>
                </div>

            </main>
            <div className="lg:flex block items-center betw justify-center ml-auto mr-auto max-w-4xl">
                <div className="font-mono dark:text-white">
                    <h1>
                        <Translate id="index.abstraction.title">
                            Better Abstractions
                        </Translate>
                    </h1>
                    <div className="text-gray-600 dark:text-gray-200">
                        <Translate id="index.abstraction.content1">
                            Moving beyond MVC, Interaqt embraces entities, interactions, and activities for an intuitive business logic alignment.
                            This simplifies database design, permissions, and data management, cutting down 80% of non-essential technicalities for developers.
                        </Translate>
                    </div>
                    <div className="text-gray-600 mt-4 dark:text-gray-200">
                        <Translate id="index.abstraction.content2">
                            Interaqt's principles reflect natural language, enabling immediate use of ChatGPT for business logic description without extra training.
                            Quickly create a fully operational system with Interaqt's streamlined process.
                            Checkout the video or
                        </Translate>
                        <a href="/docs/tutorial/use-with-gpt">
                            <Translate id="index.abstraction.content3">
                                &nbsp;tutorial&nbsp;
                            </Translate>
                        </a>
                        <Translate id="index.abstraction.content4">
                            to see how it works.
                        </Translate>
                    </div>
                </div>

            </div>
            <div className="flex justify-center mt-6 ">
                <div className="max-w-4xl   inset-0 block overflow-hidden pb-0"><video src="/demo-square-compressed.mp4" controls className="w-full mb-0"/></div>
            </div>

            <div className="max-w-4xl ml-auto mr-auto mt-36 dark:text-white">
                <h1>
                    <Translate id="index.reactivity.title">
                        Reactivity In Backend
                    </Translate>
                </h1>
                <div className="lg:flex block justify-center ml-auto mr-auto max-w-4xl">
                    <div className="lg:w-1/2 w-1/2 ml-auto mr-auto shrink-0">
                        <img src={"/img/reactivity.png"} className="w-full" />
                    </div>
                    <div className="font-mono text-gray-600 grow-0 lg:w-1/3 w-full dark:text-gray-200">
                        <Translate id="index.reactivity.content">
                            Interaqt transforms backend development with reactive programming,
                            prioritizing data definition over manipulation.
                            Its approach to reactive data ensures efficient incremental calculations and peak performance in all scenarios.
                        </Translate>

                    </div>

                </div>
            </div>


            <div className="max-w-4xl ml-auto mr-auto mt-36 dark:text-white">
                <h1>
                    <Translate id="index.automation.title">
                        Automatic Architecture Design
                    </Translate>
                </h1>
                <div className="block justify-center ml-auto mr-auto max-w-4xl">
                    <div className="font-mono text-gray-600 w-full mb-4 dark:text-gray-200">
                        <Translate id="index.automation.content">
                            Performance and cost considerations are distinct from business logic in Interaqt's design.
                            It specializes in automated architecture, dynamically adapting to user and data expansion.
                        </Translate>

                    </div>
                    <div className="lg:w-1/2 w-2/3 ml-auto mr-auto shrink-0">
                        <img src={"/img/architecture.png"} className="w-full" />
                    </div>
                </div>
            </div>

            <div className="ml-auto mr-auto max-w-4xl font-mono px-2 mt-36 dark:text-white">
                <h1>
                    <Translate id="index.language.title">
                        Multiple language support
                    </Translate>
                </h1>
                <div className="text-gray-600 dark:text-gray-200">
                    <Translate id="index.language.content">
                        Interaqt's abstraction transcends specific programming languages. The NodeJS iteration of Interaqt is now available for use. Anticipate the launch of its Go, Python, and Java versions in the summer of 2024!
                    </Translate>
                </div>
                <div className="flex items-center justify-center justify-between mt-10">
                    <img src={"/img/lan-node-logo.png"} className="h-16" />
                    <img src={"/img/lan-go-logo.png"} className="h-16" />
                    <img src={"/img/lan-python-logo.png"} className="h-16" />
                    <img src={"/img/lan-java-logo.png"} className="h-16" />
                </div>
            </div>

            <div className="block font-mono ml-auto mr-auto max-w-4xl mt-36">
                <button type="button" onClick={() => location.href="/docs/concepts"} className="cursor-pointer rounded-md bg-black px-4 border-0  py-3 text-lg font-semibold text-white ">Get Started!</button>
            </div>

            <div className="block font-mono ml-auto mr-auto max-w-4xl w-full mt-36 dark:text-white">
                <h1>
                    <Translate id="index.subscribe.title">
                        Support Us
                    </Translate>
                </h1>
                <div className="text-gray-600 dark:text-gray-200">
                    <Translate id="index.subscribe.content">
                        We invite you to subscribe to our release event or star our project on GitHub.
                        Your valuable feedback will help us launch even faster!
                    </Translate>

                </div>

                <div className="lg:flex block items-center justify-center ml-auto mr-auto max-w-4xl mb-32 ">
                    <div className="lg:w-1/2 w-full flex items-center justify-center mt-10">
                        <button type="button" onClick={() => location.href="https://github.com/InteraqtDev/interaqt"}  className="cursor-pointer  rounded-md border-0 bg-black px-4 py-4 text-sm font-semibold text-white ">Github Star!</button>
                    </div>
                </div>
            </div>



        </Layout>
    );
}
