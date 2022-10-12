import { ReactNode } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import "../styles/index.css"
import "ui/styles.css"

const queryClient = new QueryClient()

const App = ({ Component, pageProps }: any): ReactNode => {
    return (
        <QueryClientProvider client={queryClient}>
            <Component {...pageProps} />
        </QueryClientProvider>
    )
}

export default App
