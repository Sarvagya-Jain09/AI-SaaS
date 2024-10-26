import {PrismaClient} from "@prisma/client";

declare global{
    var prisma : PrismaClient | undefined; //eslint-disable-line no-var
}

const prismadb = globalThis.prisma || new PrismaClient();

if(process.env.NODE_ENV!=='production') globalThis.prisma=prismadb;

export default prismadb;

// (async () => {
//   try {
//     console.log(await prismadb.widget.create({ data: { } }));
//   } catch (err) {
//     console.error("error executing query:", err);
//   } finally {
//     prismadb.$disconnect();
//   }
// })();