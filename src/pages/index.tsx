import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
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
                    <img src="/img/logo.svg" className="w-full"/>
                </div>
                <div className="text-xl font-mono font-bold text-gray-800 mt-10 flex items-center items-stretch">
                    <Translate id="index.solgan">Better application framework for LLM era.</Translate>
                </div>

            </main>
            <div className="text-center text-lg font-mono font-bold mb-6">
                <Translate id="index.demo">Using Interaqt and ChatGPT to create a fully functional system in minutes:</Translate>
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
                        <strong>Interaqt</strong>
                        <Translate id="index.architecture1">
                            &nbsp;is a project dedicated to maximizing the speed of application software development.
                        </Translate>
                    </div>
                    <div>
                        <Translate id="index.architecture2">
                            To achieve this goal, Interaqt has developed a DSL-like data structure that is both intuitive and sufficiently formalized for describing business logic.
                            It has also pioneered a revolutionary method and set of tools to generate appropriate architecture and code based on the user's business logic, along with considerations for performance and cost, while also facilitating automatic migration during changes.
                        </Translate>
                     </div>
                    <div>
                        <Translate id="index.architecture31">
                            In the current release, users can begin to experience defining their business logic using the DSL.
                            Upon completion of the description, a functional system (comprising a database, web server, and API) is immediately available.
                            If you have access to ChatGPT4, you don't even need to understand DSL right away.
                            By following the
                        </Translate>
                        <strong>&nbsp;Use-With-ChatGPT</strong>
                        <Translate id="index.architecture32">
                        document, you can have a functional system up and running in just
                        </Translate>
                        <strong>
                            <Translate id="index.architecture33">
                                &nbsp;a few minutes
                            </Translate>
                        </strong>
                        <Translate id="index.architecture34">
                            .
                        </Translate>
                    </div>
                </div>

            </div>

            <div className="flex flex-col items-center justify-center mt-10 font-mono">
                <div className="text-center mb-16">
                    <button type="button" onClick={() => location.href="/docs/concepts"} className="cursor-pointer rounded-md bg-black px-3 border-0  py-2 text-sm font-semibold text-white ">Get Started</button>
                    <button type="button" onClick={() => location.href="/docs/tutorial/use-with-gpt"}  className="cursor-pointer  rounded-md border-0 bg-black px-3 py-2 text-sm font-semibold text-white ml-8">Use With ChatGPT!</button>
                </div>
            </div>

            <div className="flex items-center justify-center ml-auto mr-auto max-w-4xl font-mono px-2 mt-16">
                <Translate id="index.subscription">
                    Interaqt is still rapidly evolving.
                    Enhanced architectural features, such as automatic cache design,
                    along with support for languages like Java and Go,
                    are set to be released in the summer of 2024. We invite you to subscribe to our release event or star our project on GitHub.
                    Your valuable feedback will help us launch even faster!
                </Translate>

            </div>

            <div className="lg:flex block items-center justify-center ml-auto mr-auto max-w-4xl mb-32 ">
                <div className="lg:w-1/2 w-full flex items-center justify-center">
                    <iframe width="540" height="305" src="https://c69f1b7e.sibforms.com/serve/MUIFAI_b368o6Z3MI530vVoUR64Xbew8fyQjvQy-3rp2GxTCTTkyP3ts2lJGvv77ClHUqgbkEfen1TArIJ6ilAd9CafREHGROziwFLJBQln6C6uqJXIO0mkQuU1KupUajekgosIn3Vtvb4sovd-P67Cc51OKO-QzQGl_qp3v6fR-qrrTH6111m56KTaaDehT4U9gU8dqWifi3bQF" frameBorder="0" scrolling="auto" allowFullScreen style={{display: "block", marginLeft: "auto", marginRight: "auto", maxWidth: "100%"}}></iframe>
                </div>
                <div className="lg:w-1/2 w-full flex items-center justify-center">
                    <button type="button" onClick={() => location.href="https://github.com/InteraqtDev/interaqt"}  className="cursor-pointer  rounded-md border-0 bg-black px-4 py-4 text-sm font-semibold text-white ">Github Star!</button>
                </div>
            </div>


        </Layout>
    );
}
