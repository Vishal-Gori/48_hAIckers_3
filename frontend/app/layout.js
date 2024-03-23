import '@/styles/globals.css';
import Nav from '@/components/Nav';
import Provider from '@/components/Provider';
import SitemapLinksFooterSection from '@/components/footer'

export const metadata = {
    title: "HR connect",
    description: ""
}

const RootLayout = ({ children }) => {
  return (
    <html lang='en'>
        <body>
            <Provider>
                <div className="main">
                    <div className='gradient'/>
                </div>

                <main className="app">
                    <Nav/>
                    {children}
                    <SitemapLinksFooterSection/>
                </main>
            </Provider>
        </body>
    </html>
  )
}

export default RootLayout