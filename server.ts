import * as colors from 'https://deno.land/std/fmt/colors.ts'
import { Application } from 'https://deno.land/x/oak/mod.ts'
import router from './routes/index.routes.ts'

const app = new Application()

app.use(router.routes())
app.use(router.allowedMethods())


console.log(colors.magenta('listening...'));
await app.listen({
    port: 3000
})



