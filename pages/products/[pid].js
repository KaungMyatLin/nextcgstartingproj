import fs from 'fs/promises'
import path from 'path'
import { useRouter } from 'next/router'
import { Fragment } from "react";

// lesson from fallback...
// fallback: 'blocking'
// getStaticProps will behave as follows:
// -The paths returned from getStaticPaths will be rendered to HTML at build time by getStaticProps.
// -The paths that have not been generated at build time will not result in a 404 page. Instead, Next.js will SSR (hence why blocking) on the first request and return the generated HTML.
// -When complete, the browser receives the HTML for the generated path. From the user’s perspective, it will transition from "the browser is requesting the page" to "the full page is loaded". There is no flash of loading/fallback state.
// -At the same time, Next.js adds this path to the list of pre-rendered pages (can see in /.next/server/pages/p2, etc when the page is loaded or the references are loaded as "ul"). Subsequent requests to the same path will serve the generated page, like other pages pre-rendered at build time.

// fallback: true is mostly the same as fallback: 'blocking', but may different on 2nd point as follows:
// For clients, Next.js will serve a “fallback” version of the page before Nextjs will SSR the same way.
// For crawlers, the same and no difference.

// further note: “fallback” version is props will be empty, you can detect if the fallback is being rendered, router.isFallback will be true.

function ProductDetailPage(props) {
    const router = useRouter();
    console.log("logging...", props)
    const { loadedProduct } = props;
    // below 2 ifs are example of using “fallback” version examples. Either one is fine.
    if (!loadedProduct) {
        return (<p>SSR is in process, it is now Loading...</p>)
    }
    // if (router.isFallback) {
    //     return <div>fallback version is loading...</div>
    // }
    return <Fragment>
        <h1>{ loadedProduct.title }</h1>
        <p>{ loadedProduct.description }</p>
    </Fragment>
}
export default ProductDetailPage

export async function getStaticProps(context) {
    console.log("getStaticProps")
    const { params } = context;
    const pdtId = params.pid;
    const parsedData = await getData();
    const prdt = parsedData.products.find( pdt => pdt.id === pdtId)

    if (!prdt) {
        return { notfound: true }
    }
    return {
        props: {
            loadedProduct: prdt
        },
    }
}

export async function getStaticPaths() {
    console.log("Running.. getStaticPaths")
    const parsedData = await getData();
    const ids = parsedData.products.map(pdt => pdt.id);
    const pathsWithParams = ids.map( id => ({params: {pid: id}})) // {} is a function body, wrappng it '()' means returning {} object.
    return {
        paths: pathsWithParams,
        // by the time removing hardcoded
        // remove pathsWithParams, uncomment below code, to playaround fallback:true, blocking.
        // [
        //     {params: {pid: "p1"}},
        // ],
        fallback: true,
    }
}

async function getData() {
    const filePath = path.join(process.cwd(), 'data', 'dummy-backend.json');
    const jsonData = await fs.readFile(filePath);
    const parsedData = JSON.parse(jsonData);
    return parsedData;
}