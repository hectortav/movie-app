require("dotenv").config()
import server from "./server"

const PORT = process.env.PORT || 8080

server.listen(PORT, (e?: Error) => {
    if (e !== undefined) {
        throw e
    }

    console.log(`Server started on port ${PORT} 🚀`)
})
