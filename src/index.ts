import server from './server'

const port = process.env.POST || 4000

server.listen(port, () => {
    console.log('Rest API 4000')
})
