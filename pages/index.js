import fs from 'fs/promises'
import path from 'path'
import Link from 'next/link'
const HomePage = (props) => {
  const { products } = props
  return (
    <ul>
      {products.map( pdt => (
        <li key={pdt.id}> <Link href={`/products/${pdt.id}`}>{ pdt.title }</Link>
        </li>
      ))}
    </ul>
  )
}
export default HomePage
export async function getStaticProps() {
  console.log("(Re-)Generating... ")
  const filePath = path.join(process.cwd(), 'data', 'dummy-backend.json');
  const jsonData = await fs.readFile(filePath);
  const parsedData = JSON.parse(jsonData);

  if (!parsedData) {
    return {
      redirect: {
        destination: 'no/data'
      }
    }
  }
  if (parsedData.products.length === 0) {
    return { notFound: true }
  }
  return {
    props: {
      products: parsedData.products
    },
    revalidate: 3600,
  }
}
