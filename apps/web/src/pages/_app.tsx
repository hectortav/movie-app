import { ReactNode } from 'react'
import '../styles/index.css'
import 'ui/styles.css'

const App = ({ Component, pageProps }: any): ReactNode => {
    return <Component {...pageProps} />
}

export default App
